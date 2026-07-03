// ============================================
// ALIGNMENT.JS — Dao Alignment tracking & effects
// ============================================

function ensureDaoAlignment() {
    if (G.daoAlignment == null) G.daoAlignment = 0;
    G.daoAlignment = clamp(G.daoAlignment, DAO_ALIGNMENT.min, DAO_ALIGNMENT.max);
}

function getDaoAlignmentTier() {
    ensureDaoAlignment();
    const tiers = DAO_ALIGNMENT.tiers;
    for (let i = 0; i < tiers.length; i++) {
        if (G.daoAlignment >= tiers[i].min) return tiers[i];
    }
    return tiers[tiers.length - 1];
}

function formatDaoAlignmentValue() {
    ensureDaoAlignment();
    const v = G.daoAlignment;
    return (v > 0 ? '+' : '') + v;
}

function formatDaoAlignmentDisplay() {
    const tier = getDaoAlignmentTier();
    return `${formatDaoAlignmentValue()} (${tier.label})`;
}

function shiftDaoAlignment(delta, reason) {
    if (!delta) return;
    ensureDaoAlignment();
    const prev = G.daoAlignment;
    const prevTierId = getDaoAlignmentTier().id;
    let appliedDelta = delta;
    if (typeof getSoulChamberDaoAlignmentShiftMult === 'function') {
        appliedDelta = Math.round(delta * getSoulChamberDaoAlignmentShiftMult());
        if (appliedDelta === 0 && delta !== 0) appliedDelta = delta > 0 ? 1 : -1;
    }
    G.daoAlignment = clamp(G.daoAlignment + appliedDelta, DAO_ALIGNMENT.min, DAO_ALIGNMENT.max);
    const sign = appliedDelta > 0 ? '+' : '';
    const reasonText = reason ? ` — ${reason}` : '';
    addLog(`☯️ Dao Alignment ${sign}${appliedDelta}${reasonText}. Now ${formatDaoAlignmentDisplay()}.`);
    if (typeof triggerTutorial === 'function') triggerTutorial('first_alignment');
    maybeLogAlignmentOmen(prev, G.daoAlignment, prevTierId);
}

function shiftDaoAlignmentHelp(reason) {
    const s = DAO_ALIGNMENT.shifts;
    const delta = s.helpMin + Math.floor(Math.random() * (s.helpMax - s.helpMin + 1));
    shiftDaoAlignment(delta, reason || 'aiding others');
    if (typeof shiftSectReputation === 'function' && typeof isSectFounded === 'function' && isSectFounded()) {
        shiftSectReputation('help_alignment');
    }
    if (typeof applyWorldSectRelationshipDrift === 'function') {
        applyWorldSectRelationshipDrift('village_help');
    }
}

function maybeLogAlignmentOmen(prev, next, prevTierId) {
    const newTier = getDaoAlignmentTier();
    if (newTier.id !== prevTierId && DAO_ALIGNMENT.tierOmens[newTier.id]) {
        addLog(DAO_ALIGNMENT.tierOmens[newTier.id]);
    }
    if (next >= DAO_ALIGNMENT.heavenly.threshold && prev < DAO_ALIGNMENT.heavenly.threshold) {
        addLog(DAO_ALIGNMENT.extremeOmens.harmony);
    }
    if (next <= -DAO_ALIGNMENT.heavenly.threshold && prev > -DAO_ALIGNMENT.heavenly.threshold) {
        addLog(DAO_ALIGNMENT.extremeOmens.rebellion);
    }
}

function getDaoAlignmentBreakBonus() {
    ensureDaoAlignment();
    return G.daoAlignment * DAO_ALIGNMENT.breakPerPoint;
}

function getDaoAlignmentTribulationSeverityMult() {
    ensureDaoAlignment();
    return 1 - G.daoAlignment * DAO_ALIGNMENT.tribPerPoint;
}

function getDaoAlignmentScarMult() {
    ensureDaoAlignment();
    return G.daoAlignment <= DAO_ALIGNMENT.scarRebelliousThreshold
        ? DAO_ALIGNMENT.scarRebelliousMult
        : 1;
}

function getDaoAlignmentBreakModifierLabel() {
    const bonus = getDaoAlignmentBreakBonus();
    if (Math.abs(bonus) < 0.5) return '';
    const sign = bonus > 0 ? '+' : '';
    return `Dao ${sign}${Math.round(bonus)}% break`;
}

function getDaoAlignmentTribulationModifierLabel() {
    const mult = getDaoAlignmentTribulationSeverityMult();
    const pct = Math.round((mult - 1) * 100);
    if (pct === 0) return '';
    const sign = pct > 0 ? '+' : '';
    return `Dao ${sign}${pct}% severity`;
}

function getDaoAlignmentTierClass() {
    return 'alignment-' + getDaoAlignmentTier().id;
}

function maybeHeavenlyAlignmentEvent() {
    if (typeof ensureDaoAlignment !== 'function') return;
    ensureDaoAlignment();
    if (G.gameOver || G.inCombat || G.tribulationState?.active || G.forbidden?.activeTrial) return;
    const h = DAO_ALIGNMENT.heavenly;
    if (G.daoAlignment >= h.threshold && Math.random() < h.blessingChance) {
        triggerHeavenlyBlessing();
    } else if (G.daoAlignment <= -h.threshold && Math.random() < h.punishmentChance) {
        triggerHeavenlyPunishment();
    }
}

function triggerHeavenlyBlessing() {
    const events = DAO_ALIGNMENT.blessings;
    const ev = events[Math.floor(Math.random() * events.length)];
    ev.apply();
    addLog(`🌤️ ${ev.log}`);
}

function triggerHeavenlyPunishment() {
    const events = DAO_ALIGNMENT.punishments;
    const ev = events[Math.floor(Math.random() * events.length)];
    ev.apply();
    addLog(`⛈️ ${ev.log}`);
}
