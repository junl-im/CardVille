'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('web/js/lany-origin-migration.js','utf8');
const html=fs.readFileSync('web/index.html','utf8');
const sw=fs.readFileSync('web/sw.js','utf8');
assert(html.includes('<script src="./js/lany-origin-migration.js?v=2.3.27"></script>'),'progress importer must load before game state');
assert(sw.includes("'./js/lany-origin-migration.js'"),'offline app must cache importer');
const encode=p=>Buffer.from(JSON.stringify(p),'utf8').toString('base64url');
function run(hash,seed={}){
 const cache=new Map(Object.entries(seed).map(([k,v])=>[k,typeof v==='string'?v:JSON.stringify(v)]));
 const ls={getItem:k=>cache.get(k)??null,setItem:(k,v)=>cache.set(k,String(v)),removeItem:()=>{throw Error('data deletion forbidden')}};
 const loc={hostname:'cardville.web.app',pathname:'/',search:'',hash};
 const hist={replaceState:(_a,_b,p)=>{loc.hash='';assert.equal(p,'/')}};
 const win={};
 vm.runInNewContext(source,{location:loc,history:hist,localStorage:ls,window:win,atob:s=>Buffer.from(s,'base64').toString('utf8')});
 return {cache,loc,win};
}
const p={v:1,source:'pages',unlocked:[1,2,3,8,251,0],best:{1:700,2:400,notstage:999},
  stars:{1:3,2:2,251:3},last:8};
const x=run('#lp-progress='+encode(p),{sc_unlocked:[1,2,4],sc_best:{1:900,3:50},sc_stars:{1:1,4:2},cv_last_level:'4',unrelated:'sensitive-stays-local'});
assert.equal(x.win.LanyOriginMigration.imported,true);
assert.equal(x.cache.get('unrelated'),'sensitive-stays-local');
assert.deepEqual(JSON.parse(x.cache.get('sc_unlocked')),[1,2,3,4,8]);
assert.deepEqual(JSON.parse(x.cache.get('sc_best')),{1:900,2:400,3:50});
assert.deepEqual(JSON.parse(x.cache.get('sc_stars')),{1:3,2:2,4:2});
assert.equal(x.cache.get('cv_last_level'),'8');
assert.equal(x.loc.hash,'');
const bad=run('#lp-progress='+encode({...p,source:'evil'}),{sc_unlocked:[1,6]});
assert.equal(bad.win.LanyOriginMigration.imported,false);
assert.deepEqual(JSON.parse(bad.cache.get('sc_unlocked')),[1,6]);
assert.equal(bad.loc.hash,'');
console.log(JSON.stringify({pass:true,site:'cardville.web.app',safeMerge:true,unchangedUnrelated:true,hashRemoved:true,stageLimit:250}));
