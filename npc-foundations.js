// NPC character foundations — stable disposition / motivations (NPC agency Phase B).
// Reuses existing NPC_PERSONALITY_* trait ids. Does not replace them or drift on ticks.
// Authored catalog is source of truth for named faces; procedural blobs are generated once.

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

/**
 * Authored foundations keyed by stable actor id (world uid or story npc id).
 * personalities[] reuse NPC_PERSONALITY_IDS — tendencies, not a second trait system.
 */
const NPC_CHARACTER_FOUNDATIONS = {
    wr_master_liang: {
        id: 'wr_master_liang',
        name: 'Master Liang',
        source: 'authored',
        personalities: ['cunning', 'loyal'],
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
            // Lore only — do not wire into cultivation/combat quality systems in Phase B.
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
    if (typeof npcOrId === 'object' && (npcOrId.uid || npcOrId.personalities)) return npcOrId;
    const id = resolveNpcActorId(npcOrId);
    if (!id) return null;
    if (typeof findWorldNpcRecordByUid === 'function') {
        const world = findWorldNpcRecordByUid(id);
        if (world) return world;
    }
    if (typeof getNpcDef === 'function') {
        const def = getNpcDef(id);
        if (def) return { id, uid: id, personalities: def.personalities || [], role: def.role || null, _story: true };
    }
    return null;
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

    // Cap procedural ambition lists — no biography dumps.
    return {
        values: values.slice(0, 4),
        ambitions: ambitions.slice(0, 2),
        convictions: convictions.slice(0, 2)
    };
}

function buildProceduralFoundation(npc) {
    const personalities = (npc.personalities && npc.personalities.length)
        ? npc.personalities.slice()
        : (typeof ensureNpcPersonalities === 'function' ? ensureNpcPersonalities(npc).slice() : []);
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
 * Attach a stable foundation marker to an NPC without rewriting personalities.
 * Authored: foundationRef only. Procedural: foundation blob once.
 */
function ensureNpcCharacterFoundation(npcOrId) {
    const npc = findNpcForFoundation(npcOrId);
    if (!npc) return null;
    const actorId = resolveNpcActorId(npc);
    const authored = actorId ? NPC_CHARACTER_FOUNDATIONS[actorId] : null;

    if (authored) {
        npc.foundationRef = authored.id;
        npc.foundationSource = 'authored';
        // Do not overwrite existing personalities (no retroactive reroll).
        if (!npc.personalities?.length && authored.personalities?.length) {
            npc.personalities = authored.personalities.slice();
        }
        return getNpcCharacterFoundation(npc);
    }

    if (npc.state === 'ambient' && npc.unnamed) {
        // Ambient unnamed strangers stay foundation-light until promoted.
        return null;
    }

    if (!npc.foundation || npc.foundation.version !== NPC_FOUNDATION_VERSION) {
        if (!npc.foundation) {
            npc.foundation = buildProceduralFoundation(npc);
        } else if (npc.foundation.version !== NPC_FOUNDATION_VERSION) {
            // Soft migrate shape; keep existing arrays if present.
            npc.foundation.version = NPC_FOUNDATION_VERSION;
            if (!npc.foundation.source) npc.foundation.source = 'procedural';
            if (!Array.isArray(npc.foundation.values)) npc.foundation.values = [];
            if (!Array.isArray(npc.foundation.ambitions)) npc.foundation.ambitions = [];
            if (!Array.isArray(npc.foundation.convictions)) npc.foundation.convictions = [];
            if (!Array.isArray(npc.foundation.attachments)) npc.foundation.attachments = [];
        }
    }
    npc.foundationSource = 'procedural';
    return getNpcCharacterFoundation(npc);
}

function getNpcCharacterFoundation(npcOrId) {
    const actorId = resolveNpcActorId(npcOrId);
    const authored = actorId ? getAuthoredCharacterFoundation(actorId) : null;
    if (authored) return authored;

    const npc = findNpcForFoundation(npcOrId);
    if (!npc) return null;
    if (npc.foundationRef && NPC_CHARACTER_FOUNDATIONS[npc.foundationRef]) {
        return getAuthoredCharacterFoundation(npc.foundationRef);
    }
    if (npc.foundation) return cloneNpcFoundation(npc.foundation);
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
    G.worldNpcs.forEach(npc => {
        if (!npc || npc.alive === false) return;
        if (npc.state === 'ambient' && npc.unnamed) return;
        ensureNpcCharacterFoundation(npc);
    });
}

function migrateNpcFoundationsForExistingSave() {
    ensureAllWorldNpcFoundations();
}
