import type { Identity, SearchInput, SearchResult } from '@core/domain/model';
export interface SearchOpportunitiesUseCase { execute(owner: Identity, input: SearchInput): Promise<SearchResult>; }
