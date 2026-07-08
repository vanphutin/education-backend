const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const { createJsonDb, ValidationError } = require('./json-db');

const PORT = Number(process.env.PORT) || 3900;
const PUBLIC_DIR = __dirname;
const DB_PATH = process.env.TRACKER_DB_PATH || path.join(__dirname, '..', 'tien-do-hoc-tap', 'progress.json');
const BACKUP_DIR = process.env.TRACKER_BACKUP_DIR || path.join(path.dirname(DB_PATH), '.progress-backups');
const MAX_BODY_BYTES = 1024 * 1024;

const jsonDb = createJsonDb({
  dbPath: DB_PATH,
  backupDir: BACKUP_DIR
});

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.ico': 'image/x-icon'
};

const ALLOWED_ORIGINS = new Set([
  `http://localhost:${PORT}`,
  `http://127.0.0.1:${PORT}`
]);

function setCorsHeaders(req, res) {
  const origin = req.headers.origin;

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Actor, X-Reason, If-Match');
}

function sendJson(res, statusCode, payload, headers = {}) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers
  });
  res.end(JSON.stringify(payload));
}

function sendError(res, error) {
  const statusCode = error.statusCode || 500;

  if (statusCode >= 500) {
    console.error(error);
  }

  sendJson(res, statusCode, {
    error: statusCode >= 500 ? 'Internal server error' : error.message,
    details: error.details
  });
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let bytes = 0;
    let settled = false;

    req.on('data', (chunk) => {
      if (settled) return;

      bytes += chunk.length;

      if (bytes > MAX_BODY_BYTES) {
        settled = true;
        reject(new ValidationError('Request body is too large.'));
        req.destroy();
        return;
      }

      body += chunk.toString('utf8');
    });

    req.on('end', () => {
      if (settled) return;

      if (!body.trim()) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new ValidationError('Invalid JSON payload.'));
      }
    });

    req.on('error', (error) => {
      if (!settled) reject(error);
    });
  });
}

function getActor(req, fallback = 'web-ui') {
  const actor = req.headers['x-actor'];

  if (typeof actor === 'string' && actor.trim()) {
    return actor.trim().slice(0, 80);
  }

  return fallback;
}

function getReason(req, fallback) {
  const reason = req.headers['x-reason'];

  if (typeof reason === 'string' && reason.trim()) {
    return reason.trim().slice(0, 240);
  }

  return fallback;
}

function getIfMatchVersion(req) {
  const value = req.headers['if-match'];
  if (!value) return undefined;

  const match = String(value).match(/\d+/);
  return match ? Number(match[0]) : undefined;
}

function getPatchOperations(payload) {
  if (Array.isArray(payload)) return payload;
  return payload.operations || payload.patch;
}

async function handleApi(req, res, url) {
  if (url.pathname === '/api/health' && req.method === 'GET') {
    const db = await jsonDb.get();

    sendJson(res, 200, {
      ok: true,
      db_path: DB_PATH,
      backup_dir: BACKUP_DIR,
      version: db._meta.version,
      updated_at: db._meta.updated_at
    });
    return true;
  }

  if (url.pathname === '/api/progress') {
    if (req.method === 'GET') {
      const db = await jsonDb.get();

      sendJson(res, 200, db, {
        ETag: `"${db._meta.version}"`,
        'Cache-Control': 'no-store'
      });
      return true;
    }

    if (req.method === 'POST') {
      const payload = await readJsonBody(req);
      const result = await jsonDb.replace(payload, {
        actor: getActor(req),
        reason: getReason(req, 'Web UI save')
      });

      sendJson(res, 200, {
        message: 'Database updated successfully',
        data: result.data,
        audit: result.audit
      });
      return true;
    }

    if (req.method === 'PATCH') {
      const payload = await readJsonBody(req);
      const result = await jsonDb.applyPatch({
        baseVersion: payload.baseVersion ?? payload.base_version ?? getIfMatchVersion(req),
        operations: getPatchOperations(payload),
        actor: payload.actor || getActor(req),
        reason: payload.reason || getReason(req, 'Patch update'),
        action: 'patch'
      });

      sendJson(res, 200, {
        message: 'Patch applied successfully',
        data: result.data,
        audit: result.audit
      });
      return true;
    }

    sendJson(res, 405, { error: 'Method not allowed' }, { Allow: 'GET, POST, PATCH' });
    return true;
  }

  if (url.pathname === '/api/mentor/apply' && req.method === 'POST') {
    const payload = await readJsonBody(req);
    const result = await jsonDb.applyPatch({
      baseVersion: payload.baseVersion ?? payload.base_version ?? getIfMatchVersion(req),
      operations: getPatchOperations(payload),
      actor: payload.actor || getActor(req, 'mentor-ai'),
      reason: payload.reason || getReason(req, 'Mentor AI patch'),
      action: 'mentor_patch'
    });

    sendJson(res, 200, {
      message: 'Mentor patch applied successfully',
      data: result.data,
      audit: result.audit
    });
    return true;
  }

  if (url.pathname === '/api/audit' && req.method === 'GET') {
    const db = await jsonDb.get();

    sendJson(res, 200, {
      version: db._meta.version,
      audit_log: db.audit_log || []
    });
    return true;
  }

  if (url.pathname === '/api/backups' && req.method === 'GET') {
    sendJson(res, 200, {
      backups: await jsonDb.listBackups()
    });
    return true;
  }

  if (url.pathname.startsWith('/api/')) {
    sendJson(res, 404, { error: 'API route not found' });
    return true;
  }

  return false;
}

function isInsideDirectory(baseDir, targetPath) {
  const relative = path.relative(baseDir, targetPath);
  return relative === '' || (!!relative && !relative.startsWith('..') && !path.isAbsolute(relative));
}

async function serveStatic(req, res, url) {
  if (!['GET', 'HEAD'].includes(req.method)) {
    sendJson(res, 405, { error: 'Method not allowed' }, { Allow: 'GET, HEAD' });
    return;
  }

  let pathname;

  try {
    pathname = decodeURIComponent(url.pathname);
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad request');
    return;
  }

  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(PUBLIC_DIR, relativePath);

  if (!isInsideDirectory(PUBLIC_DIR, filePath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  try {
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    const content = await fs.readFile(filePath);
    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': content.length,
      'Cache-Control': extname === '.html' ? 'no-store' : 'public, max-age=300'
    });

    if (req.method === 'HEAD') {
      res.end();
      return;
    }

    res.end(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }

    throw error;
  }
}

async function handleRequest(req, res) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || `localhost:${PORT}`}`);

  if (await handleApi(req, res, url)) {
    return;
  }

  await serveStatic(req, res, url);
}

const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((error) => sendError(res, error));
});

server.listen(PORT, () => {
  console.log('');
  console.log('======================================================');
  console.log('Education Tracker Server is running');
  console.log(`Dashboard: http://localhost:${PORT}`);
  console.log(`JSON DB:   ${DB_PATH}`);
  console.log(`Backups:   ${BACKUP_DIR}`);
  console.log('======================================================');
  console.log('');
});
