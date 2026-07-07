// ============================================
// SPATIAL-RING.JS — Travel kit expansion (Storage / Void rings)
// ============================================

function ensureTravelRing() {
    if (G.travelRingId == null) G.travelRingId = null;
}

function getSpatialRingDef(ringId) {
    return SPATIAL_RING_BALANCE?.rings?.[ringId] || null;
}

function getActiveSpatialRingDef() {
    ensureTravelRing();
    return G.travelRingId ? getSpatialRingDef(G.travelRingId) : null;
}

function getSpatialRingCapacityBonus() {
    return getActiveSpatialRingDef()?.capacityBonus || 0;
}

function getSpatialRingMaterialWeightMult() {
    const mult = getActiveSpatialRingDef()?.materialWeightMult;
    return mult != null ? mult : 1;
}

function hasTravelRing(ringId) {
    ensureTravelRing();
    if (!ringId) return !!G.travelRingId;
    return G.travelRingId === ringId;
}

function getSpatialRingCraftBlockReason(ringId) {
    const def = getSpatialRingDef(ringId);
    if (!def) return 'Unknown ring recipe.';
    const current = getActiveSpatialRingDef();
    if (current && def.tier < current.tier) {
        return `Your ${current.name} is already superior.`;
    }
    if (G.travelRingId === ringId) return `You already wear a ${def.name}.`;
    if (def.requiresRing && G.travelRingId !== def.requiresRing) {
        const req = getSpatialRingDef(def.requiresRing);
        return `Need a ${req?.name || def.requiresRing} to upgrade.`;
    }
    if (def.reqRealm != null && G.realmIdx < def.reqRealm) {
        const realmName = PATHS[G.path]?.realms[def.reqRealm] || `realm ${def.reqRealm + 1}`;
        return `Requires ${realmName} or higher.`;
    }
    const craft = def.craft;
    if (!craft) return 'Cannot be forged yet.';
    if ((G.stones || 0) < (craft.stones || 0)) {
        return `Need ${craft.stones} Spirit Stones.`;
    }
    for (const [matId, qty] of Object.entries(craft.materials || {})) {
        const have = typeof getMaterialCount === 'function' ? getMaterialCount(matId) : 0;
        if (have < qty) {
            const mat = CRAFT_MATERIALS[matId];
            return `Need ${qty}× ${mat?.name || matId}.`;
        }
    }
    if (craft.consumesCurio) {
        const inv = G.inventory || [];
        if (!inv.includes(craft.consumesCurio)) {
            return `Need curio: ${craft.consumesCurio} (find in markets or exploration).`;
        }
    }
    if (G.inCombat) return 'Cannot forge during combat.';
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'You cannot forge right now.';
    return null;
}

function canCraftSpatialRing(ringId) {
    return !getSpatialRingCraftBlockReason(ringId);
}

function craftSpatialRing(ringId) {
    const block = getSpatialRingCraftBlockReason(ringId);
    if (block) return { success: false, message: block };
    const def = getSpatialRingDef(ringId);
    const craft = def.craft;
    if (!advanceTime(craft.months, `Forging ${def.name}`)) {
        return { success: false, message: 'Your lifespan ends mid-forging.' };
    }
    G.stones -= craft.stones || 0;
    if (typeof removeCraftMaterials === 'function') removeCraftMaterials(craft.materials);
    if (craft.consumesCurio) {
        const idx = (G.inventory || []).indexOf(craft.consumesCurio);
        if (idx >= 0) G.inventory.splice(idx, 1);
    }
    const prev = G.travelRingId;
    G.travelRingId = ringId;
    let msg = `Forged and attuned ${def.emoji} ${def.name}! Travel kit +${def.capacityBonus}, materials lighter.`;
    if (prev && prev !== ringId) {
        const old = getSpatialRingDef(prev);
        msg = `Upgraded ${old?.name || prev} into ${def.emoji} ${def.name}! Travel kit +${def.capacityBonus}.`;
    }
    addLog(`💍 ${msg}`);
    return { success: true, message: msg };
}

function formatSpatialRingRecipeMaterials(craft) {
    return Object.entries(craft.materials || {}).map(([matId, qty]) => {
        const mat = CRAFT_MATERIALS[matId];
        const have = typeof getMaterialCount === 'function' ? getMaterialCount(matId) : 0;
        const ok = have >= qty;
        return `${ok ? '✓' : '✗'} ${qty}× ${mat?.emoji || '◆'} ${mat?.name || matId} (${have})`;
    }).join(' · ');
}

function renderSpatialRingPanelHtml() {
    ensureTravelRing();
    const active = getActiveSpatialRingDef();
    let html = `<div class="spatial-ring-panel">`;
    html += `<div class="spatial-ring-head"><span class="spatial-ring-title">💍 Spatial Storage</span></div>`;
    html += `<p class="spatial-ring-flavor">Qi-folded space for the road — expands your travel kit without touching home shelves or worn gear.</p>`;

    if (active) {
        const cap = typeof getTravelKitCapacity === 'function' ? getTravelKitCapacity() : 8;
        const base = TRAVEL_KIT_BALANCE.baseCapacity ?? 8;
        html += `<div class="spatial-ring-active">`;
        html += `<div class="spatial-ring-active-name">${active.emoji} ${active.name}</div>`;
        html += `<div class="spatial-ring-active-stats">Kit ${base} → <strong>${cap}</strong> · Materials ×${active.materialWeightMult} weight</div>`;
        html += `<div class="spatial-ring-active-desc">${active.desc}</div>`;
        html += `</div>`;
    } else {
        html += `<p class="spatial-ring-empty">No storage ring attuned — craft one below when you reach Core Formation.</p>`;
    }

    const ringIds = Object.keys(SPATIAL_RING_BALANCE.rings).sort((a, b) => {
        return (getSpatialRingDef(a)?.tier || 0) - (getSpatialRingDef(b)?.tier || 0);
    });
    html += `<div class="spatial-ring-recipes">`;
    ringIds.forEach(ringId => {
        const def = getSpatialRingDef(ringId);
        if (!def?.craft) return;
        const block = getSpatialRingCraftBlockReason(ringId);
        const owned = G.travelRingId === ringId;
        const isUpgrade = def.requiresRing && G.travelRingId === def.requiresRing;
        const realmName = def.reqRealm != null ? (PATHS[G.path]?.realms[def.reqRealm] || '') : '';
        const label = isUpgrade ? `Upgrade to ${def.name}` : owned ? `${def.name} (attuned)` : `Forge ${def.name}`;
        html += `<div class="spatial-ring-recipe-row${owned ? ' owned' : ''}">`;
        html += `<div class="spatial-ring-recipe-head">${def.emoji} ${def.name}${realmName ? ` <span class="spatial-ring-req">· ${realmName}+</span>` : ''}</div>`;
        html += `<div class="spatial-ring-recipe-desc">${def.desc}</div>`;
        html += `<div class="spatial-ring-recipe-meta">${def.craft.months} mo · ${def.craft.stones}💎 · ${formatSpatialRingRecipeMaterials(def.craft)}`;
        if (def.craft.consumesCurio) {
            const have = (G.inventory || []).includes(def.craft.consumesCurio);
            html += ` · ${have ? '✓' : '✗'} ${def.craft.consumesCurio}`;
        }
        html += `</div>`;
        if (owned) {
            html += `<span class="spatial-ring-attuned">Attuned</span>`;
        } else {
            html += `<button type="button" class="manual-shelf-btn spatial-ring-forge-btn" data-forge-ring="${ringId}"${block ? ' disabled title="' + escapeAttr(block) + '"' : ''}>${label}</button>`;
            if (block && !isUpgrade && G.travelRingId && G.travelRingId !== def.requiresRing && def.tier === 2) {
                html += `<span class="spatial-ring-hint">${block}</span>`;
            }
        }
        html += `</div>`;
    });
    html += `</div></div>`;
    return html;
}

function bindSpatialRingActions(container) {
    const root = container || document.getElementById('inventoryList');
    if (!root) return;
    root.querySelectorAll('[data-forge-ring]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            const result = craftSpatialRing(this.dataset.forgeRing);
            if (result.message && !result.success) addLog(`💍 ${result.message}`);
            if (typeof renderInventoryPopup === 'function') renderInventoryPopup();
            fullRender();
        });
    });
}
