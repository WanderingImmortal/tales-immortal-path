// ============================================
// ACTIONS.JS — All button handlers
// ============================================

function actionBlocked() {
    return G.gameOver || G.inCombat || G.inQiChamber || G.inBodyChamber || G.inSoulChamber
        || G.inAlchemyChamber || G.inCultivationHub
        || (typeof isTribulationActive === 'function' && isTribulationActive())
        || (typeof isTranscendencePerkPending === 'function' && isTranscendencePerkPending());
}

// ----- CULTIVATE -----
function runCultivateSession(options) {
    const opts = options || {};
    const b = QI_BALANCE;
    const sectMult = typeof getSectCultivationMult === 'function' ? getSectCultivationMult() : 1;
    const factionMult = typeof getFactionCultivateMult === 'function' ? getFactionCultivateMult() : 1;
    const traitMult = getPlayerTraitMultPct('cultivateSpeedPct', 0) * getPlayerTraitMultPct('qiEfficiencyPct', 0);
    const talentMult = typeof getCombinedCultivateMult === 'function' ? getCombinedCultivateMult() : 1;
    const legacyMult = typeof getLegacyCultivateBonusMult === 'function' ? getLegacyCultivateBonusMult() : 1;
    const extraMult = opts.extraMult || 1;
    const cultMult = sectMult * factionMult * traitMult * talentMult * legacyMult * extraMult;
    const densGainRaw = b.cultivateDensityMin + Math.random() * (b.cultivateDensityMax - b.cultivateDensityMin);
    const densGain = Math.round(densGainRaw * cultMult * 100) / 100;
    G.qiDensity = (G.qiDensity || 0) + densGain;
    const fillGain = Math.max(1, Math.floor(getMaxQi() * b.cultivateFillRatio * cultMult));
    G.qi = Math.min(getMaxQi(), G.qi + fillGain);
    clampCurrentQi();
    const statGain = 1 + Math.floor(G.realmIdx / 2);
    if (G.path === 'body') {
        G.vitality += statGain + 1;
        G.spirit += Math.floor(statGain / 2);
        G.will += Math.floor(statGain / 2);
    } else if (G.path === 'soul') {
        G.vitality += Math.floor(statGain / 2);
        G.spirit += statGain;
        G.will += statGain;
    } else {
        G.vitality += Math.floor(statGain / 2);
        G.spirit += Math.floor(statGain / 2);
        G.will += Math.floor(statGain / 2);
    }
    applyVitalityToMaxHp();
    const hpCap = typeof getEffectiveMaxHp === 'function' ? getEffectiveMaxHp()
        : (typeof getEffectiveMaxHpFromScars === 'function' ? getEffectiveMaxHpFromScars() : G.maxHp);
    G.hp = Math.min(hpCap, G.hp + Math.floor(statGain / 2));
    const buildingNotes = typeof applySectCultivateBuildingEffects === 'function'
        ? applySectCultivateBuildingEffects(statGain)
        : [];
    if (G.qiExhausted && G.qi > 0) {
        G.qiExhausted = false;
        addLog(`⚡ Your Qi recovers!`);
    }
    let titheAmount = 0;
    if (G.disciples.length > 0) {
        const income = typeof getSectDiscipleIncome === 'function'
            ? getSectDiscipleIncome() + getFameLevel().bonus
            : G.disciples.length + getFameLevel().bonus;
        if (typeof getBuildingLevel === 'function' && getBuildingLevel('treasury') > 0
            && typeof addTreasuryPendingTithe === 'function') {
            addTreasuryPendingTithe(income);
            G.sectPassiveIncome = income;
            titheAmount = income;
        } else {
            G.stones += income;
            G.sectPassiveIncome = income;
        }
    }
    const tradeIncome = typeof getSectTradeRouteIncome === 'function' ? getSectTradeRouteIncome() : 0;
    const factionTrade = typeof getFactionTradeIncomeBonus === 'function' ? getFactionTradeIncomeBonus() : 0;
    if (factionTrade > 0) {
        G.stones += factionTrade;
        G.sectPassiveIncome = (G.sectPassiveIncome || 0) + factionTrade;
    }
    const factionPassive = typeof getFactionPassiveCultivateBonus === 'function' ? getFactionPassiveCultivateBonus() : null;
    if (factionPassive?.foundation) grantFoundation(factionPassive.foundation);
    if (factionPassive?.spirit) G.spirit += factionPassive.spirit;
    const mergedFx = typeof getMergedDaoEffects === 'function' ? getMergedDaoEffects() : null;
    if (mergedFx?.foundationPerCultivate) grantFoundation(mergedFx.foundationPerCultivate);
    if (opts.extraFoundation) grantFoundation(opts.extraFoundation);
    if (tradeIncome > 0) {
        G.stones += tradeIncome;
        G.sectPassiveIncome = (G.sectPassiveIncome || 0) + tradeIncome;
    }
    let cultMsg = `${opts.logPrefix || '🧘 You refine your Qi'}. +${densGain.toFixed(2)} Density, dantian +${fillGain}/${getMaxQi()}, +${statGain} secondary stats.`;
    const cultParts = [...(opts.bonusNoteParts || [])];
    if (sectMult > 1) cultParts.push(`Hall +${Math.round((getSectBuildingBonus('cultivationSpeedPct') || 0))}%`);
    if (factionMult > 1) cultParts.push(`faction +${Math.round((factionMult - 1) * 100)}%`);
    if (typeof isInSectInfluenceZone === 'function' && isInSectInfluenceZone(typeof getActiveZoneId === 'function' ? getActiveZoneId() : G.currentZone)) {
        cultParts.push(`influence +${SECT_INFLUENCE.cultivateBonusPct}%`);
    }
    if (tradeIncome > 0) cultParts.push(`trade +${tradeIncome}`);
    if (factionTrade > 0) cultParts.push(`faction trade +${factionTrade}`);
    if (factionPassive?.foundation || factionPassive?.spirit) {
        cultParts.push(`faction +${factionPassive.foundation || 0}f/${factionPassive.spirit || 0}s`);
    }
    if (opts.extraFoundation) cultParts.push(`formation +${opts.extraFoundation}f`);
    if (cultParts.length) cultMsg += ` (${cultParts.join(', ')})`;
    if (buildingNotes.length) cultMsg += ` · ${buildingNotes.join(', ')}`;
    if (typeof getBuildingLevel === 'function' && getBuildingLevel('treasury') > 0 && titheAmount > 0) {
        cultMsg += ` · Treasury tithe +${titheAmount}💎`;
    }
    if (getMeridianOpenCount() < 11 && Math.random() < 0.05) {
        addLog(`☯️ You sense a new meridian... (check Meridians)`);
    }
    return cultMsg;
}

function actionCultivate() {
    if (actionBlocked()) return;
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.cultivate, "Secluded meditation")) { cancelActionLog(); fullRender(); return; }
    commitActionLog(runCultivateSession());
    if (typeof triggerTutorial === 'function') triggerTutorial('first_cultivate');
    fullRender();
}

// ----- RECUPERATE -----
function actionRecuperate() {
    if (actionBlocked()) return;
    if (G.forbidden?.activeTrial === 'iron_crucible') {
        addLog(`🔥 The Crucible allows no rest.`);
        fullRender();
        return;
    }
    const hpCap = typeof getEffectiveMaxHp === 'function' ? getEffectiveMaxHp()
        : (typeof getEffectiveMaxHpFromScars === 'function' ? getEffectiveMaxHpFromScars() : G.maxHp);
    const needsHeal = G.hp < hpCap;
    const needsShield = (G.path === 'qi' || G.path === 'soul') && G.shield < G.maxShield;
    if (!needsHeal && !needsShield) {
        addLog(`🛌 You are already at full strength.`);
        fullRender();
        return;
    }
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.recuperate, "Resting and recuperating")) { cancelActionLog(); fullRender(); return; }
    const regenMult = typeof getScarHpRegenMult === 'function' ? getScarHpRegenMult() : 1;
    const transcRegen = typeof getTranscendenceRegenMult === 'function' ? getTranscendenceRegenMult() : 1;
    const vit = typeof getBodyChamberEffectiveVitality === 'function' ? getBodyChamberEffectiveVitality() : G.vitality;
    let hpGain = Math.floor((Math.floor(hpCap * 0.22) + Math.floor(vit * 0.6) + G.realmIdx * 2) * regenMult * transcRegen);
    if (typeof getGearBonuses === 'function') hpGain += getGearBonuses().hpRegenBonus || 0;
    if (typeof getBodyChamberHpRegenMult === 'function') hpGain = Math.floor(hpGain * getBodyChamberHpRegenMult());
    const before = G.hp;
    G.hp = Math.min(hpCap, G.hp + hpGain);
    let msg = `🛌 You recuperate. +${G.hp - before} HP`;
    if (G.path === 'qi' || G.path === 'soul') {
        updateShield();
        const sb = G.shield;
        G.shield = Math.min(G.maxShield, G.shield + Math.floor(G.maxShield * 0.25));
        if (G.shield > sb) msg += ` · Barrier +${G.shield - sb}`;
    }
    if (G.path === 'body') {
        const vit = typeof getBodyChamberEffectiveVitality === 'function' ? getBodyChamberEffectiveVitality() : G.vitality;
        G.combatResource = Math.min(G.maxCombatResource || 0, (G.combatResource || 0) + Math.floor(vit / 2));
    }
    commitActionLog(msg + '.');
    fullRender();
}

// ----- PILL -----
function actionPill() {
    if (actionBlocked()) return;
    if (G.forbidden?.activeTrial === 'iron_crucible') {
        addLog(`🔥 Pills cannot be refined inside the Crucible.`);
        fullRender();
        return;
    }
    ensurePillStock();
    if (getTotalPills() <= 0) {
        addLog(`😅 No pills left! Explore, visit a market, or buy more.`);
        fullRender();
        return;
    }
    renderPillPopup();
    document.getElementById('pillPopup').classList.add('active');
}

function usePill(pillId) {
    if (actionBlocked()) return;
    ensurePillStock();
    const pill = PILL_TYPES[pillId];
    if (!pill || (G.pillStock[pillId] || 0) <= 0) {
        addLog(`💊 You don't have any ${pill?.name || 'pills'}.`);
        fullRender();
        return;
    }
    beginActionLog();
    if (!advanceTime(pill.months, `Consuming ${pill.name}`)) { cancelActionLog(); fullRender(); return; }
    G.pillStock[pillId]--;
    const result = pill.apply();
    commitActionLog(`${pill.emoji} ${pill.name}: ${result}`);
    document.getElementById('pillPopup')?.classList.remove('active');
    fullRender();
}

function buyPill(pillId) {
    const zoneId = typeof getMerchantCatalogKey === 'function' ? getMerchantCatalogKey() : (typeof getActiveZoneId === 'function' ? getActiveZoneId() : (G.currentZone || currentZone));
    const catalog = zoneId ? MERCHANT_CATALOG[zoneId] : null;
    if (!catalog?.pills) return;
    const item = catalog.pills.find(p => p.id === pillId);
    if (!item) return;
    const pill = PILL_TYPES[pillId];
    if (!pill) return;
    if (item.reqRealm != null && G.realmIdx < item.reqRealm) {
        addLog(`💊 ${pill.name} requires a higher realm.`);
        fullRender();
        return;
    }
    if (G.stones < item.price) {
        addLog(`💎 Need ${item.price} Stones for ${pill.name}.`);
        fullRender();
        return;
    }
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.market, `Purchasing ${pill.name}`)) { cancelActionLog(); fullRender(); return; }
    G.stones -= item.price;
    addPill(pillId, item.qty || 1);
    commitActionLog(`🏪 Purchased ${item.qty || 1}× ${pill.name} for ${item.price} Stones.`);
    renderMerchantPopup();
    renderPillPopup();
    fullRender();
}

// ----- RECRUIT -----
function actionRecruit() {
    if (actionBlocked()) return;
    if (!guardAction('recruit')) return;
    const recruitBlock = typeof getRecruitBlockReason === 'function' ? getRecruitBlockReason() : null;
    if (recruitBlock) {
        addLog(`👤 ${recruitBlock}`);
        fullRender();
        return;
    }
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.recruit, "Traveling to recruit disciples")) { cancelActionLog(); fullRender(); return; }
    const recruited = typeof rollRecruitWithScars === 'function' ? rollRecruitWithScars() : Math.random() < 0.85;
    if (!recruited) {
        commitActionLog(`😐 No worthy disciple answers your call this season.`);
        fullRender();
        return;
    }
    const name = typeof rollRecruitName === 'function'
        ? rollRecruitName()
        : SECT_RECRUIT_NAMES[Math.floor(Math.random() * SECT_RECRUIT_NAMES.length)];
    if (typeof addSectDisciple === 'function') addSectDisciple(name, 'acolyte');
    else G.disciples.push(name);
    const stones = 2 + Math.floor(Math.random() * 4) + getFameLevel().bonus;
    G.stones += stones;
    G.qi += 1;
    G.vitality += 1;
    G.spirit += 1;
    G.will += 1;
    grantFoundation(1);
    if (typeof ensureSectState === 'function') {
        ensureSectState();
        addSectRenown(2);
        shiftSectReputation('recruit_disciple');
        if (typeof markSectActivity === 'function') markSectActivity();
    }
    commitActionLog(`👤 ${name} joins your sect as an Acolyte! +${stones} Stones, +1 all stats.`);
    if (typeof shiftDaoAlignmentHelp === 'function') shiftDaoAlignmentHelp('guiding a new disciple');
    if (typeof generateSectQuest === 'function') generateSectQuest();
    fullRender();
}

// ----- SECT -----
function actionSect() {
    if (actionBlocked()) return;
    if (!guardAction('sect')) return;
    renderSectPopup();
    document.getElementById('sectPopup').classList.add('active');
}

// ----- FACTIONS -----
function actionFactionsWrapper() {
    if (actionBlocked()) return;
    if (!guardAction('factions')) return;
    if (typeof actionFactions === 'function') actionFactions();
    else addLog('🏯 Faction politics are not yet charted in this region.');
    fullRender();
}

// ----- STATUS -----
function actionStatus() {
    if (actionBlocked()) return;
    const techs = G.techniques.length ? G.techniques.map(t => `${t.name} (${getTechniqueTier(t.uses||0).name})`).join(', ') : 'None';
    const disc = G.disciples.length ? G.disciples.join(', ') : 'None';
    const openCount = getMeridianOpenCount();
    const phys = G.physique ? G.physique.name : 'None';
    const activeIntent = typeof getActiveIntent === 'function' ? getActiveIntent() : G.weaponIntent;
    const intent = activeIntent
        ? `${activeIntent.weapon} (${getIntentTier(activeIntent).name}${G.weaponIntents?.length > 1 ? ', +' + (G.weaponIntents.length - 1) : ''})`
        : 'None';
    const daos = [...G.trueDaos, ...G.mergedDaos].join(', ') || 'None';
    addLog(`📜 ${G.name} | ${getRealm()} (${getTitle()}) | Fame: ${G.fame} | Foundation: ${getEffectiveFoundation()} | Meridians: ${openCount}/13 | Physique: ${phys} | Intent: ${intent} | Dao: ${daos}`);
    fullRender();
}

// ----- COMBAT -----
function actionCombat() {
    if (actionBlocked()) return;
    if (G.hp <= 0) {
        addLog(`💀 You are too injured. Rest first.`);
        fullRender();
        return;
    }
    if (typeof timeCombatStart === 'function') {
        if (!timeCombatStart('⚔️ You seek a worthy opponent.', 'Seeking a worthy opponent')) { fullRender(); return; }
    } else {
        beginActionLog();
        if (!advanceTime(ACTION_MONTHS.combatStart, "Seeking a worthy opponent")) { cancelActionLog(); fullRender(); return; }
        commitActionLog('⚔️ You seek a worthy opponent.');
    }
    startCombat();
    fullRender();
}

// ----- TECHNIQUES -----
function actionTech() {
    if (G.gameOver) return;
    renderTechPopup();
    document.getElementById('techPopup').classList.add('active');
}

// ----- MERIDIANS -----
function actionMeridian() {
    if (G.gameOver) return;
    if (!guardAction('meridian')) return;
    renderMeridianPopup();
    document.getElementById('meridianPopup').classList.add('active');
}

// ----- PHYSIQUE -----
function actionPhysique() {
    if (G.gameOver) return;
    if (!guardAction('physique')) return;
    renderPhysiquePopup();
    document.getElementById('physiquePopup').classList.add('active');
}

// ----- INTENT -----
function actionIntent() {
    if (G.gameOver) return;
    if (!guardAction('intent')) return;
    if (typeof ensureIntentState === 'function') ensureIntentState();
    renderIntentPopup();
    document.getElementById('intentPopup')?.classList.add('active');
}

// ----- DAO -----
function actionDao() {
    if (G.gameOver) return;
    if (!guardAction('dao')) return;
    renderDaoPopup();
    document.getElementById('daoPopup').classList.add('active');
}

// ----- INVENTORY -----
function actionInventory() {
    if (G.gameOver) return;
    renderInventoryPopup();
    document.getElementById('inventoryPopup').classList.add('active');
}

function applyRefinementEffect(effect) {
    if (!effect) return;
    if (effect.will) G.will += effect.will;
    if (effect.spirit) G.spirit += effect.spirit;
    if (effect.vitality) {
        G.vitality += effect.vitality;
        applyVitalityToMaxHp();
    }
    if (effect.foundation) grantFoundation(effect.foundation);
    if (effect.fame) {
        if (typeof addFame === 'function') addFame(effect.fame);
        else G.fame += effect.fame;
    }
    if (effect.defenseBonus) G.defenseBonus = (G.defenseBonus || 0) + effect.defenseBonus;
    if (effect.regenBonus) G.regenBonus = (G.regenBonus || 0) + effect.regenBonus;
    if (effect.mawDoubtResist) G.mawDoubtResist = (G.mawDoubtResist || 0) + effect.mawDoubtResist;
    if (effect.forbiddenLifespanMult) {
        G.forbiddenLifespanMult = (G.forbiddenLifespanMult || 1) + effect.forbiddenLifespanMult;
    }
    if (effect.crucibleRegenMult) {
        G.crucibleRegenMult = (G.crucibleRegenMult || 1) + effect.crucibleRegenMult;
    }
}

function refineLegendaryMaterial(materialName) {
    if (actionBlocked()) return;
    const recipe = LEGENDARY_REFINEMENTS[materialName];
    if (!recipe) return;
    if (!G.refinedLegendary) G.refinedLegendary = [];
    if (G.refinedLegendary.includes(materialName)) {
        addLog(`🏆 ${materialName} was already refined.`);
        fullRender();
        return;
    }
    if (!G.legendaryMaterials || !G.legendaryMaterials.includes(materialName)) {
        addLog(`🏆 You do not hold ${materialName}.`);
        fullRender();
        return;
    }
    if (G.stones < recipe.stones) {
        addLog(`💎 Need ${recipe.stones} Stones to refine ${materialName}.`);
        fullRender();
        return;
    }
    beginActionLog();
    if (!advanceTime(recipe.months, `Refining ${materialName} at the sect hall`)) {
        cancelActionLog();
        fullRender();
        return;
    }
    G.stones -= recipe.stones;
    G.refinedLegendary.push(materialName);
    applyRefinementEffect(recipe.effect);
    commitActionLog(`🏆 Refinement complete: ${materialName}. ${recipe.log}`);
    renderSectPopup();
    renderInventoryPopup();
    fullRender();
}

// ----- ANCIENT SEARCH -----
function actionSearch() {
    if (actionBlocked()) return;
    if (!guardAction('search')) return;
    if (typeof getSearchBlockReason !== 'function' || typeof performAncientSearch !== 'function') {
        addLog('🔍 The sealed sites remain beyond your reach.');
        fullRender();
        return;
    }
    const block = getSearchBlockReason();
    if (block) {
        addLog(`🔍 ${block}`);
        fullRender();
        return;
    }
    const result = performAncientSearch();
    if (result.message) {
        addLog(result.success && result.revealed ? `🗝️ ${result.message}` : `🔍 ${result.message}`);
    }
    fullRender();
}