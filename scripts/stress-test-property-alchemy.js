/**
 * Run property-alchemy stress audit (isolated).
 * Usage: node scripts/stress-test-property-alchemy.js [--json]
 */
const path = require('path');
const { runFullStressAudit } = require(path.join(__dirname, '..', 'prototype', 'property-alchemy', 'stress-audit'));

const jsonOut = process.argv.includes('--json');
const { planSize, summary } = runFullStressAudit();

if (jsonOut) {
    console.log(JSON.stringify({ planSize, summary }, null, 2));
} else {
    console.log('Property-alchemy stress audit');
    console.log('Experiments:', planSize);
    console.log('Outcome distribution:', summary.outcomeDistribution);
    console.log('Dominant affinities:', summary.dominantAffinityDistribution);
    console.log('Heat breakdown:', summary.heatOutcome);
    console.log('Order sensitivity:', summary.orderSensitivity);
    console.log('Top reagents (high-potency refined rate):',
        summary.reagentContribution.byHighPotencyRefined.slice(0, 5));
    console.log('Rarely high-potency:', summary.reagentContribution.rarelyUseful);
    console.log('Product clusters:', summary.comparableProductClusters);
    console.log('Exploit probes:', JSON.stringify(summary.exploitProbes, null, 2));
}
