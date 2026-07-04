// ============================================
// ALCHEMY-CHAMBER.JS — Alchemy Chamber immersive UI
// ============================================

function alchemyChamberBlocked() {
    return G.gameOver || G.inCombat
        || G.inQiChamber || G.inBodyChamber || G.inSoulChamber
        || (typeof isTribulationActive === 'function' && isTribulationActive())
        || (typeof isTranscendencePerkPending === 'function' && isTranscendencePerkPending());
}

function openAlchemyChamber() {
    if (alchemyChamberBlocked()) return;
    ensureAlchemyState();
    G.inAlchemyChamber = true;
    if (!G.alchemy.selectedRecipe) {
        const recipes = getKnownAlchemyRecipes();
        if (recipes.length) G.alchemy.selectedRecipe = recipes[0].id;
    }
    document.getElementById('alchemyChamberOverlay')?.classList.add('active');
    renderAlchemyChamberUI();
}

function closeAlchemyChamber() {
    G.inAlchemyChamber = false;
    document.getElementById('alchemyChamberOverlay')?.classList.remove('active');
    fullRender();
}

function triggerAlchemyAnim(kind) {
    const stage = document.getElementById('alchemyCauldronStage');
    if (!stage) return;
    stage.classList.remove('alchemy-anim-brewing', 'alchemy-anim-success', 'alchemy-anim-failure');
    void stage.offsetWidth;
    const cls = {
        brewing: 'alchemy-anim-brewing',
        success: 'alchemy-anim-success',
        failure: 'alchemy-anim-failure'
    }[kind];
    if (!cls) return;
    stage.classList.add(cls);
    setTimeout(() => stage.classList.remove(cls), 1800);
}

function renderAlchemyCauldronVisual() {
    const flame = getAlchemyFlameDef();
    const cauldron = getAlchemyCauldronDef();
    const flameEl = document.getElementById('alchemyFlameVisual');
    const cauldronEl = document.getElementById('alchemyCauldronVisual');
    if (flameEl) {
        flameEl.textContent = flame.emoji || '🔥';
        flameEl.dataset.flame = flame.id;
    }
    if (cauldronEl) {
        cauldronEl.textContent = cauldron.emoji || '⚗️';
        cauldronEl.dataset.cauldron = cauldron.id;
    }
}

function renderAlchemyStatusPanel() {
    ensureAlchemyState();
    const skill = getAlchemySkillLevel();
    const rep = getAlchemyReputationLevel();
    const cauldron = getAlchemyCauldronDef();
    const flame = getAlchemyFlameDef();
    const talents = (G.alchemy.talents || [])
        .map(id => ALCHEMY_TALENTS[id])
        .filter(Boolean);
    const physique = G.alchemy.activePhysique ? ALCHEMY_PHYSIQUES[G.alchemy.activePhysique] : null;

    const skillIdx = ALCHEMY_SKILL_LEVELS.findIndex(s => s.id === skill.id);
    const nextSkill = ALCHEMY_SKILL_LEVELS[skillIdx + 1];
    const skillProgress = nextSkill
        ? Math.min(100, Math.round((G.alchemy.skillXp / nextSkill.xpRequired) * 100))
        : 100;

    const repIdx = ALCHEMY_REPUTATION_LEVELS.findIndex(r => r.id === rep.id);
    const nextRep = ALCHEMY_REPUTATION_LEVELS[repIdx + 1];
    const repProgress = nextRep
        ? Math.min(100, Math.round((G.alchemy.reputationXp / nextRep.xpRequired) * 100))
        : 100;

    const el = document.getElementById('alchemyStatusPanel');
    if (!el) return;

    el.innerHTML = `
        <div class="alchemy-status-grid">
            <div class="alchemy-status-card">
                <span class="alchemy-status-label">Skill</span>
                <span class="alchemy-status-value">⚗️ ${skill.name}</span>
                <span class="alchemy-status-sub">+${skill.successBonus}% success · ${G.alchemy.successfulCrafts || 0} refined</span>
                <div class="alchemy-mini-bar"><div class="alchemy-mini-fill" style="width:${skillProgress}%"></div></div>
            </div>
            <div class="alchemy-status-card">
                <span class="alchemy-status-label">Reputation</span>
                <span class="alchemy-status-value">🏮 ${rep.name}</span>
                <span class="alchemy-status-sub">Sell ×${rep.sellMult.toFixed(2)}</span>
                <div class="alchemy-mini-bar"><div class="alchemy-mini-fill alchemy-mini-fill-rep" style="width:${repProgress}%"></div></div>
            </div>
            <div class="alchemy-status-card">
                <span class="alchemy-status-label">Cauldron</span>
                <span class="alchemy-status-value">${cauldron.emoji} ${cauldron.name}</span>
                <span class="alchemy-status-sub">+${cauldron.successBonus}% · +${cauldron.potencyBonus}% potency</span>
            </div>
            <div class="alchemy-status-card">
                <span class="alchemy-status-label">Flame</span>
                <span class="alchemy-status-value">${flame.emoji} ${flame.name}</span>
                <span class="alchemy-status-sub">+${flame.successBonus}% base</span>
            </div>
        </div>
        <div class="alchemy-talent-row">
            <span class="alchemy-status-label">Talents</span>
            <span class="alchemy-talent-chips">${talents.map(t =>
                `<span class="alchemy-talent-chip" title="${t.desc}">${t.emoji} ${t.name}</span>`
            ).join('') || '<span class="alchemy-muted">None</span>'}</span>
        </div>
        ${physique ? `<div class="alchemy-physique-row">
            <span class="alchemy-status-label">Physique</span>
            <span class="alchemy-physique-chip" title="${physique.desc}">${physique.emoji} ${physique.name}</span>
        </div>` : ''}
    `;
}

function renderAlchemyIngredientPanel() {
    const el = document.getElementById('alchemyIngredientPanel');
    if (!el) return;
    ensureAlchemyState();
    ensureGearState();

    const allMatIds = new Set([
        ...Object.keys(G.materials || {}),
        ...Object.keys(G.alchemy.materials || {}),
        ...Object.keys(ALCHEMY_MATERIALS)
    ]);

    const items = [...allMatIds]
        .map(id => ({ id, count: getAlchemyMaterialCount(id), def: getAlchemyMaterialDef(id) }))
        .filter(x => x.def && x.count > 0)
        .sort((a, b) => a.def.name.localeCompare(b.def.name));

    if (!items.length) {
        el.innerHTML = '<p class="alchemy-muted">No alchemy ingredients. Explore zones to gather herbs and essences.</p>';
        return;
    }

    el.innerHTML = `<div class="alchemy-ingredient-grid">${items.map(item =>
        `<span class="alchemy-ingredient-chip" title="${item.def.name}">${item.def.emoji} ${item.def.name} ×${item.count}</span>`
    ).join('')}</div>`;
}

function renderAlchemyRecipeList() {
    const el = document.getElementById('alchemyRecipeList');
    if (!el) return;
    const recipes = getKnownAlchemyRecipes();

    if (!recipes.length) {
        el.innerHTML = '<p class="alchemy-muted">No recipes known. Seek alchemists or explore forbidden grounds.</p>';
        return;
    }

    el.innerHTML = recipes.map(recipe => {
        const tier = ALCHEMY_PILL_TIERS[recipe.tier];
        const selected = G.alchemy.selectedRecipe === recipe.id;
        const rate = getAlchemySuccessRate(recipe.id);
        const canBrew = canBrewAlchemyPill(recipe.id);
        return `<button type="button" class="alchemy-recipe-btn${selected ? ' selected' : ''}"
            data-recipe="${recipe.id}" title="${recipe.desc}">
            <span class="alchemy-recipe-emoji">${recipe.emoji || tier?.emoji || '💊'}</span>
            <span class="alchemy-recipe-info">
                <span class="alchemy-recipe-name">${recipe.name}</span>
                <span class="alchemy-recipe-meta">${tier?.emoji || ''} ${tier?.name || recipe.tier} · ${rate}% · ${recipe.months} mo</span>
            </span>
            <span class="alchemy-recipe-can ${canBrew.ok ? 'ready' : 'blocked'}">${canBrew.ok ? '✓' : '✗'}</span>
        </button>`;
    }).join('');

    el.querySelectorAll('.alchemy-recipe-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            G.alchemy.selectedRecipe = btn.dataset.recipe;
            renderAlchemyRecipeDetail();
            renderAlchemyRecipeList();
        });
    });
}

function renderAlchemyRecipeDetail() {
    const el = document.getElementById('alchemyRecipeDetail');
    const brewBtn = document.getElementById('alchemyBrewBtn');
    if (!el) return;

    const recipeId = G.alchemy.selectedRecipe;
    const recipe = recipeId ? ALCHEMY_RECIPES[recipeId] : null;

    if (!recipe) {
        el.innerHTML = '<p class="alchemy-muted">Select a recipe to view requirements.</p>';
        if (brewBtn) brewBtn.disabled = true;
        return;
    }

    const tier = ALCHEMY_PILL_TIERS[recipe.tier];
    const rate = getAlchemySuccessRate(recipeId);
    const canBrew = canBrewAlchemyPill(recipeId);
    const sellPrice = getPillSellPrice(recipeId);
    const supply = getPillMarketSupply(recipe.pillId);
    const pill = PILL_TYPES[recipe.pillId];

    const bonusLines = [];
    const skill = getAlchemySkillLevel();
    if (skill.successBonus) bonusLines.push(`Skill +${skill.successBonus}%`);
    const cauldron = getAlchemyCauldronDef();
    if (cauldron.successBonus) bonusLines.push(`Cauldron +${cauldron.successBonus}%`);
    const flame = getAlchemyFlameDef();
    if (flame.successBonus) bonusLines.push(`Flame +${flame.successBonus}%`);
    const flameElem = getAlchemyFlameElementBonus(recipe.element);
    if (flameElem) bonusLines.push(`Element +${flameElem}%`);
    const sect = getAlchemySectBonus();
    if (sect) bonusLines.push(`Sect Lab +${sect}%`);

    el.innerHTML = `
        <div class="alchemy-detail-header">
            <span class="alchemy-detail-emoji">${recipe.emoji || '💊'}</span>
            <div>
                <h3 class="alchemy-detail-name">${recipe.name}</h3>
                <p class="alchemy-detail-tier">${tier?.emoji || ''} ${tier?.name} Tier · ${recipe.element} element</p>
            </div>
        </div>
        <p class="alchemy-detail-desc">${recipe.desc}</p>
        <p class="alchemy-detail-effect"><strong>Effect:</strong> ${pill?.desc || 'Consumable pill.'}</p>
        <div class="alchemy-detail-stats">
            <span>Success: <strong class="alchemy-rate">${rate}%</strong></span>
            <span>Time: <strong>${recipe.months} mo</strong></span>
            <span>Market: <strong>${sellPrice} stones</strong></span>
            <span>Supply: <strong>${supply.toFixed(1)}</strong></span>
        </div>
        ${bonusLines.length ? `<p class="alchemy-detail-bonuses">Bonuses: ${bonusLines.join(' · ')}</p>` : ''}
        <div class="alchemy-detail-ingredients">
            <strong>Ingredients:</strong>
            <p>${formatAlchemyIngredients(recipe)}</p>
        </div>
        ${!canBrew.ok ? `<p class="alchemy-detail-block">${canBrew.reason}</p>` : ''}
    `;

    if (brewBtn) {
        brewBtn.disabled = alchemyChamberBlocked() || !canBrew.ok;
        brewBtn.textContent = `⚗️ Brew (${recipe.months} mo)`;
    }
}

function renderAlchemySellPanel() {
    const el = document.getElementById('alchemySellPanel');
    if (!el) return;
    ensurePillStock();

    const sellable = Object.entries(PILL_TYPES)
        .map(([pillId, pill]) => {
            const qty = G.pillStock[pillId] || 0;
            const recipe = Object.values(ALCHEMY_RECIPES).find(r => r.pillId === pillId);
            if (!qty || !recipe) return null;
            return { pillId, pill, qty, recipe, price: getPillSellPrice(recipe.id) };
        })
        .filter(Boolean);

    if (!sellable.length) {
        el.innerHTML = '<p class="alchemy-muted">No pills to sell. Brew pills first.</p>';
        return;
    }

    el.innerHTML = sellable.map(entry =>
        `<div class="alchemy-sell-row">
            <span>${entry.pill.emoji} ${entry.pill.name} ×${entry.qty}</span>
            <span class="alchemy-sell-price">${entry.price} stones each</span>
            <button type="button" class="alchemy-sell-btn" data-pill="${entry.pillId}" data-qty="1">Sell 1</button>
            ${entry.qty > 1 ? `<button type="button" class="alchemy-sell-btn" data-pill="${entry.pillId}" data-qty="${entry.qty}">Sell All</button>` : ''}
        </div>`
    ).join('');

    el.querySelectorAll('.alchemy-sell-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            sellAlchemyPills(btn.dataset.pill, parseInt(btn.dataset.qty, 10));
        });
    });
}

function renderAlchemyChamberUI() {
    if (!G.inAlchemyChamber) return;
    ensureAlchemyState();
    renderAlchemyCauldronVisual();
    renderAlchemyStatusPanel();
    renderAlchemyIngredientPanel();
    renderAlchemyRecipeList();
    renderAlchemyRecipeDetail();
    renderAlchemySellPanel();
}

function initAlchemyChamberEvents() {
    document.getElementById('alchemyChamberReturn')?.addEventListener('click', closeAlchemyChamber);
    document.getElementById('alchemyBrewBtn')?.addEventListener('click', () => {
        if (G.alchemy?.selectedRecipe) {
            triggerAlchemyAnim('brewing');
            brewAlchemyPill(G.alchemy.selectedRecipe);
        }
    });
    document.getElementById('alchemyChamberOverlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'alchemyChamberOverlay') closeAlchemyChamber();
    });
}

function actionAlchemy() {
    openAlchemyChamber();
}
