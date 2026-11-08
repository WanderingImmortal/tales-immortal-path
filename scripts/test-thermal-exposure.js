/**
 * Controlled thermal exposure validation (interactive furnace).
 * Run: node scripts/test-thermal-exposure.js
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

function runFurnace(build) {
    const s = p.createFurnaceState({ seed: 0 });
    p.startFurnace(s);
    build(s);
    return { state: s, result: p.condenseFurnace(s) };
}

// 1–2 Foundation Root gentle vs medium
{
    const gentle = runFurnace(s => {
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 45);
    });
    const medium = runFurnace(s => {
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 25);
    });
    console.log('foundation gentle released', gentle.result.material.released.spirit,
        'degraded', gentle.result.material.degraded.spirit);
    console.log('foundation medium released', medium.result.material.released.spirit,
        'degraded', medium.result.material.degraded.spirit);
    assert(
        gentle.result.material.released.spirit > medium.result.material.released.spirit + 10,
        'foundation root: gentle extracts; medium chars (extremely delicate)'
    );
}

// 3–4 Amber Lily moderate delicate — sustained gentle vs medium vs pulse
{
    const gentle = runFurnace(s => {
        p.introduceToFurnace(s, 'exp_amber_lily', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 45);
    });
    const medium = runFurnace(s => {
        p.introduceToFurnace(s, 'exp_amber_lily', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 35);
    });
    const pulse = runFurnace(s => {
        p.introduceToFurnace(s, 'exp_amber_lily', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 6);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 24);
    });
    console.log('amber lily gentle 45s released', gentle.result.material.released.spirit);
    console.log('amber lily medium 35s released', medium.result.material.released.spirit,
        'degraded', medium.result.material.degraded.spirit);
    console.log('amber lily pulse 6+24 released', pulse.result.material.released.spirit,
        'qi', pulse.result.product.effects.qi);
    assert(
        gentle.result.material.released.spirit > medium.result.material.released.spirit,
        'amber lily: sustained gentle extracts more than sustained medium'
    );
    assert(
        pulse.result.material.released.spirit > medium.result.material.released.spirit + 5,
        'amber lily: medium burst + gentle beats sustained medium'
    );
    const stayHot = runFurnace(s => {
        p.introduceToFurnace(s, 'exp_amber_lily', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 6);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 24);
    });
    assert(
        pulse.result.material.released.spirit > stayHot.result.material.released.spirit + 5,
        'amber lily: switching to gentle after burst beats staying on medium'
    );
}

// 5 Heat-resistant cinderscale gentle vs fierce/medium
{
    const gentle = runFurnace(s => {
        p.introduceToFurnace(s, 'exp_cinderscale', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 70);
    });
    const medium = runFurnace(s => {
        p.introduceToFurnace(s, 'exp_cinderscale', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 45);
    });
    console.log('cinderscale gentle released', gentle.result.material.released.spirit);
    console.log('cinderscale medium released', medium.result.material.released.spirit);
    assert(
        medium.result.material.released.spirit > gentle.result.material.released.spirit + 8,
        'cinderscale: needs medium heat to release marrow essence'
    );
}

// 6 Conservation
{
    const { result } = runFurnace(s => {
        p.introduceToFurnace(s, 'exp_amber_lily', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 6);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 30);
    });
    assert(
        Math.abs(result.material.conservation.conservationDelta) < 0.06,
        'material conservation through pulse refinement'
    );
}

// 7 Playback-speed independence (batch vs single steps)
{
    const stepped = runFurnace(s => {
        p.introduceToFurnace(s, 'exp_amber_lily', 2);
        p.setFurnaceHeat(s, 'medium');
        for (let i = 0; i < 60; i++) p.stepFurnace(s, p.SIM_DT);
        p.setFurnaceHeat(s, 'gentle');
        for (let i = 0; i < 240; i++) p.stepFurnace(s, p.SIM_DT);
    });
    const batched = runFurnace(s => {
        p.introduceToFurnace(s, 'exp_amber_lily', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 6);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 24);
    });
    assert(
        JSON.stringify(stepped.result.material) === JSON.stringify(batched.result.material),
        'playback batching does not change thermal exposure outcomes'
    );
}

if (failed) {
    console.error(`\n${failed} thermal exposure test(s) failed`);
    process.exit(1);
}
console.log('\nAll thermal exposure validation tests passed.');
