// ============================================
// CONSOLIDATION.JS — Foundation through realm mastery
// ============================================

function ensureConsolidationState() {
    if (!G.realmConsolidation) G.realmConsolidation = {};
    if (!G.consolidationBonuses) G.consolidationBonuses = { breakthrough: 0, techniqueDmgPct: 0, daoSpeedPct: 0, allStatsPct: 0, mentalResistPct: 0 };
}

function migrateConsolidationState() {
    ensureConsolidationState();
    // Fix older saves that auto-marked the current realm as consolidated.
    if (G.realmConsolidation[G.realmIdx]?.migrated) {
        delete G.realmConsolidation[G.realmIdx];
    }
    if (G._consolidationMigrated) return;
    if (G.realmIdx > 0 || (G.foundation || 0) >= 5) {
        for (let i = 0; i < G.realmIdx; i++) {
            if (!G.realmConsolidation[i]?.done) {
                G.realmConsolidation[i] = { done: true, perfect: false, migrated: true };
            }
        }
    }
    G._consolidationMigrated = true;
}

function getConsolidationDef(realmIdx) {
    return CONSOLIDATION_BY_REALM[realmIdx] || null;
}

function getStatTotal() {
    return getCultivationPowerStat() + G.vitality + G.spirit + G.will;
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
    return getPeakProgress().ready;
}

function isRealmConsolidated(realmIdx) {
    ensureConsolidationState();
    return !!(G.realmConsolidation[realmIdx]?.done);
}

function canBreakthroughToNextRealm() {
    return isRealmConsolidated(G.realmIdx);
}

function getConsolidationBlockReason() {
    if (canBreakthroughToNextRealm()) return null;
    const def = getConsolidationDef(G.realmIdx);
    if (!def) return 'Consolidation not available at this realm.';
    if (!isAtRealmPeak()) {
        const progress = getPeakProgress();
        return `Not at ${def.peakLabel}. ${progress.reasons.find(r => !r.startsWith('At ')) || 'Keep cultivating.'}`;
    }
    return `Consolidate at ${getRealm()} before attempting breakthrough.`;
}

function getConsolidationStoneCost(def, perfect) {
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
    let resist = G.foundation * 3 + G.will * 0.9 + G.spirit * 0.9 + getQiDensity() * 2
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

function applyConsolidationQiGains(def, perfect) {
    if (def.maxQiGain) G.maxQiBonus = (G.maxQiBonus || 0) + def.maxQiGain;
    if (def.qiDensityGain) G.qiDensity = (G.qiDensity || 0) + def.qiDensityGain;
    if (perfect) {
        G.maxQiBonus = (G.maxQiBonus || 0) + QI_BALANCE.perfectConsolidateMaxQiBonus;
        G.qiDensity = (G.qiDensity || 0) + QI_BALANCE.perfectConsolidateDensityBonus;
    }
    G.qi = getMaxQi();
    clampCurrentQi();
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

function executeConsolidation(opts) {
    opts = opts || {};
    const perfect = !!opts.perfect;
    const sacrificeTechName = opts.sacrificeTechnique || null;

    showConsolidateFeedback('');

    if (actionBlocked()) return failConsolidation('Cannot consolidate right now.');
    if (isRealmConsolidated(G.realmIdx)) return failConsolidation('This realm is already consolidated.');

    const def = getConsolidationDef(G.realmIdx);
    if (!def) return failConsolidation('Consolidation not available.');
    if (!isAtRealmPeak()) return failConsolidation(getConsolidationBlockReason());

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

    if (!advanceTime(def.months, `${perfect ? 'Perfect' : 'Realm'} consolidation — ${def.peakLabel}`)) {
        return failConsolidation('Your lifespan ends...');
    }

    G.stones -= stoneCost;

    let foundationGain = def.foundationGain;
    if (perfect && def.perfect) {
        foundationGain += def.perfect.bonusFoundation || 0;
        applyPerfectConsolidationBonuses(def.perfect.permanent);
        addLog(`🌟 PERFECT CONSOLIDATION — ${def.perfect.flavor}`);
    }

    G.foundation += foundationGain;
    applyConsolidationQiGains(def, perfect);
    ensureConsolidationState();
    G.realmConsolidation[G.realmIdx] = {
        done: true,
        perfect,
        atMonths: G.ageMonths,
        foundationGain
    };

    addLog(`🏛️ ${getRealm()} consolidated. +${foundationGain} Foundation, +${def.maxQiGain || 0} Max Qi cap, +${def.qiDensityGain || 0} Density.`);
    addLog(`   ↳ "${def.flavor}"`);
    if (stoneCost > 0) addLog(`   ↳ −${stoneCost} Spirit Stones.`);

    document.getElementById('consolidatePopup')?.classList.remove('active');
    showConsolidateFeedback('');
    fullRender();
    saveState();
    return { success: true, message: `+${foundationGain} Foundation.` };
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
        addLog(`🏛️ You have already consolidated ${getRealm()}.`);
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

    const progress = getPeakProgress();
    const perfectCheck = canPerfectConsolidation(def);
    const afford = canAffordConsolidation(def, false);
    const affordPerfect = canAffordConsolidation(def, true);
    const mini = def.miniTribulation ? getMiniTribulationPreview() : null;

    document.getElementById('consolidateTitle').textContent = `🏛️ Consolidate — ${getRealm()}`;
    document.getElementById('consolidatePeak').textContent = progress.ready
        ? `✅ ${def.peakLabel}`
        : `⏳ Not at peak — ${progress.reasons.filter(r => !r.startsWith('At ')).join(' · ') || 'Keep cultivating.'}`;

    const reqLines = [
        `⏳ ${def.months} months seclusion`,
        def.stones ? `💎 ${def.stones} Spirit Stones` : null,
        def.sacrificeTechnique ? '📜 Sacrifice one technique' : null,
        def.miniTribulation ? `⚡ Mini-tribulation (~${mini.resist} vs ${mini.severity}${mini.likely ? ', favored' : ', risky'})` : null,
        def.legendaryMaterial ? '🏆 Offer one legendary material' : null,
        def.daoFragment ? '📜 Offer one Dao Fragment' : null,
        `🏛️ +${def.foundationGain} Foundation · +${def.maxQiGain || 0} Max Qi · +${def.qiDensityGain || 0} Density`
    ].filter(Boolean);

    document.getElementById('consolidateRequirements').innerHTML = reqLines
        .map(line => `<div class="consolidate-req">${line}</div>`).join('');

    const perfectLines = def.perfect ? [
        `🌟 +${def.perfect.bonusFoundation} bonus Foundation`,
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
    if (btnStandard) {
        const blocked = !progress.ready || !afford.ok;
        btnStandard.disabled = blocked;
        btnStandard.title = !progress.ready ? getConsolidationBlockReason() : (!afford.ok ? afford.message : 'Begin consolidation');
    }
    if (btnPerfect) {
        const blocked = !progress.ready || !perfectCheck.ok || !affordPerfect.ok;
        btnPerfect.disabled = blocked;
        btnPerfect.title = !progress.ready ? getConsolidationBlockReason()
            : (!perfectCheck.ok ? perfectCheck.message : (!affordPerfect.ok ? affordPerfect.message : def.perfect?.flavor || ''));
    }
}

function getConsolidationProgressSummary() {
    ensureConsolidationState();
    if (isRealmConsolidated(G.realmIdx)) {
        const entry = G.realmConsolidation?.[G.realmIdx];
        return {
            pct: 100,
            label: entry?.perfect ? 'Consolidated (Perfect)' : 'Consolidated',
            ready: true,
            consolidated: true,
            hint: 'Foundation secured — you may breakthrough when ready.'
        };
    }
    const def = getConsolidationDef(G.realmIdx);
    if (!def) {
        return { pct: 0, label: '—', ready: false, consolidated: false, hint: '' };
    }
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
    const pct = Math.round(checks.reduce((s, c) => s + c.w * c.p, 0) / totalW * 100);
    const progress = getPeakProgress();
    const blockers = progress.reasons.filter(r => !r.startsWith('At '));
    return {
        pct,
        label: progress.ready ? '🔔 Peak reached!' : `${pct}% toward peak`,
        ready: progress.ready,
        consolidated: false,
        hint: progress.ready
            ? 'Open Consolidate to cement your Foundation.'
            : (blockers.slice(0, 2).join(' · ') || 'Keep cultivating.')
    };
}

function getConsolidationStatusLabel() {
    if (isRealmConsolidated(G.realmIdx)) {
        const entry = G.realmConsolidation?.[G.realmIdx];
        return entry?.perfect ? '✅ Consolidated (Perfect)' : '✅ Consolidated';
    }
    if (!isAtRealmPeak()) return '⏳ Not at peak';
    return '🔔 Ready to consolidate';
}
