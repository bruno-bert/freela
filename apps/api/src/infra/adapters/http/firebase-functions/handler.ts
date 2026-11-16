import type { HTTPMethods } from 'fastify';
import { onRequest } from 'firebase-functions/v2/https';
import { JsonConfigManager } from '@core/infra/adapters/config/json/config-manager.adapter';
import { createServer } from '../../../../http/server';
const config = new JsonConfigManager('api');
const region = config.get<string>('infra.runtime.region');
if (region === '[TBD]') throw new Error('Select and configure a Firebase Functions region before deployment.');
let server: ReturnType<typeof createServer> | undefined;
export const api = onRequest({ region, timeoutSeconds: 120, maxInstances: 2, invoker: 'public', serviceAccount: config.get<string>('infra.runtime.serviceAccount'), secrets: [config.get<string>('infra.places.google-places.tokenEnv')] }, async (request, response) => {
 server ??= createServer(config);
 const app = await server;
 // Firebase consumes the incoming stream before invoking this handler. Replay the
 // original bytes through Fastify so authentication, body limits and schemas still run.
 const { 'content-length': _length, 'transfer-encoding': _transfer, 'content-encoding': _encoding, ...headers } = request.headers;
 const result = await app.inject({ method: request.method as HTTPMethods, url: request.url, headers, payload: request.rawBody?.length ? request.rawBody : undefined });
 for (const [name,value] of Object.entries(result.headers)) if (value !== undefined) response.setHeader(name,value);
 response.status(result.statusCode).send(result.rawPayload);
});
