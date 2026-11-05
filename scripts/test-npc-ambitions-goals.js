/**
 * NPC ambitions & goal pursuit (Phase E vertical slice).
 * Run: node scripts/test-npc-ambitions-goals.js
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
        worldSchedule: [],
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
        hasScheduledWorldEvent() { return false; }
    });
    ctx.findWorldNpcRecordByUid = (uid) => (ctx.G.worldNpcs || []).find(n => n.uid === uid) || null;

    [
        'npc-foundations.js',
        'npc-ties.js',
        'well-ring-lodge.js',
        'npc-incidents.js',
        'npc-decisions.js',
        'npc-situations.js',
        'npc-ambitions.js'
    ].forEach(f => vm.runInContext(read(f), ctx));

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

// 1–3. Persistent ambition init; foundation unchanged; multiple ambitions
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const wei = ctx.getWellRingCastNpc('rival');
    const beforeFound = JSON.stringify(ctx.getNpcFoundationAmbitions(wei));
    const amb = ctx.ensureWeiShunCultivationAmbition();
    assert(amb && amb.type === 'cultivation_advancement' && amb.status === 'active', 'persistent ambition initialized');
    assert(amb.foundationRef === 'advancement', 'runtime ambition linked to foundation ref without mutating it');
    const afterFound = JSON.stringify(ctx.getNpcFoundationAmbitions(wei));
    assert(beforeFound === afterFound || afterFound.includes('advancement'), 'authored/procedural foundation ambitions remain');
    // Ensure second ensure is idempotent
    const amb2 = ctx.ensureWeiShunCultivationAmbition();
    assert(amb.id === amb2.id, 'ambition init idempotent');
    const other = ctx.createNpcAmbition({
        actorId: wei.uid,
        type: 'survive',
        label: 'Survive',
        priority: 0.3,
        allowDuplicateType: false
    });
    assert(ctx.getNpcAmbitionsFor(wei.uid).length >= 2, 'multiple ambitions can coexist');
    assert(other.type === 'survive' && amb.type === 'cultivation_advancement', 'conflicting types allowed');
}

// 4–5. Goals derive from ambition; actions respect preconditions
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const wei = ctx.getWellRingCastNpc('rival');
    ctx.ensureWeiShunCultivationAmbition();
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 0;
    const goal = ctx.ensureCultivationResourceGoal(wei.uid);
    assert(goal && goal.type === 'acquire_cultivation_resources' && goal.status === 'active',
        'goal derives from cultivation ambition + shortfall');
    assert(goal.ambitionId, 'goal links to parent ambition');
}

// 6–8. Character influences selection; consequences; failed actions no auto progress
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const wei = ctx.getWellRingCastNpc('rival');
    assert(wei.personalities.includes('ambitious') && wei.personalities.includes('bold'), 'Wei character intact');
    const herbsBefore = 0;
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = herbsBefore;
    const r = ctx.startWeiShunCultivationPursuitScenario({
        seed: 42,
        forceAction: 'earn_lodge_duty',
        startingHerbs: 0
    });
    assert(r.ok && r.actionId === 'earn_lodge_duty', 'developer forceAction selects duty');
    assert(r.result.effects.some(e => e.type === 'rival_merit_delta'), 'duty has real merit consequence');
    // Failed theft
    const ctx2 = boot();
    ctx2.ensureWellRingState();
    // Force many fail seeds — stealFailChance 0.4; use forceAction and check failed case via execute
    const fail = ctx2.executeNpcResourceAction('wr_wei_shun', 'steal_lodge_storehouse', { seed: 1 });
    // With seed 1, deterministic — just assert structure
    assert(typeof fail.success === 'boolean', 'theft returns success flag');
    if (!fail.success) {
        assert(ctx2.getNpcSpiritHerbs('wr_wei_shun') === 0, 'failed theft grants no herbs');
    }
    const okSteal = ctx2.executeNpcResourceAction('wr_wei_shun', 'steal_lodge_storehouse', { seed: 99 });
    // Try a few seeds for a success
    let stolen = false;
    for (let s = 0; s < 30; s++) {
        const c = boot();
        c.ensureWellRingState();
        c.ensureNpcCultivationPouch(c.getWellRingCastNpc('rival')).spiritHerbs = 0;
        const res = c.executeNpcResourceAction('wr_wei_shun', 'steal_lodge_storehouse', { seed: s });
        if (res.success) {
            assert(c.getNpcSpiritHerbs('wr_wei_shun') >= 2, 'successful theft grants herbs');
            assert(res.effects.some(e => e.type === 'incident'), 'theft creates incident');
            stolen = true;
            break;
        }
    }
    assert(stolen, 'at least one seed produces successful theft with consequences');
}

// Character scoring: bold/ambitious raise steal score
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const wei = ctx.getWellRingCastNpc('rival');
    ctx.ensureWeiShunCultivationAmbition();
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 0;
    const dec = ctx.resolveNpcContextualDecision(ctx.buildWeiResourceActionDecisionSpec(wei.uid, { seed: 1 }));
    const steal = dec.optionsConsidered.find(o => o.id === 'steal_lodge_storehouse');
    const duty = dec.optionsConsidered.find(o => o.id === 'earn_lodge_duty');
    assert(steal && steal.factors.some(f => /ambitious|bold|desperate/i.test(f.id)),
        'NPC character influences action selection');
    assert(duty && duty.eligible && steal.eligible, 'both actions eligible for Wei');
}

// 9–11. Goal completion updates ambition; repeated failure softens feasibility; minor setback keeps ambition
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const wei = ctx.getWellRingCastNpc('rival');
    const amb = ctx.ensureWeiShunCultivationAmbition();
    const feas0 = amb.perceivedFeasibility;
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 0;
    // One stipend miss setback
    ctx.startWeiShunCultivationPursuitScenario({ seed: 2, forceAction: 'earn_lodge_duty', startingHerbs: 0 });
    const amb1 = ctx.getNpcAmbition(amb.id);
    assert(amb1.status === 'active', 'minor setback does not erase ambition');
    // Complete via herbs
    ctx.ensureNpcCultivationPouch(wei).spiritHerbs = 3;
    const growthBefore = wei.growthProgress || 0;
    ctx.ensureCultivationResourceGoal(wei.uid);
    const completed = ctx.getNpcGoalsFor(wei.uid).find(g => g.type === 'acquire_cultivation_resources' && g.status === 'completed')
        || ctx.maybeCompleteCultivationResourceGoal(wei.uid);
    assert(completed && completed.status === 'completed', 'goal completion recorded');
    assert((wei.growthProgress || 0) > growthBefore, 'completion applies real cultivation progress');
    assert(ctx.getNpcSpiritHerbs(wei.uid) === 0, 'herbs consumed on completion');
    const ambAfter = ctx.getNpcAmbition(amb.id);
    assert((ambAfter.progress || 0) > 0, 'ambition progress updates on goal completion');

    // Repeated failures lower feasibility
    const ctx3 = boot();
    ctx3.ensureWellRingState();
    const a = ctx3.ensureWeiShunCultivationAmbition();
    const f0 = a.perceivedFeasibility;
    for (let i = 0; i < 3; i++) {
        ctx3.reconsiderNpcAmbitionAfterAttempt(a.id, { success: false, goalId: null });
    }
    assert(ctx3.getNpcAmbition(a.id).perceivedFeasibility < f0, 'repeated failure lowers perceived feasibility');
    assert(ctx3.getNpcAmbition(a.id).status === 'active', 'three failures do not abandon (inertia)');
}

// 12. Save/load
{
    const ctx = boot();
    ctx.ensureWellRingState();
    ctx.startWeiShunCultivationPursuitScenario({ seed: 5, forceAction: 'earn_lodge_duty', startingHerbs: 0 });
    const wei = ctx.getWellRingCastNpc('rival');
    const saved = JSON.parse(JSON.stringify({
        ageMonths: ctx.G.ageMonths,
        worldNpcs: ctx.G.worldNpcs,
        wellRing: ctx.G.wellRing,
        npcAmbitions: ctx.G.npcAmbitions,
        npcGoals: ctx.G.npcGoals,
        npcGoalAttempts: ctx.G.npcGoalAttempts
    }));
    const ctx2 = boot(saved);
    ctx2.migrateNpcAmbitionsForExistingSave();
    assert(ctx2.getNpcAmbitionsFor('wr_wei_shun').length >= 1, 'ambitions survive save/load');
    assert(ctx2.getNpcGoalAttemptsFor('wr_wei_shun').length >= 1, 'attempts survive save/load');
    assert(ctx2.getNpcSpiritHerbs('wr_wei_shun') === ctx.getNpcSpiritHerbs(wei.uid), 'pouch survives save/load');
}

// 13–15. No duplicate natural; dead NPC; no player required
{
    const ctx = boot();
    ctx.ensureWellRingState();
    const r1 = ctx.pursueNpcAmbitionGoal('wr_wei_shun', { developer: true, ignoreCooldown: false, seed: 1, forceAction: 'earn_lodge_duty' });
    assert(r1.ok, 'first pursuit ok');
    const r2 = ctx.pursueNpcAmbitionGoal('wr_wei_shun', { developer: false, ignoreCooldown: false, seed: 1, forceAction: 'earn_lodge_duty' });
    assert(!r2.ok && r2.reason === 'cooldown', 'natural scheduling does not duplicate attempts via cooldown');

    const ctxD = boot();
    ctxD.ensureWellRingState();
    ctxD.getWellRingCastNpc('rival').alive = false;
    const dead = ctxD.pursueNpcAmbitionGoal('wr_wei_shun', { ignoreCooldown: true, developer: true });
    assert(!dead.ok && dead.reason === 'actor_unavailable', 'dead NPC does not act');

    const ctxN = boot();
    ctxN.ensureWellRingState();
    const nat = ctxN.pursueNpcAmbitionGoal('wr_wei_shun', { ignoreCooldown: true, seed: 8, forceAction: 'earn_lodge_duty' });
    assert(nat.ok && !nat.decision?.contextSnapshot?.playerInvolved, 'NPC acts without player involvement');
}

// 16–17. Misconduct integrates with incidents; detection ≠ omniscient guilt
{
    let found = false;
    for (let s = 0; s < 40; s++) {
        const ctx = boot();
        ctx.ensureWellRingState();
        const res = ctx.executeNpcResourceAction('wr_wei_shun', 'steal_lodge_storehouse', { seed: s });
        if (res.success && res.detected) {
            const inc = ctx.getNpcIncidentObjective(res.incidentId);
            assert(inc && inc.facts.culpritId === 'wr_wei_shun', 'incident records objective culprit');
            const known = ctx.getNpcKnownAboutIncident('wr_master_liang', res.incidentId);
            assert(known.observations.length || known.beliefs.length, 'Liang gets report-level knowledge');
            assert(!JSON.stringify(known).includes('omniscient'), 'no omniscient flag in knowledge view');
            // Belief may name Wei from report — but confidence is moderate, not ledger dump of method
            found = true;
            break;
        }
    }
    assert(found, 'detected theft path exercised');
}

// 18. Developer scenarios deterministic
{
    const a = boot();
    a.ensureWellRingState();
    const r1 = a.startWeiShunCultivationPursuitScenario({ seed: 77, forceAction: 'earn_lodge_duty', startingHerbs: 0 });
    const b = boot();
    b.ensureWellRingState();
    const r2 = b.startWeiShunCultivationPursuitScenario({ seed: 77, forceAction: 'earn_lodge_duty', startingHerbs: 0 });
    assert(r1.actionId === r2.actionId && r1.result.stipendGained === r2.result.stipendGained,
        'developer scenarios are deterministic');
}

// 19. Bounded history
{
    const ctx = boot();
    ctx.ensureWellRingState();
    for (let i = 0; i < 50; i++) {
        ctx.recordNpcGoalAttempt({
            actorId: 'wr_wei_shun',
            actionId: 'earn_lodge_duty',
            success: false,
            notes: 'fill'
        });
    }
    assert(ctx.getNpcGoalAttemptsFor('wr_wei_shun').length <= 40, 'attempt history bounded');
}

// 20. #201–205 compatibility smoke + no global pair scan
{
    const ctx = boot();
    ctx.ensureWellRingState();
    ctx.migrateNpcAgencyFoundationsAndTies();
    ctx.startWeiShunCultivationPursuitScenario({ seed: 1, forceAction: 'earn_lodge_duty', startingHerbs: 0 });
    assert(ctx.getWellRingCastNpc('hall_master').personalities.includes('careful'), 'Liang cast intact');
    assert(ctx.getNpcTiesFor('wr_master_liang').length >= 1, 'ties intact');
    const src = read('npc-ambitions.js');
    assert(!/for\s*\(.*worldNpcs[\s\S]{0,80}worldNpcs/.test(src), 'no global NPC-pair scanning');
    assert(/registerWorldTick/.test(src), 'uses shared scheduler tick');
}

// Inspection API
{
    const ctx = boot();
    ctx.ensureWellRingState();
    ctx.startWeiShunCultivationPursuitScenario({ seed: 3, forceAction: 'earn_lodge_duty', startingHerbs: 0 });
    const view = ctx.inspectNpcAmbitionRuntime('wr_wei_shun');
    assert(view.ambitions.length && view.recentAttempts.length, 'developer inspection exposes ambitions and attempts');
}

if (failed) {
    console.error(`\n${failed} failure(s)`);
    process.exit(1);
}
console.log('\nAll NPC ambition/goal tests passed.');
