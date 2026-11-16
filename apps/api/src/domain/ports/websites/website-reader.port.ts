export interface WebsiteSnapshot { url: string; text: string; evidence: { id: string; value: string }[]; }
export interface WebsiteReaderPort { read(url: string): Promise<WebsiteSnapshot>; }
