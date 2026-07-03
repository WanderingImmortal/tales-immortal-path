// ============================================
// TUTORIAL.JS — Teach-as-you-go cultivation lessons
// ============================================

let tutorialQueue = [];
let tutorialShowing = false;
let tutorialReviewMode = false;
let tutorialHighlightSelector = null;
let tutorialHighlightResizeHandler = null;

function ensureTutorialState() {
    if (!G.tutorialLog) G.tutorialLog = { completed: {} };
    if (!G.tutorialLog.completed) G.tutorialLog.completed = {};
}

function isTutorialComplete(id) {
    ensureTutorialState();
    return !!G.tutorialLog.completed[id];
}

function completeTutorial(id) {
    ensureTutorialState();
    if (!G.tutorialLog.completed[id]) {
        G.tutorialLog.completed[id] = { months: G.ageMonths || 0 };
    }
}

function getTutorialDef(id) {
    return TUTORIAL_STEPS[id] || null;
}

function resolveTutorialHighlightEl(selector) {
    if (!selector) return null;
    if (selector.startsWith('#') || selector.startsWith('.')) {
        return document.querySelector(selector);
    }
    return document.getElementById(selector) || document.querySelector('#' + selector);
}

function positionTutorialHighlightRing(el, ring) {
    if (!el || !ring) return;
    const rect = el.getBoundingClientRect();
    const pad = 8;
    ring.style.left = Math.max(0, rect.left - pad) + 'px';
    ring.style.top = Math.max(0, rect.top - pad) + 'px';
    ring.style.width = Math.max(0, rect.width + pad * 2) + 'px';
    ring.style.height = Math.max(0, rect.height + pad * 2) + 'px';
}

function applyTutorialHighlight(selector) {
    clearTutorialHighlight();
    if (!selector || tutorialReviewMode) return;

    const el = resolveTutorialHighlightEl(selector);
    if (!el) return;

    tutorialHighlightSelector = selector;
    const spotlight = document.getElementById('tutorialSpotlight');
    const ring = document.getElementById('tutorialHighlightRing');
    if (!spotlight || !ring) return;

    el.classList.add('tutorial-target-pulse');
    if (el.scrollIntoView) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    spotlight.classList.add('active');
    spotlight.setAttribute('aria-hidden', 'false');
    positionTutorialHighlightRing(el, ring);

    tutorialHighlightResizeHandler = function() {
        positionTutorialHighlightRing(el, ring);
    };
    window.addEventListener('resize', tutorialHighlightResizeHandler);
    window.addEventListener('scroll', tutorialHighlightResizeHandler, true);
}

function clearTutorialHighlight() {
    document.getElementById('tutorialSpotlight')?.classList.remove('active');
    document.getElementById('tutorialSpotlight')?.setAttribute('aria-hidden', 'true');
    document.querySelectorAll('.tutorial-target-pulse').forEach(node => {
        node.classList.remove('tutorial-target-pulse');
    });
    if (tutorialHighlightResizeHandler) {
        window.removeEventListener('resize', tutorialHighlightResizeHandler);
        window.removeEventListener('scroll', tutorialHighlightResizeHandler, true);
        tutorialHighlightResizeHandler = null;
    }
    tutorialHighlightSelector = null;
}

function refreshTutorialHighlight() {
    if (!tutorialHighlightSelector || !tutorialShowing || tutorialReviewMode) return;
    const el = resolveTutorialHighlightEl(tutorialHighlightSelector);
    const ring = document.getElementById('tutorialHighlightRing');
    if (el && ring) positionTutorialHighlightRing(el, ring);
}

function migrateTutorialForExistingSave() {
    ensureTutorialState();
    if (G.tutorialLog.migratedExisting) return;

    const hasProgress = !!(G.name && G.path && (
        (G.ageMonths || 0) > STARTING_AGE_YEARS * 12 ||
        G.realmIdx > 0 ||
        (G.log?.length || 0) > 2
    ));

    if (!hasProgress) {
        G.tutorialLog.migratedExisting = true;
        return;
    }

    const completedCount = Object.keys(G.tutorialLog.completed).length;
    if (completedCount === 0) {
        completeTutorial('first_boot');
        if ((G.qiDensity || 0) > 1.05 || (G.ageMonths || 0) > STARTING_AGE_YEARS * 12 + 6) {
            completeTutorial('first_cultivate');
        }
        if (G.realmIdx > 0 || (G.breakAttempts || 0) > 0) {
            completeTutorial('first_breakthrough');
        }
        if (G.realmConsolidation && Object.values(G.realmConsolidation).some(r => r?.done)) {
            completeTutorial('first_consolidation');
        }
        if ((G.tribulationMarks?.length || 0) > 0) {
            completeTutorial('first_tribulation');
        }
        if ((G.daoAlignment || 0) !== 0) {
            completeTutorial('first_alignment');
        }
        const npcMet = G.npcState && Object.values(G.npcState).some(r => r?.met);
        const worldMet = G.worldNpcs?.some(n => n.met);
        if (npcMet || worldMet) {
            completeTutorial('first_npc');
        }
    }

    G.tutorialLog.migratedExisting = true;
}

function canShowTutorialNow() {
    return !G.gameOver && !G.inCombat;
}

function triggerTutorial(id) {
    const def = getTutorialDef(id);
    if (!def || isTutorialComplete(id)) return;
    if (tutorialQueue.includes(id)) return;
    tutorialQueue.push(id);
    processTutorialQueue();
}

function processTutorialQueue() {
    if (tutorialShowing || tutorialReviewMode || !tutorialQueue.length) return;
    if (!canShowTutorialNow()) return;
    const id = tutorialQueue.shift();
    if (!id || isTutorialComplete(id)) {
        processTutorialQueue();
        return;
    }
    showTutorialPopup(id, false);
}

function showTutorialPopup(id, reviewMode) {
    const def = getTutorialDef(id);
    if (!def) return;

    tutorialReviewMode = !!reviewMode;
    tutorialShowing = !reviewMode;

    const overlay = document.getElementById('tutorialPopup');
    const titleEl = document.getElementById('tutorialTitle');
    const textEl = document.getElementById('tutorialText');
    const learnEl = document.getElementById('tutorialLearnMore');
    const learnBody = document.getElementById('tutorialLearnBody');
    const dismissBtn = document.getElementById('tutorialDismiss');
    const skipBtn = document.getElementById('tutorialSkipVeteran');

    if (!overlay || !titleEl || !textEl) return;

    titleEl.textContent = `${def.emoji} ${def.title}`;
    textEl.textContent = def.text;

    if (learnEl && learnBody) {
        learnBody.textContent = def.learnMore || '';
        learnBody.hidden = true;
        learnEl.setAttribute('aria-expanded', 'false');
        learnEl.textContent = def.learnMore ? 'Learn More ▼' : '';
        learnEl.style.display = def.learnMore ? '' : 'none';
    }

    if (dismissBtn) {
        dismissBtn.textContent = reviewMode ? 'Close' : 'I Understand';
        dismissBtn.dataset.tutorialId = id;
    }

    if (skipBtn) {
        skipBtn.hidden = reviewMode || id !== 'first_boot';
    }

    overlay.classList.add('active');
    overlay.dataset.tutorialId = id;

    if (!reviewMode && def.highlight) {
        requestAnimationFrame(function() {
            applyTutorialHighlight(def.highlight);
        });
    } else {
        clearTutorialHighlight();
    }
}

function runPendingTribulationIfAny() {
    if (G._pendingTribulationStyle == null) return;
    const style = G._pendingTribulationStyle;
    G._pendingTribulationStyle = null;
    if (typeof startTribulation === 'function') startTribulation(style);
}

function beginTribulationWithTutorial(breakStyle) {
    if (isTutorialComplete('first_tribulation')) {
        startTribulation(breakStyle);
        return;
    }
    G._pendingTribulationStyle = breakStyle;
    triggerTutorial('first_tribulation');
}

function dismissTutorialPopup() {
    const overlay = document.getElementById('tutorialPopup');
    const id = overlay?.dataset.tutorialId;
    const learnBody = document.getElementById('tutorialLearnBody');
    if (learnBody) learnBody.hidden = true;

    clearTutorialHighlight();
    overlay?.classList.remove('active');

    if (!tutorialReviewMode && id) {
        completeTutorial(id);
        tutorialShowing = false;
        if (id === 'first_tribulation') runPendingTribulationIfAny();
        processTutorialQueue();
    } else {
        tutorialReviewMode = false;
        tutorialShowing = false;
    }

    if (typeof renderTutorialLogPopup === 'function') renderTutorialLogPopup();
    saveState();
}

function skipAllTutorialsAsVeteran() {
    TUTORIAL_ORDER.forEach(tutorialId => completeTutorial(tutorialId));
    tutorialQueue = [];
    tutorialReviewMode = false;
    tutorialShowing = false;
    clearTutorialHighlight();
    document.getElementById('tutorialPopup')?.classList.remove('active');
    runPendingTribulationIfAny();
    if (typeof renderTutorialLogPopup === 'function') renderTutorialLogPopup();
    addLog('📖 You walk the path already — cultivation lessons marked complete.');
    saveState();
}

function toggleTutorialLearnMore() {
    const learnEl = document.getElementById('tutorialLearnMore');
    const learnBody = document.getElementById('tutorialLearnBody');
    if (!learnEl || !learnBody || !learnBody.textContent) return;
    const open = learnBody.hidden;
    learnBody.hidden = !open;
    learnEl.setAttribute('aria-expanded', open ? 'true' : 'false');
    learnEl.textContent = open ? 'Learn Less ▲' : 'Learn More ▼';
}

function openTutorialLog() {
    if (typeof renderTutorialLogPopup === 'function') renderTutorialLogPopup();
    document.getElementById('tutorialLogPopup')?.classList.add('active');
}

function closeTutorialLog() {
    document.getElementById('tutorialLogPopup')?.classList.remove('active');
}

function getTutorialLogEntries() {
    ensureTutorialState();
    return TUTORIAL_ORDER.map(id => {
        const def = getTutorialDef(id);
        if (!def) return null;
        const done = G.tutorialLog.completed[id];
        return {
            id,
            def,
            completed: !!done,
            completedMonths: done?.months ?? null
        };
    }).filter(Boolean);
}

function bindTutorialEvents() {
    document.getElementById('tutorialDismiss')?.addEventListener('click', dismissTutorialPopup);
    document.getElementById('tutorialLearnMore')?.addEventListener('click', toggleTutorialLearnMore);
    document.getElementById('tutorialSkipVeteran')?.addEventListener('click', skipAllTutorialsAsVeteran);
    document.getElementById('tutorialLogClose')?.addEventListener('click', closeTutorialLog);
    document.getElementById('btnTutorialLog')?.addEventListener('click', openTutorialLog);
}
