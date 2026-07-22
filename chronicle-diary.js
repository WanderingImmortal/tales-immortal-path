// ============================================
// CHRONICLE-DIARY.JS — Unified diary reader (v0)
// Pulls existing logs into one narrativized list.
// Watch-mode projects / time playback = later.
// ============================================

function normalizeJournalTab(tabId) {
    if (tabId === 'active' || tabId === 'arc' || tabId === 'legacy') return 'path';
    if (tabId === 'world') return 'jianghu';
    if (tabId === 'path' || tabId === 'sect' || tabId === 'jianghu' || tabId === 'ancient') return tabId;
    return 'path';
}

function diaryAgeYears(months) {
    return Math.max(0, Math.floor((months || 0) / 12));
}

function diaryEraBand(months) {
    const y = diaryAgeYears(months);
    const start = Math.floor(y / 40) * 40;
    return { start, end: start + 39, key: `${start}-${start + 39}` };
}

function diaryEraTitle(months) {
    const band = diaryEraBand(months);
    return `── Ages ${band.start}–${band.end} ──`;
}

function diaryAgeLabel(months) {
    if (months == null) return '';
    if (typeof formatYears === 'function') return formatYears(months);
    return `Age ${diaryAgeYears(months)}`;
}

function escapeDiaryHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/** Normalize any source row into a diary entry. */
function toDiaryEntry(raw) {
    if (!raw) return null;
    const months = raw.months != null ? raw.months : null;
    const title = raw.title || raw.summary || raw.text || 'Untitled';
    const body = raw.body || raw.objective || raw.text || raw.summary || '';
    const emoji = raw.emoji || '📜';
    let status = raw.status || 'logged';
    if (status === 'unlocked') status = 'logged';
    return {
        months,
        ageLabel: raw.ageLabel || (months != null ? diaryAgeLabel(months) : ''),
        scope: raw.scope || 'self',
        category: raw.category || raw.kind || 'story',
        title: String(title),
        body: body && body !== title ? String(body) : '',
        emoji,
        status,
        stageName: raw.stageName || null,
        resolution: raw.resolution || null,
        metaExtra: raw.metaExtra || null
    };
}

function sortDiaryNewestFirst(a, b) {
    const am = a.months != null ? a.months : -1;
    const bm = b.months != null ? b.months : -1;
    return bm - am;
}

function collectDiaryPathEntries() {
    const out = [];
    if (typeof getQuestJournalEntries === 'function') {
        getQuestJournalEntries().forEach(e => {
            if (!e) return;
            if (e.kind === 'world' || e.kind === 'ancient' || e.kind === 'sect') return;
            const row = toDiaryEntry({
                ...e,
                scope: 'self',
                category: e.kind === 'sect' ? 'sect-duty' : (e.kind || 'quest'),
                emoji: e.status === 'active' ? '◆' : (e.kind === 'sect' ? '🏯' : '📖'),
                title: e.title,
                body: e.objective,
                metaExtra: e.kind === 'sect' ? 'sect duty' : (e.kind === 'active' || e.arcId ? 'story arc' : (e.kind || 'quest'))
            });
            if (row) out.push(row);
        });
    }
    if (typeof STORY_ARCS !== 'undefined') {
        Object.keys(STORY_ARCS).forEach(arcId => {
            const state = typeof getStoryArcState === 'function' ? getStoryArcState(arcId) : null;
            if (!state || state.status === 'active') return;
            if (state.status !== 'complete' && state.status !== 'failed') return;
            const def = STORY_ARCS[arcId];
            out.push(toDiaryEntry({
                months: state.completedMonths != null ? state.completedMonths : state.startedMonths,
                scope: 'self',
                category: 'arc',
                emoji: def.emoji || '🌟',
                title: def.title,
                body: state.status === 'complete' ? 'Arc resolved.' : 'Arc failed or abandoned.',
                status: state.status === 'complete' ? 'complete' : 'failed',
                metaExtra: 'story arc'
            }));
        });
    }
    return out.filter(Boolean).sort(sortDiaryNewestFirst);
}

function collectDiarySectEntries() {
    const out = [];
    if (typeof isSectFounded === 'function' && isSectFounded() && G.sect?.chronicle?.length) {
        G.sect.chronicle.forEach(e => {
            const yearLabel = e.sectAgeYears != null
                ? (e.sectAgeYears > 0 ? `Sect year ${e.sectAgeYears}` : 'Founding')
                : null;
            out.push(toDiaryEntry({
                months: e.months,
                scope: 'sect',
                category: 'sect',
                emoji: e.emoji || '🏯',
                title: e.text,
                body: '',
                status: 'logged',
                metaExtra: [yearLabel, e.generation != null ? `Gen ${e.generation}` : null, e.leader]
                    .filter(Boolean).join(' · ')
            }));
        });
    }
    if (typeof getQuestJournalEntries === 'function') {
        getQuestJournalEntries().forEach(e => {
            if (e?.kind !== 'sect') return;
            out.push(toDiaryEntry({
                ...e,
                scope: 'sect',
                category: 'sect-duty',
                emoji: '📋',
                title: e.title,
                body: e.objective,
                metaExtra: 'sect duty'
            }));
        });
    }
    return out.filter(Boolean).sort(sortDiaryNewestFirst);
}

function collectDiaryJianghuEntries() {
    const out = [];
    if (G.worldChronicle?.length) {
        [...G.worldChronicle].reverse().forEach(e => {
            out.push(toDiaryEntry({
                months: e.months,
                scope: 'world',
                category: e.type || 'world',
                emoji: e.emoji || '🌍',
                title: e.summary || e.text,
                body: e.text && e.text !== e.summary ? e.text : '',
                status: 'logged',
                metaExtra: e.zoneId && ZONES[e.zoneId] ? ZONES[e.zoneId].name : 'jianghu'
            }));
        });
    }
    if (G.factions?.chronicle?.length) {
        G.factions.chronicle.forEach(e => {
            out.push(toDiaryEntry({
                months: e.months,
                ageLabel: e.ageLabel,
                scope: 'world',
                category: e.category || 'faction',
                emoji: e.emoji || '🏛️',
                title: e.title || e.summary || e.text,
                body: e.text || e.body || '',
                status: 'logged',
                metaExtra: 'faction'
            }));
        });
    }
    if (typeof getQuestJournalEntries === 'function') {
        getQuestJournalEntries().forEach(e => {
            if (e?.kind !== 'world') return;
            out.push(toDiaryEntry({
                ...e,
                scope: 'world',
                category: 'world-quest',
                emoji: '🌍',
                title: e.title,
                body: e.objective,
                metaExtra: 'world lead'
            }));
        });
    }
    return out.filter(Boolean).sort(sortDiaryNewestFirst);
}

function getDiaryEntriesForTab(tabId) {
    const tab = normalizeJournalTab(tabId);
    if (tab === 'sect') return collectDiarySectEntries();
    if (tab === 'jianghu') return collectDiaryJianghuEntries();
    if (tab === 'path') return collectDiaryPathEntries();
    return [];
}

function getDiaryTabHint(tabId) {
    const tab = normalizeJournalTab(tabId);
    if (tab === 'path') {
        const active = typeof getActiveQuestCount === 'function' ? getActiveQuestCount() : 0;
        const arcs = G.legacyChain?.completedArcIds?.length || 0;
        const legacy = G.legacyChain?.unlocked ? ' · Legacy unlocked' : '';
        return `Your path — ${active} active quest${active === 1 ? '' : 's'} · ${arcs} arc${arcs === 1 ? '' : 's'} logged${legacy}`;
    }
    if (tab === 'sect') {
        if (typeof isSectFounded !== 'function' || !isSectFounded()) {
            return 'Found a sect to begin its chronicle.';
        }
        const n = G.sect?.chronicle?.length || 0;
        const name = G.sect?.name || 'Your sect';
        return `${name} — ${n} chronicle entr${n === 1 ? 'y' : 'ies'}`;
    }
    if (tab === 'jianghu') {
        const w = G.worldChronicle?.length || 0;
        const f = G.factions?.chronicle?.length || 0;
        return `Jianghu — ${w} world · ${f} faction notes`;
    }
    if (tab === 'ancient' && typeof getSealedSitesChronicleSummary === 'function') {
        const summary = getSealedSitesChronicleSummary();
        return `${summary.clueCount} clues · ${summary.unsealedCount}/5 unsealed${summary.penalty ? ` · −${summary.penalty}% search competition` : ''}`;
    }
    return 'Your life as a story — not a spreadsheet.';
}

function renderDiaryEntryHtml(entry) {
    if (!entry) return '';
    const statusCls = entry.status === 'complete' || entry.status === 'logged'
        ? 'journal-done'
        : entry.status === 'failed'
            ? 'journal-failed'
            : entry.status === 'active'
                ? 'journal-active'
                : 'journal-done';
    const stage = entry.stageName ? ` · ${escapeDiaryHtml(entry.stageName)}` : '';
    const age = entry.ageLabel ? escapeDiaryHtml(entry.ageLabel) : '';
    const metaBits = [
        entry.metaExtra ? escapeDiaryHtml(entry.metaExtra) : null,
        age || null,
        entry.resolution ? escapeDiaryHtml(entry.resolution) : null
    ].filter(Boolean);
    const body = entry.body ? `<div class="quest-journal-objective diary-entry-body">${escapeDiaryHtml(entry.body)}</div>` : '';
    return `<div class="quest-journal-entry diary-entry ${statusCls}">
        <div class="quest-journal-title">${entry.emoji} ${escapeDiaryHtml(entry.title)}${stage}</div>
        ${metaBits.length ? `<div class="quest-journal-meta">${metaBits.join(' · ')}</div>` : ''}
        ${body}
    </div>`;
}

/** Newest-first list with era chapter headers when the age band changes. */
function renderDiaryListWithEras(entries, emptyMsg) {
    if (!entries?.length) {
        return `<p class="quest-journal-empty">${escapeDiaryHtml(emptyMsg || 'Nothing in this chronicle tab yet.')}</p>`;
    }
    const capped = entries.slice(0, 48);
    let html = '';
    let lastKey = null;
    capped.forEach(e => {
        if (e.months != null) {
            const key = diaryEraBand(e.months).key;
            if (key !== lastKey) {
                html += `<div class="diary-era-chapter">${escapeDiaryHtml(diaryEraTitle(e.months))}</div>`;
                lastKey = key;
            }
        }
        html += renderDiaryEntryHtml(e);
    });
    return html;
}

function renderDiaryTabHtml(tabId) {
    const tab = normalizeJournalTab(tabId);
    if (tab === 'ancient') return null;

    const empty = {
        path: 'Your path is still unwritten — quests, arcs, and duties will appear here.',
        sect: (typeof isSectFounded === 'function' && isSectFounded())
            ? 'No sect chronicle entries yet.'
            : 'Found a sect to begin its chronicle.',
        jianghu: 'The jianghu is quiet in your records — travel, factions, and world events will fill this page.'
    };
    return renderDiaryListWithEras(getDiaryEntriesForTab(tab), empty[tab]);
}
