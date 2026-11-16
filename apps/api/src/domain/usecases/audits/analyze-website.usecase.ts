import type { Identity, WebsiteAudit } from '@core/domain/model';
export interface AnalyzeWebsiteUseCase { execute(owner: Identity, companyId: string): Promise<WebsiteAudit>; }
