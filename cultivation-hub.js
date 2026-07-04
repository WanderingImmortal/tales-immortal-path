// ============================================
// CULTIVATION-HUB.JS — Path chooser for cultivation chambers
// ============================================

function cultivationHubBlocked() {
    return G.gameOver || G.inCombat || G.inQiChamber || G.inBodyChamber || G.inSoulChamber
        || G.inAlchemyChamber
        || (typeof isTribulationActive === 'function' && isTribulationActive())
        || (typeof isTranscendencePerkPending === 'function' && isTranscendencePerkPending());
}

function openCultivationHub() {
    if (cultivationHubBlocked()) return;
    G.inCultivationHub = true;
    const pathEl = document.getElementById('cultivationHubPrimaryPath');
    if (pathEl && typeof PATHS !== 'undefined' && G.path) {
        pathEl.textContent = PATHS[G.path]?.name || G.path;
    }
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
