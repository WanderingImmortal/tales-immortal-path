// NPC incidents, observations, and beliefs (NPC agency Phase C).
// Objective ledger ≠ what any NPC knows. No chooser, rumour fan-out, or situation threads yet.
//
// Boundaries:
//   Incident     — objective facts (what happened)
//   Observation  — what one NPC perceived / was told (partial, possibly wrong)
//   Belief       — what one NPC currently accepts or suspects
//
// Future decision APIs must use getNpcKnownAboutIncident / getNpcBeliefsFor — never raw
// getNpcIncidentObjective as an NPC's "memory."

const NPC_INCIDENT_VERSION = 1;

const NPC_INCIDENT_TYPE_IDS = [
    'theft',
    'slight',
    'insult',
    'robbery',
    'kill',
    'humiliation_public',
    'betrayal',
    'spare',
    'assault',
    'dispute',
    'other'
];

/** Soft caps — archive low-severity unreferenced incidents; never delete referenced ones. */
const NPC_INCIDENT_RETENTION = {
    maxActiveIncidents: 80,
    maxArchivedIncidents: 40,
    maxObservations: 200,
    maxBeliefs: 200,
    archiveBelowSeverity: 2,
    archiveOlderThanMonths: 120
};

function ensureNpcIncidentState() {
    if (typeof G === 'undefined') return null;
    if (!G.npcIncidents || typeof G.npcIncidents !== 'object') {
        G.npcIncidents = {
            version: NPC_INCIDENT_VERSION,
            nextSeq: 1,
            byId: {},
            order: [],
            archived: {}
        };
    }
    const s = G.npcIncidents;
    if (s.version == null) s.version = NPC_INCIDENT_VERSION;
    if (s.nextSeq == null) s.nextSeq = 1;
    if (!s.byId || typeof s.byId !== 'object') s.byId = {};
    if (!Array.isArray(s.order)) s.order = Object.keys(s.byId);
    if (!s.archived || typeof s.archived !== 'object') s.archived = {};

    if (!G.npcObservations || typeof G.npcObservations !== 'object') {
        G.npcObservations = { version: NPC_INCIDENT_VERSION, nextSeq: 1, byId: {}, byObserver: {}, byIncident: {} };
    }
    const o = G.npcObservations;
    if (o.version == null) o.version = NPC_INCIDENT_VERSION;
    if (o.nextSeq == null) o.nextSeq = 1;
    if (!o.byId) o.byId = {};
    if (!o.byObserver) o.byObserver = {};
    if (!o.byIncident) o.byIncident = {};

    if (!G.npcBeliefs || typeof G.npcBeliefs !== 'object') {
        G.npcBeliefs = { version: NPC_INCIDENT_VERSION, nextSeq: 1, byId: {}, byBeliever: {}, byIncident: {} };
    }
    const b = G.npcBeliefs;
    if (b.version == null) b.version = NPC_INCIDENT_VERSION;
    if (b.nextSeq == null) b.nextSeq = 1;
    if (!b.byId) b.byId = {};
    if (!b.byBeliever) b.byBeliever = {};
    if (!b.byIncident) b.byIncident = {};

    return s;
}

function cloneNpcKnowledgeRecord(obj) {
    return obj == null ? null : JSON.parse(JSON.stringify(obj));
}

function normalizeIncidentParticipant(p) {
    if (!p) return null;
    if (typeof p === 'string') {
        if (p === 'player' || p === 'unknown') return { id: p, role: p === 'player' ? 'actor' : 'unknown' };
        return { id: p, role: 'participant' };
    }
    if (!p.id) return null;
    return {
        id: p.id,
        role: p.role || 'participant',
        kind: p.kind || null
    };
}

function indexPush(map, key, id) {
    if (!key || !id) return;
    if (!map[key]) map[key] = [];
    if (!map[key].includes(id)) map[key].push(id);
}

function indexRemove(map, key, id) {
    if (!map[key]) return;
    map[key] = map[key].filter(x => x !== id);
    if (!map[key].length) delete map[key];
}

function allocateIncidentId(prefix) {
    const s = ensureNpcIncidentState();
    const seq = s.nextSeq++;
    const stamp = Math.floor(G.ageMonths || 0);
    return `${prefix || 'inc'}_${stamp}_${seq}`;
}

/**
 * Create an objective incident. Does not grant any NPC knowledge.
 * facts = structured objective payload; claims/interpretations belong on beliefs.
 */
function createNpcIncident(spec) {
    spec = spec || {};
    const state = ensureNpcIncidentState();
    const type = NPC_INCIDENT_TYPE_IDS.includes(spec.type) ? spec.type : (spec.type ? 'other' : null);
    if (!type && !spec.type) return null;

    const id = spec.id || allocateIncidentId(spec.idPrefix || 'inc');
    if (state.byId[id] || state.archived[id]) return cloneNpcKnowledgeRecord(state.byId[id] || state.archived[id]);

    const participants = Array.isArray(spec.participants)
        ? spec.participants.map(normalizeIncidentParticipant).filter(Boolean)
        : [];

    const incident = {
        id,
        type: type || 'other',
        atMonths: spec.atMonths != null ? spec.atMonths : (G.ageMonths || 0),
        zoneId: spec.zoneId || null,
        locationId: spec.locationId || null,
        orgId: spec.orgId || null,
        severity: spec.severity != null ? Math.max(1, Math.min(5, Math.floor(spec.severity))) : 2,
        participants,
        // Objective facts only — never treat as universal NPC knowledge.
        facts: spec.facts && typeof spec.facts === 'object' ? cloneNpcKnowledgeRecord(spec.facts) : {},
        relatedIncidentIds: Array.isArray(spec.relatedIncidentIds) ? spec.relatedIncidentIds.slice() : [],
        meta: spec.meta && typeof spec.meta === 'object' ? cloneNpcKnowledgeRecord(spec.meta) : {},
        pinned: !!spec.pinned,
        archived: false,
        createdAtMonths: G.ageMonths || 0
    };

    state.byId[id] = incident;
    state.order.push(id);
    pruneNpcIncidentLedger();
    return cloneNpcKnowledgeRecord(incident);
}

/** Objective read — for tests, tooling, and future thread engines. Not for NPC "memory." */
function getNpcIncidentObjective(incidentId) {
    ensureNpcIncidentState();
    const s = G.npcIncidents;
    const inc = s.byId[incidentId] || s.archived[incidentId];
    return cloneNpcKnowledgeRecord(inc);
}

function listNpcIncidents(options) {
    options = options || {};
    ensureNpcIncidentState();
    const s = G.npcIncidents;
    let ids = (s.order || []).slice();
    if (options.includeArchived) {
        ids = ids.concat(Object.keys(s.archived || {}));
    }
    const out = [];
    ids.forEach(id => {
        const inc = s.byId[id] || (options.includeArchived ? s.archived[id] : null);
        if (!inc) return;
        if (options.type && inc.type !== options.type) return;
        if (options.zoneId && inc.zoneId !== options.zoneId) return;
        if (options.orgId && inc.orgId !== options.orgId) return;
        if (options.participantId) {
            const hit = (inc.participants || []).some(p => p.id === options.participantId);
            if (!hit) return;
        }
        out.push(cloneNpcKnowledgeRecord(inc));
    });
    return out;
}

function incidentIsReferenced(incidentId) {
    ensureNpcIncidentState();
    const obs = G.npcObservations.byIncident[incidentId];
    const bel = G.npcBeliefs.byIncident[incidentId];
    if (obs && obs.length) return true;
    if (bel && bel.length) return true;
    const active = G.npcIncidents.byId[incidentId] || G.npcIncidents.archived[incidentId];
    if (active?.pinned) return true;
    // Active / dormant situation threads (Phase D)
    if (typeof isIncidentReferencedBySituationThreads === 'function' &&
        isIncidentReferencedBySituationThreads(incidentId)) {
        return true;
    }
    // Related links from other active incidents
    return Object.values(G.npcIncidents.byId).some(inc =>
        (inc.relatedIncidentIds || []).includes(incidentId)
    );
}

function canArchiveIncident(incidentId) {
    const state = ensureNpcIncidentState();
    const inc = state.byId[incidentId];
    if (!inc || inc.pinned) return false;
    if (incidentIsReferenced(incidentId)) return false;
    return true;
}

/**
 * Archive old low-severity unreferenced incidents. Never deletes referenced records.
 */
function pruneNpcIncidentLedger() {
    const state = ensureNpcIncidentState();
    const ret = NPC_INCIDENT_RETENTION;
    const now = G.ageMonths || 0;

    // Age-based soft archive for mild unreferenced incidents
    state.order.slice().forEach(id => {
        const inc = state.byId[id];
        if (!inc || !canArchiveIncident(id)) return;
        const age = now - (inc.atMonths || 0);
        if (age >= ret.archiveOlderThanMonths && (inc.severity || 0) <= ret.archiveBelowSeverity) {
            archiveNpcIncidentRecord(id);
        }
    });

    // Cap active: archive oldest eligible first
    if (state.order.length > ret.maxActiveIncidents) {
        const eligible = state.order.filter(id => canArchiveIncident(id));
        eligible.sort((a, b) => (state.byId[a].atMonths || 0) - (state.byId[b].atMonths || 0));
        for (let i = 0; i < eligible.length && state.order.length > ret.maxActiveIncidents; i++) {
            archiveNpcIncidentRecord(eligible[i]);
        }
    }

    // Cap archived: drop oldest unreferenced archives only
    const archivedIds = Object.keys(state.archived)
        .sort((a, b) => (state.archived[a].atMonths || 0) - (state.archived[b].atMonths || 0));
    while (archivedIds.length > ret.maxArchivedIncidents) {
        const dropId = archivedIds.shift();
        if (incidentIsReferenced(dropId) || state.archived[dropId]?.pinned) continue;
        delete state.archived[dropId];
    }
}

function archiveNpcIncidentRecord(incidentId) {
    const state = ensureNpcIncidentState();
    const inc = state.byId[incidentId];
    if (!inc) return false;
    if (incidentIsReferenced(incidentId) || inc.pinned) return false;
    inc.archived = true;
    state.archived[incidentId] = inc;
    delete state.byId[incidentId];
    state.order = state.order.filter(id => id !== incidentId);
    return true;
}

// ----- Observations -----

function allocateObservationId() {
    ensureNpcIncidentState();
    const seq = G.npcObservations.nextSeq++;
    return `obs_${Math.floor(G.ageMonths || 0)}_${seq}`;
}

/**
 * Explicit observation API — no automatic world-wide witness detection.
 * details should be partial / possibly inaccurate; never copy full objective facts by default.
 */
function recordNpcObservation(spec) {
    spec = spec || {};
    ensureNpcIncidentState();
    if (!spec.observerId || !spec.incidentId) return null;
    const incident = G.npcIncidents.byId[spec.incidentId] || G.npcIncidents.archived[spec.incidentId];
    if (!incident) return null;

    const id = spec.id || allocateObservationId();
    if (G.npcObservations.byId[id]) return cloneNpcKnowledgeRecord(G.npcObservations.byId[id]);

    const isDirect = spec.direct === true || spec.source === 'direct';
    const obs = {
        id,
        observerId: spec.observerId,
        incidentId: spec.incidentId,
        atMonths: spec.atMonths != null ? spec.atMonths : (G.ageMonths || 0),
        source: spec.source || (isDirect ? 'direct' : 'report'),
        direct: isDirect,
        secondhand: !isDirect,
        details: spec.details && typeof spec.details === 'object' ? cloneNpcKnowledgeRecord(spec.details) : {},
        confidence: clampKnowledgeConfidence(
            spec.confidence != null ? spec.confidence : (isDirect ? 0.7 : 0.4)
        ),
        meta: spec.meta && typeof spec.meta === 'object' ? cloneNpcKnowledgeRecord(spec.meta) : {}
    };

    G.npcObservations.byId[id] = obs;
    indexPush(G.npcObservations.byObserver, obs.observerId, id);
    indexPush(G.npcObservations.byIncident, obs.incidentId, id);
    pruneNpcObservationStore();
    return cloneNpcKnowledgeRecord(obs);
}

function clampKnowledgeConfidence(v) {
    const n = Number(v);
    if (Number.isNaN(n)) return 0.5;
    return Math.max(0, Math.min(1, n));
}

function getNpcObservation(observationId) {
    ensureNpcIncidentState();
    return cloneNpcKnowledgeRecord(G.npcObservations.byId[observationId]);
}

function getNpcObservationsFor(observerId) {
    ensureNpcIncidentState();
    const ids = G.npcObservations.byObserver[observerId] || [];
    return ids.map(id => G.npcObservations.byId[id]).filter(Boolean).map(cloneNpcKnowledgeRecord);
}

function getNpcObservationsOfIncident(incidentId) {
    ensureNpcIncidentState();
    const ids = G.npcObservations.byIncident[incidentId] || [];
    return ids.map(id => G.npcObservations.byId[id]).filter(Boolean).map(cloneNpcKnowledgeRecord);
}

function pruneNpcObservationStore() {
    ensureNpcIncidentState();
    const ret = NPC_INCIDENT_RETENTION;
    const ids = Object.keys(G.npcObservations.byId);
    if (ids.length <= ret.maxObservations) return;
    // Drop oldest observations that are not sole evidence for a belief
    const sorted = ids.slice().sort((a, b) => {
        const oa = G.npcObservations.byId[a];
        const ob = G.npcObservations.byId[b];
        return (oa.atMonths || 0) - (ob.atMonths || 0);
    });
    while (sorted.length > ret.maxObservations) {
        const dropId = sorted.shift();
        const obs = G.npcObservations.byId[dropId];
        if (!obs) continue;
        // Keep if a belief cites this observation id
        const cited = Object.values(G.npcBeliefs.byId).some(bel =>
            (bel.sourceObservationIds || []).includes(dropId)
        );
        if (cited) {
            sorted.push(dropId);
            if (sorted.every(id => Object.values(G.npcBeliefs.byId).some(bel =>
                (bel.sourceObservationIds || []).includes(id)
            ))) break;
            continue;
        }
        indexRemove(G.npcObservations.byObserver, obs.observerId, dropId);
        indexRemove(G.npcObservations.byIncident, obs.incidentId, dropId);
        delete G.npcObservations.byId[dropId];
    }
}

// ----- Beliefs -----

function allocateBeliefId() {
    ensureNpcIncidentState();
    const seq = G.npcBeliefs.nextSeq++;
    return `bel_${Math.floor(G.ageMonths || 0)}_${seq}`;
}

function beliefClaimKey(claim) {
    if (!claim || typeof claim !== 'object') return '';
    // Stable-ish key for conflict detection
    const keys = Object.keys(claim).sort();
    return keys.map(k => `${k}:${JSON.stringify(claim[k])}`).join(';');
}

/**
 * Form or refresh a belief from explicit evidence (observation ids / report).
 * Does not read objective incident facts unless the caller put them in the claim.
 */
function formNpcBelief(spec) {
    spec = spec || {};
    ensureNpcIncidentState();
    if (!spec.believerId) return null;
    if (!spec.claim || typeof spec.claim !== 'object') return null;

    const incidentId = spec.incidentId || null;
    const existing = incidentId
        ? findNpcBeliefAbout(spec.believerId, incidentId, spec.claimTopic || null)
        : null;

    if (existing && !spec.forceNew) {
        return updateNpcBelief(existing.id, {
            claim: spec.claim,
            confidence: spec.confidence,
            source: spec.source,
            sourceObservationIds: spec.sourceObservationIds,
            note: spec.note
        }, { mode: spec.updateMode || 'evidence' });
    }

    const id = spec.id || allocateBeliefId();
    const bel = {
        id,
        believerId: spec.believerId,
        incidentId,
        claimTopic: spec.claimTopic || inferBeliefClaimTopic(spec.claim),
        claim: cloneNpcKnowledgeRecord(spec.claim),
        confidence: clampKnowledgeConfidence(spec.confidence != null ? spec.confidence : 0.5),
        source: spec.source || 'observation',
        sourceObservationIds: Array.isArray(spec.sourceObservationIds) ? spec.sourceObservationIds.slice() : [],
        conflictsWith: [],
        updatedAtMonths: G.ageMonths || 0,
        createdAtMonths: G.ageMonths || 0,
        note: spec.note || null
    };

    G.npcBeliefs.byId[id] = bel;
    indexPush(G.npcBeliefs.byBeliever, bel.believerId, id);
    if (bel.incidentId) indexPush(G.npcBeliefs.byIncident, bel.incidentId, id);
    refreshBeliefConflicts(bel.believerId, bel.incidentId);
    pruneNpcBeliefStore();
    return cloneNpcKnowledgeRecord(bel);
}

function inferBeliefClaimTopic(claim) {
    if (!claim) return 'general';
    if (claim.culpritId != null || claim.suspectId != null) return 'culprit';
    if (claim.outcome != null) return 'outcome';
    if (claim.what != null) return 'what';
    return 'general';
}

function findNpcBeliefAbout(believerId, incidentId, claimTopic) {
    ensureNpcIncidentState();
    const ids = G.npcBeliefs.byBeliever[believerId] || [];
    for (let i = 0; i < ids.length; i++) {
        const bel = G.npcBeliefs.byId[ids[i]];
        if (!bel) continue;
        if (bel.incidentId !== incidentId) continue;
        if (claimTopic && bel.claimTopic !== claimTopic) continue;
        if (!claimTopic && bel.claimTopic === 'culprit') return bel;
        if (!claimTopic) return bel;
        return bel;
    }
    // Second pass without topic preference
    if (claimTopic) return null;
    for (let i = 0; i < ids.length; i++) {
        const bel = G.npcBeliefs.byId[ids[i]];
        if (bel && bel.incidentId === incidentId) return bel;
    }
    return null;
}

/**
 * Explicit belief update. Modes:
 *   evidence — replace only if newConfidence >= oldConfidence (default)
 *   reinforce — raise confidence toward new without replacing claim unless equal topic match
 *   force — caller overrides claim/confidence
 * Never auto-corrects from objective ledger.
 */
function updateNpcBelief(beliefId, patch, options) {
    options = options || {};
    ensureNpcIncidentState();
    const bel = G.npcBeliefs.byId[beliefId];
    if (!bel) return null;
    patch = patch || {};
    const mode = options.mode || 'evidence';

    const newConf = patch.confidence != null ? clampKnowledgeConfidence(patch.confidence) : null;
    const hasNewClaim = patch.claim && typeof patch.claim === 'object';

    if (mode === 'force') {
        if (hasNewClaim) bel.claim = cloneNpcKnowledgeRecord(patch.claim);
        if (newConf != null) bel.confidence = newConf;
    } else if (mode === 'reinforce') {
        if (hasNewClaim && beliefClaimKey(patch.claim) === beliefClaimKey(bel.claim)) {
            if (newConf != null) bel.confidence = clampKnowledgeConfidence(Math.max(bel.confidence, newConf));
        } else if (hasNewClaim && newConf != null && newConf > bel.confidence + 0.15) {
            // Stronger evidence wins under reinforce only with clear margin
            bel.claim = cloneNpcKnowledgeRecord(patch.claim);
            bel.confidence = newConf;
        } else if (newConf != null && !hasNewClaim) {
            bel.confidence = clampKnowledgeConfidence(Math.max(bel.confidence, newConf));
        }
    } else {
        // evidence (default): newer claim accepted only if confidence >= existing
        if (hasNewClaim) {
            const incoming = newConf != null ? newConf : bel.confidence;
            if (incoming + 1e-9 >= bel.confidence) {
                bel.claim = cloneNpcKnowledgeRecord(patch.claim);
                bel.confidence = clampKnowledgeConfidence(incoming);
            } else {
                // Weaker conflicting claim — record conflict only
                bel.conflictsWith = bel.conflictsWith || [];
                const weakKey = beliefClaimKey(patch.claim);
                if (weakKey && !bel.conflictsWith.includes(weakKey)) bel.conflictsWith.push(weakKey);
            }
        } else if (newConf != null) {
            bel.confidence = clampKnowledgeConfidence(newConf);
        }
    }

    if (patch.source) bel.source = patch.source;
    if (Array.isArray(patch.sourceObservationIds)) {
        patch.sourceObservationIds.forEach(oid => {
            if (!bel.sourceObservationIds.includes(oid)) bel.sourceObservationIds.push(oid);
        });
    }
    if (patch.note != null) bel.note = patch.note;
    bel.updatedAtMonths = G.ageMonths || 0;
    // Preserve rejected weaker-claim keys across peer refresh
    const preservedConflicts = (bel.conflictsWith || []).slice();
    refreshBeliefConflicts(bel.believerId, bel.incidentId);
    preservedConflicts.forEach(key => {
        if (key && !(bel.conflictsWith || []).includes(key)) bel.conflictsWith.push(key);
    });
    return cloneNpcKnowledgeRecord(bel);
}

function refreshBeliefConflicts(believerId, incidentId) {
    if (!believerId || !incidentId) return;
    ensureNpcIncidentState();
    const ids = (G.npcBeliefs.byBeliever[believerId] || [])
        .map(id => G.npcBeliefs.byId[id])
        .filter(b => b && b.incidentId === incidentId);
    ids.forEach(a => {
        // Keep prior rejected-evidence keys; re-add live peer conflicts.
        const prior = (a.conflictsWith || []).slice();
        a.conflictsWith = prior.slice();
        ids.forEach(b => {
            if (a.id === b.id) return;
            if (a.claimTopic !== b.claimTopic) return;
            if (beliefClaimKey(a.claim) !== beliefClaimKey(b.claim)) {
                const key = beliefClaimKey(b.claim);
                if (key && !a.conflictsWith.includes(key)) a.conflictsWith.push(key);
            }
        });
    });
}

function getNpcBelief(beliefId) {
    ensureNpcIncidentState();
    return cloneNpcKnowledgeRecord(G.npcBeliefs.byId[beliefId]);
}

function getNpcBeliefsFor(believerId) {
    ensureNpcIncidentState();
    const ids = G.npcBeliefs.byBeliever[believerId] || [];
    return ids.map(id => G.npcBeliefs.byId[id]).filter(Boolean).map(cloneNpcKnowledgeRecord);
}

function getNpcBeliefAboutIncident(believerId, incidentId, claimTopic) {
    const bel = findNpcBeliefAbout(believerId, incidentId, claimTopic || null);
    return cloneNpcKnowledgeRecord(bel);
}

/**
 * Safe knowledge view for future decision systems — beliefs + own observations only.
 * Never injects objective incident.facts.
 */
function getNpcKnownAboutIncident(believerId, incidentId) {
    ensureNpcIncidentState();
    const beliefs = getNpcBeliefsFor(believerId).filter(b => b.incidentId === incidentId);
    const observations = getNpcObservationsFor(believerId).filter(o => o.incidentId === incidentId);
    return {
        believerId,
        incidentId,
        beliefs,
        observations,
        // Convenience: primary culprit-topic belief if any
        primaryBelief: beliefs.find(b => b.claimTopic === 'culprit') || beliefs[0] || null
    };
}

function npcKnowsAboutIncident(believerId, incidentId) {
    const known = getNpcKnownAboutIncident(believerId, incidentId);
    return !!(known.beliefs.length || known.observations.length);
}

function pruneNpcBeliefStore() {
    ensureNpcIncidentState();
    const ret = NPC_INCIDENT_RETENTION;
    const ids = Object.keys(G.npcBeliefs.byId);
    if (ids.length <= ret.maxBeliefs) return;
    // Drop oldest low-confidence beliefs first
    const sorted = ids.slice().sort((a, b) => {
        const ba = G.npcBeliefs.byId[a];
        const bb = G.npcBeliefs.byId[b];
        const ca = ba.confidence || 0;
        const cb = bb.confidence || 0;
        if (ca !== cb) return ca - cb;
        return (ba.updatedAtMonths || 0) - (bb.updatedAtMonths || 0);
    });
    while (sorted.length > ret.maxBeliefs) {
        const dropId = sorted.shift();
        const bel = G.npcBeliefs.byId[dropId];
        if (!bel) continue;
        indexRemove(G.npcBeliefs.byBeliever, bel.believerId, dropId);
        if (bel.incidentId) indexRemove(G.npcBeliefs.byIncident, bel.incidentId, dropId);
        delete G.npcBeliefs.byId[dropId];
    }
}

function rebuildNpcKnowledgeIndexes() {
    ensureNpcIncidentState();
    G.npcObservations.byObserver = {};
    G.npcObservations.byIncident = {};
    Object.values(G.npcObservations.byId).forEach(obs => {
        indexPush(G.npcObservations.byObserver, obs.observerId, obs.id);
        indexPush(G.npcObservations.byIncident, obs.incidentId, obs.id);
    });
    G.npcBeliefs.byBeliever = {};
    G.npcBeliefs.byIncident = {};
    Object.values(G.npcBeliefs.byId).forEach(bel => {
        indexPush(G.npcBeliefs.byBeliever, bel.believerId, bel.id);
        if (bel.incidentId) indexPush(G.npcBeliefs.byIncident, bel.incidentId, bel.id);
    });
}

function migrateNpcIncidentsForExistingSave() {
    ensureNpcIncidentState();
    rebuildNpcKnowledgeIndexes();
}

/**
 * Developer / test fixture: Well-Ring resource theft with partial Wei Shun knowledge.
 * Not a scripted quest. Does not create new NPCs.
 */
function createWellRingTheftKnowledgeExample(options) {
    options = options || {};
    ensureNpcIncidentState();
    if (typeof ensureWellRingLodgeCast === 'function') ensureWellRingLodgeCast();

    const wei = typeof getWellRingCastNpc === 'function' ? getWellRingCastNpc('rival') : null;
    const liang = typeof getWellRingCastNpc === 'function' ? getWellRingCastNpc('hall_master') : null;
    const weiId = wei?.uid || 'wr_wei_shun';
    const liangId = liang?.uid || 'wr_master_liang';

    const culpritId = options.culpritId || 'unknown_outsider';
    const incident = createNpcIncident({
        id: options.incidentId || 'inc_wr_theft_example',
        type: 'theft',
        zoneId: 'dustbone',
        locationId: 'redwell',
        orgId: 'well_ring_lodge',
        severity: 3,
        participants: [
            { id: culpritId, role: 'actor' },
            { id: weiId, role: 'nearby' }
        ],
        facts: {
            what: 'cultivation_resource_stolen',
            item: options.item || 'spirit_herb_pouch',
            culpritId,
            method: 'slipped_from_storehouse_at_dusk'
        },
        pinned: true,
        meta: { fixture: 'well_ring_theft_example' }
    });

    const obs = recordNpcObservation({
        id: options.observationId || 'obs_wr_theft_wei',
        observerId: weiId,
        incidentId: incident.id,
        direct: true,
        source: 'direct',
        confidence: 0.55,
        details: {
            // Partial / possibly wrong — saw a sash colour, not a confirmed face
            sawSash: 'outer_dust_brown',
            heardFootsteps: true,
            identifiedCulpritId: options.weiSuspectId || null,
            note: 'Caught a glimpse near the storehouse; cannot swear to the face.'
        }
    });

    const belief = formNpcBelief({
        id: options.beliefId || 'bel_wr_theft_wei',
        believerId: weiId,
        incidentId: incident.id,
        claimTopic: 'culprit',
        claim: {
            culpritId: options.weiSuspectId || 'wr_unknown_outer',
            certaintyNote: 'suspect_not_confirmed'
        },
        confidence: options.weiBeliefConfidence != null ? options.weiBeliefConfidence : 0.45,
        source: 'observation',
        sourceObservationIds: [obs.id],
        note: 'Wei Shun suspects another outer from the sash colour.'
    });

    return {
        incident,
        observation: obs,
        belief,
        weiId,
        liangId,
        liangKnows: npcKnowsAboutIncident(liangId, incident.id)
    };
}
