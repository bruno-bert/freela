export type Locale = 'en' | 'pt-BR';
export interface Identity { id: string; name: string; role: 'owner'; }
export interface Region { latitude: number; longitude: number; radius: number; }
export interface SearchInput { region: Region; category: string; status: 'all' | 'new' | 'contacted'; channel: 'all' | 'whatsapp' | 'instagram'; locale: Locale; website?: 'missing' | 'present' | 'all'; }
export interface ContactState { contacted: boolean; version: number; history: { at: string; note: string }[]; }
export interface Company {
  id: string; name: string; category: string; address: string; phone: string | null;
  email?: string | null; whatsapp: string | null; instagram: string | null; website: string | null; sourceUrl: string | null;
  location: { latitude: number; longitude: number }; contact: ContactState; fictional: boolean;
}
export interface SearchResult { companies: Company[]; provider: 'demo' | 'google-places'; exhaustive: false; fetched: number; }
export interface RecordContactInput { companyId: string; expectedVersion: number; idempotencyKey: string; note: string; }
export type Copy = Record<string, string>;
export interface AuthPort { verify(token: string): Promise<Identity>; signIn?(credential: string): Promise<string>; signOut?(token: string): Promise<void>; }
export interface CmsPort { read(locale: Locale, page: string): Promise<Copy>; }
export interface SessionPort { create(idToken: string): Promise<string>; }
export interface SiteRequestInput { companyId: string; language: Locale; brief: string; idempotencyKey: string; }
export interface SiteRequest { id: string; companyId: string; language: Locale; brief: string; status: 'pending'; version: 0; createdAt: string; schemaVersion: 1; }
export interface LocalizedText { en: string; 'pt-BR': string; }
export interface WebsiteFinding { evidenceId: string; title: LocalizedText; recommendation: LocalizedText; kind: 'observed' | 'suggestion'; }
export interface WebsiteAudit { url: string; analyzedAt: string; model: string; summary: LocalizedText; findings: WebsiteFinding[]; evidence: { id: string; value: string }[]; }
