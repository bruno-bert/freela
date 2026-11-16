import type { SearchInput, SearchResult, Company, Locale, RecordContactInput, ContactState } from '@core/domain/model';
export interface OpportunitiesPort { search(input: SearchInput): Promise<SearchResult>; details(id: string, locale: Locale): Promise<Company>; recordContact(input: RecordContactInput): Promise<ContactState>; }
