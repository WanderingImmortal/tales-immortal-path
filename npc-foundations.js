// NPC character foundations — stable disposition / motivations (NPC agency Phase B+).
// Reuses existing NPC_PERSONALITY_* trait ids. Does not replace them or drift on ticks.
//
// === Precedence (PR #203) ===
// Personality (effective):
//   World NPCs  → live npc.personalities (gameplay authority for converse/duel/betrayal)
//   Story NPCs  → NPCS[id].personalities (canonical authored source)
//   Empty world → authored defaults (if any), else procedural roll via ensureNpcPersonalities
// Authored catalogue personalities[] are DEFAULTS / narrative docs only — not a competing live set.
// Values / ambitions / convictions / attachments remain independent authored (or procedural) layers.
//
// Layers for future agency (no chooser here):
//   Personality  — interaction style / coarse tendencies (not automatic decisions)
//   Values       — what they care about
//   Ambitions    — what they seek
//   Convictions  — principles that bias choices
//   Attachments  — important places/institutions/people as personal stakes
//   Social ties  — G.npcTies relationships between actors (asymmetric feelings)
// Example: loyal ≠ unconditional obedience; careful ≠ refusing every risk.

const NPC_FOUNDATION_VERSION = 1;

/** Known value ids (extensible). Weights are 0–1 soft strengths, not rigid ranks. */
const NPC_FOUNDATION_VALUE_IDS = [
    'personal_security',
    'own_people',
    'lodge_legacy',
    'established_bonds',
    'pragmatism',
    'advancement',
    'honor',
    'mercy',
    'secrecy',
    'standing'
];

const NPC_FOUNDATION_AMBITION_IDS = [
    'preserve_well_ring',
    'local_standing',
    'advancement',
    'survive',
    'wealth',
    'recognition'
];

/** Master Liang target traits (PR #203). Pragmatism lives in values/convictions, not `cunning`. */
const MASTER_LIANG_PERSONALITIES = ['careful', 'loyal'];

/**
 * Exact legacy default sets recognised for narrow migration (order-insensitive).
 * Unrecognised combinations are preserved (may be intentional).
 */
const MASTER_LIANG_LEGACY_PERSONALITY_SETS = [
    ['cunning', 'wise'],   // PR #201 cast default
    ['cunning', 'loyal']   // PR #202 interim default
];

/**
 * Authored foundations keyed by stable actor id (world uid or story npc id).
 * personalities[] here are defaults only — effective traits come from live NPC / story def.
 */
const NPC_CHARACTER_FOUNDATIONS = {
    wr_master_liang: {
        id: 'wr_master_liang',
        name: 'Master Liang',
        source: 'authored',
        personalities: MASTER_LIANG_PERSONALITIES.slice(),
        values: [
            { id: 'lodge_legacy', weight: 0.92 },
            { id: 'personal_security', weight: 0.86 },
            { id: 'own_people', weight: 0.82 },
            { id: 'established_bonds', weight: 0.78 },
            { id: 'pragmatism', weight: 0.74 }
        ],
        ambitions: [
            { id: 'preserve_well_ring', priority: 0.9 },
            { id: 'local_standing', priority: 0.42 }
        ],
        convictions: [
            { id: 'negotiate_to_preserve', strength: 0.84 },
            { id: 'loyalty_is_earned', strength: 0.7 },
            { id: 'no_need_for_heavens', strength: 0.75 }
        ],
        attachments: [
            { id: 'well_ring_lodge', kind: 'institution', strength: 0.95, label: 'Well-Ring Lodge' }
        ],
        lore: {
            foundedWellRing: true,
            realmBand: 'early_fe',
            // Lore only — do not wire into cultivation/combat quality systems.
            foundationQualityNote:
                'Somewhat better Foundation Establishment foundation than Redwell\'s mid-FE city lord; meaningful locally, ordinary by wider jianghu standards.'
        }
    }
};

function getAuthoredCharacterFoundation(actorId) {
    if (!actorId) return null;
    const def = NPC_CHARACTER_FOUNDATIONS[actorId];
    return def ? cloneNpcFoundation(def) : null;
}

function cloneNpcFoundation(foundation) {
    if (!foundation) return null;
    return JSON.parse(JSON.stringify(foundation));
}

function resolveNpcActorId(npcOrId) {
    if (!npcOrId) return null;
    if (typeof npcOrId === 'string') return npcOrId;
    if (npcOrId.uid) return npcOrId.uid;
    if (npcOrId.id) return npcOrId.id;
    return null;
}

function findNpcForFoundation(npcOrId) {
    if (!npcOrId) return null;
    if (typeof npcOrId === 'object' && (npcOrId.uid || npcOrId.id || npcOrId.personalities || npcOrId._story)) {
        return npcOrId;
    }
    const id = resolveNpcActorId(npcOrId);
    if (!id) return null;
    if (typeof findWorldNpcRecordByUid === 'function') {
        const world = findWorldNpcRecordByUid(id);
        if (world) return world;
    }
    if (typeof getNpcDef === 'function') {
        const def = getNpcDef(id);
        if (def) {
            return {
                id,
                uid: id,
                personalities: def.personalities ? def.personalities.slice() : [],
                role: def.role || null,
                _story: true
            };
        }
    }
    return null;
}

function personalitySetKey(list) {
    return (list || []).slice().map(String).sort().join('|');
}

function personalitySetsEqual(a, b) {
    return personalitySetKey(a) === personalitySetKey(b);
}

function isRecognisedMasterLiangLegacyPersonalities(list) {
    if (!list || !list.length) return false;
    return MASTER_LIANG_LEGACY_PERSONALITY_SETS.some(legacy => personalitySetsEqual(list, legacy));
}

/**
 * Effective personalities for gameplay + foundation consumers.
 * World: live npc.personalities. Story: NPCS def. Empty authored world: catalogue defaults.
 */
function getEffectiveNpcPersonalities(npcOrId) {
    const npc = findNpcForFoundation(npcOrId);
    if (!npc) {
        const id = resolveNpcActorId(npcOrId);
        const authored = id ? NPC_CHARACTER_FOUNDATIONS[id] : null;
        return authored?.personalities ? authored.personalities.slice() : [];
    }
    if (npc._story) {
        return (npc.personalities || []).slice();
    }
    if (npc.personalities?.length) {
        return npc.personalities.slice();
    }
    const actorId = resolveNpcActorId(npc);
    const authored = actorId ? NPC_CHARACTER_FOUNDATIONS[actorId] : null;
    if (authored?.personalities?.length) return authored.personalities.slice();
    if (typeof ensureNpcPersonalities === 'function') {
        return ensureNpcPersonalities(npc).slice();
    }
    return [];
}

/**
 * Narrow migrate for known Master Liang cast defaults → careful, loyal.
 * Does not touch cultivation, age, zone, merit, ties, or unrecognised personality arrays.
 */
function migrateMasterLiangPersonalities() {
    const npc = typeof findWorldNpcRecordByUid === 'function'
        ? findWorldNpcRecordByUid('wr_master_liang')
        : null;
    if (!npc) return { migrated: false, reason: 'missing' };

    if (personalitySetsEqual(npc.personalities, MASTER_LIANG_PERSONALITIES)) {
        npc.personalitySync = 'liang_careful_loyal_v203';
        return { migrated: false, reason: 'already_current' };
    }

    if (!npc.personalities?.length) {
        npc.personalities = MASTER_LIANG_PERSONALITIES.slice();
        npc.personalitySync = 'liang_careful_loyal_v203';
        return { migrated: true, reason: 'empty_filled' };
    }

    if (isRecognisedMasterLiangLegacyPersonalities(npc.personalities)) {
        npc.personalities = MASTER_LIANG_PERSONALITIES.slice();
        npc.personalitySync = 'liang_careful_loyal_v203';
        return { migrated: true, reason: 'legacy_default' };
    }

    // Unrecognised / possibly intentional — preserve.
    return { migrated: false, reason: 'preserved_unrecognised' };
}

/** Soft personality → value/ambition hints for lightweight procedural foundations. */
function mapPersonalitiesToFoundationHints(personalities) {
    const values = [];
    const ambitions = [];
    const convictions = [];
    const seenV = new Set();
    const seenA = new Set();

    function addValue(id, weight) {
        if (seenV.has(id)) return;
        seenV.add(id);
        values.push({ id, weight });
    }
    function addAmbition(id, priority) {
        if (seenA.has(id)) return;
        seenA.add(id);
        ambitions.push({ id, priority });
    }

    (personalities || []).forEach(pid => {
        switch (pid) {
            case 'loyal':
                addValue('own_people', 0.62);
                addValue('established_bonds', 0.55);
                break;
            case 'ambitious':
                addValue('advancement', 0.58);
                addAmbition('advancement', 0.55);
                addAmbition('recognition', 0.4);
                break;
            case 'careful':
                addValue('personal_security', 0.6);
                addAmbition('survive', 0.5);
                break;
            case 'cowardly':
                addValue('personal_security', 0.7);
                addAmbition('survive', 0.65);
                break;
            case 'honorable':
                addValue('honor', 0.6);
                convictions.push({ id: 'keep_word', strength: 0.55 });
                break;
            case 'merciful':
                addValue('mercy', 0.55);
                break;
            case 'cunning':
                addValue('pragmatism', 0.55);
                addValue('secrecy', 0.4);
                break;
            case 'secretive':
                addValue('secrecy', 0.62);
                break;
            case 'proud':
                addValue('standing', 0.58);
                addAmbition('recognition', 0.48);
                break;
            case 'wise':
                addValue('pragmatism', 0.45);
                break;
            case 'vengeful':
                convictions.push({ id: 'remember_slights', strength: 0.6 });
                break;
            case 'zealous':
                convictions.push({ id: 'cause_above_self', strength: 0.55 });
                break;
            default:
                break;
        }
    });

    if (!values.length) addValue('personal_security', 0.4);
    if (!ambitions.length) addAmbition('survive', 0.35);

    return {
        values: values.slice(0, 4),
        ambitions: ambitions.slice(0, 2),
        convictions: convictions.slice(0, 2)
    };
}

function buildProceduralFoundation(npc) {
    const personalities = getEffectiveNpcPersonalities(npc);
    const hints = mapPersonalitiesToFoundationHints(personalities);
    return {
        version: NPC_FOUNDATION_VERSION,
        id: npc.uid || npc.id || null,
        source: 'procedural',
        personalities,
        values: hints.values,
        ambitions: hints.ambitions,
        convictions: hints.convictions,
        attachments: []
    };
}

/**
 * Keep procedural foundation.personalities mirror aligned with live traits without
 * rerolling established values/ambitions/convictions (save-safe compatibility).
 */
function syncProceduralFoundationPersonalityMirror(npc) {
    if (!npc?.foundation || npc.foundation.source === 'authored') return;
    const live = getEffectiveNpcPersonalities(npc);
    if (!live.length) return;
    if (!personalitySetsEqual(npc.foundation.personalities, live)) {
        npc.foundation.personalities = live.slice();
        // Values/ambitions/convictions intentionally left alone — do not regenerate on load/tick.
    }
}

/**
 * Attach a stable foundation marker to an NPC without rewriting personalities
 * (except empty → authored defaults). Procedural: foundation blob once from final traits.
 */
function ensureNpcCharacterFoundation(npcOrId) {
    const npc = findNpcForFoundation(npcOrId);
    if (!npc) return null;
    const actorId = resolveNpcActorId(npc);
    const authored = actorId ? NPC_CHARACTER_FOUNDATIONS[actorId] : null;

    if (authored) {
        npc.foundationRef = authored.id;
        npc.foundationSource = 'authored';
        if (!npc.personalities?.length && authored.personalities?.length) {
            npc.personalities = authored.personalities.slice();
        }
        return getNpcCharacterFoundation(npc);
    }

    if (npc._story) {
        return getNpcCharacterFoundation(npc);
    }

    if (npc.state === 'ambient' && npc.unnamed) {
        return null;
    }

    if (!npc.foundation) {
        npc.foundation = buildProceduralFoundation(npc);
    } else if (npc.foundation.version !== NPC_FOUNDATION_VERSION) {
        npc.foundation.version = NPC_FOUNDATION_VERSION;
        if (!npc.foundation.source) npc.foundation.source = 'procedural';
        if (!Array.isArray(npc.foundation.values)) npc.foundation.values = [];
        if (!Array.isArray(npc.foundation.ambitions)) npc.foundation.ambitions = [];
        if (!Array.isArray(npc.foundation.convictions)) npc.foundation.convictions = [];
        if (!Array.isArray(npc.foundation.attachments)) npc.foundation.attachments = [];
        syncProceduralFoundationPersonalityMirror(npc);
    } else {
        syncProceduralFoundationPersonalityMirror(npc);
    }
    npc.foundationSource = 'procedural';
    return getNpcCharacterFoundation(npc);
}

/**
 * Resolved foundation for consumers. Authored motivations from catalogue;
 * personalities always match effective live/story traits.
 */
function getNpcCharacterFoundation(npcOrId) {
    const npc = findNpcForFoundation(npcOrId);
    const actorId = resolveNpcActorId(npcOrId) || resolveNpcActorId(npc);
    const authoredDef = actorId ? NPC_CHARACTER_FOUNDATIONS[actorId] : null;

    if (authoredDef) {
        const out = cloneNpcFoundation(authoredDef);
        out.personalities = getEffectiveNpcPersonalities(npc || actorId);
        return out;
    }

    if (!npc) return null;
    if (npc.foundationRef && NPC_CHARACTER_FOUNDATIONS[npc.foundationRef]) {
        const out = cloneNpcFoundation(NPC_CHARACTER_FOUNDATIONS[npc.foundationRef]);
        out.personalities = getEffectiveNpcPersonalities(npc);
        return out;
    }
    // Story NPCs without an authored foundation entry: personalities from NPCS def only.
    if (npc._story) {
        return {
            version: NPC_FOUNDATION_VERSION,
            id: npc.id || actorId,
            source: 'story',
            personalities: getEffectiveNpcPersonalities(npc),
            values: [],
            ambitions: [],
            convictions: [],
            attachments: []
        };
    }
    if (npc.foundation) {
        const out = cloneNpcFoundation(npc.foundation);
        out.personalities = getEffectiveNpcPersonalities(npc);
        return out;
    }
    return ensureNpcCharacterFoundation(npc);
}

function getNpcFoundationValues(npcOrId) {
    const f = getNpcCharacterFoundation(npcOrId);
    return f?.values ? f.values.slice() : [];
}

function getNpcFoundationAmbitions(npcOrId) {
    const f = getNpcCharacterFoundation(npcOrId);
    return f?.ambitions ? f.ambitions.slice() : [];
}

function getNpcFoundationConvictions(npcOrId) {
    const f = getNpcCharacterFoundation(npcOrId);
    return f?.convictions ? f.convictions.slice() : [];
}

function getNpcFoundationAttachments(npcOrId) {
    const f = getNpcCharacterFoundation(npcOrId);
    return f?.attachments ? f.attachments.slice() : [];
}

function ensureAllWorldNpcFoundations() {
    if (!G.worldNpcs) return;
    migrateMasterLiangPersonalities();
    G.worldNpcs.forEach(npc => {
        if (!npc || npc.alive === false) return;
        if (npc.state === 'ambient' && npc.unnamed) return;
        ensureNpcCharacterFoundation(npc);
    });
}

function migrateNpcFoundationsForExistingSave() {
    migrateMasterLiangPersonalities();
    ensureAllWorldNpcFoundations();
}
