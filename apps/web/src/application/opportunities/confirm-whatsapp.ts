import type {ConfirmWhatsappInput} from '@core/domain/model';
import type {OpportunitiesPort} from '../../domain/ports/repositories/opportunities.port';
import type {ConfirmWhatsappUseCase} from '../../domain/usecases/opportunities/confirm-whatsapp.usecase';
export class ConfirmWhatsapp implements ConfirmWhatsappUseCase{constructor(private readonly repository:OpportunitiesPort){}execute(input:ConfirmWhatsappInput){return this.repository.confirmWhatsapp(input);}}
