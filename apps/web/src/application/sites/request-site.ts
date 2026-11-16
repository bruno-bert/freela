import type { SiteRequestInput } from '@core/domain/model';
import type { SitesPort } from '../../domain/ports/repositories/sites.port';
import type { RequestSiteUseCase } from '../../domain/usecases/sites/request-site.usecase';
export class RequestSite implements RequestSiteUseCase { constructor(private readonly repository: SitesPort) {} execute(input: SiteRequestInput) { return this.repository.request(input); } }
