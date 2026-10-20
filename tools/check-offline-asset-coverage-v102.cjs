const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const sw=fs.readFileSync('web/sw.js','utf8');
const html=fs.readFileSync('web/index.html','utf8');
const listCode=sw.slice(sw.indexOf('const PRECACHE='),sw.indexOf('const SCOPE='));
assert(listCode.startsWith('const PRECACHE='),'service worker precache missing');
const precache=new Set(vm.runInNewContext(listCode+';PRECACHE'));
const used=new Set();
const cssFiles=new Set();
const jsFiles=new Set();
const normalize=(from,reference)=>{
  const clean=reference.split(/[?#]/)[0];
  if(!clean||/^(?:data:|https?:|#)/.test(clean))return null;
  return './'+path.posix.normalize(path.posix.join(path.posix.dirname(from),clean));
};
for(const match of html.matchAll(/<(?:script|link|img)\b[^>]*?\b(?:src|href)=["'](\.\/[^"']+)["']/g)){
  const file='./'+match[1].slice(2).split(/[?#]/)[0];
  if(!fs.existsSync('web/'+file))continue;
  used.add(file);
  if(file.endsWith('.css'))cssFiles.add(file);
  if(file.endsWith('.js'))jsFiles.add(file);
}
for(const file of cssFiles){
  const css=fs.readFileSync('web/'+file,'utf8');
  for(const match of css.matchAll(/url\(\s*['"]?([^)'"\s]+)['"]?\s*\)/g)){
    const asset=normalize(file,match[1]);
    if(asset&&fs.existsSync('web/'+asset))used.add(asset);
  }
}
for(const source of [html,...[...jsFiles].map(file=>fs.readFileSync('web/'+file,'utf8'))]){
  for(const match of source.matchAll(/["'](\.\/assets\/[^"'\s]+\.(?:webp|png|jpg))["']/g)){
    if(fs.existsSync('web/'+match[1]))used.add(match[1]);
  }
}
const missing=[...used].filter(file=>!precache.has(file)).sort();
assert.deepEqual(missing,[],`offline precache missing ${missing.length} loaded assets:\n${missing.join('\n')}`);
console.log(`v102 offline asset coverage: ${used.size} files checked`);
