/**
 * Before/after heat distribution (legacy PR #191 vs thermal PR #192).
 * Usage: node scripts/compare-thermal-model.js
 */
const path = require('path');
const { REAGENT_IDS } = require(path.join(__dirname, '..', 'prototype', 'property-alchemy', 'reagents'));
const { simulateRefinement } = require(path.join(__dirname, '..', 'prototype', 'property-alchemy', 'simulate'));
const { simulateRefinement: legacySim } = require(path.join(__dirname, '..', 'prototype', 'property-alchemy', 'simulate-legacy'));

const HEATS = ['gentle', 'medium', 'fierce'];

function summarize(simFn, label) {
    const dist = { refined: 0, unstable_salvage: 0, failed: 0, rupture: 0 };
    let n = 0;
    REAGENT_IDS.forEach(id => {
        HEATS.forEach(heat => {
            const r = simFn({ reagents: [{ reagentId: id, qty: 2 }], heat, seed: 0 });
            const outcome = r.process?.outcome || r.outcome;
            dist[outcome] = (dist[outcome] || 0) + 1;
            n += 1;
        });
    });
    return { label, n, dist };
}

const legacy = summarize(legacySim, 'legacy');
const thermal = summarize(simulateRefinement, 'thermal');

console.log(JSON.stringify({ legacy, thermal }, null, 2));
