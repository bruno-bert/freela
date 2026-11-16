import { AbstractFactory, type ConfigManager } from '@core/domain/config';
import type { SitesPort } from '../../../domain/ports/repositories/sites.port';
import { RequestSite } from '../../../application/sites/request-site';
import { GetSiteRequest } from '../../../application/sites/get-site';
import { ProcessApiSitesAdapter } from '../../adapters/repositories/process-api/process-api-sites.adapter';
export class SitesFactory extends AbstractFactory<SitesPort,SitesPort> {
 constructor(config: ConfigManager, private readonly token: string) { super(config); }
 protected makeInfra() { return this.select('infra.repositories.provider',{'process-api':()=>new ProcessApiSitesAdapter(this.config.get('infra.repositories.process-api.baseUrl'),this.token,this.config.get('infra.repositories.process-api.timeoutMs'))}); }
 protected makeService(port: SitesPort): SitesPort { const request = this.select('domains.sites.usecases.request',{default:()=>new RequestSite(port)}), get = this.select('domains.sites.usecases.get',{default:()=>new GetSiteRequest(port)}); return {request:input=>request.execute(input),get:id=>get.execute(id)}; }
}
