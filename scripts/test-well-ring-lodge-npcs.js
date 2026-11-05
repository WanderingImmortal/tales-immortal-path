/**
 * Well-Ring Lodge persistent cast (Phase A).
 * Run: node scripts/test-well-ring-lodge-npcs.js
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

function bootCast(extraG) {
    const G = Object.assign({
        ageMonths: 120,
        worldNpcs: [],
        wellRing: null,
        currentZone: 'dustbone',
        currentLocation: 'redwell'
    }, extraG || {});

    const ctx = vm.createContext({
        G,
        console,
        Math,
        Number,
        Array,
        Object,
        currentZone: G.currentZone,
        getCurrentLocationId: () => G.currentLocation,
        ensureNpcPersonalities: (npc) => {
            if (!npc.personalities?.length) npc.personalities = ['careful'];
            return npc.personalities;
        },
        ensureWellRingState: null
    });

    // Minimal ensureWellRingState for cast module (mirrors qc-depth shell).
    ctx.ensureWellRingState = function ensureWellRingState() {
        if (!ctx.G.wellRing) {
            ctx.G.wellRing = {
                member: false,
                merit: 0,
                rivalMerit: 4,
                lastMissionMonth: 0,
                lastBoardMonth: -1,
                lastTournamentYear: -1,
                tournamentDue: false,
                manualClaimed: false,
                dirtyDone: 0,
                heardFeeScam: false,
                joinMonth: 0
            };
        }
        if (ctx.G.wellRing.rivalMerit == null) ctx.G.wellRing.rivalMerit = 4;
        if (typeof ctx.ensureWellRingLodgeCast === 'function') ctx.ensureWellRingLodgeCast();
        return ctx.G.wellRing;
    };

    vm.runInContext(read('well-ring-lodge.js'), ctx);
    return ctx;
}

// --- Stable identities, no duplicates ---
{
    const ctx = bootCast();
    const first = ctx.ensureWellRingLodgeCast();
    const second = ctx.ensureWellRingLodgeCast();
    assert(first.length === 2 && second.length === 2, 'cast ensure returns both faces');
    const uids = ctx.G.worldNpcs.map(n => n.uid);
    assert(uids.filter(u => u === 'wr_master_liang').length === 1, 'Master Liang uid unique after double ensure');
    assert(uids.filter(u => u === 'wr_wei_shun').length === 1, 'Wei Shun uid unique after double ensure');
    assert(ctx.G.worldNpcs.length === 2, 'no extra NPCs from repeated ensure');
    assert(ctx.G.wellRing.lodge?.id === 'well_ring_lodge', 'lodge org id set');
    assert(ctx.G.wellRing.cast?.hallMasterUid === 'wr_master_liang', 'cast map points at Master Liang');
    assert(ctx.G.wellRing.cast?.rivalUid === 'wr_wei_shun', 'cast map points at Wei Shun');
}

// --- Lodge association resolves correctly ---
{
    const ctx = bootCast();
    ctx.ensureWellRingLodgeCast();
    const master = ctx.getWellRingCastNpc('hall_master');
    const rival = ctx.getWellRingCastNpc('rival');
    assert(master?.name === 'Master Liang' && master.lodgeRole === 'hall_master', 'hall master association');
    assert(rival?.name === 'Wei Shun' && rival.lodgeRole === 'outer_rival', 'rival association');
    assert(master.affiliationId === 'well_ring_lodge' && rival.affiliationId === 'well_ring_lodge', 'affiliation id');
    assert(master.uid !== 'liang_chen', 'Master Liang is not story NPC liang_chen');
    const members = ctx.getWellRingLodgeMembers();
    assert(members.length === 2, 'lodge members list');
}

// --- Rival merit: old scalar migrates; single authority after sync ---
{
    const ctx = bootCast({
        wellRing: {
            member: true,
            merit: 7,
            rivalMerit: 11,
            lastMissionMonth: 0,
            lastBoardMonth: 0,
            lastTournamentYear: 0,
            tournamentDue: false
        }
    });
    ctx.ensureWellRingLodgeCast();
    const rival = ctx.getWellRingCastNpc('rival');
    assert(rival.lodgeMerit === 11, 'old rivalMerit migrates onto Wei Shun lodgeMerit');
    assert(ctx.getWellRingRivalMerit() === 11, 'getter reads NPC merit');
    ctx.adjustWellRingRivalMerit(2);
    assert(rival.lodgeMerit === 13 && ctx.G.wellRing.rivalMerit === 13, 'adjust keeps scalar mirror in sync');
}

// --- Lifecycle through existing growth tick (no second clock) ---
{
    const worldSrc = read('world.js');
    // Extract only growth helpers we need by loading a thin stub of NPC_ROLES / ecosystem.
    const ctx = bootCast();
    ctx.ensureWellRingLodgeCast();
    const master = ctx.getWellRingCastNpc('hall_master');
    const startAge = master.ageMonths;
    const startRealm = master.realmIdx;

    ctx.NPC_ROLES = {
        sect_elder: { id: 'sect_elder', growthRate: 0.35, breakthroughChance: 0, maxRealm: 6, lifespanUsesRealm: true, canWander: false },
        disciple: { id: 'disciple', growthRate: 0.7, breakthroughChance: 0, maxRealm: 2, lifespanUsesRealm: true, canWander: false },
        wanderer: { id: 'wanderer', growthRate: 1, breakthroughChance: 0, maxRealm: 3, lifespanUsesRealm: true, canWander: true },
        villager: { id: 'villager', cultivator: false, growthRate: 0, lifespanYears: 75 }
    };
    ctx.NPC_ECOSYSTEM = { growthMonthsPerBreakthrough: 120, demonicThreatCap: 36, demonicThreatPerGrowth: 1, demonicThreatLogThreshold: 99 };
    ctx.LIFESPAN_BY_REALM = [80, 120, 200, 400, 800, 1200, 2000, 3000, 5000];
    ctx.ZONES = { dustbone: { name: 'Dustbone' }, jade: { name: 'Jade' } };
    ctx.clamp = (n, a, b) => Math.max(a, Math.min(b, n));
    ctx.getMaxCultivationRealmIdx = () => 8;
    ctx.addLog = () => {};
    ctx.G.realmIdx = 0;

    // Pull growth functions from world.js via regex blocks.
    const growthChunk = [
        'function getWorldNpcMaxRealm',
        'function getWorldNpcThreatCap',
        'function clampWorldNpcProgress',
        'function getWorldNpcLifespanMonths',
        'function canWorldNpcGrow',
        'function tickWorldNpcGrowth',
        'function tickWorldNpcWander',
        'function killWorldNpc',
        'function pickWorldNpcWanderInterval'
    ].map(sig => {
        const start = worldSrc.indexOf(sig);
        if (start < 0) throw new Error('missing ' + sig);
        // take until next top-level function or reasonable length
        return worldSrc.slice(start, start + 2500);
    }).join('\n');

    // Safer: eval the known contiguous growth section.
    const growthStart = worldSrc.indexOf('function getWorldNpcMaxRealm');
    const growthEnd = worldSrc.indexOf('function spawnVengeanceDemonicTalent');
    vm.runInContext(worldSrc.slice(growthStart, growthEnd), ctx);

    ctx.tickWorldNpcGrowth(24);
    assert(master.ageMonths === startAge + 24, 'Master Liang ages via tickWorldNpcGrowth');
    assert(master.realmIdx === startRealm, 'realm unchanged without breakthrough luck (chance 0)');
    assert(master.wanderDueMonths == null, 'lodge cast does not wander');
}

// --- Presence: dead / wrong location hidden ---
{
    const ctx = bootCast();
    ctx.ensureWellRingLodgeCast();
    const master = ctx.getWellRingCastNpc('hall_master');
    assert(ctx.isWellRingCastNpcPresent(master, 'redwell') === true, 'present at Redwell when alive');
    assert(ctx.isWellRingCastNpcPresent(master, 'bone_crossroads') === false, 'not present at other Dustbone location');
    master.alive = false;
    assert(ctx.isWellRingCastNpcPresent(master, 'redwell') === false, 'dead master not physically present');
    assert(ctx.getWellRingMasterDisplayName() === 'the lodge steward', 'dead master UI fallback');
    assert(ctx.getWellRingCastNpc('hall_master', { aliveOnly: true }) == null, 'aliveOnly skips dead');
}

// --- Save/load shape (JSON round-trip) ---
{
    const ctx = bootCast({
        wellRing: { member: true, merit: 5, rivalMerit: 9, lastBoardMonth: 10, lastMissionMonth: 8, lastTournamentYear: 0, tournamentDue: false, manualClaimed: false, dirtyDone: 0, heardFeeScam: false, joinMonth: 2 }
    });
    ctx.ensureWellRingLodgeCast();
    ctx.adjustWellRingRivalMerit(1);
    const saved = JSON.parse(JSON.stringify({
        wellRing: ctx.G.wellRing,
        worldNpcs: ctx.G.worldNpcs
    }));

    const ctx2 = bootCast({
        wellRing: saved.wellRing,
        worldNpcs: saved.worldNpcs
    });
    ctx2.migrateWellRingLodgeForExistingSave();
    assert(ctx2.G.worldNpcs.filter(n => n.uid === 'wr_master_liang').length === 1, 'load does not duplicate Master Liang');
    assert(ctx2.G.worldNpcs.filter(n => n.uid === 'wr_wei_shun').length === 1, 'load does not duplicate Wei Shun');
    assert(ctx2.G.wellRing.member === true && ctx2.G.wellRing.merit === 5, 'membership/merit preserved');
    assert(ctx2.getWellRingRivalMerit() === 10, 'rival merit preserved across save/load');
    const master = ctx2.getWellRingCastNpc('hall_master');
    assert(master.realmIdx === 1 && master.ageMonths === 48 * 12, 'cultivation/age not reset on migrate');
}

// --- Old save without cast acquires NPCs without wiping rivalMerit ---
{
    const ctx = bootCast({
        wellRing: {
            member: true,
            merit: 3,
            rivalMerit: 6,
            lastBoardMonth: 1,
            lastMissionMonth: 1,
            lastTournamentYear: 0,
            tournamentDue: false
        },
        worldNpcs: [{ uid: 'wn_other', name: 'Passerby', role: 'wanderer', zone: 'dustbone', realmIdx: 0, ageMonths: 200, alive: true, state: 'persistent' }]
    });
    ctx.migrateWellRingLodgeForExistingSave();
    assert(ctx.G.worldNpcs.length === 3, 'adds cast beside existing world NPCs');
    assert(ctx.getWellRingRivalMerit() === 6, 'old rivalMerit kept');
    assert(ctx.G.wellRing.merit === 3 && ctx.G.wellRing.member === true, 'player lodge state intact');
}

// --- Board rows resolve rival through association ---
{
    const ctx = bootCast({
        wellRing: { member: true, merit: 8, rivalMerit: 12, lastBoardMonth: 0, lastMissionMonth: 0, lastTournamentYear: 0, tournamentDue: false }
    });
    // Load board helper from qc-depth with stubs.
    ctx.WELL_RING_BOARD_FAKES = [
        { name: 'Outer Ke', merit: 3 },
        { name: 'Outer Yue', merit: 2 },
        { name: 'Outer Hark', merit: 1 }
    ];
    vm.runInContext(`
        ${read('qc-depth.js').match(/function getWellRingBoardRows\([\s\S]*?\n\}/)[0]}
        ${read('qc-depth.js').match(/function getWellRingPlayerRank\([\s\S]*?\n\}/)[0]}
    `, ctx);
    ctx.ensureWellRingLodgeCast();
    const rows = ctx.getWellRingBoardRows();
    const rivalRow = rows.find(r => r.rival);
    assert(rivalRow && rivalRow.uid === 'wr_wei_shun', 'board rival row carries stable uid');
    assert(rivalRow.merit === 12, 'board merit from NPC association');
    assert(rivalRow.name.includes('Wei Shun'), 'board shows Wei Shun');
}

if (failed) {
    console.error(`\n${failed} failure(s)`);
    process.exit(1);
}
console.log('\nAll Well-Ring lodge NPC tests passed.');
