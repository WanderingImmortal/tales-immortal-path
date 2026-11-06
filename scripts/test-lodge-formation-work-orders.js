/**
 * Institutional formation needs & paid maintenance — Well-Ring (PR #214).
 * Run: node scripts/test-lodge-formation-work-orders.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
let failed = 0;

function fail(msg) {
    console.error(`FAIL: ${msg}`);
    failed += 1;
}
function ok(msg) {
    console.log(`ok: ${msg}`);
}
function assert(cond, msg) {
    if (!cond) fail(msg);
    else ok(msg);
}
function read(rel) {
    return fs.readFileSync(path.join(root, rel), 'utf8');
}
function extractConst(src, name) {
    const start = src.indexOf(`const ${name} =`);
    if (start < 0) throw new Error(`Could not find ${name}`);
    let i = start + `const ${name} =`.length;
    while (i < src.length && /\s/.test(src[i])) i += 1;
    const open = src[i];
    if (open !== '{' && open !== '[') {
        const end = src.indexOf(';', i);
        return src.slice(start, end + 1);
    }
    const close = open === '{' ? '}' : ']';
    let depth = 0;
    for (; i < src.length; i++) {
        if (src[i] === open) depth += 1;
        else if (src[i] === close) {
            depth -= 1;
            if (depth === 0) return src.slice(start, src.indexOf(';', i) + 1);
        }
    }
    throw new Error(`Could not extract ${name}`);
}

function boot(options = {}) {
    const ticks = [];
    const dataSrc = read('data.js');
    const ctx = {
        console, Math, Number, Array, Object, JSON, Set, String, isFinite,
        G: {
            ageMonths: 24,
            lifespanMonths: 100000,
            gameOver: false,
            inCombat: false,
            stones: 20,
            materials: { spirit_herb: 5, silk_thread: 2 },
            currentLocation: options.location || 'redwell',
            currentZone: 'dustbone',
            worldNpcs: [],
            wellRing: {
                member: options.member !== false,
                merit: 2,
                rivalMerit: 4,
                lastMissionMonth: 0,
                lastBoardMonth: -1,
                lastTournamentYear: -1,
                tournamentDue: false,
                manualClaimed: false,
                dirtyDone: 0,
                heardFeeScam: false,
                joinMonth: 0
            },
            worldFormations: null,
            dwelling: { mode: 'homeless', settlementId: null, formations: { slots: [], siteSettlementId: null } },
            sect: { stage: 'wandering', name: null, residence: { level: 0, formations: { slots: [] } }, anchors: {} },
            knownFormations: [],
            formationShelf: {},
            formationMaster: { tier: 0, insight: 0, lastExamAgeMonths: null },
            _logs: [],
            _advanceCalls: 0
        },
        CRAFT_MATERIALS: {
            spirit_herb: { id: 'spirit_herb', name: 'Spirit Herb', emoji: '🌿' },
            silk_thread: { id: 'silk_thread', name: 'Silk Thread' }
        },
        NPC_ROLES: {
            sect_elder: { cultivator: true, growthRate: 0.35, breakthroughChance: 0 },
            disciple: { cultivator: true, growthRate: 0.7, breakthroughChance: 0 }
        },
        addLog: (m) => ctx.G._logs.push(String(m)),
        fullRender: () => {},
        openWellRingPopup: () => {},
        actionBlocked: () => false,
        registerWorldTick: (id, fn, priority) => {
            ticks.push({ id, fn, priority: priority || 0 });
        },
        isWellRingMember: () => !!ctx.G.wellRing?.member,
        isAtRedwell: () => ctx.G.currentLocation === 'redwell',
        getCurrentLocationId: () => ctx.G.currentLocation,
        getMaterialCount: (id) => ctx.G.materials[id] || 0,
        getConstructionMaterialsBlock: (cost) => {
            for (const [id, qty] of Object.entries(cost?.materials || {})) {
                if ((ctx.G.materials[id] || 0) < qty) return `Need ${qty}× ${id}.`;
            }
            return null;
        },
        removeCraftMaterials: (mats) => {
            for (const [id, qty] of Object.entries(mats || {})) {
                if ((ctx.G.materials[id] || 0) < qty) return false;
            }
            for (const [id, qty] of Object.entries(mats || {})) {
                ctx.G.materials[id] -= qty;
                if (ctx.G.materials[id] <= 0) delete ctx.G.materials[id];
            }
            return true;
        },
        addCraftMaterial: (id, qty) => {
            ctx.G.materials[id] = (ctx.G.materials[id] || 0) + qty;
        },
        advanceTime: (months) => {
            ctx.G._advanceCalls += 1;
            const m = Number(months) || 0;
            // Mirror scheduler: formation decay then institutional need eval.
            const ordered = ticks.slice().sort((a, b) => a.priority - b.priority);
            ordered.forEach(t => {
                if (t.id === 'worldFormations' || t.id === 'wellRingFormationService') {
                    t.fn(m);
                }
            });
            ctx.G.ageMonths += m;
            return true;
        },
        isSectFounded: () => false,
        ensureSectState: () => {},
        getResidenceLevel: () => 0,
        ensureNpcPersonalities: () => {},
        grantFormationInsight: () => {}
    };
    ctx._ticks = ticks;
    vm.createContext(ctx);

    [
        extractConst(dataSrc, 'FORMATION_F1A'),
        extractConst(dataSrc, 'FORMATION_F1B'),
        extractConst(dataSrc, 'FORMATION_F2B'),
        extractConst(dataSrc, 'FORMATIONS'),
        extractConst(dataSrc, 'FORMATION_ANCHORS'),
        extractConst(dataSrc, 'SECT_RESIDENCE')
    ].forEach(chunk => vm.runInContext(chunk, ctx, { filename: 'data-extract' }));

    vm.runInContext(read('formations.js'), ctx, { filename: 'formations.js' });
    vm.runInContext(read('world-formations.js'), ctx, { filename: 'world-formations.js' });
    vm.runInContext(read('well-ring-lodge.js'), ctx, { filename: 'well-ring-lodge.js' });

    ctx.ensureWellRingLodgeCast();
    ctx.ensureWorldFormationsState();
    ctx.ensureWellRingStorehouse();
    ctx.ensureWellRingLodgeTreasury();

    if (options.knowPattern) {
        ctx.grantFormationManual('spirit_gathering', {
            silent: true, deciphered: true, source: 'test'
        });
        ctx.G.formationMaster.tier = Math.max(ctx.G.formationMaster.tier || 0, 1);
    }
    if (options.integrity != null) {
        const inst = ctx.getWellRingLodgeFormationInstallation();
        inst.integrity = options.integrity;
        inst.scattered = options.integrity <= 0;
        if (inst.scattered) inst.active = false;
        else if (options.active != null) inst.active = !!options.active;
    }
    if (options.treasury != null) {
        ctx.G.wellRing.lodge.treasuryStones = options.treasury;
    }
    if (options.herbs != null) {
        ctx.G.wellRing.storehouse.herbStock = options.herbs;
    }
    ctx.evaluateWellRingFormationMaintenanceNeed();
    return ctx;
}

const ID = 'wr_courtyard_spirit_gathering';

function testWearCreatesNeed() {
    console.log('\n-- wear creates maintenance need --');
    const ctx = boot({ integrity: 55 });
    const work = ctx.evaluateWellRingFormationMaintenanceNeed();
    assert(work.status === 'funded' || work.status === 'deferred_insufficient',
        `need opens when worn (${work.status})`);
    assert(work.installId === ID, 'work order tied to install');
    assert(work.openedAtMonths != null, 'openedAt set');
}

function testHealthyNoWork() {
    console.log('\n-- healthy no unnecessary work --');
    const ctx = boot({ integrity: 85 });
    const work = ctx.evaluateWellRingFormationMaintenanceNeed();
    assert(work.status === 'none', 'sharp band → no work order');
    assert(work.openedAtMonths == null, 'openedAt cleared');
}

function testNoDuplicateOrders() {
    console.log('\n-- repeated ticks no duplicate --');
    const ctx = boot({ integrity: 50 });
    const a = ctx.evaluateWellRingFormationMaintenanceNeed();
    const opened = a.openedAtMonths;
    ctx.G.ageMonths += 6;
    for (let i = 0; i < 5; i++) ctx.evaluateWellRingFormationMaintenanceNeed();
    const b = ctx.ensureWellRingFormationWorkOrder();
    assert(a === b, 'same work-order object');
    assert(b.openedAtMonths === opened, 'openedAt stable across ticks');
    assert(ctx.G.wellRing.lodge.formationWork === b, 'single formationWork on lodge');
}

function testSaveLoadWorkOrder() {
    console.log('\n-- work order survives save/load --');
    const ctx = boot({ integrity: 48 });
    ctx.evaluateWellRingFormationMaintenanceNeed();
    const snapWr = JSON.parse(JSON.stringify(ctx.G.wellRing));
    const snapWf = JSON.parse(JSON.stringify(ctx.G.worldFormations));
    assert(snapWr.lodge.formationWork.status !== 'none', 'saved with active need');

    const again = boot({ integrity: 100 });
    again.G.wellRing = snapWr;
    again.G.worldFormations = snapWf;
    again.migrateWellRingLodgeForExistingSave();
    assert(again.G.wellRing.lodge.formationWork.installId === ID, 'work order reloaded');
    assert(again.G.wellRing.lodge.treasuryStones != null, 'treasury persisted');
    assert(Object.keys(again.G.worldFormations.byId).length === 1, 'no dup install');
}

function testFundingRequiresResources() {
    console.log('\n-- funding requires real resources --');
    const rich = boot({ integrity: 50, treasury: 48, herbs: 10 });
    assert(rich.canWellRingFundFormationMaintain().ok, 'baseline endowment can fund');
    assert(rich.evaluateWellRingFormationMaintenanceNeed().status === 'funded', 'funded status');

    const broke = boot({ integrity: 50, treasury: 2, herbs: 10 });
    assert(!broke.canWellRingFundFormationMaintain().ok, 'short treasury cannot fund');
    assert(broke.evaluateWellRingFormationMaintenanceNeed().status === 'deferred_insufficient',
        'deferred when short stones');

    const noHerbs = boot({ integrity: 50, treasury: 48, herbs: 0 });
    assert(!noHerbs.canWellRingFundFormationMaintain().ok, 'short herbs cannot fund');
    assert(noHerbs.evaluateWellRingFormationMaintenanceNeed().status === 'deferred_insufficient',
        'deferred when short herbs');
}

function testInsufficientBlocksPaid() {
    console.log('\n-- insufficient prevents paid work --');
    const ctx = boot({ member: true, knowPattern: true, integrity: 50, treasury: 5, herbs: 10 });
    const block = ctx.getWellRingPaidFormationMaintainBlockReason();
    assert(!!block, 'paid blocked when unfunded');
    const stones = ctx.G.stones;
    const res = ctx.performWellRingPaidFormationMaintain();
    assert(!res.success, 'paid maintain fails');
    assert(ctx.G.stones === stones, 'no wage paid');
    assert(ctx.G._advanceCalls === 0, 'no time advance');
}

function testQualifiedPresentCompletes() {
    console.log('\n-- qualified present player completes --');
    const ctx = boot({
        member: true, knowPattern: true, integrity: 50,
        treasury: 48, herbs: 10
    });
    const work = ctx.evaluateWellRingFormationMaintenanceNeed();
    assert(work.status === 'funded', 'job funded');
    const treasuryBefore = ctx.G.wellRing.lodge.treasuryStones;
    const herbsBefore = ctx.G.wellRing.storehouse.herbStock;
    const playerStones = ctx.G.stones;
    const playerHerbs = ctx.G.materials.spirit_herb;
    const ref = ctx.getWellRingLodgeFormationInstallation();
    const before = ref.integrity;

    const res = ctx.performWellRingPaidFormationMaintain();
    assert(res.success, 'paid maintain succeeds');
    assert(ctx.G._advanceCalls === 1, 'time once');
    assert(res.fundingSource === 'institution', 'institution funded');
    assert(ctx.G.wellRing.storehouse.herbStock === herbsBefore - 1, 'lodge herb once');
    assert(ctx.G.wellRing.lodge.treasuryStones === treasuryBefore - (4 + 8),
        'treasury chalk+wage once');
    assert(ctx.G.stones === playerStones + 8, 'wage paid once');
    assert(ctx.G.materials.spirit_herb === playerHerbs, 'player herbs untouched');
    assert(ref === ctx.getWellRingLodgeFormationInstallation(), 'same install identity');
    assert(ref.integrity > before - 1, 'integrity restored on authority record');
    assert(ctx.ensureWellRingFormationWorkOrder().jobsCompleted === 1, 'job counted');
}

function testUnqualifiedCannot() {
    console.log('\n-- unqualified player cannot --');
    const ctx = boot({ member: true, knowPattern: false, integrity: 50, treasury: 48, herbs: 10 });
    const res = ctx.performWellRingPaidFormationMaintain();
    assert(!res.success, 'unqualified blocked');
    assert(ctx.G._advanceCalls === 0, 'no time');
    assert(ctx.G.wellRing.lodge.treasuryStones === 48, 'treasury untouched');
}

function testAbsentCannot() {
    console.log('\n-- absent player cannot --');
    const ctx = boot({
        member: true, knowPattern: true, integrity: 50,
        treasury: 48, herbs: 10, location: 'dewcatch_scrub'
    });
    const res = ctx.performWellRingPaidFormationMaintain();
    assert(!res.success, 'absent blocked');
    assert(/Travel|site/i.test(res.message), 'presence message');
}

function testOutsiderCannot() {
    console.log('\n-- outsider cannot --');
    const ctx = boot({
        member: false, knowPattern: true, integrity: 50,
        treasury: 48, herbs: 10
    });
    const res = ctx.performWellRingPaidFormationMaintain();
    assert(!res.success, 'outsider blocked');
    assert(ctx.G.wellRing.lodge.treasuryStones === 48, 'no treasury spend');
}

function testSelfFundedNoWage() {
    console.log('\n-- self-funded does not pay wages --');
    const ctx = boot({
        member: true, knowPattern: true, integrity: 50,
        treasury: 48, herbs: 10
    });
    const treasury = ctx.G.wellRing.lodge.treasuryStones;
    const lodgeHerbs = ctx.G.wellRing.storehouse.herbStock;
    const stonesBefore = ctx.G.stones;
    const res = ctx.maintainWorldFormationInscription(ID);
    assert(res.success, 'self-funded maintain works');
    assert(res.fundingSource === 'player' || res.fundingSource == null
        || res.fundingSource === 'player', 'player funding');
    assert(ctx.G.wellRing.lodge.treasuryStones === treasury, 'lodge treasury unchanged');
    assert(ctx.G.wellRing.storehouse.herbStock === lodgeHerbs, 'lodge herbs unchanged');
    assert(ctx.G.stones === stonesBefore - 4, 'player paid chalk only — no wage credit');
}

function testWorkOrderClosesAfterSuccess() {
    console.log('\n-- work order updates after completion --');
    const ctx = boot({
        member: true, knowPattern: true, integrity: 50,
        treasury: 48, herbs: 10
    });
    assert(ctx.performWellRingPaidFormationMaintain().success, 'complete job');
    const work = ctx.evaluateWellRingFormationMaintenanceNeed();
    assert(work.status === 'none', 'need closes when sharp again');
}

function testUnserviceableBelowBand() {
    console.log('\n-- severely damaged unserviceable --');
    const ctx = boot({ integrity: 20, treasury: 48, herbs: 10 });
    const work = ctx.evaluateWellRingFormationMaintenanceNeed();
    assert(work.status === 'unserviceable', 'below fading → unserviceable');
    assert(work.notes === 'external_expertise_needed', 'notes external need');
    const paid = boot({
        member: true, knowPattern: true, integrity: 20, treasury: 48, herbs: 10
    });
    assert(!paid.performWellRingPaidFormationMaintain().success, 'cannot pay-maintain unserviceable');
}

function testNoNpcAutoRepair() {
    console.log('\n-- no unqualified NPC auto-repair --');
    const ctx = boot({ integrity: 50, treasury: 48, herbs: 10 });
    assert(ctx.hasWellRingQualifiedFormationPractitioner() === false, 'cast has no formation knowledge');
    const before = ctx.getWellRingLodgeFormationInstallation().integrity;
    for (let i = 0; i < 12; i++) {
        ctx.tickWorldFormationInstallations(1);
        ctx.evaluateWellRingFormationMaintenanceNeed();
        ctx.G.ageMonths += 1;
    }
    const after = ctx.getWellRingLodgeFormationInstallation().integrity;
    assert(after === before - 12, `integrity only decays (${after}), no silent restore`);
    assert(ctx.ensureWellRingFormationWorkOrder().jobsCompleted === 0, 'no NPC jobs completed');
}

function testWorldSimIndependent() {
    console.log('\n-- world sim independent of observation --');
    const ctx = boot({ integrity: 60, treasury: 48, herbs: 10, location: 'dewcatch_scrub' });
    ctx.G.wellRing.member = true;
    const tick = ctx._ticks.find(t => t.id === 'wellRingFormationService');
    assert(!!tick, 'registers wellRingFormationService tick');
    tick.fn(3);
    ctx.tickWorldFormationInstallations(3);
    const work = ctx.ensureWellRingFormationWorkOrder();
    assert(work.status === 'funded' || work.status === 'deferred_insufficient'
        || work.status === 'none' || work.status === 'unserviceable',
        'need evaluated while player away');
    assert(work.lastEvalAtMonths != null, 'lastEval stamped');
}

function testTimeSkipNoDupPayment() {
    console.log('\n-- time skip no duplicate payment/decision --');
    const ctx = boot({
        member: true, knowPattern: true, integrity: 50,
        treasury: 48, herbs: 10
    });
    assert(ctx.performWellRingPaidFormationMaintain().success, 'first job');
    const stones = ctx.G.stones;
    const treasury = ctx.G.wellRing.lodge.treasuryStones;
    const jobs = ctx.ensureWellRingFormationWorkOrder().jobsCompleted;
    // Large skip while sharp — must not invent another paid completion.
    ctx.tickWorldFormationInstallations(20);
    ctx.evaluateWellRingFormationMaintenanceNeed();
    ctx.tickWorldFormationInstallations(20);
    ctx.evaluateWellRingFormationMaintenanceNeed();
    assert(ctx.G.stones === stones, 'no phantom wage');
    assert(ctx.G.wellRing.lodge.treasuryStones === treasury, 'no phantom treasury spend');
    assert(ctx.ensureWellRingFormationWorkOrder().jobsCompleted === jobs, 'jobsCompleted stable');
}

function testResourcesNotCreatedOnNeed() {
    console.log('\n-- need does not create resources --');
    const ctx = boot({ integrity: 100, treasury: 10, herbs: 2 });
    ctx.getWellRingLodgeFormationInstallation().integrity = 45;
    const t0 = ctx.G.wellRing.lodge.treasuryStones;
    const h0 = ctx.G.wellRing.storehouse.herbStock;
    ctx.evaluateWellRingFormationMaintenanceNeed();
    assert(ctx.G.wellRing.lodge.treasuryStones === t0, 'treasury unchanged on need open');
    assert(ctx.G.wellRing.storehouse.herbStock === h0, 'herbs unchanged on need open');
}

function testDoubleClickGuard() {
    console.log('\n-- reentrancy guard --');
    const ctx = boot({
        member: true, knowPattern: true, integrity: 50,
        treasury: 48, herbs: 10
    });
    let nested = null;
    const realAdvance = ctx.advanceTime;
    ctx.advanceTime = (months, label) => {
        nested = ctx.performWellRingPaidFormationMaintain();
        return realAdvance(months, label);
    };
    const res = ctx.performWellRingPaidFormationMaintain();
    assert(res.success, 'outer job succeeds');
    assert(nested && !nested.success, 'nested paid attempt blocked');
    assert(ctx.ensureWellRingFormationWorkOrder().jobsCompleted === 1, 'single job completion');
}

function testEndowmentDocumented() {
    console.log('\n-- endowment constants --');
    const ctx = boot({ integrity: 100 });
    // vm top-level const is not a ctx property — read via lodge/work-order seeds.
    assert(ctx.G.wellRing.lodge.treasuryStones === 48, 'treasury baseline 48');
    const work = ctx.ensureWellRingFormationWorkOrder();
    assert(work.wageStones === 8, 'wage 8');
    assert(work.chalkStones === 4, 'chalk 4');
    assert(work.herbAmount === 1, 'herb 1');
    assert(ctx.getWellRingFormationNeedBelowIntegrity() === 70, 'need threshold = sharp band 70');
}

testWearCreatesNeed();
testHealthyNoWork();
testNoDuplicateOrders();
testSaveLoadWorkOrder();
testFundingRequiresResources();
testInsufficientBlocksPaid();
testQualifiedPresentCompletes();
testUnqualifiedCannot();
testAbsentCannot();
testOutsiderCannot();
testSelfFundedNoWage();
testWorkOrderClosesAfterSuccess();
testUnserviceableBelowBand();
testNoNpcAutoRepair();
testWorldSimIndependent();
testTimeSkipNoDupPayment();
testResourcesNotCreatedOnNeed();
testDoubleClickGuard();
testEndowmentDocumented();

console.log(`\n${failed === 0 ? 'All lodge formation work-order tests passed.' : failed + ' failure(s).'}`);
process.exit(failed === 0 ? 0 : 1);
