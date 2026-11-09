/**
 * Furnace stability, long-hold, and Ironscar diagnostics (PR #224).
 * Run: node scripts/test-furnace-stability.js
 */
const path = require('path');
const p = require(path.join(__dirname, '..', 'prototype', 'property-alchemy'));
const sep = require(path.join(__dirname, '..', 'prototype', 'property-alchemy', 'separation'));

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

function close(a, b, tol, msg) {
    assert(Math.abs(a - b) <= tol, msg);
}

function refine(build) {
    const s = p.createFurnaceState({ seed: 0 });
    p.startFurnace(s);
    build(s);
    return { state: s, result: p.condenseFurnace(s) };
}

function metrics(s) {
    const m = s.material;
    return {
        released: m.released.spirit,
        contamination: m.released.impurity,
        expelled: m.expelled?.impurity || 0,
        degraded: m.degraded.spirit,
        purity: p.condenseFurnace ? null : null,
        runningInstability: s.runningInstability,
        peakInstability: s.peakInstability
    };
}

function gritPlateau(build, label) {
    const { state, result } = refine(build);
    const stuck = sep.mixtureStuckFloor(state.material);
    console.log(
        `${label}: spirit ${result.mixture.spirit.toFixed(1)} contam ${result.mixture.contamination.toFixed(1)} `
        + `expelled ${(result.material.expelled?.contamination || 0).toFixed(1)} purity ${result.product.purity}% `
        + `peak inst ${result.peakInstability.toFixed(2)} stuck ${stuck.toFixed(2)}`
    );
    return result;
}

// 1. Dormant gentle hold — ledger flat, instability relaxes (not unbounded drift)
{
    const s = p.createFurnaceState({ seed: 0 });
    p.startFurnace(s);
    p.introduceToFurnace(s, 'exp_ironscar_grit', 2);
    p.setFurnaceHeat(s, 'medium');
    p.advanceFurnace(s, 20);
    p.setFurnaceHeat(s, 'gentle');
    const spirit0 = s.material.released.spirit;
    const imp0 = s.material.released.impurity;
    const inst0 = s.runningInstability;
    p.advanceFurnace(s, 240);
    const spirit1 = s.material.released.spirit;
    const imp1 = s.material.released.impurity;
    const inst1 = s.runningInstability;
    close(spirit1, spirit0, spirit0 * 0.002, 'released spirit unchanged on dormant gentle hold');
    close(imp1, imp0, 0.02, 'contamination unchanged on dormant gentle hold');
    assert(inst1 < inst0 + 0.05, 'instability does not climb on dormant gentle hold');
    assert(Math.abs(inst1) < 1.5, 'dormant gentle hold relaxes running instability toward neutral');
}

// 2. Playback batching matches stepped advance (dormant hold segment)
{
    const batched = p.createFurnaceState({ seed: 0 });
    p.startFurnace(batched);
    p.introduceToFurnace(batched, 'exp_ironscar_grit', 2);
    p.setFurnaceHeat(batched, 'medium');
    p.advanceFurnace(batched, 20);
    p.setFurnaceHeat(batched, 'gentle');
    p.advanceFurnace(batched, 120);

    const stepped = p.createFurnaceState({ seed: 0 });
    p.startFurnace(stepped);
    p.introduceToFurnace(stepped, 'exp_ironscar_grit', 2);
    p.setFurnaceHeat(stepped, 'medium');
    for (let i = 0; i < 200; i++) p.advanceFurnace(stepped, 0.1);
    p.setFurnaceHeat(stepped, 'gentle');
    for (let i = 0; i < 1200; i++) p.advanceFurnace(stepped, 0.1);

    close(
        batched.runningInstability,
        stepped.runningInstability,
        0.02,
        'instability deterministic under tick batching on long gentle hold'
    );
    close(
        batched.material.released.impurity,
        stepped.material.released.impurity,
        0.02,
        'separation ledger deterministic under tick batching'
    );
}

// 3. Active chemistry still builds instability (not gated off during extraction)
{
    const s = p.createFurnaceState({ seed: 0 });
    p.startFurnace(s);
    p.introduceToFurnace(s, 'exp_ironscar_grit', 2);
    p.setFurnaceHeat(s, 'medium');
    p.advanceFurnace(s, 12);
    assert(s.peakInstability > 0.08, 'active medium extraction still raises peak instability');
}

// 4. Ironscar convergent purity — basic cauldron ceiling (~53%) when extraction completes
{
    const a = gritPlateau(s => {
        p.introduceToFurnace(s, 'exp_ironscar_grit', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 22);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 90);
    }, 'grit med22+gentle90');
    const b = gritPlateau(s => {
        p.introduceToFurnace(s, 'exp_ironscar_grit', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 18);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 40);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 12);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 80);
    }, 'grit alternating med/gentle');
    close(a.product.purity, b.product.purity, 4, 'similar ironscar schedules converge near same purity band');
    assert(a.product.purity >= 48 && a.product.purity <= 58, 'ironscar plateau purity in expected basic-cauldron band');
    assert(
        a.mixture.contamination >= (a.material?.separationStuck ?? 0) - 0.15,
        'contamination respects separation stuck floor at condense'
    );
}

// 5. Separation ledger — no negative contamination, expelled does not add spirit
{
    const s = p.createFurnaceState({ seed: 0 });
    p.startFurnace(s);
    p.introduceToFurnace(s, 'exp_ironscar_grit', 2);
    p.setFurnaceHeat(s, 'medium');
    p.advanceFurnace(s, 15);
    const spiritMid = s.material.released.spirit;
    p.setFurnaceHeat(s, 'gentle');
    p.advanceFurnace(s, 80);
    assert(s.material.released.impurity >= -1e-9, 'contamination never negative');
    close(s.material.released.spirit, spiritMid, spiritMid * 0.05, 'passive separation does not create medicinal spirit');
    assert((s.material.expelled?.impurity || 0) >= 0, 'expelled waste tracked non-negative');
}

// 6. Degraded remains separate from contamination
{
    const rough = refine(s => {
        p.introduceToFurnace(s, 'exp_ironscar_grit', 2);
        p.setFurnaceHeat(s, 'fierce');
        p.advanceFurnace(s, 18);
    });
    assert(
        rough.result.material.degraded.spirit > rough.result.mixture.contamination + 0.5,
        'heavy degradation can exceed mixture contamination (distinct ledgers)'
    );
}

if (failed) {
    console.error(`\n${failed} furnace stability test(s) failed`);
    process.exit(1);
}
console.log('\nAll furnace stability tests passed.');
