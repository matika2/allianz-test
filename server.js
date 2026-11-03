const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/ertekeles') {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => {
      try {
        const d = JSON.parse(body);
        if (![d.name, d.title, d.text].every((v) => typeof v === 'string' && v.trim())) throw new Error('missing field');
        console.log('Új értékelés:', JSON.stringify(d, null, 2));
        res.writeHead(204).end();
      } catch {
        res.writeHead(400).end('Hibás adatok');
      }
    });
    return;
  }
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return fs.createReadStream(path.join(__dirname, 'public', 'index.html')).pipe(res);
  }
  res.writeHead(404).end();
}).listen(PORT, () => console.log(`http://localhost:${PORT}`));
