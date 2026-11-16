import companies from './companies.json';
import copy from '../../docs/content/pt-BR/workspace.json';
import type { Company } from '@core/domain/model';
export const company = companies[0] as Company;
export const t = copy;
export const queuedRequest = {id:'example',companyId:company.id,language:'en' as const,brief:'',status:'pending' as const,version:0 as const,schemaVersion:1 as const,createdAt:'2026-11-16T12:00:00Z'};
