import {z} from 'zod';
import {DomainError} from '@core/domain/errors';
import type {WebsiteAuditRepositoryPort} from '../../../../domain/ports/repositories/website-audit-repository.port';
const translated=z.object({en:z.string(),'pt-BR':z.string()});
const audit=z.object({url:z.string(),analyzedAt:z.string(),model:z.string(),summary:translated,findings:z.array(z.object({evidenceId:z.string(),title:translated,recommendation:translated,kind:z.enum(['observed','suggestion'])})),evidence:z.array(z.object({id:z.string(),value:z.string()}))});
export class ProcessApiWebsiteAuditAdapter implements WebsiteAuditRepositoryPort{
 constructor(private readonly url:string,private readonly token:string,private readonly timeout:number,private readonly request:typeof fetch=fetch){}
 async analyze(companyId:string){try{const response=await this.request(`${this.url}/v1/website-audits`,{method:'POST',headers:{Authorization:`Bearer ${this.token}`,'Content-Type':'application/json'},body:JSON.stringify({companyId}),cache:'no-store',signal:AbortSignal.timeout(this.timeout)});if(!response.ok)throw new DomainError('Website analysis unavailable.',response.status);return audit.parse(await response.json());}catch(error){if(error instanceof DomainError)throw error;throw new DomainError('Website analysis unavailable.',502);}}
}
