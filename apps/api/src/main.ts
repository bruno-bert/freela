import { JsonConfigManager } from '@core/infra/adapters/config/json/config-manager.adapter';
import { createServer } from './http/server';
async function main() {
const config = new JsonConfigManager('api');
const app = await createServer(config);
await app.listen({ port: config.get('http.port'), host: '127.0.0.1' });

}
void main();
