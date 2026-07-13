import type { IncomingMessage, ServerResponse } from 'node:http';
import { randomUUID } from 'node:crypto';

export function requestIdOf(request: IncomingMessage): string {
  const supplied = request.headers['x-request-id'];
  return typeof supplied === 'string' && /^[a-zA-Z0-9._-]{8,80}$/.test(supplied)
    ? supplied
    : randomUUID();
}

export function json(response: ServerResponse, status: number, body: unknown, requestId: string) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'x-request-id': requestId
  });
  response.end(JSON.stringify(body));
}
