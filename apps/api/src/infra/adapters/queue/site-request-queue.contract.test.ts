// @vitest-environment node
import {it,expect,vi} from 'vitest';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {LocalSqliteSiteRequestQueueAdapter} from './local-sqlite/local-sqlite-site-request-queue.adapter';
import {FirestoreSiteRequestQueueAdapter} from './firestore/firestore-site-request-queue.adapter';
import {SitesFactory} from '../../factories/sites/sites.factory';
import {JsonConfigManager} from '@core/infra/adapters/config/json/config-manager.adapter';
const fake=vi.hoisted(()=>({store:new Map<string,unknown>(),failure:null as unknown,apps:[] as {name:string}[]}));
vi.mock('firebase-admin/app',()=>({getApps:()=>fake.apps,initializeApp:()=>({name:'project'}),applicationDefault:vi.fn()}));
vi.mock('firebase-admin/firestore',()=>({getFirestore:()=>({doc:(path:string)=>({path,get:async()=>{if(fake.failure)throw fake.failure;return{exists:fake.store.has(path),data:()=>fake.store.get(path)};}}),runTransaction:async(fn:(transaction:unknown)=>unknown)=>{if(fake.failure)throw fake.failure;const writes=new Map<string,unknown>();const result=await fn({getAll:async(...refs:{path:string}[])=>refs.map(r=>({exists:fake.store.has(r.path),data:()=>fake.store.get(r.path)})),create:(ref:{path:string},value:unknown)=>writes.set(ref.path,value)});writes.forEach((value,key)=>fake.store.set(key,value));return result;}})}));
it.each(['local-sqlite','firestore-pending'])('persists owner-scoped pending requests, deduplicates and rejects edits for %s',async(provider)=>{
 const dir=mkdtempSync(join(tmpdir(),'site-queue-'));fake.store.clear();fake.failure=null;fake.apps=[];
 const repo=provider==='local-sqlite'?new LocalSqliteSiteRequestQueueAdapter(join(dir,'queue.sqlite')):new FirestoreSiteRequestQueueAdapter('project');
 try{const command={companyId:'place',language:'en' as const,brief:'A minimal website',idempotencyKey:crypto.randomUUID()};
 expect(await repo.get('owner','place')).toBeNull();const first=await repo.enqueue('owner',command);expect(first).toMatchObject({status:'pending',version:0,schemaVersion:1});expect(await repo.enqueue('owner',command)).toEqual(first);
 expect(await repo.enqueue('owner',{...command,idempotencyKey:crypto.randomUUID()})).toEqual(first);
 expect(await repo.get('owner','place')).toEqual(first);expect(await repo.get('other-owner','place')).toBeNull();
 await expect(repo.enqueue('owner',{...command,brief:'Changed'})).rejects.toMatchObject({status:409});
 await expect(repo.enqueue('owner',{...command,brief:'Changed',idempotencyKey:crypto.randomUUID()})).rejects.toMatchObject({status:409});
 await expect(repo.enqueue('owner',{...command,companyId:'other'})).rejects.toMatchObject({status:409});
 expect(await repo.get('owner','other')).toBeNull();expect((await repo.enqueue('other-owner',command)).id).not.toBe(first.id);
 if(provider==='local-sqlite')expect(await new LocalSqliteSiteRequestQueueAdapter(join(dir,'queue.sqlite')).get('owner','place')).toEqual(first);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
it('maps Firestore outages and conflicts and selects factories through config',async()=>{
 const repo=new FirestoreSiteRequestQueueAdapter('project');const input={companyId:'place',language:'en' as const,brief:'',idempotencyKey:crypto.randomUUID()};fake.apps=[{name:'project'}];fake.failure={code:10};await expect(repo.enqueue('owner',input)).rejects.toMatchObject({status:409});fake.failure=new Error('private');await expect(repo.enqueue('owner',input)).rejects.toMatchObject({status:503});await expect(repo.get('owner','place')).rejects.toMatchObject({status:503});fake.failure=null;
 const config=new JsonConfigManager('api',{APP_ENV:'test'});const service=new SitesFactory(config).make();const owner={id:crypto.randomUUID(),name:'Owner',role:'owner' as const};expect(await service.get.execute(owner,'place')).toBeNull();expect(await service.request.execute(owner,input)).toMatchObject({status:'pending'});
 const production=new JsonConfigManager('api',{APP_ENV:'production'});expect(new SitesFactory(production).make()).toBeDefined();
});
