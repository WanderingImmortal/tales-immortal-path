// ============================================
// INTENT.JS — Weapon Intent (dantian / qi path only)
// Body → Vessel Rules; Soul → Soul Mass (future systems).
// ============================================

const WEAPON_INTENT_DANTIAN_MSG = 'Weapon Intent is cultivated on the dantian path.';

function isWeaponIntentPathActive() {
    const focus = typeof getFocusTrack === 'function' ? getFocusTrack() : 'dantian';
    return focus === 'dantian' || G.path === 'qi';
}

function canAccessWeaponIntent() {
    if (!isWeaponIntentPathActive()) return false;
    return typeof guardAction === 'function' ? guardAction('intent', { silent: true }) : true;
}

function shouldShowIntentButton() {
    ensureIntentState();
    if (G.weaponIntents?.length > 0) return true;
    return canAccessWeaponIntent();
}

function weaponIntentPathGate() {
    if (isWeaponIntentPathActive()) return null;
    return { success: false, message: WEAPON_INTENT_DANTIAN_MSG };
}

/** Wired into soul-mass mitigation via soul-mass.js */
function getIntentSoulMitigationPct() {
    if (!isWeaponIntentPathActive()) return 0;
    const intent = getActiveIntent();
    if (!intent) return 0;
    const tierIdx = getIntentTierIndex(intent.uses);
    return Math.min(0.25, 0.05 + tierIdx * 0.04 + getIntentDeepenCount(intent) * 0.02);
}

function notifyIntentSleepIfNeeded() {
    if (G._intentSleepNotified) return;
    // Do not call ensureIntentState() here — ensure already invokes this (recursion).
    if (!G.weaponIntents?.length) return;
    if (isWeaponIntentPathActive()) return;
    G._intentSleepNotified = true;
    if (typeof addLog === 'function') addLog('Your weapon intents sleep while your focus is elsewhere.');
}

function resolveActiveIntent() {
    ensureIntentState();
    return getActiveIntent();
}

function ensureIntentState() {
    if (!G.weaponIntents) G.weaponIntents = [];
    if (G.intentCombatState == null) G.intentCombatState = {};
    migrateLegacyIntentState();
    syncLegacyIntentPointer();
    notifyIntentSleepIfNeeded();
}

function migrateLegacyIntentState() {
    if (G.weaponIntents.length) return;
    if (G.weaponIntent && G.weaponIntent.weapon) {
        const legacy = G.weaponIntent;
        const choices = G.weaponIntentChoices || [];
        const deepenCount = choices.filter(c => c.weapon === legacy.weapon && c.type === 'deepen').length;
        const expandArts = [];
        choices.filter(c => c.weapon === legacy.weapon && c.type === 'expand').forEach((c, idx) => {
            const pool = INTENT_EXPAND_ARTS[legacy.weapon];
            if (pool && pool[idx]) expandArts.push(pool[idx].id);
        });
        G.weaponIntents.push({
            weapon: legacy.weapon,
            track: getIntentTrackForPath(G.path).id,
            uses: legacy.uses || 0,
            useAccumulator: 0,
            deepenCount,
            expandArts,
            choices: choices.filter(c => c.weapon === legacy.weapon)
        });
        G.activeIntentWeapon = legacy.weapon;
    }
}

function syncLegacyIntentPointer() {
    if (!G.weaponIntents?.length) {
        G.weaponIntent = null;
        G.weaponIntentChoices = G.weaponIntentChoices || [];
        return;
    }
    let active = null;
    if (G.activeIntentWeapon) {
        active = G.weaponIntents.find(i => i.weapon === G.activeIntentWeapon) || null;
    }
    if (!active) active = G.weaponIntents[0];
    if (active && !G.activeIntentWeapon) G.activeIntentWeapon = active.weapon;
    G.weaponIntent = active;
    G.weaponIntentChoices = active?.choices || [];
}

function getIntentTrackForPath(_path) {
    return INTENT_TRACK_BY_PATH.qi;
}

function getIntentRecord(weapon) {
    ensureIntentState();
    return G.weaponIntents.find(i => i.weapon === weapon) || null;
}

function getActiveIntent() {
    if (!G.weaponIntents?.length) return null;
    if (G.activeIntentWeapon) {
        const found = G.weaponIntents.find(i => i.weapon === G.activeIntentWeapon);
        if (found) return found;
    }
    return G.weaponIntents[0];
}

function getIntentTierIndex(uses) {
    let idx = 0;
    for (let i = 0; i < INTENT_TIERS.length; i++) {
        if ((uses || 0) >= INTENT_TIERS[i].uses) idx = i;
    }
    return idx;
}

function getIntentTierForRecord(intent) {
    if (!intent) return INTENT_TIERS[0];
    return INTENT_TIERS[getIntentTierIndex(intent.uses)];
}

function getIntentDeepenCount(intent) {
    if (!intent) return 0;
    if (intent.deepenCount != null) return intent.deepenCount;
    return (intent.choices || []).filter(c => c.type === 'deepen').length;
}

function getIntentRefinementMult(intent) {
    const b = INTENT_BALANCE;
    const adeptPlus = G.weaponIntents.filter(i => getIntentTierIndex(i.uses) >= b.dividedHeartMinStage).length;
    if (adeptPlus >= 2) return b.dividedHeartRefinementMult;
    return 1;
}

function getIntentBonusForRecord(intent) {
    if (!intent) return 0;
    const tier = getIntentTierForRecord(intent);
    return tier.bonus + getIntentDeepenCount(intent) * INTENT_BALANCE.deepenBonusPerPick;
}

function getIntentBonus() {
    ensureIntentState();
    return getIntentBonusForRecord(getActiveIntent());
}

function getIntentExpandArtDefs(intent) {
    if (!intent?.expandArts?.length) return [];
    const pool = INTENT_EXPAND_ARTS[intent.weapon] || [];
    return intent.expandArts.map(id => pool.find(a => a.id === id)).filter(Boolean);
}

function intentHasArt(intent, artId) {
    return !!(intent?.expandArts || []).includes(artId);
}

function getIntentManifestation() {
    const intent = getActiveIntent();
    if (!intent) return null;
    const tier = getIntentTierForRecord(intent);
    if (tier.name !== 'Intent Domain') return null;
    return INTENT_DOMAIN_MANIFESTATIONS[intent.weapon] || 'Your intent manifests in the world.';
}

function getPendingExpandArt(weapon, tierIdx) {
    const pool = INTENT_EXPAND_ARTS[weapon];
    if (!pool) return null;
    const artIdx = Math.max(0, tierIdx - 1);
    return pool[artIdx] || null;
}

function checkIntentTierBreakpoint(intent) {
    if (!intent) return;
    const tierIdx = getIntentTierIndex(intent.uses);
    if (tierIdx <= 0) return;
    const tier = INTENT_TIERS[tierIdx];
    const choicesAtTier = (intent.choices || []).filter(c => c.tier === tier.name).length;
    if (choicesAtTier > 0) return;
    const active = getActiveIntent();
    if (!active || active.weapon !== intent.weapon) return;
    G.pendingIntentChoice = { weapon: intent.weapon, tier: tier.name, tierIdx };
    const track = getIntentTrackForPath(G.path);
    const msg = `${track.emoji} Your ${intent.weapon} ${track.label} reaches ${tier.name}! Deepen or Expand?`;
    if (typeof queueActionLogSupplement === 'function') queueActionLogSupplement(msg);
    else addLog(msg);
}

function addIntentUseProgress(fromWeapon) {
    if (!isWeaponIntentPathActive()) return;
    ensureIntentState();
    const activeWeapon = fromWeapon || getActiveIntent()?.weapon;
    if (!activeWeapon) return;

    for (const intent of G.weaponIntents) {
        let gain = intent.weapon === activeWeapon ? 1 : INTENT_BALANCE.inactiveUseRatio;
        gain *= getIntentRefinementMult(intent);
        intent.useAccumulator = (intent.useAccumulator || 0) + gain;
        const beforeUses = intent.uses || 0;
        while (intent.useAccumulator >= 1) {
            intent.useAccumulator -= 1;
            intent.uses = (intent.uses || 0) + 1;
        }
        if (Math.floor(intent.uses) > Math.floor(beforeUses)) {
            checkIntentTierBreakpoint(intent);
        }
    }
    syncLegacyIntentPointer();
}

function chooseWeaponIntent(weapon) {
    const pathGate = weaponIntentPathGate();
    if (pathGate) return pathGate;
    if (!WEAPON_TYPES.includes(weapon)) return { success: false, message: 'Invalid weapon.' };
    ensureIntentState();
    if (getIntentRecord(weapon)) return { success: false, message: `You already cultivate ${weapon} Intent.` };

    const months = G.weaponIntents.length === 0 ? ACTION_MONTHS.intentChoose : ACTION_MONTHS.intentAwaken;
    const track = getIntentTrackForPath(G.path);
    beginActionLog();
    if (!advanceTime(months, `Awakening ${weapon} ${track.label}`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends...' };
    }

    G.weaponIntents.push({
        weapon,
        track: track.id,
        uses: 0,
        useAccumulator: 0,
        deepenCount: 0,
        expandArts: [],
        choices: []
    });
    if (!G.activeIntentWeapon) G.activeIntentWeapon = weapon;
    syncLegacyIntentPointer();
    const msg = `${track.emoji} You awaken ${weapon} ${track.label}. Another path opens — time will tell how far you refine it.`;
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

function switchActiveIntent(weapon) {
    const pathGate = weaponIntentPathGate();
    if (pathGate) return pathGate;
    ensureIntentState();
    const intent = getIntentRecord(weapon);
    if (!intent) return { success: false, message: 'Intent not awakened.' };
    if (G.activeIntentWeapon === weapon) return { success: false, message: `${weapon} is already your active focus.` };
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.intentSwitch, `Aligning the heart toward ${weapon}`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends...' };
    }
    G.activeIntentWeapon = weapon;
    G.pendingIntentChoice = null;
    const track = getIntentTrackForPath(G.path);
    syncLegacyIntentPointer();
    const msg = `${track.emoji} You align your heart toward ${weapon} ${track.label}.`;
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

function refineActiveIntent() {
    const pathGate = weaponIntentPathGate();
    if (pathGate) return pathGate;
    const intent = getActiveIntent();
    if (!intent) return { success: false, message: 'No active intent to refine.' };
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.intentRefine, `Refining ${intent.weapon} Intent`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends...' };
    }
    intent.useAccumulator = (intent.useAccumulator || 0) + 1.5;
    while (intent.useAccumulator >= 1) {
        intent.useAccumulator -= 1;
        intent.uses = (intent.uses || 0) + 1;
    }
    checkIntentTierBreakpoint(intent);
    syncLegacyIntentPointer();
    const msg = `🧘 Months of meditation sharpen your ${intent.weapon} intent.`;
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

function useWeaponIntent() {
    addIntentUseProgress(getActiveIntent()?.weapon);
    return getIntentBonus();
}

function makeIntentChoice(choice) {
    const pathGate = weaponIntentPathGate();
    if (pathGate) return pathGate;
    if (!G.pendingIntentChoice) return { success: false, message: 'No pending choice.' };
    const intent = getIntentRecord(G.pendingIntentChoice.weapon);
    if (!intent) return { success: false, message: 'Intent not found.' };

    const months = choice === 'expand' ? ACTION_MONTHS.intentExpand : ACTION_MONTHS.intentDeepen;
    const label = choice === 'expand' ? 'Expanding your Intent' : 'Deepening your Intent';
    beginActionLog();
    if (!advanceTime(months, label)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends...' };
    }

    let msg;
    if (choice === 'deepen') {
        intent.deepenCount = getIntentDeepenCount(intent) + 1;
        intent.choices.push({ type: 'deepen', tier: G.pendingIntentChoice.tier });
        msg = `⬆️ You deepen ${intent.weapon} Intent — killing power sharpens (+${Math.round(INTENT_BALANCE.deepenBonusPerPick * 100)}% basics).`;
    } else {
        const art = getPendingExpandArt(intent.weapon, G.pendingIntentChoice.tierIdx);
        if (art && !intent.expandArts.includes(art.id)) intent.expandArts.push(art.id);
        intent.choices.push({ type: 'expand', tier: G.pendingIntentChoice.tier, artId: art?.id || null });
        msg = art
            ? `🔄 Intent expands — ${art.name}: ${art.desc}`
            : `🔄 You expand ${intent.weapon} Intent with a new expression.`;
    }

    G.pendingIntentChoice = null;
    syncLegacyIntentPointer();
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

function resetIntentCombatState() {
    G.intentCombatState = { basicAttackCount: 0, pierceDomainUsed: false };
}

function getBasicDefendDamageMult() {
    if (!isWeaponIntentPathActive()) return 0.45;
    const intent = getActiveIntent();
    if (intent && intentHasArt(intent, 'penetrating_line')) {
        return INTENT_BALANCE.penetratingLineDefendMult;
    }
    return 0.45;
}

function applySlaughterAuraMult(baseDmg) {
    const intent = getActiveIntent();
    if (!intent || !G.enemy) return baseDmg;
    if (!intentHasArt(intent, 'slaughter_aura') && !intentHasArt(intent, 'butcher_domain')) return baseDmg;
    let pct = INTENT_BALANCE.slaughterAuraHpPct;
    if (intentHasArt(intent, 'butcher_domain')) pct = Math.min(0.5, pct + 0.12);
    if (G.enemy.hp <= G.enemy.maxHp * pct) return Math.floor(baseDmg * INTENT_BALANCE.slaughterAuraDmgMult);
    return baseDmg;
}

function getIntentTechniqueSynergyBonus(tech) {
    const intent = getActiveIntent();
    if (!intent || !tech) return 0;
    if (intentHasArt(intent, 'blade_pressure')) return 0.06;
    return 0;
}

function getDaoIntentSynergyMult(tech) {
    if (!isWeaponIntentPathActive() || !getActiveIntent() || !tech) return 1;
    const el = typeof getTechniquePrimaryAffinityKey === 'function'
        ? getTechniquePrimaryAffinityKey(tech)
        : (tech.element || 'neutral');
    const phaseId = ELEMENT_DAO_MAP[el];
    const elementAligned = (phaseId && isDaoComprehended(phaseId)) || isDaoComprehended('five_phases');
    let mult = 1;
    if (elementAligned) mult += 0.08;
    const intentMatch = typeof getTechniqueIntentMatch === 'function' ? getTechniqueIntentMatch(tech) : null;
    if (intentMatch?.matched && elementAligned) mult += 0.07;
    return Math.min(1.20, mult);
}

function applyIntentArtsOnBasicAttack(baseDmg) {
    const intent = getActiveIntent();
    const result = { dmg: baseDmg, extraDmg: 0, logs: [], resourceGain: 0, attackCostDiscount: 0 };
    if (!isWeaponIntentPathActive() || !intent || !G.inCombat) return result;

    G.intentCombatState.basicAttackCount = (G.intentCombatState.basicAttackCount || 0) + 1;
    result.dmg = applySlaughterAuraMult(baseDmg);

    if (intentHasArt(intent, 'reach_advantage') && G.enemy && ((G.enemy.slowTurns || 0) > 0 || (G.enemy.intimidateTurns || 0) > 0)) {
        result.dmg = Math.floor(result.dmg * 1.15);
        result.logs.push('🗡️ Reach Advantage — they cannot escape your line!');
    }

    if (intentHasArt(intent, 'returning_edge') || intentHasArt(intent, 'edge_domain')) {
        let chance = INTENT_BALANCE.returningEdgeChance;
        let mult = INTENT_BALANCE.returningEdgeDmgMult;
        if (intentHasArt(intent, 'edge_domain') && !intentHasArt(intent, 'returning_edge')) {
            chance = 1;
            mult *= 0.5;
        } else if (intentHasArt(intent, 'edge_domain')) {
            chance = Math.min(1, chance + 0.1);
        }
        if (Math.random() < chance) {
            result.extraDmg += Math.max(1, Math.floor(result.dmg * mult));
            result.logs.push('⚔️ Returning Edge — a phantom follow-up!');
        }
    }

    if (intentHasArt(intent, 'concussive_rhythm') && G.enemy) {
        const every = INTENT_BALANCE.concussiveRhythmEvery;
        if (G.intentCombatState.basicAttackCount % every === 0) {
            G.enemy.slowTurns = (G.enemy.slowTurns || 0) + (intentHasArt(intent, 'press_domain') ? 2 : 1);
            result.logs.push('👊 Concussive Rhythm — your blow drags on the enemy!');
        }
    }

    if (intentHasArt(intent, 'circulating_guard')) {
        let pct = INTENT_BALANCE.circulatingGuardResourcePct;
        if (intentHasArt(intent, 'sanctuary_domain') && G.defending) pct *= 2;
        result.resourceGain = Math.max(1, Math.floor((G.maxCombatResource || 0) * pct));
    }

    if (intentHasArt(intent, 'iron_knuckle')) {
        result.attackCostDiscount = 1;
    }

    if (intentHasArt(intent, 'pierce_domain') && !G.intentCombatState.pierceDomainUsed && G.enemy?.defending) {
        G.intentCombatState.pierceDomainUsed = true;
        result.logs.push('🗡️ Pierce Domain — your opening strike ignores their guard!');
        result.ignoreDefend = true;
    }

    return result;
}

function applyIntentResourceGain(amount) {
    if (!amount || amount <= 0) return;
    const cfg = getCombatConfig();
    const before = G.combatResource;
    if (typeof isCombatQiLinked === 'function' && isCombatQiLinked()) {
        G.combatResource = Math.min(getQiLinkedBreathCap(), G.combatResource + amount);
    } else {
        G.combatResource = Math.min(G.maxCombatResource, G.combatResource + amount);
    }
    const gained = G.combatResource - before;
    if (gained > 0) addCombatLog(`${cfg.icon} Circulating Guard — +${gained} ${cfg.resource}.`);
}

function getIntentBasicAttackCostDiscount() {
    if (!isWeaponIntentPathActive()) return 0;
    const intent = getActiveIntent();
    if (intent && intentHasArt(intent, 'iron_knuckle')) return 1;
    return 0;
}

function getIntentSummaryLine(intent) {
    if (!intent) return '';
    const tier = getIntentTierForRecord(intent);
    const bonus = getIntentBonusForRecord(intent);
    const arts = getIntentExpandArtDefs(intent);
    const artLine = arts.length ? ` · Arts: ${arts.map(a => a.name).join(', ')}` : '';
    return `${intent.weapon} — ${tier.name} · ${Math.floor(intent.uses)} uses · +${Math.round(bonus * 100)}%${artLine}`;
}
