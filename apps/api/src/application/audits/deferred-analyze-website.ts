import {DomainError} from '@core/domain/errors';
import type {Identity,WebsiteAudit} from '@core/domain/model';
import type {AnalyzeWebsiteUseCase} from '../../domain/usecases/audits/analyze-website.usecase';
export class DeferredAnalyzeWebsite implements AnalyzeWebsiteUseCase{
 async execute(_owner:Identity,_companyId:string):Promise<WebsiteAudit>{throw new DomainError('Website analysis is prepared but the LLM is not connected yet.',503);}
}
