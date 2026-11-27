// ============================================
// PHONE-PLAYTEST.JS — Opt-in mobile playtest shell
// ============================================

const PHONE_SHEET_TITLES = {
    cultivation: '⚡ Cultivation',
    world: '🌍 World',
    arts: '🎒 Arts & Gear',
    sect: '🏯 Sect & People',
    character: '👤 Character',
    more: '⋯ More'
};

const PHONE_MORE_GROUPS = ['quests', 'people', 'playtest'];

let _phoneGroupRestore = new Map();

function isPhonePlaytestLayoutEnabled() {
    return !!getUiSetting('phonePlaytestLayout');
}

function getPhoneGroupEl(key) {
    if (key === 'more') return null;
    return document.querySelector(`[data-phone-group="${key}"]`);
}

function rememberGroupHome(el) {
    if (!el || _phoneGroupRestore.has(el)) return;
    _phoneGroupRestore.set(el, {
        parent: el.parentElement,
        next: el.nextElementSibling
    });
}

function restoreGroupEl(el) {
    const home = _phoneGroupRestore.get(el);
    if (!home || !home.parent) return;
    if (home.next && home.next.parentElement === home.parent) {
        home.parent.insertBefore(el, home.next);
    } else {
        home.parent.appendChild(el);
    }
}

function restoreAllPhoneGroups() {
    _phoneGroupRestore.forEach((_, el) => restoreGroupEl(el));
    _phoneGroupRestore.clear();
}

function closePhoneGroupSheet() {
    closeOverlaySurface('phoneGroupSheet');
}

function openPhoneGroupSheet(key, opener) {
    if (!isPhonePlaytestLayoutEnabled()) return;
    const body = document.getElementById('phoneGroupSheetBody');
    const titleEl = document.getElementById('phoneGroupSheetTitle');
    const sheet = document.getElementById('phoneGroupSheet');
    if (!body || !titleEl || !sheet) return;

    closePhoneGroupSheet();

    titleEl.textContent = PHONE_SHEET_TITLES[key] || 'Actions';
    body.innerHTML = '';

    const keys = key === 'more' ? PHONE_MORE_GROUPS : [key];
    keys.forEach(groupKey => {
        const el = getPhoneGroupEl(groupKey);
        if (!el) return;
        rememberGroupHome(el);
        body.appendChild(el);
    });

    if (key === 'more') {
        const sidebar = document.querySelector('.sidebar');
        const resetWrap = document.getElementById('phoneSidebarExtras');
        if (resetWrap && sidebar) {
            rememberGroupHome(resetWrap);
            body.appendChild(resetWrap);
        }
    }

    openOverlaySurface('phoneGroupSheet', { opener, usesHidden: true, onClose: restoreAllPhoneGroups });
}

function updatePhoneOverlayBack() {
    const btn = document.getElementById('phoneOverlayBack');
    if (!btn) return;
    if (!isPhonePlaytestLayoutEnabled()) {
        btn.hidden = true;
        return;
    }
    btn.hidden = !canDismissTopOverlay();
}

function syncPhonePlaytestHeader() {
    if (!isPhonePlaytestLayoutEnabled()) return;
    const nameEl = document.getElementById('phoneHeroName');
    const realmEl = document.getElementById('phoneHeroRealm');
    const ageEl = document.getElementById('phoneHeroAge');
    if (!nameEl || !realmEl || !ageEl) return;

    const cultivator = document.getElementById('sceneCultivator');
    const age = document.getElementById('ageDisplay');
    nameEl.textContent = cultivator?.textContent?.trim() || G?.name || '—';
    if (typeof getRealm === 'function') {
        const label = getRealm();
        realmEl.textContent = label + (G?.perfectCultivation ? ' 🌟' : '');
    } else {
        realmEl.textContent = document.getElementById('realmDisplay')?.textContent?.trim() || '—';
    }
    ageEl.textContent = age?.textContent?.trim() || '—';
}

function phonePlaytestMountBottomChrome(enabled) {
    const bottom = document.getElementById('phoneBottomChrome');
    const log = document.getElementById('logPanel');
    const dock = document.querySelector('.phone-group-dock');
    const gameScreen = document.getElementById('game-screen');
    if (!bottom || !log || !dock || !gameScreen) return;

    if (enabled) {
        bottom.hidden = false;
        if (log.parentElement !== bottom) {
            bottom.insertBefore(log, dock);
        }
        return;
    }

    bottom.hidden = true;
    if (log.parentElement === bottom) {
        gameScreen.appendChild(log);
    }
}

function phonePlaytestMoveChrome() {
    const enabled = isPhonePlaytestLayoutEnabled();
    const app = document.getElementById('app');
    const chrome = document.getElementById('phonePlaytestChrome');
    const clock = document.getElementById('worldClockBar');
    const clockHost = document.getElementById('phoneClockHost');
    const visual = document.getElementById('sceneVisual');
    const focalHost = document.getElementById('phoneFocalHost');
    const gameScreen = document.getElementById('game-screen');

    if (!app || !chrome) return;

    app.classList.toggle('layout-phone-playtest', enabled);
    document.body.classList.toggle('phone-playtest-active', enabled);
    chrome.hidden = !enabled;

    if (!enabled) {
        closePhoneGroupSheet();
        phonePlaytestMountBottomChrome(false);
        if (clock && gameScreen && clock.parentElement === clockHost) {
            gameScreen.insertBefore(clock, gameScreen.querySelector('.main-layout'));
        }
        if (visual && focalHost && visual.parentElement === focalHost) {
            const scene = document.querySelector('.scene-panel');
            if (scene) scene.insertBefore(visual, scene.querySelector('.scene-header'));
        }
        updatePhoneOverlayBack();
        return;
    }

    if (clock && clockHost && clock.parentElement !== clockHost) {
        clockHost.appendChild(clock);
    }
    if (visual && focalHost && visual.parentElement !== focalHost) {
        focalHost.appendChild(visual);
    }
    phonePlaytestMountBottomChrome(true);
    syncPhonePlaytestHeader();
    updatePhoneOverlayBack();
}

function applyPhonePlaytestLayout(enabled) {
    setUiSetting('phonePlaytestLayout', !!enabled);
    phonePlaytestMoveChrome();
}

function initPhonePlaytestLayout() {
    const check = document.getElementById('settingPhonePlaytestLayout');
    const params = new URLSearchParams(window.location.search);
    if (params.get('phone') === '1' && check) {
        applyPhonePlaytestLayout(true);
        check.checked = true;
    } else if (check) {
        check.checked = !!getUiSetting('phonePlaytestLayout');
    }

    if (check) {
        check.addEventListener('change', () => {
            applyPhonePlaytestLayout(check.checked);
        });
    }

    document.getElementById('phoneCultivateCta')?.addEventListener('click', event => {
        closePhoneGroupSheet();
        if (typeof openCultivationHub === 'function') openCultivationHub(event.currentTarget);
        else document.getElementById('btnCultivate')?.click();
        updatePhoneOverlayBack();
    });

    document.querySelectorAll('.phone-dock-btn[data-phone-sheet]').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.getAttribute('data-phone-sheet');
            if (key) openPhoneGroupSheet(key, btn);
        });
    });

    document.getElementById('phoneOpenCharacter')?.addEventListener('click', event => {
        openPhoneGroupSheet('character', event.currentTarget);
    });

    document.getElementById('phoneGroupSheetClose')?.addEventListener('click', closePhoneGroupSheet);
    document.getElementById('phoneGroupSheetBackdrop')?.addEventListener('click', closePhoneGroupSheet);
    document.getElementById('phoneOverlayBack')?.addEventListener('click', dismissTopOverlay);

    document.getElementById('phoneGroupSheetBody')?.addEventListener('click', (ev) => {
        const btn = ev.target.closest('button');
        if (!btn || document.getElementById('phoneGroupSheet').hidden) return;
        if (btn.id === 'phoneGroupSheetClose') return;
        if (btn.classList.contains('phone-dock-btn')) return;
        if (btn.classList.contains('details-toggle') && btn.id !== 'playtestAdd') {
            return;
        }
        window.setTimeout(() => {
            if (!overlayHasChild('phoneGroupSheet')) closePhoneGroupSheet();
        }, 0);
    });

    phonePlaytestMoveChrome();
}
