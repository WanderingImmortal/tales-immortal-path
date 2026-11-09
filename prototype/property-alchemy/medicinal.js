/**
 * Experimental medicinal property ledger (prototype pills).
 * Distinct from spirit mass and legacy affinity hazards; extracted via material slices.
 */

/** @typedef {'qiNourishment'|'woundStabilisation'|'tissueRestoration'|'boneRestoration'|'bloodRestoration'} MedicinalPropertyId */

/** @type {MedicinalPropertyId[]} */
const MEDICINAL_PROPERTY_IDS = [
    'qiNourishment',
    'woundStabilisation',
    'tissueRestoration',
    'boneRestoration',
    'bloodRestoration'
];

const MEDICINAL_LABELS = {
    qiNourishment: 'Qi Nourishment',
    woundStabilisation: 'Wound Stabilisation',
    tissueRestoration: 'Tissue Restoration',
    boneRestoration: 'Bone Restoration',
    bloodRestoration: 'Blood Restoration'
};

const EXPERIMENTAL_PILL_SHORT = {
    qiNourishment: 'Qi Nourishing',
    woundStabilisation: 'Wound-Stabilising',
    tissueRestoration: 'Tissue-Restoring',
    boneRestoration: 'Bone-Mending',
    bloodRestoration: 'Blood-Restoring'
};

const MEDICINAL_LIST_THRESHOLD = 0.35;

/** Minimum peak property strength for a condensed pill to count as medically useful. */
const USEFUL_MEDICINAL_PEAK = 2;

function round1(n) {
    return Math.round(n * 10) / 10;
}

function round3(n) {
    return Math.round(n * 1000) / 1000;
}

function emptyMedicinal() {
    return {
        qiNourishment: 0,
        woundStabilisation: 0,
        tissueRestoration: 0,
        boneRestoration: 0,
        bloodRestoration: 0
    };
}

/**
 * @param {Partial<Record<MedicinalPropertyId, number>>|undefined} partial
 */
function normalizeMedicinalDef(partial) {
    const base = emptyMedicinal();
    if (!partial) return base;
    MEDICINAL_PROPERTY_IDS.forEach((k) => {
        if (typeof partial[k] === 'number' && partial[k] > 0) {
            base[k] = partial[k];
        }
    });
    return base;
}

/**
 * @param {import('./reagents').ReagentDef} def
 * @param {number} qty
 */
function medicinalLoadFromReagent(def, qty) {
    const perUnit = normalizeMedicinalDef(def.medicinal);
    return scaleMedicinal(perUnit, qty);
}

function scaleMedicinal(medicinal, scale) {
    if (scale <= 0) return emptyMedicinal();
    const out = emptyMedicinal();
    MEDICINAL_PROPERTY_IDS.forEach((k) => {
        out[k] = (medicinal[k] || 0) * scale;
    });
    return out;
}

function mergeMedicinal(into, part) {
    MEDICINAL_PROPERTY_IDS.forEach((k) => {
        into[k] = (into[k] || 0) + (part[k] || 0);
    });
}

/**
 * Rank present medicinal strengths (raw ledger units).
 * @param {ReturnType<typeof emptyMedicinal>} medicinal
 */
function rankMedicinalStrengths(medicinal) {
    return MEDICINAL_PROPERTY_IDS
        .map((id) => ({ id, strength: medicinal[id] || 0, label: MEDICINAL_LABELS[id] }))
        .filter((e) => e.strength > MEDICINAL_LIST_THRESHOLD)
        .sort((a, b) => b.strength - a.strength);
}

/**
 * Descriptive experimental pill name from resulting strengths (not recipe-locked).
 * @param {ReturnType<typeof emptyMedicinal>} medicinal
 */
function experimentalPillName(medicinal) {
    const ranked = rankMedicinalStrengths(medicinal);
    if (!ranked.length) return 'Inert Experimental Pill';
    if (ranked.length === 1) {
        return `${EXPERIMENTAL_PILL_SHORT[ranked[0].id]} Pill`;
    }
    const primary = EXPERIMENTAL_PILL_SHORT[ranked[0].id];
    const secondary = EXPERIMENTAL_PILL_SHORT[ranked[1].id];
    if (
        ranked[0].id === 'qiNourishment'
        && (ranked[1].id === 'woundStabilisation' || ranked[1].id === 'tissueRestoration')
    ) {
        return 'Qi & Healing Pill';
    }
    return `${primary} & ${secondary} Pill`;
}

/**
 * Condense released medicinal mass into pill strengths (additive, purity-adjusted).
 * @param {ReturnType<typeof emptyMedicinal>} releasedMedicinal
 * @param {{ mixturePurity: number, impurityRatio: number, condenseFactor: number, processPenalty: number }} ctx
 */
function productMedicinalFromReleased(releasedMedicinal, ctx) {
    const purityScale = Math.max(0.1, ctx.mixturePurity);
    const condense = ctx.condenseFactor * Math.max(0.12, 1 - ctx.impurityRatio * 0.4);
    const penalty = ctx.processPenalty;
    const out = emptyMedicinal();
    MEDICINAL_PROPERTY_IDS.forEach((k) => {
        const raw = Math.max(0, releasedMedicinal[k] || 0);
        out[k] = round1(raw * purityScale * condense * penalty);
    });
    return out;
}

/**
 * @param {ReturnType<typeof emptyMedicinal>} medicinal
 */
function summarizeMedicinal(medicinal) {
    const out = emptyMedicinal();
    MEDICINAL_PROPERTY_IDS.forEach((k) => {
        out[k] = round1(medicinal[k] || 0);
    });
    return out;
}

function peakMedicinalStrength(medicinal) {
    const ranked = rankMedicinalStrengths(medicinal);
    return ranked[0]?.strength ?? 0;
}

function hasUsefulMedicinalProfile(medicinal) {
    return peakMedicinalStrength(medicinal) >= USEFUL_MEDICINAL_PEAK;
}

/**
 * @param {object} ctx
 * @param {number} ctx.mixturePurity
 * @param {number} ctx.impurityRatio
 * @param {number} ctx.toxicity
 * @param {number} ctx.legacyPotency — affinity-scaled legacy potency
 * @param {ReturnType<typeof emptyMedicinal>} ctx.productMedicinal
 * @param {string} ctx.processOutcome — refined | unstable_salvage | failed | rupture
 */
function deriveProductSuitability(ctx) {
    const {
        mixturePurity,
        impurityRatio,
        toxicity,
        legacyPotency,
        productMedicinal,
        processOutcome
    } = ctx;

    if (processOutcome === 'failed' || processOutcome === 'rupture') {
        return 'ruined';
    }
    if (mixturePurity < 0.52 || impurityRatio > 0.45) {
        return 'impure';
    }
    if (toxicity > 4) {
        return 'hazardous';
    }
    if (legacyPotency >= 2 || hasUsefulMedicinalProfile(productMedicinal)) {
        return 'medicinal';
    }
    return 'weak';
}

module.exports = {
    MEDICINAL_PROPERTY_IDS,
    MEDICINAL_LABELS,
    MEDICINAL_LIST_THRESHOLD,
    USEFUL_MEDICINAL_PEAK,
    emptyMedicinal,
    normalizeMedicinalDef,
    medicinalLoadFromReagent,
    scaleMedicinal,
    mergeMedicinal,
    rankMedicinalStrengths,
    experimentalPillName,
    productMedicinalFromReleased,
    summarizeMedicinal,
    peakMedicinalStrength,
    hasUsefulMedicinalProfile,
    deriveProductSuitability
};
