// Shared resource-source foundation (PR #209).
// Distinguishes physical stock extraction from intentional abstract rewards.
// Not a global economy — location/institution stocks + small transfer helpers only.

const RESOURCE_SOURCE_VERSION = 1;

/** Source kinds supported by this slice. */
const RESOURCE_SOURCE_TYPES = Object.freeze({
    FINITE_STOCK: 'finite_stock',
    REGENERATING_STOCK: 'regenerating_stock',
    ABSTRACT_REWARD: 'abstract_reward'
});

/**
 * Intentional abstractions — not backed by location stock.
 * Call sites that grant these must not invent a depleting wilderness generator.
 */
const ABSTRACT_RESOURCE_REWARDS = Object.freeze({
    lodge_duty_herb_stipend: {
        id: 'lodge_duty_herb_stipend',
        type: RESOURCE_SOURCE_TYPES.ABSTRACT_REWARD,
        resourceId: 'spirit_herb',
        note: 'Well-Ring duty pay may include a spirit-herb stipend; not extracted from a field.'
    },
    player_explore_field_rng: {
        id: 'player_explore_field_rng',
        type: RESOURCE_SOURCE_TYPES.ABSTRACT_REWARD,
        resourceId: null,
        note: 'Player explore rolls named alchemy mats / craft mats; no shared stock depletion yet.'
    },
    sect_spirit_garden: {
        id: 'sect_spirit_garden',
        type: RESOURCE_SOURCE_TYPES.ABSTRACT_REWARD,
        resourceId: 'spirit_herb',
        note: 'Sect garden pendingHerbs retains its own implementation.'
    },
    lodge_external_herb_supply: {
        id: 'lodge_external_herb_supply',
        type: RESOURCE_SOURCE_TYPES.ABSTRACT_REWARD,
        resourceId: 'spirit_herb',
        note: 'Well-Ring storehouse resupply channel — abstract external procurement, not a field deposit.'
    }
});

/**
 * Authored regenerating / finite source defs.
 * Balance numbers are provisional — tune later without changing the contract.
 */
const RESOURCE_SOURCE_DEFS = Object.freeze({
    dewcatch_scrub_spirit_herbs: {
        id: 'dewcatch_scrub_spirit_herbs',
        type: RESOURCE_SOURCE_TYPES.REGENERATING_STOCK,
        locationId: 'dewcatch_scrub',
        ownerKind: 'location',
        ownerId: 'dewcatch_scrub',
        resourceId: 'spirit_herb',
        // Provisional balance (wilderness herb pocket for NPC cultivation pouch).
        initialStock: 6,
        maxStock: 10,
        regenAmount: 1,
        regenPeriodMonths: 2,
        // Player Dewcatch gather yields dust_root / dawn_dew / etc. — not this id.
        playerShared: false,
        notes: 'NPC spirit-herb pocket at Dewcatch. Distinct from player alchemy reagents.'
    }
});

const RESOURCE_SOURCE_ACQUISITION_RETENTION = 80;

/**
 * Institutional procurement channels (PR #210).
 * Separates physical sources from abstract external supply and institutional inventory.
 * Extension points (not implemented): garden, mine, merchant, tribute, market.
 */
const PROCUREMENT_CHANNEL_TYPES = Object.freeze({
    ABSTRACT_EXTERNAL_SUPPLY: 'abstract_external_supply',
    PHYSICAL_SOURCE: 'physical_source',
    CONTROLLED_GARDEN: 'controlled_garden',
    CONTROLLED_MINE: 'controlled_mine',
    MERCHANT: 'merchant',
    TRIBUTE: 'tribute',
    MARKET: 'market'
});

/**
 * Authored institutional procurement schedules.
 * Provisional Well-Ring numbers: recover eventually, but theft leaves a real gap.
 */
const INSTITUTIONAL_PROCUREMENT_DEFS = Object.freeze({
    well_ring_herb_external: {
        id: 'well_ring_herb_external',
        institutionId: 'well_ring_lodge',
        resourceId: 'spirit_herb',
        channelType: PROCUREMENT_CHANNEL_TYPES.ABSTRACT_EXTERNAL_SUPPLY,
        // Not Dewcatch — lodge resupply is an abstract external channel for now.
        physicalSourceId: null,
        destinationKind: 'well_ring_storehouse_herbs',
        destinationId: 'well_ring_storehouse',
        intervalMonths: 4,
        maxPerDelivery: 3,
        destinationCapacity: 24,
        // Optional cost reserved for future institutional budgets — unused here.
        cost: null,
        notes: 'Provisional Redwell market/tribute deliveries into the Well-Ring herb storehouse.'
    }
});

const INSTITUTIONAL_PROCUREMENT_HISTORY_RETENTION = 40;

function cloneResourceSourceRecord(obj) {
    return obj == null ? null : JSON.parse(JSON.stringify(obj));
}

function ensureWorldResourceSourcesRoot() {
    if (typeof G === 'undefined') return null;
    if (!G.world || typeof G.world !== 'object') G.world = {};
    if (!G.world.resourceSources || typeof G.world.resourceSources !== 'object') {
        G.world.resourceSources = {
            version: RESOURCE_SOURCE_VERSION,
            byId: {},
            acquisitions: []
        };
    }
    const root = G.world.resourceSources;
    if (root.version == null) root.version = RESOURCE_SOURCE_VERSION;
    if (!root.byId || typeof root.byId !== 'object') root.byId = {};
    if (!Array.isArray(root.acquisitions)) root.acquisitions = [];
    return root;
}

function resourceSourceNowMonths() {
    return Math.floor((typeof G !== 'undefined' && G.ageMonths != null) ? G.ageMonths : 0);
}

function getResourceSourceDef(sourceId) {
    return RESOURCE_SOURCE_DEFS[sourceId] || null;
}

function getAbstractResourceReward(id) {
    return ABSTRACT_RESOURCE_REWARDS[id] || null;
}

function isAbstractResourceReward(idOrType) {
    if (!idOrType) return false;
    if (idOrType === RESOURCE_SOURCE_TYPES.ABSTRACT_REWARD) return true;
    const abs = ABSTRACT_RESOURCE_REWARDS[idOrType];
    if (abs) return true;
    const live = ensureWorldResourceSourcesRoot()?.byId?.[idOrType];
    return !!(live && live.type === RESOURCE_SOURCE_TYPES.ABSTRACT_REWARD);
}

/**
 * Apply bounded regeneration up to now (idempotent for a given ageMonths).
 * Large skips: periods = floor(elapsed / period); stock clamped to maxStock.
 */
function processResourceSourceRegen(source, nowMonths) {
    if (!source || source.type !== RESOURCE_SOURCE_TYPES.REGENERATING_STOCK) return source;
    const now = Math.floor(nowMonths != null ? nowMonths : resourceSourceNowMonths());
    const period = Math.max(1, Math.floor(Number(source.regenPeriodMonths) || 1));
    const amount = Math.max(0, Math.floor(Number(source.regenAmount) || 0));
    const maxStock = Math.max(0, Math.floor(Number(source.maxStock) || 0));
    let last = source.lastProcessedMonths;
    if (last == null || !Number.isFinite(last)) {
        source.lastProcessedMonths = now;
        return source;
    }
    last = Math.floor(last);
    if (now <= last || amount <= 0 || maxStock <= 0) {
        if (now > last) source.lastProcessedMonths = now;
        return source;
    }
    const elapsed = now - last;
    const periods = Math.floor(elapsed / period);
    if (periods <= 0) return source;
    const stock = Math.max(0, Math.floor(Number(source.stock) || 0));
    source.stock = Math.min(maxStock, stock + periods * amount);
    source.lastProcessedMonths = last + periods * period;
    return source;
}

function ensureResourceSource(sourceId, options) {
    options = options || {};
    const root = ensureWorldResourceSourcesRoot();
    if (!root) return null;
    const def = getResourceSourceDef(sourceId);
    if (!def) return root.byId[sourceId] || null;

    let live = root.byId[sourceId];
    if (!live || typeof live !== 'object') {
        const now = resourceSourceNowMonths();
        live = {
            id: def.id,
            type: def.type,
            locationId: def.locationId || null,
            ownerKind: def.ownerKind || null,
            ownerId: def.ownerId || null,
            resourceId: def.resourceId,
            stock: def.initialStock != null ? def.initialStock : (def.maxStock || 0),
            maxStock: def.maxStock != null ? def.maxStock : null,
            regenAmount: def.regenAmount != null ? def.regenAmount : null,
            regenPeriodMonths: def.regenPeriodMonths != null ? def.regenPeriodMonths : null,
            lastProcessedMonths: now,
            playerShared: !!def.playerShared,
            notes: def.notes || null
        };
        root.byId[sourceId] = live;
    } else {
        if (live.type == null) live.type = def.type;
        if (live.locationId == null) live.locationId = def.locationId || null;
        if (live.ownerKind == null) live.ownerKind = def.ownerKind || null;
        if (live.ownerId == null) live.ownerId = def.ownerId || null;
        if (live.resourceId == null) live.resourceId = def.resourceId;
        if (live.maxStock == null && def.maxStock != null) live.maxStock = def.maxStock;
        if (live.regenAmount == null && def.regenAmount != null) live.regenAmount = def.regenAmount;
        if (live.regenPeriodMonths == null && def.regenPeriodMonths != null) {
            live.regenPeriodMonths = def.regenPeriodMonths;
        }
        if (live.stock == null) {
            live.stock = def.initialStock != null ? def.initialStock : (def.maxStock || 0);
        }
        if (live.lastProcessedMonths == null) live.lastProcessedMonths = resourceSourceNowMonths();
        if (live.playerShared == null) live.playerShared = !!def.playerShared;
    }

    if (!options.skipRegen) processResourceSourceRegen(live, options.nowMonths);
    return live;
}

function ensureAllAuthoredResourceSources(options) {
    const root = ensureWorldResourceSourcesRoot();
    if (!root) return null;
    Object.keys(RESOURCE_SOURCE_DEFS).forEach(id => ensureResourceSource(id, options));
    return root;
}

function migrateResourceSourcesForExistingSave() {
    ensureAllAuthoredResourceSources();
    ensureAllInstitutionalProcurement();
}

// ---------------------------------------------------------------------------
// Institutional procurement (bounded deliveries into institutional inventories)
// ---------------------------------------------------------------------------

function ensureWorldResourceProcurementRoot() {
    if (typeof G === 'undefined') return null;
    if (!G.world || typeof G.world !== 'object') G.world = {};
    if (!G.world.resourceProcurement || typeof G.world.resourceProcurement !== 'object') {
        G.world.resourceProcurement = {
            version: RESOURCE_SOURCE_VERSION,
            byId: {},
            history: []
        };
    }
    const root = G.world.resourceProcurement;
    if (root.version == null) root.version = RESOURCE_SOURCE_VERSION;
    if (!root.byId || typeof root.byId !== 'object') root.byId = {};
    if (!Array.isArray(root.history)) root.history = [];
    return root;
}

function getInstitutionalProcurementDef(procurementId) {
    return INSTITUTIONAL_PROCUREMENT_DEFS[procurementId] || null;
}

function ensureInstitutionalProcurement(procurementId, options) {
    options = options || {};
    const root = ensureWorldResourceProcurementRoot();
    if (!root) return null;
    const def = getInstitutionalProcurementDef(procurementId);
    if (!def) return root.byId[procurementId] || null;

    let live = root.byId[procurementId];
    if (!live || typeof live !== 'object') {
        const now = resourceSourceNowMonths();
        live = {
            id: def.id,
            institutionId: def.institutionId,
            resourceId: def.resourceId,
            channelType: def.channelType,
            physicalSourceId: def.physicalSourceId || null,
            destinationKind: def.destinationKind,
            destinationId: def.destinationId || null,
            intervalMonths: def.intervalMonths,
            maxPerDelivery: def.maxPerDelivery,
            destinationCapacity: def.destinationCapacity,
            cost: def.cost != null ? def.cost : null,
            lastProcessedMonths: now,
            notes: def.notes || null
        };
        root.byId[procurementId] = live;
    } else {
        if (live.institutionId == null) live.institutionId = def.institutionId;
        if (live.resourceId == null) live.resourceId = def.resourceId;
        if (live.channelType == null) live.channelType = def.channelType;
        if (live.destinationKind == null) live.destinationKind = def.destinationKind;
        if (live.destinationId == null) live.destinationId = def.destinationId || null;
        if (live.intervalMonths == null) live.intervalMonths = def.intervalMonths;
        if (live.maxPerDelivery == null) live.maxPerDelivery = def.maxPerDelivery;
        if (live.destinationCapacity == null) live.destinationCapacity = def.destinationCapacity;
        if (live.physicalSourceId === undefined) live.physicalSourceId = def.physicalSourceId || null;
        if (live.cost === undefined) live.cost = def.cost != null ? def.cost : null;
        if (live.lastProcessedMonths == null) live.lastProcessedMonths = resourceSourceNowMonths();
    }

    if (!options.skipProcess) processInstitutionalProcurement(live, options.nowMonths);
    return live;
}

function ensureAllInstitutionalProcurement(options) {
    const root = ensureWorldResourceProcurementRoot();
    if (!root) return null;
    Object.keys(INSTITUTIONAL_PROCUREMENT_DEFS).forEach(id => ensureInstitutionalProcurement(id, options));
    return root;
}

function getInstitutionalProcurement(procurementId, options) {
    const live = ensureInstitutionalProcurement(procurementId, Object.assign({ skipProcess: true }, options || {}));
    return cloneResourceSourceRecord(live);
}

function listInstitutionalProcurement(options) {
    options = options || {};
    ensureAllInstitutionalProcurement(Object.assign({ skipProcess: true }, options));
    const root = ensureWorldResourceProcurementRoot();
    if (!root) return [];
    return Object.values(root.byId)
        .filter(p => {
            if (!p) return false;
            if (options.institutionId && p.institutionId !== options.institutionId) return false;
            if (options.resourceId && p.resourceId !== options.resourceId) return false;
            return true;
        })
        .map(cloneResourceSourceRecord);
}

function readInstitutionalDestinationStock(proc) {
    if (!proc) return { stock: 0, capacity: 0, ok: false, reason: 'no_proc' };
    const capacity = Math.max(0, Math.floor(Number(proc.destinationCapacity) || 0));
    if (proc.destinationKind === 'well_ring_storehouse_herbs') {
        if (typeof ensureWellRingStorehouse !== 'function') {
            return { stock: 0, capacity, ok: false, reason: 'no_storehouse' };
        }
        const sh = ensureWellRingStorehouse();
        if (sh.herbCapacity == null) sh.herbCapacity = capacity;
        const stock = Math.max(0, Math.floor(Number(sh.herbStock) || 0));
        const cap = sh.herbCapacity != null ? Math.max(0, Math.floor(Number(sh.herbCapacity))) : capacity;
        return { stock, capacity: cap, ok: true, storehouse: sh };
    }
    return { stock: 0, capacity, ok: false, reason: 'unknown_destination' };
}

/**
 * Credit institutional inventory only — never invents a wilderness deposit.
 * Abstract external supply creates stock at the institution; physical_source would debit a source (future).
 */
function creditInstitutionalProcurementDestination(proc, amount) {
    const qty = Math.max(0, Math.floor(Number(amount) || 0));
    if (qty <= 0) return { ok: true, credited: 0, reason: 'zero_amount' };
    const dest = readInstitutionalDestinationStock(proc);
    if (!dest.ok) return { ok: false, reason: dest.reason || 'destination_unavailable' };
    const room = Math.max(0, dest.capacity - dest.stock);
    const add = Math.min(qty, room);
    if (add <= 0) {
        return {
            ok: true,
            credited: 0,
            reason: 'capacity_full',
            stockBefore: dest.stock,
            stockAfter: dest.stock,
            capacity: dest.capacity
        };
    }
    if (proc.destinationKind === 'well_ring_storehouse_herbs') {
        dest.storehouse.herbStock = dest.stock + add;
        return {
            ok: true,
            credited: add,
            stockBefore: dest.stock,
            stockAfter: dest.storehouse.herbStock,
            capacity: dest.capacity
        };
    }
    return { ok: false, reason: 'unknown_destination' };
}

function recordInstitutionalProcurementEvent(entry) {
    const root = ensureWorldResourceProcurementRoot();
    if (!root || !entry) return;
    root.history.push({
        id: entry.id || `proc_${resourceSourceNowMonths()}_${root.history.length + 1}`,
        procurementId: entry.procurementId || null,
        institutionId: entry.institutionId || null,
        resourceId: entry.resourceId || null,
        channelType: entry.channelType || null,
        amount: entry.amount || 0,
        reason: entry.reason || 'scheduled',
        atMonths: entry.atMonths != null ? entry.atMonths : resourceSourceNowMonths(),
        stockBefore: entry.stockBefore != null ? entry.stockBefore : null,
        stockAfter: entry.stockAfter != null ? entry.stockAfter : null,
        deliveryKey: entry.deliveryKey || null
    });
    while (root.history.length > INSTITUTIONAL_PROCUREMENT_HISTORY_RETENTION) {
        root.history.shift();
    }
}

function hasInstitutionalProcurementDelivery(deliveryKey) {
    const root = ensureWorldResourceProcurementRoot();
    if (!root || !deliveryKey) return false;
    return (root.history || []).some(h => h && h.deliveryKey === deliveryKey);
}

function listInstitutionalProcurementHistory(options) {
    options = options || {};
    const root = ensureWorldResourceProcurementRoot();
    if (!root) return [];
    return (root.history || [])
        .filter(h => {
            if (!h) return false;
            if (options.procurementId && h.procurementId !== options.procurementId) return false;
            if (options.institutionId && h.institutionId !== options.institutionId) return false;
            if (options.onlyDeliveries && !(h.amount > 0)) return false;
            return true;
        })
        .map(cloneResourceSourceRecord);
}

/**
 * Advance one procurement schedule to nowMonths.
 * Partial intervals preserved; same-time re-entry is a no-op; large skips match stepped periods.
 */
function processInstitutionalProcurement(proc, nowMonths) {
    if (!proc || !proc.id) return { ok: false, reason: 'no_proc' };
    const now = Math.floor(nowMonths != null ? nowMonths : resourceSourceNowMonths());
    const interval = Math.max(1, Math.floor(Number(proc.intervalMonths) || 1));
    const maxPer = Math.max(0, Math.floor(Number(proc.maxPerDelivery) || 0));
    let last = proc.lastProcessedMonths;
    if (last == null || !Number.isFinite(last)) {
        proc.lastProcessedMonths = now;
        return { ok: true, delivered: 0, initialized: true };
    }
    last = Math.floor(last);
    if (now <= last) return { ok: true, delivered: 0, reason: 'same_time' };
    const elapsed = now - last;
    const periods = Math.floor(elapsed / interval);
    if (periods <= 0) return { ok: true, delivered: 0, reason: 'partial_interval' };

    let totalDelivered = 0;
    const events = [];
    for (let i = 0; i < periods; i++) {
        const at = last + (i + 1) * interval;
        const deliveryKey = `procure:${proc.id}:${at}`;
        if (hasInstitutionalProcurementDelivery(deliveryKey)) {
            events.push({ atMonths: at, amount: 0, reason: 'duplicate_delivery', deliveryKey });
            continue;
        }

        // Future physical_source channels would debit here; abstract external does not.
        if (proc.channelType === PROCUREMENT_CHANNEL_TYPES.PHYSICAL_SOURCE && proc.physicalSourceId) {
            events.push({ atMonths: at, amount: 0, reason: 'physical_source_unimplemented', deliveryKey });
            recordInstitutionalProcurementEvent({
                procurementId: proc.id,
                institutionId: proc.institutionId,
                resourceId: proc.resourceId,
                channelType: proc.channelType,
                amount: 0,
                reason: 'physical_source_unimplemented',
                atMonths: at,
                deliveryKey
            });
            continue;
        }

        const destBefore = readInstitutionalDestinationStock(proc);
        const room = destBefore.ok ? Math.max(0, destBefore.capacity - destBefore.stock) : 0;
        const want = Math.min(maxPer, room);
        if (want <= 0) {
            recordInstitutionalProcurementEvent({
                procurementId: proc.id,
                institutionId: proc.institutionId,
                resourceId: proc.resourceId,
                channelType: proc.channelType,
                amount: 0,
                reason: 'capacity_full',
                atMonths: at,
                stockBefore: destBefore.stock,
                stockAfter: destBefore.stock,
                deliveryKey
            });
            events.push({ atMonths: at, amount: 0, reason: 'capacity_full' });
            continue;
        }

        const credit = creditInstitutionalProcurementDestination(proc, want);
        if (!credit.ok) {
            recordInstitutionalProcurementEvent({
                procurementId: proc.id,
                institutionId: proc.institutionId,
                resourceId: proc.resourceId,
                channelType: proc.channelType,
                amount: 0,
                reason: credit.reason || 'credit_failed',
                atMonths: at,
                deliveryKey
            });
            events.push({ atMonths: at, amount: 0, reason: credit.reason || 'credit_failed' });
            continue;
        }

        const credited = credit.credited || 0;
        totalDelivered += credited;
        const reason = credited > 0
            ? (credited < maxPer ? 'scheduled_capacity_limited' : 'scheduled')
            : 'capacity_full';
        recordInstitutionalProcurementEvent({
            procurementId: proc.id,
            institutionId: proc.institutionId,
            resourceId: proc.resourceId,
            channelType: proc.channelType,
            amount: credited,
            reason,
            atMonths: at,
            stockBefore: credit.stockBefore,
            stockAfter: credit.stockAfter,
            deliveryKey
        });
        events.push({ atMonths: at, amount: credited, reason, stockAfter: credit.stockAfter });
    }

    proc.lastProcessedMonths = last + periods * interval;
    return { ok: true, delivered: totalDelivered, periods, events };
}

function tickInstitutionalProcurement(/* deltaMonths */) {
    ensureAllInstitutionalProcurement({ nowMonths: resourceSourceNowMonths() });
    return { ok: true };
}

function inspectInstitutionalProcurementRuntime() {
    ensureAllInstitutionalProcurement({ skipProcess: true });
    return {
        schedules: listInstitutionalProcurement(),
        history: listInstitutionalProcurementHistory(),
        channelTypes: Object.keys(PROCUREMENT_CHANNEL_TYPES)
    };
}

/** Test/developer: set procurement cursor without delivering. */
function debugSetInstitutionalProcurementCursor(procurementId, lastProcessedMonths) {
    const live = ensureInstitutionalProcurement(procurementId, { skipProcess: true });
    if (!live) return { ok: false, reason: 'unknown_procurement' };
    live.lastProcessedMonths = Math.floor(Number(lastProcessedMonths) || 0);
    return { ok: true, lastProcessedMonths: live.lastProcessedMonths };
}

function getResourceSource(sourceId, options) {
    const live = ensureResourceSource(sourceId, options);
    return cloneResourceSourceRecord(live);
}

function getResourceSourceStock(sourceId, options) {
    const live = ensureResourceSource(sourceId, options);
    if (!live) return 0;
    if (live.type === RESOURCE_SOURCE_TYPES.ABSTRACT_REWARD) return null;
    return Math.max(0, Math.floor(Number(live.stock) || 0));
}

function listResourceSources(options) {
    options = options || {};
    ensureAllAuthoredResourceSources(options);
    const root = ensureWorldResourceSourcesRoot();
    if (!root) return [];
    return Object.values(root.byId)
        .filter(s => {
            if (!s) return false;
            if (options.locationId && s.locationId !== options.locationId) return false;
            if (options.resourceId && s.resourceId !== options.resourceId) return false;
            if (options.type && s.type !== options.type) return false;
            return true;
        })
        .map(cloneResourceSourceRecord);
}

function findResourceSourceIdAtLocation(locationId, resourceId) {
    ensureAllAuthoredResourceSources();
    const root = ensureWorldResourceSourcesRoot();
    if (!root) return null;
    const ids = Object.keys(root.byId);
    for (let i = 0; i < ids.length; i++) {
        const s = root.byId[ids[i]];
        if (!s) continue;
        if (s.locationId !== locationId) continue;
        if (resourceId && s.resourceId !== resourceId) continue;
        if (s.type === RESOURCE_SOURCE_TYPES.ABSTRACT_REWARD) continue;
        return s.id;
    }
    // Fall back to authored defs not yet ensured (should not happen after ensureAll)
    const defIds = Object.keys(RESOURCE_SOURCE_DEFS);
    for (let i = 0; i < defIds.length; i++) {
        const d = RESOURCE_SOURCE_DEFS[defIds[i]];
        if (d.locationId === locationId && (!resourceId || d.resourceId === resourceId)) {
            return d.id;
        }
    }
    return null;
}

function recordResourceSourceAcquisition(entry) {
    const root = ensureWorldResourceSourcesRoot();
    if (!root || !entry || !entry.key) return;
    root.acquisitions.push({
        key: entry.key,
        sourceId: entry.sourceId || null,
        amount: entry.amount || 0,
        atMonths: entry.atMonths != null ? entry.atMonths : resourceSourceNowMonths(),
        actorId: entry.actorId || null,
        receiverKind: entry.receiverKind || null
    });
    while (root.acquisitions.length > RESOURCE_SOURCE_ACQUISITION_RETENTION) {
        root.acquisitions.shift();
    }
}

function hasResourceSourceAcquisition(key) {
    const root = ensureWorldResourceSourcesRoot();
    if (!root || !key) return false;
    return (root.acquisitions || []).some(a => a && a.key === key);
}

/**
 * Credit adapters — do not replace inventory systems; bridge into existing pouches/mats.
 * @returns {{ ok: boolean, credited?: number, reason?: string, before?: number, after?: number }}
 */
function creditResourceReceiver(receiver, amount, meta) {
    meta = meta || {};
    const qty = Math.max(0, Math.floor(Number(amount) || 0));
    if (qty <= 0) return { ok: false, reason: 'zero_amount' };
    if (!receiver || typeof receiver !== 'object') return { ok: false, reason: 'no_receiver' };

    if (receiver.kind === 'npc_spirit_herbs' || receiver.kind === 'npc_pouch') {
        if (typeof adjustNpcSpiritHerbs !== 'function') {
            return { ok: false, reason: 'no_npc_pouch_adapter' };
        }
        const actorId = receiver.actorId;
        if (!actorId) return { ok: false, reason: 'no_actor' };
        const before = typeof getNpcSpiritHerbs === 'function' ? getNpcSpiritHerbs(actorId) : 0;
        const after = adjustNpcSpiritHerbs(actorId, qty);
        if (after == null) return { ok: false, reason: 'actor_unavailable' };
        return { ok: true, credited: qty, before, after };
    }

    if (receiver.kind === 'player_craft_material') {
        if (typeof addCraftMaterial !== 'function') return { ok: false, reason: 'no_craft_adapter' };
        const matId = receiver.materialId || meta.resourceId;
        if (!matId) return { ok: false, reason: 'no_material_id' };
        const okAdd = addCraftMaterial(matId, qty);
        if (!okAdd) return { ok: false, reason: 'craft_add_failed' };
        return { ok: true, credited: qty };
    }

    if (receiver.kind === 'player_alchemy_material') {
        if (typeof addAlchemyMaterial !== 'function') return { ok: false, reason: 'no_alchemy_adapter' };
        const matId = receiver.materialId || meta.resourceId;
        if (!matId) return { ok: false, reason: 'no_material_id' };
        if (typeof ensureAlchemyState === 'function') ensureAlchemyState();
        const okAdd = addAlchemyMaterial(matId, qty);
        if (!okAdd) return { ok: false, reason: 'alchemy_add_failed' };
        return { ok: true, credited: qty };
    }

    if (typeof receiver.credit === 'function') {
        const result = receiver.credit(qty, meta);
        if (result && result.ok === false) return result;
        return { ok: true, credited: qty, detail: result };
    }

    return { ok: false, reason: 'unknown_receiver' };
}

/**
 * All-or-nothing extraction from a stocked source, then single credit to receiver.
 * Abstract sources are rejected here — use grantAbstractResourceReward instead.
 */
function transferFromResourceSource(spec) {
    spec = spec || {};
    const sourceId = spec.sourceId;
    const amount = Math.max(1, Math.floor(Number(spec.amount) || 1));
    const resourceId = spec.resourceId || null;
    const acquisitionKey = spec.acquisitionKey || null;

    if (!sourceId) {
        return { ok: false, reason: 'no_source', stockUnchanged: true };
    }
    if (acquisitionKey && hasResourceSourceAcquisition(acquisitionKey)) {
        return { ok: false, reason: 'duplicate_acquisition', acquisitionKey, stockUnchanged: true };
    }

    const live = ensureResourceSource(sourceId, { nowMonths: spec.nowMonths });
    if (!live) {
        return { ok: false, reason: 'unknown_source', stockUnchanged: true };
    }
    if (live.type === RESOURCE_SOURCE_TYPES.ABSTRACT_REWARD) {
        return { ok: false, reason: 'abstract_not_transferable', stockUnchanged: true };
    }
    if (resourceId && live.resourceId !== resourceId) {
        return { ok: false, reason: 'resource_mismatch', expected: live.resourceId, got: resourceId, stockUnchanged: true };
    }

    if (spec.requireLocationId) {
        const present = typeof isNpcPhysicallyPresentAt === 'function'
            ? isNpcPhysicallyPresentAt(spec.actorId || spec.npc, spec.requireLocationId)
            : true;
        if (!present) {
            return {
                ok: false,
                reason: 'not_present',
                locationId: spec.requireLocationId,
                stockUnchanged: true
            };
        }
    }

    const available = Math.max(0, Math.floor(Number(live.stock) || 0));
    if (available < amount) {
        return {
            ok: false,
            reason: 'insufficient_stock',
            stock: available,
            need: amount,
            stockUnchanged: true
        };
    }

    // Debit first; credit exactly once; restore stock if credit fails.
    live.stock = available - amount;
    const credit = creditResourceReceiver(spec.receiver, amount, {
        resourceId: live.resourceId,
        sourceId,
        actorId: spec.actorId || null
    });
    if (!credit.ok) {
        live.stock = available;
        return {
            ok: false,
            reason: credit.reason || 'credit_failed',
            stock: available,
            stockUnchanged: true,
            credit
        };
    }

    if (acquisitionKey) {
        recordResourceSourceAcquisition({
            key: acquisitionKey,
            sourceId,
            amount,
            actorId: spec.actorId || null,
            receiverKind: spec.receiver && spec.receiver.kind,
            atMonths: resourceSourceNowMonths()
        });
    }

    return {
        ok: true,
        sourceId,
        resourceId: live.resourceId,
        amount,
        stockBefore: available,
        stockAfter: live.stock,
        credit,
        acquisitionKey: acquisitionKey || null
    };
}

/**
 * Explicit abstract grant — never touches location stock.
 * Still uses acquisition keys / single credit when provided.
 */
function grantAbstractResourceReward(spec) {
    spec = spec || {};
    const abstractId = spec.abstractId || null;
    const amount = Math.max(0, Math.floor(Number(spec.amount) || 0));
    const acquisitionKey = spec.acquisitionKey || null;
    if (abstractId && !getAbstractResourceReward(abstractId) && !isAbstractResourceReward(abstractId)) {
        return { ok: false, reason: 'unknown_abstract', stockUnchanged: true };
    }
    if (acquisitionKey && hasResourceSourceAcquisition(acquisitionKey)) {
        return { ok: false, reason: 'duplicate_acquisition', acquisitionKey, stockUnchanged: true };
    }
    if (amount <= 0) {
        return { ok: true, amount: 0, abstract: true, credit: null };
    }
    const credit = creditResourceReceiver(spec.receiver, amount, {
        resourceId: spec.resourceId || (getAbstractResourceReward(abstractId) || {}).resourceId,
        abstractId
    });
    if (!credit.ok) {
        return { ok: false, reason: credit.reason || 'credit_failed', stockUnchanged: true, credit };
    }
    if (acquisitionKey) {
        recordResourceSourceAcquisition({
            key: acquisitionKey,
            sourceId: abstractId || 'abstract',
            amount,
            actorId: spec.actorId || null,
            receiverKind: spec.receiver && spec.receiver.kind
        });
    }
    return { ok: true, amount, abstract: true, abstractId, credit, acquisitionKey: acquisitionKey || null };
}

/** World-tick: advance regenerating sources without inventing new stock beyond max. */
function tickResourceSources(/* deltaMonths */) {
    ensureAllAuthoredResourceSources({ nowMonths: resourceSourceNowMonths() });
    return { ok: true };
}

function inspectResourceSourcesRuntime() {
    ensureAllAuthoredResourceSources();
    const root = ensureWorldResourceSourcesRoot();
    return {
        version: root?.version,
        sources: listResourceSources(),
        acquisitions: (root?.acquisitions || []).slice(),
        abstractRewards: Object.keys(ABSTRACT_RESOURCE_REWARDS)
    };
}

/** Test/developer: set stock without going through transfer. */
function debugSetResourceSourceStock(sourceId, stock) {
    const live = ensureResourceSource(sourceId, { skipRegen: true });
    if (!live) return { ok: false, reason: 'unknown_source' };
    const max = live.maxStock != null ? Math.floor(Number(live.maxStock)) : null;
    let next = Math.max(0, Math.floor(Number(stock) || 0));
    if (max != null) next = Math.min(max, next);
    live.stock = next;
    return { ok: true, stock: live.stock };
}

if (typeof registerWorldTick === 'function') {
    registerWorldTick('resourceSources', (delta) => {
        tickResourceSources(delta);
    }, 43);
    registerWorldTick('institutionalProcurement', (delta) => {
        tickInstitutionalProcurement(delta);
    }, 42);
}
