/**
 * Demonstration experiments — outcomes must emerge from simulate.js rules.
 */

const { simulateRefinement, similarEffectProfile, OUTCOME } = require('./simulate');
const { createAlchemyJournal, recordExperiment, saveFormulaFromEntry } = require('./journal');

/**
 * Runs the canonical demonstration suite for docs and tests.
 */
function runDemonstrationHarness() {
    const runs = [];

    // 1) Two different combos → similar qi-forward useful results
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
        description: 'Different reagent sets both yield qi-dominant stable products at gentle heat.',
        results: [qiPathA, qiPathB],
        pass: similarEffectProfile(qiPathA, qiPathB, 'qi')
    });

    // 2) Same reagents, different heat → different outcomes
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
        description: 'Sun Stone + Soul Mist: gentle yang-first vs fierce yang-first.',
        results: [sunSoulGentle, sunSoulFierce],
        pass: sunSoulGentle.outcome !== sunSoulFierce.outcome
            || sunSoulGentle.product.dominantAffinity !== sunSoulFierce.product.dominantAffinity
            || Math.abs(sunSoulGentle.product.potency - sunSoulFierce.product.potency) > 2
    });

    // 3) Stabiliser tames dangerous reaction
    const volatileNoSalt = simulateRefinement({
        reagents: [
            { reagentId: 'exp_sun_stone', qty: 1 },
            { reagentId: 'exp_blood_crystal', qty: 1 }
        ],
        heat: 'medium',
        introductionOrder: 'simultaneous'
    });
    const volatileWithSalt = simulateRefinement({
        reagents: [
            { reagentId: 'exp_saltbrush', qty: 2 },
            { reagentId: 'exp_sun_stone', qty: 1 },
            { reagentId: 'exp_blood_crystal', qty: 1 }
        ],
        heat: 'medium',
        introductionOrder: 'yin_first'
    });
    runs.push({
        id: 'stabiliser_rescue',
        description: 'Saltbrush reduces peak instability for yang catalyst pair.',
        results: [volatileNoSalt, volatileWithSalt],
        pass: volatileWithSalt.peakInstability < volatileNoSalt.peakInstability
            && rankOutcome(volatileWithSalt.outcome) >= rankOutcome(volatileNoSalt.outcome)
    });

    // 4) Poor combo rescued by process (gentle + order + purifier)
    const gritSunBad = simulateRefinement({
        reagents: [
            { reagentId: 'exp_ironscar_grit', qty: 2 },
            { reagentId: 'exp_sun_stone', qty: 3 }
        ],
        heat: 'fierce',
        introductionOrder: 'simultaneous'
    });
    const gritSunGood = simulateRefinement({
        reagents: [
            { reagentId: 'exp_saltbrush', qty: 2 },
            { reagentId: 'exp_dawn_dew', qty: 2 },
            { reagentId: 'exp_ironscar_grit', qty: 2 },
            { reagentId: 'exp_sun_stone', qty: 1 }
        ],
        heat: 'gentle',
        introductionOrder: 'yin_first'
    });
    runs.push({
        id: 'process_saves_grit',
        description: 'Ironscar Grit + Sun Stone: fierce simultaneous vs gentle purifier-first.',
        results: [gritSunBad, gritSunGood],
        pass: rankOutcome(gritSunGood.outcome) > rankOutcome(gritSunBad.outcome)
            && gritSunGood.product.effects.toxicity < gritSunBad.product.effects.toxicity
    });

    // 5) Failure teaches — diagnostics differ attempt 1 vs 2
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
        description: 'Fierce clash fails; gentle yin-first with carrier succeeds with lower instability.',
        results: [failAttempt, learnAttempt],
        pass: !failAttempt.success && learnAttempt.success
            && learnAttempt.peakInstability < failAttempt.peakInstability
            && failAttempt.diagnostics.suggestedAdjustments.length > 0
    });

    const journal = createAlchemyJournal();
    runs.forEach(r => {
        r.results.forEach((res, idx) => {
            recordExperiment(journal, res.input, res, { label: `${r.id}_${idx}` });
        });
    });
    if (journal.entries.length >= 2) {
        saveFormulaFromEntry(journal, journal.entries[journal.entries.length - 1].id, 'Recovered Yin-Yang Mix', 'After failure notes');
    }

    return { runs, journal, allPass: runs.every(r => r.pass) };
}

/** Higher rank = better outcome */
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
    rankOutcome
};
