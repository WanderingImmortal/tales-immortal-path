/**
 * Contamination in the medicinal mixture vs expelled waste vs degraded spirit.
 * Passive baseline cauldron separation (prototype furnace).
 */

const { EXPERIMENTAL_REAGENTS } = require('./reagents');
const { mergeSlice, scaleMaterialSlice, emptyMaterialSlice } = require('./thermal');

const BASE_CAULDRON_SEP = 0.38;

function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
}

function round3(n) {
    return Math.round(n * 1000) / 1000;
}

/**
 * @param {import('./reagents').ReagentDef} def
 */
function deriveSeparationProfile(def) {
    const mineralLoad = def.impurity / Math.max(def.spirit, 1);
    const tierLoad = def.spirit / 28;
    const volatility = def.volatility / 24;
    const purifyEase = def.affinities.purify / 22;

    const difficulty = clamp(
        0.55 + mineralLoad * 0.95 + tierLoad * 0.22 + volatility * 0.18 - purifyEase * 0.12,
        0.45,
        2.4
    );
    const stuckFraction = clamp(
        0.08 + mineralLoad * 0.35 + tierLoad * 0.06 - purifyEase * 0.05,
        0.05,
        0.62
    );
    const sootFactor = clamp(
        0.04 + mineralLoad * 0.22 + volatility * 0.06 + def.impurity / 80,
        0.03,
        0.55
    );

    return {
        difficulty: round3(difficulty),
        stuckFraction: round3(stuckFraction),
        sootFactor: round3(sootFactor)
    };
}

/**
 * Extra contamination carried into released essence on rough extraction (not degraded spirit).
 * @param {object} released — medicinal slice being released this tick
 * @param {number} medicinalTransfer — spirit amount released medicinally
 * @param {number} overBand — 0..1 how far into overheat band
 * @param {ReturnType<typeof deriveSeparationProfile>} sep
 * @param {ReturnType<typeof deriveThermalProfile>} profile
 */
function applyExtractionContamination(released, medicinalTransfer, overBand, sep, profile) {
    if (medicinalTransfer <= 1e-12) return 0;
    const stress = Math.min(1.8, profile.stressSensitivity * (0.35 + overBand * 0.9));
    const soot = medicinalTransfer * sep.sootFactor * (0.12 + overBand * 0.88) * stress;
    released.impurity += soot;
    return soot;
}

/**
 * @param {import('./thermal').MaterialLedger} material
 * @param {number} heat
 * @param {number} dt
 */
function mixtureStuckFraction(material) {
    const rel = material.released;
    const buckets = Object.values(material.byReagent || {});
    const releasedSpirit = buckets.reduce((s, b) => s + b.released.spirit, 0) || rel.spirit;
    if (releasedSpirit <= 1e-9) return 0.1;
    return clamp(
        buckets.reduce((s, b) => {
            const share = b.released.spirit / releasedSpirit;
            return s + share * (b.separationStuckFraction ?? 0.1);
        }, 0),
        0.05,
        0.72
    );
}

/** Minimum contamination the basic cauldron cannot strip from the current mixture. */
function mixtureStuckFloor(material) {
    const rel = material.released;
    const frac = mixtureStuckFraction(material);
    const proportional = rel.impurity * frac;
    const loadMin = material.separationStuckMin || 0;
    return Math.min(rel.impurity, Math.max(proportional, loadMin));
}

function applyPassiveSeparation(material, heat, dt) {
    const rel = material.released;
    if (rel.impurity <= 1e-12) return 0;

    const buckets = Object.values(material.byReagent || {});
    const releasedSpirit = buckets.reduce((s, b) => s + b.released.spirit, 0) || rel.spirit;
    let difficulty = 1;
    if (releasedSpirit > 1e-9) {
        difficulty = buckets.reduce((s, b) => {
            const share = b.released.spirit / releasedSpirit;
            return s + share * (b.separationDifficulty || 1);
        }, 0);
    }

    const gentleBonus = heat < 0.5 ? 1.25 : (heat < 0.7 ? 0.9 : 0.42);
    const purify = rel.affinities.purify;
    const rate = BASE_CAULDRON_SEP * gentleBonus * (1 + purify * 0.015) * dt / difficulty;

    const stuck = mixtureStuckFloor(material);
    const removable = Math.max(0, rel.impurity - stuck);
    if (removable <= 1e-12) return 0;

    const removed = Math.min(removable, rel.impurity * Math.min(0.4, rate));
    if (removed <= 1e-12) return 0;

    rel.impurity -= removed;
    if (!material.expelled) material.expelled = emptyMaterialSlice();
    material.expelled.impurity += removed;
    return removed;
}

/**
 * Medicinal purity (0–1): essence / (essence + contamination in mixture).
 */
function mixturePurityFromReleased(released) {
    const med = Math.max(0, released.spirit);
    const cont = Math.max(0, released.impurity);
    const total = med + cont;
    if (total <= 1e-12) return 0;
    return clamp(med / total, 0, 1);
}

function registerSeparationLoad(ledger, load) {
    const def = EXPERIMENTAL_REAGENTS[load.reagentId];
    const sep = deriveSeparationProfile(def);
    const bucket = ledger.byReagent[load.reagentId];
    if (bucket) {
        bucket.separationDifficulty = sep.difficulty;
    }
    bucket.separationStuckFraction = sep.stuckFraction;
    ledger.separationStuckMin = (ledger.separationStuckMin || 0)
        + load.impurity * sep.stuckFraction * 0.2
        + load.spirit * sep.stuckFraction * 0.035;
}

module.exports = {
    BASE_CAULDRON_SEP,
    deriveSeparationProfile,
    applyExtractionContamination,
    applyPassiveSeparation,
    mixturePurityFromReleased,
    mixtureStuckFloor,
    mixtureStuckFraction,
    registerSeparationLoad
};
