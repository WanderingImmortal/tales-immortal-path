// ============================================
// ALIGNMENT.JS — Dao Alignment tracking & effects
// ============================================

function ensureAlignmentState() {
    ensureDaoAlignment();
    if (!G.alignmentLog) G.alignmentLog = [];
    if (!G.alignmentActionUses) G.alignmentActionUses = {};
}

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

function getEffectiveDaoAlignmentTier() {
    const tier = getDaoAlignmentTier();
    const corruption = G.corruptionLevel || 0;
    if (corruption >= (DAO_ALIGNMENT.corruptionBlockHarmony || 50) && tier.id === 'harmony') {
        return DAO_ALIGNMENT.tiers.find(t => t.id === 'favored') || tier;
    }
    return tier;
}

function formatDaoAlignmentValue() {
    ensureDaoAlignment();
    const v = G.daoAlignment;
    return (v > 0 ? '+' : '') + v;
}

function formatDaoAlignmentDisplay() {
    const tier = getDaoAlignmentTier();
    const eff = getEffectiveDaoAlignmentTier();
    const base = `${formatDaoAlignmentValue()} (${tier.label})`;
    if (eff.id !== tier.id) return `${base} — perks capped at Favored (corruption)`;
    return base;
}

function getDaoAlignmentProgress() {
    ensureDaoAlignment();
    const tiers = DAO_ALIGNMENT.tiers;
    const current = getDaoAlignmentTier();
    const idx = tiers.findIndex(t => t.id === current.id);
    if (idx <= 0) {
        const nextMin = tiers[idx - 1]?.min ?? DAO_ALIGNMENT.max;
        const range = nextMin - current.min;
        const progress = range > 0 ? (G.daoAlignment - current.min) / range : 1;
        return { current, next: tiers[idx - 1] || null, progress: clamp(progress, 0, 1), value: G.daoAlignment };
    }
    const next = tiers[idx - 1];
    const range = next.min - current.min;
    const progress = range > 0 ? (G.daoAlignment - current.min) / range : 1;
    return { current, next, progress: clamp(progress, 0, 1), value: G.daoAlignment };
}

function getDaoAlignmentTierEffects(tierId) {
    const id = tierId || getEffectiveDaoAlignmentTier().id;
    return DAO_ALIGNMENT.tierEffects?.[id] || DAO_ALIGNMENT.tierEffects?.neutral || {};
}

function getAlignmentShiftDampenPct() {
    let dampen = 0;
    const synergy = getSectDoctrineAlignmentSynergy();
    if (synergy?.alignmentDampenPct) dampen += synergy.alignmentDampenPct;
    if (typeof getMergedDaoEffects === 'function') {
        const merged = getMergedDaoEffects();
        if (merged?.alignmentDampenPct) dampen += merged.alignmentDampenPct;
    }
    return Math.min(50, dampen);
}

function appendAlignmentLog(delta, reason) {
    ensureAlignmentState();
    G.alignmentLog.unshift({
        delta,
        reason: reason || 'unknown',
        months: G.ageMonths || 0,
        value: G.daoAlignment
    });
    if (G.alignmentLog.length > 5) G.alignmentLog.length = 5;
}

function shiftDaoAlignment(delta, reason) {
    if (!delta) return;
    ensureDaoAlignment();
    const prev = G.daoAlignment;
    const prevTierId = getDaoAlignmentTier().id;
    let appliedDelta = delta;
    const dampen = getAlignmentShiftDampenPct();
    if (dampen > 0) {
        appliedDelta = Math.round(appliedDelta * (1 - dampen / 100));
        if (appliedDelta === 0 && delta !== 0) appliedDelta = delta > 0 ? 1 : -1;
    }
    if (typeof getSoulChamberDaoAlignmentShiftMult === 'function') {
        appliedDelta = Math.round(appliedDelta * getSoulChamberDaoAlignmentShiftMult());
        if (appliedDelta === 0 && delta !== 0) appliedDelta = delta > 0 ? 1 : -1;
    }
    G.daoAlignment = clamp(G.daoAlignment + appliedDelta, DAO_ALIGNMENT.min, DAO_ALIGNMENT.max);
    const sign = appliedDelta > 0 ? '+' : '';
    const reasonText = reason ? ` — ${reason}` : '';
    addLog(`☯️ Dao Alignment ${sign}${appliedDelta}${reasonText}. Now ${formatDaoAlignmentDisplay()}.`);
    appendAlignmentLog(appliedDelta, reason);
    if (typeof triggerTutorial === 'function') triggerTutorial('first_alignment');
    maybeLogAlignmentOmen(prev, G.daoAlignment, prevTierId);
}

function shiftDaoAlignmentHelp(reason) {
    const s = DAO_ALIGNMENT.shifts;
    let delta = s.helpMin + Math.floor(Math.random() * (s.helpMax - s.helpMin + 1));
    const synergy = getSectDoctrineAlignmentSynergy();
    if (synergy?.helpShiftBonus) delta += 2;
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

function getDaoAlignmentMarketMult() {
    const tier = getEffectiveDaoAlignmentTier().id;
    const map = { harmony: 0.88, favored: 0.94, neutral: 1, dissonant: 1.12, rebellious: 1.25 };
    return map[tier] ?? 1;
}

function getAlignmentNpcRefusalChance(npc) {
    if (!npc || npc.isDemonicTalent) return 0;
    const fx = getDaoAlignmentTierEffects();
    return fx.npcRefusalChance || 0;
}

function checkAlignmentNpcRefusal(npc) {
    const chance = getAlignmentNpcRefusalChance(npc);
    if (chance <= 0 || Math.random() >= chance) return false;
    addLog(`☯️ ${npc.name} refuses to deal with you — your Dao alignment repels the righteous jianghu.`);
    return true;
}

function isAlignmentLocked(contentId, opts) {
    const align = G.daoAlignment || 0;
    if (opts?.reqAlignment != null && align < opts.reqAlignment) return true;
    if (opts?.reqAlignmentMax != null && align > opts.reqAlignmentMax) return true;
    return false;
}

function getTechniqueAlignmentBlockReason(template) {
    if (!template) return null;
    if (template.reqAlignment != null && (G.daoAlignment || 0) < template.reqAlignment) {
        return `Requires Dao Alignment +${template.reqAlignment} (have ${formatDaoAlignmentValue()}).`;
    }
    if (template.reqAlignmentMax != null && (G.daoAlignment || 0) > template.reqAlignmentMax) {
        return `Requires Dao Alignment ${template.reqAlignmentMax} or lower.`;
    }
    return null;
}

function getDaoAlignmentEncounterChanceMult() {
    const fx = getDaoAlignmentTierEffects();
    return fx.demonicEncounterMult || 1;
}

function getHeavenlyAlignmentOmenReadout() {
    ensureDaoAlignment();
    const h = DAO_ALIGNMENT.heavenly;
    const align = G.daoAlignment;
    const fx = getDaoAlignmentTierEffects();
    let blessingChance = h.blessingChance;
    let punishmentChance = h.punishmentChance;
    if (align >= h.threshold) {
        return { type: 'blessing', chance: blessingChance, label: `${Math.round(blessingChance * 100)}% blessing chance each month` };
    }
    if (align <= -h.threshold) {
        const mult = fx.heavenlyPunishmentMult || 1;
        punishmentChance *= mult;
        return { type: 'punishment', chance: punishmentChance, label: `${Math.round(punishmentChance * 100)}% punishment chance each month` };
    }
    const dist = Math.min(h.threshold - align, h.threshold + align);
    if (dist <= 15) {
        return { type: 'near', chance: 0, label: `${dist} points from heavenly threshold` };
    }
    return null;
}

function applyCorruptionAlignmentDrift() {
    const corruption = G.corruptionLevel || 0;
    if (corruption < (DAO_ALIGNMENT.corruptionDriftThreshold || 50)) return;
    const drift = DAO_ALIGNMENT.corruptionDriftPerCultivate || -1;
    if (drift) shiftDaoAlignment(drift, 'corruption gnawing at the Dao heart');
}

function reduceCorruption(amount, reason) {
    if (!amount || !(G.corruptionLevel > 0)) return 0;
    const before = G.corruptionLevel || 0;
    G.corruptionLevel = Math.max(0, before - amount);
    const reduced = before - G.corruptionLevel;
    if (reduced > 0) addLog(`🩸 Corruption −${reduced}${reason ? ` — ${reason}` : ''}. (${G.corruptionLevel}/${G.corruptionThreshold || 100})`);
    return reduced;
}

function getSectDoctrineAlignmentSynergy() {
    if (typeof isSectFounded !== 'function' || !isSectFounded()) return null;
    const doctrine = typeof getSectDoctrineId === 'function' ? getSectDoctrineId() : G.sect?.doctrine;
    const tier = getEffectiveDaoAlignmentTier().id;
    const align = G.daoAlignment || 0;
    const cfg = DAO_ALIGNMENT.sectSynergy || {};
    const out = { doctrine, tier, label: null, renownMultBonus: 0, combatMultBonus: 0, alignmentDampenPct: 0, helpShiftBonus: false, intimidatePenalty: 0, friction: false };

    if (doctrine === 'righteous' && tier === 'harmony') {
        Object.assign(out, cfg.righteous_harmony || {});
    } else if (doctrine === 'righteous' && (tier === 'rebellious' || tier === 'dissonant')) {
        Object.assign(out, cfg.righteous_rebellious || {});
    } else if (doctrine === 'shadow' && align <= -30) {
        Object.assign(out, cfg.shadow_low || {});
    } else if (doctrine === 'shadow' && (tier === 'harmony' || align >= 30)) {
        Object.assign(out, cfg.shadow_harmony || {});
    } else if (doctrine === 'balanced') {
        Object.assign(out, cfg.balanced || {});
    }
    return out.label ? out : null;
}

function maybeTriggerSectAlignmentFriction() {
    if (!G.pendingAlignmentFriction && typeof isSectFounded === 'function' && isSectFounded()) {
        const synergy = getSectDoctrineAlignmentSynergy();
        if (synergy?.friction && !G.sect?.alignmentFrictionResolved) {
            G.pendingAlignmentFriction = {
                title: 'Disciples Question Your Path',
                text: 'Your righteous sect swore the Heavenly Dao — yet your personal alignment rebels against heaven. Disciples whisper in the training yards.',
                choices: [
                    { id: 'repent', label: 'Repent publicly (+alignment, +respect)', alignDelta: [10, 18], repKey: 'help_alignment' },
                    { id: 'suppress', label: 'Suppress dissent (−sect respect)', alignDelta: [-3, -3], repDelta: { respect: -4 } }
                ]
            };
            addLog('☯️ Disciples question your hypocrisy — open the Dao Alignment panel to respond.');
        }
    }
}

function resolveAlignmentFriction(choiceId) {
    const ev = G.pendingAlignmentFriction;
    if (!ev) return { success: false, message: 'No pending event.' };
    const choice = ev.choices.find(c => c.id === choiceId);
    if (!choice) return { success: false, message: 'Invalid choice.' };
    if (choice.alignDelta) {
        const lo = choice.alignDelta[0];
        const hi = choice.alignDelta[1];
        const delta = lo + Math.floor(Math.random() * (hi - lo + 1));
        shiftDaoAlignment(delta, 'sect doctrine friction');
    }
    if (choice.repKey && typeof shiftSectReputation === 'function') shiftSectReputation(choice.repKey);
    if (choice.repDelta && typeof shiftSectReputation === 'function') shiftSectReputation(null, choice.repDelta);
    if (G.sect) G.sect.alignmentFrictionResolved = true;
    G.pendingAlignmentFriction = null;
    const msg = choiceId === 'repent' ? 'You kneel before your disciples and seek the righteous path anew.'
        : 'You silence the whispers — fear replaces respect.';
    addLog(`☯️ ${msg}`);
    return { success: true, message: msg };
}

function getAlignmentActionUseKey(actionId) {
    return `${actionId}_r${G.realmIdx}`;
}

function getAlignmentActionUseCount(actionId) {
    ensureAlignmentState();
    return G.alignmentActionUses[getAlignmentActionUseKey(actionId)] || 0;
}

function incrementAlignmentActionUse(actionId) {
    ensureAlignmentState();
    const key = getAlignmentActionUseKey(actionId);
    G.alignmentActionUses[key] = (G.alignmentActionUses[key] || 0) + 1;
}

function getAlignmentActionBlockReason(actionDef) {
    if (!actionDef) return 'Unknown action.';
    ensureDaoAlignment();
    const align = G.daoAlignment || 0;
    const tier = getDaoAlignmentTier().id;
    if (actionDef.alignMin != null && align < actionDef.alignMin) {
        return `Requires alignment ${actionDef.alignMin} or higher.`;
    }
    if (actionDef.alignMax != null && align > actionDef.alignMax) {
        return `Not available above alignment ${actionDef.alignMax}.`;
    }
    if (actionDef.tierOnly && !actionDef.tierOnly.includes(tier)) {
        const corruptionBypass = actionDef.requireCorruption != null
            && (G.corruptionLevel || 0) >= actionDef.requireCorruption;
        if (!corruptionBypass) {
            return `Only available while ${actionDef.tierOnly.join(' or ')}.`;
        }
    }
    if (actionDef.requireCorruption != null && actionDef.tierOnly
        && !actionDef.tierOnly.includes(tier) && (G.corruptionLevel || 0) < actionDef.requireCorruption) {
        return `Requires dissonant alignment or corruption ${actionDef.requireCorruption}+.`;
    }
    if (actionDef.requireCorruption != null && !actionDef.tierOnly
        && (G.corruptionLevel || 0) < actionDef.requireCorruption) {
        return `Requires corruption ${actionDef.requireCorruption}+.`;
    }
    if (actionDef.spiritCost && G.spirit < actionDef.spiritCost) {
        return `Need ${actionDef.spiritCost} Spirit.`;
    }
    if (actionDef.stonesCost && (G.stones || 0) < actionDef.stonesCost) {
        return `Need ${actionDef.stonesCost} Spirit Stones.`;
    }
    if (actionDef.fameCost && (G.fame || 0) < actionDef.fameCost) {
        return `Need ${actionDef.fameCost} Fame.`;
    }
    const uses = getAlignmentActionUseCount(actionDef.id);
    const max = actionDef.maxUsesPerRealm || 3;
    if (uses >= max) return `Diminishing returns — already performed ${max} times this realm.`;
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'Cannot act right now.';
    return null;
}

function getAlignmentActionMonths(actionDef) {
    const base = actionDef.months || 2;
    const uses = getAlignmentActionUseCount(actionDef.id);
    const max = actionDef.maxUsesPerRealm || 3;
    if (uses >= max - 1) return base + 1;
    if (uses >= max) return base + 2;
    return base;
}

function performAlignmentAction(actionId) {
    const actionDef = (DAO_ALIGNMENT.actions || []).find(a => a.id === actionId);
    const block = getAlignmentActionBlockReason(actionDef);
    if (block) return { success: false, message: block };

    const months = getAlignmentActionMonths(actionDef);
    beginActionLog();
    if (!advanceTime(months, actionDef.label)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends before the deed completes.' };
    }

    if (actionDef.spiritCost) G.spirit = Math.max(1, G.spirit - actionDef.spiritCost);
    if (actionDef.stonesCost) G.stones = Math.max(0, G.stones - actionDef.stonesCost);
    if (actionDef.fameCost) G.fame = Math.max(0, G.fame - actionDef.fameCost);

    let msg = `${actionDef.emoji} ${actionDef.label} complete.`;
    if (actionDef.useHelpShift) {
        shiftDaoAlignmentHelp(actionDef.label.toLowerCase());
    } else if (actionDef.alignDelta) {
        const lo = actionDef.alignDelta[0];
        const hi = actionDef.alignDelta[1];
        const delta = lo + Math.floor(Math.random() * (hi - lo + 1));
        shiftDaoAlignment(delta, actionDef.label.toLowerCase());
    }
    if (actionDef.corruptionReduce) {
        const lo = actionDef.corruptionReduce[0];
        const hi = actionDef.corruptionReduce[1];
        reduceCorruption(lo + Math.floor(Math.random() * (hi - lo + 1)), 'atonement');
    }
    if (actionDef.corruptionGain) {
        G.corruptionLevel = (G.corruptionLevel || 0) + actionDef.corruptionGain;
        addLog(`🩸 Corruption +${actionDef.corruptionGain} — demonic impulse festers.`);
    }

    incrementAlignmentActionUse(actionId);
    commitActionLog(msg);
    return { success: true, message: msg };
}

function actionAlignment() {
    if (G.gameOver || G.inCombat) return;
    if (typeof renderAlignmentPopup === 'function') renderAlignmentPopup();
    document.getElementById('alignmentPopup')?.classList.add('active');
}

function maybeHeavenlyAlignmentEvent() {
    if (typeof ensureDaoAlignment !== 'function') return;
    ensureDaoAlignment();
    if (G.gameOver || G.inCombat || G.tribulationState?.active || G.forbidden?.activeTrial) return;
    const h = DAO_ALIGNMENT.heavenly;
    const fx = getDaoAlignmentTierEffects();
    if (G.daoAlignment >= h.threshold && Math.random() < h.blessingChance) {
        triggerHeavenlyBlessing();
    } else if (G.daoAlignment <= -h.threshold) {
        let chance = h.punishmentChance;
        if (fx.heavenlyPunishmentMult) chance *= fx.heavenlyPunishmentMult;
        if (Math.random() < chance) triggerHeavenlyPunishment();
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
    const fx = getDaoAlignmentTierEffects();
    if (ev.id === 'corruption_sting' && fx.corruptionResistPct) {
        const resist = Math.floor(8 * (fx.corruptionResistPct / 100));
        G.corruptionLevel = (G.corruptionLevel || 0) + Math.max(1, 8 - resist);
        addLog(`⛈️ Heavenly Punishment — dissonance festers; corruption gnaws at your heart! (resisted ${resist})`);
        return;
    }
    ev.apply();
    addLog(`⛈️ ${ev.log}`);
}
