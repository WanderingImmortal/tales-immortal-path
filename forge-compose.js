// ============================================
// FORGE-COMPOSE.JS — Mundane pattern + core + aux forge
// ============================================

function ensureForgeComposeState() {
    ensureForgeState();
    if (!G.forge.compose) {
        G.forge.compose = {
            patternId: 'sword',
            coreMatId: 'iron_ore',
            auxMatIds: []
        };
    }
    if (!Array.isArray(G.forge.compose.auxMatIds)) G.forge.compose.auxMatIds = [];
}

function rollForgeComposeGrade() {
    const weights = FORGE_COMPOSE_BALANCE.gradeWeights || [];
    let total = 0;
    weights.forEach(w => { total += w.weight; });
    let r = Math.random() * total;
    for (const row of weights) {
        r -= row.weight;
        if (r <= 0) return row.id;
    }
    return 'common';
}

function rollIntRange(min, max) {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    return lo + Math.floor(Math.random() * (hi - lo + 1));
}

function mergeMartialBlocks(target, source, mult) {
    mult = mult != null ? mult : 1;
    if (!source) return;
    Object.entries(source).forEach(([key, val]) => {
        if (typeof val !== 'number') return;
        const add = key === 'qiDensityBonus' ? val * mult : Math.floor(val * mult);
        target[key] = (target[key] || 0) + add;
    });
}

function getForgePatternDef(patternId) {
    return FORGE_PATTERNS[patternId] || null;
}

function getForgeCoreDef(matId) {
    return FORGE_CORE_MATERIALS[matId] || null;
}

function listMundaneForgePatterns() {
    return Object.values(FORGE_PATTERNS);
}

function listValidCoresForPattern(patternId) {
    const pattern = getForgePatternDef(patternId);
    if (!pattern) return [];
    return Object.values(FORGE_CORE_MATERIALS).filter(core =>
        core.allowedPatterns.includes(pattern.id)
    );
}

function listValidAuxMaterials() {
    return Object.values(FORGE_AUX_MATERIALS);
}

function normalizeAuxSelection(auxIds) {
    const max = FORGE_COMPOSE_BALANCE.maxAuxSlots || 2;
    const out = [];
    (auxIds || []).forEach(id => {
        if (!id || out.length >= max) return;
        if (!FORGE_AUX_MATERIALS[id]) return;
        out.push(id);
    });
    return out;
}

function buildMundaneForgeDisplayName(pattern, core) {
    const tierWord = 'Mundane';
    const coreLabel = core?.label || 'unknown';
    const noun = pattern?.noun || 'gear';
    return `${tierWord} ${coreLabel.toLowerCase()} ${noun}`;
}

function resolveMundaneForgeStats(patternId, coreMatId, auxMatIds, options) {
    options = options || {};
    const pattern = getForgePatternDef(patternId);
    const core = getForgeCoreDef(coreMatId);
    if (!pattern || !core) return { ok: false, reason: 'Invalid pattern or core.' };
    if (!core.allowedPatterns.includes(pattern.id)) {
        return { ok: false, reason: `${core.label} cannot form a ${pattern.label.toLowerCase()}.` };
    }

    const auxIds = normalizeAuxSelection(auxMatIds);
    const martial = {};
    const coreRoll = {};
    Object.entries(core.martial || {}).forEach(([key, band]) => {
        if (!Array.isArray(band) || band.length < 2) return;
        const val = rollIntRange(band[0], band[1]);
        coreRoll[key] = val;
        martial[key] = val;
    });

    auxIds.forEach(auxId => {
        mergeMartialBlocks(martial, FORGE_AUX_MATERIALS[auxId]?.martial, 1);
    });

    let coreOnlyMult = 1;
    if (!auxIds.length) {
        coreOnlyMult = FORGE_COMPOSE_BALANCE.coreOnlyStatMult ?? 0.72;
        Object.keys(martial).forEach(key => {
            if (key === 'qiDensityBonus') martial[key] = Math.round(martial[key] * coreOnlyMult * 1000) / 1000;
            else martial[key] = Math.floor((martial[key] || 0) * coreOnlyMult);
        });
    }

    if (pattern.slot !== 'weapon') delete martial.flatDmg;

    const gradeId = options.gradeId || rollForgeComposeGrade();
    const displayName = buildMundaneForgeDisplayName(pattern, core);

    return {
        ok: true,
        pattern,
        core,
        auxIds,
        martial,
        coreRoll,
        coreOnlyMult,
        gradeId,
        displayName,
        gearTier: 1,
        gearTierLabel: GEAR_TIER_LABELS[1] || 'mundane'
    };
}

function getMundaneForgeMaterialCost(coreMatId, auxMatIds) {
    const auxIds = normalizeAuxSelection(auxMatIds);
    const costs = {};
    costs[coreMatId] = FORGE_COMPOSE_BALANCE.coreMaterialQty || 2;
    auxIds.forEach(id => {
        costs[id] = (costs[id] || 0) + (FORGE_COMPOSE_BALANCE.auxMaterialQty || 1);
    });
    return costs;
}

function canCraftMundaneCompose(patternId, coreMatId, auxMatIds) {
    ensureForgeComposeState();
    const resolved = resolveMundaneForgeStats(patternId, coreMatId, auxMatIds, { gradeId: 'common' });
    if (!resolved.ok) return resolved;

    if ((G.realmIdx || 0) < getForgeTierMinRealm(1)) {
        return { ok: false, reason: `Requires ${getForgeRealmGateLabel(getForgeTierMinRealm(1))}.` };
    }

    const stones = FORGE_COMPOSE_BALANCE.mundaneStones || 8;
    if (G.stones < stones) return { ok: false, reason: `Need ${stones} Stones.` };

    const costs = getMundaneForgeMaterialCost(coreMatId, auxMatIds);
    for (const [matId, qty] of Object.entries(costs)) {
        if (getMaterialCount(matId) < qty) {
            const mat = CRAFT_MATERIALS[matId];
            return { ok: false, reason: `Need ${qty}× ${mat?.name || matId}.` };
        }
    }

    return { ok: true, resolved, costs, stones, months: getEffectiveForgeMonths(FORGE_COMPOSE_BALANCE.mundaneMonths || 2, { atSect: G.forge.atSect && G.sect }) };
}

function previewMundaneCompose(patternId, coreMatId, auxMatIds) {
    const resolved = resolveMundaneForgeStats(patternId, coreMatId, auxMatIds, { gradeId: 'common' });
    if (!resolved.ok) return resolved;
    const gradeMult = getGearGradeDef(resolved.gradeId).statMult ?? 1;
    const preview = {};
    Object.entries(resolved.martial).forEach(([key, val]) => {
        if (key === 'qiDensityBonus') preview[key] = Math.round(val * gradeMult * 1000) / 1000;
        else preview[key] = Math.floor(val * gradeMult);
    });
    return { ...resolved, previewStats: preview, gradeMult };
}

function craftMundaneCompose(options) {
    options = options || {};
    if (typeof actionBlocked === 'function' && actionBlocked() && !G.inForgeChamber) return { ok: false };
    ensureForgeComposeState();
    const { patternId, coreMatId, auxMatIds } = G.forge.compose;
    const check = canCraftMundaneCompose(patternId, coreMatId, auxMatIds);
    if (!check.ok) {
        addLog(`🔨 ${check.reason}`);
        if (typeof renderForgeChamberUI === 'function') renderForgeChamberUI();
        fullRender();
        return { ok: false, reason: check.reason };
    }

    const atSect = options.atSect || (G.forge?.atSect && G.sect);
    const months = check.months;
    const label = atSect ? `Sect forge: ${check.resolved.displayName}` : `Forging ${check.resolved.displayName}`;

    if (!advanceTime(months, label)) {
        if (typeof renderForgeChamberUI === 'function') renderForgeChamberUI();
        fullRender();
        return { ok: false };
    }

    G.stones -= check.stones;
    removeCraftMaterials(check.costs);
    ensureForgeState();
    G.forge.totalForges = (G.forge.totalForges || 0) + 1;
    grantForgeSkillXp(FORGE_BALANCE.skillXpPerForge);

    const rolled = resolveMundaneForgeStats(patternId, coreMatId, auxMatIds);
    const uid = createGearInstance('composed_mundane_gear', {
        grade: rolled.gradeId,
        source: 'forge',
        compose: {
            patternId: rolled.pattern.id,
            coreMatId: rolled.core.id,
            auxMatIds: rolled.auxIds.slice(),
            slot: rolled.pattern.slot,
            weaponType: rolled.pattern.weaponType,
            emoji: rolled.pattern.emoji,
            displayName: rolled.displayName,
            gearTier: rolled.gearTier,
            gearTierLabel: rolled.gearTierLabel,
            martialBase: rolled.martial
        }
    });
    const inst = getGearInstance(uid);
    applyForgeInstanceBonuses(inst);

    G.forge.successfulForges = (G.forge.successfulForges || 0) + 1;
    grantForgeSkillXp(FORGE_BALANCE.skillXpPerSuccess);

    const gradeLabel = formatGearGradeLabel(inst, 'full');
    const auxNote = rolled.auxIds.length ? '' : ' (core only — weaker)';
    addLog(`🔨 Forged ${rolled.pattern.emoji} ${gradeLabel} ${rolled.displayName}!${auxNote}`);
    if (typeof triggerForgeAnim === 'function') triggerForgeAnim('success');
    if (typeof renderForgeChamberUI === 'function') renderForgeChamberUI();
    if (typeof renderInventoryPopup === 'function') renderInventoryPopup();
    fullRender();
    return { ok: true, uid };
}

function formatMundaneForgeMaterialCostLine(coreMatId, auxMatIds) {
    const costs = getMundaneForgeMaterialCost(coreMatId, auxMatIds);
    return Object.entries(costs).map(([matId, qty]) => {
        const mat = CRAFT_MATERIALS[matId];
        const have = getMaterialCount(matId);
        const ok = have >= qty;
        return `${ok ? '✓' : '✗'} ${qty}× ${mat?.emoji || '◆'} ${mat?.name || matId} (${have})`;
    }).join(' · ');
}

function formatMundanePreviewStats(preview) {
    if (!preview) return '';
    const parts = [];
    Object.entries(preview).forEach(([key, val]) => {
        const line = formatStatDelta(val, key);
        if (line) parts.push(line);
    });
    return parts.join(' · ') || '—';
}
