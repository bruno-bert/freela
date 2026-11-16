import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {readFileSync,createWriteStream,unlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const require=createRequire(import.meta.url);
const deploymentRequire=createRequire(require.resolve('firebase-tools/package.json'));
const {GoogleAuth}=deploymentRequire('google-auth-library');
const archiver=deploymentRequire('archiver');
// The lockfile-pinned deployment tool owns these dependencies; no application SDK is involved.
export async function deployWeb(sha){
 const source=JSON.parse(readFileSync('deploy/web/firebase.json','utf8')).apphosting;
 if(source.length!==1||source[0].backendId!=='freela-web'||source[0].rootDir!=='apps/web')throw Error('Unexpected App Hosting target');
 const auth=await new GoogleAuth({scopes:['https://www.googleapis.com/auth/cloud-platform']}).getClient();
 const request=async(url,method='GET',data)=>{try{return(await auth.request({url,method,data,headers:{'X-Goog-User-Project':'freela-c8c75'}})).data;}catch(error){throw Error(`Cloud request failed (${error.response?.status??'transport'}): ${error.response?.data?.error?.message??'See cloud operation status'}`);}};
 const filename=join(tmpdir(),`freela-${sha}-${Date.now()}.zip`);
 try{
  const output=createWriteStream(filename);const archive=archiver('zip',{zlib:{level:6}});archive.pipe(output);
  const finished=new Promise((resolve,reject)=>{output.on('close',resolve);output.on('error',reject);archive.on('error',reject);});
  const paths=execFileSync('git',['ls-tree','-r','--name-only',sha],{encoding:'utf8'}).trim().split('\n');
  for(const path of paths){
   if(path.split('/').at(-1)==='.env.example')continue;
   if(/(^|\/)(\.env(?:\..*)?|gha-creds-.*\.json|\.data)(\/|$)/.test(path))throw Error('Credential file in deployment source');
   let content=execFileSync('git',['show',`${sha}:${path}`],{maxBuffer:30*1024*1024});
   if(path==='apps/web/apphosting.yaml'){
    const yaml=content.toString();if(yaml.split('__DEPLOY_COMMIT_SHA__').length!==2)throw Error('Expected one commit marker');content=Buffer.from(yaml.replace('__DEPLOY_COMMIT_SHA__',sha));
   }
   archive.append(content,{name:path});
  }
  await archive.finalize();await finished;
  const object=`release-${sha}-${Date.now()}.zip`;
  const token=(await auth.getAccessToken()).token;
  const upload=await fetch(`https://storage.googleapis.com/upload/storage/v1/b/firebaseapphosting-sources-68606654717-us-central1/o?uploadType=media&name=${object}`,{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/zip','X-Goog-User-Project':'freela-c8c75'},body:readFileSync(filename)});
  if(!upload.ok)throw Error(`Source upload failed: ${upload.status}`);
  const base='https://firebaseapphosting.googleapis.com/v1beta';const backend='projects/freela-c8c75/locations/us-central1/backends/freela-web';
  const id=`r-${sha.slice(0,7)}-${Date.now()}`;
  const operation=await request(`${base}/${backend}/builds?buildId=${id}`,'POST',{source:{archive:{userStorageUri:`gs://firebaseapphosting-sources-68606654717-us-central1/${object}`,rootDirectory:'apps/web'}}});
  console.log(`Building ${backend}/builds/${id}`);
  const poll=async(name)=>{for(let attempt=0;attempt<150;attempt++){const result=await request(`${base}/${name}`);if(result.done){if(result.error)throw Error(result.error.message);return result.response;}await new Promise(resolve=>setTimeout(resolve,10000));}throw Error('Cloud operation timed out');};
  const build=await poll(operation.name);if(build.state!=='READY')throw Error(`Build failed: ${build.error?.message??build.state}`);
  const rollout=await request(`${base}/${backend}/rollouts?rolloutId=${id}`,'POST',{build:`${backend}/builds/${id}`});await poll(rollout.name);
  console.log(`Published web build ${id}`);
 }finally{try{unlinkSync(filename);}catch{/* Source archive may not have been created. */}}
}
