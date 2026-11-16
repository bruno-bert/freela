import {getApps,initializeApp,applicationDefault} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import {createHash} from 'node:crypto';
import type {ContactState,RecordContactInput,ConfirmWhatsappInput} from '@core/domain/model';
import {ConflictError,DomainError} from '@core/domain/errors';
import type {ContactRepositoryPort} from '../../../../domain/ports/repositories/contact-repository.port';
import {initialContact,recordContact,confirmWhatsapp} from '../../../../domain/aggregates/opportunities/contact.aggregate';
export class FirestoreContactRepositoryAdapter implements ContactRepositoryPort{
 constructor(private readonly projectId:string){}
 private db(){const app=getApps().find(a=>a.name===this.projectId)??initializeApp({credential:applicationDefault(),projectId:this.projectId},this.projectId);return getFirestore(app);}
 private id(value:string){return createHash('sha256').update(value).digest('hex');}
 async get(owner:string,companyId:string):Promise<ContactState>{const snapshot=await this.db().doc(`users/${this.id(owner)}/contacts/${this.id(companyId)}`).get();return snapshot.exists?snapshot.data() as ContactState:initialContact();}
 private async change(owner:string,command:{companyId:string;idempotencyKey:string},fingerprintText:string,transition:(state:ContactState,now:string)=>ContactState):Promise<ContactState>{
  const db=this.db(),contact=db.doc(`users/${this.id(owner)}/contacts/${this.id(command.companyId)}`),request=db.doc(`users/${this.id(owner)}/commands/${this.id(command.idempotencyKey)}`),fingerprint=this.id(fingerprintText);
  try{return await db.runTransaction(async transaction=>{
   const [current,previous]=await transaction.getAll(contact,request);
   if(previous.exists){const record=previous.data()!;if(record.fingerprint!==fingerprint)throw new DomainError('Idempotency key reused for a different command.',409);return record.result as ContactState;}
   const result=transition(current.exists?current.data() as ContactState:initialContact(),new Date().toISOString());
   transaction.set(contact,result);transaction.create(request,{fingerprint,result});return result;
  });}catch(error){if(error instanceof DomainError)throw error;if((error as {code?:number}).code===10)throw new ConflictError();throw new DomainError('Contact persistence unavailable.',503);}
 }
 record(owner:string,command:RecordContactInput){return this.change(owner,command,JSON.stringify(command),(state,now)=>recordContact(state,command,now));}
 confirmWhatsapp(owner:string,command:ConfirmWhatsappInput){return this.change(owner,command,`confirm-whatsapp:${JSON.stringify(command)}`,(state,now)=>confirmWhatsapp(state,command,now));}
}
