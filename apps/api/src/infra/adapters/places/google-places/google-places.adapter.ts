import { z } from 'zod';
import type { Company, Region, Locale } from '@core/domain/model';
import { DomainError } from '@core/domain/errors';
import type { PlacesPort } from '../../../../domain/ports/places/places.port';
const placeSchema = z.object({ id: z.string(), displayName: z.object({ text: z.string() }), formattedAddress: z.string().optional(), internationalPhoneNumber: z.string().optional(), websiteUri: z.string().optional(), googleMapsUri: z.string().url().optional(), primaryTypeDisplayName: z.object({ text: z.string() }).optional(), location: z.object({ latitude: z.number(), longitude: z.number() }) });
const fields = 'id,displayName,formattedAddress,internationalPhoneNumber,websiteUri,googleMapsUri,primaryTypeDisplayName,location';
export class GooglePlacesAdapter implements PlacesPort {
  readonly provider = 'google-places' as const;
  constructor(private readonly key: string, private readonly timeoutMs: number, private readonly request: typeof fetch = fetch) {}
  private async call(path: string, mask: string, body?: unknown): Promise<unknown> {
    try { const response = await this.request(`https://places.googleapis.com/v1/${path}`, { method: body ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': this.key, 'X-Goog-FieldMask': mask }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(this.timeoutMs) }); if (!response.ok) throw new Error('Provider failure.'); return await response.json(); }
    catch { throw new DomainError('Places provider unavailable. Please retry.', 502); }
  }
  private map(value: z.infer<typeof placeSchema>): Company { return { id: value.id, name: value.displayName.text, category: value.primaryTypeDisplayName?.text ?? '', address: value.formattedAddress ?? '', phone: value.internationalPhoneNumber ?? null, whatsapp: null, instagram: null, website: value.websiteUri ?? null, sourceUrl: value.googleMapsUri ?? null, location: value.location, contact: { contacted: false, version: 0, history: [] }, fictional: false }; }
  async search(region: Region, category: string, locale: Locale) {
    const data = await this.call('places:searchNearby', fields.split(',').map(f => `places.${f}`).join(','), { locationRestriction: { circle: { center: { latitude: region.latitude, longitude: region.longitude }, radius: region.radius } }, maxResultCount: 20, languageCode: locale, rankPreference: 'DISTANCE', ...(category !== 'all' ? { includedTypes: [category] } : {}) });
    try { return z.object({ places: z.array(placeSchema).default([]) }).parse(data).places.map(p => this.map(p)); } catch { throw new DomainError('Invalid Places provider response.', 502); }
  }
  async details(id: string, locale: Locale) { const data = await this.call(`places/${encodeURIComponent(id)}?languageCode=${locale}`, fields); try { return this.map(placeSchema.parse(data)); } catch { throw new DomainError('Invalid Places provider response.', 502); } }
}
