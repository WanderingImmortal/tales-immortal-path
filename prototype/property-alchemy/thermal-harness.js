/**
 * PR #192 thermal transformation demonstrations (rule-emergent).
 */

const { simulateRefinement, OUTCOME } = require('./simulate');

function runThermalDemonstrations() {
    const demos = [];

    const delicateGentle = simulateRefinement({
        reagents: [{ reagentId: 'exp_dawn_dew', qty: 2 }],
        heat: 'gentle'
    });
    const delicateFierce = simulateRefinement({
        reagents: [{ reagentId: 'exp_dawn_dew', qty: 2 }],
        heat: 'fierce'
    });
    demos.push({
        id: 'A_delicate_material',
        pass: delicateGentle.product.effects.qi > delicateFierce.product.effects.qi * 2
            && delicateGentle.material.released.spirit > delicateFierce.material.released.spirit,
        results: [delicateGentle, delicateFierce]
    });

    const stubbornGentle = simulateRefinement({
        reagents: [{ reagentId: 'exp_ironscar_grit', qty: 2 }],
        heat: 'gentle'
    });
    const stubbornMedium = simulateRefinement({
        reagents: [{ reagentId: 'exp_ironscar_grit', qty: 2 }],
        heat: 'medium'
    });
    demos.push({
        id: 'B_stubborn_material',
        pass: stubbornMedium.material.released.spirit > stubbornGentle.material.released.spirit + 1
            && stubbornMedium.material.released.affinities.marrow
                >= stubbornGentle.material.released.affinities.marrow,
        results: [stubbornGentle, stubbornMedium]
    });

    const conflictGentle = simulateRefinement({
        reagents: [
            { reagentId: 'exp_ironscar_grit', qty: 2 },
            { reagentId: 'exp_dawn_dew', qty: 2 }
        ],
        heat: 'gentle'
    });
    const conflictFierce = simulateRefinement({
        reagents: [
            { reagentId: 'exp_ironscar_grit', qty: 2 },
            { reagentId: 'exp_dawn_dew', qty: 2 }
        ],
        heat: 'fierce'
    });
    demos.push({
        id: 'C_conflicting_requirements',
        pass: conflictGentle.material.bound.spirit > conflictFierce.material.bound.spirit
            && conflictGentle.product.effects.qi > conflictFierce.product.effects.qi,
        results: [conflictGentle, conflictFierce]
    });

    const orderA = simulateRefinement({
        reagents: [
            { reagentId: 'exp_sun_stone', qty: 1 },
            { reagentId: 'exp_soul_mist', qty: 1 }
        ],
        heat: 'medium',
        introductionOrder: 'simultaneous'
    });
    const orderB = simulateRefinement({
        reagents: [
            { reagentId: 'exp_sun_stone', qty: 1 },
            { reagentId: 'exp_soul_mist', qty: 1 }
        ],
        heat: 'medium',
        introductionOrder: 'yang_first'
    });
    demos.push({
        id: 'D_process_matters',
        pass: orderA.process.outcome !== orderB.process.outcome
            || Math.abs(orderA.peakInstability - orderB.peakInstability) > 0.5
            || orderA.product.potency !== orderB.product.potency,
        results: [orderA, orderB]
    });

    const usefulFail = simulateRefinement({
        reagents: [
            { reagentId: 'exp_sun_stone', qty: 1 },
            { reagentId: 'exp_blood_crystal', qty: 2 },
            { reagentId: 'exp_soul_mist', qty: 2 }
        ],
        heat: 'fierce',
        introductionOrder: 'yang_first'
    });
    demos.push({
        id: 'E_useful_failure',
        pass: (usefulFail.process.outcome === OUTCOME.FAILED || usefulFail.process.outcome === OUTCOME.RUPTURE)
            && usefulFail.material.residual.spirit > 20
            && (usefulFail.material.degraded.affinities.toxicity > 5
                || usefulFail.material.bound.affinities.marrow > 0),
        results: [usefulFail]
    });

    return { demos, allPass: demos.every(d => d.pass) };
}

module.exports = { runThermalDemonstrations };
