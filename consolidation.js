// ============================================
// CONSOLIDATION.JS — Foundation through realm mastery
// ============================================

function ensureConsolidationState() {
    if (!G.realmConsolidation) G.realmConsolidation = {};
    if (!G.consolidationBonuses) {
        G.consolidationBonuses = { breakthrough: 0, techniqueDmgPct: 0, daoSpeedPct: 0, allStatsPct: 0, mentalResistPct: 0 };
    }
    // TODO: cracked foundation debuff — stackable condition from Hasty breaks; heal via scar_salve, arrays, elder_hua, forbidden grounds
    if (G.foundationCracks == null) G.foundationCracks = 0;
}

function migrateConsolidationState() {
    ensureConsolidationState();
    // Fix older saves that auto-marked the current realm as consolidated.
    if (G.realmConsolidation[G.realmIdx]?.migrated) {
        delete G.realmConsolidation[G.realmIdx];
    }
    if (G._consolidationMigrated) return;
    for (let i = 0; i < G.realmIdx; i++) {
        if (!G.realmConsolidation[i]?.done) {
            G.realmConsolidation[i] = { done: true, perfect: false, tier: 'settled', migrated: true };
        } else if (!G.realmConsolidation[i].tier) {
            const entry = G.realmConsolidation[i];
            entry.tier = entry.perfect ? 'perfect' : 'settled';
        }
    }
    if (G.realmConsolidation[G.realmIdx]?.done && !G.realmConsolidation[G.realmIdx].tier) {
        const entry = G.realmConsolidation[G.realmIdx];
        entry.tier = entry.perfect ? 'perfect' : 'settled';
    }
    G._consolidationMigrated = true;
}

function getConsolidationDef(realmIdx) {
    return CONSOLIDATION_BY_REALM[realmIdx] || null;
}

function getPathCapstone() {
    return PATHS[G.path]?.capstone || PATHS.qi.capstone;
}

function getStatTotal() {
    return getCultivationPowerStat() + G.vitality + G.spirit + G.will;
}

function getQiPathProgressPct() {
    const def = getConsolidationDef(G.realmIdx);
    if (!def) return 0;
    const peak = def.peak;
    const maxQi = getMaxQi();
    const fillNeed = Math.floor(maxQi * (peak.qiFillRatio || 0.85));
    const densityNeed = peak.minQiDensity || 1.5;
    const statNeed = peak.minTotalStats || 1;
    const meridianNeed = peak.minMeridians || 0;

    const checks = [
        { w: 0.35, p: Math.min(1, G.qi / Math.max(1, fillNeed)) },
        { w: 0.25, p: Math.min(1, getQiDensity() / densityNeed) },
        { w: 0.25, p: Math.min(1, getStatTotal() / statNeed) }
    ];
    if (meridianNeed > 0) {
        checks.push({ w: 0.15, p: Math.min(1, getMeridianOpenCount() / meridianNeed) });
    }
    const totalW = checks.reduce((s, c) => s + c.w, 0);
    return Math.round(checks.reduce((s, c) => s + c.w * c.p, 0) / totalW * 100);
}

function getChamberLayerPathProgressPct(layerOrder, getLayerProgress) {
    if (!layerOrder?.length || typeof getLayerProgress !== 'function') return 0;
    const realmLayerIdx = Math.min(G.realmIdx, layerOrder.length - 1);
    let totalPct = 0;
    for (let i = 0; i <= realmLayerIdx; i++) {
        totalPct += i < realmLayerIdx ? 100 : getLayerProgress(layerOrder[i]);
    }
    return Math.round(totalPct / (realmLayerIdx + 1));
}

function getRealmProgressPct() {
    const def = getConsolidationDef(G.realmIdx);
    if (!def) return isRealmConsolidated(G.realmIdx) ? 100 : 0;

    let pct;
    if (G.path === 'body' && typeof getBodyRealmProgressPct === 'function') {
        pct = getBodyRealmProgressPct();
    } else if (G.path === 'soul' && typeof getSoulRealmProgressPct === 'function') {
        pct = getSoulRealmProgressPct();
    } else {
        pct = getQiPathProgressPct();
    }

    if (G.realmPeakGrindBoost) {
        pct = Math.min(REALM_PROGRESS_TIERS.peakPct, pct + G.realmPeakGrindBoost);
    }
    return Math.min(REALM_PROGRESS_TIERS.peakPct, Math.max(0, pct));
}

function getRealmProgressTierFromPct(pct) {
    pct = pct == null ? getRealmProgressPct() : pct;
    if (pct >= REALM_PROGRESS_TIERS.peakPct) return 'peak';
    if (pct >= REALM_PROGRESS_TIERS.settledPct) return 'settled';
    if (REALM_PROGRESS_TIERS.hastyEnabled && pct >= REALM_PROGRESS_TIERS.hastyPct) return 'hasty';
    return 'insufficient';
}

function getConsolidationTier(realmIdx) {
    ensureConsolidationState();
    const entry = G.realmConsolidation[realmIdx ?? G.realmIdx];
    if (!entry?.done) return null;
    if (entry.perfect) return 'perfect';
    return entry.tier || 'peak';
}

function getBreakthroughTierScale(tier) {
    return BREAKTHROUGH_TIER_SCALE[tier] || BREAKTHROUGH_TIER_SCALE.peak;
}

function getPeakProgress() {
    const def = getConsolidationDef(G.realmIdx);
    if (!def) return { ready: false, reasons: ['No consolidation defined for this realm.'] };

    const peak = def.peak;
    const maxQi = getMaxQi();
    const fillNeed = Math.floor(maxQi * (peak.qiFillRatio || 0.85));
    const densityNeed = peak.minQiDensity || 1.5;
    const reasons = [];
    let ready = true;

    if (G.qi < fillNeed) {
        ready = false;
        reasons.push(`Dantian ${G.qi}/${fillNeed} Qi (${Math.round((peak.qiFillRatio || 0.85) * 100)}% full)`);
    }
    if (getQiDensity() < densityNeed) {
        ready = false;
        reasons.push(`Density ${getQiDensity()}/${densityNeed} (cultivate to refine)`);
    }
    if (getStatTotal() < (peak.minTotalStats || 0)) {
        ready = false;
        reasons.push(`Cultivation ${Math.floor(getStatTotal())}/${peak.minTotalStats}`);
    }
    if ((peak.minMeridians || 0) > getMeridianOpenCount()) {
        ready = false;
        reasons.push(`Meridians ${getMeridianOpenCount()}/${peak.minMeridians}`);
    }
    if (ready) reasons.push(`At ${def.peakLabel}.`);

    return { ready, reasons, fillNeed, densityNeed, def };
}

function isAtRealmPeak() {
    return getRealmProgressPct() >= REALM_PROGRESS_TIERS.peakPct
        && (G.path !== 'qi' || getPeakProgress().ready);
}

function isRealmConsolidated(realmIdx) {
    ensureConsolidationState();
    return !!(G.realmConsolidation[realmIdx]?.done);
}

function canBreakthroughToNextRealm() {
    return isRealmConsolidated(G.realmIdx);
}

function canSealAtCurrentProgress() {
    if (isRealmConsolidated(G.realmIdx)) return false;
    const tier = getRealmProgressTierFromPct();
    return tier === 'settled' || tier === 'peak';
}

function getConsolidationBlockReason() {
    if (canBreakthroughToNextRealm()) return null;
    const def = getConsolidationDef(G.realmIdx);
    if (!def) return 'Consolidation not available at this realm.';
    const pct = getRealmProgressPct();
    const capstone = getPathCapstone();
    if (pct < REALM_PROGRESS_TIERS.settledPct) {
        return `${pct}% realm progress — reach ${REALM_PROGRESS_TIERS.settledPct}% (Settled) via cultivation chambers, then ${capstone.settledAction}.`;
    }
    return `${capstone.settledAction} at ${getRealm()} before attempting breakthrough.`;
}

function getConsolidationStoneCost(def, perfect) {
    if (typeof isPlaytestMode === 'function' && typeof getPlaytestOption === 'function'
        && isPlaytestMode() && getPlaytestOption('freeConsolidate')) {
        return 0;
    }
    let cost = def.stones || 0;
    if (perfect && def.perfect?.extraStones) cost += def.perfect.extraStones;
    return cost;
}

function canAffordConsolidation(def, perfect) {
    const stones = getConsolidationStoneCost(def, perfect);
    if (G.stones < stones) return { ok: false, message: `Need ${stones} Spirit Stones (have ${G.stones}).` };
    return { ok: true, stones };
}

function canPerfectConsolidation(def) {
    if (!def?.perfect) return { ok: false, message: 'No perfect path for this realm.' };
    if (!isAtRealmPeak()) return { ok: false, message: 'Perfect consolidation requires Peak (100%) progress.' };
    const p = def.perfect;
    if ((p.minMeridians || 0) > getMeridianOpenCount()) {
        return { ok: false, message: `Perfect requires ${p.minMeridians} open meridians.` };
    }
    const afford = canAffordConsolidation(def, true);
    if (!afford.ok) return afford;
    return { ok: true };
}

function getMiniTribulationPreview() {
    const severity = 14 + G.realmIdx * 5;
    let resist = getEffectiveFoundation() * 3 + G.will * 0.9 + G.spirit * 0.9 + getQiDensity() * 2
        + Math.floor((G.lightningResist || 0) / 4);
    if (typeof getTranscendenceTribulationResistPct === 'function') {
        resist = Math.floor(resist * (1 + getTranscendenceTribulationResistPct()));
    }
    return { severity, resist: Math.round(resist), likely: resist >= severity };
}

function resolveConsolidationMiniTribulation() {
    const { severity, resist, likely } = getMiniTribulationPreview();
    const passed = resist >= severity;
    addLog(passed
        ? `⚡ Mini-tribulation weathered! (${resist} vs ${severity})`
        : `💀 Mini-tribulation overwhelms you! (${resist} vs ${severity}) — Foundation and density were not enough.`);
    return passed;
}

function showConsolidateFeedback(message, isError) {
    const el = document.getElementById('consolidateFeedback');
    if (!el) return;
    el.textContent = message || '';
    el.className = 'consolidate-feedback' + (isError ? ' consolidate-feedback-error' : ' consolidate-feedback-ok');
}

function failConsolidation(message) {
    showConsolidateFeedback(message, true);
    addLog(`🏛️ ${message}`);
    renderConsolidatePopup();
    fullRender();
    return { success: false, message };
}

function validateConsolidationSpecialCosts(def, sacrificeTechName) {
    if (def.sacrificeTechnique) {
        if (!sacrificeTechName) return { ok: false, message: 'Choose a technique to sacrifice.' };
        if (!G.techniques.some(t => t.name === sacrificeTechName)) return { ok: false, message: 'Technique not found.' };
        if (G.techniques.length <= 1) return { ok: false, message: 'You cannot sacrifice your only technique.' };
    }
    if (def.legendaryMaterial && !G.legendaryMaterials?.length) {
        return { ok: false, message: 'Need a legendary material from exploration.' };
    }
    if (def.daoFragment && !G.daoFragments?.length) {
        return { ok: false, message: 'Need a Dao Fragment to consolidate insight.' };
    }
    return { ok: true };
}

function consumeConsolidationSpecialCosts(def, sacrificeTechName) {
    if (def.sacrificeTechnique) {
        const idx = G.techniques.findIndex(t => t.name === sacrificeTechName);
        const tech = G.techniques.splice(idx, 1)[0];
        addLog(`🔥 You burn the essence of ${tech.name} to anchor your foundation.`);
    }
    if (def.legendaryMaterial) {
        const mat = G.legendaryMaterials.pop();
        addLog(`🏆 Offered ${mat} to the void altar.`);
    }
    if (def.daoFragment) {
        const frag = G.daoFragments.pop();
        addLog(`📜 Dao insight from "${frag}" merges into your foundation.`);
    }
}

function applyPerfectConsolidationBonuses(permanent) {
    if (!permanent) return;
    ensureConsolidationState();
    if (permanent.breakthrough) G.consolidationBonuses.breakthrough += permanent.breakthrough;
    if (permanent.techniqueDmgPct) G.consolidationBonuses.techniqueDmgPct += permanent.techniqueDmgPct;
    if (permanent.daoSpeedPct) G.consolidationBonuses.daoSpeedPct += permanent.daoSpeedPct;
    if (permanent.allStatsPct) G.consolidationBonuses.allStatsPct += permanent.allStatsPct;
    if (permanent.mentalResistPct) G.consolidationBonuses.mentalResistPct += permanent.mentalResistPct;
}

function applyConsolidationQiGains(def, perfect, tierScale) {
    tierScale = tierScale || BREAKTHROUGH_TIER_SCALE.peak;
    const maxQiGain = Math.floor((def.maxQiGain || 0) * tierScale.maxQiMult);
    const densityGain = Math.round(((def.qiDensityGain || 0) * tierScale.densityMult) * 10) / 10;
    if (maxQiGain) G.maxQiBonus = (G.maxQiBonus || 0) + maxQiGain;
    if (densityGain) G.qiDensity = (G.qiDensity || 0) + densityGain;
    if (perfect) {
        G.maxQiBonus = (G.maxQiBonus || 0) + QI_BALANCE.perfectConsolidateMaxQiBonus;
        G.qiDensity = (G.qiDensity || 0) + QI_BALANCE.perfectConsolidateDensityBonus;
    }
    G.qi = getMaxQi();
    clampCurrentQi();
    return { maxQiGain, densityGain };
}

function getConsolidationBreakBonus() {
    ensureConsolidationState();
    return G.consolidationBonuses.breakthrough || 0;
}

function getConsolidationTechniqueDmgMult() {
    ensureConsolidationState();
    return 1 + (G.consolidationBonuses?.techniqueDmgPct || 0);
}

function getConsolidationDaoSpeedMult() {
    ensureConsolidationState();
    return 1 + (G.consolidationBonuses?.daoSpeedPct || 0);
}

function getBreakthroughTierForRealm(realmIdx) {
    return getConsolidationTier(realmIdx) || 'peak';
}

function getBreakthroughLifespanPreview(realmIdx, tier) {
    realmIdx = realmIdx ?? G.realmIdx;
    tier = tier || getBreakthroughTierForRealm(realmIdx);
    const scale = getBreakthroughTierScale(tier);
    const nextCap = getLifespanForRealm(realmIdx);
    const gainedMonths = Math.max(0, nextCap - G.lifespanMonths);
    const scaledGain = Math.floor(gainedMonths * scale.lifespanMult);
    return {
        tier,
        scale,
        currentLifespan: G.lifespanMonths,
        nextCap,
        gainedYears: Math.floor(scaledGain / 12),
        peakGainedYears: Math.floor(gainedMonths / 12),
        remainingYears: getYearsRemaining()
    };
}

function getPeakGrindEstimate() {
    const pct = getRealmProgressPct();
    if (pct >= REALM_PROGRESS_TIERS.peakPct) return { months: 0, pct, canGrind: false };
    if (pct < REALM_PROGRESS_TIERS.settledPct) return { months: null, pct, canGrind: false };

    const cfg = PEAK_GRIND_BY_PATH[G.path] || PEAK_GRIND_BY_PATH.qi;
    const gap = REALM_PROGRESS_TIERS.peakPct - pct;
    const actions = Math.max(1, Math.ceil(gap / (cfg.progressBoost || 18)));
    return {
        months: actions * cfg.months,
        pct,
        canGrind: true,
        label: cfg.label,
        actions
    };
}

function getBreakthroughTierComparison() {
    const pct = getRealmProgressPct();
    const settledPreview = getBreakthroughLifespanPreview(G.realmIdx, 'settled');
    const peakPreview = getBreakthroughLifespanPreview(G.realmIdx, 'peak');
    const def = getConsolidationDef(G.realmIdx);
    const settledFoundation = def ? Math.floor(def.foundationGain * BREAKTHROUGH_TIER_SCALE.settled.foundationMult) : 0;
    const peakFoundation = def?.foundationGain || 0;
    const grind = getPeakGrindEstimate();
    return {
        pct,
        tier: getRealmProgressTierFromPct(pct),
        settledPreview,
        peakPreview,
        settledFoundation,
        peakFoundation,
        foundationDelta: peakFoundation - settledFoundation,
        grind,
        remainingYears: getYearsRemaining()
    };
}

function executePeakGrind() {
    if (actionBlocked()) return failConsolidation('Cannot grind right now.');
    if (isRealmConsolidated(G.realmIdx)) return failConsolidation('This realm is already sealed.');
    const grind = getPeakGrindEstimate();
    if (!grind.canGrind) return failConsolidation('Reach Settled (80%) before peak grind.');

    const cfg = PEAK_GRIND_BY_PATH[G.path] || PEAK_GRIND_BY_PATH.qi;
    if (!advanceTime(cfg.months, cfg.label)) {
        return failConsolidation('Your lifespan ends...');
    }

    if (G.path === 'body' && typeof applyBodyPeakGrindBoost === 'function') {
        applyBodyPeakGrindBoost(cfg.progressBoost);
    } else if (G.path === 'soul' && typeof applySoulPeakGrindBoost === 'function') {
        applySoulPeakGrindBoost(cfg.progressBoost);
    } else {
        G.realmPeakGrindBoost = (G.realmPeakGrindBoost || 0) + cfg.progressBoost;
        const progress = getPeakProgress();
        if (progress.def?.peak) {
            const peak = progress.def.peak;
            const maxQi = getMaxQi();
            const fillNeed = Math.floor(maxQi * (peak.qiFillRatio || 0.85));
            if (G.qi < fillNeed) G.qi = Math.min(getMaxQi(), G.qi + Math.ceil((fillNeed - G.qi) * 0.35));
            if (getQiDensity() < peak.minQiDensity) {
                G.qiDensity = (G.qiDensity || 0) + 0.15;
            }
        }
    }

    const stabilityGain = typeof grantPeakGrindStability === 'function' ? grantPeakGrindStability() : 0;
    addLog(`⏳ ${cfg.label} — ${formatDuration(cfg.months)}. Realm progress → ${getRealmProgressPct()}%.${stabilityGain ? ' ' + formatPillarGrant('stability', stabilityGain) + '.' : ''}`);
    renderConsolidatePopup();
    fullRender();
    saveState();
    return { success: true };
}

function executeConsolidation(opts) {
    opts = opts || {};
    const perfect = !!opts.perfect;
    const sacrificeTechName = opts.sacrificeTechnique || null;

    showConsolidateFeedback('');

    if (actionBlocked()) return failConsolidation('Cannot consolidate right now.');
    if (isRealmConsolidated(G.realmIdx)) return failConsolidation('This realm is already consolidated.');

    const def = getConsolidationDef(G.realmIdx);
    if (!def) return failConsolidation('Consolidation not available.');

    const pct = getRealmProgressPct();
    const progressTier = getRealmProgressTierFromPct(pct);
    if (progressTier === 'insufficient' || progressTier === 'hasty') {
        return failConsolidation(getConsolidationBlockReason());
    }

    const sealTier = perfect ? 'perfect' : (progressTier === 'peak' && isAtRealmPeak() ? 'peak' : 'settled');
    if (perfect && !isAtRealmPeak()) {
        return failConsolidation('Perfect consolidation requires Peak (100%) progress.');
    }

    const tierScale = getBreakthroughTierScale(sealTier === 'perfect' ? 'peak' : sealTier);

    if (perfect) {
        const perfectCheck = canPerfectConsolidation(def);
        if (!perfectCheck.ok) return failConsolidation(perfectCheck.message);
    } else {
        const afford = canAffordConsolidation(def, false);
        if (!afford.ok) return failConsolidation(afford.message);
    }

    const specialCheck = validateConsolidationSpecialCosts(def, sacrificeTechName);
    if (!specialCheck.ok) return failConsolidation(specialCheck.message);

    const stoneCost = getConsolidationStoneCost(def, perfect);
    if (G.stones < stoneCost) return failConsolidation(`Need ${stoneCost} Spirit Stones.`);

    if (def.miniTribulation && !resolveConsolidationMiniTribulation()) {
        if (!advanceTime(Math.floor(def.months / 2), 'Recovering from failed mini-tribulation')) {
            return failConsolidation('Your lifespan ends...');
        }
        return failConsolidation('Mini-tribulation failed. Recover, then try again.');
    }

    consumeConsolidationSpecialCosts(def, sacrificeTechName);

    const capstone = getPathCapstone();
    const activityLabel = sealTier === 'peak' || sealTier === 'perfect'
        ? capstone.peakAction
        : capstone.settledAction;
    if (!advanceTime(def.months, `${perfect ? 'Perfect' : activityLabel} — ${def.peakLabel}`)) {
        return failConsolidation('Your lifespan ends...');
    }

    G.stones -= stoneCost;

    let stabilityGain = Math.floor(def.foundationGain * tierScale.foundationMult);
    if (perfect && def.perfect) {
        stabilityGain += def.perfect.bonusFoundation || 0;
        applyPerfectConsolidationBonuses(def.perfect.permanent);
        addLog(`🌟 PERFECT CONSOLIDATION — ${def.perfect.flavor}`);
    }

    const grantedStability = typeof grantConsolidationStability === 'function'
        ? grantConsolidationStability(stabilityGain)
        : stabilityGain;
    const qiGains = applyConsolidationQiGains(def, perfect, tierScale);
    ensureConsolidationState();
    G.realmConsolidation[G.realmIdx] = {
        done: true,
        perfect,
        tier: perfect ? 'perfect' : sealTier,
        progressPct: pct,
        atMonths: G.ageMonths,
        foundationGain: grantedStability,
        stabilityGain: grantedStability
    };
    G.realmPeakGrindBoost = 0;

    const tierLabel = perfect ? 'Perfect' : getBreakthroughTierScale(sealTier).label;
    addLog(`🏛️ ${getRealm()} sealed (${tierLabel}). ${formatPillarGrant('stability', grantedStability)}, +${qiGains.maxQiGain || 0} Max Qi cap, +${qiGains.densityGain || 0} Density.`);
    addLog(`   ↳ "${perfect ? def.perfect.flavor : (sealTier === 'peak' ? capstone.peakFlavor : capstone.settledFlavor)}"`);
    if (stoneCost > 0) addLog(`   ↳ −${stoneCost} Spirit Stones.`);

    document.getElementById('consolidatePopup')?.classList.remove('active');
    showConsolidateFeedback('');
    fullRender();
    saveState();
    return { success: true, message: `${formatPillarGrant('stability', grantedStability)}.` };
}

function actionConsolidate() {
    if (actionBlocked()) return;
    const def = getConsolidationDef(G.realmIdx);
    if (!def) {
        addLog(`🏛️ No consolidation rite exists for ${getRealm()}.`);
        fullRender();
        return;
    }
    if (isRealmConsolidated(G.realmIdx)) {
        addLog(`🏛️ You have already sealed ${getRealm()}.`);
        fullRender();
        return;
    }
    showConsolidateFeedback('');
    renderConsolidatePopup();
    document.getElementById('consolidatePopup')?.classList.add('active');
    if (typeof triggerTutorial === 'function') triggerTutorial('first_consolidation');
}

function renderConsolidatePopup() {
    const def = getConsolidationDef(G.realmIdx);
    if (!def) return;

    const capstone = getPathCapstone();
    const pct = getRealmProgressPct();
    const progressTier = getRealmProgressTierFromPct(pct);
    const progress = getPeakProgress();
    const perfectCheck = canPerfectConsolidation(def);
    const afford = canAffordConsolidation(def, false);
    const affordPerfect = canAffordConsolidation(def, true);
    const mini = def.miniTribulation ? getMiniTribulationPreview() : null;
    const comparison = getBreakthroughTierComparison();

    document.getElementById('consolidateTitle').textContent = `${capstone.button} — ${getRealm()}`;
    document.getElementById('consolidatePeak').textContent = progressTier === 'peak'
        ? `✅ ${def.peakLabel} (${pct}%)`
        : progressTier === 'settled'
            ? `⏳ Settled (${pct}%) — ${capstone.settledAction} available · Peak grind optional`
            : `⏳ ${pct}% — reach ${REALM_PROGRESS_TIERS.settledPct}% via cultivation chambers`;

    const tierCompareEl = document.getElementById('consolidateTierCompare');
    if (tierCompareEl) {
        const lines = [];
        if (comparison.grind.canGrind) {
            lines.push(`⏳ Peak grind: ~${formatDuration(comparison.grind.months)} to reach 100% (${comparison.grind.label})`);
        }
        if (progressTier === 'settled' || progressTier === 'peak') {
            lines.push(`🕯️ Break at Settled (${pct}%): +${comparison.settledPreview.gainedYears}y lifespan vs +${comparison.peakPreview.peakGainedYears}y at Peak`);
            lines.push(`🏛️ Stability: +${comparison.settledFoundation} (Settled) vs +${comparison.peakFoundation} (Peak)`);
        }
        lines.push(`🕯️ Your lifespan: ${comparison.remainingYears === Infinity ? 'Immortal' : comparison.remainingYears + ' years remaining'}`);
        tierCompareEl.innerHTML = lines.map(line => `<div class="consolidate-req tier-compare">${line}</div>`).join('');
    }

    const settledFoundation = Math.floor(def.foundationGain * BREAKTHROUGH_TIER_SCALE.settled.foundationMult);
    const reqLines = [
        `⏳ ${def.months} months seclusion`,
        def.stones ? `💎 ${def.stones} Spirit Stones` : null,
        def.sacrificeTechnique ? '📜 Sacrifice one technique' : null,
        def.miniTribulation ? `⚡ Mini-tribulation (~${mini.resist} vs ${mini.severity}${mini.likely ? ', favored' : ', risky'})` : null,
        def.legendaryMaterial ? '🏆 Offer one legendary material' : null,
        def.daoFragment ? '📜 Offer one Dao Fragment' : null,
        progressTier === 'peak'
            ? `🏛️ +${def.foundationGain} Stability · +${def.maxQiGain || 0} Max Qi · +${def.qiDensityGain || 0} Density (Peak)`
            : `🏛️ +${settledFoundation} Stability (Settled) · full rewards at Peak`
    ].filter(Boolean);

    document.getElementById('consolidateRequirements').innerHTML = reqLines
        .map(line => `<div class="consolidate-req">${line}</div>`).join('');

    const perfectLines = def.perfect ? [
        `🌟 +${def.perfect.bonusFoundation} bonus Stability (Peak only)`,
        def.perfect.extraStones ? `💎 Total ${getConsolidationStoneCost(def, true)} Stones` : null,
        def.perfect.minMeridians ? `☯️ Requires ${def.perfect.minMeridians} meridians` : null,
        `✨ +${QI_BALANCE.perfectConsolidateMaxQiBonus} Max Qi · +${QI_BALANCE.perfectConsolidateDensityBonus} Density`,
        def.perfect.permanent?.breakthrough ? `✨ Permanent +${def.perfect.permanent.breakthrough}% break chance` : null
    ].filter(Boolean) : [];

    document.getElementById('consolidatePerfectInfo').innerHTML = perfectLines.length
        ? perfectLines.map(line => `<div class="consolidate-req perfect">${line}</div>`).join('')
        : '<div class="consolidate-req">—</div>';

    const techRow = document.getElementById('consolidateTechRow');
    if (techRow) {
        if (def.sacrificeTechnique && G.techniques.length > 1) {
            techRow.classList.remove('hidden');
            document.getElementById('consolidateTechSelect').innerHTML = G.techniques.map(t =>
                `<option value="${t.name}">${t.name}</option>`).join('');
        } else if (def.sacrificeTechnique) {
            techRow.classList.remove('hidden');
            document.getElementById('consolidateTechSelect').innerHTML =
                '<option value="">Need at least 2 techniques</option>';
        } else {
            techRow.classList.add('hidden');
        }
    }

    const btnStandard = document.getElementById('consolidateConfirm');
    const btnPerfect = document.getElementById('consolidatePerfect');
    const btnGrind = document.getElementById('consolidatePeakGrind');
    const canSeal = canSealAtCurrentProgress();

    if (btnStandard) {
        btnStandard.disabled = !canSeal || !afford.ok;
        btnStandard.textContent = progressTier === 'peak' && isAtRealmPeak()
            ? capstone.peakAction
            : capstone.settledAction;
        btnStandard.title = !canSeal ? getConsolidationBlockReason() : (!afford.ok ? afford.message : 'Seal this realm');
    }
    if (btnPerfect) {
        const blocked = !isAtRealmPeak() || !perfectCheck.ok || !affordPerfect.ok;
        btnPerfect.disabled = blocked;
        btnPerfect.title = !isAtRealmPeak() ? 'Requires Peak (100%) progress'
            : (!perfectCheck.ok ? perfectCheck.message : (!affordPerfect.ok ? affordPerfect.message : def.perfect?.flavor || ''));
    }
    if (btnGrind) {
        const grind = comparison.grind;
        btnGrind.classList.toggle('hidden', !grind.canGrind || isRealmConsolidated(G.realmIdx));
        btnGrind.disabled = !grind.canGrind;
        btnGrind.textContent = `⏳ ${grind.label || 'Peak Grind'} (~${formatDuration(grind.months || 0)})`;
    }
}

function getConsolidationProgressSummary() {
    ensureConsolidationState();
    if (isRealmConsolidated(G.realmIdx)) {
        const entry = G.realmConsolidation?.[G.realmIdx];
        const tierLabel = entry?.perfect ? 'Perfect' : getBreakthroughTierScale(entry?.tier || 'peak').label;
        return {
            pct: 100,
            label: `Sealed (${tierLabel})`,
            ready: true,
            consolidated: true,
            tier: entry?.tier || 'peak',
            hint: 'Foundation secured — you may breakthrough when ready.'
        };
    }
    const def = getConsolidationDef(G.realmIdx);
    if (!def) {
        return { pct: 0, label: '—', ready: false, consolidated: false, hint: '' };
    }

    const pct = getRealmProgressPct();
    const progressTier = getRealmProgressTierFromPct(pct);
    const capstone = getPathCapstone();
    const atSettled = progressTier === 'settled' || progressTier === 'peak';
    const atPeak = progressTier === 'peak' && isAtRealmPeak();

    return {
        pct,
        label: atPeak ? '🔔 Peak reached!' : `${pct}% · ${getBreakthroughTierScale(progressTier).label}`,
        ready: atSettled,
        consolidated: false,
        tier: progressTier,
        hint: atPeak
            ? `Open ${capstone.button} for full rewards.`
            : atSettled
                ? `${capstone.settledAction} available — or grind to Peak for full rewards.`
                : 'Cultivate in chambers to fill realm progress.'
    };
}

function getConsolidationStatusLabel() {
    if (isRealmConsolidated(G.realmIdx)) {
        const entry = G.realmConsolidation?.[G.realmIdx];
        if (entry?.perfect) return '✅ Sealed (Perfect)';
        return `✅ Sealed (${getBreakthroughTierScale(entry?.tier || 'peak').label})`;
    }
    const pct = getRealmProgressPct();
    const tier = getRealmProgressTierFromPct(pct);
    if (tier === 'peak' && isAtRealmPeak()) return '🔔 Peak — ready to seal';
    if (tier === 'settled' || tier === 'peak') return `⏳ Settled (${pct}%) — can seal`;
    return `⏳ ${pct}% realm progress`;
}

function getConsolidationTierTribulationBonus(realmIdx) {
    const tier = getConsolidationTier(realmIdx);
    if (!tier) return 0;
    return getBreakthroughTierScale(tier).tribulationSeverityBonus || 0;
}
