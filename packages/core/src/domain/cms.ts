import type { Copy, Locale } from './model';
export interface GetContentUseCase { execute(locale: Locale, page: string): Promise<Copy>; }
