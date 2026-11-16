import type { Identity, RecordContactInput, ContactState } from '@core/domain/model';
export interface RecordContactUseCase { execute(owner: Identity, input: RecordContactInput): Promise<ContactState>; }
