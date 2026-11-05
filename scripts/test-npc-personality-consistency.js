/**
 * PR #203 — personality authority + Master Liang migration.
 * Run: node scripts/test-npc-personality-consistency.js
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

function boot(extraG) {
    const G = Object.assign({
        ageMonths: 200,
        worldNpcs: [],
        wellRing: null,
        npcTies: null,
        npcRelationships: {},
        settlementSeats: { redwell: { city_lord: { name: 'Lord Hesh' } } },
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
        JSON,
        String,
        currentZone: G.currentZone,
        getCurrentLocationId: () => G.currentLocation,
        getSettlementSeatHolder: (s, r) => G.settlementSeats?.[s]?.[r] || null,
        getNpcDef: (id) => {
            if (id === 'merchant_su') {
                return { id: 'merchant_su', personalities: ['cunning', 'honorable'], name: 'Merchant Su' };
            }
            return null;
        },
        ensureNpcPersonalities: (npc) => {
            if (!npc.personalities?.length) npc.personalities = ['careful'];
            return npc.personalities;
        },
        findWorldNpcRecordByUid: null
    });
    ctx.findWorldNpcRecordByUid = (uid) => (ctx.G.worldNpcs || []).find(n => n.uid === uid) || null;
    vm.runInContext(read('npc-foundations.js'), ctx);
    vm.runInContext(read('npc-ties.js'), ctx);
    vm.runInContext(read('well-ring-lodge.js'), ctx);
    ctx.ensureWellRingState = function () {
        if (!ctx.G.wellRing) {
            ctx.G.wellRing = {
                member: false, merit: 0, rivalMerit: 4,
                lastMissionMonth: 0, lastBoardMonth: -1, lastTournamentYear: -1,
                tournamentDue: false, manualClaimed: false, dirtyDone: 0, heardFeeScam: false, joinMonth: 0
            };
        }
        ctx.ensureWellRingLodgeCast();
        return ctx.G.wellRing;
    };
    return ctx;
}

function sorted(list) {
    return (list || []).slice().sort().join(',');
}

// 1–2. New Liang + foundation agrees with live
{
    const ctx = boot();
    ctx.ensureWellRingLodgeCast();
    const npc = ctx.getWellRingCastNpc('hall_master');
    assert(sorted(npc.personalities) === 'careful,loyal', 'new Master Liang uses careful, loyal');
    const f = ctx.getNpcCharacterFoundation(npc);
    assert(sorted(f.personalities) === sorted(npc.personalities), 'foundation personalities match live');
    assert(f.values.some(v => v.id === 'pragmatism'), 'pragmatism kept as value');
}

// 3–4. Legacy migrate + idempotent
{
    for (const legacy of [['cunning', 'wise'], ['cunning', 'loyal'], ['loyal', 'cunning'], ['wise', 'cunning']]) {
        const ctx = boot({
            worldNpcs: [{
                uid: 'wr_master_liang',
                name: 'Master Liang',
                role: 'sect_elder',
                zone: 'dustbone',
                homeLocationId: 'redwell',
                realmIdx: 1,
                ageMonths: 600,
                growthProgress: 12,
                personalities: legacy.slice(),
                alive: true,
                state: 'persistent',
                affiliationId: 'well_ring_lodge',
                lodgeRole: 'hall_master',
                lodgeMerit: 0
            }]
        });
        const age = ctx.G.worldNpcs[0].ageMonths;
        const realm = ctx.G.worldNpcs[0].realmIdx;
        const growth = ctx.G.worldNpcs[0].growthProgress;
        const r1 = ctx.migrateMasterLiangPersonalities();
        assert(r1.migrated === true, `legacy ${legacy.join('+')} migrates`);
        assert(sorted(ctx.G.worldNpcs[0].personalities) === 'careful,loyal', `legacy ${legacy.join('+')} → careful,loyal`);
        const r2 = ctx.migrateMasterLiangPersonalities();
        assert(r2.migrated === false && r2.reason === 'already_current', `idempotent for ${legacy.join('+')}`);
        assert(ctx.G.worldNpcs[0].ageMonths === age && ctx.G.worldNpcs[0].realmIdx === realm, 'age/realm unchanged');
        assert(ctx.G.worldNpcs[0].growthProgress === growth, 'growthProgress unchanged');
        assert(ctx.G.worldNpcs[0].zone === 'dustbone', 'zone unchanged');
    }
}

// 5. Unrecognised preserved
{
    const ctx = boot({
        worldNpcs: [{
            uid: 'wr_master_liang',
            name: 'Master Liang',
            personalities: ['proud', 'zealous'],
            realmIdx: 1,
            ageMonths: 400,
            alive: true,
            state: 'persistent',
            zone: 'dustbone'
        }]
    });
    const r = ctx.migrateMasterLiangPersonalities();
    assert(r.migrated === false && r.reason === 'preserved_unrecognised', 'unrecognised personalities preserved');
    assert(sorted(ctx.G.worldNpcs[0].personalities) === 'proud,zealous', 'proud+zealous kept');
}

// 6. Unrelated state + Wei Shun untouched
{
    const ctx = boot({
        wellRing: { member: true, merit: 9, rivalMerit: 14, lastBoardMonth: 1, lastMissionMonth: 1, lastTournamentYear: 0, tournamentDue: false },
        worldNpcs: [
            {
                uid: 'wr_master_liang',
                name: 'Master Liang',
                personalities: ['cunning', 'wise'],
                realmIdx: 1,
                ageMonths: 480,
                alive: true,
                state: 'persistent',
                zone: 'dustbone',
                impression: 7,
                trust: 3
            },
            {
                uid: 'wr_wei_shun',
                name: 'Wei Shun',
                personalities: ['ambitious', 'bold'],
                realmIdx: 0,
                ageMonths: 300,
                alive: true,
                state: 'persistent',
                zone: 'dustbone',
                lodgeMerit: 14
            }
        ]
    });
    ctx.migrateMasterLiangPersonalities();
    ctx.ensureWellRingLodgeCast();
    assert(ctx.G.wellRing.merit === 9, 'player lodge merit unchanged');
    assert(ctx.getWellRingRivalMerit() === 14, 'rival merit unchanged');
    assert(sorted(ctx.getWellRingCastNpc('rival').personalities) === 'ambitious,bold', 'Wei Shun personalities unchanged');
    assert(ctx.G.worldNpcs[0].impression === 7 && ctx.G.worldNpcs[0].trust === 3, 'Liang relationship fields unchanged');
}

// 7. Procedural foundations from final personalities (post ambient-style adjust)
{
    const ctx = boot();
    const npc = {
        uid: 'wn_amb_1',
        name: 'A stranger',
        role: 'wanderer',
        zone: 'dustbone',
        personalities: ['bold', 'charming'],
        state: 'ambient',
        unnamed: true,
        alive: true
    };
    ctx.G.worldNpcs.push(npc);
    assert(ctx.ensureNpcCharacterFoundation(npc) == null, 'unnamed ambient has no foundation yet');
    // Simulate ambient sorrowful inject then promote
    npc.personalities[0] = 'sorrowful';
    npc.state = 'persistent';
    npc.unnamed = false;
    npc.name = 'Lin Mei';
    const f = ctx.ensureNpcCharacterFoundation(npc);
    assert(f.personalities.includes('sorrowful'), 'foundation built from final personalities');
    assert(npc.foundation.personalities.includes('sorrowful'), 'stored blob matches final traits');
}

// 8. Existing procedural not arbitrarily rerolled; mirror sync only
{
    const ctx = boot();
    const npc = {
        uid: 'wn_proc_2',
        name: 'Chen Bo',
        role: 'disciple',
        personalities: ['ambitious', 'bold'],
        alive: true,
        state: 'persistent',
        zone: 'dustbone',
        foundation: {
            version: 1,
            source: 'procedural',
            personalities: ['ambitious', 'bold'],
            values: [{ id: 'advancement', weight: 0.99 }],
            ambitions: [{ id: 'advancement', priority: 0.99 }],
            convictions: [],
            attachments: []
        }
    };
    ctx.G.worldNpcs.push(npc);
    // Live traits drift (e.g. old ambient inject after blob) — sync mirror only
    npc.personalities = ['sorrowful', 'bold'];
    ctx.ensureNpcCharacterFoundation(npc);
    assert(npc.foundation.values[0].weight === 0.99, 'values not regenerated');
    assert(npc.foundation.ambitions[0].priority === 0.99, 'ambitions not regenerated');
    assert(sorted(npc.foundation.personalities) === 'bold,sorrowful', 'personality mirror synced to live');
    assert(sorted(ctx.getNpcCharacterFoundation(npc).personalities) === 'bold,sorrowful', 'resolved foundation uses live traits');
}

// 9. Story NPC path unchanged
{
    const ctx = boot();
    const f = ctx.getNpcCharacterFoundation('merchant_su');
    // No authored foundation for merchant_su — procedural-ish via story stub
    assert(sorted(ctx.getEffectiveNpcPersonalities('merchant_su')) === 'cunning,honorable', 'story personalities from def');
}

// 10. Synergy path still sees live traits (cunning+ambitious → schemer key inputs exist)
{
    const ctx = boot();
    const npc = {
        uid: 'wn_syn',
        personalities: ['ambitious', 'cunning'],
        alive: true,
        state: 'persistent',
        zone: 'dustbone'
    };
    ctx.G.worldNpcs.push(npc);
    ctx.ensureNpcCharacterFoundation(npc);
    assert(sorted(ctx.getEffectiveNpcPersonalities(npc)) === 'ambitious,cunning', 'effective traits for duel/betrayal consumers');
}

if (failed) {
    console.error(`\n${failed} failure(s)`);
    process.exit(1);
}
console.log('\nAll NPC personality consistency tests passed.');
