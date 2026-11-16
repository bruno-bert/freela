import { z } from 'zod';
import type { SiteRequestInput } from '@core/domain/model';
import { DomainError } from '@core/domain/errors';
import type { SitesPort } from '../../../../domain/ports/repositories/sites.port';
const result = z.object({ id:z.string(), companyId:z.string(), language:z.enum(['en','pt-BR']), brief:z.string(), status:z.literal('pending'), version:z.literal(0), createdAt:z.string(), schemaVersion:z.literal(1) });
export class ProcessApiSitesAdapter implements SitesPort {
 constructor(private readonly baseUrl: string, private readonly token: string, private readonly timeoutMs: number, private readonly fetcher: typeof fetch = fetch) {}
 private async call(path: string, input?: SiteRequestInput) { try { const response = await this.fetcher(`${this.baseUrl}/v1/site-requests${path}`, {method:input?'POST':'GET', headers:{Authorization:`Bearer ${this.token}`,'Content-Type':'application/json'},body:input?JSON.stringify(input):undefined,cache:'no-store',signal:AbortSignal.timeout(this.timeoutMs)}); if (!response.ok) throw new DomainError('Site request failed.',response.status); return result.nullable().parse(await response.json()); } catch(error) { if(error instanceof DomainError) throw error; throw new DomainError('Site request service unavailable.',502); } }
 async request(input: SiteRequestInput) { const value = await this.call('',input); if(!value) throw new DomainError('Invalid site request response.',502); return value; }
 get(companyId: string) { return this.call(`/${encodeURIComponent(companyId)}`); }
}
