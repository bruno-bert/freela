import { AbstractFactory } from '../../../domain/config';
import type { CmsPort } from '../../../domain/model';
import type { GetContentUseCase } from '../../../domain/cms';
import { GetContent } from '../../../application/content/get-content';
import { JsonCmsAdapter } from '../../adapters/cms/json/json-cms.adapter';
export class ContentFactory extends AbstractFactory<GetContentUseCase, CmsPort> {
  protected makeInfra() { return this.select('infra.cms.provider', { json: () => new JsonCmsAdapter(this.config.get('infra.cms.json.contentDir')) }); }
  protected makeService(cms: CmsPort) { return this.select('domains.content.usecases.getContent', { default: () => new GetContent(cms) }); }
}
