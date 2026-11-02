/**
 * Developer-only refinement trace (JSON). Does not touch game state.
 * Usage:
 *   node scripts/explain-property-alchemy-refinement.js '<json input>'
 * Input matches simulateRefinement fields; set "trace": true or omit (script forces trace).
 */
const path = require('path');
const { simulateRefinement, stripTraceFromResult } = require(path.join(
    __dirname,
    '..',
    'prototype',
    'property-alchemy',
    'simulate'
));

const raw = process.argv[2];
if (!raw) {
    console.error('Provide JSON refinement input as first argument.');
    process.exit(1);
}

let input;
try {
    input = JSON.parse(raw);
} catch (e) {
    console.error('Invalid JSON:', e.message);
    process.exit(1);
}

input.trace = true;
const result = simulateRefinement(input);
const payload = {
    outcome: result.outcome,
    product: result.product,
    peakInstability: result.peakInstability,
    mixture: result.mixture,
    trace: result.trace,
    resultWithoutTrace: stripTraceFromResult(result)
};
console.log(JSON.stringify(payload, null, 2));
