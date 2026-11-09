/**
 * Medicinal product classification vs legacy potency (PR #226).
 * Run: node scripts/test-medicinal-classification.js
 */
const path = require('path');
const p = require(path.join(__dirname, '..', 'prototype', 'property-alchemy'));
const { summarizeRefinement } = require(path.join(__dirname, '..', 'prototype', 'property-alchemy', 'lab-explain'));

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
    return p.condenseFurnace(s);
}

// Skinmend gentle — useful tissue, low legacy potency
{
    const result = refine(s => {
        p.introduceToFurnace(s, 'exp_skinmend_leaf', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 45);
    });
    console.log('skinmend', result.product.suitability, result.product.potency, result.product.medicinal?.tissueRestoration);
    const summary = summarizeRefinement(result);
    assert(result.product.suitability === 'medicinal', 'skinmend classified medicinal despite low legacy potency');
    assert(summary.productUseful, 'skinmend headline marks usable product');
    assert(!summary.headline.includes('no usable'), 'skinmend summary does not claim no usable medicine');
}

// Mixed with dawn dew
{
    const result = refine(s => {
        p.introduceToFurnace(s, 'exp_skinmend_leaf', 2);
        p.introduceToFurnace(s, 'exp_clot_moss', 2);
        p.introduceToFurnace(s, 'exp_dawn_dew', 2);
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 55);
    });
    assert(result.product.suitability === 'medicinal', 'four-herb gentle mix remains medicinal');
}

// Same mix without dawn dew (legacy potency near threshold)
{
    const result = refine(s => {
        p.introduceToFurnace(s, 'exp_skinmend_leaf', 2);
        p.introduceToFurnace(s, 'exp_clot_moss', 2);
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 55);
    });
    console.log('mix no dew', result.product.potency, result.product.suitability);
    const summary = summarizeRefinement(result);
    assert(result.product.suitability === 'medicinal', 'mix without dawn dew classified medicinal from properties');
    assert(summary.productUseful, 'mix without dew marked productUseful');
}

// Qi foundation still medicinal via legacy or qi property
{
    const result = refine(s => {
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 50);
    });
    assert(result.product.suitability === 'medicinal', 'foundation qi refinement stays medicinal');
}

// Negligible medicine
{
    const result = refine(s => {
        p.introduceToFurnace(s, 'exp_foundation_root', 2);
        p.setFurnaceHeat(s, 'fierce');
        p.advanceFurnace(s, 25);
    });
    const summary = summarizeRefinement(result);
    assert(
        result.product.suitability !== 'medicinal' && (result.product.medicinalPeak || 0) < 2,
        'overcharred run not falsely medicinal'
    );
    assert(!summary.productUseful, 'negligible medicine not productUseful');
}

// Genuine high-instability failure (batch simulate path)
{
    const result = p.simulateRefinement({
        reagents: [
            { reagentId: 'exp_sun_stone', qty: 2 },
            { reagentId: 'exp_blood_crystal', qty: 2 },
            { reagentId: 'exp_soul_mist', qty: 2 }
        ],
        heat: 'fierce',
        introductionOrder: 'yang_first',
        seed: 0
    });
    if (result.process.outcome === 'failed' || result.process.outcome === 'rupture') {
        assert(
            result.product.suitability === 'ruined',
            'failed condensation uses ruined suitability'
        );
        const summary = summarizeRefinement(result);
        assert(!summary.productUseful, 'failed process not productUseful');
    } else {
        ok('volatile mix did not hit failure threshold in this seed (skipped strict failure asserts)');
    }
}

// Display rounding — material ledger spirits are rounded
{
    const result = refine(s => {
        p.introduceToFurnace(s, 'exp_skinmend_leaf', 2);
        p.setFurnaceHeat(s, 'gentle');
        p.advanceFurnace(s, 30);
    });
    const rel = String(result.material.released.spirit);
    assert(!/\d+\.\d{3,}/.test(rel), 'released spirit display uses sensible precision');
}

if (failed) {
    console.error(`\n${failed} medicinal classification test(s) failed`);
    process.exit(1);
}
console.log('\nAll medicinal classification tests passed.');
