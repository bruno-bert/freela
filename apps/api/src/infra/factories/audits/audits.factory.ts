import {AbstractFactory} from '@core/domain/config';
import {AnalyzeWebsite} from '../../../application/audits/analyze-website';
import type {PlacesPort} from '../../../domain/ports/places/places.port';
import type {WebsiteReaderPort} from '../../../domain/ports/websites/website-reader.port';
import type {WebsiteAnalyzerPort} from '../../../domain/ports/ai/website-analyzer.port';
import {GooglePlacesAdapter} from '../../adapters/places/google-places/google-places.adapter';
import {DemoPlacesAdapter} from '../../adapters/places/demo/demo-places.adapter';
import {HttpWebsiteReaderAdapter} from '../../adapters/websites/http/http-website-reader.adapter';
import {FixtureWebsiteReaderAdapter} from '../../adapters/websites/fixture/fixture-website-reader.adapter';
import {VertexWebsiteAnalyzerAdapter} from '../../adapters/ai/vertex/vertex-website-analyzer.adapter';
import {FixtureWebsiteAnalyzerAdapter} from '../../adapters/ai/fixture/fixture-website-analyzer.adapter';
interface Infra{places:PlacesPort;reader:WebsiteReaderPort;analyzer:WebsiteAnalyzerPort;}
export class AuditsFactory extends AbstractFactory<{analyze:AnalyzeWebsite},Infra>{
 protected makeInfra():Infra{return {places:this.select<PlacesPort>('infra.places.provider',{'google-places':()=>new GooglePlacesAdapter(this.config.secret(this.config.get('infra.places.google-places.tokenEnv')),this.config.get('infra.places.google-places.timeoutMs')),demo:()=>new DemoPlacesAdapter()}),reader:this.select<WebsiteReaderPort>('infra.websites.provider',{http:()=>new HttpWebsiteReaderAdapter(this.config.get('infra.websites.http.timeoutMs')),fixture:()=>new FixtureWebsiteReaderAdapter()}),analyzer:this.select<WebsiteAnalyzerPort>('infra.ai.provider',{vertex:()=>new VertexWebsiteAnalyzerAdapter(this.config.get('infra.ai.vertex.projectId'),this.config.get('infra.ai.vertex.model'),this.config.get('infra.ai.vertex.timeoutMs')),fixture:()=>new FixtureWebsiteAnalyzerAdapter()})};}
 protected makeService(infra:Infra){return {analyze:this.select('domains.audits.usecases.analyze',{default:()=>new AnalyzeWebsite(infra.places,infra.reader,infra.analyzer)})};}
}
