'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const m = html.match(/<svg class="body-silhouette-svg"[\s\S]*?<\/svg>/);
if (!m) throw new Error('svg missing');
const out = `<!DOCTYPE html>
<html><head>
<link rel="stylesheet" href="${path.join(root, 'style.css')}"/>
<style>
body{background:#12100e;margin:20px}
.body-silhouette-wrap{padding:12px;border:1px solid #3a3530;border-radius:12px;background:rgba(0,0,0,.2)}
svg{width:420px;height:auto;display:block}
</style></head>
<body><div class="body-silhouette-wrap">${m[0]}</div></body></html>`;
const dest = process.argv[2] || '/tmp/body-sil-preview.html';
fs.writeFileSync(dest, out);
console.log('wrote', dest);
