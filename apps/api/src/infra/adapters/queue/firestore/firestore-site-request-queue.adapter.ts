import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createHash } from 'node:crypto';
import type { SiteRequest, SiteRequestInput } from '@core/domain/model';
import { ConflictError, DomainError } from '@core/domain/errors';
import type { SiteRequestQueuePort } from '../../../../domain/ports/queue/site-request-queue.port';
import { pendingRequest } from '../../../../domain/aggregates/sites/site-request.aggregate';
export class FirestoreSiteRequestQueueAdapter implements SiteRequestQueuePort {
 constructor(private readonly projectId: string) {}
 private db() { const app = getApps().find(a => a.name === this.projectId) ?? initializeApp({ credential: applicationDefault(), projectId: this.projectId }, this.projectId); return getFirestore(app); }
 private id(value: string) { return createHash('sha256').update(value).digest('hex'); }
 async get(owner: string, companyId: string): Promise<SiteRequest | null> { try { const snapshot = await this.db().doc(`users/${this.id(owner)}/siteRequests/${this.id(companyId)}`).get(); return snapshot.exists ? snapshot.data() as SiteRequest : null; } catch { throw new DomainError('Site request storage unavailable.',503); } }
 async enqueue(owner: string, input: SiteRequestInput): Promise<SiteRequest> {
 const db = this.db(), request = db.doc(`users/${this.id(owner)}/siteRequests/${this.id(input.companyId)}`), command = db.doc(`users/${this.id(owner)}/siteCommands/${this.id(input.idempotencyKey)}`), fingerprint = this.id(JSON.stringify(input));
 try { return await db.runTransaction(async transaction => { const [current, previous] = await transaction.getAll(request,command);
 if (previous.exists) { const saved = previous.data()!; if (saved.fingerprint !== fingerprint) throw new DomainError('Idempotency key reused for a different request.',409); return saved.result as SiteRequest; }
 const result = pendingRequest(current.exists ? current.data() as SiteRequest : null,input,this.id(JSON.stringify([owner,input.companyId])),new Date().toISOString());
 if (!current.exists) transaction.create(request,result); transaction.create(command,{fingerprint,result}); return result;
 }); } catch (error) { if (error instanceof DomainError) throw error; if ((error as {code?: number}).code === 10) throw new ConflictError(); throw new DomainError('Site request storage unavailable.',503); }
 }
}
