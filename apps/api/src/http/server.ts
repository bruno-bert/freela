import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { validatorCompiler, serializerCompiler, jsonSchemaTransform, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import type { ConfigManager } from '@core/domain/config';
import type { Identity } from '@core/domain/model';
import { DomainError } from '@core/domain/errors';
import { AuthFactory } from '@core/infra/factories/auth/auth.factory';
import { OpportunitiesFactory } from '../infra/factories/opportunities/opportunities.factory';
export async function createServer(config: ConfigManager) {
  const app = Fastify({ logger: false, bodyLimit: 32768 }).withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler); app.setSerializerCompiler(serializerCompiler);
  if (config.get('http.swagger.enabled')) { await app.register(swagger, { openapi: { info: { title: 'Freelancer Workspace Process API', version: '1.0.0' }, components: { securitySchemes: { session: { type: 'http', scheme: 'bearer' } } } }, transform: jsonSchemaTransform }); await app.register(swaggerUi, { routePrefix: '/docs' }); }
  const services = new OpportunitiesFactory(config).make(), auth = new AuthFactory(config).make();
  const identities = new WeakMap<object, Identity>();
  app.addHook('onRequest', async request => { if (request.url.startsWith('/v1/')) { const token = request.headers.authorization?.replace(/^Bearer /, '') ?? ''; identities.set(request, await auth.verify(token)); } });
  app.setErrorHandler((error, _request, reply) => { const e = error as Error & { statusCode?: number; validation?: unknown }; const status = e instanceof DomainError ? e.status : e.validation ? 400 : e.statusCode ?? 500; reply.code(status).send({ error: status >= 500 ? 'Service unavailable.' : e.message }); });
  const region = z.object({ latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180), radius: z.number().min(100).max(50000) });
  const locale = z.enum(['en', 'pt-BR']); const id = z.string().min(1).max(200).regex(/^[a-zA-Z0-9_-]+$/);
  const contactSchema = z.object({ contacted: z.boolean(), version: z.number().int().nonnegative(), history: z.array(z.object({ at: z.string(), note: z.string() })) });
  const companySchema = z.object({ id: z.string(), name: z.string(), category: z.string(), address: z.string(), phone: z.string().nullable(), whatsapp: z.string().nullable(), instagram: z.string().nullable(), website: z.string().nullable(), sourceUrl: z.string().nullable(), location: z.object({ latitude: z.number(), longitude: z.number() }), contact: contactSchema, fictional: z.boolean() });
  const searchSchema = z.object({ companies: z.array(companySchema), provider: z.enum(['demo', 'google-places']), exhaustive: z.literal(false), fetched: z.number() });
  const security = [{ session: [] }];
  app.get('/health', { schema: { response: { 200: z.object({ status: z.literal('ok'), commit: z.string() }) } } }, async () => ({ status: 'ok' as const, commit: config.get<string>('app.commit') }));
  app.post('/v1/opportunities/search', { schema: { security, body: z.object({ region, category: z.enum(['all', 'car_repair', 'cafe', 'florist', 'store']), status: z.enum(['all', 'new', 'contacted']), channel: z.enum(['all', 'whatsapp', 'instagram']), locale }), response: { 200: searchSchema } } }, request => services.search.execute(identities.get(request)!, request.body));
  app.get('/v1/opportunities/:id', { schema: { security, params: z.object({ id }), querystring: z.object({ locale: locale.default('pt-BR') }), response: { 200: companySchema } } }, request => services.details.execute(identities.get(request)!, { companyId: request.params.id, locale: request.query.locale }));
  app.post('/v1/contacts', { schema: { security, body: z.object({ companyId: id, expectedVersion: z.number().int().nonnegative(), idempotencyKey: z.string().uuid(), note: z.string().max(1000) }), response: { 200: contactSchema } } }, request => services.recordContact.execute(identities.get(request)!, request.body));
  await app.ready(); return app;
}
