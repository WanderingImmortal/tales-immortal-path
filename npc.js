// ============================================
// NPC.JS — NPC presence, memory, dialogue, trade
// ============================================

function createDefaultNpcRecord(npcId) {
    const base = {
        met: false,
        firstMetMonths: null,
        lastSeenMonths: null,
        lastSeenZone: null,
        talkCount: 0,
        tradeCount: 0,
        rumorsHeard: [],
        purchases: [],
        testsPassed: [],
        familiarity: 0
    };
    if (npcId === 'wei_collector') {
        return {
            ...base,
            wanderZone: pickWeiWanderZone(),
            wanderDueMonths: (G.ageMonths || 0) + pickWeiWanderInterval(),
            wanderLog: []
        };
    }
    if (npcId === 'elder_hua') {
        return { ...base, lastTestMonths: null };
    }
    if (npcId === 'wei_ling') {
        return { ...base, questAccepted: false };
    }
    return base;
}

function ensureNpcState() {
    if (!G.npcState) G.npcState = {};
    if (!G.npcState.purchased) G.npcState.purchased = [];
    Object.keys(NPCS).forEach(id => {
        if (!G.npcState[id]) G.npcState[id] = createDefaultNpcRecord(id);
        migrateNpcRecord(id);
    });
}

function migrateNpcRecord(npcId) {
    const rec = G.npcState[npcId];
    if (!rec) return;
    if (!rec.rumorsHeard) rec.rumorsHeard = [];
    if (!rec.purchases) rec.purchases = [];
    if (!rec.testsPassed) rec.testsPassed = [];
    if (npcId === 'wei_collector') {
        if (!rec.wanderZone) rec.wanderZone = pickWeiWanderZone();
        if (!rec.wanderDueMonths) rec.wanderDueMonths = G.ageMonths + pickWeiWanderInterval();
        if (!rec.wanderLog) rec.wanderLog = [];
    }
}

function pickWeiWanderZone() {
    const zones = NPCS.wei_collector?.wanderZones || [];
    return zones[Math.floor(Math.random() * zones.length)] || 'jade';
}

function pickWeiWanderInterval() {
    const b = NPC_BALANCE;
    return b.weiWanderIntervalMin + Math.floor(Math.random() * (b.weiWanderIntervalMax - b.weiWanderIntervalMin + 1));
}

function tickNpcWorld(monthsPassed) {
    ensureNpcState();
}

function executeWeiWanderMove() {
    ensureNpcState();
    const wei = G.npcState.wei_collector;
    if (!wei) return;
    const oldZone = wei.wanderZone;
    let newZone = pickWeiWanderZone();
    const zones = NPCS.wei_collector?.wanderZones || [];
    let guard = 0;
    while (newZone === oldZone && zones.length > 1 && guard++ < 8) {
        newZone = pickWeiWanderZone();
    }
    wei.wanderZone = newZone;
    wei.wanderDueMonths = G.ageMonths + pickWeiWanderInterval();
    wei.wanderLog.push({ months: G.ageMonths, zone: newZone });
    if (typeof trySpawnWeiWorldEvent === 'function') trySpawnWeiWorldEvent(newZone);
    if (wei.wanderLog.length > 12) wei.wanderLog.shift();
    const zoneName = ZONES[newZone]?.name || newZone;
    if (typeof appendWorldChronicle === 'function') {
        appendWorldChronicle({
            emoji: '🧳',
            summary: `Wei the Collector seen in ${zoneName}`,
            text: `Whispers travel the jianghu — Wei was sighted in the ${zoneName}.`,
            zoneId: newZone,
            type: 'wei_wander'
        });
    }
    ensureWeiWanderScheduled();
}

function ensureWeiWanderScheduled() {
    ensureNpcState();
    const wei = G.npcState.wei_collector;
    if (!wei) return;
    if (!wei.wanderZone) wei.wanderZone = pickWeiWanderZone();
    if (!wei.wanderDueMonths) wei.wanderDueMonths = (G.ageMonths || 0) + pickWeiWanderInterval();
    if (typeof scheduleWorldEvent !== 'function') return;
    if (wei.wanderDueMonths <= G.ageMonths) {
        wei.wanderDueMonths = G.ageMonths + pickWeiWanderInterval();
    }
    scheduleWorldEvent('wei_wander', wei.wanderDueMonths, {}, { id: 'wei_wander' });
}

function tickWeiWandering() {
    ensureWeiWanderScheduled();
}

function refreshNpcWandering(force) {
    ensureNpcState();
    if (!force) return;
    const wei = G.npcState.wei_collector;
    wei.wanderZone = pickWeiWanderZone();
    wei.wanderDueMonths = G.ageMonths + pickWeiWanderInterval();
    ensureWeiWanderScheduled();
}

function getNpcDef(npcId) {
    return NPCS[npcId] || null;
}

function isNpcImplemented(npcId) {
    const def = getNpcDef(npcId);
    return !!def && def.implemented !== false;
}

function isElderHuaUnlocked() {
    ensureForbiddenState();
    ensureNpcState();
    const rec = G.npcState.elder_hua;
    const groundId = NPCS.elder_hua?.guardianGround;
    if (!groundId) return false;
    if (rec?.met) return true;
    if (G.realmIdx < (NPCS.elder_hua.reqRealm || 0)) return false;
    return isGroundDiscovered(groundId);
}

function isNpcPresent(npcId, zoneId) {
    const def = getNpcDef(npcId);
    if (!def || !isNpcImplemented(npcId)) return false;
    zoneId = zoneId || currentZone;
    if (npcId === 'wei_collector') {
        if (zoneId === def.homeZone) return true;
        ensureNpcState();
        return G.npcState.wei_collector?.wanderZone === zoneId;
    }
    if (npcId === 'elder_hua') {
        if (zoneId !== def.homeZone) return false;
        return isElderHuaUnlocked();
    }
    if (npcId === 'wei_ling') {
        if (typeof isStoryNpcPresent === 'function') return isStoryNpcPresent('wei_ling', zoneId);
        return zoneId === def.homeZone;
    }
    return (def.zones || []).includes(zoneId);
}

function getNpcDisposition(npcId) {
    const mood = getNpcAlignmentMood(npcId);
    return NPC_DISPOSITION[mood] || NPC_DISPOSITION.neutral;
}

function getNpcDispositionLabel(npcId) {
    const d = getNpcDisposition(npcId);
    return `${d.emoji} ${d.label}`;
}

function getNpcRealmName(realmIdx) {
    const cap = typeof getMaxCultivationRealmIdx === 'function' ? getMaxCultivationRealmIdx() : 6;
    const idx = clamp(realmIdx, 0, cap);
    return PATHS[G.path].realms[idx] || PATHS[G.path].realms[cap] || 'Transcendent';
}

function getNpcStrengthLabel(npcId) {
    const def = getNpcDef(npcId);
    if (!def) return 'Unknown';
    if (def.strengthLabel) return def.strengthLabel;
    let realm = def.strengthRealm;
    if (def.strengthScalesWithPlayer) realm = G.realmIdx;
    if (realm == null) return 'Unknown';
    const realmName = getNpcRealmName(realm);
    const diff = realm - G.realmIdx;
    if (diff >= 3) return `⚡ Far above · ${realmName}`;
    if (diff >= 1) return `⚡ Stronger · ${realmName}`;
    if (diff === 0) return `⚡ Peer · ${realmName}`;
    if (diff === -1) return `⚡ Close · ${realmName}`;
    return `⚡ Below you · ${realmName}`;
}

function getNpcOccupation(npcId) {
    const def = getNpcDef(npcId);
    return def?.occupation || def?.title || 'Traveler';
}

function getPresentNpcEntries(zoneId) {
    zoneId = zoneId || currentZone;
    const entries = [];
    const localsBlocked = typeof isZoneFactionIsolated === 'function' && isZoneFactionIsolated(zoneId);
    if (!localsBlocked) {
        Object.keys(NPCS).forEach(id => {
            if (isNpcPresent(id, zoneId)) entries.push({ type: 'story', id });
        });
        if (typeof getWorldNpcsInZone === 'function') {
            getWorldNpcsInZone(zoneId).forEach(npc => {
                entries.push({ type: 'world', id: worldNpcId(npc.uid), npc });
            });
        }
    }
    if (typeof getFactionNpcsInZone === 'function') {
        getFactionNpcsInZone(zoneId).forEach(npc => {
            entries.push({ type: 'faction', id: npc.id });
        });
    }
    return entries;
}

function getWorldNpcAlignmentMood(npc) {
    ensureDaoAlignment();
    const align = G.daoAlignment;
    let mood;
    if (npc.isDemonicTalent) {
        if (align >= 30) mood = 'dissonant';
        else if (align <= -30) mood = 'favored';
        else mood = 'neutral';
    } else if (align >= 70) mood = 'harmony';
    else if (align >= 30) mood = 'favored';
    else if (align >= -29) mood = 'neutral';
    else if (align >= -69) mood = 'dissonant';
    else mood = 'rebellious';

    if (typeof getSectWorldNpcMoodShift === 'function' && typeof isSectFounded === 'function' && isSectFounded()) {
        const order = ['rebellious', 'dissonant', 'neutral', 'favored', 'harmony'];
        const idx = order.indexOf(mood);
        if (idx >= 0) {
            const shift = getSectWorldNpcMoodShift();
            mood = order[Math.max(0, Math.min(order.length - 1, idx + shift))];
        }
    }
    return shiftNpcMoodByTrait(mood);
}

function getWorldNpcDispositionLabel(npc) {
    const d = NPC_DISPOSITION[getWorldNpcAlignmentMood(npc)] || NPC_DISPOSITION.neutral;
    return `${d.emoji} ${d.label}`;
}

function getWorldNpcStrengthLabel(npc) {
    const realmName = getNpcRealmName(npc.realmIdx);
    const diff = npc.realmIdx - G.realmIdx;
    const prefix = npc.isDemonicTalent ? '😈' : '⚡';
    if (diff >= 3) return `${prefix} Far above · ${realmName}`;
    if (diff >= 1) return `${prefix} Stronger · ${realmName}`;
    if (diff === 0) return `${prefix} Peer · ${realmName}`;
    if (diff === -1) return `${prefix} Close · ${realmName}`;
    return `${prefix} Below you · ${realmName}`;
}

function getPersonalityDef(personalityId) {
    return NPC_PERSONALITIES[personalityId] || null;
}

function getNpcPersonalityIds(npc) {
    if (typeof ensureNpcPersonalities === 'function') ensureNpcPersonalities(npc);
    return npc.personalities || [];
}

function formatPersonalityLabels(npc) {
    return getNpcPersonalityIds(npc)
        .map(id => getPersonalityDef(id))
        .filter(Boolean)
        .map(p => `${p.emoji} ${p.label}`)
        .join(' · ');
}

function getWorldNpcPersonalityGreeting(npc) {
    const ids = getNpcPersonalityIds(npc);
    const primary = ids[0] ? getPersonalityDef(ids[0]) : null;
    if (primary?.greet) return primary.greet;
    return null;
}

function buildWorldNpcTalkPool(npc) {
    const pool = [];
    const roleLines = NPC_ROLE_TALK[npc.role] || NPC_ROLE_TALK.wanderer || [];
    roleLines.forEach(line => pool.push({ line, weight: 1 }));

    getNpcPersonalityIds(npc).forEach((id, idx) => {
        const def = getPersonalityDef(id);
        if (!def) return;
        const weight = idx === 0 ? 2.2 : 1.4;
        (def.talk || []).forEach(line => pool.push({ line, weight }));
        const mood = getWorldNpcAlignmentMood(npc);
        const alignLine = def.alignmentTalk?.[mood];
        if (alignLine) pool.push({ line: alignLine, weight: 1.6 });
    });

    const fame = G.fame || 0;
    if (fame >= 60 && idsIncludeAny(getNpcPersonalityIds(npc), ['proud', 'ambitious', 'bold'])) {
        pool.push({ line: `Your fame precedes you, ${G.name}.`, weight: 1.3 });
    }
    if (fame < 5 && idsIncludeAny(getNpcPersonalityIds(npc), ['cowardly', 'careful'])) {
        pool.push({ line: 'I do not know you. Keep your distance.', weight: 1.2 });
    }

    if (typeof getLatestKillInZone === 'function') {
        const victim = getLatestKillInZone(npc.zone);
        if (victim && idsIncludeAny(getNpcPersonalityIds(npc), ['vengeful'])) {
            pool.push({
                line: `I heard what became of ${victim.name}. The jianghu remembers.`,
                weight: 2.5
            });
        }
    }
    if (typeof getPlayerNpcKillCount === 'function') {
        const kills = getPlayerNpcKillCount();
        if (kills >= 2 && idsIncludeAny(getNpcPersonalityIds(npc), ['merciful'])) {
            pool.push({
                line: 'So much blood on the cultivation path… must it always end this way?',
                weight: 2.0
            });
        } else if (kills === 0 && G.fame >= 30 && idsIncludeAny(getNpcPersonalityIds(npc), ['merciful'])) {
            pool.push({
                line: 'You carry fame without the stench of graves. That is rare.',
                weight: 1.5
            });
        }
    }

    return pool.length ? pool : [{ line: '...', weight: 1 }];
}

function idsIncludeAny(ids, targets) {
    return targets.some(t => ids.includes(t));
}

function pickWeightedTalkLine(pool) {
    const total = pool.reduce((s, e) => s + e.weight, 0);
    let roll = Math.random() * total;
    for (const entry of pool) {
        roll -= entry.weight;
        if (roll <= 0) return entry.line;
    }
    return pool[pool.length - 1].line;
}

function getWorldNpcBehaviorWeight(npc, kind) {
    const ids = getNpcPersonalityIds(npc);
    if (!ids.length) return 1;
    let sum = 0;
    ids.forEach(id => {
        const b = getPersonalityDef(id)?.behavior?.[kind];
        if (b != null) sum += b;
    });
    return sum / ids.length;
}

function getWorldNpcGreeting(npc) {
    const famePrefix = G.fame >= 60
        ? `Word of ${G.name} travels far. `
        : G.fame >= 10 ? `I've heard of you. ` : '';
    const personalityGreet = getWorldNpcPersonalityGreeting(npc);
    if (personalityGreet) return `${famePrefix}${personalityGreet}`;
    const role = NPC_ROLES[npc.role] || NPC_ROLES.wanderer;
    if (npc.isDemonicTalent) {
        return `${famePrefix}I am ${npc.name}. Heaven wrote limits — I rewrite them.`;
    }
    if (npc.role === 'villager') {
        return `${famePrefix}Just a mortal, ${npc.name}. Pay no mind unless you need directions.`;
    }
    return `${famePrefix}${role.label} ${npc.name}, ${getNpcRealmName(npc.realmIdx)} cultivation.`;
}

function getWorldNpcTalkLine(npc) {
    npc.talkCount = (npc.talkCount || 0) + 1;
    if (npc.isDemonicTalent) npc.demonicMet = true;
    return pickWeightedTalkLine(buildWorldNpcTalkPool(npc));
}

function getWorldNpcObserveText(npc) {
    const role = NPC_ROLES[npc.role] || NPC_ROLES.wanderer;
    const personalityLine = formatPersonalityLabels(npc);
    const lines = [
        `Role: ${role.label}`,
        personalityLine ? `Personality: ${personalityLine}` : null,
        `Realm: ${getNpcRealmName(npc.realmIdx)}`,
        `Age: ~${formatYears(npc.ageMonths)}`,
        `Growth: ${Math.round(npc.growthProgress || 0)}/${NPC_ECOSYSTEM.growthMonthsPerBreakthrough} progress`
    ].filter(Boolean);
    if (npc.isDemonicTalent) {
        lines.push(`Demonic threat: ${npc.demonicThreat || 0}`);
    }
    return lines.join(' · ');
}

function getPresentNpcCards(zoneId) {
    return getPresentNpcEntries(zoneId).map(entry => {
        if (entry.type === 'faction') {
            const def = typeof getFactionNpcDef === 'function' ? getFactionNpcDef(entry.id) : null;
            const fdef = def && typeof getFactionDef === 'function' ? getFactionDef(def.factionId) : null;
            const tier = def && typeof getFactionTier === 'function' ? getFactionTier(def.factionId) : null;
            return {
                id: entry.id,
                name: def?.name || entry.id,
                emoji: def?.emoji || '🏯',
                occupation: def?.title || 'Faction Elder',
                familiarity: tier ? `${tier.label} · ${getFactionRep(def.factionId)} rep` : '',
                met: true
            };
        }
        if (entry.type === 'story') {
            return {
                id: entry.id,
                name: getNpcDef(entry.id).name,
                emoji: getNpcDef(entry.id).emoji,
                occupation: getNpcOccupation(entry.id),
                disposition: getNpcDispositionLabel(entry.id),
                dispositionMood: getNpcAlignmentMood(entry.id),
                strength: getNpcStrengthLabel(entry.id),
                familiarity: getNpcFamiliarityLabel(entry.id),
                met: getNpcRecord(entry.id).met
            };
        }
        const n = entry.npc;
        const role = NPC_ROLES[n.role] || NPC_ROLES.wanderer;
        return {
            id: entry.id,
            name: n.name,
            emoji: n.isDemonicTalent ? '😈' : role.emoji,
            occupation: n.isDemonicTalent ? role.occupation : role.occupation,
            personalities: formatPersonalityLabels(n),
            disposition: getWorldNpcDispositionLabel(n),
            dispositionMood: getWorldNpcAlignmentMood(n),
            strength: getWorldNpcStrengthLabel(n),
            familiarity: n.met ? (n.talkCount >= 5 ? 'Familiar' : 'Recognized') : '',
            met: n.met
        };
    });
}

function getNpcPresenceHint() {
    ensureNpcState();
    const wei = G.npcState.wei_collector;
    if (!wei?.met || isNpcPresent('wei_collector', currentZone)) return '';
    const zone = ZONES[wei.wanderZone];
    return `🧳 Wei the Collector — last rumored in ${zone?.name || wei.wanderZone}`;
}

function getPresentNpcs(zoneId) {
    return getPresentNpcEntries(zoneId);
}

function getNpcRecord(npcId) {
    if (isWorldNpcId(npcId)) return getWorldNpcById(npcId) || {};
    ensureNpcState();
    return G.npcState[npcId];
}

function recordNpcSeen(npcId) {
    if (isWorldNpcId(npcId)) {
        const npc = getWorldNpcById(npcId);
        if (!npc) return;
        npc._gapBeforeSeen = npc.lastSeenMonths != null ? G.ageMonths - npc.lastSeenMonths : null;
        npc.met = true;
        if (npc.isDemonicTalent) npc.demonicMet = true;
        npc.lastSeenMonths = G.ageMonths;
        if (typeof maybeOfferNpcQuests === 'function') maybeOfferNpcQuests(npc);
        if (typeof triggerTutorial === 'function') triggerTutorial('first_npc');
        return;
    }
    const rec = getNpcRecord(npcId);
    rec._gapBeforeSeen = rec.lastSeenMonths != null ? G.ageMonths - rec.lastSeenMonths : null;
    if (!rec.met) {
        rec.met = true;
        rec.firstMetMonths = G.ageMonths;
    }
    rec.lastSeenMonths = G.ageMonths;
    rec.lastSeenZone = currentZone;
    if (typeof triggerTutorial === 'function') triggerTutorial('first_npc');
}

function bumpNpcFamiliarity(npcId, amount) {
    const rec = getNpcRecord(npcId);
    rec.familiarity = (rec.familiarity || 0) + amount;
}

function shiftNpcMoodByTrait(mood) {
    if (!mood || typeof getPlayerTraitNpcMoodShift !== 'function') return mood;
    const shift = getPlayerTraitNpcMoodShift();
    if (!shift) return mood;
    const order = ['rebellious', 'dissonant', 'neutral', 'favored', 'harmony'];
    const idx = order.indexOf(mood);
    if (idx < 0) return mood;
    return order[Math.max(0, Math.min(order.length - 1, idx + shift))];
}

function getNpcAlignmentMood(npcId) {
    ensureDaoAlignment();
    const def = getNpcDef(npcId);
    if (!def) return 'neutral';
    const align = G.daoAlignment;
    if (npcId === 'elder_hua' && align < (def.alignmentMinWarm ?? 30)) {
        if (align >= (def.alignmentColdBelow ?? -29)) return shiftNpcMoodByTrait('neutral');
        return shiftNpcMoodByTrait(align >= -69 ? 'dissonant' : 'rebellious');
    }
    if (align >= 70) return shiftNpcMoodByTrait('harmony');
    if (align >= 30) return shiftNpcMoodByTrait('favored');
    if (align >= (def.alignmentSweetSpot?.min ?? -29)) return shiftNpcMoodByTrait('neutral');
    if (align >= (def.alignmentColdBelow ?? -30)) return shiftNpcMoodByTrait('dissonant');
    return shiftNpcMoodByTrait('rebellious');
}

function getNpcPriceMult(npcId) {
    const def = getNpcDef(npcId);
    if (!def?.priceMult) return 1;
    const mood = getNpcAlignmentMood(npcId);
    let mult = def.priceMult[mood] ?? 1;
    const fam = getNpcRecord(npcId)?.familiarity || 0;
    if (fam >= 12) mult *= 0.97;
    if (fam >= 24) mult *= 0.95;
    if (typeof getSectTradePriceMult === 'function') mult *= getSectTradePriceMult();
    return mult;
}

function getNpcFameTier() {
    if (G.fame < 10) return 'low';
    if (G.fame < 60) return 'mid';
    return 'high';
}

function getNpcMemoryLine(npcId) {
    const def = getNpcDef(npcId);
    const rec = getNpcRecord(npcId);
    if (!rec.met || !def?.memoryLines) return '';
    const lines = def.memoryLines;
    if (rec.familiarity >= 20 && lines.familiar) {
        return lines.familiar.replace('{name}', G.name);
    }
    if ((rec.rumorsHeard?.length || 0) >= 3 && lines.rumorHunter) return lines.rumorHunter;
    if ((rec.purchases?.length || 0) >= 2 && lines.repeatBuyer) return lines.repeatBuyer;
    const gap = rec._gapBeforeSeen != null
        ? rec._gapBeforeSeen
        : G.ageMonths - (rec.firstMetMonths || G.ageMonths);
    if (gap >= 24 && lines.returnLong) {
        return lines.returnLong.replace('{duration}', formatDuration(gap));
    }
    if (gap >= 6 && lines.returnShort) return lines.returnShort;
    return '';
}

function getStoryNpcPersonalityIds(npcId) {
    const def = getNpcDef(npcId);
    return def?.personalities || [];
}

function getNpcGreeting(npcId) {
    const def = getNpcDef(npcId);
    if (!def) return '';
    const rec = getNpcRecord(npcId);

    const fameTier = getNpcFameTier();
    const fameLine = (def.fameGreet?.[fameTier] || '').replace('{name}', G.name);
    const memoryLine = rec.firstMetMonths != null && rec.firstMetMonths !== G.ageMonths
        ? getNpcMemoryLine(npcId)
        : '';

    let core = def.greet;
    if (npcId === 'elder_hua' && isGroundDiscovered(def.guardianGround)) {
        core = def.greetObservatory || def.greet;
    }

    const mood = getNpcAlignmentMood(npcId);
    let alignmentNote = '';
    if (npcId === 'wei_collector') {
        if (mood === 'harmony' || mood === 'favored') alignmentNote = ' The Dao smiles on our bargain today.';
        else if (mood === 'dissonant' || mood === 'rebellious') alignmentNote = ' You walk out of step with heaven — my prices will show it.';
    } else if (npcId === 'elder_hua') {
        if (mood === 'harmony' || mood === 'favored') alignmentNote = ' The stars seem brighter when you speak.';
        else if (mood === 'dissonant' || mood === 'rebellious') alignmentNote = ' The tower groans faintly at your disharmony.';
    }

    const parts = [memoryLine, fameLine, core, alignmentNote].filter(Boolean);
    const greet = parts.join(' ');
    const personalityIds = getStoryNpcPersonalityIds(npcId);
    if (personalityIds.length) {
        const pDef = getPersonalityDef(personalityIds[0]);
        if (pDef?.greet && !memoryLine) return `${greet} ${pDef.greet}`;
    }
    return greet;
}

function getNpcTalkLine(npcId) {
    const def = getNpcDef(npcId);
    if (!def) return '...';
    const rec = getNpcRecord(npcId);
    rec.talkCount = (rec.talkCount || 0) + 1;
    bumpNpcFamiliarity(npcId, NPC_BALANCE.familiarityPerTalk);
    const mood = getNpcAlignmentMood(npcId);
    const pool = [];
    const roleLines = mood === 'harmony' || mood === 'favored'
        ? (def.talkWarm || def.talkNeutral || [])
        : mood === 'neutral'
            ? (def.talkNeutral || [])
            : (def.talkCold || def.talkNeutral || []);
    roleLines.forEach(line => pool.push({ line, weight: 1 }));

    getStoryNpcPersonalityIds(npcId).forEach((id, idx) => {
        const pDef = getPersonalityDef(id);
        if (!pDef) return;
        const weight = idx === 0 ? 2 : 1.3;
        (pDef.talk || []).forEach(line => pool.push({ line, weight }));
        const alignLine = pDef.alignmentTalk?.[mood];
        if (alignLine) pool.push({ line: alignLine, weight: 1.5 });
    });

    if (!pool.length) return def.greet;
    return pickWeightedTalkLine(pool);
}

function getNpcStockPrice(item, npcId) {
    return Math.max(1, Math.floor(item.price * getNpcPriceMult(npcId)));
}

function isNpcStockItemOwned(item) {
    if (item.type === 'technique') {
        return G.techniques.some(t => t.name === item.technique);
    }
    if (item.type === 'dao_fragment') return false;
    if (item.oneTime && G.npcState?.purchased?.includes(item.id)) return true;
    return false;
}

function canBuyNpcStockItem(item, npcId) {
    if (item.reqRealm != null && G.realmIdx < item.reqRealm) return false;
    if (isNpcStockItemOwned(item)) return false;
    return G.stones >= getNpcStockPrice(item, npcId);
}

function pickNpcDaoFragment() {
    const pool = DAO_FRAGMENTS.filter(f => {
        if (G.daoFragments.includes(f.name)) return false;
        if (typeof getDaoFragmentReqRealm === 'function' && G.realmIdx < getDaoFragmentReqRealm(f)) return false;
        if (f.forbiddenClear && typeof getGroundProgress === 'function' && !getGroundProgress(f.forbiddenClear).cleared) {
            return false;
        }
        return true;
    });
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
}

function applyNpcPurchase(item, npcId) {
    if (item.type === 'inventory') {
        if (!G.inventory) G.inventory = [];
        (item.items || [item.item]).forEach(name => {
            if (name && !G.inventory.includes(name)) G.inventory.push(name);
        });
        return `Received ${item.label}.`;
    }
    if (item.type === 'legendary_material') {
        if (!G.legendaryMaterials) G.legendaryMaterials = [];
        if (!G.legendaryMaterials.includes(item.item)) G.legendaryMaterials.push(item.item);
        return `Acquired ${item.item}.`;
    }
    if (item.type === 'pill') {
        addPill(item.pillId, item.qty || 1);
        const pill = PILL_TYPES[item.pillId];
        return `Received ${item.qty || 1}× ${pill?.name || item.label}.`;
    }
    if (item.type === 'dao_fragment') {
        const frag = pickNpcDaoFragment();
        if (!frag) return 'No Dao fragments available at your cultivation level.';
        if (!G.daoFragments.includes(frag.name)) G.daoFragments.push(frag.name);
        return `Unsealed ${frag.name}! ${frag.desc}`;
    }
    if (item.type === 'technique') {
        learnTechnique(item.technique);
        return `Learned ${item.technique}.`;
    }
    return 'Purchase complete.';
}

function npcBuyItem(npcId, itemId) {
    const def = getNpcDef(npcId);
    const item = def?.stock?.find(s => s.id === itemId);
    if (!item) return { success: false, message: 'Item not found.' };
    if (isNpcStockItemOwned(item)) return { success: false, message: 'You already have this.' };
    if (item.reqRealm != null && G.realmIdx < item.reqRealm) {
        return { success: false, message: 'Your realm is too low.' };
    }
    const price = getNpcStockPrice(item, npcId);
    if (G.stones < price) return { success: false, message: `Need ${price} Stones.` };
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.npcTrade, `Trading with ${def.name}`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends...' };
    }
    G.stones -= price;
    const rec = getNpcRecord(npcId);
    rec.tradeCount = (rec.tradeCount || 0) + 1;
    rec.purchases.push(item.id);
    bumpNpcFamiliarity(npcId, NPC_BALANCE.familiarityPerTrade);
    if (item.oneTime) G.npcState.purchased.push(item.id);
    const result = applyNpcPurchase(item, npcId);
    const msg = `${def.emoji} ${def.name}: ${result} (−${price} Stones)`;
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

function npcGrantRumor(npcId) {
    const def = getNpcDef(npcId);
    if (!def) return { success: false, message: 'No one to ask.' };
    ensureForbiddenState();
    const mood = getNpcAlignmentMood(npcId);
    const cost = mood === 'dissonant' || mood === 'rebellious'
        ? (def.rumorCostCold || def.rumorCost)
        : def.rumorCost;
    if (G.stones < (cost.stones || 0)) {
        return { success: false, message: `Need ${cost.stones} Stones for a rumor.` };
    }
    beginActionLog();
    if (!advanceTime(cost.months || ACTION_MONTHS.npcRumor, `Listening to ${def.name}'s rumors`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends...' };
    }
    G.stones -= cost.stones || 0;

    const candidates = Object.keys(FORBIDDEN_GROUNDS).filter(id => !getGroundProgress(id).rumor);
    const zoneFirst = candidates.filter(id => FORBIDDEN_GROUNDS[id].zone === currentZone);
    const pool = zoneFirst.length ? zoneFirst : candidates;
    if (!pool.length) {
        const msg = `${def.emoji} ${def.name}: "I've told you every secret worth selling. Search the world yourself."`;
        commitActionLog(msg);
        return { success: true, message: msg, logged: true };
    }
    const groundId = pool[Math.floor(Math.random() * pool.length)];
    grantClue(groundId, 'rumor');
    const rec = getNpcRecord(npcId);
    if (!rec.rumorsHeard.includes(groundId)) rec.rumorsHeard.push(groundId);
    bumpNpcFamiliarity(npcId, NPC_BALANCE.familiarityPerRumor);
    const msg = `${def.emoji} ${def.name} leans close. "This one is worth the coin..."`;
    if (typeof grantAncientClueForZone === 'function' && Math.random() < 0.12) {
        grantAncientClueForZone(currentZone, `${def.name} mutters an older secret`);
    }
    if (typeof shiftDaoAlignment === 'function' && mood !== 'rebellious') {
        shiftDaoAlignment(NPC_BALANCE.rumorAlignmentHelp, 'sharing knowledge with a sage merchant');
    }
    commitActionLog(msg);
    return { success: true, message: `Rumor about ${FORBIDDEN_GROUNDS[groundId].name}.`, logged: true };
}

function getNextHuaTest() {
    const def = NPCS.elder_hua;
    const rec = getNpcRecord('elder_hua');
    const passed = rec.testsPassed || [];
    return (def.tests || []).find(t => !passed.includes(t.id)) || null;
}

function npcHuaStarLore() {
    const def = NPCS.elder_hua;
    const pool = def.starLore || [];
    const line = pool[Math.floor(Math.random() * pool.length)] || def.greet;
    addLog(`${def.emoji} Elder Hua: "${line}"`);
    const mood = getNpcAlignmentMood('elder_hua');
    if ((mood === 'harmony' || mood === 'favored') && typeof shiftDaoAlignment === 'function') {
        shiftDaoAlignment(NPC_BALANCE.huaStarLoreAlignment, 'listening beneath the stars');
    }
    bumpNpcFamiliarity('elder_hua', NPC_BALANCE.familiarityPerTalk);
    return line;
}

function npcSubmitHuaTest(choiceIdx) {
    const test = npcUiActiveTest;
    if (!test) return;
    const choice = test.choices[choiceIdx];
    if (!choice) return;
    const def = NPCS.elder_hua;
    const rec = getNpcRecord('elder_hua');
    rec.lastTestMonths = G.ageMonths;

    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.npcTest, 'Meditating on Elder Hua\'s riddle')) {
        cancelActionLog();
        addLog('💀 Your lifespan ends mid-lesson...');
        fullRender();
        return;
    }

    if (choice.correct) {
        if (!rec.testsPassed.includes(test.id)) rec.testsPassed.push(test.id);
        bumpNpcFamiliarity('elder_hua', NPC_BALANCE.familiarityPerTest);
        G.foundation += NPC_BALANCE.huaTestFoundation;
        commitActionLog(`${def.emoji} ${choice.log} · +${NPC_BALANCE.huaTestFoundation} Foundation`);
        if (typeof completeNpcQuestByGiver === 'function') {
            completeNpcQuestByGiver({ storyId: 'elder_hua' }, 'hua_guidance');
        }
        const huaHook = NPC_ANCIENT_CLUE_HOOKS?.elder_hua;
        if (huaHook && test.id === huaHook.testId && typeof addAncientClue === 'function') {
            addAncientClue(huaHook.clueId);
        }
        if (typeof syncStoryNpcQuests === 'function') syncStoryNpcQuests();
        const mood = getNpcAlignmentMood('elder_hua');
        if (mood === 'harmony' || mood === 'favored') {
            if (typeof shiftDaoAlignment === 'function') {
                shiftDaoAlignment(NPC_BALANCE.huaTestAlignment, 'passing Elder Hua\'s test');
            }
        } else if (typeof shiftDaoAlignment === 'function') {
            shiftDaoAlignment(Math.floor(NPC_BALANCE.huaTestAlignment / 2), 'partial understanding');
        }
    } else {
        commitActionLog(`${def.emoji} ${choice.failLog || 'The answer does not satisfy the stars.'}`);
    }

    npcUiMode = 'menu';
    npcUiActiveTest = null;
    renderNpcPopup();
    fullRender();
}

function npcTalk(npcId) {
    const def = getNpcDef(npcId);
    if (!def) return;
    const line = getNpcTalkLine(npcId);
    addLog(`${def.emoji} ${def.name}: "${line}"`);
    if (typeof tryGrantAncientClueFromNpc === 'function') tryGrantAncientClueFromNpc(npcId);
}

let npcUiMode = 'menu';
let npcUiTarget = null;
let npcUiActiveTest = null;

function getNpcMenuActions(npcId) {
    if (typeof isFactionNpcId === 'function' && isFactionNpcId(npcId)) {
        return typeof getFactionNpcMenuActions === 'function'
            ? getFactionNpcMenuActions(npcId)
            : [{ action: 'leave', label: '🚪 Leave', desc: 'Continue your journey' }];
    }
    if (isWorldNpcId(npcId)) {
        const npc = getWorldNpcById(npcId);
        const actions = [
            { action: 'talk', label: '💬 Talk', desc: 'Exchange words' },
            { action: 'observe', label: '👁️ Observe', desc: 'Read their cultivation and intent' }
        ];
        if (npc && typeof shouldOfferNpcDuel === 'function' && shouldOfferNpcDuel(npc)) {
            actions.unshift({
                action: 'duel',
                label: '⚔️ Accept duel',
                desc: 'Formal combat — fame, foundation, and risk'
            });
        }
        if (npc && typeof canRecruitWorldNpc === 'function' && canRecruitWorldNpc(npc)) {
            actions.unshift({
                action: 'sect_recruit',
                label: '🏯 Invite to sect',
                desc: 'Recruit as an Acolyte — costs time'
            });
        } else if (npc && typeof getRecruitWorldNpcBlockReason === 'function'
            && SECT_NPC_RECRUIT.roles.includes(npc.role) && typeof isSectFounded === 'function' && isSectFounded()) {
            const block = getRecruitWorldNpcBlockReason(npc);
            if (block && (npc.talkCount || 0) >= 1) {
                actions.push({
                    action: 'sect_recruit_hint',
                    label: '🏯 Sect recruit',
                    desc: block
                });
            }
        }
        if (npc && typeof shouldShowDemonicConfrontation === 'function' && shouldShowDemonicConfrontation(npc)) {
            actions.unshift(
                {
                    action: 'demonic_fight',
                    label: '😈 Confront',
                    desc: 'Battle the heaven-defying prodigy'
                },
                {
                    action: 'demonic_bargain',
                    label: '🤝 Dark bargain',
                    desc: `${NPC_COMBAT_BALANCE.demonicBargainStones} Stones · shifts Dao alignment`
                }
            );
        }
        if (npc?.isDemonicTalent && npc.demonicAllied && typeof G !== 'undefined') {
            const dr = G.demonicRedemption;
            if (!dr || dr.status !== 'active') {
                actions.unshift({
                    action: 'demonic_redeem',
                    label: '☯️ Guide their redemption',
                    desc: 'Begin "Path of the Prodigy" — escort and choose their fate'
                });
            }
        }
        actions.push({ action: 'leave', label: '🚪 Leave', desc: 'Continue on your path' });
        return actions;
    }
    if (npcId === 'wei_collector') {
        return [
            { action: 'trade', label: '🛒 Browse wares', desc: 'Rare herbs, pills, artifacts, and curios' },
            { action: 'rumor', label: '📰 Buy a rumor', desc: 'Hints toward forbidden grounds' },
            { action: 'talk', label: '💬 Talk', desc: 'Swap words with a seasoned traveler' },
            { action: 'leave', label: '🚪 Leave', desc: 'Return to your journey' }
        ];
    }
    if (npcId === 'elder_hua') {
        const nextTest = getNextHuaTest();
        let actions = [
            { action: 'stars', label: '🔭 Ask about the Observatory', desc: 'Lore of the Celestial tower' },
            { action: 'talk', label: '💬 Speak in riddles', desc: 'Patient conversation with the guardian' },
            { action: 'leave', label: '🚪 Leave', desc: 'Descend the path' }
        ];
        if (nextTest) {
            actions.unshift({
                action: 'test',
                label: '📿 Seek guidance',
                desc: `Philosophical test — ${nextTest.riddle.slice(0, 48)}…`
            });
        }
        if (typeof getElderHuaQuestActions === 'function') actions = getElderHuaQuestActions(actions);
        return actions;
    }
    if (npcId === 'merchant_su' && typeof getMerchantSuQuestActions === 'function') {
        return getMerchantSuQuestActions();
    }
    if (npcId === 'liang_chen' && typeof getLiangChenQuestActions === 'function') {
        return getLiangChenQuestActions();
    }
    if (npcId === 'wei_ling' && typeof getWeiLingQuestActions === 'function') {
        return getWeiLingQuestActions();
    }
    return [{ action: 'talk', label: '💬 Talk', desc: 'Speak' }, { action: 'leave', label: '🚪 Leave', desc: 'Go' }];
}

function openNpcPopup(npcId) {
    const zoneId = G.currentZone || currentZone;
    const present = getPresentNpcEntries(zoneId);
    if (!present.length) return;
    if (!npcId && present.length > 1) {
        npcUiTarget = null;
        npcUiMode = 'pick';
    } else {
        npcUiTarget = npcId || present[0].id;
        npcUiMode = 'menu';
        npcUiActiveTest = null;
        recordNpcSeen(npcUiTarget);
    }
    renderNpcPopup();
    document.getElementById('npcPopup')?.classList.add('active');
}

function closeNpcPopup() {
    document.getElementById('npcPopup')?.classList.remove('active');
    npcUiTarget = null;
    npcUiMode = 'menu';
    npcUiActiveTest = null;
    const tradeList = document.getElementById('npcTradeList');
    if (tradeList) tradeList.innerHTML = '';
}

function getNpcFamiliarityLabel(npcId) {
    if (isWorldNpcId(npcId)) {
        const npc = getWorldNpcById(npcId);
        if (!npc?.met) return '';
        if (npc.talkCount >= 8) return 'Well known';
        if (npc.talkCount >= 3) return 'Recognized';
        return 'Stranger no longer';
    }
    const fam = getNpcRecord(npcId)?.familiarity || 0;
    if (fam >= 24) return 'Old acquaintance';
    if (fam >= 12) return 'Familiar face';
    if (fam >= 5) return 'Recognized';
    return 'Stranger no longer';
}

function renderNpcPopup() {
    const actions = document.getElementById('npcActions');
    const tradeList = document.getElementById('npcTradeList');
    const alignEl = document.getElementById('npcAlignmentNote');
    if (!actions || !tradeList) return;

    if (npcUiMode === 'pick') {
        const cards = getPresentNpcCards(G.currentZone || currentZone);
        document.getElementById('npcTitle').textContent = '🧍 Who do you approach?';
        document.getElementById('npcSubtitle').textContent = typeof getPlaceDisplayLabel === 'function'
            ? getPlaceDisplayLabel()
            : (ZONES[G.currentZone || currentZone]?.name || currentZone);
        document.getElementById('npcDialogue').textContent = 'Several figures are nearby.';
        if (alignEl) alignEl.textContent = '';
        tradeList.innerHTML = '';
        tradeList.style.display = 'none';
        actions.innerHTML = cards.map(c => {
            const fam = c.familiarity ? ` · ${c.familiarity}` : '';
            return `<button type="button" class="popup-item npc-action" data-npc-pick="${c.id}">
                <div class="name">${c.emoji} ${c.name}</div>
                <div class="desc">${c.occupation}${fam}</div>
            </button>`;
        }).join('') + `<button type="button" class="popup-item npc-action" data-npc-action="leave"><div class="name">🚪 Leave</div></button>`;
        bindNpcPopupEvents();
        return;
    }

    if (typeof isFactionNpcId === 'function' && isFactionNpcId(npcUiTarget)) {
        if (typeof renderFactionNpcPopup === 'function') renderFactionNpcPopup(npcUiTarget);
        bindNpcPopupEvents();
        return;
    }

    if (isWorldNpcId(npcUiTarget)) {
        const npc = getWorldNpcById(npcUiTarget);
        if (!npc) return;
        const role = NPC_ROLES[npc.role] || NPC_ROLES.wanderer;
        const emoji = npc.isDemonicTalent ? '😈' : role.emoji;
        document.getElementById('npcTitle').textContent = `${emoji} ${npc.name}`;
        const personalityHint = formatPersonalityLabels(npc);
        document.getElementById('npcSubtitle').textContent = personalityHint
            ? `${role.label} · ${personalityHint}`
            : `${role.label} · ${getNpcRealmName(npc.realmIdx)}`;
        document.getElementById('npcDialogue').textContent = npcUiMode === 'observe'
            ? getWorldNpcObserveText(npc)
            : getWorldNpcGreeting(npc);
        tradeList.innerHTML = '';
        tradeList.style.display = 'none';
        const mood = getWorldNpcAlignmentMood(npc);
        if (alignEl) {
            alignEl.textContent = `${getWorldNpcDispositionLabel(npc)} · ${getWorldNpcStrengthLabel(npc)} · Dao ${formatDaoAlignmentDisplay()}`;
        }
        actions.innerHTML = getNpcMenuActions(npcUiTarget).map(opt =>
            `<button type="button" class="popup-item npc-action" data-npc-action="${opt.action}">
                <div class="name">${opt.label}</div>
                <div class="desc">${opt.desc}</div>
            </button>`
        ).join('');
        bindNpcPopupEvents();
        return;
    }

    const def = getNpcDef(npcUiTarget);
    if (!def) return;

    document.getElementById('npcTitle').textContent = `${def.emoji} ${def.name}`;
    const storyPers = getStoryNpcPersonalityIds(npcUiTarget)
        .map(id => getPersonalityDef(id))
        .filter(Boolean)
        .map(p => `${p.emoji} ${p.label}`)
        .join(' · ');
    document.getElementById('npcSubtitle').textContent = storyPers
        ? `${def.title} · ${storyPers}`
        : `${def.title} · ${ZONES[currentZone]?.name || currentZone}`;

    if (npcUiMode === 'test' && npcUiActiveTest) {
        const test = npcUiActiveTest;
        document.getElementById('npcDialogue').textContent = `"${test.riddle}"`;
        if (alignEl) alignEl.textContent = `Dao ${formatDaoAlignmentDisplay()} · ${getNpcFamiliarityLabel(npcUiTarget)}`;
        tradeList.innerHTML = '';
        tradeList.style.display = 'none';
        actions.innerHTML = test.choices.map((c, i) =>
            `<button type="button" class="popup-item npc-action" data-npc-test="${i}">
                <div class="name">${c.label}</div>
            </button>`
        ).join('') + `<button type="button" class="popup-item npc-action" data-npc-action="back"><div class="name">← Back</div></button>`;
        bindNpcPopupEvents(def);
        return;
    }

    document.getElementById('npcDialogue').textContent = npcUiMode === 'trade'
        ? getNpcTradeIntro(def)
        : getNpcGreeting(npcUiTarget);

    if (npcUiMode === 'trade') {
        actions.innerHTML = `<button type="button" class="popup-item npc-action" data-npc-action="back">← Back to conversation</button>`;
        tradeList.innerHTML = renderNpcTradeRows(def);
        tradeList.style.display = 'block';
        if (alignEl) alignEl.textContent = `${getNpcFamiliarityLabel(npcUiTarget)} · Prices ×${getNpcPriceMult(npcUiTarget).toFixed(2)}`;
        bindNpcPopupEvents(def);
        return;
    }

    tradeList.innerHTML = '';
    tradeList.style.display = 'none';
    const mood = getNpcAlignmentMood(npcUiTarget);
    const rec = getNpcRecord(npcUiTarget);
    const extra = [];
    if (rec.rumorsHeard?.length) extra.push(`${rec.rumorsHeard.length} rumors bought`);
    if (rec.testsPassed?.length) extra.push(`${rec.testsPassed.length} tests passed`);
    if (alignEl) {
        alignEl.textContent = `Dao ${formatDaoAlignmentDisplay()} · ${mood} · ${getNpcFamiliarityLabel(npcUiTarget)}${extra.length ? ' · ' + extra.join(', ') : ''}`;
    }

    actions.innerHTML = getNpcMenuActions(npcUiTarget).map(opt =>
        `<button type="button" class="popup-item npc-action" data-npc-action="${opt.action}">
            <div class="name">${opt.label}</div>
            <div class="desc">${opt.desc}</div>
        </button>`
    ).join('');
    bindNpcPopupEvents(def);
}

function getNpcTradeIntro(def) {
    const mult = getNpcPriceMult(npcUiTarget);
    const rec = getNpcRecord(npcUiTarget);
    if (rec.purchases?.length >= 2) return `"For a repeat customer — the best I can offer. Prices still bite."`;
    if (mult < 1) return `"For you — a modest discount. The Dao remembers who keeps their balance."`;
    if (mult > 1) return `"My wares are rare. So is my patience with cultivators heaven has turned its back on."`;
    return `"Everything has a price. Even silence."`;
}

function renderNpcTradeRows(def) {
    if (!def.stock?.length) return `<div class="popup-empty">Nothing for sale today.</div>`;
    return def.stock.map(item => {
        const price = getNpcStockPrice(item, npcUiTarget);
        const owned = isNpcStockItemOwned(item);
        const locked = item.reqRealm != null && G.realmIdx < item.reqRealm;
        const canBuy = canBuyNpcStockItem(item, npcUiTarget);
        const status = owned ? 'Sold out' : locked ? `Need ${PATHS[G.path].realms[item.reqRealm]}` : `${price} Stones`;
        return `<div class="popup-item merchant-row npc-trade-row${owned ? ' owned' : ''}" data-npc-buy="${item.id}" style="${canBuy ? 'cursor:pointer;' : 'opacity:0.65;'}">
            <div class="name">${item.label}</div>
            <div class="desc">${item.desc}</div>
            <div class="desc" style="margin-top:4px;color:${canBuy ? '#d4a860' : '#a09080'};">${status}</div>
        </div>`;
    }).join('');
}

function bindNpcPopupEvents(def) {
    document.querySelectorAll('[data-npc-pick]').forEach(btn => {
        btn.onclick = function() {
            npcUiTarget = this.dataset.npcPick;
            npcUiMode = 'menu';
            recordNpcSeen(npcUiTarget);
            renderNpcPopup();
        };
    });
    document.querySelectorAll('[data-npc-action]').forEach(btn => {
        btn.onclick = function() {
            const action = this.dataset.npcAction;
            if (action === 'trade') {
                npcUiMode = 'trade';
                renderNpcPopup();
            } else if (action === 'rumor') {
                const result = npcGrantRumor(npcUiTarget);
                if (!result.success) addLog(`🧳 ${result.message}`);
                renderNpcPopup();
                fullRender();
            } else if (action === 'test') {
                npcUiActiveTest = getNextHuaTest();
                if (npcUiActiveTest) {
                    npcUiMode = 'test';
                    renderNpcPopup();
                }
            } else if (action === 'stars') {
                const line = npcHuaStarLore();
                document.getElementById('npcDialogue').textContent = `"${line}"`;
                fullRender();
            } else if (action === 'faction_panel') {
                closeNpcPopup();
                if (typeof actionFactions === 'function') actionFactions();
            } else if (action === 'sect_pact') {
                const pactId = this.dataset.pactId;
                const result = typeof performFactionSectPact === 'function'
                    ? performFactionSectPact(pactId)
                    : { success: false, message: 'Sect pacts unavailable.' };
                if (result.message) addLog(result.success ? `🏯 ${result.message}` : `🏯 ${result.message}`);
                renderNpcPopup();
                fullRender();
            } else if (action === 'faction_quest') {
                const questId = this.dataset.questId;
                const result = typeof acceptFactionQuest === 'function'
                    ? acceptFactionQuest(questId)
                    : { success: false, message: 'Quest unavailable.' };
                if (result.message) addLog(result.success ? `📜 ${result.message}` : `📜 ${result.message}`);
                renderNpcPopup();
                fullRender();
            } else if (action === 'talk') {
                if (typeof isFactionNpcId === 'function' && isFactionNpcId(npcUiTarget)) {
                    if (typeof npcFactionTalk === 'function') npcFactionTalk(npcUiTarget);
                    renderNpcPopup();
                    fullRender();
                } else if (isWorldNpcId(npcUiTarget)) {
                    const npc = getWorldNpcById(npcUiTarget);
                    const line = getWorldNpcTalkLine(npc);
                    addLog(`${npc.isDemonicTalent ? '😈' : NPC_ROLES[npc.role]?.emoji || '🧍'} ${npc.name}: "${line}"`);
                    document.getElementById('npcDialogue').textContent = `"${line}"`;
                    if (npc && typeof shouldOfferNpcDuel === 'function' && shouldOfferNpcDuel(npc)
                        && (npc.role === 'rival' || getWorldNpcBehaviorWeight(npc, 'duelWeight') >= 1.4)
                        && Math.random() < 0.3) {
                        addLog(`⚔️ ${npc.name} challenges you openly. Accept the duel from their menu.`);
                    }
                } else {
                    npcTalk(npcUiTarget);
                    document.getElementById('npcDialogue').textContent = `"${getNpcTalkLine(npcUiTarget)}"`;
                }
                fullRender();
            } else if (action === 'observe') {
                const npc = getWorldNpcById(npcUiTarget);
                if (npc) {
                    document.getElementById('npcDialogue').textContent = getWorldNpcObserveText(npc);
                    addLog(`👁️ You observe ${npc.name} — ${getWorldNpcStrengthLabel(npc)}.`);
                }
                fullRender();
            } else if (action === 'sect_recruit') {
                const npc = getWorldNpcById(npcUiTarget);
                if (npc && typeof recruitWorldNpcToSect === 'function') {
                    const result = recruitWorldNpcToSect(npc);
                    document.getElementById('npcDialogue').textContent = result.success
                        ? `"I swear myself to ${getSectDisplayName()}."`
                        : `"${result.message}"`;
                    if (result.message) addLog(result.success ? `🏯 ${result.message}` : `🏯 ${result.message}`);
                    if (result.success) closeNpcPopup();
                    renderNpcPopup();
                    fullRender();
                }
            } else if (action === 'sect_recruit_hint') {
                const npc = getWorldNpcById(npcUiTarget);
                const block = typeof getRecruitWorldNpcBlockReason === 'function'
                    ? getRecruitWorldNpcBlockReason(npc) : 'Not ready to recruit.';
                document.getElementById('npcDialogue').textContent = `"${block}"`;
            } else if (action === 'duel') {
                const npc = getWorldNpcById(npcUiTarget);
                if (npc && typeof startNpcDuelCombat === 'function') {
                    if (typeof timeCombatStart === 'function'
                        && timeCombatStart(`⚔️ You challenge ${npc.name} to a duel.`, `Dueling ${npc.name}`)) {
                        if (startNpcDuelCombat(npc)) fullRender();
                    }
                }
            } else if (action === 'demonic_fight') {
                const npc = getWorldNpcById(npcUiTarget);
                if (npc && typeof startNpcDemonicCombat === 'function') {
                    if (typeof timeCombatStart === 'function'
                        && timeCombatStart(`⚔️ You confront ${npc.name}.`, `Facing ${npc.name}`)) {
                        if (startNpcDemonicCombat(npc)) fullRender();
                    }
                }
            } else if (action === 'demonic_bargain') {
                const npc = getWorldNpcById(npcUiTarget);
                if (npc && typeof npcDemonicBargain === 'function') {
                    const result = npcDemonicBargain(npc);
                    if (result.message) {
                        document.getElementById('npcDialogue').textContent = `"${result.message}"`;
                        if (!result.success) addLog(`😈 ${result.message}`);
                    }
                    renderNpcPopup();
                    fullRender();
                }
            } else if (action === 'back') {
                npcUiMode = 'menu';
                npcUiActiveTest = null;
                renderNpcPopup();
            } else if (action === 'leave') {
                closeNpcPopup();
            } else if (action === 'quest_accept') {
                const result = typeof acceptLostDiscipleQuest === 'function' ? acceptLostDiscipleQuest() : { success: false };
                if (result.message) {
                    document.getElementById('npcDialogue').textContent = `"${result.message}"`;
                    if (!result.success) addLog(`🌸 ${result.message}`);
                    else addLog(`🌸 Wei Ling: "${result.message}"`);
                }
                renderNpcPopup();
                fullRender();
            } else if (action === 'quest_progress') {
                const arcId = npcUiTarget === 'wei_ling' ? 'lost_disciple'
                    : npcUiTarget === 'merchant_su' ? 'dustbone_caravan'
                        : npcUiTarget === 'liang_chen' ? 'liang_chen_rival' : null;
                if (arcId && typeof openStoryQuestDetail === 'function') openStoryQuestDetail(arcId);
                fullRender();
            } else if (action === 'caravan_accept') {
                const result = typeof acceptCaravanQuest === 'function' ? acceptCaravanQuest() : { success: false };
                if (result.message) {
                    document.getElementById('npcDialogue').textContent = `"${result.message}"`;
                    addLog(`🐫 ${result.message}`);
                }
                renderNpcPopup();
                fullRender();
            } else if (action === 'liang_accept') {
                const result = typeof acceptLiangChenQuest === 'function' ? acceptLiangChenQuest() : { success: false };
                if (result.message) {
                    document.getElementById('npcDialogue').textContent = `"${result.message}"`;
                    addLog(`⚔️ ${result.message}`);
                }
                renderNpcPopup();
                fullRender();
            } else if (action === 'liang_debate') {
                if (typeof openLiangDebatePopup === 'function') openLiangDebatePopup();
            } else if (action === 'liang_duel') {
                if (typeof startStoryArcCombat === 'function' && typeof timeCombatStart === 'function') {
                    if (timeCombatStart('⚔️ You face Liang Chen in open duel.', 'Dueling Liang Chen')) {
                        startStoryArcCombat('liang_chen_rival', 'liang_chen_duel');
                        fullRender();
                    }
                }
            } else if (action === 'observatory_quest') {
                const result = typeof acceptObservatoryShardQuest === 'function' ? acceptObservatoryShardQuest() : { success: false };
                if (result.message) document.getElementById('npcDialogue').textContent = `"${result.message}"`;
                renderNpcPopup();
                fullRender();
            } else if (action === 'observatory_return') {
                const result = typeof completeObservatoryReturn === 'function' ? completeObservatoryReturn() : { success: false };
                if (result.message) document.getElementById('npcDialogue').textContent = `"${result.message}"`;
                renderNpcPopup();
                fullRender();
            } else if (action === 'demonic_redeem') {
                const npc = getWorldNpcById(npcUiTarget);
                if (npc && typeof startDemonicRedemptionArc === 'function') startDemonicRedemptionArc(npc);
                renderNpcPopup();
                fullRender();
            } else if (action === 'wei_gift') {
                const result = typeof weiLingPostQuestGift === 'function' ? weiLingPostQuestGift() : { success: false };
                if (result.message) {
                    document.getElementById('npcDialogue').textContent = `"${result.message}"`;
                    addLog(`🌸 ${result.message}`);
                }
                renderNpcPopup();
                fullRender();
            } else if (action === 'wei_rival_duel') {
                addLog(`🌸 Wei Ling draws her blade. "You killed my master. The heavens will not absolve you."`);
                document.getElementById('npcDialogue').textContent = '"You killed my master. Draw your weapon!"';
                if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(-2, 'confronting Wei Ling\'s vengeance');
                fullRender();
            }
        };
    });
    document.querySelectorAll('[data-npc-test]').forEach(btn => {
        btn.onclick = function() {
            npcSubmitHuaTest(parseInt(this.dataset.npcTest, 10));
        };
    });
    document.querySelectorAll('[data-npc-buy]').forEach(row => {
        row.onclick = function() {
            const result = npcBuyItem(npcUiTarget, this.dataset.npcBuy);
            if (!result.success) addLog(`${getNpcDef(npcUiTarget)?.emoji || '🧳'} ${result.message}`);
            renderNpcPopup();
            fullRender();
        };
    });
}

function actionInteract() {
    if (actionBlocked()) return;
    const present = getPresentNpcEntries(currentZone);
    if (!present.length) {
        addLog('🧍 No one of note is here to speak with.');
        fullRender();
        return;
    }
    openNpcPopup();
}

function getNpcPresenceLabel(zoneId) {
    const cards = getPresentNpcCards(zoneId);
    if (!cards.length) return '';
    if (cards.length <= 2) return cards.map(c => `${c.emoji} ${c.name}`).join(' · ');
    return `${cards.length} people nearby`;
}

function getWeiWanderHint() {
    ensureNpcState();
    const wei = G.npcState.wei_collector;
    if (!wei?.wanderZone) return '';
    const zone = ZONES[wei.wanderZone];
    if (currentZone === 'heartlands' || currentZone === wei.wanderZone) return '';
    return `Wei wanders the ${zone?.name || wei.wanderZone}`;
}

if (typeof registerWorldEventHandler === 'function') {
    registerWorldEventHandler('wei_wander', executeWeiWanderMove);
}
