// ============================================
// SECLUSION-PROJECT.JS — Long seclusion + year picker (chronicle P1)
// ============================================

const SECLUSION_EVENT_TEMPLATES = [
    { emoji: '⛈️', text: 'A storm cracks the grotto roof; you reinforce the seal and hold the pattern.' },
    { emoji: '🕯️', text: 'Your breath steadies for the first time in years — denser Qi settles in the dantian.' },
    { emoji: '🦊', text: 'A spirit beast sniffs at the cave mouth and leaves you undisturbed.' },
    { emoji: '📜', text: 'An old insight surfaces mid-trance; you carve it into the stone floor before it fades.' },
    { emoji: '🩸', text: 'Inner demons stir. You sit through the night and do not rise until dawn of the next year.' },
    { emoji: '🌿', text: 'Moss claims the threshold. Outside, seasons turn without you.' },
    { emoji: '🔔', text: 'Distant temple bells reach the cave — a reminder the jianghu still moves.' },
    { emoji: '✨', text: 'For one breath, the meridian map shines complete behind your eyelids.' }
];

function getSeclusionYearPresets() {
    const realm = typeof getEffectiveRealmTier === 'function' ? getEffectiveRealmTier() : (G.realmIdx || 0);
    let presets;
    if (realm <= 1) presets = [10, 20, 30];
    else if (realm <= 3) presets = [20, 50, 100];
    else presets = [50, 100, 200, 500];

    const remain = typeof getYearsRemaining === 'function' ? getYearsRemaining() : Infinity;
    if (remain !== Infinity && remain > 0) {
        presets = presets.filter(y => y < remain);
        // Always offer at least one option that fits lifespan, if any years left
        if (!presets.length && remain >= 5) {
            const clipped = Math.max(5, Math.floor(remain / 2));
            presets = [Math.min(clipped, remain - 1)].filter(y => y >= 1);
        }
    }
    return presets;
}

function getSeclusionBlockReason() {
    if (typeof getActionBlockReason === 'function') {
        const block = getActionBlockReason();
        if (block) return block;
    }
    if (typeof isTimePlaybackActive === 'function' && isTimePlaybackActive()) {
        return 'You are already in long seclusion.';
    }
    if (typeof getYearsRemaining === 'function' && getYearsRemaining() !== Infinity && getYearsRemaining() < 5) {
        return 'Too little lifespan left for long seclusion.';
    }
    return null;
}

function pickSeclusionEvents(yearsTarget) {
    const count = yearsTarget >= 80 ? 2 : (yearsTarget >= 20 ? (Math.random() < 0.7 ? 2 : 1) : (Math.random() < 0.5 ? 1 : 0));
    if (count <= 0 || yearsTarget < 3) return [];
    const years = new Set();
    const pool = SECLUSION_EVENT_TEMPLATES.slice();
    const events = [];
    let guard = 0;
    while (events.length < count && guard++ < 20) {
        const y = 2 + Math.floor(Math.random() * Math.max(1, yearsTarget - 2));
        if (years.has(y)) continue;
        years.add(y);
        if (!pool.length) break;
        const idx = Math.floor(Math.random() * pool.length);
        const tmpl = pool.splice(idx, 1)[0];
        events.push({ year: y, text: tmpl.text, emoji: tmpl.emoji });
    }
    return events.sort((a, b) => a.year - b.year);
}

function applySeclusionYearGains() {
    if (typeof runCultivateSession !== 'function') return;
    // Quiet growth — a fraction of a normal cultivate, no spam logs
    const prevDefer = G._deferringLogs;
    G._deferringLogs = true;
    G._quietTime = true;
    try {
        runCultivateSession({
            extraMult: 0.22,
            logPrefix: 'Seclusion',
            silent: true
        });
    } finally {
        G._deferringLogs = prevDefer;
        G._quietTime = false;
    }
}

function openSeclusionPicker() {
    const block = getSeclusionBlockReason();
    if (block) {
        addLog(`🗻 ${block}`);
        fullRender();
        return;
    }
    const popup = document.getElementById('seclusionPickerPopup');
    const list = document.getElementById('seclusionPresetList');
    const hint = document.getElementById('seclusionPickerHint');
    if (!popup || !list) return;
    const presets = getSeclusionYearPresets();
    const remain = typeof getYearsRemaining === 'function' ? getYearsRemaining() : Infinity;
    if (hint) {
        hint.textContent = remain === Infinity
            ? 'Choose how many years to close the grotto.'
            : `About ${remain} years of lifespan remain. Quiet years will not clutter your diary.`;
    }
    if (!presets.length) {
        list.innerHTML = `<p class="sect-hint">No safe seclusion length fits your remaining years.</p>`;
    } else {
        list.innerHTML = presets.map(y =>
            `<button type="button" class="seclusion-preset-btn" data-seclusion-years="${y}">🗻 ${y} years</button>`
        ).join('');
        list.querySelectorAll('[data-seclusion-years]').forEach(btn => {
            btn.addEventListener('click', function() {
                const years = parseInt(this.dataset.seclusionYears, 10);
                popup.classList.remove('active');
                startSeclusionProject(years);
            });
        });
    }
    popup.classList.add('active');
}

function startSeclusionProject(years) {
    const block = getSeclusionBlockReason();
    if (block) {
        addLog(`🗻 ${block}`);
        fullRender();
        return;
    }
    years = Math.max(1, Math.floor(years || 10));
    const remain = typeof getYearsRemaining === 'function' ? getYearsRemaining() : Infinity;
    if (remain !== Infinity) years = Math.min(years, Math.max(1, remain - 1));

    const startAge = G.ageMonths || 0;
    const events = pickSeclusionEvents(years);

    if (typeof startTimePlayback !== 'function') {
        addLog('🗻 Time playback unavailable.');
        return;
    }

    startTimePlayback({
        years,
        activity: 'Long seclusion',
        events,
        speed: 1,
        onYear: () => applySeclusionYearGains(),
        onComplete: (snap) => finishSeclusionProject(snap, startAge)
    });
}

function finishSeclusionProject(snap, startAgeMonths) {
    const yearsDone = snap.yearsDone || 0;
    const startY = Math.floor((startAgeMonths || 0) / 12);
    const endY = Math.floor((G.ageMonths || 0) / 12);
    const reason = snap.reason || 'complete';
    const events = snap.shownEvents || [];

    let subtitle = `${yearsDone} year${yearsDone === 1 ? '' : 's'} in seclusion (Age ${startY}–${endY}).`;
    if (reason === 'stopped') subtitle += ' You emerged early.';
    if (reason === 'death') subtitle += ' Lifespan ended in the grotto.';

    const saveDiary = () => {
        if (typeof appendQuestJournalEntry === 'function') {
            const beats = events.length
                ? events.map(e => `Year ${e.year}: ${e.text}`).join(' ')
                : 'The years passed without a mark worth carving.';
            appendQuestJournalEntry({
                kind: 'seclusion',
                emoji: '🗻',
                title: reason === 'stopped'
                    ? `Early emergence — ${yearsDone} years`
                    : `Seclusion — ${yearsDone} years`,
                objective: `Age ${startY}–${endY}. ${beats}`,
                status: 'complete'
            });
        }

        const logHtml = reason === 'stopped'
            ? `<u><b>🗻 You leave seclusion after ${yearsDone} years</b></u> (Age ${startY}→${endY}).`
            : `<u><b>🗻 Seclusion complete — ${yearsDone} years</b></u> (Age ${startY}→${endY}).`;
        addLog({ html: logHtml, cls: 'log-seclusion-done' });

        if (typeof triggerTutorial === 'function') triggerTutorial('first_cultivate');
        fullRender();
    };

    if (typeof showHighlightReelPopup === 'function') {
        showHighlightReelPopup({
            title: reason === 'stopped' ? '🗻 You emerge' : '🗻 Seclusion ends',
            subtitle,
            events,
            onContinue: saveDiary
        });
    } else {
        saveDiary();
    }
}

function actionLongSeclusion() {
    openSeclusionPicker();
}

function bindSeclusionProjectEvents() {
    document.getElementById('btnLongSeclusion')?.addEventListener('click', () => {
        if (typeof actionLongSeclusion === 'function') actionLongSeclusion();
    });
    document.getElementById('seclusionPickerClose')?.addEventListener('click', () => {
        document.getElementById('seclusionPickerPopup')?.classList.remove('active');
    });
}
