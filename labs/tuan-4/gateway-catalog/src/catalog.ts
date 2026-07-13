import { createServer, type Server } from 'node:http';
import type { MovieView } from './contracts.js';
import { json, requestIdOf } from './http.js';

const movies: MovieView[] = [
  { id: 'mov_001', title: 'Arrival', durationMinutes: 116 },
  { id: 'mov_002', title: 'Interstellar', durationMinutes: 169 }
];

export interface CatalogOptions { delayMs?: number }

export function createCatalogServer(options: CatalogOptions = {}): Server {
  return createServer(async (request, response) => {
    const requestId = requestIdOf(request);
    if (options.delayMs) await new Promise(resolve => setTimeout(resolve, options.delayMs));

    if (request.method === 'GET' && request.url === '/internal/movies') {
      console.log(JSON.stringify({ service: 'catalog', requestId, route: request.url, outcome: 'success' }));
      return json(response, 200, { data: movies }, requestId);
    }
    if (request.method === 'GET' && request.url === '/health/ready') {
      return json(response, 200, { status: 'ready', service: 'catalog' }, requestId);
    }
    return json(response, 404, { error: { code: 'NOT_FOUND', message: 'Route not found', requestId } }, requestId);
  });
}
