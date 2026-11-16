import type { SiteRequest } from '@core/domain/model';
export interface GetSiteRequestUseCase { execute(input: string): Promise<SiteRequest | null>; }
