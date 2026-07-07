// ============================================
// TECHNIQUES.JS — Manual shelf, tiers, comprehension, combat viability
// ============================================

let _techniqueTiersInitialized = false;

function ensureTechniqueCultivationTiers() {
    if (_techniqueTiersInitialized) return;
    _techniqueTiersInitialized = true;
    if (typeof TECHNIQUE_POOL === 'undefined') return;
    TECHNIQUE_POOL.forEach(t => {
        if (!t.cultivationTier) {
            t.cultivationTier = TECHNIQUE_CULTIVATION_TIERS[t.name] || inferTechniqueCultivationTier(t);
        }
        recomputeTechniqueTierStats(t);
    });
}

function inferTechniqueCultivationTier(template) {
    if (template.reqRealm != null) {
        const match = CULTIVATION_TIER_ORDER.find(id => CULTIVATION_TIERS[id]?.reqRealm === template.reqRealm);
        if (match) return match;
    }
    if (template.rarity === 'legendary') return 'immortal';
    if (template.rarity === 'rare') return 'core';
    if (template.rarity === 'uncommon') return 'foundation';
    return 'condensation';
}

function recomputeTechniqueTierStats(template) {
    const tierId = template.cultivationTier || 'condensation';
    const tier = CULTIVATION_TIERS[tierId];
    if (!tier) return;
    const combatTier = template.combatTier || template.category || 'medium';
    const dmgMult = TECHNIQUE_COMBAT_DAMAGE_MULT[combatTier] ?? 1;
    const [lo, hi] = tier.damageBand;
    const mid = (lo + hi) / 2;
    if (template.category === 'utility') {
        template.baseDamage = 0;
    } else if (template.category === 'defense' || template.category === 'buff') {
        template.baseDamage = Math.max(3, Math.round(mid * dmgMult * 0.85));
    } else {
        template.baseDamage = Math.max(1, Math.round(mid * dmgMult));
    }
    const ct = TECHNIQUE_COMBAT_TIERS[combatTier];
    const costMid = ct ? (ct.minCost + ct.maxCost) / 2 : tier.costBase + 4;
    template.baseCost = Math.max(2, Math.round(costMid * (0.7 + tier.reqRealm * 0.07)));
    if (template.costType === 'spirit') {
        template.baseCost = Math.max(3, Math.round(template.baseCost * 1.12));
    }
}

function getTechniqueCultivationTierId(techOrName) {
    ensureTechniqueCultivationTiers();
    const name = typeof techOrName === 'string' ? techOrName : techOrName?.name;
    const tpl = typeof techOrName === 'object' && techOrName?.cultivationTier
        ? techOrName
        : TECHNIQUE_POOL.find(t => t.name === name);
    if (tpl?.cultivationTier) return tpl.cultivationTier;
    return TECHNIQUE_CULTIVATION_TIERS[name] || 'condensation';
}

function getTechniqueCultivationTierDef(techOrName) {
    const id = getTechniqueCultivationTierId(techOrName);
    return CULTIVATION_TIERS[id] || CULTIVATION_TIERS.condensation;
}

function getTechniqueReqRealm(techOrName) {
    const tpl = typeof techOrName === 'string'
        ? TECHNIQUE_POOL.find(t => t.name === techOrName)
        : (TECHNIQUE_POOL.find(t => t.name === techOrName?.name) || techOrName);
    if (tpl?.reqRealm != null) return tpl.reqRealm;
    return getTechniqueCultivationTierDef(tpl || techOrName).reqRealm;
}

function getCultivationTierLabel(tierId, path) {
    const def = CULTIVATION_TIERS[tierId];
    if (!def) return tierId;
    const p = path || G.path || 'qi';
    const realmName = PATHS[p]?.realms[def.reqRealm];
    if (tierId === 'mortal') return `${def.emoji} Mortal`;
    if (tierId === 'condensation' && realmName) return `${def.emoji} ${realmName}`;
    const short = {
        foundation: 'Foundation',
        core: 'Core',
        nascent: 'Nascent',
        void: 'Void Refinement',
        dao_seeking: 'Dao Seeking',
        immortal: 'Immortal'
    };
    return `${def.emoji} ${short[tierId] || realmName || tierId}`;
}

function getTechniqueRealmGap(tech) {
    const techRealm = getTechniqueReqRealm(tech);
    return Math.max(0, G.realmIdx - techRealm);
}

function getTechniqueObsolescenceMult(tech) {
    const gap = getTechniqueRealmGap(tech);
    if (gap <= 0) return 1;
    const b = TECHNIQUE_BALANCE.obsolescence;
    let mult = b.gapMult[gap] ?? b.gapMult[6] ?? b.floor;
    const uses = tech.uses || 0;
    if (uses >= 30) mult += b.masteryGrandmaster;
    if (uses >= 50) mult += b.masteryTranscendent;
    return Math.min(1, mult);
}

function getTechniqueBaseStats(tech) {
    ensureTechniqueCultivationTiers();
    const tpl = TECHNIQUE_POOL.find(t => t.name === tech.name);
    return {
        baseDamage: tpl?.baseDamage ?? tech.baseDamage,
        baseCost: tpl?.baseCost ?? tech.baseCost
    };
}

function ensureManualShelf() {
    if (!G.manualShelf) G.manualShelf = {};
}

function migrateTechniqueManuals() {
    ensureManualShelf();
    ensureTechniqueCultivationTiers();
}

function getManualShelfEntry(techName) {
    ensureManualShelf();
    return G.manualShelf[techName] || null;
}

function countManualShelfTotal() {
    ensureManualShelf();
    return Object.values(G.manualShelf).reduce((n, e) => n + (e.count || 0), 0);
}

function getTechniqueTrackLabel(template) {
    if (!template) return 'Technique';
    if (template.path === 'body') return 'Martial';
    if (template.path === 'soul') return 'Soul';
    if (template.path === 'qi') return 'Qi';
    return 'Technique';
}

function canLearnTechnique(template) {
    if (!template) return false;
    if (template.reqPath && G.path !== template.reqPath) return false;
    if (G.realmIdx < getTechniqueReqRealm(template)) return false;
    if (template.reqTechnique && !G.techniques.some(t => t.name === template.reqTechnique)) return false;
    const talentBlock = getTechniqueTalentBlockReason(template);
    if (talentBlock) return false;
    return true;
}

function hasPlayerTrait(traitId) {
    if (!traitId || typeof getPlayerTraits !== 'function') return false;
    return getPlayerTraits().some(t => t.id === traitId);
}

function getTechniqueTalentBlockReason(template) {
    if (!template?.reqTalent) return null;
    if (hasPlayerTrait(template.reqTalent)) return null;
    const def = typeof TRAIT_BY_ID !== 'undefined' ? TRAIT_BY_ID[template.reqTalent] : null;
    return `Requires trait: ${def?.name || template.reqTalent}`;
}

/** Market realm gates derive from cultivation tier — not catalog reqRealm. */
function getMarketTechniqueReqRealm(techName) {
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    if (!template) return 0;
    return getTechniqueReqRealm(template);
}

function grantManual(techName, opts) {
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    if (!template) return false;
    ensureManualShelf();
    const isNewTitle = !G.manualShelf[techName];
    if (isNewTitle && typeof canAddManualToTravelKit === 'function' && !canAddManualToTravelKit(techName)) {
        if (!opts?.silent) {
            addLog(`📜 ${typeof getTravelKitFullMessage === 'function' ? getTravelKitFullMessage() : 'Travel kit full.'} Could not stow ${techName}.`);
        }
        return false;
    }
    const entry = G.manualShelf[techName];
    if (entry) {
        entry.count = (entry.count || 1) + 1;
    } else {
        G.manualShelf[techName] = {
            technique: techName,
            count: 1,
            quality: 'clean',
            source: opts?.source || null
        };
    }
    if (!opts?.silent) {
        const track = getTechniqueTrackLabel(template);
        const tierLabel = getCultivationTierLabel(getTechniqueCultivationTierId(template), template.path);
        addLog(`📜 ${track} manual stowed in travel kit: ${techName} (${tierLabel}).`);
    }
    return true;
}

function getComprehendBlockReason(template) {
    if (!template) return 'Unknown manual.';
    if (G.techniques.some(t => t.name === template.name)) return 'Already comprehended.';
    if (!getManualShelfEntry(template.name)) return 'No manual in your travel kit.';
    if (template.path === 'body' && G.path !== 'body') {
        return 'Martial arts require the body path — shelve or consign, but you cannot comprehend this art.';
    }
    if (template.reqPath && G.path !== template.reqPath) {
        return `Requires ${template.reqPath} cultivation path.`;
    }
    const reqRealm = getTechniqueReqRealm(template);
    if (G.realmIdx < reqRealm) {
        const realmName = PATHS[G.path]?.realms[reqRealm] || `realm ${reqRealm + 1}`;
        return `Requires ${realmName} or higher.`;
    }
    if (template.reqTechnique && !G.techniques.some(t => t.name === template.reqTechnique)) {
        return `Requires ${template.reqTechnique} first.`;
    }
    const talentBlock = getTechniqueTalentBlockReason(template);
    if (talentBlock) return `${talentBlock} — shelve or consign until you qualify.`;
    if (G.inCombat) return 'Cannot study during combat.';
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'You cannot study manuals right now.';
    return null;
}

function canComprehendManual(techName) {
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    return !getComprehendBlockReason(template);
}

function getComprehendManualMonths(template) {
    const b = MANUAL_BALANCE;
    const tierId = getTechniqueCultivationTierId(template);
    const tierMonths = b.monthsByCultivationTier?.[tierId];
    if (tierMonths != null) return tierMonths;
    const rarity = template?.rarity || 'common';
    return b.monthsByRarity[rarity] ?? b.defaultMonths;
}

function removeManualFromShelf(techName, qty) {
    ensureManualShelf();
    const entry = G.manualShelf[techName];
    if (!entry) return;
    entry.count -= qty || 1;
    if (entry.count <= 0) delete G.manualShelf[techName];
}

function getManualConsignPrice(template) {
    const b = MANUAL_BALANCE.consignByRarity;
    const tierId = getTechniqueCultivationTierId(template);
    const tierBonus = (CULTIVATION_TIERS[tierId]?.reqRealm || 0) * 8;
    return (b[template.rarity] || 8) + tierBonus;
}

function consignManual(techName) {
    const entry = getManualShelfEntry(techName);
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    if (!entry || !template) return false;
    if (G.inCombat) {
        addLog('📜 Cannot consign manuals during combat.');
        fullRender();
        return false;
    }
    const price = getManualConsignPrice(template);
    removeManualFromShelf(techName, 1);
    G.stones += price;
    addLog(`💎 Consigned a ${techName} manual for ${price} Stones.`);
    fullRender();
    return true;
}

function comprehendManual(techName) {
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    const block = getComprehendBlockReason(template);
    if (block) {
        addLog(`📜 ${block}`);
        fullRender();
        return false;
    }
    const months = getComprehendManualMonths(template);
    beginActionLog();
    if (!advanceTime(months, `Comprehending ${techName}`)) {
        cancelActionLog();
        fullRender();
        return false;
    }
    const learned = learnTechnique(techName, { silent: true });
    if (!learned) {
        commitActionLog(`📜 ${months} months studying ${techName} — insight slips away. The manual remains.`);
        fullRender();
        return false;
    }
    removeManualFromShelf(techName, 1);
    const track = getTechniqueTrackLabel(template);
    const tierLabel = getCultivationTierLabel(getTechniqueCultivationTierId(template), template.path);
    commitActionLog(`📜 ${track} art comprehended: ${techName}! (${tierLabel}, ${months} mo)`);
    fullRender();
    return true;
}

function weaponTypeToIntentWeapon(weaponType) {
    if (!weaponType) return null;
    const map = { sword: 'Sword', blade: 'Blade', fist: 'Fist', spear: 'Spear', staff: 'Staff' };
    return map[String(weaponType).toLowerCase()] || null;
}

function inferTechniqueQuality(template) {
    if (!template) return 'low';
    if (template.techniqueQuality) return template.techniqueQuality;
    if (typeof HIGH_INTENT_TECHNIQUES !== 'undefined' && HIGH_INTENT_TECHNIQUES.has(template.name)) return 'high';
    const tierId = template.cultivationTier || getTechniqueCultivationTierId(template);
    const tierIdx = CULTIVATION_TIER_ORDER.indexOf(tierId);
    const foundationIdx = CULTIVATION_TIER_ORDER.indexOf('foundation');
    if (template.weaponType && template.category === 'attack' && tierIdx >= foundationIdx) return 'mid';
    return 'low';
}

function resolveIntentReq(template) {
    if (!template) return null;
    if (template.intentReq) return template.intentReq;
    const quality = inferTechniqueQuality(template);
    if (quality === 'low') return null;
    const weapon = weaponTypeToIntentWeapon(template.weaponType);
    if (!weapon) return null;
    const tierId = template.cultivationTier || getTechniqueCultivationTierId(template);
    let minStage = quality === 'high' ? 1 : 0;
    if (quality === 'high' && (tierId === 'dao_seeking' || tierId === 'immortal' || tierId === 'nascent')) {
        minStage = Math.max(minStage, 2);
    }
    return { weapon, minStage };
}

function getTechniqueIntentProfile(template) {
    if (!template) return null;
    const quality = inferTechniqueQuality(template);
    const intentReq = resolveIntentReq(template);
    const balance = INTENT_TECHNIQUE_BALANCE[quality] || INTENT_TECHNIQUE_BALANCE.low;
    return { quality, intentReq, balance };
}

function getTechniqueIntentMatch(tech) {
    const template = TECHNIQUE_POOL.find(t => t.name === tech.name);
    const profile = getTechniqueIntentProfile(template);
    const result = {
        quality: profile?.quality || 'low',
        intentReq: profile?.intentReq || null,
        weaponMatch: false,
        stageOk: false,
        stage: -1,
        dmgMult: 1,
        costMult: 1,
        bonus: 0,
        warnIcon: '',
        warnText: '',
        matched: false
    };
    if (!profile) return result;

    const active = typeof getActiveIntent === 'function' ? getActiveIntent() : null;
    const stage = active && typeof getIntentTierIndex === 'function' ? getIntentTierIndex(active.uses) : -1;
    result.stage = stage;

    if (!profile.intentReq) {
        const weapon = weaponTypeToIntentWeapon(template?.weaponType);
        if (weapon && active?.weapon === weapon) {
            result.weaponMatch = true;
            result.matched = true;
            result.bonus = profile.balance.matchBonus * 0.5;
            result.dmgMult = 1 + result.bonus;
        }
        return result;
    }

    const req = profile.intentReq;
    result.weaponMatch = !!(active && active.weapon === req.weapon);
    result.stageOk = result.weaponMatch && stage >= (req.minStage ?? 0);

    if (result.stageOk) {
        result.matched = true;
        const stageExtra = Math.max(0, stage - (req.minStage ?? 0)) * profile.balance.stageBonusPerTier;
        result.bonus = profile.balance.matchBonus + stageExtra;
        result.dmgMult = 1 + result.bonus;
        return result;
    }

    if (result.weaponMatch && !result.stageOk) {
        const b = INTENT_TECHNIQUE_BALANCE;
        result.dmgMult = b.wrongStageMult;
        result.costMult = profile.balance.costMult;
        result.warnIcon = '🗡️';
        const stageName = INTENT_TIERS[req.minStage]?.name || 'higher';
        result.warnText = `${req.weapon} intent too shallow — need ${stageName}+ (currently ${INTENT_TIERS[Math.max(0, stage)]?.name || 'none'}).`;
        return result;
    }

    result.dmgMult = profile.balance.noMatchMult;
    result.costMult = profile.balance.costMult;
    if (profile.quality !== 'low') {
        result.warnIcon = profile.quality === 'high' ? '🗡️' : '⚔️';
        const stageName = INTENT_TIERS[req.minStage]?.name || 'any';
        const need = req.minStage > 0 ? ` (${stageName}+)` : '';
        result.warnText = profile.quality === 'high'
            ? `Art barely forms without ${req.weapon} intent${need}.`
            : `Weakened without ${req.weapon} intent${need}.`;
    }
    return result;
}

function getTechniqueIntentHint(template) {
    const profile = getTechniqueIntentProfile(template);
    if (!profile?.intentReq) return '';
    const req = profile.intentReq;
    const stageName = req.minStage > 0 ? ` · ${INTENT_TIERS[req.minStage]?.name}+` : '';
    const qLabel = profile.quality === 'high' ? 'Master art' : 'Weapon art';
    return `${qLabel}: ${req.weapon} intent${stageName}`;
}

function getTechniqueIntentMult(tech) {
    return getTechniqueIntentMatch(tech);
}

/** Combat + UI viability — path, intent, obsolescence. */
function getTechniqueCombatViability(tech) {
    const meta = getTechniqueMeta(tech);
    const result = { usable: true, dmgMult: 1, costMult: 1, warnIcon: '', warnText: '' };

    if (meta.path === 'body' && G.path !== 'body') {
        return {
            usable: false,
            dmgMult: 0,
            costMult: 1,
            warnIcon: '💪',
            warnText: 'Martial art — requires body cultivation.'
        };
    }

    const obsMult = getTechniqueObsolescenceMult(tech);
    if (obsMult < 1) {
        const gap = getTechniqueRealmGap(tech);
        result.warnIcon = result.warnIcon || '📉';
        const pct = Math.round(obsMult * 100);
        const obsNote = `Outdated art — ${pct}% power (${gap} realm${gap > 1 ? 's' : ''} behind).`;
        result.warnText = obsNote;
    }

    const intent = getTechniqueIntentMatch(tech);
    if (intent.warnIcon && !result.warnIcon) result.warnIcon = intent.warnIcon;
    else if (intent.warnIcon === '🗡️') result.warnIcon = '🗡️';
    if (intent.warnText) {
        result.warnText = result.warnText ? `${result.warnText} ${intent.warnText}` : intent.warnText;
    }
    result.intentDmgMult = intent.dmgMult;
    result.intentCostMult = intent.costMult;
    result.intentMatched = intent.matched;

    return result;
}

function getTechniqueViabilityBadge(tech) {
    const v = getTechniqueCombatViability(tech);
    const intent = getTechniqueIntentMatch(tech);
    const title = String(v.warnText || '').replace(/"/g, '&quot;');
    if (!v.usable) return `<span class="tech-viability-warn" title="${title}">${v.warnIcon} ✕</span>`;
    if (intent.matched && intent.bonus > 0) {
        return `<span class="tech-viability-warn tech-viability-synergy" title="Intent synergy active (+${Math.round(intent.bonus * 100)}%)">🗡️ ✦</span>`;
    }
    if (v.warnIcon === '📉') return `<span class="tech-viability-warn tech-viability-outdated" title="${title}">📉</span>`;
    if (v.warnIcon) return `<span class="tech-viability-warn" title="${title}">${v.warnIcon} ⚠</span>`;
    return '';
}
