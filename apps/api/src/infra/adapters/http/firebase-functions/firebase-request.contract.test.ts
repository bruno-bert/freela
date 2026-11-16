// @vitest-environment node
import {createServer} from 'node:http';
import type {IncomingMessage,ServerResponse} from 'node:http';
import {it,expect,vi} from 'vitest';
import request from 'supertest';
import {JsonConfigManager} from '@core/infra/adapters/config/json/config-manager.adapter';
import {AuthFactory} from '@core/infra/factories/auth/auth.factory';
vi.mock('firebase-functions/v2/https',()=>({onRequest:(_options:unknown,handler:unknown)=>handler}));
it('handles already-consumed Firebase JSON streams through the complete Fastify lifecycle',async()=>{
 vi.stubEnv('APP_ENV','test');vi.stubEnv('LOCAL_SESSION_SECRET','firebase-adapter-contract-fixture');
 try{
  const{api}=await import('./handler');const handler=api as unknown as (req:IncomingMessage&{rawBody:Buffer},res:{setHeader:ServerResponse['setHeader'];status(code:number):unknown;send(body:Buffer):void})=>Promise<void>;
  const http=createServer((req,res)=>{const chunks:Buffer[]=[];req.on('data',(chunk:Buffer)=>chunks.push(chunk));req.on('end',()=>{const response={setHeader:res.setHeader.bind(res),status(code:number){res.statusCode=code;return this;},send(body:Buffer){res.end(body);}};handler(Object.assign(req,{rawBody:Buffer.concat(chunks)}),response).catch(()=>{res.statusCode=500;res.end();});});});
  const token=await new AuthFactory(new JsonConfigManager('api',{APP_ENV:'test',LOCAL_SESSION_SECRET:'firebase-adapter-contract-fixture'})).make().signIn!('demo');
  await request(http).get('/health').expect(200);await request(http).post('/health').send({probe:true}).timeout(2000).expect(404);
  const input={region:{latitude:-23.589,longitude:-46.635,radius:2000},category:'all',channel:'all',status:'all',website:'present',locale:'en'};
  const result=await request(http).post('/v1/opportunities/search').set('Authorization',`Bearer ${token}`).send(input).timeout(3000).expect(200);expect(result.body.companies).toHaveLength(1);
  const id=result.body.companies[0].id;const audit=await request(http).post('/v1/website-audits').set('Authorization',`Bearer ${token}`).send({companyId:id}).timeout(3000).expect(200);expect(audit.body.model).toBe('fixture-no-model-call');
  await request(http).post('/v1/website-audits').send({companyId:id}).expect(401);await request(http).post('/v1/website-audits').set('Authorization',`Bearer ${token}`).send({companyId:id,url:'http://127.0.0.1'}).expect(400);await request(http).post('/v1/website-audits').set('Authorization',`Bearer ${token}`).send({padding:'x'.repeat(40000)}).expect(413);
  const contact={companyId:`firebase-${crypto.randomUUID()}`,expectedVersion:0,idempotencyKey:crypto.randomUUID(),note:'Fixture contact'};const first=await request(http).post('/v1/contacts').set('Authorization',`Bearer ${token}`).send(contact).expect(200);expect((await request(http).post('/v1/contacts').set('Authorization',`Bearer ${token}`).send(contact).expect(200)).body).toEqual(first.body);
  const site={companyId:`firebase-${crypto.randomUUID()}`,language:'en',brief:'Fixture brief',idempotencyKey:crypto.randomUUID()};const pending=await request(http).post('/v1/site-requests').set('Authorization',`Bearer ${token}`).send(site).expect(202);expect((await request(http).post('/v1/site-requests').set('Authorization',`Bearer ${token}`).send(site).expect(202)).body).toEqual(pending.body);
 }finally{vi.unstubAllEnvs();}
});
