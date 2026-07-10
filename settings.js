// ============================================
// SETTINGS.JS — Player UI preferences (localStorage)
// ============================================

const UI_SETTINGS_KEY = 'wi_ui_settings_v1';

const UI_SETTINGS_DEFAULTS = {
    hoverTooltips: false
};

function loadUiSettings() {
    try {
        const raw = localStorage.getItem(UI_SETTINGS_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        return { ...UI_SETTINGS_DEFAULTS, ...parsed };
    } catch {
        return { ...UI_SETTINGS_DEFAULTS };
    }
}

function saveUiSettings(settings) {
    try {
        localStorage.setItem(UI_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
        /* quota or private mode */
    }
}

function getUiSetting(key) {
    const settings = loadUiSettings();
    return settings[key];
}

function setUiSetting(key, value) {
    const settings = loadUiSettings();
    settings[key] = value;
    saveUiSettings(settings);
    if (key === 'hoverTooltips' && typeof refreshHoverTooltips === 'function') {
        refreshHoverTooltips();
    }
}

function isHoverTooltipsEnabled() {
    return !!getUiSetting('hoverTooltips');
}

function initUiSettings() {
    const panel = document.getElementById('settingsPanel');
    const toggle = document.getElementById('btnSettingsToggle');
    const hoverCheck = document.getElementById('settingHoverTooltips');
    if (!panel || !toggle) return;

    const settings = loadUiSettings();
    if (hoverCheck) hoverCheck.checked = !!settings.hoverTooltips;

    toggle.addEventListener('click', () => {
        const open = panel.hidden;
        panel.hidden = !open;
        toggle.textContent = open ? '⚙️ Settings ▲' : '⚙️ Settings ▼';
    });

    hoverCheck?.addEventListener('change', () => {
        setUiSetting('hoverTooltips', hoverCheck.checked);
    });
}
