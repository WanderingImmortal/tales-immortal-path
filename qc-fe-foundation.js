// ============================================
// QC-FE-FOUNDATION.JS — Foundation quality at QC → FE crossing
// ============================================

/** Preparation score 0–1 (does not affect break roll — pillar grant only). */
function computeQcFePreparationScore() {
    const cfg = typeof QC_FE_FOUNDATION_CROSSING !== 'undefined' ? QC_FE_FOUNDATION_CROSSING : {};
    const stage = typeof getQcBandStage === 'function' ? getQcBandStage() : 'late';
    const stageW = cfg.stageWeight || { early: 0, mid: 0.15, late: 1, peak: 1.25 };
    let score = stageW[stage] ?? (stage === 'late' || stage === 'peak' ? 1 : 0);

    const densityBonus = typeof getEstablishedQiDensityBonus === 'function'
        ? getEstablishedQiDensityBonus() : (G.qiDensity || 0);
    const densityCap = cfg.densityBonusCap ?? 4;
    score += Math.min(1, densityBonus / densityCap) * (cfg.densityWeight ?? 0.22);

    const purityBonus = typeof getEstablishedQiPurityBonus === 'function'
        ? getEstablishedQiPurityBonus() : (G.qiPurity || 0);
    const purityCap = cfg.purityBonusCap ?? 2.5;
    score += Math.min(1, purityBonus / purityCap) * (cfg.purityWeight ?? 0.18);

    if (typeof isRealmConsolidated === 'function' && isRealmConsolidated(0)) {
        const tier = typeof getConsolidationTier === 'function' ? getConsolidationTier(0) : 'settled';
        const sealW = cfg.sealTierWeight || { settled: 0.12, peak: 0.22, perfect: 0.28 };
        score += sealW[tier] || 0;
    }

    if (typeof getActiveMethodGradeId === 'function') {
        const grade = getActiveMethodGradeId();
        const gradeW = cfg.methodGradeWeight || { crude: 0, common: 0.06, superior: 0.1, peerless: 0.14 };
        score += gradeW[grade] ?? 0;
    }

    return Math.max(0, Math.min(1.35, Math.round(score * 1000) / 1000));
}

/** Pillar grants from QC preparation (success already rolled). */
function computeQcFeFoundationPillarGrant(style) {
    const cfg = typeof QC_FE_FOUNDATION_CROSSING !== 'undefined' ? QC_FE_FOUNDATION_CROSSING : {};
    const prep = computeQcFePreparationScore();
    const styleMod = cfg.styleMod || {
        balanced: { root: 1, flow: 1, stability: 1 },
        power: { root: 0.85, flow: 0.75, stability: 1.2 },
        wisdom: { root: 0.9, flow: 1.25, stability: 0.95 }
    };
    const mod = styleMod[style] || styleMod.balanced;

    const base = cfg.basePillars || { root: 1, flow: 0.5, stability: 2 };
    const scale = cfg.pillarScale || { root: 3.5, flow: 2.2, stability: 5.5 };

    const root = Math.max(0, Math.round((base.root + prep * scale.root) * mod.root * 10) / 10);
    const flow = Math.max(0, Math.round((base.flow + prep * scale.flow) * mod.flow * 10) / 10);
    const stability = Math.max(0, Math.round((base.stability + prep * scale.stability) * mod.stability * 10) / 10);

    return { prep, root, flow, stability, stage: typeof getQcBandStage === 'function' ? getQcBandStage() : null };
}

function applyQcFeFoundationPillarGrant(style) {
    const grant = computeQcFeFoundationPillarGrant(style);
    let parts = [];
    if (grant.root && typeof grantCultivationPillar === 'function') {
        parts.push(formatPillarGrant('root', grantCultivationPillar('root', grant.root)));
    }
    if (grant.flow && typeof grantCultivationPillar === 'function') {
        parts.push(formatPillarGrant('flow', grantCultivationPillar('flow', grant.flow)));
    }
    if (grant.stability && typeof grantCultivationPillar === 'function') {
        parts.push(formatPillarGrant('stability', grantCultivationPillar('stability', grant.stability)));
    }
    if (typeof addLog === 'function') {
        const band = typeof getQcBandLabel === 'function' ? getQcBandLabel() : 'Qi Condensation';
        addLog(`🏛️ Foundation footing from ${band} preparation (score ${grant.prep.toFixed(2)}): ${parts.filter(Boolean).join(' · ') || 'minimal'}.`);
    }
    return grant;
}
