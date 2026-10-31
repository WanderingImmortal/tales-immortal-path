'use strict';

function tokenizePath(d) {
    return d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [];
}

function flattenPath(d, samplesPerCurve = 8) {
    const tokens = tokenizePath(d);
    let i = 0;
    let cmd = '';
    let cx = 0, cy = 0, sx = 0, sy = 0;
    const pts = [];
    const readNum = () => parseFloat(tokens[i++]);
    const push = (x, y) => { pts.push([x, y]); cx = x; cy = y; };
    const cubic = (x0, y0, x1, y1, x2, y2, x, y) => {
        for (let s = 1; s <= samplesPerCurve; s++) {
            const t = s / samplesPerCurve, u = 1 - t;
            push(
                u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x,
                u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y
            );
        }
    };
    const quad = (x0, y0, x1, y1, x, y) => {
        for (let s = 1; s <= samplesPerCurve; s++) {
            const t = s / samplesPerCurve, u = 1 - t;
            push(u * u * x0 + 2 * u * t * x1 + t * t * x, u * u * y0 + 2 * u * t * y1 + t * t * y);
        }
    };

    while (i < tokens.length) {
        const t = tokens[i];
        if (/[A-Za-z]/.test(t)) { cmd = t; i++; }
        else if (!cmd) { i++; continue; }

        if (cmd === 'M') { push(readNum(), readNum()); sx = cx; sy = cy; cmd = 'L'; }
        else if (cmd === 'm') { push(cx + readNum(), cy + readNum()); sx = cx; sy = cy; cmd = 'l'; }
        else if (cmd === 'L') push(readNum(), readNum());
        else if (cmd === 'l') push(cx + readNum(), cy + readNum());
        else if (cmd === 'H') push(readNum(), cy);
        else if (cmd === 'h') push(cx + readNum(), cy);
        else if (cmd === 'V') push(cx, readNum());
        else if (cmd === 'v') push(cx, cy + readNum());
        else if (cmd === 'C') {
            const x0 = cx, y0 = cy;
            cubic(x0, y0, readNum(), readNum(), readNum(), readNum(), readNum(), readNum());
        } else if (cmd === 'c') {
            const x0 = cx, y0 = cy;
            cubic(x0, y0, x0 + readNum(), y0 + readNum(), x0 + readNum(), y0 + readNum(), x0 + readNum(), y0 + readNum());
        } else if (cmd === 'Q') {
            const x0 = cx, y0 = cy;
            quad(x0, y0, readNum(), readNum(), readNum(), readNum());
        } else if (cmd === 'q') {
            const x0 = cx, y0 = cy;
            quad(x0, y0, x0 + readNum(), y0 + readNum(), x0 + readNum(), y0 + readNum());
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

function distToPolyEdge(x, y, poly) {
    let min = Infinity;
    for (let i = 0; i < poly.length; i++) {
        const a = poly[i];
        const b = poly[(i + 1) % poly.length];
        const dx = b[0] - a[0], dy = b[1] - a[1];
        const len2 = dx * dx + dy * dy || 1;
        const t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / len2));
        const d = Math.hypot(x - (a[0] + t * dx), y - (a[1] + t * dy));
        if (d < min) min = d;
    }
    return min;
}

/** Positive = depth inside the union of polys; negative = distance outside every poly. */
function signedClearance(x, y, polys) {
    let bestIn = -Infinity;
    let nearestOut = Infinity;
    for (const poly of polys) {
        if (poly.length < 3) continue;
        const d = distToPolyEdge(x, y, poly);
        if (pointInPoly(x, y, poly)) bestIn = Math.max(bestIn, d);
        else nearestOut = Math.min(nearestOut, d);
    }
    if (bestIn > -Infinity) return bestIn;
    return -nearestOut;
}

module.exports = { flattenPath, pointInPoly, distToPolyEdge, signedClearance };
