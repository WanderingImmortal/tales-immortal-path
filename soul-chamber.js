// ============================================
// SOUL-CHAMBER.JS — Soul Cultivation Chamber (layered consciousness refinement)
// ============================================
//
// PHASE PLAN
//   [x] Phase 1: UI, nebula visual, Awakened Spirit actions, layer unlock system
//   [ ] Phase 2: Combat ability hooks
//   [ ] Phase 3: Remaining layer polish / balance pass
//

const SOUL_CHAMBER_BONUS_KEYS = [
    'willpowerPct', 'fearResistPct', 'qiRegenPct', 'staminaRegenPct',
    'daoComprehensionPct', 'techniqueEfficiencyPct', 'daoAlignmentPct',
    'qiEfficiencyPct', 'staminaEfficiencyPct'
];

const SOUL_CHAMBER_BONUS_LABELS = {
    willpowerPct: 'willpower',
    fearResistPct: 'fear resistance',
    qiRegenPct: 'Qi regen',
    staminaRegenPct: 'stamina regen',
    daoComprehensionPct: 'Dao comprehension speed',
    techniqueEfficiencyPct: 'technique efficiency',
    daoAlignmentPct: 'Dao Alignment',
    qiEfficiencyPct: 'Qi efficiency',
    staminaEfficiencyPct: 'stamina efficiency'
};

function ensureSoulChamberState() {
    if (!G.soulChamber) {
        G.soulChamber = {
            activeTab: 'awakened',
            layerProgress: {},
            actionCounts: {},
            bonuses: {},
            transcendentComplete: false
        };
    }
    SOUL_CHAMBER_LAYER_ORDER.forEach(id => {
        if (G.soulChamber.layerProgress[id] == null) G.soulChamber.layerProgress[id] = 0;
    });
    if (!G.soulChamber.bonuses) G.soulChamber.bonuses = {};
    SOUL_CHAMBER_BONUS_KEYS.forEach(k => {
        if (G.soulChamber.bonuses[k] == null) G.soulChamber.bonuses[k] = 0;
    });
    if (G.soulChamber.transcendentComplete == null) G.soulChamber.transcendentComplete = false;
}

function getSoulChamberBonuses() {
    ensureSoulChamberState();
    return G.soulChamber.bonuses;
}

function getSoulChamberBonus(key) {
    const raw = getSoulChamberBonuses()[key] || 0;
    const caps = typeof SOUL_CHAMBER_BONUS_CAPS !== 'undefined' ? SOUL_CHAMBER_BONUS_CAPS : null;
    const cap = caps?.[key];
    return cap != null ? Math.min(raw, cap) : raw;
}

function getSoulActionMaxStacks(action) {
    const bal = typeof SOUL_CHAMBER_BALANCE !== 'undefined' ? SOUL_CHAMBER_BALANCE : {};
    return action.maxStacks || bal.defaultMaxStacks || 3;
}

function getSoulLayerProgress(layerId) {
    ensureSoulChamberState();
    return G.soulChamber.layerProgress[layerId] || 0;
}

function getSoulRealmProgressPct() {
    if (typeof SOUL_CHAMBER_LAYER_ORDER === 'undefined') return 0;
    return getChamberLayerPathProgressPct(SOUL_CHAMBER_LAYER_ORDER, getSoulLayerProgress);
}

function applySoulPeakGrindBoost(boost) {
    ensureSoulChamberState();
    const realmLayerIdx = Math.min(G.realmIdx, SOUL_CHAMBER_LAYER_ORDER.length - 1);
    const layerId = SOUL_CHAMBER_LAYER_ORDER[realmLayerIdx];
    const current = getSoulLayerProgress(layerId);
    G.soulChamber.layerProgress[layerId] = Math.min(100, current + (boost || 20));
}

function getSoulLayerPrevId(layerId) {
    const idx = SOUL_CHAMBER_LAYER_ORDER.indexOf(layerId);
    return idx > 0 ? SOUL_CHAMBER_LAYER_ORDER[idx - 1] : null;
}

function isSoulLayerUnlocked(layerId) {
    const def = SOUL_CHAMBER_LAYERS[layerId];
    if (!def) return false;
    const prev = getSoulLayerPrevId(layerId);
    if (!prev) return true;
    return getSoulLayerProgress(prev) >= (def.unlockPrevPct || 50);
}

function getSoulLayerActionCount(layerId, actionId) {
    ensureSoulChamberState();
    return G.soulChamber.actionCounts[`${layerId}:${actionId}`] || 0;
}

function applySoulChamberBonusDelta(bonus) {
    if (!bonus) return;
    ensureSoulChamberState();
    if (bonus.soulStatPct) {
        SOUL_CHAMBER_BONUS_KEYS.forEach(key => {
            G.soulChamber.bonuses[key] = (G.soulChamber.bonuses[key] || 0) + bonus.soulStatPct;
        });
    }
    Object.entries(bonus).forEach(([key, val]) => {
        if (key === 'soulStatPct' || !val) return;
        G.soulChamber.bonuses[key] = (G.soulChamber.bonuses[key] || 0) + val;
    });
}

function formatSoulBonusDelta(bonus) {
    if (!bonus) return '';
    if (bonus.soulStatPct) return `+${bonus.soulStatPct}% all soul stats`;
    return Object.entries(bonus).map(([key, val]) => {
        const label = SOUL_CHAMBER_BONUS_LABELS[key] || key;
        return `+${val}% ${label}`;
    }).join(', ');
}

function getSoulActionMaterialCosts(action) {
    if (action.materialCost) return action.materialCost;
    if (action.rareHerb) return { rare_herb: action.rareHerb };
    return null;
}

function formatSoulMaterialCost(action) {
    const costs = getSoulActionMaterialCosts(action);
    if (!costs) return '';
    return Object.entries(costs).map(([matId, qty]) => {
        const mat = typeof CRAFT_MATERIALS !== 'undefined' ? CRAFT_MATERIALS[matId] : null;
        return `${mat?.emoji || '⛏️'} ${qty} ${mat?.name || matId}`;
    }).join(', ');
}

function getSoulActionBlockReason(layerId, action) {
    const maxStacks = getSoulActionMaxStacks(action);
    const count = getSoulLayerActionCount(layerId, action.id);
    if (count >= maxStacks) {
        return `${action.label} fully refined (${maxStacks}×).`;
    }
    if (action.requiresTrueDao && !(G.trueDaos?.length > 0)) {
        return `${action.label} requires comprehending at least one True Dao.`;
    }
    const costs = getSoulActionMaterialCosts(action);
    if (costs) {
        for (const [matId, qty] of Object.entries(costs)) {
            const have = typeof getMaterialCount === 'function' ? getMaterialCount(matId) : 0;
            if (have < qty) {
                const mat = typeof CRAFT_MATERIALS !== 'undefined' ? CRAFT_MATERIALS[matId] : null;
                const hint = matId === 'rare_herb' ? ' Explore to find Marrow Herb.'
                    : matId === 'phoenix_ash' ? ' Legendary materials come from deep exploration.'
                        : '';
                return `Need ${qty} ${mat?.name || matId} (have ${have}).${hint}`;
            }
        }
    }
    return null;
}

function soulChamberActionBlocked() {
    return G.gameOver || G.inCombat
        || (typeof isTribulationActive === 'function' && isTribulationActive());
}

function openSoulChamber() {
    if (soulChamberActionBlocked()) return;
    ensureSoulChamberState();
    G.inSoulChamber = true;
    document.getElementById('soulChamberOverlay')?.classList.add('active');
    if (!isSoulLayerUnlocked(G.soulChamber.activeTab)) {
        G.soulChamber.activeTab = 'awakened';
    }
    renderSoulChamberUI();
}

function closeSoulChamber() {
    G.inSoulChamber = false;
    document.getElementById('soulChamberOverlay')?.classList.remove('active');
    fullRender();
}

function setSoulChamberTab(layerId) {
    if (!isSoulLayerUnlocked(layerId)) return;
    ensureSoulChamberState();
    G.soulChamber.activeTab = layerId;
    renderSoulChamberUI();
}

function renderSoulVisual() {
    const wrap = document.getElementById('soulVisualWrap');
    const nebula = document.getElementById('soulVisualNebula');
    if (!wrap || !nebula) return;
    const tab = G.soulChamber?.activeTab || 'awakened';
    const progress = getSoulLayerProgress(tab);
    const def = SOUL_CHAMBER_LAYERS[tab];
    const fill = Math.min(1, progress / 100);
    wrap.dataset.layer = tab;
    nebula.style.setProperty('--soul-layer-color', def?.color || '#9b7fd4');
    nebula.style.setProperty('--soul-layer-fill', fill.toFixed(2));
    wrap.classList.toggle('soul-visual-mid', progress >= 50);
    wrap.classList.toggle('soul-visual-complete', progress >= 100);
    const deepest = getSoulDeepestUnlockedLayer();
    if (deepest) wrap.dataset.deepest = deepest;
}

function getSoulDeepestUnlockedLayer() {
    let deepest = 'awakened';
    SOUL_CHAMBER_LAYER_ORDER.forEach(layerId => {
        if (isSoulLayerUnlocked(layerId)) deepest = layerId;
    });
    return deepest;
}

function renderSoulChamberTabs() {
    const nav = document.getElementById('soulChamberTabs');
    if (!nav) return;
    nav.replaceChildren();
    SOUL_CHAMBER_LAYER_ORDER.forEach(layerId => {
        const def = SOUL_CHAMBER_LAYERS[layerId];
        const unlocked = isSoulLayerUnlocked(layerId);
        const progress = Math.round(getSoulLayerProgress(layerId));
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'soul-chamber-tab' + (layerId === G.soulChamber.activeTab ? ' active' : '')
            + (unlocked ? '' : ' locked');
        btn.disabled = !unlocked;
        btn.innerHTML = `${def.emoji} ${def.label}<span class="soul-tab-pct">${unlocked ? progress + '%' : '🔒'}</span>`;
        btn.title = unlocked
            ? `${def.label}: ${progress}% refined`
            : `Unlock at ${def.unlockPrevPct}% of ${SOUL_CHAMBER_LAYERS[getSoulLayerPrevId(layerId)]?.label || 'previous layer'}`;
        btn.addEventListener('click', () => setSoulChamberTab(layerId));
        nav.appendChild(btn);
    });
}

function renderSoulChamberAbilities() {
    const panel = document.getElementById('soulChamberAbilities');
    if (!panel) return;
    panel.replaceChildren();
    const head = document.createElement('div');
    head.className = 'soul-chamber-abilities-head';
    head.innerHTML = '<h4>Soul Combat Abilities</h4><p class="soul-abilities-note">Unlocked as each layer opens — combat hooks arrive in a future pass.</p>';
    panel.appendChild(head);
    const list = document.createElement('div');
    list.className = 'soul-abilities-list';
    SOUL_CHAMBER_LAYER_ORDER.forEach(layerId => {
        const def = SOUL_CHAMBER_LAYERS[layerId];
        const abilities = SOUL_CHAMBER_ABILITIES[layerId] || [];
        const unlocked = isSoulLayerUnlocked(layerId);
        const group = document.createElement('div');
        group.className = 'soul-ability-group' + (unlocked ? ' unlocked' : ' locked');
        const groupHead = document.createElement('div');
        groupHead.className = 'soul-ability-group-head';
        groupHead.textContent = `${def.emoji} ${def.label}`;
        group.appendChild(groupHead);
        abilities.forEach(ab => {
            const row = document.createElement('div');
            row.className = 'soul-ability-row';
            row.title = ab.desc;
            row.innerHTML = `<span class="soul-ability-name">${unlocked ? '✦' : '🔒'} ${ab.label}</span>`
                + `<span class="soul-ability-desc">${ab.desc}</span>`;
            group.appendChild(row);
        });
        list.appendChild(group);
    });
    panel.appendChild(list);
}

function appendSoulActionButton(panel, layerId, action) {
    const count = getSoulLayerActionCount(layerId, action.id);
    const block = getSoulActionBlockReason(layerId, action);
    const maxStacks = getSoulActionMaxStacks(action);
    const atMax = count >= maxStacks;
    const wrap = document.createElement('div');
    wrap.className = 'action-card-wrap soul-chamber-action-wrap';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'soul-chamber-action-btn' + (atMax ? ' soul-chamber-action-maxed' : '');
    btn.dataset.layer = layerId;
    btn.dataset.action = action.id;
    btn.disabled = soulChamberActionBlocked() || !!block;
    const flavor = typeof getSoulActionFlavor === 'function'
        ? getSoulActionFlavor(layerId, action)
        : action.desc;
    if (typeof setHoverTooltip === 'function') setHoverTooltip(btn, block || action.desc);
    else btn.title = block || action.desc;
    btn.innerHTML = `<span class="soul-action-label">${action.emoji} ${action.label}</span>`
        + `<span class="soul-action-meta soul-action-flavor">${block ? block : flavor}</span>`;
    btn.addEventListener('click', () => runSoulChamberAction(layerId, action.id));
    wrap.appendChild(btn);
    if (typeof createActionHelpBtn === 'function') {
        wrap.appendChild(createActionHelpBtn({
            className: 'soul-chamber-action-help',
            title: `${action.emoji} ${action.label}`,
            desc: action.desc,
            getBlock: () => getSoulActionBlockReason(layerId, action),
            getStats: () => formatSoulChamberActionStats(layerId, action)
        }));
    }
    panel.appendChild(wrap);
}

function renderSoulChamberActions() {
    const panel = document.getElementById('soulChamberActions');
    if (!panel) return;
    const tab = G.soulChamber.activeTab;
    const def = SOUL_CHAMBER_LAYERS[tab];
    const actions = SOUL_CHAMBER_ACTIONS[tab];
    panel.replaceChildren();
    const head = document.createElement('div');
    head.className = 'soul-chamber-tab-head';
    head.innerHTML = `<h3>${def.emoji} ${def.label}</h3><p class="soul-chamber-tab-desc">Refine this layer of your inner self.</p>`;
    panel.appendChild(head);
    if (!actions?.length) {
        const stub = document.createElement('p');
        stub.className = 'soul-chamber-stub';
        stub.textContent = `${def.label} cultivation actions are not yet available.`;
        panel.appendChild(stub);
        return;
    }
    actions.forEach(action => appendSoulActionButton(panel, tab, action));
}

function renderSoulChamberUI() {
    if (!G.inSoulChamber) return;
    ensureSoulChamberState();
    const tab = G.soulChamber.activeTab;
    const progress = getSoulLayerProgress(tab);
    const def = SOUL_CHAMBER_LAYERS[tab];
    const label = document.getElementById('soulLayerProgressLabel');
    const bar = document.getElementById('soulLayerProgressBar');
    if (label) label.textContent = `${def.label} — ${Math.round(progress)}%`;
    if (bar) {
        bar.style.width = `${Math.min(100, progress)}%`;
        bar.style.background = `linear-gradient(90deg, ${def.color}88, ${def.color})`;
    }
    renderSoulChamberTabs();
    renderSoulChamberActions();
    renderSoulVisual();
    renderSoulChamberAbilities();
    const summary = document.getElementById('soulChamberBonusSummary');
    if (summary) {
        const b = getSoulChamberBonuses();
        const parts = [];
        if (b.willpowerPct) parts.push(`⚔️ ${Math.min(b.willpowerPct, SOUL_CHAMBER_BONUS_CAPS?.willpowerPct || 99)}% will`);
        if (b.fearResistPct) parts.push(`🛡️ ${Math.min(b.fearResistPct, SOUL_CHAMBER_BONUS_CAPS?.fearResistPct || 99)}% fear`);
        if (b.qiRegenPct) parts.push(`🌬️ ${Math.min(b.qiRegenPct, SOUL_CHAMBER_BONUS_CAPS?.qiRegenPct || 99)}% Qi regen`);
        if (b.staminaRegenPct) parts.push(`💨 ${Math.min(b.staminaRegenPct, SOUL_CHAMBER_BONUS_CAPS?.staminaRegenPct || 99)}% stam regen`);
        if (b.daoComprehensionPct) parts.push(`☯️ ${Math.min(b.daoComprehensionPct, SOUL_CHAMBER_BONUS_CAPS?.daoComprehensionPct || 99)}% Dao speed`);
        if (b.techniqueEfficiencyPct) parts.push(`🎯 ${Math.min(b.techniqueEfficiencyPct, SOUL_CHAMBER_BONUS_CAPS?.techniqueEfficiencyPct || 99)}% tech`);
        if (b.daoAlignmentPct) parts.push(`✨ ${Math.min(b.daoAlignmentPct, SOUL_CHAMBER_BONUS_CAPS?.daoAlignmentPct || 99)}% align`);
        summary.textContent = parts.length ? parts.join(' · ') : 'No soul refinements yet.';
    }
}

function triggerSoulVisualPulse(layerId) {
    const nebula = document.getElementById('soulVisualNebula');
    if (!nebula) return;
    nebula.classList.remove('soul-nebula-pulse');
    void nebula.offsetWidth;
    nebula.classList.add('soul-nebula-pulse');
    nebula.dataset.pulseLayer = layerId;
    setTimeout(() => nebula.classList.remove('soul-nebula-pulse'), 900);
}

function runSoulChamberAction(layerId, actionId) {
    if (!isSoulLayerUnlocked(layerId)) return;
    const actions = SOUL_CHAMBER_ACTIONS[layerId];
    const action = actions?.find(a => a.id === actionId);
    if (!action) return;
    const block = getSoulActionBlockReason(layerId, action);
    if (block) {
        addLog(`🧠 ${block}`);
        renderSoulChamberUI();
        return;
    }
    ensureSoulChamberState();
    const prevProgress = G.soulChamber.layerProgress[layerId] || 0;
    beginActionLog();
    if (!advanceChamberWeeks(action.weeks, `${action.label} — ${SOUL_CHAMBER_LAYERS[layerId].label}`)) {
        cancelActionLog();
        renderSoulChamberUI();
        return;
    }
    const materialCosts = getSoulActionMaterialCosts(action);
    if (materialCosts) {
        if (typeof removeCraftMaterials !== 'function' || !removeCraftMaterials(materialCosts)) {
            cancelActionLog();
            addLog('🧠 Required materials missing — soul refinement fails.');
            renderSoulChamberUI();
            return;
        }
    }
    applySoulChamberBonusDelta(action.bonus);
    const key = `${layerId}:${actionId}`;
    G.soulChamber.actionCounts[key] = (G.soulChamber.actionCounts[key] || 0) + 1;
    G.soulChamber.layerProgress[layerId] = Math.min(100,
        (G.soulChamber.layerProgress[layerId] || 0) + (action.progress || 17));
    if (layerId === 'transcendent' && getSoulLayerProgress('transcendent') >= 100) {
        G.soulChamber.transcendentComplete = true;
    }
    triggerSoulVisualPulse(layerId);
    const layerPct = Math.round(G.soulChamber.layerProgress[layerId]);
    const bonusText = formatSoulBonusDelta(action.bonus);
    let msg = `🧠 ${action.label} complete. ${bonusText} · ${SOUL_CHAMBER_LAYERS[layerId].label} ${layerPct}%.`;
    if (prevProgress < 50 && layerPct >= 50) {
        const nextIdx = SOUL_CHAMBER_LAYER_ORDER.indexOf(layerId) + 1;
        if (nextIdx < SOUL_CHAMBER_LAYER_ORDER.length) {
            const nextDef = SOUL_CHAMBER_LAYERS[SOUL_CHAMBER_LAYER_ORDER[nextIdx]];
            msg += ` ${nextDef.emoji} ${nextDef.label} layer unlocked!`;
        }
    }
    if (layerId === 'transcendent' && prevProgress < 100 && layerPct >= 100) {
        const fameGain = (typeof SOUL_CHAMBER_BALANCE !== 'undefined' ? SOUL_CHAMBER_BALANCE.transcendentFame : null) || 8;
        if (typeof addFame === 'function') addFame(fameGain);
        else G.fame = (G.fame || 0) + fameGain;
        msg += ' 🌟 Transcendent Soul achieved — your consciousness touches the void itself!';
    }
    commitActionLog(msg);
    renderSoulChamberUI();
    fullRender();
}

function initSoulChamberEvents() {
    document.getElementById('soulChamberReturn')?.addEventListener('click', closeSoulChamber);
}

// ----- Stat / combat hooks (bonuses active now; abilities in a future pass) -----

function getSoulChamberWillBonus() {
    return Math.floor(getSoulChamberBonus('willpowerPct') / 3);
}

function getSoulChamberFearResistPct() {
    return getSoulChamberBonus('fearResistPct');
}

function getSoulChamberQiRegenMult() {
    return 1 + getSoulChamberBonus('qiRegenPct') / 100;
}

function getSoulChamberStaminaRegenMult() {
    return 1 + getSoulChamberBonus('staminaRegenPct') / 100;
}

function getSoulChamberTechniqueEfficiencyMult() {
    return 1 + getSoulChamberBonus('techniqueEfficiencyPct') / 100;
}

function getSoulChamberDaoComprehensionMult() {
    return 1 + getSoulChamberBonus('daoComprehensionPct') / 100;
}

function getSoulChamberDaoAlignmentShiftMult() {
    return 1 + getSoulChamberBonus('daoAlignmentPct') / 100;
}

function getSoulChamberQiEfficiencyMult() {
    return 1 + getSoulChamberBonus('qiEfficiencyPct') / 100;
}

function getSoulChamberStaminaEfficiencyMult() {
    return 1 + getSoulChamberBonus('staminaEfficiencyPct') / 100;
}

function isSoulLayerAbilityUnlocked(layerId) {
    return isSoulLayerUnlocked(layerId);
}
