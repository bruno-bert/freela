import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const app=process.argv[2];
if(!['web','api'].includes(app))throw Error('Choose web or api');
const sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(process.env.GITHUB_SHA&&process.env.GITHUB_SHA!==sha)throw Error('Checkout SHA mismatch');
const env={...process.env,APP_ENV:'production',DEPLOY_COMMIT_SHA:sha};delete env.DEBUG;delete env.STITCH_API_KEY;
const run=(args)=>execFileSync('pnpm',args,{env,stdio:'inherit'});
const generated=`firebase.${app}.deploy.json`;
const yaml='apps/web/apphosting.yaml';
const original=readFileSync(yaml,'utf8');
try{
 if(app==='web'){
  if(original.split('__DEPLOY_COMMIT_SHA__').length!==2)throw Error('Expected one commit marker');
  writeFileSync(yaml,original.replace('__DEPLOY_COMMIT_SHA__',sha));
  const config=JSON.parse(readFileSync('deploy/web/firebase.json','utf8'));config.apphosting[0].rootDir='apps/web';writeFileSync(generated,JSON.stringify(config));
 }else{
  run(['--filter','@apps/api','build']);
  const file='deploy/api/build/config/production.json';const config=JSON.parse(readFileSync(file,'utf8'));config.app={env:'production',commit:sha};writeFileSync(file,JSON.stringify(config));
  writeFileSync('deploy/api/build/.env',`APP_ENV=production\nDEPLOY_COMMIT_SHA=${sha}\n`);
  writeFileSync(generated,JSON.stringify({functions:[{source:'deploy/api/build',codebase:'opportunities-api',runtime:'nodejs22',ignore:['node_modules','**/*.test.*']}]}));
 }
 run(['exec','firebase','deploy','--project','freela-c8c75','--config',generated,'--only',app==='web'?'apphosting:freela-web':'functions:opportunities-api','--non-interactive']);
 const url=app==='web'?'https://freela-web--freela-c8c75.us-central1.hosted.app/api/health':'https://us-central1-freela-c8c75.cloudfunctions.net/api/health';
 let verified=false;
 for(let attempt=0;attempt<12;attempt++){
  try{const response=await fetch(`${url}?commit=${sha}&attempt=${attempt}`,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});const result=await response.json();verified=response.ok&&result.status==='ok'&&result.commit===sha;}catch{/* The first public route can take time to propagate. */}
  if(verified)break;
  await new Promise(resolve=>setTimeout(resolve,10000));
 }
 if(!verified)throw Error('Served commit verification failed');
 console.log(`Verified ${app}: ${sha}`);
}finally{if(app==='web')writeFileSync(yaml,original);try{unlinkSync(generated);}catch{}}
