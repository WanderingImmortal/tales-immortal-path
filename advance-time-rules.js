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
