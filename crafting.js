// ============================================
// CRAFTING.JS — Forge gear from materials
// ============================================

function ensureForgeState() {
    if (!G.forge) {
        G.forge = {
            skillXp: 0,
            skillLevel: 'apprentice',
            anvil: 'iron',
            successfulForges: 0,
            totalForges: 0,
            failedLegendary: 0,
            knownRecipes: [],
            selectedRecipe: null,
            selectedLegendary: null,
            activeTab: 'standard',
            atSect: false
        };
    }
    if (!G.forge.knownRecipes?.length) {
        G.forge.knownRecipes = Object.keys(GEAR_CRAFT_RECIPES);
    }
    if (!G.forge.anvil) G.forge.anvil = 'iron';
    migrateForgeSkillLevel();
    migrateForgeAnvil();
}

function migrateForgeForExistingSave() {
    ensureForgeState();
}

function migrateForgeSkillLevel() {
    if (!G.forge) return;
    let level = FORGE_SKILL_LEVELS[0];
    for (const row of FORGE_SKILL_LEVELS) {
        if (G.forge.skillXp >= row.xpRequired) level = row;
    }
    G.forge.skillLevel = level.id;
}

function getForgeSkillLevel() {
    ensureForgeState();
    let level = FORGE_SKILL_LEVELS[0];
    for (const row of FORGE_SKILL_LEVELS) {
        if (G.forge.skillXp >= row.xpRequired) level = row;
    }
    G.forge.skillLevel = level.id;
    return level;
}

function getForgeAnvilDef(anvilId) {
    return FORGE_ANVILS.find(a => a.id === (anvilId || G.forge?.anvil)) || FORGE_ANVILS[0];
}

function migrateForgeAnvil() {
    if (!G.forge) return;
    const forges = G.forge.successfulForges || 0;
    let best = FORGE_ANVILS[0];
    for (const a of FORGE_ANVILS) {
        if (forges >= a.forgesRequired) best = a;
    }
    const current = getForgeAnvilDef(G.forge.anvil);
    if (best.forgesRequired > current.forgesRequired) G.forge.anvil = best.id;
}

function grantForgeSkillXp(amount) {
    ensureForgeState();
    const before = getForgeSkillLevel();
    G.forge.skillXp = (G.forge.skillXp || 0) + amount;
    const after = getForgeSkillLevel();
    if (after.id !== before.id) {
        addLog(`🔨 Forge skill advanced: ${before.name} → ${after.name}!`);
    }
}

function getForgeAffixBonusPct() {
    const skill = getForgeSkillLevel();
    const anvil = getForgeAnvilDef();
    const armory = typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('armoryForgeAffixPct') : 0;
    return (skill.affixBonus || 0) + (anvil.affixBonus || 0) + armory;
}

function getForgeMaterialSaveChance() {
    if (typeof getSectBuildingBonus !== 'function') return 0;
    return Math.min(0.45, getSectBuildingBonus('alchemySuccessPct') / 100 * 0.35);
}

function getAlchemyMaterialSaveChance() {
    return getForgeMaterialSaveChance();
}

function getArmoryForgeMonthsPct() {
    return typeof getSectBuildingBonus === 'function' ? (getSectBuildingBonus('armoryForgePct') || 0) : 0;
}

function getSectForgeMonthsMult() {
    const disciples = G.disciples?.length || 0;
    const bonus = Math.min(0.2, disciples * 0.02);
    return Math.max(0.75, 1 - bonus);
}

function getEffectiveForgeMonths(baseMonths, options) {
    options = options || {};
    let months = baseMonths;
    if (options.atSect) months *= getSectForgeMonthsMult();
    const skill = getForgeSkillLevel();
    months *= 1 - (skill.monthsReductionPct || 0) / 100;
    const anvil = getForgeAnvilDef();
    months *= 1 - (anvil.monthsReductionPct || 0) / 100;
    months *= 1 - getArmoryForgeMonthsPct() / 100;
    return Math.max(1, Math.ceil(months));
}

function getLegendaryForgeSuccessRate() {
    const skill = getForgeSkillLevel();
    const skillIdx = FORGE_SKILL_LEVELS.findIndex(s => s.id === skill.id);
    return Math.min(95, FORGE_BALANCE.legendaryBaseSuccess + skillIdx * FORGE_BALANCE.legendarySkillBonus);
}

function getExpectedAffixRange(tier) {
    const roll = GEAR_AFFIX_ROLL[tier] || GEAR_AFFIX_ROLL[1];
    return `${roll.min}–${roll.max} affix${roll.max !== 1 ? 'es' : ''}`;
}

function applyForgeInstanceBonuses(inst) {
    if (!inst) return;
    const skill = getForgeSkillLevel();
    const durPct = skill.durabilityBonus || 0;
    if (durPct > 0) {
        const extra = Math.floor(inst.maxDurability * durPct / 100);
        inst.maxDurability += extra;
        inst.durability += extra;
    }
    const bonusPct = getForgeAffixBonusPct();
    if (bonusPct > 0 && inst.affixes?.length === 0 && Math.random() * 100 < bonusPct) {
        const pool = Object.keys(GEAR_AFFIXES);
        const id = pool[Math.floor(Math.random() * pool.length)];
        if (id) inst.affixes = [id];
    } else if (bonusPct > 0 && inst.affixes?.length === 1 && Math.random() * 100 < bonusPct * 0.5) {
        const pool = Object.keys(GEAR_AFFIXES).filter(id => !inst.affixes.includes(id));
        if (pool.length) {
            inst.affixes.push(pool[Math.floor(Math.random() * pool.length)]);
        }
    }
}

function canCraftGear(recipeId, options) {
    options = options || {};
    ensureGearState();
    const recipe = options.legendary ? LEGENDARY_GEAR_RECIPES[recipeId] : GEAR_CRAFT_RECIPES[recipeId];
    const defId = options.legendary ? recipe?.output : recipeId;
    const def = GEAR_ITEMS[defId];
    if (!recipe || !def) return { ok: false, reason: 'Unknown recipe.' };
    if (G.stones < (recipe.stones || 0)) {
        return { ok: false, reason: `Need ${recipe.stones} Stones.` };
    }
    for (const [matId, qty] of Object.entries(recipe.materials || {})) {
        if (getMaterialCount(matId) < qty) {
            const mat = CRAFT_MATERIALS[matId];
            return { ok: false, reason: `Need ${qty}× ${mat?.name || matId}.` };
        }
    }
    if (recipe.consumesLegendary) {
        const legends = G.legendaryMaterials || [];
        if (!legends.includes(recipe.consumesLegendary)) {
            return { ok: false, reason: `Need legendary: ${recipe.consumesLegendary}.` };
        }
    }
    return { ok: true, recipe, def, defId };
}

function formatRecipeMaterials(recipe) {
    return Object.entries(recipe.materials || {}).map(([matId, qty]) => {
        const mat = CRAFT_MATERIALS[matId];
        const have = getMaterialCount(matId);
        const ok = have >= qty;
        return `${ok ? '✓' : '✗'} ${qty}× ${mat?.emoji || '◆'} ${mat?.name || matId} (${have})`;
    }).join(' · ');
}

function removeHalfCraftMaterials(materials) {
    for (const [matId, qty] of Object.entries(materials || {})) {
        const half = Math.ceil(qty / 2);
        if (half > 0) removeCraftMaterials({ [matId]: half });
    }
}

function craftGear(recipeId, options) {
    options = options || {};
    if (typeof actionBlocked === 'function' && actionBlocked() && !G.inForgeChamber) return { ok: false };
    const check = canCraftGear(recipeId, options);
    if (!check.ok) {
        addLog(`🔨 ${check.reason}`);
        if (typeof renderForgeChamberUI === 'function') renderForgeChamberUI();
        fullRender();
        return { ok: false, reason: check.reason };
    }
    const { recipe, def, defId } = check;
    const atSect = options.atSect || (G.forge?.atSect && G.sect);
    const months = getEffectiveForgeMonths(recipe.months, { atSect });
    const label = atSect ? `Sect forge: ${def.name}` : `Forging ${def.name}`;

    if (!advanceTime(months, label)) {
        if (typeof renderForgeChamberUI === 'function') renderForgeChamberUI();
        fullRender();
        return { ok: false };
    }

    G.stones -= recipe.stones || 0;
    ensureForgeState();
    G.forge.totalForges = (G.forge.totalForges || 0) + 1;
    grantForgeSkillXp(FORGE_BALANCE.skillXpPerForge);

    if (options.legendary) {
        const rate = getLegendaryForgeSuccessRate();
        if (Math.random() * 100 >= rate) {
            removeHalfCraftMaterials(recipe.materials);
            G.forge.failedLegendary = (G.forge.failedLegendary || 0) + 1;
            grantForgeSkillXp(1);
            addLog(`🔨 Legendary forge failed (${rate}% chance)! Slag claims half your materials.`);
            if (typeof triggerForgeAnim === 'function') triggerForgeAnim('failure');
            if (typeof renderForgeChamberUI === 'function') renderForgeChamberUI();
            if (typeof renderInventoryPopup === 'function') renderInventoryPopup();
            fullRender();
            return { ok: false, failed: true };
        }
    }

    removeCraftMaterials(recipe.materials);
    const saveChance = getForgeMaterialSaveChance();
    if (saveChance > 0 && Math.random() < saveChance) {
        const entries = Object.entries(recipe.materials || {});
        if (entries.length && typeof addCraftMaterial === 'function') {
            const [matId] = entries[Math.floor(Math.random() * entries.length)];
            addCraftMaterial(matId, 1);
            const matName = CRAFT_MATERIALS[matId]?.name || matId;
            addLog(`⚗️ Alchemy Lab conserved 1× ${matName}.`);
        }
    }
    if (recipe.consumesLegendary) {
        const idx = (G.legendaryMaterials || []).indexOf(recipe.consumesLegendary);
        if (idx >= 0) G.legendaryMaterials.splice(idx, 1);
    }

    const uid = createGearInstance(defId, { noAffix: options.noAffix });
    const inst = getGearInstance(uid);
    applyForgeInstanceBonuses(inst);

    G.forge.successfulForges = (G.forge.successfulForges || 0) + 1;
    grantForgeSkillXp(FORGE_BALANCE.skillXpPerSuccess);
    const prevAnvil = getForgeAnvilDef();
    migrateForgeAnvil();
    const newAnvil = getForgeAnvilDef();
    if (newAnvil.id !== prevAnvil.id) {
        addLog(`🔨 Your anvil ascends: ${prevAnvil.name} → ${newAnvil.name}!`);
    }

    const affLine = inst?.affixes?.length ? ` Affixes: ${formatAffixLine(inst)}.` : '';
    addLog(`🔨 Forged ${def.emoji} ${formatInstanceName(inst)}!${affLine}`);
    if (atSect && G.disciples?.length) {
        const saved = recipe.months - months;
        if (saved > 0) addLog(`🏯 Disciples assisted — saved ${saved} months.`);
    }
    if (typeof triggerForgeAnim === 'function') triggerForgeAnim('success');
    if (typeof renderForgeChamberUI === 'function') renderForgeChamberUI();
    if (typeof renderInventoryPopup === 'function') renderInventoryPopup();
    if (typeof renderSectPopup === 'function') renderSectPopup();
    fullRender();
    return { ok: true, uid };
}

function craftGearAtSect(recipeId) {
    return craftGear(recipeId, { atSect: true });
}

function craftLegendaryGear(recipeId) {
    return craftGear(recipeId, { legendary: true });
}

function forgeRepairGear(uid) {
    const result = repairGear(uid, { fromForgeChamber: true });
    if (result.success && typeof triggerForgeAnim === 'function') triggerForgeAnim('repair');
    if (typeof renderForgeChamberUI === 'function') renderForgeChamberUI();
    return result;
}

function getCraftableRecipes() {
    return Object.keys(GEAR_CRAFT_RECIPES)
        .map(id => ({ id, def: GEAR_ITEMS[id], recipe: GEAR_CRAFT_RECIPES[id], legendary: false }))
        .filter(entry => entry.def && entry.recipe)
        .sort((a, b) => (a.recipe.tier || 0) - (b.recipe.tier || 0));
}

function getLegendaryGearRecipes() {
    return Object.keys(LEGENDARY_GEAR_RECIPES)
        .map(id => {
            const recipe = LEGENDARY_GEAR_RECIPES[id];
            return { id, def: GEAR_ITEMS[recipe.output], recipe, legendary: true };
        })
        .filter(entry => entry.def && entry.recipe);
}

function getForgeRepairCandidates() {
    ensureGearState();
    const out = [];
    GEAR_SLOT_IDS.forEach(slot => {
        const inst = getEquippedInstance(slot);
        if (inst && getRepairCost(inst)) {
            out.push({ uid: inst.uid, inst, def: getInstanceDef(inst), slot, equipped: true });
        }
    });
    (G.gearBag || []).forEach(uid => {
        const inst = getGearInstance(uid);
        if (inst && getRepairCost(inst)) {
            out.push({ uid, inst, def: getInstanceDef(inst), slot: null, equipped: false });
        }
    });
    return out;
}
