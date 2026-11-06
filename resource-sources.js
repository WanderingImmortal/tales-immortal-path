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
}
