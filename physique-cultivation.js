// ============================================
// PHYSIQUE-CULTIVATION.JS — Staged physique projects in the Body Chamber
// ============================================

function ensurePhysiqueCultivationState() {
    if (!G.physiqueCultivation) {
        G.physiqueCultivation = {
            id: null,
            stage: 0,
            progress: 0,
            startedAtMonths: null,
            completed: []
        };
    }
    const pc = G.physiqueCultivation;
    if (!Array.isArray(pc.completed)) pc.completed = [];
    if (pc.id == null) pc.id = null;
    if (pc.stage == null) pc.stage = 0;
    if (pc.progress == null) pc.progress = 0;
}

function migratePhysiqueCultivationForExistingSave() {
    ensurePhysiqueCultivationState();
    const pc = G.physiqueCultivation;
    if (G.physiqueUnlocked?.length) {
        for (const entry of G.physiqueUnlocked) {
            const id = typeof entry === 'string' ? getPhysiqueId(entry) : entry?.id;
            if (id && !pc.completed.includes(id)) pc.completed.push(id);
        }
    }
    if (G.physique?.type === 'trainable') {
        const id = getPhysiqueId(G.physique);
        if (id && !pc.completed.includes(id)) pc.completed.push(id);
    }
    if (pc._migratedFromInstant) return;
    if (G.physique?.type === 'trainable' && !pc.id) {
        pc._migratedFromInstant = true;
    }
}

function getPhysiqueId(physiqueOrName) {
    if (!physiqueOrName) return null;
    if (typeof physiqueOrName === 'string') {
        const byId = TRAINABLE_PHYSIQUES.find(p => p.id === physiqueOrName);
        if (byId) return byId.id;
        const byName = getPhysiqueByName(physiqueOrName);
        return byName?.id || null;
    }
    return physiqueOrName.id || getPhysiqueId(physiqueOrName.name);
}

function getPhysiqueDefById(id) {
    if (!id) return null;
    return TRAINABLE_PHYSIQUES.find(p => p.id === id) || null;
}

function getPhysiqueCultivationBalance() {
    return typeof PHYSIQUE_CULTIVATION_BALANCE !== 'undefined' ? PHYSIQUE_CULTIVATION_BALANCE : {
        maxStages: 4,
        stageNames: ['Tempering', 'Forging', 'Perfection', 'Transcendence'],
        standardRefine: { weeks: 6, progress: 12 },
        catalystRefine: { weeks: 3, progress: 22 },
        bodyActionProgress: 4,
        foundationPerStage: 1,
        foundationOnComplete: 3
    };
}

function getActivePhysiqueCultivationDef() {
    ensurePhysiqueCultivationState();
    const id = G.physiqueCultivation.id;
    return id ? getPhysiqueDefById(id) : null;
}

function isPhysiqueCultivationActive() {
    ensurePhysiqueCultivationState();
    return !!G.physiqueCultivation.id;
}

function isPhysiqueCompleted(id) {
    ensurePhysiqueCultivationState();
    return G.physiqueCultivation.completed.includes(id);
}

function getPhysiqueStageName(stage) {
    const bal = getPhysiqueCultivationBalance();
    const names = bal.stageNames || [];
    return names[Math.max(0, Math.min(stage - 1, names.length - 1))] || `Stage ${stage}`;
}

function getPhysiqueBonusMultiplier(stage, progress) {
    const anchors = [0, 0.2, 0.45, 0.7, 1.0];
    const s = Math.max(1, Math.min(4, stage || 1));
    const low = anchors[s - 1];
    const high = anchors[s];
    const pct = Math.max(0, Math.min(100, progress || 0)) / 100;
    return low + (high - low) * pct;
}

function scalePhysiqueBonus(bonus, mult) {
    if (!bonus || mult <= 0) return {};
    const scaled = {};
    for (const [key, val] of Object.entries(bonus)) {
        if (typeof val !== 'number') continue;
        if (key.endsWith('Mult')) {
            scaled[key] = mult >= 1 ? val : 1 + (val - 1) * mult;
        } else if (key === 'hp' || key === 'evasion' || key === 'defense' || key === 'lightningResist' || key === 'regen') {
            scaled[key] = Math.round(val * mult);
        } else {
            const scaledVal = val * mult;
            scaled[key] = val > 0 ? Math.max(1, Math.round(scaledVal)) : Math.min(-1, Math.round(scaledVal));
            if (scaled[key] === 0 && val !== 0) scaled[key] = val > 0 ? 1 : -1;
        }
    }
    return scaled;
}

function buildScaledPhysiqueRecord(def, mult) {
    if (!def) return null;
    return {
        name: def.name,
        type: def.type,
        id: def.id,
        bonus: scalePhysiqueBonus(def.bonus, mult),
        pro: def.pro,
        con: def.con
    };
}

function getCultivatingPhysiqueBonusRecord() {
    const pc = G.physiqueCultivation;
    const def = getActivePhysiqueCultivationDef();
    if (!def || !pc?.id || pc.stage < 1) return null;
    const mult = getPhysiqueBonusMultiplier(pc.stage, pc.progress);
    return buildScaledPhysiqueRecord(def, mult);
}

function syncPhysiqueBonuses() {
    if (G._appliedPhysiqueRecord) {
        removePhysiqueBonus(G._appliedPhysiqueRecord);
        G._appliedPhysiqueRecord = null;
    }
    const cultivating = getCultivatingPhysiqueBonusRecord();
    if (cultivating) {
        applyPhysiqueBonus(cultivating);
        G._appliedPhysiqueRecord = cultivating;
        return;
    }
    if (G.physique) {
        applyPhysiqueBonus(G.physique);
        G._appliedPhysiqueRecord = { ...G.physique, bonus: { ...(G.physique.bonus || {}) } };
    }
}

function getPhysiqueCultivationStatusText() {
    ensurePhysiqueCultivationState();
    const pc = G.physiqueCultivation;
    if (!pc.id) return null;
    const def = getPhysiqueDefById(pc.id);
    if (!def) return null;
    const stageName = getPhysiqueStageName(pc.stage);
    const mult = Math.round(getPhysiqueBonusMultiplier(pc.stage, pc.progress) * 100);
    return `${def.name} — ${stageName} (${pc.stage}/${getPhysiqueCultivationBalance().maxStages}) · ${Math.round(pc.progress)}% · ~${mult}% power`;
}

function canStartPhysiqueCultivation(id) {
    ensurePhysiqueCultivationState();
    const def = getPhysiqueDefById(id);
    if (!def) return { ok: false, message: 'Invalid physique.' };
    if (G.physiqueCultivation.id && G.physiqueCultivation.id !== id) {
        const active = getPhysiqueDefById(G.physiqueCultivation.id);
        return { ok: false, message: `Already refining ${active?.name || 'another physique'}. Finish or perfect it first.` };
    }
    if (isPhysiqueCompleted(id)) {
        return { ok: false, message: `${def.name} is already perfected — equip it from the Physique menu.` };
    }
    if (G.physiqueCultivation.id === id) {
        return { ok: false, message: `Already cultivating ${def.name}. Refine in the Body Chamber.` };
    }
    return { ok: true };
}

function startPhysiqueCultivation(id) {
    const check = canStartPhysiqueCultivation(id);
    if (!check.ok) return { success: false, message: check.message };
    const def = getPhysiqueDefById(id);
    ensurePhysiqueCultivationState();
    beginActionLog();
    if (!advanceTime(1, `Beginning ${def.name} physique cultivation`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends...' };
    }
    if (G.physique) {
        removePhysiqueBonus(G._appliedPhysiqueRecord || G.physique);
        G._appliedPhysiqueRecord = null;
        G.physique = null;
    }
    G.physiqueCultivation.id = id;
    G.physiqueCultivation.stage = 1;
    G.physiqueCultivation.progress = 0;
    G.physiqueCultivation.startedAtMonths = G.ageMonths;
    syncPhysiqueBonuses();
    const msg = `🧬 You commit to cultivating the ${def.name} physique. Temper it stage by stage in the Body Chamber.`;
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

function equipPhysique(id) {
    const def = getPhysiqueDefById(id) || getPhysiqueByName(id);
    if (!def) return { success: false, message: 'Invalid physique.' };
    const physiqueId = getPhysiqueId(def);
    if (def.type === 'trainable' && !isPhysiqueCompleted(physiqueId)) {
        return { success: false, message: `Perfect ${def.name} in the Body Chamber before equipping.` };
    }
    if (G.physiqueCultivation.id) {
        return { success: false, message: 'Finish your active physique project before switching.' };
    }
    if (G._appliedPhysiqueRecord) {
        removePhysiqueBonus(G._appliedPhysiqueRecord);
        G._appliedPhysiqueRecord = null;
    } else if (G.physique) {
        removePhysiqueBonus(G.physique);
    }
    G.physique = { ...def, id: physiqueId };
    syncPhysiqueBonuses();
    const msg = `🧬 ${def.name} physique equipped.${def.pro ? ' ' + def.pro : ''}`;
    addLog(msg);
    return { success: true, message: msg };
}

function unequipPhysique() {
    if (!G.physique) return { success: false, message: 'No physique equipped.' };
    if (G._appliedPhysiqueRecord) {
        removePhysiqueBonus(G._appliedPhysiqueRecord);
        G._appliedPhysiqueRecord = null;
    } else {
        removePhysiqueBonus(G.physique);
    }
    const name = G.physique.name;
    G.physique = null;
    const msg = `🧬 ${name} physique unequipped.`;
    addLog(msg);
    return { success: true, message: msg };
}

function advancePhysiqueProgress(amount) {
    ensurePhysiqueCultivationState();
    const pc = G.physiqueCultivation;
    if (!pc.id || amount <= 0) return null;
    const bal = getPhysiqueCultivationBalance();
    const def = getPhysiqueDefById(pc.id);
    let msgExtra = '';
    pc.progress = Math.min(100, (pc.progress || 0) + amount);
    if (pc.progress >= 100) {
        if (pc.stage >= bal.maxStages) {
            const completion = completePhysiqueCultivation();
            return { perfected: true, completion, def };
        }
        pc.stage += 1;
        pc.progress = 0;
        G.foundation = (G.foundation || 0) + (bal.foundationPerStage || 1);
        const stageName = getPhysiqueStageName(pc.stage);
        msgExtra = ` Stage ${pc.stage} — ${stageName} begins!`;
    }
    syncPhysiqueBonuses();
    return { perfected: false, def, msgExtra, stage: pc.stage, progress: pc.progress };
}

function handlePhysiqueRefineResult(result, def, cfg, prefix) {
    if (!result) return { success: false, message: 'Refinement failed.' };
    if (result.perfected && result.completion) {
        return { success: true, message: result.completion.message, logged: true, perfected: true };
    }
    const mult = Math.round(getPhysiqueBonusMultiplier(G.physiqueCultivation.stage, G.physiqueCultivation.progress) * 100);
    const msg = `${prefix} ${def.name} refined. Stage ${result.stage} · ${Math.round(result.progress)}% · ~${mult}% power.${result.msgExtra || ''}`;
    return { success: true, message: msg, logged: false };
}

function refinePhysiqueStandard() {
    const block = getPhysiqueRefineBlockReason('standard');
    if (block) return { success: false, message: block };
    const def = getActivePhysiqueCultivationDef();
    const bal = getPhysiqueCultivationBalance();
    const cfg = bal.standardRefine;
    beginActionLog();
    if (!advanceChamberWeeks(cfg.weeks, `${cfg.label || 'Physique refinement'} — ${def.name}`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends...' };
    }
    const result = advancePhysiqueProgress(cfg.progress);
    const outcome = handlePhysiqueRefineResult(result, def, cfg, '🧬');
    if (outcome.success && outcome.message) commitActionLog(outcome.message);
    else cancelActionLog();
    return { ...outcome, logged: outcome.success };
}

function refinePhysiqueCatalyst() {
    const block = getPhysiqueRefineBlockReason('catalyst');
    if (block) return { success: false, message: block };
    const def = getActivePhysiqueCultivationDef();
    const bal = getPhysiqueCultivationBalance();
    const cfg = bal.catalystRefine;
    const costs = getPhysiqueCatalystCost(def);
    beginActionLog();
    if (!advanceChamberWeeks(cfg.weeks, `${cfg.label || 'Catalyst refinement'} — ${def.name}`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends...' };
    }
    if (typeof removeCraftMaterials !== 'function' || !removeCraftMaterials(costs)) {
        cancelActionLog();
        return { success: false, message: 'Required catalyst materials missing.' };
    }
    const result = advancePhysiqueProgress(cfg.progress);
    const matLine = formatPhysiqueMaterialCost(costs);
    const outcome = handlePhysiqueRefineResult(result, def, cfg, `🧬 Catalyst refinement (${matLine}) —`);
    if (outcome.success && outcome.message) commitActionLog(outcome.message);
    else cancelActionLog();
    return { ...outcome, logged: outcome.success };
}

function onBodyChamberPhysiqueHook(layerId) {
    ensurePhysiqueCultivationState();
    const pc = G.physiqueCultivation;
    if (!pc.id) return null;
    const def = getPhysiqueDefById(pc.id);
    if (!def?.focusLayers?.includes(layerId)) return null;
    const bal = getPhysiqueCultivationBalance();
    const result = advancePhysiqueProgress(bal.bodyActionProgress || 4);
    if (!result) return null;
    if (result.perfected && result.completion) return result.completion.message;
    return `🧬 ${def.name} physique +${bal.bodyActionProgress || 4}% from ${BODY_CHAMBER_LAYERS[layerId]?.label || layerId} work.`;
}

function completePhysiqueCultivation() {
    ensurePhysiqueCultivationState();
    const pc = G.physiqueCultivation;
    const def = getPhysiqueDefById(pc.id);
    if (!def) return null;
    const bal = getPhysiqueCultivationBalance();
    if (!pc.completed.includes(pc.id)) pc.completed.push(pc.id);
    const id = pc.id;
    pc.id = null;
    pc.stage = 0;
    pc.progress = 0;
    pc.startedAtMonths = null;
    G.foundation = (G.foundation || 0) + (bal.foundationOnComplete || 3);
    if (G._appliedPhysiqueRecord) {
        removePhysiqueBonus(G._appliedPhysiqueRecord);
        G._appliedPhysiqueRecord = null;
    }
    G.physique = { ...def, id };
    syncPhysiqueBonuses();
    const msg = `🏆 ${def.name} physique perfected! Full power unlocked and equipped. +${bal.foundationOnComplete || 3} Foundation.`;
    return { success: true, message: msg, id };
}

function formatPhysiqueMaterialCost(costs) {
    if (!costs) return '';
    return Object.entries(costs).map(([matId, qty]) => {
        const mat = typeof CRAFT_MATERIALS !== 'undefined' ? CRAFT_MATERIALS[matId] : null;
        return `${mat?.emoji || '⛏️'} ${qty} ${mat?.name || matId}`;
    }).join(', ');
}

function getPhysiqueCatalystCost(def) {
    return def?.catalystCost || { rare_herb: 1 };
}

function getPhysiqueRefineBlockReason(mode) {
    ensurePhysiqueCultivationState();
    if (!G.physiqueCultivation.id) return 'No active physique project — choose one from the Physique menu.';
    if (bodyChamberActionBlocked?.()) return 'Cannot refine during combat or tribulation.';
    const def = getActivePhysiqueCultivationDef();
    const bal = getPhysiqueCultivationBalance();
    if (mode === 'catalyst') {
        const costs = getPhysiqueCatalystCost(def);
        for (const [matId, qty] of Object.entries(costs)) {
            const have = typeof getMaterialCount === 'function' ? getMaterialCount(matId) : 0;
            if (have < qty) {
                const mat = typeof CRAFT_MATERIALS !== 'undefined' ? CRAFT_MATERIALS[matId] : null;
                return `Need ${qty} ${mat?.name || matId} (have ${have}).`;
            }
        }
    }
    if (G.physiqueCultivation.stage >= bal.maxStages && G.physiqueCultivation.progress >= 100) {
        return 'This physique is ready to be perfected.';
    }
    return null;
}

function trainPhysique(name) {
    const physique = getPhysiqueByName(name);
    if (!physique || physique.type !== 'trainable') {
        return { success: false, message: 'Invalid physique.' };
    }
    const id = getPhysiqueId(physique);
    if (isPhysiqueCompleted(id)) return equipPhysique(id);
    if (isPhysiqueCultivationActive() && G.physiqueCultivation.id === id) {
        return { success: false, message: `Refine ${name} in the Body Chamber.` };
    }
    return startPhysiqueCultivation(id);
}
