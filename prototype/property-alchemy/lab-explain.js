/**
 * Human-readable explanations from simulation results (shared: Node + browser bundle).
 * Presentation helpers only — does not change chemistry.
 */

const { EXPERIMENTAL_REAGENTS } = require('./reagents');
const { deriveThermalProfile } = require('./thermal');
const { deriveSeparationProfile } = require('./separation');

/** Character knowledge states (scaffolding for a future live game). Lab uses established. */
const KNOWLEDGE_STATES = {
    unknown: {
        id: 'unknown',
        label: 'Unknown',
        hint: 'No reliable information yet.'
    },
    reported: {
        id: 'reported',
        label: 'Reported',
        hint: 'Heard from a book, teacher, or other source — not personally verified.'
    },
    observed: {
        id: 'observed',
        label: 'Observed',
        hint: 'Encountered during refinement. One run does not reveal every intrinsic trait.'
    },
    established: {
        id: 'established',
        label: 'Established',
        hint: 'Supported by enough experience or (in this lab) full definition access.'
    }
};

const TERM_GLOSSARY = {
    spirit: 'Spiritual energy carried by the material. Heat may release, leave bound, or degrade it.',
    yin: 'Cool / receptive charge. Can clash with strong yang under heat.',
    yang: 'Hot / assertive charge. Amplifies catalytic heat pressure.',
    volatility: 'How readily heat agitates the material. High values raise instability risk.',
    stability: 'How much the material dampens mixture shocks.',
    impurity: 'Contaminant load. High impurity can leave a product impure even if the process completes.',
    qi: 'Medicinal affinity toward qi recovery / cultivation support.',
    heat: 'Medicinal affinity toward heat / yang warming effects.',
    marrow: 'Medicinal affinity toward body / marrow tempering.',
    purify: 'Cleansing affinity that can scrub impurities from a mixture.',
    toxicity: 'Hazard lean. High toxicity can make a product hazardous.',
    activation: 'Approximate heat where this material begins releasing spirit.',
    tolerance: 'Approximate heat beyond which released essence tends to degrade.',
    released: 'Spirit freed into the reactive mixture (available for condensation).',
    bound: 'Spirit still locked in the material — often needs more / different heat.',
    degraded: 'Spirit ruined by overheat or breakage — not available as medicine.'
};

const HEAT_BANDS = [
    { key: 'gentle', value: 0.35, label: 'gentle' },
    { key: 'medium', value: 0.65, label: 'medium' },
    { key: 'fierce', value: 0.95, label: 'fierce' }
];

function nearestHeatLabel(value) {
    let best = HEAT_BANDS[0];
    let bestDist = Math.abs(value - best.value);
    for (const band of HEAT_BANDS) {
        const dist = Math.abs(value - band.value);
        if (dist < bestDist) {
            best = band;
            bestDist = dist;
        }
    }
    return best.label;
}

function heatRelationText(threshold, kind) {
    const label = nearestHeatLabel(threshold);
    if (kind === 'activation') {
        if (threshold <= 0.4) return `Begins releasing around ${label} heat or softer.`;
        if (threshold <= 0.7) return `Needs about ${label} heat before much spirit releases.`;
        return `Stubborn — release mainly near ${label} heat.`;
    }
    if (threshold <= 0.45) return `Fragile — essence degrades near ${label} heat.`;
    if (threshold <= 0.8) return `Tolerates up to about ${label} heat before overburn.`;
    return `Hardy — degrades mainly at ${label} heat.`;
}

function round1(n) {
    return Math.round(Number(n) * 10) / 10;
}

function num(n, fallback = 0) {
    const v = Number(n);
    return Number.isFinite(v) ? v : fallback;
}

/**
 * Dev-lab ingredient card built from reagent defs + derived thermal profile.
 * knowledgeState is always `established` here — structure is ready for future gating.
 * @param {string} reagentId
 * @param {{ knowledgeMode?: 'lab' }} [opts]
 */
function describeReagent(reagentId, opts = {}) {
    const def = EXPERIMENTAL_REAGENTS[reagentId];
    if (!def) {
        return {
            id: reagentId,
            name: reagentId,
            note: 'Unknown reagent id.',
            knowledgeMode: opts.knowledgeMode || 'lab',
            properties: []
        };
    }
    const profile = deriveThermalProfile(def);
    const sep = deriveSeparationProfile(def);
    const knowledgeState = 'established';
    const aff = def.affinities || {};

    /** @type {{ key: string, label: string, display: string, detail: string, knowledgeState: string, glossary?: string }[]} */
    const properties = [
        {
            key: 'spirit',
            label: 'Spirit content',
            display: String(def.spirit),
            detail: `Per unit. ${TERM_GLOSSARY.spirit}`,
            knowledgeState,
            glossary: TERM_GLOSSARY.spirit
        },
        {
            key: 'yin_yang',
            label: 'Yin / yang',
            display: `${def.yin} / ${def.yang}`,
            detail: `${TERM_GLOSSARY.yin} ${TERM_GLOSSARY.yang}`,
            knowledgeState
        },
        {
            key: 'volatility',
            label: 'Volatility',
            display: String(def.volatility),
            detail: TERM_GLOSSARY.volatility,
            knowledgeState,
            glossary: TERM_GLOSSARY.volatility
        },
        {
            key: 'stability',
            label: 'Stability',
            display: String(def.stability),
            detail: TERM_GLOSSARY.stability,
            knowledgeState,
            glossary: TERM_GLOSSARY.stability
        },
        {
            key: 'impurity',
            label: 'Impurity',
            display: String(def.impurity),
            detail: TERM_GLOSSARY.impurity,
            knowledgeState,
            glossary: TERM_GLOSSARY.impurity
        },
        {
            key: 'affinities',
            label: 'Affinities (qi / heat / marrow / purify / toxicity)',
            display: `${aff.qi ?? 0} / ${aff.heat ?? 0} / ${aff.marrow ?? 0} / ${aff.purify ?? 0} / ${aff.toxicity ?? 0}`,
            detail: 'Medicinal and hazard leanings used by condensation.',
            knowledgeState
        },
        {
            key: 'activation',
            label: 'Heat activation (derived)',
            display: `${profile.activationThreshold} (~${nearestHeatLabel(profile.activationThreshold)})`,
            detail: heatRelationText(profile.activationThreshold, 'activation'),
            knowledgeState,
            glossary: TERM_GLOSSARY.activation
        },
        {
            key: 'tolerance',
            label: 'Heat tolerance (derived)',
            display: `${profile.toleranceMax} (~${nearestHeatLabel(profile.toleranceMax)})`,
            detail: heatRelationText(profile.toleranceMax, 'tolerance'),
            knowledgeState,
            glossary: TERM_GLOSSARY.tolerance
        },
        {
            key: 'separation',
            label: 'Separation difficulty (derived)',
            display: String(sep.difficulty),
            detail: 'Higher values resist passive cauldron separation; stuck fraction sets a contamination floor.',
            knowledgeState
        }
    ];

    return {
        id: def.id,
        name: def.name,
        note: def.note || '',
        knowledgeMode: opts.knowledgeMode || 'lab',
        knowledgeStates: KNOWLEDGE_STATES,
        properties
    };
}

/**
 * Proportional spirit distribution for visualisation.
 * @param {object} material
 */
function formatSpiritBreakdown(material) {
    const released = num(material?.released?.spirit);
    const bound = num(material?.bound?.spirit);
    const degraded = num(material?.degraded?.spirit);
    const input = material?.conservation?.inputSpirit != null
        ? num(material.conservation.inputSpirit)
        : round1(released + bound + degraded);
    const partsSum = released + bound + degraded;
    const denom = partsSum > 0 ? partsSum : (input > 0 ? input : 1);
    const pct = (v) => Math.round((v / denom) * 1000) / 10;
    return {
        input,
        released,
        bound,
        degraded,
        residual: num(material?.residual?.spirit),
        percentages: {
            released: partsSum === 0 && input === 0 ? 0 : pct(released),
            bound: partsSum === 0 && input === 0 ? 0 : pct(bound),
            degraded: partsSum === 0 && input === 0 ? 0 : pct(degraded)
        },
        empty: partsSum === 0 && input === 0
    };
}

function processPlainLabel(outcome) {
    switch (outcome) {
        case 'refined':
            return 'The process completed under control.';
        case 'unstable_salvage':
            return 'The process stayed only barely stable — you salvaged what you could.';
        case 'failed':
            return 'Instability ruined the condensation; the process failed.';
        case 'rupture':
            return 'The mixture ruptured under extreme instability.';
        default:
            return `Process outcome: ${outcome || 'unknown'}.`;
    }
}

function productPlainLines(result) {
    const product = result.product || {};
    const potency = num(product.potency);
    const suitability = product.suitability || 'n/a';
    const lines = [];
    const purity = num(product.purity);
    if (potency <= 0 || suitability === 'weak') {
        lines.push('Product: little or no usable medicinal potency formed.');
    } else if (suitability === 'impure') {
        lines.push(`Product: potency ${potency}, but mixture contamination left purity at ${purity}%.`);
    } else if (suitability === 'hazardous') {
        lines.push(`Product: potency ${potency}, but toxicity makes it hazardous.`);
    } else if (suitability === 'medicinal') {
        lines.push(`Product: medicinal (potency ${potency}, purity ${purity}%, dominant ${product.dominantAffinity}).`);
    } else {
        lines.push(`Product: suitability ${suitability}, potency ${potency}.`);
    }
    return lines;
}

function materialPlainLines(result) {
    const m = result.material;
    if (!m) return [];
    const released = num(m.released?.spirit);
    const bound = num(m.bound?.spirit);
    const degraded = num(m.degraded?.spirit);
    const input = num(m.conservation?.inputSpirit, released + bound + degraded);
    const lines = [];
    const traceKinds = new Set((result.trace || []).map(ev => ev.kind));

    if (degraded > 0 && degraded + 0.05 >= Math.max(released, bound) && degraded >= input * 0.45) {
        lines.push(`Excessive heat (or breakage) degraded ${degraded} spirit — medicinal essence was lost.`);
    } else if (degraded > 0.05) {
        lines.push(`${degraded} spirit degraded (overburn / broken affinities).`);
    }

    if (bound > 0 && released <= 0.05 && degraded <= 0.05) {
        lines.push(`Insufficient heat left ${bound} spirit still bound — almost nothing extracted.`);
    } else if (bound > released && bound > 0.05) {
        lines.push(`Much of the spirit remains bound (${bound}); only ${released} released.`);
    } else if (released > 0.05) {
        lines.push(`Extraction released ${released} spirit into the reactive mixture.`);
    }

    const contamination = num(result.mixture?.contamination ?? m.released?.impurity);
    const expelled = num(m.expelled?.contamination ?? m.expelled?.impurity);
    const purity = result.product?.purity ?? result.mixture?.purityPercent;
    if (contamination > 0.05) {
        lines.push(`Contamination in mixture: ${round1(contamination)} (purity ${purity != null ? purity + '%' : 'n/a'}).`);
    }
    if (expelled > 0.05) {
        lines.push(`Cauldron expelled ${expelled} contamination as waste (no extra essence created).`);
    }
    const stuck = num(m.separationStuck);
    if (stuck > 0.05 && contamination > stuck - 0.1) {
        lines.push(
            `Basic cauldron stuck floor ~${round1(stuck)} — remaining contamination is intentional equipment limit (not degraded spirit).`
        );
    }
    if (degraded > 0.05 && released > 0.05) {
        lines.push('Degraded spirit is lost medicinal potential — it is not the same as mixture contamination.');
    }

    if (traceKinds.has('introduction_shock') || traceKinds.has('destabilisation')) {
        lines.push('Incompatible interactions or shocks contributed to instability (see trace).');
    }

    if (released <= 0.05 && bound <= 0.05 && degraded <= 0.05 && input <= 0.05) {
        lines.push('No measurable spirit moved — empty or zero-input run.');
    }

    return lines;
}

/**
 * Concise plain-language summary. Distinguishes process completion from product success.
 * @param {object} result
 */
function summarizeRefinement(result) {
    const proc = result.process?.outcome || result.outcome;
    const processSuccess = !!(result.process?.success ?? result.success);
    const potency = num(result.product?.potency);
    const suitability = result.product?.suitability;
    const productUseful = potency > 0 && suitability === 'medicinal';

    let headline;
    if (proc === 'rupture' || proc === 'failed') {
        headline = 'Process failed — mixture damaged before a reliable product could form.';
    } else if (processSuccess && productUseful) {
        headline = 'Process held, and a usable medicinal product formed.';
    } else if (processSuccess && (potency <= 0 || suitability === 'weak')) {
        headline = 'Process completed, but no usable medicinal product formed.';
    } else if (processSuccess && suitability === 'impure') {
        headline = 'Process completed, but the product is impure.';
    } else if (processSuccess && suitability === 'hazardous') {
        headline = 'Process completed, but the product is hazardous.';
    } else {
        headline = 'Refinement finished with mixed results — inspect process vs product below.';
    }

    return {
        headline,
        processLine: processPlainLabel(proc),
        processOutcome: proc,
        processSuccess,
        productUseful,
        productLines: productPlainLines(result),
        materialLines: materialPlainLines(result),
        note: 'Process completion is not the same as a useful product.'
    };
}

/**
 * @param {object} result — simulateRefinement output (with trace)
 * @returns {string[]}
 */
function explainExperiment(result) {
    const lines = [];
    const summary = summarizeRefinement(result);
    lines.push(summary.headline);
    lines.push(summary.processLine);
    summary.materialLines.forEach(l => lines.push(l));
    summary.productLines.forEach(l => lines.push(l));

    if (result.material) {
        const m = result.material;
        lines.push(
            `Material ledger — released ${m.released?.spirit ?? 0}, `
            + `bound ${m.bound?.spirit ?? 0}, `
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
        { label: 'Released (reactive)', spirit: material.released?.spirit ?? 0, note: 'Medicinal essence in mixture' },
        { label: 'Contamination (in mixture)', spirit: material.released?.impurity ?? 0, note: 'Unwanted residue with released essence' },
        { label: 'Expelled waste', spirit: material.expelled?.contamination ?? material.expelled?.impurity ?? 0, note: 'Separated out — not medicinal' },
        ...(material.separationStuck != null
            ? [{
                label: 'Separation stuck floor',
                spirit: material.separationStuck,
                note: 'Contamination the basic cauldron cannot strip'
            }]
            : []),
        { label: 'Still bound', spirit: material.bound?.spirit ?? 0, note: 'Unextracted — may respond to later heat' },
        { label: 'Degraded', spirit: material.degraded?.spirit ?? 0, note: 'Destroyed medicinal potential (≠ contamination)' },
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
function formatSimDuration(value) {
    if (value == null || !Number.isFinite(Number(value))) return '—';
    return (Math.round(Number(value) * 10) / 10).toFixed(1);
}

function countIntroductionEvents(input) {
    const actions = input?.procedure?.actions;
    if (Array.isArray(actions) && actions.length) {
        return actions.filter(a => a.kind === 'introduce').length;
    }
    if (Array.isArray(input?.procedure?.introduced) && input.procedure.introduced.length) {
        return input.procedure.introduced.length;
    }
    if (Array.isArray(input?.reagents) && input.reagents.length) {
        return input.reagents.length;
    }
  return (input?.procedure?.chronicle || []).filter(e => e.kind === 'introduce').length;
}

function formatProcedureChronicle(procedure) {
    if (!procedure) return '';
    const lines = (procedure.chronicle || []).map(entry =>
        `${entry.timeLabel || formatSimDuration(entry.time)} — ${entry.message}`
    );
    if (procedure.duration != null) {
        lines.push(`Duration: ${formatSimDuration(procedure.duration)} sim units`);
    }
    return lines.join('\n');
}

function furnaceProcedureSummary(input) {
    const ch = input?.procedure?.chronicle || [];
    const heats = ch.filter(e => e.kind === 'heat_set').map(e => e.data?.heat || '?');
    const fromActions = input?.procedure?.actions
        ?.filter(a => a.kind === 'heat_set')
        .map(a => a.heat);
    const intro = countIntroductionEvents(input);
    const qty = (input?.reagents || []).reduce((s, r) => s + (r.qty || 0), 0);
    const qtyNote = qty > intro ? ` · ${qty} units` : '';
    return `furnace · ${intro} intro(s)${qtyNote} · flame ${(heats.length ? heats : fromActions || []).join('→') || '—'}`;
}

function compareExperiments(a, b) {
    const fields = [
        ['Mode', x => x.input.mode === 'furnace' ? furnaceProcedureSummary(x.input) : 'instant (legacy)'],
        ['Duration', x => (x.input.mode === 'furnace'
            ? formatSimDuration(x.input.duration ?? x.input.procedure?.duration)
            : '—')],
        ['Heat', x => x.input.heatStages?.join(' → ') || x.input.heat || '—'],
        ['Introduction order', x => x.input.introductionOrder || (x.input.mode === 'furnace' ? 'manual' : 'simultaneous')],
        ['Process outcome', x => x.result.process?.outcome || x.result.outcome],
        ['Peak instability', x => x.result.peakInstability],
        ['Released spirit', x => x.result.material?.released?.spirit],
        ['Bound spirit', x => x.result.material?.bound?.spirit],
        ['Degraded spirit', x => x.result.material?.degraded?.spirit],
        ['Potency', x => x.result.product?.potency],
        ['Purity %', x => x.result.product?.purity],
        ['Contamination', x => x.result.mixture?.contamination ?? x.result.material?.released?.impurity],
        ['Expelled waste', x => x.result.material?.expelled?.contamination],
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

function reagentSignature(input) {
    return (input?.reagents || [])
        .map(r => `${r.qty}×${r.reagentId}`)
        .sort()
        .join(',');
}

function heatSignature(input) {
    return input?.heatStages?.join('→') || input?.heat || '';
}

/**
 * Plain-language magnitude notes for an A/B comparison.
 * Does not declare overall superiority.
 * @param {object} a
 * @param {object} b
 * @returns {string[]}
 */
function interpretComparison(a, b) {
    const lines = [];
    const rows = compareExperiments(a, b);
    const heatA = heatSignature(a.input);
    const heatB = heatSignature(b.input);
    const reagentsDiffer = reagentSignature(a.input) !== reagentSignature(b.input);
    const orderDiffer = a.input?.mode !== 'furnace' && (a.input?.introductionOrder || 'simultaneous')
        !== (b.input?.introductionOrder || 'simultaneous');
    const procDiffer = a.input?.mode === 'furnace' && b.input?.mode === 'furnace'
        && formatProcedureChronicle(a.input.procedure) !== formatProcedureChronicle(b.input.procedure);
    const heatDiffer = heatA !== heatB;
    const inputDiffCount = [heatDiffer, reagentsDiffer, orderDiffer, procDiffer].filter(Boolean).length;

    if (inputDiffCount > 1) {
        lines.push('Several inputs differ between these runs — treat differences as correlated, not proven single-cause.');
    } else if (heatDiffer && !reagentsDiffer && !orderDiffer) {
        lines.push(`Same ingredients; heat differs (${heatA || '—'} vs ${heatB || '—'}).`);
    } else if (reagentsDiffer && !heatDiffer && !orderDiffer) {
        lines.push('Ingredient lists differ; heat and introduction order match.');
    } else if (orderDiffer && !heatDiffer && !reagentsDiffer) {
        lines.push('Only introduction order differs.');
    } else if (procDiffer && !reagentsDiffer) {
        lines.push('Furnace procedure (timing / flame / introductions) differs between runs.');
    }

    function pushNumericDelta(label, noun) {
        const row = rows.find(r => r.label === label);
        if (!row || !row.different) return;
        if (!Number.isFinite(Number(row.a)) || !Number.isFinite(Number(row.b))) {
            lines.push(`${label}: ${row.a} → ${row.b}.`);
            return;
        }
        const av = num(row.a);
        const bv = num(row.b);
        const d = round1(bv - av);
        const abs = Math.abs(d);
        if (abs < 0.05) return;
        if (d > 0) lines.push(`B shows ${abs} more ${noun} than A (${av} → ${bv}).`);
        else lines.push(`B shows ${abs} less ${noun} than A (${av} → ${bv}).`);
    }

    pushNumericDelta('Released spirit', 'released spirit');
    pushNumericDelta('Bound spirit', 'bound spirit');
    pushNumericDelta('Degraded spirit', 'degraded spirit');
    pushNumericDelta('Potency', 'potency');

    const peak = rows.find(r => r.label === 'Peak instability');
    if (peak?.different) {
        lines.push(`Peak instability changed from ${peak.a} to ${peak.b}.`);
    }

    const proc = rows.find(r => r.label === 'Process outcome');
    if (proc?.different) lines.push(`Process outcome: ${proc.a} vs ${proc.b}.`);
    const suit = rows.find(r => r.label === 'Suitability');
    if (suit?.different) lines.push(`Product suitability: ${suit.a} vs ${suit.b}.`);
    const dom = rows.find(r => r.label === 'Dominant affinity');
    if (dom?.different) lines.push(`Dominant affinity: ${dom.a} vs ${dom.b}.`);

    const meaningful = lines.some(l =>
        /released|bound|degraded|potency|instability|Process|suitability|affinity/i.test(l)
    );
    if (!meaningful) {
        if (rows.every(r => !r.different)) lines.push('No listed fields differ between these runs.');
        else lines.push('Inputs or categorical fields differ; numeric spirit/product deltas are small or absent.');
    }

    lines.push('No automatic “better run” ranking — usefulness depends on your goal.');
    return lines;
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
    KNOWLEDGE_STATES,
    TERM_GLOSSARY,
    describeReagent,
    summarizeRefinement,
    formatSpiritBreakdown,
    interpretComparison,
    explainExperiment,
    formatMaterialLedger,
    compareExperiments,
    formatProcedureChronicle,
    formatSimDuration,
    countIntroductionEvents,
    LAB_PRESETS
};
