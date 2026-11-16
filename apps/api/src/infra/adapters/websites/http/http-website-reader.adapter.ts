import {lookup} from 'node:dns/promises';
import {request as httpsRequest} from 'node:https';
import {request as httpRequest} from 'node:http';
import type {IncomingHttpHeaders} from 'node:http';
import ipaddr from 'ipaddr.js';
import {load} from 'cheerio';
import {DomainError} from '@core/domain/errors';
import type {WebsiteReaderPort,WebsiteSnapshot} from '../../../../domain/ports/websites/website-reader.port';
type Address={address:string;family:number};
type Page={status:number;headers:IncomingHttpHeaders;body:string};
type Resolve=(host:string)=>Promise<Address[]>;
type Transport=(url:URL,address:Address,timeout:number)=>Promise<Page>;
const transport:Transport=(url,address,timeout)=>new Promise((resolve,reject)=>{
 const send=url.protocol==='https:'?httpsRequest:httpRequest;
 const req=send({hostname:address.address,family:address.family,servername:url.hostname,port:url.protocol==='https:'?443:80,path:url.pathname+url.search,method:'GET',agent:false,headers:{Host:url.host,'User-Agent':'FreelaWebsiteReview/1.0',Accept:'text/html,application/xhtml+xml','Accept-Encoding':'identity'}},res=>{
  const chunks:Buffer[]=[];let bytes=0;
  res.on('data',(chunk:Buffer)=>{bytes+=chunk.length;if(bytes>1024*1024){req.destroy(new Error('Page too large'));return;}chunks.push(chunk);});
  res.on('error',reject);res.on('end',()=>resolve({status:res.statusCode??0,headers:res.headers,body:Buffer.concat(chunks).toString('utf8')}));
 });
 const timer=setTimeout(()=>req.destroy(new Error('Website timeout')),timeout);req.on('close',()=>clearTimeout(timer));req.on('error',reject);req.end();
});
export class HttpWebsiteReaderAdapter implements WebsiteReaderPort {
 constructor(private readonly timeout:number,private readonly resolve:Resolve=host=>lookup(host,{all:true}),private readonly readPage:Transport=transport){}
 async read(value:string):Promise<WebsiteSnapshot>{
  try{
   let url=new URL(value);let page:Page|undefined;const deadline=Date.now()+this.timeout;
   for(let redirects=0;redirects<=3;redirects++){
    if(!['https:','http:'].includes(url.protocol)||url.username||url.password||(url.port&&url.port!==(url.protocol==='https:'?'443':'80'))||!url.hostname.includes('.'))throw new Error('Unsafe website');
    let timer:ReturnType<typeof setTimeout>|undefined;
    const addresses=await Promise.race([this.resolve(url.hostname),new Promise<never>((_resolve,reject)=>{timer=setTimeout(()=>reject(new Error('DNS timeout')),Math.max(1,deadline-Date.now()));})]).finally(()=>clearTimeout(timer));
    if(!addresses.length||addresses.some(item=>ipaddr.process(item.address).range()!=='unicast'))throw new Error('Unsafe network');
    const remaining=deadline-Date.now();if(remaining<=0)throw new Error('Website timeout');
    page=await this.readPage(url,addresses.find(item=>item.family===4)??addresses[0],remaining);
    if(page.status>=300&&page.status<400&&typeof page.headers.location==='string'){url=new URL(page.headers.location,url);continue;}
    break;
   }
   if(!page||(page.headers['content-encoding']&&page.headers['content-encoding']!=='identity')||page.status<200||page.status>=300||!String(page.headers['content-type']).match(/text\/html|application\/xhtml\+xml/i)||Buffer.byteLength(page.body)>1024*1024)throw new Error('Unreadable website');
   const $=load(page.body);$('script,style,noscript,template,iframe').remove();
   const text=$('body').text().replace(/\s+/g,' ').trim().slice(0,12000);
   const evidence:WebsiteSnapshot['evidence']=[{id:'page-content',value:text.slice(0,2000)||'No readable text in the fetched HTML.'}];
   if(!$('title').text().trim())evidence.push({id:'missing-title',value:'No non-empty title in the fetched HTML.'});
   if(!$('meta[name="description"]').attr('content')?.trim())evidence.push({id:'missing-description',value:'No description metadata in the fetched HTML.'});
   if(!$('meta[name="viewport"]').length)evidence.push({id:'missing-viewport',value:'No viewport metadata in the fetched HTML.'});
   if(!$('h1').text().trim())evidence.push({id:'missing-heading',value:'No non-empty H1 in the fetched HTML.'});
   const missing=$('img').filter((_index,element)=>$(element).attr('alt')===undefined).length;
   if(missing)evidence.push({id:'images-without-alt',value:`${missing} image elements without an alt attribute in the fetched HTML.`});
   if(!$('a[href^="tel:"],a[href^="mailto:"],a[href*="wa.me"],a[href*="whatsapp.com"],form').length)evidence.push({id:'no-contact-action',value:'No telephone/email/WhatsApp action links or form in the fetched HTML.'});
   return {url:url.href,text,evidence};
  }catch{throw new DomainError('Could not safely read this public website. Try another website.',422);}
 }
}
