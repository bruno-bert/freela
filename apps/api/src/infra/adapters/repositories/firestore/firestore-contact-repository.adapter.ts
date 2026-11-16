import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createHash } from 'node:crypto';
import type { ContactState, RecordContactInput } from '@core/domain/model';
import { ConflictError, DomainError } from '@core/domain/errors';
import type { ContactRepositoryPort } from '../../../../domain/ports/repositories/contact-repository.port';
import { initialContact, recordContact } from '../../../../domain/aggregates/opportunities/contact.aggregate';
export class FirestoreContactRepositoryAdapter implements ContactRepositoryPort {
  constructor(private readonly projectId: string) {}
  private db() { const app = getApps().find(a => a.name === this.projectId) ?? initializeApp({ credential: applicationDefault(), projectId: this.projectId }, this.projectId); return getFirestore(app); }
  private id(value: string) { return createHash('sha256').update(value).digest('hex'); }
  async get(owner: string, companyId: string): Promise<ContactState> { const snapshot = await this.db().doc(`users/${this.id(owner)}/contacts/${this.id(companyId)}`).get(); return snapshot.exists ? snapshot.data() as ContactState : initialContact(); }
  async record(owner: string, command: RecordContactInput): Promise<ContactState> {
    const db = this.db(), contact = db.doc(`users/${this.id(owner)}/contacts/${this.id(command.companyId)}`), request = db.doc(`users/${this.id(owner)}/commands/${this.id(command.idempotencyKey)}`), fingerprint = this.id(JSON.stringify(command));
    try { return await db.runTransaction(async transaction => {
      const [current, previous] = await transaction.getAll(contact, request);
      if (previous.exists) { const record = previous.data()!; if (record.fingerprint !== fingerprint) throw new DomainError('Idempotency key reused for a different command.', 409); return record.result as ContactState; }
      const result = recordContact(current.exists ? current.data() as ContactState : initialContact(), command, new Date().toISOString());
      transaction.set(contact, result); transaction.create(request, { fingerprint, result }); return result;
    }); } catch (error) { if (error instanceof DomainError) throw error; if ((error as { code?: number }).code === 10) throw new ConflictError(); throw new DomainError('Contact persistence unavailable.', 503); }
  }
}
