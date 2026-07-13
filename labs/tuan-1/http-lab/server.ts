import http, { type IncomingHttpHeaders, type Server, type ServerResponse } from 'node:http';
import { URL } from 'node:url';

const HOST = '127.0.0.1';
const PAGE_PORT = 3000;
const API_PORT = 4000;
const PAGE_ORIGIN = `http://${HOST}:${PAGE_PORT}`;

function log(event: string, fields: Record<string, unknown> = {}): void {
  const safe: Record<string, unknown> = { ...fields };
  delete safe.authorization;
  delete safe.cookie;
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), event, ...safe }));
}

function sendJson(res: ServerResponse, status: number, body: unknown, headers: http.OutgoingHttpHeaders = {}): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(payload),
    ...headers,
  });
  res.end(payload);
}

function sendEmpty(res: ServerResponse, status: number, headers: http.OutgoingHttpHeaders = {}): void {
  res.writeHead(status, headers);
  res.end();
}

function corsHeaders(req: http.IncomingMessage): http.OutgoingHttpHeaders {
  return req.headers.origin === PAGE_ORIGIN
    ? { 'Access-Control-Allow-Origin': PAGE_ORIGIN, Vary: 'Origin' }
    : {};
}

function safeRequestHeaders(headers: IncomingHttpHeaders): Record<string, string | string[] | undefined> {
  const result: Record<string, string | string[] | undefined> = {};
  for (const [name, value] of Object.entries(headers)) {
    if (['authorization', 'cookie', 'proxy-authorization'].includes(name.toLowerCase())) {
      result[name] = '[REDACTED]';
    } else {
      result[name] = value;
    }
  }
  return result;
}

function readBody(req: http.IncomingMessage, maxBytes = 64 * 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;

    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('BODY_TOO_LARGE'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const pageHtml = `<!doctype html>
<html lang="vi">
<head><meta charset="utf-8"><title>HTTP/CORS Lab Origin</title></head>
<body>
  <h1>HTTP/CORS Lab</h1>
  <p>Origin hiện tại: <code>${PAGE_ORIGIN}</code></p>
  <p>Mở DevTools → Console/Network và chạy các lệnh trong study/tuan-1/thu-5.md.</p>
</body>
</html>`;

const pageServer = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/index.html')) {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': Buffer.byteLength(pageHtml),
      'Cache-Control': 'no-store',
    });
    res.end(pageHtml);
    return;
  }
  sendJson(res, 404, { error: { code: 'PAGE_NOT_FOUND', message: 'Lab page not found' } });
});

const apiServer = http.createServer(async (req, res) => {
  const startedAt = Date.now();
  const url = new URL(req.url ?? '/', `http://${req.headers.host ?? `${HOST}:${API_PORT}`}`);

  log('request.received', {
    method: req.method,
    path: url.pathname,
    origin: req.headers.origin,
  });

  res.on('finish', () => {
    log('response.finished', {
      method: req.method,
      path: url.pathname,
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  try {
    if (req.method === 'GET' && url.pathname === '/health') {
      sendJson(res, 200, { status: 'ok', service: 'http-lab' });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/echo') {
      sendJson(res, 200, {
        method: req.method,
        path: url.pathname,
        headers: safeRequestHeaders(req.headers),
      });
      return;
    }

    const statusMatch = url.pathname.match(/^\/status\/(\d{3})$/);
    if (req.method === 'GET' && statusMatch) {
      const status = Number(statusMatch[1]);
      if (status < 100 || status > 599) {
        sendJson(res, 400, { error: { code: 'INVALID_STATUS', message: 'Status must be 100-599' } });
        return;
      }
      if (status === 204 || status === 304 || status < 200) {
        sendEmpty(res, status);
      } else {
        sendJson(res, status, { status, message: `Intentional HTTP ${status} for the lab` });
      }
      return;
    }

    if (req.method === 'GET' && url.pathname === '/delay') {
      const requestedMs = Number(url.searchParams.get('ms') ?? '0');
      const delayMs = Number.isFinite(requestedMs)
        ? Math.max(0, Math.min(requestedMs, 10_000))
        : 0;
      let completed = false;
      const timer = setTimeout(() => {
        if (res.destroyed) return;
        completed = true;
        sendJson(res, 200, { delayedMs: delayMs });
      }, delayMs);

      res.on('close', () => {
        clearTimeout(timer);
        if (!completed) {
          log('response.closed_before_finish', { path: url.pathname, delayMs });
        }
      });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/cache/book') {
      const etag = '"book-v1"';
      const headers = { ETag: etag, 'Cache-Control': 'private, max-age=0, must-revalidate' };
      if (req.headers['if-none-match'] === etag) {
        sendEmpty(res, 304, headers);
      } else {
        sendJson(res, 200, { id: 'book-1', title: 'HTTP Mental Models', version: 1 }, headers);
      }
      return;
    }

    if (req.method === 'GET' && url.pathname === '/cookie/set') {
      sendJson(
        res,
        200,
        { cookieSet: true },
        { 'Set-Cookie': 'lab_session=lab-only; HttpOnly; SameSite=Lax; Path=/' },
      );
      return;
    }

    if (req.method === 'GET' && url.pathname === '/cookie/show') {
      const cookieHeader = req.headers.cookie ?? '';
      sendJson(res, 200, { hasLabSession: /(?:^|;\s*)lab_session=/.test(cookieHeader) });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/cors/simple-allow') {
      sendJson(res, 200, { cors: 'allowed', kind: 'simple' }, corsHeaders(req));
      return;
    }

    if (req.method === 'GET' && url.pathname === '/cors/simple-deny') {
      sendJson(res, 200, { cors: 'header intentionally omitted', kind: 'simple' });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/cors/http-403') {
      sendJson(
        res,
        403,
        { error: { code: 'LAB_FORBIDDEN', message: 'Intentional HTTP 403 with CORS allowed' } },
        corsHeaders(req),
      );
      return;
    }

    if (url.pathname === '/cors/preflight-allow' && req.method === 'OPTIONS') {
      sendEmpty(res, 204, {
        ...corsHeaders(req),
        'Access-Control-Allow-Methods': 'PUT, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Lab-Name',
        'Access-Control-Max-Age': '60',
      });
      return;
    }

    if (url.pathname === '/cors/preflight-allow' && req.method === 'PUT') {
      const rawBody = await readBody(req);
      let body: unknown;
      try {
        body = rawBody ? JSON.parse(rawBody) : null;
      } catch {
        sendJson(
          res,
          400,
          { error: { code: 'INVALID_JSON', message: 'Body must be valid JSON' } },
          corsHeaders(req),
        );
        return;
      }
      sendJson(res, 200, { updated: true, received: body }, corsHeaders(req));
      return;
    }

    if (url.pathname === '/cors/preflight-deny' && req.method === 'OPTIONS') {
      sendJson(res, 403, {
        error: { code: 'PREFLIGHT_DENIED', message: 'CORS headers intentionally omitted' },
      });
      return;
    }

    if (url.pathname === '/cors/preflight-deny') {
      sendJson(res, 200, { warning: 'A conforming browser should not send this actual request' });
      return;
    }

    sendJson(res, 404, { error: { code: 'ROUTE_NOT_FOUND', message: 'Lab route not found' } });
  } catch (error) {
    log('request.failed', {
      method: req.method,
      path: url.pathname,
      errorCode: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
    });
    if (!res.headersSent && !res.destroyed) {
      sendJson(res, 500, { error: { code: 'LAB_INTERNAL_ERROR', message: 'Lab request failed' } });
    }
  }
});

function listen(server: Server, port: number, label: string): void {
  server.on('error', (error) => {
    if ((error as NodeJS.ErrnoException).code === 'EADDRINUSE') {
      console.error(`${label} cannot start: ${HOST}:${port} is already in use.`);
    } else {
      console.error(`${label} cannot start:`, error);
    }
    process.exitCode = 1;
  });
  server.listen(port, HOST, () => log('server.started', { label, url: `http://${HOST}:${port}` }));
}

listen(pageServer, PAGE_PORT, 'page');
listen(apiServer, API_PORT, 'api');

function shutdown(signal: NodeJS.Signals): void {
  log('server.shutdown_started', { signal });
  let pending = 2;
  const done = () => {
    pending -= 1;
    if (pending === 0) process.exit(0);
  };
  pageServer.close(done);
  apiServer.close(done);
  setTimeout(() => process.exit(1), 2_000).unref();
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
