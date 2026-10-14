/* 라니팡 v1.4: real PWA install prompt with iOS/desktop browser fallbacks. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 let pending=null,installed=false,opening=false;
 const standalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
 const isIOS=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(/Macintosh/.test(navigator.userAgent)&&navigator.maxTouchPoints>1);
 const isAndroid=()=>/Android/i.test(navigator.userAgent);
 const update=()=>{
   installed=installed||standalone();
   const button=$('lany-install-button');
   if(button){button.hidden=installed;button.disabled=installed;button.setAttribute('aria-hidden',String(installed));}
   document.documentElement.classList.toggle('lany-installed-pwa',installed);
   if(installed)close();
 };
 function close(){const dialog=$('lany-install-modal');if(dialog)dialog.hidden=true;opening=false;}
 function guide(){
   const heading=$('lany-install-guide-title'),steps=$('lany-install-guide-steps'),hint=$('lany-install-guide-hint');
   if(!heading||!steps||!hint)return;
   steps.replaceChildren();
   let title,parts,message;
   if(isIOS()){
     title='아이폰·아이패드에 라니팡 설치';
     parts=['Safari에서 이 게임 주소를 엽니다.','화면의 공유 버튼(□↑)을 누릅니다.','홈 화면에 추가를 선택하고 추가를 누릅니다.'];
     message='아이폰에서는 설치 버튼이 자동으로 뜨지 않습니다. Safari의 홈 화면 추가 기능을 이용해 주세요.';
   }else if(isAndroid()){
     title='안드로이드에 라니팡 설치';
     parts=['Chrome에서 이 게임을 엽니다.','오른쪽 위 ⋮ 메뉴에서 앱 설치 또는 홈 화면에 추가를 누릅니다.','설치를 완료하면 홈 화면의 라니팡 아이콘으로 실행할 수 있습니다.'];
     message='브라우저 종류·설치 지원 여부에 따라 메뉴 문구가 다를 수 있습니다.';
   }else{
     title='PC에 라니팡 설치';
     parts=['Chrome 또는 Edge에서 라니팡을 엽니다.','주소창의 설치 아이콘이 있다면 누르거나, 브라우저 ⋮ 메뉴에서 설치 메뉴를 찾습니다.','설치가 완료되면 바탕화면·앱 목록에서 독립 게임 창으로 실행할 수 있습니다.'];
     message='설치 항목이 보이지 않으면 브라우저가 설치를 지원하는지 확인해 주세요.';
   }
   heading.textContent=title;hint.textContent=message;
   for(const part of parts){const li=document.createElement('li');li.textContent=part;steps.appendChild(li);}
 }
 function showGuide(){
   if(installed||standalone())return;
   guide();const dialog=$('lany-install-modal');if(!dialog)return;
   dialog.hidden=false;opening=true;dialog.querySelector('.lany-install-close')?.focus();
 }
 async function install(){
   if(installed||standalone()){update();return;}
   if(!pending){showGuide();return;}
   const event=pending;pending=null;
   const button=$('lany-install-button');if(button)button.disabled=true;
   try{
     await event.prompt();
     const choice=await event.userChoice;
     if(choice?.outcome==='accepted'){update();if(button)button.hidden=true;}
     else{if(button){button.disabled=false;button.hidden=false;}}
   }catch(err){
     if(button)button.disabled=false;
     showGuide();
   }
 }
 window.addEventListener('beforeinstallprompt',e=>{
   if(installed||standalone())return;
   e.preventDefault();pending=e;update();
 });
 window.addEventListener('appinstalled',()=>{installed=true;pending=null;update();});
 window.matchMedia?.('(display-mode: standalone)')?.addEventListener?.('change',update);
 function init(){
   $('lany-install-button')?.addEventListener('click',install);
   document.querySelectorAll('.lany-install-close,.lany-install-done').forEach(button=>button.addEventListener('click',close));
   $('lany-install-modal')?.addEventListener('click',e=>{if(e.target.id==='lany-install-modal')close();});
   document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opening){e.stopImmediatePropagation();close();}},true);
   update();
 }
 window.LanyInstall={install,showGuide,close,isInstalled:()=>installed||standalone(),canPrompt:()=>Boolean(pending)};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
