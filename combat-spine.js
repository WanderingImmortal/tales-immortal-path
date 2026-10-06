// ============================================
// COMBAT-SPINE.JS — Grid, ATB, unified resolve (v1)
// State on G.combatSpine; presentation in ui.js
// ============================================

const COMBAT_SPINE_BALANCE = {
    atbMax: 100,
    baseFillPerSec: 22,
    pulseIntervalMs: 2000,
    tickMs: 100,
    skirmishSize: 11,
    structureBreakThreshold: 1.0,
    fleshBreakThreshold: 1.0,
    circulationBreakThreshold: 1.0,
    coreBreakThreshold: 1.0,
    maxStructureBreaks: 2,
    penumbraGlareFrac: 0.25,
    glareFillSlowPct: 8,
    circulationShakenFraction: 0.5,
    circulationStressResetFraction: 0.5,
    circulationFizzleChance: 0.3,
    circulationQiWeightMult: 0.85
};

const COMBAT_BLEED_SEVERITY = {
    nick: { perTickPctMaxHp: 0.015, label: 'nick' },
    wound: { perTickPctMaxHp: 0.025, label: 'wound' },
    gush: { perTickPctMaxHp: 0.04, label: 'gush' }
};

const COMBAT_WEAPON_REACH = {
    fist: 1,
    unarmed: 1,
    sword: 2,
    saber: 2,
    blade: 2,
    spear: 3,
    staff: 3,
    pole: 3,
    default: 1
};

function isCombatSpineActive() {
    return !!(G.inCombat && G.combatSpine && G.combatSpine.enabled);
}

function getCombatSpineGridSize() {
    const spine = G.combatSpine;
    if (!spine) return COMBAT_SPINE_BALANCE.skirmishSize;
    const realm = G.realmIdx || 0;
    if (spine.forcedSize) return spine.forcedSize;
    if (realm >= 6) return 17;
    if (realm >= 4) return 13;
    return COMBAT_SPINE_BALANCE.skirmishSize;
}

function initCombatSpineForFight(opts) {
    opts = opts || {};
    const size = opts.size || getCombatSpineGridSize();
    const mid = Math.floor(size / 2);
    G.combatSpine = {
        enabled: true,
        fleePolicy: opts.fleePolicy || 'open',
        width: size,
        height: size,
        player: { r: size - 2, c: mid },
        enemy: { r: 2, c: mid },
        zones: [],
        atb: { player: 0, enemy: 0 },
        speed: {
            player: opts.playerSpeed || calcCombatSpineSpeed(true),
            enemy: opts.enemySpeed || calcCombatSpineSpeed(false)
        },
        combatTimeMs: 0,
        nextPulseMs: COMBAT_SPINE_BALANCE.pulseIntervalMs,
        playerReady: false,
        enemyActing: false,
        glareStacks: 0,
        tickHandle: null
    };
    ensureEnemyCombatSystems(G.enemy);
    addCombatLog(`📐 Courtyard grid ${size}×${size} — reach edge to flee.`);
    G.combatPhase = 'atb';
    if (typeof setCombatInputEnabled === 'function') setCombatInputEnabled(false);
    startCombatSpineLoop();
    if (typeof renderCombatSpineGrid === 'function') renderCombatSpineGrid();
}

function calcCombatSpineSpeed(forPlayer) {
    let spd = 10 + (G.realmIdx || 0) * 2;
    if (forPlayer) {
        spd += Math.floor((G.agility || G.spirit || 0) * 0.15);
    } else if (G.enemy) {
        spd += Math.floor((G.enemy.dmg || 5) * 0.08);
        ensureEnemyCombatSystems(G.enemy);
        spd *= G.enemy.combatConsequences?.modifiers?.atbMult ?? 1;
    }
    return Math.max(8, Math.min(40, spd));
}

function teardownCombatSpine() {
    if (G.combatSpine && G.combatSpine.tickHandle) {
        clearInterval(G.combatSpine.tickHandle);
        G.combatSpine.tickHandle = null;
    }
    G.combatSpine = null;
    const gridEl = document.getElementById('combatGridPanel');
    if (gridEl) gridEl.innerHTML = '';
    const atbEl = document.getElementById('combatAtbPanel');
    if (atbEl) atbEl.classList.add('hidden');
}

function startCombatSpineLoop() {
    if (!G.combatSpine || G.combatSpine.tickHandle) return;
    G.combatSpine.tickHandle = setInterval(combatSpineIntervalTick, COMBAT_SPINE_BALANCE.tickMs);
}

function combatSpineIntervalTick() {
    if (!isCombatSpineActive() || !G.enemy || G.gameOver) return;
    const spine = G.combatSpine;
    const dt = COMBAT_SPINE_BALANCE.tickMs;
    spine.combatTimeMs += dt;

    if (spine.combatTimeMs >= spine.nextPulseMs) {
        combatSpineRunSyncPulse();
        spine.nextPulseMs += COMBAT_SPINE_BALANCE.pulseIntervalMs;
    }

    const fill = (COMBAT_SPINE_BALANCE.baseFillPerSec * dt) / 1000;
    const glareMult = 1 - Math.min(0.35, (spine.glareStacks || 0) * (COMBAT_SPINE_BALANCE.glareFillSlowPct / 100));
    spine.atb.player = Math.min(COMBAT_SPINE_BALANCE.atbMax, spine.atb.player + fill * spine.speed.player * glareMult);
    spine.atb.enemy = Math.min(COMBAT_SPINE_BALANCE.atbMax, spine.atb.enemy + fill * spine.speed.enemy);

    spine.playerReady = spine.atb.player >= COMBAT_SPINE_BALANCE.atbMax;

    if (!spine.enemyActing && spine.atb.enemy >= COMBAT_SPINE_BALANCE.atbMax) {
        if (spine.atb.player >= COMBAT_SPINE_BALANCE.atbMax) {
            if (spine.speed.player >= spine.speed.enemy) {
                spine.playerReady = true;
            } else {
                combatSpineRunEnemyAction();
                return;
            }
        } else {
            combatSpineRunEnemyAction();
            return;
        }
    }

    if (spine.playerReady && G.combatPhase !== 'player' && !spine.enemyActing) {
        G.combatPhase = 'player';
        if (typeof setCombatInputEnabled === 'function') setCombatInputEnabled(true);
    }

    if (typeof updateCombatSpineBars === 'function') updateCombatSpineBars();
}

function combatSpineRunSyncPulse() {
    const spine = G.combatSpine;
    if (!spine) return;
    spine.zones.forEach(zone => {
        if (zone.type === 'sunPatch') {
            combatSpineApplyZoneTick(zone);
        }
    });
    combatSpineRunEnemyBleedHeartbeat();
}

function combatSpineApplyZoneTick(zone) {
    const spine = G.combatSpine;
    const pr = spine.player.r;
    const pc = spine.player.c;
    const inCore = combatSpineCellInCore(zone, pr, pc);
    const inPen = !inCore && combatSpineCellInPenumbra(zone, pr, pc);
    if (inCore) {
        const tickDmg = Math.max(1, Math.floor((G.enemy?.dmg || 5) * 0.15));
        G.hp = Math.max(0, G.hp - tickDmg);
        spine.glareStacks = (spine.glareStacks || 0) + 1;
        addCombatLog(`☀️ Radiance scorches you for ${tickDmg} (Glare +1).`, 'entry-hp');
    } else if (inPen) {
        spine.glareStacks = (spine.glareStacks || 0) + COMBAT_SPINE_BALANCE.penumbraGlareFrac;
        addCombatLog(`☀️ Heat-haze dazzles your senses (Glare +${COMBAT_SPINE_BALANCE.penumbraGlareFrac}).`, 'entry-mod');
    }
    if (G.hp <= 0 && typeof handlePlayerCombatDefeat === 'function') handlePlayerCombatDefeat();
}

function combatSpineCellInCore(zone, r, c) {
    const half = Math.floor(zone.radius);
    return Math.abs(r - zone.centerR) <= half && Math.abs(c - zone.centerC) <= half;
}

function combatSpineCellInPenumbra(zone, r, c) {
    const half = Math.floor(zone.radius);
    const core = combatSpineCellInCore(zone, r, c);
    if (core) return false;
    return Math.abs(r - zone.centerR) <= half + 1 && Math.abs(c - zone.centerC) <= half + 1;
}

function combatSpineChebyshevDist(r1, c1, r2, c2) {
    return Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2));
}

function getCombatSpinePlayerReach() {
    let wt = 'fist';
    if (typeof getEquippedInstance === 'function') {
        const inst = getEquippedInstance('weapon');
        const def = typeof getEffectiveGearDef === 'function' ? getEffectiveGearDef(inst) : getInstanceDef(inst);
        if (def && def.weaponType) wt = def.weaponType;
    }
    if (G.path === 'soul') return 2;
    if (G.path === 'body') return COMBAT_WEAPON_REACH.fist;
    return COMBAT_WEAPON_REACH[wt] || COMBAT_WEAPON_REACH.default;
}

function combatSpineCanPlayerAttackEnemy() {
    if (!G.combatSpine || !G.enemy) return true;
    const d = combatSpineChebyshevDist(
        G.combatSpine.player.r, G.combatSpine.player.c,
        G.combatSpine.enemy.r, G.combatSpine.enemy.c
    );
    return d <= getCombatSpinePlayerReach();
}

function combatSpineIsEdgeCell(r, c) {
    const spine = G.combatSpine;
    if (!spine) return false;
    return r === 0 || c === 0 || r === spine.height - 1 || c === spine.width - 1;
}

function combatSpineConsumePlayerAtb(windupPct) {
    const spine = G.combatSpine;
    if (!spine) return;
    windupPct = windupPct != null ? windupPct : 0;
    spine.atb.player = -Math.floor(COMBAT_SPINE_BALANCE.atbMax * windupPct);
    spine.playerReady = false;
    G.combatPhase = 'atb';
    if (typeof setCombatInputEnabled === 'function') setCombatInputEnabled(false);
}

function combatSpineAfterPlayerAction() {
    combatSpineConsumePlayerAtb(0);
    if (typeof renderCombatSpineGrid === 'function') renderCombatSpineGrid();
}

function combatSpineMoveEntity(entity, dr, dc) {
    const spine = G.combatSpine;
    if (!spine) return false;
    const pos = entity === 'player' ? spine.player : spine.enemy;
    const nr = pos.r + dr;
    const nc = pos.c + dc;
    if (nr < 0 || nc < 0 || nr >= spine.height || nc >= spine.width) return false;
    pos.r = nr;
    pos.c = nc;
    if (entity === 'enemy') {
        spine.zones.forEach(z => {
            if (z.follow === 'enemy') {
                z.centerR = spine.enemy.r;
                z.centerC = spine.enemy.c;
            }
        });
    }
    return true;
}

function combatSpineMovePlayer(dr, dc) {
    if (!canPlayerAct() || !isCombatSpineActive()) return false;
    const cfg = getCombatConfig();
    const cost = cfg.costs.move || cfg.costs.attack;
    if (typeof spendCombatResource === 'function' && !spendCombatResource(cost, 'Move')) return false;
    if (!combatSpineMoveEntity('player', dr, dc)) {
        addCombatLog('🧱 Cannot move — edge or wall.');
        return false;
    }
    addCombatLog(`👣 You shift on the courtyard (${G.combatSpine.player.r},${G.combatSpine.player.c}).`);
    combatSpineAfterPlayerAction();
    if (typeof renderCombatSpineGrid === 'function') renderCombatSpineGrid();
    return true;
}

function combatSpineAttemptFlee() {
    if (!isCombatSpineActive()) return false;
    const spine = G.combatSpine;
    const { r, c } = spine.player;
    if (spine.fleePolicy !== 'open') {
        addCombatLog('🚪 No open escape — find an exit or break through.');
        return false;
    }
    if (!combatSpineIsEdgeCell(r, c)) {
        addCombatLog('🏃 Reach the courtyard edge before you flee.');
        return false;
    }
    const inCore = spine.zones.some(z => combatSpineCellInCore(z, r, c));
    if (inCore) {
        addCombatLog('☀️ You cannot flee while standing in the heart of the flare.');
        return false;
    }
    const cfg = getCombatConfig();
    const cost = cfg.costs.flee;
    if (typeof spendCombatResource === 'function' && !spendCombatResource(cost, 'Flee')) return false;
    combatSpineConsumePlayerAtb(0);
    addCombatLog('🏃 You vault the wall and break off the fight.');
    if (G.fame > 0) G.fame -= 1;
    endCombat({ fled: true });
    return true;
}

function combatSpineRunEnemyAction() {
    const spine = G.combatSpine;
    if (!spine || !G.enemy || spine.enemyActing) return;
    spine.enemyActing = true;
    spine.atb.enemy = 0;
    G.combatPhase = 'enemy';
    if (typeof setCombatInputEnabled === 'function') setCombatInputEnabled(false);

    setTimeout(() => {
        spine.enemyActing = false;
        if (!G.inCombat || !G.enemy) return;
        if (G.enemy.skipTurns > 0) {
            G.enemy.skipTurns--;
            addCombatLog(`❄️ ${stripEnemyDisplayPrefix(G.enemy.name)} is bound — cannot act!`, 'entry-mod');
        } else {
            combatSpineEnemyAiStep();
        }
        if (G.hp <= 0) return;
        if (G.enemy.hp <= 0) {
            combatVictory(false);
            return;
        }
        combatEndOfTurnRegen();
        G.combatPhase = 'atb';
        if (typeof renderCombatSpineGrid === 'function') renderCombatSpineGrid();
        updateCombatUI();
    }, COMBAT_BALANCE.enemyTurnDelayMs || 400);
}

function combatSpineEnemyAiStep() {
    const spine = G.combatSpine;
    if (!spine || !G.enemy) return;
    const dist = combatSpineChebyshevDist(
        spine.player.r, spine.player.c,
        spine.enemy.r, spine.enemy.c
    );
    const reach = getEnemyMeleeReach(G.enemy);
    if (dist <= reach) {
        if (hasEnemyAbilityKit(G.enemy)) {
            enemyAbilityTurn(G.enemy);
        } else {
            const rawDmg = calcEnemyStrikeDamage(G.enemy, 1);
            resolveEnemyStrike(G.enemy.name, rawDmg, { displayRaw: rawDmg });
        }
        return;
    }
    const dr = Math.sign(spine.player.r - spine.enemy.r);
    const dc = Math.sign(spine.player.c - spine.enemy.c);
    if (Math.abs(spine.player.r - spine.enemy.r) >= Math.abs(spine.player.c - spine.enemy.c)) {
        combatSpineMoveEntity('enemy', dr, 0);
    } else {
        combatSpineMoveEntity('enemy', 0, dc);
    }
    addCombatLog(`👣 ${stripEnemyDisplayPrefix(G.enemy.name)} advances (${spine.enemy.r},${spine.enemy.c}).`);
}

// ----- Unified hit pipeline -----

function ensureEnemyCombatConsequences(enemy) {
    if (!enemy) return null;
    if (!enemy.combatConsequences) {
        enemy.combatConsequences = {
            circulationStage: 0,
            coreShaken: false,
            structureSlots: [],
            bleedInstances: [],
            modifiers: { atbMult: 1, defendMult: 1, damageTakenMult: 1, healMult: 1 }
        };
    }
    return enemy.combatConsequences;
}

function ensureEnemyCombatSystems(enemy) {
    if (!enemy) return;
    if (!enemy.systemStress) {
        enemy.systemStress = { flesh: 0, structure: 0, circulation: 0, core: 0 };
    }
    if (!enemy.systemBreaks) {
        enemy.systemBreaks = {
            flesh: false,
            structureCount: 0,
            core: false,
            circHalfLatched: false,
            circPeakCount: 0
        };
    }
    ensureEnemyCombatConsequences(enemy);
}

function recomputeEnemyCombatModifiers(enemy) {
    const cc = ensureEnemyCombatConsequences(enemy);
    if (!cc) return;
    cc.modifiers = { atbMult: 1, defendMult: 1, damageTakenMult: 1, healMult: 1 };
    cc.structureSlots.forEach(slot => {
        if (slot.slot === 'leg') cc.modifiers.atbMult *= 0.65;
        if (slot.slot === 'frame') {
            cc.modifiers.defendMult *= 0.5;
            cc.modifiers.damageTakenMult *= 1.12;
        }
        if (slot.slot === 'arm') cc.modifiers.atbMult *= 0.92;
    });
    if (cc.coreShaken) cc.modifiers.damageTakenMult *= 1.15;
    const bleeds = cc.bleedInstances || [];
    if (bleeds.some(b => b.severity === 'gush')) cc.modifiers.healMult = 0.25;
    else if (bleeds.some(b => b.severity === 'wound' || b.severity === 'gush')) cc.modifiers.healMult = 0.5;
    if (G.combatSpine?.enabled && G.enemy === enemy) {
        G.combatSpine.speed.enemy = calcCombatSpineSpeed(false);
    }
}

function getEnemyDefendEffectivenessMult(enemy) {
    ensureEnemyCombatSystems(enemy);
    return enemy.combatConsequences?.modifiers?.defendMult ?? 1;
}

function getEnemyHealMult(enemy) {
    ensureEnemyCombatSystems(enemy);
    return enemy.combatConsequences?.modifiers?.healMult ?? 1;
}

function getEnemyDamageTakenMult(enemy) {
    ensureEnemyCombatSystems(enemy);
    return enemy.combatConsequences?.modifiers?.damageTakenMult ?? 1;
}

function addEnemyBleedInstance(enemy, severity, source) {
    const def = COMBAT_BLEED_SEVERITY[severity] || COMBAT_BLEED_SEVERITY.nick;
    const cc = ensureEnemyCombatConsequences(enemy);
    cc.bleedInstances.push({
        severity: def.label,
        perTickPctMaxHp: def.perTickPctMaxHp,
        source: source || 'unknown'
    });
    recomputeEnemyCombatModifiers(enemy);
}

function combatSpineRunEnemyBleedHeartbeat() {
    if (!G.enemy || !isCombatSpineActive()) return;
    const enemy = G.enemy;
    const cc = ensureEnemyCombatConsequences(enemy);
    const instances = cc.bleedInstances;
    if (!instances || !instances.length) return;
    const hpCap = Math.max(1, enemy.maxHp || enemy.hp || 1);
    let total = 0;
    instances.forEach(inst => {
        total += Math.max(1, Math.floor(hpCap * (inst.perTickPctMaxHp || 0.01)));
    });
    if (total <= 0) return;
    enemy.hp = Math.max(0, enemy.hp - total);
    addCombatLog(`🩸 Bleeding wounds weep for ${total}.`, 'entry-hp');
    if (enemy.hp <= 0 && typeof combatVictory === 'function') combatVictory(false);
    else if (typeof updateCombatUI === 'function') updateCombatUI();
}

function pickStructureOutcomeSlot(enemy, profile) {
    const taken = (enemy.combatConsequences?.structureSlots || []).map(s => s.slot);
    const pool = ['arm', 'leg', 'frame'].filter(s => !taken.includes(s));
    if (!pool.length) return null;
    const tags = profile.tags || [];
    const nature = profile.nature || 'slash';
    const weights = {};
    pool.forEach(s => { weights[s] = 1; });
    if (tags.includes('sweep') || tags.includes('leg')) pool.forEach(s => { if (s === 'leg') weights[s] += 3; });
    if (tags.includes('arm') || (nature === 'crush' && tags.includes('crush'))) pool.forEach(s => { if (s === 'arm') weights[s] += 2; });
    if (tags.includes('frame') || nature === 'crush') pool.forEach(s => { if (s === 'frame') weights[s] += 2; });
    if (pool.length === 3 && !tags.length) {
        weights.frame = 4;
        weights.leg = 3.5;
        weights.arm = 2.5;
    }
    const bag = [];
    pool.forEach(s => {
        const w = Math.max(1, Math.floor(weights[s] || 1));
        for (let i = 0; i < w; i++) bag.push(s);
    });
    return bag[Math.floor(Math.random() * bag.length)];
}

function applyStructureBreakConsequences(enemy, profile, out) {
    const slot = pickStructureOutcomeSlot(enemy, profile);
    if (!slot) return;
    const cc = ensureEnemyCombatConsequences(enemy);
    cc.structureSlots.push({ slot });
    recomputeEnemyCombatModifiers(enemy);
    if (slot === 'arm') {
        addEnemyBleedInstance(enemy, 'gush', 'structure_arm');
        out.logLines.push('🦴 Arm broken — blood pours freely.');
    } else if (slot === 'leg') {
        out.logLines.push('🦴 Leg ruined — they can barely keep pace.');
    } else {
        out.logLines.push('🦴 Frame cracked — their guard buckles.');
    }
}

function applyFleshBreakConsequences(enemy, out) {
    addEnemyBleedInstance(enemy, 'nick', 'flesh_break');
    out.logLines.push('🩸 Flesh yields — bleeding.');
}

function applyCoreBreakConsequences(enemy, out) {
    const cc = ensureEnemyCombatConsequences(enemy);
    cc.coreShaken = true;
    recomputeEnemyCombatModifiers(enemy);
    out.logLines.push('💥 Core shaken — their foundation trembles.');
}

function advanceCirculationStage(enemy, out) {
    const s = enemy.systemStress.circulation;
    const thr = COMBAT_SPINE_BALANCE.circulationBreakThreshold;
    const half = thr * COMBAT_SPINE_BALANCE.circulationShakenFraction;
    const b = enemy.systemBreaks;
    const cc = ensureEnemyCombatConsequences(enemy);

    if (!b.circHalfLatched && s >= half) {
        b.circHalfLatched = true;
        if (cc.circulationStage < 1) {
            cc.circulationStage = 1;
            out.logLines.push('🌀 Meridians shake — techniques feel sticky.');
        }
    }
    if (s >= thr) {
        b.circPeakCount = (b.circPeakCount || 0) + 1;
        if (cc.circulationStage < 2) {
            cc.circulationStage = 2;
            enemy.systemStress.circulation = thr * COMBAT_SPINE_BALANCE.circulationStressResetFraction;
            out.logLines.push('🌀 Channels damaged — techniques falter.');
        } else if (cc.circulationStage === 2) {
            cc.circulationStage = 3;
            enemy.systemStress.circulation = 0;
            out.logLines.push('🌀 Circulation seized — qi arts fail.');
        }
        recomputeEnemyCombatModifiers(enemy);
    }
}

function isEnemyAbilityQiFlavored(ability) {
    if (!ability) return false;
    const effect = ability.effect || {};
    if (effect.spiritDamage || effect.applyPlayer?.spiritDamage) return true;
    if (effect.stripShieldPct) return true;
    if (effect.applyPlayer && (effect.applyPlayer.poisonTurns || effect.applyPlayer.skipPlayerTurn)) return true;
    const tele = (ability.telegraph || ability.id || '').toLowerCase();
    return /qi|soul|frost|venom|phantom|spirit|seal|hex|curse|wave|aura/.test(tele);
}

function isEnemyAbilityHeavy(ability) {
    if (!ability) return false;
    if (ability.combatKind === 'heavy' || ability.combatKind === 'twoHand') return true;
    const effect = ability.effect || {};
    return (effect.bonusDmgMult || 1) >= 1.2 && !effect.noDamage;
}

function enemyAbilityAllowedByCirculation(enemy, ability) {
    ensureEnemyCombatSystems(enemy);
    const stage = enemy.combatConsequences?.circulationStage || 0;
    const qi = isEnemyAbilityQiFlavored(ability);
    if (!qi) return { ok: true, weightMult: 1 };
    if (stage >= 3) return { ok: false, reason: 'seized' };
    if (stage >= 2 && Math.random() < COMBAT_SPINE_BALANCE.circulationFizzleChance) {
        return { ok: false, reason: 'fizzle' };
    }
    return { ok: true, weightMult: stage >= 1 ? COMBAT_SPINE_BALANCE.circulationQiWeightMult : 1 };
}

function enemyAbilityBlockedByArmBreak(enemy, ability) {
    ensureEnemyCombatSystems(enemy);
    const armBroken = enemy.combatConsequences?.structureSlots?.some(s => s.slot === 'arm');
    return armBroken && isEnemyAbilityHeavy(ability);
}

function getEnemyMeleeReach(enemy) {
    let reach = 1;
    const cc = enemy?.combatConsequences;
    if (cc?.structureSlots?.some(s => s.slot === 'arm')) reach = Math.max(1, reach - 1);
    return reach;
}

function buildAttackProfileFromEnemyStrike(hpDamage, opts) {
    opts = opts || {};
    const nature = opts.spiritDamage ? 'soul-cut' : 'crush';
    return {
        source: 'enemy',
        hp: hpDamage,
        nature,
        stress: defaultStressForNature(nature),
        tags: opts.fromTechnique ? ['technique'] : []
    };
}

function defaultStressForNature(nature) {
    const n = nature || 'slash';
    if (n === 'crush') return { flesh: 0.2, structure: 0.65, circulation: 0.05, core: 0.1 };
    if (n === 'needle' || n === 'seal') return { flesh: 0.15, structure: 0.1, circulation: 0.65, core: 0.1 };
    if (n === 'pierce' || n === 'execute') return { flesh: 0.15, structure: 0.2, circulation: 0.15, core: 0.5 };
    return { flesh: 0.55, structure: 0.25, circulation: 0.12, core: 0.08 };
}

function buildAttackProfileFromBasic(hpDamage) {
    const nature = G.path === 'soul' ? 'soul-cut' : G.path === 'body' ? 'crush' : 'slash';
    return {
        source: 'basic',
        hp: hpDamage,
        nature,
        stress: defaultStressForNature(nature),
        tags: []
    };
}

function buildAttackProfileFromTechnique(tech, hpDamage) {
    const meta = typeof getTechniqueMeta === 'function' ? getTechniqueMeta(tech) : tech;
    let nature = 'slash';
    const tier = typeof getTechniqueCombatTier === 'function' ? getTechniqueCombatTier(tech) : 'medium';
    if (tier === 'heavy') nature = 'crush';
    if (meta.element === 'soul' || meta.spiritDamage) nature = 'soul-cut';
    return {
        source: 'technique',
        hp: hpDamage,
        nature,
        stress: defaultStressForNature(nature),
        tags: [],
        techName: tech.name
    };
}

function resolveCombatHit(profile, target, ctx) {
    ctx = ctx || {};
    ensureEnemyCombatSystems(target);
    const out = {
        hpDamage: Math.max(0, Math.floor(profile.hp || 0)),
        stressApplied: {},
        breaks: [],
        logLines: []
    };
    out.hpDamage = Math.floor(out.hpDamage * getEnemyDamageTakenMult(target));
    if (ctx.applyDefend && target.defending) {
        out.hpDamage = Math.floor(out.hpDamage * (ctx.defendMult != null ? ctx.defendMult : 0.45));
        target.defending = false;
    }
    const stress = profile.stress || defaultStressForNature(profile.nature);
    const totalW = Math.max(0.001, (stress.flesh || 0) + (stress.structure || 0) + (stress.circulation || 0) + (stress.core || 0));
    let scale = out.hpDamage / 50;
    const cc = target.combatConsequences;
    if (cc?.coreShaken && (profile.nature === 'pierce' || profile.nature === 'execute' || (profile.tags || []).includes('execute'))) {
        scale *= 1.25;
    }
    ['flesh', 'structure', 'circulation', 'core'].forEach(key => {
        const add = ((stress[key] || 0) / totalW) * scale * 0.35;
        target.systemStress[key] = (target.systemStress[key] || 0) + add;
        out.stressApplied[key] = add;
    });
    combatSpineCheckSystemBreaks(target, profile, out);
    advanceCirculationStage(target, out);
    return out;
}

function combatSpineCheckSystemBreaks(target, profile, out) {
    const s = target.systemStress;
    const b = target.systemBreaks;
    if (!b.flesh && s.flesh >= COMBAT_SPINE_BALANCE.fleshBreakThreshold) {
        b.flesh = true;
        out.breaks.push('flesh');
        applyFleshBreakConsequences(target, out);
    }
    if (b.structureCount < COMBAT_SPINE_BALANCE.maxStructureBreaks
        && s.structure >= COMBAT_SPINE_BALANCE.structureBreakThreshold) {
        b.structureCount++;
        s.structure = 0;
        out.breaks.push('structure');
        applyStructureBreakConsequences(target, profile, out);
    }
    if (!b.core && s.core >= COMBAT_SPINE_BALANCE.coreBreakThreshold) {
        b.core = true;
        out.breaks.push('core');
        applyCoreBreakConsequences(target, out);
    }
}

function applyResolvedHitToEnemy(target, profile, ctx) {
    ctx = ctx || {};
    if (typeof applyMirrorDamageToReflection === 'function') {
        profile = Object.assign({}, profile, { hp: applyMirrorDamageToReflection(profile.hp) });
    }
    if (target.defending && !ctx.applyDefend) {
        ctx = Object.assign({}, ctx, {
            applyDefend: true,
            defendMult: (ctx.defendMult != null ? ctx.defendMult : 0.45) * getEnemyDefendEffectivenessMult(target)
        });
    }
    const res = resolveCombatHit(profile, target, ctx);
    target.hp -= res.hpDamage;
    res.logLines.forEach(line => addCombatLog(line, 'entry-mod'));
    if (typeof updateCombatUI === 'function') updateCombatUI();
    return res;
}

function getEnemySystemStressSummary(enemy) {
    ensureEnemyCombatSystems(enemy);
    const s = enemy.systemStress;
    return `F${Math.floor(s.flesh * 100)} St${Math.floor(s.structure * 100)} Ci${Math.floor(s.circulation * 100)} Co${Math.floor(s.core * 100)}`;
}
