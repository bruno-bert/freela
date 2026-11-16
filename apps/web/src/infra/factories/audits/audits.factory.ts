import {AbstractFactory,type ConfigManager} from '@core/domain/config';
import type {WebsiteAuditRepositoryPort} from '../../../domain/ports/repositories/website-audit-repository.port';
import {AnalyzeWebsite} from '../../../application/audits/analyze-website';
import {ProcessApiWebsiteAuditAdapter} from '../../adapters/repositories/process-api/process-api-website-audit.adapter';
export class AuditsFactory extends AbstractFactory<{analyze:AnalyzeWebsite},WebsiteAuditRepositoryPort>{
 constructor(config:ConfigManager,private readonly token:string){super(config);}
 protected makeInfra(){return this.select('infra.repositories.provider',{'process-api':()=>new ProcessApiWebsiteAuditAdapter(this.config.get('infra.repositories.process-api.baseUrl'),this.token,this.config.get('infra.repositories.process-api.auditTimeoutMs'))});}
 protected makeService(repository:WebsiteAuditRepositoryPort){return {analyze:this.select('domains.audits.usecases.analyze',{default:()=>new AnalyzeWebsite(repository)})};}
}
