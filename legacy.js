// ============================================
// LEGACY.JS — Meta-progression across reincarnations
// ============================================

const LEGACY_STORAGE_KEY = 'xianxia_legacy';

function getDefaultLegacy() {
    return {
        version: 1,
        totalRuns: 0,
        successfulReincarnations: 0,
        bonusCP: 0,
        unlocks: {
            secondTraitSlot: false,
            mutantRoot: false,
            heavenlyRoot: false,
            merchantHeir: true,
            sectReject: true,
            fallenNoble: false,
            artificialRoot: false
        },
        chronicle: [],
        pendingCarryPerk: null
    };
}

let Legacy = getDefaultLegacy();

function loadLegacy() {
    try {
        const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (!raw) {
            Legacy = getDefaultLegacy();
            return Legacy;
        }
        const data = JSON.parse(raw);
        Legacy = { ...getDefaultLegacy(), ...data, unlocks: { ...getDefaultLegacy().unlocks, ...(data.unlocks || {}) } };
    } catch (e) {
        Legacy = getDefaultLegacy();
    }
    return Legacy;
}

function saveLegacy() {
    try {
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(Legacy));
    } catch (e) { /* ignore */ }
}

function getLegacyBonusCP() {
    return Legacy?.bonusCP || 0;
}

function getCreationTotalCP() {
    return (typeof CREATION_BASE_CP !== 'undefined' ? CREATION_BASE_CP : 10) + getLegacyBonusCP();
}

function getMaxTraitSlots() {
    return Legacy?.unlocks?.secondTraitSlot
        ? (typeof CREATION_MAX_TRAITS_LEGACY !== 'undefined' ? CREATION_MAX_TRAITS_LEGACY : 2)
        : (typeof CREATION_MAX_TRAITS_DEFAULT !== 'undefined' ? CREATION_MAX_TRAITS_DEFAULT : 1);
}

function isTalentUnlocked(talentId) {
    const def = TALENT_BY_ID?.[talentId];
    if (!def?.requiresUnlock) return true;
    if (def.canBuyWithoutUnlock) return true;
    return !!Legacy?.unlocks?.[def.requiresUnlock];
}

function isOriginUnlocked(originId) {
    const def = ORIGIN_BY_ID?.[originId];
    if (!def?.requiresUnlock) return true;
    return !!Legacy?.unlocks?.[def.requiresUnlock];
}

function isHeavenlyRootLocked() {
    return !Legacy?.unlocks?.heavenlyRoot;
}

function getPeakRealmName() {
    const path = G?.path || 'qi';
    const realms = PATHS[path]?.realms || [];
    const idx = Math.min(G?.realmIdx ?? 0, realms.length - 1);
    return realms[idx] || 'Mortal';
}

function buildChronicleEntry(endType) {
    const traits = (G.traits || []).map(t => t.name || t.id);
    if (!traits.length && G.trait) traits.push(G.trait.name || G.trait.id);
    return {
        name: G.name,
        talent: G.talent?.name || '—',
        traits,
        peakRealm: getPeakRealmName(),
        endType,
        age: typeof formatYears === 'function' ? formatYears(G.ageMonths || 0) : `${G.ageMonths || 0}m`
    };
}

function applyLegacyUnlocksOnTrueReincarnation() {
    const n = Legacy.successfulReincarnations;
    if (n >= 1) {
        Legacy.unlocks.secondTraitSlot = true;
        Legacy.unlocks.mutantRoot = true;
    }
    if (n >= 1) Legacy.unlocks.fallenNoble = true;
    if (n >= 2) Legacy.unlocks.heavenlyRoot = true;
}

function awardLegacyBonusCP(endType) {
    const table = typeof LEGACY_BONUS_CP !== 'undefined' ? LEGACY_BONUS_CP : { bitter: 1, true: 2 };
    const gain = table[endType] || 0;
    Legacy.bonusCP = (Legacy.bonusCP || 0) + gain;
    return gain;
}

function processRunEnd(endType) {
    loadLegacy();
    Legacy.totalRuns = (Legacy.totalRuns || 0) + 1;
    const entry = buildChronicleEntry(endType);
    Legacy.chronicle = [entry, ...(Legacy.chronicle || [])].slice(0, 5);

    let cpGain = 0;
    if (endType === 'true') {
        Legacy.successfulReincarnations = (Legacy.successfulReincarnations || 0) + 1;
        applyLegacyUnlocksOnTrueReincarnation();
        cpGain = awardLegacyBonusCP('true');
    } else {
        cpGain = awardLegacyBonusCP('bitter');
    }
    saveLegacy();
    try { localStorage.removeItem('xianxia_save'); } catch (e) { /* ignore */ }
    return { cpGain, entry };
}

function clearRunStateForReincarnation() {
    try { localStorage.removeItem('xianxia_save'); } catch (e) { /* ignore */ }
    G = { log: [], gameOver: false };
    currentZone = 'dustbone';
}

function returnToCreationAfterReincarnation(endType, message) {
    const result = processRunEnd(endType);
    clearRunStateForReincarnation();
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('creation-screen').style.display = '';
    if (typeof resetCreationState === 'function') resetCreationState();
    if (typeof setupCreation === 'function') setupCreation(true);
    openReincarnationSummaryModal(endType, message, result.cpGain);
}

function triggerBitterReincarnation(reason) {
    if (G._reincarnationHandled) return;
    G._reincarnationHandled = true;
    const msg = reason || 'Your path ends in bitterness. The wheel turns — you may begin anew.';
    setTimeout(() => {
        returnToCreationAfterReincarnation('bitter', msg);
    }, 800);
}

function triggerTrueReincarnation(carryPerkId) {
    if (carryPerkId) Legacy.pendingCarryPerk = carryPerkId;
    saveLegacy();
    const msg = 'You shed this mortal shell willingly. True Reincarnation carries your legacy forward.';
    returnToCreationAfterReincarnation('true', msg);
}

function openReincarnationSummaryModal(endType, message, cpGain) {
    let modal = document.getElementById('reincarnationModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'reincarnationModal';
        modal.className = 'reincarnation-modal';
        modal.innerHTML = `
            <div class="reincarnation-modal-inner">
                <h3 id="reincarnationModalTitle"></h3>
                <p id="reincarnationModalBody"></p>
                <p id="reincarnationModalCp" class="reincarnation-cp"></p>
                <div id="reincarnationModalChronicle" class="reincarnation-chronicle"></div>
                <button type="button" id="reincarnationModalClose" class="start-btn">Begin Anew</button>
            </div>`;
        document.body.appendChild(modal);
        modal.querySelector('#reincarnationModalClose').addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }
    const title = endType === 'true' ? '🌟 True Reincarnation' : '💀 Bitter Reincarnation';
    document.getElementById('reincarnationModalTitle').textContent = title;
    document.getElementById('reincarnationModalBody').textContent = message;
    const cpEl = document.getElementById('reincarnationModalCp');
    if (cpEl) {
        cpEl.textContent = cpGain > 0
            ? `Legacy grants +${cpGain} Creation Points for your next life. (Total bonus: ${getLegacyBonusCP()} CP)`
            : '';
    }
    const chronicleEl = document.getElementById('reincarnationModalChronicle');
    const recent = (Legacy.chronicle || []).slice(0, 3);
    chronicleEl.innerHTML = recent.length
        ? `<div class="creation-label">Chronicle</div>${recent.map(e =>
            `<div class="chronicle-entry">${e.name} · ${e.talent} · ${e.peakRealm} · ${e.endType}</div>`
        ).join('')}`
        : '';
    modal.classList.add('active');
}

function openTrueReincarnationChoice() {
    if (!isImmortal()) {
        addLog('🚫 Only an Immortal Ascendant may choose True Reincarnation.');
        return;
    }
    let modal = document.getElementById('trueReincarnationModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'trueReincarnationModal';
        modal.className = 'reincarnation-modal';
        modal.innerHTML = `
            <div class="reincarnation-modal-inner wide">
                <h3>🌟 Immortal Ascension — True Reincarnation</h3>
                <p class="reincarnation-flavor">Heaven's gate stands open. Shed this shell and begin anew with accumulated legacy — or linger (Heavenly Court awaits, stub).</p>
                <div class="creation-label">Carry one echo into your next life (optional)</div>
                <div id="carryPerkOptions" class="creation-options trait-grid"></div>
                <div class="reincarnation-actions">
                    <button type="button" id="btnConfirmTrueReincarnation" class="start-btn">🌀 Reincarnate</button>
                    <button type="button" id="btnCancelTrueReincarnation" class="details-toggle">Remain Ascendant</button>
                </div>
            </div>`;
        document.body.appendChild(modal);
        modal.querySelector('#btnCancelTrueReincarnation').addEventListener('click', () => modal.classList.remove('active'));
        modal.querySelector('#btnConfirmTrueReincarnation').addEventListener('click', () => {
            const selected = modal.querySelector('.carry-perk-card.selected');
            const perkId = selected?.dataset?.perk || null;
            modal.classList.remove('active');
            triggerTrueReincarnation(perkId);
        });
    }
    const container = modal.querySelector('#carryPerkOptions');
    const perks = typeof LEGACY_CARRY_PERKS !== 'undefined' ? LEGACY_CARRY_PERKS : [];
    container.innerHTML = perks.map((p, i) =>
        `<button type="button" class="popup-item trait-card carry-perk-card${i === 0 ? ' selected' : ''}" data-perk="${p.id}">
            <div class="name">${p.name}</div>
            <div class="desc">${p.desc}</div>
        </button>`
    ).join('') + `<button type="button" class="popup-item trait-card carry-perk-card" data-perk="">
        <div class="name">None</div>
        <div class="desc">Begin without a carry perk.</div>
    </button>`;
    container.querySelectorAll('.carry-perk-card').forEach(card => {
        card.addEventListener('click', () => {
            container.querySelectorAll('.carry-perk-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });
    modal.classList.add('active');
}

function applyPendingCarryPerk() {
    const perkId = Legacy?.pendingCarryPerk;
    if (!perkId) return;
    const perk = LEGACY_CARRY_PERKS?.find(p => p.id === perkId);
    if (!perk) return;
    if (perkId === 'echo_of_qi') G._legacyCultivateBonusPct = 5;
    if (perkId === 'echo_of_foundation') grantFoundation(3);
    if (perkId === 'echo_of_fortune') G.stones = (G.stones || 0) + 25;
    if (perkId === 'echo_of_memory') G._legacyDaoBonusPct = 5;
    addLog(`🌀 Legacy echo: ${perk.name} — ${perk.desc}`);
    Legacy.pendingCarryPerk = null;
    saveLegacy();
}

function getLegacyCultivateBonusMult() {
    const pct = G._legacyCultivateBonusPct || 0;
    return 1 + pct / 100;
}

function getLegacyDaoBonusMult() {
    const pct = G._legacyDaoBonusPct || 0;
    return 1 + pct / 100;
}

function renderLegacyChroniclePanel(container) {
    if (!container) return;
    loadLegacy();
    const runs = Legacy.totalRuns || 0;
    const bonus = getLegacyBonusCP();
    const reinc = Legacy.successfulReincarnations || 0;
    let html = `<div class="legacy-summary">
        <div class="legacy-summary-title">🌀 Legacy</div>
        <div class="legacy-summary-stats">${runs} past lives · ${reinc} true reincarnations · +${bonus} bonus CP</div>`;
    if (Legacy.chronicle?.length) {
        html += '<div class="legacy-chronicle-list">';
        Legacy.chronicle.forEach(e => {
            html += `<div class="chronicle-entry">${e.name} — ${e.talent} — peaked ${e.peakRealm} (${e.endType})</div>`;
        });
        html += '</div>';
    }
    html += '</div>';
    container.innerHTML = html;
}

function checkGameOverForReincarnation() {
    if (G.gameOver && !G._reincarnationHandled && !G.sectSuccessionActive) {
        triggerBitterReincarnation();
    }
}
