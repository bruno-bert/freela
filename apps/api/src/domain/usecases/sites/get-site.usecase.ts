import type { Identity, SiteRequest } from '@core/domain/model';
export interface GetSiteRequestUseCase { execute(identity: Identity, input: string): Promise<SiteRequest | null>; }
