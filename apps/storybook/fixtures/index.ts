import companies from './companies.json';
import copy from '../../docs/content/pt-BR/workspace.json';
import type { Company } from '@core/domain/model';
export const company = companies[0] as Company;
export const t = copy;
