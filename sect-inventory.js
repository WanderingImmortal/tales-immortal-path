// ============================================
// SECT-INVENTORY.JS — Sect warehouse & material storage
// ============================================

function ensureSectInventory() {
    ensureSectState();
    if (!G.sect.inventory) {
        G.sect.inventory = { stones: 0, materials: {}, items: [] };
    }
    if (G.sect.inventory.stones == null) G.sect.inventory.stones = 0;
    if (!G.sect.inventory.materials) G.sect.inventory.materials = {};
    if (!G.sect.inventory.items) G.sect.inventory.items = [];
    if (!G.sect.buildingMeta) G.sect.buildingMeta = {};
    if (!G.sect.buildingMeta.spirit_garden) {
        G.sect.buildingMeta.spirit_garden = { pendingHerbs: 0 };
    }
}

function getSectInventoryCapacity() {
    ensureSectInventory();
    let cap = SECT_INVENTORY_BALANCE.baseCapacity;
    if (typeof getBuildingLevel === 'function') {
        cap += getBuildingLevel('vault') * SECT_INVENTORY_BALANCE.vaultCapacityPerLevel;
    }
    return cap;
}

function getSectMaterialCount(matId) {
    ensureSectInventory();
    return G.sect.inventory.materials[matId] || 0;
}

function getSectInventoryUsed() {
    ensureSectInventory();
    let used = Math.ceil((G.sect.inventory.stones || 0) / 10);
    Object.values(G.sect.inventory.materials).forEach(qty => { used += qty || 0; });
    used += (G.sect.inventory.items || []).length;
    return used;
}

function getSectInventorySpaceRemaining() {
    return Math.max(0, getSectInventoryCapacity() - getSectInventoryUsed());
}

function canAddToSectInventory(qty) {
    return getSectInventorySpaceRemaining() >= (qty || 1);
}

function addSectInventoryStones(amount) {
    ensureSectInventory();
    if (!amount) return 0;
    const space = getSectInventorySpaceRemaining();
    const units = Math.ceil(amount / 10);
    if (units > space) {
        const allowed = space * 10;
        G.sect.inventory.stones = (G.sect.inventory.stones || 0) + allowed;
        return allowed;
    }
    G.sect.inventory.stones = (G.sect.inventory.stones || 0) + amount;
    return amount;
}

function addSectInventoryMaterial(matId, qty) {
    ensureSectInventory();
    if (!matId || !qty) return 0;
    if (!canAddToSectInventory(qty)) return 0;
    G.sect.inventory.materials[matId] = (G.sect.inventory.materials[matId] || 0) + qty;
    return qty;
}

function withdrawSectInventoryStones(amount) {
    ensureSectInventory();
    const have = G.sect.inventory.stones || 0;
    const take = Math.min(have, amount || have);
    if (take <= 0) return 0;
    G.sect.inventory.stones = have - take;
    G.stones = (G.stones || 0) + take;
    return take;
}

function withdrawSectInventoryMaterial(matId, qty) {
    ensureSectInventory();
    const have = getSectMaterialCount(matId);
    const take = Math.min(have, qty || have);
    if (take <= 0) return 0;
    G.sect.inventory.materials[matId] = have - take;
    if (G.sect.inventory.materials[matId] <= 0) delete G.sect.inventory.materials[matId];
    if (typeof addCraftMaterial === 'function') addCraftMaterial(matId, take);
    return take;
}

function getSpiritGardenPendingHerbs() {
    ensureSectInventory();
    return G.sect.buildingMeta.spirit_garden?.pendingHerbs || 0;
}

function addSpiritGardenPendingHerbs(qty) {
    ensureSectInventory();
    if (!qty) return;
    G.sect.buildingMeta.spirit_garden.pendingHerbs = getSpiritGardenPendingHerbs() + qty;
}

function collectSpiritGardenHerbs() {
    ensureSectInventory();
    const pending = getSpiritGardenPendingHerbs();
    if (pending <= 0) return { success: false, message: 'No herbs ready to harvest.' };
    const added = addSectInventoryMaterial('spirit_herb', pending);
    if (added <= 0) return { success: false, message: 'Sect stores are full.' };
    G.sect.buildingMeta.spirit_garden.pendingHerbs = pending - added;
    return {
        success: true,
        message: `Harvested ${added} spirit herb${added > 1 ? 's' : ''} into sect stores.`,
        collected: added
    };
}

function renderSectInventoryPanelHtml() {
    ensureSectInventory();
    const cap = getSectInventoryCapacity();
    const used = getSectInventoryUsed();
    let html = `<div class="sect-grounds-panel sect-inventory-panel">`;
    html += `<div class="sect-grounds-breadcrumb">
        <button type="button" class="sect-bc-btn" data-sect-view="map">🗺️ Grounds</button>
        <span class="sect-bc-sep">›</span>
        <span>📦 Sect Stores</span>
    </div>`;
    html += `<p class="sect-hint">Goods produced on sect grounds are stored here. Withdraw to your personal inventory when needed.</p>`;
    html += `<div class="sect-inventory-cap">Capacity: <strong>${used}/${cap}</strong></div>`;

    html += `<div class="sect-inventory-section"><div class="sect-section-title">💎 Spirit Stones</div>`;
    const stones = G.sect.inventory.stones || 0;
    if (stones > 0) {
        html += `<div class="sect-inventory-row">
            <span>💎 ${stones} stones</span>
            <button type="button" class="sect-action-btn sect-inventory-withdraw" data-withdraw-stones="${stones}">Withdraw all</button>
        </div>`;
    } else {
        html += `<p class="sect-hint sect-inventory-empty">No stones in sect stores.</p>`;
    }
    html += `</div>`;

    html += `<div class="sect-inventory-section"><div class="sect-section-title">◆ Materials</div>`;
    const mats = Object.entries(G.sect.inventory.materials).filter(([, q]) => q > 0);
    if (mats.length) {
        mats.forEach(([matId, qty]) => {
            const mat = CRAFT_MATERIALS[matId];
            html += `<div class="sect-inventory-row">
                <span>${mat?.emoji || '◆'} ${mat?.name || matId} ×${qty}</span>
                <button type="button" class="sect-action-btn sect-inventory-withdraw" data-withdraw-mat="${matId}" data-withdraw-qty="${qty}">Withdraw all</button>
            </div>`;
        });
    } else {
        html += `<p class="sect-hint sect-inventory-empty">No materials stored yet. Harvest the Spirit Garden or collect treasury tithe.</p>`;
    }
    html += `</div></div>`;
    return html;
}
