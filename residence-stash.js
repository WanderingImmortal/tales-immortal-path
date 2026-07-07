// ============================================
// RESIDENCE-STASH.JS — Home storage at Leader's Quarters
// ============================================

function ensureResidenceStash() {
    ensureSectState();
    if (!G.sect.residence) {
        G.sect.residence = { level: 0, stash: null, lastRestMonths: null, formations: { slots: [] } };
    }
    const stash = G.sect.residence.stash;
    if (!stash || Array.isArray(stash)) {
        G.sect.residence.stash = { manuals: {}, materials: {}, pills: {}, gearUids: [], curios: [] };
        return;
    }
    if (!stash.manuals) stash.manuals = {};
    if (!stash.materials) stash.materials = {};
    if (!stash.pills) stash.pills = {};
    if (!stash.gearUids) stash.gearUids = [];
    if (!stash.curios) stash.curios = [];
}

function canAccessResidenceStash() {
    return typeof isSectFounded === 'function' && isSectFounded();
}

function getResidenceStashCapacity() {
    const lv = typeof getResidenceLevel === 'function' ? getResidenceLevel() : 0;
    const table = RESIDENCE_STASH_BALANCE?.capacityByLevel || [16, 28, 44, 64];
    return table[Math.min(lv, table.length - 1)] ?? 16;
}

function getStashManualLoad(manuals) {
    const w = TRAVEL_KIT_BALANCE.manualUniqueWeight ?? 1;
    return Object.keys(manuals || {}).length * w;
}

function getStashMaterialLoad(materials) {
    let load = 0;
    Object.entries(materials || {}).forEach(([matId, qty]) => {
        if (qty > 0) load += qty * (typeof getMaterialBaseWeight === 'function' ? getMaterialBaseWeight(matId) : 0.12);
    });
    return load;
}

function getStashPillLoad(pills) {
    const w = TRAVEL_KIT_BALANCE.pillWeight ?? 0.25;
    let load = 0;
    Object.entries(pills || {}).forEach(([, qty]) => {
        if (qty > 0) load += qty * w;
    });
    return load;
}

function getStashGearLoad(gearUids) {
    const w = TRAVEL_KIT_BALANCE.gearBagWeight ?? 1;
    return (gearUids?.length || 0) * w;
}

function getStashCurioLoad(curios) {
    const w = TRAVEL_KIT_BALANCE.curioWeight ?? 0.5;
    return (curios?.length || 0) * w;
}

function getResidenceStashLoad(stash) {
    ensureResidenceStash();
    const s = stash || G.sect.residence.stash;
    return getStashManualLoad(s.manuals)
        + getStashMaterialLoad(s.materials)
        + getStashPillLoad(s.pills)
        + getStashGearLoad(s.gearUids)
        + getStashCurioLoad(s.curios);
}

function getResidenceStashBreakdown() {
    ensureResidenceStash();
    const s = G.sect.residence.stash;
    const capacity = getResidenceStashCapacity();
    const manuals = getStashManualLoad(s.manuals);
    const materials = getStashMaterialLoad(s.materials);
    const pills = getStashPillLoad(s.pills);
    const gear = getStashGearLoad(s.gearUids);
    const curios = getStashCurioLoad(s.curios);
    const total = manuals + materials + pills + gear + curios;
    return { capacity, manuals, materials, pills, gear, curios, total, remaining: capacity - total, over: total > capacity + 0.001 };
}

function canAddResidenceStashLoad(additionalLoad, stash) {
    if (!additionalLoad || additionalLoad <= 0) return true;
    const cap = getResidenceStashCapacity();
    return getResidenceStashLoad(stash) + additionalLoad <= cap + 0.001;
}

function getResidenceStashFullMessage() {
    const bd = getResidenceStashBreakdown();
    return `Home shelves full (${formatTravelKitLoad(bd.total)}/${bd.capacity}). Upgrade your quarters or withdraw items.`;
}

function getResidenceStashManualEntry(techName) {
    ensureResidenceStash();
    return G.sect.residence.stash.manuals[techName] || null;
}

function stashManualToResidence(techName, qty) {
    if (!canAccessResidenceStash()) return { success: false, message: 'Found a sect and build your quarters first.' };
    ensureResidenceStash();
    const entry = typeof getManualShelfEntry === 'function' ? getManualShelfEntry(techName) : null;
    const amount = Math.min(qty || 1, entry?.count || 0);
    if (amount <= 0) return { success: false, message: 'No copies in your travel kit.' };
    const stash = G.sect.residence.stash;
    const isNew = !stash.manuals[techName];
    const addLoad = isNew ? (TRAVEL_KIT_BALANCE.manualUniqueWeight ?? 1) : 0;
    if (!canAddResidenceStashLoad(addLoad, stash)) {
        return { success: false, message: getResidenceStashFullMessage() };
    }
    if (typeof removeManualFromShelf === 'function') removeManualFromShelf(techName, amount);
    if (stash.manuals[techName]) {
        stash.manuals[techName].count += amount;
    } else {
        stash.manuals[techName] = {
            technique: techName,
            count: amount,
            quality: entry?.quality || 'clean',
            source: entry?.source || null
        };
    }
    return { success: true, message: `Shelved ${amount}× ${techName} at your quarters.`, stashed: amount };
}

function withdrawManualFromResidence(techName, qty) {
    if (!canAccessResidenceStash()) return { success: false, message: 'No home storage available.' };
    ensureResidenceStash();
    const entry = getResidenceStashManualEntry(techName);
    const amount = Math.min(qty || 1, entry?.count || 0);
    if (amount <= 0) return { success: false, message: 'No copies on home shelves.' };
    const isNewToKit = !G.manualShelf?.[techName];
    const addLoad = isNewToKit ? (TRAVEL_KIT_BALANCE.manualUniqueWeight ?? 1) : 0;
    if (!canAddTravelKitLoad(addLoad)) {
        return { success: false, message: typeof getTravelKitFullMessage === 'function' ? getTravelKitFullMessage() : 'Travel kit full.' };
    }
    entry.count -= amount;
    if (entry.count <= 0) delete G.sect.residence.stash.manuals[techName];
    for (let i = 0; i < amount; i++) {
        if (typeof grantManual === 'function') grantManual(techName, { silent: true });
    }
    return { success: true, message: `Packed ${amount}× ${techName} into your travel kit.`, withdrawn: amount };
}

function stashMaterialToResidence(matId, qty) {
    if (!canAccessResidenceStash()) return { success: false, message: 'Found a sect first.' };
    ensureResidenceStash();
    qty = qty || 1;
    const have = typeof getMaterialCount === 'function' ? getMaterialCount(matId) : (G.materials?.[matId] || 0);
    const amount = Math.min(qty, have);
    if (amount <= 0) return { success: false, message: 'Not carrying that material.' };
    const addLoad = amount * getMaterialTravelWeight(matId);
    if (!canAddResidenceStashLoad(addLoad)) {
        return { success: false, message: getResidenceStashFullMessage() };
    }
    if (typeof removeCraftMaterials === 'function' && !removeCraftMaterials({ [matId]: amount })) {
        return { success: false, message: 'Could not move materials.' };
    }
    const stash = G.sect.residence.stash;
    stash.materials[matId] = (stash.materials[matId] || 0) + amount;
    const mat = CRAFT_MATERIALS[matId];
    return { success: true, message: `Shelved ${amount}× ${mat?.name || matId} at your quarters.` };
}

function withdrawMaterialFromResidence(matId, qty) {
    if (!canAccessResidenceStash()) return { success: false, message: 'No home storage available.' };
    ensureResidenceStash();
    const stash = G.sect.residence.stash;
    const have = stash.materials[matId] || 0;
    const amount = Math.min(qty || 1, have);
    if (amount <= 0) return { success: false, message: 'None stored at quarters.' };
    const addLoad = amount * getMaterialTravelWeight(matId);
    if (!canAddTravelKitLoad(addLoad)) {
        return { success: false, message: typeof getTravelKitFullMessage === 'function' ? getTravelKitFullMessage() : 'Travel kit full.' };
    }
    stash.materials[matId] -= amount;
    if (stash.materials[matId] <= 0) delete stash.materials[matId];
    if (typeof addCraftMaterial === 'function') addCraftMaterial(matId, amount);
    const mat = CRAFT_MATERIALS[matId];
    return { success: true, message: `Packed ${amount}× ${mat?.name || matId} into your travel kit.` };
}

function stashPillToResidence(pillId, qty) {
    if (!canAccessResidenceStash()) return { success: false, message: 'Found a sect first.' };
    ensureResidenceStash();
    ensurePillStock();
    qty = qty || 1;
    const have = G.pillStock[pillId] || 0;
    const amount = Math.min(qty, have);
    if (amount <= 0) return { success: false, message: 'Not carrying those pills.' };
    const addLoad = amount * (TRAVEL_KIT_BALANCE.pillWeight ?? 0.25);
    if (!canAddResidenceStashLoad(addLoad)) {
        return { success: false, message: getResidenceStashFullMessage() };
    }
    G.pillStock[pillId] -= amount;
    if (G.pillStock[pillId] <= 0) G.pillStock[pillId] = 0;
    const stash = G.sect.residence.stash;
    stash.pills[pillId] = (stash.pills[pillId] || 0) + amount;
    const pill = PILL_TYPES[pillId];
    return { success: true, message: `Shelved ${amount}× ${pill?.name || pillId} at your quarters.` };
}

function withdrawPillFromResidence(pillId, qty) {
    if (!canAccessResidenceStash()) return { success: false, message: 'No home storage available.' };
    ensureResidenceStash();
    const stash = G.sect.residence.stash;
    const have = stash.pills[pillId] || 0;
    const amount = Math.min(qty || 1, have);
    if (amount <= 0) return { success: false, message: 'None stored at quarters.' };
    const addLoad = amount * (TRAVEL_KIT_BALANCE.pillWeight ?? 0.25);
    if (!canAddTravelKitLoad(addLoad)) {
        return { success: false, message: typeof getTravelKitFullMessage === 'function' ? getTravelKitFullMessage() : 'Travel kit full.' };
    }
    stash.pills[pillId] -= amount;
    if (stash.pills[pillId] <= 0) delete stash.pills[pillId];
    if (typeof addPill === 'function') addPill(pillId, amount);
    const pill = PILL_TYPES[pillId];
    return { success: true, message: `Packed ${amount}× ${pill?.name || pillId} into your travel kit.` };
}

function stashGearToResidence(uid) {
    if (!canAccessResidenceStash()) return { success: false, message: 'Found a sect first.' };
    ensureResidenceStash();
    ensureGearState();
    if (!G.gearBag.includes(uid)) return { success: false, message: 'That item is not in your travel kit.' };
    const addLoad = TRAVEL_KIT_BALANCE.gearBagWeight ?? 1;
    if (!canAddResidenceStashLoad(addLoad)) {
        return { success: false, message: getResidenceStashFullMessage() };
    }
    if (typeof removeGearFromBag === 'function') removeGearFromBag(uid);
    G.sect.residence.stash.gearUids.push(uid);
    const inst = getGearInstance(uid);
    const def = getInstanceDef(inst);
    return { success: true, message: `Shelved ${def ? formatInstanceName(inst) : 'gear'} at your quarters.` };
}

function withdrawGearFromResidence(uid) {
    if (!canAccessResidenceStash()) return { success: false, message: 'No home storage available.' };
    ensureResidenceStash();
    ensureGearState();
    const stash = G.sect.residence.stash;
    const idx = stash.gearUids.indexOf(uid);
    if (idx < 0) return { success: false, message: 'Item not on home shelves.' };
    if (typeof getTravelKitGearBlockReason === 'function' && getTravelKitGearBlockReason()) {
        return { success: false, message: typeof getTravelKitFullMessage === 'function' ? getTravelKitFullMessage() : 'Travel kit full.' };
    }
    stash.gearUids.splice(idx, 1);
    G.gearBag.push(uid);
    const inst = getGearInstance(uid);
    const def = getInstanceDef(inst);
    return { success: true, message: `Packed ${def ? formatInstanceName(inst) : 'gear'} into your travel kit.` };
}

function stashSpareManualsToResidence() {
    if (!canAccessResidenceStash()) return { success: false, message: 'Found a sect first.' };
    ensureManualShelf();
    let moved = 0;
    const knownSpares = Object.values(G.manualShelf).filter(entry => {
        return G.techniques.some(t => t.name === entry.technique) && entry.count > 0;
    });
    for (const entry of knownSpares) {
        while (entry.count > 0 && moved < (RESIDENCE_STASH_BALANCE.stashAllManualsMax || 20)) {
            const result = stashManualToResidence(entry.technique, 1);
            if (!result.success) break;
            moved++;
        }
    }
    if (moved <= 0) {
        return { success: false, message: 'No spare known-manual copies to shelve, or shelves are full.' };
    }
    return { success: true, message: `Shelved ${moved} spare manual${moved !== 1 ? 's' : ''} at your quarters.`, moved };
}

function renderResidenceStashPanelHtml() {
    if (!canAccessResidenceStash()) {
        return `<p class="sect-hint">Found your sect to unlock personal shelves at your quarters.</p>`;
    }
    ensureResidenceStash();
    const bd = getResidenceStashBreakdown();
    const pct = Math.min(100, Math.round((bd.total / bd.capacity) * 100));
    const overClass = bd.over ? ' residence-stash-over' : '';
    let html = `<div class="sect-section-title">📚 Home Shelves</div>`;
    html += `<p class="sect-hint">Bulk storage at your quarters — free your travel kit before expeditions. Upgrade residence for more shelf space.</p>`;
    html += `<div class="residence-stash-panel${overClass}">`;
    html += `<div class="residence-stash-head"><span>Capacity</span><strong>${formatTravelKitLoad(bd.total)} / ${bd.capacity}</strong></div>`;
    html += `<div class="travel-kit-bar-track"><div class="travel-kit-bar-fill" style="width:${pct}%"></div></div>`;
    html += `<div class="travel-kit-breakdown">`;
    [['📜 Manuals', bd.manuals], ['⛏️ Materials', bd.materials], ['💊 Pills', bd.pills], ['🎒 Gear', bd.gear], ['📦 Curios', bd.curios]]
        .forEach(([label, val]) => { if (val > 0.001) html += `<span class="travel-kit-chip">${label} ${formatTravelKitLoad(val)}</span>`; });
    html += `</div>`;
    if (bd.over) html += `<p class="travel-kit-warn">Shelves over capacity — withdraw or upgrade quarters.</p>`;
    html += `</div>`;

    html += `<div class="residence-stash-actions">`;
    html += `<button type="button" class="sect-action-btn sect-action-btn-sm" id="btnStashSpareManuals">📜 Shelve spare manuals</button>`;
    html += `</div>`;

    const stash = G.sect.residence.stash;
    const hasStashed = getResidenceStashLoad(stash) > 0.001;
    if (hasStashed) {
        html += `<div class="sect-section-title sect-subsection">🏠 On Shelves</div>`;
        Object.values(stash.manuals).sort((a, b) => a.technique.localeCompare(b.technique)).forEach(entry => {
            const countBadge = entry.count > 1 ? ` ×${entry.count}` : '';
            html += `<div class="residence-stash-row">
                <span>📜 ${escapeSectAttr(entry.technique)}${countBadge}</span>
                <button type="button" class="sect-deposit-btn" data-withdraw-stash-manual="${escapeSectAttr(entry.technique)}">Pack</button>
            </div>`;
        });
        Object.entries(stash.materials).filter(([, q]) => q > 0).forEach(([matId, qty]) => {
            const mat = CRAFT_MATERIALS[matId];
            html += `<div class="residence-stash-row">
                <span>${mat?.emoji || '⛏️'} ${escapeSectAttr(mat?.name || matId)} ×${qty}</span>
                <button type="button" class="sect-deposit-btn" data-withdraw-stash-mat="${escapeSectAttr(matId)}">Pack 1</button>
                <button type="button" class="sect-deposit-btn" data-withdraw-stash-mat-all="${escapeSectAttr(matId)}" data-withdraw-qty="${qty}">Pack all</button>
            </div>`;
        });
        Object.entries(stash.pills).filter(([, q]) => q > 0).forEach(([pillId, qty]) => {
            const pill = PILL_TYPES[pillId];
            html += `<div class="residence-stash-row">
                <span>${pill?.emoji || '💊'} ${escapeSectAttr(pill?.name || pillId)} ×${qty}</span>
                <button type="button" class="sect-deposit-btn" data-withdraw-stash-pill="${escapeSectAttr(pillId)}">Pack 1</button>
            </div>`;
        });
        stash.gearUids.forEach(uid => {
            const inst = typeof getGearInstance === 'function' ? getGearInstance(uid) : null;
            const def = inst && typeof getInstanceDef === 'function' ? getInstanceDef(inst) : null;
            html += `<div class="residence-stash-row">
                <span>${def?.emoji || '🎒'} ${escapeSectAttr(def ? formatInstanceName(inst) : 'Gear')}</span>
                <button type="button" class="sect-deposit-btn" data-withdraw-stash-gear="${escapeSectAttr(uid)}">Pack</button>
            </div>`;
        });
    } else {
        html += `<p class="sect-hint">Shelves are empty — stash items from your travel kit below.</p>`;
    }

    html += `<div class="sect-section-title sect-subsection">🛏️ From Travel Kit</div>`;
    ensureManualShelf();
    const kitManuals = Object.values(G.manualShelf);
    if (kitManuals.length) {
        kitManuals.forEach(entry => {
            const known = G.techniques.some(t => t.name === entry.technique);
            const countBadge = entry.count > 1 ? ` ×${entry.count}` : '';
            html += `<div class="residence-stash-row">
                <span>📜 ${escapeSectAttr(entry.technique)}${countBadge}${known ? ' <span class="travel-kit-manual-known">spare</span>' : ''}</span>
                <button type="button" class="sect-deposit-btn" data-stash-manual="${escapeSectAttr(entry.technique)}">Shelve</button>
            </div>`;
        });
    }
    Object.entries(G.materials || {}).filter(([, q]) => q > 0).forEach(([matId, qty]) => {
        const mat = CRAFT_MATERIALS[matId];
        html += `<div class="residence-stash-row">
            <span>${mat?.emoji || '⛏️'} ${escapeSectAttr(mat?.name || matId)} ×${qty}</span>
            <button type="button" class="sect-deposit-btn" data-stash-mat="${escapeSectAttr(matId)}">Shelve 5</button>
            <button type="button" class="sect-deposit-btn" data-stash-mat-all="${escapeSectAttr(matId)}" data-stash-qty="${qty}">Shelve all</button>
        </div>`;
    });
    ensurePillStock();
    Object.entries(G.pillStock || {}).filter(([, q]) => q > 0).forEach(([pillId, qty]) => {
        const pill = PILL_TYPES[pillId];
        html += `<div class="residence-stash-row">
            <span>${pill?.emoji || '💊'} ${escapeSectAttr(pill?.name || pillId)} ×${qty}</span>
            <button type="button" class="sect-deposit-btn" data-stash-pill="${escapeSectAttr(pillId)}">Shelve 1</button>
        </div>`;
    });
    ensureGearState();
    (G.gearBag || []).forEach(uid => {
        const inst = getGearInstance(uid);
        const def = getInstanceDef(inst);
        html += `<div class="residence-stash-row">
            <span>${def?.emoji || '🎒'} ${escapeSectAttr(def ? formatInstanceName(inst) : 'Gear')}</span>
            <button type="button" class="sect-deposit-btn" data-stash-gear="${escapeSectAttr(uid)}">Shelve</button>
        </div>`;
    });
    if (!kitManuals.length && !Object.keys(G.materials || {}).length && !Object.values(G.pillStock || {}).some(q => q > 0) && !(G.gearBag || []).length) {
        html += `<p class="sect-hint">Your travel kit has nothing to shelve right now.</p>`;
    }

    return html;
}

function bindResidenceStashEvents(container) {
    if (!container) return;
    const refresh = () => {
        if (typeof renderSectPopup === 'function') renderSectPopup();
        fullRender();
    };
    const logResult = (result, emoji) => {
        if (result?.message) addLog(result.success ? `${emoji} ${result.message}` : `${emoji} ${result.message}`);
    };
    container.querySelector('#btnStashSpareManuals')?.addEventListener('click', () => {
        logResult(stashSpareManualsToResidence(), '📚');
        refresh();
    });
    container.querySelectorAll('[data-stash-manual]').forEach(btn => {
        btn.addEventListener('click', function() {
            logResult(stashManualToResidence(this.dataset.stashManual, 1), '📚');
            refresh();
        });
    });
    container.querySelectorAll('[data-withdraw-stash-manual]').forEach(btn => {
        btn.addEventListener('click', function() {
            logResult(withdrawManualFromResidence(this.dataset.withdrawStashManual, 1), '📚');
            refresh();
        });
    });
    container.querySelectorAll('[data-stash-mat]').forEach(btn => {
        btn.addEventListener('click', function() {
            logResult(stashMaterialToResidence(this.dataset.stashMat, 5), '📚');
            refresh();
        });
    });
    container.querySelectorAll('[data-stash-mat-all]').forEach(btn => {
        btn.addEventListener('click', function() {
            const qty = parseInt(this.dataset.stashQty, 10) || 1;
            logResult(stashMaterialToResidence(this.dataset.stashMatAll, qty), '📚');
            refresh();
        });
    });
    container.querySelectorAll('[data-withdraw-stash-mat]').forEach(btn => {
        btn.addEventListener('click', function() {
            logResult(withdrawMaterialFromResidence(this.dataset.withdrawStashMat, 1), '📚');
            refresh();
        });
    });
    container.querySelectorAll('[data-withdraw-stash-mat-all]').forEach(btn => {
        btn.addEventListener('click', function() {
            const qty = parseInt(this.dataset.withdrawQty, 10) || 1;
            logResult(withdrawMaterialFromResidence(this.dataset.withdrawStashMatAll, qty), '📚');
            refresh();
        });
    });
    container.querySelectorAll('[data-stash-pill]').forEach(btn => {
        btn.addEventListener('click', function() {
            logResult(stashPillToResidence(this.dataset.stashPill, 1), '📚');
            refresh();
        });
    });
    container.querySelectorAll('[data-withdraw-stash-pill]').forEach(btn => {
        btn.addEventListener('click', function() {
            logResult(withdrawPillFromResidence(this.dataset.withdrawStashPill, 1), '📚');
            refresh();
        });
    });
    container.querySelectorAll('[data-stash-gear]').forEach(btn => {
        btn.addEventListener('click', function() {
            logResult(stashGearToResidence(this.dataset.stashGear), '📚');
            refresh();
        });
    });
    container.querySelectorAll('[data-withdraw-stash-gear]').forEach(btn => {
        btn.addEventListener('click', function() {
            logResult(withdrawGearFromResidence(this.dataset.withdrawStashGear), '📚');
            refresh();
        });
    });
}
