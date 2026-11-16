import type { SiteRequest, SiteRequestInput } from '@core/domain/model';
export interface RequestSiteUseCase { execute(input: SiteRequestInput): Promise<SiteRequest>; }
