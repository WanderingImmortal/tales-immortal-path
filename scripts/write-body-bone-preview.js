/**
 * Static in-page preview of the real bone overlay (index.html SVG + style.css + BODY_BONE_DEFS)
 * with chosen per-chunk fill, no game state needed.
 * Run: node scripts/write-body-bone-preview.js [out.html] [--fill=hands:1,arms:0.5,...] [--default=0.2]
 * Screenshot: google-chrome --headless=new --screenshot=out.png --window-size=700,1000 file://out.html
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { loadBodyBoneDefs } = require('./lib/body-bone-defs');

const root = path.join(__dirname, '..');
const args = process.argv.slice(2);
const flag = n => (args.find(a => a.startsWith(`--${n}=`)) || '').slice(n.length + 3);
const out = args.find(a => !a.startsWith('--')) || '/tmp/body-bone-preview.html';
const fills = Object.fromEntries((flag('fill') || '').split(',').filter(Boolean).map(p => p.split(':')).map(([k, v]) => [k, parseFloat(v)]));
const dflt = flag('default') ? parseFloat(flag('default')) : 0.2;

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const svg = html.match(/<svg class="body-silhouette-svg"[\s\S]*?<\/svg>/)[0];
const { BODY_BONE_DEFS } = loadBodyBoneDefs();

const paths = BODY_BONE_DEFS.map(b => {
    const fill = fills[b.action] ?? dflt;
    const cls = ['body-sil-bone', `body-sil-bone-${b.kind}`, 'lit'];
    if (fill >= 0.45) cls.push('mid');
    if (fill >= 0.85) cls.push('complete');
    const extra = b.kind === 'art' ? ' fill-rule="evenodd"' : (b.kind === 'marrow' ? '' : ' fill="none"');
    const vis = b.kind === 'marrow' && fill < 0.1 ? ' style="visibility:hidden"' : '';
    return `<path class="${cls.join(' ')}" data-bone-action="${b.action}" style="--part-fill:${fill}"${extra}${vis} d="${b.d}"/>`;
}).join('');
const withBones = svg.replace(/(<g class="body-sil-overlay body-sil-overlay-bones"[^>]*id="bodySilBones"[^>]*>)<\/g>/,
    (m, open) => open.replace('class="body-sil-overlay body-sil-overlay-bones"', 'class="body-sil-overlay body-sil-overlay-bones body-sil-overlay-active body-sil-overlay-mid"')
        .replace('id="bodySilBones"', 'id="bodySilBones" style="--body-layer-color:#e8e4dc;--body-layer-fill:0.5"') + paths + '</g>');
if (withBones === svg) throw new Error('bodySilBones group not found in index.html');

fs.writeFileSync(out, `<!DOCTYPE html><html><head><link rel="stylesheet" href="${path.join(root, 'style.css')}"/>
<style>body{background:#12100e;margin:0;display:flex;justify-content:center}.body-silhouette-wrap{padding:8px}.body-silhouette-wrap{width:auto;max-width:none;min-height:0;aspect-ratio:auto}.body-silhouette-wrap svg,.body-silhouette-svg{width:660px!important;height:auto!important;max-height:none!important;max-width:none!important;display:block}</style></head>
<body><div class="body-silhouette-wrap">${withBones}</div></body></html>`);
console.log('wrote', out);
