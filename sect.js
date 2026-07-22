// ============================================
// SECT.JS — Sect progression, buildings, disciples
// ============================================

function createEmptySectState() {
    const buildings = {};
    Object.keys(SECT_BUILDINGS).forEach(id => { buildings[id] = 0; });
    return {
        stage: 'wandering',
        name: null,
        renown: 0,
        resources: { stones: 0, spiritHerbs: 0, ironOre: 0 },
        buildings,
        discipleRecords: [],
        rivals: [],
        worldSects: [],
        alliances: [],
        influenceZone: null,
        foundedAtMonths: null,
        foundedZone: null,
        foundedLocationId: null,
        doctrine: null,
        reputation: { respect: 0, fear: 0, reviled: 0, actions: 0 },
        lastSectActionMonths: null,
        lastEventMonths: null,
        pendingEvent: null,
        chronicle: [],
        heirlooms: [],
        treasures: [],
        alliedSects: [],
        grudgeSects: [],
        leaderGeneration: 1,
        treasureEnshrinedThisLeader: false,
        legendUnlocked: false,
        sectSpiritUnlocked: false,
        inventory: { stones: 0, materials: {}, items: [] },
        residence: { level: 0, stash: [], lastRestMonths: null, formations: { slots: [] } },
        construction: null,
        buildingMeta: { spirit_garden: { pendingHerbs: 0 } },
        groundsView: 'map'
    };
}

function ensureSectState() {
    if (!G.sect) G.sect = createEmptySectState();
    if (!G.sect.buildings) {
        G.sect.buildings = {};
        Object.keys(SECT_BUILDINGS).forEach(id => { G.sect.buildings[id] = 0; });
    } else {
        Object.keys(SECT_BUILDINGS).forEach(id => {
            if (G.sect.buildings[id] == null) G.sect.buildings[id] = 0;
        });
    }
    if (!G.sect.discipleRecords) G.sect.discipleRecords = [];
    if (!G.sect.resources) G.sect.resources = { stones: 0, spiritHerbs: 0, ironOre: 0 };
    if (!G.sect.rivals) G.sect.rivals = [];
    if (!G.sect.worldSects) G.sect.worldSects = [];
    migrateWorldSectsFromLegacy();
    if (!G.sect.alliances) G.sect.alliances = [];
    if (G.sect.foundedZone === undefined) G.sect.foundedZone = null;
    if (G.sect.foundedLocationId === undefined) G.sect.foundedLocationId = null;
    ensureSectReputation();
    if (G.sect.stage && G.sect.stage !== 'wandering' && !G.sect.doctrine) inferSectDoctrineFromAlignment();
    syncDisciplesFromLegacy();
    syncSectLegacyFields();
    G.sect.discipleRecords.forEach(d => {
        if (!d.knownTechniques) d.knownTechniques = [];
    });
    if (typeof ensureResidenceStash === 'function') ensureResidenceStash();
}

function ensureSectReputation() {
    if (!G.sect) return;
    if (!G.sect.reputation) {
        G.sect.reputation = { respect: 0, fear: 0, reviled: 0, actions: 0 };
    }
}

function inferSectDoctrineFromAlignment() {
    const align = G.daoAlignment || 0;
    if (align >= 30) G.sect.doctrine = 'righteous';
    else if (align <= -30) G.sect.doctrine = 'shadow';
    else G.sect.doctrine = 'balanced';
}

function getSectDoctrineId() {
    ensureSectState();
    return G.sect.doctrine || null;
}

function getSectDoctrineDef(doctrineId) {
    const id = doctrineId || getSectDoctrineId();
    return id ? SECT_DOCTRINES[id] : null;
}

function addSectRenown(amount) {
    ensureSectState();
    if (!amount) return 0;
    if (amount < 0) {
        G.sect.renown = Math.max(0, (G.sect.renown || 0) + amount);
        return amount;
    }
    const def = getSectDoctrineDef();
    let mult = def?.renownMult || 1;
    if (typeof getSectLegendRenownMult === 'function') mult *= getSectLegendRenownMult();
    if (typeof getSectDoctrineAlignmentSynergy === 'function') {
        const synergy = getSectDoctrineAlignmentSynergy();
        if (synergy?.renownMultBonus) mult += synergy.renownMultBonus;
    }
    const final = Math.ceil(amount * mult);
    G.sect.renown = (G.sect.renown || 0) + final;
    return final;
}

function shiftSectReputation(deltaKey, customDelta) {
    if (!isSectFounded()) return;
    ensureSectReputation();
    const delta = customDelta || SECT_REPUTATION_DELTAS[deltaKey];
    if (!delta) return;
    const r = G.sect.reputation;
    const prevTier = getSectReputationTier().id;
    if (delta.respect) r.respect = Math.max(0, r.respect + delta.respect);
    if (delta.fear) r.fear = Math.max(0, r.fear + delta.fear);
    if (delta.reviled) r.reviled = Math.max(0, r.reviled + delta.reviled);
    r.actions = (r.actions || 0) + 1;
    const nextTier = getSectReputationTier().id;
    if (nextTier !== prevTier && nextTier !== 'unknown') {
        const tier = SECT_REPUTATION_TIERS[nextTier];
        addLog(`📣 Sect reputation shifts — now ${tier.emoji} ${tier.label}.`);
    }
}

function getSectReputationTier() {
    if (!G.sect) return SECT_REPUTATION_TIERS.unknown;
    ensureSectReputation();
    const r = G.sect.reputation;
    const respect = r.respect || 0;
    const fear = r.fear || 0;
    const reviled = r.reviled || 0;
    const actions = r.actions || 0;
    const th = SECT_REPUTATION_TIERS.respected.threshold;

    if (actions < 1 && !isSectFounded()) return SECT_REPUTATION_TIERS.unknown;
    if (reviled >= th && reviled >= fear && reviled >= respect) return SECT_REPUTATION_TIERS.reviled;
    if (fear >= th && fear > respect) return SECT_REPUTATION_TIERS.feared;
    if (respect >= th) return SECT_REPUTATION_TIERS.respected;
    if (actions < 2 && respect < 8 && fear < 8 && reviled < 8) return SECT_REPUTATION_TIERS.unknown;
    if (reviled > fear && reviled > respect && reviled >= 8) return SECT_REPUTATION_TIERS.reviled;
    if (fear > respect && fear >= 8) return SECT_REPUTATION_TIERS.feared;
    if (respect >= 8) return SECT_REPUTATION_TIERS.respected;
    return SECT_REPUTATION_TIERS.unknown;
}

function getSectIncomeMult() {
    const def = getSectDoctrineDef();
    let mult = def?.incomeMult || 1;
    if (typeof getSectTraitIncomeMult === 'function') mult *= getSectTraitIncomeMult();
    if (typeof getSectAllianceIncomeMult === 'function') mult *= getSectAllianceIncomeMult();
    if (typeof getSectMarriageAllianceIncomeBonusPct === 'function') {
        mult *= 1 + getSectMarriageAllianceIncomeBonusPct() / 100;
    }
    if (typeof getSectLegendIncomeBonusPct === 'function') {
        mult *= 1 + getSectLegendIncomeBonusPct() / 100;
    }
    if (typeof getSectSpiritIncomeBonusPct === 'function') {
        mult *= 1 + getSectSpiritIncomeBonusPct() / 100;
    }
    if (typeof getSectHeirloomBonuses === 'function') mult *= getSectHeirloomBonuses().incomeMult;
    else if (typeof getSectTreasureBonuses === 'function') mult *= getSectTreasureBonuses().incomeMult;
    return mult;
}

function getSectCombatMult() {
    const def = getSectDoctrineDef();
    let mult = def?.combatMult || 1;
    if (typeof getSectDoctrineAlignmentSynergy === 'function') {
        const synergy = getSectDoctrineAlignmentSynergy();
        if (synergy?.combatMultBonus) mult += synergy.combatMultBonus;
    }
    if (typeof getSectTraitCombatMult === 'function') mult *= getSectTraitCombatMult();
    mult *= 1 + getSectBuildingBonus('armoryCombatPct') / 100;
    if (typeof getSectDefensePactCombatBonusPct === 'function') {
        mult *= 1 + getSectDefensePactCombatBonusPct() / 100;
    }
    if (typeof getSectHeirloomBonuses === 'function') mult *= getSectHeirloomBonuses().combatMult;
    else if (typeof getSectTreasureBonuses === 'function') mult *= getSectTreasureBonuses().combatMult;
    if (typeof getSectSpiritCombatMult === 'function') mult *= getSectSpiritCombatMult();
    if (typeof getSectReputationPerk === 'function') {
        const perk = getSectReputationPerk();
        if (perk?.combatMult) mult *= perk.combatMult;
    }
    return mult;
}

function getSectTradePriceMult() {
    const def = getSectDoctrineDef();
    return def?.tradePriceMult || 1;
}

function getSectRecruitTalkMin() {
    const base = SECT_NPC_RECRUIT.talkCountMin;
    const def = getSectDoctrineDef();
    let min = Math.max(1, base - (def?.recruitTalkReduction || 0));
    if (typeof getSectReputationPerk === 'function') {
        const perk = getSectReputationPerk();
        if (perk?.recruitTalkReduction) min = Math.max(1, min - perk.recruitTalkReduction);
    }
    return min;
}

function getSectWorldNpcMoodShift() {
    const def = getSectDoctrineDef();
    let shift = def?.npcMoodShift || 0;
    const tier = getSectReputationTier().id;
    if (tier === 'respected') shift += 1;
    if (tier === 'feared' || tier === 'reviled') shift -= 1;
    return shift;
}

function renderSectReputationMeterHtml() {
    if (!G.sect) return '';
    ensureSectReputation();
    const tier = getSectReputationTier();
    const r = G.sect.reputation;
    const max = 20;
    const bar = (val, cls, label) => {
        const pct = Math.min(100, Math.round((val / max) * 100));
        return `<div class="rep-bar-row"><span class="rep-bar-label">${label}</span><div class="rep-bar-track"><div class="rep-bar-fill ${cls}" style="width:${pct}%"></div></div><span class="rep-bar-val">${val}</span></div>`;
    };
    return `<div class="sect-reputation-panel">
        <div class="sect-reputation-header">${tier.emoji} <strong>${tier.label}</strong></div>
        <div class="sect-reputation-desc">${tier.desc}</div>
        ${bar(r.respect || 0, 'respect', '🌿 Respect')}
        ${bar(r.fear || 0, 'fear', '😨 Fear')}
        ${bar(r.reviled || 0, 'reviled', '💀 Reviled')}
    </div>`;
}

function renderDoctrinePickerHtml() {
    const selected = 'balanced';
    return `<div class="sect-section-title">📜 Choose Your Doctrine</div>
        <p class="sect-hint">This defines your sect's culture — permanent for this legacy.</p>
        <div class="sect-doctrine-picker">
        ${Object.values(SECT_DOCTRINES).map(d => `
            <button type="button" class="sect-doctrine-card${d.id === selected ? ' selected' : ''}" data-sect-doctrine="${d.id}">
                <div class="sect-doctrine-card-head">${d.emoji} ${d.label}</div>
                <div class="sect-doctrine-card-sub">${d.subtitle}</div>
                <div class="sect-doctrine-card-desc">${d.desc}</div>
            </button>
        `).join('')}
        </div>`;
}

function syncDisciplesFromLegacy() {
    if (!G.sect?.discipleRecords) return;
    (G.disciples || []).forEach(name => {
        if (typeof name !== 'string') return;
        if (!G.sect.discipleRecords.some(d => d.name === name)) {
            G.sect.discipleRecords.push(createDiscipleRecord(name, 'acolyte'));
        }
    });
}

function migrateSectForExistingSave() {
    ensureSectState();
    if (G._sectMigrated) return;
    const legacyNames = (G.disciples || []).filter(n => typeof n === 'string');
    const hadNamedSect = G.sectName && G.sectName !== 'Wandering Sect';
    if (G.sect.stage === 'wandering' && (legacyNames.length > 0 || hadNamedSect)) {
        G.sect.stage = 'founding';
        G.sect.name = G.sectName || (G.name + "'s Sect");
        G.sect.foundedAtMonths = G.sect.foundedAtMonths || G.ageMonths || 0;
        G.sect.renown = Math.max(G.sect.renown, legacyNames.length * 3 + Math.floor((G.fame || 0) / 5));
    }
    legacyNames.forEach(name => {
        if (!G.sect.discipleRecords.some(d => d.name === name)) {
            G.sect.discipleRecords.push(createDiscipleRecord(name, 'acolyte'));
        }
    });
    if (G.sect.stage !== 'wandering' && !G.sect.name) {
        G.sect.name = G.sectName || (G.name + "'s Sect");
    }
    if (isSectFounded() && !G.sect.doctrine) inferSectDoctrineFromAlignment();
    if (isSectFounded()) {
        if (typeof ensureSectGroundsView === 'function') ensureSectGroundsView();
        if (typeof ensureSectInventory === 'function') ensureSectInventory();
        if (typeof ensureSectBuildingMeta === 'function') ensureSectBuildingMeta();
        if (!G.sect.residence) G.sect.residence = { level: 0, stash: [], lastRestMonths: null, formations: { slots: [] } };
        if (typeof migrateFormationsForExistingSave === 'function') migrateFormationsForExistingSave();
    }
    syncSectLegacyFields();
    G._sectMigrated = true;
}

function syncSectLegacyFields() {
    if (!G.sect) return;
    if (G.sect.stage === 'wandering') {
        G.sectName = null;
    } else {
        G.sectName = G.sect.name || (G.name + "'s Sect");
        G.sect.name = G.sectName;
    }
    G.disciples = G.sect.discipleRecords.map(d => d.name);
}

function getSectStageId() {
    if (!G.sect) return 'wandering';
    return G.sect.stage || 'wandering';
}

function getSectStageDef(stageId) {
    return SECT_STAGES[stageId || getSectStageId()] || SECT_STAGES.wandering;
}

function isSectFounded() {
    return getSectStageId() !== 'wandering';
}

function getSectDisplayName() {
    ensureSectState();
    if (!isSectFounded()) return 'None';
    return G.sect.name || G.sectName || 'Unnamed Sect';
}

function getSectAlignmentTag() {
    const align = G.daoAlignment || 0;
    if (align >= (SECT_ALIGNMENT_TAGS.righteous?.min ?? 40)) {
        return SECT_ALIGNMENT_TAGS.righteous;
    }
    if (align <= (SECT_ALIGNMENT_TAGS.demonic?.max ?? -40)) {
        return SECT_ALIGNMENT_TAGS.demonic;
    }
    return SECT_ALIGNMENT_TAGS.balanced;
}

function getStageOrder(stageId) {
    return SECT_STAGES[stageId]?.order ?? 0;
}

function meetsStageRequirement(minStageId) {
    return getStageOrder(getSectStageId()) >= getStageOrder(minStageId);
}

function getBuildingLevel(buildingId) {
    ensureSectState();
    return G.sect.buildings[buildingId] || 0;
}

function getTotalBuildingLevels() {
    ensureSectState();
    return Object.values(G.sect.buildings).reduce((s, lv) => s + (lv || 0), 0);
}

function getSectBuildingBonus(effectKey) {
    ensureSectState();
    let total = 0;
    Object.entries(SECT_BUILDINGS).forEach(([id, def]) => {
        if (!def.implemented) return;
        const lv = getBuildingLevel(id);
        if (lv <= 0) return;
        if (def.effectKey === effectKey) {
            total += lv * (def.effectPerLevel || 0);
        }
        (def.extraEffects || []).forEach(ex => {
            if (ex.effectKey === effectKey) {
                total += lv * (ex.effectPerLevel || 0);
            }
        });
    });
    return total;
}

function getSectCultivationMult() {
    let mult = 1 + getSectBuildingBonus('cultivationSpeedPct') / 100;
    mult += getSectBuildingBonus('daoSpeedPct') / 100;
    if (typeof getMeditationChamberFormationEffects === 'function') {
        const chamberFx = getMeditationChamberFormationEffects();
        if (chamberFx.cultivatePct) mult += chamberFx.cultivatePct / 100;
    }
    if (typeof getSectInfluenceCultivateMult === 'function') {
        mult *= getSectInfluenceCultivateMult();
    }
    if (typeof getSectHeirloomBonuses === 'function') mult *= getSectHeirloomBonuses().cultivateMult;
    if (typeof getSectSpiritCultivateMult === 'function') mult *= getSectSpiritCultivateMult();
    return mult;
}

function getSectPassiveIncomeBonus() {
    return getSectBuildingBonus('passiveIncomePct');
}

function getSectEventStoneLossMult() {
    let mult = typeof getSectTraitEventStoneLossMult === 'function' ? getSectTraitEventStoneLossMult() : 1;
    const vaultSave = getSectBuildingBonus('vaultStoneSavePct');
    let defense = getSectBuildingBonus('defenseRating');
    if (typeof getSectFormationDefenseRatingBonus === 'function') {
        defense += getSectFormationDefenseRatingBonus();
    }
    if (vaultSave > 0) {
        const soften = Math.min(0.6, vaultSave / 100);
        if (mult > 1) mult = 1 + (mult - 1) * (1 - soften);
        else if (mult < 1) mult = Math.max(mult, 1 - soften * 0.35);
    }
    if (defense > 0 && mult < 1) {
        mult = Math.max(0.45, mult + (defense / 100) * 0.35);
    }
    return mult;
}

function applyTrainingGroundCombatXp() {
    const pct = getSectBuildingBonus('combatXpPct');
    if (!pct || !G.techniques?.length) return 0;
    const uses = Math.max(1, Math.floor(pct / 5));
    const tech = G.techniques[Math.floor(Math.random() * G.techniques.length)];
    tech.uses = (tech.uses || 0) + uses;
    return uses;
}

function applySectCultivateBuildingEffects(statGain) {
    if (!isSectFounded()) return [];
    const notes = [];

    const herbYield = getSectBuildingBonus('spiritHerbPerLevel');
    if (herbYield > 0) {
        if (typeof addSpiritGardenPendingHerbs === 'function') {
            addSpiritGardenPendingHerbs(herbYield);
            notes.push(`Garden +${herbYield} herb${herbYield > 1 ? 's' : ''} (ready to harvest)`);
        } else if (typeof addCraftMaterial === 'function') {
            addCraftMaterial('spirit_herb', herbYield);
            notes.push(`Garden +${herbYield} herb${herbYield > 1 ? 's' : ''}`);
        }
    }

    const beastChance = getSectBuildingBonus('beastMaterialChancePct') / 100;
    if (beastChance > 0 && Math.random() < beastChance && typeof addCraftMaterial === 'function') {
        const matId = Math.random() < 0.65 ? 'leather_scrap' : 'demon_core';
        addCraftMaterial(matId, 1);
        const matName = CRAFT_MATERIALS[matId]?.name || matId;
        notes.push(`Beast Pen +1 ${matName}`);
    }

    const medPct = getSectBuildingBonus('meditationStatPct');
    if (medPct > 0 && statGain > 0) {
        const extra = Math.max(1, Math.floor(statGain * medPct / 100));
        G.will += extra;
        G.spirit += extra;
        notes.push(`Chamber +${extra} Will/Spirit`);
    }

    if (typeof getMeditationChamberFormationEffects === 'function') {
        const chamberFx = getMeditationChamberFormationEffects();
        if (chamberFx.foundationPerCultivate > 0 && typeof grantFoundation === 'function') {
            grantFoundation(chamberFx.foundationPerCultivate);
            notes.push(`Chamber formation +${chamberFx.foundationPerCultivate} Foundation`);
        }
        if (chamberFx.labels?.length) {
            notes.push(`Running: ${chamberFx.labels.join(', ')}`);
        }
    }

    return notes;
}

function getDiscipleCount() {
    ensureSectState();
    return G.sect.discipleRecords.length;
}

function createDiscipleRecord(name, role) {
    const trait = typeof rollDiscipleTraitId === 'function' ? rollDiscipleTraitId() : 'loyal';
    return {
        uid: `disc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        name,
        role: role || 'acolyte',
        trait,
        joinedMonths: G.ageMonths || 0,
        knownTechniques: []
    };
}

function addSectDisciple(name, role, options) {
    ensureSectState();
    options = options || {};
    if (G.sect.discipleRecords.some(d => d.name === name)) return null;
    const record = createDiscipleRecord(name, role || 'acolyte');
    G.sect.discipleRecords.push(record);
    syncSectLegacyFields();
    if (options.announceTrait !== false && typeof getDiscipleTraitDef === 'function') {
        const td = getDiscipleTraitDef(record.trait);
        addLog(`${td.emoji} ${name} shows a ${td.label.toLowerCase()} temperament — ${td.desc}`);
    }
    return record;
}

function rollRecruitName() {
    const pool = SECT_RECRUIT_NAMES.filter(n =>
        !G.sect.discipleRecords.some(d => d.name === n)
    );
    const names = pool.length ? pool : SECT_RECRUIT_NAMES;
    return names[Math.floor(Math.random() * names.length)];
}

function getFoundSectBlockReason() {
    ensureSectState();
    if (isSectFounded()) return 'You already lead a sect.';
    const req = SECT_FOUNDING;
    if ((G.fame || 0) < req.fameMin) return `Need ${req.fameMin} Fame to attract followers (have ${G.fame || 0}).`;
    if ((G.stones || 0) < req.stones) return `Need ${req.stones} Spirit Stones for founding rites.`;
    return null;
}

function canFoundSect() {
    return !getFoundSectBlockReason();
}

function foundSect(customName, doctrineId) {
    ensureSectState();
    const block = getFoundSectBlockReason();
    if (block) return { success: false, message: block };
    if (!doctrineId || !SECT_DOCTRINES[doctrineId]) {
        return { success: false, message: 'Choose a Doctrine before founding your sect.' };
    }
    const req = SECT_FOUNDING;
    const months = req.months || ACTION_MONTHS.sectFound;
    const sectName = (customName || '').trim() || (G.name + "'s Sect");
    if (!advanceTime(months, `Founding ${sectName}`)) {
        return { success: false, message: 'Your lifespan ends before the rite completes.' };
    }
    G.stones -= req.stones;
    G.sect.stage = 'founding';
    G.sect.name = sectName;
    G.sect.doctrine = doctrineId;
    G.sect.foundedAtMonths = G.ageMonths;
    G.sect.foundedZone = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    G.sect.foundedLocationId = typeof getCurrentLocationId === 'function'
        ? getCurrentLocationId()
        : (G.currentLocation || null);
    addSectRenown(req.renownGain || 0);
    G.fame += req.fameGain || 0;
    shiftSectReputation('found_' + doctrineId);
    syncSectLegacyFields();
    const doc = SECT_DOCTRINES[doctrineId];
    addLog(`🏯 ${G.name} founds ${sectName}! The first stone is laid — your legacy begins.`);
    addLog(`📜 Doctrine sworn: ${doc.emoji} ${doc.label} (${doc.subtitle}).`);
    if (typeof appendSectChronicle === 'function') {
        appendSectChronicle(`${G.name} founded ${sectName} under the ${doc.label}.`, '🏯');
    }
    if (typeof markSectActivity === 'function') markSectActivity();
    if (typeof shiftDaoAlignmentHelp === 'function' && doctrineId === 'righteous') {
        shiftDaoAlignmentHelp('founding a righteous sect');
    }
    if (typeof maybeTriggerSectAlignmentFriction === 'function') maybeTriggerSectAlignmentFriction();
    if (typeof triggerTutorial === 'function') triggerTutorial('first_sect');
    if (typeof notifyActionUnlocksFromChange === 'function') notifyActionUnlocksFromChange();
    if (typeof ensureSectGroundsView === 'function') ensureSectGroundsView();
    G.sect.residence = { level: 0, stash: [], lastRestMonths: null, formations: { slots: [] } };
    G.sect.groundsView = 'map';
    return { success: true, message: `${sectName} founded under the ${doc.label}.` };
}

function getAdvanceSectBlockReason() {
    ensureSectState();
    const stage = getSectStageDef();
    if (!stage.next) return 'Your sect has reached the apex of mortal influence.';
    const next = SECT_STAGES[stage.next];
    if (!next) return 'No further advancement defined.';
    const req = stage.advanceReq || {};
    if ((G.sect.renown || 0) < scalePlayerRenownCost(req.renown || 0)) {
        return `Need ${scalePlayerRenownCost(req.renown || 0)} Sect Renown (have ${G.sect.renown || 0}).`;
    }
    if (getDiscipleCount() < (req.disciples || 0)) {
        return `Need ${req.disciples} disciples (have ${getDiscipleCount()}).`;
    }
    if ((req.realmIdx || 0) > getGateRealmTier()) {
        const realmLabel = typeof formatGateRealmRequirement === 'function'
            ? formatGateRealmRequirement(req.realmIdx)
            : (PATHS[G.path].realms[req.realmIdx] || `Realm ${req.realmIdx + 1}`);
        return `The sect leader must reach ${realmLabel}.`;
    }
    if ((req.buildingLevels || 0) > getTotalBuildingLevels()) {
        return `Need ${req.buildingLevels} total building levels (have ${getTotalBuildingLevels()}).`;
    }
    return null;
}

function canAdvanceSectStage() {
    return !getAdvanceSectBlockReason();
}

function advanceSectStage() {
    ensureSectState();
    const block = getAdvanceSectBlockReason();
    if (block) return { success: false, message: block };
    const stage = getSectStageDef();
    const next = SECT_STAGES[stage.next];
    const prevId = G.sect.stage;
    G.sect.stage = next.id;
    addSectRenown(5);
    onSectStageAdvanced(prevId, next.id);
    syncSectLegacyFields();
    if (typeof markSectActivity === 'function') markSectActivity();
    addLog(`🏯 ${G.sect.name} advances to ${next.emoji} ${next.label}! ${next.desc}`);
    return { success: true, message: `Now a ${next.label}.` };
}

function onSectStageAdvanced(prevId, newId) {
    ensureSectState();
    if (newId === 'established') spawnProceduralWorldSects();
    if (newId === 'regional' && !G.sect.influenceZone) {
        const zoneId = typeof getActiveZoneId === 'function' ? getActiveZoneId() : G.currentZone;
        G.sect.influenceZone = zoneId;
        const zone = ZONES[zoneId];
        addLog(`🌏 ${G.sect.name} claims regional influence over ${zone?.emoji || ''} ${zone?.name || zoneId}.`);
    }
    if (typeof appendSectChronicle === 'function') {
        const stageDef = SECT_STAGES[newId];
        appendSectChronicle(`${G.sect.name} advanced to ${stageDef?.label || newId}.`, stageDef?.emoji || '🏯');
    }
}

// ----- Procedural world sects -----

function normalizeWorldSectRelationship(rel) {
    if (rel === 'allied' || rel === 'grudge') return rel === 'allied' ? 'friendly' : 'hostile';
    if (rel === 'hostile' || rel === 'friendly' || rel === 'neutral') return rel;
    return 'neutral';
}

function legacyRivalToWorldSect(rival) {
    return {
        id: rival.id || `wsect_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
        name: rival.name,
        stage: rival.stage || 'established',
        doctrine: rival.doctrine || pickRandomSectDoctrineId(),
        renown: rival.renown || Math.max(5, Math.floor((G.sect.renown || 10) * 0.7)),
        power: rival.power || 0,
        zone: rival.zone,
        relationship: normalizeWorldSectRelationship(rival.relation || rival.relationship || 'hostile'),
        championName: rival.championName,
        championRealm: rival.championRealm ?? G.realmIdx,
        defeated: !!rival.defeated,
        allianceUntilMonths: rival.allianceUntilMonths || null,
        spawnedAtMonths: rival.spawnedAtMonths || G.ageMonths || 0,
        lastGrowthMonths: rival.lastGrowthMonths || G.ageMonths || 0
    };
}

function migrateWorldSectsFromLegacy() {
    if (!G.sect) return;
    if (G.sect.worldSects?.length) {
        syncLegacyRivalsFromWorldSects();
        return;
    }
    G.sect.worldSects = [];
    const seen = new Set();
    const pushUnique = (entry) => {
        if (!entry?.name || seen.has(entry.id)) return;
        seen.add(entry.id);
        const ws = legacyRivalToWorldSect(entry);
        ws.power = calcWorldSectPower(ws);
        G.sect.worldSects.push(ws);
    };
    (G.sect.rivals || []).forEach(pushUnique);
    (G.sect.alliedSects || []).forEach(a => pushUnique({ ...a, relation: 'allied' }));
    (G.sect.grudgeSects || []).forEach(g => pushUnique({ ...g, relation: 'hostile' }));
    syncLegacyRivalsFromWorldSects();
}

function syncLegacyRivalsFromWorldSects() {
    G.sect.rivals = (G.sect.worldSects || []).map(ws => ({
        id: ws.id,
        name: ws.name,
        championName: ws.championName,
        championRealm: ws.championRealm,
        zone: ws.zone,
        relation: ws.relationship === 'friendly' ? 'allied' : ws.relationship === 'hostile' ? 'hostile' : 'neutral',
        relationship: ws.relationship,
        allianceUntilMonths: ws.allianceUntilMonths,
        defeated: ws.defeated,
        stage: ws.stage,
        doctrine: ws.doctrine,
        renown: ws.renown,
        power: ws.power
    }));
    G.sect.alliedSects = (G.sect.worldSects || []).filter(s => s.relationship === 'friendly' && !s.defeated);
    G.sect.grudgeSects = (G.sect.worldSects || []).filter(s => s.relationship === 'hostile' && !s.defeated);
}

function pickRandomSectDoctrineId() {
    const ids = Object.keys(SECT_DOCTRINES);
    return ids[Math.floor(Math.random() * ids.length)] || 'balanced';
}

function pickWeightedWorldRelationship() {
    const w = SECT_WORLD_BALANCE.relationshipWeights;
    const roll = Math.random();
    if (roll < w.hostile) return 'hostile';
    if (roll < w.hostile + w.friendly) return 'friendly';
    return 'neutral';
}

function pickWorldSectStageId() {
    const pool = SECT_WORLD_BALANCE.stagePoolAtEstablished;
    let stageId = pool[Math.floor(Math.random() * pool.length)] || 'established';
    const playerStage = getSectStage();
    const playerOrder = SECT_STAGES[playerStage]?.order || 2;
    const stageOrder = SECT_STAGES[stageId]?.order || 1;
    if (stageOrder > playerOrder) stageId = playerStage;
    return stageId;
}

function pickWorldSectZone(excludeZones) {
    const zoneIds = Object.keys(ZONES).filter(z => !excludeZones.includes(z));
    const pool = zoneIds.length ? zoneIds : Object.keys(ZONES);
    return pool[Math.floor(Math.random() * pool.length)];
}

function rollWorldSectChampionName() {
    const pool = SECT_RECRUIT_NAMES.filter(n => !G.sect.discipleRecords.some(d => d.name === n));
    return pool.length
        ? pool[Math.floor(Math.random() * pool.length)]
        : SECT_RECRUIT_NAMES[Math.floor(Math.random() * SECT_RECRUIT_NAMES.length)];
}

function calcWorldSectPower(sect) {
    const stageOrder = SECT_STAGES[sect.stage]?.order || 1;
    const b = SECT_WORLD_BALANCE;
    let power = stageOrder * b.powerPerStageOrder + (sect.renown || 0) * b.powerPerRenown;
    const doc = SECT_DOCTRINES[sect.doctrine];
    if (doc?.combatMult) power *= doc.combatMult;
    if (sect.relationship === 'hostile') power *= 1.05;
    return Math.max(5, Math.floor(power));
}

function getPlayerSectPowerEstimate() {
    const stageOrder = SECT_STAGES[getSectStage()]?.order || 1;
    const renown = G.sect?.renown || 0;
    const b = SECT_WORLD_BALANCE;
    let power = stageOrder * b.powerPerStageOrder + renown * b.powerPerRenown;
    if (typeof getPlayerOffensivePower === 'function') {
        power = Math.max(power, Math.floor(getPlayerOffensivePower() * 0.35));
    }
    return Math.max(10, Math.floor(power));
}

function generateWorldSect(options) {
    options = options || {};
    const prefix = SECT_RIVAL_PREFIXES[Math.floor(Math.random() * SECT_RIVAL_PREFIXES.length)];
    const suffix = SECT_RIVAL_SUFFIXES[Math.floor(Math.random() * SECT_RIVAL_SUFFIXES.length)];
    const playerRenown = G.sect?.renown || 10;
    const b = SECT_WORLD_BALANCE;
    const renown = options.renown ?? Math.floor(
        playerRenown * (b.playerRenownSpawnMin + Math.random() * (b.playerRenownSpawnMax - b.playerRenownSpawnMin))
    );
    const stage = options.stage || pickWorldSectStageId();
    const doctrine = options.doctrine || pickRandomSectDoctrineId();
    const relationship = options.relationship || pickWeightedWorldRelationship();
    const cap = typeof getMaxCultivationRealmIdx === 'function' ? getMaxCultivationRealmIdx() : 6;
    const championRealm = clamp(
        G.realmIdx + (relationship === 'hostile' && Math.random() < 0.45 ? 1 : 0),
        0,
        cap
    );
    const sect = {
        id: options.id || `wsect_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        name: options.name || `${prefix} ${suffix}`,
        stage,
        doctrine,
        renown: Math.max(3, renown),
        power: 0,
        zone: options.zone || pickWorldSectZone(options.excludeZones || []),
        relationship,
        championName: options.championName || rollWorldSectChampionName(),
        championRealm,
        defeated: false,
        allianceUntilMonths: null,
        spawnedAtMonths: G.ageMonths || 0,
        lastGrowthMonths: G.ageMonths || 0
    };
    sect.power = calcWorldSectPower(sect);
    return sect;
}

function spawnProceduralWorldSects() {
    ensureSectState();
    migrateWorldSectsFromLegacy();
    if (!meetsStageRequirement('established')) return;
    if (G.sect.worldSects.length >= SECT_WORLD_BALANCE.spawnMin) return;

    const count = SECT_WORLD_BALANCE.spawnMin
        + Math.floor(Math.random() * (SECT_WORLD_BALANCE.spawnMax - SECT_WORLD_BALANCE.spawnMin + 1));
    const usedZones = [];
    const names = new Set(G.sect.worldSects.map(s => s.name));

    while (G.sect.worldSects.length < count) {
        let sect = generateWorldSect({ excludeZones: usedZones });
        let attempts = 0;
        while (names.has(sect.name) && attempts < 8) {
            sect = generateWorldSect({ excludeZones: usedZones });
            attempts++;
        }
        names.add(sect.name);
        usedZones.push(sect.zone);
        G.sect.worldSects.push(sect);
    }

    syncLegacyRivalsFromWorldSects();
    const hostile = G.sect.worldSects.filter(s => s.relationship === 'hostile');
    addLog(`🌏 The jianghu takes notice — ${G.sect.worldSects.length} sects now share your horizon.`);
    if (hostile.length) {
        addLog(`⚔️ ${hostile.map(s => s.name).join(', ')} watch with open hostility.`);
    }
    if (typeof appendSectChronicle === 'function') {
        appendSectChronicle(`${G.sect.worldSects.length} rival powers appear on the jianghu map.`, '🗺️');
    }
}

function ensureProceduralWorldSects() {
    ensureSectState();
    migrateWorldSectsFromLegacy();
    if (meetsStageRequirement('established') && G.sect.worldSects.length < SECT_WORLD_BALANCE.spawnMin) {
        spawnProceduralWorldSects();
    }
}

function getWorldSects() {
    ensureSectState();
    ensureProceduralWorldSects();
    return G.sect.worldSects || [];
}

function getWorldSectById(id) {
    return getWorldSects().find(s => s.id === id) || null;
}

function getWorldSectRelationshipDef(rel) {
    return SECT_RELATIONSHIPS[normalizeWorldSectRelationship(rel)] || SECT_RELATIONSHIPS.neutral;
}

function getPlayerSectDoctrineId() {
    return G.sect?.doctrine || 'balanced';
}

function getDoctrineDiplomacyMult(playerDoc, targetDoc) {
    const row = SECT_DOCTRINE_FRICTION.matrix[playerDoc] || SECT_DOCTRINE_FRICTION.matrix.balanced;
    return row[targetDoc] ?? 1;
}

function isOpposedDoctrine(playerDoc, targetDoc) {
    return SECT_DOCTRINE_FRICTION.opposedPair.some(([a, b]) =>
        (playerDoc === a && targetDoc === b) || (playerDoc === b && targetDoc === a)
    );
}

function getDoctrineFrictionHint(playerDoc, targetDoc) {
    const mult = getDoctrineDiplomacyMult(playerDoc, targetDoc);
    if (mult >= 1.1) return 'Doctrines align';
    if (mult <= 0.6) return 'Doctrines clash';
    return '';
}

function shiftWorldSectRelationship(sect, newRel, reason) {
    if (!sect) return;
    const old = normalizeWorldSectRelationship(sect.relationship);
    const next = normalizeWorldSectRelationship(newRel);
    if (old === next) return;
    sect.relationship = next;
    if (next !== 'friendly') sect.allianceUntilMonths = null;
    syncLegacyRivalsFromWorldSects();
    const relDef = getWorldSectRelationshipDef(next);
    addLog(`${relDef.emoji} ${sect.name} is now ${relDef.label.toLowerCase()} — ${reason}.`);
    if (typeof appendSectChronicle === 'function') {
        appendSectChronicle(`${sect.name}: ${old} → ${next} (${reason})`, relDef.emoji);
    }
    if (typeof markSectActivity === 'function') markSectActivity();
}

function applyWorldSectRelationshipDrift(trigger, options) {
    if (!isSectFounded() || !meetsStageRequirement('established')) return;
    ensureProceduralWorldSects();
    options = options || {};
    const cfg = SECT_WORLD_RELATIONS;
    const sects = getWorldSects().filter(s => !s.defeated);
    const playerDoc = getPlayerSectDoctrineId();
    const zone = options.zone || (typeof getActiveZoneId === 'function' ? getActiveZoneId() : G.currentZone);

    if (trigger === 'village_help') {
        const neutrals = sects.filter(s => s.relationship === 'neutral');
        if (!neutrals.length) return;
        neutrals.sort((a, b) => {
            const score = (s) => getDoctrineDiplomacyMult(playerDoc, s.doctrine) + (s.zone === zone ? cfg.helpDriftSameZoneBonus : 0);
            return score(b) - score(a);
        });
        const target = neutrals[0];
        const chance = cfg.helpDriftBase * getDoctrineDiplomacyMult(playerDoc, target.doctrine)
            + (target.zone === zone ? cfg.helpDriftSameZoneBonus : 0);
        if (Math.random() < chance) {
            shiftWorldSectRelationship(target, 'friendly', 'word of your aid to mortals spreads');
        }
        return;
    }

    if (trigger === 'defy_strong') {
        const strong = options.rival || sects.sort((a, b) => b.power - a.power)[0];
        if (strong && strong.relationship !== 'hostile') {
            shiftWorldSectRelationship(strong, 'hostile', 'you defied their envoys');
        }
        return;
    }

    if (trigger === 'vassal_accept') {
        const weak = options.rival || sects.filter(s => s.relationship === 'neutral').sort((a, b) => a.power - b.power)[0];
        if (weak) shiftWorldSectRelationship(weak, 'friendly', 'they swear protection oaths');
        return;
    }

    let drifts = 0;
    const victim = options.targetId ? getWorldSectById(options.targetId) : null;

    if (trigger === 'raid') {
        sects.forEach(s => {
            if (drifts >= cfg.maxWitnessDrifts) return;
            if (victim && s.id === victim.id) return;
            if (s.relationship === 'neutral' && Math.random() < cfg.raidNeutralToHostileChance) {
                shiftWorldSectRelationship(s, 'hostile', `outrage at your raid on ${victim?.name || 'a sect'}`);
                drifts++;
            } else if (s.relationship === 'friendly' && Math.random() < cfg.raidFriendlyToNeutralChance) {
                shiftWorldSectRelationship(s, 'neutral', 'disapproval of your brutality');
                drifts++;
            }
        });
        return;
    }

    if (trigger === 'duel_victory') {
        sects.forEach(s => {
            if (drifts >= cfg.maxWitnessDrifts) return;
            if (victim && s.id === victim.id) return;
            if (s.relationship === 'neutral' && Math.random() < cfg.duelVictoryNeutralToHostileChance) {
                shiftWorldSectRelationship(s, 'hostile', 'fear after your public duel victory');
                drifts++;
            } else if (s.relationship === 'friendly' && Math.random() < cfg.duelVictoryFriendlyToNeutralChance) {
                shiftWorldSectRelationship(s, 'neutral', 'unease at your growing aggression');
                drifts++;
            }
        });
    }
}

function calcNeutralPactChance(sect) {
    const playerDoc = getPlayerSectDoctrineId();
    let chance = SECT_DOCTRINE_FRICTION.pactBaseChance * getDoctrineDiplomacyMult(playerDoc, sect.doctrine);
    const tier = getSectReputationTier().id;
    if (tier === 'respected') chance += 0.08;
    if (tier === 'feared') chance -= 0.04;
    if ((G.sect.renown || 0) >= 40) chance += 0.06;
    if (isOpposedDoctrine(playerDoc, sect.doctrine)) chance -= 0.12;
    if (typeof getSectTraitDiplomacyBonus === 'function') chance += getSectTraitDiplomacyBonus();
    chance += getSectBuildingBonus('messengerDiplomacyPct') / 100;
    return clamp(chance, 0.15, 0.92);
}

function approachNeutralSectPact(sectId) {
    ensureSectState();
    if (!meetsStageRequirement('established')) {
        return { success: false, message: 'Reach Established Sect to approach neutral powers.' };
    }
    const sect = getWorldSectById(sectId);
    if (!sect || sect.defeated) return { success: false, message: 'Sect not found.' };
    if (sect.relationship !== 'neutral') {
        return { success: false, message: `${sect.name} is not neutral.` };
    }
    if ((G.sect.renown || 0) < SECT_DOCTRINE_FRICTION.pactRenownMin) {
        return { success: false, message: `Need ${SECT_DOCTRINE_FRICTION.pactRenownMin} Renown to send envoys.` };
    }
    if (typeof countFriendlyWorldSects === 'function' && countFriendlyWorldSects() >= SECT_DIPLOMACY.maxAlliedSects) {
        return { success: false, message: 'Too many allied sects already.' };
    }
    const months = SECT_DOCTRINE_FRICTION.pactMonths;
    const hint = getDoctrineFrictionHint(getPlayerSectDoctrineId(), sect.doctrine);
    if (!advanceTime(months, `Diplomatic envoys visit ${sect.name}`)) {
        return { success: false, message: 'Your lifespan ends during negotiations.' };
    }
    const chance = calcNeutralPactChance(sect);
    if (Math.random() >= chance) {
        shiftSectReputation('sect_event', { respect: -SECT_DOCTRINE_FRICTION.approachFailRespectLoss });
        const reason = isOpposedDoctrine(getPlayerSectDoctrineId(), sect.doctrine)
            ? 'your doctrines repel one another'
            : 'they remain cautious';
        addLog(`🤝 ${sect.name} declines a pact — ${reason}${hint ? ` (${hint})` : ''}.`);
        return { success: false, message: `${sect.name} declined.` };
    }
    sect.relationship = 'friendly';
    sect.allianceUntilMonths = G.ageMonths + SECT_CONFLICT_BALANCE.allianceMonths;
    syncLegacyRivalsFromWorldSects();
    shiftSectReputation('diplomatic_alliance', { respect: 2 });
    if (typeof markSectActivity === 'function') markSectActivity();
    if (typeof appendSectChronicle === 'function') {
        appendSectChronicle(`Pact formed with ${sect.name} through direct diplomacy.`, '🤝');
    }
    addLog(`🤝 ${sect.name} accepts your pact${hint ? ` — ${hint.toLowerCase()}` : ''}.`);
    return { success: true, message: `Allied with ${sect.name}.` };
}

function provokeNeutralSect(sectId) {
    ensureSectState();
    if (!meetsStageRequirement('established')) {
        return { success: false, message: 'Reach Established Sect to provoke rivals.' };
    }
    const sect = getWorldSectById(sectId);
    if (!sect || sect.defeated) return { success: false, message: 'Sect not found.' };
    if (sect.relationship !== 'neutral') {
        return { success: false, message: `${sect.name} is not neutral.` };
    }
    if ((G.sect.renown || 0) < SECT_DOCTRINE_FRICTION.provokeRenownMin) {
        return { success: false, message: `Need ${SECT_DOCTRINE_FRICTION.provokeRenownMin} Renown to provoke without losing face.` };
    }
    if (!advanceTime(SECT_DOCTRINE_FRICTION.provokeMonths, `Provoking ${sect.name}`)) {
        return { success: false, message: 'Your lifespan ends...' };
    }
    shiftWorldSectRelationship(sect, 'hostile', 'you publicly insult their honor');
    shiftSectReputation('declare_grudge', { fear: 2, respect: -1 });
    return { success: true, message: `${sect.name} is now hostile.` };
}

function tickWorldSectGrowth(monthsPassed) {
    if (!isSectFounded() || monthsPassed <= 0) return;
    ensureProceduralWorldSects();
    const b = SECT_WORLD_BALANCE;
    const playerPower = getPlayerSectPowerEstimate();
    const playerRenown = G.sect.renown || 0;
    const powerCap = Math.floor(playerPower * (1 + b.maxPowerAbovePlayerPct));
    const renownCap = Math.floor(playerRenown * (1 + b.maxRenownAbovePlayerPct));

    getWorldSects().forEach(s => {
        if (s.defeated) return;
        const elapsed = (G.ageMonths || 0) - (s.lastGrowthMonths || s.spawnedAtMonths || 0);
        if (elapsed < b.growthIntervalMonths) return;

        s.renown = Math.min(
            renownCap,
            (s.renown || 0) + b.renownGrowthMin + Math.floor(Math.random() * (b.renownGrowthMax - b.renownGrowthMin + 1))
        );
        if (typeof isWorldSectSanctioned === 'function' && isWorldSectSanctioned(s)) {
            s.renown = Math.max(3, (s.renown || 0) - 1);
        }

        const playerStageOrder = SECT_STAGES[getSectStage()]?.order || 2;
        const sectOrder = SECT_STAGES[s.stage]?.order || 1;
        if (sectOrder < playerStageOrder && Math.random() < 0.22) {
            const stages = Object.values(SECT_STAGES).filter(st => st.order > sectOrder && st.order <= playerStageOrder);
            if (stages.length) {
                s.stage = stages[Math.floor(Math.random() * stages.length)].id;
            }
        }

        s.power = Math.min(powerCap, calcWorldSectPower(s));
        s.lastGrowthMonths = G.ageMonths || 0;
    });
    syncLegacyRivalsFromWorldSects();
}

function ensureFirstRivalSect() {
    spawnProceduralWorldSects();
}

function generateRivalSect() {
    return generateWorldSect({ relationship: 'hostile' });
}

function getActiveRivals() {
    ensureSectState();
    tickSectAlliances();
    return getWorldSects().filter(s => !s.defeated && s.relationship === 'hostile');
}

function getActiveFriendlyWorldSects() {
    return getWorldSects().filter(s => !s.defeated && s.relationship === 'friendly');
}

function renderWorldSectsPanelHtml() {
    if (!meetsStageRequirement('established')) return '';
    ensureProceduralWorldSects();
    const sects = getWorldSects().filter(s => !s.defeated);
    if (!sects.length) {
        return `<p class="sect-hint">The jianghu is quiet — no rival powers registered yet.</p>`;
    }

    let html = `<div class="sect-section-title">🗺️ Jianghu Sects</div>`;
    html += `<p class="sect-hint">Rival powers grow alongside your sect. Aid villages to win friends; raids and duels shift the jianghu against you. Neutral sects can be approached or provoked directly.</p>`;
    html += `<div class="sect-world-list">`;

    sects.forEach(s => {
        const rel = getWorldSectRelationshipDef(s.relationship);
        const stageDef = SECT_STAGES[s.stage] || SECT_STAGES.established;
        const docDef = SECT_DOCTRINES[s.doctrine] || SECT_DOCTRINES.balanced;
        const zone = ZONES[s.zone];
        const frictionHint = getDoctrineFrictionHint(getPlayerSectDoctrineId(), s.doctrine);
        html += `<div class="sect-world-card rel-${s.relationship}">
            <div class="sect-world-head">
                <span class="sect-world-name">${s.name}</span>
                <span class="sect-world-rel">${rel.emoji} ${rel.label}</span>
            </div>
            <div class="sect-world-stats">
                <span>${stageDef.emoji} ${stageDef.label}</span>
                <span>${docDef.emoji} ${docDef.label}</span>
                <span>⭐ ${s.renown} Renown</span>
                <span>💢 ${s.power} Power</span>
            </div>
            <div class="sect-world-meta">${zone?.emoji || ''} ${zone?.name || s.zone}${frictionHint ? ` · <span class="sect-doctrine-hint">${frictionHint}</span>` : ''}${s.relationship === 'hostile' ? ` · Champion ${s.championName}` : ''}</div>
            <div class="sect-rival-actions">`;
        if (s.relationship === 'hostile') {
            html += `<button type="button" class="sect-conflict-btn" data-sect-duel="${s.id}">⚔️ Duel</button>`;
            html += `<button type="button" class="sect-conflict-btn raid" data-sect-raid="${s.id}">🏴 Raid</button>`;
            html += `<button type="button" class="sect-conflict-btn ally" data-sect-alliance="${s.id}">🤝 Pact</button>`;
        } else if (s.relationship === 'friendly') {
            html += `<span class="sect-hint-inline">Trade & defense ties active</span>`;
        } else {
            html += `<button type="button" class="sect-conflict-btn ally" data-sect-neutral-pact="${s.id}">🤝 Approach</button>`;
            html += `<button type="button" class="sect-conflict-btn raid" data-sect-neutral-grudge="${s.id}">⚔️ Provoke</button>`;
        }
        if (typeof renderWorldSectDiplomacyButtons === 'function') {
            html += renderWorldSectDiplomacyButtons(s);
        }
        html += `</div></div>`;
    });
    html += `</div>`;
    return html;
}

function tickSectAlliances() {
    ensureSectState();
    getWorldSects().forEach(s => {
        if (s.relationship === 'friendly' && s.allianceUntilMonths && G.ageMonths >= s.allianceUntilMonths) {
            if (typeof isWorldSectDiplomacyActive === 'function'
                && isWorldSectDiplomacyActive(s, 'marriageAllianceUntilMonths')) {
                s.allianceUntilMonths = s.marriageAllianceUntilMonths;
                return;
            }
            s.relationship = 'neutral';
            s.allianceUntilMonths = null;
            addLog(`⚖️ Your pact with ${s.name} expires — relations return to neutral.`);
        }
    });
    syncLegacyRivalsFromWorldSects();
}

function getDiscipleMonthsServed(disciple) {
    return Math.max(0, (G.ageMonths || 0) - (disciple.joinedMonths || 0));
}

function getPromoteBlockReason(uid) {
    ensureSectState();
    const d = G.sect.discipleRecords.find(x => x.uid === uid);
    if (!d) return 'Disciple not found.';
    const roleDef = DISCIPLE_ROLES[d.role];
    const req = roleDef?.promoteReq;
    if (!req) return 'Already at highest rank.';
    const renownReq = typeof getDisciplePromoteRenownRequired === 'function'
        ? getDisciplePromoteRenownRequired(d)
        : scalePlayerRenownCost(req.renown);
    if ((G.sect.renown || 0) < renownReq) {
        return `Need ${renownReq} Sect Renown (have ${G.sect.renown || 0}).`;
    }
    const monthsReq = typeof getDiscipleRequiredServiceMonths === 'function'
        ? getDiscipleRequiredServiceMonths(d)
        : req.monthsServed;
    const served = getDiscipleMonthsServed(d);
    const years = Math.floor(monthsReq / 12);
    if (served < monthsReq) {
        return `Needs ${years} years of service (${Math.floor(served / 12)}y so far).`;
    }
    return null;
}

function promoteDisciple(uid) {
    ensureSectState();
    const block = getPromoteBlockReason(uid);
    if (block) return { success: false, message: block };
    const d = G.sect.discipleRecords.find(x => x.uid === uid);
    const nextRole = DISCIPLE_ROLES[d.role].promoteReq.next;
    const nextDef = DISCIPLE_ROLES[nextRole];
    d.role = nextRole;
    addSectRenown(2);
    shiftSectReputation('promote_disciple');
    if (typeof getDiscipleTraitDef === 'function') {
        const traitDef = getDiscipleTraitDef(d.trait);
        if (traitDef?.respectOnPromote) {
            shiftSectReputation('promote_disciple', { respect: traitDef.respectOnPromote });
            addLog(`👑 ${d.name}'s noble bearing impresses the jianghu (+${traitDef.respectOnPromote} Respect).`);
        }
    }
    if (typeof markSectActivity === 'function') markSectActivity();
    addLog(`📿 ${d.name} promoted to ${nextDef.emoji} ${nextDef.label}!`);
    return { success: true, message: `${d.name} is now ${nextDef.label}.` };
}

function getSectInfluenceZone() {
    ensureSectState();
    if (!meetsStageRequirement('regional')) return null;
    return G.sect.influenceZone || null;
}

function getWorldSectsInZone(zoneId) {
    ensureSectState();
    if (!zoneId) return [];
    return (G.sect.worldSects || []).filter(s => s && !s.destroyed && s.zone === zoneId);
}

function getSectFoundedNearLabel() {
    ensureSectState();
    const zone = G.sect.foundedZone && ZONES[G.sect.foundedZone];
    const loc = G.sect.foundedLocationId && typeof WORLD_LOCATIONS !== 'undefined'
        ? WORLD_LOCATIONS[G.sect.foundedLocationId]
        : null;
    if (loc && zone) return `${loc.emoji} ${loc.name} · ${zone.emoji} ${zone.name}`;
    if (loc) return `${loc.emoji} ${loc.name}`;
    if (zone) return `${zone.emoji} ${zone.name}`;
    return null;
}

function isInSectInfluenceZone(zoneId) {
    const inf = getSectInfluenceZone();
    return inf && inf === (zoneId || (typeof getActiveZoneId === 'function' ? getActiveZoneId() : G.currentZone));
}

function getSectExploreBonus(zoneId) {
    if (!isInSectInfluenceZone(zoneId)) return null;
    return SECT_INFLUENCE;
}

function getSectInfluenceCultivateMult() {
    if (!isInSectInfluenceZone(typeof getActiveZoneId === 'function' ? getActiveZoneId() : G.currentZone)) return 1;
    return 1 + (SECT_INFLUENCE.cultivateBonusPct || 0) / 100;
}

function shiftSectInfluence(zoneId) {
    ensureSectState();
    if (!meetsStageRequirement('regional')) {
        return { success: false, message: 'Reach Regional Power to claim zone influence.' };
    }
    if (!ZONES[zoneId]) return { success: false, message: 'Unknown zone.' };
    if (G.sect.influenceZone === zoneId) {
        return { success: false, message: 'You already hold influence here.' };
    }
    if ((G.sect.renown || 0) < scalePlayerRenownCost(SECT_INFLUENCE.shiftRenownCost)) {
        return { success: false, message: `Need ${SECT_INFLUENCE.shiftRenownCost} Renown to shift influence.` };
    }
    const months = SECT_INFLUENCE.shiftMonths || 12;
    if (!advanceTime(months, `Expanding ${G.sect.name}'s influence to ${ZONES[zoneId].name}`)) {
        return { success: false, message: 'Your lifespan ends before the campaign completes.' };
    }
    G.sect.renown -= scalePlayerRenownCost(SECT_INFLUENCE.shiftRenownCost);
    G.sect.influenceZone = zoneId;
    addLog(`🌏 ${G.sect.name} now holds sway over ${ZONES[zoneId].emoji} ${ZONES[zoneId].name}.`);
    return { success: true, message: `Influence set to ${ZONES[zoneId].name}.` };
}

function canRecruitWorldNpc(npc) {
    ensureSectState();
    if (!isSectFounded()) return false;
    if (!npc?.alive || npc.recruitedToSect) return false;
    if (!SECT_NPC_RECRUIT.roles.includes(npc.role)) return false;
    if ((G.sect.renown || 0) < SECT_NPC_RECRUIT.renownMin) return false;
    if ((npc.talkCount || 0) < getSectRecruitTalkMin()) return false;
    if (G.sect.discipleRecords.some(d => d.name === npc.name)) return false;
    const recruitBlock = getRecruitBlockReason();
    return !recruitBlock;
}

function getRecruitWorldNpcBlockReason(npc) {
    if (!isSectFounded()) return 'Found your sect before recruiting wanderers.';
    if (!npc?.alive) return 'They are gone.';
    if (npc.recruitedToSect) return 'Already in your sect.';
    if (!SECT_NPC_RECRUIT.roles.includes(npc.role)) return 'This person is not suited to join as a disciple.';
    if ((G.sect.renown || 0) < SECT_NPC_RECRUIT.renownMin) {
        return `Need ${SECT_NPC_RECRUIT.renownMin} Sect Renown to recruit NPCs.`;
    }
    if ((npc.talkCount || 0) < getSectRecruitTalkMin()) {
        return `Speak with them more first (${getSectRecruitTalkMin()}+ talks).`;
    }
    return getRecruitBlockReason();
}

function recruitWorldNpcToSect(npc) {
    ensureSectState();
    const block = getRecruitWorldNpcBlockReason(npc);
    if (block) return { success: false, message: block };
    if (!advanceTime(ACTION_MONTHS.recruit, `Recruiting ${npc.name} to the sect`)) {
        return { success: false, message: 'Your lifespan ends before they swear oaths.' };
    }
    const record = addSectDisciple(npc.name, 'acolyte', { announceTrait: false });
    npc.alive = false;
    npc.recruitedToSect = true;
    addSectRenown(3);
    shiftSectReputation('npc_recruit');
    if (typeof markSectActivity === 'function') markSectActivity();
    G.fame += 2;
    if (record && typeof getDiscipleTraitDef === 'function') {
        const td = getDiscipleTraitDef(record.trait);
        addLog(`👤 ${npc.name} swears loyalty to ${G.sect.name} — ${td.emoji} ${td.label}.`);
    } else {
        addLog(`👤 ${npc.name} swears loyalty to ${G.sect.name}!`);
    }
    if (typeof generateSectQuest === 'function') generateSectQuest();
    return { success: true, message: `${npc.name} joins as an Acolyte.` };
}

function calcSectRivalCombatStats(rival) {
    const b = SECT_CONFLICT_BALANCE;
    const template = typeof pickNpcCombatTemplate === 'function'
        ? pickNpcCombatTemplate(rival.championRealm)
        : ENEMIES[Math.min(rival.championRealm, ENEMIES.length - 1)];
    let hp = calcEnemyHp(template, { context: 'normal' });
    let dmg = calcEnemyDamage(template, { context: 'normal' });
    hp = Math.floor(hp * b.rivalHpMult);
    dmg = Math.floor(dmg * b.rivalDmgMult);
    if (typeof isWorldSectEspionageActive === 'function' && isWorldSectEspionageActive(rival)) {
        const mult = SECT_DIPLOMACY_ACTIONS.espionage.powerMult || 0.85;
        hp = Math.floor(hp * mult);
        dmg = Math.floor(dmg * mult);
    }
    return { hp, dmg, template };
}

function startSectRivalDuel(rivalId) {
    ensureSectState();
    if (G.inCombat) return { success: false, message: 'Already in combat.' };
    const rival = getWorldSectById(rivalId) || G.sect.rivals.find(r => r.id === rivalId);
    if (!rival || rival.defeated) return { success: false, message: 'Rival not found.' };
    if (rival.relationship === 'friendly') {
        return { success: false, message: `You are allied with ${rival.name} for now.` };
    }
    if (rival.relationship !== 'hostile') {
        return { success: false, message: `${rival.name} is not hostile — declare a grudge or provoke them first.` };
    }
    if (!meetsStageRequirement('established')) {
        return { success: false, message: 'Reach Established Sect to challenge rivals.' };
    }
    const months = SECT_CONFLICT_BALANCE.duelMonths || ACTION_MONTHS.combatStart;
    if (!advanceTime(months, `Duel with ${rival.name}'s champion`)) {
        return { success: false, message: 'Your lifespan ends before the duel.' };
    }
    const stats = calcSectRivalCombatStats(rival);
    const label = `${rival.championName} (${rival.name})`;

    G.npcCombat = { rivalId: rival.id, type: 'sect_rival' };
    G.inCombat = true;
    G.defending = false;
    G.fortifyActive = false;
    G.combatLog = [];
    initCombatResource();
    updateShield();
    if (G.path === 'soul') G.shield = G.maxShield;

    G.enemy = {
        name: label,
        hp: stats.hp,
        maxHp: stats.hp,
        dmg: stats.dmg,
        originalDmg: stats.dmg,
        intimidateTurns: 0,
        isSectRivalCombat: true,
        rivalId: rival.id
    };
    G.enemyMaxHp = G.enemy.maxHp;

    addCombatLog(`⚔️ ${label} enters the arena! (${stats.hp} HP)`);
    if (typeof isWorldSectEspionageActive === 'function' && isWorldSectEspionageActive(rival)) {
        addCombatLog(`🕵️ Your spies have weakened their champion's readiness.`);
    }
    setupCombatActions();
    G.combatPhase = 'player';
    if (typeof clearCombatTurnTimer === 'function') clearCombatTurnTimer();
    if (typeof setCombatInputEnabled === 'function') setCombatInputEnabled(true);
    if (typeof updateCombatUI === 'function') updateCombatUI();
    document.getElementById('combatOverlay')?.classList.add('active');
    return { success: true, message: 'Duel begun.' };
}

function sectRivalDuelVictory() {
    ensureSectState();
    const ctx = G.npcCombat;
    const rivalId = ctx?.rivalId || G.enemy?.rivalId;
    const rival = getWorldSectById(rivalId) || G.sect.rivals.find(r => r.id === rivalId);
    const b = SECT_CONFLICT_BALANCE;
    if (rival) {
        rival.defeated = true;
        rival.relationship = 'neutral';
        syncLegacyRivalsFromWorldSects();
        addSectRenown(b.duelVictoryRenown);
        shiftSectReputation('sect_rival_victory');
        G.fame += b.duelVictoryFame;
        grantFoundation(b.duelVictoryFoundation);
        G.stones += b.duelVictoryStones;
        addLog(`🏆 ${rival.championName} falls! ${rival.name} acknowledges defeat (+${b.duelVictoryRenown} Renown).`);
        if (typeof applyWorldSectRelationshipDrift === 'function') {
            applyWorldSectRelationshipDrift('duel_victory', { targetId: rival.id });
        }
    }
}

function actionSectRaid(rivalId) {
    ensureSectState();
    if (!meetsStageRequirement('established')) {
        return { success: false, message: 'Reach Established Sect to raid.' };
    }
    if (getDiscipleCount() < SECT_CONFLICT_BALANCE.raidMinDisciples) {
        return { success: false, message: `Need ${SECT_CONFLICT_BALANCE.raidMinDisciples} disciples for a raid.` };
    }
    const rival = rivalId
        ? (getWorldSectById(rivalId) || G.sect.rivals.find(r => r.id === rivalId))
        : getActiveRivals()[0];
    if (!rival || rival.relationship === 'friendly') {
        return { success: false, message: 'No hostile rival to raid.' };
    }
    if (rival.relationship !== 'hostile') {
        return { success: false, message: `${rival.name} is not hostile.` };
    }
    const months = SECT_CONFLICT_BALANCE.raidMonths;
    if (!advanceTime(months, `Raiding ${rival.name} outposts`)) {
        return { success: false, message: 'Your lifespan ends during the raid.' };
    }
    const stones = SECT_CONFLICT_BALANCE.raidStonesMin
        + Math.floor(Math.random() * (SECT_CONFLICT_BALANCE.raidStonesMax - SECT_CONFLICT_BALANCE.raidStonesMin + 1));
    let totalStones = stones;
    if (typeof isWorldSectSanctioned === 'function' && isWorldSectSanctioned(rival)) {
        const bonusPct = SECT_DIPLOMACY_ACTIONS.sanction.raidStoneBonusPct || 25;
        totalStones = Math.floor(stones * (1 + bonusPct / 100));
    }
    G.stones += totalStones;
    const fierceBonus = typeof getSectTraitRaidRenownBonus === 'function' ? getSectTraitRaidRenownBonus() : 0;
    const raidRenown = SECT_CONFLICT_BALANCE.raidRenown + fierceBonus;
    addSectRenown(raidRenown);
    shiftSectReputation('raid_rival');
    if (typeof applyWorldSectRelationshipDrift === 'function') {
        applyWorldSectRelationshipDrift('raid', { targetId: rival.id });
    }
    if (typeof tryCompleteSectQuests === 'function') tryCompleteSectQuests('raid', { targetId: rival.id });
    if (typeof tryCompleteFactionQuests === 'function') {
        tryCompleteFactionQuests('raid', { zone: typeof getLootZoneId === 'function' ? getLootZoneId() : G.currentZone });
    }
    if (Math.random() < 0.35 && typeof addCraftMaterial === 'function') {
        addCraftMaterial('spirit_herb', 1);
        addLog(`🏴 Raid on ${rival.name}: +${totalStones} Stones, spirit herbs seized, +${raidRenown} Renown.`);
    } else {
        addLog(`🏴 Raid on ${rival.name}: +${totalStones} Stones, +${raidRenown} Renown.`);
    }
    return { success: true, message: `Raid complete (+${totalStones} Stones).` };
}

function formSectAlliance(rivalId) {
    ensureSectState();
    if (!meetsStageRequirement('established')) {
        return { success: false, message: 'Reach Established Sect for alliances.' };
    }
    const rival = getWorldSectById(rivalId) || G.sect.rivals.find(r => r.id === rivalId);
    if (!rival || rival.defeated) return { success: false, message: 'Sect not found.' };
    if (rival.relationship === 'friendly') return { success: false, message: 'Already allied.' };
    if (rival.relationship === 'neutral') {
        return approachNeutralSectPact(rivalId);
    }
    const playerDoc = getPlayerSectDoctrineId();
    const friction = getDoctrineDiplomacyMult(playerDoc, rival.doctrine);
    if (rival.relationship === 'hostile' && friction <= 0.58 && Math.random() > friction) {
        const hint = getDoctrineFrictionHint(playerDoc, rival.doctrine);
        return { success: false, message: `${rival.name} refuses — incompatible doctrines${hint ? ` (${hint})` : ''}.` };
    }
    if ((G.sect.renown || 0) < scalePlayerRenownCost(SECT_CONFLICT_BALANCE.allianceRenownCost)) {
        return { success: false, message: `Need ${SECT_CONFLICT_BALANCE.allianceRenownCost} Renown.` };
    }
    G.sect.renown -= scalePlayerRenownCost(SECT_CONFLICT_BALANCE.allianceRenownCost);
    rival.relationship = 'friendly';
    rival.allianceUntilMonths = G.ageMonths + SECT_CONFLICT_BALANCE.allianceMonths;
    syncLegacyRivalsFromWorldSects();
    if (typeof markSectActivity === 'function') markSectActivity();
    addLog(`🤝 ${G.sect.name} forms a temporary pact with ${rival.name} (${Math.floor(SECT_CONFLICT_BALANCE.allianceMonths / 12)} years).`);
    return { success: true, message: `Allied with ${rival.name}.` };
}

function getConstructionMaterialsBlock(cost) {
    if (!cost) return 'Invalid cost.';
    for (const [matId, qty] of Object.entries(cost.materials || {})) {
        const have = typeof getMaterialCount === 'function' ? getMaterialCount(matId) : 0;
        if (have < qty) {
            const mat = CRAFT_MATERIALS[matId];
            return `Need ${qty}× ${mat?.name || matId}.`;
        }
    }
    return null;
}

function formatConstructionCost(cost) {
    if (!cost) return '';
    const mats = Object.entries(cost.materials || {}).map(([id, qty]) => {
        const mat = CRAFT_MATERIALS[id];
        const have = typeof getMaterialCount === 'function' ? getMaterialCount(id) : 0;
        return `${have >= qty ? '✓' : '✗'} ${qty}× ${mat?.emoji || '◆'} ${mat?.name || id}`;
    }).join(' · ');
    const stones = cost.stones ? `${cost.stones}💎` : '';
    return [stones, mats].filter(Boolean).join(' · ');
}

function getConstructionBlockReason(targetId, targetLevel, cost) {
    ensureSectState();
    if (!isSectFounded()) return 'Found a sect first.';
    if (G.sect.construction) return 'Another construction project is already underway.';
    if (!cost) return 'Cannot upgrade further.';

    if (targetId === 'residence') {
        const current = typeof getResidenceLevel === 'function' ? getResidenceLevel() : (G.sect.residence?.level || 0);
        if (current >= SECT_RESIDENCE.maxLevel) return 'Quarters are fully upgraded.';
        if (targetLevel !== current + 1) return 'Upgrade one level at a time.';
    } else {
        const def = SECT_BUILDINGS[targetId];
        if (!def) return 'Unknown building.';
        if (!def.implemented) return `${def.name} is not yet available.`;
        if (!meetsStageRequirement(def.minStage)) {
            const min = SECT_STAGES[def.minStage];
            return `Requires ${min?.label || def.minStage} sect stage.`;
        }
        const current = getBuildingLevel(targetId);
        if (current >= def.maxLevel) return `${def.name} is fully upgraded.`;
        if (targetLevel !== current + 1) return 'Upgrade one level at a time.';
    }

    return getConstructionMaterialsBlock(cost);
}

function getBuildingUpgradeBlockReason(buildingId) {
    ensureSectState();
    const def = SECT_BUILDINGS[buildingId];
    if (!def) return 'Unknown building.';
    const current = getBuildingLevel(buildingId);
    const nextLevel = current + 1;
    const cost = def.levels[nextLevel];
    const block = getConstructionBlockReason(buildingId, nextLevel, cost);
    if (block) return block;
    if ((G.stones || 0) < (cost?.stones || 0)) return `Need ${cost.stones} Spirit Stones to hire craftsmen.`;
    return null;
}

function payConstructionMaterials(cost) {
    if (!cost?.materials || typeof removeCraftMaterials !== 'function') return true;
    return removeCraftMaterials(cost.materials);
}

function refundConstructionMaterials(cost) {
    if (!cost?.materials || typeof addCraftMaterial !== 'function') return;
    for (const [matId, qty] of Object.entries(cost.materials)) {
        addCraftMaterial(matId, qty);
    }
}

function completeSectConstruction() {
    const c = G.sect.construction;
    if (!c) return;
    const targetId = c.buildingId;
    const targetLevel = c.targetLevel;
    let label = '';
    let emoji = '🏗️';

    if (targetId === 'residence') {
        G.sect.residence.level = targetLevel;
        const def = SECT_RESIDENCE.levels[targetLevel];
        label = def?.name || SECT_RESIDENCE.name;
        emoji = SECT_RESIDENCE.emoji;
        addSectRenown(SECT_RESIDENCE.upgradeCosts[targetLevel]?.renown || 0);
        if (typeof grantFormationsForResidenceLevel === 'function') {
            grantFormationsForResidenceLevel(targetLevel);
        }
        if (typeof ensureResidenceFormationSlots === 'function') ensureResidenceFormationSlots();
    } else {
        G.sect.buildings[targetId] = targetLevel;
        const def = SECT_BUILDINGS[targetId];
        label = def?.name || targetId;
        emoji = def?.emoji || '🏗️';
        addSectRenown(def?.levels[targetLevel]?.renown || 0);
    }

    G.sect.construction = null;
    addLog(`${emoji} ${label} upgraded to Level ${targetLevel}!`);
}

function tickSectConstruction() {
    ensureSectState();
    const c = G.sect.construction;
    if (!c) return;
    if (G.ageMonths >= (c.completesAtMonths || 0)) {
        completeSectConstruction();
    }
}

function startSectConstruction(targetId, targetLevel, mode) {
    ensureSectState();
    let cost;
    if (targetId === 'residence') {
        cost = SECT_RESIDENCE.upgradeCosts[targetLevel];
    } else {
        cost = SECT_BUILDINGS[targetId]?.levels[targetLevel];
    }
    const block = getConstructionBlockReason(targetId, targetLevel, cost);
    if (block) return { success: false, message: block };

    const months = cost.months || ACTION_MONTHS.sectBuild;
    const isPersonal = mode === 'personal';
    const isContractors = mode === 'contractors';

    if (isPersonal && months > SECT_CONSTRUCTION.personalCapMonths) {
        return { success: false, message: `Too large to oversee alone (${months} months). Hire craftsmen instead.` };
    }
    if (isContractors && (cost.stones || 0) > (G.stones || 0)) {
        return { success: false, message: `Need ${cost.stones} Spirit Stones to hire craftsmen.` };
    }
    if (!isPersonal && !isContractors) {
        return { success: false, message: 'Choose a construction mode.' };
    }

    if (!payConstructionMaterials(cost)) {
        return { success: false, message: 'Could not pay materials.' };
    }

    let label;
    if (targetId === 'residence') {
        label = SECT_RESIDENCE.name;
    } else {
        label = SECT_BUILDINGS[targetId]?.name || targetId;
    }

    if (isPersonal) {
        if (!advanceTime(months, `Overseeing ${label} (Lv ${targetLevel})`)) {
            refundConstructionMaterials(cost);
            return { success: false, message: 'Your lifespan ends before construction finishes.' };
        }
        G.sect.construction = { buildingId: targetId, targetLevel, mode: 'personal' };
        completeSectConstruction();
        return { success: true, message: `${label} upgraded to Level ${targetLevel}!` };
    }

    G.stones -= cost.stones || 0;
    G.sect.construction = {
        buildingId: targetId,
        targetLevel,
        mode: 'contractors',
        startedAtMonths: G.ageMonths,
        completesAtMonths: G.ageMonths + months
    };
    addLog(`🏗️ Craftsmen begin work on ${label} (Lv ${targetLevel}) — ${months} months.`);
    return { success: true, message: `Construction started (${months} months). You are free to travel.` };
}

function canUpgradeBuilding(buildingId) {
    return !getBuildingUpgradeBlockReason(buildingId);
}

function upgradeBuilding(buildingId) {
    const nextLevel = getBuildingLevel(buildingId) + 1;
    const months = SECT_BUILDINGS[buildingId]?.levels[nextLevel]?.months || ACTION_MONTHS.sectBuild;
    const mode = months <= SECT_CONSTRUCTION.personalCapMonths ? 'personal' : 'contractors';
    return startSectConstruction(buildingId, nextLevel, mode);
}

function formatBuildingCost(buildingId) {
    const def = SECT_BUILDINGS[buildingId];
    if (!def) return '';
    const nextLevel = getBuildingLevel(buildingId) + 1;
    const cost = def.levels[nextLevel];
    if (!cost) return 'MAX';
    const mats = Object.entries(cost.materials || {}).map(([id, qty]) => {
        const mat = CRAFT_MATERIALS[id];
        const have = typeof getMaterialCount === 'function' ? getMaterialCount(id) : 0;
        return `${have >= qty ? '✓' : '✗'} ${qty}× ${mat?.emoji || '◆'} ${mat?.name || id}`;
    }).join(' · ');
    return `${cost.stones}💎 · ${cost.months}mo${mats ? ' · ' + mats : ''}`;
}

function getSectDiscipleIncome() {
    ensureSectState();
    let income = 0;
    G.sect.discipleRecords.forEach(d => {
        const role = DISCIPLE_ROLES[d.role] || DISCIPLE_ROLES.acolyte;
        let bonus = role.incomeBonus || 1;
        if (typeof getDiscipleTraitMult === 'function') {
            bonus = Math.floor(bonus * getDiscipleTraitMult(d, 'growthMult'));
        }
        income += bonus;
    });
    const treasuryPct = getSectPassiveIncomeBonus();
    if (treasuryPct > 0) income = Math.floor(income * (1 + treasuryPct / 100));
    income = Math.floor(income * getSectIncomeMult());
    return income;
}

function tickSectSystems(monthsPassed) {
    ensureSectState();
    if (!isSectFounded() || monthsPassed <= 0) return;
    tickSectConstruction();
    tickSectAlliances();
    if (typeof tickManualHallStudy === 'function') tickManualHallStudy(monthsPassed);
    if (typeof tickWorldSectGrowth === 'function') tickWorldSectGrowth(monthsPassed);
    if (typeof tickSectExpansion === 'function') tickSectExpansion(monthsPassed);
    if (typeof tickResidenceFormations === 'function') tickResidenceFormations(monthsPassed);
    if (meetsStageRequirement('established')) ensureProceduralWorldSects();
    if (meetsStageRequirement('regional') && !G.sect.influenceZone) {
        G.sect.influenceZone = typeof getActiveZoneId === 'function' ? getActiveZoneId() : G.currentZone;
    }
}

function canRecruitDisciples() {
    return getSectStageDef().allowsRecruit;
}

function getRecruitBlockReason() {
    if (!canRecruitDisciples()) {
        return 'Found a sect first — wandering cultivators cannot recruit disciples.';
    }
    const fameLevel = getFameLevel();
    if (G.disciples.length >= fameLevel.maxRecruits && fameLevel.maxRecruits > 0) {
        return `Recruitment limit reached (${fameLevel.title}).`;
    }
    if ((G.fame || 0) < 10) return 'You are unknown. No one will follow you yet.';
    return null;
}

function canClaimForbiddenForSect() {
    return meetsStageRequirement('regional');
}

function renderSectPanelHtml() {
    ensureSectState();
    migrateSectForExistingSave();
    const stage = getSectStageDef();
    const docDef = getSectDoctrineDef();
    let html = '';

    if (!isSectFounded()) {
        html += `<div class="sect-panel-header">
            <div class="sect-stage-badge">${stage.emoji} ${stage.label}</div>
            ${docDef
                ? `<div class="sect-doctrine-tag">${docDef.emoji} ${docDef.label}</div>`
                : `<div class="sect-align-tag">${getSectAlignmentTag().emoji} ${getSectAlignmentTag().label}</div>`}
        </div>`;
        html += `<p class="sect-stage-desc">${stage.desc}</p>`;
        const block = getFoundSectBlockReason();
        const defaultName = (G.name || 'Wandering') + "'s Sect";
        html += `<div class="sect-action-block">
            <p class="sect-hint">Gather ${SECT_FOUNDING.fameMin} Fame and ${SECT_FOUNDING.stones} Stones, then found your sect (${SECT_FOUNDING.months} months).</p>
            <label class="sect-name-label" for="sectFoundNameInput">Sect Name</label>
            <input type="text" id="sectFoundNameInput" class="sect-name-input" maxlength="40" value="${escapeSectAttr(defaultName)}" placeholder="Your sect's name" />
            ${renderDoctrinePickerHtml()}
            <button type="button" class="sect-action-btn" id="btnFoundSect" ${block ? 'disabled title="' + escapeSectAttr(block) + '"' : ''}>🏯 Found Sect</button>
        </div>`;
    } else {
        if (typeof renderSectGroundsHtml === 'function') {
            html += renderSectGroundsHtml();
        }

        html += renderWorldSectsPanelHtml();

        html += `<div class="sect-section-title sect-section-muted">📋 Conflict Types</div>`;
        Object.values(SECT_CONFLICT_TYPES).forEach(c => {
            const open = meetsStageRequirement(c.minStage);
            html += `<div class="sect-conflict-row${open ? '' : ' locked'}">${c.emoji} ${c.label} — ${c.desc}</div>`;
        });

        if (!canClaimForbiddenForSect()) {
            html += `<p class="sect-hint">🌑 Forbidden ground claims unlock at Regional Power.</p>`;
        } else {
            html += `<p class="sect-hint">🌑 Your sect may claim forbidden grounds — feature expanding soon.</p>`;
        }

        if (typeof renderSectExpansionPanelHtml === 'function') {
            html += renderSectExpansionPanelHtml();
        }
    }

    return html;
}

function escapeSectAttr(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
}

function getSelectedDoctrineFromContainer(container) {
    const selected = container?.querySelector('.sect-doctrine-card.selected');
    return selected?.dataset.sectDoctrine || 'balanced';
}

function bindSectPanelEvents(container) {
    if (!container) return;
    container.querySelectorAll('[data-sect-doctrine]').forEach(btn => {
        btn.addEventListener('click', function() {
            container.querySelectorAll('[data-sect-doctrine]').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    container.querySelector('#btnFoundSect')?.addEventListener('click', () => {
        const nameInput = container.querySelector('#sectFoundNameInput');
        const doctrine = getSelectedDoctrineFromContainer(container);
        const result = foundSect(nameInput?.value, doctrine);
        if (result.message && !result.success) addLog(`🏯 ${result.message}`);
        if (result.success && typeof openSectMap === 'function') {
            openSectMap();
        } else if (typeof renderSectPopup === 'function') {
            renderSectPopup();
        }
        fullRender();
    });
    container.querySelector('#btnAdvanceSect')?.addEventListener('click', () => {
        const result = advanceSectStage();
        if (result.message) addLog(result.success ? `🏯 ${result.message}` : `🏯 ${result.message}`);
        if (typeof renderSectPopup === 'function') renderSectPopup();
        fullRender();
    });
    container.querySelector('#btnShiftInfluence')?.addEventListener('click', () => {
        const zoneId = typeof getActiveZoneId === 'function' ? getActiveZoneId() : G.currentZone;
        const result = shiftSectInfluence(zoneId);
        if (result.message) addLog(result.success ? `🌏 ${result.message}` : `🌏 ${result.message}`);
        if (typeof renderSectPopup === 'function') renderSectPopup();
        fullRender();
    });
    container.querySelectorAll('[data-sect-build]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = upgradeBuilding(this.dataset.sectBuild);
            if (result.message) addLog(result.success ? `🏗️ ${result.message}` : `🏗️ ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-promote-disc]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = promoteDisciple(this.dataset.promoteDisc);
            if (result.message) addLog(result.success ? `📿 ${result.message}` : `📿 ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-sect-duel]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = startSectRivalDuel(this.dataset.sectDuel);
            if (result.message && !result.success) addLog(`⚔️ ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-sect-raid]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = actionSectRaid(this.dataset.sectRaid);
            if (result.message && !result.success) addLog(`🏴 ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-sect-alliance]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = formSectAlliance(this.dataset.sectAlliance);
            if (result.message) addLog(result.success ? `🤝 ${result.message}` : `🤝 ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-sect-neutral-pact]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = approachNeutralSectPact(this.dataset.sectNeutralPact);
            if (result.message) addLog(result.success ? `🤝 ${result.message}` : `🤝 ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-sect-neutral-grudge]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = provokeNeutralSect(this.dataset.sectNeutralGrudge);
            if (result.message) addLog(result.success ? `⚔️ ${result.message}` : `⚔️ ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-diplo-action]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = executeSectDiplomacyAction(this.dataset.diploAction, this.dataset.diploSect);
            if (result.message) addLog(result.message);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    if (typeof bindSectExpansionPanelEvents === 'function') bindSectExpansionPanelEvents(container);
    if (typeof bindSectGroundsEvents === 'function') bindSectGroundsEvents(container);
}

function actionFoundSectFromPanel() {
    return foundSect();
}
