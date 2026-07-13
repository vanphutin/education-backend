import test from 'node:test';
import assert from 'node:assert/strict';
import { createCatalogServer } from './catalog.js';
import { createGatewayServer } from './gateway.js';
async function listen(server) {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const address = server.address();
    if (!address || typeof address === 'string')
        throw new Error('missing address');
    return address.port;
}
test('gateway propagates request id and preserves the public contract', async (t) => {
    const catalog = createCatalogServer();
    const catalogPort = await listen(catalog);
    const gateway = createGatewayServer({ catalogBaseUrl: `http://127.0.0.1:${catalogPort}`, timeoutMs: 200 });
    const gatewayPort = await listen(gateway);
    t.after(() => { catalog.close(); gateway.close(); });
    const response = await fetch(`http://127.0.0.1:${gatewayPort}/api/v1/movies`, { headers: { 'x-request-id': 'req_contract_001' } });
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('x-request-id'), 'req_contract_001');
    assert.deepEqual(body.data.map(movie => movie.id), ['mov_001', 'mov_002']);
});
test('gateway maps a slow catalog to a safe 504 contract', async (t) => {
    const catalog = createCatalogServer({ delayMs: 100 });
    const catalogPort = await listen(catalog);
    const gateway = createGatewayServer({ catalogBaseUrl: `http://127.0.0.1:${catalogPort}`, timeoutMs: 20 });
    const gatewayPort = await listen(gateway);
    t.after(() => { catalog.close(); gateway.close(); });
    const response = await fetch(`http://127.0.0.1:${gatewayPort}/api/v1/movies`, { headers: { 'x-request-id': 'req_timeout_001' } });
    const body = await response.json();
    assert.equal(response.status, 504);
    assert.deepEqual(body.error, { code: 'UPSTREAM_TIMEOUT', message: 'Catalog did not respond before the deadline', requestId: 'req_timeout_001', retryable: true });
});
test('gateway maps an unavailable catalog to 503 without leaking internals', async (t) => {
    const gateway = createGatewayServer({ catalogBaseUrl: 'http://127.0.0.1:1', timeoutMs: 50 });
    const gatewayPort = await listen(gateway);
    t.after(() => gateway.close());
    const response = await fetch(`http://127.0.0.1:${gatewayPort}/api/v1/movies`);
    const body = await response.json();
    assert.equal(response.status, 503);
    assert.equal(body.error.code, 'UPSTREAM_UNAVAILABLE');
    assert.equal(body.error.message.includes('127.0.0.1'), false);
});
