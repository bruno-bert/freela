import type { SitesPort } from '../../domain/ports/repositories/sites.port';
import type { GetSiteRequestUseCase } from '../../domain/usecases/sites/get-site.usecase';
export class GetSiteRequest implements GetSiteRequestUseCase { constructor(private readonly repository: SitesPort) {} execute(input: string) { return this.repository.get(input); } }
