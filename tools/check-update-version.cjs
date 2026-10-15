'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const script=fs.readFileSync('web/js/lany-update-v17.js','utf8');
const sw=fs.readFileSync('web/sw.js','utf8');
const html=fs.readFileSync('web/index.html','utf8');
const release=JSON.parse(fs.readFileSync('web/version.json','utf8'));
assert.equal(release.version,'2.3.0-beta');
assert(html.includes('lany-update-v17.js?v=2.3.0'),'approved update handler missing');
assert(sw.includes('lanypang-match-v2.3.0-ko-v24-restore-r3'),'update handler must escape old cached service worker');
assert(!script.includes('localStorage'),'version detection must not touch game progress');
assert(script.includes("cache:'no-store'"),'version probe must not use cached metadata');
assert(script.includes('requestSequence'),'out-of-order server results must not re-show banners');
function make(local=release.version){
 const elements={
   'lany-update-banner':{hidden:true},
   'lany-update-now':{disabled:false,addEventListener(type,fn){this[type]=fn}},
   'lany-update-msg':{textContent:''}
 };
 const calls=[],url={href:'https://cardville.web.app/?source=pwa',replace(u){calls.push(u)}};
 let responseVersion=release.version;
 const requests=[];
 const doc={readyState:'complete',querySelector:()=>local===null?null:{content:local},getElementById:id=>elements[id]};
 const nav={onLine:true};
 const win={location:url,addEventListener(){}};
 let deferred=null;
 async function fetcher(_url,opts){
   assert.equal(opts.cache,'no-store');
   assert.equal(opts.credentials,'same-origin');
   if(deferred)return new Promise(resolve=>requests.push(resolve));
   return {ok:true,json:async()=>({version:responseVersion})};
 }
 vm.runInNewContext(script,{document:doc,navigator:nav,window:win,URL,Date,fetch:fetcher});
 return {elements,calls,nav,win,requests,api:win.LanyUpdate,
    setVersion:v=>{responseVersion=v},defer:v=>{deferred=v},resolve:(index,v)=>requests[index]({ok:true,json:async()=>({version:v})})};
}
(async()=>{
 const t=make();
 await t.api.check();
 assert.equal(t.elements['lany-update-banner'].hidden,true,'same beta version must remain hidden');
 await t.api.refresh();
 assert.equal(t.calls.length,0,'hidden update button cannot refresh');
 t.setVersion('2.2.9-beta');await t.api.check();
 assert.equal(t.elements['lany-update-banner'].hidden,true,'older server must not show an update');
 t.setVersion('2.3.0-beta+build.22');await t.api.check();
 assert.equal(t.elements['lany-update-banner'].hidden,true,'build metadata does not imply update');
 t.setVersion('2.3.1-beta');await t.api.check();
 assert.equal(t.elements['lany-update-banner'].hidden,false,'newer patch must show update');
 assert(t.elements['lany-update-msg'].textContent.includes('2.3.1'));
 t.setVersion('2.3.0-beta');await t.api.check();
 assert.equal(t.elements['lany-update-banner'].hidden,true,'banner must disappear on same version');
 t.setVersion('garbage');await t.api.check();
 assert.equal(t.elements['lany-update-banner'].hidden,true,'invalid metadata must stay quiet');
 t.setVersion('3.0.0-beta');await t.api.check();
 assert.equal(t.elements['lany-update-banner'].hidden,false);
 t.nav.onLine=false;await t.api.check();
 assert.equal(t.elements['lany-update-banner'].hidden,true,'offline should not prompt update');
 const stable=make('2.3.0');
 stable.setVersion('2.3.0-beta');await stable.api.check();
 assert.equal(stable.elements['lany-update-banner'].hidden,true,'beta is older than final');
 const beta=make('2.3.0-beta');
 beta.setVersion('2.3.0');await beta.api.check();
 assert.equal(beta.elements['lany-update-banner'].hidden,false,'final stable is newer than beta');
 assert.equal(beta.api.isNewerVersion('2.3.0-beta','2.3.0-beta'),false);
 assert.equal(beta.api.isNewerVersion('2.3.0-beta.2','2.3.0-beta.1'),true);
 assert.equal(beta.api.isNewerVersion('1.10.0','1.9.9'),true);
 assert.equal(beta.api.isNewerVersion('2.0.0','2.1.0'),false);
 const missing=make(null);missing.setVersion('8.0.0');await missing.api.check();
 assert.equal(missing.elements['lany-update-banner'].hidden,true,'missing local version must not invent updates');
 const race=make();race.defer(true);
 const olderRequest=race.api.check(),latestRequest=race.api.check();
 assert.equal(race.requests.length,2);
 race.resolve(1,'2.3.0-beta');await latestRequest;
 race.resolve(0,'9.9.9-beta');await olderRequest;
 assert.equal(race.elements['lany-update-banner'].hidden,true,'late stale request cannot show update');
 console.log(JSON.stringify({pass:true,release:release.version,sameVersionHidden:true,olderHidden:true,newerShown:true,prereleaseAware:true,offlineHidden:true,raceSafe:true,progressPreserved:true}));
})().catch(e=>{console.error(e);process.exitCode=1});
