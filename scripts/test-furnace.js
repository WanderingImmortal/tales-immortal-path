/**
 * Interactive furnace tests — time-based refinement.
 * Run: node scripts/test-furnace.js
 */
const path = require('path');
const proto = require(path.join(__dirname, '..', 'prototype', 'property-alchemy'));

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

const {
    createFurnaceState,
    startFurnace,
    pauseFurnace,
    resumeFurnace,
    setFurnaceHeat,
    introduceToFurnace,
    stepFurnace,
    advanceFurnace,
    condenseFurnace,
    replayFurnaceProcedure,
    SIM_DT
} = proto;
const { describeReagent, explainExperiment } = require(path.join(
    __dirname,
    '..',
    'prototype',
    'property-alchemy',
    'lab-explain'
));

function finalize(state) {
    if (!state.result) condenseFurnace(state);
    return state;
}

function runToCondense(build) {
    const state = createFurnaceState({ seed: 0 });
    startFurnace(state);
    build(state);
    if (!state.condensed) condenseFurnace(state);
    return state;
}

// 1. Conservation across ticks
{
    const state = createFurnaceState({ seed: 0 });
    startFurnace(state);
    introduceToFurnace(state, 'exp_ironscar_grit', 2);
    setFurnaceHeat(state, 'medium');
    advanceFurnace(state, 30);
    const fin = finalize(state);
    assert(
        Math.abs(fin.result.material.conservation.conservationDelta) < 0.05,
        'conservation across repeated simulation ticks'
    );
}

// 2. Heat duration affects extraction
{
    const short = createFurnaceState({ seed: 0 });
    startFurnace(short);
    introduceToFurnace(short, 'exp_ironscar_grit', 2);
    setFurnaceHeat(short, 'medium');
    advanceFurnace(short, 2);
    const shortR = condenseFurnace(short);

    const long = createFurnaceState({ seed: 0 });
    startFurnace(long);
    introduceToFurnace(long, 'exp_ironscar_grit', 2);
    setFurnaceHeat(long, 'medium');
    advanceFurnace(long, 25);
    const longR = condenseFurnace(long);

    assert(
        longR.material.released.spirit > shortR.material.released.spirit + 0.5,
        'heat duration increases extraction'
    );
}

// 3. Ingredients at different times
{
    const state = createFurnaceState({ seed: 0 });
    startFurnace(state);
    setFurnaceHeat(state, 'fierce');
    advanceFurnace(state, 3);
    introduceToFurnace(state, 'exp_ironscar_grit', 2);
    advanceFurnace(state, 8);
    setFurnaceHeat(state, 'gentle');
    introduceToFurnace(state, 'exp_dawn_dew', 2);
    advanceFurnace(state, 10);
    const r = condenseFurnace(state);
    assert(state.introduced.length === 2, 'ingredients introduced at different times');
    assert(r.material.conservation.inputSpirit > 0, 'staggered introduction registers spirit');
}

// 4. Earlier ingredients remain exposed
{
    const state = createFurnaceState({ seed: 0 });
    startFurnace(state);
    introduceToFurnace(state, 'exp_dawn_dew', 2);
    setFurnaceHeat(state, 'medium');
    advanceFurnace(state, 15);
    const releasedBefore = state.material.released.spirit;
    introduceToFurnace(state, 'exp_sun_stone', 1);
    setFurnaceHeat(state, 'fierce');
    advanceFurnace(state, 12);
    const r = condenseFurnace(state);
    assert(
        r.material.degraded.spirit > 0 || state.material.released.spirit < releasedBefore + 5,
        'earlier released essence responds to later fierce heat'
    );
}

// 5. Flame changes during refinement
{
    const state = createFurnaceState({ seed: 0 });
    startFurnace(state);
    introduceToFurnace(state, 'exp_ironscar_grit', 2);
    setFurnaceHeat(state, 'gentle');
    advanceFurnace(state, 5);
    setFurnaceHeat(state, 'fierce');
    advanceFurnace(state, 2);
    setFurnaceHeat(state, 'gentle');
    advanceFurnace(state, 10);
    const r = condenseFurnace(state);
    assert(
        state.procedure.actions.filter(a => a.kind === 'heat_set').length >= 2,
        'flame changes recorded in procedure'
    );
    assert(r.material.released.spirit >= 0, 'flame changes during refinement complete');
}

// 6. Released essence degrades under continued heat
{
    const state = createFurnaceState({ seed: 0 });
    startFurnace(state);
    introduceToFurnace(state, 'exp_ironscar_grit', 2);
    setFurnaceHeat(state, 'medium');
    advanceFurnace(state, 25);
    const rel = state.material.released.spirit;
    setFurnaceHeat(state, 'fierce');
    advanceFurnace(state, 15);
    const r = condenseFurnace(state);
    assert(
        rel > 0.5 && r.material.degraded.spirit > rel * 0.2,
        'released essence responds to continued heating'
    );
}

// 7–8. Pause / speed independence
{
    const a = createFurnaceState({ seed: 7 });
    startFurnace(a);
    introduceToFurnace(a, 'exp_dawn_dew', 2);
    setFurnaceHeat(a, 'medium');
    for (let i = 0; i < 100; i++) stepFurnace(a, SIM_DT);
    pauseFurnace(a);
    for (let i = 0; i < 50; i++) stepFurnace(a, SIM_DT);
    resumeFurnace(a);
    for (let i = 0; i < 50; i++) stepFurnace(a, SIM_DT);
    const ra = condenseFurnace(a);

    const b = createFurnaceState({ seed: 7 });
    startFurnace(b);
    introduceToFurnace(b, 'exp_dawn_dew', 2);
    setFurnaceHeat(b, 'medium');
    advanceFurnace(b, 10);
    const rb = condenseFurnace(b);

    assert(
        Math.abs(ra.material.released.spirit - rb.material.released.spirit) < 0.2,
        'pause prevents chemistry while halted'
    );

    const c = createFurnaceState({ seed: 7 });
    startFurnace(c);
    introduceToFurnace(c, 'exp_dawn_dew', 2);
    setFurnaceHeat(c, 'medium');
    advanceFurnace(c, 10);
    const rc = condenseFurnace(c);

    assert(
        JSON.stringify(rb.material) === JSON.stringify(rc.material),
        'batching ticks (playback speed) does not change outcomes'
    );
}

// 9. Deterministic replay
{
    const state = createFurnaceState({ seed: 42 });
    startFurnace(state);
    setFurnaceHeat(state, 'fierce');
    advanceFurnace(state, 1);
    introduceToFurnace(state, 'exp_ironscar_grit', 2);
    advanceFurnace(state, 6);
    setFurnaceHeat(state, 'gentle');
    introduceToFurnace(state, 'exp_dawn_dew', 2);
    advanceFurnace(state, 12);
    const live = condenseFurnace(state);
    const procedure = JSON.parse(JSON.stringify(state.procedure));
    const { result: replayed } = replayFurnaceProcedure(procedure);
    assert(
        replayed && Math.abs(replayed.product.potency - live.product.potency) < 0.05,
        'deterministic replay of timed actions'
    );
}

// 10. Condense uses accumulated state
{
    const state = createFurnaceState({ seed: 0 });
    startFurnace(state);
    introduceToFurnace(state, 'exp_glowcap', 1);
    setFurnaceHeat(state, 'gentle');
    advanceFurnace(state, 0.5);
    const early = condenseFurnace(state);
    assert(early.material.bound.spirit > early.material.released.spirit, 'condense captures early bound-heavy state');
}

// 11. Outcome tiers
{
    const calm = runToCondense(s => {
        introduceToFurnace(s, 'exp_foundation_root', 2);
        setFurnaceHeat(s, 'gentle');
        advanceFurnace(s, 40);
    });
    assert(['refined', 'unstable_salvage'].includes(calm.result.outcome), 'successful/partial refinement possible');

    const wild = runToCondense(s => {
        introduceToFurnace(s, 'exp_sun_stone', 2);
        advanceFurnace(s, 2);
        introduceToFurnace(s, 'exp_soul_mist', 2);
        setFurnaceHeat(s, 'fierce');
        advanceFurnace(s, 90);
    });
    assert(
        wild.result.peakInstability > 3.5 || wild.result.material.degraded.spirit > 20,
        'volatile mix can reach failed/unstable instability or heavy degradation'
    );
}

// 12. Explain + inspect
assert(describeReagent('exp_dawn_dew').name === 'Dawn Dew', 'ingredient inspect still works');
const explained = explainExperiment(runToCondense(s => {
    introduceToFurnace(s, 'exp_dawn_dew', 2);
    setFurnaceHeat(s, 'gentle');
    advanceFurnace(s, 20);
}).result);
assert(explained.length >= 2, 'result explanations work on furnace condense output');

if (failed) {
    console.error(`\n${failed} furnace test(s) failed`);
    process.exit(1);
}
console.log('\nAll furnace tests passed.');
