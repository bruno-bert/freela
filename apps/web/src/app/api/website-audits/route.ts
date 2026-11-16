import {z} from 'zod';
import {DomainError} from '@core/domain/errors';
import {session,assertOrigin} from '../../../lib/server/session';
import {websiteAudits} from '../../../lib/server/website-audits';
export const maxDuration=120;
export async function POST(request:Request){try{const current=await session(false);if(!current)return Response.json({error:'Authentication required.'},{status:401});assertOrigin(request);const input=z.object({companyId:z.string().regex(/^[a-zA-Z0-9_-]{1,200}$/)}).strict().parse(await request.json());return Response.json(await websiteAudits(current.token).analyze.execute(input.companyId));}catch(error){return Response.json({error:error instanceof DomainError?error.message:'Invalid request.'},{status:error instanceof DomainError?error.status:400});}}
