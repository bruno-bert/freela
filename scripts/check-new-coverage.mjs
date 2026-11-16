import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const summary = JSON.parse(readFileSync('coverage/coverage-summary.json','utf8'));
let changed = [];
try { changed = execFileSync('git',['diff','--name-only','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim().split('\n'); } catch { changed = Object.keys(summary).filter(key=>key!=='total'); }
const failures = [];
for (const [file, metrics] of Object.entries(summary)) {
 if (file !== 'total' && changed.some(Boolean) && !changed.some(path=>file.endsWith(path))) continue;
 for (const metric of ['lines','branches','functions','statements']) if (metrics[metric].total > 0 && metrics[metric].pct < 90) failures.push(`${file}: ${metric} ${metrics[metric].pct}%`);
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode=1; } else console.log('Coverage gate passed for changed runtime files.');
