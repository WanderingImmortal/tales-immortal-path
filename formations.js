// ============================================
// FORMATIONS.JS — Residence formations (F1a)
// Fuel + activation switch + inscription integrity
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

function ensureFormationState() {
    if (!G.knownFormations) G.knownFormations = [];
    ensureSectState();
    if (!G.sect.residence) {
        G.sect.residence = { level: 0, stash: [], lastRestMonths: null, formations: { slots: [] } };
    }
    if (!G.sect.residence.formations) G.sect.residence.formations = { slots: [] };
    if (!Array.isArray(G.sect.residence.formations.slots)) {
        G.sect.residence.formations.slots = [];
    }
    ensureResidenceFormationSlots();
}

function migrateFormationsForExistingSave() {
    ensureFormationState();
    const residenceLv = typeof getResidenceLevel === 'function' ? getResidenceLevel() : (G.sect?.residence?.level || 0);
    for (let lv = 1; lv <= residenceLv; lv++) {
        grantFormationsForResidenceLevel(lv, { silent: true });
    }
    ensureResidenceFormationSlots();
}

function getFormationDef(formationId) {
    return typeof FORMATIONS !== 'undefined' ? FORMATIONS[formationId] : null;
}

function knowsFormation(formationId) {
    return Array.isArray(G.knownFormations) && G.knownFormations.includes(formationId);
}

function learnFormation(formationId, options) {
    ensureFormationState();
    const def = getFormationDef(formationId);
    if (!def || def.implemented === false) return false;
    if (knowsFormation(formationId)) return false;
    G.knownFormations.push(formationId);
    if (!options?.silent) {
        addLog(`📜 Formation manual comprehended: ${def.emoji} ${def.name}.`);
    }
    return true;
}

function grantFormationsForResidenceLevel(level, options) {
    if (typeof FORMATIONS === 'undefined') return;
    Object.values(FORMATIONS).forEach(def => {
        if (def.implemented === false) return;
        if (def.learnOnResidenceLevel === level) {
            learnFormation(def.id, { silent: !!options?.silent });
        }
    });
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
    const active = options?.active != null ? !!options.active : fuel > 0;
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
    if (def.deploy !== 'residence') return 'This formation cannot be laid at your quarters.';
    if (!knowsFormation(formationId)) return `You have not comprehended ${def.name}.`;
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
    if (typeof isSectFounded === 'function' && !isSectFounded()) return;
    if (!monthsPassed || monthsPassed <= 0) return;
    if (!G.sect?.residence?.formations?.slots?.length) return;
    ensureResidenceFormationSlots();
    const cfg = getFormationF1aConfig();
    const decay = cfg.integrityDecayPerMonth || 1;
    const slots = G.sect.residence.formations.slots;
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

        // Neglect: lines fade whether the switch is on or off.
        slot.integrity = Math.max(0, slot.integrity - decay * monthsPassed);
        if (slot.integrity <= 0) {
            slot.integrity = 0;
            slot.scattered = true;
            slot.active = false;
            if (typeof addLog === 'function') {
                addLog(`☯️ ${def.emoji} ${def.name} scattered from neglect — the courtyard lines are gone.`);
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

function renderResidenceFormationsHtml() {
    ensureFormationState();
    const cfg = getFormationF1aConfig();
    const slotCount = getResidenceFormationSlotCount();
    const residenceLv = getResidenceLevel();
    let html = `<div class="sect-section-title">☯️ Courtyard Formations</div>`;

    if (residenceLv < 1) {
        html += `<p class="sect-hint">Upgrade to Inner Court Room to inscribe your first formation.</p>`;
        return html;
    }

    if (slotCount <= 0) {
        html += `<p class="sect-hint">No formation slots at this residence level.</p>`;
        return html;
    }

    const known = G.knownFormations
        .map(id => getFormationDef(id))
        .filter(def => def && def.deploy === 'residence' && def.implemented !== false);

    if (!known.length) {
        html += `<p class="sect-hint">No formation manuals comprehended yet. Further residence upgrades reveal patterns.</p>`;
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
        if (known.length && (!slot || slot.scattered)) {
            // Still allow replace when scattered via clear+lay; when empty show lay.
        }
        if (known.length) {
            html += `<div class="sect-formation-lay-row">`;
            known.forEach(def => {
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

    if (G.knownFormations.length) {
        html += `<div class="sect-section-title sect-section-muted">📜 Known Manuals</div><ul class="sect-formation-manual-list">`;
        G.knownFormations.forEach(id => {
            const def = getFormationDef(id);
            if (!def) return;
            const status = def.implemented === false ? ' <em>(coming soon)</em>' : '';
            html += `<li>${def.emoji} <strong>${def.name}</strong> — ${def.desc}${status}</li>`;
        });
        html += `</ul>`;
    }

    html += `<button type="button" class="sect-action-btn" id="btnResidenceCultivate">🏠 Cultivate at quarters (${ACTION_MONTHS.cultivate} months)</button>`;
    return html;
}
