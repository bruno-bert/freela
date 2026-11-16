import { cookies } from 'next/headers';
import type { SearchResult } from '@core/domain/model';
import { session } from '../lib/server/session';
import { content } from '../lib/server/content';
import { getConfigManager } from '../lib/server/config';
import { opportunities } from '../lib/server/opportunities';
import { Workspace } from '../components/workspace';
import { defaultRegion } from '../domain/value-objects/opportunities/region-presets';
export default async function Page() {
 const current = (await session())!; const locale = (await cookies()).get('locale')?.value === 'en' ? 'en' : 'pt-BR'; const config = getConfigManager(); let initial: SearchResult | null = null;
 try { initial = await opportunities(current.token).search({ region: defaultRegion, category: 'all', status: 'all', channel: 'all', locale }); } catch { /* The workspace presents a recoverable error while retaining its region. */ }
 const provider = config.get<string>('infra.maps.provider');
 return <Workspace identity={current.identity} locale={locale} copy={await content(locale, 'workspace')} initial={initial} mapProvider={provider} mapKey={provider === 'google' ? config.secret(config.get('infra.maps.google.apiKeyEnv')) : ''}/>;
}
