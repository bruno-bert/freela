import type { Identity, SiteRequest, SiteRequestInput } from '@core/domain/model';
export interface RequestSiteUseCase { execute(identity: Identity, input: SiteRequestInput): Promise<SiteRequest>; }
