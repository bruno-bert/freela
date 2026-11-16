import type {WebsiteReaderPort} from '../../../../domain/ports/websites/website-reader.port';
export class FixtureWebsiteReaderAdapter implements WebsiteReaderPort {async read(url:string){return {url,text:'A fictional small business website.',evidence:[{id:'missing-description',value:'No description metadata in the fetched HTML.'}]};}}
