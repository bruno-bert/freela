import type { Company, Region, Locale } from '@core/domain/model';
export interface PlacesPort { search(region: Region, category: string, locale: Locale): Promise<Company[]>; details(id: string, locale: Locale): Promise<Company>; readonly provider: 'demo' | 'google-places'; }
