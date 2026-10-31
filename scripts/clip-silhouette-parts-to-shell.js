/**
 * Intersect each sil-* part polygon with #sil-shell — parts become subsets of the visible trace.
 *
 * Run: node scripts/clip-silhouette-parts-to-shell.js
 * Write: node scripts/clip-silhouette-parts-to-shell.js --write
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { intersection } = require('polygon-clipping');
const { flattenPath, polygonToPathD, cleanRing, pointInPoly } = require('./lib/body-sil-path-utils');
const { parts: GENERATED, ORDER, PATCH_IDS } = require('./build-body-silhouette-parts.js');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'index.html');

const CLIP_PART_IDS = ORDER.filter(id => id !== 'sil-shell' && !id.startsWith('sil-patch'));

function readPathD(html, id) {
    const re = new RegExp(`<path\\s+id="${id}"\\s+d="([^"]+)"`);
    const m = html.match(re);
    return m ? m[1] : null;
}

function ringFromPath(d, samples = 12) {
    return cleanRing(flattenPath(d, samples), true);
}

function largestRing(multi) {
    let best = null;
    let bestArea = 0;
    for (const poly of multi) {
        for (const ring of poly) {
            if (ring.length < 4) continue;
            let area = 0;
            for (let i = 0; i < ring.length - 1; i++) {
                area += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
            }
            area = Math.abs(area / 2);
            if (area > bestArea) {
                bestArea = area;
                best = ring;
            }
        }
    }
    return best;
}

function clipPartToShell(shellRing, partD) {
    const partRing = ringFromPath(partD);
    if (partRing.length < 4) return null;
    const shellPoly = [shellRing];
    const partPoly = [partRing];
    let result;
    try {
        result = intersection(shellPoly, partPoly);
    } catch (e) {
        console.error('clip failed:', e.message);
        return null;
    }
    const ring = largestRing(result);
    if (!ring || ring.length < 4) return null;
    return polygonToPathD(ring);
}

function simplifyShellRing(ring, maxPts = 800) {
    if (ring.length <= maxPts) return ring;
    const step = Math.ceil(ring.length / maxPts);
    const out = [];
    for (let i = 0; i < ring.length - 1; i += step) out.push(ring[i]);
    out.push(ring[0]);
    return cleanRing(out, true);
}

function main() {
    const write = process.argv.includes('--write');
    let html = fs.readFileSync(htmlPath, 'utf8');
    const shellD = readPathD(html, 'sil-shell');
    if (!shellD) {
        console.error('missing #sil-shell');
        process.exit(1);
    }

    const shellRing = simplifyShellRing(ringFromPath(shellD, 4), 900);
    console.log(`Shell ring: ${shellRing.length} vertices`);

    const clipped = {};
    let changed = 0;
    let failed = 0;

    for (const id of CLIP_PART_IDS) {
        const sourceD = readPathD(html, id) || GENERATED[id];
        if (!sourceD) {
            console.warn('skip (no path):', id);
            continue;
        }
        const outD = clipPartToShell(shellRing, sourceD);
        if (!outD) {
            console.warn('WARN empty clip:', id);
            failed++;
            clipped[id] = sourceD;
            continue;
        }
        clipped[id] = outD;
        if (outD !== sourceD) changed++;
        const samples = ringFromPath(outD, 8);
        let outside = 0;
        samples.forEach(([x, y]) => { if (!pointInPoly(x, y, shellRing)) outside++; });
        console.log(`${id}: ${samples.length} pts, outside shell sample: ${outside}`);
    }

    console.log(`\nClipped ${CLIP_PART_IDS.length} parts (${changed} changed, ${failed} empty/fallback)`);

    if (!write) {
        console.log('\nPass --write to patch index.html path d attributes.');
        return;
    }

    for (const [id, d] of Object.entries(clipped)) {
        const re = new RegExp(`(<path\\s+id="${id}"\\s+d=")([^"]+)(")`, 'm');
        if (!re.test(html)) {
            console.warn('path id not in html:', id);
            continue;
        }
        html = html.replace(re, `$1${d}$3`);
    }

    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('Wrote', htmlPath);
}

main();
