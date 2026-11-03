/**
 * Experimental combat sandbox tests (isolated — no DOM, no production combat.js).
 * Run: node scripts/test-combat-sandbox.js
 */
const path = require('path');
const fs = require('fs');
const sandbox = require(path.join(__dirname, '..', 'prototype', 'combat-sandbox'));

let failed = 0;

function fail(msg) {
    console.error(`FAIL: ${msg}`);
    failed += 1;
}

function ok(msg) {
    console.log(`ok: ${msg}`);
}

function assert(cond, msg) {
    if (!cond) fail(msg);
    else ok(msg);
}

function runTicks(sim, n) {
    sim.setRunning();
    return sim.step(n);
}

// Production combat must remain untouched by this prototype.
const combatJs = fs.readFileSync(path.join(__dirname, '..', 'combat.js'), 'utf8');
assert(!combatJs.includes('combat-sandbox'), 'production combat.js does not reference sandbox');

// Determinism
const inputs = [
    { at: 0, type: 'move', who: 'player', x: 6, y: 9 },
    { at: 0.5, type: 'attack', who: 'player', kind: 'quick' }
];
const a = sandbox.createSimulation({ seed: 99 });
a.replay(inputs, 80);
const snapA = a.getSnapshot();
const b = sandbox.createSimulation({ seed: 99 });
b.replay(inputs, 80);
const snapB = b.getSnapshot();
assert(snapA.time === snapB.time && snapA.fighters[1].hp === snapB.fighters[1].hp, 'deterministic replay with same seed');

// Faster movement covers distance sooner
const slow = sandbox.createSimulation({ seed: 1, playerParams: { moveSpeed: 2 } });
const fast = sandbox.createSimulation({ seed: 1, playerParams: { moveSpeed: 6 } });
slow.setRunning();
fast.setRunning();
slow.startMove(slow.fighterById('player'), 10, 9);
fast.startMove(fast.fighterById('player'), 10, 9);
runTicks(slow, 40);
runTicks(fast, 40);
assert(
    fast.fighterById('player').x > slow.fighterById('player').x + 1,
    'faster moveSpeed advances farther in equal ticks'
);

// Attack phase timings
const sim = sandbox.createSimulation({ seed: 2 });
sim.setRunning();
sim.startAttack(sim.fighterById('player'), 'heavy');
const atk = sandbox.ATTACKS.heavy;
const t0 = sim.state.time;
runTicks(sim, 1);
assert(sim.fighterById('player').action.phase === 'prep', 'attack begins in prep');
runTicks(sim, Math.ceil(atk.prep / sim.FIXED_DT) + 1);
assert(sim.fighterById('player').action.phase === 'exec', 'heavy enters execution after prep time');

// Miss when target leaves arc
const missSim = sandbox.createSimulation({ seed: 3 });
missSim.setRunning();
const p = missSim.fighterById('player');
const o = missSim.fighterById('opponent');
p.x = 5;
p.y = 9;
o.x = 8;
o.y = 9;
missSim.startAttack(p, 'quick');
runTicks(missSim, Math.ceil(sandbox.ATTACKS.quick.prep / missSim.FIXED_DT));
o.x = 2;
o.y = 2;
runTicks(missSim, Math.ceil(sandbox.ATTACKS.quick.exec / missSim.FIXED_DT) + 2);
const missLog = missSim.state.log.some(l => l.text.includes('misses'));
assert(missLog, 'attack misses when defender leaves reach/arc');

// Reaction latency — detected but not enough time to complete evade
const latSim = sandbox.createSimulation({
    seed: 4,
    playerParams: { reactionLatency: 0.32, perception: 0.85 }
});
latSim.state.autoPauseOnDecision = false;
latSim.setRunning();
latSim.fighterById('player').x = 8;
latSim.fighterById('player').y = 9;
latSim.fighterById('opponent').x = 9.2;
latSim.fighterById('opponent').y = 9;
latSim.startAttack(latSim.fighterById('opponent'), 'quick');
runTicks(latSim, Math.ceil(sandbox.ATTACKS.quick.prep / latSim.FIXED_DT) + 2);
const tooSlow = latSim.state.log.some(l => l.detail && (l.detail.impossible || l.detail.detected_no_time));
assert(tooSlow, 'late reaction logs insufficient time or windup too slow');

// Parry creates riposte window
const parrySim = sandbox.createSimulation({ seed: 5 });
parrySim.state.autoPauseOnDecision = false;
parrySim.setRunning();
parrySim.fighterById('player').x = 7;
parrySim.fighterById('opponent').x = 8.2;
parrySim.fighterById('player').y = parrySim.fighterById('opponent').y = 9;
parrySim.startAttack(parrySim.fighterById('opponent'), 'heavy');
runTicks(parrySim, Math.floor((sandbox.ATTACKS.heavy.prep - 0.14) / parrySim.FIXED_DT));
parrySim.startReaction(parrySim.fighterById('player'), 'parry', { reactReadyAt: parrySim.state.time, force: true });
runTicks(parrySim, Math.ceil((sandbox.ATTACKS.heavy.prep + sandbox.ATTACKS.heavy.exec) / parrySim.FIXED_DT) + 4);
assert(parrySim.state.log.some(l => l.text.includes('parries')), 'successful parry opens riposte window');

// Counter interrupts prep
const ctrSim = sandbox.createSimulation({ seed: 6 });
ctrSim.state.autoPauseOnDecision = false;
ctrSim.setRunning();
ctrSim.fighterById('player').x = 7;
ctrSim.fighterById('opponent').x = 7.85;
ctrSim.fighterById('player').y = ctrSim.fighterById('opponent').y = 9;
ctrSim.startAttack(ctrSim.fighterById('opponent'), 'heavy');
runTicks(ctrSim, Math.floor((sandbox.ATTACKS.heavy.prep * 0.55) / ctrSim.FIXED_DT));
ctrSim.startReaction(ctrSim.fighterById('player'), 'counter', { reactReadyAt: ctrSim.state.time, force: true });
runTicks(ctrSim, 24);
const interrupted = ctrSim.state.log.some(l => l.text.includes('interrupt'));
assert(interrupted, 'counterattack can interrupt preparation');

// Cancel prep imposes recovery
const cancelSim = sandbox.createSimulation({ seed: 7 });
cancelSim.setRunning();
cancelSim.startAttack(cancelSim.fighterById('player'), 'heavy');
runTicks(cancelSim, 2);
cancelSim.cancelPlayerAttack();
assert(cancelSim.fighterById('player').action.phase === 'recovery', 'cancel during prep enters recovery');

// Presets load
assert(sandbox.listPresets().length >= 4, 'matchup presets exported');

const deployIndex = path.join(__dirname, '..', 'sandbox', 'combat', 'index.html');
const deployBundle = path.join(__dirname, '..', 'sandbox', 'combat', 'combat-sandbox-bundle.js');
assert(fs.existsSync(deployIndex), 'deploy route sandbox/combat/index.html exists');
assert(fs.existsSync(deployBundle), 'committed combat-sandbox-bundle.js for static deploy');

if (failed) {
    console.error(`\n${failed} test(s) failed`);
    process.exit(1);
}
console.log('\nAll combat sandbox tests passed.');
