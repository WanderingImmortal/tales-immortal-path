"use strict";
var CombatSandbox = (() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };

  // prototype/combat-sandbox/constants.js
  var require_constants = __commonJS({
    "prototype/combat-sandbox/constants.js"(exports, module) {
      var FIXED_DT = 0.05;
      var ARENA = {
        width: 18,
        height: 18,
        bodyRadius: 0.45
      };
      var ATTACKS = {
        quick: {
          id: "quick",
          label: "Quick Strike",
          prep: 0.22,
          exec: 0.1,
          recovery: 0.32,
          reach: 1.35,
          halfAngleRad: 55 * Math.PI / 180,
          baseDamage: 9,
          interruptibility: 0.55,
          telegraphRange: 8
        },
        heavy: {
          id: "heavy",
          label: "Heavy Strike",
          prep: 0.52,
          exec: 0.16,
          recovery: 0.62,
          reach: 1.55,
          halfAngleRad: 65 * Math.PI / 180,
          baseDamage: 19,
          interruptibility: 0.35,
          telegraphRange: 8
        },
        thrust: {
          id: "thrust",
          label: "Thrust",
          prep: 0.34,
          exec: 0.12,
          recovery: 0.42,
          reach: 2.35,
          halfAngleRad: 18 * Math.PI / 180,
          baseDamage: 13,
          interruptibility: 0.45,
          telegraphRange: 9
        }
      };
      var REACTIONS = {
        evade: {
          id: "evade",
          label: "Evade",
          decisionToStart: 0.04,
          moveDuration: 0.22,
          moveSpeedMult: 1.65,
          recovery: 0.18,
          iFrameStart: 0.06
        },
        block: {
          id: "block",
          label: "Block",
          decisionToStart: 0.05,
          activeDuration: 0.28,
          recovery: 0.12,
          damageMult: 0.35,
          staggerThreshold: 14
        },
        parry: {
          id: "parry",
          label: "Parry",
          decisionToStart: 0.07,
          activeDuration: 0.16,
          recovery: 0.2,
          riposteWindow: 0.35
        },
        counter: {
          id: "counter",
          label: "Counterattack",
          decisionToStart: 0.08,
          prep: 0.14,
          exec: 0.1,
          recovery: 0.38,
          reach: 1.25,
          halfAngleRad: 40 * Math.PI / 180,
          baseDamage: 11,
          interruptPower: 1.2
        }
      };
      var DEFAULT_PARAMS = {
        moveSpeed: 4.2,
        reactionLatency: 0.14,
        martialSkill: 0.55,
        defensiveStrength: 0.55,
        attackPower: 1,
        perception: 0.6
      };
      var CANCEL_PREP_RECOVERY = 0.18;
      module.exports = {
        FIXED_DT,
        ARENA,
        ATTACKS,
        REACTIONS,
        DEFAULT_PARAMS,
        CANCEL_PREP_RECOVERY
      };
    }
  });

  // prototype/combat-sandbox/geometry.js
  var require_geometry = __commonJS({
    "prototype/combat-sandbox/geometry.js"(exports, module) {
      "use strict";
      function clamp(v, lo, hi) {
        return Math.max(lo, Math.min(hi, v));
      }
      function dist(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.hypot(dx, dy);
      }
      function normalizeAngle(a) {
        while (a > Math.PI) a -= Math.PI * 2;
        while (a < -Math.PI) a += Math.PI * 2;
        return a;
      }
      function angleDiff(from, to) {
        return Math.abs(normalizeAngle(to - from));
      }
      function pointInSector(px, py, ox, oy, facing, reach, halfAngleRad) {
        const dx = px - ox;
        const dy = py - oy;
        const d = Math.hypot(dx, dy);
        if (d > reach + 0.01) return { inside: false, distance: d, angleDelta: Math.PI };
        const ang = Math.atan2(dy, dx);
        const delta = angleDiff(facing, ang);
        if (delta > halfAngleRad + 0.08) return { inside: false, distance: d, angleDelta: delta };
        return { inside: true, distance: d, angleDelta: delta };
      }
      function moveToward(x, y, tx, ty, maxStep) {
        const dx = tx - x;
        const dy = ty - y;
        const d = Math.hypot(dx, dy);
        if (d <= maxStep || d < 1e-6) return { x: tx, y: ty, arrived: d <= maxStep };
        return { x: x + dx / d * maxStep, y: y + dy / d * maxStep, arrived: false };
      }
      function clampToArena(x, y, width, height, radius) {
        return {
          x: clamp(x, radius, width - radius),
          y: clamp(y, radius, height - radius)
        };
      }
      module.exports = {
        clamp,
        dist,
        normalizeAngle,
        angleDiff,
        pointInSector,
        moveToward,
        clampToArena
      };
    }
  });

  // prototype/combat-sandbox/rng.js
  var require_rng = __commonJS({
    "prototype/combat-sandbox/rng.js"(exports, module) {
      "use strict";
      function createRng(seed) {
        let s = seed >>> 0;
        return {
          next() {
            s += 1831565813;
            let t = s;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
          },
          chance(p) {
            return this.next() < p;
          }
        };
      }
      module.exports = { createRng };
    }
  });

  // prototype/combat-sandbox/simulation.js
  var require_simulation = __commonJS({
    "prototype/combat-sandbox/simulation.js"(exports, module) {
      "use strict";
      var {
        FIXED_DT,
        ARENA,
        ATTACKS,
        REACTIONS,
        DEFAULT_PARAMS,
        CANCEL_PREP_RECOVERY
      } = require_constants();
      var geo = require_geometry();
      var { createRng } = require_rng();
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
          action: { type: "idle", phase: "idle", startedAt: 0 },
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
          pauseReason: "start",
          autoPauseOnDecision: options.autoPauseOnDecision !== false,
          fighters: [
            createFighter("player", "player", playerParams, { x: 4, y: ARENA.height / 2, facing: 0 }),
            createFighter("opponent", "opponent", opponentParams, {
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
          return state.fighters.find((f) => f.id === id);
        }
        function opponentOf(id) {
          return state.fighters.find((f) => f.id !== id);
        }
        function pushLog(text, detail) {
          state.log.push({ t: state.time, text, detail: detail || null });
          if (state.log.length > 200) state.log.shift();
        }
        function setPaused(reason) {
          state.paused = true;
          state.pauseReason = reason || "manual";
        }
        function setRunning() {
          state.paused = false;
          state.pauseReason = null;
        }
        function isBusy(f) {
          if (state.time < f.stunUntil) return true;
          const a = f.action;
          if (a.type === "idle") return false;
          if (a.type === "move") return true;
          if (a.type === "attack" && a.phase === "recovery") return true;
          if (a.type === "attack" && (a.phase === "prep" || a.phase === "exec")) return true;
          if (a.type === "react") return a.phase !== "done";
          return false;
        }
        function canCancelAttack(f) {
          return f.action.type === "attack" && f.action.phase === "prep";
        }
        function startMove(f, tx, ty) {
          if (isBusy(f) && !canCancelAttack(f)) return { ok: false, reason: "busy" };
          if (canCancelAttack(f)) {
            f.action = { type: "idle", phase: "recovery", startedAt: state.time, until: state.time + CANCEL_PREP_RECOVERY };
            pushLog(`${f.role} cancelled attack prep (+${CANCEL_PREP_RECOVERY}s recovery).`, { fighter: f.id });
          }
          f.moveTarget = { x: tx, y: ty };
          f.action = { type: "move", phase: "moving", startedAt: state.time };
          return { ok: true };
        }
        function startAttack(f, kind) {
          const atk = ATTACKS[kind];
          if (!atk) return { ok: false, reason: "unknown_attack" };
          if (isBusy(f)) return { ok: false, reason: "busy" };
          f.moveTarget = null;
          const opp = opponentOf(f.id);
          if (opp) f.facing = Math.atan2(opp.y - f.y, opp.x - f.x);
          f.action = {
            type: "attack",
            kind,
            phase: "prep",
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
              if (defender.role === "player" && state.autoPauseOnDecision) {
                state.pendingDecision = {
                  telegraphId: tele.id,
                  defenderId: defender.id,
                  attackerId: attacker.id,
                  reactReadyAt,
                  hitAt,
                  attackKind: tele.kind
                };
                setPaused("reaction_decision");
              }
            }
          }
        }
        function startReaction(f, kind, opts = {}) {
          const react = REACTIONS[kind];
          if (!react) return { ok: false, reason: "unknown_reaction" };
          const readyAt = opts.reactReadyAt ?? state.time + f.params.reactionLatency;
          if (state.time < readyAt - 1e-6 && !opts.force) {
            return { ok: false, reason: "reaction_not_ready", readyAt };
          }
          if (isBusy(f) && !opts.force) return { ok: false, reason: "busy" };
          f.moveTarget = null;
          if (kind === "counter") {
            const opp = opponentOf(f.id);
            if (opp) f.facing = Math.atan2(opp.y - f.y, opp.x - f.x);
          }
          const startAt = Math.max(state.time, readyAt);
          const activeSpan = kind === "counter" ? react.prep + react.exec : react.activeDuration || react.moveDuration || 0;
          f.action = {
            type: "react",
            kind,
            phase: "windup",
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
            return { connected: false, reason: "out_of_arc", ...hit };
          }
          return { connected: true, reason: "in_arc", ...hit };
        }
        function applyDamage(defender, raw, note) {
          const dmg = Math.max(0, Math.round(raw));
          defender.hp = Math.max(0, defender.hp - dmg);
          pushLog(note.replace("{dmg}", String(dmg)), { damage: dmg, hp: defender.hp });
          if (defender.hp <= 0) {
            state.winner = opponentOf(defender.id).id;
            setPaused("ko");
          }
        }
        function processAttackExec(f) {
          const a = f.action;
          const atk = ATTACKS[a.kind];
          const defender = opponentOf(f.id);
          if (!defender || a.hitResolved) return;
          a.hitResolved = true;
          const tele = state.activeTelegraphs.find((t) => t.attackerId === f.id && !t.resolved);
          if (tele) tele.resolved = true;
          if (a.interrupted) {
            pushLog(`${f.role}'s ${atk.label} was interrupted \u2014 no hit check.`, { fighter: f.id });
            return;
          }
          const hit = resolveAttackHit(f, defender, atk);
          if (!hit.connected) {
            pushLog(`${f.role}'s ${atk.label} misses (${defender.role} outside reach/arc, \u0394angle ${hit.angleDelta.toFixed(2)} rad).`, {
              fighter: f.id,
              miss: true
            });
            return;
          }
          let damage = atk.baseDamage * f.params.attackPower;
          let outcome = "clean_hit";
          const react = defender.action;
          if (react.type === "react" && react.kind === "evade") {
            const hitAfter = resolveAttackHit(f, defender, atk);
            if (!hitAfter.connected) {
              pushLog(`${defender.role} evades \u2014 left effective area before impact.`, { outcome: "evade_success" });
              return;
            }
            if (react.phase === "active") {
              damage *= 0.5;
              pushLog(`${defender.role} partial evade \u2014 still clipped for reduced damage.`, { outcome: "partial_evade" });
            }
          } else if (react.type === "react" && react.kind === "parry" && (react.phase === "active" || state.time >= react.windupEnd && state.time <= react.activeEnd + FIXED_DT * 0.5)) {
            outcome = "parried";
            f.action.interrupted = true;
            f.action.phase = "recovery";
            f.action.recoveryEnd = state.time + 0.35;
            f.stunUntil = state.time + 0.2;
            defender.riposteUntil = state.time + REACTIONS.parry.riposteWindow;
            pushLog(`${defender.role} parries \u2014 ${f.role} staggered; riposte window open.`, { outcome });
            return;
          } else if (react.type === "react" && react.phase === "active") {
            if (react.kind === "block") {
              const block = REACTIONS.block;
              const reduction = block.damageMult + defender.params.defensiveStrength * 0.35;
              damage *= geo.clamp(reduction, 0.15, 0.85);
              outcome = damage < atk.baseDamage * 0.5 ? "partial_block" : "weak_block";
              if (damage >= block.staggerThreshold) {
                defender.stunUntil = state.time + 0.25;
                outcome = "block_broken";
              }
              pushLog(
                `${defender.role} blocks \u2014 ${outcome}; ${damage.toFixed(1)} damage after defense (raw ${atk.baseDamage}).`,
                { outcome, damage }
              );
            }
          } else if (react.type === "react" && react.kind === "evade" && react.phase === "windup") {
            const timeLeft = react.windupEnd - state.time;
            pushLog(
              `${defender.role} too slow to evade (evade still winding up, ${timeLeft.toFixed(2)}s remaining) \u2014 hit lands.`,
              { impossible: true }
            );
          } else if (tele && tele.detectedAt == null) {
            pushLog(`${defender.role} did not detect the attack \u2014 no reaction opportunity.`, { undetected: true });
          } else if (tele && tele.detectedAt != null) {
            const need = defender.params.reactionLatency + REACTIONS.evade.decisionToStart + REACTIONS.evade.iFrameStart;
            const had = tele.impactAt - tele.detectedAt;
            if (had < need) {
              pushLog(
                `${defender.role} detected but insufficient time (${had.toFixed(2)}s < ~${need.toFixed(2)}s needed for evade) \u2014 hit lands.`,
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
            pushLog(`${f.role} counter misses \u2014 ${opp.role} not in arc.`, { fighter: f.id });
            return;
          }
          if (opp.action.type === "attack" && opp.action.phase === "prep") {
            opp.action.interrupted = true;
            opp.action.phase = "recovery";
            opp.action.recoveryEnd = state.time + 0.4;
            pushLog(`${f.role} counter interrupts ${opp.role}'s preparation.`, { interrupt: true });
          }
          const dmg = react.baseDamage * f.params.attackPower * (1 + f.params.martialSkill * 0.25);
          applyDamage(opp, dmg, `${f.role} counter connects for {dmg} (during commitment).`);
        }
        function advanceFighter(f, dt) {
          if (state.time < f.stunUntil) return;
          const a = f.action;
          if (a.type === "move" && f.moveTarget) {
            const step2 = f.params.moveSpeed * dt;
            const next = geo.moveToward(f.x, f.y, f.moveTarget.x, f.moveTarget.y, step2);
            f.x = next.x;
            f.y = next.y;
            const clamped = geo.clampToArena(f.x, f.y, ARENA.width, ARENA.height, ARENA.bodyRadius);
            f.x = clamped.x;
            f.y = clamped.y;
            if (next.arrived) {
              f.moveTarget = null;
              f.action = { type: "idle", phase: "idle", startedAt: state.time };
            }
            return;
          }
          if (a.type === "attack") {
            if (a.phase === "prep" && state.time >= a.prepEnd) {
              a.phase = "exec";
              if (!a.hitResolved) processAttackExec(f);
            }
            if (a.phase === "exec") {
              if (state.time >= a.execEnd) a.phase = "recovery";
            }
            if (a.phase === "recovery" && state.time >= a.recoveryEnd) {
              f.action = { type: "idle", phase: "idle", startedAt: state.time };
            }
            return;
          }
          if (a.type === "react") {
            const def = REACTIONS[a.kind];
            if (a.phase === "windup" && state.time >= a.windupEnd) {
              a.phase = "active";
              if (a.kind === "evade") {
                const opp = opponentOf(f.id);
                let dir = a.evadeDir;
                if (dir == null && opp) {
                  dir = Math.atan2(f.y - opp.y, f.x - opp.x);
                }
                a.evadeDir = dir ?? f.facing;
              }
            }
            if (a.phase === "active" && a.kind === "evade") {
              const speed = f.params.moveSpeed * REACTIONS.evade.moveSpeedMult;
              f.x += Math.cos(a.evadeDir) * speed * dt;
              f.y += Math.sin(a.evadeDir) * speed * dt;
              const clamped = geo.clampToArena(f.x, f.y, ARENA.width, ARENA.height, ARENA.bodyRadius);
              f.x = clamped.x;
              f.y = clamped.y;
            }
            if (a.phase === "active" && state.time >= a.activeEnd) {
              a.phase = "recovery";
            }
            if (a.phase === "recovery" && state.time >= a.recoveryEnd) {
              f.action = { type: "idle", phase: "idle", startedAt: state.time };
            }
          }
          if (a.type === "idle" && a.phase === "recovery" && a.until && state.time >= a.until) {
            f.action = { type: "idle", phase: "idle", startedAt: state.time };
          }
        }
        function stepOneTick() {
          if (state.paused || state.winner) return { stepped: false };
          const dt = state.dt;
          tryDetectTelegraphs();
          for (const f of state.fighters) advanceFighter(f, dt);
          for (const f of state.fighters) {
            const ra = f.action;
            if (ra.type === "react" && ra.kind === "counter" && ra.phase === "windup" && state.time >= ra.windupEnd) {
              ra.phase = "active";
            }
            if (ra.type === "react" && ra.kind === "counter" && ra.phase === "active") {
              const counter = REACTIONS.counter;
              if (!ra.counterPrepDone && state.time >= ra.windupEnd + counter.prep * 0.85) {
                ra.counterPrepDone = true;
                if (!ra.hitResolved) processCounterExec(f);
              }
            }
          }
          state.time += dt;
          state.activeTelegraphs = state.activeTelegraphs.filter((t) => !t.resolved || state.time < t.recoveryEnd + 0.5);
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
        function runUntil(timeLimit, maxTicks = 1e5) {
          let ticks = 0;
          while (state.time < timeLimit && !state.winner && ticks < maxTicks) {
            if (state.paused) break;
            stepOneTick();
            ticks++;
          }
          return { ticks, time: state.time, winner: state.winner };
        }
        function reset(options2 = {}) {
          const sim = createSimulation({
            seed: options2.seed ?? state.seed,
            playerParams: options2.playerParams ?? state.fighters[0].params,
            opponentParams: options2.opponentParams ?? state.fighters[1].params,
            autoPauseOnDecision: state.autoPauseOnDecision,
            preset: options2.preset
          });
          return sim;
        }
        function queuePlayerAttack(kind) {
          const p = fighterById("player");
          if (!p) return { ok: false };
          state.pendingDecision = null;
          setRunning();
          return startAttack(p, kind);
        }
        function queuePlayerMove(tx, ty) {
          const p = fighterById("player");
          return startMove(p, tx, ty);
        }
        function queuePlayerReaction(kind, evadeDir) {
          const p = fighterById("player");
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
          const p = fighterById("player");
          if (!canCancelAttack(p)) return { ok: false };
          p.action = { type: "idle", phase: "recovery", startedAt: state.time, until: state.time + CANCEL_PREP_RECOVERY };
          pushLog("Player cancelled attack during preparation.", {});
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
        function replay(inputs, maxTicks = 5e3) {
          setRunning();
          let i = 0;
          for (let t = 0; t < maxTicks; t++) {
            while (i < inputs.length && inputs[i].at <= state.time) {
              const cmd = inputs[i];
              if (cmd.type === "attack") startAttack(fighterById(cmd.who), cmd.kind);
              else if (cmd.type === "move") startMove(fighterById(cmd.who), cmd.x, cmd.y);
              else if (cmd.type === "react") startReaction(fighterById(cmd.who), cmd.kind, cmd.opts || {});
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
    }
  });

  // prototype/combat-sandbox/presets.js
  var require_presets = __commonJS({
    "prototype/combat-sandbox/presets.js"(exports, module) {
      "use strict";
      var { DEFAULT_PARAMS } = require_constants();
      var PRESETS = {
        equal: {
          id: "equal",
          label: "Equal Opponents",
          player: { ...DEFAULT_PARAMS },
          opponent: { ...DEFAULT_PARAMS }
        },
        faster_opponent: {
          id: "faster_opponent",
          label: "Faster Opponent",
          player: { ...DEFAULT_PARAMS },
          opponent: {
            ...DEFAULT_PARAMS,
            moveSpeed: 6.2,
            reactionLatency: 0.09,
            martialSkill: 0.52
          }
        },
        skilled_veteran: {
          id: "skilled_veteran",
          label: "Skilled Veteran",
          player: {
            ...DEFAULT_PARAMS,
            moveSpeed: 3.6,
            reactionLatency: 0.1,
            martialSkill: 0.82,
            defensiveStrength: 0.75,
            perception: 0.78
          },
          opponent: {
            ...DEFAULT_PARAMS,
            moveSpeed: 4.8,
            martialSkill: 0.48
          }
        },
        overwhelming_speed: {
          id: "overwhelming_speed",
          label: "Overwhelming Speed",
          player: { ...DEFAULT_PARAMS },
          opponent: {
            ...DEFAULT_PARAMS,
            moveSpeed: 9.5,
            reactionLatency: 0.05,
            martialSkill: 0.5,
            attackPower: 1.05
          }
        }
      };
      function listPresets() {
        return Object.values(PRESETS).map((p) => ({ id: p.id, label: p.label }));
      }
      function getPreset(id) {
        return PRESETS[id] || PRESETS.equal;
      }
      module.exports = { PRESETS, listPresets, getPreset };
    }
  });

  // prototype/combat-sandbox/ai.js
  var require_ai = __commonJS({
    "prototype/combat-sandbox/ai.js"(exports, module) {
      "use strict";
      var { ATTACKS } = require_constants();
      function tickOpponentAi(sim, opts = {}) {
        const state = sim.state;
        const ai = state.fighters.find((f) => f.role === "opponent");
        const player = state.fighters.find((f) => f.role === "player");
        if (!ai || !player || state.winner) return;
        if (state.paused && state.pauseReason === "reaction_decision") return;
        if (!ai._ai) {
          ai._ai = {
            nextThink: state.time + 0.2,
            mood: "neutral"
          };
        }
        const brain = ai._ai;
        if (state.time < brain.nextThink) return;
        brain.nextThink = state.time + 0.35 + sim.rng.next() * 0.25;
        if (sim.rng.chance(0.12)) {
          brain.mood = sim.rng.chance(0.5) ? "aggressive" : "cautious";
        }
        const dist = Math.hypot(player.x - ai.x, player.y - ai.y);
        if (state.pendingDecision && state.pendingDecision.defenderId === ai.id) {
          const pd = state.pendingDecision;
          const timeToHit = pd.hitAt - (state.time + ai.params.reactionLatency);
          const kind2 = timeToHit < 0.12 ? "block" : sim.rng.chance(0.35 + ai.params.martialSkill * 0.2) ? "evade" : "block";
          sim.startReaction(ai, kind2, { reactReadyAt: Math.max(state.time, pd.reactReadyAt) });
          return;
        }
        if (sim.isBusy(ai)) {
          if (sim.canCancelAttack(ai) && brain.mood === "cautious" && dist > 3 && sim.rng.chance(0.08)) {
            ai.action = { type: "idle", phase: "recovery", startedAt: state.time, until: state.time + 0.18 };
            sim.pushLog("Opponent cancels telegraphed attack (cautious).", { fighter: ai.id });
          }
          return;
        }
        if (player.action.type === "attack" && player.action.phase === "prep" && dist < 2.2 && sim.rng.chance(0.15 + ai.params.martialSkill * 0.2)) {
          sim.startReaction(ai, "counter", { reactReadyAt: state.time + ai.params.reactionLatency });
          return;
        }
        if (dist > 2) {
          sim.startMove(ai, player.x, player.y);
          return;
        }
        const roll = sim.rng.next();
        let kind = "quick";
        if (roll > 0.55) kind = "heavy";
        else if (roll > 0.78) kind = "thrust";
        if (brain.mood === "aggressive" && roll > 0.4) kind = "heavy";
        if (brain.mood === "cautious" && roll < 0.5) kind = "quick";
        sim.startAttack(ai, kind);
      }
      module.exports = { tickOpponentAi };
    }
  });

  // prototype/combat-sandbox/index.js
  var require_index = __commonJS({
    "prototype/combat-sandbox/index.js"(exports, module) {
      "use strict";
      var { createSimulation, cloneParams } = require_simulation();
      var { PRESETS, listPresets, getPreset } = require_presets();
      var { tickOpponentAi } = require_ai();
      var constants = require_constants();
      var geometry = require_geometry();
      var { createRng } = require_rng();
      module.exports = {
        createSimulation,
        cloneParams,
        PRESETS,
        listPresets,
        getPreset,
        tickOpponentAi,
        ...constants,
        geometry,
        createRng
      };
    }
  });

  // prototype/combat-sandbox/lab-entry.js
  var require_lab_entry = __commonJS({
    "prototype/combat-sandbox/lab-entry.js"(exports, module) {
      var sandbox = require_index();
      if (typeof window !== "undefined") {
        window.CombatSandbox = sandbox;
      }
      module.exports = sandbox;
    }
  });
  return require_lab_entry();
})();
