// ============================================
// PLAYTEST-FEEDBACK.JS — Sidebar notes for playtesters (localStorage + export)
// ============================================
// Set to false before a public release to hide the panel entirely.

const PLAYTEST_FEEDBACK_ENABLED = true;
const PLAYTEST_STORAGE_KEY = 'wi_playtest_notes_v1';
const PLAYTEST_TESTER_KEY = 'wi_playtest_tester_name';

function loadPlaytestNotes() {
    try {
        const raw = localStorage.getItem(PLAYTEST_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function savePlaytestNotes(notes) {
    try {
        localStorage.setItem(PLAYTEST_STORAGE_KEY, JSON.stringify(notes));
    } catch {
        /* quota or private mode */
    }
}

function getPlaytestTesterName() {
    try {
        return localStorage.getItem(PLAYTEST_TESTER_KEY) || '';
    } catch {
        return '';
    }
}

function setPlaytestTesterName(name) {
    try {
        if (name) localStorage.setItem(PLAYTEST_TESTER_KEY, name);
        else localStorage.removeItem(PLAYTEST_TESTER_KEY);
    } catch {
        /* ignore */
    }
}

function getPlaytestGameContext() {
    if (typeof G === 'undefined' || !G) return {};
    const realm = typeof getRealm === 'function' ? getRealm() : `realm ${G.realmIdx ?? 0}`;
    const zone = G.currentZone || (typeof currentZone !== 'undefined' ? currentZone : '—');
    const age = typeof formatYears === 'function' ? formatYears(G.ageMonths || 0) : `${G.ageMonths || 0}mo`;
    const flags = [];
    if (G.inCombat) flags.push('combat');
    if (G.inBodyChamber) flags.push('body-chamber');
    if (G.inQiChamber) flags.push('qi-chamber');
    if (G.inAlchemyChamber) flags.push('alchemy-chamber');
    if (G.inForgeChamber) flags.push('forge-chamber');
    if (G.inCultivationHub) flags.push('cultivation-hub');
    if (typeof isTribulationActive === 'function' && isTribulationActive()) flags.push('tribulation');
    return {
        realm,
        zone,
        age,
        path: G.path || '—',
        flags: flags.length ? flags.join(', ') : '—'
    };
}

function formatPlaytestTimestamp(ts) {
    const d = new Date(ts);
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatPlaytestNotesText(notes, testerName) {
    const lines = [
        '=== Tales of the Immortal Path — Playtest Notes ===',
        `Exported: ${formatPlaytestTimestamp(Date.now())}`,
        testerName ? `Tester: ${testerName}` : 'Tester: (anonymous)',
        `Entries: ${notes.length}`,
        '',
        '---',
        ''
    ];
    notes.forEach((note, i) => {
        const ctx = note.context || {};
        lines.push(`[${i + 1}] ${formatPlaytestTimestamp(note.ts)} · ${note.category.toUpperCase()}`);
        lines.push(`    Context: ${ctx.age || '?'} · ${ctx.realm || '?'} · ${ctx.zone || '?'} · path ${ctx.path || '?'}${ctx.flags && ctx.flags !== '—' ? ` · ${ctx.flags}` : ''}`);
        note.text.split(/\r?\n/).forEach(line => lines.push(`    ${line}`));
        lines.push('');
    });
    return lines.join('\n').trimEnd() + '\n';
}

function setPlaytestStatus(msg, isError) {
    const el = document.getElementById('playtestStatus');
    if (!el) return;
    el.textContent = msg || '';
    el.classList.toggle('playtest-status-error', !!isError);
    if (msg) {
        clearTimeout(el._playtestStatusTimer);
        el._playtestStatusTimer = setTimeout(() => {
            el.textContent = '';
            el.classList.remove('playtest-status-error');
        }, 3200);
    }
}

function renderPlaytestNoteList() {
    const list = document.getElementById('playtestList');
    if (!list) return;
    const notes = loadPlaytestNotes();
    list.replaceChildren();
    if (!notes.length) {
        const empty = document.createElement('li');
        empty.className = 'playtest-empty';
        empty.textContent = 'No notes yet.';
        list.appendChild(empty);
        return;
    }
    [...notes].reverse().forEach(note => {
        const li = document.createElement('li');
        li.className = 'playtest-note';
        const head = document.createElement('div');
        head.className = 'playtest-note-head';
        head.innerHTML = `<span class="playtest-cat playtest-cat-${note.category}">${note.category}</span>`
            + `<span class="playtest-note-time">${formatPlaytestTimestamp(note.ts)}</span>`
            + `<button type="button" class="playtest-note-del" data-id="${note.id}" title="Remove">×</button>`;
        const body = document.createElement('div');
        body.className = 'playtest-note-text';
        body.textContent = note.text;
        const ctx = document.createElement('div');
        ctx.className = 'playtest-note-ctx';
        const c = note.context || {};
        ctx.textContent = `${c.realm || '?'} · ${c.zone || '?'} · ${c.age || '?'}`;
        li.appendChild(head);
        li.appendChild(body);
        li.appendChild(ctx);
        list.appendChild(li);
    });
    list.querySelectorAll('.playtest-note-del').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            const next = loadPlaytestNotes().filter(n => n.id !== id);
            savePlaytestNotes(next);
            renderPlaytestNoteList();
            setPlaytestStatus('Note removed.');
        });
    });
}

function addPlaytestNote() {
    const input = document.getElementById('playtestInput');
    const catEl = document.getElementById('playtestCategory');
    if (!input || !catEl) return;
    const text = input.value.trim();
    if (!text) {
        setPlaytestStatus('Write something first.', true);
        input.focus();
        return;
    }
    const category = catEl.value || 'note';
    const note = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ts: Date.now(),
        category,
        text,
        context: getPlaytestGameContext()
    };
    const notes = loadPlaytestNotes();
    notes.push(note);
    savePlaytestNotes(notes);
    input.value = '';
    renderPlaytestNoteList();
    setPlaytestStatus('Note saved locally.');
    input.focus();
}

function copyPlaytestNotes() {
    const notes = loadPlaytestNotes();
    if (!notes.length) {
        setPlaytestStatus('Nothing to copy yet.', true);
        return;
    }
    const tester = document.getElementById('playtestTester')?.value?.trim() || getPlaytestTesterName();
    const text = formatPlaytestNotesText(notes, tester);
    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            setPlaytestStatus('Copied to clipboard — paste into Discord or email.');
        }).catch(() => {
            setPlaytestStatus('Copy failed — try Download .txt instead.', true);
        });
    } else {
        setPlaytestStatus('Clipboard unavailable — use Download .txt.', true);
    }
}

function downloadPlaytestNotes() {
    const notes = loadPlaytestNotes();
    if (!notes.length) {
        setPlaytestStatus('Nothing to download yet.', true);
        return;
    }
    const tester = document.getElementById('playtestTester')?.value?.trim() || getPlaytestTesterName();
    const text = formatPlaytestNotesText(notes, tester);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    const who = (tester || 'playtest').replace(/[^\w\-]+/g, '-').slice(0, 24);
    a.href = url;
    a.download = `immortal-path-playtest-${who}-${stamp}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setPlaytestStatus('Downloaded .txt file.');
}

function clearPlaytestNotes() {
    const notes = loadPlaytestNotes();
    if (!notes.length) {
        setPlaytestStatus('Already empty.', true);
        return;
    }
    if (!confirm(`Clear all ${notes.length} playtest note(s)?`)) return;
    savePlaytestNotes([]);
    renderPlaytestNoteList();
    setPlaytestStatus('All notes cleared.');
}

function togglePlaytestPanel() {
    const body = document.getElementById('playtestBody');
    const btn = document.getElementById('playtestToggle');
    if (!body || !btn) return;
    const open = body.classList.toggle('open');
    btn.textContent = open ? '📝 Playtest notes ▲' : '📝 Playtest notes ▼';
}

function initPlaytestFeedback() {
    if (!PLAYTEST_FEEDBACK_ENABLED) {
        document.getElementById('playtestPanel')?.remove();
        return;
    }
    const testerInput = document.getElementById('playtestTester');
    if (testerInput) {
        testerInput.value = getPlaytestTesterName();
        testerInput.addEventListener('change', () => setPlaytestTesterName(testerInput.value.trim()));
    }
    document.getElementById('playtestToggle')?.addEventListener('click', togglePlaytestPanel);
    document.getElementById('playtestAdd')?.addEventListener('click', addPlaytestNote);
    document.getElementById('playtestCopy')?.addEventListener('click', copyPlaytestNotes);
    document.getElementById('playtestDownload')?.addEventListener('click', downloadPlaytestNotes);
    document.getElementById('playtestClear')?.addEventListener('click', clearPlaytestNotes);
    document.getElementById('playtestInput')?.addEventListener('keydown', e => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            addPlaytestNote();
        }
    });
    renderPlaytestNoteList();
}
