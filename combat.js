// ============================================
// COMBAT.JS — Path-specific combat resources & mechanics
// ============================================

function getCombatConfig() {
    return COMBAT_PATH[G.path] || COMBAT_PATH.qi;
}

function calcMaxCombatResource() {
    let max = getCombatConfig().maxResource(G);
    return Math.floor(max * getPlayerTraitMultPct('primaryResourcePct', 0));
}

function initCombatResource() {
    G.maxCombatResource = calcMaxCombatResource();
    G.combatResource = G.maxCombatResource;
}

function getTechniqueCombatCost(tech) {
    const tierId = getTechniqueCombatTier(tech);
    const tierDef = TECHNIQUE_COMBAT_TIERS[tierId] || TECHNIQUE_COMBAT_TIERS.medium;
    const maxPool = G.maxCombatResource || calcMaxCombatResource();
    let cost = tech.combatCost || Math.floor(maxPool * tierDef.poolPct);
    cost = Math.max(tierDef.minCost, Math.min(tierDef.maxCost, cost));
    const tier = getTechniqueTier(tech.uses || 0);
    cost = Math.floor(cost * (1 - tier.bonusCost * 0.35));
    cost = Math.floor(cost * getTechniqueAffinityCostMult(tech) * getTechniqueSetCostMult(tech));
    if (typeof getTranscendenceTechniqueCostMult === 'function') {
        cost = Math.floor(cost * getTranscendenceTechniqueCostMult());
    }
    if (typeof getBodyChamberTechniqueCostMult === 'function') {
        cost = Math.floor(cost * getBodyChamberTechniqueCostMult());
    }
    return Math.max(1, cost);
}

function getWeaponBasicAttackBonus() {
    if (typeof getEquippedInstance !== 'function' || typeof getInstanceDef !== 'function') return 0;
    const def = getInstanceDef(getEquippedInstance('weapon'));
    if (!def) return 0;
    const tier = def.tier || 1;
    const gearDmg = (typeof getGearBonuses === 'function' ? getGearBonuses().dmgPct : 0) || 0;
    return Math.floor(tier * 6 + gearDmg * 0.9 + (G.realmIdx || 0) * 2);
}

function getCombatResourceRegenGain() {
    const cfg = getCombatConfig();
    let resGain = cfg.regen(G);
    resGain = Math.floor(resGain * (G.crucibleRegenMult || 1));
    if (typeof getTranscendenceRegenMult === 'function') {
        resGain = Math.floor(resGain * getTranscendenceRegenMult());
    }
    if (typeof getGearBonuses === 'function') {
        const gb = getGearBonuses();
        if (G.path === 'qi') resGain += gb.breathRegenBonus || 0;
        else if (G.path === 'body') resGain += gb.staminaRegenBonus || 0;
        else if (G.path === 'soul') resGain += gb.focusRegenBonus || 0;
    }
    if (G.path === 'qi' && typeof getBodyChamberQiRegenMult === 'function') {
        resGain = Math.floor(resGain * getBodyChamberQiRegenMult());
    }
    if (G.path === 'qi' && typeof getSoulChamberQiRegenMult === 'function') {
        resGain = Math.floor(resGain * getSoulChamberQiRegenMult());
    }
    if (G.path === 'body') {
        if (typeof getBodyChamberBonus === 'function') {
            const staminaEff = getBodyChamberBonus('staminaEfficiencyPct');
            if (staminaEff) resGain = Math.floor(resGain * (1 + staminaEff / 100));
        }
        if (typeof getBodyChamberStaminaRegenMult === 'function') {
            resGain = Math.floor(resGain * getBodyChamberStaminaRegenMult());
        }
        if (typeof getSoulChamberStaminaRegenMult === 'function') {
            resGain = Math.floor(resGain * getSoulChamberStaminaRegenMult());
        }
    }
    if (G.path === 'soul') {
        if (typeof getSoulChamberQiRegenMult === 'function') {
            resGain = Math.floor(resGain * getSoulChamberQiRegenMult());
        }
        if (typeof getSoulChamberStaminaRegenMult === 'function') {
            resGain = Math.floor(resGain * getSoulChamberStaminaRegenMult());
        }
    }
    const cap = COMBAT_BALANCE.combatRegenCap || 10;
    return Math.min(cap, Math.max(0, resGain));
}

function isFleeBlocked() {
    if (typeof isMirrorTrial === 'function' && isMirrorTrial()) return 'You cannot flee your own reflection.';
    if (typeof isCrucibleTrial === 'function' && isCrucibleTrial()) return 'The Crucible seals shut — there is no retreat.';
    if (typeof isSilenceTrial === 'function' && isSilenceTrial()) return 'The mountain seals the path behind you — no retreat.';
    if (typeof isMawTrial === 'function' && isMawTrial()) return 'The Maw has no exit — only truth or teeth.';
    if (typeof isEncounterCombat === 'function' && isEncounterCombat()) return 'Turning your back now would be worse than death.';
    if (typeof isAncientGuardianCombat === 'function' && isAncientGuardianCombat()) return 'The guardian blocks all escape — fight or fall!';
    if (typeof isTribulationCombat === 'function' && isTribulationCombat()) return 'You cannot flee from yourself.';
    return null;
}

function getCombatFleeChance(ctx) {
    const b = COMBAT_FLEE_BALANCE || {};
    let chance = (b.baseChance || 48) + (G.spirit || 0) * (b.spiritScale || 2.2)
        + (G.realmIdx || 0) * (b.realmBonus || 3)
        + Math.floor(getEffectiveFoundation() / (b.foundationPerPct || 10));
    if (G.path === 'soul') chance += (G.will || 0) * (b.soulWillScale || 1.5);
    if (G.path === 'body') chance += b.bodyPenalty || -6;
    if (G.path === 'qi') chance += b.qiBonus || 6;
    if (ctx?.type === 'rival') chance += b.rivalBonus || 12;
    if (typeof getGearBonuses === 'function') chance += (getGearBonuses().evasionBonus || 0) * 0.4;
    return Math.max(b.minChance || 28, Math.min(b.maxChance || 85, Math.floor(chance)));
}

function updateFleeButton() {
    const btn = document.getElementById('cbFlee');
    if (!btn || !G.inCombat) return;
    const cfg = getCombatConfig();
    const cost = cfg.costs.flee;
    const blocked = isFleeBlocked();
    const ctx = typeof isNpcCombat === 'function' && isNpcCombat() ? G.npcCombat : null;
    const chance = blocked ? 0 : getCombatFleeChance(ctx);
    const canAfford = G.combatResource >= cost;
    if (blocked) {
        btn.textContent = '🏃 Flee';
        btn.title = blocked;
        return;
    }
    if (typeof isFactionHuntCombat === 'function' && isFactionHuntCombat()) {
        btn.textContent = `🏃 Flee (~15%)`;
        btn.title = 'Sect enforcers hem you in — flight is nearly impossible.';
        return;
    }
    btn.textContent = `🏃 Flee (${cost} · ${chance}%)`;
    btn.title = canAfford
        ? `${chance}% escape chance — costs ${cost} ${cfg.resource}`
        : `Need ${cost} ${cfg.resource} (have ${G.combatResource})`;
    if (G.combatPhase === 'player' && btn.style.opacity !== '0.4') {
        btn.disabled = !canAfford;
        btn.style.opacity = canAfford ? '' : '0.45';
    }
}

function spendCombatResource(amount, actionLabel) {
    if (G.combatResource < amount) {
        const cfg = getCombatConfig();
        addCombatLog(`❌ Not enough ${cfg.resource}! Need ${amount}, have ${G.combatResource}.`);
        return false;
    }
    G.combatResource -= amount;
    const cfg = getCombatConfig();
    addCombatLog(`${cfg.icon} −${amount} ${cfg.resource} (${actionLabel})`);
    return true;
}

function getPlayerOffensivePower() {
    let stat;
    if (G.path === 'soul') stat = (G.will + G.spirit) / 2;
    else if (G.path === 'body') {
        const vit = typeof getBodyChamberEffectiveVitality === 'function' ? getBodyChamberEffectiveVitality() : G.vitality;
        stat = vit * 1.5 + getQiDensity() * 0.5;
    }
    else stat = getQiDensity() * 1.2 + G.will * 0.3;

    let power = stat + G.realmIdx * COMBAT_BALANCE.realmPowerBonus + Math.floor(getEffectiveFoundation() / 5);
    if (G.techniques.length) {
        const bestTech = Math.max(...G.techniques.map(t => getTechDamage(t)));
        power += Math.floor(bestTech * 0.25);
    }
    if (resolveActiveIntent()) {
        power += Math.floor(stat * getIntentBonus());
    }
    if (G.dmgMult > 1) power *= G.dmgMult;
    if (typeof getGearDamageMult === 'function') power *= getGearDamageMult();
    if (typeof getSectCombatMult === 'function') power *= getSectCombatMult();
    if (typeof getBodyChamberPhysicalDmgMult === 'function') power = Math.floor(power * getBodyChamberPhysicalDmgMult());
    return Math.max(1, Math.floor(power));
}

function estimateBasicAttackDamage() {
    let dmg;
    let scale = COMBAT_BALANCE.basicAttackScale;
    if (G.path === 'soul') {
        dmg = Math.floor((G.will + G.spirit) / 2) + 6;
        scale = COMBAT_BALANCE.basicAttackScaleSoul;
    } else if (G.path === 'body') {
        const vit = typeof getBodyChamberEffectiveVitality === 'function' ? getBodyChamberEffectiveVitality() : G.vitality;
        dmg = Math.floor(vit * 1.5 + getQiDensity() * 0.3) + 4 + getWeaponBasicAttackBonus();
        scale = COMBAT_BALANCE.basicAttackScaleBody;
    } else {
        const innate = Math.floor(getQiDensity() * 0.15 + G.will * 0.1) + 3;
        const hasIntent = typeof getActiveIntent === 'function' ? getActiveIntent() : G.weaponIntent;
        const intentPart = hasIntent ? Math.floor((8 + G.realmIdx * 2) * (1 + getIntentBonus())) : 0;
        dmg = innate + getWeaponBasicAttackBonus() + intentPart;
        scale = COMBAT_BALANCE.basicAttackScaleQi;
    }
    const activeIntentEst = typeof getActiveIntent === 'function' ? getActiveIntent() : G.weaponIntent;
    if (activeIntentEst && G.path !== 'qi') dmg = Math.floor(dmg * (1 + getIntentBonus()));
    if (G.dmgMult > 1) dmg = Math.floor(dmg * G.dmgMult);
    if (typeof getFactionCombatDmgMult === 'function') dmg = Math.floor(dmg * getFactionCombatDmgMult());
    if (typeof getGearDamageMult === 'function') dmg = Math.floor(dmg * getGearDamageMult());
    if (typeof getSectCombatMult === 'function') dmg = Math.floor(dmg * getSectCombatMult());
    if (typeof applyBodyChamberPhysicalDmg === 'function') dmg = applyBodyChamberPhysicalDmg(dmg, null);
    return Math.max(1, Math.floor(dmg * scale));
}

function estimateTypicalHitDamage() {
    const basic = estimateBasicAttackDamage();
    if (!G.techniques.length) return basic;
    const bestTech = Math.max(...G.techniques.map(t => calcCombatTechniqueDamage(t)));
    return Math.max(basic, bestTech);
}

function pickEnemyTemplate() {
    const eligible = ENEMIES.filter(e => (e.minRealm || 0) <= G.realmIdx);
    const pool = eligible.length ? eligible : ENEMIES;
    const weighted = [];
    pool.forEach(e => {
        const weight = 1 + (e.minRealm || 0);
        for (let i = 0; i < weight; i++) weighted.push(e);
    });
    return weighted[Math.floor(Math.random() * weighted.length)];
}

function pickCrucibleTemplate(wave) {
    const baseIdx = Math.max(0, G.realmIdx - 1);
    const idx = Math.min(ENEMIES.length - 1, baseIdx + wave - 1);
    return ENEMIES[idx];
}

function calcCrucibleEnemyHp(template, wave) {
    const fb = FORBIDDEN_BALANCE;
    const waveScale = 1 + (wave - 1) * fb.crucibleHpScalePerWave;
    const typicalHit = estimateTypicalHitDamage();
    const playerMax = G.maxHp || 70;

    // Endurance test — scales with durability and hit strength, NOT full offensive power
    let hp = template.hp;
    hp += Math.floor(playerMax * fb.crucibleHpFromPlayerMaxPct);
    hp += Math.floor(typicalHit * fb.crucibleMinHits * waveScale);
    hp = Math.floor(hp * fb.crucibleHpMult);

    const cap = Math.floor(
        playerMax * (fb.crucibleMaxHpPlayerMult + wave * 0.08) * waveScale +
        typicalHit * (fb.crucibleMaxHitBudget + wave * 2)
    );
    return Math.max(typicalHit * 3, Math.min(hp, cap));
}

function calcEnemyHp(template, options = {}) {
    const b = COMBAT_BALANCE;
    const ctx = options.context || 'normal';
    const wave = options.wave || 1;

    if (ctx === 'crucible') {
        return calcCrucibleEnemyHp(template, wave);
    }

    const power = getPlayerOffensivePower();
    const typicalHit = estimateTypicalHitDamage();

    let hp = template.hp;
    hp += Math.floor(G.maxHp * b.enemyHpFromPlayerMax);
    hp += Math.floor(power * b.enemyHpFromPlayerPower);
    hp = Math.max(hp, typicalHit * b.enemyMinHits);

    return hp;
}

function calcEnemyDamage(template, options = {}) {
    const b = COMBAT_BALANCE;
    const ctx = options.context || 'normal';
    const wave = options.wave || 1;
    const power = getPlayerOffensivePower();
    const realm = G.realmIdx;

    let dmg = template.dmg + realm * b.enemyDmgPerRealm;
    dmg += Math.floor(G.maxHp * b.enemyDmgFromPlayerMax);
    dmg += Math.floor(power * b.enemyDmgFromPlayerPower);

    if (ctx === 'crucible') {
        dmg += (wave - 1) * FORBIDDEN_BALANCE.crucibleDmgPerWave;
        dmg = Math.floor(dmg * FORBIDDEN_BALANCE.crucibleDmgMult);
        const pct = FORBIDDEN_BALANCE.crucibleMaxDmgPctPerHit || 0.09;
        dmg = Math.min(dmg, Math.max(5, Math.floor(G.maxHp * pct)));
    }

    return Math.max(3, dmg);
}

function calcBasicAttackDamage() {
    let dmg;
    let scale = COMBAT_BALANCE.basicAttackScale;
    if (G.path === 'soul') {
        const spirit = typeof getEffectiveSpiritFromScars === 'function' ? getEffectiveSpiritFromScars() : G.spirit;
        const will = typeof getEffectiveWillFromScars === 'function' ? getEffectiveWillFromScars() : G.will;
        dmg = Math.floor((will + spirit) / 2) + Math.floor(Math.random() * 6) + 3;
        scale = COMBAT_BALANCE.basicAttackScaleSoul;
    } else if (G.path === 'body') {
        const vit = typeof getBodyChamberEffectiveVitality === 'function' ? getBodyChamberEffectiveVitality() : G.vitality;
        dmg = Math.floor(vit * 1.5 + getQiDensity() * 0.3) + Math.floor(Math.random() * 5) + 3;
        dmg += getWeaponBasicAttackBonus();
        scale = COMBAT_BALANCE.basicAttackScaleBody;
    } else {
        const innate = Math.floor(getQiDensity() * 0.15 + G.will * 0.1) + Math.floor(Math.random() * 3) + 2;
        const hasIntent = typeof getActiveIntent === 'function' ? getActiveIntent() : G.weaponIntent;
        const intentPart = hasIntent ? Math.floor((8 + G.realmIdx * 2) * (1 + getIntentBonus())) : 0;
        dmg = innate + getWeaponBasicAttackBonus() + intentPart;
        scale = COMBAT_BALANCE.basicAttackScaleQi;
    }
    const activeIntent = typeof getActiveIntent === 'function' ? getActiveIntent() : G.weaponIntent;
    if (activeIntent && G.path !== 'qi') dmg = Math.floor(dmg * (1 + getIntentBonus()));
    if (G.dmgMult > 1) dmg = Math.floor(dmg * G.dmgMult);
    if (typeof getFactionCombatDmgMult === 'function') dmg = Math.floor(dmg * getFactionCombatDmgMult());
    if (typeof getGearDamageMult === 'function') dmg = Math.floor(dmg * getGearDamageMult());
    dmg = Math.max(1, Math.floor(dmg * scale));
    if (typeof getScarCombatDamageMult === 'function') dmg = Math.max(1, Math.floor(dmg * getScarCombatDamageMult()));
    if (typeof getBodyChamberCombatDmgMult === 'function') dmg = Math.max(1, Math.floor(dmg * getBodyChamberCombatDmgMult()));
    if (typeof getTranscendenceTechniqueDmgMult === 'function') dmg = Math.max(1, Math.floor(dmg * getTranscendenceTechniqueDmgMult(null)));
    if (typeof getMergedDaoEffects === 'function') {
        const mfx = getMergedDaoEffects();
        if (mfx.combatDmgPct) dmg = Math.max(1, Math.floor(dmg * (1 + mfx.combatDmgPct / 100)));
    }
    return dmg;
}

function calcCombatTechniqueDamage(tech) {
    const meta = getTechniqueMeta(tech);
    const tier = getTechniqueCombatTier(tech);
    let techScale = COMBAT_BALANCE.techniqueScale;
    if (meta.path === 'body' && tier === 'heavy') techScale = COMBAT_BALANCE.techniqueScaleBodyHeavy;
    let dmg = Math.max(1, Math.floor(getTechDamage(tech) * techScale));
    if (meta.category === 'defense' || meta.category === 'buff') {
        dmg = Math.max(1, Math.floor(dmg * COMBAT_BALANCE.techniqueDefenseDmgMult));
    }
    if (typeof getGearDamageMult === 'function') dmg = Math.max(1, Math.floor(dmg * getGearDamageMult()));
    if (typeof getWeaponTechniqueSynergyMult === 'function') dmg = Math.max(1, Math.floor(dmg * getWeaponTechniqueSynergyMult(tech)));
    if (typeof getIntentTechniqueSynergyBonus === 'function') {
        dmg = Math.max(1, Math.floor(dmg * (1 + getIntentTechniqueSynergyBonus(tech))));
    }
    if (typeof getFactionCombatDmgMult === 'function') dmg = Math.max(1, Math.floor(dmg * getFactionCombatDmgMult()));
    if (typeof getScarCombatDamageMult === 'function') dmg = Math.max(1, Math.floor(dmg * getScarCombatDamageMult()));
    if (typeof getBodyChamberCombatDmgMult === 'function') dmg = Math.max(1, Math.floor(dmg * getBodyChamberCombatDmgMult()));
    if (typeof getTranscendenceTechniqueDmgMult === 'function') dmg = Math.max(1, Math.floor(dmg * getTranscendenceTechniqueDmgMult(tech)));
    if (typeof getConsolidationTechniqueDmgMult === 'function') dmg = Math.max(1, Math.floor(dmg * getConsolidationTechniqueDmgMult()));
    if (typeof getSectCombatMult === 'function') dmg = Math.max(1, Math.floor(dmg * getSectCombatMult()));
    if (typeof getMergedDaoEffects === 'function') {
        const mfx = getMergedDaoEffects();
        if (mfx.combatDmgPct) dmg = Math.max(1, Math.floor(dmg * (1 + mfx.combatDmgPct / 100)));
    }
    if (typeof getBodyChamberTechniqueEfficiencyMult === 'function') {
        dmg = Math.max(1, Math.floor(dmg * getBodyChamberTechniqueEfficiencyMult()));
    }
    if (typeof getSoulChamberTechniqueEfficiencyMult === 'function') {
        dmg = Math.max(1, Math.floor(dmg * getSoulChamberTechniqueEfficiencyMult()));
    }
    if (typeof getBodyChamberTechniquePrecisionMult === 'function') {
        dmg = Math.max(1, Math.floor(dmg * getBodyChamberTechniquePrecisionMult()));
    }
    if (typeof getBodyChamberBloodTechniqueMult === 'function') {
        dmg = Math.max(1, Math.floor(dmg * getBodyChamberBloodTechniqueMult(tech)));
    }
    if (typeof applyBodyChamberPhysicalDmg === 'function') dmg = applyBodyChamberPhysicalDmg(dmg, tech);
    return dmg;
}

function logBodyChamberLifeSteal(dmg) {
    if (!dmg || dmg < 1 || typeof applyBodyChamberLifeSteal !== 'function') return;
    const healed = applyBodyChamberLifeSteal(dmg);
    if (healed > 0) addCombatLog(`🩸 Life steal restores ${healed} HP.`);
}

function rollPlayerCombatHit() {
    if (typeof rollScarAccuracyMiss === 'function' && rollScarAccuracyMiss()) {
        addCombatLog(`👁️ Haunted vision — your strike goes wide!`);
        return false;
    }
    return true;
}

function startCombat() {
    if (G.inCombat) return;
    const enemyTemplate = pickEnemyTemplate();
    const enemyHp = calcEnemyHp(enemyTemplate);
    const enemyDmg = calcEnemyDamage(enemyTemplate);
    G.enemy = {
        name: enemyTemplate.name,
        hp: enemyHp,
        maxHp: enemyHp,
        dmg: enemyDmg,
        originalDmg: enemyDmg,
        intimidateTurns: 0,
        skipTurns: 0,
        slowTurns: 0
    };
    G.enemyMaxHp = G.enemy.hp;
    G.inCombat = true;
    G.defending = false;
    G.fortifyActive = false;
    G.voidStepActive = false;
    G.combatLog = [];
    initCombatResource();
    if (typeof resetIntentCombatState === 'function') resetIntentCombatState();
    updateShield();
    if (G.path === 'soul') {
        G.shield = G.maxShield;
    }
    const cfg = getCombatConfig();
    addCombatLog(`⚔️ A ${G.enemy.name} appears! (${G.enemy.hp} HP, ${G.enemy.dmg} dmg)`);
    addCombatLog(`${cfg.icon} ${cfg.resource}: ${G.combatResource}/${G.maxCombatResource}`);
    if (getEffectiveFoundation() >= 20) {
        addCombatLog(`🌬️ Deep foundation — your dantian holds a wider combat reserve.`);
    }
    setupCombatActions();
    G.combatPhase = 'player';
    clearCombatTurnTimer();
    setCombatInputEnabled(true);
    updateCombatUI();
    document.getElementById('combatOverlay').classList.add('active');
}

function endCombat() {
    clearCombatTurnTimer();
    G.combatPhase = 'player';
    G.inCombat = false;
    G.defending = false;
    G.fortifyActive = false;
    G.mirrorTrial = false;
    G.crucibleTrial = false;
    G.silenceTrial = false;
    G.mawTrial = false;
    G.encounterCombat = null;
    G.npcCombat = null;
    document.getElementById('combatOverlay').classList.remove('active');
    const fleeBtn = document.getElementById('cbFlee');
    if (fleeBtn) {
        fleeBtn.disabled = false;
        fleeBtn.style.opacity = '';
    }
    if (G.gameOver) {
        addLog(`💀 You perished in combat. Your journey ends.`);
        fullRender();
        return;
    }
    addLog(`⚔️ Combat ended. ${G.enemy ? G.enemy.name : 'Enemy'} vanquished.`);
    G.enemy = null;
    if (typeof wearEquippedGear === 'function') wearEquippedGear();
    if (G.path === 'qi' || G.path === 'soul') {
        G.shield = Math.max(G.shield, Math.floor(G.maxShield * 0.5));
    }
    fullRender();
}

function canPlayerAct() {
    return G.inCombat && G.combatPhase === 'player' && G.enemy && !G.gameOver;
}

function clearCombatTurnTimer() {
    if (G.combatTurnTimer) {
        clearTimeout(G.combatTurnTimer);
        G.combatTurnTimer = null;
    }
}

function scheduleOpponentTurn() {
    G.combatPhase = 'enemy';
    setCombatInputEnabled(false);
    updateCombatUI();
    clearCombatTurnTimer();
    G.combatTurnTimer = setTimeout(() => {
        G.combatTurnTimer = null;
        if (!G.inCombat || !G.enemy) return;
        opponentTurn();
        if (G.inCombat && !G.gameOver) {
            G.combatPhase = 'player';
            setCombatInputEnabled(true);
            updateCombatUI();
            fullRender();
        }
    }, COMBAT_BALANCE.enemyTurnDelayMs);
}

function resolveEnemyStrike(enemyName, dmgAfterMods, opts) {
    opts = opts || {};
    const breakdown = {
        enemyName,
        raw: opts.displayRaw != null ? opts.displayRaw : dmgAfterMods,
        intimidateReduced: opts.intimidateReduced || 0,
        afterModifiers: dmgAfterMods,
        stance: null,
        stanceBlocked: 0,
        physiqueReduced: 0,
        evaded: false,
        barrierAbsorbed: 0,
        hpDamage: 0,
        barrierLabel: getBarrierLabel()
    };

    const beforeStance = breakdown.afterModifiers;
    if (G.defending) {
        if (G.fortifyActive) {
            breakdown.stance = 'fortify';
            breakdown.afterModifiers = Math.floor(breakdown.afterModifiers * 0.2);
        } else {
            breakdown.stance = 'defend';
            breakdown.afterModifiers = Math.floor(breakdown.afterModifiers * 0.3);
        }
        breakdown.stanceBlocked = beforeStance - breakdown.afterModifiers;
        G.defending = false;
        G.fortifyActive = false;
    }

    const result = takeDamage(breakdown.afterModifiers);
    breakdown.evaded = result.evaded;
    breakdown.physiqueReduced = result.physiqueReduced || 0;
    breakdown.barrierAbsorbed = result.barrierAbsorbed || 0;
    breakdown.hpDamage = result.hpDamage || 0;

    logIncomingHit(breakdown);
    return breakdown;
}

function setupCombatActions() {
    const secondaryBtn = document.getElementById('cbSecondary');
    if (!secondaryBtn) return;
    const cfg = getCombatConfig();
    secondaryBtn.textContent = cfg.secondaryLabel;
    secondaryBtn.className = 'combat-btn btn-secondary path-' + G.path;
    updateVoidStepButton();
}

function updateVoidStepButton() {
    const btn = document.getElementById('cbVoidStep');
    if (!btn) return;
    const show = G.inCombat && typeof hasTranscendenceFlag === 'function' && hasTranscendenceFlag('voidStep');
    btn.classList.toggle('hidden', !show);
    btn.disabled = !show || G.combatPhase !== 'player';
}

function combatVoidStep() {
    if (!canPlayerAct() || !hasTranscendenceFlag('voidStep')) return;
    const cost = getCombatConfig().costs.special;
    if (!spendCombatResource(cost, 'Void Step')) return;
    if (!combatSpendRound()) return;
    G.voidStepActive = true;
    addCombatLog(`🌑 Void Step — you fold into the gap between heartbeats.`);
    trackMirrorAction('secondary');
    if (typeof trackSilenceCombatAction === 'function' && trackSilenceCombatAction('void')) return;
    updateCombatUI();
    scheduleOpponentTurn();
}

function combatSpendRound() {
    return true;
}

function combatAttack() {
    if (!canPlayerAct()) return;
    let cost = getCombatConfig().costs.attack;
    if (typeof getIntentBasicAttackCostDiscount === 'function') {
        cost = Math.max(1, cost - getIntentBasicAttackCostDiscount());
    }
    if (!spendCombatResource(cost, 'Attack')) return;
    if (!combatSpendRound()) return;
    if (!rollPlayerCombatHit()) {
        scheduleOpponentTurn();
        return;
    }

    let dmg = calcBasicAttackDamage();
    const intentFx = typeof applyIntentArtsOnBasicAttack === 'function'
        ? applyIntentArtsOnBasicAttack(dmg) : { dmg, extraDmg: 0, logs: [], resourceGain: 0 };
    dmg = intentFx.dmg;

    if (G.path === 'soul') {
        addCombatLog(`🧠 Soul Strike! ${dmg} damage (ignores block).`);
    } else if (G.path === 'body') {
        addCombatLog(`💪 Crushing blow! ${dmg} damage.`);
    } else {
        addCombatLog(`⚡ Qi blast! ${dmg} damage.`);
    }
    intentFx.logs.forEach(line => addCombatLog(line));

    if (G.defending) {
        dmg = Math.floor(dmg * 0.6);
        G.defending = false;
    }
    if (G.enemy.defending) {
        const defendMult = typeof getBasicDefendDamageMult === 'function' ? getBasicDefendDamageMult() : 0.45;
        dmg = intentFx.ignoreDefend ? dmg : Math.floor(dmg * defendMult);
        G.enemy.defending = false;
        addCombatLog(intentFx.ignoreDefend
            ? `🗡️ Your intent pierces the guard!`
            : `🪞 Your strike meets the reflection's guard.`);
    }

    trackMirrorAction('attack');
    if (typeof trackSilenceCombatAction === 'function' && trackSilenceCombatAction('attack')) return;
    G.enemy.hp -= applyMirrorDamageToReflection(dmg);
    if (intentFx.extraDmg > 0) {
        G.enemy.hp -= applyMirrorDamageToReflection(intentFx.extraDmg);
        addCombatLog(`⚔️ Follow-up strike! ${intentFx.extraDmg} damage.`);
    }
    logBodyChamberLifeSteal(dmg + (intentFx.extraDmg || 0));
    if (intentFx.resourceGain > 0 && typeof applyIntentResourceGain === 'function') {
        applyIntentResourceGain(intentFx.resourceGain);
    }
    if (G.enemy.hp <= 0) {
        if (typeof useWeaponIntent === 'function') useWeaponIntent();
        combatVictory(false);
        return;
    }
    if (typeof useWeaponIntent === 'function') useWeaponIntent();
    scheduleOpponentTurn();
}

function combatDefend() {
    if (!canPlayerAct() || G.path !== 'qi') return;
    const cost = getCombatConfig().costs.defend;
    if (!spendCombatResource(cost, 'Defend')) return;
    if (!combatSpendRound()) return;
    G.defending = true;
    G.fortifyActive = false;
    addCombatLog(`🛡️ You channel Breath into your Qi Barrier stance.`);
    trackMirrorAction('secondary');
    if (typeof trackSilenceCombatAction === 'function' && trackSilenceCombatAction('secondary')) return;
    updateCombatUI();
    scheduleOpponentTurn();
}

function combatFortify() {
    if (!canPlayerAct() || G.path !== 'body') return;
    const cost = getCombatConfig().costs.special;
    if (!spendCombatResource(cost, 'Fortify')) return;
    if (!combatSpendRound()) return;
    G.defending = true;
    G.fortifyActive = true;
    addCombatLog(`💪 You fortify your flesh — damage greatly reduced this turn!`);
    trackMirrorAction('secondary');
    if (typeof trackSilenceCombatAction === 'function' && trackSilenceCombatAction('secondary')) return;
    updateCombatUI();
    scheduleOpponentTurn();
}

function combatIntimidate() {
    if (!canPlayerAct() || G.path !== 'soul') return;
    const cost = getCombatConfig().costs.special;
    if (!spendCombatResource(cost, 'Intimidate')) return;
    if (!combatSpendRound()) return;
    G.enemy.intimidateTurns = 2;
    addCombatLog(`👁️ Your spirit pressure unnerves ${G.enemy.name}! Their attacks weaken for 2 turns.`);
    trackMirrorAction('secondary');
    if (typeof trackSilenceCombatAction === 'function' && trackSilenceCombatAction('intimidate')) return;
    updateCombatUI();
    scheduleOpponentTurn();
}

function combatSecondary() {
    const cfg = getCombatConfig();
    if (cfg.secondaryAction === 'defend') combatDefend();
    else if (cfg.secondaryAction === 'fortify') combatFortify();
    else if (cfg.secondaryAction === 'intimidate') combatIntimidate();
}

function combatSkill() {
    if (!canPlayerAct()) return;
    renderTechPopup();
    document.getElementById('techPopup').classList.add('active');
}

function applyTrueDaoEffectsToEnemy(fx) {
    if (!G.enemy || !fx) return;
    if (fx.skipTurns) G.enemy.skipTurns = (G.enemy.skipTurns || 0) + fx.skipTurns;
    if (fx.slowTurns) G.enemy.slowTurns = (G.enemy.slowTurns || 0) + fx.slowTurns;
    if (fx.root) G.enemy.defending = true;
}

function executeCombatTechnique(tech) {
    tech.uses = (tech.uses || 0) + 1;
    if (!G.sectTechs.includes(tech.name) && tech.uses >= 3) {
        G.sectTechs.push(tech.name);
        addCombatLog(`🏯 ${tech.name} added to sect technique hall!`);
    }
    if (typeof useWeaponIntent === 'function') useWeaponIntent();
    const dmg = calcCombatTechniqueDamage(tech);
    const ignite = rollFireIgniteBonus(tech);
    const daoFx = typeof rollTrueDaoCombatEffects === 'function' ? rollTrueDaoCombatEffects(tech) : { bonusDmg: 0, log: '' };
    applyTrueDaoEffectsToEnemy(daoFx);
    grantTechniqueAffinity(tech, addCombatLog);
    const tier = getTechniqueTier(tech.uses);
    return { damage: dmg, tier: tier.name, igniteBonus: ignite, daoFx };
}

function combatUseTechnique(name) {
    document.getElementById('techPopup').classList.remove('active');
    if (!canPlayerAct()) return;
    const tech = getTechniqueByName(name);
    if (!tech) return;

    const cost = getTechniqueCombatCost(tech);
    if (!spendCombatResource(cost, tech.name)) return;
    if (!combatSpendRound()) return;
    if (!rollPlayerCombatHit()) {
        scheduleOpponentTurn();
        return;
    }

    const result = executeCombatTechnique(tech);
    const meta = getTechniqueMeta(tech);
    let dmg = applyMirrorDamageToReflection(result.damage);
    if (result.igniteBonus) {
        dmg += result.igniteBonus;
        addCombatLog(`🔥 Fire Affinity ignites! +${result.igniteBonus} bonus damage!`);
    }
    if (result.daoFx?.bonusDmg) {
        dmg += result.daoFx.bonusDmg;
    }
    if (result.daoFx?.log) addCombatLog(result.daoFx.log + (result.daoFx.bonusDmg ? ` +${result.daoFx.bonusDmg} damage!` : ''));
    if (meta.category === 'defense') {
        G.defending = true;
        G.fortifyActive = meta.path === 'body' || G.path === 'body';
        addCombatLog(`🛡️ ${name} — your guard hardens for the next blow.`);
    }
    if (G.enemy.defending && tech.name !== 'Mirror Step') {
        dmg = Math.floor(dmg * 0.45);
        G.enemy.defending = false;
        addCombatLog(`🪞 Your technique glances off the reflection's guard.`);
    } else if (G.enemy.defending && tech.name === 'Mirror Step') {
        G.enemy.defending = false;
        addCombatLog(`🪞 Mirror Step passes through the reflection's guard!`);
    }
    trackMirrorAction('technique');
    if (typeof trackSilenceCombatAction === 'function' && trackSilenceCombatAction('technique')) return;
    G.enemy.hp -= dmg;
    const tierLabel = TECHNIQUE_COMBAT_TIERS[getTechniqueCombatTier(tech)]?.label || result.tier;
    if (dmg > 0) {
        addCombatLog(`🌀 ${name} [${result.tier}]! ${dmg} damage!`);
    } else if (meta.category !== 'defense') {
        addCombatLog(`🌀 ${name} [${tierLabel}]!`);
    }
    if (tech.name === 'Blood Refining Art' && dmg > 0) {
        const heal = Math.max(1, Math.floor(dmg * 0.22));
        const hpCap = typeof getEffectiveMaxHp === 'function' ? getEffectiveMaxHp() : G.maxHp;
        const hpBefore = G.hp;
        G.hp = Math.min(hpCap, G.hp + heal);
        if (G.hp > hpBefore) addCombatLog(`🩸 Blood Refining restores ${G.hp - hpBefore} HP.`);
    }
    logBodyChamberLifeSteal(dmg);

    if (G.enemy.hp <= 0) {
        combatVictory(true);
        return;
    }
    scheduleOpponentTurn();
}

function combatFlee() {
    if (!canPlayerAct()) {
        addCombatLog('⏳ Wait for your turn to act.');
        return;
    }
    const blocked = isFleeBlocked();
    if (blocked) {
        addCombatLog(`🏃 ${blocked}`);
        return;
    }
    if (typeof isStoryCombat === 'function' && isStoryCombat()) {
        const cost = getCombatConfig().costs.flee;
        if (!spendCombatResource(cost, 'Flee')) return;
        if (!combatSpendRound()) return;
        addCombatLog(`🏃 You retreat from the corrupted master — prepare and return.`);
        if (typeof storyCombatDefeat === 'function') storyCombatDefeat();
        return;
    }
    if (typeof isNpcCombat === 'function' && isNpcCombat()) {
        const ctx = G.npcCombat;
        if (ctx?.type === 'demonic') {
            addCombatLog(`😈 A Demonic Talent's gaze pins you — fleeing is nearly impossible.`);
            if (Math.random() > 0.12) {
                addCombatLog(`😰 Failed to flee! Their killing intent locks your legs.`);
                scheduleOpponentTurn();
                return;
            }
        }
        const cost = getCombatConfig().costs.flee;
        if (!spendCombatResource(cost, 'Flee')) return;
        if (!combatSpendRound()) return;
        const chance = getCombatFleeChance(ctx);
        addCombatLog(`🏃 You break for open ground... (${chance}% chance)`);
        if (Math.random() * 100 < chance) {
            if (typeof npcCombatFleeSuccess === 'function') npcCombatFleeSuccess();
            else endCombat();
        } else {
            refundFailedFleeCost(cost);
            addCombatLog(`😰 Failed to flee! Your opponent cuts off the retreat.`);
            scheduleOpponentTurn();
        }
        return;
    }
    if (typeof isFactionHuntCombat === 'function' && isFactionHuntCombat()) {
        addCombatLog(`🎯 Sect enforcers hem you in — flight is nearly impossible!`);
        if (Math.random() > 0.15) {
            addCombatLog(`😰 Failed to flee!`);
            scheduleOpponentTurn();
            return;
        }
        exploitHuntCombatDefeat();
        return;
    }
    const cfg = getCombatConfig();
    const cost = cfg.costs.flee;
    if (!spendCombatResource(cost, 'Flee')) return;
    if (!combatSpendRound()) return;

    const chance = getCombatFleeChance();
    addCombatLog(`🏃 You break for open ground... (${chance}% chance)`);
    if (Math.random() * 100 < chance) {
        addCombatLog(`🏃 You escape!`);
        if (G.fame > 0) G.fame -= 1;
        endCombat();
    } else {
        refundFailedFleeCost(cost);
        addCombatLog(`😰 Failed to flee! ${G.enemy?.name || 'The enemy'} cuts off your retreat.`);
        scheduleOpponentTurn();
    }
}

function refundFailedFleeCost(cost) {
    const cfg = getCombatConfig();
    const pct = COMBAT_FLEE_BALANCE?.failRefundPct || 0.4;
    const refund = Math.max(1, Math.floor(cost * pct));
    const before = G.combatResource;
    G.combatResource = Math.min(G.maxCombatResource, G.combatResource + refund);
    if (G.combatResource > before) {
        addCombatLog(`${cfg.icon} ${refund} ${cfg.resource} recovered in the scramble.`);
    }
}

function opponentTurn() {
    if (typeof isMirrorTrial === 'function' && isMirrorTrial()) mirrorOpponentTurn();
    else enemyTurn();
}

function combatVictory(fromTechnique) {
    if (typeof isMirrorTrial === 'function' && isMirrorTrial()) {
        forbiddenMirrorVictory();
        return;
    }
    if (typeof isCrucibleTrial === 'function' && isCrucibleTrial()) {
        crucibleWaveCleared(fromTechnique);
        return;
    }
    if (typeof isSilenceTrial === 'function' && isSilenceTrial()) {
        forbiddenSilenceVictory();
        return;
    }
    if (typeof isMawTrial === 'function' && isMawTrial()) {
        forbiddenMawVictory();
        return;
    }
    if (typeof isEncounterCombat === 'function' && isEncounterCombat()) {
        encounterCombatVictory();
        return;
    }
    if (typeof isAncientGuardianCombat === 'function' && isAncientGuardianCombat()) {
        ancientGuardianVictory();
        return;
    }
    if (typeof isStoryCombat === 'function' && isStoryCombat()) {
        storyCombatVictory(fromTechnique);
        return;
    }
    if (typeof isNpcCombat === 'function' && isNpcCombat()) {
        npcCombatVictory(fromTechnique);
        if (typeof tryCompleteSectQuests === 'function') tryCompleteSectQuests('combat');
        if (typeof onCombatForFactions === 'function') onCombatForFactions();
        return;
    }
    if (typeof isFactionHuntCombat === 'function' && isFactionHuntCombat()) {
        exploitHuntCombatVictory();
        return;
    }
    if (typeof isTribulationCombat === 'function' && isTribulationCombat()) {
        tribulationCombatVictory();
        return;
    }
    G.enemy.hp = 0;
    const enemyName = G.enemy?.name || 'Enemy';
    addCombatLog(`💀 ${enemyName} is ${fromTechnique ? 'obliterated' : 'slain'}!`);
    const reward = (fromTechnique ? 15 : 10) + Math.floor(Math.random() * (fromTechnique ? 20 : 15)) + G.realmIdx * 2;
    const fameGain = (fromTechnique ? 3 : 2) + Math.floor(G.realmIdx / 2);
    const foundationGain = fromTechnique ? 3 : 2;
    G.stones += reward;
    const fameAdded = typeof addFame === 'function' ? addFame(fameGain) : (G.fame += fameGain, fameGain);
    G.foundation += foundationGain;
    addCombatLog(`💎 +${reward} Stones, +${fameAdded} Fame, +${foundationGain} Foundation`);
    if (typeof applyTrainingGroundCombatXp === 'function') {
        const uses = applyTrainingGroundCombatXp();
        if (uses > 0) addCombatLog(`⚔️ Training Ground drills — techniques +${uses} mastery.`);
    }
    if (typeof tryCompleteSectQuests === 'function') tryCompleteSectQuests('combat');
    if (typeof onCombatForFactions === 'function') onCombatForFactions();
    if (typeof showCombatVictoryPopup === 'function') {
        const lines = [
            `💎 +${reward} Spirit Stones`,
            `⭐ +${fameAdded} Fame`,
            `🏛️ +${foundationGain} Foundation`
        ];
        if (fromTechnique) lines.push('📜 Technique mastery +1 use');
        showCombatVictoryPopup({
            enemyName,
            subtitle: fromTechnique ? 'Your technique ended the fight decisively.' : 'Your strikes carried the day.',
            rewards: lines
        });
    }
    endCombat();
}

function enemyTurn() {
    if (!G.inCombat || !G.enemy) return;
    if (G.enemy.hp <= 0) {
        combatVictory(false);
        return;
    }

    if (G.enemy.skipTurns > 0) {
        G.enemy.skipTurns--;
        addCombatLog(`❄️ ${G.enemy.name} is bound by True Dao — they cannot act!`, 'entry-mod');
        combatEndOfTurnRegen();
        updateCombatUI();
        return;
    }

    const rawDmg = G.enemy.dmg + Math.floor(Math.random() * 4);
    let afterIntimidate = rawDmg;
    let intimidateReduced = 0;
    if (G.enemy.intimidateTurns > 0) {
        const reduction = 0.25 + Math.min(0.25, G.will * 0.01);
        afterIntimidate = Math.floor(rawDmg * (1 - reduction));
        intimidateReduced = rawDmg - afterIntimidate;
    }
    if (G.enemy.slowTurns > 0) {
        const slowReduced = Math.floor(afterIntimidate * 0.3);
        afterIntimidate -= slowReduced;
        intimidateReduced += slowReduced;
    }

    resolveEnemyStrike(G.enemy.name, afterIntimidate, { intimidateReduced, displayRaw: rawDmg });

    if (G.enemy.intimidateTurns > 0) {
        G.enemy.intimidateTurns--;
        if (G.enemy.intimidateTurns === 0) {
            addCombatLog(`👁️ ${G.enemy.name} shakes off your intimidation.`, 'entry-mod');
        }
    }
    if (G.enemy.slowTurns > 0) {
        G.enemy.slowTurns--;
        if (G.enemy.slowTurns === 0) {
            addCombatLog(`🌪️ ${G.enemy.name} breaks free of the wind's drag.`, 'entry-mod');
        }
    }

    if (G.hp <= 0) {
        if (typeof isMirrorTrial === 'function' && isMirrorTrial()) {
            forbiddenMirrorDefeat();
            return;
        }
        if (typeof isCrucibleTrial === 'function' && isCrucibleTrial()) {
            forbiddenCrucibleDefeat();
            return;
        }
        if (typeof isSilenceTrial === 'function' && isSilenceTrial()) {
            forbiddenSilenceDefeat();
            return;
        }
        if (typeof isMawTrial === 'function' && isMawTrial()) {
            forbiddenMawDefeat();
            return;
        }
        if (typeof isEncounterCombat === 'function' && isEncounterCombat()) {
            encounterCombatDefeat();
            return;
        }
        if (typeof isAncientGuardianCombat === 'function' && isAncientGuardianCombat()) {
            ancientGuardianDefeat();
            return;
        }
        if (typeof isStoryCombat === 'function' && isStoryCombat()) {
            storyCombatDefeat();
            return;
        }
        if (typeof isNpcCombat === 'function' && isNpcCombat()) {
            npcCombatDefeat();
            return;
        }
        if (typeof isFactionHuntCombat === 'function' && isFactionHuntCombat()) {
            exploitHuntCombatDefeat();
            return;
        }
        if (typeof isTribulationCombat === 'function' && isTribulationCombat()) {
            tribulationCombatDefeat();
            return;
        }
        G.hp = 0;
        addCombatLog(`💀 You have been defeated...`, 'entry-hp');
        G.gameOver = true;
        endCombat();
        return;
    }

    combatEndOfTurnRegen();
    updateCombatUI();
}

function takeDamage(dmg) {
    let physiqueReduced = 0;
    const defensePct = (G.defenseBonus || 0)
        + (typeof getGearDefenseBonus === 'function' ? getGearDefenseBonus() : 0)
        + (typeof getScarDefenseBonus === 'function' ? getScarDefenseBonus() : 0)
        + (typeof getTranscendenceDefenseBonus === 'function' ? getTranscendenceDefenseBonus() : 0)
        + (typeof getBodyChamberDefensePct === 'function' ? getBodyChamberDefensePct() : 0);
    if (defensePct) {
        const after = Math.max(1, Math.floor(dmg * (1 - defensePct / 100)));
        physiqueReduced = dmg - after;
        dmg = after;
    }
    const elemResist = typeof getBodyChamberElementalResistPct === 'function' ? getBodyChamberElementalResistPct() : 0;
    if (elemResist) {
        dmg = Math.max(1, Math.floor(dmg * (1 - elemResist / 100)));
    }
    const poisonResist = typeof getBodyChamberPoisonResistPct === 'function' ? getBodyChamberPoisonResistPct() : 0;
    if (poisonResist && typeof isPoisonSourceEnemy === 'function' && isPoisonSourceEnemy(G.enemy)) {
        dmg = Math.max(1, Math.floor(dmg * (1 - poisonResist / 100)));
    }
    const evasionPct = (G.evasionBonus || 0)
        + (typeof getScarEvasionBonus === 'function' ? getScarEvasionBonus() : 0)
        + (typeof getBodyChamberEvasionBonus === 'function' ? getBodyChamberEvasionBonus() : 0);
    if (evasionPct && Math.random() * 100 < evasionPct) {
        return { evaded: true, hpDamage: 0, barrierAbsorbed: 0, physiqueReduced };
    }
    if (G.enemy?.isTribulation) {
        let mentalMult = 1;
        if (typeof getScarMentalResistMult === 'function') mentalMult = getScarMentalResistMult();
        const bodyFear = typeof getBodyChamberFearResistPct === 'function' ? getBodyChamberFearResistPct() : 0;
        const soulFear = typeof getSoulChamberFearResistPct === 'function' ? getSoulChamberFearResistPct() : 0;
        const fearResist = bodyFear + soulFear;
        if (fearResist) mentalMult += fearResist / 100;
        if (mentalMult > 1) dmg = Math.max(1, Math.floor(dmg / mentalMult));
    }
    if (typeof getTranscendenceDamageTakenMult === 'function') {
        dmg = Math.max(1, Math.floor(dmg * getTranscendenceDamageTakenMult()));
    }

    if (G.voidStepActive) {
        G.voidStepActive = false;
        return { evaded: true, hpDamage: 0, barrierAbsorbed: 0, physiqueReduced };
    }

    let barrierAbsorbed = 0;
    const hpBefore = G.hp;

    if ((G.path === 'qi' || G.path === 'soul') && G.shield > 0) {
        barrierAbsorbed = Math.min(G.shield, dmg);
        G.shield -= barrierAbsorbed;
        dmg -= barrierAbsorbed;
    }

    G.hp -= Math.max(0, dmg);
    if (G.hp < 0) G.hp = 0;
    updateShield();

    return {
        evaded: false,
        hpDamage: hpBefore - G.hp,
        barrierAbsorbed,
        physiqueReduced
    };
}

function combatEndOfTurnRegen() {
    const cfg = getCombatConfig();
    const resGain = getCombatResourceRegenGain();
    const before = G.combatResource;
    G.combatResource = Math.min(G.maxCombatResource, G.combatResource + resGain);
    const gained = G.combatResource - before;
    if (gained > 0) {
        const flavor = G.path === 'qi' ? 'Qi circulation steadies' : G.path === 'body' ? 'Breath returns to tired limbs' : 'Focus sharpens anew';
        addCombatLog(`${cfg.icon} ${flavor} — +${gained} ${cfg.resource}.`);
    }

    if (G.path === 'body') {
        const vit = typeof getBodyChamberEffectiveVitality === 'function' ? getBodyChamberEffectiveVitality() : G.vitality;
        let hpGain = Math.floor(vit / 3) + G.realmIdx;
        if (G.regenBonus) hpGain += Math.floor(G.regenBonus / 10);
        if (typeof getGearBonuses === 'function') hpGain += getGearBonuses().hpRegenBonus || 0;
        if (typeof getScarHpRegenMult === 'function') hpGain = Math.floor(hpGain * getScarHpRegenMult());
        if (typeof getBodyChamberHpRegenMult === 'function') hpGain = Math.floor(hpGain * getBodyChamberHpRegenMult());
        const hpCap = typeof getEffectiveMaxHp === 'function' ? getEffectiveMaxHp()
            : (typeof getEffectiveMaxHpFromScars === 'function' ? getEffectiveMaxHpFromScars() : G.maxHp);
        const hpBefore = G.hp;
        G.hp = Math.min(hpCap, G.hp + hpGain);
        const healed = G.hp - hpBefore;
        if (healed > 0) {
            addCombatLog(`💪 Body regenerates ${healed} HP.`);
        }
    }

    if (G.path === 'soul') {
        const shieldGain = Math.floor(G.will / 4) + 1 + Math.floor(G.realmIdx / 2);
        const shieldBefore = G.shield;
        G.shield = Math.min(G.maxShield, G.shield + shieldGain);
        const recharged = G.shield - shieldBefore;
        if (recharged > 0) {
            addCombatLog(`🧠 Soul Shield recharges +${recharged}.`);
        }
    }
}
