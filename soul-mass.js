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
    const playerRealm = typeof getTrackRealmIdx === 'function' ? getTrackRealmIdx('spirit') : (G.realmIdx || 0);
    const enemyBand = enemy.minRealm != null ? enemy.minRealm : 1;
    return enemyBand <= 1 || playerRealm >= enemyBand + 2;
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
