// ============================================
// ANCIENTS.JS — Sealed Ancients, hidden sub-zones, search & unseal
// ============================================

function ensureAncientsState() {
    if (!G.ancients) {
        G.ancients = {
            clues: [],
            entrances: {},
            unsealed: [],
            activeSubZone: null,
            chronicle: [],
            guardiansDefeated: [],
            bargains: {},
            pendingBargain: null
        };
    }
    if (!G.ancients.clues) G.ancients.clues = [];
    if (!G.ancients.entrances) G.ancients.entrances = {};
    if (!G.ancients.unsealed) G.ancients.unsealed = [];
    if (!G.ancients.chronicle) G.ancients.chronicle = [];
    if (!G.ancients.guardiansDefeated) G.ancients.guardiansDefeated = [];
    if (!G.ancients.bargains) G.ancients.bargains = {};
    Object.keys(HIDDEN_SUBZONES).forEach(id => {
        if (!G.ancients.entrances[id]) G.ancients.entrances[id] = 'hidden';
    });
}

function appendAncientChronicleEntry(entry) {
    ensureAncientsState();
    G.ancients.chronicle.unshift({
        kind: 'ancient',
        months: G.ageMonths,
        ageLabel: typeof formatYears === 'function' ? formatYears(G.ageMonths) : '',
        ...entry
    });
    if (G.ancients.chronicle.length > 48) G.ancients.chronicle.length = 48;
    if (typeof appendQuestJournalEntry === 'function' && entry.journal !== false) {
        appendQuestJournalEntry({
            kind: 'ancient',
            title: entry.title || 'Sealed Site',
            objective: entry.text || entry.objective || '',
            status: entry.status || 'logged',
            months: G.ageMonths
        });
    }
}

function getUnsealedAncientCount() {
    ensureAncientsState();
    return G.ancients.unsealed.length;
}

function getAncientCompetitionPenalty() {
    const count = Math.max(0, getUnsealedAncientCount() - 1);
    if (!count) return 0;
    return Math.min(
        ANCIENTS_BALANCE.competitionPenaltyCap || 20,
        count * (ANCIENTS_BALANCE.competitionPenaltyPerUnseal || 5)
    );
}

function isAncientGuardianDefeated(subZoneId) {
    ensureAncientsState();
    return G.ancients.guardiansDefeated.includes(subZoneId);
}

function needsAncientGuardian(subZoneId) {
    const sub = getHiddenSubZoneDef(subZoneId);
    return !!(sub?.unseal?.requiresGuardian && sub.unseal.guardianKey);
}

function grantAncientClueForZone(zoneId, sourceLabel) {
    const pool = Object.values(ANCIENT_CLUES).filter(c => {
        if (c.zone !== zoneId) return false;
        ensureAncientsState();
        return !G.ancients.clues.includes(c.id);
    });
    if (!pool.length) return false;
    const clue = pool[Math.floor(Math.random() * pool.length)];
    if (addAncientClue(clue.id)) {
        if (sourceLabel) {
            appendAncientChronicleEntry({
                title: `Clue: ${clue.title}`,
                text: `${sourceLabel} — "${clue.text}"`,
                status: 'clue',
                subZoneId: clue.subZoneId,
                journal: false
            });
        }
        return true;
    }
    return false;
}

function tryGrantAncientClueFromNpc(npcId) {
    const hook = NPC_ANCIENT_CLUE_HOOKS?.[npcId];
    if (!hook || hook.testId) return false;
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    if (hook.zone && hook.zone !== zoneId) return false;
    ensureAncientsState();
    if (hook.clueId && G.ancients.clues.includes(hook.clueId)) return false;
    if (Math.random() > (hook.talkChance || ANCIENTS_BALANCE.npcTalkClueChance)) return false;
    if (hook.clueId) return addAncientClue(hook.clueId);
    return grantAncientClueForZone(zoneId, `${NPCS[npcId]?.name || npcId} spoke in riddles`);
}

function tryGrantAncientClueFromForbiddenClear(groundId) {
    const clueId = ANCIENT_FORBIDDEN_CLUES?.[groundId];
    if (!clueId) return false;
    return addAncientClue(clueId);
}

function tryGrantAncientClueFromSectQuest(def, context) {
    if (!def) return false;
    if (def.ancientClue) return addAncientClue(def.ancientClue);
    if (def.grantZoneAncientClue) {
        const zoneId = context?.zone || (typeof getLootZoneId === 'function' ? getLootZoneId() : G.currentZone);
        return grantAncientClueForZone(zoneId, 'Sect survey records');
    }
    return false;
}

function getSealedSitesChronicleSummary() {
    ensureAncientsState();
    const sites = Object.values(HIDDEN_SUBZONES).map(sub => {
        const status = getEntranceStatus(sub.id);
        const ancient = SEALED_ANCIENTS[sub.ancientId];
        const bargain = G.ancients.bargains[sub.id];
        return {
            subZoneId: sub.id,
            name: sub.name,
            emoji: sub.emoji,
            parentZone: sub.parentZone,
            status,
            ancientName: ancient?.name,
            bargain,
            hasClue: G.ancients.clues.some(cid => ANCIENT_CLUES[cid]?.subZoneId === sub.id)
        };
    });
    const penalty = getAncientCompetitionPenalty();
    return { sites, penalty, clueCount: G.ancients.clues.length, unsealedCount: G.ancients.unsealed.length };
}

function getHiddenSubZoneDef(subZoneId) {
    return HIDDEN_SUBZONES[subZoneId] || null;
}

function getSubZoneForParent(parentZoneId) {
    return Object.values(HIDDEN_SUBZONES).find(sz => sz.parentZone === parentZoneId) || null;
}

function getLootZoneId() {
    const active = typeof getActiveZoneId === 'function' ? getActiveZoneId() : currentZone;
    if (HIDDEN_SUBZONES[active]) return HIDDEN_SUBZONES[active].parentZone;
    return active;
}

function isInHiddenSubZone() {
    ensureAncientsState();
    return !!(G.ancients.activeSubZone && HIDDEN_SUBZONES[G.ancients.activeSubZone]);
}

function getDisplayZoneId() {
    return typeof getActiveZoneId === 'function' ? getActiveZoneId() : currentZone;
}

function getDisplayZoneDef() {
    const id = getDisplayZoneId();
    if (HIDDEN_SUBZONES[id]) return HIDDEN_SUBZONES[id];
    return ZONES[id] || null;
}

function hasAncientClueForZone(zoneId) {
    ensureAncientsState();
    const sub = getSubZoneForParent(zoneId);
    if (!sub) return false;
    return G.ancients.clues.some(cid => {
        const c = ANCIENT_CLUES[cid];
        return c && c.zone === zoneId;
    });
}

function getAncientCluesForZone(zoneId) {
    ensureAncientsState();
    return G.ancients.clues
        .map(id => ANCIENT_CLUES[id])
        .filter(c => c && c.zone === zoneId);
}

function addAncientClue(clueId) {
    const def = ANCIENT_CLUES[clueId];
    if (!def) return false;
    ensureAncientsState();
    if (G.ancients.clues.includes(clueId)) return false;
    G.ancients.clues.push(clueId);
    addLog(`📜 Ancient clue: ${def.title} — "${def.text}"`);
    appendAncientChronicleEntry({
        title: `Clue: ${def.title}`,
        text: def.text,
        status: 'clue',
        subZoneId: def.subZoneId,
        journal: false
    });
    if (typeof appendSectChronicle === 'function') {
        appendSectChronicle(`Clue found: ${def.title}`, '📜');
    }
    return true;
}

function rollAncientClueFromExplore(zoneId) {
    const parent = getLootZoneId();
    const zone = zoneId || parent;
    if (!zone || !ZONES[zone]) return null;
    if (Math.random() > ANCIENTS_BALANCE.clueExploreChance) return null;
    const pool = Object.values(ANCIENT_CLUES).filter(c => {
        if (c.zone !== zone) return false;
        ensureAncientsState();
        return !G.ancients.clues.includes(c.id);
    });
    if (!pool.length) return null;
    const clue = pool[Math.floor(Math.random() * pool.length)];
    addAncientClue(clue.id);
    return clue;
}

function getSearchPerceptionBonus() {
    const spiritPart = Math.min(
        ANCIENTS_BALANCE.perceptionCap,
        Math.floor((G.spirit || 0) / ANCIENTS_BALANCE.perceptionPerPercent)
    );
    const famePart = Math.min(
        ANCIENTS_BALANCE.fameCap,
        Math.floor((G.fame || 0) * ANCIENTS_BALANCE.famePerPercent)
    );
    const scarPart = typeof getScarExplorePerceptionBonus === 'function'
        ? Math.floor(getScarExplorePerceptionBonus() * 100)
        : 0;
    const transcend = typeof getTranscendenceExploreBonus === 'function'
        ? Math.floor(getTranscendenceExploreBonus() * 100)
        : 0;
    return spiritPart + famePart + scarPart + transcend;
}

function getSearchAffinityBonus(searchCfg) {
    if (!searchCfg?.affinity) return 0;
    const pts = G.affinities?.[searchCfg.affinity] || 0;
    if (pts < 20) return 0;
    return searchCfg.affinityBonus || 5;
}

function getSearchAlignmentBonus(searchCfg) {
    if (!searchCfg?.alignThreshold) return 0;
    if ((G.daoAlignment || 0) >= searchCfg.alignThreshold) return searchCfg.alignBonus || 10;
    return 0;
}

function getSearchSuccessRate(zoneId) {
    const sub = getSubZoneForParent(zoneId);
    if (!sub) return 0;
    const cfg = sub.search || {};
    let rate = cfg.base || 10;
    rate += getSearchAffinityBonus(cfg);
    rate += getSearchAlignmentBonus(cfg);
    if (hasAncientClueForZone(zoneId)) rate += cfg.clueBonus || 10;
    rate += getSearchPerceptionBonus();
    if (typeof getFactionSubZoneSearchBonus === 'function') rate += getFactionSubZoneSearchBonus(zoneId);
    rate -= getAncientCompetitionPenalty();
    return Math.max(5, Math.min(85, rate));
}

function getEntranceStatus(subZoneId) {
    ensureAncientsState();
    return G.ancients.entrances[subZoneId] || 'hidden';
}

function revealEntrance(subZoneId) {
    ensureAncientsState();
    const status = getEntranceStatus(subZoneId);
    if (status === 'unsealed') return false;
    G.ancients.entrances[subZoneId] = 'revealed';
    const def = getHiddenSubZoneDef(subZoneId);
    addLog(`🗝️ You find a sealed entrance: ${def?.emoji || ''} ${def?.name || subZoneId}!`);
    appendAncientChronicleEntry({
        title: `Entrance revealed: ${def?.name || subZoneId}`,
        text: `The seal weakens at the rim of ${ZONES[def?.parentZone]?.name || 'the wilds'}.`,
        status: 'revealed',
        subZoneId
    });
    if (typeof appendSectChronicle === 'function') {
        appendSectChronicle(`Entrance revealed: ${def?.name || subZoneId}`, '🗝️');
    }
    return true;
}

function isAncientUnsealed(subZoneId) {
    ensureAncientsState();
    return G.ancients.unsealed.includes(subZoneId) || getEntranceStatus(subZoneId) === 'unsealed';
}

function getSearchBlockReason() {
    if (G.gameOver || G.inCombat) return 'You cannot search now.';
    if (typeof isTribulationActive === 'function' && isTribulationActive()) return 'Heavenly tribulation blocks your search.';
    if (isInHiddenSubZone()) return 'Search the parent zone from the surface — you are already within a hidden realm.';
    const zoneId = getLootZoneId();
    const sub = getSubZoneForParent(zoneId);
    if (!sub) return 'No sealed sites are rumored in this region.';
    if (G.realmIdx < (sub.minRealm || 0)) {
        const realm = PATHS[G.path].realms[sub.minRealm] || `Realm ${sub.minRealm + 1}`;
        return `Requires ${realm} to search here.`;
    }
    if (isAncientUnsealed(sub.id)) return `${sub.name} is already unsealed.`;
    if (getEntranceStatus(sub.id) === 'revealed') return 'The entrance is already revealed — perform the unsealing ritual.';
    const qiCost = ANCIENTS_BALANCE.searchQiCost + Math.floor(G.realmIdx * 2);
    if ((G.qi || 0) < qiCost) return `Need ${qiCost} Qi to search.`;
    return null;
}

function performAncientSearch() {
    const block = getSearchBlockReason();
    if (block) return { success: false, message: block };

    const zoneId = getLootZoneId();
    const sub = getSubZoneForParent(zoneId);
    const qiCost = ANCIENTS_BALANCE.searchQiCost + Math.floor(G.realmIdx * 2);
    const zoneName = ZONES[zoneId]?.name || zoneId;

    if (!advanceTime(ACTION_MONTHS.ancientSearch, `Searching for sealed sites in ${zoneName}`)) {
        return { success: false, message: 'Your lifespan ends during the search.' };
    }
    G.qi -= qiCost;

    const rate = getSearchSuccessRate(zoneId);
    const roll = Math.random() * 100;
    if (roll < rate) {
        revealEntrance(sub.id);
        return {
            success: true,
            message: `Entrance revealed! (${Math.round(rate)}% chance)`,
            revealed: true
        };
    }

    addLog(`🔍 Your search finds nothing this time (${Math.round(rate)}% chance). The seal remains hidden.`);
    if (Math.random() < 0.2 && !hasAncientClueForZone(zoneId)) {
        const clue = Object.values(ANCIENT_CLUES).find(c => c.zone === zoneId && !G.ancients.clues.includes(c.id));
        if (clue) {
            addAncientClue(clue.id);
            addLog('📜 A fragment of resonance lingers — perhaps a clue for next time.');
        }
    }
    return { success: true, message: 'Search complete — no entrance found.', revealed: false };
}

function getUnsealBlockReason(subZoneId) {
    const sub = getHiddenSubZoneDef(subZoneId);
    if (!sub) return 'Unknown sealed site.';
    if (getEntranceStatus(subZoneId) !== 'revealed') return 'Reveal the entrance with Search first.';
    if (isAncientUnsealed(subZoneId)) return 'Already unsealed.';
    const parent = sub.parentZone;
    if (getLootZoneId() !== parent && getDisplayZoneId() !== parent) {
        return `You must be in ${ZONES[parent]?.name || parent} to unseal this site.`;
    }
    if (needsAncientGuardian(subZoneId) && !isAncientGuardianDefeated(subZoneId)) {
        return 'Slay the guardian beast before the ritual can begin.';
    }
    const cost = sub.unseal || {};
    if ((G.qi || 0) < (cost.qi || 0)) return `Need ${cost.qi} Qi for the ritual.`;
    if ((G.stones || 0) < (cost.stones || 0)) return `Need ${cost.stones} Spirit Stones.`;
    return null;
}

function startAncientGuardianFight(subZoneId) {
    const sub = getHiddenSubZoneDef(subZoneId);
    if (!sub) return { success: false, message: 'Unknown site.' };
    if (getEntranceStatus(subZoneId) !== 'revealed') return { success: false, message: 'Reveal the entrance first.' };
    if (isAncientGuardianDefeated(subZoneId)) return { success: false, message: 'The guardian is already slain.' };
    const key = sub.unseal?.guardianKey;
    const def = ENCOUNTER_ENEMIES[key];
    if (!def) return { success: false, message: 'No guardian defined for this seal.' };
    if (G.inCombat) return { success: false, message: 'Already in combat.' };

    const template = ENEMIES.find(e => e.name === def.template) || ENEMIES[Math.min(G.realmIdx, ENEMIES.length - 1)];
    let hp = Math.floor(calcEnemyHp(template, { context: 'normal' }) * (def.hpMult || 1));
    let dmg = Math.floor(calcEnemyDamage(template, { context: 'normal' }) * (def.dmgMult || 1));

    G.ancientGuardianCombat = { subZoneId, guardianKey: key };
    G.inCombat = true;
    G.defending = false;
    G.fortifyActive = false;
    G.combatLog = [];
    initCombatResource();
    updateShield();
    if (G.path === 'soul') G.shield = G.maxShield;

    G.enemy = {
        name: `${def.emoji || '⚔️'} ${def.name}`,
        hp,
        maxHp: hp,
        dmg,
        originalDmg: dmg,
        intimidateTurns: 0,
        isAncientGuardian: true,
        ancientSubZoneId: subZoneId
    };
    G.enemyMaxHp = hp;

    addCombatLog(`🔥 ${def.name} blocks the seal! (${hp} HP)`);
    addLog(`🐲 The ${sub.unseal?.barrierLabel || 'barrier'} stirs — ${def.name} awakens to defend the ancient!`);
    setupCombatActions();
    G.combatPhase = 'player';
    clearCombatTurnTimer();
    setCombatInputEnabled(true);
    updateCombatUI();
    document.getElementById('combatOverlay')?.classList.add('active');
    return { success: true, message: `Battle with ${def.name} begins!` };
}

function isAncientGuardianCombat() {
    return !!(G.ancientGuardianCombat && G.inCombat);
}

function ancientGuardianVictory() {
    const ctx = G.ancientGuardianCombat;
    if (!ctx) return;
    const sub = getHiddenSubZoneDef(ctx.subZoneId);
    const def = ENCOUNTER_ENEMIES[ctx.guardianKey];
    ensureAncientsState();
    if (!G.ancients.guardiansDefeated.includes(ctx.subZoneId)) {
        G.ancients.guardiansDefeated.push(ctx.subZoneId);
    }
    addCombatLog(`💀 ${def?.name || 'Guardian'} falls!`);
    addLog(`⚔️ The guardian crumbles. The ${sub?.unseal?.barrierLabel || 'seal'} can now be broken.`);
    appendAncientChronicleEntry({
        title: `Guardian slain: ${def?.name || 'Beast'}`,
        text: `${sub?.name || 'Sealed site'} — the ritual may proceed.`,
        status: 'guardian',
        subZoneId: ctx.subZoneId
    });

    G.inCombat = false;
    G.defending = false;
    G.ancientGuardianCombat = null;
    if (typeof clearCombatTurnTimer === 'function') clearCombatTurnTimer();
    document.getElementById('combatOverlay')?.classList.remove('active');
    G.enemy = null;
    if (typeof showCombatVictoryPopup === 'function') {
        G.foundation += 3;
        showCombatVictoryPopup({
            title: '⚔️ Guardian Slain',
            enemyName: def?.name || 'Guardian beast',
            subtitle: 'The unsealing ritual is now possible.',
            rewards: ['🗝️ Ritual unsealing unlocked', '🏛️ +3 Foundation']
        });
    } else {
        G.foundation += 3;
    }
    fullRender();
}

function ancientGuardianDefeat() {
    G.hp = Math.max(1, 1);
    G.inCombat = false;
    G.defending = false;
    G.ancientGuardianCombat = null;
    if (typeof clearCombatTurnTimer === 'function') clearCombatTurnTimer();
    document.getElementById('combatOverlay')?.classList.remove('active');
    G.enemy = null;
    addLog('💀 The guardian drives you back. The seal remains intact.');
    fullRender();
}

function performUnsealRitual(subZoneId) {
    const block = getUnsealBlockReason(subZoneId);
    if (block) return { success: false, message: block };

    const sub = getHiddenSubZoneDef(subZoneId);
    const cost = sub.unseal || {};
    const label = cost.barrierLabel || 'ancient barrier';

    if (!advanceTime(cost.months || ACTION_MONTHS.ancientUnseal, `Unsealing ${sub.name}`)) {
        return { success: false, message: 'Your lifespan ends during the ritual.' };
    }
    G.qi -= cost.qi || 0;
    G.stones -= cost.stones || 0;

    ensureAncientsState();
    G.ancients.entrances[subZoneId] = 'unsealed';
    if (!G.ancients.unsealed.includes(subZoneId)) G.ancients.unsealed.push(subZoneId);

    const ancient = SEALED_ANCIENTS[sub.ancientId];
    addLog(`🔓 The ${label} shatters! ${sub.emoji} ${sub.name} is unsealed.`);
    if (ancient) addLog(ancient.log || `${ancient.emoji} ${ancient.name} awakens.`);

    const unsealedCount = getUnsealedAncientCount();
    if (unsealedCount > 1) {
        const pen = getAncientCompetitionPenalty();
        addLog(`🌏 Word spreads — rival cultivators race for the remaining seals. Search elsewhere is ~${pen}% harder.`);
        appendAncientChronicleEntry({
            title: 'Jianghu stirs',
            text: `${unsealedCount} sealed sites opened. Competition for the rest intensifies (−${pen}% search).`,
            status: 'world',
            journal: false
        });
    }

    appendAncientChronicleEntry({
        title: `Unsealed: ${ancient?.name || sub.name}`,
        text: `${sub.name} lies open. The ancient awaits your choice.`,
        status: 'unsealed',
        subZoneId
    });

    if (ancient?.bargain) {
        G.ancients.pendingBargain = subZoneId;
        openAncientBargainPopup(subZoneId);
        return { success: true, message: `${sub.name} unsealed — the ancient offers a bargain.` };
    }

    return { success: true, message: `${sub.name} unsealed!` };
}

function openAncientBargainPopup(subZoneId) {
    const sub = getHiddenSubZoneDef(subZoneId);
    const ancient = sub ? SEALED_ANCIENTS[sub.ancientId] : null;
    const popup = document.getElementById('ancientBargainPopup');
    if (!popup || !ancient?.bargain) return;

    document.getElementById('ancientBargainTitle').textContent = `${ancient.emoji} ${ancient.name}`;
    document.getElementById('ancientBargainText').textContent = ancient.desc + ' How will you answer?';
    const choices = document.getElementById('ancientBargainChoices');
    const b = ancient.bargain;
    choices.innerHTML = `
        <button type="button" class="popup-item quest-choice ancient-bargain-choice" data-bargain="accept">
            <div class="name">✨ ${b.accept.label}</div>
            <div class="desc">${b.accept.desc}</div>
        </button>
        <button type="button" class="popup-item quest-choice ancient-bargain-choice bargain-dark" data-bargain="reject">
            <div class="name">☠️ ${b.reject.label}</div>
            <div class="desc">${b.reject.desc}</div>
        </button>`;
    choices.querySelectorAll('[data-bargain]').forEach(btn => {
        btn.addEventListener('click', function() {
            resolveAncientBargain(subZoneId, this.dataset.bargain);
            popup.classList.remove('active');
            if (typeof renderMapPopup === 'function') renderMapPopup();
            fullRender();
        });
    });
    popup.classList.add('active');
}

function applyAncientBargainReward(reward) {
    if (!reward) return [];
    const lines = [];
    if (reward.foundation) { G.foundation += reward.foundation; lines.push(`🏛️ +${reward.foundation} Foundation`); }
    if (reward.fame) {
        if (typeof addFame === 'function') addFame(reward.fame);
        else G.fame += reward.fame;
        lines.push(`⭐ +${reward.fame} Fame`);
    }
    if (reward.stones) { G.stones += reward.stones; lines.push(`💎 +${reward.stones} Stones`); }
    if (reward.will) { G.will += reward.will; lines.push(`💪 +${reward.will} Will`); }
    if (reward.spirit) { G.spirit += reward.spirit; lines.push(`👁️ +${reward.spirit} Spirit`); }
    if (reward.vitality) { G.vitality += reward.vitality; lines.push(`❤️ +${reward.vitality} Vitality`); }
    if (reward.qiDensity) {
        G.qiDensity = (G.qiDensity || 0) + reward.qiDensity;
        lines.push(`🌀 +${reward.qiDensity} Qi Density`);
    }
    if (reward.dmgMult) {
        G.dmgMult = (G.dmgMult || 1) + reward.dmgMult;
        lines.push(`⚔️ Damage multiplier +${Math.round(reward.dmgMult * 100)}%`);
    }
    if (typeof applyVitalityToMaxHp === 'function') applyVitalityToMaxHp();
    return lines;
}

function applyAncientBargainPenalty(penalty) {
    if (!penalty) return [];
    const lines = [];
    if (penalty.daoAlignment && typeof shiftDaoAlignment === 'function') {
        shiftDaoAlignment(penalty.daoAlignment, 'ancient bargain');
        lines.push(`☯️ Dao alignment ${penalty.daoAlignment > 0 ? '+' : ''}${penalty.daoAlignment}`);
    } else if (penalty.daoAlignment) {
        G.daoAlignment = clamp((G.daoAlignment || 0) + penalty.daoAlignment, -100, 100);
        lines.push(`☯️ Dao alignment ${penalty.daoAlignment > 0 ? '+' : ''}${penalty.daoAlignment}`);
    }
    if (penalty.maxHpBonus) {
        G.vitalityHpBonus = (G.vitalityHpBonus || 0) + penalty.maxHpBonus;
        if (typeof applyVitalityToMaxHp === 'function') applyVitalityToMaxHp();
        const cap = typeof getEffectiveMaxHp === 'function' ? getEffectiveMaxHp() : G.maxHp;
        G.hp = Math.min(G.hp, cap);
        lines.push(`❤️ Max HP ${penalty.maxHpBonus}`);
    }
    if (penalty.fame) {
        G.fame = Math.max(0, (G.fame || 0) + penalty.fame);
        lines.push(`⭐ Fame ${penalty.fame}`);
    }
    if (penalty.will) { G.will += penalty.will; lines.push(`💪 Will ${penalty.will}`); }
    if (penalty.spirit) { G.spirit += penalty.spirit; lines.push(`👁️ Spirit ${penalty.spirit}`); }
    return lines;
}

function resolveAncientBargain(subZoneId, choiceKey) {
    const sub = getHiddenSubZoneDef(subZoneId);
    const ancient = sub ? SEALED_ANCIENTS[sub.ancientId] : null;
    if (!ancient?.bargain) return;
    const pick = ancient.bargain[choiceKey === 'reject' ? 'reject' : 'accept'];
    if (!pick) return;

    ensureAncientsState();
    G.ancients.bargains[subZoneId] = choiceKey;
    G.ancients.pendingBargain = null;

    const rewardLines = applyAncientBargainReward(pick.reward);
    const penaltyLines = applyAncientBargainPenalty(pick.penalty);
    if (pick.alignment && typeof shiftDaoAlignment === 'function') {
        shiftDaoAlignment(pick.alignment, `${ancient.name} bargain`);
    }

    addLog(choiceKey === 'accept'
        ? `✨ ${ancient.name}: "${pick.label}" — the ancient's blessing settles upon you.`
        : `☠️ ${ancient.name}: you take what was not freely given. The dao records it.`);

    appendAncientChronicleEntry({
        title: `${ancient.name}: ${choiceKey === 'accept' ? 'Honored' : 'Plundered'}`,
        text: pick.label,
        status: 'bargain',
        subZoneId,
        resolution: choiceKey
    });

    if (typeof appendSectChronicle === 'function') {
        appendSectChronicle(`${ancient.name} — ${choiceKey === 'accept' ? 'honored' : 'plundered'}`, ancient.emoji || '🔓');
    }

    if (typeof showCombatVictoryPopup === 'function' && (rewardLines.length || penaltyLines.length)) {
        showCombatVictoryPopup({
            title: `${ancient.emoji} Ancient Bargain`,
            subtitle: pick.label,
            rewards: [...rewardLines, ...penaltyLines]
        });
    }
}

function rollSubZoneExploreLoot(subZoneId) {
    const table = SUBZONE_LOOT?.[subZoneId];
    if (!table) return null;
    const techPool = (table.techniques || []).map(name => ({
        name: `${name} Manual`,
        type: 'technique',
        value: 18,
        technique: name
    }));
    const rareTech = (table.rare || []).filter(i => i.type === 'technique');
    const manuals = [...rareTech, ...techPool];
    if (manuals.length && Math.random() < (ANCIENTS_BALANCE.subzoneManualChance || 0.2)) {
        return manuals[Math.floor(Math.random() * manuals.length)];
    }
    const roll = Math.random();
    if (roll < (ANCIENTS_BALANCE.subzoneUltraChance || 0.08) && table.ultra?.length) {
        return table.ultra[Math.floor(Math.random() * table.ultra.length)];
    }
    if (roll < (ANCIENTS_BALANCE.subzoneUltraChance || 0.08) + (ANCIENTS_BALANCE.subzoneRareChance || 0.26) && table.rare?.length) {
        const nonTech = table.rare.filter(i => i.type !== 'technique');
        const pool = nonTech.length ? nonTech : table.rare;
        return pool[Math.floor(Math.random() * pool.length)];
    }
    return table.common[Math.floor(Math.random() * table.common.length)];
}

function enterHiddenSubZone(subZoneId) {
    const sub = getHiddenSubZoneDef(subZoneId);
    if (!sub || !isAncientUnsealed(subZoneId)) return { success: false, message: 'You cannot enter yet.' };
    ensureAncientsState();
    G.ancients.activeSubZone = subZoneId;
    currentZone = subZoneId;
    G.currentZone = subZoneId;
    addLog(`🌀 You descend into ${sub.emoji} ${sub.name}.`);
    return { success: true, message: `Entered ${sub.name}.` };
}

function exitHiddenSubZone() {
    if (!isInHiddenSubZone()) return { success: false, message: 'You are not in a hidden sub-zone.' };
    const sub = getHiddenSubZoneDef(G.ancients.activeSubZone);
    const parent = sub?.parentZone || 'dustbone';
    G.ancients.activeSubZone = null;
    currentZone = parent;
    G.currentZone = parent;
    if (typeof getDefaultLocationForZone === 'function') {
        G.currentLocation = getDefaultLocationForZone(parent);
    }
    addLog(`🌀 You return to the ${ZONES[parent]?.emoji || ''} ${ZONES[parent]?.name || parent}.`);
    return { success: true, message: 'Returned to surface.' };
}

function renderAncientsZonePanelHtml(zoneId) {
    const sub = getSubZoneForParent(zoneId);
    if (!sub) return '';

    ensureAncientsState();
    const status = getEntranceStatus(sub.id);
    const clues = getAncientCluesForZone(zoneId);
    const rate = getSearchSuccessRate(zoneId);
    const qiCost = ANCIENTS_BALANCE.searchQiCost + Math.floor(G.realmIdx * 2);
    const here = getLootZoneId() === zoneId && !isInHiddenSubZone();

    let html = `<div class="ancients-zone-panel">
        <div class="ancients-zone-title">🔒 Sealed Site <span class="ancients-hidden-tag">Hidden</span></div>
        <div class="ancients-zone-hint">Rumors speak of <strong>${sub.emoji} ${sub.name}</strong> — not shown on the map until discovered.</div>`;

    if (clues.length) {
        html += `<div class="ancients-clue-list">`;
        clues.forEach(c => {
            html += `<div class="ancients-clue-row"><span class="ancients-clue-title">${c.title}</span><span class="ancients-clue-text">"${c.text}"</span></div>`;
        });
        html += `</div>`;
    } else {
        html += `<div class="ancients-zone-muted">No clues yet — explore, speak with NPCs, or search forbidden grounds.</div>`;
    }

    if (status === 'hidden' && here) {
        const comp = getAncientCompetitionPenalty();
        html += `<div class="ancients-search-meta">Search chance: ~${Math.round(rate)}% · ${qiCost} Qi · ${ACTION_MONTHS.ancientSearch}mo${comp ? ` · −${comp}% jianghu competition` : ''}${typeof getFactionSubZoneSearchBonus === 'function' && getFactionSubZoneSearchBonus(zoneId) ? ` · +${getFactionSubZoneSearchBonus(zoneId)}% faction charts` : ''}</div>`;
        html += `<button type="button" class="ancients-action-btn" data-ancient-search="${zoneId}">🔍 Search for Sealed Entrance</button>`;
    } else if (status === 'revealed') {
        const cost = sub.unseal || {};
        const guardianNeeded = needsAncientGuardian(sub.id) && !isAncientGuardianDefeated(sub.id);
        html += `<div class="ancients-revealed-banner">🗝️ Entrance revealed — ${cost.barrierLabel || 'barrier'} blocks the way.</div>`;
        if (getAncientCompetitionPenalty() > 0) {
            html += `<div class="ancients-zone-muted">🌏 Jianghu competition: −${getAncientCompetitionPenalty()}% search in other zones.</div>`;
        }
        if (guardianNeeded) {
            const gKey = cost.guardianKey;
            const gDef = gKey ? ENCOUNTER_ENEMIES[gKey] : null;
            html += `<div class="ancients-search-meta">${gDef?.emoji || '🐲'} ${gDef?.name || 'Guardian beast'} guards the seal — defeat it before the ritual.</div>`;
            if (here) {
                html += `<button type="button" class="ancients-action-btn ritual" data-ancient-guardian="${sub.id}">⚔️ Fight Guardian Beast</button>`;
            }
        } else {
            html += `<div class="ancients-search-meta">Unseal: ${cost.months || 12}mo · ${cost.qi || 0} Qi · ${cost.stones || 0} Stones</div>`;
            if (here) {
                html += `<button type="button" class="ancients-action-btn ritual" data-ancient-unseal="${sub.id}">🔓 Perform Unsealing Ritual</button>`;
            }
        }
    } else if (status === 'unsealed') {
        const ancient = SEALED_ANCIENTS[sub.ancientId];
        html += `<div class="ancients-revealed-banner unsealed">✨ ${ancient?.emoji || '🔓'} ${ancient?.name || 'Ancient'} — site open</div>`;
        if (here) {
            html += `<button type="button" class="ancients-action-btn" data-ancient-enter="${sub.id}">🌀 Enter ${sub.name}</button>`;
        }
        if (isInHiddenSubZone() && G.ancients.activeSubZone === sub.id) {
            html += `<button type="button" class="ancients-action-btn" data-ancient-exit="1">⬆ Return to ${ZONES[zoneId]?.name || zoneId}</button>`;
        }
    }

    html += `</div>`;
    return html;
}

function bindAncientsZonePanelEvents(container) {
    if (!container) return;
    container.querySelectorAll('[data-ancient-search]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = performAncientSearch();
            if (result.message) addLog(result.success ? `🔍 ${result.message}` : `🔍 ${result.message}`);
            if (typeof renderMapPopup === 'function') renderMapPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-ancient-unseal]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = performUnsealRitual(this.dataset.ancientUnseal);
            if (result.message) addLog(result.success ? `🔓 ${result.message}` : `🔓 ${result.message}`);
            if (typeof renderMapPopup === 'function') renderMapPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-ancient-guardian]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = startAncientGuardianFight(this.dataset.ancientGuardian);
            if (result.message) addLog(result.success ? `⚔️ ${result.message}` : `⚔️ ${result.message}`);
            fullRender();
        });
    });
    container.querySelectorAll('[data-ancient-enter]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = enterHiddenSubZone(this.dataset.ancientEnter);
            if (result.message) addLog(result.message);
            if (typeof renderMapPopup === 'function') renderMapPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-ancient-exit]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = exitHiddenSubZone();
            if (result.message) addLog(result.message);
            if (typeof renderMapPopup === 'function') renderMapPopup();
            fullRender();
        });
    });
}

function renderMapSubZoneBadges() {
    ensureAncientsState();
    Object.values(HIDDEN_SUBZONES).forEach(sub => {
        const card = document.querySelector(`.zone-card[data-zone="${sub.parentZone}"]`);
        if (!card) return;
        const status = getEntranceStatus(sub.id);
        let badge = card.querySelector('.subzone-badge');
        if (status === 'hidden') {
            if (badge) badge.remove();
            return;
        }
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'subzone-badge';
            card.appendChild(badge);
        }
        const label = status === 'unsealed' ? `✨ ${sub.name}` : `🗝️ ${sub.name}`;
        badge.textContent = label;
        badge.title = status === 'unsealed' ? 'Unsealed hidden zone' : 'Entrance discovered';
    });
}

function updateSearchButton() {
    const btn = document.getElementById('btnSearch');
    if (!btn) return;
    ensureAncientsState();
    const block = typeof getSearchBlockReason === 'function' ? getSearchBlockReason() : null;
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    const sub = getSubZoneForParent(zoneId);
    const qiCost = ANCIENTS_BALANCE.searchQiCost + Math.floor((G.realmIdx || 0) * 2);
    if (!sub) {
        btn.title = 'No sealed sites rumored in this region';
        btn.disabled = true;
        return;
    }
    const status = getEntranceStatus(sub.id);
    if (status === 'revealed') {
        btn.title = 'Entrance found — unseal via Map zone guide';
        btn.disabled = true;
        return;
    }
    if (status === 'unsealed') {
        btn.title = `${sub.name} already unsealed`;
        btn.disabled = true;
        return;
    }
    if (block) {
        btn.title = block;
        btn.disabled = !!block;
        return;
    }
    const rate = getSearchSuccessRate(zoneId);
    btn.disabled = false;
    btn.title = `Search for ${sub.name} · ~${Math.round(rate)}% · ${qiCost} Qi · ${ACTION_MONTHS.ancientSearch}mo`;
}
