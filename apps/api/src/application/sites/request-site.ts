import type { Identity, SiteRequestInput } from '@core/domain/model';
import type { SiteRequestQueuePort } from '../../domain/ports/queue/site-request-queue.port';
import type { RequestSiteUseCase } from '../../domain/usecases/sites/request-site.usecase';
export class RequestSite implements RequestSiteUseCase { constructor(private readonly queue: SiteRequestQueuePort) {} execute(identity: Identity, input: SiteRequestInput) { return this.queue.enqueue(identity.id, input); } }
