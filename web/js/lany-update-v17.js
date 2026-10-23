/* Detect a newer complete release and switch to it after saving a settled board.
   Keep playing when offline or during a partial deployment. */
(()=>{
 'use strict';
 const LOCAL=document.querySelector('meta[name="lany-build-version"]')?.content?.trim()||'';
 const $=id=>document.getElementById(id);
 let available=null,requestSequence=0,refreshing=false,autoTimer=null;
 const POLL_MS=120000;
 const parse=v=>{
   if(typeof v!=='string')return null;
   const m=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z.-]+)?$/.exec(v.trim());
   return m?{parts:m.slice(1,4).map(Number),prerelease:m[4]||null}:null;
 };
 const comparePre=(a,b)=>{
   if(a===b)return 0;
   if(a===null)return 1; // stable release is newer than a prerelease
   if(b===null)return -1;
   const x=a.split('.'),y=b.split('.');
   for(let i=0;i<Math.max(x.length,y.length);i++){
     if(i>=x.length)return -1;
     if(i>=y.length)return 1;
     if(x[i]===y[i])continue;
     const an=/^(0|[1-9]\d*)$/.test(x[i]),bn=/^(0|[1-9]\d*)$/.test(y[i]);
     if(an&&bn)return Number(x[i])>Number(y[i])?1:-1;
     if(an!==bn)return an?-1:1;
     return x[i]>y[i]?1:-1;
   }
   return 0;
 };
 const isNewer=(remote,local)=>{
   const a=parse(remote),b=parse(local);
   if(!a||!b)return false; // Unknown running version cannot claim an update.
   for(let i=0;i<3;i++){
     if(a.parts[i]!==b.parts[i])return a.parts[i]>b.parts[i];
   }
   return comparePre(a.prerelease,b.prerelease)>0;
 };
 function hide(){
   available=null;
   if(autoTimer!==null){clearTimeout(autoTimer);autoTimer=null;}
   const banner=$('lany-update-banner');
   if(banner)banner.hidden=true;
   const button=$('lany-update-now');
   if(button)button.disabled=false;
 }
 function show(version){
   const banner=$('lany-update-banner'),button=$('lany-update-now'),message=$('lany-update-msg');
   if(!banner||!button||!message)return;
   if(available!==version&&autoTimer!==null){clearTimeout(autoTimer);autoTimer=null;}
   available=version;
   message.textContent='새 버전 '+version.replace(/-beta(?:\+.*)?$/,'')+' 확인 중…';
   button.disabled=false;
   banner.hidden=false;
   scheduleAuto(version);
 }
 function alreadyTried(version){
   const url=new URL(window.location.href);
   return url.searchParams.get('v')===version.split('-')[0]&&url.searchParams.has('_refresh');
 }
 function scheduleAuto(version){
   if(autoTimer!==null||alreadyTried(version)||typeof setTimeout!=='function')return;
   autoTimer=setTimeout(()=>{autoTimer=null;if(available===version)refresh();},1200);
 }
 function retrySoon(version){
   if(autoTimer!==null||alreadyTried(version)||typeof setTimeout!=='function')return;
   autoTimer=setTimeout(()=>{autoTimer=null;if(available===version)refresh();},3000);
 }
 async function check(){
   const ticket=++requestSequence;
   if(!navigator.onLine){hide();return false;}
   try{
     const response=await fetch('./version.json?_fresh='+Date.now(),{cache:'no-store',credentials:'same-origin'});
     if(ticket!==requestSequence)return false;
     if(!response.ok){hide();return false;}
     const data=await response.json();
     if(ticket!==requestSequence)return false;
     if(data&&isNewer(data.version,LOCAL)){show(data.version.trim());return true;}
   }catch(_){/* No connection or invalid response: game stays playable. */}
   if(ticket===requestSequence)hide();
   return false;
 }
 async function refresh(){
   if(refreshing||!available||!isNewer(available,LOCAL)||!navigator.onLine)return;
   refreshing=true;
   const target=available;
   const button=$('lany-update-now');
   if(button)button.disabled=true;
   try{
     // version.json may appear before index.html during a release. Confirm that
     // a fresh HTML document really contains the target build before navigating.
     const probe=new URL('./index.html',window.location.href);
     probe.searchParams.set('v',target.split('-')[0]);
     probe.searchParams.set('_update_probe',String(Date.now()));
     const html=await fetch(probe.href,{cache:'no-store',credentials:'same-origin'});
     if(!html.ok||!(await html.text()).includes('name="lany-build-version" content="'+target+'"'))return;
     // A ready HTML page alone is insufficient during staggered uploads.
     for(const path of ['./js/lany-shell.js','./js/lany-polish.js']){
       const asset=new URL(path,window.location.href);
       asset.searchParams.set('v',target.split('-')[0]);
       const response=await fetch(asset.href,{cache:'no-store',credentials:'same-origin'});
       if(!response.ok||!(/javascript/i).test(response.headers?.get?.('content-type')||''))return;
     }
     // Never save a half-resolved cascade. Wait until the accepted move settles.
     for(let i=0;i<30&&typeof state!=='undefined'&&state.animating;i++)
       await new Promise(resolve=>setTimeout(resolve,250));
     if(typeof state!=='undefined'&&state.animating){retrySoon(target);return;}
     if(window.LanyShell?.getCurrentScreen?.()==='game'&&typeof state!=='undefined'&&!state.ended&&window.LanySession?.save?.()!==true){
       // Keep the playable board when storage is full or unavailable.
       const message=$('lany-update-msg');
       if(message)message.textContent='진행 기록을 저장할 수 없어 업데이트를 보류했어요.';
       return;
     }
     if('serviceWorker' in navigator){
       const workers=navigator.serviceWorker,reg=await workers.getRegistration();
       if(reg){
         const previous=workers.controller;
         await reg.update();
         if(previous&&workers.controller===previous){
           await new Promise(resolve=>{
             let timer;
             const done=()=>{clearTimeout(timer);workers.removeEventListener('controllerchange',done);resolve()};
             workers.addEventListener('controllerchange',done);
             timer=setTimeout(done,3000);
             if(workers.controller!==previous)done();
           });
         }
       }
     }
     const next=new URL(window.location.href);
     next.searchParams.set('v',target.split('-')[0]);
     next.searchParams.set('_refresh',String(Date.now()));
     window.location.replace(next.href);
   }catch(_){/* Keep the current playable build when the update is incomplete. */}
   finally{
     refreshing=false;
     if(button)button.disabled=false;
   }
 }
 function init(){
   hide();
   $('lany-update-now')?.addEventListener('click',refresh);
   check();
   if(typeof setInterval==='function')setInterval(()=>{if(!document.hidden)check();},POLL_MS);
   window.addEventListener('pageshow',e=>{if(e.persisted)check()},{passive:true});
   window.addEventListener('focus',check,{passive:true});
   document.addEventListener?.('visibilitychange',()=>{if(!document.hidden)check()},{passive:true});
   window.addEventListener('online',check,{passive:true});
   if('serviceWorker' in navigator)navigator.serviceWorker.addEventListener('controllerchange',check);
 }
 window.LanyUpdate={check,refresh,localVersion:LOCAL,isNewerVersion:isNewer};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
