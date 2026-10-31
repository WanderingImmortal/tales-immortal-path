'use strict';

/** @returns {string[]} */
function tokenizePath(d) {
    return d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [];
}

/**
 * Flatten SVG path to a polygon (open or closed). Handles M/L/H/V/C/Q and circular A (rx≈ry).
 */
function flattenPath(d, samplesPerCurve = 10) {
    const tokens = tokenizePath(d);
    let i = 0;
    let cmd = '';
    let cx = 0;
    let cy = 0;
    let sx = 0;
    let sy = 0;
    const pts = [];

    function readNum() { return parseFloat(tokens[i++]); }
    function push(x, y) {
        if (!Number.isFinite(x) || !Number.isFinite(y)) return;
        const lx = pts.length ? pts[pts.length - 1][0] : null;
        const ly = pts.length ? pts[pts.length - 1][1] : null;
        if (lx === x && ly === y) return;
        pts.push([x, y]);
        cx = x;
        cy = y;
    }

    function sampleCubic(x0, y0, x1, y1, x2, y2, x3, y3) {
        for (let s = 1; s <= samplesPerCurve; s++) {
            const t = s / samplesPerCurve;
            const u = 1 - t;
            push(
                u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
                u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3
            );
        }
    }

    function sampleQuadratic(x0, y0, x1, y1, x2, y2) {
        for (let s = 1; s <= samplesPerCurve; s++) {
            const t = s / samplesPerCurve;
            const u = 1 - t;
            push(u * u * x0 + 2 * u * t * x1 + t * t * x2, u * u * y0 + 2 * u * t * y1 + t * t * y2);
        }
    }

    /** Circular arc endpoint sampling (good enough for limb capsules). */
    function sampleArc(x0, y0, rx, ry, x, y, steps = 10) {
        if (rx <= 0 || ry <= 0) {
            push(x, y);
            return;
        }
        const r = (rx + ry) / 2;
        const dx = x - x0;
        const dy = y - y0;
        const chord = Math.hypot(dx, dy) || 0.001;
        const half = chord / 2;
        const h = Math.sqrt(Math.max(0, r * r - half * half));
        const mx = (x0 + x) / 2;
        const my = (y0 + y) / 2;
        const nx = -dy / chord;
        const ny = dx / chord;
        const cxArc = mx + nx * h;
        const cyArc = my + ny * h;
        const a0 = Math.atan2(y0 - cyArc, x0 - cxArc);
        const a1 = Math.atan2(y - cyArc, x - cxArc);
        let da = a1 - a0;
        while (da > Math.PI) da -= 2 * Math.PI;
        while (da < -Math.PI) da += 2 * Math.PI;
        for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            const a = a0 + da * t;
            push(cxArc + r * Math.cos(a), cyArc + r * Math.sin(a));
        }
    }

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
            sampleCubic(cx, cy, x1, y1, x2, y2, x, y);
        } else if (cmd === 'c') {
            const x1 = cx + readNum(), y1 = cy + readNum();
            const x2 = cx + readNum(), y2 = cy + readNum();
            const x = cx + readNum(), y = cy + readNum();
            sampleCubic(cx, cy, x1, y1, x2, y2, x, y);
        } else if (cmd === 'Q') {
            const x1 = readNum(), y1 = readNum(), x = readNum(), y = readNum();
            sampleQuadratic(cx, cy, x1, y1, x, y);
        } else if (cmd === 'q') {
            const x1 = cx + readNum(), y1 = cy + readNum();
            const x = cx + readNum(), y = cy + readNum();
            sampleQuadratic(cx, cy, x1, y1, x, y);
        } else if (cmd === 'A' || cmd === 'a') {
            const rx = readNum(), ry = readNum();
            readNum(); // rot
            readNum(); // large
            readNum(); // sweep
            const x = cmd === 'A' ? readNum() : cx + readNum();
            const y = cmd === 'A' ? readNum() : cy + readNum();
            sampleArc(cx, cy, rx, ry, x, y, 12);
        } else if (cmd === 'Z' || cmd === 'z') {
            push(sx, sy);
        } else {
            i++;
        }
    }
    return pts;
}

function polygonToPathD(ring) {
    if (!ring.length) return '';
    const [x0, y0] = ring[0];
    let d = `M ${x0.toFixed(2)},${y0.toFixed(2)}`;
    for (let i = 1; i < ring.length; i++) {
        d += ` L ${ring[i][0].toFixed(2)},${ring[i][1].toFixed(2)}`;
    }
    return d + ' Z';
}

/** Drop consecutive duplicates and close ring if needed. */
function cleanRing(pts, close = true) {
    const out = [];
    for (const p of pts) {
        if (!out.length || out[out.length - 1][0] !== p[0] || out[out.length - 1][1] !== p[1]) {
            out.push([+p[0].toFixed(3), +p[1].toFixed(3)]);
        }
    }
    if (close && out.length > 2) {
        const a = out[0];
        const b = out[out.length - 1];
        if (a[0] !== b[0] || a[1] !== b[1]) out.push([a[0], a[1]]);
    }
    return out;
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

module.exports = {
    tokenizePath,
    flattenPath,
    polygonToPathD,
    cleanRing,
    pointInPoly
};
