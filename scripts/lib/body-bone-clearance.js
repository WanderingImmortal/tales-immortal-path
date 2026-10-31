'use strict';

/** Stroke width (SVG units) at "complete" fill — see style.css .body-sil-bone.complete */
const COMPLETE_WEIGHT = { heavy: 1.05, bone: 0.8, plate: 0.5, tick: 0.55, fine: 0.4, marrow: 0.6 };
const GLOW_MARGIN = 0.25;

/** Minimum depth inside shell/patch union so the lit stroke (not just the centreline) stays inside. */
function requiredClearance(kind) {
    const w = (COMPLETE_WEIGHT[kind] ?? 0.8) * 2.2;
    return +(w / 2 + GLOW_MARGIN).toFixed(2);
}

module.exports = { requiredClearance, COMPLETE_WEIGHT };
