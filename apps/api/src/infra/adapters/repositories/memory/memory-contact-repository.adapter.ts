import type { ContactState, RecordContactInput } from '@core/domain/model';
import { DomainError } from '@core/domain/errors';
import type { ContactRepositoryPort } from '../../../../domain/ports/repositories/contact-repository.port';
import { initialContact, recordContact } from '../../../../domain/aggregates/opportunities/contact.aggregate';
export interface MemoryStore { records: Map<string, ContactState>; commands: Map<string, { fingerprint: string; result: ContactState }>; }
export class MemoryContactRepositoryAdapter implements ContactRepositoryPort {
  constructor(private readonly store: MemoryStore) {}
  async get(owner: string, companyId: string) { return structuredClone(this.store.records.get(`${owner}:${companyId}`) ?? initialContact()); }
  async record(owner: string, command: RecordContactInput) {
    const key = `${owner}:${command.companyId}`, request = `${owner}:${command.idempotencyKey}`, fingerprint = JSON.stringify(command), previous = this.store.commands.get(request);
    if (previous) { if (previous.fingerprint !== fingerprint) throw new DomainError('Idempotency key reused for a different command.', 409); return structuredClone(previous.result); }
    const result = recordContact(this.store.records.get(key) ?? initialContact(), command, new Date().toISOString());
    this.store.records.set(key, result); this.store.commands.set(request, { fingerprint, result }); return structuredClone(result);
  }
}
