import 'server-only';
import { OpportunitiesFactory } from '../../infra/factories/opportunities/opportunities.factory';
import { getConfigManager } from './config';
export const opportunities = (token: string) => new OpportunitiesFactory(getConfigManager(), token).make();
