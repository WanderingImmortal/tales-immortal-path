/**
 * Shared condensation: material ledger → process outcome + product.
 * Used by interactive furnace; mirrors simulateRefinement finale.
 */

const { OUTCOME, polarityImbalance } = require('./simulate');
const { mixturePurityFromReleased } = require('./separation');

function seededNoise(seed, salt) {
    const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
}

function round1(n) {
    return Math.round(n * 10) / 10;
}

function round3(n) {
    return Math.round(n * 1000) / 1000;
}

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

function summarizeSlice(slice) {
    return {
        spirit: round1(slice.spirit),
        impurity: round1(slice.impurity),
        affinities: {
            qi: round1(slice.affinities.qi),
            heat: round1(slice.affinities.heat),
            marrow: round1(slice.affinities.marrow),
            purify: round1(slice.affinities.purify),
            toxicity: round1(slice.affinities.toxicity)
        }
    };
}

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
            suggestions.push('Balance yin and yang in the mixture or add neutral binder.');
        }
    }
    if (ctx.impurityRatio > 0.25) {
        suggestions.push('Use gentle heat so purifying affinities can strip impurities.');
    }

    const playerObservations = [];
    if (ctx.introductionShocks?.some(s => s > 0.25)) {
        playerObservations.push('Sharp polarity spike when later reagents entered the cauldron.');
    }
    if (ctx.thermalPeaks?.some(t => t > 8)) {
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
 * @param {object} material — finalized ledger slices (released, bound, degraded, residual, conservation)
 * @param {object} opts
 */
function condenseMaterialLedger(material, opts = {}) {
    const {
        peakInstability,
        lastHeat = 0.65,
        seed = 0,
        procedure = null,
        trace = null
    } = opts;

    let impurity = material.released.impurity;
    const impurityBeforeScrub = impurity;
    const purifyWork = material.released.affinities.purify * lastHeat * (lastHeat < 0.55 ? 0.14 : 0.05);
    impurity = Math.max(0, impurity - purifyWork);

    const impurityNoise = 1 + (seededNoise(seed, 1) - 0.5) * 0.06;
    impurity *= impurityNoise;

    const releasedSpirit = material.released.spirit;
    const effectiveSpirit = Math.max(0.001, releasedSpirit);
    const impurityRatio = impurity / effectiveSpirit;
    const mixturePurity = releasedSpirit <= 0.05
        ? 0
        : mixturePurityFromReleased({ spirit: releasedSpirit, impurity });
    const spiritPotency = effectiveSpirit * Math.max(0.2, 1 - impurityRatio * 0.65);

    const aff = material.released.affinities;
    const totalAff = aff.qi + aff.heat + aff.marrow + aff.purify;
    const scale = totalAff > 0 ? spiritPotency / totalAff : 0;

    const productEffects = {
        qi: round1(aff.qi * scale * 0.1),
        heat: round1(aff.heat * scale * 0.1),
        marrow: round1(aff.marrow * scale * 0.1),
        purify: round1(aff.purify * scale * 0.08),
        toxicity: round1(aff.toxicity * scale * 0.12 + Math.max(0, peakInstability) * 0.4)
    };

    const stabilityMargin = material.released.stability * 0.08 + aff.purify * 0.05 - peakInstability;

    let processOutcome = OUTCOME.REFINED;
    if (peakInstability > 16) processOutcome = OUTCOME.RUPTURE;
    else if (peakInstability > 8.5) processOutcome = OUTCOME.FAILED;
    else if (peakInstability > 4.2) processOutcome = OUTCOME.UNSTABLE_SALVAGE;

    const condenseFactor = processOutcome === OUTCOME.REFINED ? 1
        : processOutcome === OUTCOME.UNSTABLE_SALVAGE ? 0.55 + Math.max(0, stabilityMargin) * 0.04
            : 0.15;

    if (processOutcome === OUTCOME.RUPTURE || processOutcome === OUTCOME.FAILED) {
        productEffects.qi *= 0.15;
        productEffects.heat *= 0.2;
        productEffects.marrow *= 0.15;
        productEffects.toxicity += 2 + peakInstability * 0.3;
    } else if (processOutcome === OUTCOME.UNSTABLE_SALVAGE) {
        productEffects.qi *= condenseFactor;
        productEffects.heat *= condenseFactor;
        productEffects.marrow *= condenseFactor;
        productEffects.toxicity += 0.8;
    }

    const dominantAffinity = dominantKey(productEffects);
    const potency = Math.max(productEffects.qi, productEffects.heat, productEffects.marrow);
    const productSuitability = mixturePurity < 0.52 || impurityRatio > 0.45 ? 'impure'
        : productEffects.toxicity > 4 ? 'hazardous'
            : potency >= 2 ? 'medicinal' : 'weak';

    const diagnostics = buildDiagnostics({
        peakInstability,
        stabilityMargin,
        impurityRatio,
        heat: lastHeat,
        introductionShocks: opts.introductionShocks || [],
        thermalPeaks: opts.thermalPeaks || [],
        cauldron: material.released
    });

    const expelled = material.expelled || { spirit: 0, impurity: 0, affinities: {}, yin: 0, yang: 0, volatility: 0, stability: 0 };

    const materialOutcome = {
        released: summarizeSlice(material.released),
        bound: summarizeSlice(material.bound),
        degraded: summarizeSlice(material.degraded),
        residual: summarizeSlice(material.residual),
        expelled: {
            spirit: round1(expelled.spirit),
            contamination: round1(expelled.impurity),
            impurity: round1(expelled.impurity)
        },
        conservation: material.conservation
    };

    return {
        process: {
            outcome: processOutcome,
            peakInstability: round3(peakInstability),
            stabilityMargin: round3(stabilityMargin),
            success: processOutcome === OUTCOME.REFINED || processOutcome === OUTCOME.UNSTABLE_SALVAGE
        },
        material: materialOutcome,
        mixture: {
            spirit: round1(releasedSpirit > 0.05 ? releasedSpirit : effectiveSpirit),
            yin: round1(material.released.yin),
            yang: round1(material.released.yang),
            impurity: round1(impurity),
            contamination: round1(impurity),
            impurityRatio: round3(impurityRatio),
            purity: round3(mixturePurity),
            purityPercent: round1(mixturePurity * 100),
            polarityImbalance: round3(polarityImbalance(material.released.yin, material.released.yang))
        },
        peakInstability: round3(peakInstability),
        stabilityMargin: round3(stabilityMargin),
        product: {
            effects: productEffects,
            dominantAffinity,
            potency: round1(potency),
            purity: round1(mixturePurity * 100),
            grade: gradeFromMargin(stabilityMargin, impurityRatio),
            suitability: productSuitability
        },
        outcome: processOutcome,
        success: processOutcome === OUTCOME.REFINED || processOutcome === OUTCOME.UNSTABLE_SALVAGE,
        diagnostics,
        observations: diagnostics.playerObservations,
        procedure: procedure || undefined,
        trace: trace || undefined,
        purifyScrub: purifyWork > 0 ? round3(impurityBeforeScrub - impurity) : 0
    };
}

module.exports = {
    condenseMaterialLedger,
    summarizeSlice,
    buildDiagnostics
};
