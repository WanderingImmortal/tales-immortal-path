/**
 * Serve the combat reaction sandbox (static).
 * Run: node scripts/serve-combat-sandbox-lab.js
 * Open: http://127.0.0.1:4174/prototype/combat-sandbox/lab/index.html
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const bundle = path.join(root, 'prototype', 'combat-sandbox', 'dist', 'lab-bundle.js');
if (!fs.existsSync(bundle)) {
    execSync('node scripts/bundle-combat-sandbox-lab.js', { cwd: root, stdio: 'inherit' });
}

const PORT = 4174;
const MIME = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/prototype/combat-sandbox/lab/index.html';
    const filePath = path.join(root, urlPath);
    if (!filePath.startsWith(root)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Combat sandbox: http://127.0.0.1:${PORT}/prototype/combat-sandbox/lab/index.html`);
});
