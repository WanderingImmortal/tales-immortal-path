/**
 * Demonstration experiments — outcomes must emerge from simulate.js rules.
 */

const { simulateRefinement, similarEffectProfile, OUTCOME } = require('./simulate');
const { createAlchemyJournal, recordExperiment, saveFormulaFromEntry } = require('./journal');
const { runThermalDemonstrations } = require('./thermal-harness');

function runDemonstrationHarness() {
    const runs = [];
    const thermal = runThermalDemonstrations();
    thermal.demos.forEach(d => {
        runs.push({
            id: d.id,
            description: `Thermal demo ${d.id}`,
            results: d.results,
            pass: d.pass
        });
    });

    const qiPathA = simulateRefinement({
        reagents: [
            { reagentId: 'exp_foundation_root', qty: 1 },
            { reagentId: 'exp_dawn_dew', qty: 2 }
        ],
        heat: 'gentle',
        introductionOrder: 'simultaneous'
    });
    const qiPathB = simulateRefinement({
        reagents: [
            { reagentId: 'exp_dust_root', qty: 2 },
            { reagentId: 'exp_saltbrush', qty: 1 },
            { reagentId: 'exp_dawn_dew', qty: 1 }
        ],
        heat: 'gentle',
        introductionOrder: 'simultaneous'
    });
    runs.push({
        id: 'similar_qi_paths',
        description: 'Different mixes yield qi-forward released essence at gentle heat.',
        results: [qiPathA, qiPathB],
        pass: qiPathA.product.dominantAffinity === 'qi'
            && qiPathB.material.released.affinities.qi >= 2
            && qiPathA.process.outcome === OUTCOME.REFINED
    });

    const sunSoulBase = [
        { reagentId: 'exp_sun_stone', qty: 1 },
        { reagentId: 'exp_soul_mist', qty: 1 }
    ];
    const sunSoulGentle = simulateRefinement({
        reagents: sunSoulBase,
        heat: 'gentle',
        introductionOrder: 'yang_first'
    });
    const sunSoulFierce = simulateRefinement({
        reagents: sunSoulBase,
        heat: 'fierce',
        introductionOrder: 'yang_first'
    });
    runs.push({
        id: 'heat_changes_fate',
        description: 'Sun Stone + Soul Mist: gentle vs fierce (process + material).',
        results: [sunSoulGentle, sunSoulFierce],
        pass: rankOutcome(sunSoulGentle.process.outcome) > rankOutcome(sunSoulFierce.process.outcome)
            && sunSoulGentle.product.potency >= sunSoulFierce.product.potency
    });

    const volatileNoSalt = simulateRefinement({
        reagents: [
            { reagentId: 'exp_sun_stone', qty: 1 },
            { reagentId: 'exp_blood_crystal', qty: 1 },
            { reagentId: 'exp_soul_mist', qty: 1 }
        ],
        heat: 'fierce',
        introductionOrder: 'yang_first'
    });
    const volatileWithSalt = simulateRefinement({
        reagents: [
            { reagentId: 'exp_saltbrush', qty: 2 },
            { reagentId: 'exp_sun_stone', qty: 1 },
            { reagentId: 'exp_blood_crystal', qty: 1 },
            { reagentId: 'exp_soul_mist', qty: 1 }
        ],
        heat: 'fierce',
        introductionOrder: 'yin_first'
    });
    runs.push({
        id: 'stabiliser_rescue',
        description: 'Saltbrush + yin-first lowers peak instability on fierce volatile mix.',
        results: [volatileNoSalt, volatileWithSalt],
        pass: volatileWithSalt.peakInstability < volatileNoSalt.peakInstability
    });

    const failAttempt = simulateRefinement({
        reagents: [
            { reagentId: 'exp_sun_stone', qty: 1 },
            { reagentId: 'exp_blood_crystal', qty: 2 },
            { reagentId: 'exp_soul_mist', qty: 2 }
        ],
        heat: 'fierce',
        introductionOrder: 'yang_first'
    });
    const learnAttempt = simulateRefinement({
        reagents: [
            { reagentId: 'exp_saltbrush', qty: 2 },
            { reagentId: 'exp_dawn_dew', qty: 1 },
            { reagentId: 'exp_sun_stone', qty: 1 },
            { reagentId: 'exp_blood_crystal', qty: 1 },
            { reagentId: 'exp_soul_mist', qty: 1 }
        ],
        heat: 'gentle',
        introductionOrder: 'yin_first'
    });
    runs.push({
        id: 'failure_informs_retry',
        description: 'Fierce rupture vs gentle controlled retry; residual preserved on failure.',
        results: [failAttempt, learnAttempt],
        pass: rankOutcome(failAttempt.process.outcome) < rankOutcome(learnAttempt.process.outcome)
            && failAttempt.material.residual.spirit > 10
            && learnAttempt.process.outcome === OUTCOME.REFINED
    });

    const journal = createAlchemyJournal();
    runs.forEach(r => {
        r.results.forEach((res, idx) => {
            recordExperiment(journal, res.input, res, { label: `${r.id}_${idx}` });
        });
    });
    if (journal.entries.length >= 2) {
        saveFormulaFromEntry(journal, journal.entries[journal.entries.length - 1].id, 'Thermal retry formula');
    }

    return { runs, journal, allPass: runs.every(r => r.pass) };
}

function rankOutcome(outcome) {
    const order = {
        [OUTCOME.RUPTURE]: 0,
        [OUTCOME.FAILED]: 1,
        [OUTCOME.UNSTABLE_SALVAGE]: 2,
        [OUTCOME.REFINED]: 3
    };
    return order[outcome] ?? 0;
}

module.exports = {
    runDemonstrationHarness,
    rankOutcome,
    runThermalDemonstrations
};
