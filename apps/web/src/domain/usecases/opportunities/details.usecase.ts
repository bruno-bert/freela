import type { Company, Locale } from '@core/domain/model';
export interface GetCompanyDetailsUseCase { execute(input: { id: string; locale: Locale }): Promise<Company>; }
