/**
 * Purity, contamination, and passive separation tests.
 * Run: node scripts/test-purity-separation.js
 */
const path = require('path');
const p = require(path.join(__dirname, '..', 'prototype', 'property-alchemy'));

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

function refine(build) {
    const s = p.createFurnaceState({ seed: 0 });
    p.startFurnace(s);
    build(s);
    return { state: s, result: p.condenseFurnace(s) };
}

// 1. Clean gentle refinement → high purity
{
    const { result } = refine(s => {
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 50);
    });
    console.log('foundation gentle purity', result.product.purity, 'expelled', result.material.expelled.contamination);
    assert(result.product.purity >= 75, 'clean gentle foundation refinement yields high purity');
}

// 2. Poor refinement adds contamination (ironscar medium vs gentle finish)
{
    const clean = refine(s => {
        p.introduceToFurnace(s, 'exp_ironscar_grit', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 22);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 35);
    });
    const rough = refine(s => {
        p.introduceToFurnace(s, 'exp_ironscar_grit', 2);
        p.setFurnaceHeat(s, 'fierce');
        p.advanceFurnace(s, 12);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 25);
    });
    console.log('grit clean purity', clean.result.product.purity, 'rough', rough.result.product.purity);
    assert(
        rough.result.mixture.contamination > clean.result.mixture.contamination + 0.5
            || rough.result.product.purity < clean.result.product.purity - 3,
        'rough heat schedule increases mixture contamination vs cleaner grit refinement'
    );
}

// 3. Separation removes contamination without boosting essence
{
    const s = p.createFurnaceState({ seed: 0 });
    p.startFurnace(s);
    p.introduceToFurnace(s, 'exp_ironscar_grit', 2);
    p.setFurnaceHeat(s, 'medium');
    p.advanceFurnace(s, 10);
    const essenceMid = s.material.released.spirit;
    const expelledBefore = s.material.expelled?.impurity || 0;
    p.setFurnaceHeat(s, 'gentle');
    p.advanceFurnace(s, 40);
    const essenceAfter = s.material.released.spirit;
    const expelledAfter = s.material.expelled?.impurity || 0;
    console.log('grit gentle finish expelled delta', expelledAfter - expelledBefore);
    assert(expelledAfter > expelledBefore + 0.1, 'passive separation expels waste during gentle hold');
    assert(Math.abs(essenceAfter - essenceMid) < essenceMid * 0.08, 'expelling waste does not create medicinal essence');
}

// 4. Waiting cannot reach perfect purity on demanding material (ironscar grit)
{
    const { result } = refine(s => {
        p.introduceToFurnace(s, 'exp_ironscar_grit', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 20);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 120);
    });
    console.log('grit long gentle purity', result.product.purity, 'stuck floor sample contamination',
        result.mixture.contamination);
    assert(result.product.purity < 99.5, 'basic cauldron cannot infinite-wait to perfect purity on gritty ore');
}

// 5. Higher-tier / demanding ingredient harder to purify
{
    const dew = refine(s => {
        p.introduceToFurnace(s, 'exp_dawn_dew', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 45);
    });
    const cinder = refine(s => {
        p.introduceToFurnace(s, 'exp_cinderscale', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 45);
    });
    assert(
        dew.result.product.purity >= cinder.result.product.purity,
        'simpler dew reaches at least as high purity as demanding cinderscale under fair refinement'
    );
}

// 6. Heat schedule changes purity (amber lily pulse vs sustained medium)
{
    const pulse = refine(s => {
        p.introduceToFurnace(s, 'exp_amber_lily', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 6);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 40);
    });
    const sustain = refine(s => {
        p.introduceToFurnace(s, 'exp_amber_lily', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 46);
    });
    console.log('amber pulse purity', pulse.result.product.purity, 'sustain', sustain.result.product.purity);
    assert(
        pulse.result.product.purity >= sustain.result.product.purity
            && pulse.result.mixture.spirit > sustain.result.mixture.spirit + 1,
        'amber lily pulse schedule improves yield without sacrificing purity vs sustained medium'
    );
}

// 7. Spirit conservation
{
    const { result } = refine(s => {
        p.introduceToFurnace(s, 'exp_amber_lily', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 6);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 30);
    });
    assert(Math.abs(result.material.conservation.conservationDelta) < 0.06, 'spirit conservation holds with separation');
}

// 8. Playback independence
{
    const batched = refine(s => {
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 40);
    });
    const stepped = refine(s => {
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'gentle');
        for (let i = 0; i < 400; i++) p.stepFurnace(s, p.SIM_DT);
    });
    assert(
        batched.result.product.purity === stepped.result.product.purity
            && batched.result.material.expelled.contamination === stepped.result.material.expelled.contamination,
        'purity/separation deterministic under tick batching'
    );
}

// 9. Degraded ≠ contamination
{
    const { result } = refine(s => {
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 25);
    });
    assert(
        result.material.degraded.spirit > result.mixture.contamination,
        'heavy degradation can exceed mixture contamination (distinct ledgers)'
    );
}

if (failed) {
    console.error(`\n${failed} purity/separation test(s) failed`);
    process.exit(1);
}
console.log('\nAll purity/separation tests passed.');
