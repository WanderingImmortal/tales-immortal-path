/**
 * Phase 1 body silhouette — generate sil-* part path `d` strings.
 * Run: node scripts/build-body-silhouette-parts.js
 */
'use strict';

const CX = 104;

/** Capsule / stadium from point A→B with half-width r. */
function capsule(x1, y1, x2, y2, r) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy * r;
    const py = ux * r;
    const sx1 = +(x1 + px).toFixed(2);
    const sy1 = +(y1 + py).toFixed(2);
    const sx2 = +(x2 + px).toFixed(2);
    const sy2 = +(y2 + py).toFixed(2);
    const sx3 = +(x2 - px).toFixed(2);
    const sy3 = +(y2 - py).toFixed(2);
    const sx4 = +(x1 - px).toFixed(2);
    const sy4 = +(y1 - py).toFixed(2);
    const rr = +r.toFixed(2);
    return `M ${sx1},${sy1} L ${sx2},${sy2} A ${rr},${rr} 0 0 1 ${sx3},${sy3} L ${sx4},${sy4} A ${rr},${rr} 0 0 1 ${sx1},${sy1} Z`;
}

function ellipse(cx, cy, rx, ry) {
    const kx = rx * 0.5523;
    const ky = ry * 0.5523;
    return (
        `M ${+(cx).toFixed(2)},${+(cy - ry).toFixed(2)} ` +
        `C ${+(cx + kx).toFixed(2)},${+(cy - ry).toFixed(2)} ${+(cx + rx).toFixed(2)},${+(cy - ky).toFixed(2)} ${+(cx + rx).toFixed(2)},${+(cy).toFixed(2)} ` +
        `C ${+(cx + rx).toFixed(2)},${+(cy + ky).toFixed(2)} ${+(cx + kx).toFixed(2)},${+(cy + ry).toFixed(2)} ${+(cx).toFixed(2)},${+(cy + ry).toFixed(2)} ` +
        `C ${+(cx - kx).toFixed(2)},${+(cy + ry).toFixed(2)} ${+(cx - rx).toFixed(2)},${+(cy + ky).toFixed(2)} ${+(cx - rx).toFixed(2)},${+(cy).toFixed(2)} ` +
        `C ${+(cx - rx).toFixed(2)},${+(cy - ky).toFixed(2)} ${+(cx - kx).toFixed(2)},${+(cy - ry).toFixed(2)} ${+(cx).toFixed(2)},${+(cy - ry).toFixed(2)} Z`
    );
}

const parts = {};

parts['sil-head'] = ellipse(CX, 12.5, 11.2, 12.2);

parts['sil-neck'] =
    `M ${CX - 5.2},23 L ${CX + 5.2},23 L ${CX + 6.4},36 L ${CX - 6.4},36 Z`;

// Torso — crotch notch at centreX 104
parts['sil-torso'] =
    `M ${CX},36 ` +
    `C 118,36 128,38 130,44 ` +
    `C 132,52 131,62 128,72 ` +
    `C 124,84 120,92 118,100 ` +
    `C 116,108 112,112 ${CX},112 ` +
    `C 96,112 92,108 90,100 ` +
    `C 88,92 84,84 80,72 ` +
    `C 77,62 76,52 78,44 ` +
    `C 80,38 90,36 ${CX},36 Z`;

// Slightly open arms (~10°), wider limbs
parts['sil-upper-arm-l'] = capsule(76, 44, 66, 76, 6.8);
parts['sil-forearm-l'] = capsule(66, 76, 58, 104, 5.6);
parts['sil-hand-l'] = ellipse(55, 116, 7.2, 10.5);

parts['sil-upper-arm-r'] = capsule(132, 44, 142, 76, 6.8);
parts['sil-forearm-r'] = capsule(142, 76, 150, 104, 5.6);
parts['sil-hand-r'] = ellipse(153, 116, 7.2, 10.5);

parts['sil-thigh-l'] = capsule(93, 112, 90, 151, 9.2);
parts['sil-shin-l'] = capsule(90, 151, 92, 190, 7.4);
parts['sil-foot-l'] = ellipse(90, 200, 9.5, 5.8);

parts['sil-thigh-r'] = capsule(115, 112, 118, 151, 9.2);
parts['sil-shin-r'] = capsule(118, 151, 116, 190, 7.4);
parts['sil-foot-r'] = ellipse(118, 200, 9.5, 5.8);

const ORDER = [
    'sil-head', 'sil-neck', 'sil-torso',
    'sil-upper-arm-l', 'sil-upper-arm-r',
    'sil-forearm-l', 'sil-forearm-r',
    'sil-hand-l', 'sil-hand-r',
    'sil-thigh-l', 'sil-thigh-r',
    'sil-shin-l', 'sil-shin-r',
    'sil-foot-l', 'sil-foot-r'
];

const REGION_PARTS = {
    head: ['sil-head'],
    spine: ['sil-neck', 'sil-torso'], // visual fill via torso; hit is spine rect
    ribs: ['sil-torso'],
    'arm-l': ['sil-upper-arm-l', 'sil-forearm-l'],
    'arm-r': ['sil-upper-arm-r', 'sil-forearm-r'],
    'hand-l': ['sil-hand-l'],
    'hand-r': ['sil-hand-r'],
    'leg-l': ['sil-thigh-l', 'sil-shin-l'],
    'leg-r': ['sil-thigh-r', 'sil-shin-r'],
    'foot-l': ['sil-foot-l'],
    'foot-r': ['sil-foot-r']
};

module.exports = { parts, ORDER, REGION_PARTS, CX };

if (require.main === module) {
    const html = ORDER.map(id => `                            <path id="${id}" d="${parts[id]}"/>`).join('\n');
    console.log(html);
}
