import type { Identity, RecordContactInput } from '@core/domain/model';
import type { ContactRepositoryPort } from '../../domain/ports/repositories/contact-repository.port';
import type { RecordContactUseCase } from '../../domain/usecases/opportunities/record-contact.usecase';
export class RecordContact implements RecordContactUseCase {
  constructor(private readonly contacts: ContactRepositoryPort) {}
  execute(owner: Identity, command: RecordContactInput) { return this.contacts.record(owner.id, command); }
}
