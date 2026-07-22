// ============================================
// FORMATIONS.JS — Residence formations (F1a + F1b)
// F1a: fuel + activation + integrity
// F1b: shelf + decipher + master tier stub 0–2
// ============================================

function getFormationF1aConfig() {
    return typeof FORMATION_F1A !== 'undefined' ? FORMATION_F1A : {
        stonePerFuel: 1,
        defaultFuelCapacity: 24,
        defaultFuelPerMonth: 1,
        defaultLayFuel: 6,
        integrityDecayPerMonth: 1,
        integrityMax: 100,
        bands: { sharp: 70, fading: 35 },
        effectMult: { sharp: 1, fading: 0.55, decayed: 0.2, scattered: 0 },
        maintain: { stones: 4, materials: { spirit_herb: 1 }, months: 1, restore: 35 },
        fuelPresets: [3, 6, 12]
    };
}

function getFormationF1bConfig() {
    return typeof FORMATION_F1B !== 'undefined' ? FORMATION_F1B : {
        decipherMonthsByTier: { 1: 2, 2: 3, 3: 4 },
        decipherStonesByTier: { 1: 6, 2: 14, 3: 28 },
        masterTitles: { 0: 'Uninitiated', 1: 'Pattern Student', 2: 'Inscriber', 3: 'Formation Adept' }
    };
}

function ensureFormationState() {
    if (!G.knownFormations) G.knownFormations = [];
    if (!G.formationShelf || typeof G.formationShelf !== 'object') G.formationShelf = {};
    if (!G.formationMaster || typeof G.formationMaster !== 'object') {
        G.formationMaster = { tier: 0, insight: 0 };
    }
    if (G.formationMaster.tier == null) G.formationMaster.tier = 0;
    if (G.formationMaster.insight == null) G.formationMaster.insight = 0;
    ensureSectState();
    if (!G.sect.residence) {
        G.sect.residence = { level: 0, stash: [], lastRestMonths: null, formations: { slots: [] } };
    }
    if (!G.sect.residence.formations) G.sect.residence.formations = { slots: [] };
    if (!Array.isArray(G.sect.residence.formations.slots)) {
        G.sect.residence.formations.slots = [];
    }
    migrateKnownFormationsToShelf();
    ensureResidenceFormationSlots();
    ensureAllSectFormationAnchors();
}

function migrateKnownFormationsToShelf() {
    if (!Array.isArray(G.knownFormations)) G.knownFormations = [];
    G.knownFormations.forEach(id => {
        const def = getFormationDef(id);
        if (!def || def.implemented === false) return;
        if (!G.formationShelf[id]) {
            G.formationShelf[id] = {
                formationId: id,
                source: 'migrated',
                deciphered: true,
                manualCondition: 'intact'
            };
        } else if (!G.formationShelf[id].deciphered) {
            G.formationShelf[id].deciphered = true;
        }
        const need = def.formationTier || 1;
        if ((G.formationMaster.tier || 0) < need) G.formationMaster.tier = need;
    });
    syncKnownFormationsFromShelf();
}

function syncKnownFormationsFromShelf() {
    const deciphered = Object.values(G.formationShelf || {})
        .filter(e => e && e.deciphered && getFormationDef(e.formationId))
        .map(e => e.formationId);
    G.knownFormations = [...new Set(deciphered)];
}

function migrateFormationsForExistingSave() {
    ensureFormationState();
    const residenceLv = typeof getResidenceLevel === 'function' ? getResidenceLevel() : (G.sect?.residence?.level || 0);
    for (let lv = 1; lv <= residenceLv; lv++) {
        grantStarterFormationManualForResidenceLevel(lv, { silent: true });
    }
    ensureResidenceFormationSlots();
}

function getFormationDef(formationId) {
    return typeof FORMATIONS !== 'undefined' ? FORMATIONS[formationId] : null;
}

function getFormationMasterTier() {
    ensureFormationState();
    return G.formationMaster.tier || 0;
}

function getFormationMasterTitle(tier) {
    const cfg = getFormationF1bConfig();
    const t = tier != null ? tier : getFormationMasterTier();
    return cfg.masterTitles[t] || `Tier ${t}`;
}

function getFormationShelfEntry(formationId) {
    ensureFormationState();
    return G.formationShelf[formationId] || null;
}

function isFormationDeciphered(formationId) {
    return !!getFormationShelfEntry(formationId)?.deciphered;
}

/** True if the blueprint is deciphered and master tier allows its formation tier. */
function knowsFormation(formationId) {
    const def = getFormationDef(formationId);
    if (!def || def.implemented === false) return false;
    if (!isFormationDeciphered(formationId)) return false;
    const need = def.formationTier || 1;
    return getFormationMasterTier() >= need;
}

function learnFormation(formationId, options) {
    // Backward-compatible: treat as granting a deciphered manual (legacy callers / tests).
    return grantFormationManual(formationId, {
        silent: !!options?.silent,
        deciphered: true,
        source: options?.source || 'learn'
    });
}

/**
 * Put a formation manual on the personal shelf (unread or deciphered).
 * Not gated on founding a sect.
 */
function grantFormationManual(formationId, options) {
    ensureFormationState();
    const def = getFormationDef(formationId);
    if (!def || def.implemented === false) return false;
    const deciphered = !!options?.deciphered;
    const existing = G.formationShelf[formationId];
    if (existing) {
        if (deciphered && !existing.deciphered) {
            existing.deciphered = true;
            syncKnownFormationsFromShelf();
            if (!options?.silent) {
                addLog(`📜 ${def.emoji} ${def.name} diagram clarified on your shelf.`);
            }
            return true;
        }
        if (!options?.silent) {
            addLog(`📜 You already keep a copy of ${def.name}.`);
        }
        return false;
    }
    G.formationShelf[formationId] = {
        formationId,
        source: options?.source || 'unknown',
        deciphered,
        manualCondition: options?.manualCondition || 'intact'
    };
    if (deciphered) {
        syncKnownFormationsFromShelf();
        const need = def.formationTier || 1;
        if (getFormationMasterTier() < need) G.formationMaster.tier = need;
    }
    if (!options?.silent) {
        if (deciphered) {
            addLog(`📜 Formation diagram mastered: ${def.emoji} ${def.name}.`);
        } else {
            addLog(`📜 Unread formation manual shelved: ${def.emoji} ${def.name}. Decipher it at your residence.`);
        }
    }
    return true;
}

/** F1b: only the unread starter gather — not a free catalog. */
function grantStarterFormationManualForResidenceLevel(level, options) {
    if (typeof FORMATIONS === 'undefined') return;
    Object.values(FORMATIONS).forEach(def => {
        if (def.implemented === false) return;
        if (def.starterUnreadOnResidenceLevel === level) {
            grantFormationManual(def.id, {
                silent: !!options?.silent,
                deciphered: false,
                source: 'residence_starter'
            });
        }
    });
}

/** @deprecated Use grantStarterFormationManualForResidenceLevel — kept for old call sites. */
function grantFormationsForResidenceLevel(level, options) {
    grantStarterFormationManualForResidenceLevel(level, options);
}

function getDecipherFormationMonths(def) {
    const cfg = getFormationF1bConfig();
    const tier = def?.formationTier || 1;
    return cfg.decipherMonthsByTier[tier] ?? cfg.decipherMonthsByTier[1] ?? 2;
}

function getDecipherFormationStones(def) {
    const cfg = getFormationF1bConfig();
    const tier = def?.formationTier || 1;
    return cfg.decipherStonesByTier[tier] ?? cfg.decipherStonesByTier[1] ?? 6;
}

function getDecipherFormationBlockReason(formationId) {
    ensureFormationState();
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'You cannot study formations right now.';
    if (G.inCombat) return 'Cannot decipher during combat.';
    const def = getFormationDef(formationId);
    if (!def) return 'Unknown formation.';
    if (def.implemented === false) return `${def.name} is not yet available.`;
    const entry = getFormationShelfEntry(formationId);
    if (!entry) return 'No manual of this pattern on your shelf.';
    if (entry.deciphered) return 'Already deciphered.';
    const stones = getDecipherFormationStones(def);
    if ((G.stones || 0) < stones) return `Need ${stones} Spirit Stones to focus the diagram.`;
    return null;
}

/**
 * Study an unread shelf manual at residence (or anywhere personal — not sect-gated).
 * Completing decipher sets deciphered and raises master tier to the diagram's formation tier (F1b thin promotion).
 */
function decipherFormation(formationId) {
    const block = getDecipherFormationBlockReason(formationId);
    if (block) return { success: false, message: block };
    const def = getFormationDef(formationId);
    const entry = getFormationShelfEntry(formationId);
    const months = getDecipherFormationMonths(def);
    const stones = getDecipherFormationStones(def);
    G.stones -= stones;
    if (!advanceTime(months, `Deciphering ${def.name}`)) {
        G.stones += stones;
        return { success: false, message: 'Your lifespan ends before the diagram yields.' };
    }
    entry.deciphered = true;
    syncKnownFormationsFromShelf();
    const need = def.formationTier || 1;
    const beforeTier = getFormationMasterTier();
    if (beforeTier < need) G.formationMaster.tier = need;
    const promoted = getFormationMasterTier() > beforeTier;
    const title = getFormationMasterTitle();
    let msg = `${def.emoji} ${def.name} deciphered — the lines are readable.`;
    if (promoted) msg += ` Formation Master: ${title} (tier ${getFormationMasterTier()}).`;
    return { success: true, message: msg };
}

function getResidenceFormationSlotCount() {
    const lv = G.sect?.residence?.level || 0;
    const table = SECT_RESIDENCE?.formationSlotsByLevel;
    if (Array.isArray(table) && table[lv] != null) return table[lv];
    return Math.max(0, lv);
}

function getFormationFuelCapacity(def) {
    const cfg = getFormationF1aConfig();
    return def?.fuelCapacity ?? cfg.defaultFuelCapacity;
}

function getFormationFuelPerMonth(def) {
    const cfg = getFormationF1aConfig();
    return def?.fuelPerMonth ?? cfg.defaultFuelPerMonth;
}

function getFormationLayFuel(def) {
    const cfg = getFormationF1aConfig();
    return def?.layFuel ?? cfg.defaultLayFuel;
}

function createResidenceFormationSlotState(formationId, options) {
    const def = getFormationDef(formationId);
    const cfg = getFormationF1aConfig();
    const capacity = getFormationFuelCapacity(def);
    const fuel = Math.min(capacity, options?.fuel ?? getFormationLayFuel(def));
    let active;
    if (options?.active != null) active = !!options.active;
    else if (def?.defaultActiveOnLay === false) active = false;
    else active = fuel > 0;
    return {
        id: formationId,
        active,
        fuel: Math.max(0, fuel),
        integrity: options?.integrity != null ? options.integrity : cfg.integrityMax,
        scattered: !!options?.scattered
    };
}

/** Normalize legacy string slot ids → F1a slot objects. */
function normalizeResidenceFormationSlot(raw) {
    if (!raw) return null;
    if (typeof raw === 'string') {
        const def = getFormationDef(raw);
        if (!def || def.implemented === false) return null;
        // Existing saves: keep running so courtyard buffs are not silently gutted.
        return createResidenceFormationSlotState(raw, {
            active: true,
            fuel: getFormationLayFuel(def),
            integrity: getFormationF1aConfig().integrityMax
        });
    }
    if (typeof raw === 'object' && raw.id) {
        const def = getFormationDef(raw.id);
        if (!def || def.implemented === false) return null;
        const cfg = getFormationF1aConfig();
        const capacity = getFormationFuelCapacity(def);
        const integrity = Math.max(0, Math.min(cfg.integrityMax, Number(raw.integrity) || 0));
        const scattered = !!raw.scattered || integrity <= 0;
        return {
            id: raw.id,
            active: scattered ? false : !!raw.active,
            fuel: Math.max(0, Math.min(capacity, Number(raw.fuel) || 0)),
            integrity: scattered ? 0 : integrity,
            scattered
        };
    }
    return null;
}

function getResidenceFormationSlot(slotIndex) {
    ensureResidenceFormationSlots();
    return G.sect.residence.formations.slots[slotIndex] || null;
}

function getResidenceFormationSlotId(slot) {
    if (!slot) return null;
    if (typeof slot === 'string') return slot;
    return slot.id || null;
}

function ensureResidenceFormationSlots() {
    const max = getResidenceFormationSlotCount();
    const slots = G.sect.residence.formations.slots;
    while (slots.length < max) slots.push(null);
    while (slots.length > max) slots.pop();
    const known = G.knownFormations || [];
    for (let i = 0; i < slots.length; i++) {
        const normalized = normalizeResidenceFormationSlot(slots[i]);
        if (normalized && !known.includes(normalized.id)) {
            slots[i] = null;
        } else {
            slots[i] = normalized;
        }
    }
}

function getLaidResidenceFormations() {
    ensureResidenceFormationSlots();
    return G.sect.residence.formations.slots
        .map(slot => getResidenceFormationSlotId(slot))
        .filter(id => id && getFormationDef(id));
}

function getFormationIntegrityBand(integrity) {
    const cfg = getFormationF1aConfig();
    if (integrity <= 0) return 'scattered';
    if (integrity >= cfg.bands.sharp) return 'sharp';
    if (integrity >= cfg.bands.fading) return 'fading';
    return 'decayed';
}

function getFormationIntegrityLabel(band) {
    if (band === 'sharp') return 'Sharp';
    if (band === 'fading') return 'Fading';
    if (band === 'decayed') return 'Decayed';
    return 'Scattered';
}

function getFormationEffectMultForSlot(slot) {
    if (!slot || slot.scattered || slot.integrity <= 0) return 0;
    if (!slot.active || slot.fuel <= 0) return 0;
    const cfg = getFormationF1aConfig();
    const band = getFormationIntegrityBand(slot.integrity);
    return cfg.effectMult[band] ?? 0;
}

function isResidenceFormationRunning(slot) {
    return getFormationEffectMultForSlot(slot) > 0;
}

function getResidenceFormationEffects() {
    ensureResidenceFormationSlots();
    const fx = { cultivatePct: 0, foundationPerCultivate: 0, labels: [] };
    G.sect.residence.formations.slots.forEach(slot => {
        if (!slot) return;
        const mult = getFormationEffectMultForSlot(slot);
        if (mult <= 0) return;
        const def = getFormationDef(slot.id);
        if (!def?.effects) return;
        if (def.effects.cultivatePct) fx.cultivatePct += def.effects.cultivatePct * mult;
        if (def.effects.foundationPerCultivate) {
            fx.foundationPerCultivate += def.effects.foundationPerCultivate * mult;
        }
        const band = getFormationIntegrityBand(slot.integrity);
        const bandNote = band === 'sharp' ? '' : ` (${getFormationIntegrityLabel(band)})`;
        fx.labels.push(`${def.emoji} ${def.name}${bandNote}`);
    });
    fx.cultivatePct = Math.round(fx.cultivatePct * 10) / 10;
    fx.foundationPerCultivate = Math.round(fx.foundationPerCultivate * 10) / 10;
    return fx;
}

function getResidenceFormationCultivateMult() {
    const fx = getResidenceFormationEffects();
    return 1 + (fx.cultivatePct || 0) / 100;
}

function getLayFormationBlockReason(slotIndex, formationId) {
    ensureFormationState();
    if (!isSectFounded()) return 'Found a sect first.';
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'You cannot inscribe a formation right now.';
    const residenceLv = typeof getResidenceLevel === 'function' ? getResidenceLevel() : 0;
    if (residenceLv < 1) return 'Upgrade your quarters before laying formations.';
    const def = getFormationDef(formationId);
    if (!def) return 'Unknown formation.';
    if (def.implemented === false) return `${def.name} is not yet available.`;
    if (!formationCanLayAt(def, 'residence')) return 'This formation cannot be laid at your quarters.';
    if (!knowsFormation(formationId)) {
        if (!isFormationDeciphered(formationId)) {
            if (getFormationShelfEntry(formationId)) {
                return `Decipher ${def.name} on your formation shelf first.`;
            }
            return `You have no manual for ${def.name}.`;
        }
        const need = def.formationTier || 1;
        return `Requires Formation Master tier ${need} (${getFormationMasterTitle(need)}) to lay.`;
    }
    if ((def.minResidenceLevel || 1) > residenceLv) {
        return `Requires residence level ${def.minResidenceLevel}.`;
    }
    const maxSlots = getResidenceFormationSlotCount();
    if (slotIndex < 0 || slotIndex >= maxSlots) return 'Invalid formation slot.';
    const cost = def.layCost;
    if (!cost) return 'Cannot inscribe this formation.';
    if (typeof getConstructionMaterialsBlock === 'function') {
        const matBlock = getConstructionMaterialsBlock(cost);
        if (matBlock) return matBlock;
    }
    return null;
}

function layResidenceFormation(slotIndex, formationId) {
    const block = getLayFormationBlockReason(slotIndex, formationId);
    if (block) return { success: false, message: block };
    const def = getFormationDef(formationId);
    const cost = def.layCost;
    const months = cost.months || 2;
    const label = `Inscribing ${def.name}`;
    if (cost.materials && typeof removeCraftMaterials === 'function' && !removeCraftMaterials(cost.materials)) {
        return { success: false, message: 'Missing materials.' };
    }
    if (!advanceTime(months, label)) {
        if (cost.materials && typeof addCraftMaterial === 'function') {
            for (const [matId, qty] of Object.entries(cost.materials)) {
                addCraftMaterial(matId, qty);
            }
        }
        return { success: false, message: 'Your lifespan ends before the inscription completes.' };
    }
    ensureResidenceFormationSlots();
    const prev = G.sect.residence.formations.slots[slotIndex];
    const prevId = getResidenceFormationSlotId(prev);
    // Courtyard convenience: new lays start fueled and on so the first blessing is felt.
    G.sect.residence.formations.slots[slotIndex] = createResidenceFormationSlotState(formationId, {
        active: true,
        fuel: getFormationLayFuel(def)
    });
    const replaceNote = prevId && prevId !== formationId
        ? ` Replaced ${getFormationDef(prevId)?.name || 'previous pattern'}.`
        : '';
    return {
        success: true,
        message: `${def.emoji} ${def.name} inscribed around your quarters — fueled and active.${replaceNote}`
    };
}

function clearResidenceFormationSlot(slotIndex) {
    ensureFormationState();
    const maxSlots = getResidenceFormationSlotCount();
    if (slotIndex < 0 || slotIndex >= maxSlots) {
        return { success: false, message: 'Invalid formation slot.' };
    }
    const prev = G.sect.residence.formations.slots[slotIndex];
    if (!prev) return { success: false, message: 'Slot is already empty.' };
    const prevId = getResidenceFormationSlotId(prev);
    G.sect.residence.formations.slots[slotIndex] = null;
    const def = getFormationDef(prevId);
    return { success: true, message: `${def?.emoji || '☯️'} Formation cleared from slot ${slotIndex + 1}.` };
}

function setResidenceFormationActive(slotIndex, active) {
    ensureFormationState();
    const slot = getResidenceFormationSlot(slotIndex);
    if (!slot) return { success: false, message: 'Empty slot.' };
    if (slot.scattered || slot.integrity <= 0) {
        return { success: false, message: 'Pattern is scattered — clear and reinscribe.' };
    }
    const def = getFormationDef(slot.id);
    if (active) {
        if (slot.fuel <= 0) {
            return { success: false, message: `${def?.name || 'Formation'} has no fuel. Add spirit stones first.` };
        }
        slot.active = true;
        return { success: true, message: `${def?.emoji || '☯️'} ${def?.name || 'Formation'} activated.` };
    }
    slot.active = false;
    return { success: true, message: `${def?.emoji || '☯️'} ${def?.name || 'Formation'} shut down — standing ready.` };
}

function toggleResidenceFormationActive(slotIndex) {
    const slot = getResidenceFormationSlot(slotIndex);
    if (!slot) return { success: false, message: 'Empty slot.' };
    return setResidenceFormationActive(slotIndex, !slot.active);
}

function getAddFormationFuelBlockReason(slotIndex, fuelUnits) {
    ensureFormationState();
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'You cannot tend formations right now.';
    const slot = getResidenceFormationSlot(slotIndex);
    if (!slot) return 'Empty slot.';
    if (slot.scattered || slot.integrity <= 0) return 'Pattern is scattered — clear and reinscribe.';
    const units = Math.max(0, Math.floor(Number(fuelUnits) || 0));
    if (units <= 0) return 'Choose how much fuel to add.';
    const def = getFormationDef(slot.id);
    const capacity = getFormationFuelCapacity(def);
    if (slot.fuel >= capacity) return 'Fuel stock is already full.';
    const cfg = getFormationF1aConfig();
    const room = capacity - slot.fuel;
    const add = Math.min(units, room);
    const cost = add * (cfg.stonePerFuel || 1);
    if ((G.stones || 0) < cost) return `Need ${cost} Spirit Stones (have ${G.stones || 0}).`;
    return null;
}

function addResidenceFormationFuel(slotIndex, fuelUnits) {
    const block = getAddFormationFuelBlockReason(slotIndex, fuelUnits);
    if (block) return { success: false, message: block };
    const slot = getResidenceFormationSlot(slotIndex);
    const def = getFormationDef(slot.id);
    const cfg = getFormationF1aConfig();
    const capacity = getFormationFuelCapacity(def);
    const room = capacity - slot.fuel;
    const add = Math.min(Math.floor(fuelUnits), room);
    const cost = add * (cfg.stonePerFuel || 1);
    G.stones -= cost;
    slot.fuel += add;
    return {
        success: true,
        message: `Fed ${def.emoji} ${def.name} with ${cost}💎 (+${add} mo fuel). Stock ${slot.fuel}/${capacity}.`
    };
}

function getMaintainFormationBlockReason(slotIndex) {
    ensureFormationState();
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'You cannot tend formations right now.';
    const slot = getResidenceFormationSlot(slotIndex);
    if (!slot) return 'Empty slot.';
    if (slot.scattered || slot.integrity <= 0) {
        return 'Pattern is scattered — clear and reinscribe.';
    }
    const cfg = getFormationF1aConfig();
    if (slot.integrity >= cfg.integrityMax) return 'Lines are already sharp — no maintain needed.';
    const cost = cfg.maintain || {};
    if ((G.stones || 0) < (cost.stones || 0)) {
        return `Need ${cost.stones} Spirit Stones to touch up the pattern.`;
    }
    if (cost.materials && typeof getConstructionMaterialsBlock === 'function') {
        const matBlock = getConstructionMaterialsBlock({ materials: cost.materials });
        if (matBlock) return matBlock;
    }
    return null;
}

function maintainResidenceFormation(slotIndex) {
    const block = getMaintainFormationBlockReason(slotIndex);
    if (block) return { success: false, message: block };
    const slot = getResidenceFormationSlot(slotIndex);
    const def = getFormationDef(slot.id);
    const cfg = getFormationF1aConfig();
    const cost = cfg.maintain || {};
    const months = cost.months || 1;
    if (cost.materials && typeof removeCraftMaterials === 'function' && !removeCraftMaterials(cost.materials)) {
        return { success: false, message: 'Missing materials.' };
    }
    if ((cost.stones || 0) > 0) G.stones -= cost.stones;
    if (!advanceTime(months, `Touching up ${def.name}`)) {
        if (cost.materials && typeof addCraftMaterial === 'function') {
            for (const [matId, qty] of Object.entries(cost.materials)) {
                addCraftMaterial(matId, qty);
            }
        }
        if ((cost.stones || 0) > 0) G.stones += cost.stones;
        return { success: false, message: 'Your lifespan ends before the touch-up completes.' };
    }
    const before = slot.integrity;
    slot.integrity = Math.min(cfg.integrityMax, slot.integrity + (cost.restore || 35));
    slot.scattered = false;
    const band = getFormationIntegrityBand(slot.integrity);
    return {
        success: true,
        message: `${def.emoji} ${def.name} lines refreshed (${before}→${slot.integrity}, ${getFormationIntegrityLabel(band)}).`
    };
}

/**
 * Monthly tick: active slots burn fuel; all laid slots lose integrity (neglect).
 * Hooked from tickSectSystems — no render.
 */
function tickResidenceFormations(monthsPassed) {
    tickAllFormationSlots(monthsPassed);
}

/**
 * Monthly tick for residence + sect anchors: active burn fuel; all laid lose integrity.
 */
function tickAllFormationSlots(monthsPassed) {
    if (typeof isSectFounded === 'function' && !isSectFounded()) return;
    if (!monthsPassed || monthsPassed <= 0) return;
    ensureFormationState();
    const cfg = getFormationF1aConfig();
    const decay = cfg.integrityDecayPerMonth || 1;

    function tickSlots(slots) {
        if (!slots?.length) return;
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            if (!slot) continue;
            const def = getFormationDef(slot.id);
            if (!def) continue;

            if (slot.scattered || slot.integrity <= 0) {
                slot.scattered = true;
                slot.integrity = 0;
                slot.active = false;
                continue;
            }

            slot.integrity = Math.max(0, slot.integrity - decay * monthsPassed);
            if (slot.integrity <= 0) {
                slot.integrity = 0;
                slot.scattered = true;
                slot.active = false;
                if (typeof addLog === 'function') {
                    addLog(`☯️ ${def.emoji} ${def.name} scattered from neglect — the lines are gone.`);
                }
                continue;
            }

            if (slot.active) {
                const burn = getFormationFuelPerMonth(def) * monthsPassed;
                if (burn > 0 && slot.fuel > 0) {
                    const beforeFuel = slot.fuel;
                    slot.fuel = Math.max(0, slot.fuel - burn);
                    if (beforeFuel > 0 && slot.fuel <= 0 && typeof addLog === 'function') {
                        addLog(`☯️ ${def.emoji} ${def.name} ran dry — still switched on, but inert until refueled.`);
                    }
                }
            }
        }
    }

    tickSlots(G.sect.residence?.formations?.slots);
    Object.keys(FORMATION_ANCHORS || {}).forEach(anchorId => {
        if (anchorId === 'residence') return;
        tickSlots(G.sect.anchors?.[anchorId]?.slots);
    });
}

function actionResidenceCultivate() {
    if (typeof actionBlocked === 'function' && actionBlocked()) return;
    if (!isSectFounded()) return;
    if (getResidenceLevel() < 1) {
        addLog('🏠 Upgrade your quarters before cultivating there.');
        fullRender();
        return;
    }
    beginActionLog();
    const months = ACTION_MONTHS.cultivate;
    if (!advanceTime(months, 'Cultivating at your quarters')) {
        cancelActionLog();
        fullRender();
        return;
    }
    const formFx = getResidenceFormationEffects();
    const formMult = getResidenceFormationCultivateMult();
    const bonusParts = [];
    if (formFx.cultivatePct > 0) bonusParts.push(`formations +${formFx.cultivatePct}%`);
    let cultMsg = '';
    if (typeof runCultivateSession === 'function') {
        cultMsg = runCultivateSession({
            extraMult: formMult,
            extraFoundation: formFx.foundationPerCultivate || 0,
            bonusNoteParts: bonusParts,
            logPrefix: '🏠 At your quarters'
        });
    }
    if (formFx.labels.length) {
        cultMsg += ` · Running: ${formFx.labels.join(', ')}`;
    } else {
        const laid = getLaidResidenceFormations();
        if (laid.length) {
            cultMsg += ' · Courtyard patterns laid but not running (fuel / switch / integrity).';
        }
    }
    commitActionLog(cultMsg || '🏠 You cultivate at your quarters.');
    if (typeof triggerTutorial === 'function') triggerTutorial('first_cultivate');
    fullRender();
}

function formatFormationSlotStatusHtml(slot) {
    if (!slot) return '';
    const def = getFormationDef(slot.id);
    const capacity = getFormationFuelCapacity(def);
    const band = getFormationIntegrityBand(slot.integrity);
    const bandLabel = getFormationIntegrityLabel(band);
    let switchLabel = 'Off';
    if (slot.scattered) switchLabel = 'Scattered';
    else if (slot.active && slot.fuel <= 0) switchLabel = 'On · Starved';
    else if (slot.active) switchLabel = 'On';
    const running = isResidenceFormationRunning(slot);
    return `<div class="sect-formation-status" data-integrity="${band}">
        <span>${switchLabel}</span>
        <span>Fuel ${Math.floor(slot.fuel)}/${capacity}</span>
        <span title="Inscription integrity — lines fade if neglected">${bandLabel} (${Math.floor(slot.integrity)})</span>
        <span class="sect-formation-running">${running ? 'Running' : 'Not running'}</span>
    </div>`;
}

function renderFormationShelfHtml() {
    ensureFormationState();
    const tier = getFormationMasterTier();
    const title = getFormationMasterTitle(tier);
    let html = `<div class="sect-section-title">📜 Formation Shelf</div>`;
    html += `<p class="sect-hint">Master: <strong>${title}</strong> (tier ${tier}) — caps which formation tiers you may lay. Decipher unread manuals here (no Trace yet).</p>`;

    const entries = Object.values(G.formationShelf || {}).sort((a, b) => {
        const na = getFormationDef(a.formationId)?.name || a.formationId;
        const nb = getFormationDef(b.formationId)?.name || b.formationId;
        return na.localeCompare(nb);
    });

    if (!entries.length) {
        html += `<p class="sect-hint">No formation manuals yet. Upgrade quarters for a novice gather diagram, or buy one at a market.</p>`;
        return html;
    }

    html += `<ul class="sect-formation-manual-list">`;
    entries.forEach(entry => {
        const def = getFormationDef(entry.formationId);
        if (!def) return;
        const ft = def.formationTier || 1;
        if (entry.deciphered) {
            const canLay = knowsFormation(def.id);
            const layNote = canLay
                ? 'Ready to lay'
                : `Deciphered — need Master tier ${ft} to lay`;
            html += `<li>${def.emoji} <strong>${def.name}</strong> <span class="sect-formation-shelf-badge is-ready">${layNote}</span>
                <div class="sect-hint">${def.desc} · ${ft}${ft === 1 ? 'st' : ft === 2 ? 'nd' : 'th'}-tier</div>
            </li>`;
        } else {
            const months = getDecipherFormationMonths(def);
            const stones = getDecipherFormationStones(def);
            const block = getDecipherFormationBlockReason(def.id);
            html += `<li>${def.emoji} <strong>${def.name}</strong> <span class="sect-formation-shelf-badge is-unread">Unread</span>
                <div class="sect-hint">${def.desc}</div>
                <button type="button" class="sect-action-btn sect-formation-decipher-btn" data-formation-decipher="${def.id}"
                    ${block ? `disabled title="${escapeSectAttr(block)}"` : ''}>
                    Decipher (${months} mo · ${stones}💎)
                </button>
            </li>`;
        }
    });
    html += `</ul>`;
    return html;
}

function renderResidenceFormationsHtml() {
    ensureFormationState();
    const cfg = getFormationF1aConfig();
    const slotCount = getResidenceFormationSlotCount();
    const residenceLv = getResidenceLevel();
    let html = renderFormationShelfHtml();
    html += `<div class="sect-section-title">☯️ Courtyard Formations</div>`;

    if (residenceLv < 1) {
        html += `<p class="sect-hint">Upgrade to Inner Court Room for a courtyard slot — and an unread novice gather diagram.</p>`;
        return html;
    }

    if (slotCount <= 0) {
        html += `<p class="sect-hint">No formation slots at this residence level.</p>`;
        return html;
    }

    const layable = Object.keys(G.formationShelf || {})
        .map(id => getFormationDef(id))
        .filter(def => def && def.implemented !== false && knowsFormation(def.id) && formationCanLayAt(def, 'residence'));

    const hasUnread = Object.values(G.formationShelf || {}).some(e => e && !e.deciphered);

    if (!layable.length) {
        html += `<p class="sect-hint">${hasUnread
            ? 'Decipher an unread manual on your shelf before inscribing.'
            : 'No layable patterns yet. Decipher a diagram or buy one at the market.'}</p>`;
    } else {
        html += `<p class="sect-hint">Laid patterns need <strong>fuel</strong> and an <strong>on</strong> switch to run. Neglect fades the lines — maintain to refresh them.</p>`;
    }

    const fx = getResidenceFormationEffects();
    if (fx.cultivatePct > 0 || fx.foundationPerCultivate > 0) {
        const parts = [];
        if (fx.cultivatePct > 0) parts.push(`+${fx.cultivatePct}% cultivate`);
        if (fx.foundationPerCultivate > 0) parts.push(`+${fx.foundationPerCultivate} Foundation/session`);
        html += `<div class="sect-formation-summary">Running bonus: <strong>${parts.join(' · ')}</strong></div>`;
    } else if (getLaidResidenceFormations().length) {
        html += `<div class="sect-formation-summary sect-formation-summary-idle">Patterns laid — none running (check fuel, switch, or integrity).</div>`;
    }

    ensureResidenceFormationSlots();
    const slots = G.sect.residence.formations.slots;
    html += `<div class="sect-formation-slots">`;
    for (let i = 0; i < slotCount; i++) {
        const slot = slots[i];
        const laidId = getResidenceFormationSlotId(slot);
        const laidDef = laidId ? getFormationDef(laidId) : null;
        const band = slot ? getFormationIntegrityBand(slot.integrity) : null;
        html += `<div class="sect-formation-slot${band ? ` is-${band}` : ''}">`;
        html += `<div class="sect-formation-slot-head"><span>Slot ${i + 1}</span>`;
        if (laidDef) {
            html += `<span class="sect-formation-active">${laidDef.emoji} ${laidDef.name}</span>`;
        } else {
            html += `<span class="sect-formation-empty">Empty</span>`;
        }
        html += `</div>`;
        if (laidDef && slot) {
            html += `<p class="sect-hint">${laidDef.desc}</p>`;
            html += formatFormationSlotStatusHtml(slot);
            html += `<div class="sect-formation-controls">`;
            if (!slot.scattered) {
                const canOn = !slot.active && slot.fuel > 0;
                const canOff = !!slot.active;
                html += `<button type="button" class="sect-action-btn sect-formation-toggle-btn" data-formation-toggle="${i}"
                    ${(!canOn && !canOff) ? `disabled title="${escapeSectAttr(slot.fuel <= 0 ? 'Add fuel first.' : '')}"` : ''}>
                    ${slot.active ? 'Shut down' : 'Activate'}
                </button>`;
                (cfg.fuelPresets || [3, 6, 12]).forEach(units => {
                    const fuelBlock = getAddFormationFuelBlockReason(i, units);
                    html += `<button type="button" class="sect-formation-fuel-btn" data-formation-fuel="${i}" data-fuel-units="${units}"
                        ${fuelBlock ? `disabled title="${escapeSectAttr(fuelBlock)}"` : ''}>
                        +${units} mo fuel (${units * (cfg.stonePerFuel || 1)}💎)
                    </button>`;
                });
                const maintainBlock = getMaintainFormationBlockReason(i);
                html += `<button type="button" class="sect-formation-maintain-btn" data-formation-maintain="${i}"
                    ${maintainBlock ? `disabled title="${escapeSectAttr(maintainBlock)}"` : ''}>
                    Maintain lines (${cfg.maintain?.stones || 0}💎)
                </button>`;
            } else {
                html += `<p class="sect-hint sect-formation-scattered-hint">Scattered — clear the slot and reinscribe the pattern.</p>`;
            }
            html += `<button type="button" class="sect-action-btn sect-formation-clear-btn" data-formation-clear="${i}">Clear slot</button>`;
            html += `</div>`;
        }
        if (layable.length) {
            html += `<div class="sect-formation-lay-row">`;
            layable.forEach(def => {
                const block = getLayFormationBlockReason(i, def.id);
                const cost = def.layCost;
                const matHint = cost?.months ? `${cost.months}mo` : '';
                html += `<button type="button" class="sect-formation-lay-btn" data-formation-lay="${def.id}" data-formation-slot="${i}"
                    ${block ? `disabled title="${escapeSectAttr(block)}"` : ''}>
                    ${def.emoji} Inscribe ${def.name}${matHint ? ` (${matHint})` : ''}
                </button>`;
            });
            html += `</div>`;
        }
        html += `</div>`;
    }
    html += `</div>`;

    html += `<button type="button" class="sect-action-btn" id="btnResidenceCultivate">🏠 Cultivate at quarters (${ACTION_MONTHS.cultivate} months)</button>`;
    return html;
}

// ============================================
// F2a — Sect formation anchors
// ============================================

function getFormationAnchorDef(anchorId) {
    return typeof FORMATION_ANCHORS !== 'undefined' ? FORMATION_ANCHORS[anchorId] : null;
}

function formationCanLayAt(def, anchorId) {
    if (!def || def.implemented === false) return false;
    if (Array.isArray(def.anchors) && def.anchors.length) {
        return def.anchors.includes(anchorId);
    }
    return def.deploy === anchorId;
}

function ensureAllSectFormationAnchors() {
    if (!G.sect) return;
    if (!G.sect.anchors || typeof G.sect.anchors !== 'object') G.sect.anchors = {};
    Object.keys(typeof FORMATION_ANCHORS !== 'undefined' ? FORMATION_ANCHORS : {}).forEach(anchorId => {
        if (anchorId === 'residence') return;
        ensureSectFormationAnchor(anchorId);
    });
}

function getSectFormationAnchorSlotCount(anchorId) {
    const aDef = getFormationAnchorDef(anchorId);
    if (!aDef || aDef.kind !== 'building') return 0;
    const buildingId = aDef.buildingId || anchorId;
    const lv = typeof getBuildingLevel === 'function' ? getBuildingLevel(buildingId) : (G.sect?.buildings?.[buildingId] || 0);
    return lv >= 1 ? 1 : 0;
}

function ensureSectFormationAnchor(anchorId) {
    if (!G.sect.anchors) G.sect.anchors = {};
    if (!G.sect.anchors[anchorId]) G.sect.anchors[anchorId] = { slots: [] };
    if (!Array.isArray(G.sect.anchors[anchorId].slots)) G.sect.anchors[anchorId].slots = [];
    const max = getSectFormationAnchorSlotCount(anchorId);
    const slots = G.sect.anchors[anchorId].slots;
    while (slots.length < max) slots.push(null);
    while (slots.length > max) slots.pop();
    const known = G.knownFormations || [];
    for (let i = 0; i < slots.length; i++) {
        const normalized = normalizeResidenceFormationSlot(slots[i]);
        if (normalized && !known.includes(normalized.id)) slots[i] = null;
        else if (normalized && !formationCanLayAt(getFormationDef(normalized.id), anchorId)) slots[i] = null;
        else slots[i] = normalized;
    }
}

function getSectFormationAnchorSlot(anchorId, slotIndex) {
    ensureSectFormationAnchor(anchorId);
    return G.sect.anchors[anchorId]?.slots?.[slotIndex] || null;
}

function getLayAnchorFormationBlockReason(anchorId, slotIndex, formationId) {
    ensureFormationState();
    if (!isSectFounded()) return 'Found a sect first.';
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'You cannot inscribe a formation right now.';
    const aDef = getFormationAnchorDef(anchorId);
    if (!aDef || aDef.kind !== 'building') return 'Invalid anchor.';
    const buildingId = aDef.buildingId || anchorId;
    const bLv = typeof getBuildingLevel === 'function' ? getBuildingLevel(buildingId) : 0;
    if (bLv < 1) return `Construct the ${aDef.label} first.`;
    const def = getFormationDef(formationId);
    if (!def) return 'Unknown formation.';
    if (def.implemented === false) return `${def.name} is not yet available.`;
    if (!formationCanLayAt(def, anchorId)) return `This formation cannot be laid at the ${aDef.label}.`;
    if (!knowsFormation(formationId)) {
        if (!isFormationDeciphered(formationId)) {
            if (getFormationShelfEntry(formationId)) return `Decipher ${def.name} on your formation shelf first.`;
            return `You have no manual for ${def.name}.`;
        }
        const need = def.formationTier || 1;
        return `Requires Formation Master tier ${need} (${getFormationMasterTitle(need)}) to lay.`;
    }
    const minB = def.minBuildingLevelByAnchor?.[anchorId];
    if (minB != null && bLv < minB) return `Requires ${aDef.label} level ${minB}.`;
    const maxSlots = getSectFormationAnchorSlotCount(anchorId);
    if (slotIndex < 0 || slotIndex >= maxSlots) return 'Invalid formation slot.';
    const cost = def.layCost;
    if (!cost) return 'Cannot inscribe this formation.';
    if (typeof getConstructionMaterialsBlock === 'function') {
        const matBlock = getConstructionMaterialsBlock(cost);
        if (matBlock) return matBlock;
    }
    return null;
}

function laySectAnchorFormation(anchorId, slotIndex, formationId) {
    const block = getLayAnchorFormationBlockReason(anchorId, slotIndex, formationId);
    if (block) return { success: false, message: block };
    const def = getFormationDef(formationId);
    const aDef = getFormationAnchorDef(anchorId);
    const cost = def.layCost;
    const months = cost.months || 2;
    if (cost.materials && typeof removeCraftMaterials === 'function' && !removeCraftMaterials(cost.materials)) {
        return { success: false, message: 'Missing materials.' };
    }
    if (!advanceTime(months, `Inscribing ${def.name} at ${aDef.label}`)) {
        if (cost.materials && typeof addCraftMaterial === 'function') {
            for (const [matId, qty] of Object.entries(cost.materials)) addCraftMaterial(matId, qty);
        }
        return { success: false, message: 'Your lifespan ends before the inscription completes.' };
    }
    ensureSectFormationAnchor(anchorId);
    const prev = G.sect.anchors[anchorId].slots[slotIndex];
    const prevId = getResidenceFormationSlotId(prev);
    const activeDefault = def.defaultActiveOnLay === false ? false : true;
    G.sect.anchors[anchorId].slots[slotIndex] = createResidenceFormationSlotState(formationId, {
        active: activeDefault,
        fuel: getFormationLayFuel(def)
    });
    const replaceNote = prevId && prevId !== formationId
        ? ` Replaced ${getFormationDef(prevId)?.name || 'previous pattern'}.`
        : '';
    const runNote = activeDefault
        ? ' — fueled and active.'
        : ' — fueled and standing ready (switch off).';
    return {
        success: true,
        message: `${def.emoji} ${def.name} inscribed at the ${aDef.label}${runNote}${replaceNote}`
    };
}

function clearSectAnchorFormationSlot(anchorId, slotIndex) {
    ensureFormationState();
    const maxSlots = getSectFormationAnchorSlotCount(anchorId);
    if (slotIndex < 0 || slotIndex >= maxSlots) return { success: false, message: 'Invalid formation slot.' };
    const prev = getSectFormationAnchorSlot(anchorId, slotIndex);
    if (!prev) return { success: false, message: 'Slot is already empty.' };
    const prevId = getResidenceFormationSlotId(prev);
    G.sect.anchors[anchorId].slots[slotIndex] = null;
    const def = getFormationDef(prevId);
    return { success: true, message: `${def?.emoji || '☯️'} Formation cleared from ${getFormationAnchorDef(anchorId)?.label || anchorId}.` };
}

function setSectAnchorFormationActive(anchorId, slotIndex, active) {
    ensureFormationState();
    const slot = getSectFormationAnchorSlot(anchorId, slotIndex);
    if (!slot) return { success: false, message: 'Empty slot.' };
    if (slot.scattered || slot.integrity <= 0) {
        return { success: false, message: 'Pattern is scattered — clear and reinscribe.' };
    }
    const def = getFormationDef(slot.id);
    if (active) {
        if (slot.fuel <= 0) {
            return { success: false, message: `${def?.name || 'Formation'} has no fuel. Add spirit stones first.` };
        }
        slot.active = true;
        return { success: true, message: `${def?.emoji || '☯️'} ${def?.name || 'Formation'} activated at the ${getFormationAnchorDef(anchorId)?.label || anchorId}.` };
    }
    slot.active = false;
    return { success: true, message: `${def?.emoji || '☯️'} ${def?.name || 'Formation'} shut down — standing ready.` };
}

function toggleSectAnchorFormationActive(anchorId, slotIndex) {
    const slot = getSectFormationAnchorSlot(anchorId, slotIndex);
    if (!slot) return { success: false, message: 'Empty slot.' };
    return setSectAnchorFormationActive(anchorId, slotIndex, !slot.active);
}

function getAddAnchorFormationFuelBlockReason(anchorId, slotIndex, fuelUnits) {
    ensureFormationState();
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'You cannot tend formations right now.';
    const slot = getSectFormationAnchorSlot(anchorId, slotIndex);
    if (!slot) return 'Empty slot.';
    if (slot.scattered || slot.integrity <= 0) return 'Pattern is scattered — clear and reinscribe.';
    const units = Math.max(0, Math.floor(Number(fuelUnits) || 0));
    if (units <= 0) return 'Choose how much fuel to add.';
    const def = getFormationDef(slot.id);
    const capacity = getFormationFuelCapacity(def);
    if (slot.fuel >= capacity) return 'Fuel stock is already full.';
    const cfg = getFormationF1aConfig();
    const room = capacity - slot.fuel;
    const add = Math.min(units, room);
    const cost = add * (cfg.stonePerFuel || 1);
    if ((G.stones || 0) < cost) return `Need ${cost} Spirit Stones (have ${G.stones || 0}).`;
    return null;
}

function addSectAnchorFormationFuel(anchorId, slotIndex, fuelUnits) {
    const block = getAddAnchorFormationFuelBlockReason(anchorId, slotIndex, fuelUnits);
    if (block) return { success: false, message: block };
    const slot = getSectFormationAnchorSlot(anchorId, slotIndex);
    const def = getFormationDef(slot.id);
    const cfg = getFormationF1aConfig();
    const capacity = getFormationFuelCapacity(def);
    const room = capacity - slot.fuel;
    const add = Math.min(Math.floor(fuelUnits), room);
    const cost = add * (cfg.stonePerFuel || 1);
    G.stones -= cost;
    slot.fuel += add;
    return {
        success: true,
        message: `Fed ${def.emoji} ${def.name} with ${cost}💎 (+${add} mo fuel). Stock ${slot.fuel}/${capacity}.`
    };
}

function getMaintainAnchorFormationBlockReason(anchorId, slotIndex) {
    ensureFormationState();
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'You cannot tend formations right now.';
    const slot = getSectFormationAnchorSlot(anchorId, slotIndex);
    if (!slot) return 'Empty slot.';
    if (slot.scattered || slot.integrity <= 0) return 'Pattern is scattered — clear and reinscribe.';
    const cfg = getFormationF1aConfig();
    if (slot.integrity >= cfg.integrityMax) return 'Lines are already sharp — no maintain needed.';
    const cost = cfg.maintain || {};
    if ((G.stones || 0) < (cost.stones || 0)) {
        return `Need ${cost.stones} Spirit Stones to touch up the pattern.`;
    }
    if (cost.materials && typeof getConstructionMaterialsBlock === 'function') {
        const matBlock = getConstructionMaterialsBlock({ materials: cost.materials });
        if (matBlock) return matBlock;
    }
    return null;
}

function maintainSectAnchorFormation(anchorId, slotIndex) {
    const block = getMaintainAnchorFormationBlockReason(anchorId, slotIndex);
    if (block) return { success: false, message: block };
    const slot = getSectFormationAnchorSlot(anchorId, slotIndex);
    const def = getFormationDef(slot.id);
    const cfg = getFormationF1aConfig();
    const cost = cfg.maintain || {};
    const months = cost.months || 1;
    if (cost.materials && typeof removeCraftMaterials === 'function' && !removeCraftMaterials(cost.materials)) {
        return { success: false, message: 'Missing materials.' };
    }
    if ((cost.stones || 0) > 0) G.stones -= cost.stones;
    if (!advanceTime(months, `Touching up ${def.name}`)) {
        if (cost.materials && typeof addCraftMaterial === 'function') {
            for (const [matId, qty] of Object.entries(cost.materials)) addCraftMaterial(matId, qty);
        }
        if ((cost.stones || 0) > 0) G.stones += cost.stones;
        return { success: false, message: 'Your lifespan ends before the touch-up completes.' };
    }
    const before = slot.integrity;
    slot.integrity = Math.min(cfg.integrityMax, slot.integrity + (cost.restore || 35));
    slot.scattered = false;
    const band = getFormationIntegrityBand(slot.integrity);
    return {
        success: true,
        message: `${def.emoji} ${def.name} lines refreshed (${before}→${slot.integrity}, ${getFormationIntegrityLabel(band)}).`
    };
}

function accumulateRunningFormationEffects(slots, fx) {
    (slots || []).forEach(slot => {
        if (!slot) return;
        const mult = getFormationEffectMultForSlot(slot);
        if (mult <= 0) return;
        const def = getFormationDef(slot.id);
        if (!def?.effects) return;
        if (def.effects.cultivatePct) fx.cultivatePct += def.effects.cultivatePct * mult;
        if (def.effects.foundationPerCultivate) {
            fx.foundationPerCultivate += def.effects.foundationPerCultivate * mult;
        }
        if (def.effects.defenseRating) fx.defenseRating += def.effects.defenseRating * mult;
        if (def.effects.meditationStatPct) {
            fx.meditationStatPct += def.effects.meditationStatPct * mult;
        }
        const band = getFormationIntegrityBand(slot.integrity);
        const bandNote = band === 'sharp' ? '' : ` (${getFormationIntegrityLabel(band)})`;
        fx.labels.push(`${def.emoji} ${def.name}${bandNote}`);
    });
}

/** Running meditation-chamber patterns (sect-wide cultivate / foundation while on). */
function getMeditationChamberFormationEffects() {
    ensureFormationState();
    const fx = { cultivatePct: 0, foundationPerCultivate: 0, defenseRating: 0, meditationStatPct: 0, labels: [] };
    accumulateRunningFormationEffects(G.sect.anchors?.meditation_chamber?.slots, fx);
    fx.cultivatePct = Math.round(fx.cultivatePct * 10) / 10;
    fx.foundationPerCultivate = Math.round(fx.foundationPerCultivate * 10) / 10;
    fx.defenseRating = Math.round(fx.defenseRating * 10) / 10;
    return fx;
}

/** Running defense-array ward bonus (added on top of building defenseRating). */
function getDefenseArrayFormationEffects() {
    ensureFormationState();
    const fx = { cultivatePct: 0, foundationPerCultivate: 0, defenseRating: 0, meditationStatPct: 0, labels: [] };
    accumulateRunningFormationEffects(G.sect.anchors?.defense_array?.slots, fx);
    fx.defenseRating = Math.round(fx.defenseRating * 10) / 10;
    return fx;
}

function getSectFormationDefenseRatingBonus() {
    return getDefenseArrayFormationEffects().defenseRating || 0;
}

function renderSectAnchorFormationsHtml(anchorId) {
    ensureFormationState();
    const aDef = getFormationAnchorDef(anchorId);
    if (!aDef || aDef.kind !== 'building') return '';
    const cfg = getFormationF1aConfig();
    const slotCount = getSectFormationAnchorSlotCount(anchorId);
    let html = `<div class="sect-section-title">☯️ Anchor Pattern</div>`;
    if (aDef.hint) html += `<p class="sect-hint">${aDef.hint}</p>`;

    if (slotCount <= 0) {
        html += `<p class="sect-hint">Construct this building to host a formation.</p>`;
        return html;
    }

    const layable = Object.keys(G.formationShelf || {})
        .map(id => getFormationDef(id))
        .filter(def => def && def.implemented !== false && knowsFormation(def.id) && formationCanLayAt(def, anchorId));

    ensureSectFormationAnchor(anchorId);
    const slots = G.sect.anchors[anchorId].slots;

    if (anchorId === 'defense_array') {
        const fx = getDefenseArrayFormationEffects();
        if (fx.defenseRating > 0) {
            html += `<div class="sect-formation-summary">Ward running: <strong>+${fx.defenseRating} defense rating</strong></div>`;
        } else if (slots.some(Boolean)) {
            html += `<div class="sect-formation-summary sect-formation-summary-idle">Ward laid — not running (fuel / switch / integrity).</div>`;
        }
    }
    if (anchorId === 'meditation_chamber') {
        const fx = getMeditationChamberFormationEffects();
        if (fx.cultivatePct > 0 || fx.foundationPerCultivate > 0) {
            const parts = [];
            if (fx.cultivatePct > 0) parts.push(`+${fx.cultivatePct}% cultivate`);
            if (fx.foundationPerCultivate > 0) parts.push(`+${fx.foundationPerCultivate} Foundation/session`);
            html += `<div class="sect-formation-summary">Chamber pattern running: <strong>${parts.join(' · ')}</strong></div>`;
        } else if (slots.some(Boolean)) {
            html += `<div class="sect-formation-summary sect-formation-summary-idle">Pattern laid — not running.</div>`;
        }
    }

    html += `<div class="sect-formation-slots">`;
    for (let i = 0; i < slotCount; i++) {
        const slot = slots[i];
        const laidId = getResidenceFormationSlotId(slot);
        const laidDef = laidId ? getFormationDef(laidId) : null;
        const band = slot ? getFormationIntegrityBand(slot.integrity) : null;
        html += `<div class="sect-formation-slot${band ? ` is-${band}` : ''}">`;
        html += `<div class="sect-formation-slot-head"><span>Anchor slot</span>`;
        if (laidDef) html += `<span class="sect-formation-active">${laidDef.emoji} ${laidDef.name}</span>`;
        else html += `<span class="sect-formation-empty">Empty</span>`;
        html += `</div>`;
        if (laidDef && slot) {
            html += `<p class="sect-hint">${laidDef.desc}</p>`;
            html += formatFormationSlotStatusHtml(slot);
            html += `<div class="sect-formation-controls">`;
            if (!slot.scattered) {
                html += `<button type="button" class="sect-action-btn sect-formation-toggle-btn" data-anchor-id="${anchorId}" data-formation-toggle="${i}">
                    ${slot.active ? 'Shut down' : 'Activate'}
                </button>`;
                (cfg.fuelPresets || [3, 6, 12]).forEach(units => {
                    const fuelBlock = getAddAnchorFormationFuelBlockReason(anchorId, i, units);
                    html += `<button type="button" class="sect-formation-fuel-btn" data-anchor-id="${anchorId}" data-formation-fuel="${i}" data-fuel-units="${units}"
                        ${fuelBlock ? `disabled title="${escapeSectAttr(fuelBlock)}"` : ''}>
                        +${units} mo fuel (${units * (cfg.stonePerFuel || 1)}💎)
                    </button>`;
                });
                const maintainBlock = getMaintainAnchorFormationBlockReason(anchorId, i);
                html += `<button type="button" class="sect-formation-maintain-btn" data-anchor-id="${anchorId}" data-formation-maintain="${i}"
                    ${maintainBlock ? `disabled title="${escapeSectAttr(maintainBlock)}"` : ''}>
                    Maintain lines (${cfg.maintain?.stones || 0}💎)
                </button>`;
            } else {
                html += `<p class="sect-hint sect-formation-scattered-hint">Scattered — clear and reinscribe.</p>`;
            }
            html += `<button type="button" class="sect-action-btn sect-formation-clear-btn" data-anchor-id="${anchorId}" data-formation-clear="${i}">Clear slot</button>`;
            html += `</div>`;
        }
        if (layable.length) {
            html += `<div class="sect-formation-lay-row">`;
            layable.forEach(def => {
                const block = getLayAnchorFormationBlockReason(anchorId, i, def.id);
                const cost = def.layCost;
                const matHint = cost?.months ? `${cost.months}mo` : '';
                html += `<button type="button" class="sect-formation-lay-btn" data-anchor-id="${anchorId}" data-formation-lay="${def.id}" data-formation-slot="${i}"
                    ${block ? `disabled title="${escapeSectAttr(block)}"` : ''}>
                    ${def.emoji} Inscribe ${def.name}${matHint ? ` (${matHint})` : ''}
                </button>`;
            });
            html += `</div>`;
        } else if (!laidDef) {
            html += `<p class="sect-hint">No layable patterns for this anchor. Decipher a matching manual (ward for Defense Array; gather/stabilise for the Chamber).</p>`;
        }
        html += `</div>`;
    }
    html += `</div>`;
    return html;
}
