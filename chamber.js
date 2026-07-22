// ============================================
// CHAMBER.JS — Qi Cultivation Chamber (immersive qi path cultivation)
// ============================================
//
// PHASE PLAN
//   [x] Phase 1: Layout + Gather Qi
//   [x] Phase 2: Expand Dantian
//   [x] Phase 3: Refine Foundation (incremental chamber grind — distinct from realm seal capstone)
//   [x] Phase 4: Condense Core
//   [x] Phase 5: Balance pass (density pacing, bar scaling, animations, fractional time)
//
// BALANCE NOTES
//   • Gather: random 0.14–0.32 density / week + 7% Qi fill (~6× legacy Cultivate pace)
//   • Expand: +4 capacity, 25 stones, 2 mo CD (stone-gated consolidation-scale bumps)
//   • Refine Foundation: +2 foundation burst in chamber; realm seal capstone is separate (Consolidate/Seal)
//   • Condense: peak + tribulation gate; fail penalties slightly harsher on trib loss
//   • Bars scale to consolidation peak targets for the current realm
//   • Cultivation hub opens Qi / Body / Soul chambers — any character, any primary path
//

function ensureChamberState() {
    if (!G.chamberCooldowns) {
        G.chamberCooldowns = {
            expandDantian: 0,
            perfectFoundation: 0,
            condenseCore: 0
        };
    }
    if (G.chamberExpandCount == null) G.chamberExpandCount = 0;
    if (G.chamberFoundationCount == null) G.chamberFoundationCount = 0;
    if (G.chamberGatherCount == null) G.chamberGatherCount = 0;
    if (G.chamberCoreCondensed == null) G.chamberCoreCondensed = false;
}

function chamberWeeksToMonths(weeks) {
    const b = CHAMBER_BALANCE;
    return weeks / (b.weeksPerMonth || 4);
}

function advanceChamberWeeks(weeks, activity) {
    return advanceTime(chamberWeeksToMonths(weeks), activity);
}

function getChamberCultivateMult() {
    const sectMult = typeof getSectCultivationMult === 'function' ? getSectCultivationMult() : 1;
    const factionMult = typeof getFactionCultivateMult === 'function' ? getFactionCultivateMult() : 1;
    const traitMult = getPlayerTraitMultPct('cultivateSpeedPct', 0) * getPlayerTraitMultPct('qiEfficiencyPct', 0);
    const talentMult = typeof getCombinedCultivateMult === 'function' ? getCombinedCultivateMult() : 1;
    const legacyMult = typeof getLegacyCultivateBonusMult === 'function' ? getLegacyCultivateBonusMult() : 1;
    const bodyQiEff = typeof getBodyChamberQiEfficiencyMult === 'function' ? getBodyChamberQiEfficiencyMult() : 1;
    const methodMult = typeof getCultivationMethodGatherMult === 'function' ? getCultivationMethodGatherMult() : 1;
    return sectMult * factionMult * traitMult * talentMult * legacyMult * bodyQiEff * methodMult;
}

function getChamberDensityCap() {
    const b = CHAMBER_BALANCE;
    const def = typeof getConsolidationDef === 'function' ? getConsolidationDef(G.realmIdx) : null;
    const peakDensity = def?.peak?.minQiDensity;
    if (peakDensity) return Math.max(peakDensity * (b.densityBarHeadroom || 1.12), getQiDensity(), 1);
    return b.densityBarCapBase + G.realmIdx * b.densityBarCapPerRealm;
}

function isChamberOnCooldown(key) {
    ensureChamberState();
    const until = G.chamberCooldowns[key] || 0;
    return until > G.ageMonths;
}

function getChamberExpandDantianBlockReason() {
    const b = CHAMBER_BALANCE.expandDantian;
    if (isChamberOnCooldown('expandDantian')) return 'Your dantian is still stabilizing from the last expansion.';
    if ((G.stones || 0) < b.stones) return `Need ${b.stones} Spirit Stones (have ${G.stones || 0}).`;
    return null;
}

function getChamberPerfectFoundationBlockReason() {
    const cfg = CHAMBER_BALANCE.perfectFoundation;
    if (isChamberOnCooldown('perfectFoundation')) return 'Your foundation is still settling from the last perfection.';
    if ((G.stones || 0) < cfg.stones) return `Need ${cfg.stones} Spirit Stones (have ${G.stones || 0}).`;
    if (!G.techniques?.length) return 'Need at least one technique to sacrifice.';
    if (G.techniques.length <= 1) return 'You cannot sacrifice your only technique.';
    return null;
}

function isChamberCondenseTargetRealm() {
    return G.realmIdx === CHAMBER_BALANCE.condenseCore.targetRealmIdx;
}

function getChamberCondenseReadiness() {
    if (!isChamberCondenseTargetRealm()) {
        if (G.realmIdx < CHAMBER_BALANCE.condenseCore.targetRealmIdx) {
            return { ready: false, reason: 'Reach Foundation Establishment before condensing a core.' };
        }
        return { ready: false, reason: 'You already possess a formed core.' };
    }
    if (typeof canBreakthroughToNextRealm === 'function' && !canBreakthroughToNextRealm()) {
        const reason = typeof getConsolidationBlockReason === 'function'
            ? getConsolidationBlockReason()
            : 'Consolidate at peak before condensing a core.';
        return { ready: false, reason: reason || 'Consolidate at peak before condensing a core.' };
    }
    if (typeof isAtRealmPeak === 'function' && !isAtRealmPeak()) {
        const progress = typeof getPeakProgress === 'function' ? getPeakProgress() : null;
        const reason = progress?.reasons?.find(r => !r.startsWith('At ')) || 'Not ready to condense a core.';
        return { ready: false, reason };
    }
    const nextRealm = (G.realmIdx || 0) + 1;
    if (typeof isRealmBlockedByTalent === 'function' && isRealmBlockedByTalent(nextRealm)) {
        return { ready: false, reason: getTalentRealmCapMessage() };
    }
    return { ready: true };
}

function getChamberCondenseChance() {
    const readiness = getChamberCondenseReadiness();
    if (!readiness.ready) return 0;
    const cfg = CHAMBER_BALANCE.condenseCore;
    let chance = 40 + getEffectiveFoundation() * 1.8 + getQiDensity() * 3.5 + getQiFillRatio() * 22;
    if (typeof getBreakChance === 'function') chance += getBreakChance() * 0.12;
    if ((G.chamberFoundationCount || 0) > 0) chance += Math.min(6, G.chamberFoundationCount * 2);
    if ((G.chamberExpandCount || 0) > 0) chance += Math.min(4, G.chamberExpandCount);
    if (typeof getTalentCoreCondenseMult === 'function') chance *= getTalentCoreCondenseMult();
    return Math.max(cfg.minCondenseChance, Math.min(cfg.maxCondenseChance, Math.round(chance)));
}

function getChamberCondenseCoreBlockReason() {
    const cfg = CHAMBER_BALANCE.condenseCore;
    if (G.chamberCondensePending) return 'A nascent core already awaits heavenly tribulation.';
    if (isChamberOnCooldown('condenseCore')) return 'Your dantian needs time before another condensation attempt.';
    if ((G.stones || 0) < cfg.stones) return `Need ${cfg.stones} Spirit Stones (have ${G.stones || 0}).`;
    const readiness = getChamberCondenseReadiness();
    if (!readiness.ready) return readiness.reason;
    return null;
}

function getChamberPersistScale() {
    return 1 + Math.min(0.4, (G.chamberExpandCount || 0) * 0.04);
}

function formatChamberCooldown(untilMonths) {
    if (!untilMonths || untilMonths <= G.ageMonths) return '';
    const left = untilMonths - G.ageMonths;
    return ` (${formatDuration(left)} left)`;
}

function getChamberActionGuide(key) {
    return typeof CULTIVATION_ACTION_GUIDE !== 'undefined' ? CULTIVATION_ACTION_GUIDE[key] : null;
}

function formatChamberGatherStats() {
    const g = CHAMBER_BALANCE.gatherQi;
    const cultMult = getChamberCultivateMult();
    const minD = (g.densityGainMin * cultMult).toFixed(2);
    const maxD = (g.densityGainMax * cultMult).toFixed(2);
    const fillPct = Math.round(g.fillRatio * 100 * cultMult);
    return [
        `+${minD}–${maxD} Qi Density`,
        `Refill ~${fillPct}% of max Qi`,
        '+Root (slow); density milestones grant bonus Root',
        `${g.weeks} week${g.weeks === 1 ? '' : 's'}`
    ];
}

function formatChamberExpandStats() {
    const cfg = CHAMBER_BALANCE.expandDantian;
    const cd = formatChamberCooldown(G.chamberCooldowns.expandDantian);
    return [
        `+${cfg.maxQiBonusGain} max Qi capacity (permanent)`,
        `+Root burst`,
        `${cfg.weeks} weeks · ${cfg.stones} spirit stones`,
        `Cooldown: ${cfg.cooldownMonths} months${cd}`
    ];
}

function formatChamberFoundationStats() {
    const cfg = CHAMBER_BALANCE.perfectFoundation;
    const cd = formatChamberCooldown(G.chamberCooldowns.perfectFoundation);
    return [
        `+${cfg.foundationGain} Flow (meridian pillar)`,
        'Sacrifice 1 technique (need a spare)',
        `${cfg.weeks} weeks · ${cfg.stones} spirit stones`,
        `Cooldown: ${cfg.cooldownMonths} months${cd}`
    ];
}

function formatChamberCondenseStats() {
    const cfg = CHAMBER_BALANCE.condenseCore;
    const cd = formatChamberCooldown(G.chamberCooldowns.condenseCore);
    const chance = getChamberCondenseChance();
    return [
        'Target: Core Formation (realm advance)',
        `${cfg.months} month · ${cfg.stones} spirit stones`,
        `Form chance: ~${chance}% · then heavenly tribulation`,
        `Cooldown: ${cfg.cooldownMonths} months${cd}`
    ];
}

function chamberActionBlocked() {
    return G.gameOver || G.inCombat
        || (typeof isTribulationActive === 'function' && isTribulationActive());
}

function openQiChamber() {
    if (chamberActionBlocked()) return;
    ensureChamberState();
    G.inQiChamber = true;
    const overlay = document.getElementById('qiChamberOverlay');
    if (overlay) overlay.classList.add('active');
    renderChamberUI();
}

function closeQiChamber() {
    G.inQiChamber = false;
    hideChamberTechPicker();
    document.getElementById('qiChamberOverlay')?.classList.remove('active');
    fullRender();
}

function hideChamberTechPicker() {
    const picker = document.getElementById('chamberTechPicker');
    if (picker) picker.hidden = true;
    document.getElementById('chamberTechPickerList')?.replaceChildren();
}

function showChamberTechPicker(onPick) {
    hideChamberTechPicker();
    const list = document.getElementById('chamberTechPickerList');
    const picker = document.getElementById('chamberTechPicker');
    if (!list || !picker || typeof onPick !== 'function') return;
    G.techniques.forEach(tech => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chamber-tech-pick-btn';
        const tpl = typeof getTechniqueTemplate === 'function' ? getTechniqueTemplate(tech.name) : null;
        const cat = tech.category || tpl?.category || 'attack';
        const icon = { attack: '⚔️', defense: '🛡️', buff: '✨', utility: '📜' }[cat] || '📜';
        const tier = typeof getTechniqueTier === 'function' ? getTechniqueTier(tech.uses || 0) : null;
        btn.textContent = `${icon} ${tech.name}`;
        if (tier?.name) btn.title = tier.name;
        btn.addEventListener('click', () => {
            hideChamberTechPicker();
            onPick(tech.name);
        });
        list.appendChild(btn);
    });
    picker.hidden = false;
}

function triggerChamberAnim(kind) {
    const wrap = document.getElementById('chamberDantianWrap');
    if (!wrap) return;
    wrap.classList.remove('chamber-anim-gather', 'chamber-anim-expand', 'chamber-anim-foundation', 'chamber-anim-condense');
    void wrap.offsetWidth;
    const cls = {
        gather: 'chamber-anim-gather',
        expand: 'chamber-anim-expand',
        foundation: 'chamber-anim-foundation',
        condense: 'chamber-anim-condense'
    }[kind];
    if (!cls) return;
    wrap.classList.add(cls);
    setTimeout(() => wrap.classList.remove(cls), 1600);
}

function renderChamberUI() {
    if (!G.inQiChamber) return;
    ensureChamberState();
    if (typeof ensureCultivationMethodState === 'function') ensureCultivationMethodState();
    const density = getQiDensity();
    const densityCap = getChamberDensityCap();
    const maxQi = getMaxQi();
    const qi = G.qi != null ? G.qi : maxQi;
    const grade = typeof getFoundationGrade === 'function' ? getFoundationGrade() : null;

    const densityBar = document.getElementById('chamberDensityBar');
    const capacityBar = document.getElementById('chamberCapacityBar');
    if (densityBar) densityBar.style.width = `${Math.min(100, (density / densityCap) * 100)}%`;
    if (capacityBar) capacityBar.style.width = `${Math.min(100, (qi / Math.max(1, maxQi)) * 100)}%`;

    const densityText = document.getElementById('chamberDensityText');
    const capacityText = document.getElementById('chamberCapacityText');
    const foundationText = document.getElementById('chamberFoundationText');
    const pathText = document.getElementById('chamberCultivationPath');
    if (densityText) densityText.textContent = density.toFixed(2);
    if (capacityText) capacityText.textContent = `${qi} / ${maxQi}`;
    if (foundationText) {
        foundationText.textContent = typeof getFoundationPlayerLabel === 'function'
            ? getFoundationPlayerLabel()
            : (typeof getFoundationGradeLabel === 'function' ? getFoundationGradeLabel() : 'Crude');
    }
    if (pathText && typeof getCultivationMethodPathLabel === 'function') {
        const methodMult = typeof getCultivationMethodGatherMult === 'function'
            ? getCultivationMethodGatherMult()
            : 1;
        pathText.textContent = `Path: ${getCultivationMethodPathLabel()} (×${methodMult.toFixed(2)} gather)`;
    }

    const core = document.getElementById('chamberCore');
    const wrap = document.getElementById('chamberDantianWrap');
    if (wrap) {
        wrap.style.setProperty('--chamber-persist-scale', getChamberPersistScale().toFixed(3));
        wrap.classList.toggle('chamber-has-foundation', (G.chamberFoundationCount || 0) > 0);
        wrap.classList.toggle('chamber-has-core', !!G.chamberCoreCondensed || G.realmIdx >= 2);
        ['crude', 'firm', 'unshakable', 'peerless'].forEach(id => {
            wrap.classList.toggle(`chamber-grade-${id}`, grade?.id === id);
        });
    }
    if (core) {
        const fill = qi / Math.max(1, maxQi);
        core.style.setProperty('--chamber-core-fill', fill.toFixed(2));
        core.style.setProperty('--chamber-density-glow', Math.min(1, density / densityCap).toFixed(2));
    }

    const gatherBtn = document.getElementById('chamberGatherQi');
    const expandBtn = document.getElementById('chamberExpandDantian');
    const foundationBtn = document.getElementById('chamberPerfectFoundation');
    const coreBtn = document.getElementById('chamberCondenseCore');

    const densityGuide = getChamberActionGuide('gatherQi');
    const expandGuide = getChamberActionGuide('expandDantian');
    const foundationGuide = getChamberActionGuide('refineFoundation');
    const condenseGuide = getChamberActionGuide('condenseCore');
    if (typeof setHoverTooltip === 'function') {
        setHoverTooltip(document.getElementById('chamberDensityLabel'), STAT_GUIDE?.qiDensity?.desc || densityGuide?.desc || '');
        setHoverTooltip(document.getElementById('chamberCapacityLabel'), STAT_GUIDE?.qi?.desc || 'Max Qi your dantian can hold. Expand Dantian raises this permanently.');
        setHoverTooltip(document.getElementById('chamberFoundationLabel'), typeof getFoundationPlayerTooltip === 'function'
            ? getFoundationPlayerTooltip()
            : (STAT_GUIDE?.foundation?.desc || ''));
    } else {
        document.getElementById('chamberDensityLabel')?.setAttribute('title', STAT_GUIDE?.qiDensity?.desc || densityGuide?.desc || '');
        document.getElementById('chamberCapacityLabel')?.setAttribute('title', STAT_GUIDE?.qi?.desc || 'Max Qi your dantian can hold. Expand Dantian raises this permanently.');
        document.getElementById('chamberFoundationLabel')?.setAttribute('title', typeof getFoundationPlayerTooltip === 'function'
            ? getFoundationPlayerTooltip()
            : (STAT_GUIDE?.foundation?.desc || ''));
    }

    const gatherFlavor = document.getElementById('chamberGatherFlavor');
    const expandFlavor = document.getElementById('chamberExpandFlavor');
    const foundationFlavor = document.getElementById('chamberFoundationFlavor');
    const condenseFlavor = document.getElementById('chamberCondenseFlavor');

    if (gatherBtn) {
        const guide = getChamberActionGuide('gatherQi');
        gatherBtn.disabled = chamberActionBlocked();
        if (typeof setHoverTooltip === 'function') setHoverTooltip(gatherBtn, guide?.desc || '');
        if (gatherFlavor) gatherFlavor.textContent = guide?.flavor || '';
    }
    if (expandBtn) {
        const block = getChamberExpandDantianBlockReason();
        const guide = getChamberActionGuide('expandDantian');
        expandBtn.disabled = chamberActionBlocked() || !!block;
        if (typeof setHoverTooltip === 'function') setHoverTooltip(expandBtn, block || guide?.desc || '');
        if (expandFlavor) expandFlavor.textContent = block ? '' : (guide?.flavor || '');
    }
    if (foundationBtn) {
        const block = getChamberPerfectFoundationBlockReason();
        const guide = getChamberActionGuide('refineFoundation');
        foundationBtn.disabled = chamberActionBlocked() || !!block;
        if (typeof setHoverTooltip === 'function') setHoverTooltip(foundationBtn, block || guide?.desc || '');
        if (foundationFlavor) foundationFlavor.textContent = block ? '' : (guide?.flavor || '');
    }
    if (coreBtn) {
        const block = getChamberCondenseCoreBlockReason();
        const guide = getChamberActionGuide('condenseCore');
        coreBtn.disabled = chamberActionBlocked() || !!block;
        if (typeof setHoverTooltip === 'function') setHoverTooltip(coreBtn, block || guide?.desc || '');
        if (condenseFlavor) condenseFlavor.textContent = block ? '' : (guide?.flavor || '');
    }
}

function chamberGatherQi() {
    if (chamberActionBlocked()) return;
    ensureChamberState();
    if (typeof ensureCultivationMethodState === 'function') ensureCultivationMethodState();
    const cfg = CHAMBER_BALANCE.gatherQi;
    beginActionLog();
    if (!advanceChamberWeeks(cfg.weeks, 'Gathering Qi in the chamber')) {
        cancelActionLog();
        renderChamberUI();
        return;
    }
    const cultMult = getChamberCultivateMult();
    const qiRegMult = typeof getBodyChamberQiRegenMult === 'function' ? getBodyChamberQiRegenMult() : 1;
    const densGainRaw = cfg.densityGainMin + Math.random() * (cfg.densityGainMax - cfg.densityGainMin);
    const densGain = Math.round(densGainRaw * cultMult * 100) / 100;
    G.qiDensity = (G.qiDensity || 0) + densGain;
    const fillGain = Math.max(1, Math.floor(getMaxQi() * cfg.fillRatio * cultMult * qiRegMult));
    G.qi = Math.min(getMaxQi(), (G.qi || 0) + fillGain);
    clampCurrentQi();
    if (G.qiExhausted && G.qi > 0) G.qiExhausted = false;
    G.chamberGatherCount = (G.chamberGatherCount || 0) + 1;
    const rootGain = typeof applyChamberGatherRootGrant === 'function' ? applyChamberGatherRootGrant() : 0;
    const milestoneGain = typeof checkCultivationDensityMilestones === 'function'
        ? checkCultivationDensityMilestones() : 0;
    triggerChamberAnim('gather');
    const total = getQiDensity();
    let msg = `🌬️ You draw heaven's breath into your dantian. +${densGain.toFixed(2)} Density (${total.toFixed(2)} total), dantian +${fillGain}.`;
    if (rootGain) msg += ` ${formatPillarGrant('root', rootGain)}.`;
    if (milestoneGain) msg += ` ${formatPillarGrant('root', milestoneGain)} (density milestone).`;
    if (cultMult > 1.05) msg += ` (×${cultMult.toFixed(2)} cultivation bonus)`;
    commitActionLog(msg);
    if (typeof triggerTutorial === 'function') triggerTutorial('first_cultivate');
    renderChamberUI();
    fullRender();
}

function chamberExpandDantian() {
    if (chamberActionBlocked()) return;
    const block = getChamberExpandDantianBlockReason();
    if (block) {
        addLog(`🏺 ${block}`);
        renderChamberUI();
        return;
    }
    ensureChamberState();
    const cfg = CHAMBER_BALANCE.expandDantian;
    const beforeCap = getMaxQi();
    beginActionLog();
    if (!advanceChamberWeeks(cfg.weeks, 'Expanding dantian in the chamber')) {
        cancelActionLog();
        renderChamberUI();
        return;
    }
    G.stones -= cfg.stones;
    G.maxQiBonus = (G.maxQiBonus || 0) + cfg.maxQiBonusGain;
    G.chamberExpandCount = (G.chamberExpandCount || 0) + 1;
    const rootGain = typeof applyChamberExpandRootGrant === 'function' ? applyChamberExpandRootGrant() : 0;
    clampCurrentQi();
    G.chamberCooldowns.expandDantian = G.ageMonths + cfg.cooldownMonths;
    triggerChamberAnim('expand');
    const afterCap = getMaxQi();
    commitActionLog(`🏺 Your dantian swells to hold more Qi. +${cfg.maxQiBonusGain} Capacity (${beforeCap} → ${afterCap}), −${cfg.stones} Stones.${rootGain ? ' ' + formatPillarGrant('root', rootGain) + '.' : ''}`);
    renderChamberUI();
    fullRender();
}

function chamberPerfectFoundation() {
    if (chamberActionBlocked()) return;
    const block = getChamberPerfectFoundationBlockReason();
    if (block) {
        addLog(`🪨 ${block}`);
        renderChamberUI();
        return;
    }
    showChamberTechPicker(executeChamberPerfectFoundation);
}

function executeChamberPerfectFoundation(techName) {
    if (chamberActionBlocked()) return;
    const block = getChamberPerfectFoundationBlockReason();
    if (block) {
        addLog(`🪨 ${block}`);
        renderChamberUI();
        return;
    }
    if (!techName || !G.techniques.some(t => t.name === techName)) {
        addLog('🪨 Technique not found.');
        return;
    }
    ensureChamberState();
    const cfg = CHAMBER_BALANCE.perfectFoundation;
    const beforeFlow = typeof getCultivationPillarValue === 'function' ? getCultivationPillarValue('flow') : 0;
    beginActionLog();
    if (!advanceChamberWeeks(cfg.weeks, 'Perfecting foundation in the chamber')) {
        cancelActionLog();
        renderChamberUI();
        return;
    }
    G.stones -= cfg.stones;
    const idx = G.techniques.findIndex(t => t.name === techName);
    const sacrificed = G.techniques.splice(idx, 1)[0];
    const flowGain = typeof grantPerfectFoundationFlow === 'function'
        ? grantPerfectFoundationFlow()
        : grantCultivationPillar('flow', cfg.foundationGain);
    G.chamberFoundationCount = (G.chamberFoundationCount || 0) + 1;
    clampCurrentQi();
    G.chamberCooldowns.perfectFoundation = G.ageMonths + cfg.cooldownMonths;
    triggerChamberAnim('foundation');
    commitActionLog(`🪨 You burn ${sacrificed.name} into bedrock foundation. ${formatPillarGrant('flow', flowGain)} (${beforeFlow} → ${getCultivationPillarValue('flow')}), −${cfg.stones} Stones.`);
    renderChamberUI();
    fullRender();
}

function applyChamberCoreFormationAdvance() {
    const prev = typeof getTrackRealmIdx === 'function' ? getTrackRealmIdx('dantian') : G.realmIdx;
    const newIdx = prev + 1;
    if (typeof setTrackRealmIdx === 'function') setTrackRealmIdx('dantian', newIdx);
    else G.realmIdx++;
    G.breakAttempts = 0;
    G.maxQiBonus = (G.maxQiBonus || 0) + QI_BALANCE.breakthroughMaxQi + Math.floor(newIdx / 2);
    G.qi = getMaxQi();
    clampCurrentQi();
    G.vitality += 3;
    G.spirit += 2;
    G.will += 2;
    G.maxHp += 10 + newIdx * 2;
    if (typeof applyVitalityToMaxHp === 'function') applyVitalityToMaxHp();
    G.hp = G.maxHp;
    if (typeof addFame === 'function') addFame(5 + newIdx);
    else G.fame += 5 + newIdx;
    if (typeof extendLifespanOnBreakthrough === 'function') extendLifespanOnBreakthrough();
    if (typeof tryAwakenSoulEmbryo === 'function' && newIdx >= SOUL_EMBRYO_REALM_IDX) {
        tryAwakenSoulEmbryo('dantian');
    }
    if (typeof updateShield === 'function') updateShield();
    G.chamberCoreCondensed = true;
}

function resolveChamberCondenseAfterTribulation() {
    const pending = G.chamberCondensePending;
    if (!pending?.formed) return;
    G.chamberCondensePending = null;
    const cfg = CHAMBER_BALANCE.condenseCore;
    if (pending.tribulationPassed) {
        applyChamberCoreFormationAdvance();
        addLog(`💎 The golden core stabilizes! You are now a ${getRealm()} (${getTitle()}).`);
        addLog(`📈 Max Qi → ${getMaxQi()}, realm power surges through your meridians.`);
        if (typeof checkPerfectCultivation === 'function') checkPerfectCultivation();
    } else {
        G.chamberCoreCondensed = false;
        const loss = cfg.tribFailFoundationLoss || 3;
        const cracks = typeof applyFoundationLossAsCracks === 'function'
            ? applyFoundationLossAsCracks(loss) : 1;
        G.qi = Math.max(1, Math.floor(G.qi * 0.65));
        clampCurrentQi();
        addLog(`💥 Heaven rejects the nascent core. It shatters — ${cracks} foundation crack${cracks === 1 ? '' : 's'}.`);
    }
    fullRender();
}

function chamberCondenseCore() {
    if (chamberActionBlocked()) return;
    const block = getChamberCondenseCoreBlockReason();
    if (block) {
        addLog(`💎 ${block}`);
        renderChamberUI();
        return;
    }
    ensureChamberState();
    const cfg = CHAMBER_BALANCE.condenseCore;
    const chance = getChamberCondenseChance();
    beginActionLog();
    if (!advanceTime(cfg.months, 'Condensing core in the chamber')) {
        cancelActionLog();
        renderChamberUI();
        return;
    }
    G.stones -= cfg.stones;
    G.chamberCooldowns.condenseCore = G.ageMonths + cfg.cooldownMonths;
    const roll = Math.random() * 100;
    if (roll >= chance) {
        const loss = cfg.failFoundationLoss || 2;
        const cracks = typeof applyFoundationLossAsCracks === 'function'
            ? applyFoundationLossAsCracks(loss) : 1;
        commitActionLog(`💎 The Qi refuses to crystallize (${Math.round(chance)}% chance, rolled ${Math.round(roll)}). ${cracks} foundation crack${cracks === 1 ? '' : 's'}.`);
        renderChamberUI();
        fullRender();
        return;
    }
    G.chamberCondensePending = { formed: true };
    G.chamberCoreCondensed = true;
    triggerChamberAnim('condense');
    commitActionLog(`💎 Qi compresses into a nascent golden core (${Math.round(chance)}% chance). Heaven's tribulation descends!`);
    closeQiChamber();
    const tribOpts = { breakStyle: 'balanced', context: 'breakthrough', transitionId: 'fe_to_gc', limbo: true };
    if (typeof beginTribulationWithTutorial === 'function') {
        beginTribulationWithTutorial('balanced', tribOpts);
    } else if (typeof startTribulation === 'function') {
        startTribulation(tribOpts);
    } else {
        G.chamberCondensePending = null;
        G.chamberCoreCondensed = false;
        addLog('💎 Tribulation could not begin — the nascent core dissipates.');
    }
    fullRender();
}

function initChamberActionHelp() {
    if (typeof bindChamberActionHelp !== 'function') return;
    const g = (key) => getChamberActionGuide(key);
    bindChamberActionHelp('chamberGatherHelp', {
        title: `${g('gatherQi')?.emoji || ''} ${g('gatherQi')?.label || 'Gather Qi'}`.trim(),
        desc: g('gatherQi')?.desc,
        getStats: formatChamberGatherStats
    });
    bindChamberActionHelp('chamberExpandHelp', {
        title: `${g('expandDantian')?.emoji || ''} ${g('expandDantian')?.label || 'Expand Dantian'}`.trim(),
        desc: g('expandDantian')?.desc,
        getBlock: getChamberExpandDantianBlockReason,
        getStats: formatChamberExpandStats
    });
    bindChamberActionHelp('chamberFoundationHelp', {
        title: `${g('refineFoundation')?.emoji || ''} ${g('refineFoundation')?.label || 'Refine Foundation'}`.trim(),
        desc: g('refineFoundation')?.desc,
        getBlock: getChamberPerfectFoundationBlockReason,
        getStats: formatChamberFoundationStats
    });
    bindChamberActionHelp('chamberCondenseHelp', {
        title: `${g('condenseCore')?.emoji || ''} ${g('condenseCore')?.label || 'Condense Core'}`.trim(),
        desc: g('condenseCore')?.desc,
        getBlock: getChamberCondenseCoreBlockReason,
        getStats: formatChamberCondenseStats
    });
}

function initChamberEvents() {
    document.getElementById('chamberGatherQi')?.addEventListener('click', chamberGatherQi);
    document.getElementById('chamberReturn')?.addEventListener('click', closeQiChamber);
    document.getElementById('chamberExpandDantian')?.addEventListener('click', chamberExpandDantian);
    document.getElementById('chamberPerfectFoundation')?.addEventListener('click', chamberPerfectFoundation);
    document.getElementById('chamberTechPickerCancel')?.addEventListener('click', hideChamberTechPicker);
    document.getElementById('chamberCondenseCore')?.addEventListener('click', chamberCondenseCore);
    initChamberActionHelp();
}
