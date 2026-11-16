import type { ContactState, RecordContactInput, ConfirmWhatsappInput } from '@core/domain/model';
import { normalizePhone } from '@core/domain/phone';
import { ConflictError, DomainError } from '@core/domain/errors';
export function recordContact(current: ContactState, command: RecordContactInput, now: string): ContactState {
  if (current.version !== command.expectedVersion) throw new ConflictError();
  if (current.contacted) throw new DomainError('Contact has already been recorded.', 409);
  return { ...current, contacted: true, version: current.version + 1, history: [...current.history, { at: now, note: command.note }] };
}
export const initialContact = (): ContactState => ({ contacted: false, version: 0, history: [] });

export function confirmWhatsapp(current:ContactState,command:ConfirmWhatsappInput,now:string):ContactState{
 if(current.version!==command.expectedVersion)throw new ConflictError();
 const number=normalizePhone(command.phone);
 if(!number)throw new DomainError('A valid international phone number is required.',422);
 if(current.whatsappConfirmation?.number===number)return current;
 return {...current,version:current.version+1,whatsappConfirmation:{number,confirmedAt:now}};
}
