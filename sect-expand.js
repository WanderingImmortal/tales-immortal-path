// ============================================
// SECT-EXPAND.JS — Events, traits, diplomacy, legacy, culture extras
// ============================================

function ensureSectExpansionState() {
    ensureSectState();
    const s = G.sect;
    if (s.lastSectActionMonths == null) s.lastSectActionMonths = G.ageMonths || 0;
    if (s.lastEventMonths == null) s.lastEventMonths = G.ageMonths || 0;
    if (!s.chronicle) s.chronicle = [];
    if (!s.heirlooms) s.heirlooms = [];
    if (!s.treasures) s.treasures = s.heirlooms;
    else if (s.heirlooms.length === 0 && s.treasures.length) s.heirlooms = s.treasures;
    s.treasures = s.heirlooms;
    s.heirlooms.forEach(h => {
        if (h.passedDown == null) h.passedDown = 0;
    });
    if (!s.alliedSects) s.alliedSects = [];
    if (!s.grudgeSects) s.grudgeSects = [];
    if (s.leaderGeneration == null) s.leaderGeneration = 1;
    if (s.treasureEnshrinedThisLeader == null) s.treasureEnshrinedThisLeader = false;
    if (s.legendUnlocked == null) s.legendUnlocked = false;
    if (s.sectSpiritUnlocked == null) s.sectSpiritUnlocked = false;
    if (!s.pendingEvent) s.pendingEvent = null;
    G.sect.discipleRecords.forEach(d => {
        if (!d.trait) d.trait = rollDiscipleTraitId();
    });
}

function markSectActivity() {
    if (!isSectFounded()) return;
    ensureSectExpansionState();
    G.sect.lastSectActionMonths = G.ageMonths || 0;
}

function appendSectChronicle(text, emoji) {
    ensureSectExpansionState();
    G.sect.chronicle.unshift({
        text,
        emoji: emoji || '📜',
        months: G.ageMonths || 0,
        sectAgeYears: getSectAgeYears(),
        leader: G.name,
        generation: G.sect.leaderGeneration || 1
    });
    if (G.sect.chronicle.length > SECT_LEGACY.maxChronicleEntries) {
        G.sect.chronicle.length = SECT_LEGACY.maxChronicleEntries;
    }
}

function getSectAgeYears() {
    if (!isSectFounded() || G.sect.foundedAtMonths == null) return 0;
    return Math.max(0, Math.floor(((G.ageMonths || 0) - G.sect.foundedAtMonths) / 12));
}

function formatChronicleEntry(entry) {
    const age = entry.sectAgeYears != null ? entry.sectAgeYears : getSectAgeYears();
    const gen = entry.generation || 1;
    const yearLabel = age > 0 ? `Year ${age}` : 'Founding';
    return `${entry.emoji} ${entry.text} <span class="sect-chronicle-meta">· ${yearLabel} · Gen ${gen}${entry.leader ? ` · ${entry.leader}` : ''}</span>`;
}

function getSectLegendRenownMult() {
    return G.sect?.legendUnlocked ? (SECT_LEGACY.legendRenownMult || 1) : 1;
}

function getSectLegendIncomeBonusPct() {
    return G.sect?.legendUnlocked ? (SECT_LEGACY.legendIncomePct || 0) : 0;
}

function getSectSpiritUnlocked() {
    return !!G.sect?.sectSpiritUnlocked;
}

function getSectSpiritCombatMult() {
    return getSectSpiritUnlocked() ? (SECT_SPIRIT.combatMult || 1) : 1;
}

function getSectSpiritCultivateMult() {
    return getSectSpiritUnlocked() ? (SECT_SPIRIT.cultivateMult || 1) : 1;
}

function getSectSpiritIncomeBonusPct() {
    return getSectSpiritUnlocked() ? (SECT_SPIRIT.incomePct || 0) : 0;
}

function getSectSpiritTribulationEasePct() {
    return getSectSpiritUnlocked() ? (SECT_SPIRIT.tribulationEasePct || 0) : 0;
}

function unlockSectLegendIfEligible() {
    if (!isSectFounded() || G.sect.legendUnlocked) return false;
    if (getSectAgeYears() < SECT_LEGACY.legendAgeYears) return false;
    G.sect.legendUnlocked = true;
    const r = G.sect.reputation;
    r.respect = (r.respect || 0) + (SECT_LEGACY.legendRespectBonus || 0);
    appendSectChronicle(`${G.sect.name} survives ${SECT_LEGACY.legendAgeYears} years — a living legend of the jianghu.`, '🌟');
    addLog(`🌟 ${SECT_LEGACY.legendAgeYears} years! ${G.sect.name} is spoken of as a sect legend (+${SECT_LEGACY.legendIncomePct}% income, +${Math.round((SECT_LEGACY.legendRenownMult - 1) * 100)}% Renown).`);
    markSectActivity();
    return true;
}

function unlockSectSpiritIfEligible() {
    if (!isSectFounded() || G.sect.sectSpiritUnlocked) return false;
    if ((G.sect.leaderGeneration || 1) < SECT_LEGACY.spiritMinGeneration) return false;
    G.sect.sectSpiritUnlocked = true;
    appendSectChronicle(`${SECT_SPIRIT.name} awakens to guard ${G.sect.name}.`, SECT_SPIRIT.emoji);
    addLog(`${SECT_SPIRIT.emoji} ${SECT_SPIRIT.name} awakens! ${SECT_SPIRIT.desc}`);
    markSectActivity();
    return true;
}

function tickSectLegacyChecks(monthsPassed) {
    if (!isSectFounded() || monthsPassed <= 0) return;
    unlockSectLegendIfEligible();
}

function passDownHeirloomsOnSuccession(newGeneration) {
    const heirlooms = G.sect.heirlooms || G.sect.treasures || [];
    if (!heirlooms.length) return 0;
    let respectGain = 0;
    heirlooms.forEach(h => {
        h.passedDown = (h.passedDown || 0) + 1;
        const def = SECT_HEIRLOOMS[h.id];
        if (def?.respectOnSuccession) respectGain += def.respectOnSuccession;
        if (def?.respectPerGen) respectGain += def.respectPerGen * (h.passedDown || 0);
    });
    appendSectChronicle(`${heirlooms.length} heirlooms passed to Generation ${newGeneration}.`, '🏺');
    if (respectGain > 0) shiftSectReputation('promote_disciple', { respect: respectGain });
    return heirlooms.length;
}

function getHeirloomGenerationMult(item, perGenKey) {
    const def = SECT_HEIRLOOMS[item?.id];
    const passed = item?.passedDown || 0;
    const base = SECT_LEGACY.heirloomBonusPerGeneration || 0.03;
    const extra = perGenKey && def?.[perGenKey] ? def[perGenKey] * passed : 0;
    return 1 + passed * base + extra;
}

function getSectHeirloomBonuses() {
    ensureSectExpansionState();
    const out = {
        incomeMult: 1,
        combatMult: 1,
        cultivateMult: 1,
        renownBonus: 0,
        foundationBonus: 0,
        exploreFameBonus: 0
    };
    (G.sect.heirlooms || []).forEach(item => {
        const def = SECT_HEIRLOOMS[item.id];
        if (!def) return;
        const passed = item.passedDown || 0;
        if (def.incomeMult) {
            out.incomeMult *= def.incomeMult * getHeirloomGenerationMult(item, 'incomeMultPerGen');
        }
        if (def.combatMult) {
            out.combatMult *= def.combatMult * getHeirloomGenerationMult(item);
        }
        if (def.cultivateMult) {
            out.cultivateMult *= def.cultivateMult * getHeirloomGenerationMult(item, 'cultivateMultPerGen');
        }
        if (def.renownBonus) {
            out.renownBonus += def.renownBonus + (def.renownBonusPerGen || 0) * passed;
        }
        if (def.foundationBonus) {
            out.foundationBonus += def.foundationBonus + (def.foundationPerGen || 0) * passed;
        }
        if (def.exploreFameBonus) {
            out.exploreFameBonus += def.exploreFameBonus + Math.floor(passed / 2);
        }
    });
    return out;
}

function rollDiscipleTraitId() {
    const id = DISCIPLE_TRAIT_POOL[Math.floor(Math.random() * DISCIPLE_TRAIT_POOL.length)];
    return id || 'loyal';
}

function getDiscipleTraitDef(traitId) {
    return DISCIPLE_TRAITS[traitId] || DISCIPLE_TRAITS.loyal;
}

function getDiscipleTraitMult(disciple, key) {
    const def = getDiscipleTraitDef(disciple?.trait);
    return def[key] ?? 1;
}

function getDiscipleTraitEffectSummary(traitId) {
    const def = getDiscipleTraitDef(traitId);
    return def.effectDesc || def.desc || '';
}

function getDiscipleRequiredServiceMonths(disciple) {
    const roleDef = DISCIPLE_ROLES[disciple?.role];
    const req = roleDef?.promoteReq;
    if (!req) return Infinity;
    const mult = getDiscipleTraitMult(disciple, 'promoteMonthsMult');
    return mult !== 1 ? Math.ceil(req.monthsServed * mult) : req.monthsServed;
}

function getDisciplePromoteRenownRequired(disciple) {
    const roleDef = DISCIPLE_ROLES[disciple?.role];
    const req = roleDef?.promoteReq;
    if (!req) return 0;
    const reduction = getDiscipleTraitDef(disciple?.trait).promoteRenownReduction || 0;
    return Math.max(0, req.renown - reduction);
}

function getSectTraitIncomeMult() {
    ensureSectExpansionState();
    const count = Math.max(1, G.sect.discipleRecords.length);
    let mult = 1;
    G.sect.discipleRecords.forEach(d => {
        let incomeMult = getDiscipleTraitMult(d, 'incomeMult');
        const def = getDiscipleTraitDef(d.trait);
        if (def.jealousMinDisciples && count >= def.jealousMinDisciples && def.incomeMultPerDisciple) {
            incomeMult += def.incomeMultPerDisciple * (count - 1);
        }
        mult += (incomeMult - 1) / count;
    });
    return mult;
}

function getSectTraitCombatMult() {
    ensureSectExpansionState();
    const count = Math.max(1, G.sect.discipleRecords.length);
    let mult = 1;
    G.sect.discipleRecords.forEach(d => {
        mult += (getDiscipleTraitMult(d, 'combatMult') - 1) / count;
    });
    return mult;
}

function getSectTraitCombatMultForEvents() {
    ensureSectExpansionState();
    let mult = getSectTraitCombatMult();
    let brave = 0;
    let coward = 0;
    G.sect.discipleRecords.forEach(d => {
        if (d.trait === 'brave') brave++;
        if (d.trait === 'cowardly') coward++;
    });
    return mult + brave * 0.03 - coward * 0.02;
}

function getSectTraitEventStoneLossMult() {
    ensureSectExpansionState();
    const count = Math.max(1, G.sect.discipleRecords.length);
    let mult = 1;
    G.sect.discipleRecords.forEach(d => {
        const lossMult = getDiscipleTraitDef(d.trait).eventStoneLossMult;
        if (lossMult) mult += (lossMult - 1) / count;
    });
    return clamp(mult, 0.55, 1.75);
}

function getSectTraitDiplomacyBonus() {
    ensureSectExpansionState();
    let bonus = 0;
    G.sect.discipleRecords.forEach(d => {
        bonus += getDiscipleTraitDef(d.trait).diplomacyBonus || 0;
    });
    return bonus;
}

function getSectTraitRaidRenownBonus() {
    ensureSectExpansionState();
    let bonus = 0;
    G.sect.discipleRecords.forEach(d => {
        bonus += getDiscipleTraitDef(d.trait).raidRenownBonus || 0;
    });
    return bonus;
}

function applyDiscipleTraitEventEffects() {
    ensureSectExpansionState();
    const disciples = G.sect.discipleRecords;
    if (!disciples.length) return;

    const generous = disciples.filter(d => d.trait === 'generous').length;
    if (generous > 0) {
        const per = DISCIPLE_TRAITS.generous.respectOnEvent || 1;
        shiftSectReputation('sect_event', { respect: generous * per });
        addLog(`🎁 Generous disciples aid the needy — +${generous * per} Respect.`);
    }

    disciples.forEach(d => {
        if (d.trait !== 'mysterious') return;
        const def = DISCIPLE_TRAITS.mysterious;
        if (Math.random() < (def.eventMysteryBonus || 0.18)) {
            const stones = def.eventMysteryStones || 8;
            G.stones = (G.stones || 0) + stones;
            addLog(`🔮 ${d.name} returns with an unexplained cache (+${stones} Stones).`);
        }
    });
}

function getSectReputationPerk() {
    const tier = getSectReputationTier().id;
    return SECT_REPUTATION_PERKS[tier] || null;
}

function getSectPerkExploreFameBonus() {
    const perk = getSectReputationPerk();
    let bonus = perk?.exploreFameBonus || 0;
    if (typeof getSectHeirloomBonuses === 'function') {
        bonus += getSectHeirloomBonuses().exploreFameBonus || 0;
    }
    return bonus;
}

function getSectPerkCombatMult() {
    let mult = 1;
    const perk = getSectReputationPerk();
    if (perk?.combatMult) mult *= perk.combatMult;
    if (typeof getSectCombatMult === 'function') mult *= getSectCombatMult();
    return mult;
}

function tickSectReputationDecay(monthsPassed) {
    if (!isSectFounded()) return;
    ensureSectExpansionState();
    const r = G.sect.reputation;
    const idle = (G.ageMonths || 0) - (G.sect.lastSectActionMonths || 0);
    if (idle < SECT_REPUTATION_DECAY.idleMonths) return;
    const respect = r.respect || 0;
    const fear = r.fear || 0;
    const reviled = r.reviled || 0;
    if (respect < SECT_REPUTATION_DECAY.minBeforeDecay && fear < SECT_REPUTATION_DECAY.minBeforeDecay && reviled < SECT_REPUTATION_DECAY.minBeforeDecay) return;
    const ticks = Math.floor(idle / SECT_REPUTATION_DECAY.idleMonths);
    if (ticks < 1) return;
    let changed = false;
    if (respect >= SECT_REPUTATION_DECAY.minBeforeDecay) {
        r.respect = Math.max(0, respect - SECT_REPUTATION_DECAY.respect * ticks);
        changed = true;
    }
    if (fear >= SECT_REPUTATION_DECAY.minBeforeDecay) {
        r.fear = Math.max(0, fear - SECT_REPUTATION_DECAY.fear * ticks);
        changed = true;
    }
    if (reviled >= SECT_REPUTATION_DECAY.minBeforeDecay) {
        r.reviled = Math.max(0, reviled - SECT_REPUTATION_DECAY.reviled * ticks);
        changed = true;
    }
    if (changed) {
        G.sect.lastSectActionMonths = G.ageMonths || 0;
        addLog('📣 Without recent deeds, whispers of your sect fade in the jianghu.');
    }
}

function tickSectReviledBounty(monthsPassed) {
    if (!isSectFounded()) return;
    if (getSectReputationTier().id !== 'reviled') return;
    const perk = SECT_REPUTATION_PERKS.reviled;
    const years = monthsPassed / 12;
    if (Math.random() > (perk.bountyChancePerYear || 0.15) * years) return;
    if (G.inCombat) return;
    addLog('💀 Bounty hunters trail your sect — Reviled reputation draws blades.');
    shiftSectReputation('kill_world_npc', { fear: 1 });
}

function canPerformDoctrineCeremony() {
    if (!isSectFounded()) return false;
    if (!meetsStageRequirement(SECT_DOCTRINE_CEREMONY.minStage)) return false;
    return true;
}

function getDoctrineCeremonyBlockReason(newDoctrineId) {
    if (!canPerformDoctrineCeremony()) return 'Reach Regional Power to hold a Doctrine Ceremony.';
    if (!newDoctrineId || !SECT_DOCTRINES[newDoctrineId]) return 'Invalid doctrine.';
    if (G.sect.doctrine === newDoctrineId) return 'Already sworn to this path.';
    const c = SECT_DOCTRINE_CEREMONY;
    if ((G.stones || 0) < c.stones) return `Need ${c.stones} Spirit Stones.`;
    if ((G.sect.renown || 0) < c.renown) return `Need ${c.renown} Renown.`;
    return null;
}

function performDoctrineCeremony(newDoctrineId) {
    ensureSectExpansionState();
    const block = getDoctrineCeremonyBlockReason(newDoctrineId);
    if (block) return { success: false, message: block };
    const c = SECT_DOCTRINE_CEREMONY;
    if (!advanceTime(c.months, 'Doctrine Ceremony — re-swearing the sect oath')) {
        return { success: false, message: 'Your lifespan ends before the rite completes.' };
    }
    G.stones -= c.stones;
    G.sect.renown -= c.renown;
    const prev = G.sect.doctrine;
    G.sect.doctrine = newDoctrineId;
    shiftSectReputation('doctrine_ceremony', c.reputationHit);
    markSectActivity();
    const doc = SECT_DOCTRINES[newDoctrineId];
    appendSectChronicle(`${G.name} led a Doctrine Ceremony — ${SECT_DOCTRINES[prev]?.label || prev} to ${doc.label}.`, doc.emoji);
    addLog(`📜 The sect re-swears the ${doc.label}. The jianghu takes note — for better or worse.`);
    return { success: true, message: `Doctrine changed to ${doc.label}.` };
}

function generateFriendlySect() {
    return typeof generateWorldSect === 'function'
        ? generateWorldSect({ relationship: 'friendly' })
        : null;
}

function generateGrudgeSect() {
    const neutrals = typeof getWorldSects === 'function'
        ? getWorldSects().filter(s => !s.defeated && s.relationship === 'neutral')
        : [];
    if (neutrals.length && Math.random() < 0.5) {
        const target = neutrals[Math.floor(Math.random() * neutrals.length)];
        target.relationship = 'hostile';
        target.grudgeSince = G.ageMonths;
        if (typeof syncLegacyRivalsFromWorldSects === 'function') syncLegacyRivalsFromWorldSects();
        return target;
    }
    return typeof generateWorldSect === 'function'
        ? generateWorldSect({ relationship: 'hostile' })
        : null;
}

function countFriendlyWorldSects() {
    return typeof getWorldSects === 'function'
        ? getWorldSects().filter(s => !s.defeated && s.relationship === 'friendly').length
        : (G.sect.alliedSects || []).length;
}

function countHostileWorldSects() {
    return typeof getWorldSects === 'function'
        ? getWorldSects().filter(s => !s.defeated && s.relationship === 'hostile').length
        : (G.sect.grudgeSects || []).length;
}

function canFormDiplomaticAlliance() {
    if (!meetsStageRequirement('established')) return false;
    if ((G.sect.renown || 0) < SECT_DIPLOMACY.allianceRenownMin) return false;
    if (getSectReputationTier().id !== SECT_DIPLOMACY.allianceRepTier && getSectReputationTier().id !== 'respected') {
        if ((G.sect.reputation?.respect || 0) < SECT_REPUTATION_TIERS.respected.threshold) return false;
    }
    return countFriendlyWorldSects() < SECT_DIPLOMACY.maxAlliedSects;
}

function seekDiplomaticAlliance() {
    ensureSectExpansionState();
    if (!canFormDiplomaticAlliance()) {
        return { success: false, message: `Need ${SECT_DIPLOMACY.allianceRenownMin} Renown and Respected reputation.` };
    }
    if (!advanceTime(6, 'Diplomatic envoys seek a friendly pact')) {
        return { success: false, message: 'Your lifespan ends...' };
    }
    let ally = null;
    const neutrals = typeof getWorldSects === 'function'
        ? getWorldSects().filter(s => !s.defeated && s.relationship === 'neutral')
        : [];
    if (neutrals.length && Math.random() < 0.55) {
        neutrals.sort((a, b) => {
            const playerDoc = typeof getPlayerSectDoctrineId === 'function' ? getPlayerSectDoctrineId() : 'balanced';
            const mult = typeof getDoctrineDiplomacyMult === 'function' ? getDoctrineDiplomacyMult : () => 1;
            return mult(playerDoc, b.doctrine) - mult(playerDoc, a.doctrine);
        });
        ally = neutrals[0];
        const playerDoc = typeof getPlayerSectDoctrineId === 'function' ? getPlayerSectDoctrineId() : 'balanced';
        const friction = typeof getDoctrineDiplomacyMult === 'function'
            ? getDoctrineDiplomacyMult(playerDoc, ally.doctrine)
            : 1;
        if (friction <= 0.55 && Math.random() > friction) {
            ally = generateFriendlySect();
            ally.allianceUntilMonths = G.ageMonths + SECT_DIPLOMACY.allianceMonths;
            if (!G.sect.worldSects.some(s => s.id === ally.id)) G.sect.worldSects.push(ally);
        } else {
            ally.relationship = 'friendly';
            ally.allianceUntilMonths = G.ageMonths + SECT_DIPLOMACY.allianceMonths;
        }
    } else {
        ally = generateFriendlySect();
        if (ally) {
            ally.allianceUntilMonths = G.ageMonths + SECT_DIPLOMACY.allianceMonths;
            if (!G.sect.worldSects) G.sect.worldSects = [];
            G.sect.worldSects.push(ally);
        }
    }
    if (!ally) return { success: false, message: 'No pact could be formed.' };
    if (typeof syncLegacyRivalsFromWorldSects === 'function') syncLegacyRivalsFromWorldSects();
    addSectRenown(3);
    shiftSectReputation('diplomatic_alliance', { respect: 3 });
    markSectActivity();
    appendSectChronicle(`Alliance formed with ${ally.name}.`, '🤝');
    addLog(`🤝 ${ally.name} accepts your pact — trade routes and mutual defense pledged.`);
    return { success: true, message: `Allied with ${ally.name}.` };
}

function canDeclareGrudge() {
    if (!meetsStageRequirement('established')) return false;
    if ((G.sect.renown || 0) < SECT_DIPLOMACY.grudgeRenownMin) return false;
    const tier = getSectReputationTier().id;
    if (tier !== SECT_DIPLOMACY.grudgeRepTier && tier !== 'feared' && (G.sect.reputation?.fear || 0) < SECT_REPUTATION_TIERS.feared.threshold) return false;
    return countHostileWorldSects() < SECT_DIPLOMACY.maxGrudgeSects;
}

function declareSectGrudge() {
    ensureSectExpansionState();
    if (!canDeclareGrudge()) {
        return { success: false, message: `Need ${SECT_DIPLOMACY.grudgeRenownMin} Renown and Feared reputation.` };
    }
    const grudge = generateGrudgeSect();
    if (!grudge) return { success: false, message: 'Could not declare grudge.' };
    if (!G.sect.worldSects.some(s => s.id === grudge.id)) {
        G.sect.worldSects.push(grudge);
    }
    if (typeof syncLegacyRivalsFromWorldSects === 'function') syncLegacyRivalsFromWorldSects();
    shiftSectReputation('declare_grudge', { fear: 4, respect: -2 });
    markSectActivity();
    appendSectChronicle(`${grudge.name} declared a blood grudge against your sect.`, '⚔️');
    addLog(`⚔️ You declare enmity toward ${grudge.name}! Raids and duels may follow.`);
    return { success: true, message: `Grudge declared against ${grudge.name}.` };
}

function tickSectDiplomacy() {
    ensureSectExpansionState();
    (G.sect.alliedSects || []).forEach(a => {
        if (a.alliedUntilMonths && G.ageMonths >= a.alliedUntilMonths) {
            a.relation = 'expired';
        }
    });
    G.sect.alliedSects = (G.sect.alliedSects || []).filter(a => a.relation === 'allied');
    tickWorldSectDiplomacyExpiration();
}

function isWorldSectDiplomacyActive(sect, field) {
    if (!sect || !field) return false;
    const until = sect[field];
    return until != null && (G.ageMonths || 0) < until;
}

function getWorldSectDiplomacyBadges(sect) {
    const badges = [];
    Object.values(SECT_DIPLOMACY_ACTIONS).forEach(action => {
        if (action.activeField && isWorldSectDiplomacyActive(sect, action.activeField)) {
            badges.push(`${action.emoji} ${action.label}`);
        }
    });
    return badges;
}

function getDiplomacyActionBlockReason(actionId, sectId) {
    const action = SECT_DIPLOMACY_ACTIONS[actionId];
    if (!action) return 'Unknown diplomacy action.';
    if (!isSectFounded()) return 'Found a sect first.';
    if (!meetsStageRequirement(action.minStage)) {
        const stage = SECT_STAGES[action.minStage];
        return `Requires ${stage?.label || action.minStage} sect stage.`;
    }
    const sect = typeof getWorldSectById === 'function' ? getWorldSectById(sectId) : null;
    if (!sect || sect.defeated) return 'Target sect not found.';
    if (!action.targetRelations.includes(sect.relationship)) {
        return `${action.label} requires a ${action.targetRelations.join(' or ')} sect.`;
    }
    if ((G.sect.renown || 0) < action.renownMin) {
        return `Need ${action.renownMin} Renown.`;
    }
    if (action.stonesCost && (G.stones || 0) < action.stonesCost) {
        return `Need ${action.stonesCost} Spirit Stones.`;
    }
    if (action.repTier) {
        const tier = getSectReputationTier().id;
        const th = SECT_REPUTATION_TIERS[action.repTier]?.threshold || 12;
        const rep = G.sect.reputation || {};
        const val = rep[action.repTier] || 0;
        if (tier !== action.repTier && val < th) {
            return `Requires ${SECT_REPUTATION_TIERS[action.repTier]?.label || action.repTier} reputation.`;
        }
    }
    if (action.activeField && isWorldSectDiplomacyActive(sect, action.activeField)) {
        return `${action.label} already active with ${sect.name}.`;
    }
    return null;
}

function executeSectDiplomacyAction(actionId, sectId) {
    ensureSectExpansionState();
    const action = SECT_DIPLOMACY_ACTIONS[actionId];
    const block = getDiplomacyActionBlockReason(actionId, sectId);
    if (block) return { success: false, message: block };
    const sect = getWorldSectById(sectId);
    if (!sect) return { success: false, message: 'Target sect not found.' };

    if (actionId === 'espionage' && Math.random() > (action.successChance || 0.72)) {
        if (!advanceTime(action.months, `Espionage against ${sect.name} fails`)) {
            return { success: false, message: 'Your lifespan ends...' };
        }
        G.stones = Math.max(0, (G.stones || 0) - Math.floor((action.stonesCost || 0) * 0.5));
        shiftSectReputation('sect_event', { fear: 1, respect: -2 });
        addLog(`🕵️ Your spies are caught by ${sect.name}! Agents executed, half the stones lost.`);
        return { success: false, message: 'Espionage failed — spies exposed.' };
    }

    if (!advanceTime(action.months, `${action.label} with ${sect.name}`)) {
        return { success: false, message: 'Your lifespan ends during negotiations.' };
    }
    if (action.stonesCost) G.stones -= action.stonesCost;

    const until = (G.ageMonths || 0) + (action.durationMonths || 48);
    if (action.activeField) sect[action.activeField] = until;

    if (actionId === 'marriage_alliance') {
        sect.relationship = 'friendly';
        sect.allianceUntilMonths = Math.max(sect.allianceUntilMonths || 0, until);
    }

    if (action.renownReward) addSectRenown(action.renownReward);
    if (action.respect || action.fear) {
        shiftSectReputation('diplomatic_alliance', {
            respect: action.respect || 0,
            fear: action.fear || 0
        });
    }

    if (typeof syncLegacyRivalsFromWorldSects === 'function') syncLegacyRivalsFromWorldSects();
    markSectActivity();
    appendSectChronicle(`${action.label} with ${sect.name}.`, action.emoji);

    let detail = action.effectDesc || action.desc;
    if (actionId === 'espionage') {
        detail = `Intel acquired — ${sect.name} at ${sect.power} Power, ${SECT_DOCTRINES[sect.doctrine]?.label || sect.doctrine} doctrine.`;
    }
    addLog(`${action.emoji} ${action.label} with ${sect.name}: ${detail}`);
    if (typeof tryCompleteSectQuests === 'function') tryCompleteSectQuests('diplomacy', { sectId: sect.id, actionId });
    if (typeof tryCompleteFactionQuests === 'function') {
        tryCompleteFactionQuests('diplomacy', { zone: typeof getLootZoneId === 'function' ? getLootZoneId() : G.currentZone });
    }
    return { success: true, message: `${action.label} established with ${sect.name}.` };
}

function tickWorldSectDiplomacyExpiration() {
    if (!isSectFounded() || typeof getWorldSects !== 'function') return;
    getWorldSects().forEach(s => {
        Object.values(SECT_DIPLOMACY_ACTIONS).forEach(action => {
            if (!action.activeField) return;
            const until = s[action.activeField];
            if (until != null && (G.ageMonths || 0) >= until) {
                s[action.activeField] = null;
                if (action.id === 'marriage_alliance' && s.relationship === 'friendly'
                    && s.allianceUntilMonths && G.ageMonths >= s.allianceUntilMonths) {
                    s.relationship = 'neutral';
                    s.allianceUntilMonths = null;
                    addLog(`💍 The marriage alliance with ${s.name} ends — relations cool to neutral.`);
                } else {
                    addLog(`${action.emoji} ${action.label} with ${s.name} expires.`);
                }
            }
        });
    });
    if (typeof syncLegacyRivalsFromWorldSects === 'function') syncLegacyRivalsFromWorldSects();
}

function getSectTradeRouteIncome() {
    if (!isSectFounded() || typeof getWorldSects !== 'function') return 0;
    const action = SECT_DIPLOMACY_ACTIONS.trade_route;
    let total = 0;
    getWorldSects().forEach(s => {
        if (isWorldSectDiplomacyActive(s, action.activeField)) {
            total += action.stonesPerCultivate || 4;
        }
    });
    return total;
}

function getSectMarriageAllianceIncomeBonusPct() {
    if (!isSectFounded() || typeof getWorldSects !== 'function') return 0;
    const action = SECT_DIPLOMACY_ACTIONS.marriage_alliance;
    let count = 0;
    getWorldSects().forEach(s => {
        if (isWorldSectDiplomacyActive(s, action.activeField)) count++;
    });
    return count * (action.incomeBonusPct || 6);
}

function getSectDefensePactCombatBonusPct() {
    if (!isSectFounded() || typeof getWorldSects !== 'function') return 0;
    if (typeof countHostileWorldSects === 'function' && !countHostileWorldSects()) return 0;
    const action = SECT_DIPLOMACY_ACTIONS.mutual_defense;
    let count = 0;
    getWorldSects().forEach(s => {
        if (isWorldSectDiplomacyActive(s, action.activeField)) count++;
    });
    return count * (action.combatBonusPct || 8);
}

function isWorldSectSanctioned(sect) {
    return isWorldSectDiplomacyActive(sect, SECT_DIPLOMACY_ACTIONS.sanction.activeField);
}

function isWorldSectEspionageActive(sect) {
    return isWorldSectDiplomacyActive(sect, SECT_DIPLOMACY_ACTIONS.espionage.activeField);
}

function renderWorldSectDiplomacyButtons(sect) {
    let html = '';
    const badges = getWorldSectDiplomacyBadges(sect);
    if (badges.length) {
        html += `<div class="sect-diplo-active">${badges.join(' · ')}</div>`;
    }
    html += `<div class="sect-diplo-actions">`;
    Object.values(SECT_DIPLOMACY_ACTIONS).forEach(action => {
        if (!action.targetRelations.includes(sect.relationship)) return;
        if (action.activeField && isWorldSectDiplomacyActive(sect, action.activeField)) return;
        const block = getDiplomacyActionBlockReason(action.id, sect.id);
        const title = block || `${action.desc} — ${action.effectDesc}`;
        html += `<button type="button" class="sect-diplo-btn" data-diplo-action="${action.id}" data-diplo-sect="${sect.id}" ${block ? `disabled title="${String(title).replace(/"/g, '&quot;')}"` : `title="${String(title).replace(/"/g, '&quot;')}"`}>${action.emoji}</button>`;
    });
    html += `</div>`;
    return html;
}

function getSectAllianceIncomeMult() {
    ensureSectExpansionState();
    const active = (G.sect.alliedSects || []).filter(a => a.relation === 'allied').length;
    if (!active) return 1;
    return 1 + (SECT_DIPLOMACY.allianceIncomePct / 100) * Math.min(active, 2);
}

function getSectEventPowerContext() {
    const playerPower = typeof getPlayerSectPowerEstimate === 'function' ? getPlayerSectPowerEstimate() : 10;
    const active = typeof getWorldSects === 'function' ? getWorldSects().filter(s => !s.defeated) : [];
    const strongest = active.reduce((best, s) => (!best || s.power > best.power ? s : best), null);
    const weakest = active.reduce((best, s) => (!best || s.power < best.power ? s : best), null);
    const dominantHostile = active
        .filter(s => s.relationship === 'hostile')
        .reduce((best, s) => (!best || s.power > best.power ? s : best), null);
    const weakerNeutral = active
        .filter(s => s.relationship === 'neutral')
        .reduce((best, s) => (!best || s.power < best.power ? s : best), null);
    return { playerPower, strongest, weakest, dominantHostile, weakerNeutral, active };
}

function sectEventPassesPowerGate(ev, ctx) {
    if (!ev.powerCompare) return true;
    const ratio = ev.powerRatio || SECT_WORLD_RELATIONS.powerEventStrongRatio;
    if (ev.powerCompare === 'stronger') {
        return ctx.strongest && ctx.strongest.power >= ctx.playerPower * ratio;
    }
    if (ev.powerCompare === 'weaker') {
        const target = ctx.weakerNeutral || ctx.weakest;
        return target && target.power <= ctx.playerPower * ratio;
    }
    if (ev.powerCompare === 'dominant_hostile') {
        return ctx.dominantHostile && ctx.dominantHostile.power >= ctx.playerPower * ratio;
    }
    return true;
}

function resolveSectEventRival(ev, ctx) {
    if (ev.powerCompare === 'stronger') return ctx.strongest;
    if (ev.powerCompare === 'weaker') return ctx.weakerNeutral || ctx.weakest;
    if (ev.powerCompare === 'dominant_hostile') return ctx.dominantHostile;
    if (ev.requiresRival) return ctx.dominantHostile || getActiveRivals()[0];
    return null;
}

function resolveSectEventText(ev, ctx) {
    const rival = resolveSectEventRival(ev, ctx);
    const text = ev.text || '';
    return text.replace(/\{rival\}/g, rival?.name || 'A rival sect');
}

function rollSectEvent() {
    if (!isSectFounded()) return null;
    ensureSectExpansionState();
    const stage = getSectStage();
    const powerCtx = getSectEventPowerContext();
    const pool = Object.values(SECT_EVENTS).filter(ev => {
        if (!meetsStageRequirement(ev.minStage)) return false;
        if (ev.requiresRival && !countHostileWorldSects()) return false;
        if (ev.requiresDisciple && !getDiscipleCount()) return false;
        if (!sectEventPassesPowerGate(ev, powerCtx)) return false;
        return true;
    });
    if (!pool.length) return null;

    const disciples = getDiscipleCount();
    const zone = typeof getActiveZoneId === 'function' ? getActiveZoneId() : G.currentZone;
    const weighted = [];
    pool.forEach(ev => {
        let w = ev.weight || 1;
        if (stage === 'continental' || stage === 'heavenly') w *= 1.2;
        if (disciples >= 3) w *= 1 + disciples * 0.05;
        if (zone === 'emberwild' || zone === 'dustbone') w *= 1.15;
        if (ev.powerCompare === 'stronger' && powerCtx.strongest) {
            const ratio = powerCtx.strongest.power / Math.max(1, powerCtx.playerPower);
            if (ratio >= 1.25) w *= 1.35;
        }
        if (ev.powerCompare === 'dominant_hostile' && powerCtx.dominantHostile) {
            w *= 1.25;
        }
        if (ev.powerCompare === 'weaker' && powerCtx.weakerNeutral) w *= 1.1;
        for (let i = 0; i < Math.ceil(w * 10); i++) weighted.push(ev);
    });
    return weighted[Math.floor(Math.random() * weighted.length)];
}

function tickSectRandomEvents(monthsPassed) {
    if (!isSectFounded() || monthsPassed <= 0) return;
    ensureSectExpansionState();
    if (G.sect.pendingEvent) return;

    const since = (G.ageMonths || 0) - (G.sect.lastEventMonths || 0);
    if (since < SECT_EVENT_BALANCE.intervalMonths) return;
    if (Math.random() > SECT_EVENT_BALANCE.baseChance) {
        G.sect.lastEventMonths = G.ageMonths || 0;
        return;
    }

    const ev = rollSectEvent();
    G.sect.lastEventMonths = G.ageMonths || 0;
    if (!ev) return;

    const powerCtx = getSectEventPowerContext();
    const rival = resolveSectEventRival(ev, powerCtx);
    G.sect.pendingEvent = { eventId: ev.id, atMonths: G.ageMonths, rivalId: rival?.id || null };
    openSectEventPopup(ev.id);
}

function openSectEventPopup(eventId) {
    const ev = SECT_EVENTS[eventId];
    if (!ev) return;
    const popup = document.getElementById('sectEventPopup');
    const powerCtx = getSectEventPowerContext();
    const pendingRival = G.sect.pendingEvent?.rivalId
        ? (typeof getWorldSectById === 'function' ? getWorldSectById(G.sect.pendingEvent.rivalId) : null)
        : null;
    if (pendingRival) powerCtx.rival = pendingRival;
    const eventText = resolveSectEventText(ev, powerCtx);
    if (!popup) {
        applySectEventChoice(eventId, Object.keys(ev.choices)[0]);
        return;
    }
    document.getElementById('sectEventTitle').textContent = ev.title;
    document.getElementById('sectEventText').textContent = eventText;
    const choices = document.getElementById('sectEventChoices');
    choices.innerHTML = Object.entries(ev.choices).map(([key, c]) =>
        `<button type="button" class="popup-item sect-event-choice" data-event-id="${eventId}" data-choice="${key}">
            <div class="name">${c.label}</div>
        </button>`
    ).join('');
    choices.querySelectorAll('.sect-event-choice').forEach(btn => {
        btn.onclick = function() {
            applySectEventChoice(this.dataset.eventId, this.dataset.choice);
            popup.classList.remove('active');
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        };
    });
    popup.classList.add('active');
}

function applySectEventChoice(eventId, choiceKey) {
    const ev = SECT_EVENTS[eventId];
    const choice = ev?.choices?.[choiceKey];
    if (!ev || !choice) return;

    G.sect.pendingEvent = null;
    const fx = choice.effects || {};
    markSectActivity();
    appendSectChronicle(`${ev.title}: ${choice.label}`, '📋');

    if (fx.months && !advanceTime(fx.months, ev.title)) return;

    if (fx.stones) {
        let stones = fx.stones;
        if (stones < 0 && typeof getSectEventStoneLossMult === 'function') {
            stones = Math.floor(stones * getSectEventStoneLossMult());
        } else if (stones < 0 && typeof getSectTraitEventStoneLossMult === 'function') {
            stones = Math.floor(stones * getSectTraitEventStoneLossMult());
        }
        G.stones = Math.max(0, (G.stones || 0) + stones);
    }
    if (fx.renown) addSectRenown(fx.renown);
    if (fx.foundation) G.foundation += fx.foundation;
    if (fx.respect || fx.fear || fx.reviled) {
        shiftSectReputation('sect_event', { respect: fx.respect || 0, fear: fx.fear || 0, reviled: fx.reviled || 0 });
    }

    if (fx.disciple) {
        const name = typeof rollRecruitName === 'function' ? rollRecruitName() : 'New Disciple';
        if (typeof addSectDisciple === 'function') {
            addSectDisciple(name, 'acolyte', { announceTrait: true });
        }
    }

    if (fx.combatCheck) {
        const mult = getSectTraitCombatMultForEvents();
        if (mult >= 1.05) {
            addSectRenown(2);
            addLog('🦁 Brave disciples lead the defense — extra Renown earned.');
        } else if (mult < 0.98) {
            G.stones = Math.max(0, G.stones - 5);
            addLog('🐭 Panic spreads — you lose extra resources.');
        }
    }

    if (fx.cultivationCheck) {
        const wise = G.sect.discipleRecords.filter(d => d.trait === 'wise').length;
        if (wise > 0) {
            const per = DISCIPLE_TRAITS.wise.cultivateFoundationBonus || 1;
            const gain = wise * per;
            G.foundation += gain;
            addLog(`🦉 Wise disciples guide the breakthrough (+${gain} Foundation).`);
        }
    }

    if (typeof applyDiscipleTraitEventEffects === 'function') applyDiscipleTraitEventEffects();

    if (fx.triggerDuel) {
        const rivalId = G.sect.pendingEvent?.rivalId;
        const rival = rivalId && typeof getWorldSectById === 'function'
            ? getWorldSectById(rivalId)
            : (getActiveRivals()[0] || (G.sect.grudgeSects || [])[0]);
        if (rival && typeof startSectRivalDuel === 'function') {
            if (rival.relationship !== 'hostile') {
                shiftWorldSectRelationship(rival, 'hostile', 'your public challenge');
            }
            setTimeout(() => startSectRivalDuel(rival.id), 300);
        }
    }

    if (fx.relationshipDrift && typeof applyWorldSectRelationshipDrift === 'function') {
        const rival = G.sect.pendingEvent?.rivalId && typeof getWorldSectById === 'function'
            ? getWorldSectById(G.sect.pendingEvent.rivalId)
            : null;
        applyWorldSectRelationshipDrift(fx.relationshipDrift, { rival, targetId: rival?.id });
    }

    addLog(`📋 Sect event — ${ev.title}: ${choice.label}`);
}

function getEnshrineTreasureBlockReason(treasureId) {
    ensureSectExpansionState();
    if (!isSectFounded()) return 'Found a sect first.';
    if (G.sect.treasureEnshrinedThisLeader) return 'This leader has already enshrined a treasure.';
    const def = SECT_HEIRLOOMS[treasureId] || SECT_TREASURES[treasureId];
    if (!def) return 'Unknown heirloom.';
    if ((G.stones || 0) < 40) return 'Need 40 Spirit Stones to enshrine.';
    if ((G.sect.heirlooms || G.sect.treasures || []).length >= SECT_LEGACY.maxHeirlooms) return 'Heirloom vault is full.';
    return null;
}

function enshrineSectTreasure(treasureId) {
    const block = getEnshrineTreasureBlockReason(treasureId);
    if (block) return { success: false, message: block };
    const def = SECT_HEIRLOOMS[treasureId] || SECT_TREASURES[treasureId];
    if (!advanceTime(6, `Enshrining ${def.name}`)) {
        return { success: false, message: 'Your lifespan ends...' };
    }
    G.stones -= 40;
    if (!G.sect.heirlooms) G.sect.heirlooms = [];
    G.sect.heirlooms.push({
        id: treasureId,
        leader: G.name,
        generation: G.sect.leaderGeneration,
        months: G.ageMonths,
        passedDown: 0
    });
    G.sect.treasures = G.sect.heirlooms;
    G.sect.treasureEnshrinedThisLeader = true;
    markSectActivity();
    appendSectChronicle(`${G.name} enshrined the ${def.name} as a sect heirloom.`, def.emoji);
    addLog(`${def.emoji} ${def.name} joins the lineage vault — ${def.desc}`);
    return { success: true, message: `${def.name} enshrined as heirloom.` };
}

function getSectTreasureBonuses() {
    return getSectHeirloomBonuses();
}

function trySectLeaderSuccessionOnDeath() {
    if (!isSectFounded() || G.sectSuccessionActive) return false;
    G.sectSuccessionActive = true;
    G.lifespanMonths = G.ageMonths + 1;
    openSectSuccessionPopup();
    return true;
}

function openSectSuccessionPopup() {
    const popup = document.getElementById('sectSuccessionPopup');
    if (!popup) {
        applySectSuccession(null);
        return;
    }
    document.getElementById('sectSuccessionTitle').textContent = '👑 Sect Succession';
    document.getElementById('sectSuccessionText').textContent =
        `${G.name}'s lifespan ends. ${G.sect.name} must choose a new leader — or fall into chaos.`;
    const list = document.getElementById('sectSuccessionChoices');
    let html = `<button type="button" class="popup-item sect-succession-choice" data-succession="">
        <div class="name">💀 No successor — sect falls into chaos</div>
        <div class="desc">Lose 50% resources and all disciples</div>
    </button>`;
    G.sect.discipleRecords.forEach(d => {
        const role = DISCIPLE_ROLES[d.role] || DISCIPLE_ROLES.acolyte;
        const trait = getDiscipleTraitDef(d.trait);
        html += `<button type="button" class="popup-item sect-succession-choice" data-succession="${d.uid}">
            <div class="name">${role.emoji} ${d.name} — ${role.label}</div>
            <div class="desc">${trait.emoji} ${trait.label} — ${trait.effectDesc || trait.desc}</div>
        </button>`;
    });
    list.innerHTML = html;
    list.querySelectorAll('.sect-succession-choice').forEach(btn => {
        btn.onclick = function() {
            const uid = this.dataset.succession || null;
            applySectSuccession(uid || null);
            popup.classList.remove('active');
            fullRender();
        };
    });
    popup.classList.add('active');
}

function applySuccessorStats(disciple) {
    const role = disciple?.role || 'acolyte';
    const mult = SECT_LEGACY.statMult[role] || 0.6;
    const drop = SECT_LEGACY.leaderRealmDrop[role] ?? 2;
    G.realmIdx = Math.max(0, G.realmIdx - drop);

    const path = PATHS[G.path] || PATHS.qi;
    const base = path.base;
    G.qi = Math.max(1, Math.floor((base.qi || 10) * mult + G.realmIdx * 3));
    G.vitality = Math.max(1, Math.floor((base.vitality || 4) * mult + G.realmIdx));
    G.spirit = Math.max(1, Math.floor((base.spirit || 5) * mult + G.realmIdx));
    G.will = Math.max(1, Math.floor((base.will || 3) * mult + G.realmIdx));
    if (typeof applyVitalityToMaxHp === 'function') applyVitalityToMaxHp();
    else G.maxHp = Math.max(20, Math.floor((base.hp || 70) * mult + G.vitality * 2));
    G.hp = G.maxHp;
    if (typeof clampCurrentQi === 'function') clampCurrentQi();
}

function applySectSuccession(discipleUid) {
    ensureSectExpansionState();
    const prevLeader = G.name;
    const prevGen = G.sect.leaderGeneration || 1;

    appendSectChronicle(`${prevLeader} (Generation ${prevGen}) passed the mantle.`, '🕯️');

    if (!discipleUid) {
        G.stones = Math.floor((G.stones || 0) * (1 - SECT_LEGACY.chaosResourceLossPct));
        if (G.sect.resources) {
            G.sect.resources.stones = Math.floor((G.sect.resources.stones || 0) * (1 - SECT_LEGACY.chaosResourceLossPct));
        }
        G.sect.discipleRecords = [];
        syncSectLegacyFields();
        addSectRenown(-Math.floor((G.sect.renown || 0) * 0.3));
        appendSectChronicle(`${G.sect.name} fell into chaos — disciples scattered.`, '💀');
        addLog(`💀 Without a successor, ${G.sect.name} collapses into chaos!`);
        G.sectSuccessionActive = false;
        G.gameOver = true;
        addLog(`💀 Your lineage ends. The sect may not recover.`);
        return;
    }

    const idx = G.sect.discipleRecords.findIndex(d => d.uid === discipleUid);
    if (idx < 0) {
        G.sectSuccessionActive = false;
        G.gameOver = true;
        return;
    }

    const disciple = G.sect.discipleRecords[idx];
    G.sect.discipleRecords.splice(idx, 1);
    syncSectLegacyFields();

    G.name = disciple.name;
    G.sect.leaderGeneration = prevGen + 1;
    G.sect.treasureEnshrinedThisLeader = false;
    passDownHeirloomsOnSuccession(G.sect.leaderGeneration);
    unlockSectSpiritIfEligible();
    applySuccessorStats(disciple);

    G.ageMonths = SECT_LEGACY.successorAgeYears * 12;
    G.lifespanMonths = G.ageMonths + getLifespanForRealm(G.realmIdx) * 12;
    const tBonus = getSectHeirloomBonuses();
    G.foundation += tBonus.foundationBonus || 0;
    addSectRenown(tBonus.renownBonus || 0);

    appendSectChronicle(`${disciple.name} became Generation ${G.sect.leaderGeneration} leader.`, '👑');
    addLog(`👑 ${disciple.name} inherits ${G.sect.name}! Generation ${G.sect.leaderGeneration} begins.`);
    if (G.sect.sectSpiritUnlocked) {
        addLog(`${SECT_SPIRIT.emoji} The ${SECT_SPIRIT.name} watches over the new leader.`);
    }

    G.sectSuccessionActive = false;
    G.gameOver = false;
}

function tickSectExpansion(monthsPassed) {
    if (!isSectFounded() || monthsPassed <= 0) return;
    ensureSectExpansionState();
    tickSectReputationDecay(monthsPassed);
    tickSectReviledBounty(monthsPassed);
    tickSectDiplomacy();
    tickSectLegacyChecks(monthsPassed);
    tickSectRandomEvents(monthsPassed);
}

function renderSectQuestsPanelHtml() {
    if (!isSectFounded()) return '';
    ensureSectExpansionState();
    let html = `<div class="sect-section-title">📋 Sect Quests</div>`;
    html += `<p class="sect-hint">Launch disciple missions from the sect hall. Max ${SECT_QUEST_BALANCE.maxActive} active.</p>`;

    const active = (G.sectQuests || []).filter(q => q.status === 'active');
    if (active.length) {
        html += `<div class="sect-quest-active-list">`;
        active.forEach(sq => {
            const def = sq.template || (typeof getSectQuestDef === 'function' ? getSectQuestDef(sq.questDefId) : null);
            const emoji = def?.emoji || sq.emoji || '📋';
            html += `<div class="sect-quest-row active">
                <span>${emoji} <strong>${sq.title}</strong></span>
                <span class="sect-hint-inline">${sq.objective}</span>
            </div>`;
        });
        html += `</div>`;
    }

    html += `<div class="sect-quest-launch-list">`;
    Object.values(SECT_QUEST_DEFINITIONS).forEach(def => {
        const block = typeof getSectQuestLaunchBlockReason === 'function'
            ? getSectQuestLaunchBlockReason(def.id)
            : null;
        const rewardParts = [];
        if (def.fame) rewardParts.push(`+${def.fame} Fame`);
        if (def.renown) rewardParts.push(`+${def.renown} Renown`);
        if (def.stones) rewardParts.push(`+${def.stones} Stones`);
        if (def.materials) {
            Object.entries(def.materials).forEach(([id, qty]) => {
                const mat = CRAFT_MATERIALS[id];
                rewardParts.push(`+${qty} ${mat?.name || id}`);
            });
        }
        const reqParts = [];
        if (def.minDisciples) reqParts.push(`${def.minDisciples}+ disciples`);
        if (def.months) reqParts.push(`${def.months}mo`);
        if (def.stonesCost) reqParts.push(`${def.stonesCost}💎`);
        if (def.completeOn === 'manual') reqParts.push('instant on launch');
        else if (def.completeOn === 'combat') reqParts.push('then win combat');
        else if (def.completeOn === 'raid') reqParts.push('then raid hostile');
        else if (def.completeOn === 'diplomacy') reqParts.push('then diplomacy');
        else if (def.completeOn === 'tribulation_pass') reqParts.push('then pass tribulation');
        const tip = block || `${def.description} Reward: ${rewardParts.join(', ')}. Cost: ${reqParts.join(', ')}.`;
        html += `<div class="sect-quest-launch-row">
            <div class="sect-quest-launch-head">
                <span>${def.emoji} ${def.title}</span>
                <button type="button" class="sect-quest-btn" data-sect-quest="${def.id}" ${block ? `disabled title="${String(tip).replace(/"/g, '&quot;')}"` : `title="${String(tip).replace(/"/g, '&quot;')}"`}>Launch</button>
            </div>
            <div class="sect-quest-launch-desc">${def.description}</div>
            <div class="sect-quest-launch-meta">${def.objective} · ${rewardParts.join(' · ')}</div>
        </div>`;
    });
    html += `</div>`;
    return html;
}

function renderSectLegacyPanelHtml() {
    if (!isSectFounded()) return '';
    ensureSectExpansionState();
    let html = '';

    const ageYears = getSectAgeYears();
    const gen = G.sect.leaderGeneration || 1;
    html += `<div class="sect-section-title">🏛️ Sect Legacy</div>`;
    html += `<div class="sect-legacy-stats">
        <span>📅 Sect Age: <strong>${ageYears} years</strong></span>
        <span>👑 Generation: <strong>${gen}</strong></span>
    </div>`;

    if (G.sect.legendUnlocked) {
        html += `<div class="sect-legacy-banner legend">🌟 <strong>Sect Legend</strong> — +${SECT_LEGACY.legendIncomePct}% income, +${Math.round((SECT_LEGACY.legendRenownMult - 1) * 100)}% Renown</div>`;
    } else {
        const remain = Math.max(0, SECT_LEGACY.legendAgeYears - ageYears);
        html += `<div class="sect-legacy-banner pending">🌟 Sect Legend unlocks in ${remain} years (${SECT_LEGACY.legendAgeYears}+ total).</div>`;
    }

    if (G.sect.sectSpiritUnlocked) {
        html += `<div class="sect-legacy-banner spirit">${SECT_SPIRIT.emoji} <strong>${SECT_SPIRIT.name}</strong> — ${SECT_SPIRIT.desc}</div>`;
    } else {
        const need = Math.max(0, SECT_LEGACY.spiritMinGeneration - gen);
        html += `<div class="sect-legacy-banner pending">${SECT_SPIRIT.emoji} Guardian spirit awakens after ${SECT_LEGACY.spiritMinGeneration} generations (${need} to go).</div>`;
    }

    if (!G.sect.treasureEnshrinedThisLeader) {
        html += `<div class="sect-section-title">🏺 Enshrine Heirloom</div>`;
        html += `<p class="sect-hint">Each leader may enshrine one heirloom (40 Stones, 6 months). Heirlooms grow stronger each succession.</p>`;
        Object.values(SECT_HEIRLOOMS).forEach(t => {
            html += `<button type="button" class="sect-conflict-btn" data-enshrine="${t.id}" title="${t.desc}">${t.emoji} ${t.name}</button>`;
        });
    }

    const heirlooms = G.sect.heirlooms || [];
    if (heirlooms.length) {
        html += `<div class="sect-section-title">🏺 Lineage Heirlooms</div>`;
        heirlooms.forEach(h => {
            const def = SECT_HEIRLOOMS[h.id];
            if (!def) return;
            const passed = h.passedDown || 0;
            html += `<div class="sect-heirloom-row">
                <span>${def.emoji} <strong>${def.name}</strong></span>
                <span class="sect-hint-inline">Gen ${h.generation} · Passed ${passed}× · ${def.desc}</span>
            </div>`;
        });
    }

    if ((G.sect.chronicle || []).length) {
        html += `<div class="sect-section-title">📖 Sect Chronicle</div>`;
        html += `<p class="sect-hint">A record of major events across generations.</p>`;
        html += `<div class="sect-chronicle-list">`;
        G.sect.chronicle.slice(0, 12).forEach(entry => {
            html += `<div class="sect-chronicle-entry">${formatChronicleEntry(entry)}</div>`;
        });
        html += `</div>`;
    }

    return html;
}

function renderSectExpansionPanelHtml() {
    if (!isSectFounded()) return '';
    ensureSectExpansionState();
    let html = '';

    const perk = getSectReputationPerk();
    if (perk) {
        html += `<div class="sect-perk-banner">${getSectReputationTier().emoji} <strong>Reputation perk:</strong> ${perk.label}</div>`;
    }

    if (canPerformDoctrineCeremony()) {
        html += `<div class="sect-section-title">📜 Doctrine Ceremony</div>`;
        html += `<p class="sect-hint">Re-swearing costs ${SECT_DOCTRINE_CEREMONY.stones} Stones, ${SECT_DOCTRINE_CEREMONY.renown} Renown, ${SECT_DOCTRINE_CEREMONY.months} months.</p>`;
        html += `<div class="sect-doctrine-picker sect-ceremony-picker">`;
        Object.values(SECT_DOCTRINES).forEach(d => {
            const active = G.sect.doctrine === d.id;
            html += `<button type="button" class="sect-doctrine-card sect-ceremony-btn${active ? ' selected' : ''}" data-ceremony-doctrine="${d.id}" ${active ? 'disabled' : ''}>
                <div class="sect-doctrine-card-head">${d.emoji} ${d.label}</div>
            </button>`;
        });
        html += `</div>`;
    }

    const friendlyCount = countFriendlyWorldSects();
    const hostileCount = countHostileWorldSects();
    const neutralCount = typeof getWorldSects === 'function'
        ? getWorldSects().filter(s => !s.defeated && s.relationship === 'neutral').length
        : 0;
    if (meetsStageRequirement('established')) {
        html += `<div class="sect-section-title">🤝 Diplomacy Actions</div>`;
        html += `<p class="sect-hint">${friendlyCount} friendly · ${hostileCount} hostile · ${neutralCount} neutral. Use per-sect emoji buttons on jianghu cards for targeted diplomacy.</p>`;
        html += `<div class="sect-diplo-legend">`;
        Object.values(SECT_DIPLOMACY_ACTIONS).forEach(a => {
            html += `<div class="sect-diplo-legend-row"><span>${a.emoji} ${a.label}</span><span class="sect-trait-effect">${a.effectDesc}</span></div>`;
        });
        html += `</div>`;
        if (canFormDiplomaticAlliance()) {
            html += `<button type="button" class="sect-action-btn" id="btnSeekAlliance">🤝 Seek Alliance</button>`;
        }
        if (canDeclareGrudge()) {
            html += `<button type="button" class="sect-action-btn sect-grudge-btn" id="btnDeclareGrudge">⚔️ Declare Grudge</button>`;
        }
    }

    html += renderSectQuestsPanelHtml();
    html += renderSectLegacyPanelHtml();

    html += `<div class="sect-section-title sect-section-muted">🎭 Disciple Traits</div>`;
    html += `<p class="sect-hint">Temperaments roll at recruitment and shape income, combat, events, and promotions.</p>`;
    html += `<div class="sect-trait-legend">`;
    Object.values(DISCIPLE_TRAITS).forEach(t => {
        html += `<div class="sect-trait-legend-row" title="${t.desc}"><span>${t.emoji} ${t.label}</span><span class="sect-trait-effect">${t.effectDesc || ''}</span></div>`;
    });
    html += `</div>`;

    return html;
}

function bindSectExpansionPanelEvents(container) {
    if (!container) return;
    container.querySelectorAll('[data-ceremony-doctrine]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = performDoctrineCeremony(this.dataset.ceremonyDoctrine);
            if (result.message) addLog(result.success ? `📜 ${result.message}` : `📜 ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelector('#btnSeekAlliance')?.addEventListener('click', () => {
        const result = seekDiplomaticAlliance();
        if (result.message) addLog(result.success ? `🤝 ${result.message}` : `🤝 ${result.message}`);
        if (typeof renderSectPopup === 'function') renderSectPopup();
        fullRender();
    });
    container.querySelector('#btnDeclareGrudge')?.addEventListener('click', () => {
        const result = declareSectGrudge();
        if (result.message) addLog(result.success ? `⚔️ ${result.message}` : `⚔️ ${result.message}`);
        if (typeof renderSectPopup === 'function') renderSectPopup();
        fullRender();
    });
    container.querySelectorAll('[data-enshrine]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = enshrineSectTreasure(this.dataset.enshrine);
            if (result.message) addLog(result.success ? `🏺 ${result.message}` : `🏺 ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-sect-quest]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (typeof launchSectQuest !== 'function') return;
            const result = launchSectQuest(this.dataset.sectQuest);
            if (result.message) addLog(result.success ? `📋 ${result.message}` : `📋 ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
}
