"use client";
import { useState } from 'react';
import { Button, Card, Icon } from '@design-system';
import type { Copy } from '@core/domain/model';
import { createBrowserAuth } from '../lib/client/auth';
export function LoginForm({ copy: t, provider, firebase, returnTo, onNavigate }: { copy: Copy; provider: string; firebase: Record<string, string> | null; returnTo: string; onNavigate?(path: string): void }) {
 const [busy, setBusy] = useState(false), [error, setError] = useState(false);
 async function login() { setBusy(true); setError(false); try { const credential = provider === 'local' ? 'demo' : await createBrowserAuth(firebase!).signIn(); const response = await fetch('/api/auth/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential }) }); if (!response.ok) throw new Error(); if (onNavigate) onNavigate(returnTo); else window.location.assign(returnTo); } catch { setError(true); setBusy(false); } }
 return <main className="flex min-h-dvh items-center justify-center p-lg"><div className="w-full max-w-login"><div className="mb-xl flex items-center gap-sm text-heading font-semibold"><span className="rounded-panel bg-primary p-sm text-surface"><Icon name="work"/></span>Freelancer Workspace</div><Card className="space-y-lg p-xl"><h1 className="text-heading font-semibold">{t.loginTitle}</h1><p className="text-muted">{t.loginIntro}</p>{provider === 'local' && <p className="rounded-control bg-warning-soft p-md text-warning">{t.localAuth}</p>}{error && <p role="alert" className="text-danger">{t.loginError}</p>}<Button className="w-full" disabled={busy} onClick={login}>{busy ? t.loading : provider === 'local' ? t.demoLogin : t.googleLogin}</Button></Card></div></main>;
}
