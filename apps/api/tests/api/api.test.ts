import {readFile} from 'node:fs/promises';
// @vitest-environment node
import { it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from '../../src/http/server';
import { JsonConfigManager } from '@core/infra/adapters/config/json/config-manager.adapter';
import { AuthFactory } from '@core/infra/factories/auth/auth.factory';
import { ProcessApiOpportunitiesAdapter } from '../../../web/src/infra/adapters/repositories/process-api/process-api-opportunities.adapter';
it('enforces API authentication, input contracts, contact replay and OpenAPI paths', async()=>{const config=new JsonConfigManager('api',{APP_ENV:'test',LOCAL_SESSION_SECRET:'api-test'});const app=await createServer(config);await app.listen({port:0,host:'127.0.0.1'});try{const token=await new AuthFactory(config).make().signIn!('demo');const http=request(app.server);await http.get('/health').expect(200);await http.post('/v1/opportunities/search').send({}).expect(401);await http.post('/v1/opportunities/search').set('Authorization',`Bearer ${token}`).send({}).expect(400);const input={region:{latitude:-23.589,longitude:-46.635,radius:2000},category:'all',status:'all' as const,channel:'all' as const,locale:'en' as const};const result=await http.post('/v1/opportunities/search').set('Authorization',`Bearer ${token}`).send(input).expect(200);expect(result.body.companies).toHaveLength(4);const address=app.server.address() as {port:number};const client=new ProcessApiOpportunitiesAdapter(`http://127.0.0.1:${address.port}`,token,3000);expect(await client.search(input)).toMatchObject({exhaustive:false,provider:'demo'});expect((await client.details('atelier-aurora','en')).name).toContain('Aurora');const command={companyId:'oficina-horizonte',expectedVersion:0,idempotencyKey:crypto.randomUUID(),note:'Confirmed'};const first=await client.recordContact(command);expect(await client.recordContact(command)).toEqual(first);await expect(client.recordContact({...command,idempotencyKey:crypto.randomUUID()})).rejects.toMatchObject({status:409});await expect(client.details('missing','en')).rejects.toMatchObject({status:404});const spec=await http.get('/docs/json').expect(200);expect(spec.body).toEqual(JSON.parse(await readFile('apps/api/openapi/v1.json','utf8')));expect(Object.keys(spec.body.paths)).toEqual(expect.arrayContaining(['/health','/v1/opportunities/search','/v1/opportunities/{id}','/v1/contacts']));await http.get('/docs/').expect(200);}finally{await app.close();}});
it('handles disabled Swagger and provider or parser failures without leaking details',async()=>{
 const {vi}=await import('vitest');const {LocalAuthAdapter}=await import('@core/infra/adapters/auth/local/local-auth.adapter');
 const config=new JsonConfigManager('api',{APP_ENV:'test',LOCAL_SESSION_SECRET:'api-errors'});
 const disabled={get:<T,>(key:string):T=>key==='http.swagger.enabled'?false as T:config.get<T>(key),secret:config.secret.bind(config)};
 const app=await createServer(disabled);
 try{const token=await new AuthFactory(config).make().signIn!('demo');
 expect((await app.inject({method:'GET',url:'/docs/json'})).statusCode).toBe(404);
 expect((await app.inject({method:'POST',url:'/v1/opportunities/search',headers:{authorization:`Bearer ${token}`,'content-type':'application/invalid'},payload:'invalid'})).statusCode).toBe(415);
 const verify=vi.spyOn(LocalAuthAdapter.prototype,'verify').mockRejectedValueOnce(new Error('private provider detail'));
 const result=await app.inject({method:'GET',url:'/v1/opportunities/id',headers:{authorization:`Bearer ${token}`}});expect(result.statusCode).toBe(500);expect(result.body).not.toContain('private provider detail');verify.mockRestore();
 }finally{await app.close();}
});
