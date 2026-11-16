import 'server-only';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthFactory } from '@core/infra/factories/auth/auth.factory';
import { getConfigManager } from './config';
import { assertOrigin } from './session';
export async function login(request: Request) {
 try { assertOrigin(request); const body = z.object({ credential: z.string().max(10000) }).parse(await request.json()); const config = getConfigManager(); const auth = new AuthFactory(config).make(); const token = auth.create ? await auth.create(body.credential) : await auth.signIn!(body.credential);
 (await cookies()).set('freela-session', token, { httpOnly: true, secure: config.get('app.env') === 'production', sameSite: 'lax', path: '/', maxAge: 86400 }); return NextResponse.json({ ok: true });
 } catch { return NextResponse.json({ error: 'Sign-in failed.' }, { status: 401 }); }
}
export async function logout(request: Request) {
 try { assertOrigin(request); const jar = await cookies(); const token = jar.get('freela-session')?.value; if (token) await new AuthFactory(getConfigManager()).make().signOut?.(token); jar.delete('freela-session'); return NextResponse.json({ ok: true }); } catch { return NextResponse.json({ error: 'Sign-out failed.' }, { status: 400 }); }
}
export function authOptions() { const config = getConfigManager(); return { provider: config.get<string>('infra.auth.provider'), firebase: config.get<string>('infra.auth.provider') === 'local' ? null : { ...config.get<Record<string, string>>('infra.auth.firebase-auth.webConfig'), apiKey: config.secret(config.get('infra.auth.firebase-auth.apiKeyEnv')) } }; }
