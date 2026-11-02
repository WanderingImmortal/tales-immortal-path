/**
 * Human-readable explanations from simulation results (shared: Node + browser bundle).
 */

/**
 * @param {object} result — simulateRefinement output (with trace)
 * @returns {string[]}
 */
function explainExperiment(result) {
    const lines = [];
    const proc = result.process?.outcome || result.outcome;
    lines.push(`Process: ${proc} (peak instability ${result.peakInstability}).`);

    if (result.material) {
        const m = result.material;
        lines.push(
            `Material — released spirit ${m.released?.spirit ?? 0}, `
            + `still bound ${m.bound?.spirit ?? 0}, `
            + `degraded ${m.degraded?.spirit ?? 0}.`
        );
        if (m.conservation && Math.abs(m.conservation.conservationDelta) > 0.05) {
            lines.push(`⚠ Conservation delta ${m.conservation.conservationDelta} (investigate).`);
        }
    }

    lines.push(
        `Product suitability: ${result.product?.suitability ?? 'n/a'}; `
        + `dominant affinity ${result.product?.dominantAffinity}; `
        + `potency ${result.product?.potency}.`
    );

    if (result.trace?.length) {
        result.trace.forEach(ev => {
            if (['thermal_activation', 'thermal_degradation', 'bound_remainder', 'introduction_shock',
                'destabilisation', 'condensation_failed', 'purify_scrub', 'heat_stage'].includes(ev.kind)) {
                lines.push(`• ${ev.message}`);
            }
        });
    } else if (result.diagnostics?.suggestedAdjustments?.length) {
        result.diagnostics.suggestedAdjustments.forEach(s => lines.push(`• Suggestion: ${s}`));
    }

    if (result.observations?.length) {
        result.observations.forEach(o => lines.push(`• Observed: ${o}`));
    }

    return lines;
}

/**
 * @param {object} material
 * @returns {{ rows: { label: string, spirit: number, note?: string }[], conservation?: object }}
 */
function formatMaterialLedger(material) {
    if (!material) return { rows: [] };
    const rows = [
        { label: 'Released (reactive)', spirit: material.released?.spirit ?? 0, note: 'Available for chemistry / condensation' },
        { label: 'Still bound', spirit: material.bound?.spirit ?? 0, note: 'Unextracted — may respond to later heat' },
        { label: 'Degraded', spirit: material.degraded?.spirit ?? 0, note: 'Overburn / broken affinities' },
        { label: 'Residual (bound+degraded)', spirit: material.residual?.spirit ?? 0, note: 'Salvage hook' }
    ];
    if (material.conservation) {
        rows.unshift({
            label: 'Input (registered)',
            spirit: material.conservation.inputSpirit,
            note: 'Sum of reagent spirit in this run'
        });
    }
    return { rows, conservation: material.conservation };
}

/**
 * @param {object} a
 * @param {object} b — history entries with { input, result, label }
 * @returns {object[]}
 */
function compareExperiments(a, b) {
    const fields = [
        ['Heat', x => x.input.heatStages?.join(' → ') || x.input.heat],
        ['Introduction order', x => x.input.introductionOrder || 'simultaneous'],
        ['Process outcome', x => x.result.process?.outcome || x.result.outcome],
        ['Peak instability', x => x.result.peakInstability],
        ['Released spirit', x => x.result.material?.released?.spirit],
        ['Bound spirit', x => x.result.material?.bound?.spirit],
        ['Degraded spirit', x => x.result.material?.degraded?.spirit],
        ['Potency', x => x.result.product?.potency],
        ['Dominant affinity', x => x.result.product?.dominantAffinity],
        ['Suitability', x => x.result.product?.suitability]
    ];
    return fields.map(([label, fn]) => ({
        label,
        a: fn(a),
        b: fn(b),
        different: String(fn(a)) !== String(fn(b))
    }));
}

/** Preset definitions — real inputs only */
const LAB_PRESETS = {
    grit_activation: {
        name: 'Ironscar Grit — gentle (bound-heavy)',
        input: { reagents: [{ reagentId: 'exp_ironscar_grit', qty: 2 }], heat: 'gentle', introductionOrder: 'simultaneous' }
    },
    grit_medium: {
        name: 'Ironscar Grit — medium (extract)',
        input: { reagents: [{ reagentId: 'exp_ironscar_grit', qty: 2 }], heat: 'medium', introductionOrder: 'simultaneous' }
    },
    dew_gentle: {
        name: 'Dawn Dew — gentle',
        input: { reagents: [{ reagentId: 'exp_dawn_dew', qty: 2 }], heat: 'gentle', introductionOrder: 'simultaneous' }
    },
    dew_fierce: {
        name: 'Dawn Dew — fierce (degradation)',
        input: { reagents: [{ reagentId: 'exp_dawn_dew', qty: 2 }], heat: 'fierce', introductionOrder: 'simultaneous' }
    },
    conflict_mix: {
        name: 'Conflicting — grit + dew simultaneous fierce',
        input: {
            reagents: [{ reagentId: 'exp_ironscar_grit', qty: 2 }, { reagentId: 'exp_dawn_dew', qty: 2 }],
            heat: 'fierce',
            introductionOrder: 'simultaneous'
        }
    },
    sequential_heat: {
        name: 'Sequential — grit yang-first: fierce then gentle',
        input: {
            reagents: [{ reagentId: 'exp_ironscar_grit', qty: 2 }, { reagentId: 'exp_dawn_dew', qty: 2 }],
            heatStages: ['fierce', 'gentle'],
            introductionOrder: 'yang_first'
        }
    },
    useful_failure: {
        name: 'Useful failure — volatile fierce yang-first',
        input: {
            reagents: [
                { reagentId: 'exp_sun_stone', qty: 1 },
                { reagentId: 'exp_blood_crystal', qty: 2 },
                { reagentId: 'exp_soul_mist', qty: 2 }
            ],
            heat: 'fierce',
            introductionOrder: 'yang_first'
        }
    }
};

module.exports = {
    explainExperiment,
    formatMaterialLedger,
    compareExperiments,
    LAB_PRESETS
};
