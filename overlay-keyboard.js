// ============================================
// OVERLAY-KEYBOARD.JS — Escape closes top overlay (layer 1)
// Layer 2/3 (sub-tab reset) — docs/ideas/escape-key-overlay-navigation.md
// ============================================

/** Overlays that must not dismiss on Escape (high-stakes or forced flow). */
const ESCAPE_BLOCK_OVERLAY_IDS = new Set([
    'combatOverlay',
    'tribulationOverlay',
    'transcendencePerkPopup',
    'tutorialPopup'
]);

/**
 * Close order: child / choice popups first, then chambers, then hub panels.
 * First matching active overlay wins.
 */
const ESCAPE_OVERLAY_CLOSE_ORDER = [
    { id: 'markDetailPopup', close: () => document.getElementById('markDetailPopup')?.classList.remove('active') },
    { id: 'ancientBargainPopup', close: () => document.getElementById('ancientBargainPopup')?.classList.remove('active') },
    { id: 'combatRewardPopup', close: () => typeof closeCombatRewardPopup === 'function' && closeCombatRewardPopup() },
    { id: 'sectEventPopup', close: () => document.getElementById('sectEventPopup')?.classList.remove('active') },
    { id: 'sectSuccessionPopup', close: () => document.getElementById('sectSuccessionPopup')?.classList.remove('active') },
    { id: 'factionPlotPopup', close: () => document.getElementById('factionPlotPopup')?.classList.remove('active') },
    { id: 'questPopup', close: () => typeof closeQuestPopup === 'function' && closeQuestPopup() },
    { id: 'encounterOverlay', close: () => typeof closeEncounterOverlay === 'function' && closeEncounterOverlay() },
    { id: 'consolidatePopup', close: () => document.getElementById('consolidatePopup')?.classList.remove('active') },
    { id: 'breakthroughPopup', close: () => typeof closeBreakthrough === 'function' && closeBreakthrough() },
    { id: 'seclusionPickerPopup', close: () => document.getElementById('seclusionPickerPopup')?.classList.remove('active') },
    { id: 'highlightReelPopup', close: () => typeof closeHighlightReelPopup === 'function' && closeHighlightReelPopup() },
    { id: 'timePlaybackOverlay', close: () => typeof hideTimePlaybackOverlay === 'function' && hideTimePlaybackOverlay() },
    { id: 'npcPopup', close: () => typeof closeNpcPopup === 'function' && closeNpcPopup() },
    { id: 'merchantPopup', close: () => document.getElementById('merchantPopup')?.classList.remove('active') },
    { id: 'thresholdJobsPopup', close: () => document.getElementById('thresholdJobsPopup')?.classList.remove('active') },
    { id: 'dwellingPopup', close: () => document.getElementById('dwellingPopup')?.classList.remove('active') },
    { id: 'statGuidePopup', close: () => document.getElementById('statGuidePopup')?.classList.remove('active') },
    { id: 'pillPopup', close: () => document.getElementById('pillPopup')?.classList.remove('active') },
    { id: 'techPopup', close: () => document.getElementById('techPopup')?.classList.remove('active', 'tech-popup-combat') },
    { id: 'meridianPopup', close: () => document.getElementById('meridianPopup')?.classList.remove('active') },
    { id: 'intentPopup', close: () => document.getElementById('intentPopup')?.classList.remove('active') },
    { id: 'daoPopup', close: () => document.getElementById('daoPopup')?.classList.remove('active') },
    { id: 'inventoryPopup', close: () => document.getElementById('inventoryPopup')?.classList.remove('active') },
    { id: 'alignmentPopup', close: () => document.getElementById('alignmentPopup')?.classList.remove('active') },
    { id: 'questJournalPopup', close: () => document.getElementById('questJournalPopup')?.classList.remove('active') },
    { id: 'factionsPopup', close: () => document.getElementById('factionsPopup')?.classList.remove('active') },
    { id: 'mapPopup', close: () => document.getElementById('mapPopup')?.classList.remove('active') },
    { id: 'sectPopup', close: () => document.getElementById('sectPopup')?.classList.remove('active') },
    { id: 'forbiddenPopup', close: () => document.getElementById('forbiddenPopup')?.classList.remove('active') },
    { id: 'gardenOverlay', close: () => document.getElementById('gardenOverlay')?.classList.remove('active') },
    { id: 'silenceOverlay', close: () => document.getElementById('silenceOverlay')?.classList.remove('active') },
    { id: 'mawOverlay', close: () => document.getElementById('mawOverlay')?.classList.remove('active') },
    { id: 'templeOverlay', close: () => document.getElementById('templeOverlay')?.classList.remove('active') },
    { id: 'observatoryOverlay', close: () => document.getElementById('observatoryOverlay')?.classList.remove('active') },
    { id: 'qiChamberOverlay', close: () => typeof closeQiChamber === 'function' && closeQiChamber() },
    { id: 'bodyChamberOverlay', close: () => typeof closeBodyChamber === 'function' && closeBodyChamber() },
    { id: 'soulChamberOverlay', close: () => typeof closeSoulChamber === 'function' && closeSoulChamber() },
    { id: 'alchemyChamberOverlay', close: () => typeof closeAlchemyChamber === 'function' && closeAlchemyChamber() },
    { id: 'forgeChamberOverlay', close: () => typeof closeForgeChamber === 'function' && closeForgeChamber() },
    { id: 'cultivationHubOverlay', close: () => typeof closeCultivationHub === 'function' && closeCultivationHub() },
    { id: 'tutorialLogPopup', close: () => typeof closeTutorialLog === 'function' && closeTutorialLog() }
];

function isEscapeOverlayBlocked() {
    const creation = document.getElementById('creation-screen');
    if (creation && creation.style.display !== 'none') return true;
    const game = document.getElementById('game-screen');
    if (!game || game.style.display === 'none') return true;
    for (const id of ESCAPE_BLOCK_OVERLAY_IDS) {
        const el = document.getElementById(id);
        if (el?.classList.contains('active')) return true;
    }
    return false;
}

function isOverlayEscapeInputTarget(target) {
    const tag = (target && target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
    if (target?.isContentEditable) return true;
    return false;
}

function closeTopEscapeOverlay() {
    const helpPop = document.getElementById('actionHelpPopover');
    if (helpPop && !helpPop.hidden) {
        if (typeof closeActionHelpPopover === 'function') closeActionHelpPopover();
        return true;
    }

    for (const entry of ESCAPE_OVERLAY_CLOSE_ORDER) {
        const el = document.getElementById(entry.id);
        if (!el) continue;
        const active = entry.id === 'actionHelpPopover'
            ? !el.hidden
            : el.classList.contains('active');
        if (!active) continue;
        if (ESCAPE_BLOCK_OVERLAY_IDS.has(entry.id)) return false;
        entry.close();
        if (typeof fullRender === 'function') fullRender();
        return true;
    }
    return false;
}

function initOverlayKeyboardEscape() {
    document.addEventListener('keydown', (ev) => {
        if (ev.key !== 'Escape' && ev.code !== 'Escape') return;
        if (isOverlayEscapeInputTarget(ev.target)) return;
        if (isEscapeOverlayBlocked()) return;
        if (!closeTopEscapeOverlay()) return;
        ev.preventDefault();
    });
}
