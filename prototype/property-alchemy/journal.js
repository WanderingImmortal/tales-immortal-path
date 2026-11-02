/**
 * Lightweight recipe journal for property-alchemy experiments (prototype).
 * Separates objective reagent defs from player-discovered observations.
 */

const { EXPERIMENTAL_REAGENTS } = require('./reagents');

/**
 * @returns {object}
 */
function createAlchemyJournal() {
    return {
        version: 1,
        entries: [],
        savedFormulas: [],
        /** @type {Record<string, { observedProperties: string[], confidence: number }>} */
        discovered: {}
    };
}

/**
 * @param {object} journal
 * @param {import('./simulate').RefinementInput} input
 * @param {ReturnType<import('./simulate')['simulateRefinement']>} result
 * @param {{ notes?: string, label?: string }} [meta]
 */
function recordExperiment(journal, input, result, meta = {}) {
    const entry = {
        id: `exp_${journal.entries.length + 1}`,
        at: new Date().toISOString(),
        label: meta.label || null,
        notes: meta.notes || '',
        reagents: input.reagents.map(r => ({ ...r })),
        conditions: {
            heat: input.heat,
            introductionOrder: input.introductionOrder || 'simultaneous',
            seed: input.seed ?? 0
        },
        reactions: {
            phaseLog: result.phaseLog,
            peakInstability: result.peakInstability,
            observations: result.observations
        },
        product: {
            effects: result.product.effects,
            dominantAffinity: result.product.dominantAffinity,
            potency: result.product.potency,
            grade: result.product.grade
        },
        outcome: result.outcome,
        success: result.success,
        diagnostics: result.diagnostics
    };
    journal.entries.push(entry);

    input.reagents.forEach(({ reagentId }) => {
        mergeDiscovery(journal, reagentId, result);
    });

    return entry;
}

/**
 * @param {object} journal
 * @param {string} reagentId
 * @param {object} result
 */
function mergeDiscovery(journal, reagentId, result) {
    const def = EXPERIMENTAL_REAGENTS[reagentId];
    if (!def) return;

    if (!journal.discovered[reagentId]) {
        journal.discovered[reagentId] = { observedProperties: [], confidence: 0 };
    }
    const slot = journal.discovered[reagentId];
    const hints = inferReagentHints(reagentId, result);
    hints.forEach(h => {
        if (!slot.observedProperties.includes(h)) slot.observedProperties.push(h);
    });
    slot.confidence = Math.min(1, slot.confidence + (result.success ? 0.12 : 0.08));
}

/**
 * Player-facing hints — not full stat sheet.
 * @param {string} reagentId
 * @param {object} result
 */
function inferReagentHints(reagentId, result) {
    const def = EXPERIMENTAL_REAGENTS[reagentId];
    const hints = [];
    if (def.volatility >= 15) hints.push('high_volatility');
    if (def.stability >= 14) hints.push('stabilising');
    if (def.affinities.purify >= 15) hints.push('purifying');
    if (def.yin > def.yang * 1.5) hints.push('yin_leaning');
    if (def.yang > def.yin * 1.5) hints.push('yang_leaning');
    if (def.impurity >= 20) hints.push('heavy_impurity');

    if (result.diagnostics.suggestedAdjustments.some(s => s.includes('heat'))) {
        hints.push('heat_sensitive_in_mix');
    }
    return hints;
}

/**
 * @param {object} journal
 * @param {string} entryId
 * @param {string} name
 * @param {string} [notes]
 */
function saveFormulaFromEntry(journal, entryId, name, notes = '') {
    const entry = journal.entries.find(e => e.id === entryId);
    if (!entry) throw new Error(`Unknown journal entry: ${entryId}`);

    const formula = {
        id: `formula_${journal.savedFormulas.length + 1}`,
        name,
        notes,
        sourceEntryId: entryId,
        reagents: entry.reagents.map(r => ({ ...r })),
        conditions: { ...entry.conditions },
        expectedDominant: entry.product.dominantAffinity,
        recordedPotency: entry.product.potency,
        recordedOutcome: entry.outcome
    };
    journal.savedFormulas.push(formula);
    return formula;
}

/**
 * Replay check: same inputs should match recorded run (deterministic).
 * @param {object} journal
 * @param {string} formulaId
 * @param {Function} simulateRefinement
 */
function verifyFormulaReproducible(journal, formulaId, simulateRefinement) {
    const formula = journal.savedFormulas.find(f => f.id === formulaId);
    if (!formula) throw new Error(`Unknown formula: ${formulaId}`);

    const replay = simulateRefinement({
        reagents: formula.reagents,
        heat: formula.conditions.heat,
        introductionOrder: formula.conditions.introductionOrder,
        seed: formula.conditions.seed
    });

    return {
        matchesOutcome: replay.outcome === formula.recordedOutcome,
        matchesDominant: replay.product.dominantAffinity === formula.expectedDominant,
        replay
    };
}

module.exports = {
    createAlchemyJournal,
    recordExperiment,
    saveFormulaFromEntry,
    verifyFormulaReproducible,
    inferReagentHints
};
