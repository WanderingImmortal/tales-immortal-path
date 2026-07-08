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
function getBreakthroughTrack() {
    return G._breakthroughTrack || 'dantian';
}

function setBreakthroughTrack(track) {
    G._breakthroughTrack = track;
}

function openBreakthrough(track) {
    const t = track || (typeof getFocusTrack === 'function' ? getFocusTrack() : 'dantian');
    openTrackBreakthrough(t);
}

function openSpiritBreakthrough() {
    openTrackBreakthrough('spirit');
}

function openTrackBreakthrough(track) {
    if (G.gameOver || G.inCombat || isTribulationActive() || (typeof isTranscendencePerkPending === 'function' && isTranscendencePerkPending())) return;
    setBreakthroughTrack(track);
    const pathKey = typeof getTrackPathKey === 'function' ? getTrackPathKey(track) : G.path;
    const realmIdx = typeof getTrackRealmIdx === 'function' ? getTrackRealmIdx(track) : G.realmIdx;
    const pathData = PATHS[pathKey];
    const next = pathData.realms[realmIdx + 1] || "MAX";
    if (next === "MAX") {
        addLog(`🏆 ${getTrackRealmName(track)} is already at the peak on this road!`);
        if (track === 'dantian' && typeof openTrueReincarnationChoice === 'function') {
            setTimeout(() => openTrueReincarnationChoice(), 400);
        }
        fullRender();
        return;
    }
    if (track === 'spirit' && typeof canSpiritTrackBreakthrough === 'function' && !canSpiritTrackBreakthrough()) {
        addLog(`🚫 ${getSpiritTrackBreakthroughBlockReason()}`);
        fullRender();
        return;
    }
    if (track !== 'spirit' && typeof canBreakthroughToNextRealm === 'function' && !canBreakthroughToNextRealm()) {
        addLog(`🚫 ${getConsolidationBlockReason()}`);
        fullRender();
        return;
    }
    const nextIdx = realmIdx + 1;
    if (typeof isRealmBlockedByTalent === 'function' && isRealmBlockedByTalent(nextIdx)) {
        addLog(`🚫 ${getTalentRealmCapMessage()}`);
        fullRender();
        return;
    }
    const visions = pathData.visions;
    const vision = visions[realmIdx % visions.length] || visions[0];
    document.getElementById('visionText').textContent = '"' + vision + '"';
    const trackLabel = track === 'dantian' ? 'Dantian' : track === 'vessel' ? 'Vessel' : 'Spirit';
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
                const sealTier = getConsolidationTier(realmIdx) || tierCompare.tier;
                const scale = typeof getBreakthroughTierScale === 'function'
                    ? getBreakthroughTierScale(sealTier)
                    : null;
                const lifePreview = typeof getBreakthroughLifespanPreview === 'function'
                    ? getBreakthroughLifespanPreview(realmIdx, sealTier)
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
        const realmName = typeof getTrackRealmName === 'function' ? getTrackRealmName(track) : getRealm();
        const statusLabel = track === 'spirit' && typeof getSpiritTrackBreakthroughStatus === 'function'
            ? getSpiritTrackBreakthroughStatus()
            : (typeof getConsolidationStatusLabel === 'function' ? getConsolidationStatusLabel() : '');
        return `${trackLabel} · ${realmName} → ${next} | Foundation: ${typeof getFoundationDisplayText === 'function' ? getFoundationDisplayText() : getEffectiveFoundation()} | Chance: ${Math.round(getBreakChance())}%${alignText ? ' (' + alignText + ')' : ''} | ${statusLabel} | Attempts: ${G.breakAttempts} | Meridians: ${getMeridianOpenCount()}/13 | Age: ${formatYears(G.ageMonths)} | ${isImmortal() ? 'Immortal' : getYearsRemaining() + ' years left'} | ${marginText}${tierLine ? ' | ' + tierLine : ''}`;
    })();
    document.getElementById('breakthroughPopup').classList.add('active');
    if (typeof triggerTutorial === 'function') triggerTutorial('first_breakthrough');
}

function closeBreakthrough() {
    document.getElementById('breakthroughPopup').classList.remove('active');
}

function executeBreakthrough(style) {
    executeTrackBreakthrough(style, getBreakthroughTrack());
}

function executeTrackBreakthrough(style, track) {
    track = track || 'dantian';
    const realmIdx = typeof getTrackRealmIdx === 'function' ? getTrackRealmIdx(track) : G.realmIdx;
    if (track === 'spirit') {
        if (typeof canSpiritTrackBreakthrough === 'function' && !canSpiritTrackBreakthrough()) {
            addLog(`🚫 ${getSpiritTrackBreakthroughBlockReason()}`);
            closeBreakthrough();
            fullRender();
            return;
        }
    } else if (typeof canBreakthroughToNextRealm === 'function' && !canBreakthroughToNextRealm()) {
        addLog(`🚫 ${getConsolidationBlockReason()}`);
        closeBreakthrough();
        fullRender();
        return;
    }
    const nextIdx = realmIdx + 1;
    if (typeof isRealmBlockedByTalent === 'function' && isRealmBlockedByTalent(nextIdx)) {
        addLog(`🚫 ${getTalentRealmCapMessage()}`);
        closeBreakthrough();
        fullRender();
        return;
    }
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.breakthrough, `${getTrackRealmName(track)} breakthrough seclusion`)) { cancelActionLog(); closeBreakthrough(); fullRender(); return; }
    const chance = getBreakChance();
    let bonus = 0;
    if (style === 'balanced') bonus = 3;
    else if (style === 'power') bonus = 8;
    else if (style === 'wisdom') bonus = 8;
    const sealTier = typeof getConsolidationTier === 'function' ? getConsolidationTier(realmIdx) : 'peak';
    const tierPenalty = typeof getBreakthroughTierScale === 'function'
        ? getBreakthroughTierScale(sealTier).breakChancePenalty
        : 0;
    const finalChance = clamp(chance + bonus + tierPenalty, 10, 95);
    const roll = Math.random() * 100;
    const naturalSuccess = roll < finalChance;
    let success = naturalSuccess;
    const foundation = getEffectiveFoundation();
    const foundationStabilized = !naturalSuccess
        && foundation > 10
        && Math.random() * 100 < Math.min(15, Math.floor(foundation / 2));
    if (foundationStabilized) success = true;
    if (G.perfectCultivation && Math.random() * 100 < 30) success = true;
    const perfectBreak = typeof rollPerfectBreakthrough === 'function'
        && rollPerfectBreakthrough(roll, finalChance, naturalSuccess, foundationStabilized);
    if (success) {
        const prevUnlocks = typeof captureActionUnlockSnapshot === 'function'
            ? captureActionUnlockSnapshot()
            : null;
        const newIdx = realmIdx + 1;
        if (typeof setTrackRealmIdx === 'function') setTrackRealmIdx(track, newIdx);
        else G.realmIdx++;
        if (track === getFocusTrack() && typeof syncLegacyPathShims === 'function') syncLegacyPathShims();
        G.breakAttempts = 0;
        G.realmPeakGrindBoost = 0;
        if (track === 'dantian') {
            G.maxQiBonus = (G.maxQiBonus || 0) + QI_BALANCE.breakthroughMaxQi + Math.floor(newIdx / 2);
            G.qi = getMaxQi();
            clampCurrentQi();
        }
        const boost = 3 + Math.floor(Math.random() * 6) + (style === 'power' ? 3 : 0) + (style === 'wisdom' ? 2 : 0);
        if (track === 'dantian' || track === 'vessel') {
            G.vitality += Math.floor(boost / 2) + (style === 'power' ? 2 : 0);
        }
        if (track === 'dantian' || track === 'spirit') {
            G.spirit += Math.floor(boost / 3) + (style === 'wisdom' ? 3 : 0);
            G.will += Math.floor(boost / 3) + (style === 'wisdom' ? 2 : 0);
        }
        if (track === 'vessel') {
            G.vitality += Math.floor(boost / 2) + (style === 'power' ? 3 : 0);
            G.maxHp += 12 + newIdx * 3 + (style === 'power' ? 5 : 0);
        } else {
            G.maxHp += 10 + newIdx * 2 + (style === 'power' ? 5 : 0);
        }
        applyVitalityToMaxHp();
        G.hp = G.maxHp;
        if (typeof addFame === 'function') addFame(5 + newIdx);
        else G.fame += 5 + newIdx;
        extendLifespanOnBreakthrough(sealTier);
        const realmName = typeof getTrackRealmName === 'function' ? getTrackRealmName(track) : getRealm();
        const titleName = typeof getTrackTitle === 'function' ? getTrackTitle(track) : getTitle();
        commitActionLog(`✨ SUCCESS! ${track === 'spirit' ? 'Spirit track' : track === 'vessel' ? 'Vessel' : 'Dantian'}: ${realmName} (${titleName})!`);
        if (typeof notifyActionUnlocks === 'function' && prevUnlocks) {
            notifyActionUnlocks(prevUnlocks);
            if (typeof initActionUnlockSnapshot === 'function') initActionUnlockSnapshot();
        }
        if (perfectBreak) addLog(`🌟 The breakthrough was flawless — your Foundation drew the heavens' attention.`);
        addLog(`📈 ${track === 'dantian' ? `Max Qi → ${getMaxQi()}, ` : ''}+${Math.floor(boost/2)+(style==='power'?2:0)} Vit, +${Math.floor(boost/3)+(style==='wisdom'?3:0)} Spi/Will.`);
        if (typeof tryAwakenSoulEmbryo === 'function' && newIdx >= SOUL_EMBRYO_REALM_IDX) {
            tryAwakenSoulEmbryo(track);
        }
        if (track === 'spirit' && typeof markSpiritTrackConsolidated === 'function') {
            markSpiritTrackConsolidated(newIdx);
        }
        closeBreakthrough();
        if (perfectBreak && track === 'dantian' && typeof canOfferTranscendencePerks === 'function' && canOfferTranscendencePerks(newIdx)) {
            offerTranscendencePerkChoice(newIdx, style);
            return;
        }
        if (track === 'dantian' && shouldTriggerTribulation()) {
            if (typeof beginTribulationWithTutorial === 'function') {
                beginTribulationWithTutorial(style);
            } else {
                startTribulation(style);
            }
            return;
        }
        if (track === 'dantian') checkPerfectCultivation();
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
        const loss = typeof scaleStatDebuff === 'function' ? Math.max(1, scaleStatDebuff(2)) : 2;
        const cracks = typeof applyFoundationLossAsCracks === 'function'
            ? applyFoundationLossAsCracks(loss) : 1;
        addLog(`🩸 Your foundation cracks under the backlash (${cracks} crack${cracks === 1 ? '' : 's'}).`);
    }
    closeBreakthrough();
    setBreakthroughTrack(typeof getFocusTrack === 'function' ? getFocusTrack() : 'dantian');
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
    let chance = 30 + getEffectiveFoundation() * 1.5 + (G.qi + G.vitality + G.spirit + G.will) * 0.5 - index * 2 + (G.meridianAttempts[index] || 0) * 2;
    chance = Math.max(10, Math.min(85, chance));
    if (Math.random() * 100 < chance) {
        const openBefore = getMeridianOpenCount();
        G.meridians[index] = true;
        const flowGain = typeof grantMeridianOpenFlow === 'function'
            ? grantMeridianOpenFlow(openBefore)
            : grantCultivationPillar('flow', 2);
        G.qi = Math.min(getMaxQi(), G.qi + 3);
        clampCurrentQi();
        const bonus = 1 + Math.floor(index / 3);
        G.vitality += Math.floor(bonus / 2);
        G.spirit += Math.floor(bonus / 2);
        G.will += Math.floor(bonus / 2);
        applyVitalityToMaxHp();
        const msg = `☯️ ${getMeridianIcon(index)} ${getMeridianName(index)} meridian opened! ${formatPillarGrant('flow', flowGain)} Max Qi → ${getMaxQi()}.`;
        checkPerfectCultivation();
        commitActionLog(msg);
        return { success: true, message: msg, logged: true };
    } else {
        const flowGain = typeof grantMeridianAttemptFlow === 'function' ? grantMeridianAttemptFlow() : 0;
        const dmg = 2 + Math.floor(index / 3);
        G.hp = Math.max(1, G.hp - dmg);
        let msg = `💢 Failed to open ${getMeridianName(index)}. Lost ${dmg} HP.`;
        if (flowGain) msg += ` ${formatPillarGrant('flow', flowGain)}.`;
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
    const chance = 70 + getEffectiveFoundation() * 1.5;
    if (Math.random() * 100 < chance) {
        G.meridians[11] = true;
        const openBefore = getMeridianOpenCount() - 1;
        const flowGain = typeof grantMeridianOpenFlow === 'function'
            ? grantMeridianOpenFlow(openBefore)
            : grantCultivationPillar('flow', 5);
        const msg = `🌟 Golden Needle Set opens the Governor Vessel meridian! ${formatPillarGrant('flow', flowGain)}.`;
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
    const chance = 50 + getEffectiveFoundation() * 2 + G.tribulationCount * 2;
    if (Math.random() * 100 < chance) {
        G.meridians[12] = true;
        const openBefore = getMeridianOpenCount() - 1;
        const flowGain = typeof grantMeridianOpenFlow === 'function'
            ? grantMeridianOpenFlow(openBefore)
            : grantCultivationPillar('flow', 10);
        if (typeof addFame === 'function') addFame(20);
        else G.fame += 20;
        const msg = `🌟 The 13th Meridian awakens! The Primordial Vessel is complete! ${formatPillarGrant('flow', flowGain)}, +20 Fame.`;
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
    grantFoundation(10);
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
    grantFoundation(5);
    const msg = `😈 You embrace the ${name} physique! ${physique.pro} ${physique.con}`;
    commitActionLog(msg);
    if (typeof shiftDaoAlignment === 'function') {
        shiftDaoAlignment(DAO_ALIGNMENT.shifts.evilPhysique, 'embracing an Evil Physique');
    }
    if (G.corruptionLevel >= G.corruptionThreshold) {
        addLog(`💀 CORRUPTION OVERWHELMS YOU! You lose control...`);
        G.gameOver = true;
        if (typeof triggerBitterReincarnation === 'function') {
            setTimeout(() => triggerBitterReincarnation('💀 Corruption overwhelms you. Bitter reincarnation is your only path forward.'), 600);
        }
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
