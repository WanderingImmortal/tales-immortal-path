// ============================================
// TRAVEL-KIT.JS — Personal carry capacity (worn gear is free)
// ============================================

function ensureTravelKit() {
    if (typeof ensureManualShelf === 'function') ensureManualShelf();
    if (typeof ensureGearState === 'function') ensureGearState();
    if (typeof ensurePillStock === 'function') ensurePillStock();
}

function getMaterialTravelWeight(matId) {
    const b = TRAVEL_KIT_BALANCE;
    return b.materialWeight?.[matId] ?? b.defaultMaterialWeight ?? 0.12;
}

function getTravelKitManualLoad() {
    ensureTravelKit();
    const w = TRAVEL_KIT_BALANCE.manualUniqueWeight ?? 1;
    return Object.keys(G.manualShelf || {}).length * w;
}

function getTravelKitMaterialLoad() {
    ensureTravelKit();
    let load = 0;
    Object.entries(G.materials || {}).forEach(([matId, qty]) => {
        if (qty > 0) load += qty * getMaterialTravelWeight(matId);
    });
    return load;
}

function getTravelKitPillLoad() {
    ensureTravelKit();
    const w = TRAVEL_KIT_BALANCE.pillWeight ?? 0.25;
    let load = 0;
    Object.entries(G.pillStock || {}).forEach(([, qty]) => {
        if (qty > 0) load += qty * w;
    });
    return load;
}

function getTravelKitGearLoad() {
    ensureTravelKit();
    const w = TRAVEL_KIT_BALANCE.gearBagWeight ?? 1;
    return (G.gearBag?.length || 0) * w;
}

function getTravelKitCurioLoad() {
    const w = TRAVEL_KIT_BALANCE.curioWeight ?? 0.5;
    return (G.inventory?.length || 0) * w;
}

function getTravelKitCapacity() {
    return TRAVEL_KIT_BALANCE.baseCapacity ?? 8;
}

function getTravelKitUsed() {
    return getTravelKitManualLoad()
        + getTravelKitMaterialLoad()
        + getTravelKitPillLoad()
        + getTravelKitGearLoad()
        + getTravelKitCurioLoad();
}

function getTravelKitRemaining() {
    return getTravelKitCapacity() - getTravelKitUsed();
}

function isTravelKitOverCapacity() {
    return getTravelKitUsed() > getTravelKitCapacity() + 0.001;
}

function getTravelKitBreakdown() {
    const capacity = getTravelKitCapacity();
    const manuals = getTravelKitManualLoad();
    const materials = getTravelKitMaterialLoad();
    const pills = getTravelKitPillLoad();
    const gear = getTravelKitGearLoad();
    const curios = getTravelKitCurioLoad();
    const total = manuals + materials + pills + gear + curios;
    return {
        capacity,
        manuals,
        materials,
        pills,
        gear,
        curios,
        total,
        remaining: capacity - total,
        over: total > capacity + 0.001
    };
}

function canAddTravelKitLoad(additionalLoad) {
    if (!additionalLoad || additionalLoad <= 0) return true;
    return getTravelKitUsed() + additionalLoad <= getTravelKitCapacity() + 0.001;
}

function getTravelKitFullMessage() {
    const bd = getTravelKitBreakdown();
    return `Travel kit full (${bd.total.toFixed(1)}/${bd.capacity}). Lighten your load in Inventory.`;
}

function canAddManualToTravelKit(techName) {
    ensureTravelKit();
    if (G.manualShelf?.[techName]) return true;
    const w = TRAVEL_KIT_BALANCE.manualUniqueWeight ?? 1;
    return canAddTravelKitLoad(w);
}

function getTravelKitMaterialBlockReason(matId, qty) {
    if (!matId || !qty) return null;
    const add = qty * getMaterialTravelWeight(matId);
    if (canAddTravelKitLoad(add)) return null;
    return getTravelKitFullMessage();
}

function getTravelKitPillBlockReason(qty) {
    qty = qty || 1;
    const add = qty * (TRAVEL_KIT_BALANCE.pillWeight ?? 0.25);
    if (canAddTravelKitLoad(add)) return null;
    return getTravelKitFullMessage();
}

function getTravelKitGearBlockReason() {
    const add = TRAVEL_KIT_BALANCE.gearBagWeight ?? 1;
    if (canAddTravelKitLoad(add)) return null;
    return getTravelKitFullMessage();
}

function formatTravelKitLoad(n) {
    return Number.isInteger(n) || Math.abs(n - Math.round(n)) < 0.05
        ? String(Math.round(n * 10) / 10)
        : n.toFixed(1);
}

function renderTravelKitBarHtml() {
    const bd = getTravelKitBreakdown();
    const pct = Math.min(100, Math.round((bd.total / bd.capacity) * 100));
    const overClass = bd.over ? ' travel-kit-over' : '';
    let html = `<div class="travel-kit-panel${overClass}">`;
    html += `<div class="travel-kit-head">
        <span class="travel-kit-title">🛏️ Travel Kit</span>
        <span class="travel-kit-cap">${formatTravelKitLoad(bd.total)} / ${bd.capacity}</span>
    </div>`;
    html += `<p class="travel-kit-flavor">Waxed scroll bundle at your bedroll. Worn gear is free — everything else counts.</p>`;
    html += `<div class="travel-kit-bar-track"><div class="travel-kit-bar-fill" style="width:${pct}%"></div></div>`;
    html += `<div class="travel-kit-breakdown">`;
    const rows = [
        ['📜 Manuals', bd.manuals],
        ['⛏️ Materials', bd.materials],
        ['💊 Pills', bd.pills],
        ['🎒 Spare gear', bd.gear],
        ['📦 Curios', bd.curios]
    ];
    rows.forEach(([label, val]) => {
        if (val <= 0.001) return;
        html += `<span class="travel-kit-chip">${label} ${formatTravelKitLoad(val)}</span>`;
    });
    html += `</div>`;
    if (bd.over) {
        html += `<p class="travel-kit-warn">Over capacity — new pickups blocked until you lighten your load.</p>`;
    }
    if (typeof canAccessResidenceStash === 'function' && canAccessResidenceStash()) {
        const home = typeof getResidenceStashBreakdown === 'function' ? getResidenceStashBreakdown() : null;
        if (home) {
            html += `<p class="travel-kit-home-hint">🏠 Home shelves: ${formatTravelKitLoad(home.total)}/${home.capacity} — manage at Leader's Quarters on the sect map.</p>`;
        }
    }
    html += `</div>`;
    return html;
}

function renderTravelKitManualsHtml() {
    ensureManualShelf();
    const entries = Object.values(G.manualShelf).sort((a, b) => a.technique.localeCompare(b.technique));
    if (!entries.length) {
        return `<div class="travel-kit-manuals-empty">No manuals in your kit. Explore or visit markets to find scrolls.</div>`;
    }
    return entries.map(entry => {
        const template = TECHNIQUE_POOL.find(t => t.name === entry.technique);
        if (!template) return '';
        const known = G.techniques.some(t => t.name === entry.technique);
        const pathIcon = template.path === 'qi' ? '⚡' : template.path === 'body' ? '💪' : template.path === 'soul' ? '🧠' : '◆';
        const elemLabel = TECH_ELEMENT_LABELS[template.element] || template.element;
        const months = getComprehendManualMonths(template);
        const block = known ? null : getComprehendBlockReason(template);
        const intentHint = typeof getTechniqueIntentHint === 'function' ? getTechniqueIntentHint(template) : '';
        const intentLine = intentHint ? `<div class="manual-shelf-lock" style="color:#8a9ab0;font-style:normal;">🗡️ ${intentHint}</div>` : '';
        const talentBlock = typeof getTechniqueTalentBlockReason === 'function'
            ? getTechniqueTalentBlockReason(template) : null;
        const canStudy = !known && !block;
        const countBadge = entry.count > 1 ? ` <span style="color:#b8863a;">×${entry.count}</span>` : '';
        const statusBadge = known
            ? `<span class="travel-kit-manual-known">Known — spare copy</span>`
            : `<span class="travel-kit-manual-unread">Unread</span>`;
        const talentLine = talentBlock && !known
            ? `<div class="manual-shelf-lock">🎭 ${talentBlock}</div>` : '';
        let actions = '';
        if (!known) {
            actions += `<button type="button" class="manual-shelf-btn" data-comprehend-manual="${escapeAttr(entry.technique)}"${canStudy ? '' : ' disabled'}>📖 Comprehend (${months} mo)</button>`;
        }
        if (entry.count >= 1) {
            const price = getManualConsignPrice(template);
            actions += `<button type="button" class="manual-shelf-btn" data-consign-manual="${escapeAttr(entry.technique)}">💎 Consign (+${price})</button>`;
        }
        if (known && typeof isSectFounded === 'function' && isSectFounded()
            && typeof getBuildingLevel === 'function' && getBuildingLevel('manual_hall') >= 1) {
            actions += `<button type="button" class="manual-shelf-btn" data-deposit-hall-kit="${escapeAttr(entry.technique)}">📜 Deposit to Hall</button>`;
        }
        if (typeof canAccessResidenceStash === 'function' && canAccessResidenceStash()) {
            actions += `<button type="button" class="manual-shelf-btn" data-stash-manual-kit="${escapeAttr(entry.technique)}">🏠 Shelve at Quarters</button>`;
        }
        const tierLabel = typeof getCultivationTierLabel === 'function'
            ? getCultivationTierLabel(getTechniqueCultivationTierId(template), template.path)
            : '';
        const track = typeof getTechniqueTrackLabel === 'function' ? getTechniqueTrackLabel(template) : 'Technique';
        const lockLine = block && !known ? `<div class="manual-shelf-lock">🔒 ${block}</div>` : '';
        return `<div class="popup-item manual-shelf-row travel-kit-manual-row">
            <div class="name">${pathIcon} ${entry.technique}${countBadge} ${statusBadge} <span class="tech-cultivation-tier">${tierLabel}</span> <span style="color:#a09080;font-size:12px;">[${track}]</span></div>
            <div class="desc">${template.desc} · ${elemLabel} · ${template.rarity}</div>
            ${intentLine}
            ${talentLine}
            ${lockLine}
            <div class="manual-shelf-actions">${actions}</div>
        </div>`;
    }).join('');
}

function bindTravelKitManualActions(container) {
    const root = container || document.getElementById('inventoryList');
    if (!root) return;
    root.querySelectorAll('[data-comprehend-manual]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            comprehendManual(this.dataset.comprehendManual);
            if (typeof renderInventoryPopup === 'function') renderInventoryPopup();
            fullRender();
        });
    });
    root.querySelectorAll('[data-consign-manual]').forEach(btn => {
        btn.addEventListener('click', function() {
            consignManual(this.dataset.consignManual);
            if (typeof renderInventoryPopup === 'function') renderInventoryPopup();
            fullRender();
        });
    });
    root.querySelectorAll('[data-deposit-hall-kit]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = typeof depositManualToHall === 'function'
                ? depositManualToHall(this.dataset.depositHallKit, 1)
                : { success: false, message: 'Manual Hall unavailable.' };
            if (result.message) addLog(result.success ? `📜 ${result.message}` : `📜 ${result.message}`);
            if (typeof renderInventoryPopup === 'function') renderInventoryPopup();
            fullRender();
        });
    });
    root.querySelectorAll('[data-stash-manual-kit]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = typeof stashManualToResidence === 'function'
                ? stashManualToResidence(this.dataset.stashManualKit, 1)
                : { success: false, message: 'Home storage unavailable.' };
            if (result.message) addLog(result.success ? `🏠 ${result.message}` : `🏠 ${result.message}`);
            if (typeof renderInventoryPopup === 'function') renderInventoryPopup();
            fullRender();
        });
    });
}
