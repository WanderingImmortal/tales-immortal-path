/**
 * Sync sil-* parts with #sil-shell:
 *   - sil-*     = smooth parametric capsules (display, region tint)
 *   - sil-*-hit = polygon clip ∩ shell (pointer targets only)
 *
 * Run: node scripts/clip-silhouette-parts-to-shell.js --write
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { intersection } = require('polygon-clipping');
const { flattenPath, polygonToPathD, cleanRing, pointInPoly } = require('./lib/body-sil-path-utils');
const { parts: GENERATED, ORDER } = require('./build-body-silhouette-parts.js');

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
    let result;
    try {
        result = intersection([shellRing], [partRing]);
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

function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function upsertPath(html, id, d) {
    const re = new RegExp(`<path\\s+id="${escapeRegex(id)}"\\s+d="[^"]+"\\s*/>`);
    const line = `<path id="${id}" d="${d}"/>`;
    if (re.test(html)) return html.replace(re, line);
    const anchor = html.indexOf('<path id="sil-patch-shoulder-l"');
    if (anchor === -1) throw new Error('insert anchor sil-patch-shoulder-l not found');
    return html.slice(0, anchor) + `                            ${line}\n` + html.slice(anchor);
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

    for (const id of CLIP_PART_IDS) {
        const smoothD = GENERATED[id];
        if (!smoothD) {
            console.warn('skip (no generator path):', id);
            continue;
        }
        const hitD = clipPartToShell(shellRing, smoothD) || smoothD;
        console.log(`${id}: smooth capsule + hit clip (${hitD.length} chars)`);
        if (!write) continue;
        html = upsertPath(html, id, smoothD);
        html = upsertPath(html, `${id}-hit`, hitD);
    }

    if (!write) {
        console.log('\nPass --write to restore smooth sil-* and write sil-*-hit clip paths.');
        return;
    }

    fs.writeFileSync(htmlPath, html, 'utf8');
    console.log('Wrote', htmlPath);
}

main();
