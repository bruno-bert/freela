import type { SearchInput, SearchResult } from '@core/domain/model';
export interface SearchOpportunitiesUseCase { execute(input: SearchInput): Promise<SearchResult>; }
