import { readFileSync,writeFileSync,mkdirSync } from 'node:fs';
const source=readFileSync('coverage/lcov.info','utf8');
const summary=JSON.parse(readFileSync('coverage/coverage-summary.json','utf8'));
for(const app of ['api','web','docs']){
 const prefix=`apps/${app}/src/`;
 const records=source.split('end_of_record').filter(record=>record.split('\n').some(line=>line.startsWith('SF:') && line.includes(prefix)));
 const totals={};for(const key of ['lines','branches','functions','statements'])totals[key]={total:0,covered:0,pct:100};
 for(const [file,data] of Object.entries(summary))if(file.includes(prefix))for(const key of Object.keys(totals)){totals[key].total+=data[key].total;totals[key].covered+=data[key].covered;}
 for(const value of Object.values(totals))value.pct=value.total?Math.round(value.covered/value.total*10000)/100:100;
 mkdirSync(`apps/${app}/coverage`,{recursive:true});writeFileSync(`apps/${app}/coverage/lcov.info`,records.map(record=>record.trim()+'\nend_of_record\n').join(''));writeFileSync(`apps/${app}/coverage/coverage-summary.json`,JSON.stringify({total:totals},null,2)+'\n');
 for(const [metric,value]of Object.entries(totals))if(value.pct<90)throw new Error(`${app} ${metric} coverage ${value.pct}% is below 90%.`);
 console.log(`${app}: ${JSON.stringify(totals)}`);
}
