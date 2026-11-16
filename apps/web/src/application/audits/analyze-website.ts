import type {WebsiteAuditRepositoryPort} from '../../domain/ports/repositories/website-audit-repository.port';
import type {AnalyzeWebsiteUseCase} from '../../domain/usecases/audits/analyze-website.usecase';
export class AnalyzeWebsite implements AnalyzeWebsiteUseCase {constructor(private readonly repository:WebsiteAuditRepositoryPort){}execute(companyId:string){return this.repository.analyze(companyId);}}
