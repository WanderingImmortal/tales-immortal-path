// ============================================
// CULTIVATION-TRACKS.JS — Three refinements, soul embryo gate
// ============================================
//
// Tier index: realmIdx is 0-based. Player-facing tier 4 (Nascent Soul / Diamond Body /
// Nascent Divinity) = realmIdx === 3. Soul embryo gate: realmIdx >= 3 on any track.

const CULTIVATION_TRACKS = ['dantian', 'vessel', 'spirit'];

const TRACK_TO_LEGACY_PATH = { dantian: 'qi', vessel: 'body', spirit: 'soul' };
const LEGACY_PATH_TO_TRACK = { qi: 'dantian', body: 'vessel', soul: 'spirit' };

/** realmIdx >= this on dantian, vessel, or spirit awakens the soul embryo (tier 4). */
const SOUL_EMBRYO_REALM_IDX = 3;

const NEUTRAL_STARTING_BASE = { qi: 10, vitality: 6, spirit: 6, will: 4, hp: 90 };

function emptyTrackState() {
    return { realmIdx: 0, consolidation: {} };
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
                break;
            }
        }
    }

    syncLegacyPathShims();
    syncRealmConsolidationFromFocusTrack();
    G._cultivationTracksMigrated = true;
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
    ensureCultivationTracksState();
    const track = getFocusTrack();
    G.path = TRACK_TO_LEGACY_PATH[track] || 'qi';
    G.realmIdx = getTrackRealmIdx(track);
}

function getFocusTrack() {
    if (G.cultivation?.focusTrack) return G.cultivation.focusTrack;
    return LEGACY_PATH_TO_TRACK[G.path] || 'dantian';
}

function setFocusTrack(track) {
    ensureCultivationTracksState();
    if (!CULTIVATION_TRACKS.includes(track)) track = 'dantian';
    G.cultivation.focusTrack = track;
    syncLegacyPathShims();
    syncRealmConsolidationFromFocusTrack();
}

function getTrackRealmIdx(track) {
    ensureCultivationTracksState();
    return G.cultivation[track]?.realmIdx ?? 0;
}

function setTrackRealmIdx(track, idx) {
    ensureCultivationTracksState();
    const max = getMaxCultivationRealmIdx(TRACK_TO_LEGACY_PATH[track]);
    G.cultivation[track].realmIdx = clamp(idx, 0, max);
    if (track === getFocusTrack()) syncLegacyPathShims();
    refreshSoulEmbryoFromTracks();
}

function getTrackPathKey(track) {
    return TRACK_TO_LEGACY_PATH[track] || 'qi';
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
        const labels = { dantian: 'Nascent Soul', vessel: 'Vital Soul', spirit: 'Nascent Divinity' };
        return `Soul embryo awakened (${labels[origin] || origin}) — the palace depths are open.`;
    }
    return 'Mortal spirit only — a cultivator\'s soul must be born before the palace\'s depths open.';
}
