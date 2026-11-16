import type { Identity, Locale } from '@core/domain/model';
import type { PlacesPort } from '../../domain/ports/places/places.port';
import type { ContactRepositoryPort } from '../../domain/ports/repositories/contact-repository.port';
import type { GetCompanyDetailsUseCase } from '../../domain/usecases/opportunities/details.usecase';
export class GetCompanyDetails implements GetCompanyDetailsUseCase {
  constructor(private readonly places: PlacesPort, private readonly contacts: ContactRepositoryPort) {}
  async execute(owner: Identity, input: { companyId: string; locale: Locale }) { const p = await this.places.details(input.companyId, input.locale); return { ...p, contact: await this.contacts.get(owner.id, p.id) }; }
}
