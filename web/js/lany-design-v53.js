/* One visual control vocabulary; accessible labels stay on the native buttons. */
(()=>{'use strict';
 function init(){
  const controls=[
   ['#lany-world-map .lany-map-head .lany-back','back','‹','처음 화면으로'],
   ['#lany-stage-prep .lany-prep-back','back','‹','맵으로 돌아가기'],
   ['#lany-world-map .lany-map-icon:not(.lany-mobile-fullscreen)','help','?','게임 방법'],
   ['#lany-world-map .lany-mobile-fullscreen','fullscreen','⛶','전체 화면'],
   ['#lany-install-modal .lany-install-close','close','×','설치 안내 닫기'],
   ['#lany-friends-modal .lany-friends-close','close','×','도감 닫기'],
   ['#app .hud button[data-lany-art="pause"]','pause','Ⅱ','일시정지'],
   ['#music-btn','music','♫','배경 음악 켜기'],
   ['#lany-world-prev','previous','‹','이전 지역 목록'],
   ['#lany-world-next','next','›','다음 지역 목록'],
   ['#lany-map-prev,#lany-prep-prev,#lany-help-prev,#lany-friends-prev','previous','‹','이전 페이지'],
   ['#lany-map-next,#lany-prep-next,#lany-help-next,#lany-friends-next','next','›','다음 페이지']
  ];
  for(const [selector,kind,symbol,label] of controls)for(const el of document.querySelectorAll(selector)){
   el.dataset.uiIcon=kind;el.dataset.uiSymbol=symbol;
   if(kind!=='music')el.setAttribute('aria-label',label);
   el.title=label;
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
