'use strict';

/**
 * Minimum signed clearance (game units) a traced bone chunk must keep from the #sil-shell edge.
 * Negative = allowed spill: the bones overlay is masked to the shell, so a sliver outside is clipped,
 * but a larger spill means the skeleton art and shell have drifted apart and the trace needs re-fitting.
 */
const REQUIRED_CLEARANCE = { art: -1.0, marrow: 0.4 };

function requiredClearance(kind) {
    return REQUIRED_CLEARANCE[kind] ?? 0;
}

module.exports = { requiredClearance };
