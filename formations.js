// ============================================
// FORMATIONS.JS — Residence formations (v1)
// ============================================

function ensureFormationState() {
    if (!G.knownFormations) G.knownFormations = [];
    if (typeof ensureSectGroundsView === 'function') ensureSectGroundsView();
    if (!G.sect.residence.formations) G.sect.residence.formations = { slots: [] };
    if (!Array.isArray(G.sect.residence.formations.slots)) {
        G.sect.residence.formations.slots = [];
    }
    ensureResidenceFormationSlots();
}

function migrateFormationsForExistingSave() {
    ensureFormationState();
    const residenceLv = typeof getResidenceLevel === 'function' ? getResidenceLevel() : (G.sect?.residence?.level || 0);
    for (let lv = 1; lv <= residenceLv; lv++) {
        grantFormationsForResidenceLevel(lv, { silent: true });
    }
    ensureResidenceFormationSlots();
}

function getFormationDef(formationId) {
    return typeof FORMATIONS !== 'undefined' ? FORMATIONS[formationId] : null;
}

function knowsFormation(formationId) {
    ensureFormationState();
    return G.knownFormations.includes(formationId);
}

function learnFormation(formationId, options) {
    ensureFormationState();
    const def = getFormationDef(formationId);
    if (!def || def.implemented === false) return false;
    if (knowsFormation(formationId)) return false;
    G.knownFormations.push(formationId);
    if (!options?.silent) {
        addLog(`📜 Formation manual comprehended: ${def.emoji} ${def.name}.`);
    }
    return true;
}

function grantFormationsForResidenceLevel(level, options) {
    if (typeof FORMATIONS === 'undefined') return;
    Object.values(FORMATIONS).forEach(def => {
        if (def.implemented === false) return;
        if (def.learnOnResidenceLevel === level) {
            learnFormation(def.id, { silent: !!options?.silent });
        }
    });
}

function getResidenceFormationSlotCount() {
    const lv = typeof getResidenceLevel === 'function' ? getResidenceLevel() : (G.sect?.residence?.level || 0);
    const table = SECT_RESIDENCE?.formationSlotsByLevel;
    if (Array.isArray(table) && table[lv] != null) return table[lv];
    return Math.max(0, lv);
}

function ensureResidenceFormationSlots() {
    const max = getResidenceFormationSlotCount();
    const slots = G.sect.residence.formations.slots;
    while (slots.length < max) slots.push(null);
    while (slots.length > max) slots.pop();
    for (let i = 0; i < slots.length; i++) {
        if (slots[i] && !knowsFormation(slots[i])) slots[i] = null;
    }
}

function getLaidResidenceFormations() {
    ensureResidenceFormationSlots();
    return G.sect.residence.formations.slots.filter(id => id && getFormationDef(id));
}

function getResidenceFormationEffects() {
    const fx = { cultivatePct: 0, foundationPerCultivate: 0, labels: [] };
    getLaidResidenceFormations().forEach(id => {
        const def = getFormationDef(id);
        if (!def?.effects) return;
        if (def.effects.cultivatePct) fx.cultivatePct += def.effects.cultivatePct;
        if (def.effects.foundationPerCultivate) fx.foundationPerCultivate += def.effects.foundationPerCultivate;
        fx.labels.push(`${def.emoji} ${def.name}`);
    });
    return fx;
}

function getResidenceFormationCultivateMult() {
    const fx = getResidenceFormationEffects();
    return 1 + (fx.cultivatePct || 0) / 100;
}

function getLayFormationBlockReason(slotIndex, formationId) {
    ensureFormationState();
    if (!isSectFounded()) return 'Found a sect first.';
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'You cannot inscribe a formation right now.';
    const residenceLv = typeof getResidenceLevel === 'function' ? getResidenceLevel() : 0;
    if (residenceLv < 1) return 'Upgrade your quarters before laying formations.';
    const def = getFormationDef(formationId);
    if (!def) return 'Unknown formation.';
    if (def.implemented === false) return `${def.name} is not yet available.`;
    if (def.deploy !== 'residence') return 'This formation cannot be laid at your quarters.';
    if (!knowsFormation(formationId)) return `You have not comprehended ${def.name}.`;
    if ((def.minResidenceLevel || 1) > residenceLv) {
        return `Requires residence level ${def.minResidenceLevel}.`;
    }
    const maxSlots = getResidenceFormationSlotCount();
    if (slotIndex < 0 || slotIndex >= maxSlots) return 'Invalid formation slot.';
    const cost = def.layCost;
    if (!cost) return 'Cannot inscribe this formation.';
    if (typeof getConstructionMaterialsBlock === 'function') {
        const matBlock = getConstructionMaterialsBlock(cost);
        if (matBlock) return matBlock;
    }
    return null;
}

function layResidenceFormation(slotIndex, formationId) {
    const block = getLayFormationBlockReason(slotIndex, formationId);
    if (block) return { success: false, message: block };
    const def = getFormationDef(formationId);
    const cost = def.layCost;
    const months = cost.months || 2;
    const label = `Inscribing ${def.name}`;
    if (!advanceTime(months, label)) {
        return { success: false, message: 'Your lifespan ends before the inscription completes.' };
    }
    if (cost.materials && typeof removeCraftMaterials === 'function' && !removeCraftMaterials(cost.materials)) {
        return { success: false, message: 'Missing materials.' };
    }
    ensureResidenceFormationSlots();
    const prev = G.sect.residence.formations.slots[slotIndex];
    G.sect.residence.formations.slots[slotIndex] = formationId;
    const replaceNote = prev && prev !== formationId
        ? ` Replaced ${getFormationDef(prev)?.name || 'previous pattern'}.`
        : '';
    addLog(`☯️ ${def.emoji} ${def.name} inscribed around your quarters.${replaceNote}`);
    return { success: true, message: `${def.name} active in slot ${slotIndex + 1}.` };
}

function clearResidenceFormationSlot(slotIndex) {
    ensureFormationState();
    const maxSlots = getResidenceFormationSlotCount();
    if (slotIndex < 0 || slotIndex >= maxSlots) {
        return { success: false, message: 'Invalid formation slot.' };
    }
    const prev = G.sect.residence.formations.slots[slotIndex];
    if (!prev) return { success: false, message: 'Slot is already empty.' };
    G.sect.residence.formations.slots[slotIndex] = null;
    const def = getFormationDef(prev);
    addLog(`☯️ ${def?.emoji || '☯️'} Formation cleared from slot ${slotIndex + 1}.`);
    return { success: true, message: 'Formation slot cleared.' };
}

function actionResidenceCultivate() {
    if (typeof actionBlocked === 'function' && actionBlocked()) return;
    if (!isSectFounded()) return;
    if (getResidenceLevel() < 1) {
        addLog('🏠 Upgrade your quarters before cultivating there.');
        fullRender();
        return;
    }
    beginActionLog();
    const months = ACTION_MONTHS.cultivate;
    if (!advanceTime(months, 'Cultivating at your quarters')) {
        cancelActionLog();
        fullRender();
        return;
    }
    const formFx = getResidenceFormationEffects();
    const formMult = getResidenceFormationCultivateMult();
    const bonusParts = [];
    if (formFx.cultivatePct > 0) bonusParts.push(`formations +${formFx.cultivatePct}%`);
    let cultMsg = '';
    if (typeof runCultivateSession === 'function') {
        cultMsg = runCultivateSession({
            extraMult: formMult,
            extraFoundation: formFx.foundationPerCultivate || 0,
            bonusNoteParts: bonusParts,
            logPrefix: '🏠 At your quarters'
        });
    }
    if (formFx.labels.length) {
        cultMsg += ` · Active: ${formFx.labels.join(', ')}`;
    }
    commitActionLog(cultMsg || '🏠 You cultivate at your quarters.');
    if (typeof triggerTutorial === 'function') triggerTutorial('first_cultivate');
    fullRender();
}

function renderResidenceFormationsHtml() {
    ensureFormationState();
    const slotCount = getResidenceFormationSlotCount();
    const residenceLv = getResidenceLevel();
    let html = `<div class="sect-section-title">☯️ Courtyard Formations</div>`;

    if (residenceLv < 1) {
        html += `<p class="sect-hint">Upgrade to Inner Court Room to inscribe your first formation.</p>`;
        return html;
    }

    if (slotCount <= 0) {
        html += `<p class="sect-hint">No formation slots at this residence level.</p>`;
        return html;
    }

    const known = G.knownFormations
        .map(id => getFormationDef(id))
        .filter(def => def && def.deploy === 'residence' && def.implemented !== false);

    if (!known.length) {
        html += `<p class="sect-hint">No formation manuals comprehended yet. Further residence upgrades reveal patterns.</p>`;
    } else {
        html += `<p class="sect-hint">Inscribe known patterns into courtyard slots. Bonuses apply when you cultivate here.</p>`;
    }

    const fx = getResidenceFormationEffects();
    if (fx.cultivatePct > 0 || fx.foundationPerCultivate > 0) {
        const parts = [];
        if (fx.cultivatePct > 0) parts.push(`+${fx.cultivatePct}% cultivate`);
        if (fx.foundationPerCultivate > 0) parts.push(`+${fx.foundationPerCultivate} Foundation/session`);
        html += `<div class="sect-formation-summary">Active bonus: <strong>${parts.join(' · ')}</strong></div>`;
    }

    ensureResidenceFormationSlots();
    const slots = G.sect.residence.formations.slots;
    html += `<div class="sect-formation-slots">`;
    for (let i = 0; i < slotCount; i++) {
        const laidId = slots[i];
        const laidDef = laidId ? getFormationDef(laidId) : null;
        html += `<div class="sect-formation-slot">`;
        html += `<div class="sect-formation-slot-head"><span>Slot ${i + 1}</span>`;
        if (laidDef) {
            html += `<span class="sect-formation-active">${laidDef.emoji} ${laidDef.name}</span>`;
        } else {
            html += `<span class="sect-formation-empty">Empty</span>`;
        }
        html += `</div>`;
        if (laidDef) {
            html += `<p class="sect-hint">${laidDef.desc}</p>`;
            html += `<button type="button" class="sect-action-btn sect-formation-clear-btn" data-formation-clear="${i}">Clear slot</button>`;
        }
        if (known.length) {
            html += `<div class="sect-formation-lay-row">`;
            known.forEach(def => {
                const block = getLayFormationBlockReason(i, def.id);
                const cost = def.layCost;
                const matHint = cost?.months ? `${cost.months}mo` : '';
                html += `<button type="button" class="sect-formation-lay-btn" data-formation-lay="${def.id}" data-formation-slot="${i}"
                    ${block ? `disabled title="${escapeSectAttr(block)}"` : ''}>
                    ${def.emoji} Inscribe ${def.name}${matHint ? ` (${matHint})` : ''}
                </button>`;
            });
            html += `</div>`;
        }
        html += `</div>`;
    }
    html += `</div>`;

    if (G.knownFormations.length) {
        html += `<div class="sect-section-title sect-section-muted">📜 Known Manuals</div><ul class="sect-formation-manual-list">`;
        G.knownFormations.forEach(id => {
            const def = getFormationDef(id);
            if (!def) return;
            const status = def.implemented === false ? ' <em>(coming soon)</em>' : '';
            html += `<li>${def.emoji} <strong>${def.name}</strong> — ${def.desc}${status}</li>`;
        });
        html += `</ul>`;
    }

    html += `<button type="button" class="sect-action-btn" id="btnResidenceCultivate">🏠 Cultivate at quarters (${ACTION_MONTHS.cultivate} months)</button>`;
    return html;
}
