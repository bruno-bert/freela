import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AuthFactory } from '@core/infra/factories/auth/auth.factory';
import { getConfigManager } from './config';
export async function session(required = true) {
 const token = (await cookies()).get('freela-session')?.value;
 try { if (token) return { identity: await new AuthFactory(getConfigManager()).make().verify(token), token }; } catch { /* Invalid sessions are treated as signed out. */ }
 if (required) redirect('/login');
 return null;
}
export function assertOrigin(request: Request) {
 const origin = request.headers.get('origin');
 if (!origin || origin !== (getConfigManager().get<string>('infra.auth.publicOrigin') || new URL(request.url).origin)) throw new Error('Invalid request origin.');
}
export const safeReturnTo = (value: string | null) => value?.startsWith('/') && !value.startsWith('//') && !value.includes('\\') && !/[\r\n]/.test(value) ? value : '/';
