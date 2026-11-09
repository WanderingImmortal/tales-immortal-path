/**
 * Alchemy lab integration + heatStages verification.
 * Run: node scripts/test-alchemy-lab.js
 */
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const proto = require(path.join(root, 'prototype', 'property-alchemy'));
const {
    explainExperiment,
    formatMaterialLedger,
    compareExperiments,
    LAB_PRESETS,
    describeReagent,
    summarizeRefinement,
    formatSpiritBreakdown,
    interpretComparison,
    countIntroductionEvents,
    formatSimDuration
} = require(path.join(
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

const gritCard = describeReagent('exp_ironscar_grit');
assert(gritCard.name === 'Ironscar Grit', 'describeReagent uses reagent definition name');
assert(gritCard.properties.some(p => p.key === 'spirit' && p.display === '10'), 'describeReagent exposes spirit from def');
assert(gritCard.properties.every(p => p.knowledgeState === 'established'), 'lab ingredient info uses established knowledge scaffolding');

const gritGentle = proto.simulateRefinement({ ...LAB_PRESETS.grit_activation.input, trace: true });
const gritFierce = proto.simulateRefinement({
    reagents: [{ reagentId: 'exp_ironscar_grit', qty: 2 }],
    heat: 'fierce',
    introductionOrder: 'simultaneous',
    trace: true
});
const sumGentle = summarizeRefinement(gritGentle);
const sumMedium = summarizeRefinement(gritM);
const sumFierce = summarizeRefinement(gritFierce);
assert(sumGentle.headline.includes('no usable medicinal'), 'gentle grit: process≠product success');
assert(sumGentle.materialLines.some(l => /bound|Insufficient/i.test(l)), 'gentle grit explains bound spirit');
assert(sumMedium.materialLines.some(l => /released|bound/i.test(l)), 'medium grit mentions extraction/bound');
assert(sumFierce.materialLines.some(l => /degrad/i.test(l)), 'fierce grit explains degradation');
assert(sumGentle.note.includes('Process completion'), 'summary reminds process≠product');

const bdGentle = formatSpiritBreakdown(gritGentle.material);
const bdMedium = formatSpiritBreakdown(gritM.material);
const bdFierce = formatSpiritBreakdown(gritFierce.material);
assert(bdGentle.released === 0 && bdGentle.bound === 20 && bdGentle.degraded === 0, 'gentle grit breakdown matches ledger');
assert(bdMedium.released === 5.3 && bdMedium.bound === 14.7 && bdMedium.degraded === 0, 'medium grit breakdown matches ledger');
assert(bdFierce.released === 0 && bdFierce.bound === 0 && bdFierce.degraded === 20, 'fierce grit breakdown matches ledger');
assert(
    Math.abs(bdMedium.percentages.released + bdMedium.percentages.bound + bdMedium.percentages.degraded - 100) < 0.2,
    'breakdown percentages sum ~100'
);
const bdZero = formatSpiritBreakdown({
    released: { spirit: 0 },
    bound: { spirit: 0 },
    degraded: { spirit: 0 },
    residual: { spirit: 0 },
    conservation: { inputSpirit: 0 }
});
assert(bdZero.empty === true, 'zero-input breakdown marked empty');

const gritCmp = interpretComparison(
    { input: LAB_PRESETS.grit_activation.input, result: gritGentle },
    { input: LAB_PRESETS.grit_medium.input, result: gritM }
);
assert(gritCmp.some(l => /Same ingredients|heat differs/i.test(l)), 'compare notes single-factor heat change');
assert(gritCmp.some(l => /5\.3 more released spirit/i.test(l)), 'compare states released spirit magnitude');
assert(gritCmp.some(l => /better run/i.test(l)), 'compare avoids declaring a universal winner');

const multiCmp = interpretComparison(
    { input: LAB_PRESETS.grit_activation.input, result: gritGentle },
    { input: LAB_PRESETS.conflict_mix.input, result: proto.simulateRefinement(LAB_PRESETS.conflict_mix.input) }
);
assert(multiCmp.some(l => /Several inputs differ|correlated/i.test(l)), 'multi-input compare warns against single-cause claims');

const labHtmlText = fs.readFileSync(labHtml, 'utf8');
const labJsText = fs.readFileSync(labJs, 'utf8');
const labCssText = fs.readFileSync(path.join(root, 'sandbox', 'alchemy', 'lab.css'), 'utf8');
assert(labHtmlText.includes('reagentInfo') && labHtmlText.includes('summaryOut'), 'lab HTML has readability panels');
assert(labHtmlText.includes('condenseBtn') && !labHtmlText.includes('introOrder'), 'lab HTML uses interactive furnace');
assert(labHtmlText.includes('0.25'), 'lab HTML offers slow playback speeds');
assert(
    countIntroductionEvents({
        mode: 'furnace',
        procedure: { actions: [{ kind: 'introduce' }, { kind: 'heat_set' }] },
        reagents: [{ reagentId: 'x', qty: 2 }]
    }) === 1,
    'comparison counts introduction actions from procedure.actions'
);
assert(formatSimDuration(20.800000000000026) === '20.8', 'duration display rounds float noise');
assert(labJsText.includes('createFurnaceState') && labJsText.includes('formatProcedureChronicle'), 'lab UI wires furnace');
assert(labCssText.includes('@media (max-width: 480px)'), 'lab CSS includes mobile layout rules');

try {
    execSync('node scripts/test-furnace.js', { cwd: root, stdio: 'pipe' });
    ok('furnace tests pass');
} catch {
    fail('furnace tests pass');
}

try {
    execSync('node scripts/test-thermal-exposure.js', { cwd: root, stdio: 'pipe' });
    ok('thermal exposure validation passes');
} catch {
    fail('thermal exposure validation passes');
}

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
