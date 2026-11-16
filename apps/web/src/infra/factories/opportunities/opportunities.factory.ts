import { SearchOpportunities } from '../../../application/opportunities/search';
import { GetCompanyDetails } from '../../../application/opportunities/details';
import { RecordContact } from '../../../application/opportunities/record-contact';
import { AbstractFactory, type ConfigManager } from '@core/domain/config';
import type { OpportunitiesPort } from '../../../domain/ports/repositories/opportunities.port';
import { ProcessApiOpportunitiesAdapter } from '../../adapters/repositories/process-api/process-api-opportunities.adapter';
export class OpportunitiesFactory extends AbstractFactory<OpportunitiesPort, OpportunitiesPort> {
 constructor(config: ConfigManager, private readonly token: string) { super(config); }
 protected makeInfra() { return this.select('infra.repositories.provider', { 'process-api': () => new ProcessApiOpportunitiesAdapter(this.config.get('infra.repositories.process-api.baseUrl'), this.token, this.config.get('infra.repositories.process-api.timeoutMs')) }); }
 protected makeService(port: OpportunitiesPort): OpportunitiesPort {
 const search = this.select('domains.opportunities.usecases.search', { default: () => new SearchOpportunities(port) });
 const details = this.select('domains.opportunities.usecases.details', { default: () => new GetCompanyDetails(port) });
 const contact = this.select('domains.opportunities.usecases.recordContact', { default: () => new RecordContact(port) });
 return { search: input => search.execute(input), details: (id, locale) => details.execute({ id, locale }), recordContact: input => contact.execute(input) };
 }
}
