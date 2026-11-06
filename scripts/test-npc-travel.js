/**
 * NPC travel, capability, and presence.
 * Run: node scripts/test-npc-travel.js
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
    brine_well_hamlet: {
        id: 'brine_well_hamlet', parentZone: 'dustbone', type: 'city', name: 'Brine-Well Hamlet',
        tags: ['Village']
    },
    salt_bloom_flats: {
        id: 'salt_bloom_flats', parentZone: 'dustbone', type: 'wilderness', name: 'Salt Bloom Flats',
        tags: ['Explore', 'Herbs', 'Field'], resources: ['herbs', 'salt']
    },
    ironscar_quarry: { id: 'ironscar_quarry', parentZone: 'dustbone', name: 'Ironscar Quarry', tags: ['Field'] },
    bonehollow_caverns: { id: 'bonehollow_caverns', parentZone: 'dustbone', name: 'Bonehollow Caverns', tags: ['Field'] },
    scorpion_flats: { id: 'scorpion_flats', parentZone: 'dustbone', name: 'Scorpion Flats', tags: ['Field'] },
    windcut_ridge: { id: 'windcut_ridge', parentZone: 'dustbone', name: 'Windcut Ridge', tags: ['Cultivation'] },
    copper_vein_cut: { id: 'copper_vein_cut', parentZone: 'dustbone', name: 'Copper Vein Cut', tags: ['Mine'] },
    red_dune_pass: { id: 'red_dune_pass', parentZone: 'dustbone', name: 'Red Dune Pass', tags: ['Road'] },
    bone_crossroads: { id: 'bone_crossroads', parentZone: 'dustbone', name: 'Threshold City', tags: ['City'] },
    frost_gate: { id: 'frost_gate', parentZone: 'frostbite', name: 'Frost Gate Outpost', tags: ['Supplies'] },
    frostpeak_monastery: { id: 'frostpeak_monastery', parentZone: 'frostbite', name: 'Frostpeak Monastery Gate', tags: ['Faction'] }
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
    },
    frostbite: {
        paths: [{ from: 'frost_gate', to: 'frostpeak_monastery' }]
    }
};

function boot() {
    const G = {
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
        worldSchedule: [],
        currentZone: 'dustbone',
        currentLocation: 'redwell'
    };
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

// 1. Valid connected travel
{
    const ctx = boot();
    const wei = weiOf(ctx);
    const started = ctx.beginNpcJourney(wei, {
        destinationId: 'dewcatch_scrub',
        purpose: 'cultivation_resources'
    });
    assert(started.ok && started.method === 'walk' && started.months === 2, 'walks an existing one-hop route in two months');
    assert(ctx.isNpcTravelling(wei), 'status is travelling after departure');
    assert(wei.travel.locationId == null, 'no settled location while on the road');
    assert(wei.travel.originId === 'redwell' && wei.travel.destinationId === 'dewcatch_scrub', 'origin and destination stored');
    assert(wei.travel.purpose === 'cultivation_resources', 'purpose stored apart from method');
    assert(!ctx.isNpcPhysicallyPresentAt(wei, 'redwell'), 'not present at origin while travelling');
    assert(!ctx.isNpcPhysicallyPresentAt(wei, 'dewcatch_scrub'), 'not present at destination while travelling');
    assert(ctx.G.npcTravel.activeUids.length === 1, 'journey indexed without scanning every NPC');
}

// 2. Invalid destinations
{
    const ctx = boot();
    const wei = weiOf(ctx);
    const unknown = ctx.beginNpcJourney(wei, { destinationId: 'not_a_place', purpose: 'cultivation_resources' });
    assert(!unknown.ok && unknown.reason === 'unknown_destination', 'unknown destination rejected');
    const cross = ctx.beginNpcJourney(wei, { destinationId: 'frost_gate', purpose: 'cultivation_resources' });
    assert(!cross.ok && cross.reason === 'no_route', 'unconnected location rejected');
    assert(!ctx.isNpcTravelling(wei), 'failed departures do not start a journey');
}

// 3–4. Method eligibility and realm
{
    const ctx = boot();
    const wei = weiOf(ctx);
    assert((wei.realmIdx || 0) === 0, 'Wei starts at Qi Condensation');
    const flight = ctx.beginNpcJourney(wei, {
        destinationId: 'dewcatch_scrub',
        purpose: 'cultivation_resources',
        method: 'flight'
    });
    assert(!flight.ok && flight.reason === 'method_unavailable', 'flight rejected for a Qi Condensation disciple');
    const opts = ctx.evaluateNpcTravelMethods(wei, 'dewcatch_scrub');
    const walk = opts.find(o => o.id === 'walk');
    const light = opts.find(o => o.id === 'light_body');
    const fly = opts.find(o => o.id === 'flight');
    assert(walk.eligible && walk.months === 2, 'walking is available');
    assert(!light.eligible && /Core Formation/.test(light.reason), 'light-body waits for Core Formation');
    assert(!fly.eligible && /Nascent Soul/.test(fly.reason), 'flight waits for Nascent Soul');

    const core = { alive: true, realmIdx: 2, homeLocationId: 'redwell', personalities: ['bold'] };
    const coreOpts = ctx.evaluateNpcTravelMethods(core, 'dewcatch_scrub');
    assert(coreOpts.find(o => o.id === 'light_body').eligible, 'Core Formation can use light-body');
    assert(!coreOpts.find(o => o.id === 'flight').eligible, 'Core Formation cannot fly');

    const nascent = {
        alive: true, realmIdx: 3, homeLocationId: 'redwell',
        personalities: ['bold', 'ambitious']
    };
    const flyChoice = ctx.chooseNpcTravelMethod(nascent, 'dewcatch_scrub', {
        purpose: 'cultivation_resources',
        pressure: 0.8,
        personalities: nascent.personalities
    });
    assert(flyChoice.ok && flyChoice.method === 'flight', 'bold ambitious Nascent Soul may choose flight under pressure');
    const careful = {
        alive: true, realmIdx: 3, homeLocationId: 'redwell',
        personalities: ['careful', 'loyal']
    };
    const walkChoice = ctx.chooseNpcTravelMethod(careful, 'dewcatch_scrub', {
        purpose: 'cultivation_resources',
        pressure: 0,
        personalities: careful.personalities
    });
    assert(walkChoice.ok && walkChoice.method === 'walk', 'careful loyal Nascent Soul can still prefer walking');

    const hurt = { alive: true, realmIdx: 3, injured: true, homeLocationId: 'redwell', personalities: ['bold'] };
    const hurtOpts = ctx.evaluateNpcTravelMethods(hurt, 'dewcatch_scrub');
    assert(hurtOpts.find(o => o.id === 'walk').eligible, 'injury still allows walking');
    assert(!hurtOpts.find(o => o.id === 'flight').eligible, 'injury blocks flight');
    const down = { alive: true, realmIdx: 3, incapacitated: true, homeLocationId: 'redwell' };
    assert(ctx.evaluateNpcTravelMethods(down, 'dewcatch_scrub').every(o => !o.eligible), 'incapacitated cannot travel');
}

// Route realm gate on an authored field
{
    const ctx = boot();
    const wei = weiOf(ctx);
    WORLD_LOCATIONS.dewcatch_scrub.minRealm = 4;
    const blocked = ctx.beginNpcJourney(wei, { destinationId: 'dewcatch_scrub', purpose: 'cultivation_resources' });
    delete WORLD_LOCATIONS.dewcatch_scrub.minRealm;
    assert(!blocked.ok && blocked.reason === 'route_restricted', 'route realm requirement rejects the journey');
}

// 5. Worth uses familiarity, not hidden danger
{
    const ctx = boot();
    const wei = weiOf(ctx);
    ctx.ensureNpcTravelState(wei);
    const near = ctx.assessNpcJourneyWorth(wei, 'dewcatch_scrub', { purpose: 'cultivation_resources', pressure: 1 });
    const far = ctx.assessNpcJourneyWorth(wei, 'copper_vein_cut', { purpose: 'cultivation_resources', pressure: 1 });
    assert(near.worthwhile && near.unfamiliar === false, 'nearby familiar herb ground is worth the trip');
    assert(!far.worthwhile && far.unfamiliar === true, 'long unfamiliar ground is not automatically worth it');
    const src = read('npc-travel.js');
    assert(!/dangerRealm|ENCOUNTER_BALANCE|zone\.events/.test(src), 'travel judgement does not read hidden danger tables');
}

// 6–8. Wei herb loop: depart, time, arrive, gather, return, lodge available again
{
    const ctx = boot();
    const wei = weiOf(ctx);
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 0;
    const beforeFails = 0;
    const departed = ctx.pursueNpcAmbitionGoal(wei.uid, {
        developer: true,
        ignoreCooldown: true,
        seed: 3,
        forceAction: 'gather_field_herbs'
    });
    assert(departed.ok && departed.actionId === 'gather_field_herbs', 'cultivation goal can choose a field journey');
    assert(ctx.isNpcTravelling(wei), 'Wei is on the road');
    assert(wei.travel.destinationId === 'dewcatch_scrub', 'destination is existing Dewcatch Scrub');
    assert(wei.travel.method === 'walk', 'Qi Condensation Wei walks');
    const goal = ctx.getNpcGoalsFor(wei.uid, { activeOnly: true })[0];
    assert((goal.failureCount || 0) === beforeFails, 'departure is not counted as a failed ambition');
    assert(ctx.getNpcAmbition(goal.ambitionId).status === 'active', 'travel does not cancel the ambition');

    const dutyWhileGone = ctx.executeNpcResourceAction(wei.uid, 'earn_lodge_duty', { seed: 1 });
    const theftWhileGone = ctx.executeNpcResourceAction(wei.uid, 'steal_lodge_storehouse', { seed: 1, developer: true });
    assert(dutyWhileGone.blockedReason === 'not_present', 'lodge duty blocked while travelling');
    assert(theftWhileGone.blockedReason === 'not_present', 'storehouse theft blocked while travelling');
    assert(!ctx.isNpcAvailableForInPersonAt(wei, 'redwell'), 'in-person lodge talk blocked while travelling');
    assert(!ctx.canWorldNpcConverse(wei), 'conversation blocked while travelling');

    const incident = ctx.createNpcIncident({
        type: 'theft', zoneId: 'dustbone', locationId: 'redwell', severity: 2,
        facts: { what: 'heard_while_away' }
    });
    const obs = ctx.recordNpcObservation({
        observerId: wei.uid,
        incidentId: incident.id,
        source: 'report',
        confidence: 0.4,
        details: { note: 'A letter caught up with him on the road.' }
    });
    assert(obs && obs.observerId === wei.uid, 'absence does not block remote knowledge');
    assert(ctx.isNpcTravelling(wei), 'learning something does not teleport him');

    const sit = ctx.startWellRingResourceAccusationScenario({
        forceChoice: 'speak_to_accused',
        accusedId: wei.uid,
        evidenceStrength: 'strong',
        liangBeliefConfidence: 0.8,
        decideImmediately: true,
        seed: 4
    });
    assert(sit.thread && sit.thread.status === 'active', 'in-person accusation waits instead of resolving');
    assert(sit.thread.meta && sit.thread.meta.lastTrace && sit.thread.meta.lastTrace.deferred, 'situation defers while the accused is away');

    ctx.G.ageMonths = wei.travel.arrivesAtMonths - 1;
    ctx.tickNpcTravel();
    assert(ctx.isNpcTravelling(wei), 'arrival waits until the clock reaches the month');
    wei.growthProgress = 4;
    ctx.G.ageMonths = wei.travel.arrivesAtMonths;
    ctx.tickNpcTravel();
    ctx.tickNpcTravel();
    assert(!ctx.isNpcTravelling(wei), 'arrival clears travelling');
    assert(wei.travel.locationId === 'dewcatch_scrub', 'arrival settles at Dewcatch');
    assert(wei.travel.completionCount === 1, 'arrival is applied once');
    assert(wei.growthProgress === 4, 'travel resolution does not wipe cultivation progress');
    assert(ctx.isNpcPhysicallyPresentAt(wei, 'dewcatch_scrub'), 'present at the field after arrival');
    assert(!ctx.isNpcPhysicallyPresentAt(wei, 'redwell'), 'not still at the lodge');

    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 0;
    const stayed = ctx.pursueNpcAmbitionGoal(wei.uid, {
        developer: true,
        ignoreCooldown: true,
        seed: 5,
        forceAction: 'gather_field_herbs',
        forceFieldHerb: 'none'
    });
    assert(stayed.ok && stayed.result && stayed.result.fieldGathered, 'field work happens at the herb ground');
    assert(!ctx.isNpcTravelling(wei) && wei.travel.locationId === 'dewcatch_scrub', 'short of herbs, bold Wei remains');
    assert((wei.travel.fieldStayCount || 0) >= 1, 'stay is recorded');

    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 2;
    const growthBefore = wei.growthProgress || 0;
    const finished = ctx.pursueNpcAmbitionGoal(wei.uid, {
        developer: true,
        ignoreCooldown: true,
        seed: 6,
        forceAction: 'gather_field_herbs',
        forceFieldHerb: 'gain'
    });
    assert(finished.ok, 'a successful gather completes the field beat');
    assert(ctx.isNpcTravelling(wei) && wei.travel.purpose === 'return_home', 'enough herbs sends him home');
    assert(wei.travel.destinationId === 'redwell', 'return destination is the lodge');
    assert((wei.growthProgress || 0) > growthBefore, 'cultivation progress still applies when the return starts');
    const backAt = wei.travel.arrivesAtMonths;
    ctx.G.ageMonths = backAt;
    ctx.tickNpcTravel();
    assert(wei.travel.locationId === 'redwell' && !ctx.isNpcTravelling(wei), 'return restores the lodge');
    const duty = ctx.executeNpcResourceAction(wei.uid, 'earn_lodge_duty', { seed: 2 });
    assert(duty.blockedReason !== 'not_present', 'lodge duty works again after arrival');
    assert(ctx.isNpcAvailableForInPersonAt(wei, 'redwell'), 'in-person availability returns with him');
}

// 9. Save/load mid-journey
{
    const ctx = boot();
    const wei = weiOf(ctx);
    ctx.beginNpcJourney(wei, { destinationId: 'dewcatch_scrub', purpose: 'cultivation_resources' });
    const blob = JSON.parse(JSON.stringify({
        travel: wei.travel,
        reg: ctx.G.npcTravel,
        age: ctx.G.ageMonths
    }));
    wei.travel = { status: 'present', locationId: 'redwell' };
    ctx.G.npcTravel = { version: 1, activeUids: [] };
    wei.travel = blob.travel;
    ctx.G.npcTravel = blob.reg;
    ctx.G.ageMonths = blob.age;
    assert(ctx.isNpcTravelling(wei) && wei.travel.arrivesAtMonths === blob.travel.arrivesAtMonths, 'save/load restores the open journey');
    ctx.G.ageMonths = blob.travel.arrivesAtMonths;
    ctx.tickNpcTravel();
    assert(wei.travel.locationId === 'dewcatch_scrub' && wei.travel.completionCount === 1, 'restored journey arrives once');
}

// 10. Large time skip once; segmented months also once
{
    const ctx = boot();
    const wei = weiOf(ctx);
    ctx.beginNpcJourney(wei, { destinationId: 'bone_crossroads', purpose: 'cultivation_resources' });
    assert(!ctx.isNpcPhysicallyPresentAt(wei, 'red_dune_pass'), 'no intermediate presence on a multi-hop road');
    const arrive = wei.travel.arrivesAtMonths;
    ctx.G.ageMonths = arrive + 80;
    ctx.tickNpcTravel();
    ctx.tickNpcTravel();
    assert(wei.travel.completionCount === 1 && wei.travel.locationId === 'bone_crossroads', 'a large skip completes the journey once');
    assert(wei.travel.arrivedAtMonths === arrive, 'arrival month stays the scheduled month');

    const ctx2 = boot();
    const wei2 = weiOf(ctx2);
    ctx2.beginNpcJourney(wei2, { destinationId: 'dewcatch_scrub', purpose: 'cultivation_resources' });
    const end = wei2.travel.arrivesAtMonths + 3;
    for (let m = ctx2.G.ageMonths; m <= end; m++) {
        ctx2.G.ageMonths = m;
        ctx2.tickNpcTravel();
    }
    assert(wei2.travel.completionCount === 1, 'month-by-month ticks do not duplicate arrival');
}

// 11. Dead NPCs
{
    const ctx = boot();
    const wei = weiOf(ctx);
    wei.alive = false;
    const deadStart = ctx.beginNpcJourney(wei, { destinationId: 'dewcatch_scrub', purpose: 'cultivation_resources' });
    assert(!deadStart.ok && deadStart.reason === 'dead', 'dead NPC cannot depart');
    wei.alive = true;
    ctx.beginNpcJourney(wei, { destinationId: 'dewcatch_scrub', purpose: 'cultivation_resources' });
    const completions = wei.travel.completionCount || 0;
    wei.alive = false;
    ctx.G.ageMonths = wei.travel.arrivesAtMonths + 5;
    ctx.tickNpcTravel();
    ctx.tickNpcTravel();
    assert(wei.travel.status === 'aborted' && wei.travel.abortReason === 'dead', 'death aborts the journey');
    assert(wei.travel.locationId == null, 'death does not deliver him to the destination');
    assert(!ctx.isNpcPhysicallyPresentAt(wei, 'redwell'), 'death does not return him to the origin');
    assert((wei.travel.completionCount || 0) === completions, 'aborted journey does not count as arrival');
    assert(!ctx.isNpcPhysicallyPresentAt(wei, 'dewcatch_scrub'), 'dead traveller is not present at the destination');
    assert(ctx.G.npcTravel.activeUids.indexOf(wei.uid) === -1, 'death clears the active journey index');
    ctx.G.ageMonths = (wei.travel.arrivesAtMonths || 0) + 20;
    ctx.tickNpcTravel();
    assert(wei.travel.status === 'aborted' && wei.travel.completionCount === completions, 'aborted dead journey cannot arrive later');
}

// Abort integrity: living cancel, invalid dest/route, save/load, unresolved
{
    // 1. Living cancellation settles at origin (not home-by-default)
    const ctx = boot();
    const wei = weiOf(ctx);
    ctx.beginNpcJourney(wei, { destinationId: 'dewcatch_scrub', purpose: 'cultivation_resources' });
    const cancel = ctx.cancelNpcJourney(wei, 'cancelled');
    assert(cancel.ok && cancel.status === 'present' && cancel.locationId === 'redwell', 'living cancel settles at origin');
    assert(wei.travel.arrivalApplied === true, 'cancel marks the leg finished');
    assert(ctx.G.npcTravel.activeUids.indexOf(wei.uid) === -1, 'cancel clears active journey index');
    assert(ctx.isNpcPhysicallyPresentAt(wei, 'redwell'), 'cancel restores presence at origin');
    assert(ctx.isNpcAvailableForLocationAction(wei, 'redwell'), 'lodge actions available after safe settlement');

    // Cancel mid return-home: origin is the field, not the lodge home
    wei.travel = {
        status: 'present', locationId: 'dewcatch_scrub', originId: null, destinationId: null,
        purpose: null, method: null, departedAtMonths: null, arrivesAtMonths: null,
        arrivedAtMonths: null, arrivalApplied: false, completionCount: 1, fieldStayCount: 1,
        companions: [], scheduleId: null, familiarLocationIds: ['redwell', 'dewcatch_scrub'],
        routeLocationIds: null, perceivedUncertainty: null, perceivedEffort: null,
        abortReason: null, lastArrival: null
    };
    wei.zone = 'dustbone';
    const startedHome = ctx.beginNpcJourney(wei, { destinationId: 'redwell', purpose: 'return_home' });
    assert(startedHome.ok && startedHome.originId === 'dewcatch_scrub', 'return leg originates at the field');
    const cancelReturn = ctx.cancelNpcJourney(wei.uid, 'cancelled');
    assert(cancelReturn.ok && cancelReturn.locationId === 'dewcatch_scrub', 'cancel settles at journey origin, not homeLocationId');
    assert(wei.homeLocationId === 'redwell', 'homeLocationId stays institutional home');
    assert(ctx.isNpcPhysicallyPresentAt(wei, 'dewcatch_scrub'), 'body remains at field origin after cancel');
    assert(!ctx.isNpcPhysicallyPresentAt(wei, 'redwell'), 'cancel does not teleport home');

    // 2–3. Invalid destination / travel data while travelling
    const ctx2 = boot();
    const wei2 = weiOf(ctx2);
    ctx2.beginNpcJourney(wei2, { destinationId: 'dewcatch_scrub', purpose: 'cultivation_resources' });
    const completions2 = wei2.travel.completionCount || 0;
    delete WORLD_LOCATIONS.dewcatch_scrub;
    ctx2.ensureNpcTravelState(wei2);
    assert(wei2.travel.status === 'present' && wei2.travel.locationId === 'redwell', 'invalid destination aborts to origin');
    assert(wei2.travel.abortReason === 'invalid_destination', 'invalid destination reason recorded');
    assert((wei2.travel.completionCount || 0) === completions2, 'invalid dest does not count as arrival');
    assert(ctx2.G.npcTravel.activeUids.indexOf(wei2.uid) === -1, 'invalid dest clears active index');
    ctx2.G.ageMonths = (wei2.travel.arrivesAtMonths || 0) + 50;
    ctx2.tickNpcTravel();
    assert(wei2.travel.completionCount === completions2, 'no duplicate arrival after invalid-dest abort');
    WORLD_LOCATIONS.dewcatch_scrub = {
        id: 'dewcatch_scrub', parentZone: 'dustbone', type: 'wilderness', name: 'Dewcatch Scrub',
        tags: ['Explore', 'Herbs', 'Field']
    };

    // Unresolved when origin is also gone
    const ctx3 = boot();
    const wei3 = weiOf(ctx3);
    ctx3.beginNpcJourney(wei3, { destinationId: 'dewcatch_scrub', purpose: 'cultivation_resources' });
    const originSnap = wei3.travel.originId;
    const destSnap = wei3.travel.destinationId;
    delete WORLD_LOCATIONS[originSnap];
    delete WORLD_LOCATIONS[destSnap];
    ctx3.resolveNpcTravelForActor(wei3, (wei3.travel.arrivesAtMonths || 0) + 1);
    assert(wei3.travel.status === 'unresolved', 'missing origin and destination leave unresolved body');
    assert(wei3.travel.locationId == null, 'unresolved has no settled location');
    assert(!ctx3.isNpcPhysicallyPresentAt(wei3, 'redwell'), 'unresolved is not present at lodge');
    assert(!ctx3.isNpcAvailableForLocationAction(wei3, 'redwell'), 'lodge actions blocked while unresolved');
    assert(!ctx3.canWorldNpcConverse(wei3), 'conversation blocked while unresolved');
    const viewU = ctx3.inspectNpcTravel(wei3.uid);
    assert(viewU.unresolved && viewU.abortReason, 'inspect exposes unresolved travel');
    WORLD_LOCATIONS.redwell = {
        id: 'redwell', parentZone: 'dustbone', type: 'city', name: 'Redwell', tags: ['City', 'Market']
    };
    WORLD_LOCATIONS.dewcatch_scrub = {
        id: 'dewcatch_scrub', parentZone: 'dustbone', type: 'wilderness', name: 'Dewcatch Scrub',
        tags: ['Explore', 'Herbs', 'Field']
    };

    // 5. Save/load after living abort
    const ctx4 = boot();
    const wei4 = weiOf(ctx4);
    ctx4.beginNpcJourney(wei4, { destinationId: 'dewcatch_scrub', purpose: 'cultivation_resources' });
    ctx4.cancelNpcJourney(wei4, 'cancelled');
    const blob = JSON.parse(JSON.stringify({ travel: wei4.travel, reg: ctx4.G.npcTravel, age: ctx4.G.ageMonths }));
    const ctx5 = boot();
    const wei5 = weiOf(ctx5);
    wei5.travel = blob.travel;
    ctx5.G.npcTravel = blob.reg;
    ctx5.G.ageMonths = blob.age;
    ctx5.ensureNpcTravelState(wei5);
    assert(wei5.travel.status === 'present' && wei5.travel.locationId === 'redwell', 'save/load keeps settled abort');
    assert(ctx5.isNpcPhysicallyPresentAt(wei5, 'redwell'), 'presence intact after abort save/load');
    assert(ctx5.G.npcTravel.activeUids.indexOf(wei5.uid) === -1, 'active index stays clean after abort load');

    // Legacy living abort with null body recovers
    const ctx6 = boot();
    const wei6 = weiOf(ctx6);
    wei6.travel = {
        status: 'aborted', locationId: null, originId: 'redwell', destinationId: 'dewcatch_scrub',
        purpose: 'cultivation_resources', method: 'walk', departedAtMonths: 100, arrivesAtMonths: 102,
        arrivedAtMonths: null, arrivalApplied: true, completionCount: 0, fieldStayCount: 0,
        companions: [], familiarLocationIds: ['redwell'], abortReason: 'legacy_null_body'
    };
    ctx6.G.npcTravel = { version: 1, activeUids: [wei6.uid] };
    ctx6.ensureNpcTravelState(wei6);
    assert(wei6.travel.status === 'present' && wei6.travel.locationId === 'redwell', 'legacy null-body abort recovers to origin');
    assert(ctx6.G.npcTravel.activeUids.indexOf(wei6.uid) === -1, 'legacy recovery clears active index');
}

// 12. Ambitions and decisions still run; travel is not guaranteed
{
    const ctx = boot();
    const wei = weiOf(ctx);
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 0;
    const duty = ctx.pursueNpcAmbitionGoal(wei.uid, {
        developer: true,
        ignoreCooldown: true,
        seed: 1,
        forceAction: 'earn_lodge_duty'
    });
    assert(duty.ok && duty.actionId === 'earn_lodge_duty', 'lodge duty still pursues while he is home');
    assert(ctx.getNpcAmbitionsFor(wei.uid).some(a => a.type === 'cultivation_advancement'), 'cultivation ambition remains');

    const seen = {};
    for (let seed = 1; seed <= 36; seed++) {
        const c = boot();
        weiOf(c);
        c.ensureNpcCultivationPouch(c.getWellRingCastNpc('rival')).spiritHerbs = 0;
        const r = c.pursueNpcAmbitionGoal('wr_wei_shun', {
            developer: false,
            ignoreCooldown: true,
            seed
        });
        if (r && r.actionId) seen[r.actionId] = (seen[r.actionId] || 0) + 1;
    }
    const kinds = Object.keys(seen);
    assert(kinds.length >= 2, 'natural pursuit does not lock Wei to one action (' + JSON.stringify(seen) + ')');
    assert(seen.gather_field_herbs > 0, 'field travel is sometimes chosen');
    assert((seen.earn_lodge_duty || 0) + (seen.steal_lodge_storehouse || 0) > 0, 'lodge actions are still chosen');
}

// 13. No duplicate departures; home accusation still resolves
{
    const ctx = boot();
    const wei = weiOf(ctx);
    const first = ctx.beginNpcJourney(wei, { destinationId: 'dewcatch_scrub', purpose: 'cultivation_resources' });
    const second = ctx.beginNpcJourney(wei, { destinationId: 'salt_bloom_flats', purpose: 'cultivation_resources' });
    assert(first.ok && !second.ok && second.reason === 'already_travelling', 'a second journey does not start');
    assert(wei.travel.destinationId === 'dewcatch_scrub', 'original destination stands');
    assert(ctx.G.npcTravel.activeUids.filter(id => id === wei.uid).length === 1, 'one active journey id');

    const home = boot();
    weiOf(home);
    const sit = home.startWellRingResourceAccusationScenario({
        forceChoice: 'investigate',
        evidenceStrength: 'weak',
        liangBeliefConfidence: 0.3,
        decideImmediately: true,
        seed: 2
    });
    assert(sit.thread && sit.thread.status === 'resolved', 'at-home investigation still resolves');
    assert(!(sit.thread.meta && sit.thread.meta.lastTrace && sit.thread.meta.lastTrace.deferred), 'home presence is not deferred');
}

// 14. Bounded tick, shared clock only, developer inspect
{
    const src = read('npc-travel.js');
    assert(!/worldNpcs/.test(src), 'travel processing does not scan worldNpcs');
    assert(!/processWorldTime|advanceTime\s*\(/.test(src), 'travel does not open a second clock');
    assert(/registerWorldTick\(/.test(src), 'travel uses the shared scheduler');
    const ticks = boot().WORLD_TICKS.filter(t => t.id === 'npcTravel');
    assert(ticks.length === 1 && ticks[0].priority === 44, 'one travel tick before ambition pursuit');

    const ctx = boot();
    const wei = weiOf(ctx);
    ctx.beginNpcJourney(wei, { destinationId: 'dewcatch_scrub', purpose: 'cultivation_resources' });
    const view = ctx.inspectNpcTravel(wei.uid);
    assert(view.inTransit && view.originId === 'redwell' && view.destinationId === 'dewcatch_scrub', 'inspect shows the journey');
    assert(view.purpose === 'cultivation_resources' && view.method === 'walk', 'inspect shows purpose and method');
    assert(view.departedAtMonths != null && view.arrivesAtMonths > view.departedAtMonths, 'inspect shows departure and arrival');
    assert(view.options.some(o => o.id === 'flight' && !o.eligible), 'inspect shows ineligible methods and reasons');
    assert(view.presence && view.presence.lodgeDuty === false && view.presence.storehouseTheft === false, 'inspect shows presence locks');
}

if (failed) {
    console.error('\n' + failed + ' travel check(s) failed.');
    process.exit(1);
}
console.log('\nAll NPC travel checks passed.');
