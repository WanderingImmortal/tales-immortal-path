/**
 * Interactive furnace — time-based refinement (deterministic sim clock).
 *
 * Time model (documented assumptions):
 * - Fixed sim timestep SIM_DT; playback speed only batches ticks (outcomes unchanged).
 * - Bound extraction uses thermalFractions() split each tick, scaled by duration (not full stages per tick).
 * - overheatExposure accrues above tolerance and biases bound→degraded (decays on gentle).
 * - Sub-threshold gentle heat uses a stubborn-material rate penalty so minerals extract slowly.
 * - Released essence can degrade under sustained medium/fierce heat (quadratic above ~0.5).
 * - Contamination (released.impurity) is mixture residue; separation.js expels it passively (degraded ≠ contamination).
 * - Instability integrates continuously from polarity, volatility, and heat.
 */

const { EXPERIMENTAL_REAGENTS } = require('./reagents');
const { HEAT_VALUES, loadFromReagent, polarityImbalance } = require('./simulate');
const {
    deriveThermalProfile,
    createMaterialLedger,
    registerInputLoad,
    recordThermalResult,
    finalizeMaterialLedger,
    mergeSlice,
    scaleMaterialSlice,
    emptyMaterialSlice,
    thermalFractions
} = require('./thermal');
const { condenseMaterialLedger } = require('./condense');
const {
    deriveSeparationProfile,
    applyExtractionContamination,
    applyPassiveSeparation,
    registerSeparationLoad,
    mixturePurityFromReleased,
    mixtureStuckFloor
} = require('./separation');

/** Base sim seconds per chemistry tick */
const SIM_DT = 0.1;

/** Bound → released/degraded kinetic scale (per sim second at full activation drive) */
const K_BOUND_TRANSFER = 0.36;

/** Released pool overheat degradation scale */
const K_RELEASED_DEGRADE = 0.28;

/** Reactive instability integration */
const K_INSTABILITY = 0.2;

function round1(n) {
    return Math.round(n * 10) / 10;
}

function round3(n) {
    return Math.round(n * 1000) / 1000;
}

function formatSimTime(t) {
    const m = Math.floor(t / 60);
    const s = t - m * 60;
    return `${String(m).padStart(2, '0')}:${s.toFixed(1).padStart(4, '0')}`;
}

function cloneLedgerTotals(material) {
    return {
        released: material.released.spirit,
        bound: Object.values(material.byReagent).reduce((s, b) => s + b.bound.spirit, 0),
        degraded: material.degraded.spirit,
        contamination: material.released.impurity,
        expelled: material.expelled?.impurity || 0,
        purity: round3(mixturePurityFromReleased(material.released) * 100)
    };
}

/**
 * Incremental bound thermal step — parallel release/degrade with sustained-overheat bias.
 * exposure accumulates above tolerance; gentle heat lets it decay (no hard safe window).
 */
function applyBoundIncremental(boundSlice, profile, heat, dt, bucket, def) {
    if (boundSlice.spirit <= 1e-12) {
        return { released: emptyMaterialSlice(), degraded: emptyMaterialSlice() };
    }
    const w = profile.extractionWidth;
    const overBand = Math.max(0, (heat - (profile.toleranceMax - w)) / Math.max(w, 0.05));
    if (overBand > 0.05) {
        bucket.overheatExposure += dt * overBand * profile.stressSensitivity;
    } else {
        bucket.overheatExposure = Math.max(0, bucket.overheatExposure - dt * 0.22);
    }

    const frac = thermalFractions(heat, profile);
    const stressBias = 1 + Math.min(2.2, bucket.overheatExposure * 0.55);
    let relW = frac.releaseEfficiency;
    let degW = frac.degradeFraction * stressBias;
    const norm = Math.max(relW + degW, 1e-9);
    relW /= norm;
    degW /= norm;

    const inputSpirit = Math.max(bucket.inputSpirit, boundSlice.spirit);
    const stubborn = heat < profile.activationThreshold + w * 0.55;
    const remainRatio = boundSlice.spirit / inputSpirit;
    const thresholdPenalty = stubborn
        ? Math.pow(Math.max(remainRatio, 0.05), 2.2)
        : 1;

    const drive = frac.grossRelease * (0.18 + 0.82 * heat) * K_BOUND_TRANSFER * dt * thresholdPenalty;
    const transfer = boundSlice.spirit * Math.min(0.75, drive);
    if (transfer <= 1e-12) {
        return { released: emptyMaterialSlice(), degraded: emptyMaterialSlice() };
    }

    const released = scaleMaterialSlice(boundSlice, (transfer / boundSlice.spirit) * relW);
    const degraded = scaleMaterialSlice(boundSlice, (transfer / boundSlice.spirit) * degW);
    const sep = deriveSeparationProfile(def);
    applyExtractionContamination(released, released.spirit, overBand, sep, profile);
    degraded.affinities.qi *= 0.2;
    degraded.affinities.marrow *= 0.2;
    degraded.affinities.purify *= 0.15;
    degraded.affinities.toxicity += degraded.spirit * 0.08;

    const remainScale = Math.max(0, 1 - transfer / boundSlice.spirit);
    Object.assign(boundSlice, scaleMaterialSlice(boundSlice, remainScale));

    return { released, degraded };
}

/**
 * Degrade already-released essence under heat (volatility-weighted).
 */
/** Released-pool degradation must land in per-reagent buckets for finalizeMaterialLedger. */
function distributeReleasedDegraded(material, relDegraded) {
    const totalReleased = Object.values(material.byReagent)
        .reduce((s, b) => s + b.released.spirit, 0);
    if (totalReleased <= 1e-9) {
        mergeSlice(material.degraded, relDegraded);
        return;
    }
    Object.values(material.byReagent).forEach(bucket => {
        const share = bucket.released.spirit / totalReleased;
        if (share <= 1e-12) return;
        const part = scaleMaterialSlice(relDegraded, share);
        mergeSlice(bucket.degraded, part);
        mergeSlice(material.degraded, part);
    });
}

function applyReleasedIncremental(released, heat, dt) {
    if (released.spirit <= 1e-12 || heat < 0.52) return null;
    const vol = released.volatility / Math.max(released.spirit, 0.01);
    const stab = released.stability / Math.max(released.spirit, 0.01);
    const over = Math.min(1, Math.max(0, (heat - 0.5) / 0.42));
    const rate = K_RELEASED_DEGRADE * over * over * (0.3 + vol * 0.045) * dt / (1 + stab * 0.1);
    const amount = released.spirit * Math.min(0.4, rate);
    if (amount <= 1e-12) return null;

    const degraded = scaleMaterialSlice(released, amount / released.spirit);
    degraded.affinities.qi *= 0.15;
    degraded.affinities.toxicity += amount * 0.06;

    const remain = Math.max(0, 1 - amount / released.spirit);
    Object.assign(released, scaleMaterialSlice(released, remain));
    return degraded;
}

function integrateInstability(material, heat, dt, running) {
    const rel = material.released;
    if (rel.spirit <= 1e-9 && heat <= 0) return { delta: 0, thermalDrive: 0 };

    const clash = polarityImbalance(rel.yin, rel.yang);
    const thermalDrive = (rel.volatility / Math.max(rel.spirit, 0.01)) * rel.spirit * 0.08 * heat * heat;
    const polarityStrain = clash * (rel.spirit * 0.004 + 1) * heat;
    const purifyDamp = rel.affinities.purify * 0.006 * (1.1 - heat * 0.35);
    const stabilityDamp = rel.stability * 0.045;
    const stepNet = (polarityStrain + thermalDrive * 0.38 - purifyDamp - stabilityDamp) * K_INSTABILITY * dt;

    running.value += stepNet;
    if (running.value > running.peak) running.peak = running.value;
    return { delta: stepNet, thermalDrive };
}

function pushChronicle(state, kind, message, data) {
    const entry = {
        time: round3(state.time),
        timeLabel: formatSimTime(state.time),
        kind,
        message,
        ...(data ? { data } : {})
    };
    state.chronicle.push(entry);
    if (state.significantKinds.has(kind)) {
        state.procedure.actions.push({ time: state.time, kind, ...data });
    }
}

/**
 * @returns {import('./furnace').FurnaceState}
 */
function createFurnaceState(opts = {}) {
    const heatKey = opts.heat || 'medium';
    return {
        time: 0,
        seed: opts.seed ?? 0,
        running: false,
        paused: false,
        condensed: false,
        heatKey,
        heatValue: HEAT_VALUES[heatKey] ?? HEAT_VALUES.medium,
        material: createMaterialLedger(),
        introduced: [],
        runningInstability: 0,
        peakInstability: 0,
        introductionShocks: [],
        thermalPeaks: [],
        chronicle: [],
        procedure: {
            version: 1,
            seed: opts.seed ?? 0,
            simDt: SIM_DT,
            actions: []
        },
        significantKinds: new Set([
            'furnace_start', 'furnace_pause', 'furnace_resume', 'heat_set',
            'introduce', 'condense', 'reset'
        ]),
        result: null,
        liveNotes: []
    };
}

function snapshotFurnace(state) {
    return {
        time: round3(state.time),
        running: state.running,
        paused: state.paused,
        condensed: state.condensed,
        heat: state.heatKey,
        peakInstability: round3(state.peakInstability),
        instability: round3(state.runningInstability),
        polarityImbalance: round3(polarityImbalance(
            state.material.released.yin,
            state.material.released.yang
        )),
        inFurnace: state.introduced.map(r => ({ ...r })),
        spirit: cloneLedgerTotals(state.material)
    };
}

function startFurnace(state) {
    if (state.condensed) return state;
    state.running = true;
    state.paused = false;
    pushChronicle(state, 'furnace_start', 'Furnace ignited — refinement began.', { heat: state.heatKey });
    return state;
}

function pauseFurnace(state) {
    if (!state.running || state.condensed) return state;
    state.paused = true;
    pushChronicle(state, 'furnace_pause', 'Furnace paused.', null);
    return state;
}

function resumeFurnace(state) {
    if (state.condensed) return state;
    state.paused = false;
    if (!state.running) state.running = true;
    pushChronicle(state, 'furnace_resume', 'Furnace resumed.', null);
    return state;
}

function setFurnaceHeat(state, heatKey) {
    if (state.condensed) return state;
    const prev = state.heatKey;
    state.heatKey = heatKey;
    state.heatValue = HEAT_VALUES[heatKey] ?? HEAT_VALUES.medium;
    if (prev !== heatKey) {
        pushChronicle(
            state,
            'heat_set',
            `Flame set to ${heatKey} heat.`,
            { heat: heatKey, heatValue: state.heatValue }
        );
    }
    return state;
}

function introduceToFurnace(state, reagentId, qty) {
    if (state.condensed) throw new Error('Furnace already condensed.');
    if (qty <= 0) throw new Error('Quantity must be positive.');
    const load = loadFromReagent(reagentId, qty);
    const hadReleased = state.material.released.spirit > 0.05;

    registerInputLoad(state.material, load);
    registerSeparationLoad(state.material, load);

    let shock = 0;
    if (hadReleased && state.introduced.length > 0) {
        const newCharge = polarityImbalance(load.yin, load.yang);
        shock = newCharge * 0.55 * state.heatValue * (state.material.released.spirit * 0.006 + 1);
        state.runningInstability += shock;
        state.peakInstability = Math.max(state.peakInstability, state.runningInstability);
        state.introductionShocks.push(shock);
    }

    state.introduced.push({ reagentId, qty, introducedAt: round3(state.time) });

    const name = EXPERIMENTAL_REAGENTS[reagentId]?.name || reagentId;
    pushChronicle(
        state,
        'introduce',
        `${qty}× ${name} introduced to the furnace.`,
        { reagentId, qty, introductionShock: round3(shock) }
    );
    if (shock > 0.15) {
        state.liveNotes.push('Polarity stirred as new material entered the hot mixture.');
    }
    return state;
}

function stepFurnace(state, dt = SIM_DT) {
    if (!state.running || state.paused || state.condensed) return state;
    if (dt <= 0) return state;

    const heat = state.heatValue;
    let notableExtract = false;
    let notableDegrade = false;

    Object.entries(state.material.byReagent).forEach(([reagentId, bucket]) => {
        if (bucket.bound.spirit <= 1e-12) return;
        const def = EXPERIMENTAL_REAGENTS[reagentId];
        const profile = deriveThermalProfile(def);
        const { released, degraded } = applyBoundIncremental(
            bucket.bound, profile, heat, dt, bucket, def
        );
        if (released.spirit > 1e-9 || degraded.spirit > 1e-9) {
            recordThermalResult(state.material, reagentId, released, degraded);
            if (released.spirit > 0.02) notableExtract = true;
            if (degraded.spirit > 0.02) notableDegrade = true;
        }
    });

    applyPassiveSeparation(state.material, heat, dt);

    const relDegraded = applyReleasedIncremental(state.material.released, heat, dt);
    if (relDegraded) {
        distributeReleasedDegraded(state.material, relDegraded);
        notableDegrade = true;
    }

    const instRun = { value: state.runningInstability, peak: state.peakInstability };
    const inst = integrateInstability(state.material, heat, dt, instRun);
    state.runningInstability = instRun.value;
    state.peakInstability = instRun.peak;
    if (inst.thermalDrive > 8) state.thermalPeaks.push(inst.thermalDrive);

    state.time += dt;

    if (notableExtract && Math.floor(state.time * 2) !== Math.floor((state.time - dt) * 2)) {
        state.liveNotes.push(heat < 0.5 ? 'Essence slowly seeps from bound material.' : 'Heat drives spirit from the matrix.');
    }
    if (notableDegrade && heat > 0.7) {
        state.liveNotes.push('Volatile components char under sustained fierce heat.');
    }
    if (state.peakInstability > 6 && state.liveNotes.length < 8) {
        state.liveNotes.push('The mixture wavers — instability is building.');
    }

    return state;
}

function advanceFurnace(state, totalDt) {
    if (totalDt <= 0) return state;
    const steps = Math.round(totalDt / SIM_DT);
    for (let i = 0; i < steps; i++) stepFurnace(state, SIM_DT);
    const remainder = totalDt - steps * SIM_DT;
    if (remainder > 1e-9) stepFurnace(state, remainder);
    return state;
}

function condenseFurnace(state) {
    if (state.condensed && state.result) return state.result;
    state.running = false;
    state.paused = true;
    state.condensed = true;

    const conservation = finalizeMaterialLedger(state.material);
    state.material.conservation = conservation;

    const materialView = {
        released: state.material.released,
        bound: state.material.bound,
        degraded: state.material.degraded,
        residual: state.material.residual,
        expelled: state.material.expelled || emptyMaterialSlice(),
        separationStuck: mixtureStuckFloor(state.material),
        conservation
    };

    const trace = state.chronicle.map(c => ({
        kind: c.kind,
        message: c.message,
        data: { time: c.time, ...(c.data || {}) }
    }));

    const result = condenseMaterialLedger(materialView, {
        peakInstability: state.peakInstability,
        lastHeat: state.heatValue,
        seed: state.seed,
        procedure: {
            ...state.procedure,
            duration: round3(state.time),
            introduced: state.introduced,
            chronicle: state.chronicle
        },
        introductionShocks: state.introductionShocks,
        thermalPeaks: state.thermalPeaks,
        trace
    });

    pushChronicle(state, 'condense', 'Condensation completed.', {
        outcome: result.outcome,
        peakInstability: result.peakInstability
    });

    state.result = result;
    return result;
}

function resetFurnace(state, opts = {}) {
    return createFurnaceState({ seed: opts.seed ?? state.seed, heat: opts.heat || 'medium' });
}

/**
 * Deterministic replay from recorded procedure actions.
 * @param {object} procedure — { seed, actions[] }
 * @param {object} [opts]
 */
function replayFurnaceProcedure(procedure, opts = {}) {
    const dt = procedure.simDt ?? SIM_DT;
    const state = createFurnaceState({ seed: procedure.seed ?? 0 });
    const actions = [...(procedure.actions || [])].sort((a, b) => a.time - b.time);
    const maxSteps = opts.maxSteps ?? 500000;

    const apply = (action) => {
        switch (action.kind) {
            case 'furnace_start':
                startFurnace(state);
                break;
            case 'furnace_pause':
                pauseFurnace(state);
                break;
            case 'furnace_resume':
                resumeFurnace(state);
                break;
            case 'heat_set':
                setFurnaceHeat(state, action.heat);
                break;
            case 'introduce':
                introduceToFurnace(state, action.reagentId, action.qty);
                break;
            case 'condense':
                condenseFurnace(state);
                break;
            case 'reset':
                Object.assign(state, resetFurnace(state));
                break;
            default:
                break;
        }
    };

    const advanceTo = (targetTime) => {
        let steps = 0;
        while (state.time < targetTime - 1e-9 && steps < maxSteps) {
            if (state.running && !state.paused && !state.condensed) {
                const step = Math.min(dt, targetTime - state.time);
                stepFurnace(state, step);
            } else {
                state.time = targetTime;
            }
            steps++;
        }
    };

    let idx = 0;
    for (const action of actions) {
        advanceTo(action.time);
        apply(action);
        if (state.condensed) return { state, result: state.result };
        idx++;
    }

    if (opts.extraSimTime && state.running && !state.paused && !state.condensed) {
        advanceFurnace(state, opts.extraSimTime);
    }

    if (!state.condensed && opts.autoCondense) {
        condenseFurnace(state);
    }
    return { state, result: state.result };
}

module.exports = {
    SIM_DT,
    K_BOUND_TRANSFER,
    K_RELEASED_DEGRADE,
    createFurnaceState,
    snapshotFurnace,
    startFurnace,
    pauseFurnace,
    resumeFurnace,
    setFurnaceHeat,
    introduceToFurnace,
    stepFurnace,
    advanceFurnace,
    condenseFurnace,
    resetFurnace,
    replayFurnaceProcedure,
    formatSimTime,
    applyBoundIncremental,
    applyReleasedIncremental
};
