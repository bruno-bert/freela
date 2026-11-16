import type {WebsiteAudit} from '@core/domain/model';
export interface AnalyzeWebsiteUseCase {execute(companyId:string):Promise<WebsiteAudit>;}
