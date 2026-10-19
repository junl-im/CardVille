const fs=require('node:fs');
const assert=require('node:assert/strict');
const shell=fs.readFileSync('web/js/lany-shell.js','utf8');
const html=fs.readFileSync('web/index.html','utf8');
const sw=fs.readFileSync('web/sw.js','utf8');
assert(shell.includes('const pageWindow=(page,size)=>'));
assert(shell.includes('const pageForOffset=(offset,size)=>'));
assert(shell.includes('pageWindow(nav.mapPage,size)'));
assert(shell.includes('pageForOffset(anchor,mapPageSize())'));
assert(html.includes('function readCampaignSave(key,fallback)'));
assert(html.includes('Array.isArray(unlocked)?[...new Set([1,'));
assert(sw.includes('v88-mode-balance-r1'));
for(const size of [3,6,9,12]){
 const pages=Math.ceil(25/size),base=Math.floor(25/pages),extra=25%pages;
 const counts=Array.from({length:pages},(_,p)=>base+(p<extra?1:0));
 assert.equal(counts.reduce((a,b)=>a+b,0),25);
 assert(counts.every(n=>n<=size&&n>=2),`orphan page with size ${size}`);
}
console.log('v46 balanced map pages and save recovery: OK');

