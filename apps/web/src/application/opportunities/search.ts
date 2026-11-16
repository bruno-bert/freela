import type { SearchInput, SearchResult } from '@core/domain/model';
import type { OpportunitiesPort } from '../../domain/ports/repositories/opportunities.port';
import type { SearchOpportunitiesUseCase } from '../../domain/usecases/opportunities/search.usecase';
export class SearchOpportunities implements SearchOpportunitiesUseCase { constructor(private readonly repository: OpportunitiesPort) {} execute(input: SearchInput): Promise<SearchResult> { return this.repository.search(input); } }
