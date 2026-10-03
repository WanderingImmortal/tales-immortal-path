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
    glareFillSlowPct: 8
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
    if (typeof getEquippedInstance === 'function' && typeof getInstanceDef === 'function') {
        const def = getInstanceDef(getEquippedInstance('weapon'));
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
    const reach = 1;
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

function ensureEnemyCombatSystems(enemy) {
    if (!enemy) return;
    if (!enemy.systemStress) {
        enemy.systemStress = { flesh: 0, structure: 0, circulation: 0, core: 0 };
    }
    if (!enemy.systemBreaks) {
        enemy.systemBreaks = { flesh: false, structureCount: 0, circulation: false, core: false };
    }
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
    if (ctx.applyDefend && target.defending) {
        out.hpDamage = Math.floor(out.hpDamage * (ctx.defendMult != null ? ctx.defendMult : 0.45));
        target.defending = false;
    }
    const stress = profile.stress || defaultStressForNature(profile.nature);
    const totalW = Math.max(0.001, (stress.flesh || 0) + (stress.structure || 0) + (stress.circulation || 0) + (stress.core || 0));
    const scale = out.hpDamage / 50;
    ['flesh', 'structure', 'circulation', 'core'].forEach(key => {
        const add = ((stress[key] || 0) / totalW) * scale * 0.35;
        target.systemStress[key] = (target.systemStress[key] || 0) + add;
        out.stressApplied[key] = add;
    });
    combatSpineCheckSystemBreaks(target, out);
    return out;
}

function combatSpineCheckSystemBreaks(target, out) {
    const s = target.systemStress;
    const b = target.systemBreaks;
    if (!b.flesh && s.flesh >= COMBAT_SPINE_BALANCE.fleshBreakThreshold) {
        b.flesh = true;
        out.breaks.push('flesh');
        out.logLines.push('🩸 Flesh yields — bleeding.');
    }
    if (b.structureCount < COMBAT_SPINE_BALANCE.maxStructureBreaks
        && s.structure >= COMBAT_SPINE_BALANCE.structureBreakThreshold) {
        b.structureCount++;
        s.structure = 0;
        out.breaks.push('structure');
        out.logLines.push('🦴 Structure cracks — their frame falters.');
    }
    if (!b.circulation && s.circulation >= COMBAT_SPINE_BALANCE.circulationBreakThreshold) {
        b.circulation = true;
        out.logLines.push('🌀 Meridians seize — circulation broken.');
    }
    if (!b.core && s.core >= COMBAT_SPINE_BALANCE.coreBreakThreshold) {
        b.core = true;
        out.logLines.push('💥 Core pressure — dantian stressed.');
    }
}

function applyResolvedHitToEnemy(target, profile, ctx) {
    if (typeof applyMirrorDamageToReflection === 'function') {
        profile = Object.assign({}, profile, { hp: applyMirrorDamageToReflection(profile.hp) });
    }
    const res = resolveCombatHit(profile, target, ctx);
    target.hp -= res.hpDamage;
    res.logLines.forEach(line => addCombatLog(line, 'entry-mod'));
    return res;
}

function getEnemySystemStressSummary(enemy) {
    ensureEnemyCombatSystems(enemy);
    const s = enemy.systemStress;
    return `F${Math.floor(s.flesh * 100)} St${Math.floor(s.structure * 100)} Ci${Math.floor(s.circulation * 100)} Co${Math.floor(s.core * 100)}`;
}
