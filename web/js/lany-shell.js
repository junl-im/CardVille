/* 라니팡 게임 내비게이션: title -> play -> pause/exit. 웹 플랫폼 한계를 안전하게 처리합니다. */
(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const state = {started:false, overlay:null, wasHelpFrom:null, lastFocused:null, backed:false};
  function hideDialogs(){ for(const id of ['lany-pause','lany-exit'])byId(id).hidden=true; state.overlay=null; }
  function pushGuard(){try{history.pushState({lanyShell:true},'',location.href)}catch(e){ /* iframe/sandbox may block history */ }}
  function begin(){
    if(state.started){resume();return;}
    state.started=true;
    byId('lany-title').hidden=true;
    document.body.classList.remove('lany-at-title');
    hideDialogs();
    window.initGame();
    // Fullscreen APIs require a trusted gesture; rejection must never block gameplay.
    const node=document.documentElement;
    if(node.requestFullscreen && !document.fullscreenElement) Promise.resolve(node.requestFullscreen({navigationUI:'hide'})).catch(()=>{});
  }
  function pause(){if(!state.started){openExit();return;}hideDialogs();state.overlay='pause';byId('lany-pause').hidden=false;byId('lany-pause').querySelector('button').focus();}
  function openExit(){hideDialogs();state.overlay='exit';byId('lany-exit').hidden=false;byId('lany-exit').querySelector('button').focus();}
  function resume(){hideDialogs();if(state.started)byId('board')?.focus?.();}
  function home(){
    hideDialogs();state.started=false;
    document.body.classList.add('lany-at-title');byId('lany-title').hidden=false;
    for (const id of ['overlay-win','overlay-lose','overlay-levels','overlay-tutorial']) {
      const el=byId(id);if(el)el.style.display='none';
    }
    if(document.fullscreenElement) Promise.resolve(document.exitFullscreen?.()).catch(()=>{});
    byId('lany-start-button')?.focus();
  }
  function exitGame(){
    // A normal web tab cannot reliably be closed by script. Return to title instead.
    home();
  }
  function help(){
    state.wasHelpFrom=state.overlay||(!state.started?'title':'play');
    hideDialogs();
    byId('overlay-tutorial').style.display='flex';
    byId('overlay-tutorial').querySelector('h2').textContent='🌟 라니팡 게임 방법';
    const button=byId('overlay-tutorial').querySelector('.modal-btns button, .modal > button');
    if(button)button.textContent='알겠어요';
  }
  function closeTutorial(){
    byId('overlay-tutorial').style.display='none';
    if(state.wasHelpFrom==='pause')pause();
    else if(state.wasHelpFrom==='exit')openExit();
    else if(state.wasHelpFrom==='title')home();
    state.wasHelpFrom=null;
  }
  function toggleFullscreen(){
    if(document.fullscreenElement){Promise.resolve(document.exitFullscreen()).catch(()=>{});return}
    if(document.documentElement.requestFullscreen)Promise.resolve(document.documentElement.requestFullscreen({navigationUI:'hide'})).catch(()=>{});
  }
  // The extra in-page history entry gives Android browser Back a popstate to dispatch.
  // Browsers, embedded WebViews and iOS can still have different Back/close behavior.
  if(history && 'pushState' in history)pushGuard();
  window.addEventListener('popstate',()=>{pushGuard();if(byId('overlay-tutorial')?.style.display==='flex'){closeTutorial();return}if(state.overlay==='exit'){resume();return}if(state.overlay==='pause'){openExit();return}openExit();});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape' || e.key==='Backspace' && !/^(INPUT|TEXTAREA)$/i.test(document.activeElement?.tagName||'')) {
      if(e.key==='Backspace')e.preventDefault();
      if(byId('overlay-tutorial')?.style.display==='flex'){closeTutorial();return}
      if(state.overlay){resume();return}
      pause();
    }
  });
  document.addEventListener('contextmenu',e=>e.preventDefault(),true);
  document.addEventListener('dragstart',e=>e.preventDefault(),true);
  const api={start:begin,openPause:pause,openExit, resume,showHome:home,exitGame,openHelp:help,closeTutorial,toggleFullscreen,getCurrentScreen:()=>state.overlay||(state.started?'game':'title')};
  window.LanyShell=api;
  const btn=byId('lany-start-button');if(btn)btn.addEventListener('click',begin);
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&state.started&&!state.overlay)pause()});
})();
