import { session } from '../../lib/server/session';
import { content } from '../../lib/server/content';
import { Documentation } from '../../components/documentation';
export default async function Page() { await session(); return <Documentation content={await content('en', 'guide')} changelog={(await content('en', 'changelog')).history}/>; }
