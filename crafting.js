// ============================================
// CRAFTING.JS — Forge gear from materials
// ============================================

function getSectForgeMonthsMult() {
    const disciples = G.disciples?.length || 0;
    const bonus = Math.min(0.2, disciples * 0.02);
    return Math.max(0.75, 1 - bonus);
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

function getAlchemyMaterialSaveChance() {
    if (typeof getSectBuildingBonus !== 'function') return 0;
    return Math.min(0.45, getSectBuildingBonus('alchemySuccessPct') / 100 * 0.35);
}

function craftGear(recipeId, options) {
    options = options || {};
    if (typeof actionBlocked === 'function' && actionBlocked()) return;
    const check = canCraftGear(recipeId, options);
    if (!check.ok) {
        addLog(`🔨 ${check.reason}`);
        fullRender();
        return;
    }
    const { recipe, def, defId } = check;
    let months = recipe.months;
    if (options.atSect) months = Math.max(1, Math.ceil(months * getSectForgeMonthsMult()));
    const label = options.atSect ? `Sect forge: ${def.name}` : `Forging ${def.name}`;
    if (!advanceTime(months, label)) {
        fullRender();
        return;
    }
    G.stones -= recipe.stones || 0;
    removeCraftMaterials(recipe.materials);
    const saveChance = getAlchemyMaterialSaveChance();
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
    const affLine = inst?.affixes?.length ? ` Affixes: ${formatAffixLine(inst)}.` : '';
    addLog(`🔨 Forged ${def.emoji} ${formatInstanceName(inst)}!${affLine}`);
    if (options.atSect && G.disciples.length) {
        addLog(`🏯 Disciples assisted — saved ${recipe.months - months} months.`);
    }
    if (typeof renderInventoryPopup === 'function') renderInventoryPopup();
    if (typeof renderSectPopup === 'function') renderSectPopup();
    fullRender();
}

function craftGearAtSect(recipeId) {
    craftGear(recipeId, { atSect: true });
}

function craftLegendaryGear(recipeId) {
    craftGear(recipeId, { legendary: true });
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
