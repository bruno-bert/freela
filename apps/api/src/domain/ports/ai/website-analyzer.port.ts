import type { LocalizedText, WebsiteFinding } from '@core/domain/model';
import type { WebsiteSnapshot } from '../websites/website-reader.port';
export interface WebsiteAnalyzerPort { readonly model: string; analyze(snapshot: WebsiteSnapshot): Promise<{summary: LocalizedText; findings: WebsiteFinding[]}>; }
