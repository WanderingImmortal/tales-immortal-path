/**
 * Institutional procurement & Well-Ring storehouse replenishment (PR #210).
 * Run: node scripts/test-institutional-procurement.js
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
    redwell: { id: 'redwell', parentZone: 'dustbone', tags: ['City'] },
    dewcatch_scrub: { id: 'dewcatch_scrub', parentZone: 'dustbone', tags: ['Explore', 'Herbs', 'Field'] }
};
const ZONE_LOCAL_LAYOUT = {
    dustbone: { paths: [{ from: 'dewcatch_scrub', to: 'redwell' }] }
};

function boot(extraG) {
    const G = Object.assign({
        ageMonths: 400,
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
        scheduleWorldEvent() { return null; },
        cancelWorldEvents() {},
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

function runProcurementTicks(ctx, months) {
    ctx.G.ageMonths = (ctx.G.ageMonths || 0) + months;
    const ticks = ctx.WORLD_TICKS.slice().sort((a, b) => a.priority - b.priority);
    ticks.forEach(t => t.fn(months));
}

const PROC_ID = 'well_ring_herb_external';

// 1. Initial procurement state
{
    const ctx = boot();
    ctx.migrateWellRingLodgeForExistingSave();
    ctx.migrateResourceSourcesForExistingSave();
    const proc = ctx.getInstitutionalProcurement(PROC_ID);
    const sh = ctx.ensureWellRingStorehouse();
    assert(proc && proc.channelType === 'abstract_external_supply', 'Well-Ring uses abstract external supply');
    assert(proc.institutionId === 'well_ring_lodge' && proc.resourceId === 'spirit_herb', 'institution + resource ids');
    assert(proc.intervalMonths === 4 && proc.maxPerDelivery === 3 && proc.destinationCapacity === 24,
        'provisional interval 4 / delivery 3 / capacity 24');
    assert(proc.physicalSourceId == null, 'Dewcatch is not wired as lodge feeder');
    assert(sh.herbStock === 24 && sh.herbCapacity === 24, 'storehouse stock + capacity initialized');
    assert(sh.lossesById && Object.keys(sh.lossesById).length === 0, 'no loss records invented on init');
}

// 2–3. Scheduled replenishment and capacity limits
{
    const ctx = boot({ ageMonths: 100 });
    ctx.ensureWellRingState();
    ctx.ensureAllInstitutionalProcurement({ skipProcess: true });
    ctx.debugSetInstitutionalProcurementCursor(PROC_ID, 100);
    ctx.ensureWellRingStorehouse().herbStock = 20;
    ctx.G.ageMonths = 104;
    const r = ctx.processInstitutionalProcurement(ctx.ensureInstitutionalProcurement(PROC_ID, { skipProcess: true }), 104);
    assert(r.ok && r.delivered === 3, 'scheduled delivery adds maxPerDelivery when room exists');
    assert(ctx.getWellRingStorehouseHerbStock() === 23, 'stock increased by delivery');

    ctx.debugSetInstitutionalProcurementCursor(PROC_ID, 104);
    ctx.ensureWellRingStorehouse().herbStock = 24;
    ctx.G.ageMonths = 108;
    const full = ctx.processInstitutionalProcurement(ctx.ensureInstitutionalProcurement(PROC_ID, { skipProcess: true }), 108);
    assert(full.ok && full.delivered === 0, 'capacity-full delivery credits nothing');
    assert(ctx.getWellRingStorehouseHerbStock() === 24, 'full storehouse unchanged');
    const hist = ctx.listInstitutionalProcurementHistory({ procurementId: PROC_ID });
    assert(hist.some(h => h.reason === 'capacity_full'), 'capacity-full recorded in history');
}

// 4–5. Partial interval + same-time idempotency
{
    const ctx = boot({ ageMonths: 200 });
    ctx.ensureWellRingState();
    ctx.ensureAllInstitutionalProcurement({ skipProcess: true });
    ctx.debugSetInstitutionalProcurementCursor(PROC_ID, 200);
    ctx.ensureWellRingStorehouse().herbStock = 10;
    const live = ctx.ensureInstitutionalProcurement(PROC_ID, { skipProcess: true });
    const partial = ctx.processInstitutionalProcurement(live, 202);
    assert(partial.delivered === 0 && partial.reason === 'partial_interval', 'partial interval does not deliver');
    assert(live.lastProcessedMonths === 200, 'partial interval preserves procurement cursor');
    ctx.processInstitutionalProcurement(live, 202);
    assert(live.lastProcessedMonths === 200 && ctx.getWellRingStorehouseHerbStock() === 10,
        'repeated same-time processing does not duplicate deliveries');
}

// 6. Long skip versus stepped time
{
    const ctx = boot({ ageMonths: 0 });
    ctx.ensureWellRingState();
    function jumpDeliver(startStock, startLast, endNow) {
        const c = boot({ ageMonths: endNow });
        c.ensureWellRingState();
        c.ensureAllInstitutionalProcurement({ skipProcess: true });
        c.debugSetInstitutionalProcurementCursor(PROC_ID, startLast);
        c.ensureWellRingStorehouse().herbStock = startStock;
        const live = c.ensureInstitutionalProcurement(PROC_ID, { skipProcess: true });
        c.processInstitutionalProcurement(live, endNow);
        return {
            stock: c.getWellRingStorehouseHerbStock(),
            last: live.lastProcessedMonths,
            history: c.listInstitutionalProcurementHistory({ procurementId: PROC_ID, onlyDeliveries: true }).length
        };
    }
    function stepDeliver(startStock, startLast, endNow) {
        const c = boot({ ageMonths: startLast });
        c.ensureWellRingState();
        c.ensureAllInstitutionalProcurement({ skipProcess: true });
        c.debugSetInstitutionalProcurementCursor(PROC_ID, startLast);
        c.ensureWellRingStorehouse().herbStock = startStock;
        const live = c.ensureInstitutionalProcurement(PROC_ID, { skipProcess: true });
        for (let t = startLast + 1; t <= endNow; t++) {
            c.G.ageMonths = t;
            c.processInstitutionalProcurement(live, t);
        }
        return {
            stock: c.getWellRingStorehouseHerbStock(),
            last: live.lastProcessedMonths,
            history: c.listInstitutionalProcurementHistory({ procurementId: PROC_ID, onlyDeliveries: true }).length
        };
    }
    const j = jumpDeliver(0, 100, 116); // 4 periods × 3 = 12
    const s = stepDeliver(0, 100, 116);
    assert(j.stock === 12 && s.stock === 12 && j.last === s.last,
        'long skip matches stepped procurement advances');
    assert(j.history === 4 && s.history === 4, 'four delivery records for four periods');
}

// 7. Save/load during a procurement interval
{
    const ctx = boot({ ageMonths: 301 });
    ctx.ensureWellRingState();
    ctx.ensureAllInstitutionalProcurement({ skipProcess: true });
    ctx.debugSetInstitutionalProcurementCursor(PROC_ID, 300);
    ctx.ensureWellRingStorehouse().herbStock = 5;
    const snap = JSON.parse(JSON.stringify({
        ageMonths: ctx.G.ageMonths,
        world: ctx.G.world,
        wellRing: ctx.G.wellRing,
        worldNpcs: ctx.G.worldNpcs
    }));
    const ctx2 = boot({
        ageMonths: snap.ageMonths,
        world: snap.world,
        wellRing: snap.wellRing,
        worldNpcs: snap.worldNpcs
    });
    ctx2.migrateWellRingLodgeForExistingSave();
    ctx2.migrateResourceSourcesForExistingSave();
    const live = ctx2.ensureInstitutionalProcurement(PROC_ID, { skipProcess: true });
    assert(live.lastProcessedMonths === 300 && ctx2.getWellRingStorehouseHerbStock() === 5,
        'partial procurement interval survives save/load');
    ctx2.G.ageMonths = 304;
    ctx2.processInstitutionalProcurement(live, 304);
    assert(ctx2.getWellRingStorehouseHerbStock() === 8, 'post-load boundary delivers once');
}

// 8. Legacy save migration preserves stock and losses
{
    const ctx = boot({
        ageMonths: 500,
        wellRing: {
            member: true, merit: 1, rivalMerit: 2,
            storehouse: {
                version: 1,
                herbStock: 7,
                lossesById: {
                    wrloss_old_1: {
                        id: 'wrloss_old_1', amount: 2, atMonths: 490,
                        discovered: true, trueCulpritId: 'wr_wei_shun'
                    }
                },
                pendingDiscoveryIds: [],
                reactedLossIds: ['wrloss_old_1'],
                lastInspectionMonths: 492,
                nextLossSeq: 2
            }
        },
        world: null
    });
    ctx.migrateWellRingLodgeForExistingSave();
    ctx.migrateResourceSourcesForExistingSave();
    assert(ctx.getWellRingStorehouseHerbStock() === 7, 'legacy herbStock preserved');
    assert(ctx.ensureWellRingStorehouse().lossesById.wrloss_old_1.amount === 2, 'legacy loss record preserved');
    assert(ctx.getInstitutionalProcurement(PROC_ID), 'procurement schedule created for legacy save');
    assert(ctx.getWellRingStorehouseHerbStock() === 7, 'migrate does not instantly restock');
}

// 9–10. Theft then delayed replenishment; empty recovery
{
    const ctx = boot({ ageMonths: 600 });
    ctx.ensureWellRingState();
    ctx.ensureAllInstitutionalProcurement({ skipProcess: true });
    ctx.debugSetInstitutionalProcurementCursor(PROC_ID, 600);
    const sh = ctx.ensureWellRingStorehouse();
    sh.herbStock = 24;
    const loss = ctx.recordWellRingStorehouseLoss({
        amount: 2,
        trueCulpritId: 'wr_wei_shun',
        item: 'spirit_herb_pouch'
    });
    assert(loss && ctx.getWellRingStorehouseHerbStock() === 22, 'theft reduces stock');
    // Same month — procurement must not instantly refill.
    ctx.processInstitutionalProcurement(ctx.ensureInstitutionalProcurement(PROC_ID, { skipProcess: true }), 600);
    assert(ctx.getWellRingStorehouseHerbStock() === 22, 'procurement does not instantly restore after theft');
    ctx.G.ageMonths = 604;
    ctx.processInstitutionalProcurement(ctx.ensureInstitutionalProcurement(PROC_ID, { skipProcess: true }), 604);
    assert(ctx.getWellRingStorehouseHerbStock() === 24, 'next interval restores up to capacity after theft');
    assert(ctx.ensureWellRingStorehouse().lossesById[loss.id], 'theft loss record still present after replenishment');

    const ctxEmpty = boot({ ageMonths: 700 });
    ctxEmpty.ensureWellRingState();
    ctxEmpty.ensureAllInstitutionalProcurement({ skipProcess: true });
    ctxEmpty.debugSetInstitutionalProcurementCursor(PROC_ID, 700);
    ctxEmpty.ensureWellRingStorehouse().herbStock = 0;
    ctxEmpty.G.ageMonths = 716; // 4 periods → +12
    ctxEmpty.processInstitutionalProcurement(
        ctxEmpty.ensureInstitutionalProcurement(PROC_ID, { skipProcess: true }),
        716
    );
    assert(ctxEmpty.getWellRingStorehouseHerbStock() === 12, 'empty storehouse recovers gradually');
}

// 11–12. Procurement does not erase losses; no duplicate delivery keys
{
    const ctx = boot({ ageMonths: 800 });
    ctx.ensureWellRingState();
    ctx.ensureAllInstitutionalProcurement({ skipProcess: true });
    ctx.debugSetInstitutionalProcurementCursor(PROC_ID, 800);
    ctx.ensureWellRingStorehouse().herbStock = 10;
    const loss = ctx.recordWellRingStorehouseLoss({ amount: 2, trueCulpritId: 'wr_wei_shun' });
    ctx.G.ageMonths = 804;
    const live = ctx.ensureInstitutionalProcurement(PROC_ID, { skipProcess: true });
    ctx.processInstitutionalProcurement(live, 804);
    ctx.processInstitutionalProcurement(live, 804); // same time again
    const deliveries = ctx.listInstitutionalProcurementHistory({ procurementId: PROC_ID })
        .filter(h => h.atMonths === 804);
    assert(deliveries.length === 1, 'no duplicate procurement records for one period');
    assert(ctx.getWellRingStorehouseLoss(loss.id).amount === 2, 'procurement does not erase loss records');
    assert(!ctx.getWellRingStorehouseLoss(loss.id).meta || !ctx.getWellRingStorehouseLoss(loss.id).meta.concealed,
        'replenishment does not conceal theft metadata');
}

// 13. Wei theft / duty / Dewcatch regression
{
    const ctx = boot();
    const wei = weiOf(ctx);
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 0;
    ctx.ensureWellRingStorehouse().herbStock = 0;
    const emptyTheft = ctx.executeNpcResourceAction(wei.uid, 'steal_lodge_storehouse', {
        developer: true, forceTheftOutcome: 'success_undetected', seed: 1
    });
    assert(emptyTheft.blockedReason === 'insufficient_storehouse_stock', 'empty storehouse still blocks theft');

    ctx.ensureWellRingStorehouse().herbStock = 5;
    const theft = ctx.executeNpcResourceAction(wei.uid, 'steal_lodge_storehouse', {
        developer: true, forceTheftOutcome: 'success_undetected', seed: 2
    });
    assert(theft.success && ctx.getNpcSpiritHerbs(wei.uid) === 2, 'successful theft still transfers herbs');
    assert(ctx.getWellRingStorehouseHerbStock() === 3, 'theft still depletes storehouse');

    const duty = ctx.executeNpcResourceAction(wei.uid, 'earn_lodge_duty', { seed: 3 });
    assert(duty.success && (duty.effects || []).some(e => e.source === 'lodge_duty'),
        'duty compensation remains abstract');

    // Dewcatch remains a separate physical source
    ctx.ensureAllAuthoredResourceSources();
    const dew = ctx.getResourceSourceStock('dewcatch_scrub_spirit_herbs');
    assert(dew === 6, 'Dewcatch stock independent of lodge procurement');
    assert(ctx.getInstitutionalProcurement(PROC_ID).physicalSourceId == null,
        'Wei cannot siphon procurement — no physical feeder link');
}

// 14. #209 source regeneration still works beside procurement
{
    const ctx = boot({ ageMonths: 100 });
    ctx.ensureAllAuthoredResourceSources();
    ctx.debugSetResourceSourceStock('dewcatch_scrub_spirit_herbs', 0);
    const live = ctx.ensureResourceSource('dewcatch_scrub_spirit_herbs', { skipRegen: true });
    live.lastProcessedMonths = 100;
    ctx.G.ageMonths = 110;
    assert(ctx.getResourceSourceStock('dewcatch_scrub_spirit_herbs') === 5, '#209 regen still clamps by period');
    runProcurementTicks(ctx, 0);
    assert(ctx.WORLD_TICKS.some(t => t.id === 'institutionalProcurement'), 'procurement uses shared world tick');
    assert(ctx.WORLD_TICKS.some(t => t.id === 'resourceSources'), 'resourceSources tick still registered');
}

// 15. NPC travel / presence regression smoke
{
    const ctx = boot();
    const wei = weiOf(ctx);
    const started = ctx.beginNpcJourney(wei, {
        destinationId: 'dewcatch_scrub',
        purpose: 'cultivation_resources'
    });
    assert(started.ok && ctx.isNpcTravelling(wei), 'travel still starts toward Dewcatch');
    assert(!ctx.isNpcPhysicallyPresentAt(wei, 'redwell'), 'travelling Wei not present at lodge');
    const dutyAway = ctx.executeNpcResourceAction(wei.uid, 'earn_lodge_duty', { seed: 1 });
    assert(dutyAway.blockedReason === 'not_present', 'lodge duty still presence-gated');
}

// Extensibility markers present
{
    const src = read('resource-sources.js');
    assert(/controlled_garden|controlled_mine|merchant|tribute|market/.test(src),
        'future procurement channel extension points exist');
    assert(/abstract_external_supply/.test(src), 'abstract external supply channel implemented');
}

if (failed) {
    console.error('\n' + failed + ' failure(s)');
    process.exit(1);
}
console.log('\nAll institutional procurement tests passed.');
