/**
 * Body chamber silhouette / overlay fit audit (Phase 1+).
 * Run: node scripts/audit-body-overlay-fit.js
 *
 * Checks:
 *  1. sil-* part paths exist in index.html
 *  2. BODY_LANDMARKS + centreX === 104
 *  3. No legacy subtractive body-mask-* region masks
 *  4. Sampled bone path points sit inside the silhouette union (clearance)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const bodyJs = fs.readFileSync(path.join(root, 'body-chamber.js'), 'utf8');

const PART_IDS = [
    'sil-head', 'sil-neck', 'sil-torso',
    'sil-upper-arm-l', 'sil-upper-arm-r',
    'sil-forearm-l', 'sil-forearm-r',
    'sil-hand-l', 'sil-hand-r',
    'sil-thigh-l', 'sil-thigh-r',
    'sil-shin-l', 'sil-shin-r',
    'sil-foot-l', 'sil-foot-r'
];

let failed = false;
function fail(msg) {
    console.error('FAIL:', msg);
    failed = true;
}
function ok(msg) {
    console.log('OK:', msg);
}

// —— 1. Part paths present ——
const partPaths = {};
for (const id of PART_IDS) {
    const re = new RegExp(`<path\\s+id="${id}"\\s+d="([^"]+)"`);
    const m = html.match(re);
    if (!m) fail(`missing <path id="${id}"> in index.html`);
    else partPaths[id] = m[1];
}
if (Object.keys(partPaths).length === PART_IDS.length) {
    ok(`${PART_IDS.length} silhouette part paths present`);
}

// —— 2. No legacy subtractive region masks ——
const legacyMasks = [...html.matchAll(/id="(body-mask-(?:head|spine|ribs|arm-l|arm-r|hand-l|hand-r|leg-l|leg-r|foot-l|foot-r))"/g)].map(m => m[1]);
if (legacyMasks.length) fail(`legacy subtractive masks still present: ${legacyMasks.join(', ')}`);
else ok('legacy subtractive region masks removed');

if (html.includes('id="body-silhouette-path"')) {
    fail('legacy #body-silhouette-path still present — parts should replace it');
} else {
    ok('legacy #body-silhouette-path removed');
}

if (!html.includes('id="body-mask-silhouette-only"')) {
    fail('missing body-mask-silhouette-only composite mask');
} else {
    ok('composite silhouette mask present');
}

// —— 3. BODY_LANDMARKS ——
const lmMatch = bodyJs.match(/const BODY_LANDMARKS\s*=\s*\{([\s\S]*?)\n\};/);
if (!lmMatch) {
    fail('BODY_LANDMARKS missing in body-chamber.js');
} else {
    let landmarks;
    try {
        landmarks = vm.runInNewContext('(' + lmMatch[0].replace(/^const BODY_LANDMARKS\s*=\s*/, '').replace(/;$/, '') + ')');
    } catch (e) {
        fail('BODY_LANDMARKS parse error: ' + e.message);
        landmarks = null;
    }
    if (landmarks) {
        if (landmarks.centreX !== 104) fail(`BODY_LANDMARKS.centreX is ${landmarks.centreX}, expected 104`);
        else ok('BODY_LANDMARKS.centreX === 104');
    }
}

// —— 4. Flatten path → polygon samples, point-in-polygon ——
function tokenizePath(d) {
    return d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [];
}

function flattenPath(d, samplesPerCurve = 8) {
    const tokens = tokenizePath(d);
    let i = 0;
    let cmd = '';
    let cx = 0, cy = 0, sx = 0, sy = 0;
    const pts = [];

    function readNum() { return parseFloat(tokens[i++]); }
    function push(x, y) { pts.push([x, y]); cx = x; cy = y; }

    while (i < tokens.length) {
        const t = tokens[i];
        if (/[A-Za-z]/.test(t)) { cmd = t; i++; }
        else if (!cmd) { i++; continue; }

        if (cmd === 'M') {
            push(readNum(), readNum());
            sx = cx; sy = cy;
            cmd = 'L';
        } else if (cmd === 'm') {
            push(cx + readNum(), cy + readNum());
            sx = cx; sy = cy;
            cmd = 'l';
        } else if (cmd === 'L') {
            push(readNum(), readNum());
        } else if (cmd === 'l') {
            push(cx + readNum(), cy + readNum());
        } else if (cmd === 'H') {
            push(readNum(), cy);
        } else if (cmd === 'h') {
            push(cx + readNum(), cy);
        } else if (cmd === 'V') {
            push(cx, readNum());
        } else if (cmd === 'v') {
            push(cx, cy + readNum());
        } else if (cmd === 'C') {
            const x1 = readNum(), y1 = readNum(), x2 = readNum(), y2 = readNum(), x = readNum(), y = readNum();
            for (let s = 1; s <= samplesPerCurve; s++) {
                const t = s / samplesPerCurve;
                const u = 1 - t;
                push(
                    u * u * u * cx + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x,
                    u * u * u * cy + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y
                );
            }
        } else if (cmd === 'c') {
            const x1 = cx + readNum(), y1 = cy + readNum();
            const x2 = cx + readNum(), y2 = cy + readNum();
            const x = cx + readNum(), y = cy + readNum();
            const x0 = cx, y0 = cy;
            for (let s = 1; s <= samplesPerCurve; s++) {
                const t = s / samplesPerCurve;
                const u = 1 - t;
                push(
                    u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x,
                    u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y
                );
            }
        } else if (cmd === 'Q') {
            const x1 = readNum(), y1 = readNum(), x = readNum(), y = readNum();
            for (let s = 1; s <= samplesPerCurve; s++) {
                const t = s / samplesPerCurve;
                const u = 1 - t;
                push(u * u * cx + 2 * u * t * x1 + t * t * x, u * u * cy + 2 * u * t * y1 + t * t * y);
            }
        } else if (cmd === 'q') {
            const x1 = cx + readNum(), y1 = cy + readNum();
            const x = cx + readNum(), y = cy + readNum();
            const x0 = cx, y0 = cy;
            for (let s = 1; s <= samplesPerCurve; s++) {
                const t = s / samplesPerCurve;
                const u = 1 - t;
                push(u * u * x0 + 2 * u * t * x1 + t * t * x, u * u * y0 + 2 * u * t * y1 + t * t * y);
            }
        } else if (cmd === 'A' || cmd === 'a') {
            // Approximate arc as endpoint only (good enough for stadium capsules)
            const rx = readNum(), ry = readNum();
            readNum(); readNum(); readNum(); // rot, large, sweep
            const x = cmd === 'A' ? readNum() : cx + readNum();
            const y = cmd === 'A' ? readNum() : cy + readNum();
            void rx; void ry;
            push(x, y);
        } else if (cmd === 'Z' || cmd === 'z') {
            push(sx, sy);
        } else {
            // Unknown — skip one number to avoid infinite loop
            i++;
        }
    }
    return pts;
}

function pointInPoly(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i][0], yi = poly[i][1];
        const xj = poly[j][0], yj = poly[j][1];
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-12) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function distToPolyEdge(x, y, poly) {
    let min = Infinity;
    for (let i = 0; i < poly.length; i++) {
        const a = poly[i];
        const b = poly[(i + 1) % poly.length];
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const len2 = dx * dx + dy * dy || 1;
        let t = ((x - a[0]) * dx + (y - a[1]) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        const px = a[0] + t * dx;
        const py = a[1] + t * dy;
        const d = Math.hypot(x - px, y - py);
        if (d < min) min = d;
    }
    return min;
}

const polys = Object.values(partPaths).map(d => flattenPath(d));

function insideSilhouette(x, y) {
    for (const poly of polys) {
        if (poly.length >= 3 && pointInPoly(x, y, poly)) return true;
    }
    return false;
}

function signedClearance(x, y) {
    let best = -Infinity;
    let inside = false;
    for (const poly of polys) {
        if (poly.length < 3) continue;
        const inn = pointInPoly(x, y, poly);
        const d = distToPolyEdge(x, y, poly);
        if (inn) {
            inside = true;
            if (d > best) best = d;
        } else if (!inside) {
            const neg = -d;
            if (neg > best || best === -Infinity) best = neg;
        }
    }
    if (inside && best === -Infinity) return 0;
    return best;
}

// Sample literal bone `d:` strings from axial + side defs (mirrored copies included).
function mirrorBoneD(d) {
    let axis = 0;
    return (d.match(/[A-Za-z]|-?\d*\.?\d+/g) || []).map(token => {
        if (/[A-Za-z]/.test(token)) { axis = 0; return token; }
        const n = parseFloat(token);
        return (axis++ % 2 === 0) ? +(2 * 104 - n).toFixed(2) : n;
    }).join(' ');
}

const boneBlock = bodyJs.slice(
    bodyJs.indexOf('const BODY_BONE_AXIAL_DEFS'),
    bodyJs.indexOf('const BODY_BONE_LAYOUT_VERSION')
);
const boneLiterals = [...boneBlock.matchAll(/id:\s*'([^']+)'[\s\S]*?d:\s*'([^']+)'/g)];
const bones = [];
for (const m of boneLiterals) {
    bones.push({ id: m[1], d: m[2] });
    // Side defs are mirrored for -r; axial are not — mirror all literals as a second sample.
    // Harmless double-check for axial (symmetric-ish).
    bones.push({ id: m[1] + '-mirror', d: mirrorBoneD(m[2]) });
}

const MARGIN = 1.2;
const STROKE_HALF = 0.6;
const threshold = STROKE_HALF + MARGIN;
const offenders = [];

for (const bone of bones) {
    const samples = flattenPath(bone.d, 4);
    let worst = Infinity;
    let worstPt = null;
    for (const [x, y] of samples) {
        const clr = signedClearance(x, y);
        if (clr < worst) {
            worst = clr;
            worstPt = [x, y];
        }
    }
    if (worst < threshold) {
        offenders.push({
            id: bone.id,
            clearance: +worst.toFixed(2),
            at: worstPt ? `(${worstPt[0].toFixed(1)},${worstPt[1].toFixed(1)})` : '?'
        });
    }
}

offenders.sort((a, b) => a.clearance - b.clearance);
console.log(`\nBone fit vs new silhouette (threshold clearance ${threshold}; ${bones.length} path samples):`);
if (!offenders.length) {
    ok('all sampled bones clear silhouette margin');
} else {
    console.log(`  ${offenders.length} sample(s) under margin (Phase 1 warn — re-fit in Phase 2):`);
    offenders.slice(0, 12).forEach(o => {
        console.log(`  - ${o.id}: clearance ${o.clearance} at ${o.at}`);
    });
    console.log('WARN: bone clearance under margin (not failing Phase 1)');
}

console.log('');
if (failed) {
    console.error('Body overlay fit audit FAILED.');
    process.exit(1);
}
console.log('Body overlay fit audit passed.');
process.exit(0);
