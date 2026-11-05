/**
 * NPC incidents, observations, beliefs (Phase C).
 * Run: node scripts/test-npc-incidents-beliefs.js
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
        ageMonths: 240,
        worldNpcs: [],
        wellRing: null,
        npcTies: null,
        npcIncidents: null,
        npcObservations: null,
        npcBeliefs: null,
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
        ensureNpcPersonalities: (npc) => {
            if (!npc.personalities?.length) npc.personalities = ['careful'];
            return npc.personalities;
        },
        findWorldNpcRecordByUid: null,
        getNpcDef: () => null
    });
    ctx.findWorldNpcRecordByUid = (uid) => (ctx.G.worldNpcs || []).find(n => n.uid === uid) || null;

    vm.runInContext(read('npc-foundations.js'), ctx);
    vm.runInContext(read('npc-ties.js'), ctx);
    vm.runInContext(read('well-ring-lodge.js'), ctx);
    vm.runInContext(read('npc-incidents.js'), ctx);

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

// 1–2. Incident creation, stable IDs, objective facts
{
    const ctx = boot();
    const a = ctx.createNpcIncident({
        id: 'inc_test_1',
        type: 'theft',
        zoneId: 'dustbone',
        locationId: 'redwell',
        orgId: 'well_ring_lodge',
        severity: 3,
        participants: [{ id: 'thief_x', role: 'actor' }, { id: 'wr_wei_shun', role: 'nearby' }],
        facts: { what: 'herb_stolen', culpritId: 'thief_x', item: 'spirit_herb_pouch' }
    });
    const b = ctx.createNpcIncident({
        id: 'inc_test_1',
        type: 'theft',
        facts: { what: 'should_not_overwrite' }
    });
    assert(a.id === 'inc_test_1' && b.id === 'inc_test_1', 'stable incident id');
    assert(a.facts.culpritId === 'thief_x' && b.facts.culpritId === 'thief_x', 'idempotent create keeps objective facts');
    assert(ctx.getNpcIncidentObjective('inc_test_1').facts.item === 'spirit_herb_pouch', 'objective fact storage');
}

// 3–4. Partial / direct vs secondhand observations
{
    const ctx = boot();
    ctx.createNpcIncident({
        id: 'inc_obs',
        type: 'theft',
        facts: { culpritId: 'real_thief', secret: 'hidden_motive' }
    });
    const direct = ctx.recordNpcObservation({
        id: 'obs_d',
        observerId: 'wr_wei_shun',
        incidentId: 'inc_obs',
        direct: true,
        details: { sawSash: 'brown', identifiedCulpritId: null },
        confidence: 0.55
    });
    const second = ctx.recordNpcObservation({
        id: 'obs_s',
        observerId: 'wr_master_liang',
        incidentId: 'inc_obs',
        source: 'report',
        details: { heardFrom: 'wr_wei_shun', rumourCulpritId: 'innocent_porter' },
        confidence: 0.3
    });
    assert(direct.direct === true && direct.secondhand === false, 'direct observation flag');
    assert(second.direct === false && second.secondhand === true, 'secondhand observation flag');
    assert(!direct.details.secret && direct.details.sawSash === 'brown', 'partial observation details');
    assert(Object.keys(direct.details).includes('secret') === false, 'observation does not auto-copy objective secrets');
}

// 5–7. Beliefs: correct, incorrect, conflicting, explicit update
{
    const ctx = boot();
    ctx.createNpcIncident({
        id: 'inc_bel',
        type: 'theft',
        facts: { culpritId: 'real_thief' }
    });
    ctx.recordNpcObservation({
        id: 'obs_bel',
        observerId: 'wr_wei_shun',
        incidentId: 'inc_bel',
        direct: true,
        details: { sawSash: 'brown' }
    });
    const wrong = ctx.formNpcBelief({
        id: 'bel_wrong',
        believerId: 'wr_wei_shun',
        incidentId: 'inc_bel',
        claimTopic: 'culprit',
        claim: { culpritId: 'innocent_porter' },
        confidence: 0.4,
        sourceObservationIds: ['obs_bel']
    });
    assert(wrong.claim.culpritId === 'innocent_porter', 'incorrect belief allowed');
    assert(wrong.claim.culpritId !== ctx.getNpcIncidentObjective('inc_bel').facts.culpritId, 'belief need not match objective');

    // Weaker conflicting update does not replace
    const still = ctx.updateNpcBelief('bel_wrong', {
        claim: { culpritId: 'another_wrong' },
        confidence: 0.2
    }, { mode: 'evidence' });
    assert(still.claim.culpritId === 'innocent_porter', 'weaker claim does not replace belief');
    assert((still.conflictsWith || []).length >= 1, 'weaker claim recorded as conflict');

    // Stronger evidence updates
    const fixed = ctx.updateNpcBelief('bel_wrong', {
        claim: { culpritId: 'real_thief' },
        confidence: 0.8
    }, { mode: 'evidence' });
    assert(fixed.claim.culpritId === 'real_thief', 'stronger evidence updates belief');
    assert(fixed.confidence === 0.8, 'confidence raises confidence');
}

// 8–9. Knowledge isolation / no omniscient access
{
    const ctx = boot();
    ctx.ensureWellRingLodgeCast();
    const ex = ctx.createWellRingTheftKnowledgeExample({
        culpritId: 'real_culprit',
        weiSuspectId: 'wrong_outer'
    });
    assert(ex.incident.facts.culpritId === 'real_culprit', 'fixture stores objective culprit');
    assert(ex.belief.claim.culpritId === 'wrong_outer', 'Wei belief may be wrong');
    assert(ex.liangKnows === false, 'Liang does not automatically know');
    assert(ctx.npcKnowsAboutIncident(ex.weiId, ex.incident.id) === true, 'Wei knows via observation/belief');
    assert(ctx.npcKnowsAboutIncident(ex.liangId, ex.incident.id) === false, 'Liang isolated');

    const known = ctx.getNpcKnownAboutIncident(ex.weiId, ex.incident.id);
    assert(known.primaryBelief.claim.culpritId === 'wrong_outer', 'safe knowledge API returns belief not objective');
    assert(!JSON.stringify(known).includes('slipped_from_storehouse'), 'known view omits unobserved objective method');
    const objective = ctx.getNpcIncidentObjective(ex.incident.id);
    assert(objective.facts.method === 'slipped_from_storehouse_at_dusk', 'objective ledger still holds full facts');

    // Liang only learns if explicitly given a report
    ctx.recordNpcObservation({
        observerId: ex.liangId,
        incidentId: ex.incident.id,
        source: 'report',
        details: { heardFrom: ex.weiId, rumourCulpritId: 'wrong_outer' },
        confidence: 0.35
    });
    ctx.formNpcBelief({
        believerId: ex.liangId,
        incidentId: ex.incident.id,
        claimTopic: 'culprit',
        claim: { culpritId: 'wrong_outer' },
        confidence: 0.35
    });
    assert(ctx.npcKnowsAboutIncident(ex.liangId, ex.incident.id) === true, 'Liang learns only via explicit report');
}

// 10–11. Save/load + migration idempotence
{
    const ctx = boot();
    ctx.ensureWellRingLodgeCast();
    ctx.createWellRingTheftKnowledgeExample({ incidentId: 'inc_save_1' });
    const saved = JSON.parse(JSON.stringify({
        npcIncidents: ctx.G.npcIncidents,
        npcObservations: ctx.G.npcObservations,
        npcBeliefs: ctx.G.npcBeliefs,
        worldNpcs: ctx.G.worldNpcs,
        wellRing: ctx.G.wellRing
    }));
    const ctx2 = boot({
        npcIncidents: saved.npcIncidents,
        npcObservations: saved.npcObservations,
        npcBeliefs: saved.npcBeliefs,
        worldNpcs: saved.worldNpcs,
        wellRing: saved.wellRing
    });
    ctx2.migrateNpcIncidentsForExistingSave();
    ctx2.migrateNpcIncidentsForExistingSave();
    assert(ctx2.getNpcIncidentObjective('inc_save_1').facts.item === 'spirit_herb_pouch', 'incident survives save/load');
    assert(ctx2.getNpcBeliefsFor('wr_wei_shun').length >= 1, 'beliefs survive save/load');
    assert(ctx2.G.npcIncidents.nextSeq >= 1, 'seq preserved');
    // Old save without knowledge
    const ctx3 = boot({ npcIncidents: null, npcObservations: null, npcBeliefs: null });
    ctx3.migrateNpcIncidentsForExistingSave();
    assert(ctx3.G.npcIncidents.byId && ctx3.G.npcObservations.byId && ctx3.G.npcBeliefs.byId, 'old saves acquire empty stores');
}

// 12. Bounded storage + reference safety
{
    const ctx = boot({ ageMonths: 500 });
    for (let i = 0; i < 5; i++) {
        ctx.createNpcIncident({
            id: `inc_cap_${i}`,
            type: 'slight',
            severity: 1,
            atMonths: 100 + i, // older than archiveOlderThanMonths (120)
            facts: { n: i },
            pinned: i === 4
        });
    }
    // Record observation before age-archive can move the target out of active.
    ctx.createNpcIncident({
        id: 'inc_cap_ref',
        type: 'slight',
        severity: 1,
        atMonths: 480,
        facts: { n: 'ref' }
    });
    ctx.recordNpcObservation({
        observerId: 'wr_wei_shun',
        incidentId: 'inc_cap_ref',
        direct: true,
        details: { n: 'ref' }
    });
    // Force an old unreferenced twin through prune while refs stay live
    ctx.createNpcIncident({
        id: 'inc_cap_old_unref',
        type: 'slight',
        severity: 1,
        atMonths: 50,
        facts: { n: 'old' }
    });
    ctx.pruneNpcIncidentLedger();
    assert(!!ctx.getNpcIncidentObjective('inc_cap_4'), 'pinned incident retained');
    assert(!!ctx.getNpcIncidentObjective('inc_cap_ref'), 'referenced incident retained');
    assert(!!ctx.G.npcIncidents.archived.inc_cap_0 || !ctx.G.npcIncidents.byId.inc_cap_0, 'old mild unreferenced archived');
    assert(!!ctx.G.npcIncidents.archived.inc_cap_old_unref || !ctx.G.npcIncidents.byId.inc_cap_old_unref, 'freshly pruned old mild archived');
    assert(!!ctx.G.npcIncidents.byId.inc_cap_4, 'pinned stays active');
    assert(!!ctx.G.npcIncidents.byId.inc_cap_ref, 'referenced stays active');
}

// 13. Missing / deceased participants do not corrupt
{
    const ctx = boot();
    ctx.ensureWellRingLodgeCast();
    const dead = ctx.getWellRingCastNpc('rival');
    dead.alive = false;
    const inc = ctx.createNpcIncident({
        id: 'inc_dead',
        type: 'dispute',
        participants: [{ id: 'wr_wei_shun', role: 'actor' }, { id: 'missing_npc', role: 'target' }],
        facts: { note: 'ok' }
    });
    ctx.recordNpcObservation({
        observerId: 'wr_wei_shun',
        incidentId: inc.id,
        direct: true,
        details: { seen: true }
    });
    assert(ctx.getNpcObservationsFor('wr_wei_shun').length >= 1, 'dead observer still has stored observation');
    assert(ctx.getNpcIncidentObjective('inc_dead').participants.some(p => p.id === 'missing_npc'), 'missing participant id stored safely');
}

// 14. Compatibility with #201–203 (cast + foundations + ties intact)
{
    const ctx = boot();
    ctx.ensureWellRingLodgeCast();
    ctx.migrateNpcAgencyFoundationsAndTies();
    ctx.createWellRingTheftKnowledgeExample();
    const master = ctx.getWellRingCastNpc('hall_master');
    assert(master.personalities.includes('careful') && master.personalities.includes('loyal'), 'Liang personalities intact');
    assert(ctx.getNpcCharacterFoundation(master).values.some(v => v.id === 'lodge_legacy'), 'foundations intact');
    assert(ctx.getNpcTiesFor('wr_master_liang').length >= 1, 'ties intact');
}

// 15. No second clock / no worldNpcs pair scan in module
{
    const src = read('npc-incidents.js');
    assert(!/processWorldTime|registerWorldTick|advanceTimeQuiet/.test(src), 'no new world clock hooks');
    assert(!/for\s*\(.*worldNpcs[\s\S]{0,80}worldNpcs/.test(src), 'no global NPC-pair iteration');
}

if (failed) {
    console.error(`\n${failed} failure(s)`);
    process.exit(1);
}
console.log('\nAll NPC incident/belief tests passed.');
