import {it,expect,vi} from 'vitest';
const fake=vi.hoisted(()=>({region:'southamerica-east1',emit:vi.fn(),create:vi.fn()}));
vi.mock('@core/infra/adapters/config/json/config-manager.adapter',()=>({JsonConfigManager:class{get(){return fake.region;}}}));
vi.mock('../../../../http/server',()=>({createServer:fake.create}));
vi.mock('firebase-functions/v2/https',()=>({onRequest:(_options:unknown,handler:unknown)=>handler}));
it('exports a bounded Functions handler, reuses its server and refuses unresolved locations',async()=>{fake.create.mockResolvedValue({server:{emit:fake.emit}});const {api}=await import('./handler');const handler=api as unknown as (request:unknown,response:unknown)=>Promise<void>;await handler({},{ });await handler({},{ });expect(fake.create).toHaveBeenCalledOnce();expect(fake.emit).toHaveBeenCalledTimes(2);vi.resetModules();fake.region='[TBD]';await expect(import('./handler')).rejects.toThrow('Select and configure');});
