// ============================================
// SOUL-MASS.JS — Soul Mass interior cultivation + soul damage mitigation
// ============================================
//
// Pre–soul-birth: condense builds latent mass (capped below hard minimum).
// On soul birth: latent crystallizes into active Soul Mass; maturity tier set.
// Post-birth: condense grants active Soul Mass for combat & techniques.

function ensureSoulMassState() {
    if (!G.soulMass) {
        G.soulMass = {
            mass: 0,
            latentMass: 0,
            soulMaturity: null,
            tier: 0,
            apexProgressPct: 0,
            condenseCount: 0,
            condenseActionCounts: {}
        };
    }
    if (G.soulMass.latentMass == null) G.soulMass.latentMass = 0;
    if (G.soulMass.soulMaturity === undefined) G.soulMass.soulMaturity = null;
    if (G.soulMass.tier == null) G.soulMass.tier = 0;
    if (G.soulMass.apexProgressPct == null) G.soulMass.apexProgressPct = 0;
    if (G.soulMass.condenseCount == null) G.soulMass.condenseCount = 0;
    if (!G.soulMass.condenseActionCounts) G.soulMass.condenseActionCounts = {};
    migrateLegacySoulMassIfNeeded();
    syncSoulMassTier();
    if (G.soulMass.soulMaturity == null && typeof hasSoulEmbryo === 'function' && hasSoulEmbryo()) {
        G.soulMass.soulMaturity = computeSoulMaturityFromMass(getSoulMass());
    }
}

/** Saves from before latent/active split: move pre-birth mass into latent (capped). */
function migrateLegacySoulMassIfNeeded() {
    if (G._soulMassLatentMigrated) return;
    const hasEmbryo = typeof hasSoulEmbryo === 'function' && hasSoulEmbryo();
    const cap = getLatentMassCap();
    if (!hasEmbryo && (G.soulMass.mass || 0) > 0 && (G.soulMass.latentMass || 0) === 0) {
        G.soulMass.latentMass = Math.min(cap, G.soulMass.mass);
        G.soulMass.mass = 0;
    }
    if (hasEmbryo && G.soulMass.latentMass > 0) {
        G.soulMass.mass = (G.soulMass.mass || 0) + G.soulMass.latentMass;
        G.soulMass.latentMass = 0;
        G.soulMass.soulMaturity = computeSoulMaturityFromMass(getSoulMass());
    }
    G._soulMassLatentMigrated = true;
}

function getSoulMassBalance() {
    return typeof SOUL_MASS_BALANCE !== 'undefined' ? SOUL_MASS_BALANCE : {};
}

function getLatentMassCap() {
    return getSoulMassBalance().latentMassCap ?? 9;
}

function getSoulMassHardMin() {
    return getSoulMassBalance().hardMinMass ?? 10;
}

function getSoulMassSoftMin() {
    return getSoulMassBalance().softMinMass ?? 25;
}

function hasActiveSoulMass() {
    return typeof hasSoulEmbryo === 'function' && hasSoulEmbryo();
}

function getLatentSoulMass() {
    ensureSoulMassState();
    if (hasActiveSoulMass()) return 0;
    return G.soulMass.latentMass || 0;
}

function isLatentMassAtCap() {
    return getLatentSoulMass() >= getLatentMassCap();
}

function computeSoulMaturityFromMass(mass) {
    const hard = getSoulMassHardMin();
    const soft = getSoulMassSoftMin();
    if (mass < hard) return 'hollow';
    if (mass < soft) return 'nascent';
    if (mass >= (getSoulMassBalance().massPerTier ?? 25) * 3) return 'ascendant';
    return 'settled';
}

function getSoulMaturity() {
    ensureSoulMassState();
    if (!hasActiveSoulMass()) return null;
    if (!G.soulMass.soulMaturity) {
        G.soulMass.soulMaturity = computeSoulMaturityFromMass(getSoulMass());
    }
    return G.soulMass.soulMaturity;
}

function getSoulMaturityLabel() {
    const m = getSoulMaturity();
    if (!m) return null;
    const labels = typeof SOUL_MATURITY_LABELS !== 'undefined' ? SOUL_MATURITY_LABELS : {};
    return labels[m] || m;
}

function getSoulMaturityPowerMult() {
    const m = getSoulMaturity();
    const bal = getSoulMassBalance();
    if (m === 'hollow') return bal.hollowPowerMult ?? 0.65;
    if (m === 'nascent') return bal.nascentMitigationMult ?? 0.85;
    return 1;
}

function getSoulMaturityMitigationMult() {
    const m = getSoulMaturity();
    const bal = getSoulMassBalance();
    if (m === 'hollow') return bal.hollowMitigationMult ?? 0.5;
    if (m === 'nascent') return bal.nascentMitigationMult ?? 0.85;
    return 1;
}

/** Crystallize latent foundation weight into active Soul Mass on soul birth. */
function resolveSoulMassOnBirth(origin) {
    ensureSoulMassState();
    const bal = getSoulMassBalance();
    const latent = G.soulMass.latentMass || 0;
    const spiritIdx = typeof getTrackRealmIdx === 'function' ? getTrackRealmIdx('spirit') : 0;
    const preludePct = typeof getSpiritPreludeProgressPct === 'function' ? getSpiritPreludeProgressPct() : 0;

    let rate = bal.offPathConversionRate ?? 0.55;
    if (origin === 'spirit') {
        rate = bal.spiritPathConversionRate ?? 1.0;
    } else if (spiritIdx >= 2) {
        rate = bal.partialSpiritConversionRate ?? 0.75;
    }
    if (preludePct >= 40) rate = Math.min(1, rate + 0.1);
    if (preludePct >= 80) rate = Math.min(1, rate + 0.05);

    let active = Math.floor(latent * rate);
    if (origin === 'spirit' && latent >= getSoulMassSoftMin()) {
        active = Math.max(active, latent);
    }

    G.soulMass.mass = active;
    G.soulMass.latentMass = 0;
    G.soulMass.soulMaturity = computeSoulMaturityFromMass(active);
    syncSoulMassTier();

    const maturityLabel = getSoulMaturityLabel() || 'Nascent Soul';
    const msg = active >= getSoulMassSoftMin()
        ? `💠 Foundation crystallizes — Soul Mass ${active} (${maturityLabel}).`
        : active >= getSoulMassHardMin()
            ? `💠 A ${maturityLabel} forms — Soul Mass ${active}. Condense further in the palace.`
            : `💠 A hollow nascent soul stirs — Soul Mass ${active}. Cultivate interior weight in the palace.`;
    if (typeof addLog === 'function') addLog(msg);
}

function formatSoulMassStatusLine() {
    ensureSoulMassState();
    if (!hasActiveSoulMass()) {
        const latent = getLatentSoulMass();
        const cap = getLatentMassCap();
        if (latent > 0) {
            return `Latent spirit weight: ${latent}/${cap} — crystallizes when the soul is born (fourth realm on any path).`;
        }
        return `Spirit foundation — condense latent weight (cap ${cap}) before soul birth.`;
    }
    const mass = getSoulMass();
    const tierLabel = getSoulMassTierLabel();
    const maturityLabel = getSoulMaturityLabel();
    let line = `Soul Mass: ${mass} (${tierLabel})`;
    if (maturityLabel) line += ` · ${maturityLabel}`;
    if (mass < getSoulMassSoftMin()) {
        line += ` · ${getSoulMassSoftMin()}+ for a settled soul`;
    }
    return line;
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
    if (gain <= 0) return 0;
    let applied = gain;

    if (hasActiveSoulMass()) {
        G.soulMass.mass += gain;
    } else {
        const cap = getLatentMassCap();
        const before = G.soulMass.latentMass || 0;
        G.soulMass.latentMass = Math.min(cap, before + gain);
        applied = G.soulMass.latentMass - before;
    }

    if (applied <= 0) return 0;
    G.soulMass.condenseCount = (G.soulMass.condenseCount || 0) + 1;
    syncSoulMassTier();
    if (hasActiveSoulMass()) {
        G.soulMass.soulMaturity = computeSoulMaturityFromMass(getSoulMass());
    }
    const bal = getSoulMassBalance();
    if (bal?.progressionPerCondense) {
        grantSoulApexProgress(bal.progressionPerCondense, source || 'condense');
    }
    return applied;
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
    if (!hasActiveSoulMass()) return false;
    const min = getSoulMassBalance().pressureMassMin ?? 10;
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
    if (!hasActiveSoulMass()) {
        const bal = getSoulMassBalance();
        const threshold = bal.weakInteriorSpiritWillSum ?? 12;
        return (G.spirit || 0) + (G.will || 0) < threshold;
    }
    const bal = getSoulMassBalance();
    const threshold = bal.weakInteriorSpiritWillSum ?? 12;
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
    if (!hasActiveSoulMass()) return 0;
    const bal = getSoulMassBalance();
    const raw = Math.min(bal.massDefenderCap || 0.25, getSoulMass() * (bal.massDefenderPctPerMass || 0));
    return raw * getSoulMaturityMitigationMult();
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
    if (layerId === 'prelude' && !hasActiveSoulMass() && isLatentMassAtCap()) {
        return `Latent spirit weight at cap (${getLatentMassCap()}) — soul must be born before more weight can settle.`;
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
    if (!hasActiveSoulMass()) {
        return 'Soul condensation arts require an awakened soul — reach the fourth realm on any path.';
    }
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
    if (!hasActiveSoulMass()) return 0;
    const bal = typeof SOUL_CONDENSATION_BALANCE !== 'undefined' ? SOUL_CONDENSATION_BALANCE : null;
    if (!bal) return 1;
    const massMin = template.soulMassMin ?? bal.defaultMassMin;
    const massMet = getSoulMass() >= massMin;
    let mult = getSoulMaturityPowerMult();
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
