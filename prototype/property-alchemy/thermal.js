/**
 * Heat-dependent activation, extraction, and degradation (property-derived).
 */

const { EXPERIMENTAL_REAGENTS } = require('./reagents');

/**
 * @param {import('./reagents').ReagentDef} def
 */
function deriveThermalProfile(def) {
    const mineralWeight = def.impurity / 32 + def.spirit / 90;
    const delicate = (def.affinities.purify + def.affinities.qi * 0.6 + def.affinities.marrow * 0.3) / 35;
    const catalytic = def.volatility / 28;
    const structural = def.stability / 40;

    const activationThreshold = clamp(
        0.22 + mineralWeight * 0.42 - catalytic * 0.12 - delicate * 0.14 + structural * 0.04,
        0.18,
        0.88
    );
    const moderateHerb = structural > 0.3 && catalytic < 0.24 && mineralWeight < 0.28;
    const toleranceMax = clamp(
        0.5 + catalytic * 0.22 - delicate * 0.32 + structural * 0.08 + mineralWeight * 0.28
            + (moderateHerb ? 0.15 : 0),
        0.42,
        0.99
    );
    const extractionWidth = clamp(0.1 + structural * 0.005 + def.spirit / 500, 0.08, 0.22);
    const stressSensitivity = clamp(0.35 + delicate * 0.45 - structural * 0.25 + catalytic * 0.2, 0.2, 1.1);

    return {
        activationThreshold: round3(activationThreshold),
        toleranceMax: round3(toleranceMax),
        extractionWidth: round3(extractionWidth),
        stressSensitivity: round3(stressSensitivity)
    };
}

function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
}

function round3(n) {
    return Math.round(n * 1000) / 1000;
}

function smoothstep(edge0, edge1, x) {
    if (edge1 <= edge0) return x >= edge1 ? 1 : 0;
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
}

/**
 * @param {number} heat
 * @param {ReturnType<typeof deriveThermalProfile>} profile
 */
function thermalFractions(heat, profile) {
    const { activationThreshold, toleranceMax, extractionWidth: w } = profile;
    const activation = smoothstep(activationThreshold, activationThreshold + w, heat);
    const overheat = smoothstep(toleranceMax - w, toleranceMax + 0.04, heat);
    const remainBound = clamp(1 - activation, 0, 1);
    const releaseEfficiency = activation * (1 - overheat);
    const degradeFraction = activation * overheat;
    return {
        releaseEfficiency: clamp(releaseEfficiency, 0, 1),
        degradeFraction: clamp(degradeFraction, 0, 1),
        remainBound,
        grossRelease: clamp(activation, 0, 1)
    };
}

/** @returns {object} */
function emptyMaterialSlice() {
    return {
        spirit: 0,
        yin: 0,
        yang: 0,
        volatility: 0,
        stability: 0,
        impurity: 0,
        affinities: emptyAff()
    };
}

function emptyAff() {
    return { qi: 0, heat: 0, marrow: 0, purify: 0, toxicity: 0 };
}

function addAff(a, b) {
    return {
        qi: a.qi + b.qi,
        heat: a.heat + b.heat,
        marrow: a.marrow + b.marrow,
        purify: a.purify + b.purify,
        toxicity: a.toxicity + b.toxicity
    };
}

function scaleAff(aff, s) {
    return {
        qi: aff.qi * s,
        heat: aff.heat * s,
        marrow: aff.marrow * s,
        purify: aff.purify * s,
        toxicity: aff.toxicity * s
    };
}

/**
 * @param {object} slice
 * @param {number} scale
 */
function scaleMaterialSlice(slice, scale) {
    if (scale <= 0) return emptyMaterialSlice();
    return {
        spirit: slice.spirit * scale,
        yin: slice.yin * scale,
        yang: slice.yang * scale,
        volatility: slice.volatility * scale,
        stability: slice.stability * scale,
        impurity: slice.impurity * scale,
        affinities: scaleAff(slice.affinities, scale)
    };
}

function mergeSlice(into, part) {
    into.spirit += part.spirit;
    into.yin += part.yin;
    into.yang += part.yang;
    into.volatility += part.volatility;
    into.stability += part.stability;
    into.impurity += part.impurity;
    into.affinities = addAff(into.affinities, part.affinities);
}

/**
 * @param {ReturnType<typeof loadFromReagent>} load
 * @param {object} def
 */
function loadToMaterialSlice(load, def) {
    return {
        spirit: load.spirit,
        yin: load.yin,
        yang: load.yang,
        volatility: load.volatility,
        stability: load.stability,
        impurity: load.impurity,
        affinities: { ...load.affinities }
    };
}

/**
 * One thermal pass on a bound slice (mutates bound in place, returns released + degraded).
 * @param {object} boundSlice
 * @param {ReturnType<typeof deriveThermalProfile>} profile
 * @param {number} heat
 * @param {string} reagentId
 * @param {object[]|null} trace
 */
function applyThermalPass(boundSlice, profile, heat, reagentId, trace, emitTrace) {
    if (boundSlice.spirit <= 1e-9) {
        return { released: emptyMaterialSlice(), degraded: emptyMaterialSlice() };
    }

    const frac = thermalFractions(heat, profile);
    const totalBefore = boundSlice.spirit;

    const released = scaleMaterialSlice(boundSlice, frac.releaseEfficiency);
    const degraded = scaleMaterialSlice(boundSlice, frac.degradeFraction);
    degraded.affinities.qi *= 0.2;
    degraded.affinities.marrow *= 0.2;
    degraded.affinities.purify *= 0.15;
    degraded.affinities.toxicity += degraded.spirit * 0.08;

    const boundRemainder = scaleMaterialSlice(boundSlice, frac.remainBound);
    const accounted = scaleMaterialSlice(boundSlice, frac.releaseEfficiency + frac.degradeFraction + frac.remainBound);

    Object.assign(boundSlice, boundRemainder);

    if (trace && emitTrace && (frac.releaseEfficiency > 0.05 || frac.degradeFraction > 0.05)) {
        if (frac.releaseEfficiency > 0.05) {
            emitTrace(trace, 'thermal_activation', heat >= profile.activationThreshold
                ? `Heat reached activation for ${reagentId}; bound essence released into the reactive mixture.`
                : `Partial activation of ${reagentId} at this heat — much remains bound.`, {
                reagentId,
                heat: round3(heat),
                activationThreshold: profile.activationThreshold,
                releaseEfficiency: round3(frac.releaseEfficiency),
                spiritReleased: round3(released.spirit)
            });
        }
        if (frac.degradeFraction > 0.05) {
            emitTrace(trace, 'thermal_degradation', `Heat exceeded ${reagentId}'s tolerance; volatile medicinal components broke down.`, {
                reagentId,
                heat: round3(heat),
                toleranceMax: profile.toleranceMax,
                degradeFraction: round3(frac.degradeFraction),
                spiritDegraded: round3(degraded.spirit)
            });
        }
        if (boundSlice.spirit > totalBefore * 0.15 && frac.releaseEfficiency < 0.5) {
            emitTrace(trace, 'bound_remainder', `Substantial ${reagentId} properties remain unextracted at this heat.`, {
                reagentId,
                boundSpirit: round3(boundSlice.spirit)
            });
        }
    }

    return { released, degraded, accountedSpirit: accounted.spirit + degraded.spirit + released.spirit };
}

/**
 * @typedef {object} MaterialLedger
 * @property {object} released
 * @property {object} bound
 * @property {object} degraded
 * @property {object} residual
 * @property {number} inputSpirit
 */

function createMaterialLedger() {
    return {
        released: emptyMaterialSlice(),
        bound: emptyMaterialSlice(),
        degraded: emptyMaterialSlice(),
        residual: emptyMaterialSlice(),
        expelled: emptyMaterialSlice(),
        inputSpirit: 0,
        separationStuck: 0,
        separationStuckMin: 0,
        byReagent: {}
    };
}

/**
 * @param {MaterialLedger} ledger
 * @param {string} reagentId
 */
function ensureReagentBucket(ledger, reagentId) {
    if (!ledger.byReagent[reagentId]) {
        ledger.byReagent[reagentId] = {
            bound: emptyMaterialSlice(),
            released: emptyMaterialSlice(),
            degraded: emptyMaterialSlice(),
            inputSpirit: 0,
            overheatExposure: 0,
            separationDifficulty: 1,
            separationStuckFraction: 0.1
        };
    }
    return ledger.byReagent[reagentId];
}

/**
 * @param {MaterialLedger} ledger
 * @param {ReturnType<typeof loadFromReagent>} load
 */
function registerInputLoad(ledger, load) {
    ledger.inputSpirit += load.spirit;
    const bucket = ensureReagentBucket(ledger, load.reagentId);
    bucket.inputSpirit += load.spirit;
    const slice = loadToMaterialSlice(load, EXPERIMENTAL_REAGENTS[load.reagentId]);
    mergeSlice(bucket.bound, slice);
}

/**
 * @param {MaterialLedger} ledger
 * @param {string} reagentId
 * @param {object} released
 * @param {object} degraded
 */
function recordThermalResult(ledger, reagentId, released, degraded) {
    const bucket = ensureReagentBucket(ledger, reagentId);
    mergeSlice(bucket.released, released);
    mergeSlice(ledger.released, released);
    mergeSlice(bucket.degraded, degraded);
    mergeSlice(ledger.degraded, degraded);
}

/**
 * @param {MaterialLedger} ledger
 */
function finalizeMaterialLedger(ledger) {
    ledger.bound = emptyMaterialSlice();
    ledger.degraded = emptyMaterialSlice();
    Object.values(ledger.byReagent).forEach(bucket => {
        mergeSlice(ledger.bound, bucket.bound);
        mergeSlice(ledger.degraded, bucket.degraded);
    });
    mergeSlice(ledger.residual, ledger.bound);
    mergeSlice(ledger.residual, ledger.degraded);
    const accounted = ledger.released.spirit + ledger.bound.spirit + ledger.degraded.spirit;
    return {
        inputSpirit: round3(ledger.inputSpirit),
        accountedSpirit: round3(accounted),
        conservationDelta: round3(ledger.inputSpirit - accounted)
    };
}

module.exports = {
    deriveThermalProfile,
    thermalFractions,
    createMaterialLedger,
    registerInputLoad,
    applyThermalPass,
    recordThermalResult,
    finalizeMaterialLedger,
    emptyMaterialSlice,
    mergeSlice,
    scaleMaterialSlice,
    loadToMaterialSlice,
    ensureReagentBucket
};
