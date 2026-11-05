/**
 * NPC contextual decisions + Well-Ring accusation situation (Phase D).
 * Run: node scripts/test-npc-contextual-decisions.js
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
        ageMonths: 300,
        worldNpcs: [],
        wellRing: null,
        npcTies: null,
        npcIncidents: null,
        npcObservations: null,
        npcBeliefs: null,
        npcDecisions: null,
        npcSituationThreads: null,
        npcSituationOutcomes: null,
        worldSchedule: [],
        worldChronicle: [],
        currentZone: 'dustbone',
        currentLocation: 'redwell'
    }, extraG || {});

    const WORLD_EVENT_HANDLERS = {};
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
        ensureNpcPersonalities: (npc) => {
            if (!npc.personalities?.length) npc.personalities = ['careful'];
            return npc.personalities;
        },
        findWorldNpcRecordByUid: null,
        getNpcDef: () => null,
        WORLD_EVENT_HANDLERS,
        WORLD_TICKS,
        registerWorldEventHandler(type, fn) {
            if (type && typeof fn === 'function') WORLD_EVENT_HANDLERS[type] = fn;
        },
        registerWorldTick(id, fn, priority) {
            WORLD_TICKS.push({ id, fn, priority: priority != null ? priority : 50 });
        },
        scheduleWorldEvent(type, atMonths, payload, opts) {
            opts = opts || {};
            const id = opts.id || `${type}_${atMonths}`;
            G.worldSchedule = (G.worldSchedule || []).filter(e => e.id !== id);
            G.worldSchedule.push({ id, type, at: Math.floor(atMonths), payload: payload || {} });
            return id;
        },
        cancelWorldEvents(filterFn) {
            G.worldSchedule = (G.worldSchedule || []).filter(e => !filterFn(e));
        },
        hasScheduledWorldEvent(type, id) {
            return (G.worldSchedule || []).some(e => (!type || e.type === type) && (!id || e.id === id));
        }
    });
    ctx.findWorldNpcRecordByUid = (uid) => (ctx.G.worldNpcs || []).find(n => n.uid === uid) || null;

    vm.runInContext(read('npc-foundations.js'), ctx);
    vm.runInContext(read('npc-ties.js'), ctx);
    vm.runInContext(read('well-ring-lodge.js'), ctx);
    vm.runInContext(read('npc-incidents.js'), ctx);
    vm.runInContext(read('npc-decisions.js'), ctx);
    vm.runInContext(read('npc-situations.js'), ctx);

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

// 1. Developer-triggered scenario is reproducible
{
    const a = boot();
    a.ensureWellRingState();
    const r1 = a.startWellRingResourceAccusationScenario({
        seed: 42,
        forceChoice: 'investigate',
        evidenceStrength: 'weak',
        accusedId: 'wr_unknown_outer',
        trueCulpritId: 'other_thief',
        liangBeliefConfidence: 0.3
    });
    const b = boot();
    b.ensureWellRingState();
    const r2 = b.startWellRingResourceAccusationScenario({
        seed: 42,
        forceChoice: 'investigate',
        evidenceStrength: 'weak',
        accusedId: 'wr_unknown_outer',
        trueCulpritId: 'other_thief',
        liangBeliefConfidence: 0.3
    });
    assert(r1.ok && r2.ok, 'developer scenario starts');
    const d1 = a.getNpcDecision(r1.thread.decisionIds[0]);
    const d2 = b.getNpcDecision(r2.thread.decisionIds[0]);
    assert(d1.chosen === 'investigate' && d2.chosen === 'investigate', 'developer scenario reproducible choice');
    assert(r1.trueCulpritId === 'other_thief' && d1.knowledgeSnapshot.primaryClaim.culpritId === 'wr_unknown_outer',
        'Liang belief culprit may differ from objective');
}

// 2–3. Natural trigger uses same machinery + eligibility/cooldown
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const nat = ctx.beginWellRingResourceAccusation({
        natural: true,
        ignoreCooldown: true,
        decideImmediately: false,
        decisionDelayMonths: 2,
        accusedId: 'wr_unknown_outer',
        evidenceStrength: 'weak'
    });
    assert(nat.ok && nat.thread.templateId === 'well_ring_resource_accusation', 'natural uses same pack machinery');
    assert(nat.thread.flags.natural === true, 'natural flag set');
    assert(nat.thread.flags.playerInvolved === false, 'no player involvement required');
    assert(nat.thread.status === 'active', 'natural thread stays active until beat');

    const blocked = ctx.beginWellRingResourceAccusation({ natural: true, ignoreCooldown: true });
    assert(!blocked.ok && blocked.reason === 'already_active', 'natural blocked while active');

    // Resolve and test cooldown
    ctx.setNpcSituationStatus(nat.thread.id, 'resolved', { stage: 'test' });
    ctx.G.npcSituationThreads.lastNaturalByTemplate.well_ring_resource_accusation = ctx.G.ageMonths;
    const cd = ctx.isWellRingAccusationEligible();
    assert(!cd.ok && cd.reason === 'cooldown', 'natural trigger respects cooldown');

    ctx.G.npcSituationThreads.lastNaturalByTemplate.well_ring_resource_accusation =
        ctx.G.ageMonths - 48 - 1;
    // Force chance miss path by temporarily zeroing chance via last check + eligibility ok
    const elig = ctx.isWellRingAccusationEligible();
    assert(elig.ok, 'eligible after cooldown elapsed');
}

// 5. Liang does not receive omniscient information
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const r = ctx.startWellRingResourceAccusationScenario({
        forceChoice: 'investigate',
        trueCulpritId: 'secret_thief_xyz',
        accusedId: 'wr_unknown_outer',
        evidenceStrength: 'weak',
        liangBeliefConfidence: 0.3
    });
    const known = ctx.getNpcKnownAboutIncident(r.liangId, r.incident.id);
    assert(known.primaryBelief.claim.culpritId === 'wr_unknown_outer', 'Liang knows accused from report');
    assert(!JSON.stringify(known).includes('secret_thief_xyz'), 'Liang knowledge omits objective culprit');
    const objective = ctx.getNpcIncidentObjective(r.incident.id);
    assert(objective.facts.culpritId === 'secret_thief_xyz', 'objective ledger still has truth');
}

// 6. Different beliefs can lead to different choices
{
    const weak = boot();
    weak.ensureWellRingState();
    const w = weak.startWellRingResourceAccusationScenario({
        seed: 7,
        evidenceStrength: 'weak',
        liangBeliefConfidence: 0.25,
        accusedId: 'wr_unknown_outer',
        accusedImportantToLiang: false,
        decideImmediately: true
    });
    const strong = boot();
    strong.ensureWellRingState();
    const s = strong.startWellRingResourceAccusationScenario({
        seed: 7,
        evidenceStrength: 'strong',
        liangBeliefConfidence: 0.8,
        accusedId: 'wr_unknown_outer',
        accusedImportantToLiang: false,
        decideImmediately: true
    });
    const dw = weak.getNpcDecision(w.thread.decisionIds[0]);
    const ds = strong.getNpcDecision(s.thread.decisionIds[0]);
    const score = (dec, id) => (dec.optionsConsidered.find(o => o.id === id) || {}).score;
    assert(score(dw, 'formal_discipline') < score(ds, 'formal_discipline'),
        'stronger belief raises discipline score');
    assert(score(dw, 'investigate') >= score(dw, 'formal_discipline'),
        'weak belief keeps investigate competitive vs discipline');
}

// 7–8. Personality/values influence; ties influence
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const r = ctx.startWellRingResourceAccusationScenario({
        seed: 11,
        evidenceStrength: 'moderate',
        liangBeliefConfidence: 0.55,
        accusedId: 'wr_unknown_outer',
        accusedImportantToLiang: false
    });
    const d = ctx.getNpcDecision(r.thread.decisionIds[0]);
    const inv = d.optionsConsidered.find(o => o.id === 'investigate');
    const ign = d.optionsConsidered.find(o => o.id === 'ignore');
    assert(inv && inv.eligible && inv.score > 0, 'investigate influenced and eligible');
    assert(ign && ign.eligible, 'inaction remains eligible (not dictated)');
    assert(d.contextSnapshot.personalities.includes('careful'), 'Liang careful personality in context');
    assert(d.factors.some(f => /careful|pragmat|lodge|investigate|security/i.test(f.id)),
        'trace mentions character factors');

    // Important accused softens harsh options
    const soft = boot();
    soft.ensureWellRingState();
    const rs = soft.startWellRingResourceAccusationScenario({
        seed: 11,
        evidenceStrength: 'strong',
        liangBeliefConfidence: 0.75,
        accusedId: soft.resolveWellRingActorIds().weiId,
        accusedImportantToLiang: true
    });
    const hard = boot();
    hard.ensureWellRingState();
    const rh = hard.startWellRingResourceAccusationScenario({
        seed: 11,
        evidenceStrength: 'strong',
        liangBeliefConfidence: 0.75,
        accusedId: 'wr_unknown_outer',
        accusedImportantToLiang: false
    });
    const ds = soft.getNpcDecision(rs.thread.decisionIds[0]);
    const dh = hard.getNpcDecision(rh.thread.decisionIds[0]);
    const discSoft = ds.optionsConsidered.find(o => o.id === 'formal_discipline').score;
    const discHard = dh.optionsConsidered.find(o => o.id === 'formal_discipline').score;
    assert(discSoft < discHard, 'importance to Liang softens formal discipline score');
}

// 9. Authority / availability constrain outcomes
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const r = ctx.startWellRingResourceAccusationScenario({
        forceChoice: 'formal_discipline',
        evidenceStrength: 'strong',
        liangBeliefConfidence: 0.8,
        accusedAvailable: false,
        accusedId: 'wr_unknown_outer'
    });
    const outcomes = ctx.getNpcSituationOutcomesFor(r.thread.id);
    assert(outcomes[0].success === false, 'discipline fails when accused unavailable');
    assert(outcomes[0].effects.some(e => e.reason === 'accused_unavailable'), 'blocked effect recorded');
}

// 10. Investigation does not automatically reveal truth
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const r = ctx.startWellRingResourceAccusationScenario({
        forceChoice: 'investigate',
        trueCulpritId: 'hidden_culprit',
        accusedId: 'wrong_suspect',
        evidenceStrength: 'weak',
        liangBeliefConfidence: 0.3
    });
    const known = ctx.getNpcKnownAboutIncident(r.liangId, r.incident.id);
    assert(known.primaryBelief.claim.culpritId !== 'hidden_culprit', 'investigation did not reveal true culprit');
    assert(r.thread.flags.investigated || ctx.getNpcSituationThread(r.thread.id).stage, 'investigation recorded');
    const after = ctx.getNpcSituationThread(r.thread.id);
    assert(after.flags.investigated === true, 'investigated flag set');
}

// 11. Decisions and outcomes recorded separately
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const r = ctx.startWellRingResourceAccusationScenario({ forceChoice: 'warn', evidenceStrength: 'strong', liangBeliefConfidence: 0.7, accusedId: 'wr_unknown_outer' });
    const dec = ctx.getNpcDecision(r.thread.decisionIds[0]);
    const out = ctx.getNpcSituationOutcomesFor(r.thread.id)[0];
    assert(dec && out && dec.id !== out.id, 'decision and outcome are separate records');
    assert(dec.status === 'completed' && out.decisionId === dec.id, 'outcome linked to decision');
    assert(dec.chosen === 'warn' && out.action === 'warn', 'intention carried into outcome action');
}

// 12. Inaction is a valid result
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const r = ctx.startWellRingResourceAccusationScenario({ forceChoice: 'ignore', evidenceStrength: 'weak', liangBeliefConfidence: 0.2 });
    const dec = ctx.getNpcDecision(r.thread.decisionIds[0]);
    assert(dec.chosen === 'ignore', 'inaction chosen');
    assert(ctx.getNpcSituationThread(r.thread.id).status === 'resolved', 'inaction resolves thread');
}

// 13. Threads terminate safely
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const r = ctx.startWellRingResourceAccusationScenario({
        forceChoice: 'defer',
        decideImmediately: false,
        decisionDelayMonths: 5
    });
    assert(r.thread.status === 'active', 'delayed thread starts active');
    // Expire via beat after expiry
    ctx.G.npcSituationThreads.byId[r.thread.id].expiresAtMonths = ctx.G.ageMonths - 1;
    const res = ctx.processNpcSituationBeat(r.thread.id);
    assert(res.expired && ctx.getNpcSituationThread(r.thread.id).status === 'expired', 'expired thread terminates');
}

// 14. Active incident refs survive retention
{
    const ctx = boot({ ageMonths: 500 });
    ctx.ensureWellRingState();
    const r = ctx.startWellRingResourceAccusationScenario({
        forceChoice: 'defer',
        decideImmediately: false,
        decisionDelayMonths: 3
    });
    // Make incident look old/mild and prune
    const inc = ctx.G.npcIncidents.byId[r.incident.id];
    inc.atMonths = 100;
    inc.severity = 1;
    // Keep thread active so pin + situation ref protect it
    ctx.pruneNpcIncidentLedger();
    assert(!!ctx.getNpcIncidentObjective(r.incident.id), 'active situation incident survives prune');
}

// 15–17. Save/load + no duplicate processing
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const r = ctx.startWellRingResourceAccusationScenario({
        forceChoice: 'investigate',
        decideImmediately: false,
        decisionDelayMonths: 2,
        accusedId: 'wr_unknown_outer'
    });
    const saved = JSON.parse(JSON.stringify({
        ageMonths: ctx.G.ageMonths,
        worldNpcs: ctx.G.worldNpcs,
        wellRing: ctx.G.wellRing,
        npcIncidents: ctx.G.npcIncidents,
        npcObservations: ctx.G.npcObservations,
        npcBeliefs: ctx.G.npcBeliefs,
        npcDecisions: ctx.G.npcDecisions,
        npcSituationThreads: ctx.G.npcSituationThreads,
        npcSituationOutcomes: ctx.G.npcSituationOutcomes,
        worldSchedule: ctx.G.worldSchedule
    }));
    const ctx2 = boot(saved);
    ctx2.migrateNpcIncidentsForExistingSave();
    ctx2.migrateNpcDecisionsForExistingSave();
    ctx2.migrateNpcSituationsForExistingSave();
    assert(ctx2.getNpcSituationThread(r.thread.id).status === 'active', 'active situation survives save/load');
    assert(!!ctx2.getNpcIncidentObjective(r.incident.id), 'incident survives with situation');

    ctx2.G.ageMonths = saved.ageMonths + 2;
    ctx2.processNpcSituationBeat(r.thread.id);
    const once = ctx2.getNpcSituationOutcomesFor(r.thread.id).length;
    ctx2.processNpcSituationBeat(r.thread.id);
    const twice = ctx2.getNpcSituationOutcomesFor(r.thread.id).length;
    assert(once === 1 && twice === 1, 'no duplicate processing after load');
}

// 16. Missing / deceased actors
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const r = ctx.startWellRingResourceAccusationScenario({
        forceChoice: 'warn',
        decideImmediately: false,
        decisionDelayMonths: 1
    });
    const liang = ctx.getWellRingCastNpc('hall_master');
    liang.alive = false;
    const res = ctx.processNpcSituationBeat(r.thread.id);
    assert(res.expired && res.reason === 'hall_master_dead', 'dead hall master ends thread safely');
}

// 18. Well-Ring gameplay cast still works
{
    const ctx = boot();
    ctx.ensureWellRingState();
    ctx.startWellRingResourceAccusationScenario({ forceChoice: 'defer' });
    assert(ctx.getWellRingCastNpc('hall_master').personalities.includes('careful'), 'Liang cast intact');
    assert(typeof ctx.getWellRingRivalMerit() === 'number', 'rival merit API intact');
}

// 19. No second clock / no global pair scan
{
    const sit = read('npc-situations.js');
    const dec = read('npc-decisions.js');
    assert(!/processWorldTime\(|advanceTimeQuiet|new.*clock/i.test(sit + dec) || /registerWorldTick/.test(sit),
        'uses shared scheduler tick registration');
    assert(!/for\s*\(.*worldNpcs[\s\S]{0,100}worldNpcs/.test(sit + dec), 'no global NPC-pair scanning');
}

// Natural eligibility without player
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const elig = ctx.isWellRingAccusationEligible({ ignoreCooldown: true });
    assert(elig.ok, 'eligible with lodge cast and no player');
}

if (failed) {
    console.error(`\n${failed} failure(s)`);
    process.exit(1);
}
console.log('\nAll NPC contextual decision / situation tests passed.');
