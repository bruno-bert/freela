import type {Company,ContactState} from './model';
import {normalizePhone} from './phone';
export const whatsappCandidate=(company:Company):string|null=>normalizePhone(company.whatsapp)??normalizePhone(company.phone);
export function withContactState(company:Company,contact:ContactState):Company{
 if(contact.version<company.contact.version)return company;
 const source=whatsappCandidate(company),confirmation=contact.whatsappConfirmation;
 const confirmed=Boolean(confirmation&&(!source||confirmation.number===source));
 return {...company,contact,whatsapp:confirmed?confirmation!.number:company.whatsapp,whatsappConfirmed:confirmed};
}
