'use strict';
/**
 * Wire art/body-chamber/sil-shell-path.txt into index.html as #sil-shell (visible base + mask).
 * Run after trace-body-silhouette-reference.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dPath = path.join(root, 'art/body-chamber/sil-shell-path.txt');
const htmlPath = path.join(root, 'index.html');

if (!fs.existsSync(dPath)) {
    console.error('Missing', dPath, '— run trace script first');
    process.exit(1);
}
const d = fs.readFileSync(dPath, 'utf8').trim();
let html = fs.readFileSync(htmlPath, 'utf8');

const shellDef = `                            <path id="sil-shell" d="${d}"/>`;
if (html.includes('id="sil-shell"')) {
    html = html.replace(/<path id="sil-shell" d="[^"]*"\/>/, shellDef);
} else {
    html = html.replace(
        /(<!-- Phase 1 part silhouette[\s\S]*?\n)/,
        `$1${shellDef}\n`
    );
}

const shellUse = '<use href="#sil-shell" class="body-sil-base-shape body-sil-shell"/>';
if (!html.includes(shellUse)) {
    html = html.replace(
        '<g class="body-sil-base" aria-hidden="true">',
        '<g class="body-sil-base" aria-hidden="true">\n                            ' + shellUse
    );
}

const maskInsert = '                                <use href="#sil-shell" fill="white"/>';
if (!html.includes(maskInsert)) {
    html = html.replace(
        '<rect width="206.326" height="206.326" fill="black"/>',
        '<rect width="206.326" height="206.326" fill="black"/>\n' + maskInsert
    );
}

const skinShell = '<use href="#sil-shell" class="body-sil-skin-full body-sil-skin-shell"/>';
html = html.replace(
    /\s*<use href="#sil-shell" class="body-sil-skin-full body-sil-skin-shell"\/>[\n]?/g,
    ''
);
if (!html.includes('body-sil-skin-unified" id="bodySilSkinUnified">\n                                ' + skinShell)) {
    html = html.replace(
        '<g class="body-sil-skin-unified" id="bodySilSkinUnified">',
        `<g class="body-sil-skin-unified" id="bodySilSkinUnified">\n                                ${skinShell}`
    );
}

html = html.replace(/\s+<\/g>\s*(\n\s*<g class="body-sil-regions">)/, '\n                        </g>$1');

fs.writeFileSync(htmlPath, html);
console.log('Applied #sil-shell to index.html');
