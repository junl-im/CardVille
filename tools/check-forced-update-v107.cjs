'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const script=fs.readFileSync('web/js/lany-update-v17.js','utf8');
const current=JSON.parse(fs.readFileSync('web/version.json','utf8')).version;
const next=current.replace(/\d+(?=-beta$)/,n=>String(Number(n)+1));
async function scenario({fresh=true,attempted=false,offline=false,assetReady=true,saveOkay=true}={}){
  const timers=[],calls=[],events={},elements={
    'lany-update-banner':{hidden:true},
    'lany-update-now':{disabled:false,addEventListener(){}},
    'lany-update-msg':{textContent:''}
  };
  let saves=0,probes=0,assets=0;
  const document={readyState:'complete',hidden:false,
    querySelector:()=>({content:current}),getElementById:id=>elements[id],addEventListener(){}};
  const navigator={onLine:!offline};
  const window={location:{href:'https://game.example/?v='+(attempted?next:current).split('-')[0]+(attempted?'&_refresh=123':''),replace:url=>calls.push(url)},
    addEventListener:(type,fn)=>{events[type]=fn},LanyShell:{getCurrentScreen:()=> 'game'},LanySession:{save:()=>{saves++;return saveOkay}}};
  const fetch=async url=>String(url).includes('index.html')
    ?(probes++,{ok:true,text:async()=>'<meta name="lany-build-version" content="'+(fresh?next:current)+'">'})
    :String(url).includes('/js/')?(assets++,{ok:assetReady,headers:{get:()=>assetReady?'application/javascript':'text/html'}})
    :{ok:true,json:async()=>({version:next})};
  vm.runInNewContext(script,{document,navigator,window,state:{animating:false,ended:false},URL,Date,fetch,
    setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout:()=>{},
    setInterval:()=>{}});
  await window.LanyUpdate.check();
  for(const fn of timers.slice(0,1))fn();
  for(let i=0;i<30;i++)await Promise.resolve();
  return {calls,saves,probes,assets,timers,elements,events};
}
(async()=>{
  const ready=await scenario();
  assert.equal(ready.calls.length,1,'complete release must switch automatically');
  assert.equal(ready.saves,1,'save settled progress before switching');
  assert.equal(ready.assets,2,'both critical scripts must be available');
  assert(ready.calls[0].includes('_refresh='));
  const partial=await scenario({fresh:false});
  assert.equal(partial.calls.length,0,'partial release must stay on current build');
  assert.equal(partial.saves,0);
  const asset=await scenario({assetReady:false});
  assert.equal(asset.calls.length,0,'missing script must block refresh');
  const storage=await scenario({saveOkay:false});
  assert.equal(storage.calls.length,0,'failed progress save must block refresh');
  assert(storage.elements['lany-update-msg'].textContent.includes('저장할 수 없어'));
  const loop=await scenario({attempted:true});
  assert.equal(loop.timers.length,0,'already attempted build must not reload repeatedly');
  const offline=await scenario({offline:true});
  assert.equal(offline.calls.length,0);
  assert.equal(offline.elements['lany-update-banner'].hidden,true);
  console.log('v107 forced update: pass');
})().catch(error=>{console.error(error);process.exitCode=1});
