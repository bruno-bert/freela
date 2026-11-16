import companies from './companies.json';
import copy from '../../docs/content/pt-BR/workspace.json';
import type { Company, WebsiteAudit } from '@core/domain/model';
export const company = companies[0] as Company;
export const t = copy;
export const queuedRequest = {id:'example',companyId:company.id,language:'en' as const,brief:'',status:'pending' as const,version:0 as const,schemaVersion:1 as const,createdAt:'2026-11-16T12:00:00Z'};

export const websiteAudit:WebsiteAudit={url:'https://example.com',analyzedAt:'2026-11-16T12:00:00Z',model:'fixture-no-model-call',summary:{en:'A fictional HTML review.','pt-BR':'Uma revisão fictícia do HTML.'},findings:[{evidenceId:'missing-description',kind:'observed',title:{en:'Add description','pt-BR':'Adicionar descrição'},recommendation:{en:'Describe the services and location.','pt-BR':'Descreva os serviços e a localização.'}}],evidence:[{id:'missing-description',value:'No description metadata in the fetched HTML.'}]};
