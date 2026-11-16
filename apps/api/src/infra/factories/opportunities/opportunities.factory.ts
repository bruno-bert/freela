import { AbstractFactory } from '@core/domain/config';
import type { PlacesPort } from '../../../domain/ports/places/places.port';
import type { ContactRepositoryPort } from '../../../domain/ports/repositories/contact-repository.port';
import { SearchOpportunities } from '../../../application/opportunities/search';
import { GetCompanyDetails } from '../../../application/opportunities/details';
import { RecordContact } from '../../../application/opportunities/record-contact';
import { DemoPlacesAdapter } from '../../adapters/places/demo/demo-places.adapter';
import { GooglePlacesAdapter } from '../../adapters/places/google-places/google-places.adapter';
import { MemoryContactRepositoryAdapter, type MemoryStore } from '../../adapters/repositories/memory/memory-contact-repository.adapter';
import { FirestoreContactRepositoryAdapter } from '../../adapters/repositories/firestore/firestore-contact-repository.adapter';
interface Infra { places: PlacesPort; contacts: ContactRepositoryPort; }
interface Services { search: SearchOpportunities; details: GetCompanyDetails; recordContact: RecordContact; }
const store: MemoryStore = { records: new Map(), commands: new Map() };
export class OpportunitiesFactory extends AbstractFactory<Services, Infra> {
  protected makeInfra(): Infra { return {
    places: this.select<PlacesPort>('infra.places.provider', { demo: () => new DemoPlacesAdapter(), 'google-places': () => new GooglePlacesAdapter(this.config.secret(this.config.get('infra.places.google-places.tokenEnv')), this.config.get('infra.places.google-places.timeoutMs')) }),
    contacts: this.select<ContactRepositoryPort>('infra.repositories.provider', { memory: () => new MemoryContactRepositoryAdapter(store), firestore: () => new FirestoreContactRepositoryAdapter(this.config.get('infra.repositories.firestore.projectId')) }),
  }; }
  protected makeService(infra: Infra): Services { return { search: this.select('domains.opportunities.usecases.search', { default: () => new SearchOpportunities(infra.places, infra.contacts) }), details: this.select('domains.opportunities.usecases.details', { default: () => new GetCompanyDetails(infra.places, infra.contacts) }), recordContact: this.select('domains.opportunities.usecases.recordContact', { default: () => new RecordContact(infra.contacts) }) }; }
}
