/* LanyPang v1.7 — conservative live version detector for preview + installed PWA.
   No storage deletes, no forced refresh, and no polling or timers. */
(()=>{
 'use strict';
 const LOCAL='1.8.0-beta';
 const $=id=>document.getElementById(id);
 let available=null;
 let waitingSW=false;
 const numeric=v=>String(v||'').split('-')[0].split('.').map(x=>parseInt(x,10)||0);
 const isNewer=(remote,local)=>{
   const a=numeric(remote),b=numeric(local);
   return [0,1,2].some((_,i)=>a[i]>b[i]&&a.slice(0,i).every((v,j)=>v===b[j]));
 };
 function show(){
   const banner=$('lany-update-banner');
   const button=$('lany-update-now');
   if(!banner||!button)return;
   banner.hidden=false;
   $('lany-update-msg').textContent=available?'새 버전 '+available.replace('-beta','')+'이 준비됐어요!':'새 게임 화면이 준비됐어요!';
 }
 async function check(){
   if(!navigator.onLine)return;
   try{
     const response=await fetch('./version.json?_fresh='+Date.now(),{cache:'no-store',credentials:'same-origin'});
     if(!response.ok)return;
     const data=await response.json();
     if(typeof data.version!=='string')return;
     if(isNewer(data.version,LOCAL)){available=data.version;show();}
   }catch(_){/* Offline gameplay is more important than update notifications. */}
 }
 async function refresh(){
   const button=$('lany-update-now');
   if(button)button.disabled=true;
   try{
     if('serviceWorker' in navigator){
       const reg=await navigator.serviceWorker.getRegistration();
       if(reg)await reg.update();
     }
   }catch(_){/* Network-fresh navigation still works without an SW update. */}
   const next=new URL(window.location.href);
   next.searchParams.set('v',available?available.split('-')[0]:LOCAL.split('-')[0]);
   next.searchParams.set('_refresh',String(Date.now()));
   window.location.replace(next.href);
 }
 function init(){
   $('lany-update-now')?.addEventListener('click',refresh);
   check();
   window.addEventListener('pageshow',e=>{if(e.persisted)check()},{passive:true});
   window.addEventListener('online',check,{passive:true});
   if('serviceWorker' in navigator)navigator.serviceWorker.addEventListener('controllerchange',()=>{
     if(waitingSW)return;
     waitingSW=true;show();
   });
 }
 window.LanyUpdate={check,refresh,localVersion:LOCAL};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
