import { it, expect } from 'vitest';
import { JsonConfigManager } from './config-manager.adapter';
import { AuthFactory } from '../../../factories/auth/auth.factory';
import { ContentFactory } from '../../../factories/content/content.factory';
import { LocalAuthAdapter } from '../../auth/local/local-auth.adapter';
it('loads JSON, resolves selections and rejects unknown keys or production development adapters', async()=>{const config=new JsonConfigManager('web',{APP_ENV:'test',LOCAL_SESSION_SECRET:'test-secret'});expect(config.get('infra.repositories.provider')).toBe('process-api');expect(()=>config.get('missing')).toThrow('Missing');expect(()=>config.secret('MISSING_TEST_SECRET')).toThrow('Missing');const auth=new AuthFactory(config).make();const token=await auth.signIn!('demo');expect(await auth.verify(token)).toMatchObject({id:'demo-owner',role:'owner'});await expect(auth.verify('bad')).rejects.toMatchObject({status:401});await expect(auth.verify(token+'x')).rejects.toMatchObject({status:401});await expect(auth.signIn!('arbitrary')).rejects.toMatchObject({status:401});expect(()=>new LocalAuthAdapter('test','production')).toThrow('forbidden');const copy=await new ContentFactory(config).make().execute('en','workspace');expect(copy.opportunities).toBe('Opportunities');const wrong={...config,get:<T,>(key:string):T=>key==='infra.auth.provider'?'unknown' as T:config.get<T>(key),secret:config.secret.bind(config)};expect(()=>new AuthFactory(wrong).make()).toThrow('Unknown selection');const production=new JsonConfigManager('api',{APP_ENV:'production'});expect(production.get('infra.auth.provider')).toBe('firebase-auth');});

it('rejects invalid CMS paths and expired or malformed development sessions',async()=>{
 const {JsonCmsAdapter}=await import('../../cms/json/json-cms.adapter');
 const {createHmac}=await import('node:crypto');
 const cms=new JsonCmsAdapter('/unused');
 await expect(cms.read('invalid' as never,'workspace')).rejects.toThrow('Invalid content');
 await expect(cms.read('en','../escape')).rejects.toThrow('Invalid content');
 const auth=new LocalAuthAdapter('test','test');
 const sign=(payload:string)=>`${payload}.${createHmac('sha256','test').update(payload).digest('base64url')}`;
 await expect(auth.verify(sign(Buffer.from('not-json').toString('base64url')))).rejects.toMatchObject({status:401});
 await expect(auth.verify(sign(Buffer.from(JSON.stringify({id:'demo-owner',role:'owner',exp:0})).toString('base64url')))).rejects.toMatchObject({status:401});
 await expect(auth.verify(sign(Buffer.from(JSON.stringify({id:'other',role:'owner',exp:Date.now()+10000})).toString('base64url')))).rejects.toMatchObject({status:401});
 await expect(auth.verify(sign(Buffer.from(JSON.stringify({id:'demo-owner',role:'other',exp:Date.now()+10000})).toString('base64url')))).rejects.toMatchObject({status:401});
 await expect(auth.verify('')).rejects.toMatchObject({status:401});
 const defaults=new JsonConfigManager('api',{}); expect(defaults.get('app.env')).toBe('development');
});
it('finds workspace parents and validates standalone deployment configuration',async()=>{
 const {workspaceRoot}=await import('./config-manager.adapter');const {mkdtemp,mkdir,readFile,writeFile,rm}=await import('node:fs/promises');const {tmpdir}=await import('node:os');const {join}=await import('node:path');
 expect(workspaceRoot(join(process.cwd(),'apps','web'))).toBe(process.cwd());expect(workspaceRoot(tmpdir())).toBe(process.cwd());
 const directory=await mkdtemp(join(tmpdir(),'freela-config-'));
 try {await mkdir(join(directory,'config'));const base=JSON.parse(await readFile('apps/api/config/default.json','utf8'));await writeFile(join(directory,'config/default.json'),JSON.stringify(base));await writeFile(join(directory,'config/test.json'),JSON.stringify({infra:{newObject:{values:[1,2]}}}));const config=new JsonConfigManager('api',{APP_ENV:'test'},directory);expect(config.get('infra.newObject.values')).toEqual([1,2]);expect(()=>new JsonConfigManager('api',{APP_ENV:'production'},directory)).toThrow('forbidden');await expect(new JsonConfigManager('api',{NODE_ENV:'test'},directory).get('app.env')).toBe('test');}finally{await rm(directory,{recursive:true,force:true});}
});
