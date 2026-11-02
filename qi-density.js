// ============================================
// QI-DENSITY.JS — Established density, refill cost, compression yield
// Design: docs/ideas/time-pacing-cultivation-architecture.md (Stage 3C)
// ============================================

/** Permanent cultivation bonus stored on G (realm/foundation/gear add via getQiDensity). */
function getEstablishedQiDensityBonus() {
    return G.qiDensity || 0;
}

/** Refilling depleted dantian Qi at higher total density costs more effort per unit stored. */
function getQiReplenishEffortMult() {
    const b = QI_BALANCE;
    const ref = b.qiReplenishDensityRef ?? 1;
    const exp = b.qiReplenishCostExponent ?? 1.35;
    const density = typeof getQiDensity === 'function' ? getQiDensity() : ref;
    return Math.pow(Math.max(0.5, density) / ref, exp);
}

/** Raising established density gets harder as total density rises. */
function getQiCompressionDifficultyMult() {
    const b = QI_BALANCE;
    const ref = b.qiCompressionDifficultyRef ?? 1;
    const exp = b.qiCompressionDifficultyExponent ?? 1.5;
    const density = typeof getQiDensity === 'function' ? getQiDensity() : ref;
    const mult = Math.pow(ref / Math.max(0.5, density), exp);
    return Math.max(b.qiCompressionDifficultyFloor ?? 0.08, Math.min(1, mult));
}

/** 0–1 blend for how much of a session's compression work applies (refill-only when low). */
function getQiCompressionSessionBlend() {
    const b = QI_BALANCE;
    const minFill = b.qiCompressionMinFill ?? 0.72;
    const threshold = b.qiCompressionFillThreshold ?? 0.82;
    const fill = typeof getQiFillRatio === 'function' ? getQiFillRatio() : 1;
    if (fill < minFill) return 0;
    if (fill >= threshold) return 1;
    return (fill - minFill) / Math.max(0.01, threshold - minFill);
}

/**
 * Split one cultivate / gather session into density (compression) vs dantian refill.
 * @returns {{ densGain: number, fillGain: number, replenishMult: number, compressionBlend: number }}
 */
function computeQiCultivationSessionGains(opts) {
    const o = opts || {};
    const b = QI_BALANCE;
    const cultMult = o.cultMult ?? 1;
    const scale = o.scale != null ? Number(o.scale) : 1;
    const densityMin = o.densityMin ?? b.cultivateDensityMin;
    const densityMax = o.densityMax ?? b.cultivateDensityMax;
    const fillRatio = o.fillRatio ?? b.cultivateFillRatio;
    const qiRegMult = o.qiRegMult ?? 1;

    const replenishMult = getQiReplenishEffortMult();
    const fillRaw = getMaxQi() * fillRatio * cultMult * scale * qiRegMult / replenishMult;
    const fillGain = scale < 1
        ? Math.max(0, Math.round(fillRaw))
        : Math.max(1, Math.floor(fillRaw));

    const compressionBlend = getQiCompressionSessionBlend();
    let densGain = 0;
    if (compressionBlend > 0) {
        const roll = typeof o.densityRoll === 'number' ? o.densityRoll : Math.random();
        const densRaw = densityMin + roll * (densityMax - densityMin);
        densGain = densRaw * cultMult * scale * getQiCompressionDifficultyMult() * compressionBlend;
        densGain = Math.round(densGain * 100) / 100;
    }

    return { densGain, fillGain, replenishMult, compressionBlend };
}

/** Scale instant Qi refill (pills, rewards) by established density cost — not compression bonuses. */
function applyQiReplenishAmount(baseAmount) {
    const amt = Math.max(0, Math.floor(baseAmount));
    if (amt <= 0) return 0;
    const mult = getQiReplenishEffortMult();
    return Math.max(1, Math.floor(amt / mult));
}
