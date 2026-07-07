// ============================================
// STORY-ARCS.JS — Extended arcs, sect & world quests
// ============================================

function ensureExtendedQuestState() {
    if (typeof ensureStoryQuestState === 'function') ensureStoryQuestState();
    if (!G.sectQuests) G.sectQuests = [];
    if (!G.worldEventQuests) G.worldEventQuests = [];
    if (!G.questJournal) G.questJournal = [];
    if (!G.legacyChain) G.legacyChain = { completedArcIds: [], unlocked: false };
    if (!G.questPerks) G.questPerks = {};
    if (!G.demonicRedemption) G.demonicRedemption = { status: 'inactive', targetUid: null, stage: 0, flags: {} };
}

function appendQuestJournalEntry(entry) {
    ensureExtendedQuestState();
    G.questJournal.unshift({
        ...entry,
        months: G.ageMonths || 0,
        ageLabel: typeof formatYears === 'function' ? formatYears(G.ageMonths) : ''
    });
    if (G.questJournal.length > 40) G.questJournal.pop();
}

function onStoryArcCompleted(arcId, resolution) {
    ensureExtendedQuestState();
    const def = STORY_ARCS[arcId];
    appendQuestJournalEntry({
        kind: 'arc',
        arcId,
        title: def?.title || arcId,
        resolution,
        status: 'complete'
    });
    if (!G.legacyChain.completedArcIds.includes(arcId)) {
        G.legacyChain.completedArcIds.push(arcId);
    }
    checkLegacyChainUnlock();
    applyArcCompletionExtras(arcId, resolution);
}

function applyArcCompletionExtras(arcId, resolution) {
    const state = getStoryArcState(arcId);
    if (arcId === 'dustbone_caravan') {
        if (resolution === 'protect' || state?.flags?.resolutionChoice === 'protect') {
            G.questPerks.caravanDiscount = 0.88;
            shiftNpcRelationship('merchant_su', 30);
        } else if (resolution === 'betray') {
            shiftNpcRelationship('merchant_su', -60);
            applyStoryArcRewards(STORY_ARCS.dustbone_caravan.rewards?.enemy);
        }
        if (state) state.caravanFate = state.flags?.resolutionChoice === 'betray' ? 'enemy' : 'ally';
    }
    if (arcId === 'observatory_shard') {
        if (typeof shiftDaoAlignmentHelp === 'function') shiftDaoAlignmentHelp('retrieving the Observatory shard');
        applyStoryArcRewards(STORY_ARCS.observatory_shard.rewards?.finish);
        if (STORY_ARCS.observatory_shard.rewards?.finish?.forbiddenClueBonus) {
            G.questPerks.forbiddenClueBonus = true;
        }
    }
    if (arcId === 'liang_chen_rival') {
        const fate = state?.liangFate || state?.flags?.resolutionChoice;
        if (fate === 'recruit' || fate === 'ally') {
            if (!G.disciples.includes('Liang Chen')) {
                if (typeof addSectDisciple === 'function') addSectDisciple('Liang Chen', 'core');
                else G.disciples.push('Liang Chen');
            }
            shiftNpcRelationship('liang_chen', 40);
        } else {
            shiftNpcRelationship('liang_chen', -40);
            if (state) state.liangFate = 'rival';
        }
    }
}

function checkLegacyChainUnlock() {
    ensureExtendedQuestState();
    if (G.legacyChain.unlocked) return;
    const needed = LEGACY_QUEST_CHAIN.requiredCount || 3;
    const count = G.legacyChain.completedArcIds.filter(id =>
        LEGACY_QUEST_CHAIN.countArcIds.includes(id)
    ).length;
    if (count < needed) return;
    G.legacyChain.unlocked = true;
    const r = LEGACY_QUEST_CHAIN.reward;
    addLog(`🌟 ${r.log}`);
    applyStoryArcRewards(r);
    if (r.forbiddenClueBonus) G.questPerks.forbiddenClueBonus = true;
    appendQuestJournalEntry({ kind: 'legacy', title: 'Chronicle of the Path', status: 'unlocked' });
}

function isExtendedStoryNpcPresent(npcId, zoneId) {
    zoneId = zoneId || currentZone;
    const def = NPCS[npcId];
    if (!def?.implemented) return false;

    if (npcId === 'merchant_su') {
        const arc = getStoryArcState('dustbone_caravan');
        if (arc?.status === 'complete') return zoneId === 'dustbone' && arc.caravanFate !== 'enemy';
        if (arc?.status === 'failed') return false;
        if (arc?.status === 'active' && arc.stage > 2) return false;
        return zoneId === 'dustbone';
    }

    if (npcId === 'liang_chen') {
        const arc = getStoryArcState('liang_chen_rival');
        if (arc?.status === 'failed') return false;
        if (arc?.status === 'inactive') {
            return (def.zones || []).includes(zoneId) && G.realmIdx >= (def.reqRealm || 0);
        }
        if (arc?.status === 'complete') {
            return (def.zones || []).includes(zoneId);
        }
        const hint = STORY_ARCS.liang_chen_rival.stages[arc.stage]?.zoneHint;
        return zoneId === hint || zoneId === def.homeZone;
    }

    return null;
}

function canStartStoryArcEx(arcId) {
    if (!canStartStoryArc(arcId)) return false;
    const def = STORY_ARCS[arcId];
    if (def?.requiresHua && typeof isElderHuaUnlocked === 'function' && !isElderHuaUnlocked()) return false;
    return true;
}

// ----- Caravan escort -----

function acceptCaravanQuest() {
    if (!canStartStoryArcEx('dustbone_caravan')) {
        const s = getStoryArcState('dustbone_caravan');
        if (s?.status === 'active') return { success: false, message: 'You are already escorting Merchant Su\'s caravan.' };
        return { success: false, message: 'The caravan is not hiring right now.' };
    }
    if (!advanceTime(1, 'Negotiating with Merchant Su')) return { success: false, message: 'Your lifespan ends...' };
    startStoryArc('dustbone_caravan');
    shiftNpcRelationship('merchant_su', 8);
    if (typeof shiftDaoAlignmentHelp === 'function') shiftDaoAlignmentHelp('protecting merchants');
    return { success: true, message: '"We leave at once," Su says. "Reach the Heartlands safely — half payment on arrival."' };
}

function onTravelForStoryQuests(fromZone, toZone) {
    const arc = getStoryArcState('dustbone_caravan');
    if (arc?.status === 'active' && arc.stage === 2 && toZone === 'heartlands') {
        advanceStoryStage('dustbone_caravan', 3);
        arc.flags.escortComplete = true;
        setTimeout(() => {
            if (typeof openStoryConfrontationPopup === 'function') openStoryConfrontationPopup('dustbone_caravan');
        }, 300);
    }

    const demonic = G.demonicRedemption;
    if (demonic?.status === 'active' && demonic.stage === 2 && demonic.targetUid) {
        const npc = getWorldNpcByUid?.(demonic.targetUid);
        if (npc?.alive) {
            demonic.flags.traveledTogether = true;
            demonic.stage = 3;
            addLog(`😈 Your demonic companion walks beside you in silence — the jianghu watches.`);
            syncStoryQuestLog();
        }
    }
}

function resolveCaravanArc(choiceId) {
    const def = STORY_ARCS.dustbone_caravan;
    const choice = def.resolutionChoices.find(c => c.id === choiceId);
    const state = getStoryArcState('dustbone_caravan');
    if (!choice || !state) return;
    if (!advanceTime(1, 'Settling with Merchant Su')) return;
    closeQuestPopup();
    addLog(choice.log);
    state.flags.resolutionChoice = choiceId;
    if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(choice.alignmentShift, 'caravan resolution');
    if (choiceId === 'protect') applyStoryArcRewards(def.rewards?.ally);
    completeStoryArc('dustbone_caravan', choiceId);
    fullRender();
}

// ----- Observatory shard -----

function acceptObservatoryShardQuest() {
    if (!canStartStoryArcEx('observatory_shard')) {
        const s = getStoryArcState('observatory_shard');
        if (s?.status === 'active') return { success: false, message: 'You already carry Elder Hua\'s commission.' };
        return { success: false, message: 'Elder Hua has no task for you yet.' };
    }
    if (!advanceTime(2, 'Receiving Elder Hua\'s commission')) return { success: false, message: 'Your lifespan ends...' };
    startStoryArc('observatory_shard');
    shiftNpcRelationship('elder_hua', 5);
    return { success: true, message: '"Retrieve the shard from the Observatory tower," Hua intones. "Only the honest may carry it back."' };
}

function onObservatoryClearedForQuest() {
    const arc = getStoryArcState('observatory_shard');
    if (!arc || arc.status !== 'active' || arc.stage !== 2) return;
    if (!G.inventory) G.inventory = [];
    if (!G.inventory.includes('Observatory Shard')) G.inventory.push('Observatory Shard');
    applyStoryArcRewards(STORY_ARCS.observatory_shard.rewards?.stage2);
    advanceStoryStage('observatory_shard', 3);
    addLog('🔭 You claim the Observatory Shard — starlight pulses in your palm.');
}

function completeObservatoryReturn() {
    const arc = getStoryArcState('observatory_shard');
    if (!arc || arc.status !== 'active' || arc.stage !== 3) return { success: false };
    if (!G.inventory?.includes('Observatory Shard')) return { success: false, message: 'You do not yet hold the shard.' };
    if (!advanceTime(2, 'Presenting the shard to Elder Hua')) return { success: false };
    G.inventory = G.inventory.filter(i => i !== 'Observatory Shard');
    advanceStoryStage('observatory_shard', 4);
    applyStoryArcRewards(STORY_ARCS.observatory_shard.rewards?.complete);
    completeStoryArc('observatory_shard', 'returned');
    return { success: true, message: 'Elder Hua accepts the shard. "The stars remember this deed."' };
}

// ----- Liang Chen rival -----

function acceptLiangChenQuest() {
    if (!canStartStoryArcEx('liang_chen_rival')) {
        const s = getStoryArcState('liang_chen_rival');
        if (s?.status === 'active') return { success: false, message: 'Your rivalry with Liang Chen is already underway.' };
        return { success: false, message: 'Liang Chen ignores you — grow stronger first.' };
    }
    if (!advanceTime(1, 'Matching words with Liang Chen')) return { success: false, message: 'Your lifespan ends...' };
    startStoryArc('liang_chen_rival');
    shiftNpcRelationship('liang_chen', 5);
    return { success: true, message: '"Good," Liang Chen grins. "Meet me in Jade when you are ready to prove your Dao."' };
}

function openLiangDebatePopup() {
    const def = STORY_ARCS.liang_chen_rival;
    const popup = document.getElementById('questPopup');
    if (!popup || !def.debate) return;
    document.getElementById('questPopupTitle').textContent = '☯️ Philosophical Duel';
    document.getElementById('questPopupStage').textContent = def.title + ' · Stage 2';
    document.getElementById('questPopupText').textContent = `"${def.debate.riddle}"`;
    document.getElementById('questPopupChoices').innerHTML = def.debate.choices.map((c, i) =>
        `<button type="button" class="popup-item quest-choice" data-liang-debate="${i}">
            <div class="name">${c.label}</div>
        </button>`
    ).join('');
    document.querySelectorAll('[data-liang-debate]').forEach(btn => {
        btn.onclick = function() {
            submitLiangDebate(parseInt(this.dataset.liangDebate, 10));
        };
    });
    popup.classList.add('active');
}

function submitLiangDebate(idx) {
    const def = STORY_ARCS.liang_chen_rival;
    const choice = def.debate.choices[idx];
    const arc = getStoryArcState('liang_chen_rival');
    if (!choice || !arc || arc.stage !== 2) return;
    if (!advanceTime(2, 'Debating the Dao with Liang Chen')) return;
    closeQuestPopup();
    addLog(`⚔️ Liang Chen: "${choice.log}"`);
    if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(choice.alignmentShift, 'philosophical debate');
    applyStoryArcRewards(def.rewards?.stage2);
    advanceStoryStage('liang_chen_rival', 3);
    addLog('📜 Liang Chen points toward forbidden lands. "Clear one with me — or fight me here."');
    fullRender();
}

function resolveLiangChenArc(choiceId) {
    const def = STORY_ARCS.liang_chen_rival;
    const choice = def.resolutionChoices.find(c => c.id === choiceId);
    const state = getStoryArcState('liang_chen_rival');
    if (!choice || !state) return;
    if (!advanceTime(2, 'Final words with Liang Chen')) return;
    closeQuestPopup();
    addLog(choice.log);
    state.flags.resolutionChoice = choiceId;
    state.liangFate = choice.fate;
    if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(choice.alignmentShift, 'rival resolution');
    applyStoryArcRewards(def.rewards?.[choice.fate === 'ally' ? 'ally' : 'rival'] || def.rewards?.complete);
    completeStoryArc('liang_chen_rival', choiceId);
    fullRender();
}

function onForbiddenClearForStoryQuests(groundId) {
    const arc = getStoryArcState('liang_chen_rival');
    if (arc?.status === 'active' && arc.stage === 3 && !arc.flags.delveComplete) {
        arc.flags.delveComplete = true;
        applyStoryArcRewards(STORY_ARCS.liang_chen_rival.rewards?.stage3);
        advanceStoryStage('liang_chen_rival', 4);
        addLog('⚔️ Liang Chen nods. "You survive forbidden trials. Now — sect or steel?"');
        setTimeout(() => openStoryResolutionPopup('liang_chen_rival'), 400);
    }
    if (groundId === 'celestial_observatory') onObservatoryClearedForQuest();
    if (typeof tryGrantAncientClueFromForbiddenClear === 'function') {
        tryGrantAncientClueFromForbiddenClear(groundId);
    }
}

// ----- Demonic redemption -----

function startDemonicRedemptionArc(npc) {
    if (!npc?.isDemonicTalent || !npc.demonicAllied) return false;
    ensureExtendedQuestState();
    if (G.demonicRedemption.status === 'active') return false;
    G.demonicRedemption = {
        status: 'active',
        targetUid: npc.uid,
        targetName: npc.name,
        stage: 2,
        startedMonths: G.ageMonths,
        flags: { bargained: true }
    };
    addLog(`📜 Path of the Prodigy begun — travel with ${npc.name}, then decide their fate.`);
    appendQuestJournalEntry({ kind: 'arc', arcId: 'demonic_redemption', title: 'Path of the Prodigy', status: 'active' });
    syncDemonicRedemptionQuestLog();
    return true;
}

function syncDemonicRedemptionQuestLog() {
    ensureNpcQuestState();
    const d = G.demonicRedemption;
    if (!d || d.status !== 'active') return;
    const existing = findNpcQuest(q => q.id === 'story_demonic_redemption');
    const objective = d.stage === 2
        ? 'Travel to another zone with your demonic ally without attacking them.'
        : 'Choose redemption or exploitation in the quest popup.';
    if (existing) {
        existing.objective = objective;
        existing.stage = d.stage;
        return;
    }
    G.npcQuests.push({
        id: 'story_demonic_redemption',
        type: 'philosophical',
        typeLabel: 'Philosophical',
        typeEmoji: '☯️',
        title: 'Path of the Prodigy',
        objective,
        stage: d.stage,
        stageName: d.stage === 2 ? 'The Escort' : 'The Crossroads',
        status: 'active',
        giverUid: d.targetUid,
        giverName: d.targetName || 'Demonic Talent',
        zoneHint: currentZone,
        startedMonths: d.startedMonths
    });
}

function openDemonicRedemptionPopup() {
    const def = STORY_ARCS.demonic_redemption;
    const popup = document.getElementById('questPopup');
    if (!popup) return;
    document.getElementById('questPopupTitle').textContent = '😈 Path of the Prodigy';
    document.getElementById('questPopupStage').textContent = 'Stage 3 · The Crossroads';
    document.getElementById('questPopupText').textContent =
        `${G.demonicRedemption.targetName || 'The prodigy'} awaits your judgment. The demonic qi can be purged — or weaponized.`;
    document.getElementById('questPopupChoices').innerHTML = def.resolutionChoices.map(c =>
        `<button type="button" class="popup-item quest-choice" data-demonic-res="${c.id}">
            <div class="name">${c.label}</div>
            <div class="desc">${c.desc}</div>
        </button>`
    ).join('');
    document.querySelectorAll('[data-demonic-res]').forEach(btn => {
        btn.onclick = function() { resolveDemonicRedemption(this.dataset.demonicRes); };
    });
    popup.classList.add('active');
}

function resolveDemonicRedemption(choiceId) {
    const def = STORY_ARCS.demonic_redemption;
    const choice = def.resolutionChoices.find(c => c.id === choiceId);
    const d = G.demonicRedemption;
    if (!choice || !d || d.status !== 'active') return;
    if (!advanceTime(3, 'Judging the demonic prodigy')) return;
    closeQuestPopup();
    addLog(choice.log);
    const npc = getWorldNpcByUid?.(d.targetUid);
    if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(choice.alignmentShift, 'demonic redemption');
    if (choiceId === 'redeem') {
        if (npc) {
            npc.demonicAllied = false;
            npc.isDemonicTalent = false;
            npc.role = 'disciple';
            npc.demonicThreat = 0;
        }
        const name = npc?.name || 'Redeemed Prodigy';
        if (!G.disciples.includes(name)) {
            if (typeof addSectDisciple === 'function') addSectDisciple(name, 'acolyte');
            else G.disciples.push(name);
        }
        applyStoryArcRewards(def.rewards?.disciple);
    } else {
        if (npc) {
            npc.demonicAllied = false;
            npc.demonicThreat = (npc.demonicThreat || 0) + 8;
        }
        applyStoryArcRewards(def.rewards?.enemy);
        if (typeof learnTechnique === 'function') learnTechnique('Demon Seal', { skipGates: true });
    }
    completeNpcQuestByGiver({ uid: d.targetUid }, 'demonic_confront');
    const q = findNpcQuest(x => x.id === 'story_demonic_redemption');
    if (q) { q.status = 'complete'; q.completedMonths = G.ageMonths; }
    d.status = 'complete';
    d.stage = 4;
    appendQuestJournalEntry({ kind: 'arc', arcId: 'demonic_redemption', title: 'Path of the Prodigy', resolution: choiceId, status: 'complete' });
    fullRender();
}

function tryAdvanceDemonicRedemptionOnTravel() {
    const d = G.demonicRedemption;
    if (d?.status === 'active' && d.stage === 3 && d.flags.traveledTogether) {
        openDemonicRedemptionPopup();
    }
}

// ----- Sect procedural quests -----

function getSectQuestDef(id) {
    return SECT_QUEST_DEFINITIONS[id] || null;
}

function getActiveSectQuestCount() {
    return (G.sectQuests || []).filter(q => q.status === 'active').length;
}

function hasActiveSectQuestDef(questDefId) {
    return (G.sectQuests || []).some(q => q.status === 'active' && q.questDefId === questDefId);
}

function getSectQuestLaunchBlockReason(questDefId) {
    const def = getSectQuestDef(questDefId);
    if (!def) return 'Unknown quest.';
    if (typeof isSectFounded === 'function' && !isSectFounded()) return 'Found a sect first.';
    if (def.minStage && typeof meetsStageRequirement === 'function' && !meetsStageRequirement(def.minStage)) {
        const stage = SECT_STAGES[def.minStage];
        return `Requires ${stage?.label || def.minStage} sect stage.`;
    }
    const discCount = typeof getDiscipleCount === 'function' ? getDiscipleCount() : (G.disciples?.length || 0);
    const heirloomCount = (G.sect?.heirlooms || G.sect?.treasures || []).length;
    if ((def.minDisciples || 0) > discCount) {
        return `Need ${def.minDisciples} disciples (have ${discCount}).`;
    }
    if ((def.minHeirlooms || 0) > 0 && (def.minGeneration || 0) > 0) {
        const gen = G.sect?.leaderGeneration || 1;
        if (gen < def.minGeneration && heirloomCount < def.minHeirlooms) {
            return `Requires Generation ${def.minGeneration}+ or ${def.minHeirlooms} enshrined heirloom(s).`;
        }
    } else if ((def.minHeirlooms || 0) > heirloomCount) {
        return `Need ${def.minHeirlooms} enshrined heirloom(s).`;
    } else if ((def.minGeneration || 0) > (G.sect?.leaderGeneration || 1)) {
        return `Requires Generation ${def.minGeneration} (currently ${G.sect?.leaderGeneration || 1}).`;
    }
    if (def.requiresHostileRival) {
        const hostile = typeof countHostileWorldSects === 'function' ? countHostileWorldSects() : 0;
        if (!hostile) return 'Requires a hostile sect on the jianghu map.';
    }
    if (def.requiresWorldSect) {
        const sects = typeof getWorldSects === 'function' ? getWorldSects().filter(s => !s.defeated) : [];
        if (!sects.length) return 'Requires other sects on the jianghu map.';
    }
    if (def.stonesCost && (G.stones || 0) < def.stonesCost) {
        return `Need ${def.stonesCost} Spirit Stones.`;
    }
    if (hasActiveSectQuestDef(questDefId)) return `${def.title} is already active.`;
    if (getActiveSectQuestCount() >= SECT_QUEST_BALANCE.maxActive) {
        return `Too many active sect quests (max ${SECT_QUEST_BALANCE.maxActive}).`;
    }
    return null;
}

function createSectQuestFromDef(def) {
    const discCount = typeof getDiscipleCount === 'function' ? getDiscipleCount() : (G.disciples?.length || 1);
    const scale = 1 + Math.min(discCount, 8) * 0.08;
    return {
        id: `sect_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`,
        questDefId: def.id,
        type: def.questType || 'legacy',
        title: def.title,
        objective: def.objective,
        description: def.description,
        emoji: def.emoji,
        status: 'active',
        template: def,
        startedMonths: G.ageMonths,
        deadlineMonths: G.ageMonths + (def.deadlineMonths || SECT_QUEST_BALANCE.deadlineMonths),
        scaledFame: Math.ceil((def.fame || 2) * scale),
        scaledFoundation: Math.ceil((def.foundation || 1) * scale),
        scaledStones: Math.ceil((def.stones || 10) * scale),
        scaledRenown: Math.ceil((def.renown || 0) * scale)
    };
}

function launchSectQuest(questDefId) {
    ensureExtendedQuestState();
    const def = getSectQuestDef(questDefId);
    const block = getSectQuestLaunchBlockReason(questDefId);
    if (block) return { success: false, message: block };
    if (def.months && !advanceTime(def.months, def.title)) {
        return { success: false, message: 'Your lifespan ends during the mission.' };
    }
    if (def.stonesCost) G.stones -= def.stonesCost;
    const sq = createSectQuestFromDef(def);
    if (def.completeOn === 'manual') {
        finishSectQuest(sq);
        if (typeof markSectActivity === 'function') markSectActivity();
        return { success: true, message: `${def.title} complete.` };
    }
    G.sectQuests.push(sq);
    syncSectQuestLog();
    if (typeof markSectActivity === 'function') markSectActivity();
    if (typeof appendSectChronicle === 'function') {
        appendSectChronicle(`Sect quest launched: ${def.title}.`, def.emoji || '📋');
    }
    addLog(`${def.emoji || '🏯'} Sect quest active: ${def.title} — ${def.objective}`);
    return { success: true, message: `${def.title} launched.` };
}

function generateSectQuest() {
    ensureExtendedQuestState();
    if (!G.disciples.length) return null;
    if (typeof isSectFounded === 'function' && !isSectFounded()) return null;
    if (getActiveSectQuestCount() >= SECT_QUEST_BALANCE.maxActive) return null;
    const pool = Object.values(SECT_QUEST_DEFINITIONS).filter(def => !getSectQuestLaunchBlockReason(def.id));
    if (!pool.length) return null;
    const weighted = [];
    pool.forEach(def => {
        const w = def.weight || 1;
        for (let i = 0; i < Math.ceil(w * 10); i++) weighted.push(def);
    });
    const def = weighted[Math.floor(Math.random() * weighted.length)];
    const sq = createSectQuestFromDef(def);
    if (def.completeOn === 'manual') {
        finishSectQuest(sq);
        return sq;
    }
    G.sectQuests.push(sq);
    addLog(`${def.emoji || '🏯'} Sect quest: ${sq.title} — ${sq.objective}`);
    syncSectQuestLog();
    return sq;
}

function syncSectQuestLog() {
    ensureNpcQuestState();
    (G.sectQuests || []).filter(q => q.status === 'active').forEach(sq => {
        const existing = findNpcQuest(q => q.id === sq.id);
        const def = sq.template || getSectQuestDef(sq.questDefId);
        const typeInfo = QUEST_TYPES[sq.type] || QUEST_TYPES.legacy;
        const payload = {
            id: sq.id,
            sectQuest: true,
            type: sq.type,
            typeLabel: typeInfo.label,
            typeEmoji: def?.emoji || typeInfo.emoji,
            title: `${def?.emoji || '🏯'} ${sq.title}`,
            objective: sq.objective,
            status: 'active',
            giverName: typeof getSectDisplayName === 'function' ? getSectDisplayName() : (G.sectName || 'Your Sect'),
            zoneHint: currentZone,
            startedMonths: sq.startedMonths
        };
        if (existing) Object.assign(existing, payload);
        else G.npcQuests.push(payload);
    });
}

function sectQuestMatchesTrigger(sq, trigger) {
    const tpl = sq.template || getSectQuestDef(sq.questDefId);
    if (!tpl) return false;
    if (tpl.completeOn === trigger) return true;
    if (trigger === 'combat' && (tpl.completeOn === 'combat' || tpl.requiresCombat)) return true;
    if (trigger === 'explore' && tpl.requiresExplore) return true;
    if (trigger === 'material' && tpl.material) return true;
    return false;
}

function tryCompleteSectQuests(trigger, context) {
    ensureExtendedQuestState();
    let completed = false;
    (G.sectQuests || []).forEach(sq => {
        if (sq.status !== 'active') return;
        const tpl = sq.template || getSectQuestDef(sq.questDefId);
        if (!sectQuestMatchesTrigger(sq, trigger)) return;
        if (trigger === 'material' && tpl.material && context?.material === tpl.material) {
            if ((G.materials?.[tpl.material] || 0) >= tpl.qty) {
                removeCraftMaterials?.({ [tpl.material]: tpl.qty });
                finishSectQuest(sq);
                completed = true;
            }
            return;
        }
        if (trigger === 'combat' || trigger === 'explore' || trigger === 'tribulation_pass'
            || trigger === 'raid' || trigger === 'diplomacy') {
            finishSectQuest(sq);
            completed = true;
        }
    });
    return completed;
}

function finishSectQuest(sq) {
    sq.status = 'complete';
    sq.completedMonths = G.ageMonths;
    const def = sq.template || getSectQuestDef(sq.questDefId) || {};
    const q = findNpcQuest(x => x.id === sq.id);
    if (q) { q.status = 'complete'; q.completedMonths = G.ageMonths; }
    if (typeof addFame === 'function') addFame(sq.scaledFame);
    else G.fame += sq.scaledFame;
    grantFoundation(sq.scaledFoundation);
    G.stones += sq.scaledStones;
    if (def.materials && typeof addCraftMaterial === 'function') {
        Object.entries(def.materials).forEach(([matId, qty]) => addCraftMaterial(matId, qty));
    }
    if (typeof ensureSectState === 'function') {
        ensureSectState();
        if (sq.scaledRenown) addSectRenown(sq.scaledRenown);
        else addSectRenown(Math.max(1, Math.floor((sq.scaledFame || 2) / 2)));
        if (def.respect || def.fear) {
            shiftSectReputation('sect_quest_complete', { respect: def.respect || 0, fear: def.fear || 0 });
        } else {
            shiftSectReputation('sect_quest_complete');
        }
    }
    if (typeof appendSectChronicle === 'function') {
        appendSectChronicle(`Quest complete: ${sq.title}.`, def.emoji || '✓');
    }
    const matMsg = def.materials
        ? ' · ' + Object.entries(def.materials).map(([id, qty]) => {
            const mat = typeof CRAFT_MATERIALS !== 'undefined' ? CRAFT_MATERIALS[id] : null;
            return `+${qty} ${mat?.name || id}`;
        }).join(', ')
        : '';
    addLog(`✓ Sect quest complete: ${sq.title} (+${sq.scaledFame} Fame, +${sq.scaledFoundation} Foundation, +${sq.scaledStones} Stones${sq.scaledRenown ? `, +${sq.scaledRenown} Renown` : ''}${matMsg})`);
    if (typeof tryGrantAncientClueFromSectQuest === 'function') {
        tryGrantAncientClueFromSectQuest(def, { zone: sq.zone || G.currentZone });
    }
    appendQuestJournalEntry({ kind: 'sect', title: sq.title, status: 'complete' });
}

function tickSectQuestGeneration(monthsPassed) {
    ensureExtendedQuestState();
    if (!G.disciples.length) return;
    if (typeof isSectFounded === 'function' && !isSectFounded()) return;
    G._sectQuestTick = (G._sectQuestTick || 0) + monthsPassed;
    if (G._sectQuestTick >= SECT_QUEST_BALANCE.tickMonths) {
        G._sectQuestTick = 0;
        const active = getActiveSectQuestCount();
        if (active < SECT_QUEST_BALANCE.maxActive && Math.random() < SECT_QUEST_BALANCE.randomChanceBase + G.disciples.length * 0.03) {
            generateSectQuest();
        }
    }
    (G.sectQuests || []).forEach(sq => {
        if (sq.status !== 'active') return;
        if (sq.deadlineMonths && G.ageMonths >= sq.deadlineMonths) {
            sq.status = 'failed';
            const q = findNpcQuest(x => x.id === sq.id);
            if (q) q.status = 'failed';
            addLog(`⏳ Sect quest failed (deadline): ${sq.title}`);
        }
    });
}

// ----- Wei world events -----

function trySpawnWeiWorldEvent(zoneId) {
    ensureExtendedQuestState();
    ensureNpcState();
    const wei = G.npcState?.wei_collector;
    if (!wei?.met) return;
    const activeWorld = (G.worldEventQuests || []).filter(q => q.status === 'active').length;
    if (activeWorld >= 1) return;
    if (Math.random() > 0.35) return;

    const key = zoneId === 'frostbite' ? 'wei_rumor_frostbite'
        : zoneId === 'emberwild' ? 'wei_rumor_emberwild'
            : zoneId === 'dustbone' ? 'wei_rumor_dustbone' : null;
    if (!key || G.worldEventQuests.some(q => q.templateId === key && q.status === 'active')) return;

    const tpl = WORLD_EVENT_TEMPLATES[key];
    const quest = {
        id: `world_${key}`,
        templateId: key,
        title: tpl.title,
        objective: tpl.objective,
        type: tpl.questType,
        zone: tpl.zone,
        status: 'active',
        deadlineMonths: G.ageMonths + tpl.deadlineMonths,
        startedMonths: G.ageMonths,
        giverName: tpl.giverName,
        rewards: tpl.rewards
    };
    G.worldEventQuests.push(quest);
    const zoneName = ZONES[zoneId]?.name || zoneId;
    addLog(`🧳 Wei the Collector sends word from the ${zoneName}: ${tpl.title}`);
    syncWorldEventQuestLog();
}

function syncWorldEventQuestLog() {
    ensureNpcQuestState();
    (G.worldEventQuests || []).filter(q => q.status === 'active').forEach(wq => {
        const existing = findNpcQuest(q => q.id === wq.id);
        const typeInfo = QUEST_TYPES[wq.type] || QUEST_TYPES.investigation;
        const remaining = Math.max(0, wq.deadlineMonths - G.ageMonths);
        const payload = {
            id: wq.id,
            worldEvent: true,
            type: wq.type,
            typeLabel: typeInfo.label,
            typeEmoji: typeInfo.emoji,
            title: wq.title,
            objective: `${wq.objective} (${remaining}mo left)`,
            status: 'active',
            giverName: wq.giverName,
            zoneHint: wq.zone,
            startedMonths: wq.startedMonths
        };
        if (existing) Object.assign(existing, payload);
        else G.npcQuests.push(payload);
    });
}

function tickWorldEventQuests() {
    ensureExtendedQuestState();
    (G.worldEventQuests || []).forEach(wq => {
        if (wq.status !== 'active') return;
        if (G.ageMonths > wq.deadlineMonths) {
            wq.status = 'failed';
            const q = findNpcQuest(x => x.id === wq.id);
            if (q) q.status = 'failed';
            addLog(`📜 World quest expired: ${wq.title}`);
        }
    });
}

function tryCompleteWorldEventOnExplore(zoneId) {
    ensureExtendedQuestState();
    (G.worldEventQuests || []).filter(q => q.status === 'active' && q.zone === zoneId).forEach(wq => {
        wq.status = 'complete';
        const q = findNpcQuest(x => x.id === wq.id);
        if (q) { q.status = 'complete'; q.completedMonths = G.ageMonths; }
        const r = wq.rewards || {};
        if (r.fame && typeof addFame === 'function') addFame(r.fame);
        else G.fame += r.fame || 0;
        grantFoundation(r.foundation || 0);
        G.stones += r.stones || 0;
        if (r.alignment && typeof shiftDaoAlignment === 'function') shiftDaoAlignment(r.alignment, 'Wei world quest');
        if (r.ancientClue && typeof addAncientClue === 'function') addAncientClue(r.ancientClue);
        addLog(`✓ ${wq.title} complete!`);
        appendQuestJournalEntry({ kind: 'world', title: wq.title, status: 'complete' });
    });
}

function tickQuestSystems(monthsPassed) {
    ensureExtendedQuestState();
    tickSectQuestGeneration(monthsPassed);
    tickWorldEventQuests();
    syncSectQuestLog();
    syncWorldEventQuestLog();
    syncDemonicRedemptionQuestLog();
}

// ----- NPC menu helpers -----

function getMerchantSuQuestActions() {
    const arc = getStoryArcState('dustbone_caravan');
    const actions = [
        { action: 'talk', label: '💬 Talk', desc: 'Speak with the caravan master' },
        { action: 'leave', label: '🚪 Leave', desc: 'Continue your journey' }
    ];
    if (!arc || arc.status === 'inactive') {
        actions.unshift({ action: 'caravan_accept', label: '🐫 Escort the caravan', desc: 'Escort to Heartlands — demonic ambush likely' });
    } else if (arc.status === 'active') {
        actions.unshift({ action: 'quest_progress', label: '📜 Caravan status', desc: 'Review escort progress' });
    }
    return actions;
}

function getLiangChenQuestActions() {
    const arc = getStoryArcState('liang_chen_rival');
    const actions = [
        { action: 'talk', label: '💬 Talk', desc: 'Exchange words with your rival' },
        { action: 'leave', label: '🚪 Leave', desc: 'Continue your journey' }
    ];
    if (!arc || arc.status === 'inactive') {
        actions.unshift({ action: 'liang_accept', label: '⚔️ Accept the rivalry', desc: 'Begin "Rival\'s Ascent" story arc' });
    } else if (arc.status === 'active' && arc.stage === 2) {
        actions.unshift({ action: 'liang_debate', label: '☯️ Philosophical debate', desc: 'Stage 2 — answer his challenge' });
    } else if (arc.status === 'active' && arc.stage === 3 && !arc.flags.delveComplete) {
        actions.unshift(
            { action: 'liang_duel', label: '⚔️ Duel instead', desc: 'Fight Liang Chen rather than delving' },
            { action: 'quest_progress', label: '📜 Arc progress', desc: 'Clear a forbidden ground together' }
        );
    } else if (arc.status === 'active') {
        actions.unshift({ action: 'quest_progress', label: '📜 Arc progress', desc: 'Review the rivalry' });
    }
    return actions;
}

function getElderHuaQuestActions(baseActions) {
    const arc = getStoryArcState('observatory_shard');
    if (arc?.status === 'inactive' && canStartStoryArcEx('observatory_shard')) {
        baseActions.unshift({
            action: 'observatory_quest',
            label: '🔭 Retrieve the shard',
            desc: 'Fetch quest — Celestial Observatory forbidden ground'
        });
    }
    if (arc?.status === 'active' && arc.stage === 3) {
        baseActions.unshift({
            action: 'observatory_return',
            label: '🔭 Deliver the shard',
            desc: 'Return the Observatory Shard to Elder Hua'
        });
    }
    return baseActions;
}

function resolveStoryArcGeneric(arcId, choiceId) {
    if (arcId === 'dustbone_caravan') resolveCaravanArc(choiceId);
    else if (arcId === 'liang_chen_rival') resolveLiangChenArc(choiceId);
    else if (arcId === 'lost_disciple') resolveLostDiscipleArc(choiceId);
    else if (arcId === 'forgotten_heir') resolveForgottenHeirArc(choiceId);
}

function openStoryResolutionPopupEx(arcId) {
    const def = STORY_ARCS[arcId];
    const state = getStoryArcState(arcId);
    if (!def || !state) return;
    const popup = document.getElementById('questPopup');
    if (!popup) return;
    document.getElementById('questPopupTitle').textContent = `☯️ ${def.stages[4]?.name || 'Resolution'}`;
    document.getElementById('questPopupStage').textContent = def.title + ' · Final choice';
    document.getElementById('questPopupText').textContent = def.stages[4]?.objective || 'Choose your path.';
    document.getElementById('questPopupChoices').innerHTML = (def.resolutionChoices || []).map(c => {
        const locked = c.requiresAlignment != null && (G.daoAlignment || 0) < c.requiresAlignment;
        return `<button type="button" class="popup-item quest-choice" data-arc-resolution="${arcId}" data-res-id="${c.id}" ${locked ? 'disabled style="opacity:0.55;"' : ''}>
            <div class="name">${c.label}</div>
            <div class="desc">${c.desc || ''}</div>
        </button>`;
    }).join('');
    document.querySelectorAll('[data-arc-resolution]').forEach(btn => {
        btn.onclick = function() {
            resolveStoryArcGeneric(this.dataset.arcResolution, this.dataset.resId);
        };
    });
    popup.classList.add('active');
}

function tickForgottenHeirArcOnExplore(zoneId) {
    const state = getStoryArcState('forgotten_heir');
    if (!state || state.status !== 'active') return;
    const def = STORY_ARCS.forgotten_heir;
    if (state.stage === 1 && zoneId === 'dustbone' && !state.flags.dustboneVisit) {
        state.flags.dustboneVisit = true;
        advanceStoryStage('forgotten_heir', 2);
        addLog('📜 A jade slip unseals in your qi sea — coordinates to a frost-covered shrine.');
    } else if (state.stage === 2 && zoneId === 'frostbite' && !state.flags.heirloomFound) {
        state.flags.heirloomFound = true;
        advanceStoryStage('forgotten_heir', 3);
        applyStoryArcRewards(def.rewards?.stage2);
        addLog('🏺 You recover a clan heirloom from the ice. The usurper still wears your seal.');
    }
}

function onExploreForStoryQuestsEx(zoneId) {
    if (typeof rollStoryClueOnExplore === 'function') rollStoryClueOnExplore(zoneId);
    if (typeof tryTriggerStoryConfrontation === 'function') tryTriggerStoryConfrontation(zoneId);
    tickForgottenHeirArcOnExplore(zoneId);
    tryCompleteWorldEventOnExplore(zoneId);
    if (typeof tryCompleteSectQuests === 'function') tryCompleteSectQuests('explore', { zone: zoneId });

    const liang = getStoryArcState('liang_chen_rival');
    if (liang?.status === 'active' && liang.stage === 3 && !liang.flags.delveComplete) {
        addLog('⚔️ Liang Chen waits for you to clear forbidden ground — or accept his duel.');
    }
}

function getQuestJournalEntries() {
    ensureExtendedQuestState();
    const entries = [...G.questJournal];
    Object.keys(STORY_ARCS).forEach(arcId => {
        const state = getStoryArcState(arcId);
        if (state?.status === 'active') {
            const def = STORY_ARCS[arcId];
            entries.unshift({
                kind: 'active',
                arcId,
                title: def.title,
                stage: state.stage,
                stageName: def.stages[state.stage]?.name,
                objective: typeof getStoryArcObjective === 'function' ? getStoryArcObjective(arcId) : '',
                months: state.startedMonths,
                status: 'active'
            });
        }
    });
    (G.sectQuests || []).filter(q => q.status === 'active').forEach(sq => {
        entries.unshift({ kind: 'sect', title: sq.title, objective: sq.objective, status: 'active', months: sq.startedMonths });
    });
    (G.worldEventQuests || []).filter(q => q.status === 'active').forEach(wq => {
        entries.unshift({ kind: 'world', title: wq.title, objective: wq.objective, status: 'active', months: wq.startedMonths });
    });
    if (G.ancients?.chronicle?.length) {
        G.ancients.chronicle.slice(0, 8).forEach(e => {
            entries.unshift({
                kind: 'ancient',
                title: e.title,
                objective: e.text,
                status: e.status || 'logged',
                months: e.months,
                resolution: e.resolution
            });
        });
    }
    return entries;
}
