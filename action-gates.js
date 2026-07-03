// ============================================
// ACTION-GATES.JS — Realm & milestone action unlocks (not age)
// ============================================

const ACTION_UNLOCK_CUSTOM_CHECKS = {
    canRecruitDisciples: () => typeof canRecruitDisciples === 'function' && canRecruitDisciples()
};

function ensureMilestones() {
    if (!G.milestones) G.milestones = {};
}

function hasMilestone(id) {
    ensureMilestones();
    return !!G.milestones[id];
}

function recordMilestone(id) {
    ensureMilestones();
    if (G.milestones[id]) return false;
    G.milestones[id] = { months: G.ageMonths || 0 };
    return true;
}

function migrateMilestonesFromLegacy() {
    ensureMilestones();
    if (G.log?.length) recordMilestone('explored');
    if (G.tribulationCount > 0) recordMilestone('passed_tribulation');
    if (G.npcState) {
        const metStory = Object.values(G.npcState).some(rec => rec?.met || (rec?.talkCount || 0) > 0);
        if (metStory) recordMilestone('met_npc');
    }
    if ((G.worldNpcs || []).some(n => n.met || (n.talkCount || 0) > 0)) {
        recordMilestone('met_npc');
    }
    if (G.foundation > 0 || (typeof isRealmConsolidated === 'function' && G.realmIdx > 0)) {
        recordMilestone('explored');
    }
}

function getActionUnlockRealmLabel(realmIdx) {
    const path = PATHS[G.path] || PATHS.qi;
    return path.realms[realmIdx] || `Realm ${realmIdx + 1}`;
}

function getActionUnlockDef(actionId) {
    return (typeof ACTION_UNLOCKS !== 'undefined' && ACTION_UNLOCKS[actionId]) || null;
}

function evaluateActionUnlock(actionId) {
    const def = getActionUnlockDef(actionId);
    if (!def) return { unlocked: true, reason: null };

    if (def.minRealm != null && G.realmIdx < def.minRealm) {
        const realmLabel = getActionUnlockRealmLabel(def.minRealm);
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

function guardAction(actionId) {
    const state = evaluateActionUnlock(actionId);
    if (state.unlocked) return true;
    if (typeof addLog === 'function' && state.reason) {
        addLog(`🔒 ${state.reason}`);
    }
    if (typeof fullRender === 'function') fullRender();
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

function renderActionUnlocks() {
    if (typeof ACTION_UNLOCK_BUTTONS === 'undefined') return;
    cacheActionButtonDefaultTitles();

    Object.entries(ACTION_UNLOCK_BUTTONS).forEach(([actionId, btnId]) => {
        const btn = document.getElementById(btnId);
        if (!btn) return;

        const state = evaluateActionUnlock(actionId);
        btn.classList.toggle('action-locked', !state.unlocked);

        if (actionId === 'consolidate' || actionId === 'search' || actionId === 'market') {
            return;
        }

        if (!state.unlocked) {
            btn.disabled = true;
            btn.title = `🔒 ${state.reason}`;
            return;
        }

        btn.disabled = false;
        btn.title = btn.dataset.defaultTitle || '';
    });
}
