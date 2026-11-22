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
        completedRunIds: [],
        pendingCarryPerk: null
    };
}

let Legacy = getDefaultLegacy();

let legacyFailure = null;
let legacyReadBlocked = false;

function isLegacyReadBlocked() {
    return legacyReadBlocked;
}

function reportLegacyFailure(stage, error) {
    legacyFailure = reportPersistenceFailure('legacy', stage, error, legacyFailure);
    showSaveFailure('Legacy progress could not be saved or loaded. Check browser storage and retry.', 'legacy-status');
}

function clearLegacyFailure() {
    legacyFailure = null;
    showSaveFailure('', 'legacy-status');
}

function loadLegacy() {
    let stage = 'read';
    try {
        const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
        stage = 'parse';
        const data = raw === null ? {} : JSON.parse(raw);
        const isRecord = value => value && typeof value === 'object' && !Array.isArray(value);
        if (!isRecord(data) || (data.version != null && data.version !== 1)
            || (data.unlocks != null && !isRecord(data.unlocks))
            || (data.chronicle != null && !Array.isArray(data.chronicle))
            || (data.completedRunIds != null && (!Array.isArray(data.completedRunIds)
                || !data.completedRunIds.every(isRunId)))
            || (data.pendingCarryToken != null && !isRunId(data.pendingCarryToken))
            || (data.pendingCarryPerk != null && !findCarryPerk(data.pendingCarryPerk))
            || ['totalRuns', 'successfulReincarnations', 'bonusCP'].some(key =>
                data[key] != null && (!Number.isSafeInteger(data[key]) || data[key] < 0))) {
            throw new TypeError('Invalid legacy record.');
        }
        const defaults = getDefaultLegacy();
        Legacy = {
            ...defaults, ...data,
            unlocks: { ...defaults.unlocks, ...data.unlocks },
            chronicle: data.chronicle ?? [],
            completedRunIds: data.completedRunIds ?? []
        };
    } catch (error) {
        legacyReadBlocked = true;
        reportLegacyFailure(stage, error);
        return null;
    }
    if (legacyReadBlocked) clearLegacyFailure();
    legacyReadBlocked = false;
    return Legacy;
}

function saveLegacy(candidate) {
    if (!canMutateGame() || legacyReadBlocked) return false;
    try {
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(candidate));
    } catch (error) {
        reportLegacyFailure('write', error);
        return false;
    }
    Legacy = candidate;
    clearLegacyFailure();
    return true;
}

function isRunId(value) {
    return typeof value === 'string' && value.length > 0;
}

function ensureRunId() {
    return G.runId ||= globalThis.crypto?.randomUUID?.()
        || `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function findCarryPerk(id) {
    return LEGACY_CARRY_PERKS.find(perk => perk.id === id);
}

function validateReincarnationState(data) {
    if (data.runId != null && !isRunId(data.runId)) throw new TypeError('Invalid run identifier.');
    const intent = data.reincarnationIntent;
    if (intent != null && (!isRunId(data.runId) || intent.version !== 1
        || !['bitter', 'true'].includes(intent.endType)
        || (intent.carryPerkId != null && (intent.endType !== 'true' || !findCarryPerk(intent.carryPerkId)))
        || !intent.entry || intent.entry.name !== data.name || intent.entry.endType !== intent.endType
        || typeof intent.message !== 'string')) {
        throw new TypeError('Unrecognized reincarnation transition.');
    }
    const receipt = data.carryPerkReceipt;
    if (receipt != null && (!isRunId(data.runId) || !isRunId(receipt?.token) || !findCarryPerk(receipt.perkId))) {
        throw new TypeError('Unrecognized carry perk receipt.');
    }
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

function applyLegacyUnlocksOnTrueReincarnation(legacy) {
    const n = legacy.successfulReincarnations;
    if (n >= 1) {
        legacy.unlocks.secondTraitSlot = true;
        legacy.unlocks.mutantRoot = true;
        legacy.unlocks.fallenNoble = true;
    }
    if (n >= 2) legacy.unlocks.heavenlyRoot = true;
}

function stageRunEnd(endType, carryPerkId, message) {
    if (!canMutateGame()) return false;
    if (!G.name || G.sectSuccessionActive || G.reincarnationIntent) return false;
    ensureRunId();
    G.reincarnationIntent = { version: 1, endType, carryPerkId, message, entry: buildChronicleEntry(endType) };
    return true;
}

// The active run save doubles as the journal. Only this path can write a pending intent.
function persistRunEndIntent() {
    if (!canMutateGame()) return false;
    try {
        validateReincarnationState(G);
        const raw = localStorage.getItem(RUN_SAVE_KEY);
        if (raw !== null) {
            const stored = JSON.parse(raw);
            validateLoadedSave(stored);
            validateReincarnationState(stored);
            if (stored.runId != null && stored.runId !== G.runId) {
                throw new Error('The active save belongs to a different life.');
            }
            if (stored.reincarnationIntent) {
                if (JSON.stringify(stored.reincarnationIntent) !== JSON.stringify(G.reincarnationIntent)) {
                    throw new Error('The active save contains a different transition.');
                }
                return true;
            }
        }
        return saveState({ writeReincarnationIntent: true });
    } catch (error) {
        reportLegacyFailure('read-run', error);
        return false;
    }
}

function processRunEnd() {
    const intent = G.reincarnationIntent;
    if (!intent || !persistRunEndIntent()) return null;
    let stage = 'commit-run';
    try {
        if (!loadLegacy()) return null;
        const cpGain = LEGACY_BONUS_CP[intent.endType];
        if (!Legacy.completedRunIds.includes(G.runId)) {
            // A prior carry receipt can still need cleanup after a failed legacy write.
            if (!commitSavedCarryPerk()) return null;
            const next = {
                ...Legacy,
                totalRuns: (Legacy.totalRuns || 0) + 1,
                bonusCP: (Legacy.bonusCP || 0) + cpGain,
                completedRunIds: [...Legacy.completedRunIds, G.runId],
                chronicle: [intent.entry, ...Legacy.chronicle].slice(0, 5),
                unlocks: { ...Legacy.unlocks }
            };
            if (intent.endType === 'true') {
                next.successfulReincarnations = (next.successfulReincarnations || 0) + 1;
                applyLegacyUnlocksOnTrueReincarnation(next);
                if (intent.carryPerkId) {
                    next.pendingCarryPerk = intent.carryPerkId;
                    next.pendingCarryToken = G.runId;
                }
            }
            if (!saveLegacy(next)) return null;
        }

        stage = 'remove-run';
        localStorage.removeItem(RUN_SAVE_KEY);
        clearLegacyFailure();
        return { cpGain, ...intent };
    } catch (error) {
        reportLegacyFailure(stage, error);
        return null;
    }
}

function returnToCreationAfterReincarnation() {
    if (!canMutateGame()) return false;
    const result = processRunEnd();
    if (!result) {
        showLoadRecovery('Reincarnation is paused. Check browser storage, then retry.', returnToCreationAfterReincarnation);
        return false;
    }

    G = { log: [], gameOver: false };
    currentZone = 'dustbone';
    document.getElementById('load-error').hidden = true;
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('creation-screen').style.display = '';
    if (typeof resetCreationState === 'function') resetCreationState();
    setupCreation();
    openReincarnationSummaryModal(result.endType, result.message, result.cpGain);
    return true;
}

function triggerBitterReincarnation(reason) {
    if (!G.gameOver || !stageRunEnd('bitter', null,
        reason || 'Your path ends in bitterness. The wheel turns — you may begin anew.')) return;
    const dyingRun = G;
    persistRunEndIntent();
    setTimeout(() => {
        if (G === dyingRun) returnToCreationAfterReincarnation();
    }, 1400);
}

function triggerTrueReincarnation(carryPerkId) {
    if (!isImmortal() || (carryPerkId && !findCarryPerk(carryPerkId))) return false;
    if (!stageRunEnd('true', carryPerkId || null,
        'You shed this mortal shell willingly. True Reincarnation carries your legacy forward.')) return false;
    return returnToCreationAfterReincarnation();
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

function getPendingCarryToken() {
    return Legacy.pendingCarryToken || 'pre-transaction-carry';
}

function applyPendingCarryPerk() {
    if (!canMutateGame()) return;
    const perk = findCarryPerk(Legacy.pendingCarryPerk);
    if (!perk || G.carryPerkReceipt) return;
    ensureRunId();
    const perkId = perk.id;
    if (perkId === 'echo_of_qi') G._legacyCultivateBonusPct = 5;
    if (perkId === 'echo_of_foundation') grantFoundation(3);
    if (perkId === 'echo_of_fortune') G.stones = (G.stones || 0) + 25;
    if (perkId === 'echo_of_memory') G._legacyDaoBonusPct = 5;
    G.carryPerkReceipt = { token: getPendingCarryToken(), perkId };
    addLog(`🌀 Legacy echo: ${perk.name} — ${perk.desc}`);
}

// Call only after the receipt and its effects are durable in the active run save.
function commitSavedCarryPerk() {
    const receipt = G.carryPerkReceipt;
    if (!receipt || receipt.token !== getPendingCarryToken() || receipt.perkId !== Legacy.pendingCarryPerk) return true;
    return saveLegacy({ ...Legacy, pendingCarryPerk: null, pendingCarryToken: null });
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
