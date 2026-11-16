import type {Identity,ConfirmWhatsappInput,ContactState} from '@core/domain/model';
export interface ConfirmWhatsappUseCase{execute(owner:Identity,input:ConfirmWhatsappInput):Promise<ContactState>;}
