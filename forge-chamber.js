// ============================================
// FORGE-CHAMBER.JS — Forge Chamber immersive UI
// ============================================

function forgeChamberBlocked() {
    return G.gameOver || G.inCombat
        || G.inQiChamber || G.inBodyChamber || G.inSoulChamber
        || (typeof isTribulationActive === 'function' && isTribulationActive())
        || (typeof isTranscendencePerkPending === 'function' && isTranscendencePerkPending());
}

function openForgeChamber(options) {
    options = options || {};
    if (forgeChamberBlocked()) return;
    ensureForgeState();
    G.inForgeChamber = true;
    if (options.atSect) G.forge.atSect = true;
    if (options.tab) G.forge.activeTab = options.tab;
    if (!G.forge.selectedRecipe && G.forge.activeTab !== 'repair' && G.forge.activeTab !== 'legendary') {
        const recipes = getCraftableRecipes();
        if (recipes.length) G.forge.selectedRecipe = recipes[0].id;
    }
    if (!G.forge.selectedLegendary && G.forge.activeTab === 'legendary') {
        const leg = getLegendaryGearRecipes();
        if (leg.length) G.forge.selectedLegendary = leg[0].id;
    }
    document.getElementById('inventoryPopup')?.classList.remove('active');
    document.getElementById('sectPopup')?.classList.remove('active');
    document.getElementById('forgeChamberOverlay')?.classList.add('active');
    renderForgeChamberUI();
}

function closeForgeChamber() {
    G.inForgeChamber = false;
    document.getElementById('forgeChamberOverlay')?.classList.remove('active');
    fullRender();
}

function triggerForgeAnim(kind) {
    const stage = document.getElementById('forgeAnvilStage');
    if (!stage) return;
    stage.classList.remove('forge-anim-striking', 'forge-anim-success', 'forge-anim-failure', 'forge-anim-repair');
    void stage.offsetWidth;
    const cls = {
        striking: 'forge-anim-striking',
        success: 'forge-anim-success',
        failure: 'forge-anim-failure',
        repair: 'forge-anim-repair'
    }[kind];
    if (!cls) return;
    stage.classList.add(cls);
    setTimeout(() => stage.classList.remove(cls), 1800);
}

function renderForgeAnvilVisual() {
    const anvil = getForgeAnvilDef();
    const anvilEl = document.getElementById('forgeAnvilVisual');
    const hammerEl = document.getElementById('forgeHammerVisual');
    if (anvilEl) {
        anvilEl.textContent = anvil.emoji || '🔨';
        anvilEl.dataset.anvil = anvil.id;
    }
    if (hammerEl) hammerEl.textContent = '🔨';
}

function renderForgeStatusPanel() {
    ensureForgeState();
    const skill = getForgeSkillLevel();
    const anvil = getForgeAnvilDef();
    const armoryPct = getArmoryForgeMonthsPct();
    const armoryAffix = typeof getSectBuildingBonus === 'function' ? (getSectBuildingBonus('armoryForgeAffixPct') || 0) : 0;

    const skillIdx = FORGE_SKILL_LEVELS.findIndex(s => s.id === skill.id);
    const nextSkill = FORGE_SKILL_LEVELS[skillIdx + 1];
    const skillProgress = nextSkill
        ? Math.min(100, Math.round((G.forge.skillXp / nextSkill.xpRequired) * 100))
        : 100;

    const anvilIdx = FORGE_ANVILS.findIndex(a => a.id === anvil.id);
    const nextAnvil = FORGE_ANVILS[anvilIdx + 1];
    const anvilProgress = nextAnvil
        ? Math.min(100, Math.round((G.forge.successfulForges / nextAnvil.forgesRequired) * 100))
        : 100;

    const el = document.getElementById('forgeStatusPanel');
    if (!el) return;

    const sectLines = [];
    if (G.sect && typeof getBuildingLevel === 'function' && getBuildingLevel('armory') > 0) {
        sectLines.push(`Armory Lv${getBuildingLevel('armory')}: −${armoryPct}% forge time${armoryAffix ? `, +${armoryAffix}% affix` : ''}`);
    }
    if (G.disciples?.length) {
        const mult = getSectForgeMonthsMult();
        sectLines.push(`Disciples: −${Math.round((1 - mult) * 100)}% sect forge time`);
    }

    el.innerHTML = `
        <div class="forge-status-grid">
            <div class="forge-status-card">
                <span class="forge-status-label">Skill</span>
                <span class="forge-status-value">🔨 ${skill.name}</span>
                <span class="forge-status-sub">+${skill.affixBonus}% affix · −${skill.monthsReductionPct}% time · ${G.forge.successfulForges || 0} forged</span>
                <div class="forge-mini-bar"><div class="forge-mini-fill" style="width:${skillProgress}%"></div></div>
            </div>
            <div class="forge-status-card">
                <span class="forge-status-label">Anvil</span>
                <span class="forge-status-value">${anvil.emoji} ${anvil.name}</span>
                <span class="forge-status-sub">+${anvil.affixBonus}% affix · −${anvil.monthsReductionPct}% time</span>
                <div class="forge-mini-bar"><div class="forge-mini-fill forge-mini-fill-anvil" style="width:${anvilProgress}%"></div></div>
            </div>
            <div class="forge-status-card">
                <span class="forge-status-label">Legendary</span>
                <span class="forge-status-value">⚡ ${getLegendaryForgeSuccessRate()}%</span>
                <span class="forge-status-sub">${G.forge.failedLegendary || 0} failed attempts</span>
            </div>
            <div class="forge-status-card">
                <span class="forge-status-label">Sect Synergy</span>
                <span class="forge-status-value">${sectLines.length ? '🏯 Active' : '— None'}</span>
                <span class="forge-status-sub">${sectLines.join(' · ') || 'Build an Armory for forge bonuses.'}</span>
            </div>
        </div>
    `;
}

function renderForgeMaterialPanel() {
    const el = document.getElementById('forgeMaterialPanel');
    if (!el) return;
    ensureGearState();

    const items = Object.entries(G.materials || {})
        .filter(([, qty]) => qty > 0)
        .map(([id, count]) => ({ id, count, def: CRAFT_MATERIALS[id] }))
        .filter(x => x.def)
        .sort((a, b) => a.def.name.localeCompare(b.def.name));

    const legends = (G.legendaryMaterials || []).filter(Boolean);

    if (!items.length && !legends.length) {
        el.innerHTML = '<p class="forge-muted">No forge materials. Explore zones to gather ore, essence, and scraps.</p>';
        return;
    }

    let html = '';
    if (items.length) {
        html += `<div class="forge-material-grid">${items.map(item =>
            `<span class="forge-material-chip" title="${item.def.name}">${item.def.emoji} ${item.def.name} ×${item.count}</span>`
        ).join('')}</div>`;
    }
    if (legends.length) {
        html += `<div class="forge-legend-row"><span class="forge-status-label">Legendary</span>`;
        html += legends.map(name => `<span class="forge-legend-chip">🏆 ${name}</span>`).join('');
        html += `</div>`;
    }
    el.innerHTML = html;
}

function renderForgeTabBar() {
    const el = document.getElementById('forgeTabBar');
    if (!el) return;
    ensureForgeState();
    const tab = G.forge.activeTab || 'standard';
    el.innerHTML = ['standard', 'legendary', 'repair'].map(t => {
        const labels = { standard: '⚔️ Standard', legendary: '🏆 Legendary', repair: '🔧 Repair' };
        return `<button type="button" class="forge-tab-btn${tab === t ? ' active' : ''}" data-forge-tab="${t}">${labels[t]}</button>`;
    }).join('');
    el.querySelectorAll('[data-forge-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            G.forge.activeTab = btn.dataset.forgeTab;
            renderForgeChamberUI();
        });
    });
}

function renderForgeRecipeList() {
    const el = document.getElementById('forgeRecipeList');
    if (!el) return;
    ensureForgeState();
    const tab = G.forge.activeTab || 'standard';

    if (tab === 'repair') {
        el.innerHTML = '<p class="forge-muted">Select an item below to repair worn gear.</p>';
        return;
    }

    const recipes = tab === 'legendary' ? getLegendaryGearRecipes() : getCraftableRecipes();
    const selectedKey = tab === 'legendary' ? 'selectedLegendary' : 'selectedRecipe';

    if (!recipes.length) {
        el.innerHTML = '<p class="forge-muted">No recipes available.</p>';
        return;
    }

    el.innerHTML = recipes.map(({ id, def, recipe, legendary }) => {
        const selected = G.forge[selectedKey] === id;
        const check = canCraftGear(id, { legendary });
        const months = getEffectiveForgeMonths(recipe.months, { atSect: G.forge.atSect && G.sect });
        const tierLabel = legendary ? 'Legendary' : `T${recipe.tier}`;
        return `<button type="button" class="forge-recipe-btn${selected ? ' selected' : ''}"
            data-recipe="${id}" data-legendary="${legendary ? '1' : '0'}" title="${def.desc || ''}">
            <span class="forge-recipe-emoji">${def.emoji || '⚔️'}</span>
            <span class="forge-recipe-info">
                <span class="forge-recipe-name">${def.name}</span>
                <span class="forge-recipe-meta">${tierLabel} · ${months} mo · ${recipe.stones}💎</span>
            </span>
            <span class="forge-recipe-can ${check.ok ? 'ready' : 'blocked'}">${check.ok ? '✓' : '✗'}</span>
        </button>`;
    }).join('');

    el.querySelectorAll('.forge-recipe-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const isLeg = btn.dataset.legendary === '1';
            if (isLeg) {
                G.forge.selectedLegendary = btn.dataset.recipe;
                G.forge.activeTab = 'legendary';
            } else {
                G.forge.selectedRecipe = btn.dataset.recipe;
                G.forge.activeTab = 'standard';
            }
            renderForgeRecipeDetail();
            renderForgeRecipeList();
            renderForgeTabBar();
        });
    });
}

function renderForgeRecipeDetail() {
    const el = document.getElementById('forgeRecipeDetail');
    const forgeBtn = document.getElementById('forgeActionBtn');
    if (!el) return;
    ensureForgeState();

    if (G.forge.activeTab === 'repair') {
        el.innerHTML = '<p class="forge-muted">The anvil remembers every strike. Choose gear to restore below.</p>';
        if (forgeBtn) forgeBtn.style.display = 'none';
        return;
    }
    if (forgeBtn) forgeBtn.style.display = '';

    const tab = G.forge.activeTab || 'standard';
    const legendary = tab === 'legendary';
    const recipeId = legendary ? G.forge.selectedLegendary : G.forge.selectedRecipe;
    const recipe = legendary ? LEGENDARY_GEAR_RECIPES[recipeId] : GEAR_CRAFT_RECIPES[recipeId];
    const defId = legendary ? recipe?.output : recipeId;
    const def = GEAR_ITEMS[defId];

    if (!recipe || !def) {
        el.innerHTML = '<p class="forge-muted">Select a recipe to view requirements.</p>';
        if (forgeBtn) forgeBtn.disabled = true;
        return;
    }

    const check = canCraftGear(recipeId, { legendary });
    const months = getEffectiveForgeMonths(recipe.months, { atSect: G.forge.atSect && G.sect });
    const res = formatGearResonanceLine(def);
    const affixRange = getExpectedAffixRange(recipe.tier || def.tier || 1);

    const bonusLines = [];
    const skill = getForgeSkillLevel();
    if (skill.affixBonus) bonusLines.push(`Skill +${skill.affixBonus}% affix`);
    const anvil = getForgeAnvilDef();
    if (anvil.affixBonus) bonusLines.push(`Anvil +${anvil.affixBonus}% affix`);
    const armoryPct = getArmoryForgeMonthsPct();
    if (armoryPct) bonusLines.push(`Armory −${armoryPct}% time`);
    if (G.forge.atSect && G.sect) {
        bonusLines.push(`Sect forge (−${Math.round((1 - getSectForgeMonthsMult()) * 100)}% time)`);
    }
    const savePct = Math.round(getForgeMaterialSaveChance() * 100);
    if (savePct) bonusLines.push(`${savePct}% material save (Alchemy Lab)`);

    el.innerHTML = `
        <div class="forge-detail-header">
            <span class="forge-detail-emoji">${def.emoji || '⚔️'}</span>
            <div>
                <h3 class="forge-detail-name">${def.name}</h3>
                <p class="forge-detail-tier">${legendary ? '🏆 Legendary' : `Tier ${recipe.tier}`} · ${def.slot || 'gear'}</p>
            </div>
        </div>
        <p class="forge-detail-desc">${def.desc || ''}</p>
        ${res ? `<p class="forge-detail-resonance"><strong>${getPathResonanceLabel()} resonance:</strong> ${res}</p>` : ''}
        <p class="forge-detail-affix"><strong>Expected affixes:</strong> ${affixRange}</p>
        <div class="forge-detail-stats">
            <span>Time: <strong>${months} mo</strong></span>
            <span>Cost: <strong>${recipe.stones} stones</strong></span>
            ${legendary ? `<span>Success: <strong class="forge-rate">${getLegendaryForgeSuccessRate()}%</strong></span>` : '<span>Success: <strong class="forge-rate">100%</strong></span>'}
        </div>
        ${bonusLines.length ? `<p class="forge-detail-bonuses">Bonuses: ${bonusLines.join(' · ')}</p>` : ''}
        <div class="forge-detail-materials">
            <strong>Materials:</strong>
            <p>${formatRecipeMaterials(recipe)}</p>
            ${recipe.consumesLegendary ? `<p class="forge-detail-legend">Requires legendary: <strong>${recipe.consumesLegendary}</strong></p>` : ''}
        </div>
        ${!check.ok ? `<p class="forge-detail-block">${check.reason}</p>` : ''}
    `;

    if (forgeBtn) {
        forgeBtn.disabled = forgeChamberBlocked() || !check.ok;
        const verb = legendary ? 'Forge Legendary' : 'Forge';
        forgeBtn.textContent = `🔨 ${verb} (${months} mo)`;
    }
}

function renderForgeRepairPanel() {
    const el = document.getElementById('forgeRepairPanel');
    if (!el) return;
    ensureGearState();

    if (G.forge.activeTab !== 'repair') {
        el.innerHTML = '';
        el.style.display = 'none';
        return;
    }
    el.style.display = '';

    const candidates = getForgeRepairCandidates();
    if (!candidates.length) {
        el.innerHTML = '<p class="forge-muted">All gear is in perfect condition. Fight more to test your craft.</p>';
        return;
    }

    el.innerHTML = candidates.map(({ uid, inst, def, slot, equipped }) => {
        const cost = getRepairCost(inst);
        const canPay = G.stones >= cost.stones && getMaterialCount('iron_ore') >= cost.iron;
        return `<div class="forge-repair-row${canPay ? '' : ' blocked'}">
            <span class="forge-repair-name">${def?.emoji || '⚔️'} ${formatInstanceName(inst)}${equipped ? ` <span class="forge-repair-slot">(${slot})</span>` : ''}</span>
            <span class="forge-repair-dur">${formatDurabilityLine(inst)}</span>
            <span class="forge-repair-cost">${cost.months}mo · ${cost.stones}💎 · ${cost.iron} iron</span>
            <button type="button" class="forge-repair-btn" data-forge-repair="${uid}" ${canPay ? '' : 'disabled'}>Repair</button>
        </div>`;
    }).join('');

    el.querySelectorAll('[data-forge-repair]').forEach(btn => {
        btn.addEventListener('click', () => {
            triggerForgeAnim('striking');
            const result = forgeRepairGear(btn.dataset.forgeRepair);
            if (result.message) logTimedResult(result);
        });
    });
}

function renderForgeSectToggle() {
    const el = document.getElementById('forgeSectToggle');
    if (!el) return;
    ensureForgeState();
    if (!G.sect) {
        el.innerHTML = '';
        return;
    }
    const checked = G.forge.atSect ? 'checked' : '';
    el.innerHTML = `<label class="forge-sect-toggle">
        <input type="checkbox" id="forgeAtSectCheck" ${checked}>
        <span>🏯 Forge at Sect (disciple speed bonus)</span>
    </label>`;
    document.getElementById('forgeAtSectCheck')?.addEventListener('change', function() {
        G.forge.atSect = this.checked;
        renderForgeRecipeList();
        renderForgeRecipeDetail();
    });
}

function renderForgeChamberUI() {
    if (!G.inForgeChamber) return;
    ensureForgeState();
    renderForgeAnvilVisual();
    renderForgeStatusPanel();
    renderForgeMaterialPanel();
    renderForgeTabBar();
    renderForgeRecipeList();
    renderForgeRecipeDetail();
    renderForgeRepairPanel();
    renderForgeSectToggle();
}

function initForgeChamberEvents() {
    document.getElementById('forgeChamberReturn')?.addEventListener('click', closeForgeChamber);
    document.getElementById('forgeActionBtn')?.addEventListener('click', () => {
        ensureForgeState();
        const tab = G.forge.activeTab || 'standard';
        if (tab === 'repair') return;
        triggerForgeAnim('striking');
        if (tab === 'legendary' && G.forge.selectedLegendary) {
            craftLegendaryGear(G.forge.selectedLegendary);
        } else if (G.forge.selectedRecipe) {
            const opts = G.forge.atSect && G.sect ? { atSect: true } : {};
            craftGear(G.forge.selectedRecipe, opts);
        }
    });
    document.getElementById('forgeChamberOverlay')?.addEventListener('click', (e) => {
        if (e.target.id === 'forgeChamberOverlay') closeForgeChamber();
    });
}

function actionForge() {
    openForgeChamber();
}
