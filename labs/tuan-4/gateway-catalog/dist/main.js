import { createCatalogServer } from './catalog.js';
import { createGatewayServer } from './gateway.js';
const catalogPort = Number(process.env.CATALOG_PORT || 4101);
const gatewayPort = Number(process.env.GATEWAY_PORT || 4100);
const catalog = createCatalogServer();
const gateway = createGatewayServer({ catalogBaseUrl: `http://127.0.0.1:${catalogPort}`, timeoutMs: 500 });
catalog.listen(catalogPort, '127.0.0.1', () => console.log(`catalog listening on ${catalogPort}`));
gateway.listen(gatewayPort, '127.0.0.1', () => console.log(`gateway listening on ${gatewayPort}`));
