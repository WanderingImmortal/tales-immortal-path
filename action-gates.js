// ============================================
// ACTION-GATES.JS — Realm & milestone action unlocks (not age)
// ============================================

const ACTION_UNLOCK_CUSTOM_CHECKS = {
    canRecruitDisciples: () => typeof canRecruitDisciples === 'function' && canRecruitDisciples()
};

const ACTION_UNLOCK_SKIP_RENDER = new Set(['consolidate', 'breakthrough', 'search', 'market']);

/** Neutral tier labels for shared world gates (minRealm index). */
const GATE_TIER_LABELS = [
    'first realm',
    'second realm',
    'major realm',
    'fourth realm',
    'fifth realm',
    'sixth realm',
    'seventh realm'
];

/** Path-specific action unlocks — all other minRealm checks use effective tier. */
const ACTION_UNLOCK_TIER_SOURCE = {
    intent: 'dantian',
    physique: 'vessel'
};

/** Max tier across dantian / vessel / spirit — world gates (sect, forbidden, factions, etc.). */
function getGateRealmTier() {
    if (typeof getEffectiveRealmTier === 'function') return getEffectiveRealmTier();
    return G.realmIdx || 0;
}

function getGateTierNeutralLabel(realmIdx) {
    return GATE_TIER_LABELS[realmIdx] || `realm ${realmIdx + 1}`;
}

function getMajorRealmGateLabel() {
    return 'a major realm on any refinement';
}

function formatGateRealmRequirement(minRealm) {
    if (minRealm === 2) return getMajorRealmGateLabel();
    return `the ${getGateTierNeutralLabel(minRealm)} on any refinement`;
}

function getActionUnlockRealmTier(actionId) {
    const source = ACTION_UNLOCK_TIER_SOURCE[actionId] || 'effective';
    if (source === 'dantian') {
        return typeof getTrackRealmIdx === 'function' ? getTrackRealmIdx('dantian') : (G.realmIdx || 0);
    }
    if (source === 'vessel') {
        return typeof getTrackRealmIdx === 'function' ? getTrackRealmIdx('vessel') : (G.realmIdx || 0);
    }
    return getGateRealmTier();
}

function ensureMilestones() {
    if (!G.milestones) G.milestones = {};
}

function hasMilestone(id) {
    ensureMilestones();
    return !!G.milestones[id];
}

function recordMilestone(id, options) {
    ensureMilestones();
    if (G.milestones[id]) return false;
    G.milestones[id] = { months: G.ageMonths || 0 };
    if (!options?.silent) notifyActionUnlocksFromChange();
    return true;
}

function setMilestoneSilent(id) {
    ensureMilestones();
    if (G.milestones[id]) return false;
    G.milestones[id] = { months: G.ageMonths || 0 };
    return true;
}

function legacySaveHasExplored() {
    if (getEffectiveFoundation() > 0) return true;
    if (G.realmIdx > 0) return true;
    if (G.log?.some(entry => typeof entry === 'string' && /Exploring|🌿|🗺️ Exploring/i.test(entry))) {
        return true;
    }
    return false;
}

function migrateMilestonesFromLegacy() {
    ensureMilestones();
    if (G.tribulationCount > 0) setMilestoneSilent('passed_tribulation');
    if (G.npcState) {
        const metStory = Object.values(G.npcState).some(rec => rec?.met || (rec?.talkCount || 0) > 0);
        if (metStory) setMilestoneSilent('met_npc');
    }
    if ((G.worldNpcs || []).some(n => n.met || (n.talkCount || 0) > 0)) {
        setMilestoneSilent('met_npc');
    }
    if (legacySaveHasExplored()) setMilestoneSilent('explored');
}

function getActionUnlockRealmLabel(realmIdx) {
    const path = PATHS[G.path] || PATHS.qi;
    return path.realms[realmIdx] || `Realm ${realmIdx + 1}`;
}

function getActionUnlockDef(actionId) {
    return (typeof ACTION_UNLOCKS !== 'undefined' && ACTION_UNLOCKS[actionId]) || null;
}

function evaluateActionUnlock(actionId) {
    if (typeof isPlaytestFreeActionGates === 'function' && isPlaytestFreeActionGates()) {
        return { unlocked: true, reason: null };
    }
    const def = getActionUnlockDef(actionId);
    if (!def) return { unlocked: true, reason: null };

    if (def.minRealm != null && getActionUnlockRealmTier(actionId) < def.minRealm) {
        const realmLabel = ACTION_UNLOCK_TIER_SOURCE[actionId]
            ? getActionUnlockRealmLabel(def.minRealm)
            : formatGateRealmRequirement(def.minRealm);
        return {
            unlocked: false,
            reason: def.hint || `Reach ${realmLabel} first.`
        };
    }

    if (def.milestones?.length) {
        const missing = def.milestones.find(id => !hasMilestone(id));
        if (missing) {
            const milestoneHint = (typeof MILESTONE_LABELS !== 'undefined' && MILESTONE_LABELS[missing])
                || missing;
            return {
                unlocked: false,
                reason: def.hint || milestoneHint
            };
        }
    }

    if (def.customCheck) {
        const fn = ACTION_UNLOCK_CUSTOM_CHECKS[def.customCheck];
        if (typeof fn === 'function' && !fn()) {
            return {
                unlocked: false,
                reason: def.hint || 'Requirements not yet met.'
            };
        }
    }

    return { unlocked: true, reason: null };
}

function isActionUnlocked(actionId) {
    return evaluateActionUnlock(actionId).unlocked;
}

function getActionUnlockReason(actionId) {
    return evaluateActionUnlock(actionId).reason;
}

function captureActionUnlockSnapshot() {
    if (typeof ACTION_UNLOCKS === 'undefined') return {};
    const snap = {};
    Object.keys(ACTION_UNLOCKS).forEach(actionId => {
        snap[actionId] = isActionUnlocked(actionId);
    });
    return snap;
}

function getActionUnlockLabel(actionId) {
    if (typeof ACTION_UNLOCK_LABELS !== 'undefined' && ACTION_UNLOCK_LABELS[actionId]) {
        return ACTION_UNLOCK_LABELS[actionId];
    }
    const btnId = typeof ACTION_UNLOCK_BUTTONS !== 'undefined' ? ACTION_UNLOCK_BUTTONS[actionId] : null;
    const btn = btnId ? document.getElementById(btnId) : null;
    if (btn?.textContent) return btn.textContent.trim().replace(/^🔒\s*/, '');
    return actionId;
}

function notifyActionUnlocks(prevSnap) {
    if (!prevSnap || typeof ACTION_UNLOCKS === 'undefined') return;

    const newlyUnlocked = [];
    Object.keys(ACTION_UNLOCKS).forEach(actionId => {
        if (ACTION_UNLOCK_SKIP_RENDER.has(actionId)) return;
        const wasUnlocked = !!prevSnap[actionId];
        const nowUnlocked = isActionUnlocked(actionId);
        if (!wasUnlocked && nowUnlocked) {
            newlyUnlocked.push(getActionUnlockLabel(actionId));
        }
    });

    if (newlyUnlocked.length && typeof addLog === 'function') {
        addLog(`🔓 New paths open: ${newlyUnlocked.join(', ')}`);
    }

    if (typeof triggerTutorial === 'function') {
        if (!prevSnap.factions && isActionUnlocked('factions')) triggerTutorial('unlock_factions');
        if (!prevSnap.forbidden && isActionUnlocked('forbidden')) triggerTutorial('unlock_forbidden');
    }
}

function initActionUnlockSnapshot() {
    G._actionUnlockSnapshot = captureActionUnlockSnapshot();
}

function notifyActionUnlocksFromChange() {
    const prev = G._actionUnlockSnapshot;
    if (!prev) {
        initActionUnlockSnapshot();
        return;
    }
    notifyActionUnlocks(prev);
    G._actionUnlockSnapshot = captureActionUnlockSnapshot();
}

function guardAction(actionId, options) {
    const state = evaluateActionUnlock(actionId);
    if (state.unlocked) return true;
    if (!options?.silent && typeof addLog === 'function' && state.reason) {
        addLog(`🔒 ${state.reason}`);
    }
    if (!options?.silent && typeof fullRender === 'function') fullRender();
    return false;
}

function cacheActionButtonDefaultTitles() {
    if (typeof ACTION_UNLOCK_BUTTONS === 'undefined') return;
    Object.values(ACTION_UNLOCK_BUTTONS).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (!btn || btn.dataset.defaultTitle != null) return;
        btn.dataset.defaultTitle = btn.getAttribute('title') || '';
    });
}

function applyRecruitUnlockButton(btn, state) {
    btn.classList.toggle('action-locked', !state.unlocked);
    if (!state.unlocked) {
        btn.disabled = true;
        btn.title = `🔒 ${state.reason}`;
        return;
    }
    btn.disabled = false;
    btn.title = btn.dataset.defaultTitle || '';
}

function renderActionGroupLocks() {
    document.querySelectorAll('.actions-panel-core .action-group').forEach(group => {
        const buttons = group.querySelectorAll('button[id^="btn"]');
        if (!buttons.length) return;
        const allLocked = Array.from(buttons).every(btn => btn.classList.contains('action-locked'));
        group.classList.toggle('action-group-all-locked', allLocked);
    });
}

function renderActionUnlocks() {
    if (typeof ACTION_UNLOCK_BUTTONS === 'undefined') return;
    cacheActionButtonDefaultTitles();

    Object.entries(ACTION_UNLOCK_BUTTONS).forEach(([actionId, btnId]) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        if (actionId === 'intent' && typeof shouldShowIntentButton === 'function') {
            const showIntent = shouldShowIntentButton();
            btn.style.display = showIntent ? '' : 'none';
            if (!showIntent) return;
        }

        if (ACTION_UNLOCK_SKIP_RENDER.has(actionId)) return;

        const state = evaluateActionUnlock(actionId);

        if (actionId === 'recruit') {
            applyRecruitUnlockButton(btn, state);
            return;
        }

        btn.classList.toggle('action-locked', !state.unlocked);

        if (!state.unlocked) {
            btn.disabled = true;
            btn.title = `🔒 ${state.reason}`;
            return;
        }

        btn.disabled = false;
        btn.title = btn.dataset.defaultTitle || '';
    });

    renderActionGroupLocks();
}
