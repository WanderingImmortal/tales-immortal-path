// ============================================
// VESSEL-RULES.JS — One sworn physical oath per vessel
// ============================================
//
// Dantian → Weapon Intent; Vessel → Vessel Rules; Spirit → Soul Mass (future).
// Rule of Blood is fully playable; Rule of the Unnamed arrives in a follow-up PR.

/** Map legacy/alternate layer ids to Body Chamber keys. */
function normalizeVesselRuleBodyLayer(layerId) {
    if (layerId === 'bone') return 'bones';
    return layerId;
}

function ensureVesselRuleState() {
    if (G.vesselRule === undefined) G.vesselRule = null;
    if (G.vesselRuleCooldownUntilMonth == null) G.vesselRuleCooldownUntilMonth = 0;
    if (!G.vesselRule) return;
    if (!G.vesselRule.progression) G.vesselRule.progression = {};
    if (G.vesselRule.progressionPct == null) G.vesselRule.progressionPct = 0;
    if (G.vesselRule.swornAtMonth == null) G.vesselRule.swornAtMonth = G.ageMonths || 0;
}

function ensureVesselRuleCombatState() {
    if (!G.vesselRuleCombat) {
        G.vesselRuleCombat = {
            bloodSealedTurns: 0,
            sealCooldownTurns: 0,
            damageTakenThisFight: 0,
            wasBloodiedThisFight: false,
            loggedBloodied: false
        };
    }
}

function hasVesselRule() {
    ensureVesselRuleState();
    return !!(G.vesselRule && G.vesselRule.id);
}

function getVesselRuleId() {
    return hasVesselRule() ? G.vesselRule.id : null;
}

function getVesselRuleDef(id) {
    if (!id || typeof VESSEL_RULES === 'undefined') return null;
    return VESSEL_RULES[id] || null;
}

function getActiveVesselRuleDef() {
    const id = getVesselRuleId();
    return id ? getVesselRuleDef(id) : null;
}

function hasActiveVesselRule(id) {
    return getVesselRuleId() === id;
}

function isRuleOfBloodActive() {
    return hasActiveVesselRule('blood');
}

function isVesselRuleCooldownActive() {
    ensureVesselRuleState();
    return (G.vesselRuleCooldownUntilMonth || 0) > (G.ageMonths || 0);
}

function getVesselRuleCooldownRemainingMonths() {
    if (!isVesselRuleCooldownActive()) return 0;
    return Math.max(0, (G.vesselRuleCooldownUntilMonth || 0) - (G.ageMonths || 0));
}

function formatVesselRuleGateReason(gate) {
    if (!gate) return 'Requirements unknown.';
    const pathData = typeof PATHS !== 'undefined' ? PATHS.body : null;
    const realmName = pathData?.realms?.[gate.vesselRealmIdx] || `vessel realm ${gate.vesselRealmIdx + 1}`;
    const layerId = normalizeVesselRuleBodyLayer(gate.bodyLayer);
    const layer = typeof BODY_CHAMBER_LAYERS !== 'undefined' ? BODY_CHAMBER_LAYERS[layerId] : null;
    const layerLabel = layer?.label || layerId || 'body layer';
    return `Requires ${realmName} and ${gate.bodyLayerPct}% ${layerLabel} refinement`;
}

function checkVesselRuleSwearGate(ruleId) {
    const def = getVesselRuleDef(ruleId);
    if (!def) return { ok: false, reason: 'Unknown rule.' };
    const gate = def.swearGate;
    if (!gate) return { ok: true };

    const vesselIdx = typeof getTrackRealmIdx === 'function' ? getTrackRealmIdx('vessel') : 0;
    if (vesselIdx < (gate.vesselRealmIdx ?? 0)) {
        return { ok: false, reason: formatVesselRuleGateReason(gate) };
    }

    const layerId = normalizeVesselRuleBodyLayer(gate.bodyLayer);
    const layerPct = typeof getBodyLayerProgress === 'function' ? getBodyLayerProgress(layerId) : 0;
    if (layerPct < (gate.bodyLayerPct ?? 0)) {
        return { ok: false, reason: formatVesselRuleGateReason(gate) };
    }
    return { ok: true };
}

function canSwearVesselRule(ruleId) {
    ensureVesselRuleState();
    if (vesselRuleActionBlocked()) {
        return { ok: false, reason: 'Cannot swear a Vessel Rule during combat or tribulation.' };
    }
    if (hasVesselRule()) {
        return { ok: false, reason: 'You already bear a sworn Vessel Rule.' };
    }
    if (isVesselRuleCooldownActive()) {
        const months = getVesselRuleCooldownRemainingMonths();
        const years = (months / 12).toFixed(1).replace(/\.0$/, '');
        return { ok: false, reason: `The flesh still remembers your broken oath — wait ${months} months (${years} years).` };
    }
    const def = getVesselRuleDef(ruleId);
    if (!def) return { ok: false, reason: 'Unknown rule.' };
    const gate = checkVesselRuleSwearGate(ruleId);
    if (!gate.ok) return gate;
    return { ok: true };
}

function swearVesselRule(ruleId) {
    const check = canSwearVesselRule(ruleId);
    if (!check.ok) return { success: false, message: check.reason };

    const def = getVesselRuleDef(ruleId);
    const bal = typeof VESSEL_RULE_BALANCE !== 'undefined' ? VESSEL_RULE_BALANCE : { swearMonths: 6 };
    const months = bal.swearMonths || 6;

    beginActionLog();
    if (!advanceTime(months, `Swearing the ${def.name}`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends...' };
    }

    G.vesselRule = {
        id: ruleId,
        swornAtMonth: G.ageMonths,
        progression: {},
        progressionPct: 0
    };
    ensureVesselRuleState();

    const mechanicsNote = def.implemented
        ? ''
        : ' Rule sworn — full mechanics arrive in a future update.';
    const msg = `${def.emoji} You swear the ${def.name}. "${def.oath}"${mechanicsNote}`;
    commitActionLog(msg);
    if (typeof checkPerfectCultivation === 'function') checkPerfectCultivation();
    return { success: true, message: msg, logged: true };
}

function canReleaseVesselRule() {
    ensureVesselRuleState();
    if (!hasVesselRule()) {
        return { ok: false, reason: 'No Vessel Rule to release.' };
    }
    if (vesselRuleActionBlocked()) {
        return { ok: false, reason: 'Cannot release a Vessel Rule during combat or tribulation.' };
    }
    return { ok: true };
}

function applyVesselRuleAbandonPunishment() {
    const bal = typeof VESSEL_RULE_BALANCE !== 'undefined' ? VESSEL_RULE_BALANCE : {};
    if (bal.abandonRegressRealm && typeof regressVesselTrackToCurrentRealmStart === 'function') {
        regressVesselTrackToCurrentRealmStart();
    }
    const cooldownMonths = bal.releaseCooldownMonths || 12;
    G.vesselRuleCooldownUntilMonth = (G.ageMonths || 0) + cooldownMonths;
}

function releaseVesselRule() {
    const check = canReleaseVesselRule();
    if (!check.ok) return { success: false, message: check.reason };

    const def = getActiveVesselRuleDef();
    const ruleName = def?.name || 'Vessel Rule';
    const realmName = typeof getVesselRealm === 'function' ? getVesselRealm() : 'your vessel realm';
    const cooldownMonths = (typeof VESSEL_RULE_BALANCE !== 'undefined'
        ? VESSEL_RULE_BALANCE.releaseCooldownMonths : 12) || 12;

    applyVesselRuleAbandonPunishment();
    G.vesselRule = null;
    ensureVesselRuleState();

    const msg = `💔 You break the ${ruleName}. The flesh recoils — cast back to the start of ${realmName}, `
        + `all Rule progression lost. ${cooldownMonths} months must pass before another oath may be sworn.`;
    addLog(msg);
    if (typeof checkPerfectCultivation === 'function') checkPerfectCultivation();
    if (typeof fullRender === 'function') fullRender();
    return { success: true, message: msg, logged: true };
}

function getVesselRuleProgressionPct() {
    if (!hasVesselRule()) return 0;
    return Math.min(100, Math.max(0, G.vesselRule.progressionPct || 0));
}

function grantVesselRuleProgression(amount, source) {
    if (!hasVesselRule() || !amount) return 0;
    const before = getVesselRuleProgressionPct();
    const complete = typeof VESSEL_RULE_BALANCE !== 'undefined'
        ? (VESSEL_RULE_BALANCE.progressionCompletePct ?? 100)
        : 100;
    G.vesselRule.progressionPct = Math.min(complete, before + amount);
    if (source && G.vesselRule.progression) {
        G.vesselRule.progression[source] = (G.vesselRule.progression[source] || 0) + amount;
    }
    if (G.vesselRule.progressionPct >= complete && before < complete) {
        addLog(`⚖️ Your Vessel Rule nears its apex — the oath is fulfilled in flesh.`);
        if (typeof checkPerfectCultivation === 'function') checkPerfectCultivation();
    }
    return G.vesselRule.progressionPct - before;
}

function isVesselRuleProgressionComplete() {
    if (!hasVesselRule()) return false;
    const complete = typeof VESSEL_RULE_BALANCE !== 'undefined'
        ? (VESSEL_RULE_BALANCE.progressionCompletePct ?? 100)
        : 100;
    return getVesselRuleProgressionPct() >= complete;
}

function hasVesselInteriorPeak() {
    return hasVesselRule() && isVesselRuleProgressionComplete();
}

function getVesselRuleSoulContestPct() {
    if (!isRuleOfBloodActive()) return 0;
    const bal = typeof RULE_OF_BLOOD_BALANCE !== 'undefined' ? RULE_OF_BLOOD_BALANCE : null;
    if (!bal) return 0;
    const t = getVesselRuleProgressionPct() / 100;
    return bal.soulContestPctBase + (bal.soulContestPctAtComplete - bal.soulContestPctBase) * t;
}

function vesselRuleActionBlocked() {
    return G.gameOver || G.inCombat
        || (typeof isTribulationActive === 'function' && isTribulationActive());
}

// ===== Rule of Blood — combat helpers =====

function getBloodRuleBalance() {
    return typeof RULE_OF_BLOOD_BALANCE !== 'undefined' ? RULE_OF_BLOOD_BALANCE : null;
}

function blockBloodRuleHealing() {
    return G.inCombat && isRuleOfBloodActive();
}

function isBloodied() {
    if (!G.inCombat || !isRuleOfBloodActive()) return false;
    const bal = getBloodRuleBalance();
    if (!bal) return false;
    ensureVesselRuleCombatState();
    const hpCap = typeof getEffectiveMaxHp === 'function' ? getEffectiveMaxHp() : G.maxHp;
    if (hpCap > 0 && G.hp / hpCap < bal.bloodiedHpPct) return true;
    if (G.combatStatus?.bleedTurns > 0) return true;
    const dmgThreshold = Math.floor(hpCap * bal.bloodiedDamageTakenPct);
    if ((G.vesselRuleCombat.damageTakenThisFight || 0) >= dmgThreshold) return true;
    return false;
}

function markBloodiedThisFight() {
    if (!G.inCombat || !isRuleOfBloodActive()) return;
    ensureVesselRuleCombatState();
    const vc = G.vesselRuleCombat;
    if (!isBloodied()) return;
    if (!vc.wasBloodiedThisFight) {
        vc.wasBloodiedThisFight = true;
        if (G.vesselRule?.progression) {
            G.vesselRule.progression.fightsBloodied = (G.vesselRule.progression.fightsBloodied || 0) + 1;
        }
    }
    if (!vc.loggedBloodied) {
        vc.loggedBloodied = true;
        if (typeof addCombatLog === 'function') {
            addCombatLog(`🩸 Blood coats the vessel. The Rule awakens.`, 'entry-mod');
        }
    }
}

function getBloodRuleDamageMult() {
    if (!isBloodied() || G.path !== 'body') return 1;
    const bal = getBloodRuleBalance();
    return bal ? bal.bloodiedDamageMult : 1;
}

function getBloodRuleDamageReduction() {
    if (!isBloodied()) return 0;
    const bal = getBloodRuleBalance();
    return bal ? bal.bloodiedDamageReductionPct : 0;
}

function applyBloodRuleDamageReduction(dmg) {
    const reduction = getBloodRuleDamageReduction();
    if (!reduction || dmg < 1) return dmg;
    return Math.max(1, Math.floor(dmg * (1 - reduction)));
}

function canSealBlood() {
    if (!G.inCombat || !isRuleOfBloodActive() || G.path !== 'body') return false;
    ensureVesselRuleCombatState();
    const vc = G.vesselRuleCombat;
    if ((vc.sealCooldownTurns || 0) > 0) return false;
    const hasBleed = (G.combatStatus?.bleedTurns || 0) > 0;
    return hasBleed || isBloodied();
}

function getSealBloodBlockReason() {
    if (!G.inCombat || !isRuleOfBloodActive() || G.path !== 'body') {
        return 'Requires body path and Rule of Blood.';
    }
    ensureVesselRuleCombatState();
    const vc = G.vesselRuleCombat;
    if ((vc.sealCooldownTurns || 0) > 0) {
        return `Seal Blood on cooldown (${vc.sealCooldownTurns} turns).`;
    }
    const bal = getBloodRuleBalance();
    const cost = bal?.sealStaminaCost || 4;
    if ((G.combatResource || 0) < cost) {
        const cfg = typeof getCombatConfig === 'function' ? getCombatConfig() : { resource: 'Stamina' };
        return `Need ${cost} ${cfg.resource}.`;
    }
    if (!canSealBlood()) return 'No bleeding wound to seal.';
    return null;
}

function combatSealBlood() {
    if (!canPlayerAct?.()) return false;
    const block = getSealBloodBlockReason();
    if (block) {
        if (typeof addCombatLog === 'function') addCombatLog(`🩸 ${block}`);
        return false;
    }
    const bal = getBloodRuleBalance();
    if (!bal) return false;
    const cost = bal.sealStaminaCost;
    if (!spendCombatResource(cost, 'Seal Blood')) return false;
    if (!combatSpendRound()) return false;

    ensureVesselRuleCombatState();
    const vc = G.vesselRuleCombat;
    if (G.combatStatus) {
        G.combatStatus.bleedTurns = 0;
        G.combatStatus.bleedDmgPct = 0;
    }
    vc.bloodSealedTurns = bal.sealBleedPauseTurns;
    vc.sealCooldownTurns = bal.sealCooldownTurns;
    if (G.vesselRule?.progression) {
        G.vesselRule.progression.sealsUsed = (G.vesselRule.progression.sealsUsed || 0) + 1;
    }
    grantVesselRuleProgression(bal.progressionPerSeal, 'seal');
    addCombatLog(`🩸 Seal Blood — you refuse to bleed out. The wound holds by will alone.`);
    if (typeof updateCombatUI === 'function') updateCombatUI();
    if (typeof scheduleOpponentTurn === 'function') scheduleOpponentTurn();
    return true;
}

function tryCombatPlayerHeal(amount, opts) {
    opts = opts || {};
    if (!amount || amount < 1) return 0;
    const allowLifesteal = opts.lifesteal === true;
    if (blockBloodRuleHealing() && !allowLifesteal) {
        if (typeof addCombatLog === 'function') {
            addCombatLog(`🩸 The Rule forbids mending — blood serves the flesh, not comfort.`);
        }
        return 0;
    }
    const hpCap = typeof getEffectiveMaxHp === 'function' ? getEffectiveMaxHp() : G.maxHp;
    const hpBefore = G.hp;
    G.hp = Math.min(hpCap, G.hp + amount);
    const healed = G.hp - hpBefore;
    if (healed > 0 && allowLifesteal && blockBloodRuleHealing() && typeof addCombatLog === 'function') {
        addCombatLog(`🩸 Blood returns to blood.`, 'entry-mod');
    }
    return healed;
}

function tickVesselRulePlayerTurnStart() {
    if (!G.inCombat || !isRuleOfBloodActive()) return;
    ensureVesselRuleCombatState();
    const vc = G.vesselRuleCombat;
    if ((vc.sealCooldownTurns || 0) > 0) vc.sealCooldownTurns--;
    markBloodiedThisFight();
}

function onCombatStartVesselRule() {
    G.vesselRuleCombat = {
        bloodSealedTurns: 0,
        sealCooldownTurns: 0,
        damageTakenThisFight: 0,
        wasBloodiedThisFight: false,
        loggedBloodied: false
    };
}

function onCombatVictoryVesselRule() {
    if (!isRuleOfBloodActive()) return;
    ensureVesselRuleCombatState();
    const vc = G.vesselRuleCombat;
    if (!vc?.wasBloodiedThisFight) return;
    const bal = getBloodRuleBalance();
    if (!bal) return;
    grantVesselRuleProgression(bal.progressionPerBloodiedWin, 'bloodiedWin');
    if (G.vesselRule?.progression) {
        G.vesselRule.progression.bloodiedWins = (G.vesselRule.progression.bloodiedWins || 0) + 1;
    }
}

function onPlayerDamagedVesselRule(dmg, opts) {
    if (!isRuleOfBloodActive() || !G.inCombat) return;
    ensureVesselRuleCombatState();
    const vc = G.vesselRuleCombat;
    const hpDamage = Math.max(0, dmg || 0);
    if (hpDamage > 0) vc.damageTakenThisFight = (vc.damageTakenThisFight || 0) + hpDamage;
    markBloodiedThisFight();

    if (!isBloodied() || !G.enemy) return;
    const bal = getBloodRuleBalance();
    if (!bal) return;
    if (Math.random() < bal.backlashSlowChance) {
        G.enemy.slowTurns = (G.enemy.slowTurns || 0) + bal.backlashSlowTurns;
        if (typeof addCombatLog === 'function') {
            addCombatLog(`🩸 Their strike disturbs your blood — their rhythm breaks.`, 'entry-mod');
        }
    }
}
