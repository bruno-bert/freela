import 'server-only';
import { z } from 'zod';
import { searchCategoryIds } from '@core/domain/place-types';
import { DomainError } from '@core/domain/errors';
import { session, assertOrigin } from './session';
import { opportunities } from './opportunities';
const search = z.object({ region: z.object({ latitude: z.number().min(-90).max(90), longitude: z.number().min(-180).max(180), radius: z.number().min(100).max(50000) }), category: z.enum(searchCategoryIds), status: z.enum(['all', 'new', 'contacted']), channel: z.enum(['all', 'whatsapp', 'instagram']), website: z.enum(['missing','present','all']).default('missing'), locale: z.enum(['en', 'pt-BR']) });
const command = z.object({ companyId: z.string().regex(/^[a-zA-Z0-9_-]{1,200}$/), expectedVersion: z.number().int().nonnegative(), idempotencyKey: z.string().uuid(), note: z.string().max(1000) });
export async function handle(request: Request, action: 'search' | 'contact' | 'details', id?: string) {
 try { const current = await session(false); if (!current) return Response.json({ error: 'Authentication required.' }, { status: 401 }); const service = opportunities(current.token); if (action === 'details') { const locale = z.enum(['en', 'pt-BR']).parse(new URL(request.url).searchParams.get('locale') ?? 'pt-BR'); return Response.json(await service.details(z.string().regex(/^[a-zA-Z0-9_-]{1,200}$/).parse(id), locale)); }
 assertOrigin(request); const body: unknown = await request.json(); return Response.json(action === 'search' ? await service.search(search.parse(body)) : await service.recordContact(command.parse(body)));
 } catch (error) { return Response.json({ error: error instanceof DomainError ? error.message : 'Invalid request.' }, { status: error instanceof DomainError ? error.status : 400 }); }
}
