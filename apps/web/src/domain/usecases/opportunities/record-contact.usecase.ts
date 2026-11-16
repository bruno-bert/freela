import type { RecordContactInput, ContactState } from '@core/domain/model';
export interface RecordContactUseCase { execute(input: RecordContactInput): Promise<ContactState>; }
