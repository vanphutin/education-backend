const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const { createJsonDb, ValidationError } = require('./json-db');
const { reviewWeek, callLLM } = require('./ai-mentor-service');

// Load environment variables from local .env file synchronously if it exists
try {
  const fsSync = require('fs');
  const envPath = path.join(__dirname, '.env');
  if (fsSync.existsSync(envPath)) {
    const envContent = fsSync.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const index = trimmed.indexOf('=');
      if (index > 0) {
        const key = trimmed.substring(0, index).trim();
        const val = trimmed.substring(index + 1).trim();
        process.env[key] = val;
      }
    });
  }
} catch (err) {
  // Ignore
}

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

  if (url.pathname === '/api/mentor/review-week' && req.method === 'POST') {
    const payload = await readJsonBody(req);
    const weekNumber = Number(payload.week);
    if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 8) {
      sendJson(res, 400, { error: 'Invalid week number' });
      return true;
    }

    const db = await jsonDb.get();
    
    try {
      const reviewResult = await reviewWeek(weekNumber, db);
      
      const operations = [];
      const weekIndex = db.weeks.findIndex(w => w.week_number === weekNumber);
      if (weekIndex === -1) {
        throw new Error('Week not found');
      }

      operations.push({
        op: 'replace',
        path: `/weeks/${weekIndex}/score`,
        value: reviewResult.score
      });

      operations.push({
        op: 'replace',
        path: `/weeks/${weekIndex}/mentor_feedback`,
        value: reviewResult.mentor_feedback
      });

      if (reviewResult.days_status) {
        db.weeks[weekIndex].days.forEach((dayObj, dayIdx) => {
          const status = reviewResult.days_status[dayObj.day];
          if (status === 'DONE' || status === 'TODO') {
            operations.push({
              op: 'replace',
              path: `/weeks/${weekIndex}/days/${dayIdx}/status`,
              value: status
            });
            operations.push({
              op: 'replace',
              path: `/weeks/${weekIndex}/days/${dayIdx}/updated_at`,
              value: status === 'DONE' ? new Date().toISOString() : null
            });
          }
        });
      }

      if (reviewResult.deliverables_status) {
        db.weeks[weekIndex].deliverables.forEach((delObj, delIdx) => {
          const status = reviewResult.deliverables_status[delObj.id];
          if (status === 'COMPLETED' || status === 'PENDING') {
            operations.push({
              op: 'replace',
              path: `/weeks/${weekIndex}/deliverables/${delIdx}/status`,
              value: status
            });
          }
        });
      }

      const result = await jsonDb.applyPatch({
        baseVersion: db._meta.version,
        operations,
        actor: 'mentor-ai',
        reason: `AI Mentor Review for Week ${weekNumber}`,
        action: 'mentor_patch'
      });

      sendJson(res, 200, {
        message: 'Review completed successfully',
        data: result.data,
        review: reviewResult
      });
    } catch (err) {
      console.error('Error during AI review:', err);
      sendJson(res, 500, { error: 'Failed during AI Review: ' + err.message });
    }
    return true;
  }

  if (url.pathname === '/api/study-log' && req.method === 'GET') {
    const week = url.searchParams.get('week');
    const day = url.searchParams.get('day');
    const dayFiles = {
      'Monday': 'thu-2.md',
      'Tuesday': 'thu-3.md',
      'Wednesday': 'thu-4.md',
      'Thursday': 'thu-5.md',
      'Friday-Saturday': 'thu-6-7.md'
    };
    const fileName = dayFiles[day];
    if (!week || !fileName) {
      sendJson(res, 400, { error: 'Missing week or day query parameters' });
      return true;
    }

    const filePath = path.join(__dirname, '..', 'study', `tuan-${week}`, fileName);
    try {
      const content = await fs.readFile(filePath, 'utf8');
      sendJson(res, 200, { content });
    } catch (err) {
      sendJson(res, 200, { content: '' });
    }
    return true;
  }

  if (url.pathname === '/api/study-log' && req.method === 'POST') {
    const payload = await readJsonBody(req);
    const { week, day, content } = payload;
    const dayFiles = {
      'Monday': 'thu-2.md',
      'Tuesday': 'thu-3.md',
      'Wednesday': 'thu-4.md',
      'Thursday': 'thu-5.md',
      'Friday-Saturday': 'thu-6-7.md'
    };
    const fileName = dayFiles[day];
    if (!week || !fileName || typeof content !== 'string') {
      sendJson(res, 400, { error: 'Invalid payload parameters' });
      return true;
    }

    const filePath = path.join(__dirname, '..', 'study', `tuan-${week}`, fileName);
    try {
      await fs.writeFile(filePath, content, 'utf8');
      sendJson(res, 200, { success: true });
    } catch (err) {
      sendJson(res, 500, { error: 'Failed to save file: ' + err.message });
    }
    return true;
  }

  if (url.pathname === '/api/mentor/chat' && req.method === 'POST') {
    const payload = await readJsonBody(req);
    const { week, day, message, history } = payload;
    if (!week || !day || !message) {
      sendJson(res, 400, { error: 'Missing required parameters' });
      return true;
    }

    const dayFiles = {
      'Monday': 'thu-2.md',
      'Tuesday': 'thu-3.md',
      'Wednesday': 'thu-4.md',
      'Thursday': 'thu-5.md',
      'Friday-Saturday': 'thu-6-7.md'
    };
    const fileName = dayFiles[day];
    const filePath = path.join(__dirname, '..', 'study', `tuan-${week}`, fileName);
    let logContent = '(Không có file ghi chép)';
    try {
      logContent = await fs.readFile(filePath, 'utf8');
    } catch (err) {}

    const mentorPromptPath = path.join(__dirname, '..', 'chuong-trinh-dao-tao', 'huong-dan', 'mentor-prompt.md');
    let mentorPrompt = 'Bạn là Mentor AI 1-1 cho chương trình NestJS. Hãy trả lời câu hỏi của học viên một cách ngắn gọn, súc tích và tập trung vào kỹ thuật backend.';
    try {
      mentorPrompt = await fs.readFile(mentorPromptPath, 'utf8');
    } catch (err) {}

    const systemInstruction = `${mentorPrompt}\n\n` +
      `BỐI CẢNH HIỆN TẠI:\n` +
      `- Học viên đang ở Tuần ${week}, ngày ${day}.\n` +
      `- Nội dung file ghi chép hiện tại của học viên:\n` +
      `-----------\n` +
      `${logContent}\n` +
      `-----------\n` +
      `HƯỚNG DẪN TRẢ LỜI:\n` +
      `1. Trả lời trực tiếp câu hỏi của học viên liên quan đến bài học ngày này.\n` +
      `2. Sử dụng tiếng Việt. Giọng điệu chuyên nghiệp, xây dựng, chuẩn mực như một Tech Lead.\n` +
      `3. Trả về kết quả hoàn toàn bằng định dạng JSON khớp với cấu trúc sau:\n` +
      `{\n` +
      `  "reply": "Nội dung câu trả lời của Mentor AI ở định dạng Markdown"\n` +
      `}`;

    let prompt = `LỊCH SỬ HỘI THOẠI:\n`;
    if (Array.isArray(history)) {
      history.forEach(h => {
        prompt += `${h.role === 'user' ? 'Học viên' : 'Mentor AI'}: ${h.content}\n`;
      });
    }
    prompt += `Học viên: ${message}\n`;

    try {
      const responseJson = await callLLM(prompt, systemInstruction);
      sendJson(res, 200, { reply: responseJson.reply });
    } catch (err) {
      console.error('Error during AI chat:', err);
      sendJson(res, 500, { error: 'Failed during AI Chat: ' + err.message });
    }
    return true;
  }

  if (url.pathname === '/api/terminal/run' && req.method === 'POST') {
    const payload = await readJsonBody(req);
    const { command } = payload;
    if (!command) {
      sendJson(res, 400, { error: 'Missing command parameter' });
      return true;
    }

    const allowedCommands = ['npm run test', 'npm run lint', 'npm test', 'npm run dev', 'npm run build'];
    const isAllowed = allowedCommands.some(cmd => command.startsWith(cmd));
    if (!isAllowed) {
      sendJson(res, 400, { error: 'Command not allowed for security reasons' });
      return true;
    }

    const { exec } = require('child_process');
    const projectRoot = path.join(__dirname, '..');
    
    exec(command, { cwd: projectRoot }, (error, stdout, stderr) => {
      sendJson(res, 200, {
        stdout: stdout || '',
        stderr: stderr || '',
        exitCode: error ? error.code : 0
      });
    });
    return true;
  }

  if (url.pathname === '/api/traceability' && req.method === 'GET') {
    const filePath = path.join(__dirname, '..', 'docs', 'traceability-matrix.md');
    try {
      const content = await fs.readFile(filePath, 'utf8');
      sendJson(res, 200, { content });
    } catch (err) {
      sendJson(res, 404, { error: 'Traceability matrix file not found' });
    }
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
