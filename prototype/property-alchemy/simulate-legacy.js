/**
 * Pre–thermal-activation simulation (PR #191 baseline) for before/after comparison only.
 */
const legacy = require('./simulate-legacy-snapshot');
module.exports = {
    simulateRefinement: legacy.simulateRefinement,
    HEAT_VALUES: legacy.HEAT_VALUES,
    OUTCOME: legacy.OUTCOME
};
