import type { CmsPort, Locale } from '../../domain/model';
import type { GetContentUseCase } from '../../domain/cms';
export class GetContent implements GetContentUseCase { constructor(private readonly cms: CmsPort) {} execute(locale: Locale, page: string) { return this.cms.read(locale, page); } }
