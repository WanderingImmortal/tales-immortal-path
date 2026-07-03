// ============================================
// QUESTS.JS — NPC quest log & world NPC combat
// ============================================

function ensureNpcQuestState() {
    if (!G.npcQuests) G.npcQuests = [];
    if (!G.npcKillLog) G.npcKillLog = [];
    if (G.npcCombat === undefined) G.npcCombat = null;
}

function recordWorldNpcKill(npc, reason) {
    ensureNpcQuestState();
    G.npcKillLog.push({
        uid: npc.uid,
        name: npc.name,
        role: npc.role,
        zone: npc.zone,
        reason: reason || 'unknown',
        months: G.ageMonths || 0
    });
    if (G.npcKillLog.length > 30) G.npcKillLog.shift();
    if (reason === 'combat' && !npc.isDemonicTalent && npc.role !== 'rival' && typeof shiftSectReputation === 'function') {
        shiftSectReputation('kill_world_npc');
    }
}

function getPlayerNpcKillCount() {
    ensureNpcQuestState();
    return G.npcKillLog.length;
}

function getKillsInZone(zoneId) {
    ensureNpcQuestState();
    return G.npcKillLog.filter(k => k.zone === zoneId);
}

function getLatestKillInZone(zoneId) {
    const kills = getKillsInZone(zoneId);
    return kills.length ? kills[kills.length - 1] : null;
}

function findNpcQuest(predicate) {
    ensureNpcQuestState();
    return G.npcQuests.find(predicate);
}

function addNpcQuest(templateKey, giverRef) {
    ensureNpcQuestState();
    const tpl = NPC_QUEST_TEMPLATES[templateKey];
    if (!tpl) return null;
    const giverUid = giverRef.uid || null;
    const giverId = giverRef.storyId || null;
    const existing = findNpcQuest(q =>
        q.type === tpl.type && q.status === 'active'
        && ((giverUid && q.giverUid === giverUid) || (giverId && q.giverId === giverId))
    );
    if (existing) return existing;

    const quest = {
        id: `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        type: tpl.type,
        title: tpl.title,
        objective: tpl.objective,
        status: 'active',
        giverUid,
        giverId,
        giverName: giverRef.name || 'Unknown',
        zoneHint: giverRef.zone || currentZone,
        startedMonths: G.ageMonths || 0
    };
    G.npcQuests.push(quest);
    addLog(`📜 New quest: ${quest.title} — ${quest.objective}`);
    return quest;
}

function completeNpcQuestByGiver(giverRef, type) {
    ensureNpcQuestState();
    const q = findNpcQuest(quest =>
        quest.status === 'active' && quest.type === type
        && ((giverRef.uid && quest.giverUid === giverRef.uid) || (giverRef.storyId && quest.giverId === giverRef.storyId))
    );
    if (!q) return null;
    q.status = 'complete';
    q.completedMonths = G.ageMonths || 0;
    addLog(`✓ Quest complete: ${q.title}`);
    return q;
}

function failNpcQuestByGiver(giverRef, type) {
    ensureNpcQuestState();
    const q = findNpcQuest(quest =>
        quest.status === 'active' && quest.type === type
        && ((giverRef.uid && quest.giverUid === giverRef.uid) || (giverRef.storyId && quest.giverId === giverRef.storyId))
    );
    if (!q) return null;
    q.status = 'failed';
    return q;
}

function getActiveNpcQuests() {
    ensureNpcQuestState();
    return G.npcQuests.filter(q => q.status === 'active');
}

function getRecentNpcQuests(limit) {
    ensureNpcQuestState();
    limit = limit || 6;
    const active = G.npcQuests.filter(q => q.status === 'active');
    const done = G.npcQuests.filter(q => q.status !== 'active')
        .sort((a, b) => (b.completedMonths || b.startedMonths) - (a.completedMonths || a.startedMonths));
    return [...active, ...done].slice(0, limit);
}

function maybeOfferNpcQuests(npc) {
    if (!npc?.alive) return;
    const role = NPC_ROLES[npc.role] || NPC_ROLES.wanderer;
    if (role.cultivator === false) return;

    if (npc.role === 'rival' || getWorldNpcBehaviorWeight(npc, 'duelWeight') >= 1.3) {
        addNpcQuest('rival_duel', { uid: npc.uid, name: npc.name, zone: npc.zone });
    }
    if (npc.isDemonicTalent && (npc.demonicMet || npc.met)) {
        addNpcQuest('demonic_confront', { uid: npc.uid, name: npc.name, zone: npc.zone });
    }
}

function syncStoryNpcQuests() {
    if (typeof isElderHuaUnlocked !== 'function' || !isElderHuaUnlocked()) return;
    if (typeof getNextHuaTest !== 'function' || !getNextHuaTest()) return;
    const def = NPCS.elder_hua;
    addNpcQuest('hua_guidance', { storyId: 'elder_hua', name: def.name, zone: def.homeZone });
}

function shouldOfferNpcDuel(npc) {
    if (!npc?.alive) return false;
    const role = NPC_ROLES[npc.role] || NPC_ROLES.wanderer;
    if (role.cultivator === false) return false;
    if (npc.isDemonicTalent) return false;
    if (npc.role === 'rival') return true;
    const duelWeight = getWorldNpcBehaviorWeight(npc, 'duelWeight');
    if (duelWeight < NPC_COMBAT_BALANCE.duelMinBehaviorWeight) return false;
    return npc.realmIdx >= G.realmIdx - 1;
}

function shouldShowDemonicConfrontation(npc) {
    if (!npc?.alive || !npc.isDemonicTalent || npc.demonicAllied) return false;
    if (!npc.demonicMet && !npc.met) return false;
    const minThreat = NPC_ECOSYSTEM.demonicConfrontThreatMin || 8;
    return (npc.demonicThreat || 0) >= minThreat || (npc.talkCount || 0) >= 2;
}

function pickNpcCombatTemplate(realmIdx) {
    const idx = clamp(realmIdx, 0, ENEMIES.length - 1);
    const eligible = ENEMIES.filter(e => (e.minRealm || 0) <= realmIdx);
    return eligible.length ? eligible[eligible.length - 1] : ENEMIES[idx];
}

function calcNpcRealmBaselineStats(realmIdx, template) {
    const cap = typeof getMaxCultivationRealmIdx === 'function' ? getMaxCultivationRealmIdx() : 6;
    const r = clamp(realmIdx, 0, cap);
    const hp = template.hp + r * 22 + Math.floor(template.hp * r * 0.12);
    const dmg = template.dmg + r * 3 + Math.floor(template.dmg * r * 0.06);
    return { hp, dmg };
}

function calcNpcCombatStats(npc, type) {
    const b = NPC_COMBAT_BALANCE;
    const realmCap = typeof getMaxCultivationRealmIdx === 'function' ? getMaxCultivationRealmIdx() : 6;
    const effectiveRealm = clamp(npc.realmIdx, 0, realmCap);
    const template = pickNpcCombatTemplate(effectiveRealm);
    let { hp, dmg } = calcNpcRealmBaselineStats(effectiveRealm, template);

    if (type === 'rival') {
        hp = Math.floor(hp * b.rivalHpMult);
        dmg = Math.floor(dmg * b.rivalDmgMult);
    } else if (type === 'demonic') {
        const threatCap = typeof getWorldNpcThreatCap === 'function' ? getWorldNpcThreatCap() : (NPC_ECOSYSTEM.demonicThreatCap ?? 24);
        const threat = Math.min(npc.demonicThreat || 0, threatCap);
        const tNorm = threatCap > 0 ? threat / threatCap : 0;
        const hpMult = b.demonicHpMultBase + tNorm * ((b.demonicThreatHpMax || 1.45) - b.demonicHpMultBase);
        const dmgMult = b.demonicDmgMultBase + tNorm * ((b.demonicThreatDmgMax || 1.28) - b.demonicDmgMultBase);
        hp = Math.floor(hp * hpMult);
        dmg = Math.floor(dmg * dmgMult);
    }

    const typicalHit = typeof estimateTypicalHitDamage === 'function' ? estimateTypicalHitDamage() : 20;
    const maxHits = type === 'demonic' ? (b.demonicMaxHitsToKill || 9) : (b.npcMaxHitsToKill || 7);
    hp = Math.min(hp, Math.max(typicalHit * 4, typicalHit * maxHits));
    const pct = type === 'demonic' ? (b.demonicMaxHpPctPerHit || 0.11) : (b.npcMaxHpPctPerHit || 0.10);
    dmg = Math.min(dmg, Math.max(4, Math.floor(G.maxHp * pct)));

    return { hp, dmg, template };
}

function startNpcCombat(npc, type) {
    if (!npc?.alive || G.inCombat) return false;
    ensureNpcQuestState();
    const stats = calcNpcCombatStats(npc, type);
    const suffix = type === 'demonic' ? '(Demonic Talent)' : '(Rival)';
    const label = `${npc.name} ${suffix}`;

    G.npcCombat = { uid: npc.uid, type };
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
        isNpcCombat: true,
        npcUid: npc.uid,
        npcCombatType: type
    };
    G.enemyMaxHp = G.enemy.maxHp;

    addCombatLog(`⚔️ ${label} enters combat! (${stats.hp} HP)`);
    setupCombatActions();
    G.combatPhase = 'player';
    clearCombatTurnTimer();
    setCombatInputEnabled(true);
    updateCombatUI();
    document.getElementById('combatOverlay')?.classList.add('active');
    closeNpcPopup();
    return true;
}

function startNpcDuelCombat(npc) {
    return startNpcCombat(npc, 'rival');
}

function startNpcDemonicCombat(npc) {
    return startNpcCombat(npc, 'demonic');
}

function isNpcCombat() {
    return !!(G.npcCombat && G.inCombat);
}

function npcDemonicBargain(npc) {
    if (!npc?.alive || !npc.isDemonicTalent || npc.demonicAllied) return { success: false, message: 'No bargain to strike.' };
    const b = NPC_COMBAT_BALANCE;
    const minWill = (NPC_ECOSYSTEM.demonicBargainMinWill || 12)
        - (typeof getSectDoctrineDef === 'function' && getSectDoctrineDef()?.intimidateWillReduction
            ? getSectDoctrineDef().intimidateWillReduction : 0)
        - (typeof getSectReputationTier === 'function' && getSectReputationTier().id === 'feared' ? 1 : 0);
    if (G.will < minWill) {
        return { success: false, message: `Your will (${G.will}) is too weak to bargain with a Demonic Talent (need ${minWill}).` };
    }
    if (G.stones < b.demonicBargainStones) {
        return { success: false, message: `They demand ${b.demonicBargainStones} Stones as proof of commitment.` };
    }
    G.stones -= b.demonicBargainStones;
    npc.demonicAllied = true;
    npc.demonicThreat = Math.max(0, (npc.demonicThreat || 0) - b.demonicBargainThreatDrop);
    if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(b.demonicBargainAlignment);
    else G.daoAlignment = clamp((G.daoAlignment || 0) + b.demonicBargainAlignment, -100, 100);
    completeNpcQuestByGiver({ uid: npc.uid }, 'demonic_confront');
    if (typeof shiftSectReputation === 'function') shiftSectReputation('demonic_bargain');
    addLog(`🤝 Dark bargain struck with ${npc.name}. −${b.demonicBargainStones} Stones, Dao alignment shifts.`);
    return { success: true, message: `"We understand each other now," ${npc.name} murmurs. "The heavens can wait."` };
}

function npcCombatVictory(fromTechnique) {
    ensureNpcQuestState();
    const ctx = G.npcCombat;
    if (!ctx) return;
    const npc = getWorldNpcByUid(ctx.uid);
    const b = NPC_COMBAT_BALANCE;
    const enemyName = G.enemy?.name || 'Opponent';
    const rewardLines = [];

    addCombatLog(`💀 ${enemyName} is ${fromTechnique ? 'obliterated' : 'slain'}!`);

    if (ctx.type === 'sect_rival') {
        if (typeof sectRivalDuelVictory === 'function') sectRivalDuelVictory();
        addCombatLog(`🏆 Rival champion defeated!`);
        rewardLines.push('🏯 Sect renown and stones gained');
    } else if (npc) {
        if (ctx.type === 'rival') {
            killWorldNpc(npc, 'combat');
            completeNpcQuestByGiver({ uid: npc.uid }, 'rival_duel');
            const fame = typeof addFame === 'function' ? addFame(b.rivalVictoryFame) : (G.fame += b.rivalVictoryFame, b.rivalVictoryFame);
            G.foundation += b.rivalVictoryFoundation;
            addCombatLog(`🏆 Rival defeated! +${fame} Fame, +${b.rivalVictoryFoundation} Foundation`);
            addLog(`⚔️ You defeated ${npc.name} in a formal duel. The jianghu takes note.`);
            rewardLines.push(`⭐ +${fame} Fame`, `🏛️ +${b.rivalVictoryFoundation} Foundation`);
            if (typeof shiftSectReputation === 'function') shiftSectReputation('duel_victory_npc');
        } else if (ctx.type === 'demonic') {
            killWorldNpc(npc, 'combat');
            completeNpcQuestByGiver({ uid: npc.uid }, 'demonic_confront');
            const fame = typeof addFame === 'function' ? addFame(b.demonicVictoryFame) : (G.fame += b.demonicVictoryFame, b.demonicVictoryFame);
            G.foundation += b.demonicVictoryFoundation;
            if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(b.demonicVictoryAlignment);
            else G.daoAlignment = clamp((G.daoAlignment || 0) + b.demonicVictoryAlignment, -100, 100);
            addCombatLog(`😈 Demonic Talent slain! +${fame} Fame — heaven takes note.`);
            addLog(`😈 ${npc.name} falls. The heavens shudder at your choice.`);
            rewardLines.push(`⭐ +${fame} Fame`, `🏛️ +${b.demonicVictoryFoundation} Foundation`, `☯️ ${b.demonicVictoryAlignment} Dao alignment`);
            if (typeof shiftSectReputation === 'function') shiftSectReputation('demonic_kill');
        }
    }

    G.inCombat = false;
    G.defending = false;
    G.npcCombat = null;
    if (typeof clearCombatTurnTimer === 'function') clearCombatTurnTimer();
    document.getElementById('combatOverlay')?.classList.remove('active');
    G.enemy = null;
    if (G.path === 'qi' || G.path === 'soul') {
        G.shield = Math.max(G.shield, Math.floor(G.maxShield * 0.5));
    }
    if (typeof showCombatVictoryPopup === 'function' && rewardLines.length) {
        showCombatVictoryPopup({
            enemyName,
            subtitle: ctx.type === 'demonic' ? 'The heavens-defying prodigy has fallen.' : 'Your rival acknowledges defeat.',
            rewards: rewardLines
        });
    }
    fullRender();
}

function npcCombatDefeat() {
    ensureNpcQuestState();
    const ctx = G.npcCombat;
    const npc = ctx ? getWorldNpcByUid(ctx.uid) : null;
    G.hp = Math.max(1, Math.floor(G.maxHp * 0.15));
    G.npcCombat = null;
    if (typeof clearCombatTurnTimer === 'function') clearCombatTurnTimer();
    document.getElementById('combatOverlay')?.classList.remove('active');
    G.inCombat = false;
    G.defending = false;
    G.enemy = null;
    if (npc) {
        if (ctx.type === 'demonic') npc.demonicThreat = (npc.demonicThreat || 0) + 5;
        addLog(`⚔️ ${npc.name} breaks your guard. You crawl away, barely alive.`);
    } else if (ctx?.type === 'sect_rival') {
        addLog(`⚔️ The rival champion shames your sect. You retreat, wounded.`);
    } else {
        addLog(`⚔️ Defeated in personal combat. You retreat, wounded.`);
    }
    fullRender();
}

function npcCombatFleeSuccess() {
    ensureNpcQuestState();
    const ctx = G.npcCombat;
    const npc = ctx ? getWorldNpcByUid(ctx.uid) : null;
    const penalty = NPC_COMBAT_BALANCE.fleeFamePenalty;
    G.fame = Math.max(0, G.fame - penalty);
    G.npcCombat = null;
    G.inCombat = false;
    G.defending = false;
    if (typeof clearCombatTurnTimer === 'function') clearCombatTurnTimer();
    document.getElementById('combatOverlay')?.classList.remove('active');
    G.enemy = null;
    addCombatLog(`🏃 You flee the duel — fame suffers (−${penalty}).`);
    if (ctx?.type === 'rival' || ctx?.type === 'sect_rival') {
        if (typeof shiftSectReputation === 'function') shiftSectReputation('flee_duel');
    }
    if (npc && ctx?.type === 'rival') {
        addLog(`⚔️ ${npc.name} sneers as you withdraw.`);
    } else if (ctx?.type === 'sect_rival') {
        addLog(`⚔️ The rival sect's champion watches you flee — your sect's reputation suffers.`);
    }
    fullRender();
}

function focusNpcQuest(questId) {
    const q = G.npcQuests?.find(x => x.id === questId);
    if (q) {
        if (q.storyArcId && typeof openStoryQuestDetail === 'function') {
            openStoryQuestDetail(q.storyArcId);
        } else if (typeof openNpcQuestDetail === 'function') {
            openNpcQuestDetail(q);
        } else {
            focusQuestEntry(q);
        }
        return;
    }
    if (typeof focusStoryQuest === 'function') focusStoryQuest(questId);
}

function getStoryArcHint(arcId) {
    const def = STORY_ARCS[arcId];
    const state = getStoryArcState(arcId);
    if (!def || !state || state.status !== 'active') return '';
    const stage = def.stages[state.stage];
    if (!stage) return '';
    if (stage.hint) return stage.hint;

    const zoneId = stage.zoneHint || def.startZone;
    const zoneName = zoneId ? (ZONES[zoneId]?.name || zoneId) : 'the jianghu';
    const inZone = zoneId && currentZone === zoneId;

    switch (stage.key) {
        case 'hook':
            if (inZone && def.giverId && typeof isStoryNpcPresent === 'function' && isStoryNpcPresent(def.giverId, currentZone)) {
                return `Talk to ${def.giverName} in this zone (NPC panel or map) and accept the quest.`;
            }
            return zoneId
                ? `Travel to ${zoneName} (Map → Travel), then find and speak with ${def.giverName}.`
                : `Find ${def.giverName} and speak with them to begin.`;
        case 'investigation': {
            const need = stage.cluesRequired || 2;
            const have = (state.clues || []).length;
            if (have >= need) return `You have enough clues — check the quest log for the next stage.`;
            return inZone
                ? `Use Explore in ${zoneName} (${have}/${need} clues). Clues drop randomly while exploring.`
                : `Travel to ${zoneName}, then Explore repeatedly to gather clues (${have}/${need}).`;
        }
        case 'escort':
            return inZone
                ? `You are in ${zoneName}. Use Map → Travel to reach the destination zone if escorting.`
                : `Travel toward ${zoneName} using the Map. Stay in the quest zone to progress.`;
        case 'delve':
            if (stage.forbiddenId) {
                return `Open Forbidden Grounds, enter ${stage.forbiddenId.replace(/_/g, ' ')}, and clear the trial inside.`;
            }
            if (stage.bossId) return `Explore ${zoneName} or speak with ${def.giverName || 'your contact'} to trigger the duel.`;
            return `Complete the delve in ${zoneName}.`;
        case 'debate':
            return inZone
                ? `Find ${def.giverName} here and choose your answer to their riddle.`
                : `Travel to ${zoneName} and talk to ${def.giverName} for the debate.`;
        case 'confrontation':
            if (arcId === 'lost_disciple') {
                return inZone
                    ? `Explore ${zoneName} until Master Zhong ambushes you — a popup will offer fight or observe.`
                    : `Travel to ${zoneName} and Explore until the confrontation triggers.`;
            }
            return inZone
                ? `Explore ${zoneName} or follow quest prompts to start the boss fight.`
                : `Travel to ${zoneName} to face the enemy.`;
        case 'return':
            return typeof isElderHuaUnlocked === 'function' && isElderHuaUnlocked()
                ? `Return to Elder Hua in the Heartlands and deliver the shard via his NPC dialogue.`
                : `Bring the item to ${def.giverName} in ${zoneName}.`;
        case 'resolution':
        case 'reward':
        case 'choice':
        case 'fate':
            return `Open this quest in the Quest Log — a final choice or reward awaits.`;
        case 'bargain':
            return `Find a Demonic Talent NPC, talk to them, and choose bargain instead of combat.`;
        default:
            return zoneId ? `Head to ${zoneName} and explore or speak with quest contacts.` : 'Check your map and NPC list for leads.';
    }
}

function getQuestProgressHint(q) {
    if (!q) return '';
    if (q.storyArcId) return getStoryArcHint(q.storyArcId);
    if (q.type === 'rival_duel' && q.giverUid) {
        return 'Find this rival in the jianghu, talk to them, and challenge them to a formal duel.';
    }
    if (q.type === 'demonic_confront' && q.giverUid) {
        return 'Locate the Demonic Talent, speak with them several times, then choose Confront or Bargain.';
    }
    if (q.type === 'hua_guidance') {
        return 'Visit Elder Hua in the Heartlands Observatory and answer his star riddle.';
    }
    if (q.worldEvent && q.zoneHint) {
        const zn = ZONES[q.zoneHint]?.name || q.zoneHint;
        return currentZone === q.zoneHint
            ? `Explore ${zn} or check local NPCs for event progress.`
            : `Travel to ${zn} to pursue this world event.`;
    }
    if (q.giverUid && q.zoneHint) {
        const zn = ZONES[q.zoneHint]?.name || q.zoneHint;
        return currentZone === q.zoneHint
            ? `Find ${q.giverName || 'the quest giver'} in this zone via the NPC panel.`
            : `Travel to ${zn} and seek ${q.giverName || 'the quest giver'}.`;
    }
    return '';
}

function openNpcQuestDetail(q) {
    if (!q) return;
    const popup = document.getElementById('questPopup');
    if (!popup) {
        focusQuestEntry(q);
        return;
    }
    const hint = getQuestProgressHint(q);
    document.getElementById('questPopupTitle').textContent = `${q.typeEmoji || '📜'} ${q.title}`;
    document.getElementById('questPopupStage').textContent = [q.stageName, q.typeLabel].filter(Boolean).join(' · ');
    document.getElementById('questPopupText').textContent = q.objective || '';
    const hintEl = document.getElementById('questPopupHint');
    if (hintEl) {
        hintEl.textContent = hint ? `💡 Next step: ${hint}` : '';
        hintEl.style.display = hint ? 'block' : 'none';
    }
    const choices = document.getElementById('questPopupChoices');
    choices.innerHTML = '';
    if (q.zoneHint) {
        choices.innerHTML = `<button type="button" class="popup-item quest-choice" data-quest-goto-zone="${q.zoneHint}">🗺️ Travel toward ${ZONES[q.zoneHint]?.name || q.zoneHint}</button>`;
    }
    if (q.giverUid && typeof getWorldNpcByUid === 'function') {
        const npc = getWorldNpcByUid(q.giverUid);
        if (npc?.alive && npc.zone === currentZone) {
            choices.innerHTML += `<button type="button" class="popup-item quest-choice" data-quest-goto-npc="${npc.uid}">👤 Find ${q.giverName || npc.name}</button>`;
        }
    }
    bindQuestPopupEvents(null);
    choices.querySelectorAll('[data-quest-goto-npc]').forEach(btn => {
        btn.onclick = function() {
            closeQuestPopup();
            if (typeof openNpcPopup === 'function') openNpcPopup(worldNpcId(this.dataset.questGotoNpc));
        };
    });
    popup.classList.add('active');
}

// ============================================
// STORY ARCS — multi-stage quests
// ============================================

function ensureStoryQuestState() {
    if (!G.storyArcState) G.storyArcState = {};
    if (!G.npcRelationships) G.npcRelationships = {};
    if (G.storyCombat === undefined) G.storyCombat = null;
    Object.keys(STORY_ARCS).forEach(arcId => {
        if (!G.storyArcState[arcId]) {
            G.storyArcState[arcId] = {
                status: 'inactive',
                stage: 0,
                flags: {},
                clues: [],
                startedMonths: null,
                completedMonths: null,
                resolution: null,
                weiLingFate: null
            };
        } else {
            const arc = G.storyArcState[arcId];
            if (!arc.flags) arc.flags = {};
            if (!arc.clues) arc.clues = [];
        }
    });
}

function getStoryArcState(arcId) {
    ensureStoryQuestState();
    return G.storyArcState[arcId] || null;
}

function getNpcRelationship(npcId) {
    ensureStoryQuestState();
    return G.npcRelationships[npcId] || 0;
}

function shiftNpcRelationship(npcId, amount) {
    ensureStoryQuestState();
    G.npcRelationships[npcId] = clamp((G.npcRelationships[npcId] || 0) + amount, -100, 100);
}

function canStartStoryArc(arcId) {
    const def = STORY_ARCS[arcId];
    const state = getStoryArcState(arcId);
    if (!def || !state) return false;
    if (state.status !== 'inactive') return false;
    if (def.traitOnly && getPlayerTraitDef()?.id !== def.traitOnly) return false;
    if (G.realmIdx < (def.reqRealm || 0)) return false;
    return true;
}

function tryStartTraitStoryArcs() {
    if (getPlayerTraitDef()?.id === 'forgotten_heir') {
        startStoryArc('forgotten_heir');
        addLog('👑 A sealed memory stirs — your lineage will not stay buried.');
    }
}

function startStoryArc(arcId) {
    const def = STORY_ARCS[arcId];
    const state = getStoryArcState(arcId);
    if (!def || !state || state.status !== 'inactive') return false;
    if (def.traitOnly && getPlayerTraitDef()?.id !== def.traitOnly) return false;
    state.status = 'active';
    state.stage = 1;
    state.startedMonths = G.ageMonths || 0;
    state.flags.accepted = true;
    if (def.giverId) shiftNpcRelationship(def.giverId, 5);
    addLog(`📜 Story arc begun: ${def.title}`);
    syncStoryQuestLog();
    return true;
}

function advanceStoryStage(arcId, toStage) {
    const state = getStoryArcState(arcId);
    const def = STORY_ARCS[arcId];
    if (!state || state.status !== 'active' || !def) return false;
    state.stage = toStage;
    const stageDef = def.stages[toStage];
    if (stageDef) addLog(`📜 ${def.title} — ${stageDef.name}: ${stageDef.objective}`);
    syncStoryQuestLog();
    return true;
}

function completeStoryArc(arcId, resolution) {
    const def = STORY_ARCS[arcId];
    const state = getStoryArcState(arcId);
    if (!def || !state) return;
    state.status = 'complete';
    state.completedMonths = G.ageMonths || 0;
    state.resolution = resolution || null;
    applyStoryArcRewards(def.rewards?.complete);
    completeStoryQuestLogEntry(arcId);
    addLog(`✓ Story arc complete: ${def.title}`);
    if (typeof onStoryArcCompleted === 'function') onStoryArcCompleted(arcId, resolution);
    syncStoryQuestLog();
}

function applyStoryArcRewards(rewards) {
    if (!rewards) return;
    if (rewards.fame) {
        const gained = typeof addFame === 'function' ? addFame(rewards.fame) : (G.fame += rewards.fame, rewards.fame);
        if (gained) addLog(`⭐ +${gained} Fame`);
    }
    if (rewards.foundation) {
        G.foundation += rewards.foundation;
        addLog(`🏛️ +${rewards.foundation} Foundation`);
    }
    if (rewards.alignment && typeof shiftDaoAlignment === 'function') {
        shiftDaoAlignment(rewards.alignment, 'story quest');
    } else if (rewards.alignment) {
        G.daoAlignment = clamp((G.daoAlignment || 0) + rewards.alignment, -100, 100);
    }
    if (rewards.technique && typeof learnTechnique === 'function') {
        learnTechnique(rewards.technique);
        addLog(`📜 Learned ${rewards.technique}!`);
    }
    if (rewards.stones) {
        G.stones += rewards.stones;
        addLog(`💎 +${rewards.stones} Stones`);
    }
    if (rewards.ancientClue && typeof addAncientClue === 'function') {
        addAncientClue(rewards.ancientClue);
    }
    if (rewards.forbiddenClueBonus) {
        if (!G.questPerks) G.questPerks = {};
        G.questPerks.forbiddenClueBonus = true;
    }
}

function getStoryArcStageDef(arcId) {
    const def = STORY_ARCS[arcId];
    const state = getStoryArcState(arcId);
    if (!def || !state?.stage) return null;
    return def.stages[state.stage] || null;
}

function isStoryNpcPresent(npcId, zoneId) {
    zoneId = zoneId || currentZone;
    const def = NPCS[npcId];
    if (!def?.implemented || def.implemented === false) return false;

    if (npcId === 'wei_ling') {
        const arc = getStoryArcState('lost_disciple');
        if (!arc) return false;
        if (arc.status === 'complete' && arc.weiLingFate === 'rival') return zoneId === 'jade';
        if (arc.status === 'failed') return false;
        if (arc.status === 'inactive') {
            return zoneId === 'jade' && G.realmIdx >= (def.reqRealm || 0);
        }
        if (arc.stage === 3 && zoneId === 'emberwild') return false;
        return (def.zones || []).includes(zoneId);
    }

    if (typeof isExtendedStoryNpcPresent === 'function') {
        const ext = isExtendedStoryNpcPresent(npcId, zoneId);
        if (ext !== null) return ext;
    }

    return (def.zones || []).includes(zoneId);
}

function getWeiLingFate() {
    const arc = getStoryArcState('lost_disciple');
    return arc?.weiLingFate || null;
}

function isLostDiscipleArcActive() {
    const arc = getStoryArcState('lost_disciple');
    return arc?.status === 'active';
}

function syncStoryQuestLog() {
    ensureStoryQuestState();
    ensureNpcQuestState();
    Object.keys(STORY_ARCS).forEach(arcId => {
        const def = STORY_ARCS[arcId];
        const state = getStoryArcState(arcId);
        if (!state || state.status !== 'active') return;
        const stageDef = def.stages[state.stage];
        if (!stageDef) return;
        const questType = def.questType || 'legacy';
        const typeInfo = QUEST_TYPES[questType] || QUEST_TYPES.legacy;
        const existing = findNpcQuest(q => q.storyArcId === arcId && q.status === 'active');
        const objective = getStoryArcObjective(arcId);
        if (existing) {
            existing.title = def.title;
            existing.objective = objective;
            existing.stage = state.stage;
            existing.stageName = stageDef.name;
            existing.type = questType;
            existing.typeLabel = typeInfo.label;
            existing.typeEmoji = typeInfo.emoji;
            existing.zoneHint = stageDef.zoneHint || def.startZone;
            return;
        }
        const quest = {
            id: `story_${arcId}`,
            storyArcId: arcId,
            type: questType,
            typeLabel: typeInfo.label,
            typeEmoji: typeInfo.emoji,
            title: def.title,
            objective,
            stage: state.stage,
            stageName: stageDef.name,
            status: 'active',
            giverUid: null,
            giverId: def.giverId,
            giverName: def.giverName,
            zoneHint: stageDef.zoneHint || def.startZone,
            startedMonths: state.startedMonths || G.ageMonths
        };
        G.npcQuests.push(quest);
    });
}

function getStoryArcObjective(arcId) {
    const def = STORY_ARCS[arcId];
    const state = getStoryArcState(arcId);
    if (!def || !state) return '';
    const stageDef = def.stages[state.stage];
    if (!stageDef) return '';
    if (state.stage === 2) {
        const need = stageDef.cluesRequired || 2;
        const have = (state.clues || []).length;
        return `${stageDef.objective} (${have}/${need} clues)`;
    }
    return stageDef.objective;
}

function completeStoryQuestLogEntry(arcId) {
    ensureNpcQuestState();
    const q = findNpcQuest(quest => quest.storyArcId === arcId && quest.status === 'active');
    if (q) {
        q.status = 'complete';
        q.completedMonths = G.ageMonths || 0;
    }
}

function getRecentQuests(limit) {
    ensureNpcQuestState();
    if (typeof syncStoryQuestLog === 'function') syncStoryQuestLog();
    if (typeof syncSectQuestLog === 'function') syncSectQuestLog();
    if (typeof syncWorldEventQuestLog === 'function') syncWorldEventQuestLog();
    if (typeof syncDemonicRedemptionQuestLog === 'function') syncDemonicRedemptionQuestLog();
    limit = limit || 8;
    const active = G.npcQuests.filter(q => q.status === 'active');
    const done = G.npcQuests.filter(q => q.status !== 'active')
        .sort((a, b) => (b.completedMonths || b.startedMonths) - (a.completedMonths || a.startedMonths));
    return [...active, ...done].slice(0, limit);
}

function focusQuestEntry(q) {
    if (!q) return;
    if (q.storyArcId && typeof openStoryQuestDetail === 'function') {
        openStoryQuestDetail(q.storyArcId);
        return;
    }
    if (q.giverUid && typeof getWorldNpcByUid === 'function') {
        const npc = getWorldNpcByUid(q.giverUid);
        if (npc?.alive && npc.zone === currentZone) {
            openNpcPopup(worldNpcId(q.giverUid));
            return;
        }
        const zoneName = ZONES[q.zoneHint]?.name || q.zoneHint;
        addLog(`📜 ${q.title}: seek ${q.giverName} in the ${zoneName}.`);
        return;
    }
    if (q.giverId === 'elder_hua' && typeof isElderHuaUnlocked === 'function' && isElderHuaUnlocked()) {
        if (currentZone === NPCS.elder_hua.homeZone) openNpcPopup('elder_hua');
        else addLog(`📜 ${q.title}: find Elder Hua in the Heartlands when the Observatory is unlocked.`);
        return;
    }
    if (q.giverId === 'wei_ling' && isStoryNpcPresent('wei_ling', currentZone)) {
        openNpcPopup('wei_ling');
        return;
    }
    if (q.giverId === 'merchant_su' && typeof isExtendedStoryNpcPresent === 'function' && isExtendedStoryNpcPresent('merchant_su', currentZone)) {
        openNpcPopup('merchant_su');
        return;
    }
    if (q.giverId === 'liang_chen' && typeof isExtendedStoryNpcPresent === 'function' && isExtendedStoryNpcPresent('liang_chen', currentZone)) {
        openNpcPopup('liang_chen');
        return;
    }
    if (q.worldEvent && q.zoneHint && currentZone === q.zoneHint) {
        addLog(`📜 ${q.title}: explore ${ZONES[q.zoneHint]?.name || q.zoneHint} to complete this lead.`);
        return;
    }
    if (q.giverId && NPCS[q.giverId]) {
        const def = NPCS[q.giverId];
        const zone = q.zoneHint || def.homeZone;
        if (currentZone === zone && typeof isStoryNpcPresent === 'function' && isStoryNpcPresent(q.giverId, zone)) {
            openNpcPopup(q.giverId);
        } else {
            addLog(`📜 ${q.title}: ${q.objective}`);
        }
        return;
    }
    addLog(`📜 ${q.title}: ${q.objective}`);
}

function focusStoryQuest(questId) {
    const q = G.npcQuests?.find(x => x.id === questId);
    if (q) focusQuestEntry(q);
}

function acceptLostDiscipleQuest() {
    if (!canStartStoryArc('lost_disciple')) {
        const state = getStoryArcState('lost_disciple');
        if (state?.status === 'active') return { success: false, message: 'You are already searching for Master Zhong.' };
        return { success: false, message: 'You cannot take this quest yet.' };
    }
    if (!advanceTime(1, 'Listening to Wei Ling\'s plea')) {
        return { success: false, message: 'Your lifespan ends...' };
    }
    startStoryArc('lost_disciple');
    shiftNpcRelationship('wei_ling', 10);
    if (typeof shiftDaoAlignmentHelp === 'function') shiftDaoAlignmentHelp('helping a distressed disciple');
    else if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(3, 'helping a distressed disciple');
    return {
        success: true,
        message: '"Thank you," Wei Ling breathes. "Search the Emberwild — any sign of his robes, his qi trail, anything. I will wait in Jade."'
    };
}

function rollStoryClueOnExplore(zoneId) {
    const state = getStoryArcState('lost_disciple');
    if (!state || state.status !== 'active' || state.stage !== 2) return null;
    if (zoneId !== 'emberwild') return null;
    const stageDef = STORY_ARCS.lost_disciple.stages[2];
    const need = stageDef.cluesRequired || 2;
    if ((state.clues || []).length >= need) return null;

    const available = stageDef.clueIds.filter(id => !state.clues.includes(id));
    if (!available.length) return null;
    const rollOk = state.clues.length === 0 || Math.random() < 0.68;
    if (!rollOk) return null;

    const clueId = available[Math.floor(Math.random() * available.length)];
    const clue = STORY_ARC_CLUES[clueId];
    if (!clue) return null;

    state.clues.push(clueId);
    if (!G.inventory) G.inventory = [];
    if (!G.inventory.includes(clue.name)) G.inventory.push(clue.name);
    addLog(`🔍 Quest clue: ${clue.name} — ${clue.desc}`);

    if (state.clues.length >= need) {
        applyStoryArcRewards(STORY_ARCS.lost_disciple.rewards?.stage2);
        advanceStoryStage('lost_disciple', 3);
        addLog(`📜 The clues converge — Master Zhong is alive in the Emberwild, but his qi reeks of corruption.`);
    }
    syncStoryQuestLog();
    return clue;
}

function tryTriggerStoryConfrontation(zoneId) {
    const heir = getStoryArcState('forgotten_heir');
    if (heir?.status === 'active' && heir.stage === 3 && zoneId === 'jade' && !heir.flags.confrontationStarted) {
        heir.flags.confrontationStarted = true;
        openStoryConfrontationPopup('forgotten_heir');
        return true;
    }
    const state = getStoryArcState('lost_disciple');
    if (!state || state.status !== 'active' || state.stage !== 3) return false;
    if (zoneId !== 'emberwild') return false;
    if (state.flags.confrontationStarted) return false;
    state.flags.confrontationStarted = true;
    openStoryConfrontationPopup('lost_disciple');
    return true;
}

function onExploreForStoryQuests(zoneId) {
    if (typeof onExploreForStoryQuestsEx === 'function') onExploreForStoryQuestsEx(zoneId);
}

function openStoryConfrontationPopup(arcId) {
    const def = STORY_ARCS[arcId];
    const boss = STORY_ARC_BOSSES[def?.stages?.[3]?.bossId];
    if (!def || !boss) return;
    const popup = document.getElementById('questPopup');
    if (!popup) {
        startStoryArcCombat(arcId, boss.id);
        return;
    }
    document.getElementById('questPopupTitle').textContent = `${boss.emoji} ${def.stages[3].name}`;
    document.getElementById('questPopupStage').textContent = def.title + ' · Stage 3';
    document.getElementById('questPopupText').textContent = boss.intro;
    const choices = document.getElementById('questPopupChoices');
    choices.innerHTML = `
        <button type="button" class="popup-item quest-choice" data-quest-action="fight">⚔️ Stand your ground — fight!</button>
        <button type="button" class="popup-item quest-choice" data-quest-action="observe">👁️ Observe his corruption first (+breakthrough insight, costs 2 months)</button>
    `;
    bindQuestPopupEvents(arcId, boss.id);
    popup.classList.add('active');
}

function openStoryResolutionPopup(arcId) {
    if (typeof openStoryResolutionPopupEx === 'function') {
        openStoryResolutionPopupEx(arcId);
        return;
    }
    const def = STORY_ARCS[arcId];
    const state = getStoryArcState(arcId);
    if (!def || !state) return;
    const popup = document.getElementById('questPopup');
    if (!popup) return;
    document.getElementById('questPopupTitle').textContent = `☯️ ${def.stages[4].name}`;
    document.getElementById('questPopupStage').textContent = def.title + ' · Final choice';
    document.getElementById('questPopupText').textContent =
        'Master Zhong lies broken at your feet, corruption unraveling. Wei Ling will arrive by nightfall. What do you tell the heavens you did here?';
    const choices = document.getElementById('questPopupChoices');
    choices.innerHTML = def.resolutionChoices.map(c => {
        const locked = c.requiresAlignment != null && (G.daoAlignment || 0) < c.requiresAlignment;
        return `<button type="button" class="popup-item quest-choice" data-quest-resolution="${c.id}" ${locked ? 'disabled style="opacity:0.55;"' : ''}>
            <div class="name">${c.label}</div>
            <div class="desc">${c.desc}${locked ? ' · Requires neutral or positive Dao alignment' : ''}</div>
        </button>`;
    }).join('');
    bindQuestPopupEvents(arcId);
    popup.classList.add('active');
}

function openStoryQuestDetail(arcId) {
    const def = STORY_ARCS[arcId];
    const state = getStoryArcState(arcId);
    if (!def || !state || state.status !== 'active') {
        focusQuestEntry(findNpcQuest(q => q.storyArcId === arcId));
        return;
    }
    const popup = document.getElementById('questPopup');
    if (!popup) return;
    const stageDef = def.stages[state.stage];
    document.getElementById('questPopupTitle').textContent = `${QUEST_TYPES[def.questType]?.emoji || '📜'} ${def.title}`;
    document.getElementById('questPopupStage').textContent = `Stage ${state.stage}: ${stageDef?.name || ''}`;
    const hint = getStoryArcHint(arcId);
    const hintEl = document.getElementById('questPopupHint');
    if (hintEl) {
        hintEl.textContent = hint ? `💡 Next step: ${hint}` : '';
        hintEl.style.display = hint ? 'block' : 'none';
    }
    let text = getStoryArcObjective(arcId);
    if (state.stage === 2 && state.clues?.length) {
        text += '\n\nClues found:\n' + state.clues.map(id => {
            const c = STORY_ARC_CLUES[id];
            return c ? `• ${c.name}` : '';
        }).filter(Boolean).join('\n');
    }
    if (state.stage === 4 && def.resolutionChoices) {
        openStoryResolutionPopup(arcId);
        return;
    }
    document.getElementById('questPopupText').textContent = text;
    const choices = document.getElementById('questPopupChoices');
    choices.innerHTML = '';
    const zoneHint = stageDef?.zoneHint || def.startZone;
    if (state.stage === 1 && def.giverId && typeof isStoryNpcPresent === 'function' && isStoryNpcPresent(def.giverId, currentZone)) {
        choices.innerHTML = `<button type="button" class="popup-item quest-choice" data-quest-goto="${def.giverId}">Find ${def.giverName}</button>`;
    } else if (zoneHint && (state.stage === 2 || state.stage === 3)) {
        choices.innerHTML = `<button type="button" class="popup-item quest-choice" data-quest-goto-zone="${zoneHint}">Travel toward ${ZONES[zoneHint]?.name || zoneHint}</button>`;
    }
    if (arcId === 'observatory_shard' && state.stage === 3) {
        choices.innerHTML += `<button type="button" class="popup-item quest-choice" data-quest-goto="elder_hua">📿 Deliver shard to Elder Hua</button>`;
    }
    bindQuestPopupEvents(arcId);
    popup.classList.add('active');
}

function bindQuestPopupEvents(arcId, bossId) {
    document.querySelectorAll('[data-quest-action="fight"]').forEach(btn => {
        btn.onclick = function() {
            closeQuestPopup();
            startStoryArcCombat(arcId, bossId);
        };
    });
    document.querySelectorAll('[data-quest-action="observe"]').forEach(btn => {
        btn.onclick = function() {
            if (!advanceTime(2, 'Studying demonic corruption')) return;
            G.foundation += 2;
            addLog('👁️ You discern the corruption\'s root — +2 Foundation. The fight will be easier.');
            const state = getStoryArcState(arcId);
            if (state) state.flags.observedCorruption = true;
            closeQuestPopup();
            startStoryArcCombat(arcId, bossId);
            fullRender();
        };
    });
    document.querySelectorAll('[data-quest-resolution]').forEach(btn => {
        btn.onclick = function() {
            resolveLostDiscipleArc(this.dataset.questResolution);
        };
    });
    document.querySelectorAll('[data-quest-goto]').forEach(btn => {
        btn.onclick = function() {
            closeQuestPopup();
            const id = this.dataset.questGoto;
            if (id === 'elder_hua' && typeof isElderHuaUnlocked === 'function' && isElderHuaUnlocked()) {
                openNpcPopup('elder_hua');
            } else if (typeof isStoryNpcPresent === 'function' && isStoryNpcPresent(id, currentZone)) {
                openNpcPopup(id);
            } else {
                addLog(`📜 Seek ${NPCS[id]?.name || id} in ${ZONES[NPCS[id]?.homeZone]?.name || 'the jianghu'}.`);
            }
        };
    });
    document.querySelectorAll('[data-quest-goto-zone]').forEach(btn => {
        btn.onclick = function() {
            closeQuestPopup();
            addLog(`📜 Head to ${ZONES[this.dataset.questGotoZone]?.name || this.dataset.questGotoZone} via the Map.`);
        };
    });
}

function closeQuestPopup() {
    document.getElementById('questPopup')?.classList.remove('active');
}

function startStoryArcCombat(arcId, bossId) {
    if (G.inCombat) return false;
    const boss = STORY_ARC_BOSSES[bossId];
    if (!boss) return false;
    ensureStoryQuestState();
    const state = getStoryArcState(arcId);
    let realmIdx = boss.realmIdx != null ? boss.realmIdx : G.realmIdx;
    if (boss.scalesWithPlayer) realmIdx = G.realmIdx;
    const template = pickNpcCombatTemplate(realmIdx);
    let hp = Math.floor(calcEnemyHp(template, { context: 'normal' }) * (boss.hpMult || 1));
    let dmg = Math.floor(calcEnemyDamage(template, { context: 'normal' }) * (boss.dmgMult || 1));
    if (state?.flags?.observedCorruption) {
        hp = Math.floor(hp * 0.92);
        dmg = Math.floor(dmg * 0.92);
    }

    G.storyCombat = { arcId, bossId };
    G.inCombat = true;
    G.defending = false;
    G.fortifyActive = false;
    G.combatLog = [];
    initCombatResource();
    updateShield();
    if (G.path === 'soul') G.shield = G.maxShield;

    G.enemy = {
        name: `${boss.emoji} ${boss.name}`,
        hp,
        maxHp: hp,
        dmg,
        originalDmg: dmg,
        intimidateTurns: 0,
        isStoryCombat: true,
        storyArcId: arcId,
        storyBossId: bossId
    };
    G.enemyMaxHp = hp;

    addCombatLog(`⚔️ ${boss.name} attacks! (${hp} HP)`);
    setupCombatActions();
    G.combatPhase = 'player';
    clearCombatTurnTimer();
    setCombatInputEnabled(true);
    updateCombatUI();
    document.getElementById('combatOverlay')?.classList.add('active');
    closeNpcPopup();
    return true;
}

function isStoryCombat() {
    return !!(G.storyCombat && G.inCombat);
}

function storyCombatVictory(fromTechnique) {
    const ctx = G.storyCombat;
    if (!ctx) return;
    const boss = STORY_ARC_BOSSES[ctx.bossId];
    addCombatLog(`💀 ${boss?.name || 'Boss'} falls!`);

    if (ctx.arcId === 'lost_disciple') {
        const state = getStoryArcState('lost_disciple');
        applyStoryArcRewards(STORY_ARCS.lost_disciple.rewards?.stage3);
        state.flags.masterDefeated = true;
        advanceStoryStage('lost_disciple', 4);
        addLog(boss?.victoryLog || 'The confrontation ends.');
    } else if (ctx.arcId === 'dustbone_caravan') {
        applyStoryArcRewards(STORY_ARCS.dustbone_caravan.rewards?.stage3);
        advanceStoryStage('dustbone_caravan', 4);
        addLog(boss?.victoryLog || 'The ambush is repelled.');
    } else if (ctx.arcId === 'liang_chen_rival') {
        const state = getStoryArcState('liang_chen_rival');
        applyStoryArcRewards(STORY_ARCS.liang_chen_rival.rewards?.stage3);
        state.flags.duelComplete = true;
        advanceStoryStage('liang_chen_rival', 4);
        addLog(boss?.victoryLog || 'The duel ends.');
    } else if (ctx.arcId === 'forgotten_heir') {
        const state = getStoryArcState('forgotten_heir');
        applyStoryArcRewards(STORY_ARCS.forgotten_heir.rewards?.stage3);
        state.flags.usurperDefeated = true;
        advanceStoryStage('forgotten_heir', 4);
        addLog(boss?.victoryLog || 'The usurper falls.');
    }

    G.inCombat = false;
    G.defending = false;
    G.storyCombat = null;
    if (typeof clearCombatTurnTimer === 'function') clearCombatTurnTimer();
    document.getElementById('combatOverlay')?.classList.remove('active');
    G.enemy = null;
    if (G.path === 'qi' || G.path === 'soul') {
        G.shield = Math.max(G.shield, Math.floor(G.maxShield * 0.5));
    }
    if (typeof showCombatVictoryPopup === 'function') {
        showCombatVictoryPopup({
            enemyName: boss?.name || 'Boss',
            subtitle: 'Story quest stage complete — check your quest log for what comes next.',
            rewards: ['📜 Quest stage advanced', '🏛️ Foundation and fame may have increased']
        });
    }
    fullRender();
    if (ctx.arcId === 'lost_disciple' || ctx.arcId === 'dustbone_caravan' || ctx.arcId === 'liang_chen_rival' || ctx.arcId === 'forgotten_heir') {
        setTimeout(() => openStoryResolutionPopup(ctx.arcId), 400);
    }
}

function storyCombatDefeat() {
    const ctx = G.storyCombat;
    G.hp = Math.max(1, Math.floor(G.maxHp * 0.2));
    G.storyCombat = null;
    G.inCombat = false;
    G.defending = false;
    if (typeof clearCombatTurnTimer === 'function') clearCombatTurnTimer();
    document.getElementById('combatOverlay')?.classList.remove('active');
    G.enemy = null;
    const state = getStoryArcState('lost_disciple');
    if (state) state.flags.confrontationStarted = false;
    const heir = getStoryArcState('forgotten_heir');
    if (heir) heir.flags.confrontationStarted = false;
    addLog('⚔️ Master Zhong\'s corrupted qi overwhelms you. Retreat and prepare again.');
    fullRender();
}

function resolveLostDiscipleArc(choiceId) {
    const def = STORY_ARCS.lost_disciple;
    const state = getStoryArcState('lost_disciple');
    const choice = def.resolutionChoices.find(c => c.id === choiceId);
    if (!choice || !state) return;
    if (choice.requiresAlignment != null && (G.daoAlignment || 0) < choice.requiresAlignment) {
        addLog('☯️ Your Dao alignment is too far from righteousness to attempt purification.');
        return;
    }
    if (!advanceTime(2, 'Facing Wei Ling with the truth')) return;

    closeQuestPopup();
    addLog(choice.log);
    state.weiLingFate = choice.fate;
    state.flags.resolutionChoice = choiceId;

    if (typeof shiftDaoAlignment === 'function') {
        shiftDaoAlignment(choice.alignmentShift, 'Lost Disciple resolution');
    } else {
        G.daoAlignment = clamp((G.daoAlignment || 0) + choice.alignmentShift, -100, 100);
    }

    if (choice.fate === 'ally') {
        shiftNpcRelationship('wei_ling', 40);
        applyStoryArcRewards(def.rewards?.ally);
        if (typeof shiftDaoAlignmentHelp === 'function') shiftDaoAlignmentHelp('saving a corrupted master');
    } else if (choice.fate === 'grieving_ally') {
        shiftNpcRelationship('wei_ling', 10);
        applyStoryArcRewards(def.rewards?.complete);
    } else if (choice.fate === 'rival') {
        shiftNpcRelationship('wei_ling', -50);
        applyStoryArcRewards(def.rewards?.rival);
        if (typeof shiftDaoAlignment === 'function') {
            shiftDaoAlignment(-5, 'slaying Wei Ling\'s master');
        }
    }

    completeStoryArc('lost_disciple', choiceId);
    fullRender();
}

function resolveForgottenHeirArc(choiceId) {
    const def = STORY_ARCS.forgotten_heir;
    const state = getStoryArcState('forgotten_heir');
    const choice = def.resolutionChoices.find(c => c.id === choiceId);
    if (!choice || !state) return;
    if (!advanceTime(3, 'Claiming your lineage')) return;
    closeQuestPopup();
    addLog(choice.log);
    state.flags.resolutionChoice = choiceId;
    state.heirFate = choice.fate;
    if (typeof shiftDaoAlignment === 'function') {
        shiftDaoAlignment(choice.alignmentShift || 0, 'Forgotten Heir resolution');
    }
    if (choice.fate === 'honored') applyStoryArcRewards(def.rewards?.honored);
    else if (choice.fate === 'shadow') applyStoryArcRewards(def.rewards?.shadow);
    else applyStoryArcRewards(def.rewards?.free);
    applyStoryArcRewards(def.rewards?.complete);
    completeStoryArc('forgotten_heir', choiceId);
    fullRender();
}

function getWeiLingQuestActions() {
    const arc = getStoryArcState('lost_disciple');
    const actions = [
        { action: 'talk', label: '💬 Talk', desc: 'Speak with the anxious disciple' },
        { action: 'leave', label: '🚪 Leave', desc: 'Continue your journey' }
    ];
    if (!arc || arc.status === 'inactive') {
        actions.unshift({
            action: 'quest_accept',
            label: '📜 Accept her plea',
            desc: 'Begin "The Lost Disciple" — search Emberwild for her master'
        });
    } else if (arc.status === 'active' && arc.stage <= 2) {
        actions.unshift({
            action: 'quest_progress',
            label: '🔍 Ask about the search',
            desc: 'Review clues and next steps'
        });
    } else if (arc.status === 'complete') {
        const fate = arc.weiLingFate;
        if (fate === 'rival') {
            actions.unshift({
                action: 'wei_rival_duel',
                label: '⚔️ She challenges you',
                desc: 'Wei Ling seeks vengeance for her master'
            });
        } else if (fate === 'ally') {
            actions.unshift({
                action: 'wei_gift',
                label: '🎁 Receive her gratitude',
                desc: 'A token from the Verdant Tide Sect (once)'
            });
        }
    }
    return actions;
}

function weiLingPostQuestGift() {
    const arc = getStoryArcState('lost_disciple');
    if (!arc || arc.weiLingFate !== 'ally' || arc.flags.giftClaimed) {
        return { success: false, message: 'Nothing more to offer right now.' };
    }
    arc.flags.giftClaimed = true;
    G.stones += 15;
    if (typeof addCraftMaterial === 'function') addCraftMaterial('spirit_herb', 2);
    shiftNpcRelationship('wei_ling', 5);
    return { success: true, message: 'Wei Ling presses a pouch of stones and spirit herbs into your hands. "The sect owes you a debt."' };
}
