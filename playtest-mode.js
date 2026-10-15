// ============================================
// PLAYTEST-MODE.JS — QA toggles & dev grants (gated; no effect when off)
// ============================================

const PLAYTEST_OPTIONS_KEY = 'wi_playtest_options_v1';

const PLAYTEST_OPTION_DEFAULTS = {
    master: false,
    richExplore: false,
    generousStart: false,
    freeConsolidate: false,
    fastTime: false,
    autoPassTribulation: false,
    freeActionGates: false
};

const PLAYTEST_STONE_MULT = 3;
const PLAYTEST_TIME_MULT = 4;

function loadPlaytestOptions() {
    try {
        const raw = localStorage.getItem(PLAYTEST_OPTIONS_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return { ...PLAYTEST_OPTION_DEFAULTS, ...parsed };
    } catch {
        return { ...PLAYTEST_OPTION_DEFAULTS };
    }
}

function savePlaytestOptions(opts) {
    try {
        localStorage.setItem(PLAYTEST_OPTIONS_KEY, JSON.stringify(opts));
    } catch {
        /* quota or private mode */
    }
}

function getPlaytestOption(key) {
    const opts = loadPlaytestOptions();
    return !!opts[key];
}

function isPlaytestMode() {
    const opts = loadPlaytestOptions();
    if (opts.master) return true;
    return Object.keys(PLAYTEST_OPTION_DEFAULTS).some(k => k !== 'master' && !!opts[k]);
}

function getPlaytestStoneMult() {
    if (!isPlaytestMode() || !getPlaytestOption('richExplore')) return 1;
    return PLAYTEST_STONE_MULT;
}

function getPlaytestTimeMult() {
    if (!isPlaytestMode() || !getPlaytestOption('fastTime')) return 1;
    return PLAYTEST_TIME_MULT;
}

function applyPlaytestTimeMonths(months) {
    if (!months || months <= 0) return months;
    const mult = getPlaytestTimeMult();
    if (mult <= 1) return months;
    return Math.max(1, Math.ceil(months / mult));
}

function isPlaytestAutoPassTribulation() {
    return isPlaytestMode() && getPlaytestOption('autoPassTribulation');
}

function isPlaytestFreeActionGates() {
    return isPlaytestMode() && getPlaytestOption('freeActionGates');
}

function getPlaytestStartingStones() {
    if (isPlaytestMode() && getPlaytestOption('generousStart')) return 200;
    return 20;
}

function playtestAfterGrant(msg) {
    if (typeof setPlaytestStatus === 'function') setPlaytestStatus(msg);
    if (typeof saveState === 'function') saveState();
    if (typeof fullRender === 'function') fullRender();
}

function playtestGrantStones(amount) {
    if (typeof G === 'undefined' || !G) return;
    G.stones = (G.stones || 0) + amount;
    playtestAfterGrant(`+${amount} Spirit Stones (now ${G.stones}).`);
}

function playtestGrantLifespan(years) {
    if (typeof G === 'undefined' || !G) return;
    G.lifespanMonths = (G.lifespanMonths || 0) + years * 12;
    const remain = typeof getYearsRemaining === 'function' ? getYearsRemaining() : '?';
    playtestAfterGrant(`+${years} years lifespan (${remain}y remaining).`);
}

function playtestGrantFoundation(amount) {
    if (typeof G === 'undefined' || !G) return;
    amount = Math.max(0, Math.floor(amount || 0));
    if (!amount) return;
    if (G._cultivationBaseMigrated && typeof splitLegacyFoundationAmount === 'function') {
        const split = splitLegacyFoundationAmount(amount);
        if (split.root) grantCultivationPillar('root', split.root);
        if (split.flow) grantCultivationPillar('flow', split.flow);
        if (split.stability) grantCultivationPillar('stability', split.stability);
        const effective = typeof getEffectiveFoundation === 'function' ? getEffectiveFoundation() : amount;
        playtestAfterGrant(`+${amount} Foundation pillars (${effective} effective).`);
        return;
    }
    const gained = grantFoundation(amount);
    const effective = typeof getEffectiveFoundation === 'function' ? getEffectiveFoundation() : amount;
    playtestAfterGrant(`+${gained || amount} Foundation (now ${effective}).`);
}

function clearStuckChamberOverlayFlags() {
    if (!G) return;
    G.inQiChamber = false;
    G.inBodyChamber = false;
    G.inSoulChamber = false;
    G.inAlchemyChamber = false;
    G.inForgeChamber = false;
    G.inCultivationHub = false;
}

function playtestFillQiHealHp() {
    if (typeof G === 'undefined' || !G) return;
    if (typeof getMaxQi === 'function') G.qi = getMaxQi();
    else if (G.maxQi) G.qi = G.maxQi;
    if (typeof clampCurrentQi === 'function') clampCurrentQi();
    G.qiExhausted = false;
    if (typeof applyVitalityToMaxHp === 'function') applyVitalityToMaxHp();
    G.hp = G.maxHp || G.hp;
    playtestAfterGrant('Qi filled and HP restored.');
}

/** Mirrors breakthrough success stat bumps without consolidate/tribulation requirements. */
function applyPlaytestRealmAdvance(style) {
    const s = style || 'balanced';
    const track = typeof getFocusTrack === 'function' ? getFocusTrack() : 'dantian';
    const cur = typeof getTrackRealmIdx === 'function' ? getTrackRealmIdx(track) : (G.realmIdx ?? 0);
    const pathKey = typeof getTrackPathKey === 'function' ? getTrackPathKey(track) : (G.path || 'qi');
    const max = typeof getMaxCultivationRealmIdx === 'function' ? getMaxCultivationRealmIdx(pathKey) : 8;
    if (cur >= max) return false;

    const newIdx = cur + 1;
    if (typeof setTrackRealmIdx === 'function') setTrackRealmIdx(track, newIdx);
    else G.realmIdx = newIdx;
    if (typeof syncLegacyPathShims === 'function') syncLegacyPathShims();

    G.breakAttempts = 0;
    G.realmPeakGrindBoost = 0;
    if (track === 'dantian') {
        G.maxQiBonus = (G.maxQiBonus || 0) + QI_BALANCE.breakthroughMaxQi + Math.floor(newIdx / 2);
        G.qi = getMaxQi();
        clampCurrentQi();
    }
    const boost = 3 + Math.floor(Math.random() * 6) + (s === 'power' ? 3 : 0) + (s === 'wisdom' ? 2 : 0);
    if (track === 'dantian' || track === 'vessel') {
        G.vitality += Math.floor(boost / 2) + (s === 'power' ? 2 : 0);
    }
    if (track === 'dantian' || track === 'spirit') {
        G.spirit += Math.floor(boost / 3) + (s === 'wisdom' ? 3 : 0);
        G.will += Math.floor(boost / 3) + (s === 'wisdom' ? 2 : 0);
    }
    if (track === 'vessel') {
        G.vitality += Math.floor(boost / 2) + (s === 'power' ? 3 : 0);
        G.maxHp += 12 + newIdx * 3 + (s === 'power' ? 5 : 0);
    } else {
        G.maxHp += 10 + newIdx * 2 + (s === 'power' ? 5 : 0);
    }
    applyVitalityToMaxHp();
    G.hp = G.maxHp;
    if (typeof addFame === 'function') addFame(5 + newIdx);
    else G.fame += 5 + newIdx;
    const sealTier = typeof getConsolidationTier === 'function' ? getConsolidationTier(newIdx - 1) : 'peak';
    extendLifespanOnBreakthrough(sealTier);
    if (typeof updateShield === 'function') updateShield();
    if (typeof tryAwakenSoulEmbryo === 'function' && newIdx >= SOUL_EMBRYO_REALM_IDX) {
        tryAwakenSoulEmbryo(track);
    }
    if (typeof MORTAL_LADDER_SAVE_VERSION !== 'undefined') {
        G.mortalLadderVersion = MORTAL_LADDER_SAVE_VERSION;
        G._nineRealmLadderMigrated = true;
    }
    clearStuckChamberOverlayFlags();
    return true;
}

function playtestGrantRealm() {
    if (typeof G === 'undefined' || !G) return;
    const prevUnlocks = typeof captureActionUnlockSnapshot === 'function'
        ? captureActionUnlockSnapshot()
        : null;
    if (!applyPlaytestRealmAdvance('balanced')) {
        if (typeof setPlaytestStatus === 'function') setPlaytestStatus('Already at peak realm.', true);
        return;
    }
    const realm = typeof getRealm === 'function' ? getRealm() : `realm ${G.realmIdx}`;
    if (typeof addLog === 'function') {
        addLog(`⚗️ [Playtest] Realm advanced to ${realm} (no tribulation triggered).`);
    }
    if (typeof notifyActionUnlocks === 'function' && prevUnlocks) {
        notifyActionUnlocks(prevUnlocks);
        if (typeof initActionUnlockSnapshot === 'function') initActionUnlockSnapshot();
    }
    playtestAfterGrant(`+1 Realm → ${realm}. Skips consolidate/tribulation — use normal Break for those.`);
}

function updatePlaytestModeVisuals() {
    const active = isPlaytestMode();
    document.getElementById('playtestModeBanner')?.classList.toggle('visible', active);
    document.getElementById('app')?.classList.toggle('playtest-mode-active', active);
}

function setPlaytestOption(key, value) {
    const opts = loadPlaytestOptions();
    opts[key] = !!value;
    savePlaytestOptions(opts);
    updatePlaytestModeVisuals();
    if (typeof renderActionUnlocks === 'function') renderActionUnlocks();
    if (typeof fullRender === 'function') fullRender();
}

function renderPlaytestDevTools() {
    const opts = loadPlaytestOptions();
    const master = document.getElementById('playtestMaster');
    if (master) master.checked = !!opts.master;

    document.querySelectorAll('[data-playtest-opt]').forEach(el => {
        const key = el.dataset.playtestOpt;
        if (key && el.type === 'checkbox') el.checked = !!opts[key];
    });
    updatePlaytestModeVisuals();
}

function togglePlaytestDevTools() {
    const body = document.getElementById('playtestDevBody');
    const btn = document.getElementById('playtestDevToggle');
    if (!body || !btn) return;
    const open = body.classList.toggle('open');
    btn.textContent = open ? '⚗️ Dev tools ▲' : '⚗️ Dev tools ▼';
}

function initPlaytestMode() {
    if (typeof PLAYTEST_FEEDBACK_ENABLED !== 'undefined' && !PLAYTEST_FEEDBACK_ENABLED) return;

    document.getElementById('playtestDevToggle')?.addEventListener('click', togglePlaytestDevTools);

    document.getElementById('playtestMaster')?.addEventListener('change', e => {
        setPlaytestOption('master', e.target.checked);
        renderPlaytestDevTools();
        if (typeof setPlaytestStatus === 'function') {
            setPlaytestStatus(e.target.checked ? 'Playtest mode enabled.' : 'Playtest mode off.');
        }
    });

    document.querySelectorAll('[data-playtest-opt]').forEach(el => {
        el.addEventListener('change', () => {
            setPlaytestOption(el.dataset.playtestOpt, el.checked);
            renderPlaytestDevTools();
            if (typeof setPlaytestStatus === 'function') {
                setPlaytestStatus(`${el.dataset.playtestOpt} ${el.checked ? 'on' : 'off'}.`);
            }
        });
    });

    document.getElementById('playtestGrant100')?.addEventListener('click', () => playtestGrantStones(100));
    document.getElementById('playtestGrant500')?.addEventListener('click', () => playtestGrantStones(500));
    document.getElementById('playtestGrantRealm')?.addEventListener('click', () => playtestGrantRealm());
    document.getElementById('playtestGrantLifespan')?.addEventListener('click', () => playtestGrantLifespan(50));
    document.getElementById('playtestGrantFoundation')?.addEventListener('click', () => playtestGrantFoundation(10));
    document.getElementById('playtestFillQi')?.addEventListener('click', () => playtestFillQiHealHp());

    renderPlaytestDevTools();
}
