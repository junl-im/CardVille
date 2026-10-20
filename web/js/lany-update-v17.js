/* LanyPang version UX: show update only when the official server has a
   strictly newer valid semantic version than the running HTML build.
   Never show a banner for equal/older/invalid/offline responses or SW churn.
   No periodic polling, no forced reload, and no progress storage writes. */
(()=>{
 'use strict';
 const LOCAL=document.querySelector('meta[name="lany-build-version"]')?.content?.trim()||'';
 const $=id=>document.getElementById(id);
 let available=null,requestSequence=0;
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
   const banner=$('lany-update-banner');
   if(banner)banner.hidden=true;
   const button=$('lany-update-now');
   if(button)button.disabled=false;
 }
 function show(version){
   const banner=$('lany-update-banner'),button=$('lany-update-now'),message=$('lany-update-msg');
   if(!banner||!button||!message)return;
   available=version;
   message.textContent='새 버전 '+version.replace(/-beta(?:\+.*)?$/,'')+'이 준비됐어요!';
   button.disabled=false;
   banner.hidden=false;
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
   if(!available||!isNewer(available,LOCAL))return; // No manual reload on equal versions.
   const button=$('lany-update-now');
   if(button)button.disabled=true;
   try{
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
   }catch(_){/* Navigation itself is network-first. */}
   const next=new URL(window.location.href);
   next.searchParams.set('v',available.split('-')[0]);
   next.searchParams.set('_refresh',String(Date.now()));
   window.location.replace(next.href);
 }
 function init(){
   hide();
   $('lany-update-now')?.addEventListener('click',refresh);
   check();
   window.addEventListener('pageshow',e=>{if(e.persisted)check()},{passive:true});
   window.addEventListener('online',check,{passive:true});
   if('serviceWorker' in navigator)navigator.serviceWorker.addEventListener('controllerchange',check);
 }
 window.LanyUpdate={check,refresh,localVersion:LOCAL,isNewerVersion:isNewer};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
