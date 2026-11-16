const fs = require('node:fs');
const path = require('node:path');
const auth = require('firebase-tools/lib/auth');
const home = require('node:os').homedir();
async function main() {
 const credentials = JSON.parse(fs.readFileSync(path.join(home,'.config/configstore/firebase-tools.json'),'utf8'));
 const result = await auth.getAccessToken(credentials.tokens.refresh_token, ['https://www.googleapis.com/auth/cloud-platform','https://www.googleapis.com/auth/firebase']);
 const token = result.access_token;
 async function call(url, method='GET', body) { const r=await fetch(url,{method,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined}); const data=await r.json(); return {status:r.status,data}; }
 const project='freela-c8c75';
 if (process.argv.includes('--enable-firestore')) {
 const enabled = await call(`https://serviceusage.googleapis.com/v1/projects/${project}/services/firestore.googleapis.com:enable`, 'POST', {});
 console.log(JSON.stringify({ kind: 'enableFirestore', ...enabled }));
}
 const results = await Promise.all([
 call(`https://cloudbilling.googleapis.com/v1/projects/${project}/billingInfo`),
 call(`https://serviceusage.googleapis.com/v1/projects/${project}/services?filter=state:ENABLED&pageSize=200`),
 call(`https://identitytoolkit.googleapis.com/admin/v2/projects/${project}/config`),
 ]);
 console.log(JSON.stringify(results.map((r,i)=>({kind:['billing','enabledApis','authConfig'][i],status:r.status,data:i===1 && r.status===200?r.data.services?.map(x=>x.config.name):r.data})),null,2));
}
main().catch(error=>{console.error(error.message);process.exitCode=1});
