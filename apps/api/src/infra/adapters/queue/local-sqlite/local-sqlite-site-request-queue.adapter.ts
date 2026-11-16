import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { createHash } from 'node:crypto';
import type { SiteRequest, SiteRequestInput } from '@core/domain/model';
import { DomainError } from '@core/domain/errors';
import type { SiteRequestQueuePort } from '../../../../domain/ports/queue/site-request-queue.port';
import { pendingRequest } from '../../../../domain/aggregates/sites/site-request.aggregate';
export class LocalSqliteSiteRequestQueueAdapter implements SiteRequestQueuePort {
 constructor(private readonly file: string) {}
 private open() { mkdirSync(dirname(this.file), { recursive: true }); const db = new DatabaseSync(this.file); db.exec('PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS requests (owner TEXT, company TEXT, result TEXT NOT NULL, PRIMARY KEY(owner,company)); CREATE TABLE IF NOT EXISTS commands (owner TEXT, key TEXT, fingerprint TEXT NOT NULL, result TEXT NOT NULL, PRIMARY KEY(owner,key));'); return db; }
 async get(owner: string, companyId: string): Promise<SiteRequest | null> { const db = this.open(); try { const row = db.prepare('SELECT result FROM requests WHERE owner=? AND company=?').get(owner, companyId); return row ? JSON.parse(row.result as string) as SiteRequest : null; } finally { db.close(); } }
 async enqueue(owner: string, input: SiteRequestInput): Promise<SiteRequest> {
 const db = this.open(); try { db.exec('BEGIN IMMEDIATE');
 const fingerprint = JSON.stringify(input), previous = db.prepare('SELECT fingerprint,result FROM commands WHERE owner=? AND key=?').get(owner, input.idempotencyKey);
 if (previous && previous.fingerprint !== fingerprint) throw new DomainError('Idempotency key reused for a different request.', 409);
 const row = db.prepare('SELECT result FROM requests WHERE owner=? AND company=?').get(owner,input.companyId);
 const result = previous ? JSON.parse(previous.result as string) as SiteRequest : pendingRequest(row ? JSON.parse(row.result as string) as SiteRequest : null, input, createHash('sha256').update(JSON.stringify([owner,input.companyId])).digest('hex'), new Date().toISOString());
 db.prepare('INSERT OR IGNORE INTO requests VALUES (?,?,?)').run(owner,input.companyId,JSON.stringify(result));
 db.prepare('INSERT OR IGNORE INTO commands VALUES (?,?,?,?)').run(owner,input.idempotencyKey,fingerprint,JSON.stringify(result)); db.exec('COMMIT'); return result;
 } catch (error) { db.exec('ROLLBACK'); if (error instanceof DomainError) throw error; throw new DomainError('Site request storage unavailable.',503); } finally { db.close(); }
 }
}
