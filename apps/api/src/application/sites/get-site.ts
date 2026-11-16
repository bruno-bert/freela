import type { Identity } from '@core/domain/model';
import type { SiteRequestQueuePort } from '../../domain/ports/queue/site-request-queue.port';
import type { GetSiteRequestUseCase } from '../../domain/usecases/sites/get-site.usecase';
export class GetSiteRequest implements GetSiteRequestUseCase { constructor(private readonly queue: SiteRequestQueuePort) {} execute(identity: Identity, input: string) { return this.queue.get(identity.id, input); } }
