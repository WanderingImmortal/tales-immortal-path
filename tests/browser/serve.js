const { readFile } = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png'
};

http.createServer(async (request, response) => {
    try {
        const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
        const file = path.resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
        const relative = path.relative(root, file);
        if (path.isAbsolute(relative) || relative.split(path.sep).some(part => part.startsWith('.'))) {
            response.writeHead(404).end();
            return;
        }

        const data = await readFile(file);
        const type = contentTypes[path.extname(file)] || 'application/octet-stream';
        response.writeHead(200, { 'Content-Type': type }).end(data);
    } catch (error) {
        const missing = ['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code);
        const status = error instanceof URIError ? 400 : missing ? 404 : 500;
        response.writeHead(status).end();
    }
}).listen(4175, '127.0.0.1');
