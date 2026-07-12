// ============================================
// DAO-TAXONOMY.JS — Tiered Dao state & helpers
// Primordial → Fundamental → Greater → Lesser
// ============================================

const DAO_LEGACY_REVERSE_MAP = Object.fromEntries(
    Object.entries(DAO_LEGACY_MAP).map(([legacy, id]) => [id, legacy])
);

const ELEMENT_TO_PHASE_DAO = {
    fire: 'phase_fire',
    water: 'phase_water',
    earth: 'phase_earth',
    wind: 'phase_wood',
    lightning: 'phase_metal',
    ice: 'phase_water',
    metal: 'phase_metal',
    wood: 'phase_wood'
};

function ensureDaoState() {
    if (!G.daoState) {
        G.daoState = {
            comprehended: [],
            progress: {},
            fragments: [],
            seerLastReadingMonth: null
        };
    }
    if (!G.daoState.comprehended) G.daoState.comprehended = [];
    if (!G.daoState.progress) G.daoState.progress = {};
    if (!G.daoState.fragments) G.daoState.fragments = [];
    if (G.daoState.seerLastReadingMonth == null) G.daoState.seerLastReadingMonth = null;
    if (!G.daoFragments) G.daoFragments = [];
    syncDaoFragmentArrays();
    if (!G._daoMigrated) migrateDaoStateFromLegacy();
    syncLegacyDaoArrays();
}

function syncDaoFragmentArrays() {
    if (!G.daoState?.fragments?.length && G.daoFragments?.length) {
        G.daoState.fragments = [...G.daoFragments];
    }
    G.daoFragments = [...(G.daoState.fragments || [])];
}

function migrateDaoStateFromLegacy() {
    if (G._daoMigrated) return;
    if (!G.daoState) {
        G.daoState = {
            comprehended: [],
            progress: {},
            fragments: [],
            seerLastReadingMonth: null
        };
    }
    if (!G.daoState.comprehended) G.daoState.comprehended = [];
    if (!G.daoState.progress) G.daoState.progress = {};
    if (!G.daoState.fragments) G.daoState.fragments = [];

    (G.trueDaos || []).forEach(name => {
        const id = DAO_LEGACY_MAP[name] || name;
        if (DAO_TAXONOMY[id] && !G.daoState.comprehended.includes(id)) {
            G.daoState.comprehended.push(id);
        }
        G.daoState.progress[id] = 100;
    });

    (G.primeDaos || []).forEach(name => {
        const id = DAO_LEGACY_MAP[name] || name;
        if (DAO_TAXONOMY[id] && !G.daoState.comprehended.includes(id)) {
            G.daoState.comprehended.push(id);
        }
        G.daoState.progress[id] = 100;
    });

    (G.mergedDaos || []).forEach(name => {
        const id = DAO_LEGACY_MAP[name] || MERGED_DAOS[name]?.id || name;
        if (DAO_TAXONOMY[id] && !G.daoState.comprehended.includes(id)) {
            G.daoState.comprehended.push(id);
        }
        G.daoState.progress[id] = 100;
    });

    const remappedFragments = (G.daoFragments || []).map(name =>
        DAO_LEGACY_FRAGMENT_MAP[name] || name
    );
    G.daoState.fragments = [...new Set(remappedFragments)];
    G.daoFragments = [...G.daoState.fragments];

    G._daoMigrated = true;
    syncLegacyDaoArrays();
}

function syncLegacyDaoArrays() {
    if (!G.daoState) return;
    const trueDaos = [];
    const primeDaos = [];
    const mergedDaos = [];

    (G.daoState.comprehended || []).forEach(id => {
        const def = getDaoDef(id);
        if (!def) return;
        const legacy = DAO_LEGACY_REVERSE_MAP[id];
        if (def.tier === 'fundamental' || def.tier === 'primordial') {
            if (legacy) mergedDaos.push(legacy);
            else mergedDaos.push(def.name);
        } else if (def.branch === 'elements' && def.tier === 'greater') {
            const elLegacy = Object.entries(DAO_LEGACY_MAP).find(([, v]) => v === id)?.[0];
            if (elLegacy) trueDaos.push(elLegacy);
        } else if (def.tier === 'greater') {
            if (legacy) primeDaos.push(legacy);
            else primeDaos.push(def.name);
        }
    });

    G.trueDaos = [...new Set(trueDaos)];
    G.primeDaos = [...new Set(primeDaos)];
    G.mergedDaos = [...new Set(mergedDaos)];
    G.daoFragments = [...G.daoState.fragments];
}

function getDaoDef(id) {
    return DAO_TAXONOMY[id] || null;
}

function getDaoTier(id) {
    return getDaoDef(id)?.tier || null;
}

function isDaoComprehended(id) {
    ensureDaoState();
    return G.daoState.comprehended.includes(id);
}

function hasFundamentalDao() {
    return countComprehendedTier('fundamental') > 0;
}

function hasGreaterDao(id) {
    return isDaoComprehended(id) && getDaoTier(id) === 'greater';
}

function countComprehendedTier(tier) {
    ensureDaoState();
    return G.daoState.comprehended.filter(id => getDaoTier(id) === tier).length;
}

function getDaoComprehensionProgress(id) {
    ensureDaoState();
    if (isDaoComprehended(id)) return 100;
    return G.daoState.progress[id] || 0;
}

function addDaoComprehensionProgress(id, amount) {
    ensureDaoState();
    if (isDaoComprehended(id)) return 100;
    const prev = getDaoComprehensionProgress(id);
    const next = Math.min(100, prev + Math.max(0, amount));
    G.daoState.progress[id] = next;
    return next;
}

function grantDaoComprehended(id) {
    ensureDaoState();
    if (!DAO_TAXONOMY[id]) return false;
    if (!G.daoState.comprehended.includes(id)) G.daoState.comprehended.push(id);
    G.daoState.progress[id] = 100;
    syncLegacyDaoArrays();
    return true;
}

function getDaoFragmentPoolEntry(fragmentName) {
    return DAO_FRAGMENT_POOL.find(f => f.name === fragmentName) || null;
}

function canComprehendFragment(fragment) {
    if (!fragment) return 'Fragment not found.';
    if (G.realmIdx < getDaoFragmentReqRealm(fragment)) {
        return `You must be ${getDaoSeekingRealmLabel()} or higher.`;
    }
    if (!G.daoState.fragments.includes(fragment.name)) {
        return "You don't have this fragment.";
    }
    if (fragment.forbiddenClear) {
        ensureForbiddenState();
        if (!getGroundProgress(fragment.forbiddenClear).cleared) {
            return 'This insight is sealed until the forbidden ground is cleared.';
        }
    }
    const daoId = fragment.daoId;
    if (isDaoComprehended(daoId)) return 'Already fully comprehended.';
    if (fragment.requiresGreaterCount != null) {
        const greaterCount = countComprehendedTier('greater');
        if (greaterCount < fragment.requiresGreaterCount) {
            return `Need ${fragment.requiresGreaterCount} Greater Daos comprehended first.`;
        }
    }
    if (fragment.requiresFundamental != null && fragment.requiresFundamental > 0) {
        if (countComprehendedTier('fundamental') < fragment.requiresFundamental) {
            return `Need ${fragment.requiresFundamental} Fundamental Dao(s) first.`;
        }
    }
    return null;
}

function calcDaoComprehensionGain() {
    const bal = DAO_COMPREHENSION_BALANCE;
    let gain = bal.baseProgressPerSession
        + getEffectiveFoundation() * bal.foundationScale
        + G.spirit * bal.spiritScale
        + G.will * bal.willScale;
    if (typeof getSectBuildingBonus === 'function') gain += getSectBuildingBonus('daoSpeedPct');
    const fx = getActiveDaoEffects();
    if (fx.daoComprehensionPct) gain *= (1 + fx.daoComprehensionPct / 100);
    return Math.max(5, Math.round(gain));
}

function comprehendFragment(fragmentName) {
    const fragment = getDaoFragmentPoolEntry(fragmentName);
    const block = canComprehendFragment(fragment);
    if (block) return { success: false, message: block };

    const daoId = fragment.daoId;
    const def = getDaoDef(daoId);
    const prev = getDaoComprehensionProgress(daoId);
    const gain = calcDaoComprehensionGain();
    const next = addDaoComprehensionProgress(daoId, gain);
    const label = def?.name || daoId;

    if (next >= 100) {
        if (def?.tier === 'lesser') {
            G.daoState.fragments = G.daoState.fragments.filter(f => f !== fragmentName);
            const grant = def.progressGrant || 25;
            const targetId = def.progressTo;
            const targetDef = getDaoDef(targetId);
            const targetPrev = getDaoComprehensionProgress(targetId);
            const targetNext = addDaoComprehensionProgress(targetId, grant);
            if (targetNext >= 100 && !isDaoComprehended(targetId)) {
                grantDaoComprehended(targetId);
                const msg = `🌟 Lesser insight reunifies — ${targetDef?.name || targetId} comprehended!`;
                return { success: true, message: msg, logged: false, comprehended: targetId };
            }
            const msg = `📜 ${label} absorbed — ${targetDef?.name || targetId} ${targetPrev}% → ${targetNext}%`;
            syncDaoFragmentArrays();
            return { success: true, message: msg, logged: false };
        }
        if (def?.tier === 'greater') {
            grantDaoComprehended(daoId);
            G.daoState.fragments = G.daoState.fragments.filter(f => f !== fragmentName);
            syncDaoFragmentArrays();
            const msg = `🌌 Greater Dao comprehended: ${label}!`;
            return { success: true, message: msg, logged: false, comprehended: daoId };
        }
    }

    const msg = `📜 Comprehension advances: ${label} ${prev}% → ${next}%`;
    return { success: true, message: msg, logged: false };
}

function getMergeFromSatisfied(def) {
    if (!def?.mergeFrom) return { ok: false, matched: [] };
    const min = def.mergeMin || def.mergeFrom.length;
    const matched = def.mergeFrom.filter(id => isDaoComprehended(id));
    return { ok: matched.length >= min, matched, min };
}

function getAvailableDaoMerges() {
    ensureDaoState();
    return Object.values(DAO_TAXONOMY)
        .filter(def => def.tier === 'fundamental' && def.mergeFrom)
        .filter(def => {
            if (isDaoComprehended(def.id)) return false;
            return getMergeFromSatisfied(def).ok;
        });
}

function mergeDaoFundamental(fundamentalId) {
    const def = getDaoDef(fundamentalId);
    if (!def || def.tier !== 'fundamental') {
        return { success: false, message: 'Unknown fundamental Dao.' };
    }
    if (isDaoComprehended(fundamentalId)) {
        return { success: false, message: 'Already reunified.' };
    }
    const { ok, matched, min } = getMergeFromSatisfied(def);
    if (!ok) {
        const need = min || def.mergeFrom.length;
        return { success: false, message: `Need ${need} partition Dao(s) comprehended to reunify ${def.name}.` };
    }
    const bal = DAO_COMPREHENSION_BALANCE;
    if (G.qi < bal.mergeQiCost || G.spirit < bal.mergeSpiritCost) {
        return { success: false, message: `Need ${bal.mergeQiCost} Qi and ${bal.mergeSpiritCost} Spirit.` };
    }
    beginActionLog();
    const months = typeof getDaoActionMonths === 'function'
        ? getDaoActionMonths(bal.greaterToFundamentalMergeMonths)
        : bal.greaterToFundamentalMergeMonths;
    if (!advanceTime(months, `Reunifying ${def.name}`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends during the reunification.' };
    }
    G.qi -= bal.mergeQiCost;
    G.spirit -= bal.mergeSpiritCost;

    matched.forEach(id => {
        G.daoState.comprehended = G.daoState.comprehended.filter(d => d !== id);
        delete G.daoState.progress[id];
    });
    grantDaoComprehended(fundamentalId);
    grantFoundation(DAO_MERGE_BALANCE.foundationBonus || 0);
    const fameAdded = typeof addFame === 'function'
        ? addFame(DAO_MERGE_BALANCE.fameReward || 0)
        : (G.fame += (DAO_MERGE_BALANCE.fameReward || 0), DAO_MERGE_BALANCE.fameReward || 0);
    if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(8, 'reunifying fundamental Daos');
    const msg = `🌀 FUNDAMENTAL DAO — ${def.name}! ${def.desc} +${DAO_MERGE_BALANCE.foundationBonus} Foundation, +${fameAdded} Fame.`;
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

function canAttainWuji() {
    const def = DAO_TAXONOMY.wuji;
    if (isDaoComprehended('wuji')) return false;
    if (G.realmIdx < (def.reqRealm || 6)) return false;
    const need = def.reqFundamentals || DAO_COMPREHENSION_BALANCE.wujiReqFundamentals;
    return countComprehendedTier('fundamental') >= need;
}

function attainWuji() {
    if (!canAttainWuji()) {
        return { success: false, message: 'Wuji remains undifferentiated — reunify more fundamental laws first.' };
    }
    beginActionLog();
    const months = typeof getDaoActionMonths === 'function' ? getDaoActionMonths(18) : 18;
    if (!advanceTime(months, 'Returning to Wuji')) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends before Wuji opens.' };
    }
    grantDaoComprehended('wuji');
    grantFoundation(20);
    const fameAdded = typeof addFame === 'function' ? addFame(30) : (G.fame += 30, 30);
    const msg = `☯️ PRIMORDIAL — Wuji! All laws return to the undifferentiated source. +20 Foundation, +${fameAdded} Fame.`;
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

function getActiveDaoEffects() {
    ensureDaoState();
    const fx = {
        combatDmgPct: 0,
        exploreBonusPct: 0,
        evasionPct: 0,
        hpRegenPct: 0,
        qiPct: 0,
        spiritPct: 0,
        alignmentDampenPct: 0,
        foundationPerCultivate: 0,
        decayResistPct: 0,
        daoComprehensionPct: 0,
        alignmentShiftMult: 1,
        tribulationInsightPct: 0,
        slowResistPct: 0,
        regenPct: 0,
        armorPenPct: 0,
        alignmentReadPct: 0,
        allElementMult: 1,
        elementMult: 1
    };
    const numericKeys = Object.keys(fx);

    G.daoState.comprehended.forEach(id => {
        const def = getDaoDef(id);
        if (!def) return;
        if (def.effects) {
            Object.entries(def.effects).forEach(([k, v]) => {
                if (typeof v === 'number' && fx[k] != null) fx[k] += v;
                else if (k === 'allElementMult' && typeof v === 'number') fx.allElementMult *= v;
            });
        }
        numericKeys.forEach(k => {
            if (typeof def[k] === 'number') {
                if (k === 'elementMult') fx.elementMult = Math.max(fx.elementMult, def[k]);
                else if (k.endsWith('Mult') && k !== 'elementMult') fx[k] = (fx[k] || 1) * def[k];
                else fx[k] += def[k];
            }
        });
    });
    return fx;
}

function hasDaoInteriorPeak() {
    ensureDaoState();
    if (countComprehendedTier('fundamental') >= 1) return true;
    const branches = {};
    G.daoState.comprehended.forEach(id => {
        const def = getDaoDef(id);
        if (!def || def.tier !== 'greater' || !def.branch) return;
        if (!branches[def.branch]) branches[def.branch] = { count: 0, progress: 0 };
        branches[def.branch].count += 1;
        branches[def.branch].progress += 100;
    });
    Object.entries(G.daoState.progress).forEach(([id, pct]) => {
        const def = getDaoDef(id);
        if (!def || def.tier !== 'greater' || !def.branch || isDaoComprehended(id)) return;
        if (!branches[def.branch]) branches[def.branch] = { count: 0, progress: 0 };
        branches[def.branch].progress += pct || 0;
    });
    return Object.values(branches).some(b => b.count >= 2 && b.progress >= 180);
}

function getDaoElementMult(element) {
    if (!element || element === 'neutral' || element === 'elemental' || element === 'blood') return 1;
    ensureDaoState();
    const fx = getActiveDaoEffects();
    let mult = 1;
    if (fx.allElementMult > 1) mult *= fx.allElementMult;
    if (isDaoComprehended('five_phases')) {
        mult *= DAO_TAXONOMY.five_phases.elementMult || 1.35;
        return mult;
    }
    const phaseId = ELEMENT_DAO_MAP[element] || ELEMENT_TO_PHASE_DAO[element];
    if (phaseId && isDaoComprehended(phaseId)) {
        const def = getDaoDef(phaseId);
        mult *= def?.elementMult || 1.25;
    }
    if (element === 'ice' && isDaoComprehended('phase_water')) {
        mult *= TECHNIQUE_BALANCE.iceFromWaterDaoMult / (getDaoDef('phase_water')?.elementMult || 1.25);
    }
    return mult;
}

function hasKarmaDaoAccess() {
    return isDaoComprehended('karma')
        || isDaoComprehended('karma_debt')
        || isDaoComprehended('karma_grace');
}

function getDaoDisplaySummary() {
    ensureDaoState();
    if (isDaoComprehended('wuji')) return 'Primordial: Wuji';
    const fundamentals = G.daoState.comprehended.filter(id => getDaoTier(id) === 'fundamental');
    if (fundamentals.length) {
        const def = getDaoDef(fundamentals[fundamentals.length - 1]);
        return `Fundamental: ${def?.name || fundamentals[fundamentals.length - 1]}`;
    }
    const greater = G.daoState.comprehended.filter(id => getDaoTier(id) === 'greater');
    if (greater.length) {
        const counts = {};
        greater.forEach(id => {
            const def = getDaoDef(id);
            const label = def?.name || id;
            counts[label] = (counts[label] || 0) + 1;
        });
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
        return top[1] > 1 ? `Greater: ${top[0]} ×${top[1]}` : `Greater: ${top[0]}`;
    }
    if (G.daoState.fragments.length) return `${G.daoState.fragments.length} fragments`;
    return 'None';
}

function pickKarmaSeerHint() {
    const bal = KARMA_SEER_BALANCE;
    const comprehension = countComprehendedTier('greater') + countComprehendedTier('fundamental') * 2;
    let pool = bal.hintPool.map(h => ({ ...h }));
    if (comprehension < 2) {
        pool = pool.map(h => h.type === 'vague' ? { ...h, weight: h.weight * 3 } : { ...h, weight: h.weight * 0.5 });
    }
    const total = pool.reduce((s, h) => s + h.weight, 0);
    let roll = Math.random() * total;
    let hint = pool[0];
    for (const h of pool) {
        roll -= h.weight;
        if (roll <= 0) { hint = h; break; }
    }
    const zoneKeys = Object.keys(ZONES || {});
    const zone = zoneKeys.length ? ZONES[zoneKeys[Math.floor(Math.random() * zoneKeys.length)]]?.name || 'the wilds' : 'the wilds';
    const elements = ['fire', 'water', 'earth', 'wind', 'lightning'];
    const element = elements[Math.floor(Math.random() * elements.length)];
    const branches = Object.values(DAO_BRANCH_LABELS);
    const branch = branches[Math.floor(Math.random() * branches.length)];
    const text = hint.text
        .replace('{zone}', zone)
        .replace('{element}', element)
        .replace('{branch}', branch);
    return { type: hint.type, text };
}

function performKarmaSeerReading(npcId) {
    ensureDaoState();
    const bal = KARMA_SEER_BALANCE;
    if (!hasKarmaDaoAccess()) {
        return { success: false, message: 'The Seer sees no karma-thread upon you — comprehend Karma first.' };
    }
    if (G.daoState.seerLastReadingMonth != null
        && (G.ageMonths - G.daoState.seerLastReadingMonth) < bal.readingCooldownMonths) {
        const remain = bal.readingCooldownMonths - (G.ageMonths - G.daoState.seerLastReadingMonth);
        return { success: false, message: `The thread must settle — return in ~${remain} months.` };
    }
    beginActionLog();
    if (!advanceTime(bal.lifespanMonthsCost, 'Reading fate with Seer Asha')) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends during the reading.' };
    }
    G.daoState.seerLastReadingMonth = G.ageMonths;
    const hint = pickKarmaSeerHint();
    const msg = `🔥 The Seer reads the thread — not a prophecy, but a tendency. "${hint.text}"`;
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

function hasAnyGreaterElementDao() {
    return ['phase_fire', 'phase_water', 'phase_earth', 'phase_metal', 'phase_wood']
        .some(id => isDaoComprehended(id));
}
