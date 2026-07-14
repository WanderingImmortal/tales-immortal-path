// ============================================
// NPC-CONVERSE.JS — Jianghu topic talk (world NPCs)
// ============================================

function hasWorldNpcRelationship(npc) {
    return !!npc && npc.alive && !npc.isDemonicTalent;
}

function ensureWorldNpcRelationship(npc) {
    if (!hasWorldNpcRelationship(npc)) return;
    if (npc.impression == null) npc.impression = 0;
    if (npc.trust == null) npc.trust = 0;
}

function ensureAllWorldNpcRelationships() {
    (G.worldNpcs || []).forEach(n => {
        if (n.alive) ensureWorldNpcRelationship(n);
    });
}

function getNpcPersonalitySynergy(npc) {
    ensureNpcPersonalities(npc);
    const p = npc.personalities || [];
    if (p.length < 2) return p[0] || 'default';
    const sorted = [p[0], p[1]].sort();
    const key = `${sorted[0]}_${sorted[1]}`;
    const map = {
        ambitious_cunning: 'schemer',
        charming_cunning: 'silver_tongue',
        honorable_cunning: 'reluctant_dealer',
        proud_vengeful: 'grudge_keeper',
        cowardly_merciful: 'soft_survivor',
        honorable_zealous: 'righteous',
        ambitious_proud: 'schemer',
        ambitious_vengeful: 'grudge_keeper'
    };
    return map[key] || p[0] || 'default';
}

function clampNpcImpression(val) {
    const b = NPC_CONVERSE_BALANCE;
    return clamp(val, b.impressionMin, b.impressionMax);
}

function clampNpcTrust(val) {
    const b = NPC_CONVERSE_BALANCE;
    return clamp(val, b.trustMin, b.trustMax);
}

function getWorldNpcImpressionLabel(npc) {
    ensureWorldNpcRelationship(npc);
    const v = npc.impression || 0;
    if (v >= 25) return 'Warm';
    if (v >= 5) return 'Friendly';
    if (v >= -4) return 'Neutral';
    if (v >= -24) return 'Cool';
    return 'Wary';
}

function getWorldNpcTrustObserveHint(npc) {
    ensureWorldNpcRelationship(npc);
    const syn = getNpcPersonalitySynergy(npc);
    const imp = npc.impression || 0;
    const trust = npc.trust || 0;
    const gap = imp - trust;
    if (syn === 'schemer' && gap >= 8) {
        return ' They speak warmly, but something in their bearing does not match.';
    }
    if (syn === 'silver_tongue' && gap >= 6) {
        return ' Their smile comes easily — perhaps too easily.';
    }
    if (trust >= 20 && imp >= 15) {
        return ' They seem sincere enough for the jianghu.';
    }
    if (trust <= -15) {
        return ' Their eyes track you like a drawn blade.';
    }
    return '';
}

function getPersonalityDecayMult(npc, field) {
    ensureNpcPersonalities(npc);
    const ids = npc.personalities || [];
    let mult = 1;
    if (field === 'impression') {
        if (ids.includes('loyal') || ids.includes('sorrowful')) mult *= 0.65;
        if (ids.includes('charming') || ids.includes('cunning')) mult *= 1.25;
        if (ids.includes('vengeful') && (npc.impression || 0) < 0) mult *= 0.55;
    }
    if (field === 'trust') {
        if (ids.includes('loyal')) mult *= 0.7;
        if (ids.includes('cunning')) mult *= 1.2;
        if (ids.includes('vengeful') && (npc.trust || 0) < 0) mult *= 0.5;
    }
    return mult;
}

function driftTowardZero(value, amount) {
    if (value > 0) return Math.max(0, value - amount);
    if (value < 0) return Math.min(0, value + amount);
    return 0;
}

function tickWorldNpcRelationships(monthsPassed) {
    if (!G.worldNpcs?.length || monthsPassed <= 0) return;
    const b = NPC_CONVERSE_BALANCE;
    G.worldNpcs.forEach(npc => {
        if (!hasWorldNpcRelationship(npc)) return;
        if (npc.lastTalkMonths == null && npc.metAtMonth == null && (npc.talkCount || 0) < 1) return;
        const last = npc.lastTalkMonths ?? npc.metAtMonth ?? G.ageMonths;
        if (G.ageMonths <= last) return;
        const impDrift = b.impressionDecayPerMonth * monthsPassed * getPersonalityDecayMult(npc, 'impression');
        const trustDrift = b.trustDecayPerMonth * monthsPassed * getPersonalityDecayMult(npc, 'trust');
        npc.impression = clampNpcImpression(driftTowardZero(npc.impression || 0, impDrift));
        npc.trust = clampNpcTrust(driftTowardZero(npc.trust || 0, trustDrift));
    });
}

function getSynergyMods(npc) {
    const syn = getNpcPersonalitySynergy(npc);
    return NPC_CONVERSE_SYNERGY_MODS[syn] || { impressionGain: 1, trustGain: 1, warmTrust: 1 };
}

function shiftWorldNpcImpression(npc, delta) {
    ensureWorldNpcRelationship(npc);
    const mods = getSynergyMods(npc);
    let d = delta;
    if (delta > 0) d = Math.round(delta * (mods.impressionGain || 1));
    else if (delta < 0 && mods.coldImpression) d += mods.coldImpression;
    npc.impression = clampNpcImpression((npc.impression || 0) + d);
}

function shiftWorldNpcTrust(npc, delta, stance) {
    ensureWorldNpcRelationship(npc);
    const mods = getSynergyMods(npc);
    let d = delta;
    if (delta > 0) {
        d = Math.round(delta * (mods.trustGain || 1));
        if (stance === 'warm') d = Math.round(d * (mods.warmTrust || 1));
        if (stance === 'pragmatic') d = Math.round(d * (mods.pragmaticTrust || 1));
    }
    npc.trust = clampNpcTrust((npc.trust || 0) + d);
}

function getWorldNpcConverseDepth(npc) {
    return npc.metAtMonth != null ? 'full' : 'light';
}

function getConverseTopicsForNpc(npc) {
    const depth = getWorldNpcConverseDepth(npc);
    const max = depth === 'full' ? NPC_CONVERSE_TOPICS.length : NPC_CONVERSE_BALANCE.lightTopicCount;
    return NPC_CONVERSE_TOPICS.slice(0, max);
}

function resetNpcConverseSession(npc) {
    if (!npc) return;
    G.npcConverseSession = {
        uid: npc.uid,
        topicsUsed: [],
        timeCharged: false
    };
}

function getNpcConverseSession(npc) {
    if (!G.npcConverseSession || G.npcConverseSession.uid !== npc.uid) {
        resetNpcConverseSession(npc);
    }
    return G.npcConverseSession;
}

function fillConverseTemplate(text, npc) {
    const zoneName = ZONES[npc.zone]?.name || npc.zone;
    const dest = typeof getLocationName === 'function' ? getLocationName(npc.destinationLocationId) : 'the crossroads';
    let fameNote = 'no one of note';
    if (G.fame >= 60) fameNote = G.name;
    else if (G.fame >= 20) fameNote = 'a rising name';
    else if (G.fame >= 5) fameNote = 'a minor cultivator';
    return String(text || '')
        .replace(/\{name\}/g, G.name || 'traveler')
        .replace(/\{npc\}/g, npc.name || 'stranger')
        .replace(/\{zone\}/g, zoneName)
        .replace(/\{beat\}/g, npc.recentBeat || 'the road keeps no ledger')
        .replace(/\{destination\}/g, dest)
        .replace(/\{fame\}/g, fameNote);
}

function buildConverseTopicOpening(npc, topicId) {
    const syn = getNpcPersonalitySynergy(npc);
    const beat = npc.recentBeat || generateRecentBeat(npc);
    const zoneName = ZONES[npc.zone]?.name || npc.zone;

    if (topicId === 'why_here') {
        if (syn === 'schemer') {
            return `"Opportunity dried up," ${npc.name} says. "${beat} — and I need the right ally."`;
        }
        if (syn === 'soft_survivor') {
            return `"${beat}," they admit quietly. "I am trying not to make it worse."`;
        }
        return `"${beat}," ${npc.name} says. "The ${zoneName} road offers little else today."`;
    }
    if (topicId === 'not_passing') {
        if (syn === 'grudge_keeper') {
            return `${npc.name} holds your gaze. "Passing through is what people say before they take something."`;
        }
        if (syn === 'silver_tongue') {
            return `"Perceptive," ${npc.name} smiles. "The jianghu teaches you to stand where fortune might pass."`;
        }
        const primary = getPersonalityDef(npc.personalities?.[0]);
        const trait = primary?.label?.toLowerCase() || 'careful';
        return `${npc.name} pauses. "You read people well. I seem ${trait} — is that what you wanted to know?"`;
    }
    if (topicId === 'names') {
        if (typeof getLatestKillInZone === 'function') {
            const victim = getLatestKillInZone(npc.zone);
            if (victim && (npc.personalities || []).includes('vengeful')) {
                return `"${victim.name} — people still whisper about that blood," ${npc.name} murmurs.`;
            }
        }
        if (G.fame >= 30) {
            return `"${G.name} travels these roads lately," ${npc.name} says. "That is a name worth remembering."`;
        }
        const event = ZONES[npc.zone]?.events;
        const rumor = event?.length ? event[Math.floor(Math.random() * event.length)] : 'trouble on the western trail';
        return `"Keep an ear out for ${rumor.toLowerCase()}," ${npc.name} offers. "Beyond that — choose your company carefully."`;
    }
    return `${npc.name} considers your question in silence.`;
}

function buildConverseNpcReply(npc, topicId, stance) {
    const syn = getNpcPersonalitySynergy(npc);
    const mood = getWorldNpcAlignmentMood(npc);

    const replies = {
        why_here: {
            warm: {
                default: '"Honest words. The road is cruel enough without pretense."',
                schemer: '"Good — honesty is rare. Perhaps we can help each other, then."',
                soft_survivor: '"Thank you. Most pass without a glance."'
            },
            pragmatic: {
                default: '"Toward something, as it happens. Coin, safety, a sect that still pays."',
                schemer: '"Finally — someone who speaks plainly. There may be profit in that."',
                reluctant_dealer: '"Fair question. I weigh risk against reward. Today, I am still weighing."'
            },
            cold: {
                default: '"Brief, then. I owe you nothing."',
                grudge_keeper: '"Watch your tone. I remember slights."',
                righteous: mood === 'dissonant' || mood === 'rebellious'
                    ? '"Your qi carries dissonance. I will not linger with you."'
                    : '"Then do not waste mine."'
            }
        },
        not_passing: {
            probe: {
                default: '"Waiting? Perhaps. Or perhaps I am exactly where I mean to be."',
                schemer: '"Sharp eyes. I was hoping someone worth talking to would stop."',
                grudge_keeper: '"Ask again like that and you will get a different answer."'
            },
            firm: {
                default: `${npc.name} inclines their head. "Noted. I will keep my distance."`,
                proud: '"Measuring me? Ensure you measure yourself first."',
                silver_tongue: '"No offense taken — the jianghu makes us all cautious."'
            },
            cold: {
                default: '"Then I will walk on. No fight — yet."',
                cowardly: '"Good. Good. I want no trouble either."'
            }
        },
        names: {
            warm: {
                default: `"Trade, then. I hear ${G.name || 'your name'} travels with ${G.fame >= 20 ? 'some' : 'little'} fame."`,
                silver_tongue: '"A name for a name — I like how you think."'
            },
            pragmatic: {
                default: '"Gossip pays when someone backs it with stones or steel."',
                schemer: '"Everything has a price. Even mine."'
            },
            cold: {
                default: '"Wise. Names draw blades in the {zone}."',
                secretive: '"Mine stays unspoken. Yours should too."'
            }
        }
    };

    const topicReplies = replies[topicId] || {};
    const stanceReplies = topicReplies[stance] || topicReplies.pragmatic || topicReplies.warm || {};
    let line = stanceReplies[syn] || stanceReplies[npc.personalities?.[0]] || stanceReplies.default
        || '"..."';
    return fillConverseTemplate(line, npc);
}

function pickWorldNpcRemeetGreet(npc) {
    if ((npc.talkCount || 0) < 1) return '';
    const monthsAgo = (G.ageMonths || 0) - (npc.metAtMonth || 0);
    const imp = npc.impression || 0;
    let pool;
    if (imp >= 20) pool = NPC_CONVERSE_REMEET_GREETS.warm;
    else if (imp <= -20) pool = NPC_CONVERSE_REMEET_GREETS.wary;
    else if (imp <= -5) pool = NPC_CONVERSE_REMEET_GREETS.cool;
    else if (monthsAgo > 24) pool = NPC_CONVERSE_REMEET_GREETS.seasons;
    else if (monthsAgo > 6) pool = NPC_CONVERSE_REMEET_GREETS.months;
    else pool = NPC_CONVERSE_REMEET_GREETS.recent;
    if (!pool?.length) return '';
    return pool[Math.floor(Math.random() * pool.length)];
}

function getWorldNpcRemeetLine(npc) {
    if (!npc || (npc.talkCount || 0) < 1) return '';
    const line = pickWorldNpcRemeetGreet(npc);
    if (line) return line;
    if (npc.metAtZone) {
        const zoneName = ZONES[npc.metAtZone]?.name || npc.metAtZone;
        return `We've met before — on the road near ${zoneName}.`;
    }
    return "We've spoken before.";
}

function chargeConverseTimeIfNeeded(npc) {
    const session = getNpcConverseSession(npc);
    if (session.timeCharged) return true;
    const months = ACTION_MONTHS.npcConverse || NPC_CONVERSE_BALANCE.monthsCost;
    beginActionLog();
    if (!advanceTime(months, `Speaking with ${npc.name}`)) {
        cancelActionLog();
        return false;
    }
    commitActionLog(`💬 You speak with ${npc.name} on the road.`);
    session.timeCharged = true;
    return true;
}

function commitConversePlayerLine(npc, topicId, lineIdx) {
    const lines = NPC_CONVERSE_PLAYER_LINES[topicId];
    const entry = lines?.[lineIdx];
    if (!entry) return { ok: false };

    if (!chargeConverseTimeIfNeeded(npc)) {
        return { ok: false, dead: true };
    }

    const session = getNpcConverseSession(npc);
    if (!session.topicsUsed.includes(topicId)) session.topicsUsed.push(topicId);

    const impBase = NPC_CONVERSE_IMPRESSION_DELTAS[entry.stance] ?? 0;
    const trustBase = NPC_CONVERSE_TRUST_DELTAS[entry.stance] ?? 0;
    shiftWorldNpcImpression(npc, impBase);
    shiftWorldNpcTrust(npc, trustBase, entry.stance);

    npc.talkCount = (npc.talkCount || 0) + 1;
    npc.lastTalkMonths = G.ageMonths || 0;
    npc.met = true;
    if (typeof recordMilestone === 'function') recordMilestone('met_npc');

    const playerLine = entry.line;
    const npcReply = buildConverseNpcReply(npc, topicId, entry.stance);
    const roleEmoji = NPC_ROLES[npc.role]?.emoji || '🧍';

    addLog(`🧍 You: "${playerLine}"`);
    addLog(`${roleEmoji} ${npc.name}: ${npcReply}`);

    return { ok: true, playerLine, npcReply };
}

function recordWorldNpcDuelImpression(npc, playerWon) {
    if (!hasWorldNpcRelationship(npc)) return;
    npc.dueledPlayer = true;
    if (playerWon) {
        shiftWorldNpcImpression(npc, -20);
        shiftWorldNpcTrust(npc, -25, 'cold');
    } else {
        shiftWorldNpcImpression(npc, 5);
        shiftWorldNpcTrust(npc, -5, 'firm');
    }
}

function canWorldNpcConverse(npc) {
    return hasWorldNpcRelationship(npc) && npc.alive;
}
