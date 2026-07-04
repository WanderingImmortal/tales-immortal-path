// ============================================
// ALCHEMY.JS — Alchemy progression, crafting, economy
// ============================================

function getAlchemyMaterialDef(matId) {
    return ALCHEMY_MATERIALS[matId] || CRAFT_MATERIALS[matId] || null;
}

function getAlchemyMaterialCount(matId) {
    ensureAlchemyState();
    if (ALCHEMY_MATERIALS[matId]) return G.alchemy.materials[matId] || 0;
    return typeof getMaterialCount === 'function' ? getMaterialCount(matId) : 0;
}

function addAlchemyMaterial(matId, qty) {
    ensureAlchemyState();
    qty = qty || 1;
    if (ALCHEMY_MATERIALS[matId]) {
        G.alchemy.materials[matId] = (G.alchemy.materials[matId] || 0) + qty;
        return true;
    }
    return typeof addCraftMaterial === 'function' ? addCraftMaterial(matId, qty) : false;
}

function removeAlchemyMaterials(costs) {
    ensureAlchemyState();
    for (const [matId, qty] of Object.entries(costs || {})) {
        if (getAlchemyMaterialCount(matId) < qty) return false;
    }
    for (const [matId, qty] of Object.entries(costs || {})) {
        if (ALCHEMY_MATERIALS[matId]) {
            G.alchemy.materials[matId] -= qty;
            if (G.alchemy.materials[matId] <= 0) delete G.alchemy.materials[matId];
        } else if (typeof removeCraftMaterials === 'function') {
            removeCraftMaterials({ [matId]: qty });
        }
    }
    return true;
}

function ensureAlchemyState() {
    if (!G.alchemy) {
        G.alchemy = {
            skillXp: 0,
            skillLevel: 'apprentice',
            talents: ['awakened_cauldron'],
            activePhysique: null,
            cauldron: 'iron',
            flame: 'mortal_flame',
            reputationXp: 0,
            reputation: 'unknown',
            knownRecipes: [],
            materials: {},
            totalCrafts: 0,
            successfulCrafts: 0,
            failedCrafts: 0,
            pillSupply: {},
            selectedRecipe: null
        };
    }
    if (!G.alchemy.talents?.length) G.alchemy.talents = ['awakened_cauldron'];
    if (!G.alchemy.materials) G.alchemy.materials = {};
    if (!G.alchemy.pillSupply) G.alchemy.pillSupply = {};
    if (!G.alchemy.knownRecipes?.length) {
        G.alchemy.knownRecipes = Object.values(ALCHEMY_RECIPES)
            .filter(r => r.unlockByDefault)
            .map(r => r.id);
    }
    if (!G.alchemy.flame) G.alchemy.flame = 'mortal_flame';
    if (!G.alchemy.cauldron) G.alchemy.cauldron = 'iron';
    migrateAlchemySkillLevel();
    migrateAlchemyCauldron();
    migrateAlchemyReputation();
}

function migrateAlchemyForExistingSave() {
    ensureAlchemyState();
    const skill = getAlchemySkillLevel();
    unlockRecipesForSkill(skill);
}

function getAlchemySkillLevel() {
    ensureAlchemyState();
    let level = ALCHEMY_SKILL_LEVELS[0];
    for (const row of ALCHEMY_SKILL_LEVELS) {
        if (G.alchemy.skillXp >= row.xpRequired) level = row;
    }
    G.alchemy.skillLevel = level.id;
    return level;
}

function migrateAlchemySkillLevel() {
    getAlchemySkillLevel();
}

function getAlchemySkillDef(skillId) {
    return ALCHEMY_SKILL_LEVELS.find(s => s.id === skillId) || ALCHEMY_SKILL_LEVELS[0];
}

function getAlchemyReputationLevel() {
    ensureAlchemyState();
    let level = ALCHEMY_REPUTATION_LEVELS[0];
    for (const row of ALCHEMY_REPUTATION_LEVELS) {
        if (G.alchemy.reputationXp >= row.xpRequired) level = row;
    }
    G.alchemy.reputation = level.id;
    return level;
}

function migrateAlchemyReputation() {
    getAlchemyReputationLevel();
}

function getAlchemyCauldronDef(cauldronId) {
    return ALCHEMY_CAULDRONS.find(c => c.id === (cauldronId || G.alchemy?.cauldron)) || ALCHEMY_CAULDRONS[0];
}

function migrateAlchemyCauldron() {
    ensureAlchemyState();
    const crafts = G.alchemy.successfulCrafts || 0;
    let best = ALCHEMY_CAULDRONS[0];
    for (const c of ALCHEMY_CAULDRONS) {
        if (crafts >= c.craftsRequired) best = c;
    }
    const current = getAlchemyCauldronDef(G.alchemy.cauldron);
    if (best.craftsRequired > current.craftsRequired) G.alchemy.cauldron = best.id;
}

function getAlchemyFlameDef(flameId) {
    return ALCHEMY_FLAMES.find(f => f.id === (flameId || G.alchemy?.flame)) || ALCHEMY_FLAMES[0];
}

function hasAlchemyTalent(talentId) {
    ensureAlchemyState();
    return (G.alchemy.talents || []).includes(talentId);
}

function getAlchemyTalentBonuses() {
    ensureAlchemyState();
    const out = { successBonus: 0, firePillBonus: 0, earthPillBonus: 0, daoPillBonus: 0,
        herbYieldBonus: 0, backlashReduction: 0 };
    (G.alchemy.talents || []).forEach(id => {
        const t = ALCHEMY_TALENTS[id];
        if (!t) return;
        if (t.successBonus) out.successBonus += t.successBonus;
        if (t.firePillBonus) out.firePillBonus += t.firePillBonus;
        if (t.earthPillBonus) out.earthPillBonus += t.earthPillBonus;
        if (t.daoPillBonus) out.daoPillBonus += t.daoPillBonus;
        if (t.herbYieldBonus) out.herbYieldBonus += t.herbYieldBonus;
        if (t.backlashReduction) out.backlashReduction += t.backlashReduction;
    });
    return out;
}

function getAlchemyPhysiqueBonuses(element) {
    ensureAlchemyState();
    const phys = G.alchemy.activePhysique ? ALCHEMY_PHYSIQUES[G.alchemy.activePhysique] : null;
    if (!phys) return { successBonus: 0 };
    let bonus = 0;
    if (element === 'fire' && phys.firePillBonus) bonus += phys.firePillBonus;
    if (element === 'earth' && phys.earthPillBonus) bonus += phys.earthPillBonus;
    if ((element === 'dao' || element === 'void') && phys.daoPillBonus) bonus += phys.daoPillBonus;
    return { successBonus: bonus, physique: phys };
}

function getAlchemyFlameElementBonus(element) {
    const flame = getAlchemyFlameDef();
    if (!flame?.bonuses) return 0;
    return flame.bonuses[element] || flame.bonuses.neutral || 0;
}

function getAlchemySectBonus() {
    if (typeof getSectBuildingBonus !== 'function') return 0;
    return Math.min(25, getSectBuildingBonus('alchemySuccessPct') || 0);
}

function isRecipeKnown(recipeId) {
    ensureAlchemyState();
    return G.alchemy.knownRecipes.includes(recipeId);
}

function learnAlchemyRecipe(recipeId) {
    ensureAlchemyState();
    if (!ALCHEMY_RECIPES[recipeId]) return false;
    if (G.alchemy.knownRecipes.includes(recipeId)) return false;
    G.alchemy.knownRecipes.push(recipeId);
    const recipe = ALCHEMY_RECIPES[recipeId];
    addLog(`📜 Learned alchemy recipe: ${recipe.emoji || '⚗️'} ${recipe.name}.`);
    return true;
}

function getKnownAlchemyRecipes() {
    ensureAlchemyState();
    const skill = getAlchemySkillLevel();
    return G.alchemy.knownRecipes
        .map(id => ALCHEMY_RECIPES[id])
        .filter(r => r && getAlchemySkillDef(r.minSkill).xpRequired <= skill.xpRequired)
        .sort((a, b) => {
            const tierOrder = Object.keys(ALCHEMY_PILL_TIERS);
            const ta = tierOrder.indexOf(a.tier);
            const tb = tierOrder.indexOf(b.tier);
            if (ta !== tb) return ta - tb;
            return a.name.localeCompare(b.name);
        });
}

function getAlchemySuccessRate(recipeId) {
    const recipe = ALCHEMY_RECIPES[recipeId];
    if (!recipe) return 0;
    ensureAlchemyState();
    const tier = ALCHEMY_PILL_TIERS[recipe.tier];
    const skill = getAlchemySkillLevel();
    const cauldron = getAlchemyCauldronDef();
    const flame = getAlchemyFlameDef();
    const talents = getAlchemyTalentBonuses();
    const physique = getAlchemyPhysiqueBonuses(recipe.element);

    let rate = tier?.baseSuccess || 50;
    rate += skill.successBonus || 0;
    rate += talents.successBonus || 0;
    rate += cauldron.successBonus || 0;
    rate += flame.successBonus || 0;
    rate += getAlchemyFlameElementBonus(recipe.element);
    rate += physique.successBonus || 0;

    if (recipe.element === 'fire') rate += talents.firePillBonus || 0;
    if (recipe.element === 'earth') rate += talents.earthPillBonus || 0;
    if (recipe.element === 'dao') rate += talents.daoPillBonus || 0;

    rate += getAlchemySectBonus();

    const b = ALCHEMY_BALANCE;
    return Math.max(b.minSuccessRate, Math.min(b.maxSuccessRate, Math.round(rate)));
}

function canBrewAlchemyPill(recipeId) {
    ensureAlchemyState();
    const recipe = ALCHEMY_RECIPES[recipeId];
    if (!recipe) return { ok: false, reason: 'Unknown recipe.' };
    if (!isRecipeKnown(recipeId)) return { ok: false, reason: 'Recipe not yet learned.' };

    const skill = getAlchemySkillLevel();
    const minSkill = getAlchemySkillDef(recipe.minSkill);
    if (skill.xpRequired < minSkill.xpRequired) {
        return { ok: false, reason: `Requires ${minSkill.name} alchemy skill.` };
    }

    if (recipe.daoAlignmentMin != null && (G.daoAlignment || 0) < recipe.daoAlignmentMin) {
        return { ok: false, reason: `Requires Dao Alignment +${recipe.daoAlignmentMin}.` };
    }

    for (const [matId, qty] of Object.entries(recipe.ingredients || {})) {
        if (getAlchemyMaterialCount(matId) < qty) {
            const mat = getAlchemyMaterialDef(matId);
            return { ok: false, reason: `Need ${qty}× ${mat?.name || matId} (have ${getAlchemyMaterialCount(matId)}).` };
        }
    }

    return { ok: true, recipe };
}

function formatAlchemyIngredients(recipe) {
    return Object.entries(recipe.ingredients || {}).map(([matId, qty]) => {
        const mat = getAlchemyMaterialDef(matId);
        const have = getAlchemyMaterialCount(matId);
        const ok = have >= qty;
        return `${ok ? '✓' : '✗'} ${qty}× ${mat?.emoji || '◆'} ${mat?.name || matId} (${have})`;
    }).join(' · ');
}

function getPillMarketSupply(pillId) {
    ensureAlchemyState();
    return G.alchemy.pillSupply[pillId] || 0;
}

function adjustPillSupply(pillId, delta) {
    ensureAlchemyState();
    G.alchemy.pillSupply[pillId] = Math.max(0, (G.alchemy.pillSupply[pillId] || 0) + delta);
}

function getPillSellPrice(recipeId) {
    const recipe = ALCHEMY_RECIPES[recipeId];
    if (!recipe) return 0;
    const rep = getAlchemyReputationLevel();
    const supply = getPillMarketSupply(recipe.pillId);
    const base = recipe.marketValue || 10;
    const supplyMult = 1 / (1 + supply * ALCHEMY_BALANCE.supplyPriceFactor);
    return Math.max(1, Math.round(base * supplyMult * rep.sellMult));
}

function tickAlchemySupplyDecay(months) {
    ensureAlchemyState();
    if (!months || months <= 0) return;
    const decay = ALCHEMY_BALANCE.supplyDecayPerMonth * months;
    Object.keys(G.alchemy.pillSupply).forEach(pillId => {
        const current = G.alchemy.pillSupply[pillId] || 0;
        if (current > 0) {
            G.alchemy.pillSupply[pillId] = Math.max(0, current - decay);
        }
    });
}

function grantAlchemySkillXp(amount) {
    ensureAlchemyState();
    const before = getAlchemySkillLevel();
    G.alchemy.skillXp = (G.alchemy.skillXp || 0) + amount;
    const after = getAlchemySkillLevel();
    if (after.id !== before.id) {
        addLog(`⚗️ Alchemy skill advanced: ${before.name} → ${after.name}!`);
        unlockRecipesForSkill(after);
    }
}

function unlockRecipesForSkill(skillLevel) {
    const tiers = skillLevel.recipeUnlocks || [];
    Object.values(ALCHEMY_RECIPES).forEach(recipe => {
        if (tiers.includes(recipe.tier) && !recipe.unlockByDefault && !isRecipeKnown(recipe.id)) {
            if (getAlchemySkillDef(recipe.minSkill).xpRequired <= skillLevel.xpRequired) {
                learnAlchemyRecipe(recipe.id);
            }
        }
    });
}

function grantAlchemyReputationXp(amount) {
    ensureAlchemyState();
    const before = getAlchemyReputationLevel();
    G.alchemy.reputationXp = (G.alchemy.reputationXp || 0) + amount;
    const after = getAlchemyReputationLevel();
    if (after.id !== before.id) {
        addLog(`🏮 Alchemy reputation: ${before.name} → ${after.name}!`);
    }
}

function applyAlchemyFailureBacklash(recipe) {
    const tier = ALCHEMY_PILL_TIERS[recipe.tier];
    const b = ALCHEMY_BALANCE;
    let hpPct = b.failureBacklashHpPct[recipe.tier] || 0.08;
    const talents = getAlchemyTalentBonuses();
    if (talents.backlashReduction) hpPct *= (1 - talents.backlashReduction / 100);
    const flame = getAlchemyFlameDef();
    if (flame.backlashMult) hpPct *= flame.backlashMult;

    const dmg = Math.max(1, Math.floor(G.maxHp * hpPct));
    G.hp = Math.max(1, G.hp - dmg);
    return dmg;
}

function brewAlchemyPill(recipeId) {
    if (typeof actionBlocked === 'function' && actionBlocked()) return;
    const check = canBrewAlchemyPill(recipeId);
    if (!check.ok) {
        addLog(`⚗️ ${check.reason}`);
        if (typeof renderAlchemyChamberUI === 'function') renderAlchemyChamberUI();
        return;
    }

    const recipe = check.recipe;
    const successRate = getAlchemySuccessRate(recipeId);
    const label = `Brewing ${recipe.name}`;

    if (!advanceTime(recipe.months, label)) {
        if (typeof renderAlchemyChamberUI === 'function') renderAlchemyChamberUI();
        return;
    }

    removeAlchemyMaterials(recipe.ingredients);
    G.alchemy.totalCrafts = (G.alchemy.totalCrafts || 0) + 1;
    grantAlchemySkillXp(ALCHEMY_BALANCE.skillXpPerCraft);

    const roll = Math.random() * 100;
    const success = roll < successRate;

    if (success) {
        G.alchemy.successfulCrafts = (G.alchemy.successfulCrafts || 0) + 1;
        grantAlchemySkillXp(ALCHEMY_BALANCE.skillXpPerSuccess);
        grantAlchemyReputationXp(ALCHEMY_BALANCE.reputationXpPerSuccess);

        const cauldron = getAlchemyCauldronDef();
        const potencyNote = cauldron.potencyBonus > 0 ? ` (${cauldron.potencyBonus}% potency)` : '';
        if (typeof addPill === 'function') addPill(recipe.pillId, 1);
        adjustPillSupply(recipe.pillId, 1);
        migrateAlchemyCauldron();

        addLog(`⚗️ Success! ${recipe.emoji} ${recipe.name} refined.${potencyNote} (${successRate}% chance)`);
        if (typeof triggerAlchemyAnim === 'function') triggerAlchemyAnim('success');
    } else {
        G.alchemy.failedCrafts = (G.alchemy.failedCrafts || 0) + 1;
        const backlash = applyAlchemyFailureBacklash(recipe);
        let failMsg = `⚗️ Failure! The ${recipe.name} dissolves into ash.`;

        const partialChance = ALCHEMY_BALANCE.partialRecoveryChance;
        if (Math.random() < partialChance) {
            const entries = Object.entries(recipe.ingredients || {});
            if (entries.length) {
                const [matId, qty] = entries[Math.floor(Math.random() * entries.length)];
                const recovered = Math.max(1, Math.floor(qty / 2));
                addAlchemyMaterial(matId, recovered);
                const mat = getAlchemyMaterialDef(matId);
                failMsg += ` Recovered ${recovered}× ${mat?.name || matId}.`;
            }
        }

        failMsg += ` Backlash: −${backlash} HP. (${successRate}% chance)`;
        addLog(failMsg);

        const explosionChance = ALCHEMY_BALANCE.cauldronExplosionChance;
        if (Math.random() < explosionChance) {
            const extraDmg = Math.floor(G.maxHp * 0.05);
            G.hp = Math.max(1, G.hp - extraDmg);
            addLog(`💥 Cauldron backlash! The crucible shudders — −${extraDmg} HP.`);
        }

        if (typeof triggerAlchemyAnim === 'function') triggerAlchemyAnim('failure');
    }

    if (typeof renderAlchemyChamberUI === 'function') renderAlchemyChamberUI();
    fullRender();
}

function sellAlchemyPills(pillId, qty) {
    ensureAlchemyState();
    ensurePillStock();
    qty = qty || 1;
    const have = G.pillStock[pillId] || 0;
    if (have < qty) {
        addLog(`⚗️ Not enough pills to sell.`);
        return;
    }

    const recipe = Object.values(ALCHEMY_RECIPES).find(r => r.pillId === pillId);
    if (!recipe) {
        addLog(`⚗️ This pill cannot be sold through alchemy channels.`);
        return;
    }

    const priceEach = getPillSellPrice(recipe.id);
    const total = priceEach * qty;
    G.pillStock[pillId] -= qty;
    G.stones += total;
    grantAlchemyReputationXp(ALCHEMY_BALANCE.reputationXpPerSell * qty);
    adjustPillSupply(pillId, -qty * 0.5);

    const pill = PILL_TYPES[pillId];
    addLog(`🏮 Sold ${qty}× ${pill?.emoji || '💊'} ${pill?.name || pillId} for ${total} Spirit Stones.`);
    if (typeof renderAlchemyChamberUI === 'function') renderAlchemyChamberUI();
    fullRender();
}

function grantStarterAlchemyMaterials() {
    ensureAlchemyState();
    addAlchemyMaterial('spirit_dew', 3);
    addAlchemyMaterial('spirit_herb', 2);
}

function getAlchemyPhysiqueStatModifiers() {
    ensureAlchemyState();
    const phys = G.alchemy.activePhysique ? ALCHEMY_PHYSIQUES[G.alchemy.activePhysique] : null;
    if (!phys) return {};
    const mods = {};
    if (phys.hpPenaltyPct) mods.maxHpPct = -(phys.hpPenaltyPct);
    if (phys.defensePenaltyPct) mods.defensePct = -(phys.defensePenaltyPct);
    if (phys.dmgPenaltyPct) mods.dmgPct = -(phys.dmgPenaltyPct);
    if (phys.qiPenaltyPct) mods.maxQiPct = -(phys.qiPenaltyPct);
    return mods;
}

function setAlchemyPhysique(physiqueId) {
    ensureAlchemyState();
    if (!physiqueId) {
        G.alchemy.activePhysique = null;
        return;
    }
    if (!ALCHEMY_PHYSIQUES[physiqueId]) return;
    G.alchemy.activePhysique = physiqueId;
    const phys = ALCHEMY_PHYSIQUES[physiqueId];
    addLog(`🧬 Adopted alchemy physique: ${phys.emoji} ${phys.name}.`);
}

function discoverAlchemyTalent(talentId) {
    ensureAlchemyState();
    if (!ALCHEMY_TALENTS[talentId] || hasAlchemyTalent(talentId)) return false;
    G.alchemy.talents.push(talentId);
    const t = ALCHEMY_TALENTS[talentId];
    addLog(`✨ Discovered alchemy talent: ${t.emoji} ${t.name} — ${t.desc}`);
    return true;
}

function discoverAlchemyFlame(flameId) {
    ensureAlchemyState();
    const flame = ALCHEMY_FLAMES.find(f => f.id === flameId);
    if (!flame || flame.default) return false;
    if (!G.alchemy.discoveredFlames) G.alchemy.discoveredFlames = ['mortal_flame'];
    if (G.alchemy.discoveredFlames.includes(flameId)) return false;
    G.alchemy.discoveredFlames.push(flameId);
    addLog(`🔥 Discovered mystical flame: ${flame.emoji} ${flame.name}!`);
    return true;
}

function getDiscoveredAlchemyFlames() {
    ensureAlchemyState();
    if (!G.alchemy.discoveredFlames) G.alchemy.discoveredFlames = ['mortal_flame'];
    return G.alchemy.discoveredFlames.map(id => getAlchemyFlameDef(id));
}

function setAlchemyFlame(flameId) {
    ensureAlchemyState();
    if (!G.alchemy.discoveredFlames?.includes(flameId)) return false;
    G.alchemy.flame = flameId;
    return true;
}

function tryRollAlchemyMaterialFromExplore() {
    if (Math.random() > 0.28) return false;
    ensureAlchemyState();
    const pool = [
        { id: 'spirit_dew', weight: 30 },
        { id: 'spirit_herb', weight: 25 },
        { id: 'blood_crystal', weight: 15 },
        { id: 'soul_mist', weight: 12 },
        { id: 'earth_marrow', weight: 10 },
        { id: 'foundation_root', weight: 5 },
        { id: 'rare_herb', weight: 8 }
    ];
    const total = pool.reduce((s, p) => s + p.weight, 0);
    let roll = Math.random() * total;
    let chosen = pool[0].id;
    for (const entry of pool) {
        roll -= entry.weight;
        if (roll <= 0) { chosen = entry.id; break; }
    }
    const talents = getAlchemyTalentBonuses();
    let qty = 1;
    if (talents.herbYieldBonus && Math.random() < talents.herbYieldBonus / 100) qty = 2;
    addAlchemyMaterial(chosen, qty);
    const mat = getAlchemyMaterialDef(chosen);
    addLog(`🌿 Alchemy material: +${qty} ${mat?.emoji || ''} ${mat?.name || chosen}.`);
    return true;
}
