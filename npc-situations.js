// Lightweight situation threads (NPC agency Phase D).
// Incident → thread → beat → decision (intention) → outcome.
// First pack: Well-Ring lodge resource accusation. Architecture is pack-driven.

const NPC_SITUATION_VERSION = 1;

const NPC_SITUATION_RETENTION = {
    maxActiveThreads: 8,
    maxResolvedKeep: 24,
    maxOutcomes: 120,
    defaultThreadMonths: 18,
    wellRingAccusationCooldownMonths: 48,
    // Natural checks: once per this many months, then low roll
    wellRingNaturalCheckEveryMonths: 6,
    wellRingNaturalChance: 0.08
};

const WELL_RING_ACCUSATION_TEMPLATE = 'well_ring_resource_accusation';

const WELL_RING_ACCUSATION_OPTIONS = [
    {
        id: 'ignore',
        label: 'Ignore the matter',
        baseScore: 0.55,
        tags: ['inaction']
    },
    {
        id: 'defer',
        label: 'Defer for now',
        baseScore: 0.7,
        tags: ['inaction', 'cautious', 'practical']
    },
    {
        id: 'investigate',
        label: 'Quietly investigate',
        baseScore: 0.85,
        tags: ['investigate', 'cautious', 'practical', 'protect_institution']
    },
    {
        id: 'speak_to_accused',
        label: 'Speak privately with the accused',
        baseScore: 0.75,
        tags: ['negotiate', 'protect_own', 'practical'],
        requiresAccusedAvailable: true,
        requiresBelief: true
    },
    {
        id: 'warn',
        label: 'Issue a quiet warning',
        baseScore: 0.65,
        tags: ['protect_institution', 'practical', 'needs_certainty'],
        requiresAccusedAvailable: true,
        requiresBelief: true
    },
    {
        id: 'formal_discipline',
        label: 'Formal discipline',
        baseScore: 0.35,
        tags: ['harsh', 'protect_institution', 'needs_certainty', 'spectacle'],
        requiresAuthority: true,
        requiresAccusedAvailable: true,
        requiresBelief: true
    }
];

function ensureNpcSituationState() {
    if (typeof G === 'undefined') return null;
    if (!G.npcSituationThreads || typeof G.npcSituationThreads !== 'object') {
        G.npcSituationThreads = {
            version: NPC_SITUATION_VERSION,
            nextSeq: 1,
            byId: {},
            activeIds: [],
            lastNaturalByTemplate: {},
            lastNaturalCheckMonths: null
        };
    }
    const s = G.npcSituationThreads;
    if (s.version == null) s.version = NPC_SITUATION_VERSION;
    if (s.nextSeq == null) s.nextSeq = 1;
    if (!s.byId) s.byId = {};
    if (!Array.isArray(s.activeIds)) s.activeIds = Object.keys(s.byId).filter(id => s.byId[id]?.status === 'active');
    if (!s.lastNaturalByTemplate) s.lastNaturalByTemplate = {};

    if (!G.npcSituationOutcomes || typeof G.npcSituationOutcomes !== 'object') {
        G.npcSituationOutcomes = { version: NPC_SITUATION_VERSION, nextSeq: 1, byId: {}, byThread: {} };
    }
    const o = G.npcSituationOutcomes;
    if (o.version == null) o.version = NPC_SITUATION_VERSION;
    if (o.nextSeq == null) o.nextSeq = 1;
    if (!o.byId) o.byId = {};
    if (!o.byThread) o.byThread = {};
    return s;
}

function cloneNpcSituationRecord(obj) {
    return obj == null ? null : JSON.parse(JSON.stringify(obj));
}

function allocateNpcSituationId(prefix) {
    const s = ensureNpcSituationState();
    const seq = s.nextSeq++;
    return `${prefix || 'sit'}_${Math.floor(G.ageMonths || 0)}_${seq}`;
}

function allocateNpcOutcomeId() {
    ensureNpcSituationState();
    const seq = G.npcSituationOutcomes.nextSeq++;
    return `out_${Math.floor(G.ageMonths || 0)}_${seq}`;
}

function getNpcSituationThread(threadId) {
    ensureNpcSituationState();
    return cloneNpcSituationRecord(G.npcSituationThreads.byId[threadId]);
}

function listActiveNpcSituationThreads(templateId) {
    ensureNpcSituationState();
    return (G.npcSituationThreads.activeIds || [])
        .map(id => G.npcSituationThreads.byId[id])
        .filter(t => t && t.status === 'active' && (!templateId || t.templateId === templateId))
        .map(cloneNpcSituationRecord);
}

function hasActiveNpcSituation(templateId) {
    return listActiveNpcSituationThreads(templateId).length > 0;
}

/** Retention hook for npc-incidents.js — protect active thread incident refs. */
function isIncidentReferencedBySituationThreads(incidentId) {
    if (!incidentId || typeof G === 'undefined' || !G.npcSituationThreads) return false;
    ensureNpcSituationState();
    return Object.values(G.npcSituationThreads.byId).some(t => {
        if (!t) return false;
        if (t.status !== 'active' && t.status !== 'dormant') return false;
        if (t.rootIncidentId === incidentId) return true;
        return (t.relatedIncidentIds || []).includes(incidentId);
    });
}

function pinIncidentForSituation(incidentId) {
    if (!incidentId || typeof ensureNpcIncidentState !== 'function') return;
    ensureNpcIncidentState();
    const inc = G.npcIncidents.byId[incidentId] || G.npcIncidents.archived[incidentId];
    if (inc) inc.pinned = true;
}

function rebuildNpcSituationActiveIndex() {
    ensureNpcSituationState();
    G.npcSituationThreads.activeIds = Object.keys(G.npcSituationThreads.byId)
        .filter(id => G.npcSituationThreads.byId[id]?.status === 'active');
}

function registerNpcSituationThread(thread) {
    ensureNpcSituationState();
    G.npcSituationThreads.byId[thread.id] = thread;
    rebuildNpcSituationActiveIndex();
    if (thread.rootIncidentId) pinIncidentForSituation(thread.rootIncidentId);
    pruneNpcSituationStores();
    return cloneNpcSituationRecord(thread);
}

function setNpcSituationStatus(threadId, status, extra) {
    ensureNpcSituationState();
    const t = G.npcSituationThreads.byId[threadId];
    if (!t) return null;
    t.status = status;
    t.updatedAtMonths = G.ageMonths || 0;
    if (extra && typeof extra === 'object') Object.assign(t, extra);
    if (status !== 'active') {
        cancelNpcSituationBeat(threadId);
    }
    rebuildNpcSituationActiveIndex();
    return cloneNpcSituationRecord(t);
}

function cancelNpcSituationBeat(threadId) {
    if (typeof cancelWorldEvents !== 'function') return;
    cancelWorldEvents(e => e.type === 'npc_situation_beat' && e.payload?.threadId === threadId);
}

function scheduleNpcSituationBeat(threadId, atMonths) {
    ensureNpcSituationState();
    const t = G.npcSituationThreads.byId[threadId];
    if (!t || t.status !== 'active') return null;
    const at = Math.floor(atMonths != null ? atMonths : (G.ageMonths || 0));
    t.nextBeatAt = at;
    t.updatedAtMonths = G.ageMonths || 0;
    if (typeof scheduleWorldEvent === 'function') {
        scheduleWorldEvent('npc_situation_beat', at, { threadId }, { id: `npc_sit_beat_${threadId}` });
    }
    return at;
}

function recordNpcSituationOutcome(spec) {
    ensureNpcSituationState();
    const id = spec.id || allocateNpcOutcomeId();
    const outcome = {
        id,
        threadId: spec.threadId || null,
        decisionId: spec.decisionId || null,
        atMonths: spec.atMonths != null ? spec.atMonths : (G.ageMonths || 0),
        action: spec.action || 'unknown',
        success: spec.success !== false,
        effects: Array.isArray(spec.effects) ? spec.effects.map(cloneNpcSituationRecord) : [],
        notes: spec.notes || null,
        meta: spec.meta && typeof spec.meta === 'object' ? cloneNpcSituationRecord(spec.meta) : {}
    };
    G.npcSituationOutcomes.byId[id] = outcome;
    if (outcome.threadId) {
        if (!G.npcSituationOutcomes.byThread[outcome.threadId]) G.npcSituationOutcomes.byThread[outcome.threadId] = [];
        if (!G.npcSituationOutcomes.byThread[outcome.threadId].includes(id)) {
            G.npcSituationOutcomes.byThread[outcome.threadId].push(id);
        }
        const t = G.npcSituationThreads.byId[outcome.threadId];
        if (t) {
            t.outcomeIds = t.outcomeIds || [];
            if (!t.outcomeIds.includes(id)) t.outcomeIds.push(id);
            t.updatedAtMonths = G.ageMonths || 0;
        }
    }
    if (outcome.decisionId && typeof markNpcDecisionCompleted === 'function') {
        markNpcDecisionCompleted(outcome.decisionId, id);
    }
    pruneNpcSituationStores();
    return cloneNpcSituationRecord(outcome);
}

function getNpcSituationOutcomesFor(threadId) {
    ensureNpcSituationState();
    const ids = G.npcSituationOutcomes.byThread[threadId] || [];
    return ids.map(id => G.npcSituationOutcomes.byId[id]).filter(Boolean).map(cloneNpcSituationRecord);
}

function pruneNpcSituationStores() {
    ensureNpcSituationState();
    const ret = NPC_SITUATION_RETENTION;
    const resolved = Object.values(G.npcSituationThreads.byId)
        .filter(t => t && t.status !== 'active' && t.status !== 'dormant')
        .sort((a, b) => (a.updatedAtMonths || 0) - (b.updatedAtMonths || 0));
    while (resolved.length > ret.maxResolvedKeep) {
        const drop = resolved.shift();
        if (!drop) break;
        delete G.npcSituationThreads.byId[drop.id];
    }
    rebuildNpcSituationActiveIndex();

    const outIds = Object.keys(G.npcSituationOutcomes.byId)
        .sort((a, b) => (G.npcSituationOutcomes.byId[a].atMonths || 0) - (G.npcSituationOutcomes.byId[b].atMonths || 0));
    while (outIds.length > ret.maxOutcomes) {
        const dropId = outIds.shift();
        const out = G.npcSituationOutcomes.byId[dropId];
        if (!out) continue;
        const thread = out.threadId ? G.npcSituationThreads.byId[out.threadId] : null;
        if (thread && (thread.status === 'active' || thread.status === 'dormant')) continue;
        delete G.npcSituationOutcomes.byId[dropId];
        if (out.threadId && G.npcSituationOutcomes.byThread[out.threadId]) {
            G.npcSituationOutcomes.byThread[out.threadId] =
                G.npcSituationOutcomes.byThread[out.threadId].filter(x => x !== dropId);
        }
    }
}

function resolveWellRingActorIds() {
    const liang = typeof getWellRingCastNpc === 'function' ? getWellRingCastNpc('hall_master') : null;
    const wei = typeof getWellRingCastNpc === 'function' ? getWellRingCastNpc('rival') : null;
    return {
        liangId: liang?.uid || 'wr_master_liang',
        weiId: wei?.uid || 'wr_wei_shun',
        liang,
        wei
    };
}

function isWellRingAccusationEligible(options) {
    options = options || {};
    ensureNpcSituationState();
    if (typeof ensureWellRingLodgeCast === 'function') ensureWellRingLodgeCast();
    const { liang, wei } = resolveWellRingActorIds();
    if (!liang || liang.alive === false) return { ok: false, reason: 'no_living_hall_master' };
    if (!wei) return { ok: false, reason: 'no_rival_cast' }; // lodge cast incomplete
    if (hasActiveNpcSituation(WELL_RING_ACCUSATION_TEMPLATE)) {
        return { ok: false, reason: 'already_active' };
    }
    if (!options.ignoreCooldown) {
        const last = G.npcSituationThreads.lastNaturalByTemplate[WELL_RING_ACCUSATION_TEMPLATE];
        const cd = NPC_SITUATION_RETENTION.wellRingAccusationCooldownMonths;
        if (last != null && (G.ageMonths || 0) - last < cd) {
            return { ok: false, reason: 'cooldown', remaining: cd - ((G.ageMonths || 0) - last) };
        }
    }
    return { ok: true, liangId: liang.uid, weiId: wei.uid };
}

/**
 * Shared machinery for developer + natural Well-Ring resource accusation.
 * Does not force guilt onto Wei Shun; does not invent privileged disciples.
 */
function beginWellRingResourceAccusation(options) {
    options = options || {};
    ensureNpcSituationState();
    if (typeof ensureWellRingLodgeCast === 'function') ensureWellRingLodgeCast();
    if (typeof ensureNpcIncidentState === 'function') ensureNpcIncidentState();
    if (typeof migrateNpcDecisionsForExistingSave === 'function') migrateNpcDecisionsForExistingSave();

    const eligibility = isWellRingAccusationEligible({ ignoreCooldown: !!options.ignoreCooldown || !!options.developer });
    if (!eligibility.ok && !options.force) {
        return { ok: false, reason: eligibility.reason, remaining: eligibility.remaining };
    }

    const { liangId, weiId } = resolveWellRingActorIds();
    const trueCulpritId = options.trueCulpritId || 'wr_unknown_outer';
    const accusedId = options.accusedId || options.liangSuspectId || 'wr_unknown_outer';
    const evidenceStrength = options.evidenceStrength || 'weak';
    const accusationReliable = options.accusationReliable != null
        ? !!options.accusationReliable
        : accusedId === trueCulpritId;

    // Objective incident — knowledge not auto-granted.
    const incident = typeof createNpcIncident === 'function'
        ? createNpcIncident({
            id: options.incidentId || null,
            type: 'theft',
            zoneId: 'dustbone',
            locationId: 'redwell',
            orgId: typeof WELL_RING_LODGE_ID !== 'undefined' ? WELL_RING_LODGE_ID : 'well_ring_lodge',
            severity: 3,
            participants: [
                { id: trueCulpritId, role: 'actor' },
                { id: weiId, role: 'nearby' },
                { id: liangId, role: 'authority' }
            ],
            facts: {
                what: 'lodge_resource_misuse_or_theft',
                item: options.item || 'spirit_herb_pouch',
                culpritId: trueCulpritId,
                accusationReliable
            },
            pinned: true,
            meta: { pack: WELL_RING_ACCUSATION_TEMPLATE }
        })
        : null;

    if (!incident) return { ok: false, reason: 'incident_create_failed' };

    // Optional Wei partial observation (does not inform Liang).
    if (options.weiObserves !== false && typeof recordNpcObservation === 'function') {
        recordNpcObservation({
            observerId: weiId,
            incidentId: incident.id,
            direct: true,
            confidence: 0.5,
            details: {
                sawSash: 'outer_dust_brown',
                note: 'Glimpse near the storehouse only.'
            }
        });
    }

    // Liang knowledge — explicit secondhand report only (never objective facts).
    const liangConfidence = options.liangBeliefConfidence != null
        ? options.liangBeliefConfidence
        : (evidenceStrength === 'strong' ? 0.72 : evidenceStrength === 'moderate' ? 0.5 : 0.32);

    if (typeof recordNpcObservation === 'function') {
        recordNpcObservation({
            observerId: liangId,
            incidentId: incident.id,
            source: 'report',
            confidence: Math.max(0.2, liangConfidence - 0.05),
            details: {
                heardFrom: options.reportSource || 'outer_steward',
                rumourCulpritId: accusedId,
                evidenceStrength,
                note: 'Secondhand lodge report — not personally witnessed.'
            }
        });
    }
    if (typeof formNpcBelief === 'function') {
        formNpcBelief({
            believerId: liangId,
            incidentId: incident.id,
            claimTopic: 'culprit',
            claim: {
                culpritId: accusedId,
                certaintyNote: evidenceStrength === 'strong' ? 'fairly_sure' : 'uncertain'
            },
            confidence: liangConfidence,
            source: 'report',
            note: 'Hall master belief from lodge report.'
        });
    }

    // Optional importance: soft temporary institutional attachment flag on thread (not personality drift).
    const accusedImportant = options.accusedImportantToLiang != null
        ? !!options.accusedImportantToLiang
        : (accusedId === weiId);

    const threadId = options.threadId || allocateNpcSituationId('sit_wr_acc');
    const now = G.ageMonths || 0;
    const thread = {
        id: threadId,
        templateId: WELL_RING_ACCUSATION_TEMPLATE,
        status: 'active',
        stage: 'await_decision',
        rootIncidentId: incident.id,
        relatedIncidentIds: [],
        participants: {
            hallMasterId: liangId,
            accusedId,
            trueCulpritId, // stored for tests/devtools only — never fed into decision knowledge APIs
            rivalId: weiId
        },
        nextBeatAt: null,
        decisionIds: [],
        outcomeIds: [],
        flags: {
            developer: !!options.developer,
            natural: !!options.natural,
            evidenceStrength,
            accusationReliable,
            accusedAvailable: options.accusedAvailable !== false,
            accusedImportantToLiang: accusedImportant,
            pressure: Number(options.pressure) || 0,
            investigated: false,
            playerInvolved: false,
            forceChoice: options.forceChoice || null
        },
        createdAtMonths: now,
        updatedAtMonths: now,
        expiresAtMonths: now + (options.durationMonths || NPC_SITUATION_RETENTION.defaultThreadMonths),
        meta: {
            pack: WELL_RING_ACCUSATION_TEMPLATE,
            seed: options.seed != null ? options.seed : null
        }
    };

    registerNpcSituationThread(thread);

    if (options.natural) {
        G.npcSituationThreads.lastNaturalByTemplate[WELL_RING_ACCUSATION_TEMPLATE] = now;
    }

    const beatAt = options.decideImmediately
        ? now
        : now + (options.decisionDelayMonths != null ? options.decisionDelayMonths : 0);
    scheduleNpcSituationBeat(threadId, beatAt);

    if (options.decideImmediately || beatAt <= now) {
        processNpcSituationBeat(threadId);
    }

    return {
        ok: true,
        thread: getNpcSituationThread(threadId),
        incident,
        liangId,
        weiId,
        accusedId,
        trueCulpritId
    };
}

/** Deterministic developer / test entry — same machinery as natural. */
function startWellRingResourceAccusationScenario(options) {
    options = options || {};
    return beginWellRingResourceAccusation(Object.assign({
        developer: true,
        ignoreCooldown: true,
        decideImmediately: options.decideImmediately !== false,
        weiObserves: options.weiObserves != null ? options.weiObserves : true
    }, options));
}

function buildWellRingAccusationDecisionSpec(thread, seed, forceChoice) {
    const liangId = thread.participants.hallMasterId;
    const accusedId = thread.participants.accusedId;
    return {
        actorId: liangId,
        incidentId: thread.rootIncidentId,
        accusedId,
        threadId: thread.id,
        institutionalRole: 'hall_master',
        authority: true,
        accusedAvailable: thread.flags.accusedAvailable !== false,
        accusedImportant: !!thread.flags.accusedImportantToLiang,
        evidenceStrength: thread.flags.evidenceStrength || 'weak',
        pressure: Number(thread.flags.pressure) || 0,
        optionDefs: WELL_RING_ACCUSATION_OPTIONS,
        seed: seed != null ? seed : thread.meta?.seed,
        forceChoice: forceChoice || thread.flags.forceChoice || null
    };
}

function attemptWellRingAccusationAction(thread, decision) {
    const action = decision.chosen;
    const accusedId = thread.participants.accusedId;
    const liangId = thread.participants.hallMasterId;
    const effects = [];
    let success = true;
    let notes = '';

    // Authority / availability gates on outcome — intention may still have been chosen.
    if (['speak_to_accused', 'warn', 'formal_discipline'].includes(action)) {
        if (thread.flags.accusedAvailable === false) {
            success = false;
            notes = 'Accused unavailable; action could not be carried out.';
            effects.push({ type: 'blocked', reason: 'accused_unavailable' });
            return { action, success, effects, notes };
        }
    }

    if (action === 'ignore' || action === 'defer') {
        notes = action === 'ignore'
            ? 'Hall master let the report sit without action.'
            : 'Hall master deferred judgment pending clearer word.';
        effects.push({ type: 'thread_status', status: 'resolved', resolution: action });
        return { action, success: true, effects, notes };
    }

    if (action === 'investigate') {
        // Investigation does NOT reveal objective truth.
        thread.flags.investigated = true;
        const known = typeof getNpcKnownAboutIncident === 'function'
            ? getNpcKnownAboutIncident(liangId, thread.rootIncidentId)
            : null;
        const bel = known?.primaryBelief;
        if (bel && typeof updateNpcBelief === 'function') {
            // Slight confidence nudge only — no auto-correct to facts.culpritId.
            const nextConf = Math.min(0.85, (bel.confidence || 0.3) + 0.08);
            updateNpcBelief(bel.id, { confidence: nextConf }, { mode: 'force' });
            effects.push({ type: 'belief_confidence_nudge', beliefId: bel.id, confidence: nextConf });
        }
        if (typeof recordNpcObservation === 'function') {
            recordNpcObservation({
                observerId: liangId,
                incidentId: thread.rootIncidentId,
                source: 'direct',
                direct: true,
                confidence: 0.45,
                details: {
                    checkedStorehouse: true,
                    foundMissingStock: true,
                    identifiedCulpritId: null,
                    note: 'Quiet check confirmed missing stock; culprit still unclear.'
                }
            });
            effects.push({ type: 'observation_added', kind: 'investigation_partial' });
        }
        notes = 'Quiet investigation confirmed a loss but did not identify the culprit.';
        effects.push({ type: 'thread_status', status: 'resolved', resolution: 'investigated_unresolved' });
        return { action, success: true, effects, notes };
    }

    if (action === 'speak_to_accused') {
        notes = 'Private word was had with the accused; no formal mark on the lodge board.';
        effects.push({ type: 'conversation', with: accusedId, tone: 'private_inquiry' });
        effects.push({ type: 'thread_status', status: 'resolved', resolution: 'spoke_privately' });
        return { action, success: true, effects, notes };
    }

    if (action === 'warn') {
        notes = 'A quiet warning was issued to the accused.';
        effects.push({ type: 'warning', targetId: accusedId });
        if (accusedId === thread.participants.rivalId && typeof adjustWellRingRivalMerit === 'function') {
            adjustWellRingRivalMerit(-1);
            effects.push({ type: 'rival_merit_delta', delta: -1 });
        }
        effects.push({ type: 'thread_status', status: 'resolved', resolution: 'warned' });
        return { action, success: true, effects, notes };
    }

    if (action === 'formal_discipline') {
        // Requires authority — Liang has it as hall master; still may be socially costly.
        notes = 'Formal discipline was attempted under lodge authority.';
        effects.push({ type: 'discipline', targetId: accusedId, severity: 'formal' });
        if (accusedId === thread.participants.rivalId && typeof adjustWellRingRivalMerit === 'function') {
            adjustWellRingRivalMerit(-3);
            effects.push({ type: 'rival_merit_delta', delta: -3 });
        }
        if (typeof createNpcIncident === 'function') {
            const consequence = createNpcIncident({
                type: 'dispute',
                zoneId: 'dustbone',
                locationId: 'redwell',
                orgId: typeof WELL_RING_LODGE_ID !== 'undefined' ? WELL_RING_LODGE_ID : 'well_ring_lodge',
                severity: 2,
                participants: [
                    { id: liangId, role: 'authority' },
                    { id: accusedId, role: 'target' }
                ],
                facts: {
                    what: 'formal_lodge_discipline',
                    relatedAccusationIncidentId: thread.rootIncidentId
                },
                relatedIncidentIds: [thread.rootIncidentId],
                pinned: true,
                meta: { consequenceOf: thread.id }
            });
            if (consequence) {
                thread.relatedIncidentIds = thread.relatedIncidentIds || [];
                thread.relatedIncidentIds.push(consequence.id);
                effects.push({ type: 'consequence_incident', incidentId: consequence.id });
            }
        }
        effects.push({ type: 'thread_status', status: 'resolved', resolution: 'disciplined' });
        return { action, success: true, effects, notes };
    }

    notes = 'No recognised action; treated as inaction.';
    effects.push({ type: 'thread_status', status: 'resolved', resolution: 'inaction' });
    return { action: action || 'inaction', success: true, effects, notes };
}

function processNpcSituationBeat(threadId) {
    ensureNpcSituationState();
    const thread = G.npcSituationThreads.byId[threadId];
    if (!thread) return { ok: false, reason: 'missing_thread' };
    if (thread.status !== 'active') return { ok: false, reason: 'not_active', status: thread.status };

    // Safe termination: expired
    if (thread.expiresAtMonths != null && (G.ageMonths || 0) > thread.expiresAtMonths) {
        setNpcSituationStatus(threadId, 'expired', { stage: 'expired' });
        return { ok: true, expired: true };
    }

    // Missing / dead hall master
    const liangId = thread.participants?.hallMasterId;
    let liangAlive = true;
    if (typeof findWorldNpcRecordByUid === 'function' && liangId) {
        const npc = findWorldNpcRecordByUid(liangId);
        if (npc && npc.alive === false) liangAlive = false;
        if (!npc && typeof getWellRingCastNpc === 'function') {
            const cast = getWellRingCastNpc('hall_master');
            if (cast && cast.alive === false) liangAlive = false;
            if (!cast) liangAlive = false;
        }
    }
    if (!liangAlive) {
        setNpcSituationStatus(threadId, 'expired', { stage: 'actor_dead', flags: Object.assign({}, thread.flags, { endedReason: 'hall_master_dead' }) });
        return { ok: true, expired: true, reason: 'hall_master_dead' };
    }

    if (thread.stage === 'await_decision' || thread.stage === 'decide') {
        // Guard against duplicate processing after load / double fire
        if (thread.flags.decisionProcessed) {
            return { ok: false, reason: 'already_processed' };
        }

        const decision = resolveNpcContextualDecision(buildWellRingAccusationDecisionSpec(thread, thread.meta?.seed, thread.flags.forceChoice));
        if (!decision) {
            setNpcSituationStatus(threadId, 'expired', { stage: 'decision_failed' });
            return { ok: false, reason: 'decision_failed' };
        }

        thread.decisionIds = thread.decisionIds || [];
        thread.decisionIds.push(decision.id);
        thread.stage = 'attempt_action';
        thread.flags.decisionProcessed = true;
        thread.updatedAtMonths = G.ageMonths || 0;
        if (typeof markNpcDecisionAttempted === 'function') markNpcDecisionAttempted(decision.id);

        const attempt = attemptWellRingAccusationAction(thread, decision);
        const outcome = recordNpcSituationOutcome({
            threadId,
            decisionId: decision.id,
            action: attempt.action,
            success: attempt.success,
            effects: attempt.effects,
            notes: attempt.notes
        });

        const statusEffect = (attempt.effects || []).find(e => e.type === 'thread_status');
        if (statusEffect?.status) {
            setNpcSituationStatus(threadId, statusEffect.status, {
                stage: statusEffect.resolution || statusEffect.status,
                flags: thread.flags
            });
        } else {
            setNpcSituationStatus(threadId, 'resolved', { stage: 'completed', flags: thread.flags });
        }

        // Developer-visible trace only — no player omniscient log by default.
        thread.meta = thread.meta || {};
        thread.meta.lastTrace = {
            decisionId: decision.id,
            chosen: decision.chosen,
            factors: decision.factors,
            outcomeId: outcome.id,
            success: outcome.success,
            notes: outcome.notes
        };

        return {
            ok: true,
            decision,
            outcome,
            thread: getNpcSituationThread(threadId)
        };
    }

    setNpcSituationStatus(threadId, 'resolved', { stage: 'noop' });
    return { ok: true, noop: true };
}

function handleNpcSituationBeatEvent(payload) {
    const threadId = payload?.threadId;
    if (!threadId) return;
    processNpcSituationBeat(threadId);
}

/**
 * Cheap monthly tick — Well-Ring eligibility only; no global NPC-pair scans.
 */
function tickNpcSituationThreads(deltaMonths) {
    ensureNpcSituationState();
    const now = G.ageMonths || 0;

    // Expire overdue active threads (safety net if beat missed)
    (G.npcSituationThreads.activeIds || []).slice().forEach(id => {
        const t = G.npcSituationThreads.byId[id];
        if (!t || t.status !== 'active') return;
        if (t.expiresAtMonths != null && now > t.expiresAtMonths) {
            setNpcSituationStatus(id, 'expired', { stage: 'expired' });
            return;
        }
        // Process due beats even if scheduler event was lost on legacy path
        if (t.nextBeatAt != null && t.nextBeatAt <= now && !t.flags?.decisionProcessed) {
            processNpcSituationBeat(id);
        }
    });

    maybeTriggerNaturalWellRingAccusation(deltaMonths);
}

function maybeTriggerNaturalWellRingAccusation(/* deltaMonths */) {
    ensureNpcSituationState();
    const now = Math.floor(G.ageMonths || 0);
    const every = NPC_SITUATION_RETENTION.wellRingNaturalCheckEveryMonths;
    const lastCheck = G.npcSituationThreads.lastNaturalCheckMonths;
    if (lastCheck != null && now - lastCheck < every) return null;
    G.npcSituationThreads.lastNaturalCheckMonths = now;

    const eligibility = isWellRingAccusationEligible();
    if (!eligibility.ok) return { ok: false, reason: eligibility.reason };

    const chance = NPC_SITUATION_RETENTION.wellRingNaturalChance;
    const roll = Math.random();
    if (roll > chance) return { ok: false, reason: 'chance_miss', roll, chance };

    // Natural: weak evidence, accuse anonymous outer (not auto-Wei guilt), no player.
    return beginWellRingResourceAccusation({
        natural: true,
        decideImmediately: false,
        decisionDelayMonths: 1,
        evidenceStrength: 'weak',
        accusedId: 'wr_unknown_outer',
        trueCulpritId: 'wr_unknown_outer',
        liangBeliefConfidence: 0.34,
        accusedImportantToLiang: false,
        accusedAvailable: true,
        weiObserves: true
    });
}

function migrateNpcSituationsForExistingSave() {
    ensureNpcSituationState();
    rebuildNpcSituationActiveIndex();
    // Re-pin active incident refs; re-schedule pending beats idempotently
    Object.values(G.npcSituationThreads.byId).forEach(t => {
        if (!t) return;
        if (t.rootIncidentId) pinIncidentForSituation(t.rootIncidentId);
        (t.relatedIncidentIds || []).forEach(pinIncidentForSituation);
        if (t.status === 'active' && t.nextBeatAt != null && !t.flags?.decisionProcessed) {
            scheduleNpcSituationBeat(t.id, t.nextBeatAt);
        }
    });
}

// Scheduler hooks — event-driven; registered once at script load.
if (typeof registerWorldEventHandler === 'function') {
    registerWorldEventHandler('npc_situation_beat', handleNpcSituationBeatEvent);
}
if (typeof registerWorldTick === 'function') {
    registerWorldTick('npcSituations', (delta) => {
        tickNpcSituationThreads(delta);
    }, 45);
}
