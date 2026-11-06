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
        // PR #203: careful + loyal. Pragmatism lives in authored values/convictions, not cunning.
        personalities: ['careful', 'loyal'],
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
    if (npc.travel && typeof isNpcPhysicallyPresentAt === 'function') {
        const loc = locationId != null
            ? locationId
            : (typeof getCurrentLocationId === 'function' ? getCurrentLocationId() : G.currentLocation);
        return isNpcPhysicallyPresentAt(npc, loc);
    }
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
    if (typeof migrateMasterLiangPersonalities === 'function') migrateMasterLiangPersonalities();
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
    ensureWellRingStorehouse();
}

// ---------------------------------------------------------------------------
// Minimal lodge storehouse loss ledger (not a full inventory / economy).
// Physical losses can exist before anyone notices. Culprit lives on the loss
// record as objective metadata for tooling — never fed into NPC decisions.
// ---------------------------------------------------------------------------

const WELL_RING_STOREHOUSE = {
    version: 1,
    baselineHerbStock: 24,
    inspectionEveryMonths: 3,
    inspectionDiscoverChance: 0.55,
    maxPendingLosses: 12,
    maxLossRecords: 40
};

function ensureWellRingStorehouse() {
    const wr = ensureWellRingShell();
    if (!wr.storehouse || typeof wr.storehouse !== 'object') {
        wr.storehouse = {
            version: WELL_RING_STOREHOUSE.version,
            herbStock: WELL_RING_STOREHOUSE.baselineHerbStock,
            lossesById: {},
            pendingDiscoveryIds: [],
            reactedLossIds: [],
            lastInspectionMonths: null,
            nextLossSeq: 1
        };
    }
    const sh = wr.storehouse;
    if (sh.version == null) sh.version = WELL_RING_STOREHOUSE.version;
    if (sh.herbStock == null) sh.herbStock = WELL_RING_STOREHOUSE.baselineHerbStock;
    if (!sh.lossesById || typeof sh.lossesById !== 'object') sh.lossesById = {};
    if (!Array.isArray(sh.pendingDiscoveryIds)) sh.pendingDiscoveryIds = [];
    if (!Array.isArray(sh.reactedLossIds)) sh.reactedLossIds = [];
    if (sh.nextLossSeq == null) sh.nextLossSeq = 1;
    return sh;
}

function allocateWellRingStorehouseLossId() {
    const sh = ensureWellRingStorehouse();
    return `wrloss_${Math.floor(G.ageMonths || 0)}_${sh.nextLossSeq++}`;
}

function cloneWellRingStorehouseRecord(obj) {
    return obj == null ? null : JSON.parse(JSON.stringify(obj));
}

/**
 * Record an objective physical loss. Does not grant NPC knowledge.
 * @param {{ amount?: number, incidentId?: string, trueCulpritId?: string|null, item?: string, discovered?: boolean, meta?: object }} spec
 */
function recordWellRingStorehouseLoss(spec) {
    spec = spec || {};
    const sh = ensureWellRingStorehouse();
    const amount = Math.max(1, Math.floor(Number(spec.amount) || 1));
    const id = spec.id || allocateWellRingStorehouseLossId();
    if (sh.lossesById[id]) return cloneWellRingStorehouseRecord(sh.lossesById[id]);

    // All-or-nothing: never overdraw or create a phantom loss for more than exists.
    const available = Math.max(0, Math.floor(Number(sh.herbStock) || 0));
    if (available < amount) {
        return null;
    }
    sh.herbStock = available - amount;
    const discovered = !!spec.discovered;
    const loss = {
        id,
        orgId: WELL_RING_LODGE_ID,
        item: spec.item || 'spirit_herb_pouch',
        amount,
        atMonths: spec.atMonths != null ? spec.atMonths : (G.ageMonths || 0),
        incidentId: spec.incidentId || null,
        // Objective only — tooling/tests. Decision resolvers must not read this.
        trueCulpritId: spec.trueCulpritId != null ? spec.trueCulpritId : null,
        discovered,
        discoveredAtMonths: discovered ? (G.ageMonths || 0) : null,
        discoveredBy: discovered ? (spec.discoveredBy || null) : null,
        reactionThreadId: null,
        meta: spec.meta && typeof spec.meta === 'object' ? cloneWellRingStorehouseRecord(spec.meta) : {}
    };
    sh.lossesById[id] = loss;
    if (!discovered) {
        if (!sh.pendingDiscoveryIds.includes(id)) sh.pendingDiscoveryIds.push(id);
        while (sh.pendingDiscoveryIds.length > WELL_RING_STOREHOUSE.maxPendingLosses) {
            sh.pendingDiscoveryIds.shift();
        }
    }
    pruneWellRingStorehouseLosses();
    if (loss.incidentId && typeof ensureNpcIncidentState === 'function') {
        const inc = G.npcIncidents?.byId?.[loss.incidentId];
        if (inc && !discovered) {
            // Keep undiscovered theft incidents until discovery/reaction resolves them.
            inc.pinned = true;
            inc.meta = Object.assign({}, inc.meta || {}, { storehouseLossId: id, undiscoveredLoss: true });
        }
    }
    return cloneWellRingStorehouseRecord(loss);
}

function pruneWellRingStorehouseLosses() {
    const sh = ensureWellRingStorehouse();
    const ids = Object.keys(sh.lossesById);
    if (ids.length <= WELL_RING_STOREHOUSE.maxLossRecords) return;
    const sorted = ids.slice().sort((a, b) => {
        const la = sh.lossesById[a];
        const lb = sh.lossesById[b];
        // Prefer dropping old discovered reacted losses first
        const sa = (la.discovered ? 1 : 0) + (la.reactionThreadId ? 1 : 0);
        const sb = (lb.discovered ? 1 : 0) + (lb.reactionThreadId ? 1 : 0);
        if (sa !== sb) return sb - sa;
        return (la.atMonths || 0) - (lb.atMonths || 0);
    });
    while (sorted.length > WELL_RING_STOREHOUSE.maxLossRecords) {
        const drop = sorted.shift();
        const loss = sh.lossesById[drop];
        if (!loss) continue;
        if (!loss.discovered || !loss.reactionThreadId) continue;
        delete sh.lossesById[drop];
        sh.pendingDiscoveryIds = sh.pendingDiscoveryIds.filter(x => x !== drop);
        sh.reactedLossIds = sh.reactedLossIds.filter(x => x !== drop);
    }
}

function getWellRingStorehouseHerbStock() {
    const sh = ensureWellRingStorehouse();
    return Math.max(0, Math.floor(Number(sh.herbStock) || 0));
}

/** True when the storehouse can support an all-or-nothing removal of `amount` herbs. */
function wellRingStorehouseCanSupply(amount) {
    const need = Math.max(1, Math.floor(Number(amount) || 1));
    return getWellRingStorehouseHerbStock() >= need;
}

function getWellRingStorehouseLoss(lossId) {
    const sh = ensureWellRingStorehouse();
    return cloneWellRingStorehouseRecord(sh.lossesById[lossId]);
}

function listWellRingStorehouseLosses(options) {
    options = options || {};
    const sh = ensureWellRingStorehouse();
    return Object.values(sh.lossesById)
        .filter(l => {
            if (!l) return false;
            if (options.undiscoveredOnly && l.discovered) return false;
            if (options.discoveredOnly && !l.discovered) return false;
            if (options.unreactedOnly && (l.reactionThreadId || (sh.reactedLossIds || []).includes(l.id))) return false;
            return true;
        })
        .map(cloneWellRingStorehouseRecord);
}

function listPendingWellRingStorehouseDiscoveries() {
    const sh = ensureWellRingStorehouse();
    return (sh.pendingDiscoveryIds || [])
        .map(id => sh.lossesById[id])
        .filter(l => l && !l.discovered)
        .map(cloneWellRingStorehouseRecord);
}

/**
 * Mark a physical loss as noticed. Does not identify a culprit.
 * Invokes optional notifyWellRingStorehouseLossDiscovered (defined by situations pack).
 */
function markWellRingStorehouseLossDiscovered(lossId, options) {
    options = options || {};
    const sh = ensureWellRingStorehouse();
    const live = sh.lossesById[lossId];
    if (!live) return { ok: false, reason: 'missing_loss' };
    if (live.discovered && !options.forceRediscover) {
        return { ok: true, already: true, loss: cloneWellRingStorehouseRecord(live) };
    }
    live.discovered = true;
    live.discoveredAtMonths = G.ageMonths || 0;
    live.discoveredBy = options.discoveredBy || 'routine_storehouse_inspection';
    sh.pendingDiscoveryIds = (sh.pendingDiscoveryIds || []).filter(id => id !== lossId);
    if (live.incidentId && G.npcIncidents?.byId?.[live.incidentId]) {
        const inc = G.npcIncidents.byId[live.incidentId];
        inc.meta = Object.assign({}, inc.meta || {}, { undiscoveredLoss: false, discoveredAtMonths: live.discoveredAtMonths });
    }
    const loss = cloneWellRingStorehouseRecord(live);
    if (typeof notifyWellRingStorehouseLossDiscovered === 'function' && !options.skipNotify) {
        notifyWellRingStorehouseLossDiscovered(loss, options);
    }
    return { ok: true, loss };
}

function markWellRingStorehouseLossReacted(lossId, threadId) {
    const sh = ensureWellRingStorehouse();
    const live = sh.lossesById[lossId];
    if (live) live.reactionThreadId = threadId || live.reactionThreadId || true;
    if (lossId && !(sh.reactedLossIds || []).includes(lossId)) {
        sh.reactedLossIds = (sh.reactedLossIds || []).concat([lossId]).slice(-WELL_RING_STOREHOUSE.maxLossRecords);
    }
    return getWellRingStorehouseLoss(lossId);
}

/**
 * Cheap shared-clock inspection — Well-Ring storehouse only; no global scans.
 * Discovery establishes missing stock; never names a culprit.
 */
function tickWellRingStorehouseInspection(/* deltaMonths */) {
    ensureWellRingLodgeCast();
    const sh = ensureWellRingStorehouse();
    const now = Math.floor(G.ageMonths || 0);
    const every = WELL_RING_STOREHOUSE.inspectionEveryMonths;
    if (sh.lastInspectionMonths != null && now - sh.lastInspectionMonths < every) {
        return { ok: false, reason: 'not_due' };
    }
    sh.lastInspectionMonths = now;

    const pending = listPendingWellRingStorehouseDiscoveries();
    if (!pending.length) return { ok: true, inspected: true, discovered: [] };

    const liang = getWellRingCastNpc('hall_master', { aliveOnly: true });
    if (!liang) return { ok: false, reason: 'no_living_hall_master' };

    const discovered = [];
    // One loss per inspection pass — bounded work.
    const candidate = pending[0];
    const age = now - (candidate.atMonths || now);
    // Plausible delay: never discover in the same month as the theft unless forced.
    if (age < 1) return { ok: true, inspected: true, discovered: [], deferred: true };

    const roll = Math.random();
    if (roll > WELL_RING_STOREHOUSE.inspectionDiscoverChance) {
        return { ok: true, inspected: true, discovered: [], chanceMiss: true, roll };
    }

    const result = markWellRingStorehouseLossDiscovered(candidate.id, {
        discoveredBy: 'routine_storehouse_inspection'
    });
    if (result.ok && result.loss) discovered.push(result.loss);
    return { ok: true, inspected: true, discovered };
}

/** Developer/test: force the next pending loss to be discovered now. */
function forceDiscoverWellRingStorehouseLoss(lossId, options) {
    options = options || {};
    const sh = ensureWellRingStorehouse();
    const id = lossId || (sh.pendingDiscoveryIds || [])[0];
    if (!id) return { ok: false, reason: 'no_pending_loss' };
    // Allow same-month discovery for deterministic tests.
    return markWellRingStorehouseLossDiscovered(id, Object.assign({
        discoveredBy: options.discoveredBy || 'developer_forced_inspection'
    }, options));
}

function inspectWellRingStorehouseRuntime() {
    const sh = ensureWellRingStorehouse();
    return {
        herbStock: sh.herbStock,
        pendingDiscoveryIds: (sh.pendingDiscoveryIds || []).slice(),
        reactedLossIds: (sh.reactedLossIds || []).slice(),
        lastInspectionMonths: sh.lastInspectionMonths,
        losses: listWellRingStorehouseLosses(),
        pending: listPendingWellRingStorehouseDiscoveries()
    };
}

if (typeof registerWorldTick === 'function') {
    registerWorldTick('wellRingStorehouse', (delta) => {
        tickWellRingStorehouseInspection(delta);
    }, 44);
}
