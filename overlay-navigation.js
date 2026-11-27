// Session-only navigation. Gameplay actions still own their state and settlement.
const overlayStack = [];
let overlayObserver;

// Existing surfaces can join the stack without changing their renderers. An
// unknown surface or a gameplay resolution requires its own explicit control.
const legacyOverlayClosers = new Map([
    ...[
        'markDetailPopup', 'consolidatePopup',
        'seclusionPickerPopup', 'merchantPopup', 'thresholdJobsPopup', 'dwellingPopup',
        'pillPopup', 'meridianPopup', 'intentPopup', 'daoPopup', 'inventoryPopup',
        'alignmentPopup', 'factionsPopup', 'sectPopup', 'forbiddenPopup',
        'gardenOverlay', 'silenceOverlay', 'mawOverlay', 'templeOverlay', 'observatoryOverlay'
    ].map(id => [id, element => element.classList.remove('active')]),
    ['combatRewardPopup', () => closeCombatRewardPopup()],
    ['questPopup', () => closeQuestPopup()],
    ['encounterOverlay', () => closeEncounterOverlay()],
    ['breakthroughPopup', () => closeBreakthrough()],
    ['npcPopup', () => closeNpcPopup()],
    ['alchemyChamberOverlay', () => closeAlchemyChamber()],
    ['forgeChamberOverlay', () => closeForgeChamber()],
    ['tutorialLogPopup', () => closeTutorialLog()]
]);

function findOverlaySurface(id) {
    return overlayStack.find(entry => entry.element.id === id);
}

function topOverlaySurface() {
    // Legacy panels still own their paint order (for example, tribulation sits
    // above combat). Within the same layer, use the most recent opening.
    let top;
    let topLayer = -Infinity;
    for (const entry of overlayStack) {
        if (!isOverlaySurfaceVisible(entry)) continue;
        const layer = Number(getComputedStyle(entry.element).zIndex) || 0;
        if (layer >= topLayer) {
            top = entry;
            topLayer = layer;
        }
    }
    return top;
}

function isOverlaySurfaceVisible(entry) {
    return !entry.suspended && (entry.usesHidden
        ? !entry.element.hidden
        : entry.element.classList.contains('active'));
}

function setOverlaySurfaceVisible(entry, visible) {
    if (entry.usesHidden) entry.element.hidden = !visible;
    else entry.element.classList.toggle('active', visible);
}

function focusOverlayControl(element) {
    if (!element?.isConnected || !element.getClientRects().length || element.closest('[inert]') || element.disabled) return false;
    element.focus({ preventScroll: true });
    return document.activeElement === element;
}

function focusOverlayStart(entry) {
    focusOverlayControl(entry?.element.querySelector('[data-overlay-focus]'));
}

function refreshOverlayPresentation() {
    const top = topOverlaySurface();
    const modal = top && (top.managed ? top.modal : true);
    for (const entry of overlayStack) {
        entry.element.inert = !!modal && entry !== top && !entry.element.contains(top.element);
    }
    document.body.classList.toggle('overlay-scroll-locked', overlayStack.some(entry => entry.modal && isOverlaySurfaceVisible(entry)));
    if (typeof renderWorldClockBar === 'function' && document.getElementById('game-screen')?.style.display === 'flex') {
        renderWorldClockBar();
    }
    if (typeof renderOverlayLifespanChip === 'function') renderOverlayLifespanChip();
    if (typeof updatePhoneOverlayBack === 'function') updatePhoneOverlayBack();
}

function removeOverlayEntry(entry, returnToParent) {
    overlayStack.splice(overlayStack.indexOf(entry), 1);
    entry.element.inert = false;
    entry.onClose?.();
    const parent = entry.parent;
    if (parent?.suspendedBy !== entry || !overlayStack.includes(parent)) return;
    parent.suspended = false;
    parent.suspendedBy = null;
    if (returnToParent) {
        setOverlaySurfaceVisible(parent, true);
        parent.onResume?.();
    } else {
        removeOverlayEntry(parent, false);
    }
}

function syncLegacyOverlays(records = overlayObserver?.takeRecords() || []) {
    let changed = false;
    // A managed open flushes pending records first, so a legacy parent is
    // recognised even when both transitions happen in the same click handler.
    for (const { target, oldValue } of records) {
        if (!target.classList.contains('active') || oldValue?.split(/\s+/).includes('active') || findOverlaySurface(target.id)) continue;
        overlayStack.push({ element: target, opener: document.activeElement, legacyClose: legacyOverlayClosers.get(target.id) });
        changed = true;
    }
    for (const entry of [...overlayStack].reverse()) {
        if (!overlayStack.includes(entry) || entry.suspended || isOverlaySurfaceVisible(entry)) continue;
        // A gameplay-owned exit discards the suspended branch. It never rewinds
        // the navigation steps captured before the action.
        removeOverlayEntry(entry, false);
        changed = true;
    }
    if (changed) refreshOverlayPresentation();
}

function openOverlaySurface(id, options = {}) {
    syncLegacyOverlays();
    const existing = findOverlaySurface(id);
    if (existing) return existing.element;
    const element = document.getElementById(id);
    if (!element) return null;
    const {
        opener = document.activeElement, usesHidden = false, modal = true,
        dismissible = true, suspendParent = false, onClose, onSuspend, onResume
    } = options;
    const parent = overlayStack.findLast(entry => isOverlaySurfaceVisible(entry) && entry.element.contains(opener));
    const entry = {
        element, opener, parent, managed: true, modal, dismissible, usesHidden,
        onClose, onSuspend, onResume, steps: []
    };
    overlayStack.push(entry);
    if (parent?.managed && suspendParent) {
        parent.suspended = true;
        parent.suspendedBy = entry;
        setOverlaySurfaceVisible(parent, false);
        parent.onSuspend?.();
    }
    setOverlaySurfaceVisible(entry, true);
    refreshOverlayPresentation();
    focusOverlayStart(entry);
    return element;
}

function closeOverlaySurface(id, { returnToParent = true, restoreFocus = true } = {}) {
    syncLegacyOverlays();
    const entry = findOverlaySurface(id);
    if (!entry?.managed || entry.suspended) return false;
    setOverlaySurfaceVisible(entry, false);
    removeOverlayEntry(entry, returnToParent);
    refreshOverlayPresentation();
    const next = topOverlaySurface();
    if (returnToParent && restoreFocus && (!next || next === entry.parent)) {
        if (!focusOverlayControl(entry.opener)) focusOverlayStart(next);
    }
    return true;
}

function rememberOverlayStep(id, restore) {
    findOverlaySurface(id)?.steps?.push(restore);
}

function discardOverlaySteps(id) {
    const steps = findOverlaySurface(id)?.steps;
    if (steps) steps.length = 0;
}

function overlayHasChild(id) {
    return overlayStack.some(entry => entry.parent?.element.id === id);
}

function canDismissOverlay(entry) {
    if (!entry) return false;
    if (entry.managed) return entry.dismissible;
    return !!entry.legacyClose && (entry.element.id !== 'breakthroughPopup' || !G._breakthroughResolving);
}

function canDismissTopOverlay() {
    return canDismissOverlay(topOverlaySurface());
}

function dismissTopOverlay() {
    if (document.getElementById('game-screen')?.style.display !== 'flex') return false;
    syncLegacyOverlays();
    const entry = topOverlaySurface();
    if (!canDismissOverlay(entry)) return false;
    const step = entry.steps?.pop();
    if (step) {
        step();
    } else if (entry.managed) {
        closeOverlaySurface(entry.element.id);
    } else {
        entry.legacyClose(entry.element);
        syncLegacyOverlays();
        if (!topOverlaySurface() || topOverlaySurface().element.contains(entry.opener)) focusOverlayControl(entry.opener);
    }
    return true;
}

function containOverlayTab(event, entry) {
    if (!entry?.managed || !entry.modal) return;
    const controls = [...entry.element.querySelectorAll('button, input, select, textarea, a[href], [tabindex]')]
        .filter(element => element.tabIndex >= 0 && !element.disabled && element.getClientRects().length
            && getComputedStyle(element).visibility === 'visible');
    const index = controls.indexOf(document.activeElement);
    const atEdge = event.shiftKey ? index === 0 : index === controls.length - 1;
    if (index >= 0 && !atEdge) return;
    event.preventDefault();
    if (!focusOverlayControl(event.shiftKey ? controls.at(-1) : controls[0])) focusOverlayStart(entry);
}

function initOverlayNavigation() {
    overlayObserver = new MutationObserver(syncLegacyOverlays);
    const legacyRoots = [...document.querySelectorAll('.popup-overlay')];
    legacyRoots.forEach(root => overlayObserver.observe(root, { attributes: true, attributeOldValue: true, attributeFilter: ['class'] }));
    syncLegacyOverlays(legacyRoots.map(target => ({ target })));
    document.addEventListener('keydown', event => {
        if (event.key === 'Tab') {
            syncLegacyOverlays();
            containOverlayTab(event, topOverlaySurface());
        } else if (event.key === 'Escape' && !event.defaultPrevented && !event.repeat) {
            const editor = event.target.closest?.('input, textarea, select') || event.target.isContentEditable;
            if (!editor && dismissTopOverlay()) event.preventDefault();
        }
    });
}
