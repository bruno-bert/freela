import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {deployWeb} from './deploy-web.mjs';
const app=process.argv[2];
if(!['web','api'].includes(app))throw Error('Choose web or api');
const sha=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
if(process.env.GITHUB_SHA&&process.env.GITHUB_SHA!==sha)throw Error('Checkout SHA mismatch');
const env={...process.env,APP_ENV:'production',DEPLOY_COMMIT_SHA:sha};delete env.DEBUG;delete env.STITCH_API_KEY;
const run=(args)=>execFileSync('pnpm',args,{env,stdio:'inherit'});
const generated=`firebase.${app}.deploy.json`;
try{
 if(app==='api'){
  run(['--filter','@apps/api','build']);
  const file='deploy/api/build/config/production.json';const config=JSON.parse(readFileSync(file,'utf8'));config.app={env:'production',commit:sha};writeFileSync(file,JSON.stringify(config));
  writeFileSync('deploy/api/build/.env',`APP_ENV=production\nDEPLOY_COMMIT_SHA=${sha}\n`);
  writeFileSync(generated,JSON.stringify({functions:[{source:'deploy/api/build',codebase:'opportunities-api',runtime:'nodejs22',ignore:['node_modules','**/*.test.*']}]}));
 }
 if(app==='web')await deployWeb(sha);
 else run(['exec','firebase','deploy','--project','freela-c8c75','--config',generated,'--only','functions:opportunities-api','--non-interactive']);
 const url=app==='web'?'https://freela-web--freela-c8c75.us-central1.hosted.app/api/health':'https://us-central1-freela-c8c75.cloudfunctions.net/api/health';
 let verified=false;
 for(let attempt=0;attempt<12;attempt++){
  try{const response=await fetch(`${url}?commit=${sha}&attempt=${attempt}`,{headers:{'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});const result=await response.json();verified=response.ok&&result.status==='ok'&&result.commit===sha;}catch{/* The first public route can take time to propagate. */}
  if(verified)break;
  await new Promise(resolve=>setTimeout(resolve,10000));
 }
 if(!verified)throw Error('Served commit verification failed');
 if(app==='api'){
  const probe=await fetch(`${url}?json-probe=${sha}`,{method:'POST',headers:{'Content-Type':'application/json','Cache-Control':'no-cache'},body:'{"probe":true}',signal:AbortSignal.timeout(15000)});
  if(probe.status!==404)throw Error('Firebase JSON request adapter verification failed');
 }
 if(app==='web'){
  const origin=new URL(url).origin;
  for(const [requestOrigin,expectedStatus] of [[origin,200],['https://invalid-origin.example',400]]){
   const probe=await fetch(`${origin}/api/auth/logout`,{method:'POST',headers:{Origin:requestOrigin,'Cache-Control':'no-cache'},signal:AbortSignal.timeout(15000)});
   if(probe.status!==expectedStatus)throw Error('Published browser origin verification failed');
  }
 }
 console.log(`Verified ${app}: ${sha}`);
}finally{try{unlinkSync(generated);}catch{/* Web source deployment uses no generated config. */}}
