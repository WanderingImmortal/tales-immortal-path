// ============================================
// CULTIVATION-TRACKS.JS — Three refinements, soul embryo gate
// ============================================
//
// Tier index: realmIdx is 0-based. Player-facing tier 4 (Nascent Soul / Diamond Body /
// Soul Integration) = realmIdx === 3. Soul embryo gate: realmIdx >= 3 on any track.

const CULTIVATION_TRACKS = ['dantian', 'vessel', 'spirit'];

const TRACK_TO_LEGACY_PATH = { dantian: 'qi', vessel: 'body', spirit: 'soul' };
const LEGACY_PATH_TO_TRACK = { qi: 'dantian', body: 'vessel', soul: 'spirit' };

/** realmIdx >= this on dantian, vessel, or spirit awakens the soul embryo (tier 4). */
const SOUL_EMBRYO_REALM_IDX = 3;

const NEUTRAL_STARTING_BASE = { qi: 10, vitality: 6, spirit: 6, will: 4, hp: 90 };

function emptyTrackState() {
    return { realmIdx: 0, consolidation: {} };
}

function normalizeCultivationTrackId(track) {
    if (!track) return 'dantian';
    if (CULTIVATION_TRACKS.includes(track)) return track;
    if (LEGACY_PATH_TO_TRACK[track]) return LEGACY_PATH_TO_TRACK[track];
    return 'dantian';
}

function ensureCultivationTracksState() {
    if (!G.cultivation) {
        G.cultivation = {
            dantian: emptyTrackState(),
            vessel: emptyTrackState(),
            spirit: emptyTrackState(),
            soulEmbryo: false,
            soulEmbryoOrigin: null,
            focusTrack: 'dantian'
        };
    }
    CULTIVATION_TRACKS.forEach(track => {
        if (!G.cultivation[track]) G.cultivation[track] = emptyTrackState();
        if (G.cultivation[track].realmIdx == null) G.cultivation[track].realmIdx = 0;
        if (!G.cultivation[track].consolidation) G.cultivation[track].consolidation = {};
    });
    if (G.cultivation.soulEmbryo == null) G.cultivation.soulEmbryo = false;
    if (G.cultivation.soulEmbryoOrigin === undefined) G.cultivation.soulEmbryoOrigin = null;
    if (!G.cultivation.focusTrack) G.cultivation.focusTrack = 'dantian';
    else G.cultivation.focusTrack = normalizeCultivationTrackId(G.cultivation.focusTrack);
    syncLegacyPathShims();
}

function migrateSaveToCultivationTracks() {
    if (G._cultivationTracksMigrated) {
        ensureCultivationTracksState();
        return;
    }
    const hadCultivation = !!G.cultivation?.dantian;
    ensureCultivationTracksState();

    if (!hadCultivation) {
        const legacyPath = G.path || 'qi';
        const track = LEGACY_PATH_TO_TRACK[legacyPath] || 'dantian';
        const realmIdx = G.realmIdx ?? 0;
        G.cultivation[track].realmIdx = realmIdx;
        if (G.realmConsolidation && Object.keys(G.realmConsolidation).length) {
            G.cultivation[track].consolidation = { ...G.realmConsolidation };
        }
        G.cultivation.focusTrack = track;
        CULTIVATION_TRACKS.forEach(t => {
            if (t !== track) {
                G.cultivation[t].realmIdx = 0;
                G.cultivation[t].consolidation = {};
            }
        });
    }

    if (G.cultivation.soulEmbryo == null || !G.cultivation.soulEmbryo) {
        for (const track of CULTIVATION_TRACKS) {
            if (getTrackRealmIdx(track) >= SOUL_EMBRYO_REALM_IDX) {
                G.cultivation.soulEmbryo = true;
                if (!G.cultivation.soulEmbryoOrigin) {
                    G.cultivation.soulEmbryoOrigin = track;
                }
                // Crystallize latent mass for legacy high-realm saves (preserve existing active mass).
                if (typeof resolveSoulMassOnBirth === 'function' && (G.soulMass?.latentMass || 0) > 0) {
                    resolveSoulMassOnBirth(track);
                } else if (typeof ensureSoulMassState === 'function') {
                    ensureSoulMassState();
                }
                break;
            }
        }
    }

    syncLegacyPathShims();
    syncRealmConsolidationFromFocusTrack();
    G._cultivationTracksMigrated = true;
}

/** Map saved realmIdx from the old 7-name ladder to nine-realm indices (insert @4 and @7). */
function remapRealmIdxSevenToNine(oldIdx) {
    const n = Number(oldIdx);
    if (!Number.isFinite(n) || n < 0) return 0;
    if (n < 4) return n;
    if (n <= 5) return n + 1;
    if (n === 6) return 8;
    return n;
}

function remapConsolidationKeys(consolidation) {
    if (!consolidation || typeof consolidation !== 'object') return consolidation;
    const next = {};
    Object.keys(consolidation).forEach(k => {
        const i = parseInt(k, 10);
        const nk = Number.isNaN(i) ? k : String(remapRealmIdxSevenToNine(i));
        next[nk] = consolidation[k];
    });
    return next;
}

function migrateNpcRealmIdx(npc) {
    if (!npc || npc.realmIdx == null) return;
    if (npc.realmIdx >= 4) npc.realmIdx = remapRealmIdxSevenToNine(npc.realmIdx);
}

/** Saves at or above this version already use nine-realm indices — skip legacy remap. */
const MORTAL_LADDER_SAVE_VERSION = 9;

function migrateNineRealmLadder() {
    if (G.mortalLadderVersion >= MORTAL_LADDER_SAVE_VERSION || G._nineRealmLadderMigrated) {
        G.mortalLadderVersion = MORTAL_LADDER_SAVE_VERSION;
        G._nineRealmLadderMigrated = true;
        return;
    }
    ensureCultivationTracksState();
    CULTIVATION_TRACKS.forEach(track => {
        const t = G.cultivation[track];
        if (!t) return;
        if (t.realmIdx != null && t.realmIdx >= 4) {
            t.realmIdx = remapRealmIdxSevenToNine(t.realmIdx);
        }
        if (t.consolidation) t.consolidation = remapConsolidationKeys(t.consolidation);
    });
    if (G.realmIdx != null && G.realmIdx >= 4) {
        G.realmIdx = remapRealmIdxSevenToNine(G.realmIdx);
    }
    if (G.realmConsolidation) {
        G.realmConsolidation = remapConsolidationKeys(G.realmConsolidation);
        syncConsolidationToFocusTrack();
    }
    if (G.talent) {
        if (G.talent.innateCeilingRealmIdx >= 4 && G.talent.innateCeilingRealmIdx <= 6) {
            G.talent.innateCeilingRealmIdx = remapRealmIdxSevenToNine(G.talent.innateCeilingRealmIdx);
        }
        if (G.talent.naturalRealmCap >= 4 && G.talent.naturalRealmCap <= 6) {
            G.talent.naturalRealmCap = remapRealmIdxSevenToNine(G.talent.naturalRealmCap);
        }
    }
    (G.worldNpcs || []).forEach(migrateNpcRealmIdx);
    (G.ambientNpcs || []).forEach(migrateNpcRealmIdx);
    (G.npcs || []).forEach(migrateNpcRealmIdx);
    syncLegacyPathShims();
    syncRealmConsolidationFromFocusTrack();
    G.mortalLadderVersion = MORTAL_LADDER_SAVE_VERSION;
    G._nineRealmLadderMigrated = true;
}

function syncRealmConsolidationFromFocusTrack() {
    const track = getFocusTrack();
    if (G.cultivation?.[track]?.consolidation) {
        G.realmConsolidation = G.cultivation[track].consolidation;
    }
}

function syncConsolidationToFocusTrack() {
    const track = getFocusTrack();
    if (!G.cultivation?.[track]) return;
    G.cultivation[track].consolidation = G.realmConsolidation || {};
}

function syncLegacyPathShims() {
    if (!G.cultivation) return;
    const track = getFocusTrack();
    G.path = TRACK_TO_LEGACY_PATH[track] || 'qi';
    G.realmIdx = G.cultivation[track]?.realmIdx ?? 0;
}

function getFocusTrack() {
    if (G.cultivation?.focusTrack) return normalizeCultivationTrackId(G.cultivation.focusTrack);
    return normalizeCultivationTrackId(LEGACY_PATH_TO_TRACK[G.path] || G.path || 'dantian');
}

function setFocusTrack(track) {
    ensureCultivationTracksState();
    track = normalizeCultivationTrackId(track);
    G.cultivation.focusTrack = track;
    syncLegacyPathShims();
    syncRealmConsolidationFromFocusTrack();
}

function getTrackRealmIdx(track) {
    track = normalizeCultivationTrackId(track);
    if (!G.cultivation?.[track]) ensureCultivationTracksState();
    return G.cultivation[track]?.realmIdx ?? 0;
}

function setTrackRealmIdx(track, idx) {
    track = normalizeCultivationTrackId(track);
    ensureCultivationTracksState();
    if (!G.cultivation[track]) G.cultivation[track] = emptyTrackState();
    const max = getMaxCultivationRealmIdx(TRACK_TO_LEGACY_PATH[track]);
    G.cultivation[track].realmIdx = clamp(idx, 0, max);
    if (track === getFocusTrack()) syncLegacyPathShims();
    refreshSoulEmbryoFromTracks();
}

function getTrackPathKey(track) {
    return TRACK_TO_LEGACY_PATH[normalizeCultivationTrackId(track)] || 'qi';
}

function getTrackPathData(track) {
    return PATHS[getTrackPathKey(track)] || PATHS.qi;
}

function getDantianRealm() {
    const idx = getTrackRealmIdx('dantian');
    return PATHS.qi.realms[idx] || 'MAX';
}

function getVesselRealm() {
    const idx = getTrackRealmIdx('vessel');
    return PATHS.body.realms[idx] || 'MAX';
}

function getSpiritRealm() {
    const idx = getTrackRealmIdx('spirit');
    return PATHS.soul.realms[idx] || 'MAX';
}

function getTrackRealmName(track) {
    const data = getTrackPathData(track);
    const idx = getTrackRealmIdx(track);
    return data.realms[idx] || 'MAX';
}

function getTrackTitle(track) {
    const data = getTrackPathData(track);
    const idx = getTrackRealmIdx(track);
    return data.titles[idx] || 'Transcendent';
}

/** World gates, forbidden search, lifespan — max tier across all three refinements. */
function getEffectiveRealmTier() {
    ensureCultivationTracksState();
    return Math.max(
        getTrackRealmIdx('dantian'),
        getTrackRealmIdx('vessel'),
        getTrackRealmIdx('spirit')
    );
}

function hasSoulEmbryo() {
    return !!(G.cultivation?.soulEmbryo);
}

function canAccessSoulPalaceDeep() {
    return hasSoulEmbryo();
}

function canAccessSoulPalacePrelude() {
    return true;
}

function refreshSoulEmbryoFromTracks() {
    if (G.cultivation?.soulEmbryo) return;
    for (const track of CULTIVATION_TRACKS) {
        if (getTrackRealmIdx(track) >= SOUL_EMBRYO_REALM_IDX) {
            tryAwakenSoulEmbryo(track);
            break;
        }
    }
}

function tryAwakenSoulEmbryo(origin) {
    ensureCultivationTracksState();
    if (G.cultivation.soulEmbryo) return false;
    const track = origin || CULTIVATION_TRACKS.find(t => getTrackRealmIdx(t) >= SOUL_EMBRYO_REALM_IDX);
    if (!track || getTrackRealmIdx(track) < SOUL_EMBRYO_REALM_IDX) return false;

    G.cultivation.soulEmbryo = true;
    G.cultivation.soulEmbryoOrigin = track;

    if (typeof resolveSoulMassOnBirth === 'function') {
        resolveSoulMassOnBirth(track);
    }

    const msg = typeof SOUL_EMBRYO_AWAKEN_MESSAGES !== 'undefined'
        ? SOUL_EMBRYO_AWAKEN_MESSAGES[track]
        : null;
    if (msg) addLog(msg);

    if (typeof SOUL_EMBRYO_ORIGIN_PERKS !== 'undefined' && typeof applySoulChamberBonusDelta === 'function') {
        const perk = SOUL_EMBRYO_ORIGIN_PERKS[track];
        if (perk) applySoulChamberBonusDelta(perk);
    }
    return true;
}

function getHighestInvestedTrack() {
    ensureCultivationTracksState();
    let best = 'dantian';
    let bestIdx = -1;
    CULTIVATION_TRACKS.forEach(track => {
        const idx = getTrackRealmIdx(track);
        if (idx > bestIdx) {
            bestIdx = idx;
            best = track;
        }
    });
    return best;
}

function getCombatTrackFallback() {
    return getFocusTrack() || getHighestInvestedTrack();
}

function getLegacyPathForTrack(track) {
    return TRACK_TO_LEGACY_PATH[track] || 'qi';
}

function formatEmbryoStatusLine() {
    if (hasSoulEmbryo()) {
        const origin = G.cultivation.soulEmbryoOrigin;
        const labels = { dantian: 'Nascent Soul', vessel: 'Vital Soul', spirit: 'Soul Integration' };
        const maturity = typeof getSoulMaturityLabel === 'function' ? getSoulMaturityLabel() : null;
        const maturityBit = maturity ? ` · ${maturity}` : '';
        return `Soul born (${labels[origin] || origin})${maturityBit} — Soul Cultivation unlocked, palace depths open.`;
    }
    return 'Spirit foundation — soul birth awaits the fourth realm on any path; then Soul Cultivation begins.';
}

/** Regress vessel track to the start of the current realm (Rule abandon punishment). */
function regressVesselTrackToCurrentRealmStart() {
    ensureCultivationTracksState();
    const realmIdx = getTrackRealmIdx('vessel');
    if (G.cultivation.vessel.consolidation[realmIdx] != null) {
        delete G.cultivation.vessel.consolidation[realmIdx];
    }
    if (getFocusTrack() === 'vessel') {
        G.realmPeakGrindBoost = 0;
        syncRealmConsolidationFromFocusTrack();
    }
}
