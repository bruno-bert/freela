import type {WebsiteAudit} from '@core/domain/model';
export interface WebsiteAuditRepositoryPort {analyze(companyId:string):Promise<WebsiteAudit>;}
