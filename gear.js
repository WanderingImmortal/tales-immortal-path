// ============================================
// GEAR.JS — Equipment instances, affixes, sets
// ============================================

const GEAR_STAT_LABELS = {
    dmgPct: 'Damage',
    defenseBonus: 'Defense',
    maxQiBonus: 'Max Qi',
    qiDensityBonus: 'Qi Density',
    maxHpBonus: 'Max HP',
    hpRegenBonus: 'HP regen',
    staminaRegenBonus: 'Stamina regen',
    focusRegenBonus: 'Focus regen',
    spirit: 'Spirit',
    will: 'Will',
    daoSpeedPct: 'Dao speed'
};

function ensureGearState() {
    if (!G.equipment) {
        G.equipment = { weapon: null, chestplate: null, helm: null, amulet: null, ring: null, boots: null };
    }
    if (!G.materials) G.materials = {};
    GEAR_SLOT_IDS.forEach(slot => {
        if (G.equipment[slot] === undefined) G.equipment[slot] = null;
    });
    if (!G.gearInstances) {
        G.gearInstances = {};
        G.gearBag = [];
        migrateLegacyGearInventory();
    }
    if (!G.gearBag) G.gearBag = [];
}

function nextGearUid() {
    G._gearUidCounter = (G._gearUidCounter || 0) + 1;
    return `gi_${G._gearUidCounter}_${Date.now().toString(36).slice(-4)}`;
}

function getGearMaxDurability(def) {
    const tier = def?.tier || 1;
    return (GEAR_DURABILITY.base || 80) + tier * (GEAR_DURABILITY.perTier || 20);
}

function rollGearAffixes(tier, noAffix) {
    if (noAffix) return [];
    const roll = GEAR_AFFIX_ROLL[tier] || GEAR_AFFIX_ROLL[1];
    let count = roll.min;
    if (Math.random() < (roll.chance2 || 0)) count = Math.min(roll.max, roll.min + 1);
    else if (roll.max > roll.min && Math.random() < 0.5) count = roll.min + 1;
    count = Math.min(roll.max, Math.max(roll.min, count));
    const pool = Object.keys(GEAR_AFFIXES);
    const picked = [];
    while (picked.length < count && pool.length) {
        const idx = Math.floor(Math.random() * pool.length);
        const id = pool.splice(idx, 1)[0];
        if (!picked.includes(id)) picked.push(id);
    }
    return picked;
}

function createGearInstance(defId, options) {
    options = options || {};
    ensureGearState();
    const def = getGearDef(defId);
    if (!def) return null;
    const maxDur = getGearMaxDurability(def);
    const uid = nextGearUid();
    const inst = {
        uid,
        defId,
        affixes: options.affixes || rollGearAffixes(def.tier || 1, options.noAffix),
        durability: options.durability != null ? options.durability : maxDur,
        maxDurability: maxDur
    };
    G.gearInstances[uid] = inst;
    if (!options.skipBag) G.gearBag.push(uid);
    return uid;
}

function migrateLegacyGearInventory() {
    const oldInv = G.gearInventory;
    const oldEquip = { ...(G.equipment || {}) };
    if (oldInv && typeof oldInv === 'object' && !Array.isArray(oldInv)) {
        Object.entries(oldInv).forEach(([defId, qty]) => {
            for (let i = 0; i < qty; i++) createGearInstance(defId, { noAffix: true, skipBag: true });
        });
        Object.values(G.gearInstances).forEach(inst => {
            if (!G.gearBag.includes(inst.uid)) G.gearBag.push(inst.uid);
        });
    }
    GEAR_SLOT_IDS.forEach(slot => {
        const val = oldEquip[slot];
        if (!val) {
            G.equipment[slot] = null;
            return;
        }
        if (G.gearInstances[val]) {
            G.equipment[slot] = val;
            const idx = G.gearBag.indexOf(val);
            if (idx >= 0) G.gearBag.splice(idx, 1);
            return;
        }
        if (getGearDef(val)) {
            const bagIdx = G.gearBag.findIndex(uid => G.gearInstances[uid]?.defId === val);
            if (bagIdx >= 0) {
                G.equipment[slot] = G.gearBag.splice(bagIdx, 1)[0];
            } else {
                G.equipment[slot] = createGearInstance(val, { noAffix: true, skipBag: true });
            }
        } else {
            G.equipment[slot] = null;
        }
    });
    G.gearInventory = null;
}

function getGearInstance(uid) {
    ensureGearState();
    return uid ? G.gearInstances[uid] || null : null;
}

function getEquippedInstance(slot) {
    ensureGearState();
    return getGearInstance(G.equipment[slot]);
}

function getInstanceDef(inst) {
    return inst ? getGearDef(inst.defId) : null;
}

function getGearDef(defId) {
    return GEAR_ITEMS[defId] || null;
}

function getEquippedGearDef(slot) {
    return getInstanceDef(getEquippedInstance(slot));
}

function getGearBagCount() {
    ensureGearState();
    return G.gearBag.length;
}

function getGearInventoryCount(defId) {
    ensureGearState();
    let count = G.gearBag.filter(uid => G.gearInstances[uid]?.defId === defId).length;
    GEAR_SLOT_IDS.forEach(slot => {
        const inst = getEquippedInstance(slot);
        if (inst?.defId === defId) count++;
    });
    return count;
}

function addGearToInventory(defId, qty, options) {
    options = options || {};
    qty = qty || 1;
    if (!getGearDef(defId)) return false;
    for (let i = 0; i < qty; i++) createGearInstance(defId, options);
    return true;
}

function removeGearFromBag(uid) {
    ensureGearState();
    const idx = G.gearBag.indexOf(uid);
    if (idx < 0) return false;
    G.gearBag.splice(idx, 1);
    return true;
}

function addCraftMaterial(matId, qty) {
    ensureGearState();
    qty = qty || 1;
    if (!CRAFT_MATERIALS[matId]) return false;
    G.materials[matId] = (G.materials[matId] || 0) + qty;
    return true;
}

function removeCraftMaterials(costs) {
    ensureGearState();
    for (const [matId, qty] of Object.entries(costs || {})) {
        if ((G.materials[matId] || 0) < qty) return false;
    }
    for (const [matId, qty] of Object.entries(costs || {})) {
        G.materials[matId] -= qty;
        if (G.materials[matId] <= 0) delete G.materials[matId];
    }
    return true;
}

function getMaterialCount(matId) {
    ensureGearState();
    return G.materials[matId] || 0;
}

function mergeStatBlock(target, source, mult) {
    mult = mult != null ? mult : 1;
    if (!source) return;
    Object.entries(source).forEach(([key, val]) => {
        if (typeof val === 'number') {
            target[key] = (target[key] || 0) + val * mult;
        }
    });
}

function getDurabilityMult(inst) {
    if (!inst) return 1;
    const pct = inst.durability / Math.max(1, inst.maxDurability);
    if (pct <= 0) return GEAR_DURABILITY.brokenMult || 0.55;
    if (pct >= 0.2) return 1;
    return 0.55 + pct * 2.25;
}

function sumInstanceStats(inst, includeResonance) {
    const stats = {};
    const def = getInstanceDef(inst);
    if (!def) return stats;
    const mult = getDurabilityMult(inst);
    mergeStatBlock(stats, def.stats, mult);
    (inst.affixes || []).forEach(affId => {
        mergeStatBlock(stats, GEAR_AFFIXES[affId]?.stats, mult);
    });
    if (includeResonance !== false) {
        mergeStatBlock(stats, def.resonance?.[G.path], mult);
    }
    return stats;
}

function countEquippedSetPieces(setId) {
    if (!setId) return 0;
    let count = 0;
    GEAR_SLOT_IDS.forEach(slot => {
        const def = getInstanceDef(getEquippedInstance(slot));
        if (def?.gearSet === setId) count++;
    });
    return count;
}

function getActiveGearSetBonuses() {
    const totals = {};
    const seen = new Set();
    GEAR_SLOT_IDS.forEach(slot => {
        const def = getInstanceDef(getEquippedInstance(slot));
        const setId = def?.gearSet;
        if (!setId || seen.has(setId)) return;
        seen.add(setId);
        const setDef = GEAR_SETS[setId];
        if (!setDef) return;
        const count = countEquippedSetPieces(setId);
        [3, 2].forEach(threshold => {
            if (count >= threshold && setDef.bonuses?.[threshold]) {
                mergeStatBlock(totals, setDef.bonuses[threshold]);
            }
        });
    });
    return totals;
}

function formatGearBonusSummary() {
    const b = getGearBonuses();
    const parts = [];
    Object.entries(GEAR_STAT_LABELS).forEach(([key, label]) => {
        const v = b[key];
        if (v == null || v === 0) return;
        const suffix = key.includes('Pct') ? '%' : '';
        parts.push(`+${v}${suffix} ${label}`);
    });
    return parts.length ? parts.join(' · ') : 'No bonuses from equipped gear.';
}

function formatGearBonusPanelHtml() {
    const b = getGearBonuses();
    const rows = Object.entries(GEAR_STAT_LABELS).map(([key, label]) => {
        const v = b[key];
        if (v == null || v === 0) return '';
        const suffix = key.includes('Pct') ? '%' : '';
        return `<div class="gear-bonus-row"><span class="gear-bonus-label">${label}</span><span class="gear-bonus-val">+${v}${suffix}</span></div>`;
    }).filter(Boolean);
    if (!rows.length) {
        return `<div class="gear-bonus-panel empty"><div class="gear-bonus-title">⚔️ Gear Bonuses</div><div class="gear-bonus-empty">Equip gear to boost stats.</div></div>`;
    }
    return `<div class="gear-bonus-panel"><div class="gear-bonus-title">⚔️ Gear Bonuses (equipped)</div>${rows.join('')}</div>`;
}

function getGearBonuses() {
    ensureGearState();
    const b = {
        dmgPct: 0,
        defenseBonus: 0,
        maxQiBonus: 0,
        qiDensityBonus: 0,
        maxHpBonus: 0,
        hpRegenBonus: 0,
        staminaRegenBonus: 0,
        focusRegenBonus: 0,
        spirit: 0,
        will: 0,
        daoSpeedPct: 0
    };

    GEAR_SLOT_IDS.forEach(slot => {
        mergeStatBlock(b, sumInstanceStats(getEquippedInstance(slot)));
    });
    mergeStatBlock(b, getActiveGearSetBonuses());
    return b;
}

function getGearDamageMult() {
    const pct = getGearBonuses().dmgPct || 0;
    return 1 + pct / 100;
}

function getGearDefenseBonus() {
    return getGearBonuses().defenseBonus || 0;
}

function getGearDaoSpeedMult() {
    const pct = getGearBonuses().daoSpeedPct || 0;
    return 1 + pct / 100;
}

function getWeaponTechniqueSynergyMult(tech) {
    const inst = getEquippedInstance('weapon');
    const def = getInstanceDef(inst);
    if (!def?.weaponType || !tech?.weaponType) return 1;
    if (def.weaponType === tech.weaponType) return 1.12;
    if (tech.weaponType === 'fist') return 1.05;
    return 1;
}

function getEffectiveMaxHp() {
    let hp = G.maxHp + (getGearBonuses().maxHpBonus || 0);
    if (typeof getScarDown === 'function') {
        hp = Math.floor(hp * (1 + getScarDown('maxHpPct', 0)));
    }
    if (typeof getBodyChamberMaxHpMult === 'function') {
        hp = Math.floor(hp * getBodyChamberMaxHpMult());
    }
    if (typeof getBodyChamberFlatHp === 'function') {
        hp += getBodyChamberFlatHp();
    }
    return Math.max(20, hp);
}

function getPathResonanceLabel() {
    const labels = { qi: 'Qi Flow', body: 'Iron Body', soul: 'Soul Focus' };
    return labels[G.path] || 'Path';
}

function formatGearResonanceLine(def) {
    if (!def?.resonance?.[G.path]) return '';
    const r = def.resonance[G.path];
    const parts = [];
    if (r.maxQiBonus) parts.push(`+${r.maxQiBonus} Max Qi`);
    if (r.qiDensityBonus) parts.push(`+${r.qiDensityBonus} Density`);
    if (r.maxHpBonus) parts.push(`+${r.maxHpBonus} HP`);
    if (r.defenseBonus) parts.push(`+${r.defenseBonus} Def`);
    if (r.dmgPct) parts.push(`+${r.dmgPct}% Dmg`);
    if (r.staminaRegenBonus) parts.push(`+${r.staminaRegenBonus} Stamina regen`);
    if (r.focusRegenBonus) parts.push(`+${r.focusRegenBonus} Focus regen`);
    if (r.spirit) parts.push(`+${r.spirit} Spirit`);
    if (r.will) parts.push(`+${r.will} Will`);
    if (r.daoSpeedPct) parts.push(`+${r.daoSpeedPct}% Dao speed`);
    return parts.join(' · ');
}

function formatAffixLine(inst) {
    if (!inst?.affixes?.length) return '';
    return inst.affixes.map(id => GEAR_AFFIXES[id]?.label || id).join(', ');
}

function formatDurabilityLine(inst) {
    if (!inst) return '';
    const pct = Math.round((inst.durability / Math.max(1, inst.maxDurability)) * 100);
    const cls = pct <= 20 ? 'gear-dur-low' : pct <= 50 ? 'gear-dur-mid' : '';
    return `<span class="gear-dur ${cls}">Durability ${inst.durability}/${inst.maxDurability}</span>`;
}

function formatInstanceName(inst) {
    const def = getInstanceDef(inst);
    if (!def) return 'Unknown';
    const aff = formatAffixLine(inst);
    return aff ? `${def.name} (${aff})` : def.name;
}

function formatStatDelta(val, key) {
    if (!val || Math.abs(val) < 0.001) return '';
    const label = GEAR_STAT_LABELS[key] || key;
    if (key === 'qiDensityBonus') return `${val > 0 ? '+' : ''}${val.toFixed(2)} ${label}`;
    if (key === 'dmgPct' || key === 'daoSpeedPct') return `${val > 0 ? '+' : ''}${Math.round(val * 10) / 10}% ${label}`;
    return `${val > 0 ? '+' : ''}${Math.round(val * 10) / 10} ${label}`;
}

function compareGearStats(candidateUid, slot) {
    const cand = getGearInstance(candidateUid);
    if (!cand) return [];
    const def = getInstanceDef(cand);
    if (!def || def.slot !== slot) return [];
    const candStats = sumInstanceStats(cand);
    const eqInst = getEquippedInstance(slot);
    const eqStats = eqInst ? sumInstanceStats(eqInst) : {};
    const keys = new Set([...Object.keys(candStats), ...Object.keys(eqStats)]);
    const lines = [];
    keys.forEach(key => {
        const delta = (candStats[key] || 0) - (eqStats[key] || 0);
        if (Math.abs(delta) < 0.001) return;
        const cls = delta > 0 ? 'gear-compare-up' : 'gear-compare-down';
        lines.push({ key, delta, text: formatStatDelta(delta, key), cls });
    });
    return lines;
}

function formatCompareHtml(lines) {
    if (!lines.length) return '<span class="gear-compare-neutral">≈ same as equipped</span>';
    return lines.map(l => `<span class="${l.cls}">${l.text}</span>`).join(' · ');
}

function getActiveGearSetsDisplay() {
    const rows = [];
    const seen = new Set();
    GEAR_SLOT_IDS.forEach(slot => {
        const def = getInstanceDef(getEquippedInstance(slot));
        const setId = def?.gearSet;
        if (!setId || seen.has(setId)) return;
        seen.add(setId);
        const setDef = GEAR_SETS[setId];
        if (!setDef) return;
        const count = countEquippedSetPieces(setId);
        rows.push({ setDef, count, active2: count >= 2, active3: count >= 3 });
    });
    return rows;
}

function equipGear(uidOrDefId) {
    ensureGearState();
    let uid = uidOrDefId;
    let inst = getGearInstance(uid);
    if (!inst && getGearDef(uidOrDefId)) {
        const idx = G.gearBag.findIndex(id => G.gearInstances[id]?.defId === uidOrDefId);
        if (idx < 0) return { success: false, message: 'You do not carry that item.' };
        uid = G.gearBag[idx];
        inst = getGearInstance(uid);
    }
    const def = getInstanceDef(inst);
    if (!def) return { success: false, message: 'Unknown gear.' };
    if (!G.gearBag.includes(uid) && !GEAR_SLOT_IDS.some(s => G.equipment[s] === uid)) {
        return { success: false, message: 'You do not carry that item.' };
    }

    const slot = def.slot;
    if (G.equipment[slot] && G.equipment[slot] !== uid) {
        G.gearBag.push(G.equipment[slot]);
    }
    removeGearFromBag(uid);
    G.equipment[slot] = uid;
    clampCurrentQi();
    return { success: true, message: `Equipped ${formatInstanceName(inst)}.` };
}

function unequipGear(slot) {
    ensureGearState();
    if (!GEAR_SLOT_IDS.includes(slot)) return { success: false, message: 'Invalid slot.' };
    const uid = G.equipment[slot];
    if (!uid) return { success: false, message: 'Nothing equipped there.' };
    G.gearBag.push(uid);
    G.equipment[slot] = null;
    clampCurrentQi();
    const inst = getGearInstance(uid);
    return { success: true, message: `Stored ${formatInstanceName(inst)}.` };
}

function wearEquippedGear(amount) {
    ensureGearState();
    amount = amount || GEAR_DURABILITY.combatWear || 3;
    GEAR_SLOT_IDS.forEach(slot => {
        const inst = getEquippedInstance(slot);
        if (!inst) return;
        inst.durability = Math.max(0, inst.durability - amount);
    });
}

function getRepairCost(inst) {
    if (!inst) return null;
    const missing = inst.maxDurability - inst.durability;
    if (missing <= 0) return null;
    const chunks = Math.ceil(missing / 10);
    return {
        months: chunks * (GEAR_REPAIR.monthsPer10 || 1),
        stones: chunks * (GEAR_REPAIR.stonesPer10 || 2),
        iron: chunks * (GEAR_REPAIR.ironPer10 || 1),
        restore: missing
    };
}

function repairGear(uid) {
    if (typeof actionBlocked === 'function' && actionBlocked()) return { success: false };
    ensureGearState();
    const inst = getGearInstance(uid);
    if (!inst) return { success: false, message: 'Item not found.' };
    const cost = getRepairCost(inst);
    if (!cost) return { success: false, message: 'Nothing to repair.' };
    if (G.stones < cost.stones) return { success: false, message: `Need ${cost.stones} Stones.` };
    if (getMaterialCount('iron_ore') < cost.iron) return { success: false, message: `Need ${cost.iron}× Iron Ore.` };
    beginActionLog();
    if (!advanceTime(cost.months, `Repairing ${getInstanceDef(inst)?.name || 'gear'}`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends...' };
    }
    G.stones -= cost.stones;
    removeCraftMaterials({ iron_ore: cost.iron });
    inst.durability = inst.maxDurability;
    const name = formatInstanceName(inst);
    const msg = `🔧 Repaired ${name}.`;
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

function grantStarterGear() {
    ensureGearState();
    const starterId = PATH_STARTER_GEAR[G.path] || 'leather_vest';
    addGearToInventory(starterId, 1, { noAffix: true });
    addGearToInventory('travel_sandals', 1, { noAffix: true });
    addCraftMaterial('iron_ore', 3);
    addCraftMaterial('leather_scrap', 2);
    addCraftMaterial('spirit_herb', 2);
    addCraftMaterial('silk_thread', 2);
    const starterUid = G.gearBag.find(uid => G.gearInstances[uid]?.defId === starterId);
    if (starterUid) equipGear(starterUid);
}

function buyMerchantGear(gearId) {
    const zoneId = typeof getActiveZoneId === 'function' ? getActiveZoneId() : (G.currentZone || currentZone);
    const stock = MERCHANT_GEAR_STOCK[zoneId];
    if (!stock) return { success: false, message: 'No gear sold here.' };
    const item = stock.find(s => s.gearId === gearId);
    if (!item) return { success: false, message: 'Not sold here.' };
    const def = getGearDef(gearId);
    if (!def) return { success: false, message: 'Unknown item.' };
    if (item.reqRealm != null && G.realmIdx < item.reqRealm) {
        return { success: false, message: 'Your realm is too low.' };
    }
    if (G.stones < item.price) return { success: false, message: `Need ${item.price} Stones.` };
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.market, `Purchasing ${def.name}`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends...' };
    }
    G.stones -= item.price;
    addGearToInventory(gearId, 1, { noAffix: true });
    const msg = `🏪 Purchased ${def.emoji} ${def.name} for ${item.price} Stones.`;
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

function mapExploreLootToCraftMaterial(lootName) {
    return EXPLORE_CRAFT_MATERIAL_MAP[lootName] || null;
}

function applyExploreCraftMaterial(lootName) {
    const matId = mapExploreLootToCraftMaterial(lootName);
    if (!matId) return false;
    addCraftMaterial(matId, 1);
    const mat = CRAFT_MATERIALS[matId];
    addLog(`⛏️ Craft material: +1 ${mat?.name || matId}`);
    return true;
}

function migrateGearForExistingSave() {
    ensureGearState();
    if (G.gearMigrated) return;
    if (!G.materials || Object.keys(G.materials).length === 0) {
        addCraftMaterial('iron_ore', 2);
        addCraftMaterial('spirit_herb', 1);
    }
    G.gearMigrated = true;
}
