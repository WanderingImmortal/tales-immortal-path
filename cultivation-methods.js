// ============================================
// CULTIVATION-METHODS.JS — Qi cultivation path (P0)
// ============================================
// Separate from combat TECHNIQUE_POOL / manualShelf.
// P0: pool, methodGrade, save state, active primary, gather mult.
// Deferred: shelf UI (P1), foundation variants (P2), essence/formations (P3+).

function getCultivationMethodDef(id) {
    if (!id) return null;
    if (typeof CULTIVATION_METHOD_BY_ID !== 'undefined' && CULTIVATION_METHOD_BY_ID[id]) {
        return CULTIVATION_METHOD_BY_ID[id];
    }
    if (typeof CULTIVATION_METHOD_POOL === 'undefined') return null;
    return CULTIVATION_METHOD_POOL.find(m => m.id === id) || null;
}

function getMethodGradeDef(gradeId) {
    if (typeof METHOD_GRADES === 'undefined') return null;
    return METHOD_GRADES[gradeId] || null;
}

function methodGradeMult(gradeId) {
    const def = getMethodGradeDef(gradeId);
    return def?.speedMult ?? 1;
}

function getDefaultCultivationMethodId() {
    return typeof DEFAULT_CULTIVATION_METHOD_ID !== 'undefined'
        ? DEFAULT_CULTIVATION_METHOD_ID
        : 'basic_meditation_breath';
}

function buildCultivationMethodStateFromDef(def) {
    const method = def || getCultivationMethodDef(getDefaultCultivationMethodId());
    return {
        primaryId: method?.id || getDefaultCultivationMethodId(),
        primaryLocked: false,
        lineageId: method?.lineageId || null,
        grade: method?.methodGrade || 'crude',
        studiedScrolls: [],
        essenceMilestones: {},
        essenceStock: {},
        foundationLineage: null
    };
}

function ensureCultivationMethodState() {
    if (!G.cultivationMethod || typeof G.cultivationMethod !== 'object') {
        G.cultivationMethod = buildCultivationMethodStateFromDef(
            getCultivationMethodDef(getDefaultCultivationMethodId())
        );
        return G.cultivationMethod;
    }
    const state = G.cultivationMethod;
    if (!state.primaryId) state.primaryId = getDefaultCultivationMethodId();
    const def = getCultivationMethodDef(state.primaryId);
    if (!def) {
        const fallback = buildCultivationMethodStateFromDef(
            getCultivationMethodDef(getDefaultCultivationMethodId())
        );
        state.primaryId = fallback.primaryId;
        state.lineageId = fallback.lineageId;
        if (!state.grade) state.grade = fallback.grade;
    } else {
        if (!state.lineageId) state.lineageId = def.lineageId || null;
        if (!state.grade) state.grade = def.methodGrade || 'crude';
    }
    if (state.primaryLocked == null) state.primaryLocked = false;
    if (!Array.isArray(state.studiedScrolls)) state.studiedScrolls = [];
    if (!state.essenceMilestones || typeof state.essenceMilestones !== 'object') {
        state.essenceMilestones = {};
    }
    if (!state.essenceStock || typeof state.essenceStock !== 'object') {
        state.essenceStock = {};
    }
    if (state.foundationLineage === undefined) state.foundationLineage = null;
    return state;
}

function getActiveCultivationMethodId() {
    ensureCultivationMethodState();
    return G.cultivationMethod.primaryId;
}

function getActiveCultivationMethod() {
    return getCultivationMethodDef(getActiveCultivationMethodId());
}

function getActiveMethodGradeId() {
    ensureCultivationMethodState();
    return G.cultivationMethod.grade || getActiveCultivationMethod()?.methodGrade || 'crude';
}

function isQiCultivationMethod(method) {
    if (!method) return true;
    return !method.essences || method.essences.length === 0;
}

/** P0: qi methods always fueled; essence fuel lands in P3+. */
function getEssenceFuelMult(method) {
    if (!method || isQiCultivationMethod(method)) return 1;
    return 0;
}

function getMethodRootFitMult(method) {
    if (!method?.rootFit) return 1;
    const fit = method.rootFit;
    const composition = typeof getSpiritRootComposition === 'function'
        ? getSpiritRootComposition()
        : (G.talent?.composition || 'pentamixed');
    if (fit[composition] != null) return fit[composition];

    const elements = (typeof getTalentDef === 'function' ? getTalentDef()?.elements : null)
        || G.talent?.elements
        || [];
    let best = null;
    for (const el of elements) {
        if (fit[el] != null) best = best == null ? fit[el] : Math.max(best, fit[el]);
    }
    return best != null ? best : 1;
}

/**
 * Active-path cultivate speed contribution (qi track P0).
 * cultivateSpeed *= methodGradeMult(grade) * profile.gatherMult * fuel * rootFit
 */
function getCultivationMethodGatherMult() {
    ensureCultivationMethodState();
    const method = getActiveCultivationMethod();
    if (!method) return 1;
    const gradeMult = methodGradeMult(getActiveMethodGradeId());
    const gatherMult = method.profile?.gatherMult ?? 1;
    const fuelMult = getEssenceFuelMult(method);
    const rootFit = getMethodRootFitMult(method);
    return gradeMult * gatherMult * fuelMult * rootFit;
}

function getCultivationMethodPathLabel() {
    ensureCultivationMethodState();
    const method = getActiveCultivationMethod();
    const gradeDef = getMethodGradeDef(getActiveMethodGradeId());
    const name = method?.name || 'Unknown Method';
    const grade = gradeDef?.name || getActiveMethodGradeId();
    return `${name} · ${grade}`;
}

/**
 * Commit / replace primary path (internal). No casual UI in P0.
 * Blocked when primaryLocked (FE seal) unless force.
 */
function setCultivationMethodPrimary(methodId, options) {
    ensureCultivationMethodState();
    const opts = options || {};
    if (G.cultivationMethod.primaryLocked && !opts.force) return false;
    const def = getCultivationMethodDef(methodId);
    if (!def) return false;
    G.cultivationMethod.primaryId = def.id;
    G.cultivationMethod.lineageId = def.lineageId || null;
    if (opts.grade) G.cultivationMethod.grade = opts.grade;
    else if (!G.cultivationMethod.grade || opts.resetGrade) {
        G.cultivationMethod.grade = def.methodGrade || 'crude';
    }
    return true;
}
