// ============================================
// CULTIVATION-CHAMBER-STEPS.JS — Seal / Break per chamber track
// ============================================

/** Which refinement track this overlay chamber owns (null if not in a chamber). */
function getActiveChamberTrack() {
    if (G.inQiChamber) return 'dantian';
    if (G.inBodyChamber) return 'vessel';
    if (G.inSoulChamber) return 'spirit';
    return null;
}

function syncFocusToCultivationTrack(track) {
    if (typeof ensureCultivationTracksState === 'function') ensureCultivationTracksState();
    track = typeof normalizeCultivationTrackId === 'function'
        ? normalizeCultivationTrackId(track)
        : track;
    if (typeof setFocusTrack === 'function') setFocusTrack(track);
    else if (typeof syncLegacyPathShims === 'function') syncLegacyPathShims();
    if (typeof syncRealmConsolidationFromFocusTrack === 'function') {
        syncRealmConsolidationFromFocusTrack();
    }
}

/** Run seal/break/consolidate logic with the correct track synced (not creation `G.path`). */
function withCultivationTrack(track, fn, opts) {
    opts = opts || {};
    if (typeof ensureCultivationTracksState === 'function') ensureCultivationTracksState();
    track = typeof normalizeCultivationTrackId === 'function'
        ? normalizeCultivationTrackId(track)
        : track;
    const prev = typeof getFocusTrack === 'function' ? getFocusTrack() : null;
    syncFocusToCultivationTrack(track);
    try {
        return fn();
    } finally {
        if (opts.restoreFocus && prev != null && prev !== track && typeof setFocusTrack === 'function') {
            setFocusTrack(prev);
            if (typeof syncLegacyPathShims === 'function') syncLegacyPathShims();
            if (typeof syncRealmConsolidationFromFocusTrack === 'function') {
                syncRealmConsolidationFromFocusTrack();
            }
        }
    }
}

function refreshChamberAfterRealmStep() {
    if (G.inBodyChamber && typeof renderBodyChamberUI === 'function') renderBodyChamberUI();
    else if (G.inQiChamber && typeof renderChamberUI === 'function') renderChamberUI();
    else if (G.inSoulChamber && typeof renderSoulChamberUI === 'function') renderSoulChamberUI();
    else if (typeof fullRender === 'function') fullRender();
}

function getTrackSealBreakLabels(track, realmIdx) {
    track = typeof normalizeCultivationTrackId === 'function' ? normalizeCultivationTrackId(track) : track;
    if (track === 'vessel' && typeof BODY_VESSEL_REALM_CHAMBER_ACTIONS !== 'undefined') {
        const def = BODY_VESSEL_REALM_CHAMBER_ACTIONS[realmIdx];
        if (def) {
            return {
                sealLabel: def.sealLabel,
                breakLabel: def.breakLabel,
                breakEmoji: def.breakEmoji,
                breakHint: def.breakHint
            };
        }
    }
    const cap = typeof getPathCapstone === 'function' ? getPathCapstone() : null;
    const pathKey = track === 'vessel' ? 'body' : track === 'dantian' ? 'qi' : 'spirit';
    const pathName = typeof PATHS !== 'undefined' ? PATHS[pathKey]?.realms?.[realmIdx] : '';
    return {
        sealLabel: cap?.settledAction || 'Seal this realm',
        breakLabel: 'Break Through',
        breakEmoji: '🌀',
        breakHint: pathName ? `Cross into ${PATHS[pathKey]?.realms?.[realmIdx + 1] || 'the next realm'}` : 'Attempt breakthrough'
    };
}

function canTrackChamberBreakthrough(track) {
    track = typeof normalizeCultivationTrackId === 'function' ? normalizeCultivationTrackId(track) : track;
    if (track === 'vessel' && typeof canVesselTrackBreakthrough === 'function') {
        return canVesselTrackBreakthrough();
    }
    if (track === 'spirit' && typeof canSpiritTrackBreakthrough === 'function') {
        return canSpiritTrackBreakthrough();
    }
    if (track === 'dantian' && typeof getTrackRealmIdx === 'function' && getTrackRealmIdx('dantian') === 0) {
        return typeof hasQcBandBreakthroughReady === 'function' && hasQcBandBreakthroughReady();
    }
    if (typeof canBreakthroughToNextRealm === 'function') return canBreakthroughToNextRealm();
    return false;
}

function getTrackChamberBreakBlockReason(track) {
    track = typeof normalizeCultivationTrackId === 'function' ? normalizeCultivationTrackId(track) : track;
    if (track === 'vessel' && typeof getVesselTrackBreakthroughBlockReason === 'function') {
        return getVesselTrackBreakthroughBlockReason();
    }
    if (track === 'spirit' && typeof getSpiritTrackBreakthroughBlockReason === 'function') {
        return getSpiritTrackBreakthroughBlockReason();
    }
    if (typeof getConsolidationBlockReason === 'function') return getConsolidationBlockReason();
    return 'Breakthrough not available yet.';
}

function getTrackChamberSealBlockReason(track) {
    if (typeof canSealAtCurrentProgress === 'function' && canSealAtCurrentProgress()) return null;
    if (typeof getConsolidationBlockReason === 'function') return getConsolidationBlockReason();
    return 'Not ready to seal.';
}

function getChamberActionAllowOpts(track) {
    return {
        allowBodyChamber: track === 'vessel',
        allowSoulChamber: track === 'spirit',
        allowQiChamber: track === 'dantian'
    };
}

/** Shared Seal + Break row for qi / body / soul chambers. */
function renderChamberTrackRealmSteps(panel, track) {
    if (!panel || !track) return;
    track = typeof normalizeCultivationTrackId === 'function' ? normalizeCultivationTrackId(track) : track;

    withCultivationTrack(track, () => {
        const realmIdx = typeof getTrackRealmIdx === 'function' ? getTrackRealmIdx(track) : (G.realmIdx || 0);
        const atQc = track === 'dantian' && typeof getTrackRealmIdx === 'function'
            && getTrackRealmIdx('dantian') === 0;
        const labels = getTrackSealBreakLabels(track, realmIdx);
        const consolidated = typeof isTrackRealmConsolidated === 'function'
            ? isTrackRealmConsolidated(track, realmIdx)
            : (typeof isRealmConsolidated === 'function' && isRealmConsolidated(realmIdx));

        const wrap = document.createElement('div');
        wrap.className = 'chamber-track-realm-steps body-chamber-realm-steps';

        const head = document.createElement('div');
        head.className = 'body-chamber-sub-head';
        head.textContent = `${track === 'dantian' ? 'Dantian' : track === 'vessel' ? 'Vessel' : 'Spirit'} realm step`;
        wrap.appendChild(head);

        if (!atQc) {
            const canSeal = typeof canSealAtCurrentProgress === 'function' && canSealAtCurrentProgress();
            if (!consolidated) {
                const sealBtn = document.createElement('button');
                sealBtn.type = 'button';
                sealBtn.className = 'body-chamber-action-btn body-chamber-realm-step-btn';
                const blocked = typeof getActionBlockReason === 'function'
                    ? getActionBlockReason(getChamberActionAllowOpts(track))
                    : null;
                sealBtn.disabled = !!blocked || !canSeal;
                sealBtn.innerHTML = `<span class="body-action-label">🏛️ ${labels.sealLabel}</span>`
                    + `<span class="body-action-meta">${canSeal ? 'Settled — lock gains before breakthrough' : (getTrackChamberSealBlockReason(track) || 'Reach Settled progress')}</span>`;
                sealBtn.addEventListener('click', () => {
                    withCultivationTrack(track, () => {
                        if (typeof actionConsolidate === 'function') actionConsolidate();
                    });
                    refreshChamberAfterRealmStep();
                });
                wrap.appendChild(sealBtn);
            } else {
                const done = document.createElement('p');
                done.className = 'body-chamber-sub-hint';
                done.textContent = `✓ ${labels.sealLabel} complete — you may break through.`;
                wrap.appendChild(done);
            }
        } else {
            const qcNote = document.createElement('p');
            qcNote.className = 'body-chamber-sub-hint';
            qcNote.textContent = 'Qi Condensation has no Seal — reach Late, then Break Through.';
            wrap.appendChild(qcNote);
        }

        const canBreak = canTrackChamberBreakthrough(track);
        const breakBtn = document.createElement('button');
        breakBtn.type = 'button';
        breakBtn.className = 'body-chamber-action-btn body-chamber-realm-step-btn';
        const breakBlock = typeof getActionBlockReason === 'function'
            ? getActionBlockReason(getChamberActionAllowOpts(track))
            : null;
        breakBtn.disabled = !!breakBlock;
        breakBtn.innerHTML = `<span class="body-action-label">${labels.breakEmoji} ${labels.breakLabel}</span>`
            + `<span class="body-action-meta">${canBreak ? labels.breakHint : getTrackChamberBreakBlockReason(track)}</span>`;
        breakBtn.addEventListener('click', () => {
            if (typeof openBreakthrough === 'function') openBreakthrough(track);
            refreshChamberAfterRealmStep();
        });
        wrap.appendChild(breakBtn);

        panel.appendChild(wrap);
    }, { restoreFocus: true });
}
