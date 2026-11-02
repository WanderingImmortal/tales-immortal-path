/**
 * Property-based alchemy refinement — deterministic reaction model (prototype).
 */

const { EXPERIMENTAL_REAGENTS } = require('./reagents');

/** @typedef {'gentle' | 'medium' | 'fierce'} HeatProfile */
/** @typedef {'simultaneous' | 'yin_first' | 'yang_first'} IntroductionOrder */

const HEAT_VALUES = {
    gentle: 0.35,
    medium: 0.65,
    fierce: 0.95
};

const OUTCOME = {
    REFINED: 'refined',
    UNSTABLE_SALVAGE: 'unstable_salvage',
    FAILED: 'failed',
    RUPTURE: 'rupture'
};

/**
 * @param {Affinities} a
 * @param {Affinities} b
 * @returns {Affinities}
 */
function addAffinities(a, b) {
    return {
        qi: a.qi + b.qi,
        heat: a.heat + b.heat,
        marrow: a.marrow + b.marrow,
        purify: a.purify + b.purify,
        toxicity: a.toxicity + b.toxicity
    };
}

/** @returns {Affinities} */
function emptyAffinities() {
    return { qi: 0, heat: 0, marrow: 0, purify: 0, toxicity: 0 };
}

/**
 * @param {Affinities} aff
 * @param {number} scale
 */
function scaleAffinities(aff, scale) {
    return {
        qi: aff.qi * scale,
        heat: aff.heat * scale,
        marrow: aff.marrow * scale,
        purify: aff.purify * scale,
        toxicity: aff.toxicity * scale
    };
}

/**
 * @param {string} reagentId
 * @param {number} qty
 */
function loadFromReagent(reagentId, qty) {
    const def = EXPERIMENTAL_REAGENTS[reagentId];
    if (!def) throw new Error(`Unknown reagent: ${reagentId}`);
    if (qty <= 0) throw new Error(`Quantity must be positive: ${reagentId}`);
    return {
        reagentId,
        qty,
        spirit: def.spirit * qty,
        yin: def.yin * qty,
        yang: def.yang * qty,
        volatility: def.volatility * qty,
        stability: def.stability * qty,
        impurity: def.impurity * qty,
        affinities: scaleAffinities(def.affinities, qty),
        dominant: def.yin > def.yang * 1.2 ? 'yin' : (def.yang > def.yin * 1.2 ? 'yang' : 'neutral')
    };
}

/**
 * @param {ReturnType<typeof loadFromReagent>[]} loads
 * @param {IntroductionOrder} order
 * @returns {ReturnType<typeof loadFromReagent>[][]}
 */
function partitionByIntroduction(loads, order) {
    if (order === 'simultaneous') return [loads];

    const phaseA = [];
    const phaseB = [];
    const pickFirst = order === 'yin_first' ? 'yin' : 'yang';

    loads.forEach(load => {
        if (load.dominant === pickFirst) phaseA.push(load);
        else phaseB.push(load);
    });

    if (!phaseA.length || !phaseB.length) return [loads];
    return [phaseA, phaseB];
}

/**
 * @param {object} state
 * @param {ReturnType<typeof loadFromReagent>} load
 */
function mergeLoad(state, load) {
    state.spirit += load.spirit;
    state.yin += load.yin;
    state.yang += load.yang;
    state.volatility += load.volatility;
    state.stability += load.stability;
    state.impurity += load.impurity;
    state.affinities = addAffinities(state.affinities, load.affinities);
    state.totalUnits += load.qty;
}

/**
 * @param {number} yin
 * @param {number} yang
 */
function polarityImbalance(yin, yang) {
    const total = yin + yang;
    if (total <= 0) return 0;
    return Math.abs(yin - yang) / total;
}

/**
 * @param {number} seed
 */
function seededNoise(seed, salt) {
    const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
}

/**
 * @typedef {object} RefinementInput
 * @property {{ reagentId: string, qty: number }[]} reagents
 * @property {HeatProfile} heat
 * @property {IntroductionOrder} [introductionOrder]
 * @property {number} [seed] — optional; only affects minor impurity scatter (±3%)
 */

/**
 * @param {RefinementInput} input
 */
function simulateRefinement(input) {
    const heatKey = input.heat || 'medium';
    const heat = HEAT_VALUES[heatKey] ?? HEAT_VALUES.medium;
    const order = input.introductionOrder || 'simultaneous';
    const seed = input.seed ?? 0;

    const loads = (input.reagents || []).map(r => loadFromReagent(r.reagentId, r.qty));
    if (!loads.length) throw new Error('At least one reagent required');

    const phases = partitionByIntroduction(loads, order);

    /** @type {object} */
    const cauldron = {
        spirit: 0,
        yin: 0,
        yang: 0,
        volatility: 0,
        stability: 0,
        impurity: 0,
        affinities: emptyAffinities(),
        totalUnits: 0,
        instability: 0
    };

    const phaseLog = [];
    let peakInstability = 0;

    phases.forEach((phaseLoads, phaseIndex) => {
        const beforeYin = cauldron.yin;
        const beforeYang = cauldron.yang;

        phaseLoads.forEach(load => mergeLoad(cauldron, load));

        const clash = polarityImbalance(cauldron.yin, cauldron.yang);
        const newCharge = polarityImbalance(
            cauldron.yin - beforeYin,
            cauldron.yang - beforeYang
        );
        const introductionShock = phaseIndex > 0 ? newCharge * 0.55 : 0;

        const thermalDrive = (cauldron.volatility / Math.max(1, cauldron.totalUnits)) * heat * heat;
        const polarityStrain = clash * (cauldron.spirit * 0.004 + 1) * heat;
        const shockStrain = introductionShock * heat * (cauldron.spirit * 0.006 + 1);

        const purifyDamp = cauldron.affinities.purify * 0.006 * (1.1 - heat * 0.35);
        const stabilityDamp = cauldron.stability * 0.045;

        const stepStrain = polarityStrain + shockStrain + thermalDrive * 0.38;
        const stepDamp = stabilityDamp + purifyDamp;
        const stepNet = stepStrain - stepDamp;

        cauldron.instability += stepNet;
        peakInstability = Math.max(peakInstability, cauldron.instability);

        phaseLog.push({
            phase: phaseIndex,
            polarityImbalance: round3(clash),
            introductionShock: round3(introductionShock),
            thermalDrive: round3(thermalDrive),
            stepStrain: round3(stepStrain),
            stepDamp: round3(stepDamp),
            instabilityAfter: round3(cauldron.instability)
        });
    });

    let impurity = cauldron.impurity;
    const purifyWork = cauldron.affinities.purify * heat * (heat < 0.55 ? 0.14 : 0.05);
    impurity = Math.max(0, impurity - purifyWork);

    const impurityNoise = 1 + (seededNoise(seed, 1) - 0.5) * 0.06;
    impurity *= impurityNoise;

    const impurityRatio = impurity / Math.max(1, cauldron.spirit);
    const spiritPotency = cauldron.spirit * Math.max(0.2, 1 - impurityRatio * 0.65);

    const totalAff = cauldron.affinities.qi + cauldron.affinities.heat
        + cauldron.affinities.marrow + cauldron.affinities.purify;
    const scale = totalAff > 0 ? spiritPotency / totalAff : 0;

    /** @type {Affinities} */
    const productEffects = {
        qi: round1(cauldron.affinities.qi * scale * 0.1),
        heat: round1(cauldron.affinities.heat * scale * 0.1),
        marrow: round1(cauldron.affinities.marrow * scale * 0.1),
        purify: round1(cauldron.affinities.purify * scale * 0.08),
        toxicity: round1(cauldron.affinities.toxicity * scale * 0.12 + Math.max(0, peakInstability) * 0.4)
    };

    const stabilityMargin = cauldron.stability * 0.08 + cauldron.affinities.purify * 0.05 - peakInstability;

    let outcome = OUTCOME.REFINED;
    if (peakInstability > 16) outcome = OUTCOME.RUPTURE;
    else if (peakInstability > 8.5) outcome = OUTCOME.FAILED;
    else if (peakInstability > 4.2) outcome = OUTCOME.UNSTABLE_SALVAGE;

    const success = outcome === OUTCOME.REFINED || outcome === OUTCOME.UNSTABLE_SALVAGE;

    if (outcome === OUTCOME.RUPTURE || outcome === OUTCOME.FAILED) {
        productEffects.qi *= 0.15;
        productEffects.heat *= 0.2;
        productEffects.marrow *= 0.15;
        productEffects.toxicity += 2 + peakInstability * 0.3;
    } else if (outcome === OUTCOME.UNSTABLE_SALVAGE) {
        const salvage = 0.55 + Math.max(0, stabilityMargin) * 0.04;
        productEffects.qi *= salvage;
        productEffects.heat *= salvage;
        productEffects.marrow *= salvage;
        productEffects.toxicity += 0.8;
    }

    const dominantAffinity = dominantKey(productEffects);
    const diagnostics = buildDiagnostics({
        peakInstability,
        stabilityMargin,
        impurityRatio,
        heat,
        order,
        phaseLog,
        cauldron
    });

    return {
        input: {
            reagents: input.reagents,
            heat: heatKey,
            introductionOrder: order,
            seed
        },
        mixture: {
            spirit: round1(cauldron.spirit),
            yin: round1(cauldron.yin),
            yang: round1(cauldron.yang),
            impurity: round1(impurity),
            impurityRatio: round3(impurityRatio),
            polarityImbalance: round3(polarityImbalance(cauldron.yin, cauldron.yang))
        },
        phaseLog,
        peakInstability: round3(peakInstability),
        stabilityMargin: round3(stabilityMargin),
        product: {
            effects: productEffects,
            dominantAffinity,
            potency: round1(Math.max(productEffects.qi, productEffects.heat, productEffects.marrow)),
            grade: gradeFromMargin(stabilityMargin, impurityRatio)
        },
        outcome,
        success,
        diagnostics,
        observations: diagnostics.playerObservations
    };
}

/**
 * @param {object} productEffects
 */
function dominantKey(productEffects) {
    const entries = Object.entries(productEffects).filter(([k]) => k !== 'toxicity');
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0]?.[0] || 'none';
}

function gradeFromMargin(margin, impurityRatio) {
    if (margin > 4 && impurityRatio < 0.15) return 'high';
    if (margin > 1 && impurityRatio < 0.35) return 'mid';
    return 'low';
}

function round1(n) {
    return Math.round(n * 10) / 10;
}

function round3(n) {
    return Math.round(n * 1000) / 1000;
}

/**
 * @param {object} ctx
 */
function buildDiagnostics(ctx) {
    const suggestions = [];
    if (ctx.peakInstability > 5) {
        if (ctx.cauldron.affinities.purify < 8) {
            suggestions.push('Add a purifying or stabilising reagent before catalysts.');
        }
        if (ctx.heat > 0.7) {
            suggestions.push('Reduce heat — thermal drive is amplifying volatility.');
        }
        if (polarityImbalance(ctx.cauldron.yin, ctx.cauldron.yang) > 0.35) {
            suggestions.push('Balance yin and yang introduction order or add neutral binder.');
        }
    }
    if (ctx.impurityRatio > 0.25) {
        suggestions.push('Use gentle heat so purifying affinities can strip impurities.');
    }

    const playerObservations = [];
    if (ctx.phaseLog.some(p => p.introductionShock > 0.25)) {
        playerObservations.push('Sharp polarity spike when later reagents entered the cauldron.');
    }
    if (ctx.phaseLog.some(p => p.thermalDrive > 8)) {
        playerObservations.push('Cauldron trembled from thermal pressure — volatility dominates.');
    }
    if (ctx.cauldron.affinities.purify > 10 && ctx.heat < 0.55) {
        playerObservations.push('Purifying notes cleared as the mixture simmered.');
    }
    if (ctx.peakInstability > 11) {
        playerObservations.push('Mixture lost coherence — structure collapsed before forming a pill.');
    } else if (ctx.peakInstability > 5.5) {
        playerObservations.push('Pill formed but cracks web the surface — unstable salvage.');
    }

    return {
        polarityImbalance: round3(polarityImbalance(ctx.cauldron.yin, ctx.cauldron.yang)),
        peakInstability: round3(ctx.peakInstability),
        stabilityMargin: round3(ctx.stabilityMargin),
        impurityRatio: round3(ctx.impurityRatio),
        suggestedAdjustments: suggestions,
        playerObservations
    };
}

/**
 * Two products are "similar useful effect" when the same affinity dominates and potency within band.
 * @param {ReturnType<typeof simulateRefinement>} a
 * @param {ReturnType<typeof simulateRefinement>} b
 * @param {string} affinity
 * @param {number} [potencyBand]
 */
function similarEffectProfile(a, b, affinity, potencyBand = 4) {
    if (!a.success || !b.success) return false;
    if (a.product.dominantAffinity !== affinity || b.product.dominantAffinity !== affinity) return false;
    return Math.abs(a.product.potency - b.product.potency) <= potencyBand;
}

module.exports = {
    HEAT_VALUES,
    OUTCOME,
    simulateRefinement,
    similarEffectProfile,
    loadFromReagent,
    polarityImbalance
};
