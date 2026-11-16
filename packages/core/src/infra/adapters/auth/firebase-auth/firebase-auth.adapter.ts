import { getApps, initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { AuthPort, Identity, SessionPort } from '../../../../domain/model';
import { DomainError } from '../../../../domain/errors';
export class FirebaseAuthAdapter implements AuthPort, SessionPort {
  constructor(private readonly projectId: string, private readonly roleMapping: Record<string, string>) {}
  private auth() { const app = getApps().find(a => a.name === this.projectId) ?? initializeApp({ credential: applicationDefault(), projectId: this.projectId }, this.projectId); return getAuth(app); }
  async verify(token: string): Promise<Identity> {
    try { const claims = await this.auth().verifySessionCookie(token, true); const role = this.roleMapping[String(claims.role ?? 'authenticated')]; if (role !== 'owner') throw new DomainError('Access denied.', 403); return { id: claims.uid, name: claims.name ?? 'Workspace owner', role }; }
    catch (error) { if (error instanceof DomainError) throw error; throw new DomainError('Authentication required.', 401); }
  }
  async create(idToken: string): Promise<string> {
    try { const claims = await this.auth().verifyIdToken(idToken, true); if (Date.now() / 1000 - claims.auth_time > 300) throw new Error('Recent authentication required.'); return await this.auth().createSessionCookie(idToken, { expiresIn: 86400000 }); }
    catch { throw new DomainError('Recent authentication required.', 401); }
  }
  async signOut(token: string): Promise<void> { const identity = await this.verify(token); await this.auth().revokeRefreshTokens(identity.id); }
}
