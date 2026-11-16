import type {ConfirmWhatsappInput,ContactState} from '@core/domain/model';
export interface ConfirmWhatsappUseCase{execute(input:ConfirmWhatsappInput):Promise<ContactState>;}
