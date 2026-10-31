'use strict';
/**
 * Write sil-* path defs from build-body-silhouette-parts.js into index.html.
 * Run: node scripts/sync-body-silhouette-parts.js
 */
const fs = require('fs');
const path = require('path');
const { parts, ORDER, PATCH_IDS } = require('./build-body-silhouette-parts.js');

const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const pathBlock = ORDER.map(id =>
    `                            <path id="${id}" d="${parts[id]}"/>`
).join('\n');

const startMarker = '<!-- Phase 1 part silhouette — docs/ideas/body-chamber-anatomy-rebuild.md; regenerate via scripts/build-body-silhouette-parts.js -->';
const endMarker = '                            <mask id="body-mask-silhouette-only"';
const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);
if (startIdx < 0 || endIdx < 0) throw new Error('silhouette block markers not found');
html = html.slice(0, startIdx + startMarker.length + 1) + '\n' + pathBlock + '\n' + html.slice(endIdx);

function insertUsesAfter(hay, anchor, ids, indent, className) {
    const lines = ids.map(id => `${indent}<use href="#${id}"${className ? ` class="${className}"` : ''}/>`).join('\n');
    const pos = hay.indexOf(anchor);
    if (pos < 0) throw new Error('anchor not found: ' + anchor);
    const insertAt = pos + anchor.length;
    return hay.slice(0, insertAt) + '\n' + lines + hay.slice(insertAt);
}

const patchUseLines = PATCH_IDS.map(id =>
    `                            <use href="#${id}" class="body-sil-base-shape body-sil-joint-patch"/>`
).join('\n');

if (!html.includes('body-sil-joint-patch')) {
    html = html.replace(
        '                            <use href="#sil-foot-r" class="body-sil-base-shape"/>',
        '                            <use href="#sil-foot-r" class="body-sil-base-shape"/>\n' + patchUseLines
    );
    const maskAnchor = '                                <use href="#sil-foot-r" fill="white"/>';
    const patchMask = PATCH_IDS.map(id =>
        `                                <use href="#${id}" fill="white"/>`
    ).join('\n');
    html = html.replace(maskAnchor, maskAnchor + '\n' + patchMask);

    const skinAnchor = '                                <use href="#sil-foot-r" class="body-sil-skin-full"/>';
    const patchSkin = PATCH_IDS.map(id =>
        `                                <use href="#${id}" class="body-sil-skin-full"/>`
    ).join('\n');
    html = html.replace(skinAnchor, skinAnchor + '\n' + patchSkin);
} else {
    // Re-sync mask/skin/base patch uses if paths changed
    html = html.replace(
        /<use href="#sil-patch-[^"]+" class="body-sil-base-shape body-sil-joint-patch"\/>[\n]?/g,
        ''
    );
    html = html.replace(
        '                            <use href="#sil-foot-r" class="body-sil-base-shape"/>',
        '                            <use href="#sil-foot-r" class="body-sil-base-shape"/>\n' + patchUseLines
    );
}

fs.writeFileSync(htmlPath, html);
console.log('Synced', ORDER.length, 'sil paths to index.html');
