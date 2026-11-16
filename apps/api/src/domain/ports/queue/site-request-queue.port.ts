import type { SiteRequest, SiteRequestInput } from '@core/domain/model';
export interface SiteRequestQueuePort { get(owner: string, companyId: string): Promise<SiteRequest | null>; enqueue(owner: string, input: SiteRequestInput): Promise<SiteRequest>; }
