import type {Identity,ConfirmWhatsappInput} from '@core/domain/model';
import type {ContactRepositoryPort} from '../../domain/ports/repositories/contact-repository.port';
import type {ConfirmWhatsappUseCase} from '../../domain/usecases/opportunities/confirm-whatsapp.usecase';
export class ConfirmWhatsapp implements ConfirmWhatsappUseCase{constructor(private readonly contacts:ContactRepositoryPort){}execute(owner:Identity,input:ConfirmWhatsappInput){return this.contacts.confirmWhatsapp(owner.id,input);}}
