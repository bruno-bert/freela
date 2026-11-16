import type { Identity, Company, Locale } from '@core/domain/model';
export interface GetCompanyDetailsUseCase { execute(owner: Identity, input: { companyId: string; locale: Locale }): Promise<Company>; }
