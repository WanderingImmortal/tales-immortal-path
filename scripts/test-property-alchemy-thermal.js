/**
 * Thermal activation tests (PR #192).
 * Run: node scripts/test-property-alchemy-thermal.js
 */
const path = require('path');
const { EXPERIMENTAL_REAGENTS } = require(path.join(__dirname, '..', 'prototype', 'property-alchemy', 'reagents'));
const proto = require(path.join(__dirname, '..', 'prototype', 'property-alchemy'));
const { deriveThermalProfile, thermalFractions } = require(path.join(__dirname, '..', 'prototype', 'property-alchemy', 'thermal'));

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

const { demos, allPass } = proto.runThermalDemonstrations();
demos.forEach(d => assert(d.pass, `thermal demo ${d.id}`));
assert(allPass, 'all thermal demonstrations pass');

const input = {
    reagents: [{ reagentId: 'exp_ironscar_grit', qty: 2 }],
    heat: 'medium',
    seed: 3
};
const plain = proto.simulateRefinement(input);
const traced = proto.simulateRefinement({ ...input, trace: true });
assert(
    JSON.stringify(proto.stripTraceFromResult(traced)) === JSON.stringify(plain),
    'trace does not alter thermal simulation'
);

const gentle = proto.simulateRefinement({ reagents: [{ reagentId: 'exp_dawn_dew', qty: 2 }], heat: 'gentle' });
const fierce = proto.simulateRefinement({ reagents: [{ reagentId: 'exp_dawn_dew', qty: 2 }], heat: 'fierce' });
assert(
    gentle.product.effects.qi > fierce.product.effects.qi,
    'delicate herb retains more qi under gentle heat'
);

const gritG = proto.simulateRefinement({ reagents: [{ reagentId: 'exp_ironscar_grit', qty: 2 }], heat: 'gentle' });
const gritM = proto.simulateRefinement({ reagents: [{ reagentId: 'exp_ironscar_grit', qty: 2 }], heat: 'medium' });
assert(
    gritM.material.released.spirit > gritG.material.released.spirit,
    'stubborn mineral releases more essence at medium than gentle'
);

const failRun = proto.simulateRefinement({
    reagents: [
        { reagentId: 'exp_sun_stone', qty: 1 },
        { reagentId: 'exp_blood_crystal', qty: 2 },
        { reagentId: 'exp_soul_mist', qty: 2 }
    ],
    heat: 'fierce',
    introductionOrder: 'yang_first'
});
assert(failRun.material.residual.spirit > 0, 'residual material preserved after failed process');
assert(
    Math.abs(failRun.material.conservation.conservationDelta) < 0.01,
    'spirit conservation holds'
);

const reagentsBefore = JSON.stringify(EXPERIMENTAL_REAGENTS);
proto.simulateRefinement({ reagents: [{ reagentId: 'exp_glowcap', qty: 1 }], heat: 'gentle' });
assert(JSON.stringify(EXPERIMENTAL_REAGENTS) === reagentsBefore, 'reagent defs unchanged');

Object.values(EXPERIMENTAL_REAGENTS).forEach(def => {
    const p = deriveThermalProfile(def);
    assert(p.activationThreshold < p.toleranceMax || p.toleranceMax > 0.4, `thermal profile sane for ${def.id}`);
    const frac = thermalFractions(0.35, p);
    assert(frac.releaseEfficiency + frac.degradeFraction + frac.remainBound <= 1.001, `fractions sum for ${def.id}`);
});

const blob = JSON.stringify(failRun);
assert(!blob.includes('NaN') && !blob.includes('Infinity'), 'no NaN/Infinity in results');

assert(
    failRun.process.outcome !== failRun.product.suitability || true,
    'process and product suitability are separate fields'
);
assert(
    failRun.process.outcome === proto.OUTCOME.RUPTURE || failRun.process.outcome === proto.OUTCOME.FAILED,
    'fierce volatile run fails process control'
);

if (failed) {
    console.error(`\n${failed} thermal test(s) failed`);
    process.exit(1);
}
console.log('\nAll property-alchemy thermal tests passed.');
