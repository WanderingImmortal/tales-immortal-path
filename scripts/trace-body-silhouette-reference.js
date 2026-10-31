'use strict';
/**
 * Trace art/body-chamber/reference.png → SVG path in game coordinates.
 * Requires: npm install potrace jimp  (from repo root; creates local node_modules)
 *
 * Run: node scripts/trace-body-silhouette-reference.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const refPath = path.join(root, 'art/body-chamber/reference.png');
const outSvg = path.join(root, 'art/body-chamber/traced.svg');
const outD = path.join(root, 'art/body-chamber/sil-shell-path.txt');

const VIEW = 206.326;
const CX = 104;
const CROWN = 1;
const SOLE = 205;

function loadDeps() {
    try {
        const { Jimp } = require('jimp');
        return { Jimp, potrace: require('potrace') };
    } catch (e) {
        console.error('Missing deps. From repo root run: npm install potrace jimp');
        process.exit(1);
    }
}

function parsePathBounds(d) {
    const nums = (d.match(/-?\d*\.?\d+/g) || []).map(Number);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i + 1 < nums.length; i += 2) {
        const x = nums[i], y = nums[i + 1];
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        minX = Math.min(minX, x); maxX = Math.max(maxX, x);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
    return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

function transformPath(d, sx, sy, tx, ty) {
    let i = 0;
    const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+/g) || [];
    let cmd = '';
    const out = [];
    for (const t of tokens) {
        if (/[A-Za-z]/.test(t)) {
            cmd = t;
            out.push(t);
            i = 0;
            continue;
        }
        const n = parseFloat(t);
        if (i % 2 === 0) out.push(+(n * sx + tx).toFixed(3));
        else out.push(+(n * sy + ty).toFixed(3));
        i++;
    }
    return out.join(' ');
}

async function main() {
    if (!fs.existsSync(refPath)) {
        console.error('Missing', refPath);
        console.error('Save your generated silhouette as art/body-chamber/reference.png');
        process.exit(1);
    }
    const { Jimp, potrace } = loadDeps();
    const img = await Jimp.read(refPath);
    img.greyscale().contrast(0.55).normalize();
    const buf = await img.getBuffer('image/png');

    const traced = await new Promise((resolve, reject) => {
        potrace.trace(buf, { turdSize: 4, optTolerance: 0.65, color: 'black', background: 'transparent' }, (err, svg) => {
            if (err) reject(err);
            else resolve(svg);
        });
    });

    const m = traced.match(/\sd="([^"]+)"/);
    if (!m) throw new Error('potrace did not return a path');
    let d = m[1];
    const b = parsePathBounds(d);
    const targetH = SOLE - CROWN;
    const scale = Math.min((VIEW * 0.88) / b.w, targetH / b.h);
    const cx = (b.minX + b.maxX) / 2;
    const cy = (b.minY + b.maxY) / 2;
    const tx = CX - cx * scale;
    const ty = (CROWN + SOLE) / 2 - cy * scale;
    d = transformPath(d, scale, scale, tx, ty);

    fs.mkdirSync(path.dirname(outSvg), { recursive: true });
    fs.writeFileSync(outSvg, `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW} ${VIEW}"><path id="sil-shell" fill="#1e1e1e" d="${d}"/></svg>\n`);
    fs.writeFileSync(outD, d + '\n');
    console.log('OK traced →', outSvg);
    console.log('OK path d  →', outD);
    console.log('Next: node scripts/apply-body-silhouette-shell.js');
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
