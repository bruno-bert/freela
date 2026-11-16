import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AuthPort, Identity } from '../../../../domain/model';
import { DomainError } from '../../../../domain/errors';
export class LocalAuthAdapter implements AuthPort {
  constructor(private readonly secret: string, env: string) { if (env === 'production') throw new Error('Local authentication is forbidden in production.'); }
  async signIn(credential: string): Promise<string> {
    if (credential !== 'demo') throw new DomainError('Invalid development credential.', 401);
    const data = Buffer.from(JSON.stringify({ id: 'demo-owner', name: 'Lucas Martins', role: 'owner', exp: Date.now() + 86400000 })).toString('base64url');
    return `${data}.${createHmac('sha256', this.secret).update(data).digest('base64url')}`;
  }
  async verify(token: string): Promise<Identity> {
    const [data, signature = ''] = token.split('.');
    const expected = createHmac('sha256', this.secret).update(data ?? '').digest('base64url');
    if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new DomainError('Authentication required.', 401);
    let value;
    try { value = JSON.parse(Buffer.from(data, 'base64url').toString()); } catch { throw new DomainError('Invalid session.', 401); }
    if (value.exp < Date.now() || value.id !== 'demo-owner' || value.role !== 'owner') throw new DomainError('Session expired.', 401);
    return { id: value.id, name: value.name, role: value.role };
  }
}
