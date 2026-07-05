// ============================================
// FACTIONS.JS — Zone power structures & reputation
// ============================================

function ensureFactionState() {
    if (!G.factions) {
        G.factions = {
            reputation: {},
            flags: {},
            activeQuests: [],
            completedQuests: []
        };
    }
    if (!G.factions.reputation) G.factions.reputation = {};
    if (!G.factions.flags) G.factions.flags = {};
    if (!G.factions.activeQuests) G.factions.activeQuests = [];
    if (!G.factions.completedQuests) G.factions.completedQuests = [];
    if (!G.factions.chronicle) G.factions.chronicle = [];
    Object.keys(FACTION_DEFINITIONS).forEach(id => {
        if (G.factions.reputation[id] == null) G.factions.reputation[id] = 0;
    });
}

function clampFactionRep(val) {
    return Math.max(FACTION_BALANCE.repMin, Math.min(FACTION_BALANCE.repMax, val));
}

function getFactionRep(factionId) {
    ensureFactionState();
    return G.factions.reputation[factionId] || 0;
}

function getFactionTierForRep(rep) {
    return FACTION_TIERS.find(t => rep >= t.min && rep <= t.max) || FACTION_TIERS[1];
}

function getFactionDef(factionId) {
    return FACTION_DEFINITIONS[factionId] || null;
}

function getFactionTier(factionId) {
    return getFactionTierForRep(getFactionRep(factionId));
}

function appendFactionChronicleEntry(entry) {
    ensureFactionState();
    G.factions.chronicle.unshift({
        months: G.ageMonths,
        ageLabel: typeof formatYears === 'function' ? formatYears(G.ageMonths) : '',
        ...entry
    });
    if (G.factions.chronicle.length > 48) G.factions.chronicle.length = 48;
}

function getFactionChronicleSummary() {
    ensureFactionState();
    const allied = Object.keys(FACTION_DEFINITIONS).filter(id => getFactionTier(id).id === 'allied').length;
    const pacts = Object.keys(G.factions.sectPacts || {}).length;
    const flags = G.factions.flags || {};
    const highlights = [];
    if (G.factions.dustboneGrandTreaty) highlights.push({ emoji: '🕊️', label: 'Grand Sandveil Treaty' });
    if (G.factions.tribunalWar) highlights.push({ emoji: '⚔️', label: 'Tribal war incited' });
    if (G.factions.seaBeastResolved) highlights.push({ emoji: '🌊', label: 'Leviathan crisis resolved' });
    if (flags.phoenixPlotResolved) highlights.push({ emoji: '🔥', label: 'Phoenix Gambit decided' });
    if (flags.phoenixPlotChoice === 'exploit' && flags.exploitHuntResolved) {
        highlights.push({ emoji: '🎯', label: 'Survived the sect hunt' });
    }
    if (flags.phoenixWarEnded) {
        const warLabels = {
            phoenix_win: 'Phoenix crowned', lotus_survive: 'Lotus endures', both_weakened: 'Sects exhausted',
            shield_lotus: 'Lotus shielded', broker_ceasefire: 'Ceasefire brokered', betray_lotus: 'Lotus betrayed',
            blackmail_both: 'Both sects blackmailed', flee_heatlands: 'Vanished from Heartlands', pick_phoenix: 'Phoenix deal sealed'
        };
        highlights.push({ emoji: '🏯', label: warLabels[flags.phoenixWarEnded] || 'Phoenix War ended' });
    }
    const zoneStandings = Object.values(ZONE_FACTION_MECHANICS)
        .filter(m => m.implemented)
        .map(mech => {
            const top = mech.factionIds
                .map(id => ({ id, rep: getFactionRep(id), def: getFactionDef(id) }))
                .sort((a, b) => b.rep - a.rep)[0];
            return {
                zoneId: mech.zoneId,
                emoji: mech.emoji,
                label: mech.label,
                powerName: mech.powerName,
                topFaction: top?.def?.name || '—',
                topRep: top?.rep || 0,
                topTier: top ? getFactionTier(top.id).label : 'Unknown'
            };
        });
    return {
        allied,
        pacts,
        highlights,
        zoneStandings,
        eventCount: (G.factions.chronicle || []).length
    };
}

function getZoneFactionMechanic(zoneId) {
    return ZONE_FACTION_MECHANICS[zoneId] || null;
}

function getFactionsForZone(zoneId) {
    const mech = getZoneFactionMechanic(zoneId);
    if (!mech) return [];
    return (mech.factionIds || []).map(id => FACTION_DEFINITIONS[id]).filter(Boolean);
}

function getActiveZoneFactionMechanic() {
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    return getZoneFactionMechanic(zoneId);
}

function shiftFactionRep(factionId, delta, reason) {
    if (!factionId || !delta) return 0;
    ensureFactionState();
    const before = getFactionRep(factionId);
    const after = clampFactionRep(before + delta);
    G.factions.reputation[factionId] = after;
    const actual = after - before;
    if (actual && reason) {
        const def = getFactionDef(factionId);
        const tier = getFactionTier(factionId);
        addLog(`${def?.emoji || '🏯'} ${def?.name || factionId}: ${actual > 0 ? '+' : ''}${actual} reputation (${tier.label}) — ${reason}`);
    }
    const tierBefore = getFactionTierForRep(before);
    const tierAfter = getFactionTierForRep(after);
    if (tierBefore.id !== tierAfter.id) {
        const def = getFactionDef(factionId);
        appendFactionChronicleEntry({
            category: 'standing',
            emoji: tierAfter.emoji,
            title: `${def?.name || factionId}: ${tierAfter.label}`,
            text: reason || `Reputation ${after >= 0 ? '+' : ''}${after}`,
            zoneId: def?.zone
        });
        if (factionId === 'frostpeak_monastery' && before < 15 && after >= 15) {
            appendFactionChronicleEntry({
                category: 'crisis',
                emoji: '❄️',
                title: 'Frostbite isolation lifted',
                text: 'The Monastery acknowledges you — locals and elders will speak again.',
                zoneId: 'frostbite'
            });
        }
    }
    if (actual > 0) {
        const def = getFactionDef(factionId);
        (def?.rivals || []).forEach(rivalId => {
            const drain = Math.max(1, Math.floor(actual * (FACTION_BALANCE.rivalDrainPct || 0.35)));
            const rBefore = getFactionRep(rivalId);
            G.factions.reputation[rivalId] = clampFactionRep(rBefore - drain);
        });
        if (def?.alignmentCost) {
            const tier = getFactionTier(factionId);
            const cost = def.alignmentCost[tier.id];
            if (cost && typeof shiftDaoAlignment === 'function') {
                shiftDaoAlignment(cost, `${def.name} influence`);
            }
        }
    }
    if (typeof tryTriggerPhoenixPlot === 'function') tryTriggerPhoenixPlot();
    if (typeof onFactionRepChanged === 'function') onFactionRepChanged(factionId, actual);
    return actual;
}

function getFactionPerkValue(factionId, perkKey) {
    const def = getFactionDef(factionId);
    if (!def?.perks) return 0;
    const rep = getFactionRep(factionId);
    const tier = getFactionTier(factionId);
    if (tier.id === 'allied' && def.perks.allied?.[perkKey] != null) return def.perks.allied[perkKey];
    if (rep >= 30 && def.perks.friendly?.[perkKey] != null) return def.perks.friendly[perkKey];
    return 0;
}

function getHeartlandsFactionPerkSum(perkKey) {
    const mech = ZONE_FACTION_MECHANICS.heartlands;
    if (!mech?.implemented) return 0;
    let total = 0;
    mech.factionIds.forEach(id => { total += getFactionPerkValue(id, perkKey) || 0; });
    return total;
}

function getFactionMarketPriceMult(zoneId) {
    let discount = 0;
    if (zoneId === 'heartlands') discount = getZoneFactionPerkSum('heartlands', 'marketDiscountPct');
    if (zoneId === 'dustbone') discount = getFactionPerkValue('dune_riders', 'marketDiscountPct');
    if (zoneId === 'jade') discount = getFactionPerkValue('tidal_lotus', 'marketDiscountPct');
    const pactFx = typeof getActiveFactionSectPactEffects === 'function' ? getActiveFactionSectPactEffects() : {};
    discount += pactFx.marketDiscountPct || 0;
    if (zoneId === 'heartlands' && G.factions?.flags?.phoenixWarEnded === 'phoenix_win') discount -= 5;
    return Math.max(0.65, 1 - discount / 100);
}

function getFactionCombatDmgMult() {
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    let bonus = getZoneFactionPerkSum(zoneId, 'combatDmgPct');
    const pactFx = typeof getActiveFactionSectPactEffects === 'function' ? getActiveFactionSectPactEffects() : {};
    bonus += pactFx.combatDmgPct || 0;
    return 1 + bonus / 100;
}

function getFactionCultivateMult() {
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    let bonus = getZoneFactionPerkSum(zoneId, 'daoSpeedPct');
    const pactFx = typeof getActiveFactionSectPactEffects === 'function' ? getActiveFactionSectPactEffects() : {};
    bonus += pactFx.daoSpeedPct || 0;
    return 1 + bonus / 100;
}

function getFactionColdResistPct(zoneId) {
    zoneId = zoneId || (typeof getLootZoneId === 'function' ? getLootZoneId() : G.currentZone);
    let pct = 0;
    if (zoneId === 'frostbite') pct += getZoneFactionPerkSum(zoneId, 'coldResistPct');
    const pactFx = typeof getActiveFactionSectPactEffects === 'function' ? getActiveFactionSectPactEffects() : {};
    pct += pactFx.coldResistPct || 0;
    pct += (G.coldResistBonus || 0) * 3;
    return pct;
}

function getFactionBeastAffinityPct() {
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    let pct = getZoneFactionPerkSum(zoneId, 'beastAffinityPct');
    const pactFx = typeof getActiveFactionSectPactEffects === 'function' ? getActiveFactionSectPactEffects() : {};
    pct += pactFx.beastAffinityPct || 0;
    return pct;
}

function getFactionTradeIncomeBonus() {
    let bonus = 0;
    Object.keys(FACTION_DEFINITIONS).forEach(id => {
        if (getFactionRep(id) >= 30) bonus += getFactionPerkValue(id, 'tradeIncomePct') || 0;
    });
    const pactFx = typeof getActiveFactionSectPactEffects === 'function' ? getActiveFactionSectPactEffects() : {};
    bonus += pactFx.tradeIncomePct || 0;
    return Math.floor(bonus / 5);
}

function getFactionPassiveCultivateBonus() {
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    let foundation = 0;
    let spirit = 0;
    Object.values(FACTION_DEFINITIONS).forEach(def => {
        if (def.zone !== zoneId) return;
        if (getFactionRep(def.id) < 30) return;
        foundation += getFactionPerkValue(def.id, 'foundationBonus') || 0;
        spirit += getFactionPerkValue(def.id, 'spiritBonus') || 0;
    });
    const pactFx = typeof getActiveFactionSectPactEffects === 'function' ? getActiveFactionSectPactEffects() : {};
    spirit += pactFx.spiritBonus || 0;
    return {
        foundation: foundation > 0 ? Math.max(1, Math.floor(foundation / 4)) : 0,
        spirit: spirit > 0 ? Math.max(1, Math.floor(spirit / 2)) : 0
    };
}

function getFactionSubZoneSearchBonus(zoneId) {
    const sub = typeof getSubZoneForParent === 'function' ? getSubZoneForParent(zoneId) : null;
    if (!sub) return 0;
    let bonus = 0;
    Object.values(FACTION_DEFINITIONS).forEach(def => {
        if (!def.subZoneGate || def.subZoneGate.subZoneId !== sub.id) return;
        if (getFactionRep(def.id) >= (def.subZoneGate.minRep || 25)) {
            bonus += def.subZoneGate.searchBonus || 12;
        }
    });
    return bonus;
}

function isMarketTechniqueUnlocked(techName, zoneId) {
    zoneId = zoneId || (typeof getActiveZoneId === 'function' ? getActiveZoneId() : G.currentZone);
    let gated = false;
    let unlocked = true;
    Object.values(FACTION_DEFINITIONS).forEach(def => {
        const mu = def.marketUnlock;
        if (!mu || def.zone !== zoneId || !mu.techniques?.includes(techName)) return;
        gated = true;
        const need = mu.minTier || 'friendly';
        const order = { hostile: 0, unknown: 1, known: 2, friendly: 3, allied: 4 };
        const tier = getFactionTier(def.id);
        if ((order[tier.id] || 0) < (order[need] || 3)) unlocked = false;
    });
    if (!gated) return true;
    return unlocked;
}

function getMarketTechniqueLockReason(techName, zoneId) {
    if (isMarketTechniqueUnlocked(techName, zoneId)) return null;
    zoneId = zoneId || (typeof getActiveZoneId === 'function' ? getActiveZoneId() : G.currentZone);
    for (const def of Object.values(FACTION_DEFINITIONS)) {
        const mu = def.marketUnlock;
        if (!mu || def.zone !== zoneId || !mu.techniques?.includes(techName)) continue;
        return `Requires ${mu.minTier || 'friendly'} standing with ${def.name}`;
    }
    return 'Faction standing required.';
}

function getElderFactionQuests(factionId) {
    return getAvailableFactionQuests(factionId).filter(q => q.elderOnly);
}

function getMergedDaoEffects() {
    const fx = { combatDmgPct: 0, exploreBonusPct: 0, evasionPct: 0, hpRegenPct: 0, qiPct: 0, spiritPct: 0, alignmentDampenPct: 0, foundationPerCultivate: 0, decayResistPct: 0 };
    (G.mergedDaos || []).forEach(name => {
        const def = MERGED_DAOS[name];
        if (!def) return;
        Object.entries(def).forEach(([k, v]) => {
            if (typeof v === 'number' && fx[k] != null) fx[k] += v;
        });
    });
    return fx;
}

function canPerformFactionAction(actionId, factionId) {
    const action = FACTION_ACTIONS[actionId];
    const def = getFactionDef(factionId);
    if (!action || !def) return 'Unknown action.';
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    if (def.zone !== zoneId) return `You must be in ${ZONES[def.zone]?.name || def.zone}.`;
    if ((G.stones || 0) < (action.stones || 0)) return `Need ${action.stones} Spirit Stones.`;
    if (getFactionRep(factionId) <= -50 && actionId !== 'spread_rumors') return 'They will not receive you.';
    return null;
}

function performFactionAction(actionId, factionId) {
    if (typeof performExtendedFactionAction === 'function') {
        const ext = performExtendedFactionAction(actionId, factionId);
        if (ext) return ext;
    }
    const block = canPerformFactionAction(actionId, factionId)
        || (typeof canPerformExtendedFactionAction === 'function' ? canPerformExtendedFactionAction(actionId, factionId) : null);
    if (block) return { success: false, message: block };
    const action = FACTION_ACTIONS[actionId];
    const def = getFactionDef(factionId);

    if (!advanceTime(action.months, `${action.label} with ${def.name}`)) {
        return { success: false, message: 'Your lifespan ends during the audience.' };
    }
    G.stones -= action.stones || 0;
    shiftFactionRep(factionId, action.rep || 0, action.label);
    if (action.alignment && typeof shiftDaoAlignment === 'function') {
        shiftDaoAlignment(action.alignment, 'faction politics');
    }
    if (actionId === 'spread_rumors' && def.rivals?.length) {
        const rival = def.rivals[Math.floor(Math.random() * def.rivals.length)];
        shiftFactionRep(rival, action.rivalRep || -8, 'rumors');
    }
    if (typeof appendQuestJournalEntry === 'function') {
        appendQuestJournalEntry({
            kind: 'faction',
            title: `${def.emoji} ${def.name}`,
            objective: action.label,
            status: 'logged',
            months: G.ageMonths
        });
    }
    return { success: true, message: `${action.label} complete.` };
}

function getAvailableFactionQuests(factionId) {
    ensureFactionState();
    return Object.values(FACTION_QUESTS).filter(q => {
        if (q.factionId !== factionId) return false;
        if (G.factions.completedQuests.includes(q.id)) return false;
        if (G.factions.activeQuests.some(a => a.questId === q.id)) return false;
        if (getFactionRep(factionId) < (q.minRep || 0)) return false;
        return true;
    });
}

function acceptFactionQuest(questId) {
    const def = FACTION_QUESTS[questId];
    if (!def) return { success: false, message: 'Unknown quest.' };
    ensureFactionState();
    if (G.factions.activeQuests.some(q => q.questId === questId)) {
        return { success: false, message: 'Already active.' };
    }
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    if (def.zone !== zoneId) {
        return { success: false, message: `Accept this in ${ZONES[def.zone]?.name || def.zone}.` };
    }
    G.factions.activeQuests.push({
        questId,
        factionId: def.factionId,
        startedMonths: G.ageMonths,
        deadlineMonths: G.ageMonths + (def.months || 12)
    });
    const fdef = getFactionDef(def.factionId);
    addLog(`📜 Faction quest: ${def.title} — ${def.objective}`);
    syncFactionQuestLog();
    return { success: true, message: `Accepted: ${def.title}` };
}

function completeFactionQuest(questId) {
    const def = FACTION_QUESTS[questId];
    if (!def) return false;
    ensureFactionState();
    const idx = G.factions.activeQuests.findIndex(q => q.questId === questId);
    if (idx < 0) return false;
    G.factions.activeQuests.splice(idx, 1);
    if (!G.factions.completedQuests.includes(questId)) G.factions.completedQuests.push(questId);

    const r = def.rewards || {};
    if (r.rep) shiftFactionRep(def.factionId, r.rep, def.title);
    if (r.fame) {
        if (typeof addFame === 'function') addFame(r.fame);
        else G.fame += r.fame;
    }
    if (r.foundation) grantFoundation(r.foundation);
    if (r.stones) G.stones += r.stones;
    if (r.spirit) G.spirit += r.spirit;
    if (r.alignment && typeof shiftDaoAlignment === 'function') shiftDaoAlignment(r.alignment, def.title);

    const fdef = getFactionDef(def.factionId);
    addLog(`✓ Faction quest complete: ${def.emoji || ''} ${def.title}`);
    appendFactionChronicleEntry({
        category: 'quest',
        emoji: def.emoji || fdef?.emoji || '📜',
        title: def.title,
        text: def.objective || fdef?.name || '',
        zoneId: def.zone || fdef?.zone,
        status: 'complete'
    });
    if (typeof appendQuestJournalEntry === 'function') {
        appendQuestJournalEntry({ kind: 'faction', title: def.title, status: 'complete', months: G.ageMonths });
    }
    syncFactionQuestLog();
    return true;
}

function tryCompleteFactionQuests(trigger, context) {
    ensureFactionState();
    let completed = false;
    [...G.factions.activeQuests].forEach(aq => {
        const def = FACTION_QUESTS[aq.questId];
        if (!def || def.completeOn !== trigger) return;
        if (def.zone && context?.zone && def.zone !== context.zone && getLootZoneId() !== def.zone) return;
        if (trigger === 'emberwild_respect') {
            aq.respectWalks = (aq.respectWalks || 0) + 1;
            if (aq.respectWalks < 3) return;
        }
        completeFactionQuest(aq.questId);
        completed = true;
    });
    return completed;
}

function syncFactionQuestLog() {
    if (typeof ensureNpcQuestState !== 'function') return;
    ensureNpcQuestState();
    ensureFactionState();
    G.factions.activeQuests.forEach(aq => {
        const def = FACTION_QUESTS[aq.questId];
        if (!def) return;
        const id = `faction_${aq.questId}`;
        const existing = typeof findNpcQuest === 'function' ? findNpcQuest(q => q.id === id) : null;
        const remaining = Math.max(0, (aq.deadlineMonths || 0) - G.ageMonths);
        const fdef = getFactionDef(def.factionId);
        const payload = {
            id,
            factionQuest: true,
            type: 'investigation',
            typeLabel: 'Faction',
            typeEmoji: def.emoji || '🏯',
            title: def.title,
            objective: `${def.objective} (${remaining}mo)`,
            status: 'active',
            giverName: fdef?.name || 'Faction',
            zoneHint: def.zone,
            startedMonths: aq.startedMonths
        };
        if (existing) Object.assign(existing, payload);
        else G.npcQuests.push(payload);
    });
}

function rollFactionExploreEvent(zoneId) {
    const mech = getZoneFactionMechanic(zoneId);
    if (!mech?.implemented) return null;
    const events = FACTION_EXPLORE_EVENTS[zoneId];
    if (!events?.length) return null;
    if (Math.random() > (FACTION_BALANCE.exploreEventChance || FACTION_BALANCE.heartlandsExploreEventChance || 0.2)) return null;
    const evt = events[Math.floor(Math.random() * events.length)];
    if (evt.rep) shiftFactionRep(evt.factionId, evt.rep, 'exploration');
    if (evt.rivalId && evt.rivalRep) shiftFactionRep(evt.rivalId, evt.rivalRep, 'political incident');
    if (evt.alignment && typeof shiftDaoAlignment === 'function') {
        shiftDaoAlignment(evt.alignment, 'Heartlands politics');
    }
    addLog(`🏯 ${evt.text}`);
    return evt;
}

function tryGrantVoidTempleAncientClue() {
    return typeof tryGrantFactionAncientClue === 'function' ? tryGrantFactionAncientClue('void_temple') : false;
}

function tryTriggerPhoenixPlot() {
    ensureFactionState();
    if (G.factions.flags.phoenixPlotResolved) return;
    if (getFactionRep('golden_phoenix') < (FACTION_BALANCE.phoenixPlotMinRep || 22)) return;
    if (getFactionRep('jade_lotus') < (FACTION_BALANCE.phoenixPlotJadeMin || 10)) return;
    if (G.factions.flags.phoenixPlotOffered) return;
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    if (zoneId !== 'heartlands') return;
    G.factions.flags.phoenixPlotOffered = true;
    addLog('🔥 Golden Phoenix envoys approach — the Jade Lotus absorption plot is in motion.');
    appendFactionChronicleEntry({
        category: 'arc',
        emoji: '🔥',
        title: 'The Phoenix Gambit begins',
        text: 'Golden Phoenix envoys offer a place in their scheme to absorb the Jade Lotus.',
        zoneId: 'heartlands',
        status: 'active'
    });
    setTimeout(() => openPhoenixPlotPopup(), 500);
}

function openPhoenixPlotPopup() {
    const popup = document.getElementById('factionPlotPopup');
    if (!popup) return;
    document.getElementById('factionPlotTitle').textContent = '🔥 The Phoenix Gambit';
    document.getElementById('factionPlotText').textContent =
        'Golden Phoenix elders offer you a place in their scheme to absorb the Jade Lotus Sect. Lotus envoys beg for warning. The Heartlands hold their breath.';
    document.getElementById('factionPlotChoices').innerHTML = `
        <button type="button" class="popup-item quest-choice" data-phoenix-choice="help_phoenix">
            <div class="name">🔥 Aid the Golden Phoenix</div>
            <div class="desc">+Phoenix rep, −Lotus rep, −Alignment, +Fame</div>
        </button>
        <button type="button" class="popup-item quest-choice" data-phoenix-choice="warn_lotus">
            <div class="name">🪷 Warn the Jade Lotus</div>
            <div class="desc">+Lotus rep, −Phoenix rep, +Alignment</div>
        </button>
        <button type="button" class="popup-item quest-choice" data-phoenix-choice="exploit">
            <div class="name">💎 Exploit the chaos</div>
            <div class="desc">+Stones, both sects grow wary of you</div>
        </button>`;
    popup.querySelectorAll('[data-phoenix-choice]').forEach(btn => {
        btn.onclick = () => {
            resolvePhoenixPlot(btn.dataset.phoenixChoice);
            popup.classList.remove('active');
            fullRender();
        };
    });
    popup.classList.add('active');
}

function renderFactionRepBar(factionId) {
    const rep = getFactionRep(factionId);
    const tier = getFactionTier(factionId);
    const pct = Math.round(((rep + 100) / 200) * 100);
    return `<div class="faction-rep-bar-wrap">
        <div class="faction-rep-bar"><div class="faction-rep-fill" style="width:${pct}%"></div></div>
        <span class="faction-rep-tier">${tier.emoji} ${tier.label} (${rep})</span>
    </div>`;
}

function renderFactionCardHtml(factionId) {
    const def = getFactionDef(factionId);
    if (!def) return '';
    const tier = getFactionTier(factionId);
    const quests = getAvailableFactionQuests(factionId);
    const active = G.factions.activeQuests.find(q => q.factionId === factionId);
    let perks = [];
    const p = def.perks?.allied || def.perks?.friendly;
    if (p) {
        if (p.combatDmgPct) perks.push(`+${p.combatDmgPct}% combat`);
        if (p.marketDiscountPct) perks.push(`−${p.marketDiscountPct}% market`);
        if (p.daoSpeedPct) perks.push(`+${p.daoSpeedPct}% Dao speed`);
        if (p.tradeIncomePct) perks.push(`+${p.tradeIncomePct}% trade`);
        if (p.coldResistPct) perks.push(`+${p.coldResistPct}% cold resist`);
        if (p.beastAffinityPct) perks.push(`+${p.beastAffinityPct}% beast affinity`);
    }

    let html = `<div class="faction-card tier-${tier.id}">
        <div class="faction-card-head">${def.emoji} <strong>${def.name}</strong></div>
        <div class="faction-card-type">${def.type} · ${def.desc}</div>
        ${renderFactionRepBar(factionId)}
        ${perks.length ? `<div class="faction-perks">Perks at alliance: ${perks.join(' · ')}</div>` : ''}`;

    if (active) {
        const qdef = FACTION_QUESTS[active.questId];
        html += `<div class="faction-quest-active">📜 Active: ${qdef?.title || active.questId}</div>`;
    } else if (quests.length) {
        html += `<button type="button" class="faction-action-btn" data-faction-quest="${quests[0].id}">📜 Accept: ${quests[0].title}</button>`;
    }

    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    if (def.zone === zoneId && tier.id !== 'hostile') {
        html += `<div class="faction-actions-row">`;
        Object.values(FACTION_ACTIONS).forEach(act => {
            if (act.factions && !act.factions.includes(factionId)) return;
            if (act.zones && !act.zones.includes(zoneId)) return;
            if (act.id === 'spread_rumors' && !def.rivals?.length) return;
            if (act.id === 'broker_peace' && zoneId !== 'dustbone') return;
            if (act.id === 'incite_rivalry' && zoneId !== 'dustbone') return;
            if (act.id === 'offer_tribute' && factionId !== 'frostpeak_monastery') return;
            if (act.id === 'offer_herbs' && factionId !== 'emberwild_collective') return;
            if (act.id === 'petition_sea_route' && factionId !== 'storm_dragon') return;
            html += `<button type="button" class="faction-action-btn small" data-faction-action="${act.id}" data-faction-id="${factionId}">${act.emoji} ${act.label}</button>`;
        });
        html += `</div>`;
    } else if (def.zone !== zoneId) {
        html += `<div class="faction-zone-hint">Travel to ${ZONES[def.zone]?.name || def.zone} to interact.</div>`;
    }

    html += `</div>`;
    return html;
}

function renderFactionsPopup() {
    const container = document.getElementById('factionsInfo');
    if (!container) return;
    ensureFactionState();

    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    const mech = getZoneFactionMechanic(zoneId);
    const zoneName = ZONES[zoneId]?.emoji + ' ' + (ZONES[zoneId]?.name || zoneId);

    let html = `<div class="factions-zone-banner">
        <div class="factions-zone-title">${zoneName}</div>`;

    if (mech) {
        html += `<div class="factions-mechanic"><strong>${mech.emoji} ${mech.label}</strong> — ${mech.desc}</div>
        <div class="factions-why">Why unconquered: ${mech.whyNotConquered}</div>`;
        if (mech.implemented) {
            html += `<div class="factions-implemented">Power: ${mech.powerName}</div>`;
            if (typeof renderFactionMechanicBanner === 'function') html += renderFactionMechanicBanner(zoneId);
            mech.factionIds.forEach(fid => { html += renderFactionCardHtml(fid); });
            if (typeof renderFactionSectPactsHtml === 'function') html += renderFactionSectPactsHtml(zoneId);
        } else {
            html += `<div class="factions-coming">🔒 ${mech.powerName} — coming in a future update. Explore and quest here to prepare.</div>`;
            mech.factionIds.forEach(fid => {
                const def = getFactionDef(fid);
                if (def) html += `<div class="faction-card stub">${def.emoji} ${def.name} <span class="factions-stub-tag">Preview</span></div>`;
            });
        }
    } else {
        html += `<div class="factions-coming">No major faction structure mapped for this region yet.</div>`;
    }

    html += `</div><div class="factions-all-zones"><div class="factions-all-title">Azure Sky Continent</div>`;
    Object.values(ZONE_FACTION_MECHANICS).forEach(zm => {
        const here = zm.zoneId === zoneId ? ' · here' : '';
        html += `<div class="factions-zone-row">${zm.emoji} <strong>${ZONES[zm.zoneId]?.name || zm.zoneId}</strong> — ${zm.powerName} (${zm.label})${here}</div>`;
    });
    html += `</div>`;

    container.innerHTML = html;
    bindFactionsPopupEvents(container);
}

function bindFactionsPopupEvents(container) {
    container.querySelectorAll('[data-faction-action]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = performFactionAction(this.dataset.factionAction, this.dataset.factionId);
            if (result.message) addLog(result.success ? `🏯 ${result.message}` : `🏯 ${result.message}`);
            renderFactionsPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-faction-quest]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = acceptFactionQuest(this.dataset.factionQuest);
            if (result.message) addLog(result.success ? `📜 ${result.message}` : `📜 ${result.message}`);
            renderFactionsPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-faction-pact]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = typeof performFactionSectPact === 'function'
                ? performFactionSectPact(this.dataset.factionPact)
                : { success: false, message: 'Unavailable.' };
            if (result.message) addLog(result.success ? `🏯 ${result.message}` : `🏯 ${result.message}`);
            renderFactionsPopup();
            fullRender();
        });
    });
}

function actionFactions() {
    if (G.gameOver || G.inCombat) return;
    renderFactionsPopup();
    document.getElementById('factionsPopup')?.classList.add('active');
}

function onExploreForFactions(zoneId) {
    rollFactionExploreEvent(zoneId);
    tryGrantVoidTempleAncientClue();
    if (typeof tryGrantFactionAncientClue === 'function') {
        getFactionsForZone(zoneId).forEach(f => tryGrantFactionAncientClue(f.id));
    }
    if (typeof onEmberwildRespectfulExplore === 'function') onEmberwildRespectfulExplore();
    if (typeof tryCompleteFactionQuests === 'function') tryCompleteFactionQuests('emberwild_respect', { zone: zoneId });
    tryCompleteFactionQuests('explore', { zone: zoneId });
}

function onCombatForFactions() {
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    if (typeof onEmberwildCombatVictory === 'function') onEmberwildCombatVictory();
    tryCompleteFactionQuests('combat', { zone: zoneId });
}

function tickFactionQuestDeadlines() {
    ensureFactionState();
    G.factions.activeQuests = G.factions.activeQuests.filter(aq => {
        if (!aq.deadlineMonths || G.ageMonths < aq.deadlineMonths) return true;
        addLog(`⏳ Faction quest expired: ${FACTION_QUESTS[aq.questId]?.title || aq.questId}`);
        const q = typeof findNpcQuest === 'function' ? findNpcQuest(x => x.id === `faction_${aq.questId}`) : null;
        if (q) q.status = 'failed';
        return false;
    });
}

function getFactionStatusLine() {
    const mech = getActiveZoneFactionMechanic();
    if (!mech?.implemented) return '';
    const top = mech.factionIds
        .map(id => ({ id, rep: getFactionRep(id), def: getFactionDef(id) }))
        .sort((a, b) => b.rep - a.rep)[0];
    if (!top?.def) return '';
    const tier = getFactionTier(top.id);
    let line = `${top.def.emoji} ${tier.label} with ${top.def.name}`;
    if (mech.zoneId === 'frostbite' && typeof isZoneFactionIsolated === 'function' && isZoneFactionIsolated('frostbite')) line += ' · 🔒 isolated';
    if (mech.zoneId === 'dustbone' && G.factions?.dustboneGrandTreaty) line += ' · 🕊️ treaty';
    if (mech.zoneId === 'jade' && G.factions?.seaBeastCrisis) line += ' · 🌊 crisis';
    return line;
}

// Fallback if factions-expand.js not loaded
if (typeof getZoneFactionPerkSum !== 'function') {
    function getZoneFactionPerkSum(zoneId, perkKey) {
        const mech = getZoneFactionMechanic(zoneId);
        if (!mech?.implemented) return 0;
        let total = 0;
        (mech.factionIds || []).forEach(id => { total += getFactionPerkValue(id, perkKey) || 0; });
        return total;
    }
}
