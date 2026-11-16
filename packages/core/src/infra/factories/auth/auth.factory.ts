import { AbstractFactory } from '../../../domain/config';
import type { AuthPort, SessionPort } from '../../../domain/model';
import { LocalAuthAdapter } from '../../adapters/auth/local/local-auth.adapter';
import { FirebaseAuthAdapter } from '../../adapters/auth/firebase-auth/firebase-auth.adapter';
export class AuthFactory extends AbstractFactory<AuthPort & Partial<SessionPort>, AuthPort & Partial<SessionPort>> {
  protected makeInfra(): AuthPort & Partial<SessionPort> { return this.select<AuthPort & Partial<SessionPort>>('infra.auth.provider', {
    local: () => new LocalAuthAdapter(this.config.secret(this.config.get('infra.auth.local.secretEnv')), this.config.get('app.env')),
    'firebase-auth': () => new FirebaseAuthAdapter(this.config.get('infra.auth.firebase-auth.projectId'), this.config.get('infra.auth.firebase-auth.roleMapping')),
  }); }
  protected makeService(auth: AuthPort & Partial<SessionPort>) { return this.select('domains.auth.usecases.session', { default: () => auth }); }
}
