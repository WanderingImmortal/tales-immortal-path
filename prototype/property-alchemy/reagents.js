/**
 * Experimental reagents for property-based alchemy prototype.
 * IDs are isolated from live ALCHEMY_MATERIALS — no save/game coupling.
 */

/** @typedef {{ qi: number, heat: number, marrow: number, purify: number, toxicity: number }} Affinities */

/**
 * @typedef {object} ReagentDef
 * @property {string} id
 * @property {string} name
 * @property {number} spirit — spiritual energy per unit (0–100 scale)
 * @property {number} yin — yin charge per unit
 * @property {number} yang — yang charge per unit
 * @property {number} volatility — heat-driven reactivity per unit
 * @property {number} stability — stabilising influence per unit
 * @property {number} impurity — contaminant load per unit
 * @property {Affinities} affinities — medicinal / hazard leanings
 * @property {string} [note] — design blurb for docs
 */

/** @type {Record<string, ReagentDef>} */
const EXPERIMENTAL_REAGENTS = {
    exp_dawn_dew: {
        id: 'exp_dawn_dew',
        name: 'Dawn Dew',
        spirit: 8,
        yin: 4,
        yang: 2,
        volatility: 3,
        stability: 14,
        impurity: 2,
        affinities: { qi: 6, heat: 0, marrow: 0, purify: 4, toxicity: 0 },
        note: 'Gentle carrier; stabilises volatile mixes at low heat.'
    },
    exp_dust_root: {
        id: 'exp_dust_root',
        name: 'Dust Root',
        spirit: 18,
        yin: 8,
        yang: 3,
        volatility: 5,
        stability: 10,
        impurity: 6,
        affinities: { qi: 12, heat: 0, marrow: 2, purify: 2, toxicity: 0 },
        note: 'Earthy binder; modest qi with some impurity.'
    },
    exp_foundation_root: {
        id: 'exp_foundation_root',
        name: 'Foundation Root',
        spirit: 28,
        yin: 6,
        yang: 6,
        volatility: 4,
        stability: 22,
        impurity: 3,
        affinities: { qi: 18, heat: 0, marrow: 4, purify: 6, toxicity: 0 },
        note: 'Strong stabiliser and qi affinity.'
    },
    exp_saltbrush: {
        id: 'exp_saltbrush',
        name: 'Saltbrush Tip',
        spirit: 6,
        yin: 5,
        yang: 4,
        volatility: 2,
        stability: 16,
        impurity: 1,
        affinities: { qi: 2, heat: 0, marrow: 0, purify: 20, toxicity: 0 },
        note: 'Purifies and dampens polarity clashes.'
    },
    exp_marrow_thistle: {
        id: 'exp_marrow_thistle',
        name: 'Marrow Thistle',
        spirit: 22,
        yin: 10,
        yang: 2,
        volatility: 6,
        stability: 8,
        impurity: 5,
        affinities: { qi: 8, heat: 0, marrow: 22, purify: 2, toxicity: 0 },
        note: 'Marrow-forward; yin-leaning.'
    },
    exp_sun_stone: {
        id: 'exp_sun_stone',
        name: 'Sun Stone',
        spirit: 30,
        yin: 0,
        yang: 26,
        volatility: 24,
        stability: 2,
        impurity: 4,
        affinities: { qi: 4, heat: 28, marrow: 0, purify: 0, toxicity: 2 },
        note: 'High yang catalyst; dangerous at fierce heat.'
    },
    exp_blood_crystal: {
        id: 'exp_blood_crystal',
        name: 'Blood Crystal',
        spirit: 24,
        yin: 2,
        yang: 20,
        volatility: 18,
        stability: 3,
        impurity: 8,
        affinities: { qi: 2, heat: 16, marrow: 6, purify: 0, toxicity: 4 },
        note: 'Volatile yang; pairs poorly without purifiers.'
    },
    exp_soul_mist: {
        id: 'exp_soul_mist',
        name: 'Soul Mist',
        spirit: 26,
        yin: 22,
        yang: 1,
        volatility: 16,
        stability: 4,
        impurity: 3,
        affinities: { qi: 10, heat: 0, marrow: 4, purify: 2, toxicity: 6 },
        note: 'Dense yin; clashes with strong yang under heat.'
    },
    exp_ironscar_grit: {
        id: 'exp_ironscar_grit',
        name: 'Ironscar Grit',
        spirit: 10,
        yin: 4,
        yang: 8,
        volatility: 4,
        stability: 6,
        impurity: 28,
        affinities: { qi: 2, heat: 4, marrow: 8, purify: 0, toxicity: 6 },
        note: 'Mineral weight and impurity; needs gentle refining.'
    },
    exp_glowcap: {
        id: 'exp_glowcap',
        name: 'Glowcap',
        spirit: 16,
        yin: 14,
        yang: 2,
        volatility: 8,
        stability: 7,
        impurity: 4,
        affinities: { qi: 14, heat: 0, marrow: 6, purify: 4, toxicity: 0 },
        note: 'Soft yin qi and marrow support.'
    }
};

const REAGENT_IDS = Object.keys(EXPERIMENTAL_REAGENTS);

module.exports = {
    EXPERIMENTAL_REAGENTS,
    REAGENT_IDS
};
