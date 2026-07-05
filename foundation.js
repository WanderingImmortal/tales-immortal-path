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
    if (gained > 0) G.cultivationBase[pillar] = next;
    return gained;
}

function getFoundationCrackPenalty() {
    return getFoundationCrackCount() * (CULTIVATION_BASE_BALANCE.crackPenalty || 4);
}

/** Effective foundation for formulas — pillars minus crack penalty, with legacy fallback until migration. */
function getEffectiveFoundation() {
    ensureCultivationBaseState();
    const pillarTotal = getCultivationPillarTotal();
    const crackPenalty = getFoundationCrackPenalty();
    const fromPillars = Math.max(0, pillarTotal - crackPenalty);

    if (!G._cultivationBaseMigrated && pillarTotal <= 0) {
        return Math.max(0, (G.foundation || 0) - crackPenalty);
    }
    return fromPillars;
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
