import { handle } from '../../../../lib/server/experience-api';
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) { return handle(request, 'details', (await context.params).id); }
