/**
 * Serve the property-alchemy dev laboratory (static).
 * Run: node scripts/serve-alchemy-lab.js
 * Open: http://127.0.0.1:4173/sandbox/alchemy/
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const bundle = path.join(root, 'sandbox', 'alchemy', 'lab-bundle.js');
if (!fs.existsSync(bundle)) {
    execSync('node scripts/bundle-alchemy-lab.js', { cwd: root, stdio: 'inherit' });
}

const PORT = 4173;
const MIME = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json'
};

const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/' || urlPath === '/sandbox/alchemy' || urlPath === '/sandbox/alchemy/') {
        urlPath = '/sandbox/alchemy/index.html';
    }
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
    console.log(`Alchemy lab: http://127.0.0.1:${PORT}/sandbox/alchemy/`);
});
