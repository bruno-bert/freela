import 'server-only';
import { z } from 'zod';
import { DomainError } from '@core/domain/errors';
import { SitesFactory } from '../../infra/factories/sites/sites.factory';
import { getConfigManager } from './config';
import { session, assertOrigin } from './session';
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,200}$/);
export async function siteRequest(request: Request, companyId?: string) {
 try { const current = await session(false); if(!current) return Response.json({error:'Authentication required.'},{status:401}); const service = new SitesFactory(getConfigManager(),current.token).make();
 if(companyId !== undefined) return Response.json(await service.get(id.parse(companyId)));
 assertOrigin(request); const input = z.object({companyId:id,language:z.enum(['en','pt-BR']),brief:z.string().trim().max(2000),idempotencyKey:z.string().uuid()}).parse(await request.json()); return Response.json(await service.request(input),{status:202});
 } catch(error) { return Response.json({error:error instanceof DomainError ? error.message : 'Invalid request.'},{status:error instanceof DomainError ? error.status : 400}); }
}
