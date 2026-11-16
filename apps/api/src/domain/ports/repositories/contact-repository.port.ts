import type { ContactState, RecordContactInput } from '@core/domain/model';
export interface ContactRepositoryPort { get(owner: string, companyId: string): Promise<ContactState>; record(owner: string, command: RecordContactInput): Promise<ContactState>; }
