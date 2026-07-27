// ============================================
// WORLD-CLOCK.JS — Living soft-real-time calendar (Phase 1)
// Design: docs/ideas/world-clock-continuous.md
// ============================================

const WORLD_CLOCK_WEEK_MONTHS = 0.25; // 4 weeks per month
const WORLD_CLOCK_SPEEDS = {
    slow: { id: 'slow', label: 'Slow', msPerWeek: 8000 },
    normal: { id: 'normal', label: 'Normal', msPerWeek: 5000 },
    fast: { id: 'fast', label: 'Fast', msPerWeek: 2500 }
};

let _worldClockTimer = null;
let _worldClockAccumMs = 0;
let _worldClockLastTs = 0;
let _worldClockBlurred = false;

function ensureWorldClockState() {
    if (!G.worldClock) {
        G.worldClock = {
            paused: true,
            speed: 'normal',
            lastDigestMonth: null
        };
    }
    if (G.worldClock.paused == null) G.worldClock.paused = true;
    if (!WORLD_CLOCK_SPEEDS[G.worldClock.speed]) G.worldClock.speed = 'normal';
    if (G.worldClock.lastDigestMonth == null) {
        G.worldClock.lastDigestMonth = Math.floor(G.ageMonths || 0);
    }
}

function getWorldClockSpeedDef() {
    ensureWorldClockState();
    return WORLD_CLOCK_SPEEDS[G.worldClock.speed] || WORLD_CLOCK_SPEEDS.normal;
}

/** Player wants the calendar running (may still be hard-frozen). */
function isWorldClockPlayRequested() {
    ensureWorldClockState();
    return !G.worldClock.paused;
}

function isWorldClockHardFrozen() {
    if (typeof G === 'undefined' || !G) return true;
    if (G.gameOver) return true;
    if (G.inCombat) return true;
    if (typeof isTribulationActive === 'function' && isTribulationActive()) return true;
    if (typeof isTimePlaybackActive === 'function' && isTimePlaybackActive()) return true;
    if (typeof isTranscendencePerkPending === 'function' && isTranscendencePerkPending()) return true;

    const game = document.getElementById('game-screen');
    if (!game || game.style.display === 'none') return true;

    const creation = document.getElementById('creation-screen');
    if (creation && creation.style.display !== 'none') return true;

    if (_worldClockBlurred) return true;

    const overlays = document.querySelectorAll('.popup-overlay.active');
    for (const el of overlays) {
        if (el.id === 'timePlaybackOverlay') continue;
        return true;
    }
    return false;
}

/** Clock is actively advancing age. */
function isWorldClockLive() {
    return isWorldClockPlayRequested() && !isWorldClockHardFrozen();
}

function setWorldClockPaused(paused) {
    ensureWorldClockState();
    G.worldClock.paused = !!paused;
    _worldClockAccumMs = 0;
    _worldClockLastTs = 0;
    renderWorldClockBar();
    if (typeof saveState === 'function') saveState();
}

function toggleWorldClockPaused() {
    ensureWorldClockState();
    setWorldClockPaused(!G.worldClock.paused);
}

function setWorldClockSpeed(speedId) {
    ensureWorldClockState();
    if (!WORLD_CLOCK_SPEEDS[speedId]) return;
    G.worldClock.speed = speedId;
    _worldClockAccumMs = 0;
    renderWorldClockBar();
    if (typeof saveState === 'function') saveState();
}

function formatWorldClockAge(months) {
    const m = Math.max(0, Number(months) || 0);
    const years = Math.floor(m / 12);
    const rem = Math.floor(m % 12);
    if (rem === 0) return `${years}y`;
    return `${years}y ${rem}m`;
}

function renderWorldClockBar() {
    ensureWorldClockState();
    const bar = document.getElementById('worldClockBar');
    if (!bar) return;

    const onGame = document.getElementById('game-screen')?.style.display !== 'none';
    bar.hidden = !onGame;
    if (!onGame) return;

    const playBtn = document.getElementById('worldClockPlayPause');
    const ageEl = document.getElementById('worldClockAge');
    const hard = isWorldClockHardFrozen();
    const play = isWorldClockPlayRequested();

    if (playBtn) {
        if (!play) {
            playBtn.textContent = '▶ Play';
            playBtn.title = 'Resume the living calendar (Space)';
            playBtn.setAttribute('aria-pressed', 'false');
        } else if (hard) {
            playBtn.textContent = '⏸ Held';
            playBtn.title = 'Play is on, but combat/menus freeze the calendar';
            playBtn.setAttribute('aria-pressed', 'true');
        } else {
            playBtn.textContent = '⏸ Pause';
            playBtn.title = 'Pause the living calendar (Space)';
            playBtn.setAttribute('aria-pressed', 'true');
        }
    }

    if (ageEl) ageEl.textContent = formatWorldClockAge(G.ageMonths);

    bar.querySelectorAll('[data-clock-speed]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.clockSpeed === G.worldClock.speed);
    });

    bar.classList.toggle('world-clock-live', isWorldClockLive());
    bar.classList.toggle('world-clock-paused', !play);
    bar.classList.toggle('world-clock-held', play && hard);
}

function flushWorldClockWeek() {
    if (!isWorldClockLive()) return false;
    const activity = G.worldClock?.activity || 'Living calendar';
    const ok = typeof advanceTimeQuiet === 'function'
        ? advanceTimeQuiet(WORLD_CLOCK_WEEK_MONTHS, activity)
        : (typeof advanceTime === 'function' ? advanceTime(WORLD_CLOCK_WEEK_MONTHS, activity) : false);

    if (typeof tickDwellingRent === 'function') tickDwellingRent();

    ensureWorldClockState();
    const monthFloor = Math.floor(G.ageMonths || 0);
    if (monthFloor > (G.worldClock.lastDigestMonth || 0)) {
        G.worldClock.lastDigestMonth = monthFloor;
        // Quiet months stay quiet — only bump digest cursor (monthly cadence).
        if (typeof saveState === 'function') saveState();
    }

    if (typeof renderStatus === 'function') renderStatus();
    renderWorldClockBar();

    if (!ok || G.gameOver) {
        setWorldClockPaused(true);
        if (typeof fullRender === 'function') fullRender();
        return false;
    }
    return true;
}

function worldClockFrame(ts) {
    _worldClockTimer = requestAnimationFrame(worldClockFrame);
    if (!isWorldClockLive()) {
        _worldClockLastTs = 0;
        _worldClockAccumMs = 0;
        return;
    }
    if (!_worldClockLastTs) {
        _worldClockLastTs = ts;
        return;
    }
    const dt = ts - _worldClockLastTs;
    _worldClockLastTs = ts;
    if (dt < 0 || dt > 5000) return;

    _worldClockAccumMs += dt;
    const msPerWeek = getWorldClockSpeedDef().msPerWeek;
    // Cap catch-up so tab-restore doesn't skip years
    let safety = 0;
    while (_worldClockAccumMs >= msPerWeek && safety < 4) {
        _worldClockAccumMs -= msPerWeek;
        safety += 1;
        if (!flushWorldClockWeek()) break;
    }
}

function startWorldClockLoop() {
    if (_worldClockTimer != null) return;
    _worldClockTimer = requestAnimationFrame(worldClockFrame);
}

function stopWorldClockLoop() {
    if (_worldClockTimer != null) {
        cancelAnimationFrame(_worldClockTimer);
        _worldClockTimer = null;
    }
    _worldClockLastTs = 0;
    _worldClockAccumMs = 0;
}

function initWorldClockUi() {
    ensureWorldClockState();
    const playBtn = document.getElementById('worldClockPlayPause');
    playBtn?.addEventListener('click', () => toggleWorldClockPaused());

    document.querySelectorAll('[data-clock-speed]').forEach(btn => {
        btn.addEventListener('click', () => setWorldClockSpeed(btn.dataset.clockSpeed));
    });

    document.addEventListener('keydown', (ev) => {
        if (ev.code !== 'Space' && ev.key !== ' ') return;
        const tag = (ev.target && ev.target.tagName) || '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || ev.target?.isContentEditable) return;
        const game = document.getElementById('game-screen');
        if (!game || game.style.display === 'none') return;
        ev.preventDefault();
        toggleWorldClockPaused();
    });

    window.addEventListener('blur', () => {
        _worldClockBlurred = true;
        renderWorldClockBar();
    });
    window.addEventListener('focus', () => {
        _worldClockBlurred = false;
        _worldClockLastTs = 0;
        renderWorldClockBar();
    });

    startWorldClockLoop();
    renderWorldClockBar();
}

/** Call when entering the game screen — always start paused. */
function resetWorldClockForGameStart() {
    ensureWorldClockState();
    G.worldClock.paused = true;
    G.worldClock.lastDigestMonth = Math.floor(G.ageMonths || 0);
    _worldClockAccumMs = 0;
    _worldClockLastTs = 0;
    renderWorldClockBar();
}
