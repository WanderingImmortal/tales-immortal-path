// Sparse NPC–NPC social ties (NPC agency Phase B).
// Not a full relationship matrix. Player↔NPC impression/trust stays on converse/quests.
// Supports world uids, story ids, and deferred seat refs (e.g. seat:redwell:city_lord).

const NPC_TIE_VERSION = 1;

const NPC_TIE_KIND_IDS = [
    'family',
    'friendship',
    'rivalry',
    'patronage',
    'mentorship',
    'institutional_obligation',
    'personal_loyalty',
    'hostility'
];

/**
 * Canonical seeded ties — stable ids, idempotent upsert.
 * Lodge membership alone is NOT a personal tie (Wei Shun ↔ Liang omitted on purpose).
 * Redwell city lord is a civic seat, not a fabricated world NPC.
 */
const CANONICAL_NPC_TIES = [
    {
        id: 'tie_wr_liang_redwell_city_lord',
        kinds: ['institutional_obligation'],
        a: { id: 'wr_master_liang', kind: 'world' },
        b: { id: 'seat:redwell:city_lord', kind: 'seat' },
        labels: ['civic_partnership', 'mutual_benefit'],
        stance: {
            wr_master_liang: {
                trust: 0.45,
                attachment: 0.32,
                tension: 0.38,
                notes: 'Useful partner; not a personal friend. Can disagree and still deal.'
            },
            'seat:redwell:city_lord': {
                trust: 0.4,
                attachment: 0.28,
                tension: 0.35,
                notes: 'Lodge keeps the road quiet and the cut flowing — institutional, not intimate.'
            }
        }
    }
];

function ensureNpcTiesState() {
    if (typeof G === 'undefined') return null;
    if (!G.npcTies || typeof G.npcTies !== 'object') {
        G.npcTies = { version: NPC_TIE_VERSION, byId: {}, byParticipant: {} };
    }
    if (G.npcTies.version == null) G.npcTies.version = NPC_TIE_VERSION;
    if (!G.npcTies.byId || typeof G.npcTies.byId !== 'object') G.npcTies.byId = {};
    if (!G.npcTies.byParticipant || typeof G.npcTies.byParticipant !== 'object') G.npcTies.byParticipant = {};
    return G.npcTies;
}

function normalizeNpcTieParticipant(ref) {
    if (!ref) return null;
    if (typeof ref === 'string') {
        if (ref.startsWith('seat:')) return { id: ref, kind: 'seat' };
        if (ref.startsWith('world:') || ref.startsWith('wn_') || ref.startsWith('wr_')) {
            return { id: ref.replace(/^world:/, ''), kind: 'world' };
        }
        return { id: ref, kind: 'actor' };
    }
    if (ref.id) {
        return {
            id: ref.id,
            kind: ref.kind || (String(ref.id).startsWith('seat:') ? 'seat' : 'actor')
        };
    }
    if (ref.uid) return { id: ref.uid, kind: 'world' };
    return null;
}

function participantKey(ref) {
    const n = normalizeNpcTieParticipant(ref);
    return n ? n.id : null;
}

function rebuildNpcTieParticipantIndex() {
    const state = ensureNpcTiesState();
    state.byParticipant = {};
    Object.values(state.byId).forEach(tie => {
        if (!tie?.id) return;
        [tie.a, tie.b].forEach(p => {
            const key = participantKey(p);
            if (!key) return;
            if (!state.byParticipant[key]) state.byParticipant[key] = [];
            if (!state.byParticipant[key].includes(tie.id)) state.byParticipant[key].push(tie.id);
        });
    });
}

function indexNpcTieParticipants(tie) {
    const state = ensureNpcTiesState();
    [tie.a, tie.b].forEach(p => {
        const key = participantKey(p);
        if (!key) return;
        if (!state.byParticipant[key]) state.byParticipant[key] = [];
        if (!state.byParticipant[key].includes(tie.id)) state.byParticipant[key].push(tie.id);
    });
}

function makeNpcTieId(aId, bId, kindHint) {
    const left = String(aId);
    const right = String(bId);
    const [x, y] = left < right ? [left, right] : [right, left];
    const hint = kindHint ? String(kindHint).replace(/[^a-z0-9_]+/gi, '_').slice(0, 24) : 'tie';
    return `tie_${hint}_${x}_${y}`.replace(/[^a-zA-Z0-9_:]/g, '_');
}

function getNpcTieById(tieId) {
    if (!tieId) return null;
    const state = ensureNpcTiesState();
    const tie = state.byId[tieId];
    return tie ? JSON.parse(JSON.stringify(tie)) : null;
}

/** Ties involving a participant — index lookup only (no global pair scan). */
function getNpcTiesFor(participantId) {
    const key = participantKey(participantId);
    if (!key) return [];
    const state = ensureNpcTiesState();
    const ids = state.byParticipant[key] || [];
    return ids.map(id => state.byId[id]).filter(Boolean).map(t => JSON.parse(JSON.stringify(t)));
}

function findNpcTieBetween(aRef, bRef) {
    const aKey = participantKey(aRef);
    const bKey = participantKey(bRef);
    if (!aKey || !bKey) return null;
    const state = ensureNpcTiesState();
    const ids = state.byParticipant[aKey] || [];
    for (let i = 0; i < ids.length; i++) {
        const tie = state.byId[ids[i]];
        if (!tie) continue;
        const ends = [participantKey(tie.a), participantKey(tie.b)];
        if (ends.includes(aKey) && ends.includes(bKey)) {
            return JSON.parse(JSON.stringify(tie));
        }
    }
    return null;
}

/**
 * Subjective view of a tie from one participant's side.
 * Objective kinds stay shared; stance fields are per-participant (asymmetric).
 */
function getNpcTiePerspective(tieIdOrTie, viewerId) {
    const tie = typeof tieIdOrTie === 'string' ? getNpcTieById(tieIdOrTie) : tieIdOrTie;
    const viewer = participantKey(viewerId);
    if (!tie || !viewer) return null;
    const aKey = participantKey(tie.a);
    const bKey = participantKey(tie.b);
    if (viewer !== aKey && viewer !== bKey) return null;
    const other = viewer === aKey ? tie.b : tie.a;
    const stanceBag = (tie.stance && tie.stance[viewer]) || {};
    return {
        tieId: tie.id,
        kinds: (tie.kinds || []).slice(),
        labels: (tie.labels || []).slice(),
        self: viewer,
        other: other ? { ...other } : null,
        trust: stanceBag.trust != null ? stanceBag.trust : 0,
        attachment: stanceBag.attachment != null ? stanceBag.attachment : 0,
        tension: stanceBag.tension != null ? stanceBag.tension : 0,
        notes: stanceBag.notes || null,
        otherAlive: isNpcTieParticipantAlive(other)
    };
}

function isNpcTieParticipantAlive(ref) {
    const n = normalizeNpcTieParticipant(ref);
    if (!n) return null;
    if (n.kind === 'seat') {
        // Civic seats turn over; "alive" means a holder currently exists.
        const parts = String(n.id).split(':');
        if (parts.length >= 3 && typeof getSettlementSeatHolder === 'function') {
            return !!getSettlementSeatHolder(parts[1], parts[2]);
        }
        return null;
    }
    if (typeof findWorldNpcRecordByUid === 'function') {
        const npc = findWorldNpcRecordByUid(n.id);
        if (npc) return npc.alive !== false;
    }
    if (typeof getNpcDef === 'function' && getNpcDef(n.id)) return true;
    return null;
}

/**
 * Create or update a meaningful tie. Idempotent when `id` is stable.
 * Does not rewrite existing stance fields unless `overwriteStance` is true
 * or those fields are missing.
 */
function upsertNpcTie(spec) {
    if (!spec) return null;
    const state = ensureNpcTiesState();
    const a = normalizeNpcTieParticipant(spec.a);
    const b = normalizeNpcTieParticipant(spec.b);
    if (!a?.id || !b?.id || a.id === b.id) return null;

    const kinds = Array.isArray(spec.kinds)
        ? spec.kinds.filter(k => NPC_TIE_KIND_IDS.includes(k))
        : (spec.kind && NPC_TIE_KIND_IDS.includes(spec.kind) ? [spec.kind] : []);
    if (!kinds.length && !spec.id) return null;

    const id = spec.id || makeNpcTieId(a.id, b.id, kinds[0] || 'bond');
    const existing = state.byId[id];
    const tie = existing || {
        id,
        kinds: [],
        a,
        b,
        labels: [],
        stance: {},
        createdAtMonths: G.ageMonths || 0
    };

    if (!existing) {
        tie.kinds = kinds.slice();
        tie.a = a;
        tie.b = b;
        tie.labels = Array.isArray(spec.labels) ? spec.labels.slice() : [];
        tie.stance = {};
    } else {
        // Merge kinds/labels; never wipe participants.
        kinds.forEach(k => {
            if (!tie.kinds.includes(k)) tie.kinds.push(k);
        });
        (spec.labels || []).forEach(l => {
            if (!tie.labels.includes(l)) tie.labels.push(l);
        });
    }

    const incomingStance = spec.stance || {};
    Object.keys(incomingStance).forEach(pid => {
        if (!tie.stance[pid] || spec.overwriteStance) {
            tie.stance[pid] = { ...incomingStance[pid] };
        } else {
            // Fill missing subjective fields only.
            const cur = tie.stance[pid];
            const next = incomingStance[pid] || {};
            ['trust', 'attachment', 'tension', 'notes'].forEach(field => {
                if (cur[field] == null && next[field] != null) cur[field] = next[field];
            });
        }
    });

    if (spec.meta && typeof spec.meta === 'object') {
        tie.meta = Object.assign({}, tie.meta || {}, spec.meta);
    }

    state.byId[id] = tie;
    indexNpcTieParticipants(tie);
    return JSON.parse(JSON.stringify(tie));
}

function seedCanonicalNpcTies() {
    ensureNpcTiesState();
    CANONICAL_NPC_TIES.forEach(spec => {
        upsertNpcTie(spec);
    });
}

function migrateNpcTiesForExistingSave() {
    ensureNpcTiesState();
    rebuildNpcTieParticipantIndex();
    seedCanonicalNpcTies();
}

/** Combined Phase B migrate: foundations + ties. */
function migrateNpcAgencyFoundationsAndTies() {
    if (typeof migrateNpcFoundationsForExistingSave === 'function') {
        migrateNpcFoundationsForExistingSave();
    }
    migrateNpcTiesForExistingSave();
}
