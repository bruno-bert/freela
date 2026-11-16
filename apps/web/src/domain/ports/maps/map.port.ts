import type { Region, Company } from '@core/domain/model';
export interface MapHandle { update(region: Region, companies: Company[]): void; destroy(): void; }
export interface MapPort { mount(element: HTMLElement, region: Region, onSelect: (region: Region) => void): Promise<MapHandle>; }
