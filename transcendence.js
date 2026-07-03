// ============================================
// TRANSCENDENCE.JS — Perfect breakthrough perks
// ============================================

function isTranscendencePerkPending() {
    return !!(G.transcendencePerkOffer && G.transcendencePerkOffer.active);
}

function getActiveTranscendencePerks() {
    return G.transcendencePerks || [];
}

function getTranscendencePerkDef(perkId) {
    return TRANSCENDENCE_PERKS[perkId] || null;
}

function hasTranscendencePerk(perkId) {
    return getActiveTranscendencePerks().some(p => p.id === perkId);
}

function hasRealmTranscendencePerk(realmIdx) {
    return getActiveTranscendencePerks().some(p => p.realmIdx === realmIdx);
}

function getTranscendenceBonus(key, fallback = 0) {
    let total = 0;
    getActiveTranscendencePerks().forEach(entry => {
        const def = TRANSCENDENCE_PERKS[entry.id];
        if (def?.effects?.[key] != null) total += def.effects[key];
    });
    if (total === 0 && fallback !== 0) return fallback;
    return total;
}

function hasTranscendenceFlag(key) {
    return getActiveTranscendencePerks().some(entry => TRANSCENDENCE_PERKS[entry.id]?.effects?.[key]);
}

function getRequiredPerfectMargin() {
    const reduction = Math.floor(G.foundation * (TRANSCENDENCE_BALANCE.foundationMarginPerPoint || 0));
    return Math.max(
        TRANSCENDENCE_BALANCE.minPerfectMargin || 5,
        TRANSCENDENCE_BALANCE.perfectMargin - reduction
    );
}

function getFoundationPerfectSalvageChance(margin, reqMargin) {
    if (margin < 0) return 0;
    const base = G.foundation * (TRANSCENDENCE_BALANCE.foundationPerfectPerPoint || 0);
    const cap = TRANSCENDENCE_BALANCE.foundationPerfectCap || 40;
    const closeness = reqMargin > 0 ? margin / reqMargin : 1;
    return Math.min(cap, base * Math.max(0.35, Math.min(1, closeness)));
}

function getFoundationStabilizePerfectChance() {
    if (G.foundation < (TRANSCENDENCE_BALANCE.foundationStabilizeMin || 12)) return 0;
    return Math.min(
        TRANSCENDENCE_BALANCE.foundationStabilizePerfectCap || 18,
        G.foundation * 0.65
    );
}

function getPerfectBreakthroughPreview(styleBonus) {
    const finalChance = clamp(getBreakChance() + (styleBonus || 0), 10, 95);
    return {
        finalChance: Math.round(finalChance),
        requiredMargin: getRequiredPerfectMargin(),
        salvageMax: Math.round(getFoundationPerfectSalvageChance(getRequiredPerfectMargin() - 1, getRequiredPerfectMargin())),
        stabilizePerfect: Math.round(getFoundationStabilizePerfectChance())
    };
}

function rollPerfectBreakthrough(roll, finalChance, naturalSuccess, stabilizedSuccess) {
    if (finalChance < (TRANSCENDENCE_BALANCE.minBreakChanceForPerfect || 0)) return false;

    if (naturalSuccess) {
        const margin = finalChance - roll;
        const reqMargin = getRequiredPerfectMargin();
        if (margin >= reqMargin) return true;
        if (margin >= 0) {
            return Math.random() * 100 < getFoundationPerfectSalvageChance(margin, reqMargin) + getPlayerTraitPerfectBreakBonus();
        }
        return false;
    }

    if (stabilizedSuccess) {
        return Math.random() * 100 < getFoundationStabilizePerfectChance() + getPlayerTraitPerfectBreakBonus();
    }

    return false;
}

function isPerfectBreakthrough(roll, finalChance, success) {
    return rollPerfectBreakthrough(roll, finalChance, success, false);
}

function canOfferTranscendencePerks(realmIdx) {
    if (realmIdx < TRANSCENDENCE_BALANCE.minRealm || realmIdx > TRANSCENDENCE_BALANCE.maxRealm) return false;
    if (hasRealmTranscendencePerk(realmIdx)) return false;
    const pool = TRANSCENDENCE_REALM_POOLS[realmIdx];
    return !!(pool && pool.length);
}

function pickTranscendenceOffer(realmIdx) {
    const pool = [...(TRANSCENDENCE_REALM_POOLS[realmIdx] || [])];
    const count = Math.min(TRANSCENDENCE_BALANCE.offerCount, pool.length);
    const picked = [];
    while (picked.length < count && pool.length) {
        const idx = Math.floor(Math.random() * pool.length);
        picked.push(pool.splice(idx, 1)[0]);
    }
    return picked.map(id => TRANSCENDENCE_PERKS[id]).filter(Boolean);
}

function offerTranscendencePerkChoice(realmIdx, breakStyle) {
    const perks = pickTranscendenceOffer(realmIdx);
    if (!perks.length) {
        continueAfterBreakthrough(breakStyle);
        return;
    }

    G.transcendencePerkOffer = {
        active: true,
        realmIdx,
        breakStyle,
        options: perks.map(p => p.id)
    };

    addLog(`🌟 PERFECT BREAKTHROUGH! The heavens part — choose a Transcendence blessing for ${getRealm()}.`);
    renderTranscendencePerkPopup();
    document.getElementById('transcendencePerkPopup')?.classList.add('active');
    fullRender();
}

function renderTranscendencePerkPopup() {
    const offer = G.transcendencePerkOffer;
    const intro = document.getElementById('transcendencePerkIntro');
    const choices = document.getElementById('transcendencePerkChoices');
    if (!intro || !choices || !offer) return;

    intro.textContent =
        `Your breakthrough was flawless. Three paths of legend open before you — one becomes permanent for ${getRealm()}.`;

    choices.innerHTML = offer.options.map(id => {
        const def = TRANSCENDENCE_PERKS[id];
        if (!def) return '';
        return `<button type="button" class="transcendence-perk-choice" data-perk-id="${id}">
            <span class="transcendence-perk-name">🌟 ${def.name}</span>
            <span class="transcendence-perk-desc">${def.desc}</span>
            <span class="transcendence-perk-effect">${def.effectLabel || ''}</span>
        </button>`;
    }).join('');

    choices.querySelectorAll('.transcendence-perk-choice').forEach(btn => {
        btn.addEventListener('click', () => selectTranscendencePerk(btn.dataset.perkId));
    });
}

function selectTranscendencePerk(perkId) {
    const offer = G.transcendencePerkOffer;
    if (!offer?.active || !offer.options.includes(perkId)) return;

    applyTranscendencePerk(perkId);
    document.getElementById('transcendencePerkPopup')?.classList.remove('active');
    G.transcendencePerkOffer = null;

    continueAfterBreakthrough(offer.breakStyle);
}

function applyTranscendencePerk(perkId) {
    const def = TRANSCENDENCE_PERKS[perkId];
    if (!def) return false;
    if (hasTranscendencePerk(perkId) || hasRealmTranscendencePerk(def.realmIdx)) return false;

    if (!G.transcendencePerks) G.transcendencePerks = [];
    G.transcendencePerks.push({
        id: perkId,
        name: def.name,
        realmIdx: def.realmIdx,
        gainedAtMonths: G.ageMonths
    });

    addLog(`🌟 TRANSCENDENCE — ${def.name}!`);
    addLog(`   ↳ "${def.flavor}"`);
    addLog(`   ↳ ${def.effectLabel}`);

    G.lastTranscendenceCue = {
        title: def.name,
        flavor: def.flavor,
        effect: def.effectLabel
    };

    return true;
}

function continueAfterBreakthrough(breakStyle) {
    if (shouldTriggerTribulation()) {
        if (typeof beginTribulationWithTutorial === 'function') {
            beginTribulationWithTutorial(breakStyle);
        } else {
            startTribulation(breakStyle);
        }
        return;
    }
    checkPerfectCultivation();
    fullRender();
}

function scaleStatDebuff(amount) {
    const resist = getTranscendenceBonus('debuffResistPct', 0) + getTranscendenceBonus('resistPct', 0);
    return Math.max(0, Math.floor(amount * (1 - resist)));
}

function getTranscendenceRegenMult() {
    return 1 + getTranscendenceBonus('regenMultPct', 0);
}

function getTranscendenceDefenseBonus() {
    return Math.round(getTranscendenceBonus('defenseBonusPct', 0) * 100);
}

function getTranscendenceTechniqueDmgMult(tech) {
    let mult = 1 + getTranscendenceBonus('techniqueDmgPct', 0) + getTranscendenceBonus('damagePct', 0);
    mult *= getTranscendenceStatMult();
    if (tech) {
        const meta = getTechniqueMeta(tech);
        if (meta.path === 'soul' || tech.path === 'soul') {
            mult += getTranscendenceBonus('soulTechDmgPct', 0);
        }
    }
    return mult;
}

function getTranscendenceTechniqueCostMult() {
    return Math.max(0.45, 1 + getTranscendenceBonus('techniqueCostMult', 0));
}

function getTranscendenceDamageTakenMult() {
    let mult = 1 - getTranscendenceBonus('damageResistPct', 0);
    mult += getTranscendenceBonus('resistPct', 0);
    return Math.max(0.55, mult);
}

function getTranscendenceDaoSpeedMult() {
    return 1 + getTranscendenceBonus('daoSpeedPct', 0);
}

function getTranscendenceTribulationResistPct() {
    let pct = Math.max(0, getTranscendenceBonus('tribulationResistPct', 0));
    if (typeof getPlayerTraitTribulationResistPct === 'function') {
        pct += getPlayerTraitTribulationResistPct();
    }
    return pct;
}

function getTranscendenceStatMult() {
    return 1 + getTranscendenceBonus('allStatsPct', 0);
}

function getTranscendenceExploreBonus() {
    return getTranscendenceBonus('perceptionPct', 0);
}

function shouldIgnoreCoreCrackScar(scarId) {
    return scarId === 'cracked_core' && hasTranscendencePerk('unbreakable_core');
}

function getTranscendencePerkTooltip(perkId) {
    const def = getTranscendencePerkDef(perkId);
    if (!def) return perkId;
    return [def.desc, def.effectLabel].filter(Boolean).join(' · ');
}

function rollExploreLootWithPerception(zoneId) {
    let loot = rollExploreLoot(zoneId);
    const bonus = typeof getTranscendenceExploreBonus === 'function' ? getTranscendenceExploreBonus() : 0;
    if (bonus > 0 && Math.random() < bonus) {
        const retry = rollExploreLoot(zoneId);
        if (retry) loot = retry;
    }
    return loot;
}

function openTranscendencePerkDetail(perkId) {
    const def = getTranscendencePerkDef(perkId);
    if (!def) return;

    document.getElementById('markDetailTitle').textContent = `🌟 ${def.name}`;
    document.getElementById('markDetailKind').textContent = `${PATHS[G.path].realms[def.realmIdx] || 'Realm'} Transcendence`;
    document.getElementById('markDetailFlavor').textContent = def.flavor || def.desc;
    document.getElementById('markDetailEffects').innerHTML =
        `<div class="mark-effect-block mark-effect-gift"><span class="mark-effect-label">Blessing</span><span>${def.effectLabel || def.desc}</span></div>`;
    document.getElementById('markDetailPopup').classList.add('active');
}
