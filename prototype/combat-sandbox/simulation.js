'use strict';

const {
    FIXED_DT,
    ARENA,
    ATTACKS,
    REACTIONS,
    DEFAULT_PARAMS,
    CANCEL_PREP_RECOVERY
} = require('./constants');
const geo = require('./geometry');
const { createRng } = require('./rng');

function cloneParams(p) {
    return { ...DEFAULT_PARAMS, ...p };
}

function createFighter(id, role, params, spawn) {
    return {
        id,
        role,
        x: spawn.x,
        y: spawn.y,
        facing: spawn.facing ?? 0,
        hp: 100,
        maxHp: 100,
        params: cloneParams(params),
        action: { type: 'idle', phase: 'idle', startedAt: 0 },
        moveTarget: null,
        riposteUntil: 0,
        stunUntil: 0,
        lastHitBy: null
    };
}

function createSimulation(options = {}) {
    const seed = options.seed ?? 1;
    const rng = createRng(seed);
    const preset = options.preset || {};
    const playerParams = cloneParams(options.playerParams || preset.player || DEFAULT_PARAMS);
    const opponentParams = cloneParams(options.opponentParams || preset.opponent || DEFAULT_PARAMS);

    const state = {
        time: 0,
        seed,
        dt: FIXED_DT,
        speedMult: 1,
        paused: true,
        pauseReason: 'start',
        autoPauseOnDecision: options.autoPauseOnDecision !== false,
        fighters: [
            createFighter('player', 'player', playerParams, { x: 4, y: ARENA.height / 2, facing: 0 }),
            createFighter('opponent', 'opponent', opponentParams, {
                x: ARENA.width - 4,
                y: ARENA.height / 2,
                facing: Math.PI
            })
        ],
        log: [],
        pendingDecision: null,
        activeTelegraphs: [],
        winner: null
    };

    function fighterById(id) {
        return state.fighters.find(f => f.id === id);
    }

    function opponentOf(id) {
        return state.fighters.find(f => f.id !== id);
    }

    function pushLog(text, detail) {
        state.log.push({ t: state.time, text, detail: detail || null });
        if (state.log.length > 200) state.log.shift();
    }

    function setPaused(reason) {
        state.paused = true;
        state.pauseReason = reason || 'manual';
    }

    function setRunning() {
        state.paused = false;
        state.pauseReason = null;
    }

    function isBusy(f) {
        if (state.time < f.stunUntil) return true;
        const a = f.action;
        if (a.type === 'idle') return false;
        if (a.type === 'move') return true;
        if (a.type === 'attack' && a.phase === 'recovery') return true;
        if (a.type === 'attack' && (a.phase === 'prep' || a.phase === 'exec')) return true;
        if (a.type === 'react') return a.phase !== 'done';
        return false;
    }

    function canCancelAttack(f) {
        return f.action.type === 'attack' && f.action.phase === 'prep';
    }

    function startMove(f, tx, ty) {
        if (isBusy(f) && !canCancelAttack(f)) return { ok: false, reason: 'busy' };
        if (canCancelAttack(f)) {
            f.action = { type: 'idle', phase: 'recovery', startedAt: state.time, until: state.time + CANCEL_PREP_RECOVERY };
            pushLog(`${f.role} cancelled attack prep (+${CANCEL_PREP_RECOVERY}s recovery).`, { fighter: f.id });
        }
        f.moveTarget = { x: tx, y: ty };
        f.action = { type: 'move', phase: 'moving', startedAt: state.time };
        return { ok: true };
    }

    function startAttack(f, kind) {
        const atk = ATTACKS[kind];
        if (!atk) return { ok: false, reason: 'unknown_attack' };
        if (isBusy(f)) return { ok: false, reason: 'busy' };
        f.moveTarget = null;
        const opp = opponentOf(f.id);
        if (opp) f.facing = Math.atan2(opp.y - f.y, opp.x - f.x);
        f.action = {
            type: 'attack',
            kind,
            phase: 'prep',
            startedAt: state.time,
            prepEnd: state.time + atk.prep,
            execEnd: state.time + atk.prep + atk.exec,
            recoveryEnd: state.time + atk.prep + atk.exec + atk.recovery,
            hitResolved: false,
            interrupted: false
        };
        pushLog(`${f.role} begins ${atk.label} (prep ${atk.prep}s).`, { fighter: f.id, attack: kind });
        registerTelegraph(f, atk);
        return { ok: true };
    }

    function registerTelegraph(attacker, atk) {
        const impactAt = state.time + atk.prep;
        const tele = {
            id: `${attacker.id}-${state.time}`,
            attackerId: attacker.id,
            kind: atk.id,
            detectedAt: null,
            prepEnd: impactAt,
            impactAt,
            execEnd: state.time + atk.prep + atk.exec,
            recoveryEnd: state.time + atk.prep + atk.exec + atk.recovery,
            resolved: false
        };
        state.activeTelegraphs.push(tele);
    }

    function perceptionDelay(observer, attacker, atk) {
        const dist = geo.dist(observer.x, observer.y, attacker.x, attacker.y);
        const distFactor = geo.clamp(dist / atk.telegraphRange, 0, 1) * 0.12;
        const skill = observer.params.perception * 0.08 + observer.params.martialSkill * 0.06;
        return Math.max(0.04, 0.18 - skill + distFactor);
    }

    function tryDetectTelegraphs() {
        for (const tele of state.activeTelegraphs) {
            if (tele.detectedAt != null || tele.resolved) continue;
            const attacker = fighterById(tele.attackerId);
            const defender = opponentOf(tele.attackerId);
            if (!attacker || !defender) continue;
            const atk = ATTACKS[tele.kind];
            const detectT = tele.prepEnd - atk.prep + perceptionDelay(defender, attacker, atk);
            if (state.time >= detectT) {
                tele.detectedAt = state.time;
                const reactReadyAt = state.time + defender.params.reactionLatency;
                const hitAt = tele.impactAt;
                const timeToHit = hitAt - reactReadyAt;
                pushLog(
                    `${defender.role} detects ${attacker.role}'s ${atk.label} (${timeToHit.toFixed(2)}s after reaction delay before hit).`,
                    { telegraph: tele.id, timeToHit, reactReadyAt, hitAt }
                );
                if (defender.role === 'player' && state.autoPauseOnDecision) {
                    state.pendingDecision = {
                        telegraphId: tele.id,
                        defenderId: defender.id,
                        attackerId: attacker.id,
                        reactReadyAt,
                        hitAt,
                        attackKind: tele.kind
                    };
                    setPaused('reaction_decision');
                }
            }
        }
    }

    function startReaction(f, kind, opts = {}) {
        const react = REACTIONS[kind];
        if (!react) return { ok: false, reason: 'unknown_reaction' };
        const readyAt = opts.reactReadyAt ?? state.time + f.params.reactionLatency;
        if (state.time < readyAt - 1e-6 && !opts.force) {
            return { ok: false, reason: 'reaction_not_ready', readyAt };
        }
        if (isBusy(f) && !opts.force) return { ok: false, reason: 'busy' };
        f.moveTarget = null;
        if (kind === 'counter') {
            const opp = opponentOf(f.id);
            if (opp) f.facing = Math.atan2(opp.y - f.y, opp.x - f.x);
        }
        const startAt = Math.max(state.time, readyAt);
        const activeSpan = kind === 'counter'
            ? react.prep + react.exec
            : (react.activeDuration || react.moveDuration || 0);
        f.action = {
            type: 'react',
            kind,
            phase: 'windup',
            startedAt: startAt,
            windupEnd: startAt + react.decisionToStart,
            activeEnd: startAt + react.decisionToStart + activeSpan,
            recoveryEnd: startAt + react.decisionToStart + activeSpan + react.recovery,
            evadeDir: opts.evadeDir || null,
            hitResolved: false
        };
        pushLog(`${f.role} attempts ${react.label} (latency honored; starts ${(startAt - state.time).toFixed(2)}s from now).`, {
            fighter: f.id,
            reaction: kind,
            startAt
        });
        return { ok: true, startAt };
    }

    function resolveAttackHit(attacker, defender, atk) {
        const hit = geo.pointInSector(
            defender.x,
            defender.y,
            attacker.x,
            attacker.y,
            attacker.facing,
            atk.reach,
            atk.halfAngleRad
        );
        if (!hit.inside) {
            return { connected: false, reason: 'out_of_arc', ...hit };
        }
        return { connected: true, reason: 'in_arc', ...hit };
    }

    function applyDamage(defender, raw, note) {
        const dmg = Math.max(0, Math.round(raw));
        defender.hp = Math.max(0, defender.hp - dmg);
        pushLog(note.replace('{dmg}', String(dmg)), { damage: dmg, hp: defender.hp });
        if (defender.hp <= 0) {
            state.winner = opponentOf(defender.id).id;
            setPaused('ko');
        }
    }

    function processAttackExec(f) {
        const a = f.action;
        const atk = ATTACKS[a.kind];
        const defender = opponentOf(f.id);
        if (!defender || a.hitResolved) return;
        a.hitResolved = true;
        const tele = state.activeTelegraphs.find(t => t.attackerId === f.id && !t.resolved);
        if (tele) tele.resolved = true;

        if (a.interrupted) {
            pushLog(`${f.role}'s ${atk.label} was interrupted — no hit check.`, { fighter: f.id });
            return;
        }

        const hit = resolveAttackHit(f, defender, atk);
        if (!hit.connected) {
            pushLog(`${f.role}'s ${atk.label} misses (${defender.role} outside reach/arc, Δangle ${hit.angleDelta.toFixed(2)} rad).`, {
                fighter: f.id,
                miss: true
            });
            return;
        }

        let damage = atk.baseDamage * f.params.attackPower;
        let outcome = 'clean_hit';

        const react = defender.action;
        if (react.type === 'react' && react.kind === 'evade') {
            const hitAfter = resolveAttackHit(f, defender, atk);
            if (!hitAfter.connected) {
                pushLog(`${defender.role} evades — left effective area before impact.`, { outcome: 'evade_success' });
                return;
            }
            if (react.phase === 'active') {
                damage *= 0.5;
                pushLog(`${defender.role} partial evade — still clipped for reduced damage.`, { outcome: 'partial_evade' });
            }
        } else if (react.type === 'react' && react.kind === 'parry'
            && (react.phase === 'active' || (state.time >= react.windupEnd && state.time <= react.activeEnd + FIXED_DT * 0.5))) {
            outcome = 'parried';
            f.action.interrupted = true;
            f.action.phase = 'recovery';
            f.action.recoveryEnd = state.time + 0.35;
            f.stunUntil = state.time + 0.2;
            defender.riposteUntil = state.time + REACTIONS.parry.riposteWindow;
            pushLog(`${defender.role} parries — ${f.role} staggered; riposte window open.`, { outcome });
            return;
        } else if (react.type === 'react' && react.phase === 'active') {
            if (react.kind === 'block') {
                const block = REACTIONS.block;
                const reduction = block.damageMult + defender.params.defensiveStrength * 0.35;
                damage *= geo.clamp(reduction, 0.15, 0.85);
                outcome = damage < atk.baseDamage * 0.5 ? 'partial_block' : 'weak_block';
                if (damage >= block.staggerThreshold) {
                    defender.stunUntil = state.time + 0.25;
                    outcome = 'block_broken';
                }
                pushLog(
                    `${defender.role} blocks — ${outcome}; ${damage.toFixed(1)} damage after defense (raw ${atk.baseDamage}).`,
                    { outcome, damage }
                );
            }
        } else if (react.type === 'react' && react.kind === 'evade' && react.phase === 'windup') {
            const timeLeft = react.windupEnd - state.time;
            pushLog(
                `${defender.role} too slow to evade (evade still winding up, ${timeLeft.toFixed(2)}s remaining) — hit lands.`,
                { impossible: true }
            );
        } else if (tele && tele.detectedAt == null) {
            pushLog(`${defender.role} did not detect the attack — no reaction opportunity.`, { undetected: true });
        } else if (tele && tele.detectedAt != null) {
            const need = defender.params.reactionLatency + REACTIONS.evade.decisionToStart + REACTIONS.evade.iFrameStart;
            const had = tele.impactAt - tele.detectedAt;
            if (had < need) {
                pushLog(
                    `${defender.role} detected but insufficient time (${had.toFixed(2)}s < ~${need.toFixed(2)}s needed for evade) — hit lands.`,
                    { detected_no_time: true, had, need }
                );
            }
        }

        applyDamage(defender, damage, `${f.role} ${atk.label} connects for {dmg} damage (${outcome}).`);
    }

    function processCounterExec(f) {
        const a = f.action;
        const react = REACTIONS.counter;
        const opp = opponentOf(f.id);
        if (!opp || a.hitResolved) return;
        a.hitResolved = true;
        const hit = geo.pointInSector(opp.x, opp.y, f.x, f.y, f.facing, react.reach, react.halfAngleRad);
        if (!hit.inside) {
            pushLog(`${f.role} counter misses — ${opp.role} not in arc.`, { fighter: f.id });
            return;
        }
        if (opp.action.type === 'attack' && opp.action.phase === 'prep') {
            opp.action.interrupted = true;
            opp.action.phase = 'recovery';
            opp.action.recoveryEnd = state.time + 0.4;
            pushLog(`${f.role} counter interrupts ${opp.role}'s preparation.`, { interrupt: true });
        }
        const dmg = react.baseDamage * f.params.attackPower * (1 + f.params.martialSkill * 0.25);
        applyDamage(opp, dmg, `${f.role} counter connects for {dmg} (during commitment).`);
    }

    function advanceFighter(f, dt) {
        if (state.time < f.stunUntil) return;

        const a = f.action;
        if (a.type === 'move' && f.moveTarget) {
            const step = f.params.moveSpeed * dt;
            const next = geo.moveToward(f.x, f.y, f.moveTarget.x, f.moveTarget.y, step);
            f.x = next.x;
            f.y = next.y;
            const clamped = geo.clampToArena(f.x, f.y, ARENA.width, ARENA.height, ARENA.bodyRadius);
            f.x = clamped.x;
            f.y = clamped.y;
            if (next.arrived) {
                f.moveTarget = null;
                f.action = { type: 'idle', phase: 'idle', startedAt: state.time };
            }
            return;
        }

        if (a.type === 'attack') {
            if (a.phase === 'prep' && state.time >= a.prepEnd) {
                a.phase = 'exec';
                if (!a.hitResolved) processAttackExec(f);
            }
            if (a.phase === 'exec') {
                if (state.time >= a.execEnd) a.phase = 'recovery';
            }
            if (a.phase === 'recovery' && state.time >= a.recoveryEnd) {
                f.action = { type: 'idle', phase: 'idle', startedAt: state.time };
            }
            return;
        }

        if (a.type === 'react') {
            const def = REACTIONS[a.kind];
            if (a.phase === 'windup' && state.time >= a.windupEnd) {
                a.phase = 'active';
                if (a.kind === 'evade') {
                    const opp = opponentOf(f.id);
                    let dir = a.evadeDir;
                    if (dir == null && opp) {
                        dir = Math.atan2(f.y - opp.y, f.x - opp.x);
                    }
                    a.evadeDir = dir ?? f.facing;
                }
            }
            if (a.phase === 'active' && a.kind === 'evade') {
                const speed = f.params.moveSpeed * REACTIONS.evade.moveSpeedMult;
                f.x += Math.cos(a.evadeDir) * speed * dt;
                f.y += Math.sin(a.evadeDir) * speed * dt;
                const clamped = geo.clampToArena(f.x, f.y, ARENA.width, ARENA.height, ARENA.bodyRadius);
                f.x = clamped.x;
                f.y = clamped.y;
            }
            if (a.phase === 'active' && state.time >= a.activeEnd) {
                a.phase = 'recovery';
            }
            if (a.phase === 'recovery' && state.time >= a.recoveryEnd) {
                f.action = { type: 'idle', phase: 'idle', startedAt: state.time };
            }
        }

        if (a.type === 'idle' && a.phase === 'recovery' && a.until && state.time >= a.until) {
            f.action = { type: 'idle', phase: 'idle', startedAt: state.time };
        }
    }

    function stepOneTick() {
        if (state.paused || state.winner) return { stepped: false };
        const dt = state.dt;
        tryDetectTelegraphs();
        for (const f of state.fighters) advanceFighter(f, dt);
        for (const f of state.fighters) {
            const ra = f.action;
            if (ra.type === 'react' && ra.kind === 'counter' && ra.phase === 'windup' && state.time >= ra.windupEnd) {
                ra.phase = 'active';
            }
            if (ra.type === 'react' && ra.kind === 'counter' && ra.phase === 'active') {
                const counter = REACTIONS.counter;
                if (!ra.counterPrepDone && state.time >= ra.windupEnd + counter.prep * 0.85) {
                    ra.counterPrepDone = true;
                    if (!ra.hitResolved) processCounterExec(f);
                }
            }
        }
        state.time += dt;
        state.activeTelegraphs = state.activeTelegraphs.filter(t => !t.resolved || state.time < t.recoveryEnd + 0.5);
        return { stepped: true };
    }

    function step(ticks = 1) {
        let n = 0;
        for (let i = 0; i < ticks; i++) {
            if (state.paused || state.winner) break;
            stepOneTick();
            n++;
        }
        return n;
    }

    function runUntil(timeLimit, maxTicks = 100000) {
        let ticks = 0;
        while (state.time < timeLimit && !state.winner && ticks < maxTicks) {
            if (state.paused) break;
            stepOneTick();
            ticks++;
        }
        return { ticks, time: state.time, winner: state.winner };
    }

    function reset(options = {}) {
        const sim = createSimulation({
            seed: options.seed ?? state.seed,
            playerParams: options.playerParams ?? state.fighters[0].params,
            opponentParams: options.opponentParams ?? state.fighters[1].params,
            autoPauseOnDecision: state.autoPauseOnDecision,
            preset: options.preset
        });
        return sim;
    }

    function queuePlayerAttack(kind) {
        const p = fighterById('player');
        if (!p) return { ok: false };
        state.pendingDecision = null;
        setRunning();
        return startAttack(p, kind);
    }

    function queuePlayerMove(tx, ty) {
        const p = fighterById('player');
        return startMove(p, tx, ty);
    }

    function queuePlayerReaction(kind, evadeDir) {
        const p = fighterById('player');
        if (!p) return { ok: false };
        const pd = state.pendingDecision;
        const opts = pd ? { reactReadyAt: Math.max(state.time, pd.reactReadyAt), force: true } : {};
        if (evadeDir != null) opts.evadeDir = evadeDir;
        const res = startReaction(p, kind, opts);
        if (res.ok) {
            state.pendingDecision = null;
            setRunning();
        }
        return res;
    }

    function cancelPlayerAttack() {
        const p = fighterById('player');
        if (!canCancelAttack(p)) return { ok: false };
        p.action = { type: 'idle', phase: 'recovery', startedAt: state.time, until: state.time + CANCEL_PREP_RECOVERY };
        pushLog('Player cancelled attack during preparation.', {});
        return { ok: true };
    }

    function getSnapshot() {
        return JSON.parse(JSON.stringify({
            time: state.time,
            paused: state.paused,
            pauseReason: state.pauseReason,
            speedMult: state.speedMult,
            fighters: state.fighters,
            pendingDecision: state.pendingDecision,
            winner: state.winner,
            log: state.log.slice(-30)
        }));
    }

    function replay(inputs, maxTicks = 5000) {
        setRunning();
        let i = 0;
        for (let t = 0; t < maxTicks; t++) {
            while (i < inputs.length && inputs[i].at <= state.time) {
                const cmd = inputs[i];
                if (cmd.type === 'attack') startAttack(fighterById(cmd.who), cmd.kind);
                else if (cmd.type === 'move') startMove(fighterById(cmd.who), cmd.x, cmd.y);
                else if (cmd.type === 'react') startReaction(fighterById(cmd.who), cmd.kind, cmd.opts || {});
                i++;
            }
            if (state.winner) break;
            stepOneTick();
        }
        return getSnapshot();
    }

    return {
        state,
        rng,
        FIXED_DT,
        ARENA,
        ATTACKS,
        REACTIONS,
        fighterById,
        opponentOf,
        pushLog,
        setPaused,
        setRunning,
        step,
        stepOneTick,
        runUntil,
        reset,
        startAttack,
        startMove,
        startReaction,
        queuePlayerAttack,
        queuePlayerMove,
        queuePlayerReaction,
        cancelPlayerAttack,
        getSnapshot,
        replay,
        canCancelAttack,
        isBusy
    };
}

module.exports = { createSimulation, createFighter, cloneParams };
