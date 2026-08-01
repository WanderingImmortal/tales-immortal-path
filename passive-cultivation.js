// ============================================
// PASSIVE-CULTIVATION.JS — Nightly circulation + focused sessions
// Design: docs/ideas/passive-cultivation-floor.md
// ============================================

const PASSIVE_CULTIVATION_BALANCE = {
    /** QC gather-units per week at inferior root, bare breath, no aids (≈70y to Peak). */
    passiveBaseUnitsPerWeek: 0.09,
    /** QC gather-units for one focused month (chamber / quarters / main action). */
    focusedUnitsPerMonth: 5.5,
    focusedMonths: 1,
    /** runCultivateSession yieldScale per passive week. */
    passiveYieldScale: 0.055,
    /** runCultivateSession yieldScale for a focused month. */
    focusedYieldScale: 0.82,
    /** No formal manual — raw qi breath only. */
    bareBreathMult: 0.32,
    /** Focused session multiplier vs passive week (same support stack). */
    focusedWeeksEquivalent: 6,
    dwellingPassiveMult: { homeless: 0.9, rent: 1.06, owned: 1.14 },
    logPassiveChance: 0.035
};

const BARE_CIRCULATION_METHOD_IDS = new Set(['basic_meditation_breath']);

function ensurePassiveCultivationState() {
    if (!G.passiveCultivation || typeof G.passiveCultivation !== 'object') {
        G.passiveCultivation = { weeksCirculated: 0, focusedSessions: 0 };
    }
}

/** Player holds a real cultivation manual (not bare night breath). */
function hasFormalCultivationMethod() {
    if (typeof ensureCultivationMethodState === 'function') ensureCultivationMethodState();
    const id = G.cultivationMethod?.primaryId;
    if (!id) return false;
    if (BARE_CIRCULATION_METHOD_IDS.has(id)) {
        const shelf = G.methodShelf || {};
        if (shelf[id]?.count > 0) return true;
        const studied = G.cultivationMethod?.studiedScrolls || [];
        return studied.length > 1 || (studied.length === 1 && !BARE_CIRCULATION_METHOD_IDS.has(studied[0]));
    }
    return !!getCultivationMethodDef?.(id);
}

function getBareBreathMult() {
    return hasFormalCultivationMethod() ? 1 : PASSIVE_CULTIVATION_BALANCE.bareBreathMult;
}

function getTalentGatherMult() {
    if (typeof getTalentCultivateMult === 'function') return getTalentCultivateMult();
    const g = String(G.talent?.rootGrade || G.talent?.grade || '').toLowerCase();
    if (g.includes('heaven') || g.includes('immortal')) return 2.2;
    if (g.includes('superior') || g.includes('high')) return 1.6;
    if (g.includes('medium') || g.includes('average') || g.includes('common')) return 1.25;
    return 1.0;
}

function getDwellingPassiveCultivateMult() {
    if (typeof ensureQcDepthState === 'function') ensureQcDepthState();
    const mode = G.dwelling?.mode || 'homeless';
    return PASSIVE_CULTIVATION_BALANCE.dwellingPassiveMult[mode]
        ?? PASSIVE_CULTIVATION_BALANCE.dwellingPassiveMult.homeless;
}

function getPassiveCultivationSupportMult() {
    let mult = 1;
    mult *= getBareBreathMult();
    mult *= getTalentGatherMult();
    mult *= getDwellingPassiveCultivateMult();
    if (typeof getCultivationMethodGatherMult === 'function' && hasFormalCultivationMethod()) {
        mult *= Math.max(0.85, getCultivationMethodGatherMult());
    }
    if (typeof getResidenceFormationCultivateMult === 'function') {
        mult *= getResidenceFormationCultivateMult();
    }
    if (typeof getSectCultivationMult === 'function') {
        mult *= getSectCultivationMult();
    }
    if (typeof getFactionCultivateMult === 'function') {
        mult *= getFactionCultivateMult();
    }
    return mult;
}

function getFocusedCultivationSupportMult(extraMult) {
    const b = PASSIVE_CULTIVATION_BALANCE;
    return getPassiveCultivationSupportMult() * (extraMult || 1) * (b.focusedWeeksEquivalent / 4);
}

function getPassiveGatherUnits() {
    const b = PASSIVE_CULTIVATION_BALANCE;
    return Math.max(0.02, b.passiveBaseUnitsPerWeek * getPassiveCultivationSupportMult());
}

function getFocusedGatherUnits(extraMult) {
    const b = PASSIVE_CULTIVATION_BALANCE;
    const support = getPassiveCultivationSupportMult() * (extraMult || 1);
    return Math.max(0.5, b.focusedUnitsPerMonth * support * (b.focusedWeeksEquivalent / 4));
}

/** One chamber Gather Qi week ≈ one focused week. */
function getChamberGatherProgressUnits() {
    return Math.max(0.35, getFocusedGatherUnits() / 4);
}

function canRunPassiveCultivation() {
    if (!G || G.gameOver) return false;
    if (typeof isTribulationActive === 'function' && isTribulationActive()) return false;
    if (typeof isTimePlaybackActive === 'function' && isTimePlaybackActive()) return false;
    return true;
}

function applyPassiveCultivationQiGain(yieldScale, logPrefix) {
    if (typeof runCultivateSession !== 'function') return;
    const prevDefer = G._deferringLogs;
    G._deferringLogs = true;
    G._quietTime = true;
    try {
        runCultivateSession({
            yieldScale,
            logPrefix: logPrefix || '🌙 Night circulation',
            silent: true,
            quiet: true
        });
    } finally {
        G._deferringLogs = prevDefer;
        G._quietTime = false;
    }
}

function applyPassiveCultivationBandProgress(units) {
    if (typeof isQiCondensationRealm === 'function' && isQiCondensationRealm()
        && typeof applyQcGatherBandProgress === 'function') {
        applyQcGatherBandProgress(units);
    }
}

function maybeLogPassiveCirculation() {
    if (typeof addLog !== 'function') return;
    if (Math.random() >= PASSIVE_CULTIVATION_BALANCE.logPassiveChance) return;
    const methodNote = hasFormalCultivationMethod()
        ? (typeof getCultivationMethodPathLabel === 'function' ? getCultivationMethodPathLabel() : 'your method')
        : 'bare breath';
    addLog(`🌙 Night cycles — qi stirs faintly (${methodNote}).`);
}

/** One calendar week of automatic circulation. */
function tickPassiveCultivationWeek() {
    if (!canRunPassiveCultivation()) return;
    ensurePassiveCultivationState();
    const b = PASSIVE_CULTIVATION_BALANCE;
    const yieldScale = b.passiveYieldScale * getPassiveCultivationSupportMult();
    applyPassiveCultivationQiGain(yieldScale);
    applyPassiveCultivationBandProgress(getPassiveGatherUnits());
    G.passiveCultivation.weeksCirculated = (G.passiveCultivation.weeksCirculated || 0) + 1;
    maybeLogPassiveCirculation();
}

/** Batch passive ticks when time jumps in paused / action mode. */
function tickPassiveCultivationForMonths(months) {
    const m = Number(months) || 0;
    if (m <= 0 || !canRunPassiveCultivation()) return;
    if (typeof isWorldClockLive === 'function' && isWorldClockLive()) return;
    const weeks = Math.max(1, Math.round(m * (typeof WORLD_CLOCK_WEEK_MONTHS !== 'undefined' ? 1 / WORLD_CLOCK_WEEK_MONTHS : 4)));
    for (let i = 0; i < weeks; i++) tickPassiveCultivationWeek();
}

function getFocusedCultivateMonths() {
    return PASSIVE_CULTIVATION_BALANCE.focusedMonths;
}

function getFocusedCultivateBlockReason() {
    if (typeof getActionBlockReason === 'function') {
        const block = getActionBlockReason();
        if (block) return block;
    }
    if (typeof getWorldClockBusyReason === 'function') {
        const busy = getWorldClockBusyReason();
        if (busy) return busy;
    }
    return null;
}

/** Deliberate closed-door session — much stronger than nightly circulation. */
function runFocusedCultivateSession(options) {
    const opts = options || {};
    const b = PASSIVE_CULTIVATION_BALANCE;
    const extraMult = opts.extraMult || 1;
    const yieldScale = b.focusedYieldScale * getFocusedCultivationSupportMult(extraMult);
    let msg = '';
    if (typeof runCultivateSession === 'function') {
        msg = runCultivateSession({
            yieldScale,
            extraMult: opts.extraMult || 1,
            extraFoundation: opts.extraFoundation || 0,
            bonusNoteParts: opts.bonusNoteParts || [],
            logPrefix: opts.logPrefix || '🧘 Focused cultivation'
        }) || '';
    }
    applyPassiveCultivationBandProgress(getFocusedGatherUnits(extraMult));
    ensurePassiveCultivationState();
    G.passiveCultivation.focusedSessions = (G.passiveCultivation.focusedSessions || 0) + 1;
    return msg;
}

function finishFocusedCultivateProject() {
    const msg = runFocusedCultivateSession({ logPrefix: '🧘 Focused cultivation' });
    if (msg && typeof addLog === 'function') addLog(msg);
    if (typeof triggerTutorial === 'function') triggerTutorial('first_cultivate');
}

function actionFocusedCultivate() {
    const block = getFocusedCultivateBlockReason();
    if (block) {
        if (typeof addLog === 'function') addLog(`🔒 ${block}`);
        if (typeof fullRender === 'function') fullRender();
        return;
    }
    const months = getFocusedCultivateMonths();
    if (typeof isWorldClockLive === 'function' && isWorldClockLive()
        && typeof startWorldClockProject === 'function') {
        startWorldClockProject({
            id: 'focused_cultivate',
            kind: 'cultivate',
            label: 'Focused cultivation',
            durationMonths: months,
            startLog: `🧘 You close the door for focused cultivation — about ${months} month${months === 1 ? '' : 's'}.`
        });
        if (typeof triggerTutorial === 'function') triggerTutorial('first_cultivate');
        if (typeof fullRender === 'function') fullRender();
        return;
    }
    if (typeof beginActionLog === 'function') beginActionLog();
    if (typeof advanceTime === 'function' && !advanceTime(months, 'Focused cultivation')) {
        if (typeof cancelActionLog === 'function') cancelActionLog();
        if (typeof fullRender === 'function') fullRender();
        return;
    }
    const msg = runFocusedCultivateSession({ logPrefix: '🧘 Focused cultivation' });
    if (typeof commitActionLog === 'function') commitActionLog(msg);
    else if (msg && typeof addLog === 'function') addLog(msg);
    if (typeof triggerTutorial === 'function') triggerTutorial('first_cultivate');
    if (typeof fullRender === 'function') fullRender();
}

function getPassiveCirculationStatusLine() {
    if (!canRunPassiveCultivation()) return '';
    const method = hasFormalCultivationMethod()
        ? 'manual'
        : 'bare breath';
    const units = getPassiveGatherUnits();
    const weeklyPct = Math.max(1, Math.round((units / (PASSIVE_CULTIVATION_BALANCE.passiveBaseUnitsPerWeek || 0.09)) * 100));
    return `🌙 Circulating (${method}) · ~${weeklyPct}% passive pace`;
}
