// ============================================
// CULTIVATION-METHODS.JS — Qi cultivation path
// ============================================
// Separate from combat TECHNIQUE_POOL / manualShelf.
// P0: pool, methodGrade, save state, active primary, gather mult.
// P1: method shelf + study UI + walk-this-path (pre-seal).
// P2: foundation nature stamp + path lock at FE seal.
// Deferred: essence/formations (P3+), method deepening chapters.

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
    const primaryId = method?.id || getDefaultCultivationMethodId();
    return {
        primaryId,
        primaryLocked: false,
        lineageId: method?.lineageId || null,
        grade: method?.methodGrade || 'crude',
        studiedScrolls: primaryId ? [primaryId] : [],
        essenceMilestones: {},
        essenceStock: {},
        foundationLineage: null
    };
}

function ensureMethodShelf() {
    if (!G.methodShelf || typeof G.methodShelf !== 'object') G.methodShelf = {};
}

function ensureCultivationMethodState() {
    if (!G.cultivationMethod || typeof G.cultivationMethod !== 'object') {
        G.cultivationMethod = buildCultivationMethodStateFromDef(
            getCultivationMethodDef(getDefaultCultivationMethodId())
        );
    } else {
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
        if (state.primaryId && !state.studiedScrolls.includes(state.primaryId)) {
            state.studiedScrolls.push(state.primaryId);
        }
    }
    if (G.foundationNatureId === undefined) G.foundationNatureId = null;
    if (G.foundationNatureGrade === undefined) G.foundationNatureGrade = null;
    ensureMethodShelf();
    return G.cultivationMethod;
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

/** P0/P1: qi methods always fueled; essence fuel lands in P3+. */
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
 * Active-path cultivate speed contribution.
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
    let label = `${name} · ${grade}`;
    if (G.cultivationMethod?.primaryLocked) label += ' · sealed';
    const nature = getSealedFoundationNatureDef();
    if (nature) label += ` · ${nature.name}`;
    return label;
}

function getFoundationNatureDef(id) {
    if (!id) return null;
    if (typeof FOUNDATION_NATURES !== 'undefined' && FOUNDATION_NATURES[id]) return FOUNDATION_NATURES[id];
    return null;
}

function getSealedFoundationNatureId() {
    return G.foundationNatureId || null;
}

function getSealedFoundationNatureDef() {
    return getFoundationNatureDef(getSealedFoundationNatureId());
}

function getFoundationNatureGradeMagnitude() {
    const gradeId = G.foundationNatureGrade || getActiveMethodGradeId();
    const table = { crude: 0.9, common: 1.0, superior: 1.08, peerless: 1.15 };
    return table[gradeId] ?? 1;
}

function getMethodStampsNatureId(method) {
    if (!method) return 'plain_balanced';
    if (method.stampsNature) return method.stampsNature;
    const legacy = method.profile?.foundationVariant;
    if (legacy && typeof FOUNDATION_NATURES !== 'undefined' && FOUNDATION_NATURES[legacy]) return legacy;
    return 'plain_balanced';
}

function isQiPathFoundationSealRealm() {
    if ((G.realmIdx || 0) !== 1) return false;
    if (G.path === 'qi') return true;
    if (typeof getFocusTrack === 'function' && getFocusTrack() === 'dantian') return true;
    return false;
}

/**
 * P2: stamp shared foundation nature + lock cultivation path at FE Seal.
 * FE redesign should call this same helper later.
 */
function stampFoundationNatureAtFeSeal(options) {
    const opts = options || {};
    ensureCultivationMethodState();
    if (!opts.force && !isQiPathFoundationSealRealm()) return false;

    const method = getActiveCultivationMethod();
    const natureId = getMethodStampsNatureId(method);
    const nature = getFoundationNatureDef(natureId) || getFoundationNatureDef('plain_balanced');
    if (!nature) return false;

    G.foundationNatureId = nature.id;
    G.foundationNatureGrade = getActiveMethodGradeId();
    G.cultivationMethod.primaryLocked = true;
    G.cultivationMethod.foundationLineage = method?.lineageId || G.cultivationMethod.lineageId || null;

    const gradeName = getMethodGradeDef(G.foundationNatureGrade)?.name || G.foundationNatureGrade;
    addLog(`🏛️ Foundation nature sealed: ${nature.name} (${gradeName} path — ${method?.name || 'unknown'}). Your cultivation path is locked.`);
    addLog(`   ↳ ${nature.desc}`);
    return true;
}

/** Scaled combat/world mods from sealed nature. Empty if not sealed. */
function getFoundationNatureCombatMods(tech) {
    const nature = getSealedFoundationNatureDef();
    if (!nature?.effects) {
        return { dmgMult: 1, techCostMult: 1, armorPenPct: 0, intimidation: false, intentEaseBonus: 0 };
    }
    const mag = getFoundationNatureGradeMagnitude();
    const fx = nature.effects;
    let dmgMult = 1;
    if (fx.dmgMult != null) dmgMult *= 1 + (fx.dmgMult - 1) * mag;

    const template = tech
        ? (typeof getTechniqueTemplate === 'function' ? getTechniqueTemplate(tech.name || tech) : null)
        : null;
    const el = template?.element;
    if (fx.elementDmgMult && el && fx.elementDmgMult[el] != null) {
        const em = fx.elementDmgMult[el];
        dmgMult *= 1 + (em - 1) * mag;
    }

    let techCostMult = 1;
    if (fx.neutralTechCostMult != null && (!el || el === 'neutral')) {
        techCostMult *= 1 - (1 - fx.neutralTechCostMult) * mag;
    }
    if (fx.alignedTechCostMult != null && el && methodNatureAlignsWithElement(nature, el)) {
        techCostMult *= 1 - (1 - fx.alignedTechCostMult) * mag;
    }

    return {
        dmgMult,
        techCostMult,
        armorPenPct: (fx.armorPenPct || 0) * mag,
        intimidation: !!fx.intimidation,
        intentEaseBonus: (fx.intentEaseBonus || 0) * mag
    };
}

function methodNatureAlignsWithElement(nature, element) {
    if (!nature || !element) return false;
    if (nature.id === 'fire_aspected' && element === 'fire') return true;
    if (nature.id === 'thunder_tempered' && (element === 'lightning' || element === 'thunder')) return true;
    if (nature.id === 'blood_fiend' && element === 'blood') return true;
    return false;
}

function getFoundationNatureArmorPenPct() {
    return getFoundationNatureCombatMods(null).armorPenPct || 0;
}

function getFoundationNatureIntentEaseBonus() {
    return getFoundationNatureCombatMods(null).intentEaseBonus || 0;
}

function hasBloodFiendIntimidation() {
    return !!getFoundationNatureCombatMods(null).intimidation;
}

function hasStudiedCultivationMethod(methodId) {
    ensureCultivationMethodState();
    return (G.cultivationMethod.studiedScrolls || []).includes(methodId);
}

function markCultivationMethodStudied(methodId) {
    ensureCultivationMethodState();
    if (!methodId || hasStudiedCultivationMethod(methodId)) return false;
    G.cultivationMethod.studiedScrolls.push(methodId);
    return true;
}

function getMethodShelfEntry(methodId) {
    ensureMethodShelf();
    return G.methodShelf[methodId] || null;
}

function countMethodShelfTotal() {
    ensureMethodShelf();
    return Object.values(G.methodShelf).reduce((n, e) => n + (e.count || 0), 0);
}

function countMethodShelfTitles() {
    ensureMethodShelf();
    return Object.keys(G.methodShelf).length;
}

function removeMethodFromShelf(methodId, qty) {
    ensureMethodShelf();
    const entry = G.methodShelf[methodId];
    if (!entry) return;
    entry.count -= qty || 1;
    if (entry.count <= 0) delete G.methodShelf[methodId];
}

function canAddMethodScrollToTravelKit(methodId) {
    ensureMethodShelf();
    if (G.methodShelf?.[methodId]) return true;
    const w = (typeof TRAVEL_KIT_BALANCE !== 'undefined' ? TRAVEL_KIT_BALANCE.methodUniqueWeight : null)
        ?? (typeof TRAVEL_KIT_BALANCE !== 'undefined' ? TRAVEL_KIT_BALANCE.manualUniqueWeight : null)
        ?? 1;
    if (typeof canAddTravelKitLoad === 'function') return canAddTravelKitLoad(w);
    return true;
}

function grantMethodScroll(methodId, opts) {
    const def = getCultivationMethodDef(methodId);
    if (!def) return false;
    ensureCultivationMethodState();
    const isNewTitle = !G.methodShelf[methodId];
    if (isNewTitle && !canAddMethodScrollToTravelKit(methodId)) {
        if (!opts?.silent) {
            addLog(`📜 ${typeof getTravelKitFullMessage === 'function' ? getTravelKitFullMessage() : 'Travel kit full.'} Could not stow ${def.name}.`);
        }
        return false;
    }
    const entry = G.methodShelf[methodId];
    if (entry) {
        entry.count = (entry.count || 1) + 1;
    } else {
        G.methodShelf[methodId] = {
            methodId,
            count: 1,
            source: opts?.source || null
        };
    }
    if (!opts?.silent) {
        const grade = getMethodGradeDef(def.methodGrade)?.name || def.methodGrade;
        addLog(`📜 Cultivation scroll stowed: ${def.name} (${grade}).`);
    }
    return true;
}

function getComprehendMethodMonths(method) {
    if (!method) return 2;
    if (method.comprehendMonths != null) return method.comprehendMonths;
    const b = typeof METHOD_MANUAL_BALANCE !== 'undefined' ? METHOD_MANUAL_BALANCE : null;
    return b?.monthsByGrade?.[method.methodGrade] ?? b?.defaultMonths ?? 2;
}

function getComprehendMethodBlockReason(methodId) {
    const method = getCultivationMethodDef(methodId);
    if (!method) return 'Unknown cultivation scroll.';
    if (hasStudiedCultivationMethod(methodId)) return 'Already studied this cultivation path.';
    if (!getMethodShelfEntry(methodId)) return 'No cultivation scroll in your travel kit.';
    if ((method.reqRealm || 0) > (G.realmIdx || 0)) {
        const realmName = PATHS[G.path || 'qi']?.realms[method.reqRealm] || `realm ${method.reqRealm + 1}`;
        return `Requires ${realmName} or higher.`;
    }
    if (!isQiCultivationMethod(method)) {
        return 'Essence methods need formations and arrays — not ready yet.';
    }
    if (G.inCombat) return 'Cannot study during combat.';
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'You cannot study scrolls right now.';
    return null;
}

function canComprehendCultivationMethod(methodId) {
    return !getComprehendMethodBlockReason(methodId);
}

function comprehendCultivationMethod(methodId) {
    const method = getCultivationMethodDef(methodId);
    const block = getComprehendMethodBlockReason(methodId);
    if (block) {
        addLog(`📜 ${block}`);
        fullRender();
        return false;
    }
    const months = getComprehendMethodMonths(method);
    beginActionLog();
    if (!advanceTime(months, `Studying ${method.name}`)) {
        cancelActionLog();
        fullRender();
        return false;
    }
    markCultivationMethodStudied(methodId);
    removeMethodFromShelf(methodId, 1);
    const grade = getMethodGradeDef(method.methodGrade)?.name || method.methodGrade;
    commitActionLog(`📜 Cultivation path studied: ${method.name} (${grade}, ${months} mo). It sits ready — commit only when you mean to walk it.`);
    fullRender();
    return true;
}

function getMethodConsignPrice(method) {
    const b = typeof METHOD_MANUAL_BALANCE !== 'undefined' ? METHOD_MANUAL_BALANCE : null;
    const byGrade = b?.consignByGrade || {};
    return byGrade[method?.methodGrade] ?? b?.defaultConsign ?? 10;
}

function consignMethodScroll(methodId) {
    const entry = getMethodShelfEntry(methodId);
    const method = getCultivationMethodDef(methodId);
    if (!entry || !method) return false;
    if (G.inCombat) {
        addLog('📜 Cannot consign scrolls during combat.');
        fullRender();
        return false;
    }
    const price = getMethodConsignPrice(method);
    removeMethodFromShelf(methodId, 1);
    G.stones += price;
    addLog(`💎 Consigned a ${method.name} scroll for ${price} Stones.`);
    fullRender();
    return true;
}

/**
 * Commit / replace primary path.
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
    if (!hasStudiedCultivationMethod(def.id)) {
        markCultivationMethodStudied(def.id);
    }
    return true;
}

function getWalkCultivationPathBlockReason(methodId) {
    ensureCultivationMethodState();
    const method = getCultivationMethodDef(methodId);
    if (!method) return 'Unknown cultivation path.';
    if (G.cultivationMethod.primaryLocked) {
        return 'Your path is sealed with your foundation. Meridian-washing can only change element (e.g. fire → water), not upgrade to a better manual of the same kind.';
    }
    if (getActiveCultivationMethodId() === methodId) return 'This is already your cultivation path.';
    if (!hasStudiedCultivationMethod(methodId)) return 'Study the scroll first before walking this path.';
    if (!isQiCultivationMethod(method)) return 'Essence paths are not ready yet.';
    if (G.inCombat) return 'Cannot change path during combat.';
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'You cannot change path right now.';
    return null;
}

/** Pre-seal confirm: walk this studied path as your primary cultivation method. */
function walkCultivationPath(methodId) {
    const method = getCultivationMethodDef(methodId);
    const block = getWalkCultivationPathBlockReason(methodId);
    if (block) {
        addLog(`🧘 ${block}`);
        fullRender();
        return false;
    }
    const grade = getMethodGradeDef(method.methodGrade)?.name || method.methodGrade;
    const ok = confirm(
        `Walk the path of ${method.name} (${grade})?\n\n`
        + 'This becomes your cultivation path until Foundation seal locks it.\n'
        + 'You can walk another studied path before seal. After seal, only meridian-washing can cross elements (e.g. fire → water).'
    );
    if (!ok) return false;
    const prev = getActiveCultivationMethod();
    setCultivationMethodPrimary(methodId, { resetGrade: true });
    addLog(`🧘 You set your cultivation path: ${method.name} (${grade})`
        + (prev && prev.id !== methodId ? ` — leaving ${prev.name} behind.` : '.'));
    fullRender();
    return true;
}

function getMethodFamilyLabel(family) {
    const labels = {
        breathing: 'Breathing',
        circulation: 'Circulation',
        absorption: 'Absorption',
        resonance: 'Resonance',
        forbidden: 'Forbidden'
    };
    return labels[family] || family || 'Method';
}

function renderMethodShelfHtml() {
    ensureCultivationMethodState();
    const activeId = getActiveCultivationMethodId();
    const active = getActiveCultivationMethod();
    const gradeDef = getMethodGradeDef(getActiveMethodGradeId());
    const gather = getCultivationMethodGatherMult();
    let html = `<div class="method-shelf-path-card">
        <div class="name">🧘 Your cultivation path</div>
        <div class="desc">${active?.name || '—'} · ${gradeDef?.name || '—'} · gather ×${gather.toFixed(2)}</div>`;
    const nature = getSealedFoundationNatureDef();
    if (nature) {
        html += `<div class="desc">Foundation nature: <strong>${nature.name}</strong> — ${nature.desc}</div>`;
    } else {
        const previewId = getMethodStampsNatureId(active);
        const preview = getFoundationNatureDef(previewId);
        if (preview) {
            html += `<div class="desc method-shelf-path-note">At FE seal this path stamps: ${preview.name}</div>`;
        }
    }
    if (G.cultivationMethod?.primaryLocked) {
        html += `<div class="desc method-shelf-path-note">Path locked with your foundation. Meridian-washing can cross elements only (e.g. fire → water) — not upgrade within the same nature.</div>`;
    } else {
        html += `<div class="desc method-shelf-path-note">Scrolls you own are not your path until you Walk them. Combat manuals are separate.</div>`;
    }
    html += `</div>`;

    const studied = (G.cultivationMethod.studiedScrolls || [])
        .map(id => getCultivationMethodDef(id))
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name));
    if (studied.length) {
        html += studied.map(method => {
            const isActive = method.id === activeId;
            const gName = getMethodGradeDef(method.methodGrade)?.name || method.methodGrade;
            const walkBlock = getWalkCultivationPathBlockReason(method.id);
            const canWalk = !walkBlock;
            let actions = '';
            if (!isActive) {
                actions += `<button type="button" class="manual-shelf-btn" data-walk-method="${escapeAttr(method.id)}"${canWalk ? '' : ' disabled'}>🧘 Walk this path</button>`;
            }
            const status = isActive
                ? `<span class="travel-kit-manual-known">Active path</span>`
                : `<span class="method-shelf-studied">Studied</span>`;
            const lockLine = walkBlock && !isActive
                ? `<div class="manual-shelf-lock">🔒 ${walkBlock}</div>` : '';
            return `<div class="popup-item manual-shelf-row method-shelf-row">
                <div class="name">📘 ${method.name} ${status}
                    <span class="tech-cultivation-tier">${gName}</span>
                    <span style="color:#a09080;font-size:12px;">[${getMethodFamilyLabel(method.family)}]</span>
                </div>
                <div class="desc">${method.desc}</div>
                ${lockLine}
                <div class="manual-shelf-actions">${actions}</div>
            </div>`;
        }).join('');
    }

    const entries = Object.values(G.methodShelf || {}).sort((a, b) => {
        const na = getCultivationMethodDef(a.methodId)?.name || a.methodId;
        const nb = getCultivationMethodDef(b.methodId)?.name || b.methodId;
        return na.localeCompare(nb);
    });
    if (!entries.length && !studied.length) {
        html += `<div class="travel-kit-manuals-empty">No cultivation scrolls yet. Markets and exploration can yield them.</div>`;
        return html;
    }
    if (entries.length) {
        html += `<div class="method-shelf-unread-label">Unread scrolls in kit</div>`;
        html += entries.map(entry => {
            const method = getCultivationMethodDef(entry.methodId);
            if (!method) return '';
            const studiedAlready = hasStudiedCultivationMethod(method.id);
            const gName = getMethodGradeDef(method.methodGrade)?.name || method.methodGrade;
            const months = getComprehendMethodMonths(method);
            const block = studiedAlready ? null : getComprehendMethodBlockReason(method.id);
            const canStudy = !studiedAlready && !block;
            const countBadge = entry.count > 1 ? ` <span style="color:#b8863a;">×${entry.count}</span>` : '';
            const statusBadge = studiedAlready
                ? `<span class="travel-kit-manual-known">Studied — spare copy</span>`
                : `<span class="travel-kit-manual-unread">Unread</span>`;
            let actions = '';
            if (!studiedAlready) {
                actions += `<button type="button" class="manual-shelf-btn" data-comprehend-method="${escapeAttr(method.id)}"${canStudy ? '' : ' disabled'}>📖 Study (${months} mo)</button>`;
            }
            if (entry.count >= 1) {
                const price = getMethodConsignPrice(method);
                actions += `<button type="button" class="manual-shelf-btn" data-consign-method="${escapeAttr(method.id)}">💎 Consign (+${price})</button>`;
            }
            const lockLine = block && !studiedAlready
                ? `<div class="manual-shelf-lock">🔒 ${block}</div>` : '';
            return `<div class="popup-item manual-shelf-row method-shelf-row">
                <div class="name">📜 ${method.name}${countBadge} ${statusBadge}
                    <span class="tech-cultivation-tier">${gName}</span>
                    <span style="color:#a09080;font-size:12px;">[${getMethodFamilyLabel(method.family)}]</span>
                </div>
                <div class="desc">${method.desc}</div>
                ${lockLine}
                <div class="manual-shelf-actions">${actions}</div>
            </div>`;
        }).join('');
    }
    return html;
}

function bindMethodShelfActions(container) {
    const root = container || document.getElementById('inventoryList');
    if (!root) return;
    root.querySelectorAll('[data-comprehend-method]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            comprehendCultivationMethod(this.dataset.comprehendMethod);
            if (typeof renderInventoryPopup === 'function') renderInventoryPopup();
            fullRender();
        });
    });
    root.querySelectorAll('[data-consign-method]').forEach(btn => {
        btn.addEventListener('click', function() {
            consignMethodScroll(this.dataset.consignMethod);
            if (typeof renderInventoryPopup === 'function') renderInventoryPopup();
            fullRender();
        });
    });
    root.querySelectorAll('[data-walk-method]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            walkCultivationPath(this.dataset.walkMethod);
            if (typeof renderInventoryPopup === 'function') renderInventoryPopup();
            fullRender();
        });
    });
}

/** Explore / market helpers — qi methods players can find in P1. */
function getFindableCultivationMethods() {
    if (typeof CULTIVATION_METHOD_POOL === 'undefined') return [];
    return CULTIVATION_METHOD_POOL.filter(m =>
        isQiCultivationMethod(m)
        && m.id !== getDefaultCultivationMethodId()
        && (m.reqRealm || 0) <= (G.realmIdx || 0)
        && m.methodGrade !== 'peerless'
    );
}

function rollExploreMethodLoot() {
    const pool = getFindableCultivationMethods();
    if (!pool.length) return null;
    const chance = (typeof EXPLORE_BALANCE !== 'undefined' ? EXPLORE_BALANCE.methodFindChance : null) ?? 0.08;
    if (Math.random() >= chance) return null;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    return { type: 'cultivation_method', methodId: pick.id, name: pick.name };
}
