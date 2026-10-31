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

/** Tapered limb: rounded capsule with width r1 at start, r2 at end. */
function taperedLimb(x1, y1, x2, y2, r1, r2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const px = -uy;
    const py = ux;
    const p = (a, b, r) => [+(a + px * r).toFixed(2), +(b + py * r).toFixed(2)];
    const [ox1, oy1] = p(x1, y1, r1);
    const [ox2, oy2] = p(x2, y2, r2);
    const [ix1, iy1] = p(x1, y1, -r1);
    const [ix2, iy2] = p(x2, y2, -r2);
    return `M ${ox1},${oy1} L ${ox2},${oy2} A ${r2},${r2} 0 0 1 ${ix2},${iy2} L ${ix1},${iy1} A ${r1},${r1} 0 0 1 ${ox1},${oy1} Z`;
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

parts['sil-head'] = ellipse(CX, 12.8, 10.8, 12.4);

parts['sil-neck'] =
    `M ${CX - 4.8},23.2 L ${CX + 4.8},23.2 L ${CX + 5.6},35 L ${CX - 5.6},35 Z`;

parts['sil-spine'] =
    `M ${CX - 3.5},28 L ${CX + 3.5},28 L ${CX + 3.5},108 L ${CX - 3.5},108 Z`;

// Torso — crotch notch at centreX 104
parts['sil-torso'] =
    `M ${CX},36 ` +
    `C 117,36 127,37.5 129.5,43 ` +
    `C 131.5,50 131,60 128.5,70 ` +
    `C 125,82 121,91 118.5,98 ` +
    `C 116,106 111,111 ${CX},111.5 ` +
    `C 97,111 92,106 89.5,98 ` +
    `C 87,91 83,82 79.5,70 ` +
    `C 77,60 76.5,50 78.5,43 ` +
    `C 81,37.5 91,36 ${CX},36 Z`;

// Authored v2 — tapered limbs, mitten hands, foot blocks (~10° arm gap)
parts['sil-upper-arm-l'] = taperedLimb(79, 44, 67, 76, 7.2, 5.8);
parts['sil-forearm-l'] = taperedLimb(67, 76, 59, 103, 5.6, 4.6);
parts['sil-hand-l'] =
    'M 61.5,102.5 L 57.5,104 C 51,106.5 47,111 47,117.5 C 47,123.5 50,127.5 54.5,128.5 ' +
    'L 58.5,127.5 C 62,126.5 63.5,123 62.5,119 L 60.5,108 C 59.5,105 57,103.5 54.5,104.5 ' +
    'L 52,106.5 C 50.5,105.5 50.5,103 52.5,102 L 57,100 C 59.5,99.5 61.5,100.5 61.5,102.5 Z';

parts['sil-upper-arm-r'] = taperedLimb(129, 44, 141, 76, 7.2, 5.8);
parts['sil-forearm-r'] = taperedLimb(141, 76, 149, 103, 5.6, 4.6);
parts['sil-hand-r'] =
    'M 146.5,102.5 L 150.5,104 C 157,106.5 161,111 161,117.5 C 161,123.5 158,127.5 153.5,128.5 ' +
    'L 149.5,127.5 C 146,126.5 144.5,123 145.5,119 L 147.5,108 C 148.5,105 151,103.5 153.5,104.5 ' +
    'L 156,106.5 C 157.5,105.5 157.5,103 155.5,102 L 151,100 C 148.5,99.5 146.5,100.5 146.5,102.5 Z';

parts['sil-thigh-l'] = taperedLimb(94, 112.5, 91, 151, 10, 7.8);
parts['sil-shin-l'] = taperedLimb(91, 151, 92.5, 189, 7.2, 5.4);
parts['sil-foot-l'] =
    'M 85.5,190.5 L 94.5,189 C 98.5,191 100.5,195 99.5,200 L 94,204.5 L 84.5,203.5 ' +
    'C 80.5,201.5 80,196 83,192.5 Z';

parts['sil-thigh-r'] = taperedLimb(114, 112.5, 117, 151, 10, 7.8);
parts['sil-shin-r'] = taperedLimb(117, 151, 115.5, 189, 7.2, 5.4);
parts['sil-foot-r'] =
    'M 122.5,190.5 L 113.5,189 C 109.5,191 107.5,195 108.5,200 L 114,204.5 L 123.5,203.5 ' +
    'C 127.5,201.5 128,196 125,192.5 Z';

/** Overlap discs at limb joins — hide capsule seams (playtest polish). Not separate hover regions. */
const PATCH_IDS = [
    'sil-patch-shoulder-l', 'sil-patch-shoulder-r',
    'sil-patch-elbow-l', 'sil-patch-elbow-r',
    'sil-patch-wrist-l', 'sil-patch-wrist-r',
    'sil-patch-hip-l', 'sil-patch-hip-r',
    'sil-patch-knee-l', 'sil-patch-knee-r',
    'sil-patch-ankle-l', 'sil-patch-ankle-r',
    'sil-patch-pelvis'
];
parts['sil-patch-shoulder-l'] = ellipse(81, 44, 6, 4.8);
parts['sil-patch-shoulder-r'] = ellipse(127, 44, 6, 4.8);
parts['sil-patch-elbow-l'] = ellipse(67, 76, 6, 5.8);
parts['sil-patch-elbow-r'] = ellipse(141, 76, 6, 5.8);
parts['sil-patch-wrist-l'] = ellipse(59.5, 103, 5.5, 5);
parts['sil-patch-wrist-r'] = ellipse(148.5, 103, 5.5, 5);
parts['sil-patch-hip-l'] = ellipse(93, 112, 8, 5);
parts['sil-patch-hip-r'] = ellipse(115, 112, 8, 5);
parts['sil-patch-knee-l'] = ellipse(91.5, 151, 7, 6);
parts['sil-patch-knee-r'] = ellipse(116.5, 151, 7, 6);
parts['sil-patch-ankle-l'] = ellipse(92.5, 189.5, 6.5, 5);
parts['sil-patch-ankle-r'] = ellipse(115.5, 189.5, 6.5, 5);
parts['sil-patch-pelvis'] = ellipse(CX, 111, 10.5, 4.8);

const ORDER = [
    'sil-head', 'sil-neck', 'sil-spine', 'sil-torso',
    'sil-upper-arm-l', 'sil-upper-arm-r',
    'sil-forearm-l', 'sil-forearm-r',
    'sil-hand-l', 'sil-hand-r',
    'sil-thigh-l', 'sil-thigh-r',
    'sil-shin-l', 'sil-shin-r',
    'sil-foot-l', 'sil-foot-r',
    ...PATCH_IDS
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

module.exports = { parts, ORDER, REGION_PARTS, PATCH_IDS, CX };

if (require.main === module) {
    const html = ORDER.map(id => `                            <path id="${id}" d="${parts[id]}"/>`).join('\n');
    console.log(html);
}
