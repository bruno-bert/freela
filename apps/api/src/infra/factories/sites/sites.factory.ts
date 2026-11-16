import { AbstractFactory } from '@core/domain/config';
import type { SiteRequestQueuePort } from '../../../domain/ports/queue/site-request-queue.port';
import { RequestSite } from '../../../application/sites/request-site';
import { GetSiteRequest } from '../../../application/sites/get-site';
import { LocalSqliteSiteRequestQueueAdapter } from '../../adapters/queue/local-sqlite/local-sqlite-site-request-queue.adapter';
import { FirestoreSiteRequestQueueAdapter } from '../../adapters/queue/firestore/firestore-site-request-queue.adapter';
export class SitesFactory extends AbstractFactory<{request: RequestSite; get: GetSiteRequest}, SiteRequestQueuePort> {
 protected makeInfra() { return this.select<SiteRequestQueuePort>('infra.queue.provider', {'local-sqlite': () => new LocalSqliteSiteRequestQueueAdapter(this.config.get('infra.queue.local-sqlite.filePath')), 'firestore-pending': () => new FirestoreSiteRequestQueueAdapter(this.config.get('infra.queue.firestore-pending.projectId'))}); }
 protected makeService(queue: SiteRequestQueuePort) { return {request: this.select('domains.sites.usecases.request',{default:()=>new RequestSite(queue)}), get: this.select('domains.sites.usecases.get',{default:()=>new GetSiteRequest(queue)})}; }
}
