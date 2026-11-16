import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { session, safeReturnTo } from '../../lib/server/session';
import { authOptions } from '../../lib/server/auth-actions';
import { content } from '../../lib/server/content';
import { LoginForm } from '../../components/login-form';
export default async function Login({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) { if (await session(false)) redirect('/'); const locale = (await cookies()).get('locale')?.value === 'en' ? 'en' : 'pt-BR'; return <LoginForm copy={await content(locale, 'workspace')} {...authOptions()} returnTo={safeReturnTo((await searchParams).returnTo ?? null)}/>; }
