/**
 * Property-based alchemy refinement — deterministic reaction model (prototype).
 * Thermal activation / extraction (PR #192) layered on instability chemistry.
 */

const { EXPERIMENTAL_REAGENTS } = require('./reagents');
const {
    deriveThermalProfile,
    createMaterialLedger,
    registerInputLoad,
    applyThermalPass,
    recordThermalResult,
    finalizeMaterialLedger,
    mergeSlice
} = require('./thermal');

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

function addAffinities(a, b) {
    return {
        qi: a.qi + b.qi,
        heat: a.heat + b.heat,
        marrow: a.marrow + b.marrow,
        purify: a.purify + b.purify,
        toxicity: a.toxicity + b.toxicity
    };
}

function emptyAffinities() {
    return { qi: 0, heat: 0, marrow: 0, purify: 0, toxicity: 0 };
}

function scaleAffinities(aff, scale) {
    return {
        qi: aff.qi * scale,
        heat: aff.heat * scale,
        marrow: aff.marrow * scale,
        purify: aff.purify * scale,
        toxicity: aff.toxicity * scale
    };
}

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
 * @param {object} input
 * @param {number} phaseIndex
 */
function resolveHeatStageValues(input, phaseIndex) {
    if (input.heatStages?.length) {
        return input.heatStages.map(key => HEAT_VALUES[key] ?? HEAT_VALUES.medium);
    }
    const key = input.heat || 'medium';
    return [HEAT_VALUES[key] ?? HEAT_VALUES.medium];
}

function sliceToReactiveCauldron(slice) {
    return {
        spirit: slice.spirit,
        yin: slice.yin,
        yang: slice.yang,
        volatility: slice.volatility,
        stability: slice.stability,
        impurity: slice.impurity,
        affinities: { ...slice.affinities },
        totalUnits: 0,
        instability: 0
    };
}

function polarityImbalance(yin, yang) {
    const total = yin + yang;
    if (total <= 0) return 0;
    return Math.abs(yin - yang) / total;
}

function seededNoise(seed, salt) {
    const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
}

/**
 * @typedef {object} RefinementInput
 * @property {{ reagentId: string, qty: number }[]} reagents
 * @property {HeatProfile} heat
 * @property {HeatProfile[]} [heatStages] — sequential thermal passes (per phase)
 * @property {IntroductionOrder} [introductionOrder]
 * @property {number} [seed]
 * @property {boolean} [trace]
 */

function emitTrace(trace, kind, message, data) {
    if (!trace) return;
    trace.push({ kind, message, ...(data ? { data } : {}) });
}

function stripTraceFromResult(result) {
    if (!result || !result.trace) return result;
    const { trace, ...rest } = result;
    return rest;
}

function simulateRefinement(input) {
    const order = input.introductionOrder || 'simultaneous';
    const seed = input.seed ?? 0;
    const trace = input.trace ? [] : null;
    const heatKey = input.heat || 'medium';

    const loads = (input.reagents || []).map(r => loadFromReagent(r.reagentId, r.qty));
    if (!loads.length) throw new Error('At least one reagent required');

    emitTrace(trace, 'refinement_start', 'Refinement started (thermal extraction + reactive chemistry).', {
        heat: heatKey,
        heatStages: input.heatStages || null,
        introductionOrder: order,
        seed,
        reagentCount: loads.length
    });

    const phases = partitionByIntroduction(loads, order);
    emitTrace(trace, 'phases_partitioned', phases.length === 1
        ? 'All reagents introduced in one phase (simultaneous or single-pole mix).'
        : `Split into ${phases.length} introduction phases (${order}).`, {
        phaseCount: phases.length,
        order
    });

    const material = createMaterialLedger();
    loads.forEach(load => registerInputLoad(material, load));

    const phaseLog = [];
    let peakInstability = 0;
    let runningInstability = 0;
    let lastHeat = HEAT_VALUES[heatKey] ?? HEAT_VALUES.medium;

    phases.forEach((phaseLoads, phaseIndex) => {
        emitTrace(trace, 'phase_begin', `Phase ${phaseIndex} — adding ${phaseLoads.length} reagent load(s).`, {
            phase: phaseIndex
        });

        phaseLoads.forEach(load => {
            emitTrace(trace, 'reagent_introduced', `Added ${load.qty}× ${load.reagentId} (properties initially bound).`, {
                reagentId: load.reagentId,
                qty: load.qty,
                spirit: round1(load.spirit)
            });
        });

        const stageHeats = resolveHeatStageValues(input, phaseIndex);
        stageHeats.forEach((heat, stageIdx) => {
            lastHeat = heat;
            emitTrace(trace, 'heat_stage', `Thermal pass at heat ${round3(heat)}.`, {
                phase: phaseIndex,
                stage: stageIdx,
                heat: round3(heat)
            });

            phaseLoads.forEach(load => {
                const def = EXPERIMENTAL_REAGENTS[load.reagentId];
                const profile = deriveThermalProfile(def);
                const bucket = material.byReagent[load.reagentId];
                const { released, degraded } = applyThermalPass(
                    bucket.bound,
                    profile,
                    heat,
                    load.reagentId,
                    trace,
                    emitTrace
                );
                recordThermalResult(material, load.reagentId, released, degraded);
            });
        });

        const reactive = sliceToReactiveCauldron(material.released);
        reactive.totalUnits = loads.reduce((s, l) => s + l.qty, 0);

        const phaseVolatility = phaseLoads.reduce((s, l) => s + l.volatility, 0);
        const phaseSpirit = phaseLoads.reduce((s, l) => s + l.spirit, 0);
        const phaseYin = phaseLoads.reduce((s, l) => s + l.yin, 0);
        const phaseYang = phaseLoads.reduce((s, l) => s + l.yang, 0);

        const beforeYin = reactive.yin - phaseYin * 0.35;
        const beforeYang = reactive.yang - phaseYang * 0.35;
        const clash = polarityImbalance(reactive.yin, reactive.yang);
        const newCharge = polarityImbalance(phaseYin, phaseYang);
        const introductionShock = phaseIndex > 0 ? newCharge * 0.55 : 0;
        const heat = lastHeat;

        const thermalDrive = (phaseVolatility / Math.max(1, phaseLoads.length)) * heat * heat;
        const polarityStrain = clash * (reactive.spirit * 0.004 + 1) * heat;
        const shockStrain = introductionShock * heat * (reactive.spirit * 0.006 + 1);
        const purifyDamp = reactive.affinities.purify * 0.006 * (1.1 - heat * 0.35);
        const stabilityDamp = reactive.stability * 0.045;

        const stepStrain = polarityStrain + shockStrain + thermalDrive * 0.38;
        const stepDamp = stabilityDamp + purifyDamp;
        const stepNet = stepStrain - stepDamp;

        runningInstability += stepNet;
        peakInstability = Math.max(peakInstability, runningInstability);
        const instabilityAfter = runningInstability;

        if (stepNet > 0.5) {
            emitTrace(trace, 'destabilisation', 'Reactive essence strained the mixture.', {
                stepStrain: round3(stepStrain),
                stepDamp: round3(stepDamp),
                thermalDrive: round3(thermalDrive)
            });
        }
        if (introductionShock > 0.1) {
            emitTrace(trace, 'introduction_shock', 'Later-phase reagents clashed with cauldron polarity.', {
                introductionShock: round3(introductionShock)
            });
        }

        emitTrace(trace, 'instability_update', 'Peak instability updated from reactive mixture.', {
            peakInstability: round3(peakInstability),
            instabilityAfter: round3(instabilityAfter)
        });

        phaseLog.push({
            phase: phaseIndex,
            polarityImbalance: round3(clash),
            introductionShock: round3(introductionShock),
            thermalDrive: round3(thermalDrive),
            stepStrain: round3(stepStrain),
            stepDamp: round3(stepDamp),
            instabilityAfter: round3(instabilityAfter)
        });
    });

    const conservation = finalizeMaterialLedger(material);
    emitTrace(trace, 'material_conservation', 'Material ledger closed — spirit accounted across released, bound, degraded.', {
        ...conservation
    });

    let impurity = material.released.impurity;
    const impurityBeforeScrub = impurity;
    const purifyWork = material.released.affinities.purify * lastHeat * (lastHeat < 0.55 ? 0.14 : 0.05);
    impurity = Math.max(0, impurity - purifyWork);
    if (purifyWork > 0) {
        emitTrace(trace, 'purify_scrub', lastHeat < 0.55
            ? 'Gentle condensation let purifying affinity strip impurities from released essence.'
            : 'Purifying affinity removed some impurities (reduced efficiency at this heat).', {
            removed: round3(impurityBeforeScrub - impurity)
        });
    }

    const impurityNoise = 1 + (seededNoise(seed, 1) - 0.5) * 0.06;
    impurity *= impurityNoise;

    const releasedSpirit = Math.max(0.001, material.released.spirit);
    const impurityRatio = impurity / releasedSpirit;
    const spiritPotency = releasedSpirit * Math.max(0.2, 1 - impurityRatio * 0.65);

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

    emitTrace(trace, 'outcome_threshold', 'Process outcome from peak instability on reactive essence.', {
        peakInstability: round3(peakInstability),
        processOutcome,
        thresholds: { unstable: 4.2, failed: 8.5, rupture: 16 }
    });

    const condenseFactor = processOutcome === OUTCOME.REFINED ? 1
        : processOutcome === OUTCOME.UNSTABLE_SALVAGE ? 0.55 + Math.max(0, stabilityMargin) * 0.04
            : 0.15;

    if (processOutcome === OUTCOME.RUPTURE || processOutcome === OUTCOME.FAILED) {
        productEffects.qi *= 0.15;
        productEffects.heat *= 0.2;
        productEffects.marrow *= 0.15;
        productEffects.toxicity += 2 + peakInstability * 0.3;
        emitTrace(trace, 'condensation_failed', 'Pill condensation failed; released essence largely lost from final dose.', {
            toxicity: round1(productEffects.toxicity)
        });
    } else if (processOutcome === OUTCOME.UNSTABLE_SALVAGE) {
        productEffects.qi *= condenseFactor;
        productEffects.heat *= condenseFactor;
        productEffects.marrow *= condenseFactor;
        productEffects.toxicity += 0.8;
        emitTrace(trace, 'unstable_salvage', 'Cracked pill — partial condensed dose from released essence.', {
            condenseFactor: round3(condenseFactor)
        });
    }

    emitTrace(trace, 'product_finalized', 'Condensed product computed from released (not bound) essence.', {
        dominantAffinity: dominantKey(productEffects),
        effects: productEffects,
        impurityRatio: round3(impurityRatio)
    });

    const dominantAffinity = dominantKey(productEffects);
    const potency = Math.max(productEffects.qi, productEffects.heat, productEffects.marrow);
    const productSuitability = impurityRatio > 0.45 ? 'impure'
        : productEffects.toxicity > 4 ? 'hazardous'
            : potency >= 2 ? 'medicinal' : 'weak';

    const diagnostics = buildDiagnostics({
        peakInstability,
        stabilityMargin,
        impurityRatio,
        heat: lastHeat,
        order,
        phaseLog,
        cauldron: material.released
    });

    const materialOutcome = {
        released: summarizeSlice(material.released),
        bound: summarizeSlice(material.bound),
        degraded: summarizeSlice(material.degraded),
        residual: summarizeSlice(material.residual),
        conservation
    };

    const result = {
        input: {
            reagents: input.reagents,
            heat: heatKey,
            heatStages: input.heatStages || null,
            introductionOrder: order,
            seed
        },
        process: {
            outcome: processOutcome,
            peakInstability: round3(peakInstability),
            stabilityMargin: round3(stabilityMargin),
            success: processOutcome === OUTCOME.REFINED || processOutcome === OUTCOME.UNSTABLE_SALVAGE
        },
        material: materialOutcome,
        mixture: {
            spirit: round1(releasedSpirit),
            yin: round1(material.released.yin),
            yang: round1(material.released.yang),
            impurity: round1(impurity),
            impurityRatio: round3(impurityRatio),
            polarityImbalance: round3(polarityImbalance(material.released.yin, material.released.yang))
        },
        phaseLog,
        peakInstability: round3(peakInstability),
        stabilityMargin: round3(stabilityMargin),
        product: {
            effects: productEffects,
            dominantAffinity,
            potency: round1(potency),
            grade: gradeFromMargin(stabilityMargin, impurityRatio),
            suitability: productSuitability
        },
        outcome: processOutcome,
        success: processOutcome === OUTCOME.REFINED || processOutcome === OUTCOME.UNSTABLE_SALVAGE,
        diagnostics,
        observations: diagnostics.playerObservations
    };
    if (trace) result.trace = trace;
    return result;
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
    polarityImbalance,
    stripTraceFromResult,
    emitTrace,
    resolveHeatStageValues
};
