// ============================================
// WORLD-FORMATIONS.JS — Persistent world installations
// Thin registry of physical formation installs owned by institutions/NPCs.
// Reuses FORMATIONS defs + slot-shaped operating state from formations.js.
// First install: Well-Ring Lodge courtyard Spirit Gathering (ambient-powered).
// ============================================

const WORLD_FORMATION_INSTALL_WELL_RING_GATHER = 'wr_courtyard_spirit_gathering';

const WORLD_FORMATION_WELL_RING_GATHER_DEF = {
    id: WORLD_FORMATION_INSTALL_WELL_RING_GATHER,
    formationId: 'spirit_gathering',
    locationId: 'redwell',
    siteLabel: 'Well-Ring meditation court',
    ownerKind: 'institution',
    ownerId: 'well_ring_lodge',
    powerMode: 'ambient',
    /** Starting integrity — Sharp band, but not pristine immortal work. */
    initialIntegrity: 88,
    initialActive: true,
    /**
     * Lore: unresolved. No Redwell grandmaster is implied.
     * Possibilities: second-hand diagram, visiting artisan, or an outer who left.
     */
    originUnresolved: true
};

let _ensuringWorldFormations = false;

function ensureWorldFormationsState() {
    if (_ensuringWorldFormations) return G.worldFormations;
    _ensuringWorldFormations = true;
    try {
        if (!G.worldFormations || typeof G.worldFormations !== 'object') {
            G.worldFormations = { version: 1, byId: {} };
        }
        if (G.worldFormations.version == null) G.worldFormations.version = 1;
        if (!G.worldFormations.byId || typeof G.worldFormations.byId !== 'object') {
            G.worldFormations.byId = {};
        }
        ensureWellRingLodgeWorldFormation();
        return G.worldFormations;
    } finally {
        _ensuringWorldFormations = false;
    }
}

function getWorldFormationInstallation(installId) {
    ensureWorldFormationsState();
    return G.worldFormations.byId[installId] || null;
}

function listWorldFormationInstallations(filter) {
    ensureWorldFormationsState();
    const all = Object.values(G.worldFormations.byId || {});
    if (!filter) return all;
    return all.filter(inst => {
        if (filter.ownerId && inst.ownerId !== filter.ownerId) return false;
        if (filter.locationId && inst.locationId !== filter.locationId) return false;
        if (filter.ownerKind && inst.ownerKind !== filter.ownerKind) return false;
        return true;
    });
}

/**
 * Normalize operating fields onto a world installation (same shape as residence slots).
 * Does not invent a second copy of the pattern — only runtime state.
 */
function normalizeWorldFormationInstallation(raw, seed) {
    if (!raw || typeof raw !== 'object') return null;
    const formationId = raw.formationId || seed?.formationId;
    const def = typeof getFormationDef === 'function' ? getFormationDef(formationId) : null;
    if (!def || def.implemented === false) return null;

    const cfg = typeof getFormationF1aConfig === 'function'
        ? getFormationF1aConfig()
        : { integrityMax: 100 };

    const integrityMax = cfg.integrityMax || 100;
    let integrity = Number(raw.integrity);
    if (!Number.isFinite(integrity)) integrity = seed?.initialIntegrity ?? integrityMax;
    integrity = Math.max(0, Math.min(integrityMax, integrity));
    const scattered = !!raw.scattered || integrity <= 0;
    const powerMode = raw.powerMode || seed?.powerMode || 'stones';

    let fuel = Number(raw.fuel);
    if (!Number.isFinite(fuel)) {
        fuel = powerMode === 'ambient'
            ? 0
            : (typeof getFormationLayFuel === 'function' ? getFormationLayFuel(def) : 6);
    }
    if (powerMode === 'ambient') fuel = 0;

    let active = scattered ? false : (raw.active != null ? !!raw.active : !!seed?.initialActive);
    if (scattered) active = false;

    return {
        id: raw.id || seed?.id,
        formationId,
        locationId: raw.locationId || seed?.locationId || null,
        siteLabel: raw.siteLabel || seed?.siteLabel || null,
        ownerKind: raw.ownerKind || seed?.ownerKind || null,
        ownerId: raw.ownerId || seed?.ownerId || null,
        powerMode,
        active,
        fuel: Math.max(0, fuel),
        integrity: scattered ? 0 : integrity,
        scattered,
        originUnresolved: raw.originUnresolved != null
            ? !!raw.originUnresolved
            : !!seed?.originUnresolved
    };
}

/**
 * Idempotent Well-Ring courtyard gather. Single authoritative record in G.worldFormations.byId.
 * Lodge org only stores the installation id pointer — never a second slot copy.
 */
function ensureWellRingLodgeWorldFormation() {
    if (typeof G === 'undefined') return null;
    if (!G.worldFormations || typeof G.worldFormations !== 'object') {
        G.worldFormations = { version: 1, byId: {} };
    }
    if (!G.worldFormations.byId) G.worldFormations.byId = {};

    const seed = WORLD_FORMATION_WELL_RING_GATHER_DEF;
    const existing = G.worldFormations.byId[seed.id];
    if (existing && typeof existing === 'object') {
        // Preserve object identity + operating state across ensures.
        if (!existing.formationId) existing.formationId = seed.formationId;
        if (!existing.locationId) existing.locationId = seed.locationId;
        if (!existing.siteLabel) existing.siteLabel = seed.siteLabel;
        if (!existing.ownerKind) existing.ownerKind = seed.ownerKind;
        if (!existing.ownerId) existing.ownerId = seed.ownerId;
        if (!existing.powerMode) existing.powerMode = seed.powerMode;
        if (existing.originUnresolved == null) existing.originUnresolved = true;
        if (existing.scattered || existing.integrity <= 0) {
            existing.scattered = true;
            existing.integrity = 0;
            existing.active = false;
        }
        if (existing.powerMode === 'ambient') existing.fuel = 0;
    } else {
        const normalized = normalizeWorldFormationInstallation({
            id: seed.id,
            formationId: seed.formationId,
            locationId: seed.locationId,
            siteLabel: seed.siteLabel,
            ownerKind: seed.ownerKind,
            ownerId: seed.ownerId,
            powerMode: seed.powerMode,
            active: seed.initialActive,
            integrity: seed.initialIntegrity,
            fuel: 0,
            scattered: false,
            originUnresolved: true
        }, seed);
        if (!normalized) return null;
        G.worldFormations.byId[seed.id] = normalized;
    }

    // Soft pointer on lodge org — ids only.
    if (G.wellRing?.lodge) {
        if (!Array.isArray(G.wellRing.lodge.formationInstallIds)) {
            G.wellRing.lodge.formationInstallIds = [];
        }
        if (!G.wellRing.lodge.formationInstallIds.includes(seed.id)) {
            G.wellRing.lodge.formationInstallIds.push(seed.id);
        }
    }
    return G.worldFormations.byId[seed.id];
}

/**
 * Effect multiplier for a world install.
 * Ambient: active + integrity band (no fuel). Stones: same rules as residence slots.
 */
function getWorldFormationEffectMult(inst) {
    if (!inst || inst.scattered || inst.integrity <= 0) return 0;
    if (!inst.active) return 0;
    if (inst.powerMode === 'ambient') {
        const cfg = typeof getFormationF1aConfig === 'function'
            ? getFormationF1aConfig()
            : { effectMult: { sharp: 1, fading: 0.55, decayed: 0.2, scattered: 0 }, bands: { sharp: 70, fading: 35 } };
        const band = typeof getFormationIntegrityBand === 'function'
            ? getFormationIntegrityBand(inst.integrity)
            : (inst.integrity >= 70 ? 'sharp' : inst.integrity >= 35 ? 'fading' : 'decayed');
        return cfg.effectMult[band] ?? 0;
    }
    if (typeof getFormationEffectMultForSlot === 'function') {
        return getFormationEffectMultForSlot(inst);
    }
    return 0;
}

function isWorldFormationRunning(inst) {
    return getWorldFormationEffectMult(inst) > 0;
}

function getWorldFormationCultivatePct(inst) {
    if (!isWorldFormationRunning(inst)) return 0;
    const def = typeof getFormationDef === 'function' ? getFormationDef(inst.formationId) : null;
    const base = def?.effects?.cultivatePct || 0;
    const mult = getWorldFormationEffectMult(inst);
    return Math.round(base * mult * 10) / 10;
}

function getWellRingLodgeFormationInstallation() {
    ensureWorldFormationsState();
    return getWorldFormationInstallation(WORLD_FORMATION_INSTALL_WELL_RING_GATHER);
}

function getWellRingLodgeFormationCultivateMult() {
    const inst = getWellRingLodgeFormationInstallation();
    const pct = getWorldFormationCultivatePct(inst);
    return 1 + (pct || 0) / 100;
}

/**
 * NPC eligibility: living Well-Ring affiliate physically at lodge HQ.
 */
function isNpcEligibleForWellRingLodgeFormation(npc) {
    if (!npc || npc.alive === false) return false;
    const lodgeId = typeof WELL_RING_LODGE_ID !== 'undefined' ? WELL_RING_LODGE_ID : 'well_ring_lodge';
    if (npc.affiliationId !== lodgeId) return false;
    const home = typeof WELL_RING_HOME_LOCATION_ID !== 'undefined'
        ? WELL_RING_HOME_LOCATION_ID
        : 'redwell';
    if (typeof isNpcPhysicallyPresentAt === 'function') {
        return isNpcPhysicallyPresentAt(npc, home);
    }
    if (typeof isWellRingCastNpcPresent === 'function') {
        return isWellRingCastNpcPresent(npc, home);
    }
    if (npc.travel && (npc.travel.state === 'travelling' || npc.travel.enRoute)) return false;
    return (npc.homeLocationId || home) === home;
}

/**
 * Local cultivate support for an NPC — Well-Ring gather only when eligible + running.
 * Returns 1 when inapplicable (no global soup).
 */
function getNpcLocalFormationCultivateMult(npc) {
    if (!isNpcEligibleForWellRingLodgeFormation(npc)) return 1;
    return getWellRingLodgeFormationCultivateMult();
}

/**
 * Player: Well-Ring member at Redwell while the lodge court pattern is running.
 */
function getPlayerWellRingLodgeFormationCultivateMult() {
    if (typeof isWellRingMember === 'function' && !isWellRingMember()) return 1;
    if (typeof isAtRedwell === 'function' && !isAtRedwell()) return 1;
    const loc = typeof getCurrentLocationId === 'function' ? getCurrentLocationId() : G.currentLocation;
    if (loc && loc !== 'redwell') return 1;
    return getWellRingLodgeFormationCultivateMult();
}

/**
 * Observable description for visitors at the lodge — no exact counters.
 */
function getWellRingLodgeFormationObservationLine() {
    const inst = getWellRingLodgeFormationInstallation();
    if (!inst) return '';
    if (inst.scattered || inst.integrity <= 0) {
        return 'In the meditation court the old gather lines have scattered — bare flagstones, no draw.';
    }
    if (!inst.active) {
        return 'A quiet Spirit Gathering diagram lies inscribed around the meditation court — the switch is dark.';
    }
    if (inst.powerMode !== 'ambient' && (inst.fuel || 0) <= 0) {
        return 'The court formation is switched on but starved — no qi walks the lines.';
    }
    const band = typeof getFormationIntegrityBand === 'function'
        ? getFormationIntegrityBand(inst.integrity)
        : 'sharp';
    if (band === 'sharp') {
        return 'A modest Spirit Gathering pattern hums around the meditation court — ambient qi leaning inward.';
    }
    if (band === 'fading') {
        return 'The court\'s gather formation still pulls a little, but the inscriptions look worn.';
    }
    return 'Faded gather lines cling to the meditation court — barely holding a thin draw.';
}

/**
 * Monthly lifecycle for world installs. Ambient: integrity neglect only (no stone burn).
 * Stones: integrity + fuel burn. No auto-refill. No FI grants to the player.
 */
function tickWorldFormationInstallations(monthsPassed) {
    if (!monthsPassed || monthsPassed <= 0) return;
    ensureWorldFormationsState();
    const cfg = typeof getFormationF1aConfig === 'function'
        ? getFormationF1aConfig()
        : { integrityDecayPerMonth: 1, integrityMax: 100 };
    const decay = cfg.integrityDecayPerMonth || 1;

    Object.keys(G.worldFormations.byId || {}).forEach(id => {
        const inst = G.worldFormations.byId[id];
        if (!inst) return;
        const def = typeof getFormationDef === 'function' ? getFormationDef(inst.formationId) : null;
        if (!def) return;

        if (inst.scattered || inst.integrity <= 0) {
            inst.scattered = true;
            inst.integrity = 0;
            inst.active = false;
            return;
        }

        inst.integrity = Math.max(0, inst.integrity - decay * monthsPassed);
        if (inst.integrity <= 0) {
            inst.integrity = 0;
            inst.scattered = true;
            inst.active = false;
            return;
        }

        if (inst.powerMode === 'ambient') {
            // Ambient: no spirit-stone consumption. Fuel stays 0.
            inst.fuel = 0;
            return;
        }

        if (inst.active) {
            const burn = (typeof getFormationFuelPerMonth === 'function'
                ? getFormationFuelPerMonth(def)
                : (def.fuelPerMonth || 1)) * monthsPassed;
            if (burn > 0 && inst.fuel > 0) {
                inst.fuel = Math.max(0, inst.fuel - burn);
            }
        }
    });
}

function setWorldFormationActive(installId, active) {
    const inst = getWorldFormationInstallation(installId);
    if (!inst) return { success: false, message: 'Unknown installation.' };
    if (inst.scattered || inst.integrity <= 0) {
        return { success: false, message: 'Pattern is scattered.' };
    }
    if (active && inst.powerMode !== 'ambient' && (inst.fuel || 0) <= 0) {
        return { success: false, message: 'No fuel.' };
    }
    inst.active = !!active;
    return { success: true, message: active ? 'Activated.' : 'Shut down.' };
}

function migrateWorldFormationsForExistingSave() {
    ensureWorldFormationsState();
}

if (typeof registerWorldTick === 'function') {
    // Before worldNpcs growth (40) so growth sees current operating state.
    registerWorldTick('worldFormations', (delta) => {
        tickWorldFormationInstallations(delta);
    }, 38);
}
