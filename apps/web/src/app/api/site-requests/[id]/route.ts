import { siteRequest } from '../../../../lib/server/sites';
export async function GET(request: Request, context: {params: Promise<{id: string}>}) { return siteRequest(request,(await context.params).id); }
