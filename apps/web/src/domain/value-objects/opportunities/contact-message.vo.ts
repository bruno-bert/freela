import type { Copy, Locale } from '@core/domain/model';
export function validWebUrl(value: string): boolean { try { const url = new URL(value); return url.protocol === 'https:' && url.hostname.includes('.') && !url.username && !url.password; } catch { return false; } }
export function contactMessage(copy: Copy, language: Locale, company: string, portfolio: string, preview: string, website = '', findings: string[] = []): string {
 const key = `proposal.${language}.`;
 return [copy[key + (preview ? 'preview' : website ? 'redesign' : 'intro')].replace('{company}',company).replace('{preview}',preview), findings.length ? copy[key+'audit'].replace('{gaps}',findings.slice(0,3).map(value=>`• ${value}`).join('\n')) : '', portfolio ? copy[key+'portfolio'].replace('{portfolio}',portfolio) : '', copy[key+'closing']].filter(Boolean).join('\n\n');
}
