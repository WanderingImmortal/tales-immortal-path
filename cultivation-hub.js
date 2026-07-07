// ============================================
// CULTIVATION-HUB.JS — Path chooser for cultivation chambers
// ============================================

function cultivationHubBlocked() {
    return G.gameOver || G.inCombat || G.inQiChamber || G.inBodyChamber || G.inSoulChamber
        || G.inAlchemyChamber || G.inForgeChamber
        || (typeof isTribulationActive === 'function' && isTribulationActive())
        || (typeof isTranscendencePerkPending === 'function' && isTranscendencePerkPending());
}

function hasBodyPhysiqueActivity() {
    if (typeof isPhysiqueCultivationActive === 'function' && isPhysiqueCultivationActive()) return true;
    return !!G.physique;
}

function renderCultivationHubCards() {
    const note = document.getElementById('cultivationHubBodyNote');
    if (!note) return;
    if (typeof hasBodyPhysiqueActivity === 'function' && hasBodyPhysiqueActivity()) {
        if (typeof isPhysiqueCultivationActive === 'function' && isPhysiqueCultivationActive()) {
            const status = typeof getPhysiqueCultivationStatusText === 'function'
                ? getPhysiqueCultivationStatusText() : 'Physique project active';
            note.textContent = `🧬 ${status}`;
        } else if (G.physique) {
            note.textContent = `🧬 ${G.physique.name} equipped`;
        } else {
            note.textContent = '🧬 Physique active';
        }
    } else {
        note.textContent = '';
    }
}

function openCultivationHub() {
    if (cultivationHubBlocked()) return;
    G.inCultivationHub = true;
    const pathEl = document.getElementById('cultivationHubPrimaryPath');
    if (pathEl && typeof PATHS !== 'undefined' && G.path) {
        pathEl.textContent = PATHS[G.path]?.name || G.path;
    }
    if (typeof renderCultivationHubCards === 'function') renderCultivationHubCards();
    document.getElementById('cultivationHubOverlay')?.classList.add('active');
}

function closeCultivationHub() {
    G.inCultivationHub = false;
    document.getElementById('cultivationHubOverlay')?.classList.remove('active');
}

function chooseCultivationChamber(kind) {
    closeCultivationHub();
    if (kind === 'qi' && typeof openQiChamber === 'function') {
        openQiChamber();
    } else if (kind === 'body' && typeof openBodyChamber === 'function') {
        openBodyChamber();
    } else if (kind === 'soul' && typeof openSoulChamber === 'function') {
        openSoulChamber();
    }
}

function initCultivationHubEvents() {
    document.getElementById('cultivationHubQi')?.addEventListener('click', () => chooseCultivationChamber('qi'));
    document.getElementById('cultivationHubBody')?.addEventListener('click', () => chooseCultivationChamber('body'));
    document.getElementById('cultivationHubSoul')?.addEventListener('click', () => chooseCultivationChamber('soul'));
    document.getElementById('cultivationHubClose')?.addEventListener('click', closeCultivationHub);
}
