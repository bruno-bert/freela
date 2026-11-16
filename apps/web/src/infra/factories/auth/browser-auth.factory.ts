import { FirebaseBrowserAuthAdapter } from '../../adapters/auth/firebase-auth/browser-auth.adapter';
export const createBrowserAuth = (options: Record<string, string>) => new FirebaseBrowserAuthAdapter(options);
