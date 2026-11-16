import { handle } from '../../../../lib/server/experience-api';
export const POST = (request: Request) => handle(request, 'search');
