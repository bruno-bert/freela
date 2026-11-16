import type { Company, Locale } from '@core/domain/model';
import type { OpportunitiesPort } from '../../domain/ports/repositories/opportunities.port';
import type { GetCompanyDetailsUseCase } from '../../domain/usecases/opportunities/details.usecase';
export class GetCompanyDetails implements GetCompanyDetailsUseCase { constructor(private readonly repository: OpportunitiesPort) {} execute(input: { id: string; locale: Locale }): Promise<Company> { return this.repository.details(input.id, input.locale); } }
