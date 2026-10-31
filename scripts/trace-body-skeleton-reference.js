'use strict';
/**
 * Trace art/body-chamber/skeleton-reference.png (generated skeleton over the same silhouette as
 * reference.png) into per-chunk SVG paths in game coordinates -> body-skeleton-art.js.
 *
 * Chunks = Bones refinement actions (skull, spine, ribs, arms, hands, legs, feet) plus a procedural
 * `marrow` made from eroded long-bone interiors. Pixels are assigned to chunks by region rules below
 * (game coords, mirrored about the centre line), so refining one action only changes its own bones.
 *
 * Run: node scripts/trace-body-skeleton-reference.js [--debug]
 * Needs: npm install (jimp, potrace)
 */
const fs = require('fs');
const path = require('path');
const raster = require('./lib/skeleton-raster');

const root = path.join(__dirname, '..');
const refPath = path.join(root, 'art/body-chamber/skeleton-reference.png');
const outJs = path.join(root, 'body-skeleton-art.js');
const CX = 104;

/** Region rules in game coords; u = distance from the centre line. First match wins. */
function chunkAt(x, y) {
    const u = Math.abs(x - CX);
    if (y < 24.6) return 'skull';
    if (y > 186) return 'feet';
    if (y > 92.5 && u > 36) return 'hands';
    if (y <= 100.8 && u > 17.5) return 'arms';
    if (y < 40.6 && u > 3.6) return 'arms';
    if (u < 3.8 && (y < 37.5 || y >= 60.5) && y < 84) return 'spine';
    if (u < 6.4 && y >= 84 && y < 97.5) return 'spine';
    if (y < 78.5) return 'ribs';
    return 'legs';
}

const CHUNKS = ['skull', 'spine', 'ribs', 'arms', 'hands', 'legs', 'feet'];

/** Chunks traced per side with their own local registration to the shell (the generated limbs drift slightly). */
const PER_SIDE = {
    hands: { box: { x0: 40, x1: 76, y0: 88, y1: 124 } },
    feet: { box: { x0: 74, x1: 102, y0: 184, y1: 208 } }
};

/** Chamfer distance to the nearest non-mask pixel. */
function distanceTransform(mask, W, H) {
    const INF = 1e9, D = 1, DD = 1.4142;
    const dist = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) dist[i] = mask[i] ? INF : 0;
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        const k = y * W + x;
        if (!dist[k]) continue;
        dist[k] = Math.min(dist[k], dist[k - 1] + D, dist[k - W] + D, dist[k - W - 1] + DD, dist[k - W + 1] + DD);
    }
    for (let y = H - 2; y > 0; y--) for (let x = W - 2; x > 0; x--) {
        const k = y * W + x;
        if (!dist[k]) continue;
        dist[k] = Math.min(dist[k], dist[k + 1] + D, dist[k + W] + D, dist[k + W + 1] + DD, dist[k + W - 1] + DD);
    }
    return dist;
}

/** Central strip of each bone in `zone`: pixels deeper than `frac` of the local max depth (the bone's half-width). */
function boneCore(zone, W, H, frac, win) {
    const dist = distanceTransform(zone, W, H);
    const out = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const k = y * W + x;
        if (!zone[k] || dist[k] < 2) continue;
        let m = 0;
        for (let dy = -win; dy <= win; dy += 2) for (let dx = -win; dx <= win; dx += 2) {
            const nx = x + dx, ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
            const v = dist[ny * W + nx];
            if (v > m) m = v;
        }
        if (dist[k] >= frac * m) out[k] = 1;
    }
    return out;
}

function dropSmallBlobs(mask, W, H, minPx) {
    const seen = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) {
        if (!mask[i] || seen[i]) continue;
        const comp = [i];
        seen[i] = 1;
        for (let q = 0; q < comp.length; q++) {
            const k = comp[q], x = k % W, y = (k / W) | 0;
            for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
                if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
                const nk = ny * W + nx;
                if (mask[nk] && !seen[nk]) { seen[nk] = 1; comp.push(nk); }
            }
        }
        if (comp.length < minPx) for (const k of comp) mask[k] = 0;
    }
}

function transformPath(d, s, tx, ty) {
    const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [];
    const out = [];
    let i = 0;
    for (const t of tokens) {
        if (/[A-Za-z]/.test(t)) { out.push(t); i = 0; continue; }
        const n = parseFloat(t);
        out.push(+(n * s + (i % 2 === 0 ? tx : ty)).toFixed(2));
        i++;
    }
    return out.join(' ');
}

function trace(potrace, Jimp, mask, W, H) {
    return new Promise((resolve, reject) => {
        const img = new Jimp({ width: W, height: H, color: 0xffffffff });
        for (let i = 0; i < W * H; i++) if (mask[i]) img.bitmap.data.writeUInt32BE(0x000000ff, i * 4);
        img.getBuffer('image/png').then(buf => {
            potrace.trace(buf, { turdSize: 6, optTolerance: 0.5, color: 'black', background: 'transparent' }, (err, svg) => {
                if (err) return reject(err);
                const paths = [...svg.matchAll(/\sd="([^"]+)"/g)].map(m => m[1]);
                resolve(paths.join(' '));
            });
        }, reject);
    });
}

async function main() {
    if (!fs.existsSync(refPath)) {
        console.error('Missing', refPath);
        process.exit(1);
    }
    const { Jimp } = require('jimp');
    const potrace = require('potrace');
    const im = await raster.loadSkeletonImage(refPath);
    const { W, H } = im;
    const fig = raster.figureMask(im);
    const t = raster.fitTransform(fig, W, H, raster.shellPolygon());
    console.log(`fit: scale ${t.s.toFixed(5)} t=(${t.tx.toFixed(2)}, ${t.ty.toFixed(2)}) IoU vs #sil-shell ${t.iou.toFixed(3)}`);
    const bone = raster.boneMask(im, fig);
    dropSmallBlobs(bone, W, H, 12);

    const masks = {};
    CHUNKS.forEach(c => { masks[c] = new Uint8Array(W * H); });
    const counts = {};
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const k = y * W + x;
        if (!bone[k]) continue;
        const c = chunkAt(x * t.s + t.tx, y * t.s + t.ty);
        masks[c][k] = 1;
        counts[c] = (counts[c] || 0) + 1;
    }

    // Marrow: central core of the long bones only (femur, tibia, humerus, forearm).
    const marrowZone = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const k = y * W + x;
        const gx = x * t.s + t.tx, gy = y * t.s + t.ty, u = Math.abs(gx - CX);
        const leg = u > 5 && ((gy > 114 && gy < 140) || (gy > 164 && gy < 183));
        const humerus = u > 18 && gy > 47 && gy < 92;
        marrowZone[k] = bone[k] && (leg || humerus) ? 1 : 0;
    }
    const marrow = boneCore(marrowZone, W, H, 0.62, 14);
    dropSmallBlobs(marrow, W, H, 80);

    const chunks = {};
    const shell = raster.shellPolygon();
    for (const c of CHUNKS) {
        if (!PER_SIDE[c]) {
            chunks[c] = transformPath(await trace(potrace, Jimp, masks[c], W, H), t.s, t.tx, t.ty);
            continue;
        }
        const parts = [];
        for (const side of ['L', 'R']) {
            const box = side === 'L' ? PER_SIDE[c].box : { x0: 208 - PER_SIDE[c].box.x1, x1: 208 - PER_SIDE[c].box.x0, y0: PER_SIDE[c].box.y0, y1: PER_SIDE[c].box.y1 };
            const sideMask = new Uint8Array(W * H);
            for (let i = 0; i < W * H; i++) {
                if (!masks[c][i]) continue;
                const gx = (i % W) * t.s + t.tx;
                if ((side === 'L') === (gx < CX)) sideMask[i] = 1;
            }
            const local = raster.refineTransform(t, fig, W, H, shell, box);
            console.log(`  ${c}-${side}: IoU ${local.startIou.toFixed(3)} -> ${local.iou.toFixed(3)} (scale x${(local.s / t.s).toFixed(3)})`);
            parts.push(transformPath(await trace(potrace, Jimp, sideMask, W, H), local.s, local.tx, local.ty));
        }
        chunks[c] = parts.join(' ');
    }
    chunks.marrow = transformPath(await trace(potrace, Jimp, marrow, W, H), t.s, t.tx, t.ty);

    const sizes = Object.entries(chunks).map(([c, d]) => `${c}=${(d.length / 1024).toFixed(1)}KB`).join(' ');
    console.log('chunks:', sizes);
    console.log('pixels:', JSON.stringify(counts));

    const lines = Object.entries(chunks).map(([c, d]) => `    ${c}: '${d}'`);
    fs.writeFileSync(outJs, `// Generated by scripts/trace-body-skeleton-reference.js from art/body-chamber/skeleton-reference.png — do not edit.\n`
        + `// One filled path per Bones refinement chunk, in game coordinates (viewBox 206.326).\n`
        + `const BODY_SKELETON_ART = {\n${lines.join(',\n')}\n};\n`);
    console.log('wrote', outJs);

    if (process.argv.includes('--debug')) {
        const S = 5;
        const out = new Jimp({ width: 208 * S, height: 208 * S, color: 0x101010ff });
        const colors = { skull: 0xe0e0e0ff, spine: 0xffd060ff, ribs: 0x60c0ffff, arms: 0x80ff80ff, hands: 0xff80c0ff, legs: 0xc080ffff, feet: 0xff9040ff };
        for (let y = 0; y < 208 * S; y++) for (let x = 0; x < 208 * S; x++) {
            const px = Math.round((x / S - t.tx) / t.s), py = Math.round((y / S - t.ty) / t.s);
            if (px < 0 || py < 0 || px >= W || py >= H) continue;
            const k = py * W + px;
            let col = fig[k] ? 0x303030ff : 0x101010ff;
            for (const c of CHUNKS) if (masks[c][k]) col = colors[c];
            if (marrow[k]) col = 0xff2020ff;
            out.setPixelColor(col, x, y);
        }
        await out.write('/tmp/fit/chunks-debug.png');
    }
}

main().catch(e => { console.error(e); process.exit(1); });
