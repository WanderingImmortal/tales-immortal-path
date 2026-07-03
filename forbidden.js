// ============================================
// FORBIDDEN.JS — Hidden grounds framework & trials
// ============================================

function createEmptyForbiddenGrounds() {
    const grounds = {};
    Object.keys(FORBIDDEN_GROUNDS).forEach(id => {
        grounds[id] = { rumor: false, fragment: false, resonance: false, unlocked: false, cleared: false, rewardsClaimed: false, clearCount: 0 };
    });
    return grounds;
}

function ensureForbiddenState() {
    if (!G.forbidden) {
        G.forbidden = { grounds: createEmptyForbiddenGrounds(), activeTrial: null, trialState: null };
    }
    if (!G.forbidden.grounds) G.forbidden.grounds = createEmptyForbiddenGrounds();
    Object.keys(FORBIDDEN_GROUNDS).forEach(id => {
        if (!G.forbidden.grounds[id]) {
            G.forbidden.grounds[id] = { rumor: false, fragment: false, resonance: false, unlocked: false, cleared: false, rewardsClaimed: false, clearCount: 0 };
        } else {
            const p = G.forbidden.grounds[id];
            if (p.rewardsClaimed == null) p.rewardsClaimed = !!p.cleared;
            if (p.clearCount == null) p.clearCount = p.cleared ? 1 : 0;
        }
    });
    if (!G.forbiddenTitles) G.forbiddenTitles = [];
}

function getGroundProgress(id) {
    ensureForbiddenState();
    return G.forbidden.grounds[id];
}

function clueCount(progress) {
    return (progress.rumor ? 1 : 0) + (progress.fragment ? 1 : 0) + (progress.resonance ? 1 : 0);
}

function groundsInZone(zoneId) {
    return Object.entries(FORBIDDEN_GROUNDS)
        .filter(([, g]) => g.zone === zoneId)
        .map(([id]) => id);
}

function isGroundDiscovered(id) {
    return clueCount(getGroundProgress(id)) > 0;
}

function forbiddenDiscoveredCount() {
    return Object.keys(FORBIDDEN_GROUNDS).filter(id => isGroundDiscovered(id)).length;
}

function forbiddenClearedCount() {
    return Object.keys(FORBIDDEN_GROUNDS).filter(id => getGroundProgress(id).cleared).length;
}

function tryUnlockGround(id) {
    const p = getGroundProgress(id);
    if (p.unlocked || clueCount(p) < 3) return;
    p.unlocked = true;
    const g = FORBIDDEN_GROUNDS[id];
    addLog(`🌑 ${g.unlockText}`);
}

function grantClue(id, type) {
    const p = getGroundProgress(id);
    if (p[type]) return false;
    p[type] = true;
    const g = FORBIDDEN_GROUNDS[id];
    if (type === 'rumor') addLog(`📜 Rumor (${g.emoji} ${g.name}): ${g.clues.rumor}`);
    else if (type === 'fragment') {
        addLog(`🧩 Fragment (${g.name}): ${g.clues.fragment.text}`);
        if (!G.inventory) G.inventory = [];
        if (!G.inventory.includes(g.clues.fragment.item)) G.inventory.push(g.clues.fragment.item);
    } else if (type === 'resonance') addLog(`☯️ Dao Resonance (${g.name}): ${g.clues.resonance}`);
    tryUnlockGround(id);
    refreshForbiddenPopupIfOpen();
    return true;
}

function refreshForbiddenPopupIfOpen() {
    const popup = document.getElementById('forbiddenPopup');
    if (popup && popup.classList.contains('active')) renderForbiddenPopup();
}

function nextMissingClueType(id) {
    const p = getGroundProgress(id);
    if (!p.rumor) return 'rumor';
    if (!p.fragment) return 'fragment';
    if (!p.resonance) return 'resonance';
    return null;
}

function pickGroundForClue(zoneId, preferType) {
    const candidates = groundsInZone(zoneId).filter(id => {
        const missing = nextMissingClueType(id);
        return missing && (!preferType || missing === preferType);
    });
    if (candidates.length === 0) return null;
    return candidates[Math.floor(Math.random() * candidates.length)];
}

function grantRandomClueInZone(preferType) {
    const groundId = pickGroundForClue(currentZone, preferType) || pickGroundForClue(currentZone, null);
    if (!groundId) return false;
    const missing = nextMissingClueType(groundId);
    if (!missing) return false;
    return grantClue(groundId, missing);
}

function rollForbiddenClueFromExplore() {
    if (G.realmIdx < FORBIDDEN_BALANCE.searchRealmMin) return;
    if (Math.random() >= FORBIDDEN_BALANCE.exploreFragmentChance) return;
    const groundId = pickGroundForClue(currentZone, 'fragment');
    if (groundId) grantClue(groundId, 'fragment');
}

function rollForbiddenClueFromDao() {
    if (G.realmIdx < FORBIDDEN_BALANCE.searchRealmMin) return;
    if (!G.trueDaos || G.trueDaos.length < 1) return;
    const groundId = pickGroundForClue(currentZone, 'resonance');
    if (groundId) grantClue(groundId, 'resonance');
}

function actionForbidden() {
    if (G.gameOver) return;
    ensureForbiddenState();
    renderForbiddenPopup();
    document.getElementById('forbiddenPopup').classList.add('active');
}

function actionForbiddenSearch() {
    if (G.gameOver || G.inCombat || G.forbidden?.activeTrial) return;
    if (G.realmIdx < FORBIDDEN_BALANCE.searchRealmMin) {
        addLog(`🌑 You are too weak to perceive hidden paths. Need Core Formation.`);
        refreshForbiddenPopupIfOpen();
        fullRender();
        return;
    }
    const zoneGrounds = groundsInZone(currentZone);
    if (zoneGrounds.length === 0) {
        addLog(`🌑 No legends tie this place to forbidden grounds.`);
        refreshForbiddenPopupIfOpen();
        fullRender();
        return;
    }
    if (!advanceTime(ACTION_MONTHS.forbiddenSearch, 'Searching for forbidden secrets')) {
        fullRender();
        return;
    }
    const roll = Math.random();
    if (roll < FORBIDDEN_BALANCE.searchClueChance + FORBIDDEN_BALANCE.searchFragmentChance) {
        const prefer = roll < FORBIDDEN_BALANCE.searchClueChance ? 'rumor' : 'fragment';
        if (!grantRandomClueInZone(prefer)) {
            addLog(`🌑 Something stirs — but the clue slips away unfinished.`);
        }
    } else if (roll < 0.85) {
        const stones = 3 + Math.floor(Math.random() * 8);
        G.stones += stones;
        addLog(`🌑 Legends hide well. You find only wind — and ${stones} stones overlooked.`);
    } else {
        G.foundation += 1;
        addLog(`🌑 You sense something watching, but it slips away. +1 Foundation from the attempt.`);
    }
    refreshForbiddenPopupIfOpen();
    fullRender();
}

function canEnterForbiddenGround(id) {
    const g = FORBIDDEN_GROUNDS[id];
    const p = getGroundProgress(id);
    if (!g.implemented || !p.unlocked) return false;
    if (p.cleared && !FORBIDDEN_BALANCE.repeatableTrials) return false;
    return true;
}

function enterForbiddenGround(id) {
    const g = FORBIDDEN_GROUNDS[id];
    const p = getGroundProgress(id);
    if (!g.implemented) {
        addLog(`🌑 ${g.name} awaits — but its trial is not yet manifest in this world.`);
        return;
    }
    if (!canEnterForbiddenGround(id)) return;
    if (G.realmIdx < FORBIDDEN_BALANCE.enterRealmMin) {
        addLog(`🌑 You must reach Nascent Soul before entering ${g.name}.`);
        return;
    }
    if (G.inCombat || G.forbidden.activeTrial) return;

    const isRepeat = p.clearCount > 0;
    if (!isRepeat || !FORBIDDEN_BALANCE.skipEnterTimeOnRepeat) {
        if (!advanceTime(ACTION_MONTHS.forbiddenEnter, `Venturing toward ${g.name}`)) {
            fullRender();
            return;
        }
    } else {
        addLog(`🔥 Re-entering ${g.name} (playtest — no travel time).`);
    }

    document.getElementById('forbiddenPopup').classList.remove('active');
    addLog(`🌑 ${g.enterFlavor}`);
    G.forbidden.activeTrial = id;
    if (g.trialType === 'mirror') startMirrorLakeTrial();
    else if (g.trialType === 'garden') startAshenGardenTrial();
    else if (g.trialType === 'crucible') startIronCrucibleTrial();
    else if (g.trialType === 'silence') startSilentMountainTrial();
    else if (g.trialType === 'maw') startWhisperingMawTrial();
    else if (g.trialType === 'temple') startSunkenTempleTrial();
    else if (g.trialType === 'observatory') startObservatoryTrial();
}

function exitForbiddenTrial() {
    G.forbidden.activeTrial = null;
    G.forbidden.trialState = null;
    G.mirrorTrial = false;
    G.crucibleTrial = false;
    G.silenceTrial = false;
    G.mawTrial = false;
    document.getElementById('gardenOverlay')?.classList.remove('active');
    document.getElementById('silenceOverlay')?.classList.remove('active');
    document.getElementById('mawOverlay')?.classList.remove('active');
    document.getElementById('templeOverlay')?.classList.remove('active');
    document.getElementById('observatoryOverlay')?.classList.remove('active');
}

function clearForbiddenGround(id, tier) {
    const p = getGroundProgress(id);
    const firstClear = !p.cleared;
    p.cleared = true;
    p.clearCount = (p.clearCount || 0) + 1;
    exitForbiddenTrial();

    if (!p.rewardsClaimed) {
        if (id === 'mirror_lake') applyMirrorLakeRewards();
        else if (id === 'ashen_garden') applyAshenGardenRewards(tier);
        else if (id === 'iron_crucible') applyIronCrucibleRewards();
        else if (id === 'silent_mountain') applySilentMountainRewards(tier);
        else if (id === 'whispering_maw') applyWhisperingMawRewards(tier);
        else if (id === 'sunken_temple') applySunkenTempleRewards(tier);
        else if (id === 'celestial_observatory') applyObservatoryRewards(tier);
        p.rewardsClaimed = true;
        addLog(`🌟 FORBIDDEN GROUND CLEARED: ${FORBIDDEN_GROUNDS[id].emoji} ${FORBIDDEN_GROUNDS[id].name}!`);
    } else if (FORBIDDEN_BALANCE.repeatableTrials) {
        addLog(`🌟 ${FORBIDDEN_GROUNDS[id].name} conquered again! (Rewards already claimed — playtest replay.)`);
    }
    refreshForbiddenPopupIfOpen();
    if (typeof onForbiddenClearForStoryQuests === 'function') onForbiddenClearForStoryQuests(id);
    fullRender();
}

function failForbiddenTrial(id, message) {
    addLog(`🌑 ${message}`);
    exitForbiddenTrial();
    fullRender();
}

// ===== MIRROR LAKE =====

function isMirrorTrial() {
    return !!(G.forbidden && G.forbidden.activeTrial === 'mirror_lake' && G.inCombat);
}

function estimatePlayerAttackDmg() {
    return estimateTypicalHitDamage();
}

function startMirrorLakeTrial() {
    G.forbidden.trialState = {
        patternBroken: false,
        actionHistory: [],
        mirrorTurn: 0,
        playerLastAction: null,
        lastActionType: null,
        sameStreak: 0
    };
    G.mirrorTrial = true;
    startMirrorCombat();
}

function startMirrorCombat() {
    G.inCombat = true;
    G.defending = false;
    G.fortifyActive = false;
    G.combatLog = [];
    initCombatResource();
    updateShield();
    if (G.path === 'soul') G.shield = G.maxShield;

    const mirrorHp = Math.floor(G.maxHp * FORBIDDEN_BALANCE.mirrorHpMult);
    const mirrorDmg = estimatePlayerAttackDmg();

    G.enemy = {
        name: 'Your Reflection',
        hp: mirrorHp,
        maxHp: mirrorHp,
        dmg: mirrorDmg,
        originalDmg: mirrorDmg,
        intimidateTurns: 0,
        isMirror: true,
        defending: false
    };
    G.enemyMaxHp = G.enemy.maxHp;

    addCombatLog(`🪞 Your reflection steps from the lake — ${mirrorHp} HP, mirroring your power.`);
    addCombatLog(`🪞 Repeating the same move feeds it. Use Attack, Guard, and Techniques in turn.`);
    setupCombatActions();
    updateCombatUI();
    document.getElementById('cbFlee').disabled = true;
    document.getElementById('cbFlee').style.opacity = '0.4';
    document.getElementById('combatOverlay').classList.add('active');
}

function trackMirrorAction(actionType) {
    if (!isMirrorTrial()) return;
    const ts = G.forbidden.trialState;
    ts.playerLastAction = actionType;

    if (actionType === ts.lastActionType) {
        ts.sameStreak = (ts.sameStreak || 1) + 1;
    } else {
        ts.sameStreak = 1;
    }
    ts.lastActionType = actionType;

    ts.actionHistory.push(actionType);
    if (ts.actionHistory.length > FORBIDDEN_BALANCE.mirrorPatternLength) {
        ts.actionHistory.shift();
    }
    if (!ts.patternBroken && ts.actionHistory.length >= FORBIDDEN_BALANCE.mirrorPatternLength) {
        const unique = new Set(ts.actionHistory);
        if (unique.size >= FORBIDDEN_BALANCE.mirrorPatternLength) {
            ts.patternBroken = true;
            ts.sameStreak = 0;
            addCombatLog(`🪞 Your rhythm shatters! The reflection falters — full damage unlocked.`);
        }
    }

    if (!ts.patternBroken && ts.sameStreak >= 2) {
        addCombatLog(`🪞 Echo ×${ts.sameStreak}! The mirror grows stronger from your repetition.`);
    }
}

function applyMirrorDamageToReflection(dmg) {
    if (!isMirrorTrial()) return dmg;
    const ts = G.forbidden.trialState;
    if (!ts.patternBroken) {
        dmg = Math.floor(dmg * (1 - FORBIDDEN_BALANCE.mirrorDamageReduction));
    }
    if ((ts.sameStreak || 0) >= 2) {
        dmg = Math.max(1, Math.floor(dmg * FORBIDDEN_BALANCE.mirrorRepeatDamageMult));
    }
    return dmg;
}

function mirrorReflectionRegen() {
    const ts = G.forbidden.trialState;
    if (ts.patternBroken || !G.enemy) return;
    const heal = Math.max(1, Math.floor(G.enemy.maxHp * FORBIDDEN_BALANCE.mirrorRegenPct));
    const before = G.enemy.hp;
    G.enemy.hp = Math.min(G.enemy.maxHp, G.enemy.hp + heal);
    if (G.enemy.hp > before) {
        addCombatLog(`🪞 The reflection mends from your predictable flow (+${G.enemy.hp - before} HP).`);
    }
}

function mirrorCopyDamage(actionType) {
    let dmg = typeof calcBasicAttackDamage === 'function'
        ? calcBasicAttackDamage()
        : estimatePlayerAttackDmg();
    if (actionType === 'technique') {
        dmg = Math.floor(dmg * 1.35);
    }
    const ts = G.forbidden.trialState;
    if (!ts.patternBroken) {
        dmg = Math.floor(dmg * FORBIDDEN_BALANCE.mirrorCopyDamageMult);
    }
    if ((ts.sameStreak || 0) >= 2) {
        dmg = Math.floor(dmg * (1 + FORBIDDEN_BALANCE.mirrorEchoPerStreak * ts.sameStreak));
    }
    return dmg + Math.floor(Math.random() * 3);
}

function mirrorOpponentTurn() {
    if (!G.inCombat || !G.enemy) return;
    const ts = G.forbidden.trialState;
    ts.mirrorTurn = (ts.mirrorTurn || 0) + 1;

    mirrorReflectionRegen();

    if (G.enemy.defending) {
        addCombatLog(`🪞 Your reflection holds a mirrored stance.`);
        G.enemy.defending = false;
    } else if (ts.mirrorTurn === 1) {
        addCombatLog(`🪞 Your reflection waits, studying your opening move.`);
    } else if (!ts.patternBroken && ts.playerLastAction) {
        mirrorExecuteCopiedAction(ts.playerLastAction);
    } else {
        const actions = ['attack', 'secondary', 'technique'];
        mirrorExecuteCopiedAction(actions[Math.floor(Math.random() * actions.length)]);
    }

    if (G.hp <= 0) {
        forbiddenMirrorDefeat();
        return;
    }

    if (isMirrorTrial()) {
        mirrorPlayerRegenOnly();
    } else {
        combatEndOfTurnRegen();
    }
    updateCombatUI();
}

function mirrorPlayerRegenOnly() {
    const cfg = getCombatConfig();
    const resGain = Math.max(1, Math.floor((typeof getCombatResourceRegenGain === 'function' ? getCombatResourceRegenGain() : cfg.regen(G)) * 0.5));
    const before = G.combatResource;
    G.combatResource = Math.min(G.maxCombatResource, G.combatResource + resGain);
    if (G.combatResource > before) {
        addCombatLog(`${cfg.icon} +${G.combatResource - before} ${cfg.resource} (mirror trial).`);
    }
    if (G.path === 'soul') {
        const shieldGain = Math.max(1, Math.floor((Math.floor(G.will / 4) + 1) * 0.5));
        const sb = G.shield;
        G.shield = Math.min(G.maxShield, G.shield + shieldGain);
        if (G.shield > sb) addCombatLog(`🧠 Soul Shield +${G.shield - sb} (weakened).`);
    }
}

function mirrorExecuteCopiedAction(actionType) {
    const ts = G.forbidden.trialState;
    if (actionType === 'attack' || actionType === 'technique') {
        const echoNote = (ts.sameStreak || 0) >= 2 ? ' (echo amplified!)' : '';
        resolveEnemyStrike(`Your Reflection${echoNote}`, mirrorCopyDamage(actionType), {});
    } else {
        addCombatLog(`🪞 The reflection mirrors your guard — bracing for your next move.`);
        G.enemy.defending = true;
    }
}

function forbiddenMirrorVictory() {
    G.enemy.hp = 0;
    addCombatLog(`🪞 Your reflection shatters into ripples of light!`);
    G.inCombat = false;
    G.defending = false;
    G.mirrorTrial = false;
    document.getElementById('combatOverlay').classList.remove('active');
    document.getElementById('cbFlee').disabled = false;
    document.getElementById('cbFlee').style.opacity = '';
    G.enemy = null;
    clearForbiddenGround('mirror_lake');
}

function forbiddenMirrorDefeat() {
    G.hp = Math.max(1, 1);
    addCombatLog(`🪞 Your reflection sends you back to shore, broken but breathing.`);
    G.inCombat = false;
    G.defending = false;
    G.mirrorTrial = false;
    document.getElementById('combatOverlay').classList.remove('active');
    document.getElementById('cbFlee').disabled = false;
    document.getElementById('cbFlee').style.opacity = '';
    G.enemy = null;
    failForbiddenTrial('mirror_lake', 'Mirror Lake rejects you — for now.');
}

function applyMirrorLakeRewards() {
    learnTechnique('Mirror Step');
    G.fame += 15;
    G.foundation += 10;
    if (!G.forbiddenTitles.includes('Reflection Walker')) G.forbiddenTitles.push('Reflection Walker');
    addLog(`📜 Learned Mirror Step! +15 Fame, +10 Foundation. Title: Reflection Walker.`);
}

// ===== ASHEN GARDEN =====

function formatGardenChoiceMeta(c) {
    const parts = [];
    parts.push(`⏳ ${c.months} mo`);
    if (c.decayBonus) {
        parts.push(`🥀 ${c.decayBonus} Decay`);
    } else if (c.decay > 0) {
        parts.push(`🥀 +${c.decay} Decay`);
    } else {
        parts.push('🥀 No Decay');
    }
    if (c.hp) parts.push(c.hp > 0 ? `❤️ +${c.hp} HP` : `❤️ ${c.hp} HP`);
    if (c.stones) parts.push(`💎 ${c.stones > 0 ? '+' : ''}${c.stones} stones`);
    if (c.foundation) parts.push(`⭐ +${c.foundation} Foundation`);
    if (c.fame) parts.push(`🌟 +${c.fame} Fame`);
    if (c.require) {
        const statName = { will: 'Will', vitality: 'Vitality', spirit: 'Spirit' }[c.require.stat] || c.require.stat;
        parts.push(`📊 ${statName} ${c.require.min}+`);
    }
    if (c.final) parts.push('🏁 Final step');
    return parts.join(' · ');
}

function renderGardenDecayStatus(ts) {
    const cap = FORBIDDEN_BALANCE.gardenDecayCap;
    let line = `🥀 Decay: ${ts.decay} / ${cap}`;
    if (ts.decay >= FORBIDDEN_BALANCE.gardenDecayCritical) {
        line += ' — CRITICAL: each step costs heavy lifespan';
    } else if (ts.decay >= FORBIDDEN_BALANCE.gardenDecayHigh) {
        line += ' — High: each step costs extra months';
    } else if (ts.decay > 0) {
        line += ' — Life force withering';
    } else {
        line += ' — Life force holds steady';
    }
    return line;
}

function startAshenGardenTrial() {
    G.forbidden.trialState = { step: 0, decay: 0 };
    addLog(`🥀 ${ASHEN_GARDEN_INTRO}`);
    renderGardenTrial();
    document.getElementById('gardenOverlay').classList.add('active');
}

function renderGardenTrial() {
    const ts = G.forbidden.trialState;
    const node = ASHEN_GARDEN_NODES[ts.step];
    const title = document.getElementById('gardenTitle');
    const text = document.getElementById('gardenText');
    const decay = document.getElementById('gardenDecay');
    const intro = document.getElementById('gardenIntro');
    const choices = document.getElementById('gardenChoices');
    if (!node || !choices) return;

    title.textContent = `🥀 Ashen Garden — Step ${ts.step + 1}/${ASHEN_GARDEN_NODES.length}`;
    text.textContent = node.text;
    decay.textContent = renderGardenDecayStatus(ts);
    if (intro) {
        intro.textContent = ts.step === 0 ? ASHEN_GARDEN_INTRO : '';
        intro.style.display = ts.step === 0 ? 'block' : 'none';
    }

    choices.innerHTML = node.choices.map((c, i) => {
        const flavor = c.flavor ? `<div class="garden-choice-flavor">${c.flavor}</div>` : '';
        return `<button type="button" class="popup-item garden-choice" data-idx="${i}">
            <div class="name">${c.label}</div>
            ${flavor}
            <div class="garden-choice-meta">${formatGardenChoiceMeta(c)}</div>
        </button>`;
    }).join('');

    choices.querySelectorAll('.garden-choice').forEach(btn => {
        btn.addEventListener('click', function() {
            gardenChoose(parseInt(this.dataset.idx, 10));
        });
    });
}

function gardenMeetsRequire(req) {
    if (!req) return true;
    const val = G[req.stat] || 0;
    return val >= req.min;
}

function gardenApplyChoice(c) {
    const ts = G.forbidden.trialState;
    if (!gardenMeetsRequire(c.require)) {
        addLog(`🥀 ${c.failLog || 'You fail.'}`);
        if (c.fail) gardenApplyEffects(c.fail);
        else gardenApplyEffects({ months: c.months, decay: c.decay || 1 });
        return;
    }
    addLog(`🥀 ${c.log}`);
    gardenApplyEffects(c);
}

function gardenApplyEffects(effects) {
    const ts = G.forbidden.trialState;
    let months = effects.months || 6;
    if (G.forbiddenLifespanMult && G.forbiddenLifespanMult > 1) {
        months = Math.max(1, Math.floor(months / G.forbiddenLifespanMult));
    }

    if (ts.decay >= FORBIDDEN_BALANCE.gardenDecayHigh) months += 3;
    if (ts.decay >= FORBIDDEN_BALANCE.gardenDecayCritical) months += 6;

    if (!advanceTime(months, 'Walking the Ashen Garden')) {
        failForbiddenTrial('ashen_garden', 'Your lifespan ends among the ash.');
        document.getElementById('gardenOverlay').classList.remove('active');
        return;
    }

    let decayAdd = effects.decay || 0;
    if (effects.decayBonus) decayAdd += effects.decayBonus;
    const decayBefore = ts.decay;
    ts.decay = Math.max(0, ts.decay + decayAdd);

    if (decayAdd !== 0) {
        addLog(`🥀 Decay ${decayAdd > 0 ? '+' : ''}${decayAdd} → now ${ts.decay}/${FORBIDDEN_BALANCE.gardenDecayCap}`);
    }
    if (ts.decay >= FORBIDDEN_BALANCE.gardenDecayHigh && decayBefore < FORBIDDEN_BALANCE.gardenDecayHigh) {
        addLog(`⚠️ High Decay — each step forward will cost extra months of lifespan.`);
    }
    if (ts.decay >= FORBIDDEN_BALANCE.gardenDecayCritical && decayBefore < FORBIDDEN_BALANCE.gardenDecayCritical) {
        addLog(`⚠️ Critical Decay — the garden hungers. Lifespan cost surges.`);
    }

    if (effects.hp) G.hp = clamp(G.hp + effects.hp, 1, G.maxHp);
    if (effects.stones) G.stones = Math.max(0, G.stones + effects.stones);
    if (effects.fame) G.fame += effects.fame;
    if (effects.foundation) G.foundation += effects.foundation;

    if (ts.decay >= FORBIDDEN_BALANCE.gardenDecayCap) {
        document.getElementById('gardenOverlay').classList.remove('active');
        failForbiddenTrial('ashen_garden', 'Decay consumes you. The garden claims another cultivator.');
        return;
    }

    if (effects.final) {
        document.getElementById('gardenOverlay').classList.remove('active');
        let tier = 'survivor';
        if (ts.decay <= 4) tier = 'pure';
        else if (ts.decay <= 8) tier = 'balanced';
        clearForbiddenGround('ashen_garden', tier);
        return;
    }

    ts.step += 1;
    if (ts.step >= ASHEN_GARDEN_NODES.length) {
        document.getElementById('gardenOverlay').classList.remove('active');
        clearForbiddenGround('ashen_garden', 'balanced');
        return;
    }
    renderGardenTrial();
}

function gardenChoose(idx) {
    const ts = G.forbidden.trialState;
    const node = ASHEN_GARDEN_NODES[ts.step];
    if (!node || !node.choices[idx]) return;
    gardenApplyChoice(node.choices[idx]);
    fullRender();
}

function gardenQuitTrial() {
    document.getElementById('gardenOverlay').classList.remove('active');
    failForbiddenTrial('ashen_garden', 'You flee the Ashen Garden.');
}

function applyAshenGardenRewards(tier) {
    const fragName = 'Fragment of the Ashen Cycle';
    if (!G.daoFragments.includes(fragName)) {
        G.daoFragments.push(fragName);
        addLog(`📜 Dao Fragment acquired: ${fragName}`);
    }
    if (!G.legendaryMaterials) G.legendaryMaterials = [];
    if (!G.legendaryMaterials.includes('Heartwood Ash')) {
        G.legendaryMaterials.push('Heartwood Ash');
        addLog(`🏆 Legendary Material: Heartwood Ash`);
    }
    G.fame += 20;
    G.foundation += 12;

    if (tier === 'pure') {
        G.forbiddenLifespanMult = 1.08;
        if (!G.forbiddenTitles.includes('The Unwithered')) G.forbiddenTitles.push('The Unwithered');
        addLog(`✨ Title: The Unwithered. Lifespan costs reduced ~8%.`);
    } else if (tier === 'balanced') {
        G.forbiddenLifespanMult = 1.05;
        if (!G.forbiddenTitles.includes('Ash Walker')) G.forbiddenTitles.push('Ash Walker');
        addLog(`✨ Title: Ash Walker. Lifespan costs reduced ~5%.`);
    } else {
        if (!G.forbiddenTitles.includes('Ash Survivor')) G.forbiddenTitles.push('Ash Survivor');
        addLog(`✨ Title: Ash Survivor.`);
    }
}

// ===== IRON CRUCIBLE =====

const CRUCIBLE_WAVE_NAMES = [
    'Slagling',
    'Tempered Shade',
    'Iron Fiend',
    'Forge Wraith',
    'Crucible Keeper'
];

function isCrucibleTrial() {
    return !!(G.forbidden && G.forbidden.activeTrial === 'iron_crucible' && G.inCombat);
}

function startIronCrucibleTrial() {
    G.forbidden.trialState = {
        wave: 1,
        maxWaves: FORBIDDEN_BALANCE.crucibleWaves
    };
    G.crucibleTrial = true;
    addLog(`🔥 Iron Crucible — survive ${FORBIDDEN_BALANCE.crucibleWaves} waves. No pills. Only your path's passive strength.`);
    spawnCrucibleWave(1, true);
}

function spawnCrucibleWave(wave, isFirst) {
    const template = pickCrucibleTemplate(wave);
    const enemyHp = calcEnemyHp(template, { context: 'crucible', wave });
    const enemyDmg = calcEnemyDamage(template, { context: 'crucible', wave });
    const waveName = CRUCIBLE_WAVE_NAMES[wave - 1] || template.name;

    if (isFirst) {
        G.inCombat = true;
        G.defending = false;
        G.fortifyActive = false;
        G.combatLog = [];
        initCombatResource();
        updateShield();
        if (G.path === 'soul') G.shield = G.maxShield;
        setupCombatActions();
        document.getElementById('cbFlee').disabled = true;
        document.getElementById('cbFlee').style.opacity = '0.4';
        document.getElementById('combatOverlay').classList.add('active');
    }

    G.enemy = {
        name: `Wave ${wave}/${FORBIDDEN_BALANCE.crucibleWaves} — ${waveName}`,
        hp: enemyHp,
        maxHp: enemyHp,
        dmg: enemyDmg,
        originalDmg: enemyDmg,
        intimidateTurns: 0,
        isCrucible: true
    };
    G.enemyMaxHp = G.enemy.maxHp;

    addCombatLog(`🔥 Wave ${wave}: ${waveName} emerges! (${enemyHp} HP)`);
    if (wave > 1) {
        addCombatLog(`🔥 The heat gives no mercy — fight on with what remains.`);
    }
    updateCombatUI();
}

function crucibleBetweenWavesRest() {
    const cfg = getCombatConfig();
    const resGain = Math.floor(G.maxCombatResource * FORBIDDEN_BALANCE.crucibleBetweenWaveResourcePct);
    const before = G.combatResource;
    G.combatResource = Math.min(G.maxCombatResource, G.combatResource + resGain);
    if (G.combatResource > before) {
        addCombatLog(`${cfg.icon} +${G.combatResource - before} ${cfg.resource} (brief respite).`);
    }
    if (G.path === 'qi' || G.path === 'soul') {
        const shieldGain = Math.floor(G.maxShield * 0.15);
        const sb = G.shield;
        G.shield = Math.min(G.maxShield, G.shield + shieldGain);
        if (G.shield > sb) addCombatLog(`🛡️ Barrier recovers +${G.shield - sb}.`);
    }
}

function crucibleWaveCleared(fromTechnique) {
    const ts = G.forbidden.trialState;
    addCombatLog(`💀 Wave ${ts.wave} broken!`);

    if (ts.wave >= ts.maxWaves) {
        forbiddenCrucibleVictory();
        return;
    }

    ts.wave += 1;
    crucibleBetweenWavesRest();
    spawnCrucibleWave(ts.wave, false);
    updateCombatUI();
    fullRender();
}

function forbiddenCrucibleVictory() {
    G.inCombat = false;
    G.defending = false;
    G.fortifyActive = false;
    G.crucibleTrial = false;
    document.getElementById('combatOverlay').classList.remove('active');
    document.getElementById('cbFlee').disabled = false;
    document.getElementById('cbFlee').style.opacity = '';
    G.enemy = null;
    clearForbiddenGround('iron_crucible');
}

function forbiddenCrucibleDefeat() {
    G.hp = Math.max(1, 1);
    addCombatLog(`🔥 The Crucible spits you out, broken but breathing.`);
    G.inCombat = false;
    G.defending = false;
    G.crucibleTrial = false;
    document.getElementById('combatOverlay').classList.remove('active');
    document.getElementById('cbFlee').disabled = false;
    document.getElementById('cbFlee').style.opacity = '';
    G.enemy = null;
    failForbiddenTrial('iron_crucible', 'The Iron Crucible rejects your endurance — for now.');
}

function applyIronCrucibleRewards() {
    if (!G.legendaryMaterials) G.legendaryMaterials = [];
    if (!G.legendaryMaterials.includes('Crucible Slag')) {
        G.legendaryMaterials.push('Crucible Slag');
        addLog(`🏆 Legendary Material: Crucible Slag`);
    }
    G.crucibleRegenMult = 1.12;
    G.fame += 25;
    G.foundation += 15;
    if (!G.forbiddenTitles.includes('The Unbroken')) G.forbiddenTitles.push('The Unbroken');
    addLog(`✨ Title: The Unbroken. +12% combat resource recovery. +25 Fame, +15 Foundation.`);
}

// ===== SILENT MOUNTAIN =====

function formatSilenceChoiceMeta(c) {
    const parts = [];
    if (c.months) parts.push(`⏳ ${c.months} mo`);
    if (c.noise > 0) parts.push(`🔊 +${c.noise} Noise`);
    else if (c.noise === 0 && c.noiseBonus == null) parts.push('🔇 Quiet');
    if (c.noiseBonus) parts.push(`🔇 ${c.noiseBonus} Noise`);
    if (c.foundation) parts.push(`⭐ +${c.foundation} Foundation`);
    if (c.stones) parts.push(`💎 ${c.stones > 0 ? '+' : ''}${c.stones} stones`);
    if (c.require?.noiseMax != null) parts.push(`🔇 Noise ≤ ${c.require.noiseMax}`);
    if (c.require?.stat) {
        const statName = { will: 'Will', qi: 'Qi', spirit: 'Spirit' }[c.require.stat] || c.require.stat;
        parts.push(`📊 ${statName} ${c.require.min}+`);
    }
    if (c.combat) parts.push('⚔️ Warden fight');
    if (c.final) parts.push('🏁 Summit');
    return parts.join(' · ');
}

function renderSilenceMeterStatus(ts) {
    const cap = FORBIDDEN_BALANCE.silenceCap;
    let line = `🔇 Noise: ${ts.noise} / ${cap}`;
    if (ts.noise >= FORBIDDEN_BALANCE.silenceCritical) {
        line += ' — CRITICAL: each step costs heavy lifespan';
    } else if (ts.noise >= FORBIDDEN_BALANCE.silenceHigh) {
        line += ' — High: the mountain listens too closely';
    } else if (ts.noise > 0) {
        line += ' — Echoes gather';
    } else {
        line += ' — Perfect silence';
    }
    return line;
}

function startSilentMountainTrial() {
    G.forbidden.trialState = { step: 0, noise: 0, phase: 'climb' };
    addLog(`🏔️ ${SILENT_MOUNTAIN_INTRO}`);
    renderSilenceTrial();
    document.getElementById('silenceOverlay').classList.add('active');
}

function renderSilenceTrial() {
    const ts = G.forbidden.trialState;
    const node = SILENT_MOUNTAIN_NODES[ts.step];
    const title = document.getElementById('silenceTitle');
    const text = document.getElementById('silenceText');
    const meter = document.getElementById('silenceMeter');
    const intro = document.getElementById('silenceIntro');
    const choices = document.getElementById('silenceChoices');
    if (!node || !choices) return;

    title.textContent = `🏔️ Silent Mountain — Step ${ts.step + 1}/${SILENT_MOUNTAIN_NODES.length}`;
    text.textContent = node.text;
    meter.textContent = renderSilenceMeterStatus(ts);
    if (intro) {
        intro.textContent = ts.step === 0 ? SILENT_MOUNTAIN_INTRO : '';
        intro.style.display = ts.step === 0 ? 'block' : 'none';
    }

    choices.innerHTML = node.choices.map((c, i) => {
        const flavor = c.flavor ? `<div class="silence-choice-flavor">${c.flavor}</div>` : '';
        return `<button type="button" class="popup-item silence-choice" data-idx="${i}">
            <div class="name">${c.label}</div>
            ${flavor}
            <div class="silence-choice-meta">${formatSilenceChoiceMeta(c)}</div>
        </button>`;
    }).join('');

    choices.querySelectorAll('.silence-choice').forEach(btn => {
        btn.addEventListener('click', function() {
            silenceChoose(parseInt(this.dataset.idx, 10));
        });
    });
}

function silenceMeetsRequire(req, ts) {
    if (!req) return true;
    if (req.noiseMax != null) return ts.noise <= req.noiseMax;
    const val = G[req.stat] || 0;
    return val >= req.min;
}

function silenceChoose(idx) {
    const ts = G.forbidden.trialState;
    const node = SILENT_MOUNTAIN_NODES[ts.step];
    if (!node || !node.choices[idx]) return;
    silenceApplyChoice(node.choices[idx]);
    fullRender();
}

function silenceApplyChoice(c) {
    const ts = G.forbidden.trialState;
    if (!silenceMeetsRequire(c.require, ts)) {
        addLog(`🏔️ ${c.failLog || 'The mountain rejects your approach.'}`);
        if (c.fail) silenceApplyEffects(c.fail);
        else silenceApplyEffects({ months: c.months, noise: c.noise || 1 });
        return;
    }
    if (c.quit) {
        document.getElementById('silenceOverlay').classList.remove('active');
        failForbiddenTrial('silent_mountain', 'You descend before the peak yields its secret.');
        return;
    }
    addLog(`🏔️ ${c.log}`);
    silenceApplyEffects(c);
}

function silenceApplyEffects(effects) {
    const ts = G.forbidden.trialState;
    let months = effects.months || 6;
    if (G.forbiddenLifespanMult && G.forbiddenLifespanMult > 1) {
        months = Math.max(1, Math.floor(months / G.forbiddenLifespanMult));
    }
    if (ts.noise >= FORBIDDEN_BALANCE.silenceHigh) months += 3;
    if (ts.noise >= FORBIDDEN_BALANCE.silenceCritical) months += 6;

    if (!advanceTime(months, 'Climbing Silent Mountain')) {
        failForbiddenTrial('silent_mountain', 'Your lifespan ends in the mute snow.');
        document.getElementById('silenceOverlay').classList.remove('active');
        return;
    }

    let noiseAdd = effects.noise || 0;
    if (effects.noiseBonus) noiseAdd += effects.noiseBonus;
    const noiseBefore = ts.noise;
    ts.noise = Math.max(0, Math.min(FORBIDDEN_BALANCE.silenceCap, ts.noise + noiseAdd));

    if (noiseAdd !== 0) {
        addLog(`🔇 Noise ${noiseAdd > 0 ? '+' : ''}${noiseAdd} → now ${ts.noise}/${FORBIDDEN_BALANCE.silenceCap}`);
    }
    if (ts.noise >= FORBIDDEN_BALANCE.silenceHigh && noiseBefore < FORBIDDEN_BALANCE.silenceHigh) {
        addLog(`⚠️ High Noise — the mountain's echo hungers.`);
    }
    if (ts.noise >= FORBIDDEN_BALANCE.silenceCritical && noiseBefore < FORBIDDEN_BALANCE.silenceCritical) {
        addLog(`⚠️ Critical Noise — lifespan cost surges on each step.`);
    }

    if (effects.foundation) G.foundation += effects.foundation;
    if (effects.stones) G.stones = Math.max(0, G.stones + effects.stones);

    if (ts.noise >= FORBIDDEN_BALANCE.silenceCap) {
        document.getElementById('silenceOverlay').classList.remove('active');
        failForbiddenTrial('silent_mountain', 'The mountain swallows your presence. Noise becomes oblivion.');
        return;
    }

    if (effects.combat) {
        document.getElementById('silenceOverlay').classList.remove('active');
        startSilentMountainCombat();
        return;
    }

    if (effects.final) {
        document.getElementById('silenceOverlay').classList.remove('active');
        let tier = 'balanced';
        if (ts.noise <= 2) tier = 'pure';
        else if (ts.noise <= 5) tier = 'still';
        clearForbiddenGround('silent_mountain', tier);
        return;
    }

    ts.step += 1;
    if (ts.step >= SILENT_MOUNTAIN_NODES.length) {
        document.getElementById('silenceOverlay').classList.remove('active');
        clearForbiddenGround('silent_mountain', 'balanced');
        return;
    }
    renderSilenceTrial();
}

function silenceQuitTrial() {
    document.getElementById('silenceOverlay').classList.remove('active');
    failForbiddenTrial('silent_mountain', 'You flee the Silent Mountain.');
}

function isSilenceTrial() {
    return !!(G.forbidden && G.forbidden.activeTrial === 'silent_mountain' && G.inCombat);
}

function trackSilenceCombatAction(actionType) {
    if (!isSilenceTrial()) return false;
    const ts = G.forbidden.trialState;
    const fb = FORBIDDEN_BALANCE;
    const threshold = fb.silenceEchoThreshold + (G.silenceEchoResist || 0);
    let add = 0;
    if (actionType === 'attack') add = fb.silenceCombatNoiseAttack;
    else if (actionType === 'technique') add = fb.silenceCombatNoiseTechnique;
    else if (actionType === 'secondary') add = -fb.silenceCombatNoiseReduceDefend;
    else if (actionType === 'intimidate') add = fb.silenceCombatNoiseAttack;

    if (add !== 0) {
        ts.noise = Math.max(0, Math.min(fb.silenceCap, ts.noise + add));
        if (add > 0) addCombatLog(`🔇 Noise +${add} → ${ts.noise}/${fb.silenceCap}`);
        else addCombatLog(`🔇 Noise ${add} → ${ts.noise}/${fb.silenceCap}`);
    }

    if (ts.noise >= threshold && add > 0) {
        silenceMountainEcho();
        if (G.hp <= 0) {
            forbiddenSilenceDefeat();
            return true;
        }
    }
    return false;
}

function silenceMountainEcho() {
    const ts = G.forbidden.trialState;
    const fb = FORBIDDEN_BALANCE;
    const dmg = Math.max(3, Math.floor(G.maxHp * fb.silenceEchoHpPct));
    const result = resolveEnemyStrike('Mountain Echo', dmg, {});
    if (G.hp <= 0) {
        forbiddenSilenceDefeat();
    }
}

function startSilentMountainCombat() {
    G.silenceTrial = true;
    G.inCombat = true;
    G.defending = false;
    G.fortifyActive = false;
    G.combatLog = [];
    initCombatResource();
    updateShield();
    if (G.path === 'soul') G.shield = G.maxShield;

    const ts = G.forbidden.trialState;
    const template = ENEMIES.find(e => e.name === 'Void Horror') || ENEMIES[Math.min(4, ENEMIES.length - 1)];
    let enemyHp = calcEnemyHp(template, { context: 'crucible', wave: 1 });
    let enemyDmg = calcEnemyDamage(template, { context: 'crucible', wave: 1 });
    if (ts.noise <= 3) {
        enemyHp = Math.floor(enemyHp * 0.9);
        enemyDmg = Math.floor(enemyDmg * 0.85);
        addCombatLog(`🔇 Your quiet ascent unsettles the warden.`);
    } else if (ts.noise >= 7) {
        enemyHp = Math.floor(enemyHp * 1.15);
        enemyDmg = Math.floor(enemyDmg * 1.2);
        G.combatResource = Math.floor(G.combatResource * 0.75);
        addCombatLog(`🔊 Your Noise empowers the warden!`);
    }

    G.enemy = {
        name: 'Silent Warden',
        hp: enemyHp,
        maxHp: enemyHp,
        dmg: enemyDmg,
        originalDmg: enemyDmg,
        intimidateTurns: 0
    };
    G.enemyMaxHp = G.enemy.maxHp;

    addCombatLog(`🏔️ The Silent Warden rises! (${enemyHp} HP) Noise: ${ts.noise}/${FORBIDDEN_BALANCE.silenceCap}`);
    addCombatLog(`🔇 Attacks add Noise. Defend to quiet yourself. Echo strikes at ${FORBIDDEN_BALANCE.silenceEchoThreshold}+ Noise.`);
    setupCombatActions();
    G.combatPhase = 'player';
    clearCombatTurnTimer();
    setCombatInputEnabled(true);
    updateCombatUI();
    document.getElementById('cbFlee').disabled = true;
    document.getElementById('cbFlee').style.opacity = '0.4';
    document.getElementById('combatOverlay').classList.add('active');
}

function forbiddenSilenceVictory() {
    G.inCombat = false;
    G.defending = false;
    G.silenceTrial = false;
    document.getElementById('combatOverlay').classList.remove('active');
    document.getElementById('cbFlee').disabled = false;
    document.getElementById('cbFlee').style.opacity = '';
    G.enemy = null;
    const ts = G.forbidden.trialState;
    let tier = 'balanced';
    if (ts.noise <= 4) tier = 'still';
    if (ts.noise <= 2) tier = 'pure';
    clearForbiddenGround('silent_mountain', tier);
}

function forbiddenSilenceDefeat() {
    G.hp = Math.max(1, 1);
    addCombatLog(`🏔️ The mountain casts you down, still breathing.`);
    G.inCombat = false;
    G.defending = false;
    G.silenceTrial = false;
    document.getElementById('combatOverlay').classList.remove('active');
    document.getElementById('cbFlee').disabled = false;
    document.getElementById('cbFlee').style.opacity = '';
    G.enemy = null;
    failForbiddenTrial('silent_mountain', 'Silent Mountain rejects the noise you carry.');
}

function applySilentMountainRewards(tier) {
    if (!G.legendaryMaterials) G.legendaryMaterials = [];
    if (!G.legendaryMaterials.includes('Peak Silence Stone')) {
        G.legendaryMaterials.push('Peak Silence Stone');
        addLog(`🏆 Legendary Material: Peak Silence Stone`);
    }
    G.will += 3;
    G.foundation += 12;
    G.fame += 20;
    if (tier === 'pure') {
        G.silenceEchoResist = 1;
        if (!G.forbiddenTitles.includes('Voice of the Peak')) G.forbiddenTitles.push('Voice of the Peak');
        addLog(`✨ Title: Voice of the Peak. +3 Will. Echo threshold +1 in future silence trials.`);
    } else if (tier === 'still') {
        if (!G.forbiddenTitles.includes('Stone Listener')) G.forbiddenTitles.push('Stone Listener');
        addLog(`✨ Title: Stone Listener. +3 Will, +12 Foundation, +20 Fame.`);
    } else {
        if (!G.forbiddenTitles.includes('Mute Survivor')) G.forbiddenTitles.push('Mute Survivor');
        addLog(`✨ Title: Mute Survivor.`);
    }
}

// ===== WHISPERING MAW =====

function formatMawChoiceMeta(c) {
    const parts = [];
    if (c.months) parts.push(`⏳ ${c.months} mo`);
    if (c.doubt > 0) parts.push(`👄 +${c.doubt} Doubt`);
    else if (c.doubt < 0) parts.push(`✨ ${c.doubt} Doubt`);
    else if (c.doubt === 0) parts.push('😐 Steady');
    if (c.hp) parts.push(c.hp > 0 ? `❤️ +${c.hp} HP` : `❤️ ${c.hp} HP`);
    if (c.stones) parts.push(`💎 ${c.stones > 0 ? '+' : ''}${c.stones} stones`);
    if (c.fame) parts.push(`🌟 +${c.fame} Fame`);
    if (c.foundation) parts.push(`⭐ +${c.foundation} Foundation`);
    if (c.combat) parts.push('⚔️ Hollow Lie');
    if (c.clearPeaceful) parts.push('🏁 Honest exit');
    return parts.join(' · ');
}

function getMawDoubtCap() {
    return FORBIDDEN_BALANCE.mawDoubtCap + (G.mawDoubtResist || 0);
}

function renderMawDoubtStatus(ts) {
    const cap = getMawDoubtCap();
    let line = `👄 Doubt: ${ts.doubt} / ${cap}`;
    if (ts.doubt >= FORBIDDEN_BALANCE.mawDoubtCritical) {
        line += ' — CRITICAL: reality frays';
    } else if (ts.doubt >= FORBIDDEN_BALANCE.mawDoubtHigh) {
        line += ' — High: the Maw feeds on your lies';
    } else if (ts.doubt > 0) {
        line += ' — Whispers grow louder';
    } else {
        line += ' — Your voice is your own';
    }
    return line;
}

function startWhisperingMawTrial() {
    G.forbidden.trialState = { step: 0, doubt: 0 };
    addLog(`👄 ${WHISPERING_MAW_INTRO}`);
    renderMawTrial();
    document.getElementById('mawOverlay').classList.add('active');
}

function renderMawTrial() {
    const ts = G.forbidden.trialState;
    const node = WHISPERING_MAW_NODES[ts.step];
    const title = document.getElementById('mawTitle');
    const text = document.getElementById('mawText');
    const meter = document.getElementById('mawMeter');
    const intro = document.getElementById('mawIntro');
    const choices = document.getElementById('mawChoices');
    if (!node || !choices) return;

    title.textContent = `👄 Whispering Maw — Step ${ts.step + 1}/${WHISPERING_MAW_NODES.length}`;
    text.textContent = node.text;
    meter.textContent = renderMawDoubtStatus(ts);
    if (intro) {
        intro.textContent = ts.step === 0 ? WHISPERING_MAW_INTRO : '';
        intro.style.display = ts.step === 0 ? 'block' : 'none';
    }

    choices.innerHTML = node.choices.map((c, i) => {
        const flavor = c.flavor ? `<div class="maw-choice-flavor">${c.flavor}</div>` : '';
        return `<button type="button" class="popup-item maw-choice" data-idx="${i}">
            <div class="name">${c.label}</div>
            ${flavor}
            <div class="maw-choice-meta">${formatMawChoiceMeta(c)}</div>
        </button>`;
    }).join('');

    choices.querySelectorAll('.maw-choice').forEach(btn => {
        btn.addEventListener('click', function() {
            mawChoose(parseInt(this.dataset.idx, 10));
        });
    });
}

function mawChoose(idx) {
    const ts = G.forbidden.trialState;
    const node = WHISPERING_MAW_NODES[ts.step];
    if (!node || !node.choices[idx]) return;
    mawApplyChoice(node.choices[idx]);
    fullRender();
}

function mawApplyChoice(c) {
    const ts = G.forbidden.trialState;
    if (c.quit) {
        document.getElementById('mawOverlay').classList.remove('active');
        failForbiddenTrial('whispering_maw', 'You flee the Whispering Maw with lies still on your tongue.');
        return;
    }
    if (c.clearPeaceful && c.requiresLowDoubt && ts.doubt > FORBIDDEN_BALANCE.mawDoubtHigh) {
        addLog(`👄 Your words ring hollow. The Hollow Lie awakens.`);
        document.getElementById('mawOverlay').classList.remove('active');
        startMawCombat();
        return;
    }
    addLog(`👄 ${c.log}`);
    mawApplyEffects(c);
}

function mawApplyEffects(effects) {
    const ts = G.forbidden.trialState;
    let months = effects.months || 4;
    if (G.forbiddenLifespanMult && G.forbiddenLifespanMult > 1) {
        months = Math.max(1, Math.floor(months / G.forbiddenLifespanMult));
    }
    if (ts.doubt >= FORBIDDEN_BALANCE.mawDoubtHigh) months += 2;
    if (ts.doubt >= FORBIDDEN_BALANCE.mawDoubtCritical) months += 4;

    if (!advanceTime(months, 'Walking the Whispering Maw')) {
        failForbiddenTrial('whispering_maw', 'Your lifespan ends in the desert of lies.');
        document.getElementById('mawOverlay').classList.remove('active');
        return;
    }

    let doubtAdd = effects.doubt || 0;
    const doubtBefore = ts.doubt;
    ts.doubt = Math.max(0, Math.min(getMawDoubtCap(), ts.doubt + doubtAdd));

    if (doubtAdd !== 0) {
        addLog(`👄 Doubt ${doubtAdd > 0 ? '+' : ''}${doubtAdd} → now ${ts.doubt}/${getMawDoubtCap()}`);
    }
    if (ts.doubt >= FORBIDDEN_BALANCE.mawDoubtHigh && doubtBefore < FORBIDDEN_BALANCE.mawDoubtHigh) {
        addLog(`⚠️ High Doubt — sweet lies cost extra time.`);
    }
    if (ts.doubt >= FORBIDDEN_BALANCE.mawDoubtCritical && doubtBefore < FORBIDDEN_BALANCE.mawDoubtCritical) {
        addLog(`⚠️ Critical Doubt — the Maw hungers for your identity.`);
    }

    if (effects.hp) G.hp = clamp(G.hp + effects.hp, 1, G.maxHp);
    if (effects.stones) G.stones = Math.max(0, G.stones + effects.stones);
    if (effects.fame) G.fame += effects.fame;
    if (effects.foundation) G.foundation += effects.foundation;

    if (ts.doubt >= getMawDoubtCap()) {
        document.getElementById('mawOverlay').classList.remove('active');
        failForbiddenTrial('whispering_maw', 'Doubt consumes you. You forget which voice is yours.');
        return;
    }

    if (effects.combat) {
        document.getElementById('mawOverlay').classList.remove('active');
        startMawCombat();
        return;
    }

    if (effects.clearPeaceful) {
        document.getElementById('mawOverlay').classList.remove('active');
        let tier = 'balanced';
        if (ts.doubt <= 1) tier = 'pure';
        else if (ts.doubt <= 3) tier = 'honest';
        clearForbiddenGround('whispering_maw', tier);
        return;
    }

    ts.step += 1;
    if (ts.step >= WHISPERING_MAW_NODES.length) {
        document.getElementById('mawOverlay').classList.remove('active');
        clearForbiddenGround('whispering_maw', 'balanced');
        return;
    }
    renderMawTrial();
}

function mawQuitTrial() {
    document.getElementById('mawOverlay').classList.remove('active');
    failForbiddenTrial('whispering_maw', 'You flee the Whispering Maw.');
}

function isMawTrial() {
    return !!(G.forbidden && G.forbidden.activeTrial === 'whispering_maw' && G.inCombat);
}

function startMawCombat() {
    G.mawTrial = true;
    G.inCombat = true;
    G.defending = false;
    G.fortifyActive = false;
    G.combatLog = [];
    initCombatResource();
    updateShield();
    if (G.path === 'soul') G.shield = G.maxShield;

    const ts = G.forbidden.trialState;
    const template = ENEMIES.find(e => e.name === 'Shadow Assassin') || ENEMIES[Math.min(3, ENEMIES.length - 1)];
    let enemyHp = calcEnemyHp(template, { context: 'crucible', wave: 1 });
    let enemyDmg = calcEnemyDamage(template, { context: 'crucible', wave: 1 });
    if (ts.doubt <= 2) {
        enemyHp = Math.floor(enemyHp * 0.88);
        enemyDmg = Math.floor(enemyDmg * 0.85);
        addCombatLog(`👄 Your honesty weakens the Lie.`);
    } else if (ts.doubt >= 5) {
        enemyHp = Math.floor(enemyHp * 1.2);
        enemyDmg = Math.floor(enemyDmg * 1.15);
        addCombatLog(`👄 Your Doubt empowers the Hollow Lie!`);
    }

    G.enemy = {
        name: 'Hollow Lie',
        hp: enemyHp,
        maxHp: enemyHp,
        dmg: enemyDmg,
        originalDmg: enemyDmg,
        intimidateTurns: 0
    };
    G.enemyMaxHp = G.enemy.maxHp;

    addCombatLog(`👄 The Hollow Lie rises! (${enemyHp} HP) Doubt: ${ts.doubt}/${getMawDoubtCap()}`);
    setupCombatActions();
    G.combatPhase = 'player';
    clearCombatTurnTimer();
    setCombatInputEnabled(true);
    updateCombatUI();
    document.getElementById('cbFlee').disabled = true;
    document.getElementById('cbFlee').style.opacity = '0.4';
    document.getElementById('combatOverlay').classList.add('active');
}

function forbiddenMawVictory() {
    G.inCombat = false;
    G.defending = false;
    G.mawTrial = false;
    document.getElementById('combatOverlay').classList.remove('active');
    document.getElementById('cbFlee').disabled = false;
    document.getElementById('cbFlee').style.opacity = '';
    G.enemy = null;
    const ts = G.forbidden.trialState;
    let tier = 'survivor';
    if (ts.doubt <= 3) tier = 'balanced';
    if (ts.doubt <= 1) tier = 'pure';
    clearForbiddenGround('whispering_maw', tier);
}

function forbiddenMawDefeat() {
    G.hp = Math.max(1, 1);
    addCombatLog(`👄 The Maw spits you out, still breathing.`);
    G.inCombat = false;
    G.defending = false;
    G.mawTrial = false;
    document.getElementById('combatOverlay').classList.remove('active');
    document.getElementById('cbFlee').disabled = false;
    document.getElementById('cbFlee').style.opacity = '';
    G.enemy = null;
    failForbiddenTrial('whispering_maw', 'The Whispering Maw rejects the lies you became.');
}

function applyWhisperingMawRewards(tier) {
    if (!G.legendaryMaterials) G.legendaryMaterials = [];
    if (!G.legendaryMaterials.includes('Fragment of True Speech')) {
        G.legendaryMaterials.push('Fragment of True Speech');
        addLog(`🏆 Legendary Material: Fragment of True Speech`);
    }
    G.will += 2;
    G.foundation += 10;
    G.fame += 18;
    if (tier === 'pure' || tier === 'honest') {
        G.mawDoubtResist = 1;
        if (!G.forbiddenTitles.includes('Truth Speaker')) G.forbiddenTitles.push('Truth Speaker');
        addLog(`✨ Title: Truth Speaker. +2 Will. Doubt cap +1 tolerance in future Maw trials.`);
    } else if (tier === 'balanced') {
        if (!G.forbiddenTitles.includes('Doubt Walker')) G.forbiddenTitles.push('Doubt Walker');
        addLog(`✨ Title: Doubt Walker. +2 Will, +10 Foundation, +18 Fame.`);
    } else {
        if (!G.forbiddenTitles.includes('Maw Survivor')) G.forbiddenTitles.push('Maw Survivor');
        addLog(`✨ Title: Maw Survivor.`);
    }
}

// ===== SUNKEN TEMPLE =====

function formatTempleChoiceMeta(c) {
    const parts = [];
    if (c.months) parts.push(`⏳ ${c.months} mo`);
    if (c.loop) parts.push('🔁 May loop');
    if (c.hp) parts.push(c.hp > 0 ? `❤️ +${c.hp} HP` : `❤️ ${c.hp} HP`);
    if (c.stones) parts.push(`💎 ${c.stones > 0 ? '+' : ''}${c.stones} stones`);
    if (c.foundation) parts.push(`⭐ +${c.foundation} Foundation`);
    if (c.insight) parts.push(`📖 +${c.insight} insight`);
    if (c.clearPeaceful) parts.push('🏁 Sanctum');
    return parts.join(' · ');
}

function renderTempleLoopStatus(ts) {
    const max = FORBIDDEN_BALANCE.templeMaxLoops;
    let line = `🔁 Loops: ${ts.loops} / ${max}`;
    if (ts.loops >= max - 1) {
        line += ' — One mistake ends everything';
    } else if (ts.loops > 0) {
        line += ' — The temple remembers';
    } else {
        line += ' — Time holds steady';
    }
    return line;
}

function startSunkenTempleTrial() {
    G.forbidden.trialState = { step: 0, loops: 0 };
    addLog(`🏛️ ${SUNKEN_TEMPLE_INTRO}`);
    renderTempleTrial();
    document.getElementById('templeOverlay').classList.add('active');
}

function renderTempleTrial() {
    const ts = G.forbidden.trialState;
    const node = SUNKEN_TEMPLE_NODES[ts.step];
    const title = document.getElementById('templeTitle');
    const text = document.getElementById('templeText');
    const meter = document.getElementById('templeMeter');
    const intro = document.getElementById('templeIntro');
    const choices = document.getElementById('templeChoices');
    if (!node || !choices) return;

    title.textContent = `🏛️ Sunken Temple — Step ${ts.step + 1}/${SUNKEN_TEMPLE_NODES.length}`;
    text.textContent = node.text;
    meter.textContent = renderTempleLoopStatus(ts);
    if (intro) {
        intro.textContent = ts.step === 0 ? SUNKEN_TEMPLE_INTRO : '';
        intro.style.display = ts.step === 0 ? 'block' : 'none';
    }

    choices.innerHTML = node.choices.map((c, i) => {
        const flavor = c.flavor ? `<div class="temple-choice-flavor">${c.flavor}</div>` : '';
        return `<button type="button" class="popup-item temple-choice" data-idx="${i}">
            <div class="name">${c.label}</div>
            ${flavor}
            <div class="temple-choice-meta">${formatTempleChoiceMeta(c)}</div>
        </button>`;
    }).join('');

    choices.querySelectorAll('.temple-choice').forEach(btn => {
        btn.addEventListener('click', function() {
            templeChoose(parseInt(this.dataset.idx, 10));
        });
    });
}

function templeChoose(idx) {
    const ts = G.forbidden.trialState;
    const node = SUNKEN_TEMPLE_NODES[ts.step];
    if (!node || !node.choices[idx]) return;
    templeApplyChoice(node.choices[idx]);
    fullRender();
}

function templeApplyChoice(c) {
    if (c.quit) {
        document.getElementById('templeOverlay').classList.remove('active');
        failForbiddenTrial('sunken_temple', 'You surface before the temple yields its secret.');
        return;
    }
    addLog(`🏛️ ${c.log}`);
    templeApplyEffects(c);
}

function templeTriggerLoop(ts) {
    ts.loops += 1;
    addLog(`🔁 Bells toll. Loop ${ts.loops}/${FORBIDDEN_BALANCE.templeMaxLoops} — you stand at the gate again.`);
    if (ts.loops >= FORBIDDEN_BALANCE.templeMaxLoops) {
        document.getElementById('templeOverlay').classList.remove('active');
        failForbiddenTrial('sunken_temple', 'Time unravels. The temple drowns you in endless repetition.');
        return true;
    }
    ts.step = 0;
    renderTempleTrial();
    return true;
}

function templeApplyEffects(effects) {
    const ts = G.forbidden.trialState;
    let months = effects.months || 4;
    if (G.forbiddenLifespanMult && G.forbiddenLifespanMult > 1) {
        months = Math.max(1, Math.floor(months / G.forbiddenLifespanMult));
    }
    months += ts.loops * 2;

    if (!advanceTime(months, 'Walking the Sunken Temple')) {
        failForbiddenTrial('sunken_temple', 'Your lifespan ends beneath the tides.');
        document.getElementById('templeOverlay').classList.remove('active');
        return;
    }

    if (effects.hp) G.hp = clamp(G.hp + effects.hp, 1, G.maxHp);
    if (effects.stones) G.stones = Math.max(0, G.stones + effects.stones);
    if (effects.foundation) G.foundation += effects.foundation;
    if (effects.insight) G.foundation += effects.insight;

    if (effects.loop) {
        templeTriggerLoop(ts);
        return;
    }

    if (effects.clearPeaceful) {
        document.getElementById('templeOverlay').classList.remove('active');
        let tier = 'balanced';
        if (ts.loops === 0) tier = 'pure';
        else if (ts.loops === 1) tier = 'patient';
        clearForbiddenGround('sunken_temple', tier);
        return;
    }

    ts.step += 1;
    if (ts.step >= SUNKEN_TEMPLE_NODES.length) {
        document.getElementById('templeOverlay').classList.remove('active');
        clearForbiddenGround('sunken_temple', 'balanced');
        return;
    }
    renderTempleTrial();
}

function templeQuitTrial() {
    document.getElementById('templeOverlay').classList.remove('active');
    failForbiddenTrial('sunken_temple', 'You flee the Sunken Temple.');
}

function applySunkenTempleRewards(tier) {
    if (!G.legendaryMaterials) G.legendaryMaterials = [];
    if (!G.legendaryMaterials.includes('Jade Loop Pearl')) {
        G.legendaryMaterials.push('Jade Loop Pearl');
        addLog(`🏆 Legendary Material: Jade Loop Pearl`);
    }
    G.spirit += 2;
    G.foundation += 12;
    G.fame += 15;
    if (tier === 'pure') {
        if (!G.forbiddenTitles.includes('Loop Breaker')) G.forbiddenTitles.push('Loop Breaker');
        addLog(`✨ Title: Loop Breaker. +2 Spirit, +12 Foundation, +15 Fame.`);
    } else if (tier === 'patient') {
        if (!G.forbiddenTitles.includes('Tide Walker')) G.forbiddenTitles.push('Tide Walker');
        addLog(`✨ Title: Tide Walker.`);
    } else {
        if (!G.forbiddenTitles.includes('Drowned Seeker')) G.forbiddenTitles.push('Drowned Seeker');
        addLog(`✨ Title: Drowned Seeker.`);
    }
}

// ===== CELESTIAL OBSERVATORY =====

function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function buildObservatoryNodes() {
    const pathData = PATHS[G.path];
    const correctPath = pathData.name;
    const wrongPaths = Object.keys(PATHS).filter(p => p !== G.path).map(p => PATHS[p].name);
    const correctRealm = pathData.realms[G.realmIdx] || pathData.realms[0];
    const wrongRealms = shuffleArray(pathData.realms.filter((_, i) => i !== G.realmIdx)).slice(0, 2);
    const techCount = (G.techniques || []).length;
    let correctTechLabel;
    if (techCount === 0) correctTechLabel = 'None yet';
    else if (techCount <= 3) correctTechLabel = 'A few (' + techCount + ')';
    else correctTechLabel = 'Many (' + techCount + ')';
    const techOptions = shuffleArray([
        { label: correctTechLabel, honest: true },
        { label: techCount === 0 ? 'Many (5+)' : 'None yet', honest: false },
        { label: techCount > 3 ? 'A few (2)' : 'Many (6+)', honest: false }
    ]);
    const clearedAny = forbiddenClearedCount() > 0;
    const sectCorrect = G.sectName || "Wandering Sect";
    const sectWrong = shuffleArray([
        G.name + "'s Legacy Hall",
        'Silent Star Pavilion',
        'Broken Meridian Sect'
    ]).slice(0, 2);

    return [
        {
            id: 'path',
            title: 'First Star',
            text: 'Brass rings turn. A voice asks: "What road do you walk?"',
            choices: shuffleArray([
                { label: correctPath, honest: true, months: 2, log: 'The stars align with your path.' },
                ...wrongPaths.map(name => ({
                    label: name,
                    honest: false,
                    months: 1,
                    scrutiny: 2,
                    log: `You claim ${name}. The chart flickers wrong.`
                }))
            ])
        },
        {
            id: 'realm',
            title: 'Second Star',
            text: '"Name the realm you have reached — without vanity."',
            choices: shuffleArray([
                { label: correctRealm, honest: true, months: 2, log: 'Your cultivation matches the heavens\' record.' },
                ...wrongRealms.map(name => ({
                    label: name,
                    honest: false,
                    months: 1,
                    scrutiny: 2,
                    log: `You claim ${name}. Scrutiny gathers.`
                }))
            ])
        },
        {
            id: 'techniques',
            title: 'Third Star',
            text: '"How many arts do you truly wield?"',
            choices: techOptions.map(o => ({
                label: o.label,
                honest: o.honest,
                months: 2,
                scrutiny: o.honest ? 0 : 2,
                log: o.honest ? 'An honest tally. The lens clears.' : 'You exaggerate. The stars dim.'
            }))
        },
        {
            id: 'sect',
            title: 'Fourth Star',
            text: '"Under what banner do your disciples gather?"',
            choices: shuffleArray([
                { label: sectCorrect, honest: true, months: 2, log: 'Your sect name rings true.' },
                ...sectWrong.map(name => ({
                    label: name,
                    honest: false,
                    months: 1,
                    scrutiny: 1,
                    log: `You name ${name}. The observatory waits.` 
                }))
            ])
        },
        {
            id: 'forbidden',
            title: 'Final Star',
            text: '"Have you conquered a forbidden ground — or do you lie to the sky itself?"',
            choices: clearedAny ? [
                {
                    label: 'Yes — I have cleared forbidden trials',
                    honest: true,
                    months: 2,
                    log: 'The heavens see your victories written in fate.'
                },
                {
                    label: 'No — I have never entered one',
                    honest: false,
                    months: 1,
                    scrutiny: 3,
                    log: 'The stars know you lie. Scrutiny surges.'
                },
                {
                    label: 'I refuse to answer',
                    honest: false,
                    months: 2,
                    scrutiny: 2,
                    log: 'Silence is also a kind of dishonesty here.'
                }
            ] : [
                {
                    label: 'No — not yet',
                    honest: true,
                    months: 2,
                    log: 'Honesty before the void. The final star opens.'
                },
                {
                    label: 'Yes — many forbidden grounds bow to me',
                    honest: false,
                    months: 1,
                    scrutiny: 3,
                    fame: 5,
                    log: 'You boast. The observatory records every false word.'
                },
                {
                    label: 'Forbidden grounds are beneath me',
                    honest: false,
                    months: 1,
                    scrutiny: 2,
                    log: 'Contempt does not fool the stars.'
                }
            ]
        }
    ];
}

function formatObservatoryChoiceMeta(c) {
    const parts = [];
    if (c.months) parts.push(`⏳ ${c.months} mo`);
    if (c.scrutiny > 0) parts.push(`🔭 +${c.scrutiny} Scrutiny`);
    else if (c.honest) parts.push('✨ Honest');
    else parts.push('😐 Risky');
    if (c.fame) parts.push(`🌟 +${c.fame} Fame`);
    return parts.join(' · ');
}

function renderObservatoryScrutinyStatus(ts) {
    const cap = FORBIDDEN_BALANCE.observatoryScrutinyCap;
    let line = `🔭 Scrutiny: ${ts.scrutiny} / ${cap}`;
    if (ts.scrutiny >= cap - 1) {
        line += ' — One lie from expulsion';
    } else if (ts.scrutiny >= 3) {
        line += ' — The heavens watch closely';
    } else if (ts.scrutiny > 0) {
        line += ' — Doubt gathers';
    } else {
        line += ' — Clear skies';
    }
    return line;
}

function startObservatoryTrial() {
    const nodes = buildObservatoryNodes();
    G.forbidden.trialState = { step: 0, scrutiny: 0, nodes };
    addLog(`🔭 The Celestial Observatory reads your journey. Answer honestly — or face scrutiny.`);
    renderObservatoryTrial();
    document.getElementById('observatoryOverlay').classList.add('active');
}

function renderObservatoryTrial() {
    const ts = G.forbidden.trialState;
    const node = ts.nodes[ts.step];
    const title = document.getElementById('observatoryTitle');
    const text = document.getElementById('observatoryText');
    const meter = document.getElementById('observatoryMeter');
    const intro = document.getElementById('observatoryIntro');
    const choices = document.getElementById('observatoryChoices');
    if (!node || !choices) return;

    title.textContent = `🔭 Observatory — ${node.title} (${ts.step + 1}/${ts.nodes.length})`;
    text.textContent = node.text;
    meter.textContent = renderObservatoryScrutinyStatus(ts);
    if (intro) {
        intro.textContent = ts.step === 0
            ? 'The tower asks questions only your save file can answer. Pick what is true.'
            : '';
        intro.style.display = ts.step === 0 ? 'block' : 'none';
    }

    choices.innerHTML = node.choices.map((c, i) => {
        const flavor = c.flavor ? `<div class="observatory-choice-flavor">${c.flavor}</div>` : '';
        return `<button type="button" class="popup-item observatory-choice" data-idx="${i}">
            <div class="name">${c.label}</div>
            ${flavor}
            <div class="observatory-choice-meta">${formatObservatoryChoiceMeta(c)}</div>
        </button>`;
    }).join('');

    choices.querySelectorAll('.observatory-choice').forEach(btn => {
        btn.addEventListener('click', function() {
            observatoryChoose(parseInt(this.dataset.idx, 10));
        });
    });
}

function observatoryChoose(idx) {
    const ts = G.forbidden.trialState;
    const node = ts.nodes[ts.step];
    if (!node || !node.choices[idx]) return;
    observatoryApplyChoice(node.choices[idx]);
    fullRender();
}

function observatoryApplyChoice(c) {
    addLog(`🔭 ${c.log}`);
    observatoryApplyEffects(c);
}

function observatoryApplyEffects(effects) {
    const ts = G.forbidden.trialState;
    let months = effects.months || 3;
    if (G.forbiddenLifespanMult && G.forbiddenLifespanMult > 1) {
        months = Math.max(1, Math.floor(months / G.forbiddenLifespanMult));
    }

    if (!advanceTime(months, 'Answering at the Celestial Observatory')) {
        failForbiddenTrial('celestial_observatory', 'Your lifespan ends under the stars.');
        document.getElementById('observatoryOverlay').classList.remove('active');
        return;
    }

    const scrutinyAdd = effects.scrutiny || 0;
    const scrutinyBefore = ts.scrutiny;
    ts.scrutiny = Math.max(0, Math.min(FORBIDDEN_BALANCE.observatoryScrutinyCap, ts.scrutiny + scrutinyAdd));

    if (scrutinyAdd > 0) {
        addLog(`🔭 Scrutiny +${scrutinyAdd} → now ${ts.scrutiny}/${FORBIDDEN_BALANCE.observatoryScrutinyCap}`);
    }
    if (ts.scrutiny >= 3 && scrutinyBefore < 3) {
        addLog(`⚠️ The heavens watch closely.`);
    }

    if (effects.fame) G.fame += effects.fame;

    if (ts.scrutiny >= FORBIDDEN_BALANCE.observatoryScrutinyCap) {
        document.getElementById('observatoryOverlay').classList.remove('active');
        failForbiddenTrial('celestial_observatory', 'The observatory expels you. Too many lies under open sky.');
        return;
    }

    ts.step += 1;
    if (ts.step >= ts.nodes.length) {
        document.getElementById('observatoryOverlay').classList.remove('active');
        let tier = 'balanced';
        if (ts.scrutiny === 0) tier = 'pure';
        else if (ts.scrutiny <= 2) tier = 'honest';
        clearForbiddenGround('celestial_observatory', tier);
        return;
    }
    renderObservatoryTrial();
}

function observatoryQuitTrial() {
    document.getElementById('observatoryOverlay').classList.remove('active');
    failForbiddenTrial('celestial_observatory', 'You descend before the final star opens.');
}

function applyObservatoryRewards(tier) {
    if (!G.legendaryMaterials) G.legendaryMaterials = [];
    if (!G.legendaryMaterials.includes('Celestial Lens')) {
        G.legendaryMaterials.push('Celestial Lens');
        addLog(`🏆 Legendary Material: Celestial Lens`);
    }
    G.spirit += 3;
    G.foundation += 14;
    G.fame += 22;
    if (tier === 'pure') {
        if (!G.forbiddenTitles.includes('Star Witness')) G.forbiddenTitles.push('Star Witness');
        addLog(`✨ Title: Star Witness. +3 Spirit, +14 Foundation, +22 Fame.`);
    } else if (tier === 'honest') {
        if (!G.forbiddenTitles.includes('Honest Soul')) G.forbiddenTitles.push('Honest Soul');
        addLog(`✨ Title: Honest Soul.`);
    } else {
        if (!G.forbiddenTitles.includes('Liar\'s Bane')) G.forbiddenTitles.push('Liar\'s Bane');
        addLog(`✨ Title: Liar\'s Bane.`);
    }
}
