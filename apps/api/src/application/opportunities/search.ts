import type { Identity, SearchInput, SearchResult } from '@core/domain/model';
import type { PlacesPort } from '../../domain/ports/places/places.port';
import type { ContactRepositoryPort } from '../../domain/ports/repositories/contact-repository.port';
import type { SearchOpportunitiesUseCase } from '../../domain/usecases/opportunities/search.usecase';
import { Region } from '../../domain/value-objects/opportunities/region.vo';
import { PlaceCategory } from '../../domain/value-objects/opportunities/category.vo';
export class SearchOpportunities implements SearchOpportunitiesUseCase {
  constructor(private readonly places: PlacesPort, private readonly contacts: ContactRepositoryPort) {}
  async execute(owner: Identity, input: SearchInput): Promise<SearchResult> {
    const places = await this.places.search(new Region(input.region).value, new PlaceCategory(input.category).value, input.locale);
    const eligible = places.filter(p => !p.website);
    const companies = await Promise.all(eligible.map(async p => ({ ...p, contact: await this.contacts.get(owner.id, p.id) })));
    return { companies: companies.filter(p => (input.status === 'all' || (input.status === 'contacted') === p.contact.contacted) && (input.channel === 'all' || Boolean(p[input.channel]))), provider: this.places.provider, exhaustive: false, fetched: places.length };
  }
}
