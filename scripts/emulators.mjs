import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve,delimiter } from 'node:path';
const env={...process.env};delete env.DEBUG;delete env.STITCH_API_KEY;
if(existsSync('.data/java/bin/java'))env.PATH=resolve('.data/java/bin')+delimiter+env.PATH;
const child=spawn('pnpm',['exec','firebase','emulators:exec','--project','demo-freela','--config','deploy/shared/firebase.json','--only','firestore','vitest run --config vitest.emulators.config.ts'],{env,stdio:'inherit'});
child.on('exit',code=>{process.exitCode=code??1;});
