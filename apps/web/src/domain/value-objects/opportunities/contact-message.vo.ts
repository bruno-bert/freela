import type { Copy, Locale } from '@core/domain/model';
export function validWebUrl(value: string): boolean { try { const url = new URL(value); return url.protocol === 'https:' && url.hostname.includes('.') && !url.username && !url.password; } catch { return false; } }
export function contactMessage(copy: Copy, language: Locale, company: string, portfolio: string, preview: string): string {
 const key = `proposal.${language}.`;
 return [copy[key + (preview ? 'preview' : 'intro')].replace('{company}',company).replace('{preview}',preview), portfolio ? copy[key+'portfolio'].replace('{portfolio}',portfolio) : '', copy[key+'closing']].filter(Boolean).join('\n\n');
}
