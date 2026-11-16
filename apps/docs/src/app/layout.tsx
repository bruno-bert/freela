import type { ReactNode } from 'react';
import { cookies } from 'next/headers';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './globals.css';
export const metadata = { title: 'Freelancer Workspace', description: 'Your independent work, organized.' };
export default async function Layout({ children }: { children: ReactNode }) { const locale = (await cookies()).get('locale')?.value === 'en' ? 'en' : 'pt-BR'; return <html lang={locale}><body className="bg-canvas font-sans text-body text-ink antialiased">{children}</body></html>; }
