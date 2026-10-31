/**
 * Derive viewer-left arm/hand bone SVG paths from sil-patch joint centers
 * and finger targets that stay inside #sil-shell (not the wider sil-hand-* capsules).
 *
 * Run: node scripts/generate-limb-bone-paths.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const JOINTS = {
    shoulder: [81, 44],
    elbow: [67, 76],
    wrist: [59.5, 103]
};

function tokenizePath(d) {
    return d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [];
}

function flattenPath(d, samplesPerCurve = 8) {
    const tokens = tokenizePath(d);
    let i = 0;
    let cmd = '';
    let cx = 0;
    let cy = 0;
    let sx = 0;
    let sy = 0;
    const pts = [];
    const readNum = () => parseFloat(tokens[i++]);
    const push = (x, y) => { pts.push([x, y]); cx = x; cy = y; };

    while (i < tokens.length) {
        const t = tokens[i];
        if (/[A-Za-z]/.test(t)) { cmd = t; i++; }
        else if (!cmd) { i++; continue; }

        if (cmd === 'M') {
            push(readNum(), readNum());
            sx = cx; sy = cy;
            cmd = 'L';
        } else if (cmd === 'L') {
            push(readNum(), readNum());
        } else if (cmd === 'C') {
            const x1 = readNum(), y1 = readNum(), x2 = readNum(), y2 = readNum(), x = readNum(), y = readNum();
            for (let s = 1; s <= samplesPerCurve; s++) {
                const u = s / samplesPerCurve;
                const mt = 1 - u;
                push(
                    mt * mt * mt * cx + 3 * mt * mt * u * x1 + 3 * mt * u * u * x2 + u * u * u * x,
                    mt * mt * mt * cy + 3 * mt * mt * u * y1 + 3 * mt * u * u * y2 + u * u * u * y
                );
            }
        } else if (cmd === 'Z' || cmd === 'z') {
            push(sx, sy);
        } else {
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
        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-12) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

const shellD = html.match(/id="sil-shell"\s+d="([^"]+)"/)[1];
const shellPoly = flattenPath(shellD, 5);

/** Five fingertip targets: farthest inside shell per bearing from wrist. */
function fingerTipsFromShell(wrist) {
    // Viewer-left arm: fingers hang down-left from wrist (π/2 … π).
    const bearings = [2.45, 2.65, 2.85, 3.05, 3.35];
    const tips = [];
    for (const ang of bearings) {
        let best = null;
        let bestD = 0;
        for (let step = 4; step <= 14; step += 0.25) {
            const x = wrist[0] + Math.cos(ang) * step;
            const y = wrist[1] + Math.sin(ang) * step;
            if (pointInPoly(x, y, shellPoly) && step > bestD) {
                bestD = step;
                best = [+x.toFixed(1), +y.toFixed(1)];
            }
        }
        if (best) tips.push(best);
    }
    return tips;
}

function fmt(n) { return +n.toFixed(1); }

function buildArmHandPaths(j, tips) {
    const [sx, sy] = j.shoulder;
    const [ex, ey] = j.elbow;
    const [wx, wy] = j.wrist;
    const humerus = `M ${fmt(sx)},${fmt(sy + 0.5)} C ${fmt(sx - 4)},${fmt(sy + 8)} ${fmt(ex + 3)},${fmt(ey - 12)} ${fmt(ex)},${fmt(ey - 0.5)}`;
    const elbow = `M ${fmt(ex - 1.5)},${fmt(ey + 0.8)} L ${fmt(ex + 2.5)},${fmt(ey - 0.8)}`;
    const ulna = `M ${fmt(ex + 1)},${fmt(ey)} C ${fmt(ex - 0.5)},${fmt(ey + 9)} ${fmt(wx + 3.5)},${fmt(ey + 18)} ${fmt(wx + 2.5)},${fmt(wy - 1.4)}`;
    const radius = `M ${fmt(ex - 1)},${fmt(ey + 0.5)} C ${fmt(ex - 3)},${fmt(ey + 9)} ${fmt(wx - 0.5)},${fmt(ey + 18)} ${fmt(wx - 1)},${fmt(wy - 1.6)}`;
    const carpals = `M ${fmt(wx - 0.9)},${fmt(wy + 0.2)} C ${fmt(wx + 0.6)},${fmt(wy - 0.6)} ${fmt(wx + 2.2)},${fmt(wy + 0.2)} ${fmt(wx + 2)},${fmt(wy + 1.6)} C ${fmt(wx + 1.8)},${fmt(wy + 3)} ${fmt(wx + 0.4)},${fmt(wy + 3.8)} ${fmt(wx - 0.9)},${fmt(wy + 3.4)} C ${fmt(wx - 2.2)},${fmt(wy + 3)} ${fmt(wx - 2.6)},${fmt(wy + 1.6)} ${fmt(wx - 2)},${fmt(wy + 0.4)} C ${fmt(wx - 1.6)},${fmt(wy - 0.2)} ${fmt(wx - 0.9)},${fmt(wy + 0.2)} Z`;

    const knuckleY = wy + 3.2;
    const metas = [];
    const phalanges = [];
    tips.forEach((tip, i) => {
        const kx = wx - 1.2 + i * 0.85;
        const ky = knuckleY + (i === 4 ? -1.5 : 0);
        metas.push(`M ${fmt(kx)},${fmt(ky)} L ${fmt(tip[0] + (i === 0 ? -0.5 : 0))},${fmt(tip[1] - 2.2)}`);
        const midX = (kx + tip[0]) / 2;
        const midY = (ky + tip[1]) / 2 - 0.5;
        phalanges.push(`M ${fmt(tip[0] + (i === 0 ? -0.5 : 0))},${fmt(tip[1] - 2.2)} L ${fmt(midX)},${fmt(midY)} L ${fmt(tip[0])},${fmt(tip[1])}`);
    });

    return {
        humerus,
        elbow,
        ulna,
        radius,
        carpals,
        metacarpals: metas.join(' M ').replace(/M /g, 'M '),
        phalanges: phalanges.join(' M ').replace(/M /g, 'M ')
    };
}

const tips = fingerTipsFromShell(JOINTS);
const paths = buildArmHandPaths(JOINTS, tips);

console.log('// Generated by scripts/generate-limb-bone-paths.js — viewer-left arm/hand');
console.log('// Joints (sil-patch): shoulder', JOINTS.shoulder, 'elbow', JOINTS.elbow, 'wrist', JOINTS.wrist);
console.log('// Finger tips inside sil-shell:', tips);
console.log(JSON.stringify(paths, null, 2));
