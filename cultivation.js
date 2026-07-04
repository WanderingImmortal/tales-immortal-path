// ============================================
// CULTIVATION.JS — Breakthroughs, Meridians, Physiques, Intent
// ============================================

// ===== SHIELD =====
function updateShield() {
    if (G.path === "qi") {
        G.maxShield = Math.floor(getMaxQi() * 1.5) + G.realmIdx * 3;
        G.shield = Math.min(G.shield, G.maxShield);
    } else if (G.path === "soul") {
        G.maxShield = Math.floor(G.will * 1.2) + G.realmIdx * 2;
        G.shield = Math.min(G.shield, G.maxShield);
    } else {
        G.maxShield = 0;
        G.shield = 0;
    }
}

// ===== BREAKTHROUGH =====
function openBreakthrough() {
    if (G.gameOver || G.inCombat || isTribulationActive() || (typeof isTranscendencePerkPending === 'function' && isTranscendencePerkPending())) return;
    const next = getNextRealm();
    if (next === "MAX") {
        addLog(`🏆 You are already at the peak! Immortality is yours!`);
        fullRender();
        return;
    }
    if (typeof canBreakthroughToNextRealm === 'function' && !canBreakthroughToNextRealm()) {
        addLog(`🚫 ${getConsolidationBlockReason()}`);
        fullRender();
        return;
    }
    const visions = PATHS[G.path].visions;
    const vision = visions[G.realmIdx % visions.length] || visions[0];
    document.getElementById('visionText').textContent = '"' + vision + '"';
    document.getElementById('foundationInfo').textContent = (() => {
        const preview = typeof getPerfectBreakthroughPreview === 'function'
            ? getPerfectBreakthroughPreview(3)
            : null;
        const marginText = preview
            ? `Perfect margin ${preview.requiredMargin} · Foundation salvage ≤${preview.salvageMax}%`
            : `Perfect: roll within ${TRANSCENDENCE_BALANCE.perfectMargin} of your chance`;
        const alignText = typeof getDaoAlignmentBreakModifierLabel === 'function'
            ? getDaoAlignmentBreakModifierLabel()
            : '';
        const tierCompare = typeof getBreakthroughTierComparison === 'function'
            ? getBreakthroughTierComparison()
            : null;
        const tierLine = tierCompare && typeof getConsolidationTier === 'function'
            ? (() => {
                const sealTier = getConsolidationTier(G.realmIdx) || tierCompare.tier;
                const scale = typeof getBreakthroughTierScale === 'function'
                    ? getBreakthroughTierScale(sealTier)
                    : null;
                const lifePreview = typeof getBreakthroughLifespanPreview === 'function'
                    ? getBreakthroughLifespanPreview(G.realmIdx, sealTier)
                    : null;
                const parts = [`Seal tier: ${scale?.label || sealTier}`];
                if (lifePreview) {
                    parts.push(`Lifespan gain: +${lifePreview.gainedYears}y`);
                    if (sealTier === 'settled' && lifePreview.peakGainedYears > lifePreview.gainedYears) {
                        parts.push(`(Peak would be +${lifePreview.peakGainedYears}y)`);
                    }
                }
                if (scale?.breakChancePenalty) parts.push(`${scale.breakChancePenalty}% break chance`);
                return parts.join(' · ');
            })()
            : '';
        return `Foundation: ${G.foundation} | Chance: ${Math.round(getBreakChance())}%${alignText ? ' (' + alignText + ')' : ''} | ${typeof getConsolidationStatusLabel === 'function' ? getConsolidationStatusLabel() : ''} | Attempts: ${G.breakAttempts} | Meridians: ${getMeridianOpenCount()}/13 | Age: ${formatYears(G.ageMonths)} | ${isImmortal() ? 'Immortal' : getYearsRemaining() + ' years left'} | ${marginText}${tierLine ? ' | ' + tierLine : ''}`;
    })();
    document.getElementById('breakthroughPopup').classList.add('active');
    if (typeof triggerTutorial === 'function') triggerTutorial('first_breakthrough');
}

function closeBreakthrough() {
    document.getElementById('breakthroughPopup').classList.remove('active');
}

function executeBreakthrough(style) {
    if (typeof canBreakthroughToNextRealm === 'function' && !canBreakthroughToNextRealm()) {
        addLog(`🚫 ${getConsolidationBlockReason()}`);
        closeBreakthrough();
        fullRender();
        return;
    }
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.breakthrough, "Breakthrough seclusion")) { cancelActionLog(); closeBreakthrough(); fullRender(); return; }
    const chance = getBreakChance();
    let bonus = 0;
    if (style === 'balanced') bonus = 3;
    else if (style === 'power') bonus = 8;
    else if (style === 'wisdom') bonus = 8;
    const sealTier = typeof getConsolidationTier === 'function' ? getConsolidationTier(G.realmIdx) : 'peak';
    const tierPenalty = typeof getBreakthroughTierScale === 'function'
        ? getBreakthroughTierScale(sealTier).breakChancePenalty
        : 0;
    const finalChance = clamp(chance + bonus + tierPenalty, 10, 95);
    const roll = Math.random() * 100;
    const naturalSuccess = roll < finalChance;
    let success = naturalSuccess;
    const foundationStabilized = !naturalSuccess
        && G.foundation > 10
        && Math.random() * 100 < Math.min(15, Math.floor(G.foundation / 2));
    if (foundationStabilized) success = true;
    if (G.perfectCultivation && Math.random() * 100 < 30) success = true;
    const perfectBreak = typeof rollPerfectBreakthrough === 'function'
        && rollPerfectBreakthrough(roll, finalChance, naturalSuccess, foundationStabilized);
    if (success) {
        const prevUnlocks = typeof captureActionUnlockSnapshot === 'function'
            ? captureActionUnlockSnapshot()
            : null;
        G.realmIdx++;
        G.breakAttempts = 0;
        G.realmPeakGrindBoost = 0;
        G.maxQiBonus = (G.maxQiBonus || 0) + QI_BALANCE.breakthroughMaxQi + Math.floor(G.realmIdx / 2);
        G.qi = getMaxQi();
        clampCurrentQi();
        const boost = 3 + Math.floor(Math.random() * 6) + (style === 'power' ? 3 : 0) + (style === 'wisdom' ? 2 : 0);
        G.vitality += Math.floor(boost / 2) + (style === 'power' ? 2 : 0);
        G.spirit += Math.floor(boost / 3) + (style === 'wisdom' ? 3 : 0);
        G.will += Math.floor(boost / 3) + (style === 'wisdom' ? 2 : 0);
        G.maxHp += 10 + G.realmIdx * 2 + (style === 'power' ? 5 : 0);
        applyVitalityToMaxHp();
        G.hp = G.maxHp;
        if (typeof addFame === 'function') addFame(5 + G.realmIdx);
        else G.fame += 5 + G.realmIdx;
        extendLifespanOnBreakthrough(sealTier);
        commitActionLog(`✨ SUCCESS! You are now a ${getRealm()} (${getTitle()})!`);
        if (typeof notifyActionUnlocks === 'function' && prevUnlocks) {
            notifyActionUnlocks(prevUnlocks);
            if (typeof initActionUnlockSnapshot === 'function') initActionUnlockSnapshot();
        }
        if (perfectBreak) addLog(`🌟 The breakthrough was flawless — your Foundation drew the heavens' attention.`);
        addLog(`📈 Max Qi → ${getMaxQi()}, +${Math.floor(boost/2)+(style==='power'?2:0)} Vit, +${Math.floor(boost/3)+(style==='wisdom'?3:0)} Spi/Will.`);
        closeBreakthrough();
        if (perfectBreak && typeof canOfferTranscendencePerks === 'function' && canOfferTranscendencePerks(G.realmIdx)) {
            offerTranscendencePerkChoice(G.realmIdx, style);
            return;
        }
        if (shouldTriggerTribulation()) {
            if (typeof beginTribulationWithTutorial === 'function') {
                beginTribulationWithTutorial(style);
            } else {
                startTribulation(style);
            }
            return;
        }
        checkPerfectCultivation();
    } else {
        G.breakAttempts++;
        const rawDmg = 5 + Math.floor(Math.random() * 15) + (style === 'power' ? 5 : 0) + (style === 'wisdom' ? 5 : 0);
        const dmg = typeof scaleStatDebuff === 'function' ? scaleStatDebuff(rawDmg) : rawDmg;
        G.qi = Math.max(1, G.qi - Math.floor(dmg / 3));
        G.vitality = Math.max(1, G.vitality - Math.floor(dmg / 3));
        G.spirit = Math.max(1, G.spirit - Math.floor(dmg / 3));
        G.will = Math.max(1, G.will - Math.floor(dmg / 3));
        G.hp = Math.max(1, G.hp - Math.floor(dmg / 2));
        commitActionLog(`💥 FAILED! The heavens reject you. -${dmg} damage.`);
        G.foundation = Math.max(0, G.foundation - (typeof scaleStatDebuff === 'function' ? Math.max(1, scaleStatDebuff(2)) : 2));
    }
    closeBreakthrough();
    fullRender();
}

function checkPerfectCultivation() {
    const openCount = G.meridians.filter(m => m).length;
    const hasIntent = typeof getActiveIntent === 'function' ? getActiveIntent() : G.weaponIntent;
    if (openCount === 13 && G.physique && G.physique.type === "legendary" && hasIntent && G.trueDaos.length > 0) {
        G.perfectCultivation = true;
        if (typeof addFame === 'function') addFame(50);
        else G.fame += 50;
        addLog(`🏆 PERFECT CULTIVATION ACHIEVED! You are a Mythic Cultivator! +50 Fame.`);
    }
}

// ===== MERIDIANS =====
function attemptOpenMeridian(index) {
    if (G.meridians[index]) return { success: false, message: "Already open." };
    const cost = 10 + index * 3 + (G.meridianAttempts[index] || 0) * 5;
    if (G.qi < cost) return { success: false, message: `Need ${cost} Qi.` };
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.meridian, "Opening a meridian")) {
        cancelActionLog();
        return { success: false, message: "Your lifespan ends..." };
    }
    G.qi -= cost;
    G.meridianAttempts[index] = (G.meridianAttempts[index] || 0) + 1;
    let chance = 30 + G.foundation * 1.5 + (G.qi + G.vitality + G.spirit + G.will) * 0.5 - index * 2 + (G.meridianAttempts[index] || 0) * 2;
    chance = Math.max(10, Math.min(85, chance));
    if (Math.random() * 100 < chance) {
        G.meridians[index] = true;
        G.foundation += 2;
        G.qi = Math.min(getMaxQi(), G.qi + 3);
        clampCurrentQi();
        const bonus = 1 + Math.floor(index / 3);
        G.vitality += Math.floor(bonus / 2);
        G.spirit += Math.floor(bonus / 2);
        G.will += Math.floor(bonus / 2);
        applyVitalityToMaxHp();
        const msg = `☯️ ${getMeridianIcon(index)} ${getMeridianName(index)} meridian opened! Max Qi → ${getMaxQi()}.`;
        checkPerfectCultivation();
        commitActionLog(msg);
        return { success: true, message: msg, logged: true };
    } else {
        const dmg = 2 + Math.floor(index / 3);
        G.hp = Math.max(1, G.hp - dmg);
        const msg = `💢 Failed to open ${getMeridianName(index)}. Lost ${dmg} HP.`;
        commitActionLog(msg);
        return { success: false, message: msg, logged: true };
    }
}

function attemptGoldenNeedle() {
    if (!G.hasGoldenNeedle) return { success: false, message: "You don't have the Golden Needle Set." };
    if (G.meridians[11]) return { success: false, message: "12th meridian already open." };
    const cost = 30;
    if (G.qi < cost) return { success: false, message: `Need ${cost} Qi.` };
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.goldenNeedle, "Golden Needle acupuncture")) {
        cancelActionLog();
        return { success: false, message: "Your lifespan ends..." };
    }
    G.qi -= cost;
    const chance = 70 + G.foundation * 1.5;
    if (Math.random() * 100 < chance) {
        G.meridians[11] = true;
        G.foundation += 5;
        const msg = `🌟 Golden Needle Set opens the Governor Vessel meridian! +5 Foundation.`;
        checkPerfectCultivation();
        commitActionLog(msg);
        return { success: true, message: msg, logged: true };
    }
    const failMsg = `💢 Golden Needle fails. The meridian resists.`;
    commitActionLog(failMsg);
    return { success: false, message: failMsg, logged: true };
}

function attemptHidden13th() {
    if (!G.hasAncientText) return { success: false, message: "You don't have the ancient text." };
    if (G.meridians[12]) return { success: false, message: "13th meridian already open." };
    if (G.realmIdx < 3) return { success: false, message: "You must be at least Nascent Soul." };
    const cost = 50;
    if (G.qi < cost) return { success: false, message: `Need ${cost} Qi.` };
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.hiddenMeridian, "Awakening the hidden meridian")) {
        cancelActionLog();
        return { success: false, message: "Your lifespan ends..." };
    }
    G.qi -= cost;
    const chance = 50 + G.foundation * 2 + G.tribulationCount * 2;
    if (Math.random() * 100 < chance) {
        G.meridians[12] = true;
        G.foundation += 10;
        if (typeof addFame === 'function') addFame(20);
        else G.fame += 20;
        const msg = `🌟 The 13th Meridian awakens! The Primordial Vessel is complete! +10 Foundation, +20 Fame.`;
        checkPerfectCultivation();
        commitActionLog(msg);
        return { success: true, message: msg, logged: true };
    }
    const dmg = 20 + Math.floor(Math.random() * 20);
    G.hp = Math.max(1, G.hp - dmg);
    const msg = `💥 The hidden tribulation devastates you! -${dmg} HP.`;
    commitActionLog(msg);
    return { success: false, message: msg, logged: true };
}

// ===== PHYSIQUES =====
// trainPhysique — see physique-cultivation.js (staged Body Chamber projects)

function attemptLegendaryPhysique(name) {
    const physique = getPhysiqueByName(name);
    if (!physique || physique.type !== "legendary") return { success: false, message: "Invalid physique." };
    if (typeof isPhysiqueCultivationActive === 'function' && isPhysiqueCultivationActive()) {
        return { success: false, message: "Finish your active physique project in the Body Chamber first." };
    }
    if (name === "Thunder Soul" && G.tribulationCount < 3) return { success: false, message: "Need to survive 3 tribulations." };
    if (name === "Void Body" && !G.hasAncientText) return { success: false, message: "Need to find the ancient text about spatial rifts." };
    if (name === "Phoenix Blood" && !G.hasGoldenNeedle) return { success: false, message: "Need to find a Phoenix feather (Golden Needle set counts)." };
    if (name === "Dragon Scale" && G.fame < 50) return { success: false, message: "Need 50 fame to challenge a Dragon-kin." };
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.physiqueLegendary, `Legendary physique trial: ${name}`)) {
        cancelActionLog();
        return { success: false, message: "Your lifespan ends..." };
    }
    if (G._appliedPhysiqueRecord) {
        removePhysiqueBonus(G._appliedPhysiqueRecord);
        G._appliedPhysiqueRecord = null;
    } else if (G.physique) {
        removePhysiqueBonus(G.physique);
    }
    G.physique = { ...physique };
    applyPhysiqueBonus(G.physique);
    G._appliedPhysiqueRecord = { ...G.physique, bonus: { ...(G.physique.bonus || {}) } };
    G.foundation += 10;
    if (typeof addFame === 'function') addFame(10);
    else G.fame += 10;
    const msg = `🏆 You awaken the ${name} physique! Legendary power flows through you! +10 Foundation, +10 Fame.`;
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

function attemptEvilPhysique(name) {
    const physique = getPhysiqueByName(name);
    if (!physique || physique.type !== "evil") return { success: false, message: "Invalid physique." };
    if (typeof isPhysiqueCultivationActive === 'function' && isPhysiqueCultivationActive()) {
        return { success: false, message: "Finish your active physique project in the Body Chamber first." };
    }
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.physiqueEvil, `Embracing ${name}`)) {
        cancelActionLog();
        return { success: false, message: "Your lifespan ends..." };
    }
    if (G._appliedPhysiqueRecord) {
        removePhysiqueBonus(G._appliedPhysiqueRecord);
        G._appliedPhysiqueRecord = null;
    } else if (G.physique) {
        removePhysiqueBonus(G.physique);
    }
    G.physique = { ...physique };
    applyPhysiqueBonus(G.physique);
    G._appliedPhysiqueRecord = { ...G.physique, bonus: { ...(G.physique.bonus || {}) } };
    G.corruptionLevel += 20;
    G.foundation += 5;
    const msg = `😈 You embrace the ${name} physique! ${physique.pro} ${physique.con}`;
    commitActionLog(msg);
    if (typeof shiftDaoAlignment === 'function') {
        shiftDaoAlignment(DAO_ALIGNMENT.shifts.evilPhysique, 'embracing an Evil Physique');
    }
    if (G.corruptionLevel >= G.corruptionThreshold) {
        addLog(`💀 CORRUPTION OVERWHELMS YOU! You lose control...`);
        G.gameOver = true;
    }
    return { success: true, message: msg, logged: true };
}

function removePhysiqueBonus(physique) {
    if (!physique) return;
    const bonus = physique.bonus || {};
    if (bonus.qi) G.qi -= bonus.qi;
    if (bonus.vitality) G.vitality -= bonus.vitality;
    if (bonus.spirit) G.spirit -= bonus.spirit;
    if (bonus.will) G.will -= bonus.will;
    if (bonus.hp) G.maxHp -= bonus.hp;
    if (bonus.qiRegenMult) G.qiRegenMult = 1;
    if (bonus.dmgMult) G.dmgMult = 1;
    if (bonus.evasion) G.evasionBonus = 0;
    if (bonus.defense) G.defenseBonus = 0;
    if (bonus.lightningResist) G.lightningResist = 0;
    if (bonus.regen) G.regenBonus = 0;
    applyVitalityToMaxHp();
}

function applyPhysiqueBonus(physique) {
    if (!physique) return;
    const bonus = physique.bonus || {};
    if (bonus.qi) G.qi += bonus.qi;
    if (bonus.vitality) G.vitality += bonus.vitality;
    if (bonus.spirit) G.spirit += bonus.spirit;
    if (bonus.will) G.will += bonus.will;
    if (bonus.hp) G.maxHp += bonus.hp;
    applyVitalityToMaxHp();
    if (bonus.qiRegenMult) G.qiRegenMult = bonus.qiRegenMult;
    if (bonus.dmgMult) G.dmgMult = bonus.dmgMult;
    if (bonus.evasion) G.evasionBonus = bonus.evasion;
    if (bonus.defense) G.defenseBonus = bonus.defense;
    if (bonus.lightningResist) G.lightningResist = bonus.lightningResist;
    if (bonus.regen) G.regenBonus = bonus.regen;
}

// Weapon Intent — see intent.js
