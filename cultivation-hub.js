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
    const bodyNote = document.getElementById('cultivationHubBodyNote');
    const soulNote = document.getElementById('cultivationHubSoulNote');
    if (bodyNote) {
        if (typeof hasBodyPhysiqueActivity === 'function' && hasBodyPhysiqueActivity()) {
            if (typeof isPhysiqueCultivationActive === 'function' && isPhysiqueCultivationActive()) {
                const status = typeof getPhysiqueCultivationStatusText === 'function'
                    ? getPhysiqueCultivationStatusText() : 'Physique project active';
                bodyNote.textContent = `🧬 ${status}`;
            } else if (G.physique) {
                bodyNote.textContent = `🧬 ${G.physique.name} equipped`;
            } else {
                bodyNote.textContent = '🧬 Physique active';
            }
        } else {
            bodyNote.textContent = typeof getVesselRealm === 'function' ? `Vessel: ${getVesselRealm()}` : '';
        }
    }
    if (soulNote) {
        if (typeof hasSoulEmbryo === 'function' && hasSoulEmbryo()) {
            soulNote.textContent = '✨ Soul embryo — palace depths open';
        } else {
            soulNote.textContent = '🌙 Prelude open · depths locked';
        }
    }
}

function getEmphasisLabel(track) {
    const labels = { dantian: 'Dantian', vessel: 'Vessel', spirit: 'Spirit' };
    return labels[track] || track;
}

function openCultivationHub() {
    if (cultivationHubBlocked()) return;
    G.inCultivationHub = true;
    const pathEl = document.getElementById('cultivationHubPrimaryPath');
    if (pathEl) {
        const track = typeof getFocusTrack === 'function' ? getFocusTrack() : null;
        pathEl.textContent = track && typeof getEmphasisLabel === 'function'
            ? getEmphasisLabel(track)
            : (PATHS[G.path]?.name || G.path);
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
