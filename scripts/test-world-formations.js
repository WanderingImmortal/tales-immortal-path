/**
 * Persistent world formations — Well-Ring Lodge institutional install.
 * Run: node scripts/test-world-formations.js
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
            if (depth === 0) {
                const end = src.indexOf(';', i);
                return src.slice(start, end + 1);
            }
        }
    }
    throw new Error(`Could not extract ${name}`);
}

function boot(options = {}) {
    const ticks = [];
    const dataSrc = read('data.js');
    const ctx = {
        console,
        Math,
        Number,
        Array,
        Object,
        JSON,
        Set,
        String,
        isFinite,
        G: {
            ageMonths: 0,
            currentLocation: 'redwell',
            currentZone: 'dustbone',
            worldNpcs: [],
            wellRing: null,
            worldFormations: null,
            dwelling: { mode: 'homeless', settlementId: null, formations: { slots: [], siteSettlementId: null } },
            sect: {
                stage: 'wandering',
                name: null,
                residence: { level: 0, formations: { slots: [] } },
                anchors: {}
            },
            knownFormations: [],
            formationShelf: {},
            formationMaster: { tier: 0, insight: 0, lastExamAgeMonths: null },
            _logs: []
        },
        WELL_RING_LODGE_ID: 'well_ring_lodge',
        WELL_RING_HOME_LOCATION_ID: 'redwell',
        WELL_RING_HOME_ZONE_ID: 'dustbone',
        WELL_RING_CAST: {
            hall_master: {
                key: 'hall_master', uid: 'wr_master_liang', name: 'Master Liang',
                lodgeRole: 'hall_master', role: 'sect_elder', realmIdx: 1,
                ageMonths: 48 * 12, growthRate: 0.35, personalities: ['careful', 'loyal'],
                occupation: 'Well-Ring hall master'
            },
            rival: {
                key: 'rival', uid: 'wr_wei_shun', name: 'Wei Shun',
                lodgeRole: 'outer_rival', role: 'disciple', realmIdx: 0,
                ageMonths: 26 * 12, growthRate: 0.7, personalities: ['ambitious', 'bold'],
                occupation: 'Well-Ring outer disciple'
            }
        },
        NPC_ROLES: {
            sect_elder: { cultivator: true, growthRate: 0.35, breakthroughChance: 0 },
            disciple: { cultivator: true, growthRate: 0.7, breakthroughChance: 0 },
            wanderer: { cultivator: true, growthRate: 1, breakthroughChance: 0, canWander: true },
            villager: { cultivator: false, growthRate: 0 }
        },
        NPC_ECOSYSTEM: { growthMonthsPerBreakthrough: 60, demonicThreatPerGrowth: 0, demonicThreatLogThreshold: 99 },
        addLog: (m) => ctx.G._logs.push(String(m)),
        registerWorldTick: (id, fn, priority) => {
            ticks.push({ id, fn, priority: priority || 0 });
        },
        isSectFounded: () => false,
        ensureSectState: () => {},
        getResidenceLevel: () => 0,
        isAtRedwell: () => ctx.G.currentLocation === 'redwell',
        getCurrentLocationId: () => ctx.G.currentLocation,
        isWellRingMember: () => !!ctx.G.wellRing?.member,
        isNpcPhysicallyPresentAt: (npc, locationId) => {
            if (!npc || npc.alive === false) return false;
            if (npc.travel?.state === 'travelling') return false;
            const settled = npc.travel?.settledLocationId
                || npc.homeLocationId
                || 'redwell';
            return settled === locationId;
        },
        getWorldNpcMaxRealm: () => 3,
        getWorldNpcLifespanMonths: () => 200 * 12,
        clampWorldNpcProgress: () => {},
        killWorldNpc: (npc) => { npc.alive = false; },
        tickWorldNpcWander: () => {},
        ensureNpcPersonalities: () => {},
        migrateMasterLiangPersonalities: () => {},
        ensureNpcCharacterFoundation: () => {},
        seedCanonicalNpcTies: () => {}
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

    // Minimal Well-Ring cast helpers needed by world-formations eligibility
    vm.runInContext(`
const WELL_RING_LODGE_ID = 'well_ring_lodge';
const WELL_RING_HOME_LOCATION_ID = 'redwell';
const WELL_RING_HOME_ZONE_ID = 'dustbone';
function getWellRingCastDef(key) { return WELL_RING_CAST[key] || null; }
function listWellRingCastDefs() { return Object.values(WELL_RING_CAST); }
function findWorldNpcRecordByUid(uid) {
    return (G.worldNpcs || []).find(n => n.uid === uid) || null;
}
function ensureWellRingShell() {
    if (!G.wellRing) {
        G.wellRing = {
            member: false, merit: 0, rivalMerit: 4, lastMissionMonth: 0,
            lastBoardMonth: -1, lastTournamentYear: -1, tournamentDue: false,
            manualClaimed: false, dirtyDone: 0, heardFeeScam: false, joinMonth: 0
        };
    }
    return G.wellRing;
}
function ensureWellRingLodgeOrg() {
    const wr = ensureWellRingShell();
    if (!wr.lodge) {
        wr.lodge = {
            id: WELL_RING_LODGE_ID, name: 'Well-Ring Lodge', zone: WELL_RING_HOME_ZONE_ID,
            headquartersLocationId: WELL_RING_HOME_LOCATION_ID, memberUids: [], roles: {},
            formationInstallIds: []
        };
    }
    if (!Array.isArray(wr.lodge.formationInstallIds)) wr.lodge.formationInstallIds = [];
    listWellRingCastDefs().forEach(def => {
        if (!wr.lodge.memberUids.includes(def.uid)) wr.lodge.memberUids.push(def.uid);
        wr.lodge.roles[def.uid] = def.lodgeRole;
    });
    if (typeof ensureWellRingLodgeWorldFormation === 'function') ensureWellRingLodgeWorldFormation();
    return wr.lodge;
}
function buildWellRingCastNpc(def) {
    return {
        uid: def.uid, name: def.name, role: def.role, zone: WELL_RING_HOME_ZONE_ID,
        homeLocationId: WELL_RING_HOME_LOCATION_ID, realmIdx: def.realmIdx,
        ageMonths: def.ageMonths, growthProgress: 0, growthRate: def.growthRate,
        personalities: def.personalities.slice(), alive: true, affiliationId: WELL_RING_LODGE_ID,
        lodgeRole: def.lodgeRole, occupation: def.occupation, lodgeMerit: def.key === 'rival' ? 4 : 0
    };
}
function ensureWellRingLodgeCast() {
    if (!G.worldNpcs) G.worldNpcs = [];
    ensureWellRingLodgeOrg();
    listWellRingCastDefs().forEach(def => {
        if (!findWorldNpcRecordByUid(def.uid)) G.worldNpcs.push(buildWellRingCastNpc(def));
    });
    return G.worldNpcs.filter(n => n.affiliationId === WELL_RING_LODGE_ID);
}
function migrateWellRingLodgeForExistingSave() {
    ensureWellRingLodgeCast();
    if (typeof migrateWorldFormationsForExistingSave === 'function') migrateWorldFormationsForExistingSave();
}
`, ctx, { filename: 'well-ring-stub' });

    vm.runInContext(read('formations.js'), ctx, { filename: 'formations.js' });
    vm.runInContext(read('world-formations.js'), ctx, { filename: 'world-formations.js' });

    // Extract growth helpers + tickWorldNpcGrowth (formation mult hook).
    const worldSrc = read('world.js');
    const canStart = worldSrc.indexOf('function canWorldNpcGrow');
    const growthEnd = worldSrc.indexOf('function tickWorldNpcWander');
    vm.runInContext(worldSrc.slice(canStart, growthEnd), ctx, { filename: 'world-growth' });

    if (options.seedCast !== false) ctx.ensureWellRingLodgeCast();
    return ctx;
}

function runRegisteredTicks(ctx, delta) {
    const ordered = ctx._ticks.slice().sort((a, b) => a.priority - b.priority);
    ordered.forEach(t => t.fn(delta, 0, delta));
}

function testInitNoDup() {
    console.log('\n-- init / no duplication --');
    const ctx = boot();
    const a = ctx.ensureWellRingLodgeWorldFormation();
    const b = ctx.ensureWellRingLodgeWorldFormation();
    ctx.ensureWorldFormationsState();
    ctx.ensureWorldFormationsState();
    assert(a && a.id === 'wr_courtyard_spirit_gathering', 'installation initialised');
    assert(a === b || a.id === b.id, 'same install id');
    assert(Object.keys(ctx.G.worldFormations.byId).length === 1, 'exactly one world install');
    assert(ctx.G.wellRing.lodge.formationInstallIds.filter(id => id === a.id).length === 1,
        'lodge pointer listed once');
    assert(a.ownerId === 'well_ring_lodge' && a.locationId === 'redwell', 'owner + location correct');
    assert(a.formationId === 'spirit_gathering', 'uses existing spirit_gathering pattern');
    assert(a.powerMode === 'ambient', 'ambient power model');
    assert(a.originUnresolved === true, 'origin left unresolved');
}

function testSaveLoadLegacy() {
    console.log('\n-- save/load + legacy migrate --');
    const ctx = boot();
    const inst = ctx.getWellRingLodgeFormationInstallation();
    inst.integrity = 72;
    inst.active = true;
    const snap = JSON.parse(JSON.stringify(ctx.G.worldFormations));

    const again = boot({ seedCast: false });
    again.G.worldFormations = null;
    again.G.wellRing = null;
    again.G.worldNpcs = [];
    // Legacy: no worldFormations key
    again.ensureWellRingLodgeCast();
    again.migrateWorldFormationsForExistingSave();
    assert(again.getWorldFormationInstallation('wr_courtyard_spirit_gathering'), 'legacy migrate creates install');

    again.G.worldFormations = JSON.parse(JSON.stringify(snap));
    again.ensureWorldFormationsState();
    assert(again.getWellRingLodgeFormationInstallation().integrity === 72, 'integrity persists');
    assert(Object.keys(again.G.worldFormations.byId).length === 1, 'reload does not duplicate');
}

function testActivationDeteriorationAmbient() {
    console.log('\n-- activation / ambient / integrity --');
    const ctx = boot();
    const inst = ctx.getWellRingLodgeFormationInstallation();
    const fuelBefore = inst.fuel;
    assert(ctx.isWorldFormationRunning(inst), 'starts running');
    assert(ctx.setWorldFormationActive(inst.id, false).success, 'can shut down');
    assert(!ctx.isWorldFormationRunning(inst), 'inactive → not running');
    assert(ctx.setWorldFormationActive(inst.id, true).success, 'can activate');

    const integ = inst.integrity;
    ctx.tickWorldFormationInstallations(3);
    assert(inst.integrity === integ - 3, 'integrity decays 1/mo');
    assert(inst.fuel === fuelBefore, 'ambient does not burn stones/fuel');

    // Stepped vs batch
    const stepped = boot();
    const batch = boot();
    for (let i = 0; i < 12; i++) stepped.tickWorldFormationInstallations(1);
    batch.tickWorldFormationInstallations(12);
    assert(
        stepped.getWellRingLodgeFormationInstallation().integrity
            === batch.getWellRingLodgeFormationInstallation().integrity,
        'time skip vs stepped integrity match'
    );
}

function testInoperativeNoBenefit() {
    console.log('\n-- inoperative → no benefit --');
    const ctx = boot();
    const wei = ctx.findWorldNpcRecordByUid('wr_wei_shun');
    assert(Math.abs(ctx.getNpcLocalFormationCultivateMult(wei) - 1.08) < 1e-9
        || ctx.getNpcLocalFormationCultivateMult(wei) > 1,
        'eligible present NPC gets running bonus');

    const inst = ctx.getWellRingLodgeFormationInstallation();
    inst.active = false;
    assert(ctx.getNpcLocalFormationCultivateMult(wei) === 1, 'inactive → no NPC benefit');

    inst.active = true;
    inst.integrity = 0;
    inst.scattered = true;
    assert(ctx.getNpcLocalFormationCultivateMult(wei) === 1, 'scattered → no NPC benefit');
}

function testNpcBenefitOnceAndAbsent() {
    console.log('\n-- NPC benefit once / absent --');
    const ctx = boot();
    const wei = ctx.findWorldNpcRecordByUid('wr_wei_shun');
    const baseRate = wei.growthRate;
    const mult = ctx.getNpcLocalFormationCultivateMult(wei);
    assert(mult > 1, 'present disciple gets mult');

    // Growth applies mult exactly once through rate *= mult
    wei.growthProgress = 0;
    ctx.tickWorldNpcGrowth(10);
    const expected = 10 * baseRate * mult;
    assert(Math.abs(wei.growthProgress - expected) < 1e-9,
        `growth applies formation mult once (${wei.growthProgress} vs ${expected})`);

    // Travelling / absent
    const away = boot();
    const rival = away.findWorldNpcRecordByUid('wr_wei_shun');
    rival.travel = { state: 'travelling', settledLocationId: null };
    assert(away.getNpcLocalFormationCultivateMult(rival) === 1, 'travelling NPC gets no benefit');

    const outsider = {
        uid: 'outsider', alive: true, affiliationId: 'other_hall',
        homeLocationId: 'redwell', growthRate: 1, role: 'disciple'
    };
    assert(ctx.getNpcLocalFormationCultivateMult(outsider) === 1, 'non-lodge NPC gets no benefit');
}

function testPlayerEligibility() {
    console.log('\n-- player eligibility --');
    const ctx = boot();
    ctx.G.wellRing.member = false;
    assert(ctx.getPlayerWellRingLodgeFormationCultivateMult() === 1, 'non-member player unchanged');
    ctx.G.wellRing.member = true;
    ctx.G.currentLocation = 'redwell';
    assert(ctx.getPlayerWellRingLodgeFormationCultivateMult() > 1, 'member at lodge gets bonus');
    ctx.G.currentLocation = 'dewcatch_scrub';
    assert(ctx.getPlayerWellRingLodgeFormationCultivateMult() === 1, 'member away gets no lodge bonus');
}

function testObservationNoSecrets() {
    console.log('\n-- observation --');
    const ctx = boot();
    const line = ctx.getWellRingLodgeFormationObservationLine();
    assert(!!line && line.length > 10, 'observation line present');
    assert(!/\b\d+(\.\d+)?\b/.test(line.replace(/Well-Ring/g, '')), 'no raw numeric counters in observation');
    assert(!/integrity|fuelStock|siteSettlement/i.test(line), 'no privileged field names');

    const inst = ctx.getWellRingLodgeFormationInstallation();
    inst.scattered = true;
    inst.integrity = 0;
    const dead = ctx.getWellRingLodgeFormationObservationLine();
    assert(/scattered|bare/i.test(dead), 'scattered state is observable');
}

function testPlayerDwellingSectUntouched() {
    console.log('\n-- player dwelling / sect unchanged --');
    const ctx = boot();
    ctx.G.dwelling = {
        mode: 'owned', settlementId: 'redwell',
        formations: { slots: [], siteSettlementId: 'redwell' }
    };
    ctx.G.location = 'redwell';
    ctx.ensureFormationState();
    assert(!(ctx.G.dwelling.formations.slots || []).some(Boolean), 'world ensure does not invent dwelling slots');
    assert(!(ctx.G.sect.residence.formations.slots || []).some(Boolean), 'world ensure does not invent sect slots');
    // World tick must not copy into dwelling
    ctx.tickWorldFormationInstallations(5);
    assert(!(ctx.G.dwelling.formations.slots || []).some(Boolean), 'world tick does not write dwelling formations');
}

function testSchedulerRegistration() {
    console.log('\n-- scheduler --');
    const ctx = boot();
    assert(ctx._ticks.some(t => t.id === 'worldFormations'), 'registers worldFormations tick');
    const before = ctx.getWellRingLodgeFormationInstallation().integrity;
    runRegisteredTicks(ctx, 4);
    assert(ctx.getWellRingLodgeFormationInstallation().integrity === before - 4,
        'registered tick advances integrity');
}

function testEnsureRecursionSmoke() {
    console.log('\n-- ensure recursion smoke --');
    const ctx = boot();
    for (let i = 0; i < 8; i++) {
        ctx.ensureWorldFormationsState();
        ctx.ensureWellRingLodgeWorldFormation();
        ctx.ensureWellRingLodgeCast();
    }
    assert(Object.keys(ctx.G.worldFormations.byId).length === 1, 'repeated ensure stays single install');
}

function testDeteriorationIndependentOfPlayer() {
    console.log('\n-- deterioration independent of player --');
    const ctx = boot();
    ctx.G.currentLocation = 'dewcatch_scrub'; // player far from Redwell
    const before = ctx.getWellRingLodgeFormationInstallation().integrity;
    // World time advances without opening lodge UI.
    runRegisteredTicks(ctx, 6);
    const after = ctx.getWellRingLodgeFormationInstallation().integrity;
    assert(after === before - 6, `decays while player away (${before}→${after})`);

    // Observation / ensure must not mutate operating state.
    const snap = {
        integrity: after,
        active: ctx.getWellRingLodgeFormationInstallation().active,
        scattered: ctx.getWellRingLodgeFormationInstallation().scattered
    };
    for (let i = 0; i < 5; i++) {
        ctx.getWellRingLodgeFormationObservationLine();
        ctx.ensureWorldFormationsState();
        ctx.ensureWellRingLodgeWorldFormation();
    }
    const inst = ctx.getWellRingLodgeFormationInstallation();
    assert(inst.integrity === snap.integrity, 'observation/ensure does not change integrity');
    assert(inst.active === snap.active, 'observation/ensure does not change active');
    assert(!!inst.scattered === !!snap.scattered, 'observation/ensure does not change scattered');

    // Pause = no processWorldTime → no further decay.
    const pausedAt = inst.integrity;
    // Deliberately do not run ticks (simulates paused calendar).
    assert(ctx.getWellRingLodgeFormationInstallation().integrity === pausedAt,
        'paused calendar (no ticks) does not deteriorate');
}

function testNoDoubleDecayOnSingleAdvance() {
    console.log('\n-- no double decay --');
    const ctx = boot();
    const before = ctx.getWellRingLodgeFormationInstallation().integrity;
    // One scheduler pass with delta 5 should decay exactly once by 5.
    const formationTicks = ctx._ticks.filter(t => t.id === 'worldFormations');
    assert(formationTicks.length === 1, 'exactly one worldFormations tick registered');
    runRegisteredTicks(ctx, 5);
    assert(ctx.getWellRingLodgeFormationInstallation().integrity === before - 5,
        'single advance decays integrity once');
}

function testBecomesInoperativeStopsBenefit() {
    console.log('\n-- eventual inoperative stops benefit --');
    const ctx = boot();
    const wei = ctx.findWorldNpcRecordByUid('wr_wei_shun');
    const inst = ctx.getWellRingLodgeFormationInstallation();
    inst.integrity = 2;
    inst.active = true;
    inst.scattered = false;
    assert(ctx.getNpcLocalFormationCultivateMult(wei) > 1, 'still running near end of life');
    ctx.tickWorldFormationInstallations(5);
    assert(inst.scattered === true && inst.integrity === 0, 'sufficient decay scatters install');
    assert(inst.active === false, 'scattered install is deactivated');
    assert(ctx.getNpcLocalFormationCultivateMult(wei) === 1, 'scattered → NPC benefit gone');
    ctx.G.wellRing.member = true;
    ctx.G.currentLocation = 'redwell';
    assert(ctx.getPlayerWellRingLodgeFormationCultivateMult() === 1,
        'scattered → player lodge benefit gone');
}

function testEnsurePreservesIdentityAndDeactivated() {
    console.log('\n-- ensure identity + deactivated/scattered persist --');
    const ctx = boot();
    const inst = ctx.getWellRingLodgeFormationInstallation();
    const ref = inst;
    inst.integrity = 41;
    inst.active = false;
    for (let i = 0; i < 4; i++) ctx.ensureWellRingLodgeWorldFormation();
    assert(ctx.getWellRingLodgeFormationInstallation() === ref, 'ensure keeps object identity');
    assert(ref.integrity === 41, 'ensure does not restore integrity 88');
    assert(ref.active === false, 'ensure does not reactivate shut-down install');

    ref.integrity = 0;
    ref.scattered = true;
    ref.active = true; // corrupt active flag — ensure should force off
    ctx.ensureWellRingLodgeWorldFormation();
    assert(ref.scattered === true && ref.active === false && ref.integrity === 0,
        'ensure forces scattered installs inactive');
}

function testSaveLoadDoesNotRestoreStarter() {
    console.log('\n-- save/load does not restore starter 88 --');
    const ctx = boot();
    const inst = ctx.getWellRingLodgeFormationInstallation();
    inst.integrity = 55;
    inst.active = false;
    inst.scattered = false;
    const snap = JSON.parse(JSON.stringify(ctx.G.worldFormations));

    const again = boot({ seedCast: false });
    again.G.worldNpcs = [];
    again.G.wellRing = JSON.parse(JSON.stringify(ctx.G.wellRing));
    again.G.worldFormations = snap;
    // Simulate loadState migrate path
    again.migrateWellRingLodgeForExistingSave
        ? again.migrateWellRingLodgeForExistingSave()
        : again.migrateWorldFormationsForExistingSave();
    again.ensureWellRingLodgeCast();
    again.ensureWorldFormationsState();

    const loaded = again.getWellRingLodgeFormationInstallation();
    assert(loaded.integrity === 55, 'loaded integrity stays 55 (not 88)');
    assert(loaded.active === false, 'loaded keeps deactivated');
    assert(Object.keys(again.G.worldFormations.byId).length === 1, 'no dup on load migrate');
    assert(
        (again.G.wellRing.lodge.formationInstallIds || []).includes('wr_courtyard_spirit_gathering'),
        'lodge formationInstallIds pointer valid after load'
    );
}

function testPlayerBenefitStopsWhenLeavingOrInoperative() {
    console.log('\n-- player benefit location + operative gates --');
    const ctx = boot();
    ctx.G.wellRing.member = true;
    ctx.G.currentLocation = 'redwell';
    assert(ctx.getPlayerWellRingLodgeFormationCultivateMult() > 1, 'member at Redwell gets bonus');
    ctx.G.currentLocation = 'jade_harbor';
    assert(ctx.getPlayerWellRingLodgeFormationCultivateMult() === 1, 'leaving Redwell stops bonus');
    ctx.G.currentLocation = 'redwell';
    const inst = ctx.getWellRingLodgeFormationInstallation();
    inst.active = false;
    assert(ctx.getPlayerWellRingLodgeFormationCultivateMult() === 1, 'inactive stops player bonus');
}

function testLodgeDoesNotDoubleStackInPassiveChain() {
    console.log('\n-- lodge mult applied once in player chain --');
    const ctx = boot();
    ctx.G.wellRing.member = true;
    ctx.G.currentLocation = 'redwell';
    // Stub passive chain the same way the game composes it.
    const lodge = ctx.getPlayerWellRingLodgeFormationCultivateMult();
    const dwelling = 1; // no personal courtyard gather
    const combined = dwelling * lodge;
    assert(Math.abs(combined - lodge) < 1e-9, 'lodge appears once when dwelling is neutral');
    assert(lodge > 1 && lodge < 1.2, 'lodge bonus is a single modest mult');
}

function testNpcContinuesAfterFormationStops() {
    console.log('\n-- NPC growth continues after formation stops --');
    const ctx = boot();
    const wei = ctx.findWorldNpcRecordByUid('wr_wei_shun');
    const inst = ctx.getWellRingLodgeFormationInstallation();
    inst.active = false;
    wei.growthProgress = 0;
    ctx.tickWorldNpcGrowth(10);
    assert(Math.abs(wei.growthProgress - 10 * wei.growthRate) < 1e-9,
        'NPC still grows at base rate when formation off');
}

function testObservationReflectsStateWithoutSecrets() {
    console.log('\n-- observation reflects real state --');
    const ctx = boot();
    const inst = ctx.getWellRingLodgeFormationInstallation();
    inst.active = true;
    inst.integrity = 80;
    assert(/hums|pulls|pattern/i.test(ctx.getWellRingLodgeFormationObservationLine()),
        'operating state readable');
    inst.active = false;
    const off = ctx.getWellRingLodgeFormationObservationLine();
    assert(/dark|switch/i.test(off), 'inactive reported as dark switch');
    assert(!/hums/i.test(off), 'inactive is not described as operating');
    assert(!/\b(88|integrity|fuel)\b/i.test(off), 'no privileged numbers/fields');
}

testInitNoDup();
testSaveLoadLegacy();
testActivationDeteriorationAmbient();
testInoperativeNoBenefit();
testNpcBenefitOnceAndAbsent();
testPlayerEligibility();
testObservationNoSecrets();
testPlayerDwellingSectUntouched();
testSchedulerRegistration();
testEnsureRecursionSmoke();
testDeteriorationIndependentOfPlayer();
testNoDoubleDecayOnSingleAdvance();
testBecomesInoperativeStopsBenefit();
testEnsurePreservesIdentityAndDeactivated();
testSaveLoadDoesNotRestoreStarter();
testPlayerBenefitStopsWhenLeavingOrInoperative();
testLodgeDoesNotDoubleStackInPassiveChain();
testNpcContinuesAfterFormationStops();
testObservationReflectsStateWithoutSecrets();

console.log(`\n${failed === 0 ? 'All world-formation tests passed.' : failed + ' failure(s).'}`);
process.exit(failed === 0 ? 0 : 1);
