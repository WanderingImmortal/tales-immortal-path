// ============================================
// QI-PURITY.JS — Refinement quality (distinct from density)
// Design: docs/ideas/qi-purity-foundation-stage3d.md
// ============================================

function ensureQiPurityState() {
    if (G.qiPurity == null) G.qiPurity = 0;
}

/** Established refinement bonus on G (persists through Qi spend / depletion). */
function getEstablishedQiPurityBonus() {
    ensureQiPurityState();
    return G.qiPurity || 0;
}

/** Total purity for formulas — base + bonus, reduced by cycle stain (not stored). */
function getQiPurity() {
    ensureQiPurityState();
    return getQiPurityFromState(G);
}

/** True when technique draws from the dantian (Qi/Breath), not spirit focus. */
function techniqueUsesQiResourceCost(tech) {
    if (!tech) return false;
    const tpl = typeof getTechniqueTemplate === 'function' ? getTechniqueTemplate(tech.name) : null;
    const meta = typeof getTechniqueMeta === 'function' ? getTechniqueMeta(tech) : {};
    const costType = tpl?.costType || meta.costType || tech.costType;
    if (costType === 'spirit') return false;
    if (costType === 'qi') return true;
    const path = meta.path === 'neutral' ? (G.path || 'qi') : (meta.path || G.path || 'qi');
    return path === 'qi';
}

/**
 * Multiplier on Qi technique costs (< 1 = cheaper). Uses effective purity; no damage change.
 * @param {object} [state] optional G-like state for future NPC parity
 */
function getQiPurityTechniqueCostMult(tech, state) {
    if (!techniqueUsesQiResourceCost(tech)) return 1;
    const b = typeof QI_PURITY_BALANCE !== 'undefined' ? QI_PURITY_BALANCE : {};
    const purity = getQiPurityFromState(state || G);
    const ref = b.techniqueCostPurityRef ?? 1;
    const maxCut = b.techniqueCostMaxReduction ?? 0.18;
    const exp = b.techniqueCostPurityExponent ?? 0.55;
    const bonus = Math.max(0, purity - ref);
    if (bonus <= 0) return 1;
    const cut = maxCut * (1 - Math.exp(-exp * bonus));
    return Math.max(1 - maxCut, 1 - cut);
}

function getQiPurityFromState(g) {
    g = g || G;
    const b = typeof QI_PURITY_BALANCE !== 'undefined' ? QI_PURITY_BALANCE : { purityBase: 0.5 };
    let total = (b.purityBase ?? 0.5) + (g.qiPurity || 0);
    const threshold = g.corruptionThreshold || 100;
    const corruption = g.corruptionLevel || 0;
    if (corruption > 0 && threshold > 0) {
        const maxStain = b.maxCorruptionStain ?? 0.45;
        total -= maxStain * Math.min(1, corruption / threshold);
    }
    return Math.max(b.purityFloor ?? 0.25, Math.round(total * 100) / 100);
}

function getQiPurityRefinementDifficultyMult() {
    const b = typeof QI_PURITY_BALANCE !== 'undefined' ? QI_PURITY_BALANCE : {};
    const ref = b.refinementDifficultyRef ?? 1;
    const exp = b.refinementDifficultyExponent ?? 1.45;
    const purity = getQiPurity();
    const mult = Math.pow(ref / Math.max(0.5, purity), exp);
    return Math.max(b.refinementDifficultyFloor ?? 0.1, Math.min(1, mult));
}

/** Purity gain during compression sessions (smaller / harder than density). */
function computeQiPuritySessionGain(sessionGains, opts) {
    const o = opts || {};
    const sg = sessionGains || {};
    if (!sg.compressionBlend || sg.compressionBlend <= 0) {
        sg.purityGain = 0;
        return sg;
    }
    const b = typeof QI_PURITY_BALANCE !== 'undefined' ? QI_PURITY_BALANCE : {};
    const fill = typeof getQiFillRatio === 'function' ? getQiFillRatio() : 1;
    const purityThreshold = b.purityCompressionFillThreshold ?? 0.88;
    if (fill < purityThreshold) {
        sg.purityGain = 0;
        return sg;
    }
    const purityFillBlend = (fill - purityThreshold) / Math.max(0.01, 1 - purityThreshold);
    const cultMult = o.cultMult ?? 1;
    const scale = o.scale != null ? Number(o.scale) : 1;
    const min = o.purityMin ?? b.cultivatePurityMin ?? 0.04;
    const max = o.purityMax ?? b.cultivatePurityMax ?? 0.12;
    const roll = typeof o.purityRoll === 'number' ? o.purityRoll : Math.random();
    const raw = min + roll * (max - min);
    let gain = raw * cultMult * scale * getQiPurityRefinementDifficultyMult() * sg.compressionBlend * purityFillBlend;
    gain = Math.round(gain * 1000) / 1000;
    sg.purityGain = gain;
    return sg;
}
