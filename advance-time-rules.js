// ============================================
// ADVANCE-TIME-RULES.JS — Pure time billing helpers (Stage 1)
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
