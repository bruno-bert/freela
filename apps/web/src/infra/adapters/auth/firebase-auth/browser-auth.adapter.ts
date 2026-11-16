import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, inMemoryPersistence, setPersistence, signOut } from 'firebase/auth';
import type { BrowserAuthPort } from '../../../../domain/ports/auth/browser-auth.port';
export class FirebaseBrowserAuthAdapter implements BrowserAuthPort {
 constructor(private readonly options: Record<string, string>) {}
 async signIn() { const app = getApps()[0] ?? initializeApp(this.options); const auth = getAuth(app); await setPersistence(auth, inMemoryPersistence); const result = await signInWithPopup(auth, new GoogleAuthProvider()); const token = await result.user.getIdToken(); await signOut(auth); return token; }
}
