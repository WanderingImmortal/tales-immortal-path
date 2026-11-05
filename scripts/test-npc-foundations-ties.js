/**
 * NPC character foundations + sparse ties (Phase B).
 * Run: node scripts/test-npc-foundations-ties.js
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
        settlementSeats: {
            redwell: {
                city_lord: { name: 'Lord Hesh', ageYears: 60, lean: 'graft' }
            }
        },
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
        getSettlementSeatHolder: (settlementId, roleId) => G.settlementSeats?.[settlementId]?.[roleId] || null,
        getNpcDef: () => null,
        NPC_PERSONALITY_IDS: [
            'careful', 'bold', 'cowardly', 'vengeful', 'honorable', 'cunning', 'loyal', 'proud',
            'merciful', 'ambitious', 'wise', 'foolish', 'secretive', 'sorrowful', 'zealous', 'charming'
        ],
        ensureNpcPersonalities: (npc) => {
            if (!npc.personalities?.length) npc.personalities = ['careful', 'wise'];
            return npc.personalities;
        },
        findWorldNpcRecordByUid: null,
        ensureWellRingState: null
    });

    ctx.findWorldNpcRecordByUid = (uid) => (ctx.G.worldNpcs || []).find(n => n.uid === uid) || null;

    vm.runInContext(read('npc-foundations.js'), ctx);
    vm.runInContext(read('npc-ties.js'), ctx);
    vm.runInContext(read('well-ring-lodge.js'), ctx);

    ctx.ensureWellRingState = function ensureWellRingState() {
        if (!ctx.G.wellRing) {
            ctx.G.wellRing = {
                member: false, merit: 0, rivalMerit: 4,
                lastMissionMonth: 0, lastBoardMonth: -1, lastTournamentYear: -1,
                tournamentDue: false, manualClaimed: false, dirtyDone: 0, heardFeeScam: false, joinMonth: 0
            };
        }
        if (typeof ctx.ensureWellRingLodgeCast === 'function') ctx.ensureWellRingLodgeCast();
        return ctx.G.wellRing;
    };

    return ctx;
}

// --- Authored foundation resolution / Master Liang ---
{
    const ctx = boot();
    ctx.ensureWellRingLodgeCast();
    const authored = ctx.getAuthoredCharacterFoundation('wr_master_liang');
    assert(!!authored && authored.source === 'authored', 'authored foundation exists for Master Liang');
    assert(authored.personalities.includes('careful') && authored.personalities.includes('loyal'), 'Liang defaults careful + loyal');
    const master = ctx.getWellRingCastNpc('hall_master');
    assert(
        master.personalities.includes('careful') && master.personalities.includes('loyal'),
        'new Master Liang NPCs use careful, loyal'
    );
    const f = ctx.getNpcCharacterFoundation('wr_master_liang');
    assert(
        f.personalities.includes('careful') && f.personalities.includes('loyal'),
        'foundation personalities agree with live traits'
    );
    assert(f.values.some(v => v.id === 'lodge_legacy' && v.weight > 0.8), 'Liang values lodge legacy highly');
    assert(f.values.some(v => v.id === 'pragmatism'), 'pragmatism remains a value not cunning');
    assert(f.ambitions.some(a => a.id === 'preserve_well_ring'), 'Liang ambition preserves lodge');
    assert(!f.ambitions.some(a => /dominat|immortal|heavens_rule/i.test(a.id)), 'no grand domination ambition');
    assert(f.lore?.foundationQualityNote && /city lord/i.test(f.lore.foundationQualityNote), 'FE quality lore recorded without system change');
    assert(f.attachments.some(a => a.id === 'well_ring_lodge'), 'lodge attachment present');
    const vals = ctx.getNpcFoundationValues('wr_master_liang');
    const ambs = ctx.getNpcFoundationAmbitions('wr_master_liang');
    assert(vals.length >= 3 && ambs.length >= 1, 'value/ambition helpers resolve');
}

// --- Legacy Liang migrate only via dedicated migrate (ensure alone does not wipe unrecognised) ---
{
    const ctx = boot({
        worldNpcs: [{
            uid: 'wr_master_liang',
            name: 'Master Liang',
            role: 'sect_elder',
            zone: 'dustbone',
            realmIdx: 1,
            ageMonths: 500,
            personalities: ['proud', 'secretive'],
            alive: true,
            state: 'persistent',
            lodgeMerit: 0
        }]
    });
    ctx.ensureNpcCharacterFoundation(ctx.G.worldNpcs[0]);
    assert(
        ctx.G.worldNpcs[0].personalities[0] === 'proud' && ctx.G.worldNpcs[0].personalities[1] === 'secretive',
        'unrecognised personalities preserved by ensure'
    );
    const f = ctx.getNpcCharacterFoundation('wr_master_liang');
    assert(f.personalities.includes('proud') && f.personalities.includes('secretive'), 'foundation follows live unrecognised traits');
    assert(f.source === 'authored', 'authored still resolves by uid');
}

// --- Procedural foundation stability ---
{
    const ctx = boot();
    const npc = {
        uid: 'wn_proc_1',
        name: 'Lin Mei',
        role: 'wanderer',
        zone: 'dustbone',
        personalities: ['ambitious', 'cunning'],
        alive: true,
        state: 'persistent'
    };
    ctx.G.worldNpcs.push(npc);
    const a = ctx.ensureNpcCharacterFoundation(npc);
    const blob = JSON.stringify(npc.foundation);
    ctx.ensureNpcCharacterFoundation(npc);
    assert(npc.foundation.source === 'procedural', 'procedural foundation source');
    assert(JSON.stringify(npc.foundation) === blob, 'repeated ensure does not rewrite procedural foundation');
    assert(a.ambitions.some(x => x.id === 'advancement'), 'ambitious maps to advancement ambition');
    assert(a.values.length <= 4 && a.ambitions.length <= 2, 'procedural foundations stay lightweight');
}

// --- No personality drift on time advance ---
{
    const ctx = boot();
    ctx.ensureWellRingLodgeCast();
    const master = ctx.getWellRingCastNpc('hall_master');
    const before = master.personalities.slice();
    const fBefore = JSON.stringify(ctx.getNpcCharacterFoundation(master));
    // Simulate months passing without any foundation mutator (Phase B has none on ticks).
    ctx.G.ageMonths += 36;
    master.ageMonths += 36;
    assert(JSON.stringify(master.personalities) === JSON.stringify(before), 'personalities unchanged after time');
    assert(JSON.stringify(ctx.getNpcCharacterFoundation(master)) === fBefore, 'foundation unchanged after time');
}

// --- Sparse ties: create, lookup, asymmetric, no duplicates ---
{
    const ctx = boot();
    ctx.ensureWellRingLodgeCast();
    ctx.seedCanonicalNpcTies();
    ctx.seedCanonicalNpcTies();
    const ids = Object.keys(ctx.G.npcTies.byId);
    assert(ids.filter(id => id === 'tie_wr_liang_redwell_city_lord').length === 1, 'canonical tie not duplicated');
    const ties = ctx.getNpcTiesFor('wr_master_liang');
    assert(ties.length >= 1, 'lookup by participant');
    assert(ties.every(t => t.a && t.b), 'ties have two ends');
    const between = ctx.findNpcTieBetween('wr_master_liang', 'seat:redwell:city_lord');
    assert(!!between && between.kinds.includes('institutional_obligation'), 'institutional Liang–lord tie');
    const pLiang = ctx.getNpcTiePerspective(between.id, 'wr_master_liang');
    const pLord = ctx.getNpcTiePerspective(between.id, 'seat:redwell:city_lord');
    assert(pLiang && pLord, 'both perspectives resolve');
    assert(pLiang.trust !== pLord.trust || pLiang.notes !== pLord.notes, 'asymmetric stances supported');
    assert(pLiang.other.id === 'seat:redwell:city_lord', 'Liang perspective points at seat ref');

    // Wei Shun is lodge member but not auto-tied personally
    const weiTies = ctx.getNpcTiesFor('wr_wei_shun');
    assert(weiTies.length === 0, 'lodge membership alone does not create personal Wei Shun ties');
}

// --- upsert preserves mutable stance ---
{
    const ctx = boot();
    ctx.seedCanonicalNpcTies();
    ctx.upsertNpcTie({
        id: 'tie_wr_liang_redwell_city_lord',
        a: { id: 'wr_master_liang', kind: 'world' },
        b: { id: 'seat:redwell:city_lord', kind: 'seat' },
        kinds: ['institutional_obligation'],
        stance: {
            wr_master_liang: { trust: 0.99, attachment: 0.99, tension: 0.01, notes: 'should not overwrite' }
        }
    });
    const p = ctx.getNpcTiePerspective('tie_wr_liang_redwell_city_lord', 'wr_master_liang');
    assert(p.trust === 0.45, 're-seed / upsert does not overwrite established stance');
}

// --- No global NPC-pair iteration helper exists ---
{
    const tiesSrc = read('npc-ties.js');
    assert(!/for\s*\(.*worldNpcs[\s\S]*worldNpcs/.test(tiesSrc), 'no nested worldNpcs pair loop in npc-ties.js');
    assert(tiesSrc.includes('byParticipant'), 'participant index present');
}

// --- Save/load + idempotent migration ---
{
    const ctx = boot();
    ctx.ensureWellRingLodgeCast();
    ctx.migrateNpcAgencyFoundationsAndTies();
    ctx.adjustWellRingRivalMerit?.(0);
    const saved = JSON.parse(JSON.stringify({
        worldNpcs: ctx.G.worldNpcs,
        wellRing: ctx.G.wellRing,
        npcTies: ctx.G.npcTies,
        npcRelationships: { liang_chen: 12 }
    }));

    const ctx2 = boot({
        worldNpcs: saved.worldNpcs,
        wellRing: saved.wellRing,
        npcTies: saved.npcTies,
        npcRelationships: saved.npcRelationships
    });
    ctx2.migrateNpcAgencyFoundationsAndTies();
    ctx2.migrateNpcAgencyFoundationsAndTies();
    assert(ctx2.G.worldNpcs.filter(n => n.uid === 'wr_master_liang').length === 1, 'no duplicate Liang');
    assert(Object.keys(ctx2.G.npcTies.byId).filter(id => id === 'tie_wr_liang_redwell_city_lord').length === 1, 'no duplicate canonical tie');
    assert(ctx2.G.npcRelationships.liang_chen === 12, 'player-NPC relationship score untouched');
    assert(ctx2.getNpcCharacterFoundation('wr_master_liang').source === 'authored', 'foundation survives save/load');
}

// --- Dead / missing participants handled ---
{
    const ctx = boot();
    ctx.ensureWellRingLodgeCast();
    ctx.seedCanonicalNpcTies();
    const master = ctx.getWellRingCastNpc('hall_master');
    master.alive = false;
    const p = ctx.getNpcTiePerspective('tie_wr_liang_redwell_city_lord', 'seat:redwell:city_lord');
    assert(p.otherAlive === false, 'dead world participant reported from perspective');
    assert(ctx.isNpcTieParticipantAlive('seat:redwell:city_lord') === true, 'seat holder counts as present');
    assert(ctx.getNpcTiesFor('wr_master_liang').length === 1, 'ties remain queryable after death');
}

// --- Player relationship APIs unchanged (quests-style map) ---
{
    const ctx = boot({ npcRelationships: { merchant_su: 5 } });
    assert(ctx.G.npcRelationships.merchant_su === 5, 'G.npcRelationships still the player arc score bag');
    ctx.migrateNpcAgencyFoundationsAndTies();
    assert(ctx.G.npcRelationships.merchant_su === 5, 'migration does not clear player relationships');
}

if (failed) {
    console.error(`\n${failed} failure(s)`);
    process.exit(1);
}
console.log('\nAll NPC foundations/ties tests passed.');
