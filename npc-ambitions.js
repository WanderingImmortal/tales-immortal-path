// Persistent NPC ambitions & goal pursuit (NPC agency Phase E vertical slice).
// Authored foundation ambitions = character starting motivations (immutable catalogue/procedural).
// Runtime ambitions/goals live on G and drive actionable pursuit.
// First actor: Wei Shun → cultivation advancement → acquire spirit herbs.
// Reuses resolveNpcContextualDecision; shared world clock only.

const NPC_AMBITION_VERSION = 1;

const NPC_AMBITION_RETENTION = {
    maxAttemptsPerActor: 40,
    maxGoalsPerActor: 4,
    maxAmbitionsPerActor: 6,
    // Natural pursuit: focused Well-Ring rival only
    naturalCheckEveryMonths: 4,
    naturalChance: 0.22,
    attemptCooldownMonths: 3
};

/** Smallest coherent NPC cultivation-resource pouch for this slice. */
const NPC_CULTIVATION_RESOURCE = {
    herbNeedForBoost: 3,
    growthProgressPerBatch: 10,
    dutyHerbChance: 0.55,
    dutyMeritGain: 1,
    stealHerbGain: 2,
    stealDetectChance: 0.35,
    stealFailChance: 0.4
};

function ensureNpcAmbitionState() {
    if (typeof G === 'undefined') return null;
    if (!G.npcAmbitions || typeof G.npcAmbitions !== 'object') {
        G.npcAmbitions = { version: NPC_AMBITION_VERSION, nextSeq: 1, byId: {}, byActor: {} };
    }
    const a = G.npcAmbitions;
    if (a.version == null) a.version = NPC_AMBITION_VERSION;
    if (a.nextSeq == null) a.nextSeq = 1;
    if (!a.byId) a.byId = {};
    if (!a.byActor) a.byActor = {};

    if (!G.npcGoals || typeof G.npcGoals !== 'object') {
        G.npcGoals = { version: NPC_AMBITION_VERSION, nextSeq: 1, byId: {}, byActor: {}, byAmbition: {} };
    }
    const g = G.npcGoals;
    if (g.version == null) g.version = NPC_AMBITION_VERSION;
    if (g.nextSeq == null) g.nextSeq = 1;
    if (!g.byId) g.byId = {};
    if (!g.byActor) g.byActor = {};
    if (!g.byAmbition) g.byAmbition = {};

    if (!G.npcGoalAttempts || typeof G.npcGoalAttempts !== 'object') {
        G.npcGoalAttempts = { version: NPC_AMBITION_VERSION, nextSeq: 1, byId: {}, byActor: {}, lastNaturalCheckMonths: null };
    }
    const t = G.npcGoalAttempts;
    if (t.version == null) t.version = NPC_AMBITION_VERSION;
    if (t.nextSeq == null) t.nextSeq = 1;
    if (!t.byId) t.byId = {};
    if (!t.byActor) t.byActor = {};
    return a;
}

function cloneNpcAmbitionRecord(obj) {
    return obj == null ? null : JSON.parse(JSON.stringify(obj));
}

function indexAmbitionPush(map, key, id) {
    if (!key || !id) return;
    if (!map[key]) map[key] = [];
    if (!map[key].includes(id)) map[key].push(id);
}

function allocateNpcAmbitionId() {
    ensureNpcAmbitionState();
    return `amb_${Math.floor(G.ageMonths || 0)}_${G.npcAmbitions.nextSeq++}`;
}

function allocateNpcGoalId() {
    ensureNpcAmbitionState();
    return `goal_${Math.floor(G.ageMonths || 0)}_${G.npcGoals.nextSeq++}`;
}

function allocateNpcGoalAttemptId() {
    ensureNpcAmbitionState();
    return `gat_${Math.floor(G.ageMonths || 0)}_${G.npcGoalAttempts.nextSeq++}`;
}

function ensureNpcCultivationPouch(npc) {
    if (!npc || typeof npc !== 'object') return null;
    if (!npc.cultivationPouch || typeof npc.cultivationPouch !== 'object') {
        npc.cultivationPouch = { spiritHerbs: 0 };
    }
    if (npc.cultivationPouch.spiritHerbs == null) npc.cultivationPouch.spiritHerbs = 0;
    return npc.cultivationPouch;
}

function getNpcSpiritHerbs(actorId) {
    const npc = typeof findWorldNpcRecordByUid === 'function' ? findWorldNpcRecordByUid(actorId) : null;
    if (!npc) return 0;
    return ensureNpcCultivationPouch(npc).spiritHerbs || 0;
}

function adjustNpcSpiritHerbs(actorId, delta) {
    const npc = typeof findWorldNpcRecordByUid === 'function' ? findWorldNpcRecordByUid(actorId) : null;
    if (!npc || npc.alive === false) return null;
    const pouch = ensureNpcCultivationPouch(npc);
    pouch.spiritHerbs = Math.max(0, (pouch.spiritHerbs || 0) + (Number(delta) || 0));
    return pouch.spiritHerbs;
}

function createNpcAmbition(spec) {
    spec = spec || {};
    ensureNpcAmbitionState();
    if (!spec.actorId || !spec.type) return null;
    const id = spec.id || allocateNpcAmbitionId();
    if (G.npcAmbitions.byId[id]) return cloneNpcAmbitionRecord(G.npcAmbitions.byId[id]);

    const existing = (G.npcAmbitions.byActor[spec.actorId] || [])
        .map(x => G.npcAmbitions.byId[x])
        .filter(a => a && a.type === spec.type && a.status === 'active');
    if (existing.length && !spec.allowDuplicateType) {
        return cloneNpcAmbitionRecord(existing[0]);
    }

    const amb = {
        id,
        actorId: spec.actorId,
        type: spec.type,
        label: spec.label || spec.type,
        priority: clampAmbitionUnit(spec.priority != null ? spec.priority : 0.5),
        commitment: clampAmbitionUnit(spec.commitment != null ? spec.commitment : 0.55),
        perceivedFeasibility: clampAmbitionUnit(spec.perceivedFeasibility != null ? spec.perceivedFeasibility : 0.55),
        status: spec.status || 'active',
        origin: spec.origin || 'runtime',
        foundationRef: spec.foundationRef || null,
        target: spec.target && typeof spec.target === 'object' ? cloneNpcAmbitionRecord(spec.target) : null,
        progress: Number(spec.progress) || 0,
        historyRefs: Array.isArray(spec.historyRefs) ? spec.historyRefs.slice() : [],
        createdAtMonths: G.ageMonths || 0,
        lastReconsiderAtMonths: G.ageMonths || 0,
        meta: spec.meta && typeof spec.meta === 'object' ? cloneNpcAmbitionRecord(spec.meta) : {}
    };
    G.npcAmbitions.byId[id] = amb;
    indexAmbitionPush(G.npcAmbitions.byActor, amb.actorId, id);
    pruneNpcAmbitionsForActor(amb.actorId);
    return cloneNpcAmbitionRecord(amb);
}

function clampAmbitionUnit(v) {
    const n = Number(v);
    if (Number.isNaN(n)) return 0.5;
    return Math.max(0, Math.min(1, n));
}

function getNpcAmbition(ambitionId) {
    ensureNpcAmbitionState();
    return cloneNpcAmbitionRecord(G.npcAmbitions.byId[ambitionId]);
}

function getNpcAmbitionsFor(actorId, options) {
    options = options || {};
    ensureNpcAmbitionState();
    const ids = G.npcAmbitions.byActor[actorId] || [];
    return ids.map(id => G.npcAmbitions.byId[id]).filter(a => {
        if (!a) return false;
        if (options.status && a.status !== options.status) return false;
        if (options.activeOnly && a.status !== 'active') return false;
        return true;
    }).map(cloneNpcAmbitionRecord);
}

function createNpcGoal(spec) {
    spec = spec || {};
    ensureNpcAmbitionState();
    if (!spec.actorId || !spec.type) return null;
    const id = spec.id || allocateNpcGoalId();
    if (G.npcGoals.byId[id]) return cloneNpcAmbitionRecord(G.npcGoals.byId[id]);

    const active = (G.npcGoals.byActor[spec.actorId] || [])
        .map(x => G.npcGoals.byId[x])
        .filter(g => g && g.status === 'active' && g.type === spec.type);
    if (active.length && !spec.forceNew) return cloneNpcAmbitionRecord(active[0]);

    const goal = {
        id,
        actorId: spec.actorId,
        ambitionId: spec.ambitionId || null,
        type: spec.type,
        label: spec.label || spec.type,
        status: 'active',
        target: spec.target && typeof spec.target === 'object' ? cloneNpcAmbitionRecord(spec.target) : {},
        constraints: spec.constraints && typeof spec.constraints === 'object' ? cloneNpcAmbitionRecord(spec.constraints) : {},
        attemptIds: [],
        failureCount: 0,
        successCount: 0,
        createdAtMonths: G.ageMonths || 0,
        updatedAtMonths: G.ageMonths || 0,
        completedAtMonths: null,
        meta: spec.meta && typeof spec.meta === 'object' ? cloneNpcAmbitionRecord(spec.meta) : {}
    };
    G.npcGoals.byId[id] = goal;
    indexAmbitionPush(G.npcGoals.byActor, goal.actorId, id);
    if (goal.ambitionId) indexAmbitionPush(G.npcGoals.byAmbition, goal.ambitionId, id);
    pruneNpcGoalsForActor(goal.actorId);
    return cloneNpcAmbitionRecord(goal);
}

function getNpcGoal(goalId) {
    ensureNpcAmbitionState();
    return cloneNpcAmbitionRecord(G.npcGoals.byId[goalId]);
}

function getNpcGoalsFor(actorId, options) {
    options = options || {};
    ensureNpcAmbitionState();
    const ids = G.npcGoals.byActor[actorId] || [];
    return ids.map(id => G.npcGoals.byId[id]).filter(g => {
        if (!g) return false;
        if (options.activeOnly && g.status !== 'active') return false;
        if (options.type && g.type !== options.type) return false;
        return true;
    }).map(cloneNpcAmbitionRecord);
}

function recordNpcGoalAttempt(spec) {
    ensureNpcAmbitionState();
    const id = spec.id || allocateNpcGoalAttemptId();
    const row = {
        id,
        actorId: spec.actorId,
        goalId: spec.goalId || null,
        ambitionId: spec.ambitionId || null,
        actionId: spec.actionId || null,
        atMonths: G.ageMonths || 0,
        success: !!spec.success,
        decisionId: spec.decisionId || null,
        effects: Array.isArray(spec.effects) ? spec.effects.map(cloneNpcAmbitionRecord) : [],
        notes: spec.notes || null,
        factors: Array.isArray(spec.factors) ? spec.factors.map(cloneNpcAmbitionRecord) : [],
        meta: spec.meta && typeof spec.meta === 'object' ? cloneNpcAmbitionRecord(spec.meta) : {}
    };
    G.npcGoalAttempts.byId[id] = row;
    indexAmbitionPush(G.npcGoalAttempts.byActor, row.actorId, id);
    if (row.goalId && G.npcGoals.byId[row.goalId]) {
        const goal = G.npcGoals.byId[row.goalId];
        goal.attemptIds = goal.attemptIds || [];
        goal.attemptIds.push(id);
        goal.updatedAtMonths = G.ageMonths || 0;
        if (row.success) goal.successCount = (goal.successCount || 0) + 1;
        else goal.failureCount = (goal.failureCount || 0) + 1;
    }
    pruneNpcGoalAttemptsForActor(row.actorId);
    return cloneNpcAmbitionRecord(row);
}

function getNpcGoalAttemptsFor(actorId, limit) {
    ensureNpcAmbitionState();
    const ids = (G.npcGoalAttempts.byActor[actorId] || []).slice();
    const rows = ids.map(id => G.npcGoalAttempts.byId[id]).filter(Boolean)
        .sort((a, b) => (b.atMonths || 0) - (a.atMonths || 0));
    const capped = limit != null ? rows.slice(0, limit) : rows;
    return capped.map(cloneNpcAmbitionRecord);
}

function pruneNpcAmbitionsForActor(actorId) {
    ensureNpcAmbitionState();
    const ids = G.npcAmbitions.byActor[actorId] || [];
    if (ids.length <= NPC_AMBITION_RETENTION.maxAmbitionsPerActor) return;
    const sorted = ids.map(id => G.npcAmbitions.byId[id]).filter(Boolean)
        .sort((a, b) => {
            const sa = a.status === 'active' ? 1 : 0;
            const sb = b.status === 'active' ? 1 : 0;
            if (sa !== sb) return sa - sb;
            return (a.lastReconsiderAtMonths || 0) - (b.lastReconsiderAtMonths || 0);
        });
    while (sorted.length > NPC_AMBITION_RETENTION.maxAmbitionsPerActor) {
        const drop = sorted.shift();
        if (!drop || drop.status === 'active') break;
        delete G.npcAmbitions.byId[drop.id];
        G.npcAmbitions.byActor[actorId] = (G.npcAmbitions.byActor[actorId] || []).filter(x => x !== drop.id);
    }
}

function pruneNpcGoalsForActor(actorId) {
    ensureNpcAmbitionState();
    const ids = G.npcGoals.byActor[actorId] || [];
    const active = ids.map(id => G.npcGoals.byId[id]).filter(g => g && g.status === 'active');
    if (active.length <= NPC_AMBITION_RETENTION.maxGoalsPerActor) return;
    // Suspend oldest excess active goals
    active.sort((a, b) => (a.createdAtMonths || 0) - (b.createdAtMonths || 0));
    while (active.length > NPC_AMBITION_RETENTION.maxGoalsPerActor) {
        const drop = active.shift();
        if (!drop) break;
        drop.status = 'suspended';
        drop.updatedAtMonths = G.ageMonths || 0;
    }
}

function pruneNpcGoalAttemptsForActor(actorId) {
    ensureNpcAmbitionState();
    const ids = G.npcGoalAttempts.byActor[actorId] || [];
    if (ids.length <= NPC_AMBITION_RETENTION.maxAttemptsPerActor) return;
    const sorted = ids.map(id => G.npcGoalAttempts.byId[id]).filter(Boolean)
        .sort((a, b) => (a.atMonths || 0) - (b.atMonths || 0));
    while (sorted.length > NPC_AMBITION_RETENTION.maxAttemptsPerActor) {
        const drop = sorted.shift();
        if (!drop) break;
        // Keep if referenced by an active goal
        const goal = drop.goalId ? G.npcGoals.byId[drop.goalId] : null;
        if (goal && goal.status === 'active') continue;
        delete G.npcGoalAttempts.byId[drop.id];
        G.npcGoalAttempts.byActor[actorId] = (G.npcGoalAttempts.byActor[actorId] || []).filter(x => x !== drop.id);
    }
}

/**
 * Seed runtime ambitions from foundation catalogue ambitions without mutating foundations.
 */
function syncRuntimeAmbitionsFromFoundation(actorId) {
    ensureNpcAmbitionState();
    const npc = typeof findWorldNpcRecordByUid === 'function' ? findWorldNpcRecordByUid(actorId) : null;
    if (!npc || npc.alive === false) return [];
    if (typeof ensureNpcCharacterFoundation === 'function') ensureNpcCharacterFoundation(npc);
    const foundation = typeof getNpcCharacterFoundation === 'function' ? getNpcCharacterFoundation(npc) : null;
    const seeded = [];
    (foundation?.ambitions || []).forEach(fa => {
        if (!fa || !fa.id) return;
        // Map foundation ambition ids onto runtime types
        let type = null;
        let label = fa.id;
        if (fa.id === 'advancement' || fa.id === 'recognition') {
            type = 'cultivation_advancement';
            label = 'Advance cultivation';
        } else if (fa.id === 'preserve_well_ring') {
            type = 'preserve_institution';
            label = 'Preserve Well-Ring Lodge';
        } else if (fa.id === 'survive') {
            type = 'survive';
            label = 'Survive';
        }
        if (!type) return;
        if (type !== 'cultivation_advancement') return; // this slice only activates cultivation pursuit
        const amb = createNpcAmbition({
            actorId,
            type,
            label,
            priority: fa.priority != null ? fa.priority : 0.55,
            commitment: 0.5 + (fa.priority || 0.5) * 0.3,
            perceivedFeasibility: 0.55,
            origin: 'foundation_seed',
            foundationRef: fa.id,
            target: { towardRealmIdx: (npc.realmIdx || 0) + 1 },
            allowDuplicateType: false,
            meta: { startRealmIdx: npc.realmIdx || 0 }
        });
        if (amb) seeded.push(amb);
    });
    refreshCultivationAdvancementAmbitions(actorId);
    return seeded;
}

function ensureWeiShunCultivationAmbition() {
    if (typeof ensureWellRingLodgeCast === 'function') ensureWellRingLodgeCast();
    const wei = typeof getWellRingCastNpc === 'function' ? getWellRingCastNpc('rival') : null;
    if (!wei || wei.alive === false) return null;
    ensureNpcCultivationPouch(wei);
    syncRuntimeAmbitionsFromFoundation(wei.uid);
    refreshCultivationAdvancementAmbitions(wei.uid);
    const active = getNpcAmbitionsFor(wei.uid, { activeOnly: true })
        .find(a => a.type === 'cultivation_advancement');
    if (active) return active;
    const fulfilled = getNpcAmbitionsFor(wei.uid)
        .find(a => a.type === 'cultivation_advancement' && a.status === 'fulfilled');
    if (fulfilled) return fulfilled;
    // Fallback if foundation somehow lacks advancement (should not for ambitious Wei)
    const created = createNpcAmbition({
        actorId: wei.uid,
        type: 'cultivation_advancement',
        label: 'Advance cultivation',
        priority: 0.6,
        commitment: 0.65,
        perceivedFeasibility: 0.55,
        origin: 'well_ring_default',
        foundationRef: 'advancement',
        target: { towardRealmIdx: (wei.realmIdx || 0) + 1 },
        meta: { startRealmIdx: wei.realmIdx || 0 }
    });
    refreshCultivationAdvancementAmbitions(wei.uid);
    return created ? getNpcAmbition(created.id) : null;
}

/**
 * Derive acquire-resources goal when herbs are below need for a cultivation boost.
 */
function ensureCultivationResourceGoal(actorId) {
    ensureNpcAmbitionState();
    const npc = typeof findWorldNpcRecordByUid === 'function' ? findWorldNpcRecordByUid(actorId) : null;
    if (!npc || npc.alive === false) return null;
    const amb = getNpcAmbitionsFor(actorId, { activeOnly: true })
        .find(a => a.type === 'cultivation_advancement');
    if (!amb) return null;

    const herbs = getNpcSpiritHerbs(actorId);
    const need = NPC_CULTIVATION_RESOURCE.herbNeedForBoost;
    if (herbs >= need) {
        // Resources already in hand — try to apply boost / complete open goals
        return maybeCompleteCultivationResourceGoal(actorId);
    }

    return createNpcGoal({
        actorId,
        ambitionId: amb.id,
        type: 'acquire_cultivation_resources',
        label: 'Acquire cultivation resources',
        target: { spiritHerbs: need, have: herbs },
        constraints: { needAlive: true, lodgeMember: true }
    });
}

/**
 * Fulfil cultivation_advancement only when authoritative realmIdx meets target.
 * Herb batches / goals never mark this fulfilled.
 */
function refreshCultivationAdvancementAmbitions(actorId) {
    ensureNpcAmbitionState();
    const npc = typeof findWorldNpcRecordByUid === 'function' ? findWorldNpcRecordByUid(actorId) : null;
    if (!npc) return [];
    const realm = npc.realmIdx || 0;
    const updated = [];
    getNpcAmbitionsFor(actorId).forEach(amb => {
        if (!amb || amb.type !== 'cultivation_advancement') return;
        const live = G.npcAmbitions.byId[amb.id];
        if (!live || live.status === 'abandoned') return;
        const target = live.target && live.target.towardRealmIdx != null
            ? live.target.towardRealmIdx
            : null;
        if (target == null) return;
        if (live.meta.startRealmIdx == null) {
            live.meta = Object.assign({}, live.meta || {}, {
                startRealmIdx: Math.min(realm, Math.max(0, target - 1))
            });
        }
        if (realm >= target) {
            if (live.status !== 'fulfilled') {
                live.status = 'fulfilled';
                live.progress = 1;
                live.meta = Object.assign({}, live.meta || {}, {
                    fulfilledReason: 'realm_reached',
                    fulfilledAtMonths: G.ageMonths || 0,
                    fulfilledRealmIdx: realm
                });
                live.lastReconsiderAtMonths = G.ageMonths || 0;
                updated.push(cloneNpcAmbitionRecord(live));
            }
            return;
        }
        if (live.status === 'fulfilled') return;
        // Realm-based progress only (means/herb history lives in meta.meansProgress).
        const start = live.meta.startRealmIdx != null ? live.meta.startRealmIdx : Math.max(0, target - 1);
        const span = Math.max(1, target - start);
        live.progress = clampAmbitionUnit((realm - start) / span);
        if (live.progress >= 1) live.progress = 0.99;
    });
    return updated;
}

function maybeCompleteCultivationResourceGoal(actorId) {
    const herbs = getNpcSpiritHerbs(actorId);
    const need = NPC_CULTIVATION_RESOURCE.herbNeedForBoost;
    if (herbs < need) return null;
    const goals = getNpcGoalsFor(actorId, { activeOnly: true, type: 'acquire_cultivation_resources' });
    const npc = typeof findWorldNpcRecordByUid === 'function' ? findWorldNpcRecordByUid(actorId) : null;
    if (!npc) return null;

    // Consume a batch for real cultivation progress (means toward ambition — not fulfilment).
    adjustNpcSpiritHerbs(actorId, -need);
    npc.growthProgress = (npc.growthProgress || 0) + NPC_CULTIVATION_RESOURCE.growthProgressPerBatch;

    goals.forEach(g => {
        const live = G.npcGoals.byId[g.id];
        if (!live) return;
        live.status = 'completed';
        live.completedAtMonths = G.ageMonths || 0;
        live.updatedAtMonths = G.ageMonths || 0;
        live.target = Object.assign({}, live.target || {}, { have: herbs, consumed: need });
    });

    const amb = getNpcAmbitionsFor(actorId, { activeOnly: true })
        .find(a => a.type === 'cultivation_advancement');
    if (amb) {
        const live = G.npcAmbitions.byId[amb.id];
        if (live) {
            live.meta = live.meta || {};
            live.meta.resourceBatches = (live.meta.resourceBatches || 0) + 1;
            live.meta.meansProgress = (live.meta.meansProgress || 0) + 0.15;
            live.perceivedFeasibility = clampAmbitionUnit((live.perceivedFeasibility || 0.5) + 0.05);
            live.lastReconsiderAtMonths = G.ageMonths || 0;
            // Do NOT set status fulfilled here — only refreshCultivationAdvancementAmbitions does.
        }
    }
    refreshCultivationAdvancementAmbitions(actorId);
    return goals[0] ? getNpcGoal(goals[0].id) : null;
}

/**
 * Coarse subjective theft assessment — actor-facing only.
 * Must NOT read NPC_CULTIVATION_RESOURCE.stealFailChance / stealDetectChance
 * (those are objective executor values).
 */
function assessWeiTheftPerception(actorId) {
    const npc = typeof findWorldNpcRecordByUid === 'function' ? findWorldNpcRecordByUid(actorId) : null;
    const personalities = (typeof getEffectiveNpcPersonalities === 'function' && npc)
        ? (getEffectiveNpcPersonalities(npc) || [])
        : (npc?.personalities || []);
    const expRoot = npc?.meta?.actionExperience || {};
    const theftExp = expRoot.steal_lodge_storehouse || { fails: 0, detections: 0, successes: 0 };

    // Uncertain baseline: lodge is familiar but protections are not fully known.
    let perceivedFailChance = 0.38;
    let perceivedDetectChance = 0.42;
    let uncertainty = 0.28;

    // Institutional familiarity (outer disciple) — slight layout confidence, not "known safe".
    if (npc && (npc.lodgeRole || npc.affiliationId === 'well_ring_lodge' ||
        (typeof WELL_RING_LODGE_ID !== 'undefined' && npc.affiliationId === WELL_RING_LODGE_ID))) {
        uncertainty -= 0.08;
        perceivedFailChance -= 0.04;
    } else {
        uncertainty += 0.1;
        perceivedFailChance += 0.08;
    }

    // Own apparent capability (realm) — subjective confidence, not omniscient security read.
    const realm = npc?.realmIdx || 0;
    if (realm <= 0) {
        perceivedFailChance += 0.08;
        perceivedDetectChance += 0.06;
    } else if (realm >= 2) {
        perceivedFailChance -= 0.06;
        perceivedDetectChance -= 0.04;
    }

    if (personalities.includes('bold')) {
        perceivedFailChance -= 0.1;
        perceivedDetectChance -= 0.08;
    }
    if (personalities.includes('ambitious')) {
        perceivedFailChance -= 0.05;
        uncertainty -= 0.03;
    }
    if (personalities.includes('careful')) {
        perceivedFailChance += 0.14;
        perceivedDetectChance += 0.12;
        uncertainty += 0.06;
    }
    if (personalities.includes('cowardly')) {
        perceivedFailChance += 0.18;
        perceivedDetectChance += 0.14;
        uncertainty += 0.08;
    }

    // Personal experience the actor lived through (not private undetected ledger rows).
    perceivedFailChance += Math.min(0.25, (theftExp.fails || 0) * 0.08);
    perceivedDetectChance += Math.min(0.3, (theftExp.detections || 0) * 0.12);
    if ((theftExp.successes || 0) > 0 && (theftExp.detections || 0) === 0) {
        perceivedDetectChance -= Math.min(0.1, theftExp.successes * 0.03);
    }

    perceivedFailChance = clampAmbitionUnit(perceivedFailChance);
    perceivedDetectChance = clampAmbitionUnit(perceivedDetectChance);
    uncertainty = clampAmbitionUnit(uncertainty);
    // Combined reluctance: failure + detection + unknown protections.
    const risk = clampAmbitionUnit(
        0.4 * perceivedFailChance + 0.45 * perceivedDetectChance + 0.3 * uncertainty
    );

    return {
        perceivedFailChance,
        perceivedDetectChance,
        uncertainty,
        risk,
        experience: {
            fails: theftExp.fails || 0,
            detections: theftExp.detections || 0,
            successes: theftExp.successes || 0
        }
    };
}

function recordNpcActionExperience(actorId, actionId, result) {
    const npc = typeof findWorldNpcRecordByUid === 'function' ? findWorldNpcRecordByUid(actorId) : null;
    if (!npc || !actionId) return null;
    npc.meta = npc.meta || {};
    npc.meta.actionExperience = npc.meta.actionExperience || {};
    const row = npc.meta.actionExperience[actionId] || {
        fails: 0,
        detections: 0,
        successes: 0,
        events: []
    };
    if (actionId === 'steal_lodge_storehouse') {
        if (result && result.success) {
            row.successes += 1;
            // Detection is personal knowledge only when the actor knows they left a trail /
            // were reported — use result.detected as the actor experiencing heat.
            if (result.detected) row.detections += 1;
        } else {
            row.fails += 1;
        }
        row.events = (row.events || []).concat([{
            atMonths: G.ageMonths || 0,
            success: !!(result && result.success),
            detected: !!(result && result.detected)
        }]).slice(-8);
    }
    npc.meta.actionExperience[actionId] = row;
    return cloneNpcAmbitionRecord(row);
}

const WEI_RESOURCE_ACTION_OPTIONS = [
    {
        id: 'earn_lodge_duty',
        label: 'Earn lodge duty stipend',
        baseScore: 0.85,
        tags: ['practical', 'cautious', 'protect_institution']
    },
    {
        id: 'steal_lodge_storehouse',
        label: 'Risk stealing lodge herbs',
        baseScore: 0.4,
        tags: ['harsh', 'spectacle'],
        // Physical feasibility — empty / insufficient stock cannot be a successful theft target.
        eligible(ctx) {
            const need = (ctx.resources && ctx.resources.theftAmount != null)
                ? ctx.resources.theftAmount
                : NPC_CULTIVATION_RESOURCE.stealHerbGain;
            const stock = ctx.resources && ctx.resources.storehouseHerbStock;
            if (stock == null) return true; // unknown → leave to executor gate
            return stock >= need;
        },
        scoreHook(ctx, score, factors) {
            // Ambitious / bold lean toward risk when short on herbs; not a hard lock.
            let s = score;
            if ((ctx.personalities || []).includes('ambitious')) {
                s += 0.35;
                factors.push({ id: 'ambitious_risk', delta: 0.35 });
            }
            if ((ctx.personalities || []).includes('bold')) {
                s += 0.3;
                factors.push({ id: 'bold_risk', delta: 0.3 });
            }
            if ((ctx.personalities || []).includes('careful')) {
                s -= 0.45;
                factors.push({ id: 'careful_against_theft', delta: -0.45 });
            }
            if ((ctx.resources?.spiritHerbs || 0) <= 0) {
                s += 0.2;
                factors.push({ id: 'desperate_shortfall', delta: 0.2 });
            }
            if ((ctx.pressure || 0) >= 0.5) {
                s += 0.15;
                factors.push({ id: 'pressure_risk', delta: 0.15 });
            }

            // Subjective difficulty / consequences — never objective stealFailChance.
            const perc = (ctx.perception && ctx.perception.theft) || null;
            if (perc) {
                const penalty = (perc.risk || 0) * 0.95;
                s -= penalty;
                factors.push({
                    id: 'perceived_theft_risk',
                    delta: -penalty,
                    perceivedFailChance: perc.perceivedFailChance,
                    perceivedDetectChance: perc.perceivedDetectChance,
                    uncertainty: perc.uncertainty
                });
                if ((perc.uncertainty || 0) >= 0.2) {
                    s -= 0.12;
                    factors.push({ id: 'unknown_protections', delta: -0.12, note: 'unknown security not treated as safe' });
                }
                if ((perc.experience?.detections || 0) > 0 || (perc.experience?.fails || 0) > 0) {
                    const heat = Math.min(0.35, (perc.experience.detections || 0) * 0.12 + (perc.experience.fails || 0) * 0.06);
                    s -= heat;
                    factors.push({ id: 'personal_theft_experience', delta: -heat });
                }
            } else {
                // Missing perception → cautious default (unknown ≠ safe).
                s -= 0.2;
                factors.push({ id: 'unknown_risk_default', delta: -0.2 });
            }
            return { score: s };
        }
    }
];

function buildWeiResourceActionDecisionSpec(actorId, options) {
    options = options || {};
    const herbs = getNpcSpiritHerbs(actorId);
    const need = NPC_CULTIVATION_RESOURCE.herbNeedForBoost;
    const shortfall = Math.max(0, need - herbs);
    const developer = !!options.developer;
    const perception = { theft: assessWeiTheftPerception(actorId) };
    const storehouseHerbStock = typeof getWellRingStorehouseHerbStock === 'function'
        ? getWellRingStorehouseHerbStock()
        : null;
    return {
        actorId,
        accusedId: null,
        institutionalRole: 'outer_disciple',
        authority: false,
        accusedAvailable: true,
        evidenceStrength: 'weak',
        pressure: shortfall / need,
        resources: {
            spiritHerbs: herbs,
            need,
            storehouseHerbStock,
            theftAmount: NPC_CULTIVATION_RESOURCE.stealHerbGain
        },
        perception,
        // Actor-facing risk summary for traces — not objective executor odds.
        risks: { theftPerceived: perception.theft },
        optionDefs: WEI_RESOURCE_ACTION_OPTIONS,
        seed: options.seed,
        developer,
        allowForceChoice: developer,
        // forceAction only in explicit developer/test context
        forceChoice: developer ? (options.forceAction || null) : null
    };
}

function executeNpcResourceAction(actorId, actionId, context) {
    context = context || {};
    const npc = typeof findWorldNpcRecordByUid === 'function' ? findWorldNpcRecordByUid(actorId) : null;
    if (!npc || npc.alive === false) {
        return { success: false, actionId, effects: [{ type: 'blocked', reason: 'actor_dead' }], notes: 'Actor unavailable.' };
    }
    const effects = [];
    const rng = typeof createNpcDecisionRng === 'function'
        ? createNpcDecisionRng(context.seed != null ? context.seed + 17 : undefined)
        : () => Math.random();

    if (actionId === 'earn_lodge_duty') {
        // Legitimate: lodge work → merit + chance of herb stipend. Time cost implied by scheduler cadence.
        if (actorId === 'wr_wei_shun' && typeof adjustWellRingRivalMerit === 'function') {
            adjustWellRingRivalMerit(NPC_CULTIVATION_RESOURCE.dutyMeritGain);
            effects.push({ type: 'rival_merit_delta', delta: NPC_CULTIVATION_RESOURCE.dutyMeritGain });
        }
        let gained = 0;
        if (rng() < NPC_CULTIVATION_RESOURCE.dutyHerbChance) {
            gained = 1;
            adjustNpcSpiritHerbs(actorId, gained);
            effects.push({ type: 'spirit_herbs_gained', amount: gained, source: 'lodge_duty' });
        } else {
            effects.push({ type: 'spirit_herbs_gained', amount: 0, source: 'lodge_duty', note: 'duty completed without herb stipend' });
        }
        return {
            success: true, // action executed
            actionId,
            effects,
            notes: gained > 0
                ? 'Lodge duty completed; received a spirit herb stipend.'
                : 'Lodge duty completed; no herb stipend this time.',
            stipendGained: gained > 0
        };
    }

    if (actionId === 'steal_lodge_storehouse') {
        // Developer/test may force outcomes; natural play uses objective RNG only.
        // Physical stock is never bypassed — even developer-forced "success" needs supply.
        const developer = !!context.developer;
        const forced = developer ? context.forceTheftOutcome : null;
        const stealAmount = NPC_CULTIVATION_RESOURCE.stealHerbGain;
        const stockAvailable = typeof getWellRingStorehouseHerbStock === 'function'
            ? getWellRingStorehouseHerbStock()
            : null;
        const canSupply = stockAvailable == null
            ? true
            : (typeof wellRingStorehouseCanSupply === 'function'
                ? wellRingStorehouseCanSupply(stealAmount)
                : stockAvailable >= stealAmount);

        if (!canSupply) {
            effects.push({
                type: 'theft_blocked',
                reason: 'insufficient_storehouse_stock',
                stock: stockAvailable,
                need: stealAmount
            });
            const blocked = {
                success: false,
                actionId,
                effects,
                notes: 'Storehouse shelves were bare of the hoped-for herbs; nothing taken.',
                detected: false,
                blockedReason: 'insufficient_storehouse_stock'
            };
            recordNpcActionExperience(actorId, actionId, blocked);
            return blocked;
        }

        let fail = rng() < NPC_CULTIVATION_RESOURCE.stealFailChance;
        if (forced === 'fail') fail = true;
        if (forced === 'success_undetected' || forced === 'success_detected') fail = false;

        if (fail) {
            effects.push({ type: 'theft_failed' });
            // Failed attempt may still leave a trace incident (no automatic Liang knowledge/thread)
            if (typeof createNpcIncident === 'function' && (developer ? forced === 'fail_with_trace' : rng() < 0.5)) {
                const inc = createNpcIncident({
                    type: 'theft',
                    zoneId: 'dustbone',
                    locationId: 'redwell',
                    orgId: typeof WELL_RING_LODGE_ID !== 'undefined' ? WELL_RING_LODGE_ID : 'well_ring_lodge',
                    severity: 2,
                    participants: [{ id: actorId, role: 'actor' }],
                    facts: {
                        what: 'attempted_storehouse_theft',
                        culpritId: actorId,
                        item: 'spirit_herb_pouch',
                        succeeded: false
                    },
                    pinned: false,
                    meta: { source: 'npc_ambition_theft_attempt' }
                });
                if (inc) effects.push({ type: 'incident', incidentId: inc.id, detected: false });
            }
            const failResult = {
                success: false,
                actionId,
                effects,
                notes: 'Theft attempt failed; left empty-handed.',
                detected: false
            };
            recordNpcActionExperience(actorId, actionId, failResult);
            return failResult;
        }

        // Objective detection roll — not exposed to decision scoring.
        let detected = rng() < NPC_CULTIVATION_RESOURCE.stealDetectChance;
        if (forced === 'success_undetected') detected = false;
        if (forced === 'success_detected') detected = true;

        // All-or-nothing physical transfer: deduct stock first, then credit pouch exactly once.
        const gained = stealAmount;
        let lossId = null;
        if (typeof recordWellRingStorehouseLoss === 'function') {
            const loss = recordWellRingStorehouseLoss({
                amount: gained,
                incidentId: null,
                trueCulpritId: actorId,
                item: 'spirit_herb_pouch',
                discovered: false,
                meta: { source: 'npc_ambition_theft' }
            });
            if (!loss) {
                effects.push({
                    type: 'theft_blocked',
                    reason: 'insufficient_storehouse_stock',
                    stock: typeof getWellRingStorehouseHerbStock === 'function'
                        ? getWellRingStorehouseHerbStock()
                        : null,
                    need: stealAmount
                });
                const blocked = {
                    success: false,
                    actionId,
                    effects,
                    notes: 'Storehouse shelves were bare of the hoped-for herbs; nothing taken.',
                    detected: false,
                    blockedReason: 'insufficient_storehouse_stock'
                };
                recordNpcActionExperience(actorId, actionId, blocked);
                return blocked;
            }
            lossId = loss.id;
            effects.push({ type: 'storehouse_loss', lossId, amount: gained, discovered: false });
        }

        adjustNpcSpiritHerbs(actorId, gained);
        effects.push({ type: 'spirit_herbs_gained', amount: gained, source: 'theft' });

        let incidentId = null;
        if (typeof createNpcIncident === 'function') {
            const inc = createNpcIncident({
                type: 'theft',
                zoneId: 'dustbone',
                locationId: 'redwell',
                orgId: typeof WELL_RING_LODGE_ID !== 'undefined' ? WELL_RING_LODGE_ID : 'well_ring_lodge',
                severity: detected ? 3 : 2,
                participants: [
                    { id: actorId, role: 'actor' },
                    { id: 'wr_master_liang', role: 'authority' }
                ],
                facts: {
                    what: 'lodge_resource_theft',
                    culpritId: actorId,
                    item: 'spirit_herb_pouch',
                    succeeded: true,
                    detected
                },
                pinned: detected,
                meta: { source: 'npc_ambition_theft', storehouseLossId: lossId }
            });
            incidentId = inc?.id || null;
            if (incidentId) {
                effects.push({ type: 'incident', incidentId, detected });
                if (lossId && G.wellRing?.storehouse?.lossesById?.[lossId]) {
                    G.wellRing.storehouse.lossesById[lossId].incidentId = incidentId;
                }
            }
        }

        // Detection ≠ omniscient guilt. Optional secondhand report + emergent situation only.
        if (detected && incidentId && typeof recordNpcObservation === 'function') {
            // Mark physical loss noticed without identifying via inspection (trail was reported).
            if (lossId && typeof markWellRingStorehouseLossDiscovered === 'function') {
                markWellRingStorehouseLossDiscovered(lossId, {
                    skipNotify: true,
                    discoveredBy: 'detection_report'
                });
            }
            recordNpcObservation({
                observerId: 'wr_master_liang',
                incidentId,
                source: 'report',
                confidence: 0.4,
                details: {
                    heardFrom: 'night_watch',
                    rumourCulpritId: actorId,
                    evidenceStrength: 'moderate',
                    note: 'Night watch reported a disturbance — not a proven identification.'
                }
            });
            if (typeof formNpcBelief === 'function') {
                formNpcBelief({
                    believerId: 'wr_master_liang',
                    incidentId,
                    claimTopic: 'culprit',
                    claim: { culpritId: actorId, certaintyNote: 'unconfirmed_report' },
                    confidence: 0.4,
                    source: 'report'
                });
            }
            effects.push({ type: 'detection_report', to: 'wr_master_liang', omniscient: false });
            if (typeof notifyWellRingMisconductReport === 'function') {
                const reaction = notifyWellRingMisconductReport({
                    incidentId,
                    suspectId: actorId,
                    trueCulpritId: actorId,
                    storehouseLossId: lossId,
                    evidenceStrength: 'moderate',
                    liangBeliefConfidence: 0.4,
                    reportSource: 'night_watch',
                    seedLossBelief: true,
                    decideImmediately: false,
                    decisionDelayMonths: 1
                });
                if (reaction?.thread) {
                    effects.push({ type: 'situation_started', threadId: reaction.thread.id, emergent: true });
                }
            }
        }

        const okResult = {
            success: true,
            actionId,
            effects,
            notes: detected
                ? 'Stole herbs but left a trail the lodge may notice.'
                : 'Stole herbs without immediate detection.',
            detected,
            incidentId,
            lossId
        };
        recordNpcActionExperience(actorId, actionId, okResult);
        return okResult;
    }

    return { success: false, actionId, effects: [{ type: 'unknown_action' }], notes: 'Unknown action.' };
}

function reconsiderNpcAmbitionAfterAttempt(ambitionId, attempt) {
    ensureNpcAmbitionState();
    const amb = G.npcAmbitions.byId[ambitionId];
    if (!amb || amb.status !== 'active') return null;
    amb.lastReconsiderAtMonths = G.ageMonths || 0;
    const history = amb.meta.reconsideration || [];
    if (!attempt.success) {
        // Inertia: single failure softens feasibility slightly; abandonment needs repeated failure.
        amb.perceivedFeasibility = clampAmbitionUnit((amb.perceivedFeasibility || 0.5) - 0.04);
        history.push({ at: G.ageMonths || 0, kind: 'failure', feasibility: amb.perceivedFeasibility });
        const goal = attempt.goalId ? G.npcGoals.byId[attempt.goalId] : null;
        if (goal && (goal.failureCount || 0) >= 4 && amb.perceivedFeasibility < 0.25 && amb.commitment < 0.45) {
            amb.status = 'suspended';
            history.push({ at: G.ageMonths || 0, kind: 'suspended', reason: 'repeated_failure' });
        }
    } else {
        amb.perceivedFeasibility = clampAmbitionUnit((amb.perceivedFeasibility || 0.5) + 0.03);
        history.push({ at: G.ageMonths || 0, kind: 'success', feasibility: amb.perceivedFeasibility });
    }
    amb.meta.reconsideration = history.slice(-12);
    return cloneNpcAmbitionRecord(amb);
}

/**
 * One pursuit beat for an actor: ensure ambition/goal, decide, act, record, reconsider.
 */
function pursueNpcAmbitionGoal(actorId, options) {
    options = options || {};
    ensureNpcAmbitionState();
    const npc = typeof findWorldNpcRecordByUid === 'function' ? findWorldNpcRecordByUid(actorId) : null;
    if (!npc || npc.alive === false) {
        return { ok: false, reason: 'actor_unavailable' };
    }

    // Cooldown / duplicate guard (natural path)
    if (!options.ignoreCooldown) {
        const last = npc.meta?.lastAmbitionPursuitMonths;
        const cd = NPC_AMBITION_RETENTION.attemptCooldownMonths;
        if (last != null && (G.ageMonths || 0) - last < cd) {
            return { ok: false, reason: 'cooldown', remaining: cd - ((G.ageMonths || 0) - last) };
        }
    }
    if (npc.meta?.ambitionPursuitInFlight) {
        return { ok: false, reason: 'in_flight' };
    }
    npc.meta = npc.meta || {};
    npc.meta.ambitionPursuitInFlight = true;

    try {
        if (actorId === 'wr_wei_shun') ensureWeiShunCultivationAmbition();
        else syncRuntimeAmbitionsFromFoundation(actorId);
        // Recognise realm gains from any existing mechanic before planning the next means-goal.
        refreshCultivationAdvancementAmbitions(actorId);

        let goal = ensureCultivationResourceGoal(actorId);
        // If already had enough herbs, ensureCultivationResourceGoal may complete immediately
        if (goal && goal.status === 'completed') {
            npc.meta.lastAmbitionPursuitMonths = G.ageMonths || 0;
            return { ok: true, completedImmediately: true, goal };
        }
        if (!goal || goal.status !== 'active') {
            // Ambition may already be fulfilled by realm — not an error for natural ticks.
            const amb = getNpcAmbitionsFor(actorId, { activeOnly: true })
                .find(a => a.type === 'cultivation_advancement');
            if (!amb) {
                return { ok: true, reason: 'ambition_fulfilled_or_absent', ambitions: getNpcAmbitionsFor(actorId) };
            }
            return { ok: false, reason: 'no_active_goal' };
        }

        const developer = !!options.developer;
        const decision = typeof resolveNpcContextualDecision === 'function'
            ? resolveNpcContextualDecision(buildWeiResourceActionDecisionSpec(actorId, {
                seed: options.seed,
                developer,
                forceAction: developer ? options.forceAction : null
            }))
            : null;
        if (!decision) {
            return { ok: false, reason: 'decision_failed' };
        }

        const actionId = decision.chosen;
        const result = executeNpcResourceAction(actorId, actionId, {
            seed: options.seed,
            developer,
            // forceTheftOutcome is developer/test only — stripped on natural paths.
            forceTheftOutcome: developer ? (options.forceTheftOutcome || null) : null
        });
        if (typeof markNpcDecisionAttempted === 'function') markNpcDecisionAttempted(decision.id);
        if (typeof markNpcDecisionCompleted === 'function') markNpcDecisionCompleted(decision.id);

        // Goal-progress success: herbs gained (duty stipend or theft). Duty always runs, but
        // a stipend miss counts as a soft setback for ambition feasibility.
        const meaningfulSuccess = actionId === 'earn_lodge_duty'
            ? !!result.stipendGained
            : !!result.success;

        recordNpcGoalAttempt({
            actorId,
            goalId: goal.id,
            ambitionId: goal.ambitionId,
            actionId,
            success: meaningfulSuccess,
            decisionId: decision.id,
            effects: result.effects,
            notes: result.notes,
            factors: decision.factors,
            meta: { actionExecuted: result.success !== false, stipendGained: !!result.stipendGained }
        });

        if (goal.ambitionId) {
            reconsiderNpcAmbitionAfterAttempt(goal.ambitionId, {
                success: meaningfulSuccess,
                goalId: goal.id
            });
        }

        const completed = maybeCompleteCultivationResourceGoal(actorId);
        refreshCultivationAdvancementAmbitions(actorId);
        npc.meta.lastAmbitionPursuitMonths = G.ageMonths || 0;

        return {
            ok: true,
            actorId,
            decision,
            actionId,
            result,
            attempt: getNpcGoalAttemptsFor(actorId, 1)[0],
            goal: getNpcGoal(goal.id),
            ambition: goal.ambitionId ? getNpcAmbition(goal.ambitionId) : null,
            completedGoal: completed
        };
    } finally {
        npc.meta.ambitionPursuitInFlight = false;
    }
}

/** Deterministic developer/test entry — same machinery as natural. */
function startWeiShunCultivationPursuitScenario(options) {
    options = options || {};
    if (typeof ensureWellRingLodgeCast === 'function') ensureWellRingLodgeCast();
    const wei = typeof getWellRingCastNpc === 'function' ? getWellRingCastNpc('rival') : null;
    if (!wei) return { ok: false, reason: 'no_wei' };
    ensureWeiShunCultivationAmbition();
    if (options.startingHerbs != null) {
        const pouch = ensureNpcCultivationPouch(wei);
        pouch.spiritHerbs = Math.max(0, Math.floor(options.startingHerbs));
    }
    return pursueNpcAmbitionGoal(wei.uid, {
        developer: true,
        ignoreCooldown: true,
        seed: options.seed,
        forceAction: options.forceAction || null,
        forceTheftOutcome: options.forceTheftOutcome || null
    });
}

/**
 * Developer inspection — not player knowledge.
 */
function inspectNpcAmbitionRuntime(actorId) {
    ensureNpcAmbitionState();
    refreshCultivationAdvancementAmbitions(actorId);
    const npc = typeof findWorldNpcRecordByUid === 'function' ? findWorldNpcRecordByUid(actorId) : null;
    return {
        actorId,
        alive: npc ? npc.alive !== false : null,
        realmIdx: npc ? npc.realmIdx : null,
        pouch: npc ? cloneNpcAmbitionRecord(ensureNpcCultivationPouch(npc)) : null,
        ambitions: getNpcAmbitionsFor(actorId),
        goals: getNpcGoalsFor(actorId),
        recentAttempts: getNpcGoalAttemptsFor(actorId, 8),
        theftPerception: assessWeiTheftPerception(actorId),
        actionExperience: npc?.meta?.actionExperience
            ? cloneNpcAmbitionRecord(npc.meta.actionExperience)
            : null,
        foundationAmbitions: typeof getNpcFoundationAmbitions === 'function'
            ? getNpcFoundationAmbitions(actorId)
            : []
    };
}

function maybeNaturalWeiShunCultivationPursuit(/* deltaMonths */) {
    ensureNpcAmbitionState();
    const now = Math.floor(G.ageMonths || 0);
    const every = NPC_AMBITION_RETENTION.naturalCheckEveryMonths;
    const last = G.npcGoalAttempts.lastNaturalCheckMonths;
    if (last != null && now - last < every) return null;
    G.npcGoalAttempts.lastNaturalCheckMonths = now;

    if (typeof ensureWellRingLodgeCast !== 'function') return null;
    ensureWellRingLodgeCast();
    const wei = typeof getWellRingCastNpc === 'function' ? getWellRingCastNpc('rival') : null;
    if (!wei || wei.alive === false) return { ok: false, reason: 'no_living_wei' };

    if (Math.random() > NPC_AMBITION_RETENTION.naturalChance) {
        return { ok: false, reason: 'chance_miss' };
    }
    return pursueNpcAmbitionGoal(wei.uid, { developer: false });
}

function tickNpcAmbitionPursuit(deltaMonths) {
    ensureNpcAmbitionState();
    // Realm may have advanced via tickWorldNpcGrowth on the same clock — recognise it.
    if (typeof getWellRingCastNpc === 'function') {
        const wei = getWellRingCastNpc('rival');
        if (wei && wei.uid) refreshCultivationAdvancementAmbitions(wei.uid);
    }
    maybeNaturalWeiShunCultivationPursuit(deltaMonths);
}

function migrateNpcAmbitionsForExistingSave() {
    ensureNpcAmbitionState();
    // Seed Wei if cast already present — does not mutate foundation ambitions
    if (typeof getWellRingCastNpc === 'function') {
        const wei = getWellRingCastNpc('rival');
        if (wei && wei.alive !== false) {
            ensureNpcCultivationPouch(wei);
            syncRuntimeAmbitionsFromFoundation(wei.uid);
            refreshCultivationAdvancementAmbitions(wei.uid);
        }
    }
}

if (typeof registerWorldTick === 'function') {
    registerWorldTick('npcAmbitions', (delta) => {
        tickNpcAmbitionPursuit(delta);
    }, 46);
}
