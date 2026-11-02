/**
 * Property-based alchemy prototype tests (isolated — no DOM).
 * Run: node scripts/test-property-alchemy.js
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

// Determinism
const input = {
    reagents: [{ reagentId: 'exp_dust_root', qty: 2 }, { reagentId: 'exp_dawn_dew', qty: 1 }],
    heat: 'medium',
    introductionOrder: 'simultaneous',
    seed: 42
};
const a = proto.simulateRefinement(input);
const b = proto.simulateRefinement(input);
assert(JSON.stringify(a) === JSON.stringify(b), 'identical inputs produce identical results');

// No lookup-table pills: changing qty shifts continuous outputs
const low = proto.simulateRefinement({
    reagents: [{ reagentId: 'exp_glowcap', qty: 1 }],
    heat: 'gentle'
});
const high = proto.simulateRefinement({
    reagents: [{ reagentId: 'exp_glowcap', qty: 3 }],
    heat: 'gentle'
});
assert(
    high.product.potency !== low.product.potency || high.mixture.spirit !== low.mixture.spirit,
    'potency scales with quantity (not fixed recipe id)'
);

const { runs, journal, allPass } = proto.runDemonstrationHarness();
runs.forEach(run => {
    assert(run.pass, `harness scenario: ${run.id}`);
});

assert(allPass, 'full demonstration harness passes');

// Journal reproducibility
const lastFormula = journal.savedFormulas[journal.savedFormulas.length - 1];
if (lastFormula) {
    const check = proto.verifyFormulaReproducible(journal, lastFormula.id, proto.simulateRefinement);
    assert(check.matchesOutcome && check.matchesDominant, 'saved formula replays deterministically');
}

// Discovery split: journal holds hints, not full defs
const discovered = journal.discovered.exp_soul_mist;
assert(
    discovered && discovered.observedProperties.length > 0,
    'failed/success runs append discovered reagent hints'
);
assert(
    !discovered.observedProperties.includes('spirit:26'),
    'discovery stores tags not raw stat dumps'
);

if (failed) {
    console.error(`\n${failed} test(s) failed`);
    process.exit(1);
}
console.log('\nAll property-alchemy prototype tests passed.');
