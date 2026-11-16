import type { SiteRequest, SiteRequestInput } from '@core/domain/model';
export interface SitesPort { request(input: SiteRequestInput): Promise<SiteRequest>; get(companyId: string): Promise<SiteRequest | null>; }
