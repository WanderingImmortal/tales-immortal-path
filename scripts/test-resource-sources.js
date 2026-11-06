/**
 * Shared resource sources & Dewcatch wilderness regeneration (PR #209).
 * Run: node scripts/test-resource-sources.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
let failed = 0;

function fail(msg) {
    console.error('FAIL: ' + msg);
    failed += 1;
}
function ok(msg) {
    console.log('ok: ' + msg);
}
function assert(cond, msg) {
    if (!cond) fail(msg);
    else ok(msg);
}
function read(rel) {
    return fs.readFileSync(path.join(root, rel), 'utf8');
}

const WORLD_LOCATIONS = {
    redwell: {
        id: 'redwell', parentZone: 'dustbone', type: 'city', name: 'Redwell',
        tags: ['City', 'Market']
    },
    dewcatch_scrub: {
        id: 'dewcatch_scrub', parentZone: 'dustbone', type: 'wilderness', name: 'Dewcatch Scrub',
        tags: ['Explore', 'Herbs', 'Field']
    },
    salt_bloom_flats: {
        id: 'salt_bloom_flats', parentZone: 'dustbone', type: 'wilderness', name: 'Salt Bloom Flats',
        tags: ['Explore', 'Herbs', 'Field'], resources: ['herbs', 'salt']
    },
    brine_well_hamlet: { id: 'brine_well_hamlet', parentZone: 'dustbone', name: 'Brine', tags: ['Village'] },
    ironscar_quarry: { id: 'ironscar_quarry', parentZone: 'dustbone', name: 'Ironscar', tags: ['Field'] },
    bonehollow_caverns: { id: 'bonehollow_caverns', parentZone: 'dustbone', name: 'Bonehollow', tags: ['Field'] },
    scorpion_flats: { id: 'scorpion_flats', parentZone: 'dustbone', name: 'Scorpion', tags: ['Field'] },
    windcut_ridge: { id: 'windcut_ridge', parentZone: 'dustbone', name: 'Windcut', tags: ['Cultivation'] },
    copper_vein_cut: { id: 'copper_vein_cut', parentZone: 'dustbone', name: 'Copper', tags: ['Mine'] },
    red_dune_pass: { id: 'red_dune_pass', parentZone: 'dustbone', name: 'Pass', tags: ['Road'] },
    bone_crossroads: { id: 'bone_crossroads', parentZone: 'dustbone', name: 'Threshold', tags: ['City'] }
};

const ZONE_LOCAL_LAYOUT = {
    dustbone: {
        paths: [
            { from: 'brine_well_hamlet', to: 'redwell' },
            { from: 'salt_bloom_flats', to: 'brine_well_hamlet' },
            { from: 'dewcatch_scrub', to: 'redwell' },
            { from: 'ironscar_quarry', to: 'redwell' },
            { from: 'bonehollow_caverns', to: 'ironscar_quarry' },
            { from: 'scorpion_flats', to: 'bonehollow_caverns' },
            { from: 'windcut_ridge', to: 'scorpion_flats' },
            { from: 'copper_vein_cut', to: 'windcut_ridge' },
            { from: 'redwell', to: 'red_dune_pass' },
            { from: 'red_dune_pass', to: 'bone_crossroads' }
        ]
    }
};

function boot(extraG) {
    const G = Object.assign({
        ageMonths: 360,
        worldNpcs: [],
        wellRing: null,
        npcTies: null,
        npcIncidents: null,
        npcObservations: null,
        npcBeliefs: null,
        npcDecisions: null,
        npcSituationThreads: null,
        npcSituationOutcomes: null,
        npcAmbitions: null,
        npcGoals: null,
        npcGoalAttempts: null,
        npcTravel: null,
        world: null,
        worldSchedule: [],
        currentZone: 'dustbone',
        currentLocation: 'redwell'
    }, extraG || {});
    const WORLD_TICKS = [];
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
        ACTION_MONTHS: { localTravel: 2, travel: 8 },
        WORLD_LOCATIONS,
        ZONE_LOCAL_LAYOUT,
        ensureNpcPersonalities: (npc) => {
            if (!npc.personalities || !npc.personalities.length) npc.personalities = ['careful'];
            return npc.personalities;
        },
        WORLD_TICKS,
        registerWorldTick(id, fn, priority) {
            WORLD_TICKS.push({ id, fn, priority: priority != null ? priority : 50 });
        },
        registerWorldEventHandler() {},
        scheduleWorldEvent(type, atMonths, payload, opts) {
            opts = opts || {};
            const id = opts.id || (type + '_' + atMonths);
            G.worldSchedule = (G.worldSchedule || []).filter(e => e.id !== id);
            G.worldSchedule.push({ id, type, at: Math.floor(atMonths), payload: payload || {} });
            return id;
        },
        cancelWorldEvents(filterFn) {
            G.worldSchedule = (G.worldSchedule || []).filter(e => !filterFn(e));
        },
        hasScheduledWorldEvent() { return false; }
    });
    [
        'npc-foundations.js',
        'npc-ties.js',
        'well-ring-lodge.js',
        'npc-travel.js',
        'npc-incidents.js',
        'npc-decisions.js',
        'npc-situations.js',
        'resource-sources.js',
        'npc-ambitions.js',
        'npc-converse.js'
    ].forEach(f => vm.runInContext(read(f), ctx, { filename: f }));
    ctx.ensureWellRingState = function () {
        if (!ctx.G.wellRing) {
            ctx.G.wellRing = {
                member: false, merit: 0, rivalMerit: 4,
                lastMissionMonth: 0, lastBoardMonth: -1, lastTournamentYear: -1,
                tournamentDue: false, manualClaimed: false, dirtyDone: 0,
                heardFeeScam: false, joinMonth: 0
            };
        }
        ctx.ensureWellRingLodgeCast();
        return ctx.G.wellRing;
    };
    ctx.WORLD_TICKS = WORLD_TICKS;
    return ctx;
}

function weiOf(ctx) {
    ctx.ensureWellRingState();
    return ctx.getWellRingCastNpc('rival');
}

function placeWeiAtDewcatch(ctx) {
    const wei = weiOf(ctx);
    ctx.ensureNpcTravelState(wei);
    wei.travel.status = 'settled';
    wei.travel.locationId = 'dewcatch_scrub';
    wei.travel.originId = null;
    wei.travel.destinationId = null;
    wei.travel.arrivesAtMonths = null;
    wei.travel.arrivalApplied = true;
    wei.travel.fieldStayCount = 0;
    return wei;
}

function runTicks(ctx, months) {
    ctx.G.ageMonths = (ctx.G.ageMonths || 0) + months;
    const ticks = ctx.WORLD_TICKS.slice().sort((a, b) => a.priority - b.priority);
    ticks.forEach(t => t.fn(months));
}

const SOURCE_ID = 'dewcatch_scrub_spirit_herbs';

// 1. Initial stock and regeneration
{
    const ctx = boot();
    ctx.migrateResourceSourcesForExistingSave();
    const src = ctx.getResourceSource(SOURCE_ID);
    assert(src && src.type === 'regenerating_stock', 'Dewcatch source is regenerating_stock');
    assert(src.stock === 6 && src.maxStock === 10, 'provisional initial stock 6 / max 10');
    assert(src.locationId === 'dewcatch_scrub' && src.resourceId === 'spirit_herb', 'location + resource identity');
    ctx.debugSetResourceSourceStock(SOURCE_ID, 4);
    ctx.G.ageMonths += 4; // two regen periods of 2 months
    assert(ctx.getResourceSourceStock(SOURCE_ID) === 6, 'regen adds bounded stock over time');
}

// 2–3. Depletion and capacity clamp
{
    const ctx = boot();
    ctx.ensureAllAuthoredResourceSources();
    ctx.debugSetResourceSourceStock(SOURCE_ID, 10);
    const wei = placeWeiAtDewcatch(ctx);
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 0;
    const t1 = ctx.transferFromResourceSource({
        sourceId: SOURCE_ID,
        amount: 3,
        resourceId: 'spirit_herb',
        actorId: wei.uid,
        receiver: { kind: 'npc_spirit_herbs', actorId: wei.uid }
    });
    assert(t1.ok && t1.stockAfter === 7, 'stock depletes on successful transfer');
    assert(ctx.getNpcSpiritHerbs(wei.uid) === 3, 'receiver credited once');
    ctx.debugSetResourceSourceStock(SOURCE_ID, 9);
    ctx.G.ageMonths += 100;
    assert(ctx.getResourceSourceStock(SOURCE_ID) === 10, 'regen never exceeds maxStock');
}

// 4. Multiple actors share stock
{
    const ctx = boot();
    ctx.ensureWellRingState();
    ctx.ensureAllAuthoredResourceSources();
    ctx.debugSetResourceSourceStock(SOURCE_ID, 2);
    const wei = placeWeiAtDewcatch(ctx);
    const liang = ctx.getWellRingCastNpc('hall_master');
    ctx.ensureNpcTravelState(liang);
    liang.travel.status = 'settled';
    liang.travel.locationId = 'dewcatch_scrub';
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 0;
    ctx.ensureNpcCultivationPouch(liang).spiritHerbs = 0;
    const a = ctx.transferFromResourceSource({
        sourceId: SOURCE_ID, amount: 1, resourceId: 'spirit_herb',
        actorId: wei.uid, receiver: { kind: 'npc_spirit_herbs', actorId: wei.uid }
    });
    const b = ctx.transferFromResourceSource({
        sourceId: SOURCE_ID, amount: 1, resourceId: 'spirit_herb',
        actorId: liang.uid, receiver: { kind: 'npc_spirit_herbs', actorId: liang.uid }
    });
    const c = ctx.transferFromResourceSource({
        sourceId: SOURCE_ID, amount: 1, resourceId: 'spirit_herb',
        actorId: wei.uid, receiver: { kind: 'npc_spirit_herbs', actorId: wei.uid }
    });
    assert(a.ok && b.ok && !c.ok && c.reason === 'insufficient_stock', 'two gatherers share one stock; third fails');
    assert(ctx.getResourceSourceStock(SOURCE_ID) === 0, 'shared source empty after two takes');
}

// 5–6. Failed transfer unchanged; success credits once; duplicate rejected
{
    const ctx = boot();
    const wei = placeWeiAtDewcatch(ctx);
    ctx.ensureAllAuthoredResourceSources();
    ctx.debugSetResourceSourceStock(SOURCE_ID, 5);
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 1;
    const badId = ctx.transferFromResourceSource({
        sourceId: SOURCE_ID, amount: 1, resourceId: 'wrong_herb',
        actorId: wei.uid, receiver: { kind: 'npc_spirit_herbs', actorId: wei.uid }
    });
    assert(!badId.ok && badId.reason === 'resource_mismatch', 'resource identity validated');
    assert(ctx.getResourceSourceStock(SOURCE_ID) === 5 && ctx.getNpcSpiritHerbs(wei.uid) === 1, 'failed transfer leaves stock and pouch');

    const key = 'test_acq_once';
    const ok1 = ctx.transferFromResourceSource({
        sourceId: SOURCE_ID, amount: 2, resourceId: 'spirit_herb',
        actorId: wei.uid, acquisitionKey: key,
        receiver: { kind: 'npc_spirit_herbs', actorId: wei.uid }
    });
    const ok2 = ctx.transferFromResourceSource({
        sourceId: SOURCE_ID, amount: 2, resourceId: 'spirit_herb',
        actorId: wei.uid, acquisitionKey: key,
        receiver: { kind: 'npc_spirit_herbs', actorId: wei.uid }
    });
    assert(ok1.ok && ctx.getNpcSpiritHerbs(wei.uid) === 3, 'successful transfer credits exactly once');
    assert(!ok2.ok && ok2.reason === 'duplicate_acquisition', 'duplicate acquisition key rejected');
    assert(ctx.getResourceSourceStock(SOURCE_ID) === 3, 'duplicate does not debit again');
}

// 7. Player compatibility gap documented — no silent equivalence
{
    const src = read('resource-sources.js');
    const idea = read('docs/ideas/resource-sources-wilderness-regen.md');
    assert(/playerShared:\s*false/.test(src), 'Dewcatch spirit-herb source is not player-shared');
    assert(/dust_root|dawn_dew/.test(idea) && /not auto-mapped|Distinct from player/i.test(idea + src),
        'docs keep player alchemy mats separate from NPC spirit herbs');
    assert(/ABSTRACT_RESOURCE_REWARDS/.test(src) && /lodge_duty_herb_stipend/.test(src),
        'lodge duty remains an abstract reward class');
}

// 8. Save/load
{
    const ctx = boot();
    ctx.ensureAllAuthoredResourceSources();
    ctx.debugSetResourceSourceStock(SOURCE_ID, 2);
    ctx.G.ageMonths = 400;
    const live = ctx.ensureResourceSource(SOURCE_ID, { skipRegen: true });
    live.lastProcessedMonths = 400;
    const snap = JSON.parse(JSON.stringify({
        ageMonths: ctx.G.ageMonths,
        world: ctx.G.world,
        worldNpcs: ctx.G.worldNpcs,
        wellRing: ctx.G.wellRing
    }));
    const ctx2 = boot({
        ageMonths: snap.ageMonths,
        world: snap.world,
        worldNpcs: snap.worldNpcs,
        wellRing: snap.wellRing
    });
    ctx2.migrateResourceSourcesForExistingSave();
    assert(ctx2.getResourceSourceStock(SOURCE_ID) === 2, 'stock survives save/load');
    ctx2.G.ageMonths = 404;
    assert(ctx2.getResourceSourceStock(SOURCE_ID) === 4, 'regen resumes from saved lastProcessedMonths');
}

// 9. Large world-time skip
{
    const ctx = boot({ ageMonths: 100 });
    ctx.ensureAllAuthoredResourceSources();
    ctx.debugSetResourceSourceStock(SOURCE_ID, 0);
    const live = ctx.ensureResourceSource(SOURCE_ID, { skipRegen: true });
    live.lastProcessedMonths = 100;
    ctx.G.ageMonths = 1000;
    assert(ctx.getResourceSourceStock(SOURCE_ID) === 10, 'large skip regenerates to max only');
}

// 10. Gathering while absent / travelling
{
    const ctx = boot();
    const wei = weiOf(ctx);
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 0;
    ctx.ensureAllAuthoredResourceSources();
    const stockBefore = ctx.getResourceSourceStock(SOURCE_ID);
    const travelling = ctx.beginNpcJourney(wei, {
        destinationId: 'dewcatch_scrub',
        purpose: 'cultivation_resources'
    });
    assert(travelling.ok, 'can start journey toward Dewcatch');
    const blocked = ctx.executeNpcResourceAction(wei.uid, 'gather_field_herbs', {
        developer: true, forceFieldHerb: 'gain', seed: 1
    });
    assert(blocked.blockedReason === 'in_transit' || (blocked.effects || []).some(e => e.type === 'journey_started'),
        'cannot extract while travelling (in transit or only starts/continues road)');
    // Force a present-check path: leave him travelling and call field executor after mock arrival fail
    assert(ctx.getResourceSourceStock(SOURCE_ID) === stockBefore, 'travel does not deplete field stock');

    // Settled at lodge — gather starts journey, does not take stock
    ctx.G.ageMonths = wei.travel.arrivesAtMonths;
    ctx.tickNpcTravel();
    // send home first
    ctx.beginNpcJourney(wei, { destinationId: 'redwell', purpose: 'return_home' });
    ctx.G.ageMonths = wei.travel.arrivesAtMonths;
    ctx.tickNpcTravel();
    const stockHome = ctx.getResourceSourceStock(SOURCE_ID);
    const fromHome = ctx.executeNpcResourceAction(wei.uid, 'gather_field_herbs', {
        developer: true, forceFieldHerb: 'gain', seed: 2
    });
    assert(fromHome.travelProgress || (fromHome.effects || []).some(e => e.type === 'journey_started'),
        'from lodge, gather begins travel rather than extracting');
    assert(ctx.getResourceSourceStock(SOURCE_ID) === stockHome, 'departure does not take herbs');
}

// 11–12. Wei gather, return home, depleted field
{
    const ctx = boot();
    const wei = placeWeiAtDewcatch(ctx);
    wei.personalities = ['ambitious', 'bold'];
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 2;
    ctx.ensureAllAuthoredResourceSources();
    ctx.debugSetResourceSourceStock(SOURCE_ID, 3);
    const gathered = ctx.executeNpcResourceAction(wei.uid, 'gather_field_herbs', {
        developer: true, forceFieldHerb: 'gain', seed: 9
    });
    assert(gathered.herbsGained && ctx.getNpcSpiritHerbs(wei.uid) === 3, 'Wei pouch receives gathered herbs');
    assert(ctx.getResourceSourceStock(SOURCE_ID) === 2, 'Dewcatch stock reduced by gather');
    assert(ctx.isNpcTravelling(wei) && wei.travel.purpose === 'return_home', 'enough herbs sends Wei home');

    const ctx2 = boot();
    const wei2 = placeWeiAtDewcatch(ctx2);
    wei2.personalities = ['ambitious', 'bold'];
    ctx2.ensureNpcCultivationPouch(wei2).spiritHerbs = 0;
    ctx2.ensureAllAuthoredResourceSources();
    ctx2.debugSetResourceSourceStock(SOURCE_ID, 0);
    const empty = ctx2.executeNpcResourceAction(wei2.uid, 'gather_field_herbs', {
        developer: true, forceFieldHerb: 'gain', seed: 9
    });
    assert(empty.fieldDepleted || empty.notes.indexOf('picked clean') >= 0, 'depleted field reported');
    assert(ctx2.getNpcSpiritHerbs(wei2.uid) === 0, 'no phantom herbs on empty field');
    assert(ctx2.isNpcTravelling(wei2) && wei2.travel.purpose === 'return_home',
        'depleted field does not trap Wei at Dewcatch');
}

// 13. Lodge theft conservation unchanged
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const stock = ctx.getWellRingStorehouseHerbStock();
    const wei = weiOf(ctx);
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 0;
    const blocked = ctx.executeNpcResourceAction(wei.uid, 'steal_lodge_storehouse', {
        developer: true,
        forceTheftOutcome: 'success_undetected',
        seed: 1
    });
    // Drain storehouse then retry
    ctx.ensureWellRingStorehouse().herbStock = 1;
    const short = ctx.executeNpcResourceAction(wei.uid, 'steal_lodge_storehouse', {
        developer: true,
        forceTheftOutcome: 'success_undetected',
        seed: 1
    });
    assert(short.blockedReason === 'insufficient_storehouse_stock', 'theft still stock-gated');
    assert(ctx.getWellRingStorehouseHerbStock() === 1, 'failed theft leaves storehouse unchanged');
    assert(stock >= 1, 'baseline storehouse still present beside wilderness sources');
}

// 14. No regression: presence + abstract duty
{
    const ctx = boot();
    const wei = weiOf(ctx);
    const duty = ctx.executeNpcResourceAction(wei.uid, 'earn_lodge_duty', { seed: 4 });
    assert(duty.success && (duty.effects || []).some(e => e.source === 'lodge_duty'),
        'lodge duty remains abstract stipend path');
    assert(ctx.isAbstractResourceReward('lodge_duty_herb_stipend'), 'abstract reward registry includes lodge duty');
    const abs = ctx.grantAbstractResourceReward({
        abstractId: 'lodge_duty_herb_stipend',
        amount: 1,
        actorId: wei.uid,
        receiver: { kind: 'npc_spirit_herbs', actorId: wei.uid }
    });
    assert(abs.ok && abs.abstract, 'abstract grant does not touch location stock');
    const fieldStock = ctx.getResourceSourceStock(SOURCE_ID);
    assert(fieldStock === 6, 'abstract grant left Dewcatch stock alone');
}

// Schema / contract smoke
{
    const src = read('resource-sources.js');
    assert(/finite_stock/.test(src) && /regenerating_stock/.test(src) && /abstract_reward/.test(src),
        'contract exposes the three source types');
    assert(/registerWorldTick\('resourceSources'/.test(src), 'regen uses shared world tick');
}

if (failed) {
    console.error('\n' + failed + ' failure(s)');
    process.exit(1);
}
console.log('\nAll resource-source tests passed.');
