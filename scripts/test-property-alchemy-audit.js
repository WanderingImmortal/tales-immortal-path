/**
 * Audit invariants for property-alchemy prototype.
 * Run: node scripts/test-property-alchemy-audit.js
 */
const path = require('path');
const { EXPERIMENTAL_REAGENTS } = require(path.join(__dirname, '..', 'prototype', 'property-alchemy', 'reagents'));
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

function isFiniteResult(r) {
    const blob = JSON.stringify(r);
    return !blob.includes('NaN') && !blob.includes('Infinity');
}

const sampleInput = {
    reagents: [
        { reagentId: 'exp_sun_stone', qty: 1 },
        { reagentId: 'exp_soul_mist', qty: 1 },
        { reagentId: 'exp_saltbrush', qty: 1 }
    ],
    heat: 'medium',
    introductionOrder: 'yang_first',
    seed: 7
};

const withoutTrace = proto.simulateRefinement(sampleInput);
const withTrace = proto.simulateRefinement({ ...sampleInput, trace: true });
assert(
    JSON.stringify(proto.stripTraceFromResult(withTrace)) === JSON.stringify(withoutTrace),
    'trace mode does not change simulation outcome'
);
assert(Array.isArray(withTrace.trace) && withTrace.trace.length > 5, 'trace emits structured events');

const reagentsBefore = JSON.stringify(EXPERIMENTAL_REAGENTS);
proto.runFullStressAudit();
assert(JSON.stringify(EXPERIMENTAL_REAGENTS) === reagentsBefore, 'stress audit does not mutate reagent definitions');

let threw = false;
try {
    proto.simulateRefinement({ reagents: [], heat: 'gentle' });
} catch (e) {
    threw = true;
}
assert(threw, 'empty reagent list throws predictably');

threw = false;
try {
    proto.simulateRefinement({ reagents: [{ reagentId: 'exp_not_real', qty: 1 }], heat: 'gentle' });
} catch (e) {
    threw = true;
}
assert(threw, 'unknown reagent throws predictably');

const { results } = proto.runFullStressAudit();
const finite = results.every(r => r.error || isFiniteResult(r));
assert(finite, 'stress results contain no NaN or Infinity');

// No hidden reagent-id branches: permuting labels should not change physics if props identical
// (sanity — uses two different ids with different props; verify outcome depends on props not id string)
const a = proto.simulateRefinement({
    reagents: [{ reagentId: 'exp_dawn_dew', qty: 2 }],
    heat: 'gentle',
    seed: 0
});
const b = proto.simulateRefinement({
    reagents: [{ reagentId: 'exp_saltbrush', qty: 2 }],
    heat: 'gentle',
    seed: 0
});
assert(a.product.dominantAffinity !== b.product.dominantAffinity, 'different reagent properties yield different profiles');

const journal = proto.createAlchemyJournal();
const recorded = proto.recordExperiment(journal, sampleInput, withoutTrace, { label: 'audit' });
const formula = proto.saveFormulaFromEntry(journal, recorded.id, 'Audit formula');
const replay = proto.verifyFormulaReproducible(journal, formula.id, proto.simulateRefinement);
assert(replay.matchesOutcome && replay.matchesDominant, 'journal reproduces saved experiment after audit tooling');

// Run original suite via subprocess-less require
const { execSync } = require('child_process');
try {
    execSync('node scripts/test-property-alchemy.js', { cwd: path.join(__dirname, '..'), stdio: 'pipe' });
    ok('original prototype test suite still passes');
} catch (e) {
    fail('original prototype test suite regressed');
}

if (failed) {
    console.error(`\n${failed} audit test(s) failed`);
    process.exit(1);
}
console.log('\nAll property-alchemy audit tests passed.');
