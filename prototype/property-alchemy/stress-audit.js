/**
 * Systematic stress sampling for property-alchemy (isolated, no game state).
 */

const { REAGENT_IDS } = require('./reagents');
const { simulateRefinement, stripTraceFromResult, OUTCOME } = require('./simulate');

const HEATS = ['gentle', 'medium', 'fierce'];
const ORDERS = ['simultaneous', 'yin_first', 'yang_first'];
const QTY_OPTIONS = [1, 2];

/** @returns {() => number} */
function mulberry32(seed) {
    let a = seed >>> 0;
    return () => {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * @param {number} n
 * @param {number} k
 */
function combinations(ids, k) {
    const out = [];
    function walk(start, combo) {
        if (combo.length === k) {
            out.push([...combo]);
            return;
        }
        for (let i = start; i < ids.length; i++) {
            combo.push(ids[i]);
            walk(i + 1, combo);
            combo.pop();
        }
    }
    walk(0, []);
    return out;
}

/**
 * @param {string[]} reagentIds
 */
function qtyVariants(reagentIds) {
    const variants = [];
    const n = reagentIds.length;
    const total = QTY_OPTIONS.length ** n;
    for (let mask = 0; mask < total; mask++) {
        let x = mask;
        const reagents = reagentIds.map(id => {
            const q = QTY_OPTIONS[x % QTY_OPTIONS.length];
            x = Math.floor(x / QTY_OPTIONS.length);
            return { reagentId: id, qty: q };
        });
        variants.push(reagents);
    }
    return variants;
}

/**
 * @param {object} opts
 */
function buildExperimentPlan(opts = {}) {
    const singles = [];
    REAGENT_IDS.forEach(id => {
        [1, 2, 3, 4].forEach(qty => {
            HEATS.forEach(heat => {
                ORDERS.forEach(introductionOrder => {
                    singles.push({
                        reagents: [{ reagentId: id, qty }],
                        heat,
                        introductionOrder,
                        seed: 0,
                        bucket: 'single'
                    });
                });
            });
        });
    });

    const pairs = [];
    combinations(REAGENT_IDS, 2).forEach(pair => {
        qtyVariants(pair).forEach(reagents => {
            HEATS.forEach(heat => {
                ORDERS.forEach(introductionOrder => {
                    pairs.push({
                        reagents,
                        heat,
                        introductionOrder,
                        seed: 0,
                        bucket: 'pair'
                    });
                });
            });
        });
    });

    const triples = [];
    combinations(REAGENT_IDS, 3).forEach(triple => {
        qtyVariants(triple).forEach(reagents => {
            HEATS.forEach(heat => {
                ORDERS.forEach(introductionOrder => {
                    triples.push({
                        reagents,
                        heat,
                        introductionOrder,
                        seed: 0,
                        bucket: 'triple'
                    });
                });
            });
        });
    });

    const rng = mulberry32(opts.quadSeed ?? 90210);
    const quads = [];
    const quadTarget = opts.quadSamples ?? 1200;
    for (let i = 0; i < quadTarget; i++) {
        const pick = new Set();
        while (pick.size < 4) {
            pick.add(REAGENT_IDS[Math.floor(rng() * REAGENT_IDS.length)]);
        }
        const ids = [...pick];
        const reagents = ids.map(id => ({
            reagentId: id,
            qty: QTY_OPTIONS[Math.floor(rng() * QTY_OPTIONS.length)]
        }));
        quads.push({
            reagents,
            heat: HEATS[Math.floor(rng() * HEATS.length)],
            introductionOrder: ORDERS[Math.floor(rng() * ORDERS.length)],
            seed: 0,
            bucket: 'quad_sample'
        });
    }

    return [...singles, ...pairs, ...triples, ...quads];
}

/**
 * @param {object[]} plan
 */
function runExperiments(plan) {
    const results = [];
    plan.forEach((input, index) => {
        const { bucket, ...simInput } = input;
        let result;
        try {
            result = simulateRefinement(simInput);
        } catch (err) {
            results.push({ index, bucket, input: simInput, error: err.message });
            return;
        }
        results.push({
            index,
            bucket,
            input: simInput,
            outcome: result.outcome,
            success: result.success,
            dominant: result.product.dominantAffinity,
            potency: result.product.potency,
            toxicity: result.product.effects.toxicity,
            peakInstability: result.peakInstability,
            impurityRatio: result.mixture.impurityRatio,
            grade: result.product.grade,
            effects: result.product.effects
        });
    });
    return results;
}

function summarizeResults(results) {
    const ok = results.filter(r => !r.error);
    const dist = { refined: 0, unstable_salvage: 0, failed: 0, rupture: 0, error: 0 };
    ok.forEach(r => { dist[r.outcome] = (dist[r.outcome] || 0) + 1; });
    dist.error = results.length - ok.length;

    const dominant = {};
    ok.forEach(r => {
        dominant[r.dominant] = (dominant[r.dominant] || 0) + 1;
    });

    const heatOutcome = {};
    HEATS.forEach(h => {
        heatOutcome[h] = { refined: 0, unstable_salvage: 0, failed: 0, rupture: 0, n: 0 };
    });
    ok.forEach(r => {
        const h = r.input.heat;
        if (!heatOutcome[h]) return;
        heatOutcome[h][r.outcome] += 1;
        heatOutcome[h].n += 1;
    });

    const orderChanged = analyzeOrderSensitivity();
    const reagentContribution = scoreReagentPresence(ok);
    const comparableProducts = findComparableProductClusters(ok);
    const exploits = probeDominantStrategies();

    return {
        totalExperiments: results.length,
        successfulParses: ok.length,
        outcomeDistribution: dist,
        dominantAffinityDistribution: dominant,
        heatOutcome,
        orderSensitivity: orderChanged,
        reagentContribution,
        comparableProductClusters: comparableProducts,
        exploitProbes: exploits
    };
}

function analyzeOrderSensitivity() {
    const bases = [
        [{ reagentId: 'exp_sun_stone', qty: 1 }, { reagentId: 'exp_soul_mist', qty: 1 }],
        [{ reagentId: 'exp_blood_crystal', qty: 1 }, { reagentId: 'exp_soul_mist', qty: 1 }],
        [{ reagentId: 'exp_foundation_root', qty: 1 }, { reagentId: 'exp_marrow_thistle', qty: 1 }],
        [{ reagentId: 'exp_ironscar_grit', qty: 2 }, { reagentId: 'exp_sun_stone', qty: 1 }],
        [{ reagentId: 'exp_saltbrush', qty: 1 }, { reagentId: 'exp_sun_stone', qty: 1 }, { reagentId: 'exp_blood_crystal', qty: 1 }]
    ];
    let sets = 0;
    let outcomeDiffers = 0;
    let peakSpreadSum = 0;
    ORDERS.forEach(() => {});
    bases.forEach(reagents => {
        HEATS.forEach(heat => {
            const runs = ORDERS.map(order => simulateRefinement({ reagents, heat, introductionOrder: order, seed: 0 }));
            sets += 1;
            const outcomes = new Set(runs.map(r => r.outcome));
            if (outcomes.size > 1) outcomeDiffers += 1;
            const peaks = runs.map(r => r.peakInstability);
            peakSpreadSum += Math.max(...peaks) - Math.min(...peaks);
        });
    });
    return {
        probeSets: sets,
        setsWithDifferentOutcome: outcomeDiffers,
        avgPeakSpread: round3(peakSpreadSum / Math.max(1, sets))
    };
}

/**
 * @param {object[]} okResults
 */
function scoreReagentPresence(okResults) {
    const stats = {};
    REAGENT_IDS.forEach(id => {
        stats[id] = {
            present: 0,
            refined: 0,
            highPotency: 0,
            toxicFailures: 0
        };
    });
    okResults.forEach(r => {
        const ids = r.input.reagents.map(x => x.reagentId);
        ids.forEach(id => {
            if (!stats[id]) return;
            stats[id].present += 1;
            if (r.outcome === OUTCOME.REFINED) stats[id].refined += 1;
            if (r.potency >= 3 && r.outcome === OUTCOME.REFINED) stats[id].highPotency += 1;
            if ((r.outcome === OUTCOME.FAILED || r.outcome === OUTCOME.RUPTURE) && r.toxicity >= 5) {
                stats[id].toxicFailures += 1;
            }
        });
    });
    const ranked = Object.entries(stats)
        .map(([id, s]) => ({
            id,
            refinedRate: s.present ? s.refined / s.present : 0,
            highPotencyRate: s.present ? s.highPotency / s.present : 0,
            present: s.present,
            toxicFailureRate: s.present ? s.toxicFailures / s.present : 0
        }))
        .sort((a, b) => b.highPotencyRate - a.highPotencyRate);
    return {
        byHighPotencyRefined: ranked,
        rarelyUseful: ranked.filter(r => r.highPotencyRate < 0.02 && r.present > 100).map(r => r.id)
    };
}

/**
 * @param {object[]} okResults
 */
function findComparableProductClusters(okResults) {
    const refined = okResults.filter(r => r.outcome === OUTCOME.REFINED);
    const byDominant = {};
    refined.forEach(r => {
        const key = r.dominant;
        if (!byDominant[key]) byDominant[key] = [];
        byDominant[key].push(r.potency);
    });
    const clusters = Object.entries(byDominant).map(([dominant, potencies]) => ({
        dominant,
        count: potencies.length,
        potencyMin: Math.min(...potencies),
        potencyMax: Math.max(...potencies),
        potencySpread: round3(Math.max(...potencies) - Math.min(...potencies))
    }));
    return clusters.sort((a, b) => b.count - a.count);
}

function probeDominantStrategies() {
    const probes = [];

    // Gentle vs fierce on identical mixes
    const heatCompare = [];
    const heatMixes = [
        [{ reagentId: 'exp_sun_stone', qty: 1 }, { reagentId: 'exp_blood_crystal', qty: 1 }],
        [{ reagentId: 'exp_foundation_root', qty: 1 }, { reagentId: 'exp_dawn_dew', qty: 2 }],
        [{ reagentId: 'exp_ironscar_grit', qty: 2 }, { reagentId: 'exp_glowcap', qty: 1 }]
    ];
    heatMixes.forEach(reagents => {
        const gentle = simulateRefinement({ reagents, heat: 'gentle', seed: 0 });
        const fierce = simulateRefinement({ reagents, heat: 'fierce', seed: 0 });
        heatCompare.push({
            reagents,
            gentle: pickSummary(gentle),
            fierce: pickSummary(fierce)
        });
    });

    const gentleWins = heatCompare.filter(row =>
        rank(row.gentle.outcome) > rank(row.fierce.outcome)
        || (row.gentle.outcome === row.fierce.outcome && row.gentle.toxicity < row.fierce.toxicity)
    ).length;

    probes.push({
        id: 'heat_gentle_vs_fierce',
        description: 'Same mix under gentle vs fierce heat.',
        gentleStrictlyBetterCount: gentleWins,
        sampleSize: heatCompare.length,
        samples: heatCompare
    });

    // Saltbrush stabiliser spam
    const volatile = [{ reagentId: 'exp_sun_stone', qty: 1 }, { reagentId: 'exp_blood_crystal', qty: 1 }];
    const withSalt = [
        { reagentId: 'exp_saltbrush', qty: 1 },
        { reagentId: 'exp_saltbrush', qty: 2 },
        { reagentId: 'exp_saltbrush', qty: 3 }
    ].map((extra, i) => simulateRefinement({
        reagents: [{ ...extra }, ...volatile.map(r => ({ ...r }))],
        heat: 'medium',
        introductionOrder: 'yin_first',
        seed: 0
    }));
    probes.push({
        id: 'saltbrush_stack',
        description: 'Increasing Saltbrush with volatile yang pair (medium, yin-first).',
        runs: withSalt.map(pickSummary)
    });

    // Purify-only gentle
    const gritSun = simulateRefinement({
        reagents: [
            { reagentId: 'exp_saltbrush', qty: 2 },
            { reagentId: 'exp_dawn_dew', qty: 2 },
            { reagentId: 'exp_ironscar_grit', qty: 3 }
        ],
        heat: 'gentle',
        introductionOrder: 'yin_first',
        seed: 0
    });
    const gritSunMedium = simulateRefinement({
        reagents: gritSun.input.reagents,
        heat: 'medium',
        introductionOrder: gritSun.input.introductionOrder,
        seed: gritSun.input.seed
    });
    probes.push({
        id: 'purify_grit_bundle',
        description: 'Heavy grit with purifiers at gentle vs medium.',
        gentle: pickSummary(gritSun),
        medium: pickSummary(gritSunMedium)
    });

    // Quantity stacking sun stone alone
    const stack = [1, 2, 3, 4, 5].map(qty => pickSummary(simulateRefinement({
        reagents: [{ reagentId: 'exp_sun_stone', qty }],
        heat: 'medium',
        seed: 0
    })));
    probes.push({
        id: 'sun_stone_qty_stack',
        description: 'Single-reagent Sun Stone quantity 1–5 at medium heat.',
        runs: stack
    });

    // Purify-dominant reachable?
    const purifyCandidates = combinations(REAGENT_IDS, 2).slice(0, 30).map(pair => {
        const reagents = [{ reagentId: pair[0], qty: 2 }, { reagentId: pair[1], qty: 2 }];
        const r = simulateRefinement({ reagents, heat: 'gentle', introductionOrder: 'yin_first', seed: 0 });
        return { reagents, dominant: r.product.dominantAffinity, outcome: r.outcome };
    });
    const purifyDominant = purifyCandidates.filter(r => r.dominant === 'purify').length;

    probes.push({
        id: 'purify_dominant_pairs',
        description: 'First 30 pair combos (qty 2 each) at gentle yin-first — purify-dominant count.',
        purifyDominantCount: purifyDominant,
        sampleSize: purifyCandidates.length
    });

    return probes;
}

function pickSummary(result) {
    return {
        outcome: result.outcome,
        dominant: result.product.dominantAffinity,
        potency: result.product.potency,
        toxicity: result.product.effects.toxicity,
        peakInstability: result.peakInstability,
        impurityRatio: result.mixture.impurityRatio
    };
}

function rank(outcome) {
    const order = { rupture: 0, failed: 1, unstable_salvage: 2, refined: 3 };
    return order[outcome] ?? 0;
}

function round3(n) {
    return Math.round(n * 1000) / 1000;
}

function runFullStressAudit() {
    const plan = buildExperimentPlan();
    const results = runExperiments(plan);
    const summary = summarizeResults(results);
    return { planSize: plan.length, results, summary };
}

module.exports = {
    buildExperimentPlan,
    runExperiments,
    summarizeResults,
    runFullStressAudit,
    analyzeOrderSensitivity,
    probeDominantStrategies
};
