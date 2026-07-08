const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const SCHEMA_VERSION = 1;
const MAX_AUDIT_LOG = 500;
const MAX_BACKUPS = 50;

class ValidationError extends Error {
  constructor(message, details = undefined) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.details = details;
  }
}

class ConflictError extends Error {
  constructor(message, details = undefined) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
    this.details = details;
  }
}

class PatchError extends Error {
  constructor(message, details = undefined) {
    super(message);
    this.name = 'PatchError';
    this.statusCode = 400;
    this.details = details;
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeDb(db) {
  if (!isPlainObject(db)) {
    throw new ValidationError('Database must be a JSON object.');
  }

  const now = new Date().toISOString();
  const normalized = clone(db);
  const existingMeta = isPlainObject(normalized._meta) ? normalized._meta : {};

  normalized._meta = {
    schema_version: SCHEMA_VERSION,
    created_at: existingMeta.created_at || now,
    version: Number.isInteger(existingMeta.version) && existingMeta.version > 0 ? existingMeta.version : 1,
    updated_at: existingMeta.updated_at || now,
    updated_by: existingMeta.updated_by || 'system'
  };

  if (!Array.isArray(normalized.audit_log)) {
    normalized.audit_log = [];
  }

  if (!Array.isArray(normalized.daily_checkins)) {
    normalized.daily_checkins = [];
  }

  if (!Array.isArray(normalized.mock_interviews)) {
    normalized.mock_interviews = [];
  }

  return normalized;
}

function validateDb(db) {
  const errors = [];
  const weekStatuses = new Set(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'PAUSED']);
  const dayStatuses = new Set(['TODO', 'DONE', 'SKIPPED', 'BLOCKED']);
  const deliverableStatuses = new Set(['PENDING', 'APPROVED', 'REJECTED', 'NEEDS_REVISION']);

  if (!isPlainObject(db.student)) {
    errors.push('student must be an object.');
  } else {
    if (typeof db.student.name !== 'string') errors.push('student.name must be a string.');
    if (typeof db.student.target !== 'string') errors.push('student.target must be a string.');
  }

  if (!isPlainObject(db.overall_progress)) {
    errors.push('overall_progress must be an object.');
  }

  if (!Array.isArray(db.weeks)) {
    errors.push('weeks must be an array.');
  } else {
    db.weeks.forEach((week, weekIndex) => {
      const prefix = `weeks[${weekIndex}]`;

      if (!isPlainObject(week)) {
        errors.push(`${prefix} must be an object.`);
        return;
      }

      if (!Number.isInteger(week.week_number)) errors.push(`${prefix}.week_number must be an integer.`);
      if (typeof week.title !== 'string') errors.push(`${prefix}.title must be a string.`);
      if (!weekStatuses.has(week.status)) errors.push(`${prefix}.status is invalid.`);
      if (week.score !== null && week.score !== undefined && typeof week.score !== 'number') {
        errors.push(`${prefix}.score must be a number or null.`);
      }
      if (!Array.isArray(week.days)) {
        errors.push(`${prefix}.days must be an array.`);
      } else {
        week.days.forEach((day, dayIndex) => {
          const dayPrefix = `${prefix}.days[${dayIndex}]`;

          if (!isPlainObject(day)) {
            errors.push(`${dayPrefix} must be an object.`);
            return;
          }

          if (typeof day.day !== 'string') errors.push(`${dayPrefix}.day must be a string.`);
          if (typeof day.topic !== 'string') errors.push(`${dayPrefix}.topic must be a string.`);
          if (!dayStatuses.has(day.status)) errors.push(`${dayPrefix}.status is invalid.`);
        });
      }

      if (!Array.isArray(week.deliverables)) {
        errors.push(`${prefix}.deliverables must be an array.`);
      } else {
        week.deliverables.forEach((deliverable, deliverableIndex) => {
          const deliverablePrefix = `${prefix}.deliverables[${deliverableIndex}]`;

          if (!isPlainObject(deliverable)) {
            errors.push(`${deliverablePrefix} must be an object.`);
            return;
          }

          if (typeof deliverable.id !== 'string') errors.push(`${deliverablePrefix}.id must be a string.`);
          if (typeof deliverable.name !== 'string') errors.push(`${deliverablePrefix}.name must be a string.`);
          if (!deliverableStatuses.has(deliverable.status)) errors.push(`${deliverablePrefix}.status is invalid.`);
        });
      }
    });
  }

  if (!Array.isArray(db.daily_checkins)) errors.push('daily_checkins must be an array.');
  if (!Array.isArray(db.mock_interviews)) errors.push('mock_interviews must be an array.');
  if (!isPlainObject(db._meta)) errors.push('_meta must be an object.');
  if (!Array.isArray(db.audit_log)) errors.push('audit_log must be an array.');

  if (errors.length > 0) {
    throw new ValidationError('Database validation failed.', errors);
  }
}

function parseJsonPointer(pointer) {
  if (typeof pointer !== 'string' || pointer.length === 0 || pointer[0] !== '/') {
    throw new PatchError('Patch path must be a JSON Pointer starting with /.');
  }

  if (
    pointer === '/_meta' ||
    pointer.startsWith('/_meta/') ||
    pointer === '/audit_log' ||
    pointer.startsWith('/audit_log/')
  ) {
    throw new PatchError('Patch cannot modify internal metadata or audit log.', { path: pointer });
  }

  return pointer
    .slice(1)
    .split('/')
    .map((part) => part.replace(/~1/g, '/').replace(/~0/g, '~'));
}

function arrayIndex(token, array, allowEnd = false) {
  if (token === '-' && allowEnd) return array.length;
  if (!/^(0|[1-9]\d*)$/.test(token)) {
    throw new PatchError('Array path segment must be a non-negative integer.', { token });
  }

  const index = Number(token);
  const max = allowEnd ? array.length : array.length - 1;

  if (index < 0 || index > max) {
    throw new PatchError('Array index is out of bounds.', { token, length: array.length });
  }

  return index;
}

function getPatchParent(document, tokens) {
  let parent = document;

  for (let index = 0; index < tokens.length - 1; index += 1) {
    const token = tokens[index];

    if (Array.isArray(parent)) {
      parent = parent[arrayIndex(token, parent)];
      continue;
    }

    if (isPlainObject(parent) && Object.prototype.hasOwnProperty.call(parent, token)) {
      parent = parent[token];
      continue;
    }

    throw new PatchError('Patch path does not exist.', { token });
  }

  return {
    parent,
    key: tokens[tokens.length - 1]
  };
}

function applyJsonPatchOperation(document, operation, operationIndex) {
  if (!isPlainObject(operation)) {
    throw new PatchError('Patch operation must be an object.', { operationIndex });
  }

  const { op, path: pointer } = operation;

  if (!['add', 'replace', 'remove'].includes(op)) {
    throw new PatchError('Unsupported patch operation.', { operationIndex, op });
  }

  const tokens = parseJsonPointer(pointer);
  if (tokens.length === 0) {
    throw new PatchError('Root-level replacement is not allowed.');
  }

  const { parent, key } = getPatchParent(document, tokens);

  if (Array.isArray(parent)) {
    if (op === 'add') {
      parent.splice(arrayIndex(key, parent, true), 0, clone(operation.value));
      return;
    }

    const index = arrayIndex(key, parent);

    if (op === 'replace') {
      parent[index] = clone(operation.value);
      return;
    }

    parent.splice(index, 1);
    return;
  }

  if (!isPlainObject(parent)) {
    throw new PatchError('Patch parent is not an object or array.', { path: pointer });
  }

  if (op === 'add') {
    parent[key] = clone(operation.value);
    return;
  }

  if (!Object.prototype.hasOwnProperty.call(parent, key)) {
    throw new PatchError('Patch target does not exist.', { path: pointer });
  }

  if (op === 'replace') {
    parent[key] = clone(operation.value);
    return;
  }

  delete parent[key];
}

function assertVersion(currentDb, requestedVersion) {
  if (requestedVersion === undefined || requestedVersion === null || requestedVersion === '') {
    return;
  }

  const parsedVersion = Number(requestedVersion);

  if (!Number.isInteger(parsedVersion) || parsedVersion < 1) {
    throw new ValidationError('baseVersion must be a positive integer.');
  }

  if (parsedVersion !== currentDb._meta.version) {
    throw new ConflictError('Database version conflict.', {
      expected_version: parsedVersion,
      current_version: currentDb._meta.version
    });
  }
}

function createJsonDb({ dbPath, backupDir }) {
  let cache = null;
  let cacheMtimeMs = 0;
  let writeQueue = Promise.resolve();

  async function loadFromDisk() {
    const raw = await fs.readFile(dbPath, 'utf8');
    const stat = await fs.stat(dbPath);
    const parsed = JSON.parse(raw);
    const normalized = normalizeDb(parsed);

    validateDb(normalized);
    cache = normalized;
    cacheMtimeMs = stat.mtimeMs;
    return cache;
  }

  async function current() {
    const stat = await fs.stat(dbPath);

    if (!cache || stat.mtimeMs !== cacheMtimeMs) {
      return loadFromDisk();
    }

    return cache;
  }

  async function backupCurrent(version) {
    await fs.mkdir(backupDir, { recursive: true });

    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `progress-v${version}-${stamp}.json`;
    const backupPath = path.join(backupDir, backupName);

    await fs.copyFile(dbPath, backupPath);
    await pruneBackups();

    return backupPath;
  }

  async function pruneBackups() {
    const entries = await fs.readdir(backupDir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith('.json')) continue;
      const filePath = path.join(backupDir, entry.name);
      const stat = await fs.stat(filePath);
      files.push({ filePath, mtimeMs: stat.mtimeMs });
    }

    files.sort((a, b) => b.mtimeMs - a.mtimeMs);
    await Promise.all(files.slice(MAX_BACKUPS).map((file) => fs.unlink(file.filePath)));
  }

  async function writeAtomic(nextDb) {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });

    const tmpPath = `${dbPath}.${process.pid}.${Date.now()}.tmp`;
    const payload = `${JSON.stringify(nextDb, null, 2)}\n`;

    await fs.writeFile(tmpPath, payload, 'utf8');
    await fs.rename(tmpPath, dbPath);

    const stat = await fs.stat(dbPath);
    cache = nextDb;
    cacheMtimeMs = stat.mtimeMs;
  }

  async function commit(currentDb, nextDb, options) {
    const now = new Date().toISOString();
    const actor = options.actor || 'system';
    const baseVersion = currentDb._meta.version;

    const normalizedNext = normalizeDb(nextDb);
    normalizedNext._meta = {
      schema_version: SCHEMA_VERSION,
      created_at: currentDb._meta.created_at || normalizedNext._meta.created_at || now,
      version: baseVersion + 1,
      updated_at: now,
      updated_by: actor
    };

    const auditEntry = {
      id: crypto.randomUUID(),
      timestamp: now,
      actor,
      action: options.action || 'update',
      reason: options.reason || '',
      base_version: baseVersion,
      new_version: normalizedNext._meta.version,
      summary: options.summary || ''
    };

    const previousAuditLog = Array.isArray(currentDb.audit_log) ? currentDb.audit_log : [];
    normalizedNext.audit_log = [...previousAuditLog, auditEntry].slice(-MAX_AUDIT_LOG);

    validateDb(normalizedNext);
    const backupPath = await backupCurrent(baseVersion);
    await writeAtomic(normalizedNext);

    return {
      data: clone(normalizedNext),
      audit: auditEntry,
      backup: backupPath
    };
  }

  function enqueueWrite(task) {
    const run = writeQueue.then(task, task);
    writeQueue = run.catch(() => undefined);
    return run;
  }

  return {
    async get() {
      return clone(await current());
    },

    async replace(incomingDb, options = {}) {
      return enqueueWrite(async () => {
        const currentDb = await current();
        assertVersion(currentDb, options.baseVersion ?? incomingDb?._meta?.version);

        const nextDb = normalizeDb(incomingDb);
        nextDb.audit_log = currentDb.audit_log;

        return commit(currentDb, nextDb, {
          actor: options.actor || 'web-ui',
          action: 'replace',
          reason: options.reason || 'Full database save',
          summary: 'Replaced JSON database from client payload'
        });
      });
    },

    async applyPatch({ baseVersion, operations, actor = 'mentor-ai', reason = 'JSON patch update', action = 'patch' }) {
      return enqueueWrite(async () => {
        const currentDb = await current();
        assertVersion(currentDb, baseVersion);

        if (!Array.isArray(operations) || operations.length === 0) {
          throw new ValidationError('operations must be a non-empty array.');
        }

        if (operations.length > 100) {
          throw new ValidationError('Too many patch operations in one request.');
        }

        const nextDb = clone(currentDb);
        operations.forEach((operation, index) => applyJsonPatchOperation(nextDb, operation, index));

        return commit(currentDb, nextDb, {
          actor,
          action,
          reason,
          summary: `${operations.length} JSON patch operation(s)`
        });
      });
    },

    async listBackups() {
      await fs.mkdir(backupDir, { recursive: true });
      const entries = await fs.readdir(backupDir, { withFileTypes: true });
      const backups = [];

      for (const entry of entries) {
        if (!entry.isFile() || !entry.name.endsWith('.json')) continue;

        const filePath = path.join(backupDir, entry.name);
        const stat = await fs.stat(filePath);

        backups.push({
          name: entry.name,
          path: filePath,
          size: stat.size,
          modified_at: stat.mtime.toISOString()
        });
      }

      return backups.sort((a, b) => b.modified_at.localeCompare(a.modified_at));
    }
  };
}

module.exports = {
  createJsonDb,
  ValidationError,
  ConflictError,
  PatchError
};
