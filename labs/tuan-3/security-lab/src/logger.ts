const sensitive = /password|passphrase|token|authorization|cookie|secret|apiKey|connectionString/i;

export function redact(value: unknown, seen = new WeakSet<object>()): unknown {
  if (Array.isArray(value)) return value.map((item) => redact(item, seen));
  if (!value || typeof value !== 'object') return value;
  if (seen.has(value)) return '[CIRCULAR]';
  seen.add(value);
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [
    key,
    sensitive.test(key) ? '[REDACTED]' : redact(item, seen),
  ]));
}

export function structuredLog(event: string, fields: Record<string, unknown>): string {
  return JSON.stringify(redact({
    timestamp: new Date().toISOString(), level: 'info', service: 'security-lab', event, ...fields,
  }));
}

