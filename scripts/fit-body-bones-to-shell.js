/**
 * Derive viewer-left arm + hand bone paths from the traced #sil-shell (scanline midlines),
 * so shafts and fingers stay inside the visible figure instead of hugging the outer edge.
 *
 * Run:   node scripts/fit-body-bones-to-shell.js          # print paths
 *        node scripts/fit-body-bones-to-shell.js --write  # patch body-chamber.js defs in place
 * Then:  node scripts/audit-body-overlay-fit.js
 *
 * Other bones (skull, scapula, legs, feet) are hand-authored literals in body-chamber.js and are
 * checked by the same audit against shell clearance.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { flattenPath, signedClearance } = require('./lib/body-fit-geometry');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const shell = flattenPath(html.match(/id="sil-shell"\s+d="([^"]+)"/)[1], 12);

function rowIntervals(y) {
    const xs = [];
    for (let i = 0; i < shell.length - 1; i++) {
        const [x1, y1] = shell[i], [x2, y2] = shell[i + 1];
        if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) xs.push(x1 + (y - y1) / (y2 - y1) * (x2 - x1));
    }
    xs.sort((a, b) => a - b);
    const out = [];
    for (let i = 0; i + 1 < xs.length; i += 2) out.push([xs[i], xs[i + 1]]);
    return out;
}

function colIntervals(x) {
    const ys = [];
    for (let i = 0; i < shell.length - 1; i++) {
        const [x1, y1] = shell[i], [x2, y2] = shell[i + 1];
        if ((x1 <= x && x2 > x) || (x2 <= x && x1 > x)) ys.push(y1 + (x - x1) / (x2 - x1) * (y2 - y1));
    }
    ys.sort((a, b) => a - b);
    const out = [];
    for (let i = 0; i + 1 < ys.length; i += 2) out.push([ys[i], ys[i + 1]]);
    return out;
}

/** Interval whose midpoint is closest to `near`. */
function pick(intervals, near) {
    let best = null;
    for (const iv of intervals) {
        const mid = (iv[0] + iv[1]) / 2;
        if (!best || Math.abs(mid - near) < Math.abs((best[0] + best[1]) / 2 - near)) best = iv;
    }
    return best;
}

const TIP_CLEARANCE = 0.72;
const ROUTE_CLEARANCE = 0.75;
// The trace is not perfectly symmetric and the right side is a mirror of the left, so check both.
const clearanceAt = p => Math.min(
    signedClearance(p[0], p[1], [shell]),
    signedClearance(208 - p[0], p[1], [shell])
);

const fmt = n => +n.toFixed(1);
const pt = ([x, y]) => `${fmt(x)},${fmt(y)}`;

/** Catmull-Rom through points -> cubic Bezier path. */
function smooth(points) {
    if (points.length < 3) return `M ${pt(points[0])} L ${pt(points[1])}`;
    let d = `M ${pt(points[0])}`;
    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)], p1 = points[i], p2 = points[i + 1], p3 = points[Math.min(points.length - 1, i + 2)];
        const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
        const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
        d += ` C ${pt(c1)} ${pt(c2)} ${pt(p2)}`;
    }
    return d;
}

function armMidline(y, near) {
    const iv = pick(rowIntervals(y), near);
    return [(iv[0] + iv[1]) / 2, y, iv[1] - iv[0]];
}

/** Walk a finger lane (mostly vertical) from a seed down to its tip; returns centreline points. */
function traceFinger(seed, yEnd) {
    const pts = [];
    let near = seed[0];
    for (let y = seed[1]; y <= yEnd; y += 0.5) {
        const lane = pick(rowIntervals(y).filter(iv => iv[1] - iv[0] < 4.5), near);
        if (!lane || Math.abs((lane[0] + lane[1]) / 2 - near) > 1.6) break;
        near = (lane[0] + lane[1]) / 2;
        pts.push([near, y]);
    }
    return pts;
}

function build() {
    const shoulder = [82, 45.5];
    const mid = [];
    for (const y of [62, 67, 72]) mid.push(armMidline(y, 78 - (y - 61) * 0.5));
    const elbow = armMidline(76, 72);
    const fore = [80, 85, 90, 94].map(y => armMidline(y, 70 - (y - 79) * 0.5));
    const wristC = armMidline(100, 60);
    const wrist = [wristC[0], 101.2];

    const humerus = smooth([
        [shoulder[0], shoulder[1]], [shoulder[0] - 0.4, 53], ...mid.map(m => [m[0], m[1]]), [elbow[0], elbow[1] - 0.8]
    ]);
    const elbowD = `M ${pt([elbow[0] - 2.3, elbow[1] + 0.9])} L ${pt([elbow[0] + 2.3, elbow[1] - 0.9])}`;

    const spread = y => (y < 80 ? 1.9 : y < 90 ? 1.7 : 1.4);
    const sides = (sign, startY) => smooth([
        [elbow[0] + sign * 1.5, elbow[1] + 0.8],
        ...fore.filter(m => m[1] >= startY).map(m => [m[0] + sign * spread(m[1]), m[1]]),
        [wrist[0] + sign * 1.3, wrist[1] - 1.3]
    ]);
    const ulna = sides(1, 80);
    const radius = sides(-1, 80);

    const cx = wrist[0], cy = wrist[1] + 2.4;
    const carpals = `M ${pt([cx - 1, cy - 1.7])} C ${pt([cx + 0.8, cy - 2.2])} ${pt([cx + 2.4, cy - 1.3])} ${pt([cx + 2.4, cy])}`
        + ` C ${pt([cx + 2.4, cy + 1.4])} ${pt([cx + 0.8, cy + 2])} ${pt([cx - 0.4, cy + 1.9])}`
        + ` C ${pt([cx - 1.9, cy + 1.7])} ${pt([cx - 2.6, cy + 0.4])} ${pt([cx - 2.1, cy - 0.7])}`
        + ` C ${pt([cx - 1.9, cy - 1.4])} ${pt([cx - 1.4, cy - 1.7])} ${pt([cx - 1, cy - 1.7])} Z`;

    // Outer -> inner for the viewer-left hand (thumb is outermost). Shell lanes: index shortest of the long three, pinky shortest.
    const FINGERS = [
        { id: 'index', seed: [54.3, 107.2], baseX: 56.3, baseY: 104.7 },
        { id: 'middle', seed: [57, 107.2], baseX: 58 },
        { id: 'ring', seed: [59.7, 107.2], baseX: 60.1 },
        { id: 'pinky', seed: [62, 107.2], baseX: 62 }
    ];
    const baseY = cy + 1.6;
    const digits = {};
    FINGERS.forEach(f => {
        const lane = traceFinger(f.seed, 116);
        let tipIdx = lane.length - 1;
        while (tipIdx > 3 && clearanceAt(lane[tipIdx]) < TIP_CLEARANCE) tipIdx--;
        const knuckle = lane[1];
        const tip = lane[tipIdx];
        const joints = [1, 0.62, 0.3].map(t => lane[Math.round(1 + (tipIdx - 1) * (1 - t))]);
        const phalanges = [knuckle, lane[Math.round(1 + (tipIdx - 1) * 0.45)], tip];
        const candidates = [];
        for (const [bdx, bdy] of [[0, 0], [0.4, 0], [-0.4, 0], [0, -0.4], [0.4, -0.4], [-0.4, -0.4], [0.8, 0], [0.8, -0.4]]) {
            const base = [f.baseX + bdx, (f.baseY || baseY) + bdy];
            candidates.push([base, knuckle]);
            for (let wy = 105.4; wy >= 104; wy -= 0.4) {
                for (const dx of [0, -0.4, 0.4, -0.8, 0.8, -1.2, 1.2]) candidates.push([base, [knuckle[0] + dx, wy], knuckle]);
            }
        }
        const metaPts = bestRoute(candidates);
        void joints;
        digits[f.id] = polyline([...metaPts, ...dedupe(phalanges).slice(1)]);
    });

    const thumbAt = x => {
        const iv = pick(colIntervals(x), 97.4);
        return [x, (iv[0] + iv[1]) / 2];
    };
    // First metacarpal runs from the wrist to the thumb's MCP knuckle, then two phalanges along the lobe midline.
    const thumbMcp = thumbAt(55.5);
    const thumbIp = thumbAt(53.4);
    let thumbTip = thumbAt(50.8);
    for (let x = 50.8; x < 53 && clearanceAt(thumbTip) < TIP_CLEARANCE; x += 0.2) thumbTip = thumbAt(x);
    digits.thumb = polyline(bestRoute([
        [[cx - 1.1, cy - 1.8], thumbMcp, thumbIp, thumbTip],
        [[cx - 1.4, cy - 1.2], thumbMcp, thumbIp, thumbTip],
        [[cx - 0.8, cy - 2], thumbMcp, thumbIp, thumbTip]
    ]));

    return {
        humerus, elbow: elbowD, ulna, radius, carpals, digits
    };
}

function dedupe(pts) {
    return pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 0.15);
}

function polyline(pts) {
    const q = dedupe(pts);
    return `M ${pt(q[0])}` + q.slice(1).map(p => ` L ${pt(p)}`).join('');
}

/** Candidate with the greatest minimum shell clearance (checked on both mirrored sides). */
function bestRoute(candidates) {
    let best = null;
    let bestClr = -Infinity;
    for (const pts of candidates) {
        const samples = flattenPath(polyline(pts), 1);
        const clr = Math.min(...samples.map(clearanceAt));
        if (clr >= ROUTE_CLEARANCE) return pts;
        if (clr > bestClr) { best = pts; bestClr = clr; }
    }
    return best;
}

const paths = build();

const HAND_DIGIT_ORDER = ['thumb', 'index', 'middle', 'ring', 'pinky'];

function handBlock(digits) {
    const lines = HAND_DIGIT_ORDER.map(id =>
        `    { id: 'finger-${id}', action: 'hands', kind: 'fine', d: '${digits[id]}' }`);
    return `    // <fit:hand> generated by scripts/fit-body-bones-to-shell.js --write\n${lines.join(',\n')},\n    // </fit:hand>\n`;
}

if (process.argv.includes('--write')) {
    const file = path.join(root, 'body-chamber.js');
    let src = fs.readFileSync(file, 'utf8');
    const { digits, ...single } = paths;
    for (const [id, d] of Object.entries(single)) {
        const re = new RegExp(`(\\{ id: '${id}', action: '[a-z]+', kind: '[a-z]+', d: ')[^']*(' \\})`);
        if (!re.test(src)) throw new Error(`def for ${id} not found in body-chamber.js`);
        src = src.replace(re, (_, a, b) => `${a}${d}${b}`);
    }
    const blockRe = /    \/\/ <fit:hand>[\s\S]*?\/\/ <\/fit:hand>\n/;
    if (!blockRe.test(src)) throw new Error('<fit:hand> markers not found in body-chamber.js');
    src = src.replace(blockRe, () => handBlock(digits));
    fs.writeFileSync(file, src);
    console.log('patched body-chamber.js:', [...Object.keys(single), ...HAND_DIGIT_ORDER.map(d => 'finger-' + d)].join(', '));
} else {
    console.log(JSON.stringify(paths, null, 2));
}
