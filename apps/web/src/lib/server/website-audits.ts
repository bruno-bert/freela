import 'server-only';
import {AuditsFactory} from '../../infra/factories/audits/audits.factory';
import {getConfigManager} from './config';
export const websiteAudits=(token:string)=>new AuditsFactory(getConfigManager(),token).make();
