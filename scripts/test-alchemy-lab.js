/**
 * Alchemy lab integration + heatStages verification.
 * Run: node scripts/test-alchemy-lab.js
 */
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const proto = require(path.join(root, 'prototype', 'property-alchemy'));
const { explainExperiment, formatMaterialLedger, compareExperiments, LAB_PRESETS } = require(path.join(
    root,
    'prototype',
    'property-alchemy',
    'lab-explain'
));

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

execSync('node scripts/bundle-alchemy-lab.js', { cwd: root, stdio: 'pipe' });
const deployBundle = path.join(root, 'sandbox', 'alchemy', 'lab-bundle.js');
const distBundle = path.join(root, 'prototype', 'property-alchemy', 'dist', 'lab-bundle.js');
assert(fs.existsSync(deployBundle) && fs.statSync(deployBundle).size > 10000, 'sandbox lab bundle builds');
assert(fs.existsSync(distBundle) && fs.statSync(distBundle).size > 10000, 'dist lab bundle copy exists');
const labHtml = path.join(root, 'sandbox', 'alchemy', 'index.html');
const labJs = path.join(root, 'sandbox', 'alchemy', 'lab.js');
assert(fs.existsSync(labHtml) && fs.existsSync(labJs), 'sandbox alchemy lab UI present');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert(indexHtml.includes('sandbox/alchemy/'), 'main game Dev tools links alchemy lab');

Object.entries(LAB_PRESETS).forEach(([key, preset]) => {
    const r = proto.simulateRefinement({ ...preset.input, trace: true });
    assert(r.material?.conservation != null, `preset ${key} runs with material ledger`);
});

const gritG = proto.simulateRefinement(LAB_PRESETS.grit_activation.input);
const gritM = proto.simulateRefinement(LAB_PRESETS.grit_medium.input);
assert(
    gritM.material.released.spirit > gritG.material.released.spirit,
    'preset: grit medium releases more than gentle'
);

const dewG = proto.simulateRefinement(LAB_PRESETS.dew_gentle.input);
const dewF = proto.simulateRefinement(LAB_PRESETS.dew_fierce.input);
assert(
    dewG.product.effects.qi > dewF.product.effects.qi,
    'preset: dawn dew gentle retains more qi than fierce'
);

const staged = proto.simulateRefinement(LAB_PRESETS.sequential_heat.input);
const singleF = proto.simulateRefinement({
    reagents: LAB_PRESETS.sequential_heat.input.reagents,
    heat: 'fierce',
    introductionOrder: 'yang_first'
});
assert(
    staged.material.released.spirit !== singleF.material.released.spirit
        || staged.product.potency !== singleF.product.potency
        || staged.process.outcome !== singleF.process.outcome,
    'heatStages sequence can differ from single fierce'
);

const repeatInput = {
    reagents: [{ reagentId: 'exp_ironscar_grit', qty: 2 }],
    heatStages: ['fierce', 'gentle'],
    introductionOrder: 'simultaneous',
    seed: 0
};
const run1 = proto.simulateRefinement(repeatInput);
const run2 = proto.simulateRefinement(repeatInput);
assert(JSON.stringify(run1) === JSON.stringify(run2), 'repeat identical inputs → identical outputs');

const spiritBefore = run1.material.conservation.inputSpirit;
const doubleStages = proto.simulateRefinement({
    ...repeatInput,
    heatStages: ['fierce', 'gentle', 'gentle', 'gentle']
});
assert(
    Math.abs(doubleStages.material.conservation.inputSpirit - spiritBefore) < 0.01,
    'extra heat stages do not create input spirit'
);
assert(
    Math.abs(doubleStages.material.conservation.conservationDelta) < 0.05,
    'extra heat stages conserve spirit'
);

const boundThenExtract = proto.simulateRefinement({
    reagents: [{ reagentId: 'exp_ironscar_grit', qty: 2 }],
    heatStages: ['gentle', 'medium'],
    introductionOrder: 'simultaneous'
});
const gentleOnly = proto.simulateRefinement({
    reagents: [{ reagentId: 'exp_ironscar_grit', qty: 2 }],
    heat: 'gentle'
});
assert(
    boundThenExtract.material.released.spirit >= gentleOnly.material.released.spirit,
    'later medium stage can extract bound material from gentle pass'
);

const degraded = proto.simulateRefinement(LAB_PRESETS.useful_failure.input);
const degradedSpirit = degraded.material.degraded.spirit;
const reheatDegraded = proto.simulateRefinement({
    ...LAB_PRESETS.useful_failure.input,
    heatStages: ['fierce', 'gentle']
});
assert(
    reheatDegraded.material.degraded.spirit >= degradedSpirit * 0.99,
    'degraded mass does not magically recover on gentle follow-up (no undeclared transform)'
);

const explained = explainExperiment(proto.simulateRefinement({ ...LAB_PRESETS.dew_gentle.input, trace: true }));
assert(explained.length >= 2, 'explainExperiment returns readable lines');

const ledger = formatMaterialLedger(gritM.material);
assert(ledger.rows.some(r => r.label.includes('Released')), 'ledger includes released row');

const histA = { input: LAB_PRESETS.dew_gentle.input, result: dewG };
const histB = { input: LAB_PRESETS.dew_fierce.input, result: dewF };
const cmp = compareExperiments(histA, histB);
assert(cmp.some(r => r.different), 'compare highlights heat/product differences');

const withTrace = proto.simulateRefinement({ ...repeatInput, trace: true });
const noTrace = proto.simulateRefinement(repeatInput);
assert(
    JSON.stringify(proto.stripTraceFromResult(withTrace)) === JSON.stringify(noTrace),
    'lab trace flag does not change outcomes'
);

try {
    execSync('node scripts/test-property-alchemy.js', { cwd: root, stdio: 'pipe' });
    ok('prototype regression tests pass');
} catch {
    fail('prototype regression tests pass');
}

if (failed) {
    console.error(`\n${failed} lab test(s) failed`);
    process.exit(1);
}
console.log('\nAll alchemy lab tests passed.');
