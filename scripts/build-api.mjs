import { build } from 'esbuild';
import { rm,mkdir,cp,writeFile } from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for (const [entry,output] of [['src/main.ts','dist/main.cjs'],['src/functions.ts','dist/functions.cjs']]) await build({ entryPoints:[entry],outfile:output,bundle:true,platform:'node',target:'node22',format:'cjs',sourcemap:true,external:['@fastify/swagger-ui','firebase-admin','firebase-admin/*','firebase-functions','firebase-functions/*'] });

const staging='../../deploy/api/build';
await mkdir(staging,{recursive:true});
await cp('dist/functions.cjs',`${staging}/functions.cjs`);
await cp('config',`${staging}/config`,{recursive:true});
await writeFile(`${staging}/package.json`,JSON.stringify({name:'freela-opportunities-api',private:true,main:'functions.cjs',engines:{node:'22'},dependencies:{'firebase-admin':'13.10.0','firebase-functions':'7.4.0','@fastify/swagger-ui':'5.2.6'}},null,2)+'\n');
