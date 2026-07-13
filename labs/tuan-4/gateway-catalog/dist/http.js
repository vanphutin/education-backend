import { randomUUID } from 'node:crypto';
export function requestIdOf(request) {
    const supplied = request.headers['x-request-id'];
    return typeof supplied === 'string' && /^[a-zA-Z0-9._-]{8,80}$/.test(supplied)
        ? supplied
        : randomUUID();
}
export function json(response, status, body, requestId) {
    response.writeHead(status, {
        'content-type': 'application/json; charset=utf-8',
        'x-request-id': requestId
    });
    response.end(JSON.stringify(body));
}
