import { cookies } from 'next/headers';
import { z } from 'zod';
import { session, assertOrigin } from '../../../lib/server/session';
import { getConfigManager } from '../../../lib/server/config';
export async function POST(request: Request) { try { if (!await session(false)) return Response.json({}, { status: 401 }); assertOrigin(request); const { locale } = z.object({ locale: z.enum(['en', 'pt-BR']) }).parse(await request.json()); (await cookies()).set('locale', locale, { path: '/', sameSite: 'lax', secure: getConfigManager().get('app.env') === 'production', maxAge: 31536000 }); return Response.json({ ok: true }); } catch { return Response.json({}, { status: 400 }); } }
