import { DomainError } from '@core/domain/errors';
import type { Identity, WebsiteAudit } from '@core/domain/model';
import type { PlacesPort } from '../../domain/ports/places/places.port';
import type { WebsiteReaderPort } from '../../domain/ports/websites/website-reader.port';
import type { WebsiteAnalyzerPort } from '../../domain/ports/ai/website-analyzer.port';
import type { AnalyzeWebsiteUseCase } from '../../domain/usecases/audits/analyze-website.usecase';
export class AnalyzeWebsite implements AnalyzeWebsiteUseCase {
 constructor(private readonly places: PlacesPort,private readonly reader: WebsiteReaderPort,private readonly analyzer: WebsiteAnalyzerPort){}
 async execute(_owner:Identity,companyId:string):Promise<WebsiteAudit>{
  const company=await this.places.details(companyId,'en');
  if(!company.website)throw new DomainError('This business has no website to analyze.',422);
  const snapshot=await this.reader.read(company.website), result=await this.analyzer.analyze(snapshot);
  const ids=new Set(snapshot.evidence.map(item=>item.id));
  if(result.findings.some(item=>!ids.has(item.evidenceId)||(item.kind==='observed'&&item.evidenceId==='page-content')))throw new DomainError('Analysis could not be supported by page evidence.',502);
  return {...result,url:snapshot.url,evidence:snapshot.evidence,analyzedAt:new Date().toISOString(),model:this.analyzer.model};
 }
}
