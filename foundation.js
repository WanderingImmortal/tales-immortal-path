// ============================================
// FOUNDATION.JS — Root / Flow / Stability pillars
// ============================================

function ensureCultivationBaseState() {
    if (!G.cultivationBase) {
        G.cultivationBase = { root: 0, flow: 0, stability: 0 };
    } else {
        if (G.cultivationBase.root == null) G.cultivationBase.root = 0;
        if (G.cultivationBase.flow == null) G.cultivationBase.flow = 0;
        if (G.cultivationBase.stability == null) G.cultivationBase.stability = 0;
    }
    if (G.foundationCracks == null) G.foundationCracks = 0;
}

function getFoundationCrackCount() {
    ensureCultivationBaseState();
    return Math.max(0, G.foundationCracks || 0);
}

function getCultivationPillarCaps(realmIdx) {
    const caps = CULTIVATION_BASE_BALANCE.pillarCapsByRealm;
    const idx = Math.min(realmIdx ?? G.realmIdx, 6);
    return caps[idx] || caps[6];
}

function getCultivationPillarValue(pillar) {
    ensureCultivationBaseState();
    return G.cultivationBase[pillar] || 0;
}

function getCultivationPillarTotal() {
    ensureCultivationBaseState();
    const b = G.cultivationBase;
    return (b.root || 0) + (b.flow || 0) + (b.stability || 0);
}

function grantCultivationPillar(pillar, amount) {
    if (!amount || !pillar) return 0;
    ensureCultivationBaseState();
    const caps = getCultivationPillarCaps();
    const cap = caps[pillar];
    const before = G.cultivationBase[pillar] || 0;
    const next = cap != null ? Math.min(cap, before + amount) : before + amount;
    const gained = Math.max(0, next - before);
    if (gained > 0) {
        G.cultivationBase[pillar] = next;
        G._cultivationBaseMigrated = true;
    }
    return gained;
}

function grantFoundationCrack(count) {
    count = Math.max(1, count || 1);
    ensureCultivationBaseState();
    G.foundationCracks = (G.foundationCracks || 0) + count;
    G._cultivationBaseMigrated = true;
    return count;
}

/** Map legacy foundation-loss amounts to foundation cracks. */
function applyFoundationLossAsCracks(loss) {
    const perCrack = CULTIVATION_BASE_BALANCE.pillarGrants?.foundationLossPerCrack || 2;
    const cracks = Math.max(1, Math.ceil((loss || perCrack) / perCrack));
    return grantFoundationCrack(cracks);
}

function ensureCultivationMilestones() {
    if (!G.cultivationMilestones) G.cultivationMilestones = { density: {} };
    if (!G.cultivationMilestones.density) G.cultivationMilestones.density = {};
}

function getMeridianFlowGrant(openCountBefore) {
    const g = CULTIVATION_BASE_BALANCE.pillarGrants || {};
    if (openCountBefore <= 0) return g.meridianOpenFlowFirst ?? 3;
    if (openCountBefore <= 3) return g.meridianOpenFlowEarly ?? 2.5;
    return g.meridianOpenFlowLater ?? 2;
}

function applyChamberGatherRootGrant() {
    const amount = CULTIVATION_BASE_BALANCE.pillarGrants?.gatherQiRoot ?? 0.25;
    return grantCultivationPillar('root', amount);
}

function applyChamberExpandRootGrant() {
    const amount = CULTIVATION_BASE_BALANCE.pillarGrants?.expandDantianRoot ?? 1.5;
    return grantCultivationPillar('root', amount);
}

function checkCultivationDensityMilestones() {
    if (typeof getQiDensity !== 'function') return 0;
    ensureCultivationMilestones();
    const cfg = CULTIVATION_BASE_BALANCE.pillarGrants || {};
    const thresholds = cfg.densityMilestones || [1.5, 2.0, 2.5, 3.0];
    const rootPer = cfg.densityMilestoneRoot ?? 1;
    const total = getQiDensity();
    let granted = 0;
    thresholds.forEach(t => {
        const key = String(t);
        if (total >= t && !G.cultivationMilestones.density[key]) {
            G.cultivationMilestones.density[key] = true;
            granted += grantCultivationPillar('root', rootPer);
        }
    });
    return granted;
}

function grantConsolidationStability(amount) {
    return grantCultivationPillar('stability', amount);
}

function grantMeridianOpenFlow(openCountBefore) {
    return grantCultivationPillar('flow', getMeridianFlowGrant(openCountBefore));
}

function grantMeridianAttemptFlow() {
    const amount = CULTIVATION_BASE_BALANCE.pillarGrants?.meridianFailFlow ?? 0.25;
    return grantCultivationPillar('flow', amount);
}

function grantPerfectFoundationFlow() {
    const amount = CULTIVATION_BASE_BALANCE.pillarGrants?.perfectFoundationFlow ?? 2;
    return grantCultivationPillar('flow', amount);
}

function grantPeakGrindStability() {
    const amount = CULTIVATION_BASE_BALANCE.pillarGrants?.peakGrindStability ?? 1;
    return grantCultivationPillar('stability', amount);
}

function formatPillarGrant(pillar, amount) {
    if (!amount) return '';
    const labels = { root: 'Root', flow: 'Flow', stability: 'Stability' };
    const emojis = { root: '🌱', flow: '☯️', stability: '🏛️' };
    const shown = Number.isInteger(amount) ? amount : Math.round(amount * 100) / 100;
    return `+${shown} ${emojis[pillar] || ''} ${labels[pillar] || pillar}`.trim();
}

function getFoundationCrackPenalty() {
    return getFoundationCrackCount() * (CULTIVATION_BASE_BALANCE.crackPenalty || 4);
}

/** Effective foundation for formulas — pillars minus crack penalty, with legacy fallback until migration. */
function getEffectiveFoundationFromState(g) {
    g = g || G;
    const b = g.cultivationBase || {};
    const root = b.root || 0;
    const flow = b.flow || 0;
    const stability = b.stability || 0;
    const pillarTotal = root + flow + stability;
    const cracks = g.foundationCracks || 0;
    const crackPenalty = cracks * (CULTIVATION_BASE_BALANCE.crackPenalty || 4);
    const fromPillars = Math.max(0, pillarTotal - crackPenalty);

    if (!g._cultivationBaseMigrated && pillarTotal <= 0) {
        return Math.max(0, (g.foundation || 0) - crackPenalty);
    }
    return fromPillars;
}

function getEffectiveFoundation() {
    ensureCultivationBaseState();
    return getEffectiveFoundationFromState(G);
}

function getFoundationGrade(effective) {
    effective = effective == null ? getEffectiveFoundation() : effective;
    const grades = CULTIVATION_BASE_BALANCE.grades || [];
    let grade = grades[0] || { id: 'crude', label: 'Crude', emoji: '🪨' };
    for (const row of grades) {
        if (effective >= row.min) grade = row;
    }
    return grade;
}

function getFoundationGradeLabel(effective) {
    const grade = getFoundationGrade(effective);
    return `${grade.emoji} ${grade.label}`;
}

function getCultivationPillarSummary() {
    ensureCultivationBaseState();
    const b = G.cultivationBase;
    const effective = getEffectiveFoundation();
    const cracks = getFoundationCrackCount();
    return {
        root: b.root || 0,
        flow: b.flow || 0,
        stability: b.stability || 0,
        cracks,
        crackPenalty: getFoundationCrackPenalty(),
        total: getCultivationPillarTotal(),
        effective,
        grade: getFoundationGrade(effective),
        gradeLabel: getFoundationGradeLabel(effective)
    };
}

function getFoundationDisplayText() {
    const s = getCultivationPillarSummary();
    const crackText = s.cracks > 0 ? ` · ${s.cracks} crack${s.cracks === 1 ? '' : 's'}` : '';
    if (s.total > 0 || G._cultivationBaseMigrated) {
        return `${s.effective} ${s.gradeLabel} (🌱${s.root} ☯️${s.flow} 🏛️${s.stability}${crackText})`;
    }
    return `${s.effective} ${s.gradeLabel}${crackText}`;
}
