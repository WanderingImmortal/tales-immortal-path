/**
 * Render the traced skeleton chunks over #sil-shell + joint patches; chunks that spill past the shell are tinted.
 * Run: node scripts/render-body-bone-fit.js [out.svg] [--view=x,y,w,h] [--only=bone-id,...] [--refine=hands]
 * --refine=<chunk> draws that chunk (bone `action`) fully refined and every other chunk dim,
 * to preview that a refinement action only changes its own bones.
 * PNG is written next to the SVG via headless Chrome when available.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { loadBodyBoneDefs } = require('./lib/body-bone-defs');
const { flattenPath, signedClearance } = require('./lib/body-fit-geometry');
const { requiredClearance } = require('./lib/body-bone-clearance');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const flag = name => (args.find(a => a.startsWith(`--${name}=`)) || '').slice(name.length + 3);
const view = flag('view') ? flag('view').split(',').map(Number) : [0, 0, 208, 208];
const only = flag('only') ? flag('only').split(',') : null;
const refine = flag('refine') || null;
const out = args.find(a => !a.startsWith('--')) || '/tmp/fit/bone-fit.svg';

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const shellD = html.match(/id="sil-shell"\s+d="([^"]+)"/)[1];
const patches = [...html.matchAll(/<path id="(sil-patch-[^"]+)" d="([^"]+)"/g)].map(m => ({ id: m[1], d: m[2] }));
const { BODY_BONE_DEFS } = loadBodyBoneDefs();
const polys = [flattenPath(shellD, 6), ...patches.map(p => flattenPath(p.d, 6))];

const bones = BODY_BONE_DEFS
    .filter(b => !only || only.some(o => b.id.includes(o)))
    .map(b => {
        const need = requiredClearance(b.kind);
        const clr = Math.min(...flattenPath(b.d, 4).map(([x, y]) => signedClearance(x, y, [polys[0]])));
        return { ...b, clr, need };
    });
const bad = bones.filter(b => !(b.clr >= b.need));

function gridLines() {
    const step = view[2] <= 40 ? 2 : view[2] <= 80 ? 5 : 10;
    const lines = [];
    const sw = view[2] / 1500;
    for (let x = Math.ceil(view[0] / step) * step; x < view[0] + view[2]; x += step) {
        lines.push(`<line x1="${x}" y1="${view[1]}" x2="${x}" y2="${view[1] + view[3]}" stroke="#333" stroke-width="${sw}"/>`);
        lines.push(`<text x="${x + 0.2}" y="${view[1] + view[2] / 60}" font-size="${view[2] / 90}" fill="#668">${x}</text>`);
    }
    for (let y = Math.ceil(view[1] / step) * step; y < view[1] + view[3]; y += step) {
        lines.push(`<line x1="${view[0]}" y1="${y}" x2="${view[0] + view[2]}" y2="${y}" stroke="#333" stroke-width="${sw}"/>`);
        lines.push(`<text x="${view[0] + 0.2}" y="${y - 0.2}" font-size="${view[2] / 90}" fill="#668">${y}</text>`);
    }
    return lines.join('\n');
}

const strokeScale = Math.max(0.35, view[2] / 208 * 1.6);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view.join(' ')}" width="1040" height="1040">
<defs><filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${0.5 * strokeScale}" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
<rect x="${view[0]}" y="${view[1]}" width="${view[2]}" height="${view[3]}" fill="#12100e"/>
<path d="${shellD}" fill="#2a2724" stroke="#6a625a" stroke-width="${0.3 * strokeScale}"/>
${patches.map(p => `<path d="${p.d}" fill="#3a3430" stroke="#8a6a3a" stroke-width="${0.2 * strokeScale}"/>`).join('\n')}
${gridLines()}
${bones.map(b => {
    let col = b.clr < b.need ? '#ff5040' : '#d8d4d0';
    if (refine) col = b.action === refine ? '#f2efe9' : '#5a5650';
    const fill = b.kind === 'marrow' ? 'rgba(200,70,70,.85)' : col;
    const glow = refine && b.action === refine ? ' filter="url(#glow)"' : '';
    return `<path d="${b.d}" data-chunk="${b.action}" fill="${fill}" fill-rule="evenodd" fill-opacity="${refine && b.action !== refine ? 0.5 : 0.92}"${glow}/>`;
}).join('\n')}
</svg>`;
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, svg);
console.log(`${bad.length}/${bones.length} bones under required clearance (red = outside shell, amber = too close)`);
bad.sort((a, b) => a.clr - b.clr).forEach(b => console.log(`  ${b.id}: ${b.clr.toFixed(2)} (need ${b.need})`));

const png = out.replace(/\.svg$/, '.png');
try {
    fs.rmSync(png, { force: true });
    execFileSync('google-chrome', ['--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
        '--window-size=1040,1040', `--screenshot=${png}`, `file://${path.resolve(out)}`], { stdio: 'ignore', timeout: 25000, killSignal: 'SIGKILL' });
} catch (e) { /* headless Chrome may linger after writing the screenshot */ }
console.log(fs.existsSync(png) ? `wrote ${png}` : '(no PNG: chrome unavailable)');
