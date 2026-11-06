/**
 * Formation inscription maintenance — Well-Ring lodge court (PR #213).
 * Run: node scripts/test-formation-inscription-upkeep.js
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
            ageMonths: 12,
            lifespanMonths: 100000,
            gameOver: false,
            inCombat: false,
            stones: 100,
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
        addLog: (m) => ctx.G._logs.push(String(m)),
        fullRender: () => {},
        openWellRingPopup: () => {},
        actionBlocked: () => false,
        registerWorldTick: (id, fn, priority) => { ticks.push({ id, fn, priority: priority || 0 }); },
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
            // Mirror real advance: world formation tick during the interval.
            if (typeof ctx.tickWorldFormationInstallations === 'function') {
                ctx.tickWorldFormationInstallations(m);
            }
            ctx.G.ageMonths += m;
            return true;
        },
        isSectFounded: () => false,
        ensureSectState: () => {},
        getResidenceLevel: () => 0
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

    vm.runInContext(`
const WELL_RING_LODGE_ID = 'well_ring_lodge';
const WELL_RING_HOME_LOCATION_ID = 'redwell';
function ensureWellRingShell() {
    if (!G.wellRing) G.wellRing = { member: false, merit: 0, rivalMerit: 4 };
    return G.wellRing;
}
function ensureWellRingLodgeOrg() {
    const wr = ensureWellRingShell();
    if (!wr.lodge) {
        wr.lodge = {
            id: WELL_RING_LODGE_ID, name: 'Well-Ring Lodge',
            headquartersLocationId: WELL_RING_HOME_LOCATION_ID,
            memberUids: [], roles: {}, formationInstallIds: []
        };
    }
    if (!Array.isArray(wr.lodge.formationInstallIds)) wr.lodge.formationInstallIds = [];
    if (typeof ensureWellRingLodgeWorldFormation === 'function') ensureWellRingLodgeWorldFormation();
    return wr.lodge;
}
`, ctx, { filename: 'lodge-stub' });

    vm.runInContext(read('formations.js'), ctx, { filename: 'formations.js' });
    vm.runInContext(read('world-formations.js'), ctx, { filename: 'world-formations.js' });

    ctx.ensureWellRingLodgeOrg();
    ctx.ensureWorldFormationsState();

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
    return ctx;
}

const ID = 'wr_courtyard_spirit_gathering';

function testEligibleMemberCanMaintain() {
    console.log('\n-- eligible member maintains --');
    const ctx = boot({ member: true, knowPattern: true, integrity: 50 });
    const before = ctx.getWellRingLodgeFormationInstallation().integrity;
    const herbs = ctx.G.materials.spirit_herb;
    const stones = ctx.G.stones;
    const age = ctx.G.ageMonths;
    const ref = ctx.getWellRingLodgeFormationInstallation();
    const res = ctx.maintainWorldFormationInscription(ID);
    assert(res.success, 'member with knowledge can maintain');
    assert(ctx.G._advanceCalls === 1, 'time advances exactly once');
    assert(ctx.G.ageMonths === age + 1, 'one month advanced');
    assert(ctx.G.materials.spirit_herb === herbs - 1, 'consumes 1 spirit herb');
    assert(ctx.G.stones === stones - 4, 'consumes 4 stones');
    // During the month integrity decays 1, then +35 restore.
    assert(ctx.getWellRingLodgeFormationInstallation() === ref, 'same installation identity');
    assert(ref.integrity === Math.min(100, (before - 1) + 35), `bounded restore (${ref.integrity})`);
    assert(ref.integrity <= 100, 'never exceeds max');
}

function testMemberWithoutKnowledgeBlocked() {
    console.log('\n-- member without knowledge --');
    const ctx = boot({ member: true, knowPattern: false, integrity: 50 });
    const herbs = ctx.G.materials.spirit_herb;
    const res = ctx.maintainWorldFormationInscription(ID);
    assert(!res.success, 'blocked without pattern familiarity');
    assert(/know|pattern|familiar/i.test(res.message), 'mentions knowledge');
    assert(ctx.G.materials.spirit_herb === herbs, 'no materials spent');
    assert(ctx.G._advanceCalls === 0, 'no time advance');
}

function testOutsiderWithKnowledgeBlocked() {
    console.log('\n-- outsider with knowledge --');
    const ctx = boot({ member: false, knowPattern: true, integrity: 50 });
    const res = ctx.maintainWorldFormationInscription(ID);
    assert(!res.success, 'outsider blocked');
    assert(/member|Well-Ring|authority|permitted/i.test(res.message), 'permission message');
    assert(ctx.G._advanceCalls === 0, 'no time advance for outsider');
}

function testAbsentPlayerBlocked() {
    console.log('\n-- absent player --');
    const ctx = boot({ member: true, knowPattern: true, integrity: 50, location: 'dewcatch_scrub' });
    const res = ctx.maintainWorldFormationInscription(ID);
    assert(!res.success, 'absent blocked');
    assert(/Travel|site/i.test(res.message), 'mentions presence');
}

function testInsufficientMaterialsNoPartialCost() {
    console.log('\n-- insufficient materials --');
    const ctx = boot({ member: true, knowPattern: true, integrity: 50 });
    ctx.G.materials.spirit_herb = 0;
    const stones = ctx.G.stones;
    const res = ctx.maintainWorldFormationInscription(ID);
    assert(!res.success, 'blocked when missing herbs');
    assert(ctx.G.stones === stones, 'stones not taken on failed maintain');
    assert(ctx.G._advanceCalls === 0, 'no time on failed maintain');
}

function testInsufficientStonesNoPartialCost() {
    console.log('\n-- insufficient stones --');
    const ctx = boot({ member: true, knowPattern: true, integrity: 50 });
    ctx.G.stones = 2;
    const herbs = ctx.G.materials.spirit_herb;
    const res = ctx.maintainWorldFormationInscription(ID);
    assert(!res.success, 'blocked when missing stones');
    assert(ctx.G.materials.spirit_herb === herbs, 'herbs not taken');
}

function testAtMaxNoFreeRepeat() {
    console.log('\n-- at max cannot free-maintain --');
    const ctx = boot({ member: true, knowPattern: true, integrity: 100 });
    const herbs = ctx.G.materials.spirit_herb;
    const res = ctx.maintainWorldFormationInscription(ID);
    assert(!res.success, 'blocked at max integrity');
    assert(ctx.G.materials.spirit_herb === herbs, 'no free material spend');
}

function testScatteredNeedsStructuralRepair() {
    console.log('\n-- scattered / decayed blocked --');
    const scattered = boot({ member: true, knowPattern: true, integrity: 0 });
    assert(!scattered.maintainWorldFormationInscription(ID).success, 'scattered blocked');
    assert(/Structural repair|scattered/i.test(
        scattered.getWorldFormationInscriptionMaintainBlockReason(ID)
    ), 'scattered → structural repair');

    const decayed = boot({ member: true, knowPattern: true, integrity: 20 });
    const block = decayed.getWorldFormationInscriptionMaintainBlockReason(ID);
    assert(!!block, 'decayed (< fading band) blocked');
    assert(/Structural repair|deteriorat/i.test(block), 'decayed → structural repair');
    assert(!decayed.maintainWorldFormationInscription(ID).success, 'decayed maintain fails');
}

function testInspectGrounded() {
    console.log('\n-- inspect grounded --');
    const known = boot({ member: true, knowPattern: true, integrity: 55 });
    const info = known.inspectWorldFormationInstallation(ID);
    assert(info.ok && info.recognized, 'recognises pattern when deciphered');
    assert(info.name === 'Spirit Gathering Formation', 'names formation');
    assert(info.condition === 'worn' || info.condition === 'healthy', 'condition label');
    assert(!JSON.stringify(info).includes('"integrity"'), 'inspect payload has no integrity field');
    assert(!/\b\d{2,}\b/.test(info.perception || ''), 'perception avoids raw counters');

    const unknown = boot({ member: true, knowPattern: false, integrity: 55 });
    const blind = unknown.inspectWorldFormationInstallation(ID);
    assert(blind.ok && !blind.recognized, 'unfamiliar: needs attention without pattern name');
    assert(/attention|opaque|unclear/i.test(blind.knowledgeNote), 'opaque-lines note');
    assert(!blind.canMaintain, 'cannot maintain without knowledge');
}

function testSaveLoadPreservesMaintain() {
    console.log('\n-- save/load after maintain --');
    const ctx = boot({ member: true, knowPattern: true, integrity: 50 });
    assert(ctx.maintainWorldFormationInscription(ID).success, 'maintain succeeds');
    const after = ctx.getWellRingLodgeFormationInstallation().integrity;
    const snap = JSON.parse(JSON.stringify(ctx.G.worldFormations));

    const again = boot({ member: true, knowPattern: true });
    again.G.worldFormations = snap;
    again.ensureWorldFormationsState();
    assert(again.getWellRingLodgeFormationInstallation().integrity === after, 'integrity persists');
    assert(Object.keys(again.G.worldFormations.byId).length === 1, 'no dup install');
}

function testDeteriorationContinuesAfter() {
    console.log('\n-- deterioration after maintain --');
    const ctx = boot({ member: true, knowPattern: true, integrity: 50 });
    assert(ctx.maintainWorldFormationInscription(ID).success, 'maintain');
    const mid = ctx.getWellRingLodgeFormationInstallation().integrity;
    ctx.tickWorldFormationInstallations(3);
    assert(ctx.getWellRingLodgeFormationInstallation().integrity === mid - 3, 'decay resumes');
}

function testBenefitsReflectState() {
    console.log('\n-- benefits after maintain --');
    const ctx = boot({ member: true, knowPattern: true, integrity: 40, active: true });
    // 40 is fading band → partial mult
    const beforeMult = ctx.getWellRingLodgeFormationCultivateMult();
    assert(beforeMult > 1 && beforeMult < 1.08, `worn mult partial (${beforeMult})`);
    assert(ctx.maintainWorldFormationInscription(ID).success, 'maintain toward sharp');
    const afterMult = ctx.getWellRingLodgeFormationCultivateMult();
    assert(afterMult >= beforeMult, 'benefit improves or holds after maintain');
    // Force scattered
    const inst = ctx.getWellRingLodgeFormationInstallation();
    inst.integrity = 0;
    inst.scattered = true;
    inst.active = false;
    assert(ctx.getWellRingLodgeFormationCultivateMult() === 1, 'scattered → no benefit');
}

function testPermissionCentralised() {
    console.log('\n-- permission helper --');
    const member = boot({ member: true, knowPattern: true });
    const p = member.getWorldFormationServicePermission(ID, 'inscription_maintain');
    assert(p.ok && p.permissionKind === 'well_ring_member', 'member permission kind');
    const out = boot({ member: false, knowPattern: true });
    assert(!out.getWorldFormationServicePermission(ID, 'inscription_maintain').ok, 'outsider denied');
}

testEligibleMemberCanMaintain();
testMemberWithoutKnowledgeBlocked();
testOutsiderWithKnowledgeBlocked();
testAbsentPlayerBlocked();
testInsufficientMaterialsNoPartialCost();
testInsufficientStonesNoPartialCost();
testAtMaxNoFreeRepeat();
testScatteredNeedsStructuralRepair();
testInspectGrounded();
testSaveLoadPreservesMaintain();
testDeteriorationContinuesAfter();
testBenefitsReflectState();
testPermissionCentralised();

console.log(`\n${failed === 0 ? 'All inscription-upkeep tests passed.' : failed + ' failure(s).'}`);
process.exit(failed === 0 ? 0 : 1);
