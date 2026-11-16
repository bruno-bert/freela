import { readFile } from 'node:fs/promises';
import { z } from 'zod';
import type { CmsPort, Copy, Locale } from '../../../../domain/model';
export class JsonCmsAdapter implements CmsPort {
  constructor(private readonly contentDir: string) {}
  async read(locale: Locale, page: string): Promise<Copy> {
    if (!['en', 'pt-BR'].includes(locale) || !/^[a-z-]+$/.test(page)) throw new Error('Invalid content reference.');
    return z.record(z.string(), z.string()).parse(JSON.parse(await readFile(`${this.contentDir}/${locale}/${page}.json`, 'utf8')));
  }
}
