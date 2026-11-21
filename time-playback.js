// ============================================
// TIME-PLAYBACK.JS — Watch-mode age ticker (chronicle P1)
// Quiet years tick on screen; only events are listed.
// ============================================

const TIME_PLAYBACK_SPEEDS = [1, 3, 10];

let _playbackState = null;
let _playbackTimer = null;

function isTimePlaybackActive() {
    return !!_playbackState?.running;
}

function getTimePlaybackState() {
    return _playbackState;
}

function clearTimePlaybackTimer() {
    if (_playbackTimer != null) {
        clearTimeout(_playbackTimer);
        _playbackTimer = null;
    }
}

/**
 * Advance months without spamming the event log (for watch-mode ticks).
 * Still runs world schedule / lifespan / gameOver.
 */
function advanceTimeQuiet(months, activity, options = {}) {
    if (months <= 0) return true;
    return advanceSharedWorldTime(months, activity, { ...options, quiet: true }).complete;
}

function msPerPlaybackYear(speed) {
    const s = speed || 1;
    if (s >= 10) return 90;
    if (s >= 3) return 220;
    return 520;
}

function startTimePlayback(opts) {
    opts = opts || {};
    if (_playbackState?.running) return { success: false, message: 'Already in seclusion.' };
    const busy = typeof getWorldClockBusyReason === 'function' ? getWorldClockBusyReason() : null;
    const block = busy || getPlayerTimeAttention() || (isPlayerLifespanExhausted() ? 'Your lifespan has ended.' : null);
    if (block) return { success: false, message: block };
    if (typeof clearWorldClockStance === 'function') clearWorldClockStance(true);
    if (typeof setWorldClockPaused === 'function') setWorldClockPaused(true);
    const yearsTarget = Math.max(1, Math.floor(opts.years || 10));
    _playbackState = {
        running: true,
        paused: false,
        speed: opts.speed || 1,
        yearsDone: 0,
        elapsedMonths: 0,
        yearsTarget,
        startAgeMonths: G.ageMonths || 0,
        activity: opts.activity || 'Seclusion',
        events: Array.isArray(opts.events) ? opts.events.slice() : [],
        shownEvents: [],
        onYear: typeof opts.onYear === 'function' ? opts.onYear : null,
        onComplete: typeof opts.onComplete === 'function' ? opts.onComplete : null,
        ended: false
    };
    showTimePlaybackOverlay();
    renderTimePlaybackOverlay();
    scheduleNextPlaybackTick();
    return { success: true };
}

function scheduleNextPlaybackTick() {
    clearTimePlaybackTimer();
    if (!_playbackState?.running || _playbackState.paused || _playbackState.ended) return;
    _playbackTimer = setTimeout(runPlaybackYearTick, msPerPlaybackYear(_playbackState.speed));
}

function runPlaybackYearTick() {
    if (!_playbackState?.running || _playbackState.paused || _playbackState.ended) return;

    const st = _playbackState;
    if (st.yearsDone >= st.yearsTarget) {
        finishTimePlayback('complete');
        return;
    }

    const from = G.ageMonths;
    const ok = advanceTimeQuiet(12, st.activity, { skipPassiveCirculation: true });
    st.elapsedMonths += Math.max(0, G.ageMonths - from);
    if (ok) {
        st.yearsDone++;
        try {
            st.onYear?.(st.yearsDone, st);
        } catch (err) {
            console.error('Seclusion reward failed', err);
            finishTimePlayback('interrupted');
            return;
        }
        st.events.filter(ev => ev.year === st.yearsDone).forEach(ev => {
            st.shownEvents.push({ year: st.yearsDone, ageMonths: G.ageMonths, text: ev.text, emoji: ev.emoji || '✨' });
        });
    }
    if (typeof saveState === 'function') saveState();
    renderTimePlaybackOverlay();
    if (typeof renderStats === 'function') renderStats();

    if (!ok || G.gameOver) {
        finishTimePlayback(G.gameOver || G.sectSuccessionActive ? 'death' : 'interrupted');
        return;
    }
    if (st.yearsDone >= st.yearsTarget) {
        finishTimePlayback('complete');
        return;
    }
    scheduleNextPlaybackTick();
}

function setTimePlaybackPaused(paused) {
    if (!_playbackState?.running) return;
    _playbackState.paused = !!paused;
    renderTimePlaybackOverlay();
    if (!_playbackState.paused) scheduleNextPlaybackTick();
    else clearTimePlaybackTimer();
}

function cycleTimePlaybackSpeed() {
    if (!_playbackState?.running) return;
    const cur = _playbackState.speed;
    const idx = TIME_PLAYBACK_SPEEDS.indexOf(cur);
    const next = TIME_PLAYBACK_SPEEDS[(idx + 1) % TIME_PLAYBACK_SPEEDS.length];
    _playbackState.speed = next;
    renderTimePlaybackOverlay();
    if (!_playbackState.paused) {
        clearTimePlaybackTimer();
        scheduleNextPlaybackTick();
    }
}

function stopTimePlaybackEarly() {
    if (!_playbackState?.running) return;
    finishTimePlayback('stopped');
}

function finishTimePlayback(reason) {
    clearTimePlaybackTimer();
    if (!_playbackState || _playbackState.ended) return;
    _playbackState.ended = true;
    _playbackState.running = false;
    _playbackState.paused = true;
    const snapshot = { ..._playbackState, reason: reason || 'complete' };
    _playbackState = null;
    hideTimePlaybackOverlay();
    if (typeof snapshot.onComplete === 'function') {
        snapshot.onComplete(snapshot);
    }
}

function showTimePlaybackOverlay() {
    const el = document.getElementById('timePlaybackOverlay');
    if (el) el.classList.add('active');
}

function hideTimePlaybackOverlay() {
    const el = document.getElementById('timePlaybackOverlay');
    if (el) el.classList.remove('active');
}

function renderTimePlaybackOverlay() {
    const st = getTimePlaybackState();
    const ageEl = document.getElementById('playbackAge');
    const progEl = document.getElementById('playbackProgress');
    const eventEl = document.getElementById('playbackEventList');
    const pauseBtn = document.getElementById('playbackPause');
    const speedBtn = document.getElementById('playbackSpeed');
    if (!st) return;

    const ageYears = Math.floor((G.ageMonths || 0) / 12);
    if (ageEl) ageEl.textContent = `Age ${ageYears}`;
    if (progEl) {
        progEl.textContent = `${st.yearsDone} / ${st.yearsTarget} years · ${st.activity}`;
    }
    if (speedBtn) speedBtn.textContent = `${st.speed}×`;
    if (pauseBtn) pauseBtn.textContent = st.paused ? 'Resume' : 'Pause';

    if (eventEl) {
        if (!st.shownEvents.length) {
            eventEl.innerHTML = `<p class="playback-quiet">Quiet years pass…</p>`;
        } else {
            eventEl.innerHTML = st.shownEvents.map(ev => {
                const age = Math.floor((ev.ageMonths || 0) / 12);
                return `<div class="playback-event">${ev.emoji || '✨'} Year ${ev.year} (Age ${age}) — ${escapePlaybackHtml(ev.text)}</div>`;
            }).join('');
            eventEl.scrollTop = eventEl.scrollHeight;
        }
    }
}

function escapePlaybackHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function showHighlightReelPopup(opts) {
    opts = opts || {};
    const popup = document.getElementById('highlightReelPopup');
    if (!popup) return;
    const title = document.getElementById('highlightReelTitle');
    const sub = document.getElementById('highlightReelSub');
    const list = document.getElementById('highlightReelList');
    if (title) title.textContent = opts.title || 'Seclusion ends';
    if (sub) sub.textContent = opts.subtitle || '';
    if (list) {
        const events = opts.events || [];
        if (!events.length) {
            list.innerHTML = `<li class="muted">Quiet years — nothing marked the calendar.</li>`;
        } else {
            list.innerHTML = events.map(ev =>
                `<li>${ev.emoji || '·'} Year ${ev.year} — ${escapePlaybackHtml(ev.text)}</li>`
            ).join('');
        }
    }
    popup.dataset.reelPayload = '';
    popup._reelOnContinue = typeof opts.onContinue === 'function' ? opts.onContinue : null;
    popup.classList.add('active');
}

function closeHighlightReelPopup() {
    const popup = document.getElementById('highlightReelPopup');
    if (!popup) return;
    popup.classList.remove('active');
    const cb = popup._reelOnContinue;
    popup._reelOnContinue = null;
    if (cb) cb();
}

function bindTimePlaybackEvents() {
    document.getElementById('playbackPause')?.addEventListener('click', () => {
        const st = getTimePlaybackState();
        if (!st) return;
        setTimePlaybackPaused(!st.paused);
    });
    document.getElementById('playbackSpeed')?.addEventListener('click', () => cycleTimePlaybackSpeed());
    document.getElementById('playbackStop')?.addEventListener('click', () => stopTimePlaybackEarly());
    document.getElementById('highlightReelClose')?.addEventListener('click', () => closeHighlightReelPopup());
}
