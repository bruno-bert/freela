import type {ContactState,RecordContactInput,ConfirmWhatsappInput} from '@core/domain/model';
import {DomainError} from '@core/domain/errors';
import type {ContactRepositoryPort} from '../../../../domain/ports/repositories/contact-repository.port';
import {initialContact,recordContact,confirmWhatsapp} from '../../../../domain/aggregates/opportunities/contact.aggregate';
export interface MemoryStore {records:Map<string,ContactState>;commands:Map<string,{fingerprint:string;result:ContactState}>;}
export class MemoryContactRepositoryAdapter implements ContactRepositoryPort {
 constructor(private readonly store:MemoryStore){}
 async get(owner:string,companyId:string){return structuredClone(this.store.records.get(`${owner}:${companyId}`)??initialContact());}
 private async change(owner:string,command:{companyId:string;idempotencyKey:string},fingerprint:string,transition:(state:ContactState,now:string)=>ContactState){
  const key=`${owner}:${command.companyId}`,request=`${owner}:${command.idempotencyKey}`,previous=this.store.commands.get(request);
  if(previous){if(previous.fingerprint!==fingerprint)throw new DomainError('Idempotency key reused for a different command.',409);return structuredClone(previous.result);}
  const result=transition(this.store.records.get(key)??initialContact(),new Date().toISOString());
  this.store.records.set(key,result);this.store.commands.set(request,{fingerprint,result});return structuredClone(result);
 }
 record(owner:string,command:RecordContactInput){return this.change(owner,command,JSON.stringify(command),(state,now)=>recordContact(state,command,now));}
 confirmWhatsapp(owner:string,command:ConfirmWhatsappInput){return this.change(owner,command,`confirm-whatsapp:${JSON.stringify(command)}`,(state,now)=>confirmWhatsapp(state,command,now));}
}
