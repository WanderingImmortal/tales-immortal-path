// ============================================
// ADVANCE-TIME-RULES.JS — Time billing and shared calendar advances
// Used by core.advanceTime and scripts/audit-time-billing.js
// ============================================

/**
 * Resolve how many months an advanceTime call should bill.
 * Play/Pause on the living calendar must not change action duration.
 */
function resolveBillableAdvanceMonths(months, opts) {
    opts = opts && typeof opts === 'object' ? opts : {};
    let m = Number(months) || 0;
    if (opts.free) m = 0;
    return m;
}

/**
 * Player-driven advances with positive duration pause the living calendar
 * so automatic week flushes do not stack on top of the same span.
 */
function shouldPauseLivingClockForPlayerAdvance(months, opts) {
    opts = opts && typeof opts === 'object' ? opts : {};
    const m = Number(months) || 0;
    if (m <= 0) return false;
    const source = opts.timeSource || 'player';
    if (source !== 'player') return false;
    return !opts.keepClockPlaying;
}

/**
 * Whole calendar months crossed since lastMark, using floored month indexes.
 * A negative lastMark means "never run" — no historical backfill.
 */
function calendarMonthSteps(lastMarkedMonth, nowMonths) {
    const monthIndex = Math.floor(Number(nowMonths) || 0);
    if (lastMarkedMonth == null || lastMarkedMonth < 0) {
        return { steps: 0, nextMark: monthIndex, uninitialized: true };
    }
    const last = Math.floor(Number(lastMarkedMonth));
    if (last >= monthIndex) return { steps: 0, nextMark: monthIndex, uninitialized: false };
    return { steps: monthIndex - last, nextMark: monthIndex, uninitialized: false };
}

/**
 * How many fixed intervals fit between lastMark and now.
 * nextMark keeps the unused remainder so one large jump matches many short ones.
 */
function catchUpIntervalMarks(lastMark, now, interval, maxSteps) {
    const origin = Number(lastMark) || 0;
    const step = Number(interval) || 0;
    const cap = maxSteps || 800;
    const end = Number(now) || 0;
    if (step <= 0 || end - origin < step) return { steps: 0, nextMark: origin };
    const steps = Math.min(cap, Math.floor((end - origin) / step));
    return { steps, nextMark: origin + steps * step };
}

/** Player decisions require attention. Ordinary news and world events do not. */
function getPlayerTimeAttentionReasons() {
    const reasons = [];
    if (G.gameOver || G.sectSuccessionActive) reasons.push('Your leadership or journey has ended.');
    if (G.inCombat) reasons.push('Combat interrupts your activity.');
    if (G.encounterState) reasons.push('An encounter requires your attention.');
    if (G._pendingTribulation || (typeof isTribulationActive === 'function' && isTribulationActive())) {
        reasons.push('A tribulation interrupts your activity.');
    }
    if (typeof isTranscendencePerkPending === 'function' && isTranscendencePerkPending()) reasons.push('A perk choice requires your attention.');
    if (G.sect?.pendingEvent) reasons.push('A sect decision requires your attention.');
    if (G.ancients?.pendingBargain) reasons.push('A bargain requires your attention.');
    return reasons;
}

function getPlayerTimeAttention() {
    return getPlayerTimeAttentionReasons()[0] ?? null;
}

function isPlayerLifespanExhausted() {
    return Number.isFinite(G.lifespanMonths) && G.ageMonths >= G.lifespanMonths
        && !(typeof isImmortal === 'function' && isImmortal());
}

function handlePlayerLifespanExhaustion() {
    if (!isPlayerLifespanExhausted() || G.gameOver || G.sectSuccessionActive) return;
    if (typeof trySectLeaderSuccessionOnDeath === 'function' && trySectLeaderSuccessionOnDeath()) return;
    G.gameOver = true;
    addLog(`💀 Your lifespan ends at ${formatYears(getPlayerLifespanMonths())}. The Dao remains unclaimed...`);
    if (typeof triggerBitterReincarnation === 'function') triggerBitterReincarnation();
}

function interruptPlayerTime(reason) {
    if (typeof stopPlayerActivity === 'function') stopPlayerActivity('interrupted', reason);
    if (typeof cancelWorldClockProject === 'function') cancelWorldClockProject(null, reason);
    if (typeof clearWorldClockStance === 'function') clearWorldClockStance(true);
    if (typeof setWorldClockPaused === 'function') setWorldClockPaused(true);
}

/** A shared world span. Callers choose whether they own the time for dedicated work. */
function advanceSharedWorldTime(months, activity, options = {}) {
    const initialAge = G.ageMonths;
    const initialAttention = options.allowCurrentAttention ? getPlayerTimeAttentionReasons() : [];
    const note = () => {
        if (G.gameOver || G.sectSuccessionActive || isPlayerLifespanExhausted()) return 'Your lifespan or journey has ended.';
        const attention = getPlayerTimeAttentionReasons().find(reason => !initialAttention.includes(reason));
        if (attention) return attention;
        const projectBlock = typeof getWorldClockProjectStopReason === 'function' ? getWorldClockProjectStopReason() : null;
        if (projectBlock) return projectBlock;
        const a = typeof getPlayerActivity === 'function' ? getPlayerActivity() : null;
        return (a?.invalidateIfEvicted || options.invalidateIfEvicted) && G.dwelling?.mode === 'homeless'
            ? 'The rented room is gone. This practice stops.' : null;
    };
    let batch = [];
    let reason = note();
    let cancelled = false;
    const runSlice = step => {
        const existingActivity = typeof getPlayerActivity === 'function' ? getPlayerActivity() : null;
        const project = typeof getWorldClockProject === 'function' ? getWorldClockProject() : null;
        const from = G.ageMonths;
        const end = Math.min(from + step, project?.endsAtMonths ?? Infinity);
        const suppressPassive = options.skipPassiveCirculation || existingActivity || project?.id === 'focused_cultivate'
            || (typeof canRunPassiveCultivation === 'function' && !canRunPassiveCultivation());
        const assignmentEnded = () => (existingActivity && getPlayerActivity() !== existingActivity)
            || (project && getWorldClockProject() !== project);
        batch = batch.concat(processWorldTime(from, end, {
            activity, quiet: !!options.quiet,
            nextBoundary: now => {
                const lifespan = typeof isImmortal === 'function' && isImmortal() ? Infinity : (G.lifespanMonths ?? Infinity);
                const rent = G.dwelling?.mode === 'rent' ? G.dwelling.rentPaidThroughMonth : null;
                const board = G.wellRing?.member ? Math.floor(now + 1e-9) + 1 : Infinity;
                const sectEvent = typeof getNextSectEventBoundary === 'function' ? getNextSectEventBoundary(now) : null;
                return Math.min(lifespan, rent > now + 1e-9 ? rent : Infinity, board, sectEvent ?? Infinity);
            },
            onElapsed: elapsed => {
                if (typeof tickAlchemySupplyDecay === 'function') tickAlchemySupplyDecay(elapsed);
                if (typeof applySharedCalendarObligations === 'function') applySharedCalendarObligations();
                if (!suppressPassive && typeof tickPassiveCultivationForMonths === 'function') {
                    tickPassiveCultivationForMonths(elapsed, true);
                }
            },
            shouldStop: () => !!note() || !!assignmentEnded()
        }) || []);
        reason = note();
        cancelled = !!assignmentEnded();
        if (reason || cancelled) return false;
        if (project && typeof tickWorldClockProjectAfterAdvance === 'function') {
            tickWorldClockProjectAfterAdvance();
            reason = note();
        }
        return !reason && G.ageMonths >= from + step - 1e-9;
    };
    if (!reason) {
        if (typeof advanceMonthsInActivitySlices === 'function') advanceMonthsInActivitySlices(months, runSlice);
        else runSlice(months);
    }
    const elapsed = G.ageMonths - initialAge;
    if (reason) {
        const a = typeof getPlayerActivity === 'function' ? getPlayerActivity() : null;
        if (a?.invalidateIfEvicted && G.dwelling?.mode === 'homeless' && !getPlayerTimeAttention()
            && !isPlayerLifespanExhausted()) {
            stopPlayerActivity('blocked', reason);
        } else interruptPlayerTime(reason);
    }
    handlePlayerLifespanExhaustion();
    if (reason && typeof saveState === 'function') saveState();
    return { elapsed, batch, complete: !reason && !cancelled && elapsed >= months - 1e-9 };
}
