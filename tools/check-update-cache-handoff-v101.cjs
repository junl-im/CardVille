const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const running=JSON.parse(fs.readFileSync('web/version.json','utf8')).version.split('-')[0];
const next=running.replace(/\d+$/,n=>String(Number(n)+1));

async function checkWorker(){
  const handlers={},cacheHit={source:'old cache'},fresh={source:'network'};
  let requests=0;
  const self={registration:{scope:'https://game.example/'},location:{origin:'https://game.example'},
    addEventListener(type,fn){handlers[type]=fn}};
  const caches={open:async()=>({match:async()=>cacheHit})};
  const fetch=async()=>{requests++;return fresh};
  vm.runInNewContext(fs.readFileSync('web/sw.js','utf8'),{self,caches,fetch,URL,Response:{error:()=>({source:'error'})}});
  const response=async version=>{
    const request={method:'GET',mode:'cors',url:'https://game.example/js/lany-polish.js?v='+version};
    let answer;
    handlers.fetch({request,respondWith(p){answer=p}});
    return answer;
  };
  assert.equal((await response(running)).source,'old cache');
  assert.equal((await response(next)).source,'network');
  assert.equal(requests,1,'new HTML assets must bypass the old cache');
}

async function checkRefresh(){
  const script=fs.readFileSync('web/js/lany-update-v17.js','utf8');
  const elements={
    'lany-update-banner':{hidden:true},
    'lany-update-now':{disabled:false,addEventListener(){}},
    'lany-update-msg':{textContent:''}
  };
  const previous={},listeners=new Set(),calls=[];
  const workers={controller:previous,getRegistration:async()=>({update:async()=>{}}),
    addEventListener(type,fn){if(type==='controllerchange')listeners.add(fn)},
    removeEventListener(type,fn){if(type==='controllerchange')listeners.delete(fn)}};
  const nav={onLine:true,serviceWorker:workers};
  const document={readyState:'complete',querySelector:()=>({content:running+'-beta'}),getElementById:id=>elements[id]};
  const window={location:{href:'https://game.example/?source=pwa',replace(url){calls.push(url)}},addEventListener(){}};
  const timers=[];
  const fetch=async()=>({ok:true,json:async()=>({version:next+'-beta'})});
  vm.runInNewContext(script,{document,navigator:nav,window,URL,Date,fetch,
    setTimeout:fn=>{timers.push(fn);return timers.length},clearTimeout:()=>{}});
  await window.LanyUpdate.check();
  const updating=window.LanyUpdate.refresh();
  for(let i=0;i<8;i++)await Promise.resolve();
  assert.equal(calls.length,0,'do not reload before the new worker controls the page');
  assert.equal(listeners.size,2);
  workers.controller={};for(const fn of [...listeners])fn();
  await updating;
  assert.equal(calls.length,1);
  assert(calls[0].includes('v='+next));
  assert.equal(listeners.size,1,'the permanent version probe listener remains');
}

(async()=>{await checkWorker();await checkRefresh();console.log('v101 update cache handoff: pass')})()
  .catch(error=>{console.error(error);process.exitCode=1});
