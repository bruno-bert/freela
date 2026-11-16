import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
let history = 'Unreleased\n';
try { history += execFileSync('git', ['status', '--short'], { encoding: 'utf8' }); } catch { history += 'Working tree unavailable.\n'; }
try { history += '\n' + execFileSync('git', ['log', '--all', '--date=iso-strict', '--format=Commit: %H%nDate: %aI%nAuthor: %an <%ae>%nSubject: %s%n%n%b', '--numstat'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }); } catch { history += '\nNo commits yet. Changes are listed under Unreleased.\n'; }
for (const locale of ['en','pt-BR']) { const dir = `apps/docs/content/${locale}`; mkdirSync(dir, { recursive: true }); writeFileSync(`${dir}/changelog.json`, JSON.stringify({ history }, null, 2) + '\n'); }
