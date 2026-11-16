import 'server-only';
import { ContentFactory } from '@core/infra/factories/content/content.factory';
import type { Locale } from '@core/domain/model';
import { getConfigManager } from './config';
export const content = (locale: Locale, page: string) => new ContentFactory(getConfigManager()).make().execute(locale, page);
