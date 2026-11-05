// Well-Ring Lodge cast — persistent world NPCs for the Redwell hall.
// Phase A of NPC agency (docs/ideas/npc-agency-well-ring.md).
// Life/cultivation authority stays on G.worldNpcs. Lodge UX stays on G.wellRing.
// Not a full lesser-sect conversion; thin affiliation adapter for future ties/threads.

const WELL_RING_LODGE_ID = 'well_ring_lodge';
const WELL_RING_HOME_LOCATION_ID = 'redwell';
const WELL_RING_HOME_ZONE_ID = 'dustbone';

/** Stable authored cast. Distinct from story NPC `liang_chen`. */
const WELL_RING_CAST = {
    hall_master: {
        key: 'hall_master',
        uid: 'wr_master_liang',
        name: 'Master Liang',
        lodgeRole: 'hall_master',
        role: 'sect_elder',
        realmIdx: 1,
        ageMonths: 48 * 12,
        growthRate: 0.35,
        // Aligns with authored foundation in npc-foundations.js (Phase B). Existing saves keep prior traits.
        personalities: ['cunning', 'loyal'],
        occupation: 'Well-Ring hall master'
    },
    rival: {
        key: 'rival',
        uid: 'wr_wei_shun',
        name: 'Wei Shun',
        lodgeRole: 'outer_rival',
        role: 'disciple',
        realmIdx: 0,
        ageMonths: 26 * 12,
        growthRate: 0.7,
        personalities: ['ambitious', 'bold'],
        occupation: 'Well-Ring outer disciple'
    }
};

function getWellRingCastDef(key) {
    return WELL_RING_CAST[key] || null;
}

function listWellRingCastDefs() {
    return Object.values(WELL_RING_CAST);
}

/** Find a world NPC record by uid, including dead (life still lives on the record). */
function findWorldNpcRecordByUid(uid) {
    if (!uid || !G.worldNpcs) return null;
    return G.worldNpcs.find(n => n.uid === uid) || null;
}

function getWellRingCastNpc(key, options) {
    options = options || {};
    const def = getWellRingCastDef(key);
    if (!def) return null;
    const npc = findWorldNpcRecordByUid(def.uid);
    if (!npc) return null;
    if (options.aliveOnly && npc.alive === false) return null;
    return npc;
}

function isWellRingCastNpcPresent(npc, locationId) {
    if (!npc || npc.alive === false) return false;
    const zoneId = typeof currentZone !== 'undefined' ? currentZone : G.currentZone;
    if (npc.zone && zoneId && npc.zone !== zoneId) return false;
    const home = npc.homeLocationId || WELL_RING_HOME_LOCATION_ID;
    const loc = locationId != null
        ? locationId
        : (typeof getCurrentLocationId === 'function' ? getCurrentLocationId() : G.currentLocation);
    if (home && loc && home !== loc) return false;
    return true;
}

/**
 * Display name for lodge UI. Dead/absent master does not invent succession —
 * falls back to steward wording so join/missions stay playable.
 */
function getWellRingMasterDisplayName() {
    const npc = getWellRingCastNpc('hall_master');
    if (!npc) return 'Master Liang';
    if (npc.alive === false) return 'the lodge steward';
    return npc.name || 'Master Liang';
}

function getWellRingRivalDisplayName() {
    const npc = getWellRingCastNpc('rival');
    if (!npc) return 'Wei Shun';
    if (npc.alive === false) return `${npc.name || 'Wei Shun'} (fallen)`;
    return npc.name || 'Wei Shun';
}

function buildWellRingCastNpc(def) {
    const ageMonths = G.ageMonths || 0;
    // On first materialization, inherit existing Well-Ring rivalMerit so old saves keep board progress.
    let lodgeMerit = 0;
    if (def.key === 'rival') {
        const existing = G.wellRing?.rivalMerit;
        lodgeMerit = existing != null ? existing : 4;
    }
    return {
        uid: def.uid,
        name: def.name,
        role: def.role,
        zone: WELL_RING_HOME_ZONE_ID,
        homeLocationId: WELL_RING_HOME_LOCATION_ID,
        realmIdx: def.realmIdx,
        ageMonths: def.ageMonths,
        growthProgress: 0,
        growthRate: def.growthRate,
        personalities: def.personalities.slice(),
        isDemonicTalent: false,
        demonicThreat: 0,
        demonicMet: false,
        alive: true,
        met: false,
        talkCount: 0,
        state: 'persistent',
        unnamed: false,
        spawnedAtMonths: ageMonths,
        wanderDueMonths: null,
        affiliationId: WELL_RING_LODGE_ID,
        lodgeRole: def.lodgeRole,
        occupation: def.occupation,
        lodgeMerit
    };
}

function backfillWellRingCastNpc(npc, def) {
    if (!npc || !def) return npc;
    if (!npc.affiliationId) npc.affiliationId = WELL_RING_LODGE_ID;
    if (!npc.lodgeRole) npc.lodgeRole = def.lodgeRole;
    if (!npc.homeLocationId) npc.homeLocationId = WELL_RING_HOME_LOCATION_ID;
    if (!npc.occupation && def.occupation) npc.occupation = def.occupation;
    if (npc.wanderDueMonths == null && def.role !== 'wanderer') npc.wanderDueMonths = null;
    if (npc.state == null) npc.state = 'persistent';
    if (npc.unnamed == null) npc.unnamed = false;
    if (def.key === 'rival' && npc.lodgeMerit == null) {
        const wr = G.wellRing;
        npc.lodgeMerit = wr && wr.rivalMerit != null ? wr.rivalMerit : 4;
    }
    if (typeof ensureNpcPersonalities === 'function') ensureNpcPersonalities(npc);
    return npc;
}

function ensureWellRingShell() {
    if (!G.wellRing) {
        G.wellRing = {
            member: false,
            merit: 0,
            rivalMerit: 4,
            lastMissionMonth: 0,
            lastBoardMonth: -1,
            lastTournamentYear: -1,
            tournamentDue: false,
            manualClaimed: false,
            dirtyDone: 0,
            heardFeeScam: false,
            joinMonth: 0
        };
    }
    if (G.wellRing.rivalMerit == null) G.wellRing.rivalMerit = 4;
    return G.wellRing;
}

function ensureWellRingLodgeOrg() {
    const wr = ensureWellRingShell();
    if (!wr.lodge) {
        wr.lodge = {
            id: WELL_RING_LODGE_ID,
            name: 'Well-Ring Lodge',
            zone: WELL_RING_HOME_ZONE_ID,
            headquartersLocationId: WELL_RING_HOME_LOCATION_ID,
            memberUids: [],
            roles: {}
        };
    }
    const lodge = wr.lodge;
    if (!lodge.id) lodge.id = WELL_RING_LODGE_ID;
    if (!lodge.name) lodge.name = 'Well-Ring Lodge';
    if (!lodge.zone) lodge.zone = WELL_RING_HOME_ZONE_ID;
    if (!lodge.headquartersLocationId) lodge.headquartersLocationId = WELL_RING_HOME_LOCATION_ID;
    if (!Array.isArray(lodge.memberUids)) lodge.memberUids = [];
    if (!lodge.roles || typeof lodge.roles !== 'object') lodge.roles = {};

    listWellRingCastDefs().forEach(def => {
        if (!lodge.memberUids.includes(def.uid)) lodge.memberUids.push(def.uid);
        lodge.roles[def.uid] = def.lodgeRole;
    });
    wr.cast = {
        hallMasterUid: WELL_RING_CAST.hall_master.uid,
        rivalUid: WELL_RING_CAST.rival.uid
    };
    return lodge;
}

/** Sync rival board merit: NPC.lodgeMerit is authoritative once cast exists; mirror scalar for old saves/UI. */
function syncWellRingRivalMerit() {
    const wr = ensureWellRingShell();
    const rival = findWorldNpcRecordByUid(WELL_RING_CAST.rival.uid);
    if (!rival) {
        if (wr.rivalMerit == null) wr.rivalMerit = 4;
        return wr.rivalMerit;
    }
    if (rival.lodgeMerit == null) {
        rival.lodgeMerit = wr.rivalMerit != null ? wr.rivalMerit : 4;
    }
    wr.rivalMerit = rival.lodgeMerit;
    return rival.lodgeMerit;
}

function getWellRingRivalMerit() {
    ensureWellRingLodgeCast();
    return syncWellRingRivalMerit();
}

function setWellRingRivalMerit(value) {
    ensureWellRingLodgeCast();
    const wr = ensureWellRingShell();
    const next = Math.max(0, Math.floor(Number(value) || 0));
    const rival = findWorldNpcRecordByUid(WELL_RING_CAST.rival.uid);
    if (rival) rival.lodgeMerit = next;
    wr.rivalMerit = next;
    return next;
}

function adjustWellRingRivalMerit(delta) {
    return setWellRingRivalMerit(getWellRingRivalMerit() + (Number(delta) || 0));
}

/**
 * Idempotent: create Master Liang + Wei Shun on G.worldNpcs if missing.
 * Does not reset age/realm/alive/zone on existing records.
 */
function ensureWellRingLodgeCast() {
    if (typeof G === 'undefined') return [];
    if (!G.worldNpcs) G.worldNpcs = [];
    ensureWellRingLodgeOrg();

    const createdOrFound = [];
    listWellRingCastDefs().forEach(def => {
        let npc = findWorldNpcRecordByUid(def.uid);
        if (!npc) {
            npc = buildWellRingCastNpc(def);
            G.worldNpcs.push(npc);
        } else {
            backfillWellRingCastNpc(npc, def);
        }
        createdOrFound.push(npc);
    });

    syncWellRingRivalMerit();
    if (typeof ensureNpcCharacterFoundation === 'function') {
        createdOrFound.forEach(npc => ensureNpcCharacterFoundation(npc));
    }
    if (typeof seedCanonicalNpcTies === 'function') seedCanonicalNpcTies();
    return createdOrFound;
}

function resolveWellRingMemberNpc(uidOrKey) {
    if (!uidOrKey) return null;
    if (WELL_RING_CAST[uidOrKey]) return getWellRingCastNpc(uidOrKey);
    return findWorldNpcRecordByUid(uidOrKey);
}

function getWellRingLodgeMembers(options) {
    options = options || {};
    ensureWellRingLodgeCast();
    const lodge = G.wellRing?.lodge;
    const uids = lodge?.memberUids || listWellRingCastDefs().map(d => d.uid);
    return uids.map(uid => findWorldNpcRecordByUid(uid)).filter(npc => {
        if (!npc) return false;
        if (options.aliveOnly && npc.alive === false) return false;
        return true;
    });
}

function migrateWellRingLodgeForExistingSave() {
    ensureWellRingLodgeCast();
}
