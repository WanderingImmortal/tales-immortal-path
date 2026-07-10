// ============================================
// FACTIONS-EXPAND.JS — All-zone faction mechanics, NPCs, sect pacts, arcs
// ============================================

function ensureFactionStateExtended() {
    ensureFactionState();
    if (!G.factions.sectPacts) G.factions.sectPacts = {};
    if (!G.factions.chronicle) G.factions.chronicle = [];
    if (G.factions.beastKillsInJungle == null) G.factions.beastKillsInJungle = 0;
    if (G.factions.phoenixWarStage == null) G.factions.phoenixWarStage = 0;
    if (G.factions.seaBeastCrisis == null) G.factions.seaBeastCrisis = false;
    if (G.factions.seaBeastResolved == null) G.factions.seaBeastResolved = false;
    if (G.factions.dustboneGrandTreaty == null) G.factions.dustboneGrandTreaty = false;
    if (G.factions.tribunalWar == null) G.factions.tribunalWar = false;
}

function isFactionNpcId(npcId) {
    return !!(npcId && String(npcId).startsWith('faction_') && FACTION_NPCS[npcId]);
}

function getFactionNpcDef(npcId) {
    return FACTION_NPCS[npcId] || null;
}

function getFactionNpcsInZone(zoneId) {
    return Object.values(FACTION_NPCS).filter(n => {
        if (n.zone !== zoneId) return false;
        if (typeof isFactionNpcAtCurrentLocation === 'function' && !isFactionNpcAtCurrentLocation(n.id)) return false;
        return true;
    });
}

function isFactionNpcAccessible(npcId) {
    const def = getFactionNpcDef(npcId);
    if (!def) return false;
    const mech = getZoneFactionMechanic(def.zone);
    if (mech?.isolationThreshold != null) {
        if (getFactionRep(def.factionId) < mech.isolationThreshold) return false;
    }
    return true;
}

function isZoneFactionIsolated(zoneId) {
    const mech = getZoneFactionMechanic(zoneId);
    if (!mech?.isolationThreshold || !mech.factionIds?.length) return false;
    const fid = mech.factionIds[0];
    return getFactionRep(fid) < mech.isolationThreshold;
}

function getZoneFactionPerkSum(zoneId, perkKey) {
    const mech = getZoneFactionMechanic(zoneId);
    if (!mech?.implemented) return 0;
    let total = 0;
    (mech.factionIds || []).forEach(id => { total += getFactionPerkValue(id, perkKey) || 0; });
    return total;
}

function getActiveFactionSectPactEffects() {
    ensureFactionStateExtended();
    const effects = { combatDmgPct: 0, tradeIncomePct: 0, marketDiscountPct: 0, daoSpeedPct: 0, exploreBonusPct: 0, coldResistPct: 0, beastAffinityPct: 0, spiritBonus: 0 };
    Object.entries(G.factions.sectPacts || {}).forEach(([factionId, pactId]) => {
        const pact = FACTION_SECT_PACTS[pactId];
        if (!pact || pact.factionId !== factionId) return;
        Object.entries(pact.effects || {}).forEach(([k, v]) => {
            if (effects[k] != null) effects[k] += v;
        });
    });
    return effects;
}

function onFactionRepChanged(factionId, delta) {
    if (!delta) return;
    ensureFactionStateExtended();
    const def = getFactionDef(factionId);
    if (!def) return;

    if (def.zone === 'dustbone' && delta > 0 && getFactionTier(factionId).id === 'allied' && !G.factions.dustboneGrandTreaty) {
        const mech = ZONE_FACTION_MECHANICS.dustbone;
        const otherAllied = (mech.factionIds || []).filter(id => id !== factionId && getFactionTier(id).id === 'allied');
        if (otherAllied.length) {
            const rival = otherAllied[0];
            G.factions.reputation[rival] = clampFactionRep(getFactionRep(rival) - 15);
            addLog(`⚖️ The Sandveil Tribunal forbids two allied patrons — ${getFactionDef(rival)?.name} turns wary.`);
            appendFactionChronicleEntry({
                category: 'crisis',
                emoji: '⚖️',
                title: 'Tribunal rebuke',
                text: `The Sandveil Tribunal forbids two allied patrons — ${getFactionDef(rival)?.name} turns wary.`,
                zoneId: 'dustbone'
            });
        }
    }

    tryGrantFactionAncientClue(factionId);
    if (factionId === 'storm_dragon' || factionId === 'tidal_lotus') tryTriggerSeaBeastCrisis();
}

function tryGrantFactionAncientClue(factionId) {
    const def = getFactionDef(factionId);
    if (!def?.ancientClueId || !def.ancientClueAt) return false;
    const tier = getFactionTier(factionId);
    const need = def.ancientClueAt === 'friendly' ? 30 : 60;
    if (tier.min < need) return false;
    ensureFactionStateExtended();
    const flag = `clue_${factionId}`;
    if (G.factions.flags[flag]) return false;
    if (typeof addAncientClue === 'function' && addAncientClue(def.ancientClueId)) {
        G.factions.flags[flag] = true;
        addLog(`${def.emoji} ${def.name} shares sealed-site knowledge.`);
        appendFactionChronicleEntry({
            category: 'clue',
            emoji: def.emoji,
            title: `${def.name} shares a clue`,
            text: 'Sealed-site knowledge passed by faction elders.',
            zoneId: def.zone
        });
        return true;
    }
    return false;
}

function canPerformExtendedFactionAction(actionId, factionId) {
    const action = FACTION_ACTIONS[actionId];
    if (!action) return 'Unknown action.';
    if (action.factions && !action.factions.includes(factionId)) return 'Not available for this faction.';
    if (action.zones) {
        const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : G.currentZone;
        if (!action.zones.includes(zoneId)) return `Only in ${action.zones.map(z => ZONES[z]?.name || z).join(', ')}.`;
    }
    if (action.requiresLegendary) {
        const mats = G.legendaryMaterials || [];
        if (!mats.length) return 'Need a legendary material in inventory.';
    }
    return null;
}

function performExtendedFactionAction(actionId, factionId) {
    const action = FACTION_ACTIONS[actionId];
    if (action?.special === 'broker_peace') return performBrokerDustbonePeace();
    if (action?.special === 'incite_rivalry') return performInciteDustboneRivalry();

    if (actionId === 'offer_tribute') {
        const mats = G.legendaryMaterials || [];
        if (!mats.length) return { success: false, message: 'No legendary material to offer.' };
        const mat = mats.pop();
        if (!advanceTime(action.months, `Offering ${mat} to the Monastery`)) {
            mats.push(mat);
            return { success: false, message: 'Lifespan ends.' };
        }
        shiftFactionRep(factionId, action.rep, `tribute: ${mat}`);
        if (action.alignment && typeof shiftDaoAlignment === 'function') shiftDaoAlignment(action.alignment, 'monastery tribute');
        G.coldResistBonus = (G.coldResistBonus || 0) + 2;
        addLog(`🏆 The Monastery accepts ${mat}. The ice feels less hostile.`);
        return { success: true, message: 'Tribute accepted.' };
    }

    if (actionId === 'offer_herbs') {
        const block = canPerformFactionAction(actionId, factionId) || canPerformExtendedFactionAction(actionId, factionId);
        if (block) return { success: false, message: block };
        if (!advanceTime(action.months, 'Offering herbs to the Collective')) {
            return { success: false, message: 'Lifespan ends.' };
        }
        G.stones -= action.stones || 0;
        shiftFactionRep(factionId, action.rep, 'herb offering');
        if (action.alignment && typeof shiftDaoAlignment === 'function') shiftDaoAlignment(action.alignment, 'jungle respect');
        return { success: true, message: 'The Collective accepts your offering.' };
    }

    return null;
}

function performBrokerDustbonePeace() {
    ensureFactionStateExtended();
    const tribes = ZONE_FACTION_MECHANICS.dustbone.factionIds;
    const allFriendly = tribes.every(id => getFactionRep(id) >= 30);
    if (!allFriendly) return { success: false, message: 'All three tribes must be Friendly (30+ rep) first.' };
    if (!advanceTime(6, 'Brokering the Grand Sandveil Treaty')) {
        return { success: false, message: 'Lifespan ends.' };
    }
    G.stones = Math.max(0, G.stones - 20);
    G.factions.dustboneGrandTreaty = true;
    tribes.forEach(id => shiftFactionRep(id, 8, 'Grand Treaty'));
    if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(10, 'brokering tribal peace');
    G.factions.tribunalWar = false;
    addLog('🕊️ The Sandveil Tribunal signs the Grand Treaty — all three tribes honor you.');
    appendFactionChronicleEntry({
        category: 'arc',
        emoji: '🕊️',
        title: 'Grand Sandveil Treaty signed',
        text: 'All three Dustbone tribes honor you — exclusive allied limits are waived.',
        zoneId: 'dustbone',
        status: 'complete'
    });
    if (G.factions.activeQuests.some(q => q.questId === 'dustbone_broker_treaty')) {
        completeFactionQuest('dustbone_broker_treaty');
    }
    return { success: true, message: 'Grand Sandveil Treaty signed!' };
}

function performInciteDustboneRivalry() {
    if (!advanceTime(3, 'Inciting tribal rivalry')) return { success: false, message: 'Lifespan ends.' };
    G.stones = Math.max(0, G.stones - 10);
    G.factions.tribunalWar = true;
    G.factions.dustboneGrandTreaty = false;
    shiftFactionRep('sunscar_clan', 5, 'inciting war');
    shiftFactionRep('dune_riders', -6, 'border raids');
    shiftFactionRep('ashen_priests', -4, 'omens of blood');
    if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(-8, 'tribal bloodshed');
    addLog('⚔️ The tribes clash — you profit from chaos, but the desert remembers.');
    appendFactionChronicleEntry({
        category: 'crisis',
        emoji: '⚔️',
        title: 'Tribal war incited',
        text: 'Sunscar, Dune Riders, and Ashen Priests clash at your urging.',
        zoneId: 'dustbone'
    });
    return { success: true, message: 'Tribal rivalry incited.' };
}

function performFactionSectPact(pactId) {
    const pact = FACTION_SECT_PACTS[pactId];
    if (!pact) return { success: false, message: 'Unknown pact.' };
    if (pact.requiresSect && typeof isSectFounded === 'function' && !isSectFounded()) {
        return { success: false, message: 'Found a sect first.' };
    }
    if (getFactionRep(pact.factionId) < (pact.minRep || 0)) {
        return { success: false, message: `Need ${pact.minRep}+ rep with ${getFactionDef(pact.factionId)?.name}.` };
    }
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : G.currentZone;
    const fzone = getFactionDef(pact.factionId)?.zone;
    if (fzone !== zoneId) return { success: false, message: `Negotiate in ${ZONES[fzone]?.name || fzone}.` };
    if ((G.stones || 0) < (pact.stones || 0)) return { success: false, message: `Need ${pact.stones} Stones.` };
    ensureFactionStateExtended();
    if (G.factions.sectPacts[pact.factionId]) {
        return { success: false, message: 'Already have a pact with this faction.' };
    }
    if (!advanceTime(pact.months, `Sect pact: ${pact.label}`)) {
        return { success: false, message: 'Lifespan ends.' };
    }
    G.stones -= pact.stones || 0;
    G.factions.sectPacts[pact.factionId] = pactId;
    if (pact.effects?.sectRenown && typeof addSectRenown === 'function') addSectRenown(pact.effects.sectRenown);
    if (pact.effects?.foundation) grantFoundation(pact.effects.foundation);
    if (pact.effects?.stones) G.stones += pact.effects.stones;
    addLog(`${pact.emoji} Sect pact signed: ${pact.label} with ${getFactionDef(pact.factionId)?.name}.`);
    appendFactionChronicleEntry({
        category: 'pact',
        emoji: pact.emoji,
        title: pact.label,
        text: `Sect pact with ${getFactionDef(pact.factionId)?.name}.`,
        zoneId: getFactionDef(pact.factionId)?.zone,
        status: 'active'
    });
    return { success: true, message: pact.label };
}

function tryTriggerSeaBeastCrisis() {
    ensureFactionStateExtended();
    if (G.factions.seaBeastCrisis || G.factions.seaBeastResolved) return;
    const combined = getFactionRep('storm_dragon') + getFactionRep('tidal_lotus');
    if (combined < (FACTION_BALANCE.seaBeastMinCombinedRep || 35)) return;
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : G.currentZone;
    if (zoneId !== 'jade') return;
    G.factions.seaBeastCrisis = true;
    addLog('🌊 A legendary sea beast stirs — Storm Dragon and Tidal Lotus call for aid!');
    appendFactionChronicleEntry({
        category: 'arc',
        emoji: '🌊',
        title: 'The Leviathan Rises',
        text: 'A ancient leviathan threatens the Archipelago — both sects must answer.',
        zoneId: 'jade',
        status: 'active'
    });
    setTimeout(() => openSeaBeastPopup(), 500);
}

function openSeaBeastPopup() {
    const popup = document.getElementById('factionPlotPopup');
    if (!popup) return;
    document.getElementById('factionPlotTitle').textContent = '🌊 The Leviathan Rises';
    document.getElementById('factionPlotText').textContent =
        'A ancient leviathan threatens the Archipelago. The twin sects must fight together — or perish apart. How will you answer?';
    document.getElementById('factionPlotChoices').innerHTML = `
        <button type="button" class="popup-item quest-choice" data-sea-choice="unite">
            <div class="name">🐉🪷 Unite the Sects</div>
            <div class="desc">+Both rep, +Alignment, unlock joint hunt quest</div>
        </button>
        <button type="button" class="popup-item quest-choice" data-sea-choice="dragon">
            <div class="name">🐉 Side with Storm Dragon</div>
            <div class="desc">+Dragon rep, −Lotus rep, combat focus</div>
        </button>
        <button type="button" class="popup-item quest-choice" data-sea-choice="lotus">
            <div class="name">🪷 Side with Tidal Lotus</div>
            <div class="desc">+Lotus rep, −Dragon rep, mystical boon</div>
        </button>`;
    popup.querySelectorAll('[data-sea-choice]').forEach(btn => {
        btn.onclick = () => {
            resolveSeaBeastCrisis(btn.dataset.seaChoice);
            popup.classList.remove('active');
            fullRender();
        };
    });
    popup.classList.add('active');
}

function resolveSeaBeastCrisis(choiceId) {
    ensureFactionStateExtended();
    G.factions.seaBeastResolved = true;
    const choiceLabels = {
        unite: 'United both sects against the leviathan',
        dragon: 'Sailed with the Storm Dragon fleet',
        lotus: 'Blessed by Tidal Lotus shamans'
    };
    if (choiceId === 'unite') {
        shiftFactionRep('storm_dragon', 10, 'leviathan truce');
        shiftFactionRep('tidal_lotus', 10, 'leviathan truce');
        if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(8, 'uniting rival sects');
        addLog('🌊 Both sects stand together. The hunt begins.');
    } else if (choiceId === 'dragon') {
        shiftFactionRep('storm_dragon', 12, 'leviathan alliance');
        shiftFactionRep('tidal_lotus', -8, 'abandoned');
        addLog('🐉 You sail with the Storm Dragon fleet.');
    } else {
        shiftFactionRep('tidal_lotus', 12, 'leviathan alliance');
        shiftFactionRep('storm_dragon', -8, 'abandoned');
        G.spirit += 2;
        addLog('🪷 Tidal Lotus shamans bless your spirit for the hunt.');
    }
    const q = getAvailableFactionQuests('storm_dragon').find(x => x.id === 'jade_sea_beast');
    if (!q && !G.factions.completedQuests.includes('jade_sea_beast')) {
        acceptFactionQuest('jade_sea_beast');
    }
    appendFactionChronicleEntry({
        category: 'arc',
        emoji: '🌊',
        title: 'Leviathan crisis answered',
        text: choiceLabels[choiceId] || choiceId.replace(/_/g, ' '),
        zoneId: 'jade',
        status: 'complete'
    });
}

function getPhoenixWarIntervalMonths() {
    const choice = G.factions?.flags?.phoenixPlotChoice;
    const bal = typeof WORLD_TIME_BALANCE !== 'undefined' ? WORLD_TIME_BALANCE : {};
    if (choice === 'exploit') return bal.phoenixWarExploitIntervalMonths || 18;
    return bal.phoenixWarIntervalMonths || 24;
}

function ensurePhoenixWarScheduled() {
    ensureFactionStateExtended();
    if (!G.factions.flags.phoenixPlotResolved) return;
    if (G.factions.phoenixWarStage <= 0 || G.factions.phoenixWarStage >= 3) return;
    const choice = G.factions.flags.phoenixPlotChoice;
    if (choice === 'exploit' && G.factions.phoenixWarStage >= 2) return;
    if (typeof scheduleWorldEvent !== 'function') return;
    if (hasScheduledWorldEvent('phoenix_war_advance', 'phoenix_war_advance')) return;
    const at = (G.ageMonths || 0) + getPhoenixWarIntervalMonths();
    scheduleWorldEvent('phoenix_war_advance', at, {}, { id: 'phoenix_war_advance' });
}

function schedulePhoenixWarChain() {
    ensureFactionStateExtended();
    if (typeof cancelWorldEvents === 'function') {
        cancelWorldEvents(e => e.type === 'phoenix_war_advance');
    }
    ensurePhoenixWarScheduled();
}

function firePhoenixWarAdvance() {
    ensureFactionStateExtended();
    if (!G.factions.flags.phoenixPlotResolved) return false;
    const choice = G.factions.flags.phoenixPlotChoice;
    if (!choice) return false;
    if (G.factions.phoenixWarStage >= 3) return false;
    if (choice === 'exploit' && G.factions.phoenixWarStage >= 2) return false;

    if (choice === 'help_phoenix') {
        G.factions.phoenixWarStage += 1;
        const stage = PHOENIX_WAR_STAGES[G.factions.phoenixWarStage];
        addLog(`🔥 Phoenix War — ${stage?.label}: ${stage?.desc}`);
        appendFactionChronicleEntry({
            category: 'arc', emoji: '🔥',
            title: stage?.label || `Phoenix War stage ${G.factions.phoenixWarStage}`,
            text: stage?.desc || 'The absorption plot advances.',
            zoneId: 'heartlands', status: G.factions.phoenixWarStage >= 3 ? 'active' : 'logged'
        });
        if (typeof appendWorldChronicle === 'function') {
            appendWorldChronicle({
                emoji: '🔥',
                summary: `Phoenix War — ${stage?.label || 'escalates'}`,
                text: stage?.desc || 'The Heartlands stir with sect conflict.',
                zoneId: 'heartlands',
                type: 'phoenix_war'
            });
        }
        if (G.factions.phoenixWarStage === 3) setTimeout(() => openPhoenixWarPopup(), 500);
    } else if (choice === 'warn_lotus') {
        G.factions.phoenixWarStage += 1;
        const stage = LOTUS_WAR_STAGES[G.factions.phoenixWarStage];
        addLog(`🪷 Lotus Stand — ${stage?.label}: ${stage?.desc}`);
        appendFactionChronicleEntry({
            category: 'arc', emoji: '🪷',
            title: stage?.label || `Lotus Stand stage ${G.factions.phoenixWarStage}`,
            text: stage?.desc || 'The Lotus prepares for siege.',
            zoneId: 'heartlands', status: G.factions.phoenixWarStage >= 3 ? 'active' : 'logged'
        });
        if (typeof appendWorldChronicle === 'function') {
            appendWorldChronicle({
                emoji: '🪷',
                summary: `Lotus Stand — ${stage?.label || 'deepens'}`,
                text: stage?.desc || 'The Jade Lotus brace for siege.',
                zoneId: 'heartlands',
                type: 'phoenix_war'
            });
        }
        if (G.factions.phoenixWarStage === 3) setTimeout(() => openLotusWarPopup(), 500);
    } else if (choice === 'exploit') {
        G.factions.phoenixWarStage += 1;
        const stage = EXPLOIT_WAR_STAGES[G.factions.phoenixWarStage];
        addLog(`💎 Gambit fallout — ${stage?.label}: ${stage?.desc}`);
        appendFactionChronicleEntry({
            category: 'crisis', emoji: '💎',
            title: stage?.label || `Exploit stage ${G.factions.phoenixWarStage}`,
            text: stage?.desc || 'Both sects grow wary.',
            zoneId: 'heartlands', status: G.factions.phoenixWarStage >= 2 ? 'active' : 'logged'
        });
        if (typeof appendWorldChronicle === 'function') {
            appendWorldChronicle({
                emoji: '💎',
                summary: `Gambit fallout — ${stage?.label || 'widens'}`,
                text: stage?.desc || 'Both Heartlands sects grow wary.',
                zoneId: 'heartlands',
                type: 'phoenix_war'
            });
        }
        if (G.factions.phoenixWarStage === 2) setTimeout(() => openExploitHuntPopup(), 500);
    }

    schedulePhoenixWarChain();
    return true;
}

function tryAdvancePhoenixWar() {
    return false;
}

function tryAdvanceHeartlandsWar() {
    return false;
}

function finishExploitHuntAfterChoice(huntChoice) {
    ensureFactionStateExtended();
    G.factions.flags.exploitHuntResolved = true;
    G.factions.phoenixWarStage = 3;
    const stage = EXPLOIT_WAR_STAGES[3];
    addLog(`💎 Gambit fallout — ${stage?.label}: ${stage?.desc}`);
    appendFactionChronicleEntry({
        category: 'crisis', emoji: '🎯',
        title: 'Survived the sect hunt',
        text: huntChoice.replace(/_/g, ' '),
        zoneId: 'heartlands', status: 'logged'
    });
    setTimeout(() => openExploitWarPopup(), 500);
}

function openExploitHuntPopup() {
    const popup = document.getElementById('factionPlotPopup');
    if (!popup) return;
    document.getElementById('factionPlotTitle').textContent = '🎯 Both Sects Hunt You';
    document.getElementById('factionPlotText').textContent =
        'Golden Phoenix bladesmen and Jade Lotus shadow agents converge on your last known position. Someone talked.';
    document.getElementById('factionPlotChoices').innerHTML = `
        <button type="button" class="popup-item quest-choice" data-hunt-choice="vanish_shadow">
            <div class="name">🌫️ Vanish into the alleys</div>
            <div class="desc">25 Stones to bribe lookouts · small rep loss with both</div>
        </button>
        <button type="button" class="popup-item quest-choice" data-hunt-choice="pay_phoenix">
            <div class="name">🔥 Pay off Phoenix envoys</div>
            <div class="desc">40 Stones · +Phoenix rep, Lotus fury</div>
        </button>
        <button type="button" class="popup-item quest-choice" data-hunt-choice="pay_lotus">
            <div class="name">🪷 Pay off Lotus agents</div>
            <div class="desc">40 Stones · +Lotus rep, Phoenix fury</div>
        </button>
        <button type="button" class="popup-item quest-choice" data-hunt-choice="stand_fight">
            <div class="name">⚔️ Stand and fight</div>
            <div class="desc">Duel a sect enforcer — win for Fame, lose and limp away</div>
        </button>`;
    popup.querySelectorAll('[data-hunt-choice]').forEach(btn => {
        btn.onclick = () => {
            resolveExploitHunt(btn.dataset.huntChoice);
            popup.classList.remove('active');
        };
    });
    popup.classList.add('active');
}

function resolveExploitHunt(choiceId) {
    ensureFactionStateExtended();
    if (choiceId === 'stand_fight') {
        startExploitHuntCombat();
        return;
    }
    if (choiceId === 'vanish_shadow') {
        if (G.stones < 25) {
            addLog('You lack stones to vanish — the hunt closes in!');
            shiftFactionRep('golden_phoenix', -6, 'failed bribe');
            shiftFactionRep('jade_lotus', -6, 'failed bribe');
        } else {
            G.stones -= 25;
            shiftFactionRep('golden_phoenix', -4, 'slipped away');
            shiftFactionRep('jade_lotus', -4, 'slipped away');
            addLog('🌫️ You melt into the Heartlands crowds — the hunt fizzles.');
        }
    } else if (choiceId === 'pay_phoenix') {
        if (G.stones < 40) {
            addLog('Phoenix envoys laugh at your empty purse.');
            shiftFactionRep('golden_phoenix', -8, 'insulted');
        } else {
            G.stones -= 40;
            shiftFactionRep('golden_phoenix', 10, 'bribed');
            shiftFactionRep('jade_lotus', -12, 'betrayed to Phoenix');
            addLog('🔥 Phoenix coin buys you breathing room — the Lotus marks your name.');
        }
    } else if (choiceId === 'pay_lotus') {
        if (G.stones < 40) {
            addLog('Lotus agents withdraw their protection.');
            shiftFactionRep('jade_lotus', -8, 'insulted');
        } else {
            G.stones -= 40;
            shiftFactionRep('jade_lotus', 10, 'bribed');
            shiftFactionRep('golden_phoenix', -12, 'betrayed to Lotus');
            addLog('🪷 Lotus silver hides you — the Phoenix adds you to their list.');
        }
    }
    finishExploitHuntAfterChoice(choiceId);
    fullRender();
}

function isFactionHuntCombat() {
    return !!G.factionHuntCombat;
}

function startExploitHuntCombat() {
    const template = ENEMIES.filter(e => (e.minRealm || 0) <= G.realmIdx).pop() || ENEMIES[0];
    let enemyHp = calcEnemyHp(template, { context: 'normal' });
    let enemyDmg = calcEnemyDamage(template, { context: 'normal' });
    enemyHp = Math.floor(enemyHp * 1.15);
    enemyDmg = Math.floor(enemyDmg * 1.1);

    G.factionHuntCombat = 'exploit';
    G.inCombat = true;
    G.defending = false;
    G.fortifyActive = false;
    G.combatLog = [];
    initCombatResource();
    updateShield();
    if (G.path === 'soul') G.shield = G.maxShield;

    G.enemy = {
        name: 'Heartlands Sect Enforcer',
        hp: enemyHp,
        maxHp: enemyHp,
        dmg: enemyDmg,
        originalDmg: enemyDmg,
        intimidateTurns: 0,
        skipTurns: 0,
        slowTurns: 0
    };
    G.enemyMaxHp = G.enemy.maxHp;
    G.combatPhase = 'player';
    clearCombatTurnTimer();
    setCombatInputEnabled(true);
    setupCombatActions();
    updateCombatUI();
    addCombatLog(`🎯 Heartlands Sect Enforcer ambushes you! (${enemyHp} HP)`);
    document.getElementById('combatOverlay').classList.add('active');
}

function exploitHuntCombatVictory() {
    G.factionHuntCombat = null;
    G.inCombat = false;
    G.enemy = null;
    document.getElementById('combatOverlay').classList.remove('active');
    G.fame += 8;
    G.stones += 25;
    shiftFactionRep('golden_phoenix', -6, 'killed enforcer');
    shiftFactionRep('jade_lotus', -6, 'killed enforcer');
    addLog('⚔️ You cut down the enforcer — both sects know your name now.');
    if (typeof finalizeCombatQiDrain === 'function') finalizeCombatQiDrain({ victory: true });
    finishExploitHuntAfterChoice('stand_fight');
    fullRender();
}

function exploitHuntCombatDefeat() {
    G.factionHuntCombat = null;
    G.inCombat = false;
    G.enemy = null;
    G.hp = Math.max(1, Math.floor(G.hp * 0.55));
    document.getElementById('combatOverlay').classList.remove('active');
    shiftFactionRep('golden_phoenix', -10, 'hunted down');
    shiftFactionRep('jade_lotus', -10, 'hunted down');
    addLog('🩸 You escape the enforcer barely alive — wounded and infamous.');
    if (typeof finalizeCombatQiDrain === 'function') finalizeCombatQiDrain({ victory: false });
    finishExploitHuntAfterChoice('stand_fight_fled');
    fullRender();
}

function openLotusWarPopup() {
    const popup = document.getElementById('factionPlotPopup');
    if (!popup) return;
    document.getElementById('factionPlotTitle').textContent = '🪷 The Lotus Stands';
    document.getElementById('factionPlotText').textContent =
        'Thanks to your warning, the Jade Lotus fortified their halls. Golden Phoenix forces gather — but the Lotus may yet endure.';
    document.getElementById('factionPlotChoices').innerHTML = `
        <button type="button" class="popup-item quest-choice" data-lotus-war-choice="shield_lotus">
            <div class="name">🪷 Shield the Lotus</div>
            <div class="desc">Lotus endures strong; +Alignment, +Lotus rep, Phoenix humiliated</div>
        </button>
        <button type="button" class="popup-item quest-choice" data-lotus-war-choice="broker_ceasefire">
            <div class="name">⚖️ Broker ceasefire</div>
            <div class="desc">Both sects stand down; you as mediator, +Fame</div>
        </button>
        <button type="button" class="popup-item quest-choice" data-lotus-war-choice="betray_lotus">
            <div class="name">💎 Betray after warning</div>
            <div class="desc">Sell Lotus secrets to Phoenix; stones, both despise you</div>
        </button>`;
    popup.querySelectorAll('[data-lotus-war-choice]').forEach(btn => {
        btn.onclick = () => {
            resolveLotusWar(btn.dataset.lotusWarChoice);
            popup.classList.remove('active');
            fullRender();
        };
    });
    popup.classList.add('active');
}

function resolveLotusWar(choiceId) {
    ensureFactionStateExtended();
    G.factions.phoenixWarStage = 4;
    G.factions.flags.phoenixWarEnded = choiceId;
    if (choiceId === 'shield_lotus') {
        shiftFactionRep('jade_lotus', 22, 'Lotus survival');
        shiftFactionRep('golden_phoenix', -20, 'failed siege');
        if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(12, 'defending the Lotus');
        addLog('🪷 The Jade Lotus endures — your warning saved them.');
    } else if (choiceId === 'broker_ceasefire') {
        shiftFactionRep('jade_lotus', 10, 'ceasefire');
        shiftFactionRep('golden_phoenix', 8, 'ceasefire');
        G.fame += 10;
        if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(8, 'brokering peace');
        addLog('⚖️ Both sects exhaust themselves at the negotiating table.');
    } else {
        G.stones += 70;
        shiftFactionRep('jade_lotus', -18, 'betrayal');
        shiftFactionRep('golden_phoenix', 10, 'sold secrets');
        if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(-15, 'betraying the Lotus');
        addLog('💎 You profit from both sects\' trust — and their hatred.');
    }
    appendFactionChronicleEntry({
        category: 'arc', emoji: '🪷',
        title: 'The Lotus Stand ended',
        text: choiceId.replace(/_/g, ' '),
        zoneId: 'heartlands', status: 'complete'
    });
}

function openExploitWarPopup() {
    const popup = document.getElementById('factionPlotPopup');
    if (!popup) return;
    document.getElementById('factionPlotTitle').textContent = '💎 Secrets for Sale';
    document.getElementById('factionPlotText').textContent =
        'Both sects know you profited from the Gambit. Envoys arrive with offers — and threats.';
    document.getElementById('factionPlotChoices').innerHTML = `
        <button type="button" class="popup-item quest-choice" data-exploit-choice="blackmail_both">
            <div class="name">💎 Blackmail both sides</div>
            <div class="desc">+Stones, −both rep, −Alignment</div>
        </button>
        <button type="button" class="popup-item quest-choice" data-exploit-choice="flee_heatlands">
            <div class="name">🚪 Vanish from the Heartlands</div>
            <div class="desc">+Fame as a ghost; sects stop hunting you</div>
        </button>
        <button type="button" class="popup-item quest-choice" data-exploit-choice="pick_phoenix">
            <div class="name">🔥 Final deal with Phoenix</div>
            <div class="desc">+Phoenix rep, −Lotus rep, moderate stones</div>
        </button>`;
    popup.querySelectorAll('[data-exploit-choice]').forEach(btn => {
        btn.onclick = () => {
            resolveExploitWar(btn.dataset.exploitChoice);
            popup.classList.remove('active');
            fullRender();
        };
    });
    popup.classList.add('active');
}

function resolveExploitWar(choiceId) {
    ensureFactionStateExtended();
    G.factions.phoenixWarStage = 4;
    G.factions.flags.phoenixWarEnded = choiceId;
    if (choiceId === 'blackmail_both') {
        G.stones += 90;
        shiftFactionRep('golden_phoenix', -10, 'blackmail');
        shiftFactionRep('jade_lotus', -10, 'blackmail');
        if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(-10, 'opportunism');
        addLog('💎 You squeeze both sects for every stone they will pay.');
    } else if (choiceId === 'flee_heatlands') {
        G.fame += 8;
        shiftFactionRep('golden_phoenix', -4, 'vanished');
        shiftFactionRep('jade_lotus', -4, 'vanished');
        addLog('🌫️ You slip away — a rumor in the jianghu, nothing more.');
    } else {
        G.stones += 40;
        shiftFactionRep('golden_phoenix', 12, 'final deal');
        shiftFactionRep('jade_lotus', -14, 'sold out');
        addLog('🔥 One last bargain with the Golden Phoenix.');
    }
    appendFactionChronicleEntry({
        category: 'crisis', emoji: '💎',
        title: 'Gambit fallout resolved',
        text: choiceId.replace(/_/g, ' '),
        zoneId: 'heartlands', status: 'complete'
    });
}

function openPhoenixWarPopup() {
    const popup = document.getElementById('factionPlotPopup');
    if (!popup) return;
    document.getElementById('factionPlotTitle').textContent = '🔥 The Lotus Falls?';
    document.getElementById('factionPlotText').textContent =
        'Golden Phoenix forces are poised to absorb the Jade Lotus. The Heartlands market trembles. This is the moment of decision.';
    document.getElementById('factionPlotChoices').innerHTML = `
        <button type="button" class="popup-item quest-choice" data-war-choice="phoenix_win">
            <div class="name">🔥 Crown the Phoenix</div>
            <div class="desc">Phoenix dominates; Lotus shattered; −Alignment, +Fame, market shifts</div>
        </button>
        <button type="button" class="popup-item quest-choice" data-war-choice="lotus_survive">
            <div class="name">🪷 Save the Lotus</div>
            <div class="desc">Lotus survives; +Alignment, +Lotus rep, Phoenix humiliated</div>
        </button>
        <button type="button" class="popup-item quest-choice" data-war-choice="both_weakened">
            <div class="name">⚖️ Exhaust both sides</div>
            <div class="desc">You profit while both sects bleed — stones and wariness</div>
        </button>`;
    popup.querySelectorAll('[data-war-choice]').forEach(btn => {
        btn.onclick = () => {
            resolvePhoenixWar(btn.dataset.warChoice);
            popup.classList.remove('active');
            fullRender();
        };
    });
    popup.classList.add('active');
}

function resolvePhoenixWar(choiceId) {
    ensureFactionStateExtended();
    G.factions.phoenixWarStage = 4;
    G.factions.flags.phoenixWarEnded = choiceId;
    if (choiceId === 'phoenix_win') {
        shiftFactionRep('golden_phoenix', 20, 'absorption victory');
        shiftFactionRep('jade_lotus', -25, 'sect broken');
        G.fame += 12;
        if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(-12, 'enabling conquest');
        addLog('🔥 The Golden Phoenix absorbs the Jade Lotus. The Heartlands will never be the same.');
    } else if (choiceId === 'lotus_survive') {
        shiftFactionRep('jade_lotus', 20, 'survival');
        shiftFactionRep('golden_phoenix', -18, 'failed absorption');
        if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(10, 'defending the Lotus');
        addLog('🪷 Against all odds, the Jade Lotus endures.');
    } else {
        G.stones += 80;
        shiftFactionRep('golden_phoenix', -8, 'stalemate');
        shiftFactionRep('jade_lotus', -8, 'stalemate');
        addLog('💎 Both sects exhaust themselves — you gather the pieces.');
    }
    const warTitles = {
        phoenix_win: 'Golden Phoenix crowns the Heartlands',
        lotus_survive: 'Jade Lotus endures',
        both_weakened: 'Both sects exhausted'
    };
    appendFactionChronicleEntry({
        category: 'arc',
        emoji: '🔥',
        title: warTitles[choiceId] || 'Phoenix War ended',
        text: choiceId.replace(/_/g, ' '),
        zoneId: 'heartlands',
        status: 'complete'
    });
}

function resolvePhoenixPlot(choiceId) {
    ensureFactionState();
    G.factions.flags.phoenixPlotResolved = true;
    G.factions.flags.phoenixPlotChoice = choiceId;
    if (choiceId === 'help_phoenix') {
        shiftFactionRep('golden_phoenix', 15, 'Phoenix Gambit');
        shiftFactionRep('jade_lotus', -12, 'betrayal');
        G.fame += 6;
        if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(-10, 'aiding expansionists');
        addLog('🔥 You stand with the Golden Phoenix. The Lotus will remember.');
        G.factions.phoenixWarStage = 1;
    } else if (choiceId === 'warn_lotus') {
        shiftFactionRep('jade_lotus', 15, 'warning');
        shiftFactionRep('golden_phoenix', -12, 'foiled plot');
        if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(8, 'protecting the Lotus');
        addLog('🪷 Jade Lotus elders owe you a debt of silence.');
        G.factions.phoenixWarStage = 1;
    } else {
        G.stones += 45;
        shiftFactionRep('golden_phoenix', -5, 'opportunism');
        shiftFactionRep('jade_lotus', -5, 'opportunism');
        addLog('💎 You profit while both sects question your motives.');
        G.factions.phoenixWarStage = 1;
    }
    const plotLabels = {
        help_phoenix: 'Stood with the Golden Phoenix — war looms',
        warn_lotus: 'Warned the Jade Lotus envoys',
        exploit: 'Profited while both sects grew wary'
    };
    appendFactionChronicleEntry({
        category: 'arc',
        emoji: '🔥',
        title: 'The Phoenix Gambit',
        text: plotLabels[choiceId] || choiceId.replace(/_/g, ' '),
        zoneId: 'heartlands',
        status: 'complete'
    });
    if (typeof appendQuestJournalEntry === 'function') {
        appendQuestJournalEntry({
            kind: 'faction', title: 'The Phoenix Gambit',
            objective: choiceId.replace(/_/g, ' '), status: 'complete', months: G.ageMonths
        });
    }
    schedulePhoenixWarChain();
}

function onEmberwildCombatVictory() {
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : G.currentZone;
    if (zoneId !== 'emberwild') return;
    ensureFactionStateExtended();
    const enemyName = (G.enemy?.name || '').toLowerCase();
    const isBeast = enemyName.includes('beast') || enemyName.includes('wolf') || enemyName.includes('serpent')
        || enemyName.includes('demon') || enemyName.includes('spirit');
    if (!isBeast) return;
    const penalty = FACTION_BALANCE.emberwildBeastKillPenalty || 8;
    const affinity = typeof getFactionBeastAffinityPct === 'function' ? getFactionBeastAffinityPct() : 0;
    const scaledPenalty = Math.max(1, Math.floor(penalty * (1 - affinity / 120)));
    const rep = getFactionRep('emberwild_collective');
    if (rep >= 30) {
        shiftFactionRep('emberwild_collective', -Math.floor(scaledPenalty / 2), 'slaying jungle beasts');
    } else {
        shiftFactionRep('emberwild_collective', -scaledPenalty, 'slaying jungle beasts');
    }
    G.factions.beastKillsInJungle += 1;
    if (G.factions.beastKillsInJungle >= 3 && !G.factions.flags.corruptionHuntOffered) {
        G.factions.flags.corruptionHuntOffered = true;
        addLog('🌿 The Collective warns: a demonic beast corrupts the deep jungle — hunt it or be hunted.');
        appendFactionChronicleEntry({
            category: 'crisis',
            emoji: '🌿',
            title: 'Jungle corruption stirs',
            text: `${G.factions.beastKillsInJungle} beast kills drew the Collective\'s wrath — a corruption hunt begins.`,
            zoneId: 'emberwild',
            status: 'active'
        });
        if (!G.factions.activeQuests.some(q => q.questId === 'emberwild_hunt_corruption')) {
            acceptFactionQuest('emberwild_hunt_corruption');
        }
    }
}

function onEmberwildRespectfulExplore() {
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : G.currentZone;
    if (zoneId !== 'emberwild') return;
    const affinity = typeof getFactionBeastAffinityPct === 'function' ? getFactionBeastAffinityPct() : 0;
    const chance = 0.25 + affinity / 200;
    if (Math.random() > chance) return;
    const bonus = (FACTION_BALANCE.emberwildRespectExploreBonus || 3) + Math.floor(affinity / 15);
    shiftFactionRep('emberwild_collective', bonus, 'respecting the jungle');
}

function onTribulationForFactions() {
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : G.currentZone;
    if (zoneId === 'frostbite') {
        shiftFactionRep('frostpeak_monastery', 12, 'tribulation witnessed');
        addLog('🏔️ Frostpeak monks witness your tribulation — the ice acknowledges you.');
    }
    tryCompleteFactionQuests('tribulation_pass', { zone: zoneId });
}

function getFactionExploreBonusMult(zoneId) {
    let bonus = getZoneFactionPerkSum(zoneId, 'exploreBonusPct');
    const pactFx = getActiveFactionSectPactEffects();
    bonus += pactFx.exploreBonusPct || 0;
    if (zoneId === 'jade' && G.factions?.seaBeastResolved) bonus += 5;
    return 1 + bonus / 100;
}

function getFactionNpcMenuActions(npcId) {
    const def = getFactionNpcDef(npcId);
    if (!def) return [];
    if (!isFactionNpcAccessible(npcId)) {
        return [{ action: 'leave', label: '🚪 Leave', desc: 'They will not speak with you yet.' }];
    }
    const actions = [
        { action: 'talk', label: '💬 Talk', desc: 'Speak with the faction representative' },
        { action: 'faction_panel', label: '⚖️ Factions', desc: 'Open faction standing & actions' }
    ];
    if (typeof isSectFounded === 'function' && isSectFounded()) {
        const pacts = Object.values(FACTION_SECT_PACTS).filter(p => p.factionId === def.factionId);
        pacts.forEach(p => {
            if (!G.factions?.sectPacts?.[def.factionId] && getFactionRep(def.factionId) >= (p.minRep || 0)) {
                actions.push({
                    action: 'sect_pact',
                    pactId: p.id,
                    label: `${p.emoji} ${p.label}`,
                    desc: p.desc
                });
            }
        });
    }
    if (typeof getElderFactionQuests === 'function') {
        getElderFactionQuests(def.factionId).forEach(q => {
            actions.push({
                action: 'faction_quest',
                questId: q.id,
                label: `${q.emoji || '📜'} ${q.title}`,
                desc: q.objective
            });
        });
    }
    actions.push({ action: 'leave', label: '🚪 Leave', desc: 'Continue your journey' });
    return actions;
}

function renderFactionNpcPopup(npcId) {
    const def = getFactionNpcDef(npcId);
    if (!def) return;
    const fdef = getFactionDef(def.factionId);
    const tier = getFactionTier(def.factionId);
    document.getElementById('npcTitle').textContent = `${def.emoji} ${def.name}`;
    document.getElementById('npcSubtitle').textContent = `${def.title} · ${fdef?.name || ''}`;
    const isolated = !isFactionNpcAccessible(npcId);
    document.getElementById('npcDialogue').textContent = isolated
        ? 'Cold silence — you have not earned their trust. (Raise faction reputation via the Factions panel.)'
        : def.greet;
    const alignEl = document.getElementById('npcAlignmentNote');
    if (alignEl) {
        alignEl.textContent = isolated ? '🔒 Isolated' : `${tier.emoji} ${tier.label} (${getFactionRep(def.factionId)} rep)`;
    }
    const actions = document.getElementById('npcActions');
    const tradeList = document.getElementById('npcTradeList');
    if (tradeList) { tradeList.innerHTML = ''; tradeList.style.display = 'none'; }
    if (actions) {
        actions.innerHTML = getFactionNpcMenuActions(npcId).map(opt =>
            `<button type="button" class="popup-item npc-action" data-npc-action="${opt.action}"${opt.pactId ? ` data-pact-id="${opt.pactId}"` : ''}${opt.questId ? ` data-quest-id="${opt.questId}"` : ''}>
                <div class="name">${opt.label}</div>
                <div class="desc">${opt.desc}</div>
            </button>`
        ).join('');
    }
}

function npcFactionTalk(npcId) {
    const def = getFactionNpcDef(npcId);
    if (!def || !isFactionNpcAccessible(npcId)) return;
    addLog(`${def.emoji} ${def.name}: "${def.greet}"`);
    tryGrantFactionNpcClue(npcId);
    if (typeof tryGrantAncientClueFromNpc === 'function') tryGrantAncientClueFromNpc(npcId);
}

function tryGrantFactionNpcClue(npcId) {
    const hook = FACTION_NPC_CLUE_HOOKS?.[npcId];
    if (!hook?.clueId) return false;
    const fdef = getFactionNpcDef(npcId);
    if (!fdef || getFactionRep(fdef.factionId) < (hook.minRep || 30)) return false;
    ensureFactionStateExtended();
    const flag = `npc_clue_${npcId}`;
    if (G.factions.flags[flag]) return false;
    if (Math.random() > (hook.talkChance || 0.3)) return false;
    if (typeof addAncientClue === 'function' && addAncientClue(hook.clueId)) {
        G.factions.flags[flag] = true;
        addLog(`${fdef.emoji} ${fdef.name} shares sealed-site knowledge.`);
        return true;
    }
    return false;
}

function renderFactionMechanicBanner(zoneId) {
    const mech = getZoneFactionMechanic(zoneId);
    if (!mech?.implemented) return '';
    let html = '';
    if (zoneId === 'frostbite' && isZoneFactionIsolated('frostbite')) {
        html += `<div class="factions-isolation-banner">🔒 Isolation active — earn ${mech.isolationThreshold}+ rep to speak with locals and faction NPCs.</div>`;
    }
    if (zoneId === 'dustbone') {
        if (G.factions?.dustboneGrandTreaty) html += `<div class="factions-treaty-banner">🕊️ Grand Sandveil Treaty active — all tribes may be allied.</div>`;
        else if (G.factions?.tribunalWar) html += `<div class="factions-war-banner">⚔️ Tribal war incited — favors shift quickly.</div>`;
    }
    if (zoneId === 'jade' && G.factions?.seaBeastCrisis && !G.factions?.seaBeastResolved) {
        html += `<div class="factions-crisis-banner">🌊 Sea beast crisis — unite or choose a sect.</div>`;
    }
    if (zoneId === 'heartlands' && G.factions?.phoenixWarStage > 0 && G.factions?.phoenixWarStage < 4) {
        const choice = G.factions.flags.phoenixPlotChoice;
        if (choice === 'help_phoenix') {
            const st = PHOENIX_WAR_STAGES[G.factions.phoenixWarStage];
            html += `<div class="factions-war-banner">🔥 ${st?.label}: ${st?.desc}</div>`;
        } else if (choice === 'warn_lotus') {
            const st = LOTUS_WAR_STAGES[G.factions.phoenixWarStage];
            html += `<div class="factions-war-banner">🪷 ${st?.label}: ${st?.desc}</div>`;
        } else if (choice === 'exploit') {
            const st = EXPLOIT_WAR_STAGES[G.factions.phoenixWarStage];
            html += `<div class="factions-war-banner">💎 ${st?.label}: ${st?.desc}</div>`;
        }
    }
    if (zoneId === 'emberwild') {
        const rep = getFactionRep('emberwild_collective');
        html += `<div class="factions-affinity-banner">🌿 Beast Affinity: ${rep} rep · ${G.factions?.beastKillsInJungle || 0} beast kills (harms standing)</div>`;
    }
    return html;
}

function renderFactionSectPactsHtml(zoneId) {
    if (typeof isSectFounded !== 'function' || !isSectFounded()) return '';
    const pacts = Object.values(FACTION_SECT_PACTS).filter(p => getFactionDef(p.factionId)?.zone === zoneId);
    if (!pacts.length) return '';
    let html = `<div class="faction-sect-pacts"><div class="faction-sect-pacts-title">🏯 Sect Pacts</div>`;
    pacts.forEach(p => {
        const active = G.factions?.sectPacts?.[p.factionId] === p.id;
        const repOk = getFactionRep(p.factionId) >= (p.minRep || 0);
        if (active) {
            html += `<div class="faction-pact-active">${p.emoji} ${p.label} — active</div>`;
        } else if (repOk) {
            html += `<button type="button" class="faction-action-btn" data-faction-pact="${p.id}">${p.emoji} Sign ${p.label} (${p.stones} Stones · ${p.months}mo)</button>`;
        }
    });
    html += `</div>`;
    return html;
}

function tickFactionSystems(monthsPassed) {
    ensureFactionStateExtended();
}

if (typeof registerWorldEventHandler === 'function') {
    registerWorldEventHandler('phoenix_war_advance', firePhoenixWarAdvance);
}
