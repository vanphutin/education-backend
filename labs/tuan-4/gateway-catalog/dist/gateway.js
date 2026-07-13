import { createServer } from 'node:http';
import { errorBody } from './contracts.js';
import { json, requestIdOf } from './http.js';
export function createGatewayServer(options) {
    return createServer(async (request, response) => {
        const requestId = requestIdOf(request);
        if (request.method === 'GET' && request.url === '/health/live') {
            return json(response, 200, { status: 'alive', service: 'gateway' }, requestId);
        }
        if (request.method !== 'GET' || request.url !== '/api/v1/movies') {
            return json(response, 404, errorBody({ code: 'INVALID_REQUEST', message: 'Route not found', requestId, retryable: false }), requestId);
        }
        try {
            const upstream = await fetch(`${options.catalogBaseUrl}/internal/movies`, {
                headers: { 'x-request-id': requestId },
                signal: AbortSignal.timeout(options.timeoutMs)
            });
            if (!upstream.ok)
                throw new Error(`catalog_status_${upstream.status}`);
            const payload = await upstream.json();
            console.log(JSON.stringify({ service: 'gateway', requestId, upstream: 'catalog', outcome: 'success' }));
            return json(response, 200, payload, requestId);
        }
        catch (error) {
            const timeout = error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError');
            console.log(JSON.stringify({ service: 'gateway', requestId, upstream: 'catalog', outcome: timeout ? 'timeout' : 'unavailable' }));
            return json(response, timeout ? 504 : 503, errorBody({
                code: timeout ? 'UPSTREAM_TIMEOUT' : 'UPSTREAM_UNAVAILABLE',
                message: timeout ? 'Catalog did not respond before the deadline' : 'Catalog is temporarily unavailable',
                requestId,
                retryable: true
            }), requestId);
        }
    });
}
