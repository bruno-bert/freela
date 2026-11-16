import {it,expect,vi} from 'vitest';
import {AuthFactory} from '@core/infra/factories/auth/auth.factory';
import {DomainError} from '@core/domain/errors';
import {SitesFactory} from '../../infra/factories/sites/sites.factory';
import {siteRequest} from './sites';
const jar=vi.hoisted(()=>({get:vi.fn()}));
vi.mock('next/headers',()=>({cookies:async()=>jar}));
vi.mock('next/navigation',()=>({redirect:vi.fn()}));
it('enforces authentication, origin and schemas for site queue routes',async()=>{
 const {POST}=await import('../../app/api/site-requests/route');const {GET}=await import('../../app/api/site-requests/[id]/route');
 const req=(body:unknown,origin='http://localhost:3000')=>new Request('http://localhost:3000/api/site-requests',{method:'POST',headers:{origin},body:JSON.stringify(body)});
 jar.get.mockReturnValue(undefined);expect((await POST(req({}))).status).toBe(401);expect((await GET(req({}),{params:Promise.resolve({id:'place'})})).status).toBe(401);
 jar.get.mockReturnValue({value:'session'});vi.spyOn(AuthFactory.prototype,'make').mockReturnValue({verify:async()=>({id:'owner',name:'Owner',role:'owner'})});const request=vi.fn().mockResolvedValue({status:'pending'}),get=vi.fn().mockResolvedValue(null);vi.spyOn(SitesFactory.prototype,'make').mockReturnValue({request,get});
 expect((await POST(req({}))).status).toBe(400);expect((await POST(req({},'https://evil.example'))).status).toBe(400);
 const input={companyId:'place',language:'en',brief:'',idempotencyKey:crypto.randomUUID()};expect((await POST(req(input))).status).toBe(202);expect((await GET(req({}),{params:Promise.resolve({id:'place'})})).status).toBe(200);
 request.mockRejectedValueOnce(new DomainError('Conflict',409));expect((await siteRequest(req(input))).status).toBe(409);expect((await siteRequest(req(input),'../bad')).status).toBe(400);vi.restoreAllMocks();
});
