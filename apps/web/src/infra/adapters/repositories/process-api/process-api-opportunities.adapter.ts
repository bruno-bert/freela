import { z } from 'zod';
import type { SearchInput, SearchResult, Company, Locale, RecordContactInput, ContactState } from '@core/domain/model';
import { DomainError } from '@core/domain/errors';
import type { OpportunitiesPort } from '../../../../domain/ports/repositories/opportunities.port';
const contact = z.object({ contacted: z.boolean(), version: z.number().int(), history: z.array(z.object({ at: z.string(), note: z.string() })) });
const company = z.object({ id: z.string(), name: z.string(), category: z.string(), address: z.string(), phone: z.string().nullable(), email: z.string().nullable().optional(), whatsapp: z.string().nullable(), instagram: z.string().nullable(), website: z.string().nullable(), sourceUrl: z.string().nullable(), location: z.object({ latitude: z.number(), longitude: z.number() }), contact, fictional: z.boolean() });
export class ProcessApiOpportunitiesAdapter implements OpportunitiesPort {
 constructor(private readonly baseUrl: string, private readonly token: string, private readonly timeoutMs: number, private readonly request: typeof fetch = fetch) {}
 private async call(path: string, body?: unknown) { try { const response = await this.request(`${this.baseUrl}${path}`, { method: body ? 'POST' : 'GET', headers: { Authorization: `Bearer ${this.token}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined, cache: 'no-store', signal: AbortSignal.timeout(this.timeoutMs) }); if (!response.ok) throw new DomainError(response.status === 409 ? 'The record changed. Reload and try again.' : 'Request failed.', response.status); return await response.json(); } catch (error) { if (error instanceof DomainError) throw error; throw new DomainError('Process API unavailable.', 502); } }
 async search(input: SearchInput): Promise<SearchResult> { return z.object({ companies: z.array(company), provider: z.enum(['demo', 'google-places']), exhaustive: z.literal(false), fetched: z.number() }).parse(await this.call('/v1/opportunities/search', input)); }
 async details(id: string, locale: Locale): Promise<Company> { return company.parse(await this.call(`/v1/opportunities/${encodeURIComponent(id)}?locale=${locale}`)); }
 async recordContact(input: RecordContactInput): Promise<ContactState> { return contact.parse(await this.call('/v1/contacts', input)); }
}
