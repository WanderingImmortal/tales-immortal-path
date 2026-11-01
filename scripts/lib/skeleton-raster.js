'use strict';
/**
 * Raster helpers for the skeleton reference image: figure mask, game-space transform fit
 * against #sil-shell, bone mask. Used by scripts/trace-body-skeleton-reference.js.
 */
const fs = require('fs');
const path = require('path');
const { flattenPath, pointInPoly } = require('./body-fit-geometry');

const root = path.join(__dirname, '..', '..');

async function loadSkeletonImage(file) {
    const { Jimp } = require('jimp');
    const img = await Jimp.read(file);
    const W = img.bitmap.width, H = img.bitmap.height, d = img.bitmap.data;
    const lum = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) lum[i] = d[i * 4] * 0.3 + d[i * 4 + 1] * 0.59 + d[i * 4 + 2] * 0.11;
    return { W, H, lum };
}

/** Figure = everything not reachable from the border over bright pixels (so enclosed bone interiors stay in). */
function figureMask({ W, H, lum }) {
    const bg = new Uint8Array(W * H);
    const stack = [];
    const push = (x, y) => {
        const k = y * W + x;
        if (!bg[k] && lum[k] > 200) { bg[k] = 1; stack.push(k); }
    };
    for (let x = 0; x < W; x++) { push(x, 0); push(x, H - 1); }
    for (let y = 0; y < H; y++) { push(0, y); push(W - 1, y); }
    while (stack.length) {
        const k = stack.pop();
        const x = k % W, y = (k / W) | 0;
        if (x > 0) push(x - 1, y);
        if (x < W - 1) push(x + 1, y);
        if (y > 0) push(x, y - 1);
        if (y < H - 1) push(x, y + 1);
    }
    const fig = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) fig[i] = bg[i] ? 0 : 1;
    return fig;
}

function bbox(mask, W, H) {
    let minX = W, maxX = 0, minY = H, maxY = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        if (mask[y * W + x]) {
            if (x < minX) minX = x; if (x > maxX) maxX = x;
            if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
    }
    return { minX, maxX, minY, maxY };
}

function shellPolygon() {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    return flattenPath(html.match(/id="sil-shell"\s+d="([^"]+)"/)[1], 6);
}

/**
 * Fit px -> game transform {s, tx, ty} (uniform scale) by bbox, then refine by IoU against the shell raster.
 * game = px * s + t
 */
function fitTransform(fig, W, H, shell) {
    const bb = bbox(fig, W, H);
    let sx0 = Infinity, sx1 = -Infinity, sy0 = Infinity, sy1 = -Infinity;
    for (const [x, y] of shell) { sx0 = Math.min(sx0, x); sx1 = Math.max(sx1, x); sy0 = Math.min(sy0, y); sy1 = Math.max(sy1, y); }
    const s0 = ((sy1 - sy0) / (bb.maxY - bb.minY) + (sx1 - sx0) / (bb.maxX - bb.minX)) / 2;
    const cx = (bb.minX + bb.maxX) / 2, cy = (bb.minY + bb.maxY) / 2;
    const t0 = [(sx0 + sx1) / 2 - cx * s0, (sy0 + sy1) / 2 - cy * s0];

    const STEP = 0.4;
    const gx0 = 40, gx1 = 168, gy0 = 0, gy1 = 207;
    const gw = Math.ceil((gx1 - gx0) / STEP), gh = Math.ceil((gy1 - gy0) / STEP);
    const shellRaster = new Uint8Array(gw * gh);
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
        shellRaster[j * gw + i] = pointInPoly(gx0 + (i + 0.5) * STEP, gy0 + (j + 0.5) * STEP, shell) ? 1 : 0;
    }
    function iou(s, tx, ty) {
        let inter = 0, uni = 0;
        for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
            const gxp = gx0 + (i + 0.5) * STEP, gyp = gy0 + (j + 0.5) * STEP;
            const px = Math.round((gxp - tx) / s), py = Math.round((gyp - ty) / s);
            const f = px >= 0 && py >= 0 && px < W && py < H ? fig[py * W + px] : 0;
            const a = shellRaster[j * gw + i];
            if (f && a) inter++;
            if (f || a) uni++;
        }
        return inter / uni;
    }
    let best = { s: s0, tx: t0[0], ty: t0[1], iou: iou(s0, t0[0], t0[1]) };
    for (let pass = 0; pass < 3; pass++) {
        const ds = s0 * 0.01 / (pass + 1), dt = 0.6 / (pass + 1);
        const c = { ...best };
        for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) for (let e = -2; e <= 2; e++) {
            const s = c.s + a * ds, tx = c.tx + b * dt, ty = c.ty + e * dt;
            const v = iou(s, tx, ty);
            if (v > best.iou) best = { s, tx, ty, iou: v };
        }
    }
    return best;
}

/** Bone pixels: bright pixels inside the figure. */
function boneMask({ W, H, lum }, fig, threshold = 150) {
    const m = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) m[i] = fig[i] && lum[i] > threshold ? 1 : 0;
    return m;
}

/**
 * Local re-registration for one body piece (e.g. a hand): small shift + scale about the box centre
 * that maximises silhouette IoU against the shell inside `box` = {x0,y0,x1,y1} (game units).
 * Returns a refined {s, tx, ty} for the same px -> game mapping.
 */
function refineTransform(base, fig, W, H, shell, box, opts = {}) {
    const STEP = 0.25;
    const range = opts.range ?? 1.6, kRange = opts.kRange ?? 0.03;
    const gw = Math.ceil((box.x1 - box.x0) / STEP), gh = Math.ceil((box.y1 - box.y0) / STEP);
    const shellR = new Uint8Array(gw * gh);
    for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
        shellR[j * gw + i] = pointInPoly(box.x0 + (i + 0.5) * STEP, box.y0 + (j + 0.5) * STEP, shell) ? 1 : 0;
    }
    const cx = (box.x0 + box.x1) / 2, cy = (box.y0 + box.y1) / 2;
    const make = (k, dx, dy) => ({
        s: base.s * k,
        tx: cx + k * (base.tx - cx) + dx,
        ty: cy + k * (base.ty - cy) + dy
    });
    function iou(t) {
        let inter = 0, uni = 0;
        for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
            const gxp = box.x0 + (i + 0.5) * STEP, gyp = box.y0 + (j + 0.5) * STEP;
            const px = Math.round((gxp - t.tx) / t.s), py = Math.round((gyp - t.ty) / t.s);
            const f = px >= 0 && py >= 0 && px < W && py < H ? fig[py * W + px] : 0;
            const a = shellR[j * gw + i];
            if (f && a) inter++;
            if (f || a) uni++;
        }
        return uni ? inter / uni : 0;
    }
    let best = { ...make(1, 0, 0), iou: 0 };
    best.iou = iou(best);
    const start = best.iou;
    for (let k = 1 - kRange; k <= 1 + kRange + 1e-9; k += kRange / 3) {
        for (let dx = -range; dx <= range + 1e-9; dx += 0.2) {
            for (let dy = -range; dy <= range + 1e-9; dy += 0.2) {
                const t = make(k, dx, dy);
                const v = iou(t);
                if (v > best.iou) best = { ...t, iou: v };
            }
        }
    }
    return { ...best, startIou: start };
}

module.exports = { loadSkeletonImage, figureMask, bbox, shellPolygon, fitTransform, refineTransform, boneMask };
