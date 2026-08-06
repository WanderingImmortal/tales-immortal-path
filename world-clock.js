// ============================================
// WORLD-CLOCK.JS — Living soft-real-time calendar
// Design: docs/ideas/world-clock-continuous.md (Phase 1–2)
// ============================================

const WORLD_CLOCK_WEEK_MONTHS = 0.25; // 4 weeks per month
const WORLD_CLOCK_RENT_WARN_MONTHS = 3;
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
            lastDigestMonth: null,
            stance: null,
            project: null,
            rentWarnRunway: null,
            activity: null
        };
    }
    if (G.worldClock.paused == null) G.worldClock.paused = true;
    if (!WORLD_CLOCK_SPEEDS[G.worldClock.speed]) G.worldClock.speed = 'normal';
    if (G.worldClock.lastDigestMonth == null) {
        G.worldClock.lastDigestMonth = Math.floor(G.ageMonths || 0);
    }
    if (G.worldClock.stance === undefined) G.worldClock.stance = null;
    if (G.worldClock.project === undefined) G.worldClock.project = null;
    if (G.worldClock.rentWarnRunway === undefined) G.worldClock.rentWarnRunway = null;
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

    // Practice / workshop chambers are not blocking menus — stances & calendar keep ticking.
    const clockOkOverlays = new Set([
        'timePlaybackOverlay',
        'qiChamberOverlay',
        'bodyChamberOverlay',
        'soulChamberOverlay',
        'cultivationHubOverlay',
        'alchemyChamberOverlay',
        'forgeChamberOverlay'
    ]);
    const overlays = document.querySelectorAll('.popup-overlay.active');
    for (const el of overlays) {
        if (clockOkOverlays.has(el.id)) continue;
        return true;
    }
    return false;
}

/** Clock is actively advancing age. */
function isWorldClockLive() {
    return isWorldClockPlayRequested() && !isWorldClockHardFrozen();
}

function getWorldClockProject() {
    ensureWorldClockState();
    return G.worldClock.project || null;
}

function getWorldClockStance() {
    ensureWorldClockState();
    return G.worldClock.stance || null;
}

/** Lock reason while a timed project (transit / job / seek) is running. */
function getWorldClockBusyReason() {
    const p = getWorldClockProject();
    if (!p) return null;
    if (p.kind === 'transit') return `You are traveling — ${p.label || 'on the road'}.`;
    if (p.kind === 'job') return `You are working — ${p.label || 'on a job'}.`;
    if (p.kind === 'seek') return `You are seeking a fight.`;
    return `You are busy — ${p.label || 'occupied'}.`;
}

function getWorldClockActivityLabel() {
    ensureWorldClockState();
    const p = G.worldClock.project;
    if (p?.label) return p.label;
    const s = G.worldClock.stance;
    if (s === 'explore') return 'Exploring';
    return '';
}

function clearWorldClockStance(silent) {
    ensureWorldClockState();
    if (!G.worldClock.stance) return;
    const was = G.worldClock.stance;
    G.worldClock.stance = null;
    if (!silent && typeof addLog === 'function') {
        if (was === 'explore') addLog('🌿 You stop exploring.');
    }
}

function setWorldClockStance(stanceId) {
    ensureWorldClockState();
    const busy = getWorldClockBusyReason();
    if (busy) {
        if (typeof addLog === 'function') addLog(`🔒 ${busy}`);
        return false;
    }
    if (G.worldClock.stance === stanceId) {
        clearWorldClockStance(false);
        renderWorldClockBar();
        if (typeof saveState === 'function') saveState();
        return true;
    }
    G.worldClock.stance = stanceId;
    if (typeof addLog === 'function') {
        if (stanceId === 'explore') addLog('🌿 You begin foraging the wilds — finds drip each week while the calendar runs.');
    }
    renderWorldClockBar();
    if (typeof saveState === 'function') saveState();
    return true;
}

function startWorldClockProject(spec) {
    ensureWorldClockState();
    if (G.worldClock.project) {
        if (typeof addLog === 'function') addLog(`🔒 ${getWorldClockBusyReason()}`);
        return false;
    }
    const duration = Math.max(WORLD_CLOCK_WEEK_MONTHS, Number(spec.durationMonths) || WORLD_CLOCK_WEEK_MONTHS);
    clearWorldClockStance(true);
    G.worldClock.project = {
        id: spec.id,
        kind: spec.kind || 'project',
        label: spec.label || 'Busy',
        startedAtMonths: G.ageMonths || 0,
        endsAtMonths: (G.ageMonths || 0) + duration,
        payload: spec.payload || null
    };
    if (typeof addLog === 'function' && spec.startLog) addLog(spec.startLog);
    renderWorldClockBar();
    if (typeof saveState === 'function') saveState();
    return true;
}

function clearWorldClockProject(silent) {
    ensureWorldClockState();
    G.worldClock.project = null;
    if (!silent) renderWorldClockBar();
}

function completeWorldClockProject() {
    ensureWorldClockState();
    const p = G.worldClock.project;
    if (!p) return;
    clearWorldClockProject(true);
    if (p.id === 'fight_seek') {
        if (typeof addLog === 'function') addLog('⚔️ A worthy opponent answers your challenge.');
        try {
            if (typeof startCombat === 'function') startCombat();
        } catch (err) {
            console.error('fight_seek complete failed', err);
            if (typeof addLog === 'function') addLog('⚔️ Combat failed to start.');
        }
    } else if (p.id === 'travel' && typeof finishWorldClockTravel === 'function') {
        finishWorldClockTravel(p.payload || {});
    } else if (p.id === 'threshold_job' && typeof finishThresholdJobProject === 'function') {
        finishThresholdJobProject(p.payload?.jobId);
    } else if (p.id === 'focused_cultivate' && typeof finishFocusedCultivateProject === 'function') {
        finishFocusedCultivateProject();
    }
    renderWorldClockBar();
    if (typeof fullRender === 'function') fullRender();
    else if (typeof saveState === 'function') saveState();
}

function tickWorldClockProjectAfterAdvance() {
    const p = getWorldClockProject();
    if (!p) return;
    if ((G.ageMonths || 0) + 1e-9 >= p.endsAtMonths) {
        completeWorldClockProject();
    }
}

function tickWorldClockStanceWeek() {
    if (typeof tickPassiveCultivationWeek === 'function') tickPassiveCultivationWeek();
    const stance = getWorldClockStance();
    if (stance === 'explore' && typeof runExploreStanceWeek === 'function') {
        runExploreStanceWeek();
    }
}

function emitWorldClockMonthlyDigest() {
    ensureWorldClockState();
    const monthFloor = Math.floor(G.ageMonths || 0);
    if (monthFloor <= (G.worldClock.lastDigestMonth || 0)) return;
    G.worldClock.lastDigestMonth = monthFloor;
    const age = typeof formatYears === 'function' ? formatYears(G.ageMonths) : `${G.ageMonths}m`;
    const busy = getWorldClockActivityLabel();
    const tail = busy ? ` (${busy})` : '';
    if (typeof addLog === 'function') {
        addLog(`⏳ A month passes. Age ${age}.${tail}`);
    }
    if (typeof saveState === 'function') saveState();
}

function maybeWarnDwellingRentRunway() {
    if (typeof G === 'undefined' || !G?.dwelling || G.dwelling.mode !== 'rent') return;
    const cost = (typeof THRESHOLD_RENT !== 'undefined' && THRESHOLD_RENT.cost) || 8;
    const runway = Math.floor((G.stones || 0) / cost);
    ensureWorldClockState();
    if (runway > WORLD_CLOCK_RENT_WARN_MONTHS) {
        G.worldClock.rentWarnRunway = null;
        return;
    }
    if (G.worldClock.rentWarnRunway === runway) return;
    G.worldClock.rentWarnRunway = runway;
    if (typeof addLog === 'function') {
        if (runway <= 0) {
            addLog('🏠 Rent warning — you cannot cover another month.');
        } else {
            addLog(`🏠 Rent warning — stones cover about ${runway} more month${runway === 1 ? '' : 's'} of upkeep.`);
        }
    }
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
    const actEl = document.getElementById('worldClockActivity');
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
    if (actEl) {
        const label = getWorldClockActivityLabel();
        actEl.textContent = label || '';
        actEl.hidden = !label;
        actEl.title = label || '';
    }

    bar.querySelectorAll('[data-clock-speed]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.clockSpeed === G.worldClock.speed);
    });

    bar.classList.toggle('world-clock-live', isWorldClockLive());
    bar.classList.toggle('world-clock-paused', !play);
    bar.classList.toggle('world-clock-held', play && hard);
    bar.classList.toggle('world-clock-busy', !!getWorldClockProject());

    const stance = getWorldClockStance();
    document.getElementById('btnExplore')?.classList.toggle('action-stance-on', stance === 'explore');
}

function flushWorldClockWeek() {
    if (!isWorldClockLive()) return false;
    const activity = getWorldClockActivityLabel() || 'Living calendar';
    const ok = typeof advanceTimeQuiet === 'function'
        ? advanceTimeQuiet(WORLD_CLOCK_WEEK_MONTHS, activity)
        : (typeof advanceTime === 'function' ? advanceTime(WORLD_CLOCK_WEEK_MONTHS, activity) : false);

    if (typeof tickDwellingRent === 'function') tickDwellingRent();
    if (typeof tickWellRingCalendar === 'function') tickWellRingCalendar();
    maybeWarnDwellingRentRunway();
    tickWorldClockStanceWeek();
    emitWorldClockMonthlyDigest();
    tickWorldClockProjectAfterAdvance();

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
    // Keep stance/project across reload so mid-job/travel survives — but start paused.
    _worldClockAccumMs = 0;
    _worldClockLastTs = 0;
    renderWorldClockBar();
}

/**
 * Spend action months — or skip for free/instant actions.
 * opts.free: always 0 cost
 * opts.instantWhileLive: 0 cost while calendar is live
 */
function spendActionMonths(months, activity, opts) {
    opts = opts || {};
    let m = Number(months) || 0;
    if (opts.free) m = 0;
    else if (opts.instantWhileLive && typeof isWorldClockLive === 'function' && isWorldClockLive()) m = 0;
    return typeof advanceTime === 'function' ? advanceTime(m, activity) : true;
}
