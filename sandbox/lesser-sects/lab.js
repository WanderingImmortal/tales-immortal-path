'use strict';

const STORAGE_KEY = 'lesser_sects_lab_v1';

let state = null;
let selectedId = null;
let catalog = null;

function $(id) {
    return document.getElementById(id);
}

function setStatus(msg) {
    const el = $('statusLine');
    if (el) el.textContent = msg;
}

function getSeedFromInput() {
    const raw = $('seedInput').value.trim();
    if (raw === '') return 12345;
    const n = Number(raw);
    return Number.isFinite(n) ? (n >>> 0) : LesserSectGen.hashSeedString(raw);
}

function ensureCatalog() {
    if (catalog) return catalog;
    if (typeof buildLesserSectCatalogFromGame === 'function') {
        catalog = buildLesserSectCatalogFromGame();
    } else {
        catalog = LesserSectGen.TEST_CATALOG;
    }
    return catalog;
}

function validateCurrent() {
    const check = LesserSectGen.validateLesserSectState(state, ensureCatalog());
    if (!check.ok) setStatus(`Integrity: ${check.errors.join(' · ')}`);
    else setStatus(`OK — ${state.sects.length} sects · seed ${state.seed}`);
    return check.ok;
}

function renderList() {
    const list = $('sectList');
    list.innerHTML = '';
    if (!state?.sects?.length) {
        list.innerHTML = '<li class="empty-hint">Generate to populate the list.</li>';
        return;
    }
    state.sects.forEach(sect => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = `${sect.name} (${sect.zone})`;
        if (sect.id === selectedId) btn.classList.add('selected');
        btn.addEventListener('click', () => {
            selectedId = sect.id;
            renderList();
            renderDetail();
        });
        li.appendChild(btn);
        list.appendChild(li);
    });
}

function locationLabel(locId) {
    if (typeof WORLD_LOCATIONS !== 'undefined' && WORLD_LOCATIONS[locId]) {
        return WORLD_LOCATIONS[locId].name || locId;
    }
    return locId || '—';
}

function zoneLabel(zoneId) {
    if (typeof ZONES !== 'undefined' && ZONES[zoneId]) {
        return `${ZONES[zoneId].emoji || ''} ${ZONES[zoneId].name || zoneId}`.trim();
    }
    return zoneId;
}

function renderDetail() {
    const pane = $('detailPane');
    const sect = state?.sects?.find(s => s.id === selectedId) || state?.sects?.[0];
    if (!sect) {
        pane.innerHTML = '<p class="empty-hint">Select a sect to inspect members and culture.</p>';
        return;
    }
    selectedId = sect.id;
    const culture = (sect.culture || []).map(c => `<li>${c}</li>`).join('');
    const members = (sect.members || []).map(m => {
        const tag = m.uid === sect.leaderNpcUid ? ' (leader)' : '';
        return `<li>${m.name} — realm ${m.realmIdx}${tag}</li>`;
    }).join('');
    pane.innerHTML = `
        <h2>${sect.name}</h2>
        <div class="meta">
            <div><strong>Zone:</strong> ${zoneLabel(sect.zone)}</div>
            <div><strong>HQ:</strong> ${locationLabel(sect.headquartersLocationId)}</div>
            <div><strong>Focus:</strong> ${sect.focusLabel || sect.focus}</div>
            <div><strong>Doctrine:</strong> ${sect.doctrine}</div>
            <div><strong>Size:</strong> ${sect.size} · ${sect.memberNpcUids?.length || 0} members</div>
            <div><strong>Founded:</strong> month ${sect.foundedAtMonths ?? '?'}</div>
            <div><strong>Founder uid:</strong> ${sect.founderNpcUid}</div>
        </div>
        <p><strong>Culture</strong></p>
        <ul class="members">${culture}</ul>
        <p><strong>Members (embedded)</strong></p>
        <ul class="members">${members}</ul>
    `;
}

function generate(replace) {
    const seed = getSeedFromInput();
    const perZone = Math.max(1, Math.min(5, Number($('perZoneInput').value) || 2));
    catalog = ensureCatalog();
    const incoming = LesserSectGen.generateLesserSects({
        seed,
        catalog,
        sectsPerZone: perZone,
        worldAgeMonths: state?.generatedAtMonths || 600
    });
    state = replace || !state?.sects?.length
        ? incoming
        : LesserSectGen.mergeLesserSectState(state, incoming);
    selectedId = state.sects[0]?.id || null;
    renderList();
    renderDetail();
    validateCurrent();
}

function advanceTime() {
    const months = Math.max(1, Number($('monthsInput').value) || 12);
    if (!state?.sects?.length) return;
    state = LesserSectGen.advanceLesserSectsTimeOnly(state, months, ensureCatalog());
    renderDetail();
    validateCurrent();
}

function saveLab() {
    if (!state) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setStatus(`Saved ${state.sects.length} sects to localStorage`);
}

function loadLab() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        setStatus('No saved lab state');
        return;
    }
    state = JSON.parse(raw);
    $('seedInput').value = String(state.seed ?? '');
    selectedId = state.sects?.[0]?.id || null;
    renderList();
    renderDetail();
    validateCurrent();
}

function init() {
    $('btnGenerate').addEventListener('click', () => generate(true));
    $('btnMergeSeed').addEventListener('click', () => generate(false));
    $('btnAdvance').addEventListener('click', advanceTime);
    $('btnSave').addEventListener('click', saveLab);
    $('btnLoad').addEventListener('click', loadLab);
    $('btnValidate').addEventListener('click', validateCurrent);
    generate(true);
}

document.addEventListener('DOMContentLoaded', init);
