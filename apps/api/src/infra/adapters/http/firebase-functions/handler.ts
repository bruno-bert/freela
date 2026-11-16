import { onRequest } from 'firebase-functions/v2/https';
import { JsonConfigManager } from '@core/infra/adapters/config/json/config-manager.adapter';
import { createServer } from '../../../../http/server';
const config = new JsonConfigManager('api');
const region = config.get<string>('infra.runtime.region');
if (region === '[TBD]') throw new Error('Select and configure a Firebase Functions region before deployment.');
let server: ReturnType<typeof createServer> | undefined;
export const api = onRequest({ region, maxInstances: 2, invoker: 'public' }, async (request, response) => {
 server ??= createServer(config);
 const app = await server;
 app.server.emit('request', request, response);
});
