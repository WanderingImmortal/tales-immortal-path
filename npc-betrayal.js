// ============================================
// NPC-BETRAYAL.JS — Schemer ambush when player is weak
// ============================================

function ensureBetrayalNpcFields(npc) {
    if (!npc) return;
    if (!npc.converseFlags) npc.converseFlags = [];
    if (!npc.callbacksShown) npc.callbacksShown = [];
    if (npc.intent == null) npc.intent = null;
    if (npc.intentSinceMonth == null) npc.intentSinceMonth = null;
    if (npc.intentDetected == null) npc.intentDetected = false;
    if (npc.foreshadowLogged == null) npc.foreshadowLogged = false;
}

function addConverseFlag(npc, flag) {
    if (!flag || !npc) return;
    ensureBetrayalNpcFields(npc);
    if (npc.converseFlags.includes(flag)) return;
    npc.converseFlags.push(flag);
    const cap = 6;
    while (npc.converseFlags.length > cap) npc.converseFlags.shift();
}

function hasConverseFlag(npc, flag) {
    return !!(npc?.converseFlags?.includes(flag) || (flag === 'dueledPlayer' && npc?.dueledPlayer));
}

function applyConverseFlagsFromLine(npc, topicId, stance) {
    ensureBetrayalNpcFields(npc);
    npc.lastTopicUsed = topicId;
    const syn = getNpcPersonalitySynergy(npc);

    if (topicId === 'not_passing' && stance === 'pragmatic' && syn === 'schemer') {
        addConverseFlag(npc, 'schemer_hook');
    }
    if (topicId === 'names' && stance === 'pragmatic') {
        addConverseFlag(npc, 'business_tone');
        if (syn === 'schemer') addConverseFlag(npc, 'schemer_hook');
    }
    if (topicId === 'names' && stance === 'warm' && G.fame >= 20) {
        addConverseFlag(npc, 'boasted_fame');
    }
    if (topicId === 'not_passing' && stance === 'cold') {
        addConverseFlag(npc, 'threatened');
    }
    if (topicId === 'why_here' && stance === 'pragmatic' && syn === 'schemer') {
        addConverseFlag(npc, 'schemer_hook');
    }
}

function countPendingBetrayalNpcs() {
    return (G.worldNpcs || []).filter(n => n.alive && n.intent === 'pending').length;
}

function maybeSetupBetrayalIntent(npc, topicId, stance) {
    if (!hasWorldNpcRelationship(npc) || npc.intent === 'spent') return;
    if (npc.intent === 'pending') return;
    if (countPendingBetrayalNpcs() >= 1) return;

    ensureBetrayalNpcFields(npc);
    const b = NPC_BETRAYAL_BALANCE;
    const syn = getNpcPersonalitySynergy(npc);
    const imp = npc.impression || 0;
    const trust = npc.trust || 0;
    const gap = imp - trust;

    let setup = false;
    if (syn === 'schemer' && hasConverseFlag(npc, 'schemer_hook')
        && trust <= b.maxTrustForHook && imp >= b.minImpressionForHook && gap >= b.impressionTrustGapMin) {
        setup = true;
    }
    if (syn === 'grudge_keeper' && npc.dueledPlayer && imp <= 0) {
        setup = true;
    }

    if (setup) {
        npc.intent = 'pending';
        npc.intentSinceMonth = G.ageMonths || 0;
    }
}

function pickConverseCallback(npc, topicId) {
    ensureBetrayalNpcFields(npc);
    const syn = getNpcPersonalitySynergy(npc);
    const b = NPC_BETRAYAL_BALANCE;
    const pool = (NPC_CONVERSE_CALLBACKS || []).filter(cb => {
        if (cb.topicId !== topicId) return false;
        if (cb.requireFlag && !hasConverseFlag(npc, cb.requireFlag)) return false;
        if (cb.requireActivity && npc.activityId !== cb.requireActivity) return false;
        if (cb.minFame != null && (G.fame || 0) < cb.minFame) return false;
        if (cb.synergies?.length && !cb.synergies.includes(syn) && !cb.synergies.some(s => (npc.personalities || []).includes(s))) return false;
        if (cb.onceKey && npc.callbacksShown.includes(cb.onceKey)) return false;
        return true;
    });
    if (!pool.length) return null;
    const cb = pool[Math.floor(Math.random() * pool.length)];
    const chance = cb.chance ?? b.callbackBaseChance;
    if (Math.random() >= chance) return null;
    if (cb.onceKey) npc.callbacksShown.push(cb.onceKey);
    return fillConverseTemplate(cb.line, npc);
}

function getMisleadingNamesIntel(npc) {
    const syn = getNpcPersonalitySynergy(npc);
    const imp = npc.impression || 0;
    const trust = npc.trust || 0;
    const b = NPC_BETRAYAL_BALANCE;
    if (syn !== 'schemer' && syn !== 'silver_tongue') return null;
    if (imp - trust < b.trustIntelGapMin) return null;
    if (Math.random() >= b.misleadingIntelChance) return null;
    const zones = Object.keys(ZONES).filter(z => z !== npc.zone);
    const wrongZone = zones.length ? zones[Math.floor(Math.random() * zones.length)] : npc.zone;
    const events = ZONES[wrongZone]?.events || ['quiet roads'];
    const rumor = events[Math.floor(Math.random() * events.length)];
    return `"Word from ${ZONES[wrongZone]?.name || wrongZone}: ${rumor.toLowerCase()}," ${npc.name} says — too smoothly.`;
}

function markBetrayalIntentFromObserve(npc) {
    if (!npc) return;
    ensureBetrayalNpcFields(npc);
    const syn = getNpcPersonalitySynergy(npc);
    const gap = (npc.impression || 0) - (npc.trust || 0);
    if (npc.intent === 'pending' || (syn === 'schemer' && gap >= NPC_BETRAYAL_BALANCE.impressionTrustGapMin)) {
        npc.intentDetected = true;
    }
}

function isPlayerVulnerableForBetrayal() {
    if (!G.maxHp) return false;
    const b = NPC_BETRAYAL_BALANCE;
    const hpWeak = G.hp <= Math.max(1, Math.floor(G.maxHp * b.weakHpPct));
    const maxQi = typeof getMaxQi === 'function' ? getMaxQi() : G.qi;
    const qiWeak = maxQi > 0 && G.qi <= Math.floor(maxQi * b.weakQiPct);
    return hpWeak || qiWeak;
}

function getPendingBetrayalNpcInZone(zoneId) {
    zoneId = zoneId || (typeof getMainZoneId === 'function' ? getMainZoneId() : G.currentZone);
    const candidates = (G.worldNpcs || []).filter(n =>
        n.alive && n.intent === 'pending' && n.zone === zoneId && hasWorldNpcRelationship(n)
    );
    if (!candidates.length) return null;
    candidates.sort((a, b) => (a.intentSinceMonth || 0) - (b.intentSinceMonth || 0));
    return candidates[0];
}

function rollBetrayalAmbushChance(source) {
    const b = NPC_BETRAYAL_BALANCE;
    return source === 'explore' ? b.ambushChanceExplore : b.ambushChanceTravel;
}

function applyBetrayalFirstStrike(npc) {
    const b = NPC_BETRAYAL_BALANCE;
    const dmg = b.ambushFirstStrikeHpMin + Math.floor(Math.random() * (b.ambushFirstStrikeHpMax - b.ambushFirstStrikeHpMin + 1));
    G.hp = Math.max(1, G.hp - dmg);
    addLog(`🗡️ ${npc.name} strikes first from ambush! −${dmg} HP.`);
}

function spendBetrayalIntent(npc) {
    if (!npc) return;
    npc.intent = 'spent';
    G.pendingBetrayalAmbush = null;
}

function startBetrayalCombat(npc, applySurprise) {
    if (!npc?.alive || G.inCombat) return false;
    if (applySurprise) applyBetrayalFirstStrike(npc);
    spendBetrayalIntent(npc);
    if (typeof startNpcCombat === 'function') {
        return startNpcCombat(npc, 'rival');
    }
    return false;
}

function tryBetrayalTalkDown(npc) {
    const b = NPC_BETRAYAL_BALANCE;
    let chance = b.talkDownBaseChance;
    if ((npc.personalities || []).includes('charming')) chance += b.talkDownCharmingBonus;
    if (getNpcPersonalitySynergy(npc) === 'grudge_keeper') chance = 0.05;
    if (Math.random() < chance) {
        spendBetrayalIntent(npc);
        shiftWorldNpcImpression(npc, -8);
        addLog(`🧍 ${npc.name} hesitates, then melts back into the treeline. "Another time, ${G.name || 'cultivator'}."`);
        G.pendingBetrayalAmbush = null;
        fullRender();
        return true;
    }
    addLog(`🗡️ ${npc.name} laughs. "Too late for words."`);
    startBetrayalCombat(npc, false);
    fullRender();
    return false;
}

function showBetrayalAmbushChoice(npc) {
    G.pendingBetrayalAmbush = npc.uid;
    const detected = npc.intentDetected;
    let html = `🗡️ A figure you half-recognize steps from cover — <b>${escapeHtml(npc.name)}</b>.`;
    if (detected) {
        html += `<div class="road-encounter-actions">
            <button type="button" class="road-enc-btn" data-betrayal-brace="${npc.uid}">Brace for steel — you saw this coming</button>
            <button type="button" class="road-enc-btn" data-betrayal-talk="${npc.uid}">Try to talk them down</button>
        </div>`;
    } else {
        html += ` Steel flashes before you can react.`;
    }
    addLog({ html, cls: 'log-road-encounter log-betrayal-ambush' });
    if (!detected) {
        startBetrayalCombat(npc, true);
    } else {
        bindBetrayalAmbushEvents();
    }
}

function bindBetrayalAmbushEvents() {
    document.querySelectorAll('[data-betrayal-brace]').forEach(btn => {
        btn.onclick = function() {
            const npc = getWorldNpcByUid(this.dataset.betrayalBrace);
            if (!npc) return;
            addLog(`⚔️ You meet ${npc.name}'s ambush ready.`);
            startBetrayalCombat(npc, false);
            fullRender();
        };
    });
    document.querySelectorAll('[data-betrayal-talk]').forEach(btn => {
        btn.onclick = function() {
            const npc = getWorldNpcByUid(this.dataset.betrayalTalk);
            if (!npc) return;
            tryBetrayalTalkDown(npc);
        };
    });
}

function tryNpcBetrayalAmbush(source) {
    if (G.gameOver || G.inCombat || G.pendingBetrayalAmbush) return false;
    if (typeof isTribulationActive === 'function' && isTribulationActive()) return false;
    if (!isPlayerVulnerableForBetrayal()) return false;

    const zoneId = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    const npc = getPendingBetrayalNpcInZone(zoneId);
    if (!npc) return false;

    const b = NPC_BETRAYAL_BALANCE;
    const monthsSince = (G.ageMonths || 0) - (npc.intentSinceMonth || 0);
    if (monthsSince < b.minMonthsAfterHook) return false;

    if (!npc.foreshadowLogged && Math.random() < 0.45) {
        npc.foreshadowLogged = true;
        addLog(`👁️ Someone watches the road behind you — or perhaps you imagine it.`);
        return false;
    }

    if (Math.random() >= rollBetrayalAmbushChance(source)) return false;

    showBetrayalAmbushChoice(npc);
    return true;
}

/** Future Soul Search hook — reads trust/intent without implementing techniques. */
function getSoulSearchBetrayalReadout(npc) {
    if (!npc) return null;
    ensureBetrayalNpcFields(npc);
    return {
        trust: npc.trust || 0,
        intent: npc.intent,
        intentDetected: npc.intentDetected,
        converseFlags: (npc.converseFlags || []).slice()
    };
}
