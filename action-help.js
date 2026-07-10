// ============================================
// ACTION-HELP.JS — ? popovers + optional hover tooltips
// ============================================

let _actionHelpAnchor = null;

function setHoverTooltip(el, text) {
    if (!el) return;
    if (isHoverTooltipsEnabled() && text) el.setAttribute('title', text);
    else el.removeAttribute('title');
}

function closeActionHelpPopover() {
    const pop = document.getElementById('actionHelpPopover');
    if (!pop) return;
    pop.hidden = true;
    _actionHelpAnchor = null;
}

function positionActionHelpPopover(anchor) {
    const pop = document.getElementById('actionHelpPopover');
    if (!pop || !anchor) return;
    const rect = anchor.getBoundingClientRect();
    const margin = 8;
    const popRect = pop.getBoundingClientRect();
    let top = rect.bottom + margin;
    let left = rect.left + rect.width / 2 - popRect.width / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - popRect.width - margin));
    if (top + popRect.height > window.innerHeight - margin) {
        top = Math.max(margin, rect.top - popRect.height - margin);
    }
    pop.style.top = `${top + window.scrollY}px`;
    pop.style.left = `${left + window.scrollX}px`;
}

function openActionHelpPopover(anchor, content) {
    const pop = document.getElementById('actionHelpPopover');
    const titleEl = document.getElementById('actionHelpTitle');
    const descEl = document.getElementById('actionHelpDesc');
    const statsEl = document.getElementById('actionHelpStats');
    if (!pop || !titleEl || !descEl || !statsEl) return;

    const block = content.block || '';
    titleEl.textContent = content.title || '';
    descEl.textContent = block || content.desc || '';
    descEl.hidden = !descEl.textContent;
    const stats = content.stats || '';
    if (typeof stats === 'string') {
        statsEl.innerHTML = stats ? `<div class="action-help-stat-line">${stats}</div>` : '';
    } else if (Array.isArray(stats)) {
        statsEl.innerHTML = stats.filter(Boolean).map(line =>
            `<div class="action-help-stat-line">${line}</div>`
        ).join('');
    } else {
        statsEl.innerHTML = '';
    }
    statsEl.hidden = !statsEl.innerHTML;

    pop.hidden = false;
    _actionHelpAnchor = anchor;
    positionActionHelpPopover(anchor);
}

function toggleActionHelpPopover(anchor, content) {
    const pop = document.getElementById('actionHelpPopover');
    if (!pop) return;
    if (!pop.hidden && _actionHelpAnchor === anchor) {
        closeActionHelpPopover();
        return;
    }
    openActionHelpPopover(anchor, content);
}

function createActionHelpBtn(config) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'action-help-btn' + (config.className ? ` ${config.className}` : '');
    btn.textContent = '?';
    btn.setAttribute('aria-label', `About ${config.title || 'this action'}`);
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const block = typeof config.getBlock === 'function' ? config.getBlock() : config.block;
        const desc = typeof config.getDesc === 'function' ? config.getDesc() : config.desc;
        const statsRaw = typeof config.getStats === 'function' ? config.getStats() : config.stats;
        const stats = block
            ? [block, ...(Array.isArray(statsRaw) ? statsRaw : (statsRaw ? [statsRaw] : []))]
            : statsRaw;
        toggleActionHelpPopover(btn, {
            title: config.title,
            desc,
            stats,
            block: ''
        });
    });
    return btn;
}

function bindChamberActionHelp(btnId, config) {
    const btn = document.getElementById(btnId);
    if (!btn || btn.dataset.helpBound) return;
    btn.dataset.helpBound = '1';
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const block = typeof config.getBlock === 'function' ? config.getBlock() : config.block;
        const statsRaw = typeof config.getStats === 'function' ? config.getStats() : config.stats;
        const stats = block
            ? [block, ...(Array.isArray(statsRaw) ? statsRaw : (statsRaw ? [statsRaw] : []))]
            : statsRaw;
        toggleActionHelpPopover(btn, {
            title: config.title,
            desc: config.desc,
            stats,
            block: ''
        });
    });
}

function initActionHelp() {
    document.getElementById('actionHelpPopoverClose')?.addEventListener('click', closeActionHelpPopover);
    document.addEventListener('click', (e) => {
        const pop = document.getElementById('actionHelpPopover');
        if (!pop || pop.hidden) return;
        if (e.target.closest('#actionHelpPopover') || e.target.closest('.action-help-btn')) return;
        closeActionHelpPopover();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeActionHelpPopover();
    });
    window.addEventListener('resize', () => {
        if (_actionHelpAnchor) positionActionHelpPopover(_actionHelpAnchor);
    });
}

function getCultivationGuideEntry(key) {
    return typeof CULTIVATION_ACTION_GUIDE !== 'undefined' ? CULTIVATION_ACTION_GUIDE[key] : null;
}

function formatBodyChamberActionStats(layerId, action) {
    const count = typeof getBodyLayerActionCount === 'function'
        ? getBodyLayerActionCount(layerId, action.id) : 0;
    const maxStacks = typeof getBodyActionMaxStacks === 'function' ? getBodyActionMaxStacks(action) : 3;
    const matLine = typeof formatBodyMaterialCost === 'function' ? formatBodyMaterialCost(action) : '';
    const meridianOpen = action.meridianIndex != null
        && typeof isBodyMeridianOpen === 'function' && isBodyMeridianOpen(action.meridianIndex);
    const lines = [action.desc, `${action.weeks} week${action.weeks === 1 ? '' : 's'}`];
    if (action.once) lines.push('One-time action');
    if (matLine) lines.push(matLine);
    if (meridianOpen) lines.push('☯️ Meridian open');
    lines.push(`Stacks: ${count}/${maxStacks}`);
    return lines;
}

function formatSoulChamberActionStats(layerId, action) {
    const count = typeof getSoulLayerActionCount === 'function'
        ? getSoulLayerActionCount(layerId, action.id) : 0;
    const maxStacks = typeof getSoulActionMaxStacks === 'function' ? getSoulActionMaxStacks(action) : 3;
    const matLine = typeof formatSoulMaterialCost === 'function' ? formatSoulMaterialCost(action) : '';
    const lines = [action.desc, `${action.weeks} week${action.weeks === 1 ? '' : 's'}`];
    if (matLine) lines.push(matLine);
    if (action.requiresTrueDao) lines.push('Requires True Dao');
    lines.push(`Stacks: ${count}/${maxStacks}`);
    return lines;
}

function getBodyActionFlavor(layerId, action) {
    if (action.flavor) return action.flavor;
    const layer = typeof BODY_CHAMBER_LAYERS !== 'undefined' ? BODY_CHAMBER_LAYERS[layerId] : null;
    return `Temper the ${(layer?.label || 'body').toLowerCase()} through disciplined refinement.`;
}

function getSoulActionFlavor(layerId, action) {
    if (action.flavor) return action.flavor;
    const layer = typeof SOUL_CHAMBER_LAYERS !== 'undefined' ? SOUL_CHAMBER_LAYERS[layerId] : null;
    return `Look inward — refine the ${(layer?.label || 'soul').toLowerCase()}.`;
}

function refreshHoverTooltips() {
    if (typeof fullRender === 'function') fullRender();
    else if (typeof renderChamberUI === 'function' && G.inQiChamber) renderChamberUI();
}

function initMainPanelActionHelp() {
    if (typeof bindChamberActionHelp !== 'function') return;
    const g = (key) => getCultivationGuideEntry(key);
    bindChamberActionHelp('helpCultivate', {
        title: `${g('cultivate')?.emoji || ''} ${g('cultivate')?.label || 'Cultivate'}`.trim(),
        desc: g('cultivate')?.desc,
        stats: ['Opens Qi, Body, or Soul cultivation chambers', 'Any path can be trained']
    });
    bindChamberActionHelp('helpConsolidate', {
        title: `${g('sealDantian')?.emoji || ''} ${g('sealDantian')?.label || 'Seal Dantian'}`.trim(),
        desc: g('sealDantian')?.desc,
        getStats: () => {
            if (typeof isRealmConsolidated === 'function' && isRealmConsolidated(G.realmIdx)) {
                return ['This realm is already sealed'];
            }
            const capstone = typeof getPathCapstone === 'function' ? getPathCapstone() : null;
            const progress = typeof getPeakProgress === 'function' ? getPeakProgress() : null;
            const lines = ['Requires Settled (80%+) or Peak (100%) realm progress', 'Unlocks breakthrough for this realm'];
            if (capstone) lines.push(`Settled: ${capstone.settledAction}`, `Peak: ${capstone.peakAction}`);
            if (progress?.pct != null) lines.push(`Current progress: ${Math.round(progress.pct)}%`);
            return lines;
        }
    });
    bindChamberActionHelp('helpBreakthrough', {
        title: `${g('breakthrough')?.emoji || ''} ${g('breakthrough')?.label || 'Break Through'}`.trim(),
        desc: g('breakthrough')?.desc,
        getStats: () => {
            const chance = typeof getBreakChance === 'function' ? getBreakChance() : null;
            const months = typeof ACTION_MONTHS !== 'undefined' ? ACTION_MONTHS.breakthrough : 24;
            const lines = [`${months} months (${months / 12} years)`, 'Requires realm seal'];
            if (chance != null) lines.push(`Current odds: ~${chance}%`);
            return lines;
        }
    });
    bindChamberActionHelp('helpRecuperate', {
        title: `${g('recuperate')?.emoji || ''} ${g('recuperate')?.label || 'Recuperate'}`.trim(),
        desc: g('recuperate')?.desc,
        getStats: () => {
            const months = typeof ACTION_MONTHS !== 'undefined' ? ACTION_MONTHS.recuperate : 3;
            return [`${months} months`, 'Heals HP and regenerates barrier', 'Does not cultivate Qi or stats'];
        }
    });
}
