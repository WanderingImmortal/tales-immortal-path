/**
 * Medicinal property extraction and pill outcomes (PR #225).
 * Run: node scripts/test-medicinal-properties.js
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

function close(a, b, tol, msg) {
    assert(Math.abs(a - b) <= tol, msg);
}

function refine(build) {
    const s = p.createFurnaceState({ seed: 0 });
    p.startFurnace(s);
    build(s);
    return { state: s, result: p.condenseFurnace(s) };
}

function med(r) {
    return r.product.medicinal || {};
}

// 1. Qi-nourishing ingredient
{
    const { result } = refine(s => {
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 50);
    });
    console.log('foundation qi', med(result).qiNourishment, result.product.experimentalName);
    assert(med(result).qiNourishment > 5, 'foundation root yields Qi nourishment');
    assert(
        med(result).woundStabilisation < 1 && med(result).tissueRestoration < 1,
        'foundation root does not invent wound/tissue properties'
    );
    assert(/Qi Nourishing/i.test(result.product.experimentalName || ''), 'names Qi nourishing pill');
}

// 2. Wound stabilisation ingredient
{
    const { result } = refine(s => {
        p.introduceToFurnace(s, 'exp_clot_moss', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 45);
    });
    console.log('clot wound', med(result).woundStabilisation, result.product.experimentalName);
    assert(med(result).woundStabilisation > 4, 'clot moss yields wound stabilisation');
    assert(med(result).qiNourishment < 1, 'wound-focused ingredient is not qi pill');
}

// 3. Combined qi + healing
{
    const { result } = refine(s => {
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 25);
        p.introduceToFurnace(s, 'exp_skinmend_leaf', 2);
        p.advanceFurnace(s, 35);
    });
    console.log('combo', med(result));
    assert(med(result).qiNourishment > 3 && med(result).tissueRestoration > 2, 'qi + tissue combo retains both');
    const name = result.product.experimentalName || '';
    console.log('combo name', name);
    assert(/Qi Nourishing/i.test(name) && /Tissue-Restoring/i.test(name), 'combo experimental name reflects dual profile');
}

// 4. Additive same property
{
    const single = refine(s => {
        p.introduceToFurnace(s, 'exp_skinmend_leaf', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 40);
    });
    const duo = refine(s => {
        p.introduceToFurnace(s, 'exp_skinmend_leaf', 2);
        p.introduceToFurnace(s, 'exp_glowcap', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 45);
    });
    assert(
        med(duo.result).tissueRestoration > med(single.result).tissueRestoration,
        'two tissue sources increase total tissue restoration'
    );
}

// 5. Overheat reduces medicinal without changing type
{
    const gentle = refine(s => {
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 45);
    });
    const fierce = refine(s => {
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'fierce');
        p.advanceFurnace(s, 15);
    });
    assert(med(fierce.result).qiNourishment < med(gentle.result).qiNourishment * 0.5, 'fierce chars reduce qi nourishment');
    assert(med(fierce.result).woundStabilisation < 1, 'qi type unchanged — no wound property after overburn');
}

// 6. Polarity independent of medicinal function
{
    const yangBlood = refine(s => {
        p.introduceToFurnace(s, 'exp_blood_crystal', 2);
        p.setFurnaceHeat(s, 'medium');
        p.advanceFurnace(s, 12);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 20);
    });
    const yinWound = refine(s => {
        p.introduceToFurnace(s, 'exp_clot_moss', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 40);
    });
    assert(yangBlood.result.mixture.polarityImbalance > 0.25, 'blood crystal run is yang-leaning');
    assert(yinWound.result.mixture.polarityImbalance > 0.2, 'clot moss run is yin-leaning');
    assert(med(yangBlood.result).bloodRestoration > 2, 'yang-leaning still blood medicine');
    assert(med(yinWound.result).woundStabilisation > 2, 'yin-leaning still wound medicine');
}

// 7. Condensation preserves medicinal profile from released ledger
{
    const s = p.createFurnaceState({ seed: 0 });
    p.startFurnace(s);
    p.introduceToFurnace(s, 'exp_marrow_thistle', 2);
    p.setFurnaceHeat(s, 'gentle');
    p.advanceFurnace(s, 50);
    const inMix = { ...(s.material.released.medicinal || {}) };
    const result = p.condenseFurnace(s);
    close(
        med(result).boneRestoration,
        (inMix.boneRestoration || 0) * (result.mixture.purity || 0.9),
        Math.max(2, (inMix.boneRestoration || 0) * 0.15),
        'condense scales bone restoration from released medicinal mass'
    );
}

// 8. Deterministic playback
{
    const a = refine(s => {
        p.introduceToFurnace(s, 'exp_dust_root', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 40);
    });
    const b = refine(s => {
        p.introduceToFurnace(s, 'exp_dust_root', 2);
        p.setFurnaceHeat(s, 'gentle');
        for (let i = 0; i < 400; i++) p.advanceFurnace(s, 0.1);
    });
    close(med(a.result).qiNourishment, med(b.result).qiNourishment, 0.05, 'medicinal deterministic under batching');
}

// 9. Negligible content → weak misleading pill
{
    const { result } = refine(s => {
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'fierce');
        p.advanceFurnace(s, 30);
    });
    const ranked = (result.product.medicinalProfile || []).length;
    assert(med(result).qiNourishment < 2.5, 'overcharred foundation has low qi nourishment');
    assert(ranked <= 1, 'negligible medicinal content does not show many strong properties');
}

if (failed) {
    console.error(`\n${failed} medicinal property test(s) failed`);
    process.exit(1);
}
console.log('\nAll medicinal property tests passed.');
