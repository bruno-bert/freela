import type { RecordContactInput, ContactState } from '@core/domain/model';
import type { OpportunitiesPort } from '../../domain/ports/repositories/opportunities.port';
import type { RecordContactUseCase } from '../../domain/usecases/opportunities/record-contact.usecase';
export class RecordContact implements RecordContactUseCase { constructor(private readonly repository: OpportunitiesPort) {} execute(input: RecordContactInput): Promise<ContactState> { return this.repository.recordContact(input); } }
