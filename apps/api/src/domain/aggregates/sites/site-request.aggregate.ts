import type { SiteRequest, SiteRequestInput } from '@core/domain/model';
import { ConflictError } from '@core/domain/errors';
export function pendingRequest(current: SiteRequest | null, input: SiteRequestInput, id: string, now: string): SiteRequest {
 if (current) { if (current.language !== input.language || current.brief !== input.brief) throw new ConflictError(); return current; }
 return { id, companyId: input.companyId, language: input.language, brief: input.brief, status: 'pending', version: 0, createdAt: now, schemaVersion: 1 };
}
