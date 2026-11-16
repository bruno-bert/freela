import type { ContactState, RecordContactInput, ConfirmWhatsappInput } from '@core/domain/model';
export interface ContactRepositoryPort { confirmWhatsapp(owner:string,command:ConfirmWhatsappInput):Promise<ContactState>; get(owner: string, companyId: string): Promise<ContactState>; record(owner: string, command: RecordContactInput): Promise<ContactState>; }
