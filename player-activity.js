// ============================================
// PLAYER-ACTIVITY.JS — One committed action + one repeatable routine
// Uses the living calendar. Does not add a second clock.
// ============================================

const PLAYER_ACTIVITY_CATCHUP_CAP = 48;

function ensurePlayerActivityState() {
    if (!G.playerActivityLast) G.playerActivityLast = null;
    const a = G.playerActivity;
    if (!a) {
        G.playerActivity = null;
        return;
    }
    const runnable = a.status === 'running'
        && (a.kind === 'committed' || a.kind === 'routine')
        && (a.kind === 'routine' ? a.nextSessionAtMonths != null : a.endsAtMonths != null);
    if (!runnable) G.playerActivity = null;
}

function getPlayerActivity() {
    if (typeof G === 'undefined' || !G) return null;
    return G.playerActivity && G.playerActivity.status === 'running' ? G.playerActivity : null;
}

function playerActivitySessionMonths() {
    return typeof getFocusedCultivateMonths === 'function' ? getFocusedCultivateMonths() : 1;
}

/** Next moment this activity must be rechecked. Null when nothing is running or it is already due. */
function playerActivityBoundaryMonths(ageMonths) {
    const a = getPlayerActivity();
    if (!a) return null;
    const age = Number(ageMonths) || 0;
    const boundary = a.kind === 'routine' ? a.nextSessionAtMonths : a.endsAtMonths;
    if (boundary == null || boundary <= age + 1e-9) return null;
    return boundary;
}

function playerActivityStopReason(activity) {
    if (!G || G.gameOver) return { status: 'blocked', message: 'Your journey has ended.' };
    if (G.inCombat) return { status: 'interrupted', message: 'Combat interrupts your practice.' };
    if (typeof isTribulationActive === 'function' && isTribulationActive()) {
        return { status: 'interrupted', message: 'Tribulation interrupts your practice.' };
    }
    if (typeof isTranscendencePerkPending === 'function' && isTranscendencePerkPending()) {
        return { status: 'interrupted', message: 'A choice waits before you can continue.' };
    }
    if (typeof isTimePlaybackActive === 'function' && isTimePlaybackActive()) {
        return { status: 'interrupted', message: 'Seclusion takes your full attention.' };
    }
    if (activity && activity.invalidateIfEvicted && G.dwelling && G.dwelling.mode === 'homeless') {
        return { status: 'blocked', message: 'The rented room is gone. This practice stops.' };
    }
    return null;
}

function readPlayerActivityDwellingFlag() {
    return !!(G.dwelling && G.dwelling.mode === 'rent');
}

function beginPlayerActivity(spec) {
    ensurePlayerActivityState();
    if (getPlayerActivity()) {
        if (typeof addLog === 'function') addLog(`🔒 Already ${getPlayerActivity().label}. Cancel it first.`);
        return false;
    }
    const stop = playerActivityStopReason(null);
    if (stop) {
        if (typeof addLog === 'function') addLog(`🔒 ${stop.message}`);
        return false;
    }
    const months = Math.max(0.25, Number(spec.sessionMonths) || playerActivitySessionMonths());
    const age = G.ageMonths || 0;
    const base = {
        kind: spec.kind,
        id: spec.id,
        status: 'running',
        label: spec.label,
        target: spec.target || spec.label,
        startedAtMonths: age,
        sessionMonths: months,
        awarded: false,
        sessionsCompleted: 0,
        invalidateIfEvicted: readPlayerActivityDwellingFlag()
    };
    if (spec.kind === 'routine') {
        base.nextSessionAtMonths = age + months;
        base.endsAtMonths = null;
    } else {
        base.endsAtMonths = age + months;
        base.nextSessionAtMonths = null;
    }
    G.playerActivity = base;
    G.playerActivityLast = null;
    if (typeof addLog === 'function' && spec.startLog) addLog(spec.startLog);
    if (typeof saveState === 'function') saveState();
    if (typeof renderWorldClockBar === 'function') renderWorldClockBar();
    return true;
}

function startCommittedFocusedCultivation() {
    const months = playerActivitySessionMonths();
    const playing = typeof isWorldClockPlayRequested === 'function' && isWorldClockPlayRequested();
    return beginPlayerActivity({
        kind: 'committed',
        id: 'focused_cultivate',
        label: 'Focused cultivation',
        target: 'Closed-door session',
        sessionMonths: months,
        startLog: playing
            ? `🧘 You close the door for focused cultivation — ${months} month${months === 1 ? '' : 's'} on the running calendar.`
            : `🧘 You commit to one focused session — ${months} month${months === 1 ? '' : 's'}. Press Play, and choose a speed.`
    });
}

function startCultivationRoutine() {
    const months = playerActivitySessionMonths();
    return beginPlayerActivity({
        kind: 'routine',
        id: 'cultivate_routine',
        label: 'Keep cultivating',
        target: 'Focused session, then another',
        sessionMonths: months,
        startLog: `🧘 You authorise repeated focused cultivation — one session every ${months} month${months === 1 ? '' : 's'}, until you cancel or the practice becomes impossible.`
    });
}

function stopPlayerActivity(status, message) {
    const a = getPlayerActivity();
    if (!a) return false;
    G.playerActivityLast = {
        status: status || 'cancelled',
        id: a.id,
        label: a.label,
        atMonths: G.ageMonths || 0,
        message: message || ''
    };
    G.playerActivity = null;
    if (message && typeof addLog === 'function') addLog(message);
    if (typeof setWorldClockPaused === 'function') setWorldClockPaused(true);
    if (typeof saveState === 'function') saveState();
    if (typeof renderWorldClockBar === 'function') renderWorldClockBar();
    else if (typeof renderPlayerActivityPanel === 'function') renderPlayerActivityPanel();
    return true;
}

function cancelPlayerActivity() {
    const a = getPlayerActivity();
    if (!a) return false;
    return stopPlayerActivity('cancelled', `🛑 You set aside ${a.label}.`);
}

function awardFocusedActivitySession() {
    if (typeof finishFocusedCultivateProject === 'function') {
        finishFocusedCultivateProject();
        return;
    }
    if (typeof runFocusedCultivateSession === 'function') {
        const msg = runFocusedCultivateSession({ logPrefix: '🧘 Focused cultivation' });
        if (msg && typeof addLog === 'function') addLog(msg);
    }
}

function settlePlayerActivityOnce() {
    const a = getPlayerActivity();
    if (!a) return;
    const age = G.ageMonths || 0;
    const dueAt = a.kind === 'routine' ? a.nextSessionAtMonths : a.endsAtMonths;
    if (dueAt == null || age + 1e-9 < dueAt) return;

    const stop = playerActivityStopReason(a);
    if (stop) {
        stopPlayerActivity(stop.status, `🔒 ${stop.message}`);
        return;
    }
    if (a.kind === 'committed' && a.awarded) {
        stopPlayerActivity('completed', '🧘 The focused session is already complete.');
        return;
    }

    awardFocusedActivitySession();

    if (a.kind === 'committed') {
        a.awarded = true;
        stopPlayerActivity('completed', '🧘 Focused cultivation is complete. The calendar pauses.');
        return;
    }

    a.sessionsCompleted = (a.sessionsCompleted || 0) + 1;
    a.nextSessionAtMonths = (a.nextSessionAtMonths || age) + (a.sessionMonths || playerActivitySessionMonths());
    if (typeof saveState === 'function') saveState();
    if (typeof renderWorldClockBar === 'function') renderWorldClockBar();
}

function catchUpPlayerActivity() {
    let guard = 0;
    while (guard++ < PLAYER_ACTIVITY_CATCHUP_CAP) {
        const a = getPlayerActivity();
        if (!a) return;
        const dueAt = a.kind === 'routine' ? a.nextSessionAtMonths : a.endsAtMonths;
        if (dueAt == null || (G.ageMonths || 0) + 1e-9 < dueAt) return;
        const before = a.nextSessionAtMonths;
        settlePlayerActivityOnce();
        const after = getPlayerActivity();
        if (!after) return;
        if (after.kind === 'routine' && after.nextSessionAtMonths <= before) return;
    }
}

/**
 * Run one world-time span as slices that stop on the active activity's next check.
 * With no activity this is a single slice of the full duration.
 * runSlice(stepMonths) returns false to stop early.
 */
function advanceMonthsInActivitySlices(totalMonths, runSlice) {
    let left = Number(totalMonths) || 0;
    let guard = 0;
    catchUpPlayerActivity();
    while (left > 1e-9 && guard++ < 600) {
        const age = G.ageMonths || 0;
        let step = left;
        const boundary = playerActivityBoundaryMonths(age);
        if (boundary != null && boundary > age + 1e-9) step = Math.min(step, boundary - age);
        if (step <= 1e-9) break;
        const proceeded = runSlice(step);
        left -= step;
        if (proceeded === false) break;
        if ((G.ageMonths || 0) < age + step - 1e-6) break;
        catchUpPlayerActivity();
    }
}

function playerActivityProgressText(activity) {
    if (!activity) return '';
    const age = G.ageMonths || 0;
    const fmt = typeof formatDuration === 'function'
        ? formatDuration
        : (m) => `${Math.round(m * 10) / 10} mo`;
    if (activity.kind === 'committed') {
        const left = Math.max(0, (activity.endsAtMonths || age) - age);
        return left <= 1e-9 ? 'Completing…' : `${fmt(left)} left`;
    }
    const next = Math.max(0, (activity.nextSessionAtMonths || age) - age);
    const done = activity.sessionsCompleted || 0;
    return `${done} session${done === 1 ? '' : 's'} · next in ${fmt(next)}`;
}

function renderPlayerActivityPanel() {
    if (typeof document === 'undefined') return;
    const panel = document.getElementById('playerActivityPanel');
    if (!panel) return;
    const activity = getPlayerActivity();
    const onGame = document.getElementById('game-screen')?.style.display !== 'none';
    panel.hidden = !onGame || !activity;
    if (!activity) return;
    const label = document.getElementById('playerActivityLabel');
    const meta = document.getElementById('playerActivityMeta');
    const paused = typeof isWorldClockPlayRequested === 'function' && !isWorldClockPlayRequested();
    if (label) label.textContent = activity.label || 'Activity';
    if (meta) {
        const target = activity.target ? `${activity.target} · ` : '';
        const state = paused ? 'Paused' : 'Running';
        meta.textContent = `${target}${state} · ${playerActivityProgressText(activity)}`;
    }
}

function initPlayerActivityUi() {
    document.getElementById('playerActivityCancel')?.addEventListener('click', () => {
        cancelPlayerActivity();
    });
    document.getElementById('cultivationHubFocus')?.addEventListener('click', () => {
        if (startCommittedFocusedCultivation() && typeof closeCultivationHub === 'function') closeCultivationHub();
    });
    document.getElementById('cultivationHubRoutine')?.addEventListener('click', () => {
        if (startCultivationRoutine() && typeof closeCultivationHub === 'function') closeCultivationHub();
    });
}
