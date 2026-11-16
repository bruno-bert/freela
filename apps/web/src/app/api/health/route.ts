import { getConfigManager } from '../../../lib/server/config';
export const dynamic = 'force-dynamic';
export async function GET() { return Response.json({ status: 'ok', commit: getConfigManager().get('app.commit') }, { headers: { 'Cache-Control': 'no-store' } }); }
