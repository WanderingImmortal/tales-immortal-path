// ============================================
// SOUL-MASS.JS — Soul Mass interior cultivation + soul damage mitigation
// ============================================

function ensureSoulMassState() {
    if (!G.soulMass) {
        G.soulMass = {
            mass: 0,
            tier: 0,
            apexProgressPct: 0,
            condenseCount: 0,
            condenseActionCounts: {}
        };
    }
    if (G.soulMass.tier == null) G.soulMass.tier = 0;
    if (G.soulMass.apexProgressPct == null) G.soulMass.apexProgressPct = 0;
    if (G.soulMass.condenseCount == null) G.soulMass.condenseCount = 0;
    if (!G.soulMass.condenseActionCounts) G.soulMass.condenseActionCounts = {};
    syncSoulMassTier();
}

function syncSoulMassTier() {
    ensureSoulMassState();
    const tiers = typeof SOUL_MASS_TIERS !== 'undefined' ? SOUL_MASS_TIERS : [{ tier: 0, massMin: 0 }];
    let tier = 0;
    for (let i = tiers.length - 1; i >= 0; i--) {
        if (G.soulMass.mass >= tiers[i].massMin) {
            tier = tiers[i].tier;
            break;
        }
    }
    G.soulMass.tier = tier;
}

function getSoulMass() {
    ensureSoulMassState();
    return G.soulMass.mass || 0;
}

function getSoulMassTier() {
    ensureSoulMassState();
    return G.soulMass.tier || 0;
}

function getSoulMassTierLabel() {
    const tier = getSoulMassTier();
    const tiers = typeof SOUL_MASS_TIERS !== 'undefined' ? SOUL_MASS_TIERS : [];
    const def = tiers.find(t => t.tier === tier);
    return def?.label || 'Unformed';
}

function grantSoulMass(amount, source) {
    ensureSoulMassState();
    const gain = Math.max(0, amount || 0);
    if (gain <= 0) return;
    G.soulMass.mass += gain;
    G.soulMass.condenseCount = (G.soulMass.condenseCount || 0) + 1;
    syncSoulMassTier();
    const bal = typeof SOUL_MASS_BALANCE !== 'undefined' ? SOUL_MASS_BALANCE : null;
    if (bal?.progressionPerCondense) {
        grantSoulApexProgress(bal.progressionPerCondense, source || 'condense');
    }
}

function grantSoulApexProgress(amount, source) {
    ensureSoulMassState();
    const gain = Math.max(0, amount || 0);
    if (gain <= 0) return;
    const bal = typeof SOUL_MASS_BALANCE !== 'undefined' ? SOUL_MASS_BALANCE : null;
    const cap = bal?.apexProgressComplete ?? 100;
    G.soulMass.apexProgressPct = Math.min(cap, (G.soulMass.apexProgressPct || 0) + gain);
}

function isSoulMassPressureActive() {
    const bal = typeof SOUL_MASS_BALANCE !== 'undefined' ? SOUL_MASS_BALANCE : null;
    const min = bal?.pressureMassMin ?? 10;
    return getSoulMass() >= min;
}

function hasSoulInteriorPeak() {
    ensureSoulMassState();
    const bal = typeof SOUL_MASS_BALANCE !== 'undefined' ? SOUL_MASS_BALANCE : null;
    const maxTier = bal?.maxTier ?? 4;
    const apexComplete = bal?.apexProgressComplete ?? 100;
    return getSoulMassTier() >= maxTier || (G.soulMass.apexProgressPct || 0) >= apexComplete;
}

function getPlayerInteriorSoulScore() {
    return (G.spirit || 0) + (G.will || 0) + getSoulMass() * 0.5;
}

function isInteriorSoulWeak() {
    const bal = typeof SOUL_MASS_BALANCE !== 'undefined' ? SOUL_MASS_BALANCE : null;
    const threshold = bal?.weakInteriorSpiritWillSum ?? 12;
    return (G.spirit || 0) + (G.will || 0) < threshold && getSoulMassTier() < 1;
}

// ===== Mitigation pipeline =====

function getBaselineSoulResistPct() {
    const bal = typeof SOUL_MASS_BALANCE !== 'undefined' ? SOUL_MASS_BALANCE : null;
    if (!bal) return 0;
    const fromSpirit = (G.spirit || 0) * (bal.baselineResistPerSpirit || 0);
    const fromWill = (G.will || 0) * (bal.baselineResistPerWill || 0);
    return Math.min(bal.baselineResistCap || 0.20, fromSpirit + fromWill);
}

function getSoulMassDefenderPct() {
    const bal = typeof SOUL_MASS_BALANCE !== 'undefined' ? SOUL_MASS_BALANCE : null;
    if (!bal) return 0;
    return Math.min(bal.massDefenderCap || 0.25, getSoulMass() * (bal.massDefenderPctPerMass || 0));
}

function getTotalSoulMitigationPct(opts) {
    const baseline = getBaselineSoulResistPct();
    const intent = typeof getIntentSoulMitigationPct === 'function' ? getIntentSoulMitigationPct() : 0;
    const rule = typeof getVesselRuleSoulMitigationPct === 'function' ? getVesselRuleSoulMitigationPct() : 0;
    const massDef = getSoulMassDefenderPct();
    const gearWard = 0;
    return Math.min(0.65, baseline + intent + rule + massDef + gearWard);
}

function applySoulDamageMitigation(rawDmg, opts) {
    opts = opts || {};
    if (!opts.soulDamage && !opts.spiritDamage) return rawDmg;
    const pct = getTotalSoulMitigationPct(opts);
    let mitigated = Math.floor(rawDmg * (1 - pct));
    if (rawDmg > 0) mitigated = Math.max(1, mitigated);
    if (G.inCombat && Math.random() < 0.22) {
        if (pct >= 0.15) addCombatLog('Your soul rings. It holds.', 'entry-mod');
        else if (pct < 0.08) addCombatLog('The strike finds a thin interior.', 'entry-mod');
    }
    return mitigated;
}

// ===== Condense action helpers =====

function getSoulCondenseActionCount(layerId, actionId) {
    ensureSoulMassState();
    return G.soulMass.condenseActionCounts[`${layerId}:${actionId}`] || 0;
}

function getSoulCondenseActionBlockReason(layerId, action) {
    const maxStacks = action.maxStacks || 3;
    const count = getSoulCondenseActionCount(layerId, action.id);
    if (count >= maxStacks) {
        return `${action.label} fully condensed (${maxStacks}×).`;
    }
    if (action.requiresLayerProgress != null) {
        const progress = typeof getSoulLayerProgress === 'function' ? getSoulLayerProgress(layerId) : 0;
        if (progress < action.requiresLayerProgress) {
            const layer = typeof SOUL_CHAMBER_LAYERS !== 'undefined' ? SOUL_CHAMBER_LAYERS[layerId] : null;
            return `Need ${action.requiresLayerProgress}% ${layer?.label || layerId} progress (have ${Math.round(progress)}%).`;
        }
    }
    if (layerId !== 'prelude' && typeof isSoulLayerUnlocked === 'function' && !isSoulLayerUnlocked(layerId)) {
        return `${action.label} requires unlocking ${layerId}.`;
    }
    return null;
}

// ===== Combat hooks =====

function getSoulMassIntimidateTurns() {
    const baseTurns = 2;
    if (!isSoulMassPressureActive()) return baseTurns;
    const bal = typeof SOUL_MASS_BALANCE !== 'undefined' ? SOUL_MASS_BALANCE : null;
    return baseTurns + (bal?.pressureIntimidateBonusTurns || 1);
}

function getSoulMassIntimidateReductionBonus() {
    if (!isSoulMassPressureActive()) return 0;
    return 0.05 + Math.min(0.10, getSoulMass() * 0.002);
}

function isEnemyInteriorWeak(enemy) {
    if (!enemy) return false;
    const bal = typeof SOUL_CONDENSATION_BALANCE !== 'undefined' ? SOUL_CONDENSATION_BALANCE : null;
    const threshold = bal?.weakInteriorStatSum ?? 14;
    if (enemy.will != null || enemy.spirit != null) {
        return (enemy.will || 0) + (enemy.spirit || 0) < threshold;
    }
    const realm = enemy.minRealm != null ? enemy.minRealm : 1;
    return realm * 4 < threshold;
}

// ===== Soul Condensation technique school =====

function isSoulCondensationTechnique(template) {
    return template?.school === 'soul_condensation';
}

function getSoulMassLabelForThreshold(massMin) {
    const tiers = typeof SOUL_MASS_TIERS !== 'undefined' ? SOUL_MASS_TIERS : [];
    let label = 'Unformed';
    for (const t of tiers) {
        if (massMin >= t.massMin) label = t.label;
    }
    return label;
}

function getSoulCondensationMassBlockReason(template) {
    if (!template || !isSoulCondensationTechnique(template)) return null;
    const bal = typeof SOUL_CONDENSATION_BALANCE !== 'undefined' ? SOUL_CONDENSATION_BALANCE : null;
    const massMin = template.soulMassMin ?? bal?.defaultMassMin ?? 10;
    if (getSoulMass() >= massMin) return null;
    const tierLabel = getSoulMassLabelForThreshold(massMin);
    return `Requires Soul Mass ${massMin}+ (${tierLabel}) — condense spirit in the Soul Palace.`;
}

function isSoulCondensationMassMet(template) {
    return !getSoulCondensationMassBlockReason(template);
}

function getSoulCondensationPowerMult(template) {
    if (!isSoulCondensationTechnique(template)) return 1;
    const bal = typeof SOUL_CONDENSATION_BALANCE !== 'undefined' ? SOUL_CONDENSATION_BALANCE : null;
    if (!bal) return 1;
    const massMin = template.soulMassMin ?? bal.defaultMassMin;
    const massMet = getSoulMass() >= massMin;
    let mult = 1;
    if (G.path !== 'soul') mult *= bal.offPathDamageMult;
    if (!massMet) mult *= bal.lowMassDamageMult;
    return mult;
}

function getSoulCondensationCostMult(template) {
    if (!isSoulCondensationTechnique(template)) return 1;
    const bal = typeof SOUL_CONDENSATION_BALANCE !== 'undefined' ? SOUL_CONDENSATION_BALANCE : null;
    if (!bal) return 1;
    const massMin = template.soulMassMin ?? bal.defaultMassMin;
    const massMet = getSoulMass() >= massMin;
    let mult = 1;
    if (G.path !== 'soul') mult *= bal.offPathCostMult;
    if (!massMet) mult *= bal.lowMassCostMult;
    return mult;
}

function applySpiritDamageToEnemy(rawDmg, opts) {
    opts = opts || {};
    const bal = typeof SOUL_CONDENSATION_BALANCE !== 'undefined' ? SOUL_CONDENSATION_BALANCE : null;
    let dmg = rawDmg || 0;
    const bypassPct = opts.bypassPhysiquePct ?? bal?.enemyPhysiqueBypassPct ?? 0.35;
    if (opts.defending) {
        const baseDefendMult = 0.45;
        const effectiveMult = baseDefendMult + (1 - baseDefendMult) * bypassPct;
        dmg = Math.floor(dmg * effectiveMult);
    }
    if (isEnemyInteriorWeak(G.enemy)) {
        dmg = Math.floor(dmg * (1 + (bal?.weakInteriorBonusPct ?? 0.20)));
    }
    return Math.max(0, dmg);
}

function playerKnowsSoulSearch() {
    return G.techniques?.some(t => t.name === 'Soul Search');
}

function isSoulSearchActive() {
    return playerKnowsSoulSearch() && !G.soulSearchExploreBonusConsumed;
}

function getSoulSearchExploreRollMult() {
    if (!playerKnowsSoulSearch() || G.soulSearchExploreBonusConsumed) return 1;
    const bal = typeof SOUL_CONDENSATION_BALANCE !== 'undefined' ? SOUL_CONDENSATION_BALANCE : null;
    G.soulSearchExploreBonusConsumed = true;
    G.soulSearchExploreBonus = bal?.searchExploreBonusPct ?? 8;
    addLog('🔍 Soul Search sensitizes you to hidden trails.');
    return 1 + (G.soulSearchExploreBonus / 100);
}

function resetSoulSearchExploreBonus() {
    if (!playerKnowsSoulSearch()) return;
    G.soulSearchExploreBonusConsumed = false;
    G.soulSearchExploreBonus = null;
}

function canRandomGrantSoulCondensationTechnique(template) {
    if (!isSoulCondensationTechnique(template)) return true;
    return isSoulCondensationMassMet(template);
}

function warnSoulCondensationCombatOnce(techName, template) {
    if (!template || isSoulCondensationMassMet(template)) return;
    if (!G.soulCondensationCombatWarned) G.soulCondensationCombatWarned = {};
    if (G.soulCondensationCombatWarned[techName]) return;
    G.soulCondensationCombatWarned[techName] = true;
    addCombatLog('💠 Your Soul Mass is thin — this condensation art fades.', 'entry-mod');
}

function getSoulSearchNpcInsight(npc) {
    if (!playerKnowsSoulSearch()) return '';
    const bal = typeof SOUL_CONDENSATION_BALANCE !== 'undefined' ? SOUL_CONDENSATION_BALANCE : null;
    if (Math.random() >= (bal?.searchNpcInsightChance ?? 0.35)) return '';
    const hints = [];
    if (npc.disposition) hints.push(`hidden bearing: ${npc.disposition}`);
    if (npc.alignment != null) hints.push(`moral tint: ${npc.alignment > 0 ? 'righteous' : npc.alignment < 0 ? 'corrupt' : 'neutral'}`);
    if (npc.isDemonicTalent) hints.push('demonic taint beneath the surface');
    if (typeof getWorldNpcStrengthLabel === 'function') {
        hints.push(`true strength: ${getWorldNpcStrengthLabel(npc)}`);
    }
    return hints.length ? ` · Soul Search: ${hints.join('; ')}` : '';
}

function tryGrantSoulSpikeManual() {
    if (G.soulPalaceSpikeGranted) return;
    if (typeof grantManual !== 'function') return;
    if (G.techniques?.some(t => t.name === 'Soul Spike')) {
        G.soulPalaceSpikeGranted = true;
        return;
    }
    if (typeof getManualShelfEntry === 'function' && getManualShelfEntry('Soul Spike')) {
        G.soulPalaceSpikeGranted = true;
        return;
    }
    if (getSoulMass() < 25) return;
    if (typeof isSoulLayerUnlocked === 'function' && !isSoulLayerUnlocked('awakened')) return;
    G.soulPalaceSpikeGranted = true;
    grantManual('Soul Spike', { source: 'soul_palace' });
    addLog('💠 Soul Mass coalesces into a manual — Soul Spike awaits in your travel kit.');
}

function onCombatStartSoulMass() {
    ensureSoulMassState();
    G.soulMassCombat = { loggedPressureFlavor: false };

    if (!isSoulMassPressureActive() || !G.enemy) return;

    const weakFoe = isEnemyInteriorWeak(G.enemy);
    if (weakFoe && !G.soulMassCombat.loggedPressureFlavor) {
        addCombatLog(`The weight of your soul unsettles ${G.enemy.name}.`, 'entry-mod');
        G.soulMassCombat.loggedPressureFlavor = true;
    }

    if (G.path === 'soul' && weakFoe) {
        const turns = Math.max(G.enemy.intimidateTurns || 0, 1);
        G.enemy.intimidateTurns = turns;
        if (turns === 1) {
            addCombatLog(`👁️ Cultivated soul mass presses ${G.enemy.name} before the first blow.`, 'entry-mod');
        }
    }
}
