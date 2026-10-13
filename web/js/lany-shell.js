/* 라니팡 v0.8: 타이틀 → 월드맵 → 단계 준비 → 드래그 퍼즐 → 결과 */
(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const worlds=[['🍭','사탕 골짜기'],['🌳','막대사탕 숲'],['🌊','젤리 바다'],['🏔️','초콜릿 산맥'],['🌈','무지개 하늘'],['🏰','설탕 성'],['🌌','말랑별 은하'],['🏜️','캐러멜 협곡'],['❄️','토피 설원'],['💎','수정 동굴']];
 const nav={started:false,screen:'title',overlay:null,wasHelpFrom:null,world:0,selectedLevel:1,previousScreen:null,returnToGame:false};
 const overlayIds=['overlay-win','overlay-lose','overlay-levels','overlay-tutorial'];
 const savedStage=()=>{let n=Number(localStorage.getItem('cv_last_level'));return Number.isInteger(n)&&n>0&&n<=250&&state.unlockedLevels.includes(n)?n:1};
 const reached=(n)=>state.unlockedLevels.includes(n);
 const hide=()=>{for(const id of ['lany-pause','lany-exit'])$(id).hidden=true;nav.overlay=null};
 const hideLegacy=()=>{for(const id of overlayIds){const el=$(id);if(el)el.style.display='none'}};
 const hideViews=()=>{for(const id of ['lany-world-map','lany-stage-prep'])$(id).hidden=true};
 function openMap(worldIndex){
   const finished=['overlay-win','overlay-lose'].some(id=>$(id)?.style.display==='flex');
   if(nav.screen==='game' && !finished)nav.returnToGame=true;
   hide();hideLegacy();hideViews();nav.started=true;nav.screen='map';$('lany-title').hidden=true;
   document.body.classList.remove('lany-at-title');
   const desired=Number.isInteger(worldIndex)?worldIndex:nav.world;
   nav.world=Math.max(0,Math.min(9,desired));$('lany-world-map').hidden=false;
   renderMap();$('lany-map-continue').focus();
 }
 function renderMap(){
   const unlocked=new Set(state.unlockedLevels),n=nav.world;
   const last=Math.max(1,...state.unlockedLevels.filter(i=>i>=1&&i<=250));
   const stars=Object.values(state.levelStars).reduce((a,b)=>a+(Number(b)||0),0);
   $('lany-map-progress').textContent=`도전 가능한 단계 ${unlocked.size} / 250`;
   $('lany-map-star-count').textContent=`⭐ 모은 별 ${stars}개`;
   $('lany-map-continue').textContent=`▶ ${savedStage()}단계 이어서 도전`;
   $('lany-map-resume').hidden=!nav.returnToGame;
   const tabs=$('lany-world-tabs');tabs.replaceChildren();
   for(let i=0;i<10;i++){
     const btn=document.createElement('button');btn.type='button';btn.className='lany-world-tab'+(i===n?' active':'')+(last<i*25+1?' locked-tab':'');
     btn.setAttribute('aria-label',`제${i+1}지역 ${worlds[i][1]}`);
     btn.setAttribute('aria-pressed',String(i===n));btn.innerHTML=`<span class="world-emoji">${worlds[i][0]}</span><span>${i+1}지역</span>`;
     btn.addEventListener('click',()=>{nav.world=i;renderMap()});tabs.appendChild(btn);
   }
   $('lany-world-no').textContent=`제${n+1}지역 · ${(n*25)+1}~${(n+1)*25}단계`;
   $('lany-world-title').textContent=worlds[n][1];$('lany-world-icon').textContent=worlds[n][0];
   const grid=$('lany-map-levels');grid.replaceChildren();
   for(let i=n*25+1;i<=Math.min(250,(n+1)*25);i++){
     const enabled=unlocked.has(i),boss=LEVELS[i-1].isBoss;
     const btn=document.createElement('button');btn.type='button';btn.className='lany-level'+(boss?' boss':'')+(i===savedStage()?' current':'');
     btn.disabled=!enabled;btn.setAttribute('aria-label',`${i}단계 ${LEVELS[i-1].name}${enabled?'':' 잠김'}`);
     const starCount=state.levelStars[i]||0;
     btn.innerHTML=`<span>${enabled?i:'🔒'}</span><small>${enabled?('⭐'.repeat(starCount)|| (boss?'👑':'시작')):i+'단계'}</small>`;
     if(enabled)btn.addEventListener('click',()=>openPrep(i));
     grid.appendChild(btn);
   }
 }
 function continueStage(){let n=savedStage();nav.world=Math.floor((n-1)/25);openPrep(n)}
 function openPrep(number){
   const n=Number(number);if(!Number.isInteger(n)||n<1||n>LEVELS.length||!reached(n))return false;
   hide();hideLegacy();hideViews();nav.started=true;nav.screen='prep';nav.selectedLevel=n;nav.world=Math.floor((n-1)/25);
   $('lany-title').hidden=true;document.body.classList.remove('lany-at-title');$('lany-stage-prep').hidden=false;
   const lv=LEVELS[n-1];$('lany-prep-region').textContent=`제${nav.world+1}지역 · ${lv.theme}`;
   $('lany-prep-heading').textContent=`${n}단계 준비`;$('lany-prep-subtitle').textContent=lv.name;
   $('lany-prep-goal').textContent=lv.goal.toLocaleString()+'점';$('lany-prep-moves').textContent=lv.moves+'회';
   $('lany-prep-locks').textContent=lv.lockedCount?'🔒 잠금 블록 '+lv.lockedCount+'개':'🔓 잠금 블록 없음';
   const best=state.bestScores[n]||0;
   $('lany-prep-record').textContent=best?`⭐ 최고 점수 ${best.toLocaleString()}점`:'⭐ 최고 기록 없음';
   const b=state.boosters;$('lany-prep-booster-counts').textContent=`🔨 망치 ${b.hammer}개 · 🔀 섞기 ${b.shuffle}개 · 🌈 색상 제거 ${b.color}개`;
   $('lany-prep-play').focus();return true;
 }
 function playPrepared(){
   if(nav.screen!=='prep'||!reached(nav.selectedLevel))return;
   nav.returnToGame=false;
   const n=nav.selectedLevel;hideViews();nav.screen='game';hideLegacy();window.initGame(n);
   $('board')?.focus?.();
 }
 function resumeGameFromMap(){if(!nav.returnToGame||!state.board.length)return;hideViews();hide();nav.screen='game';nav.returnToGame=false;$('board')?.focus?.()}
 function begin(){
   if(nav.started){if(nav.screen==='game')return;openMap();return}
   nav.started=true;nav.world=Math.floor((savedStage()-1)/25);openMap(nav.world);
   try{if(document.documentElement.requestFullscreen&&!document.fullscreenElement)Promise.resolve(document.documentElement.requestFullscreen({navigationUI:'hide'})).catch(()=>{})}catch(_){/* browser permission */}
 }
 function openPause(){if(nav.screen!=='game'){openExit();return}hide();nav.overlay='pause';$('lany-pause').hidden=false;$('lany-pause').querySelector('button').focus()}
 function openExit(){hide();nav.previousScreen=nav.screen;nav.overlay='exit';$('lany-exit').hidden=false;$('lany-exit').querySelector('button').focus()}
 function resume(){hide();if(nav.screen==='map')$('lany-map-continue').focus();else if(nav.screen==='prep')$('lany-prep-play').focus();else $('board')?.focus?.()}
 function showHome(){hide();hideLegacy();hideViews();nav.started=false;nav.returnToGame=false;nav.screen='title';document.body.classList.add('lany-at-title');$('lany-title').hidden=false;if(document.fullscreenElement)Promise.resolve(document.exitFullscreen?.()).catch(()=>{});$('lany-start-button').focus()}
 function exitGame(){showHome()}
 function openHelp(){nav.wasHelpFrom=nav.overlay||nav.screen;hide();$('overlay-tutorial').style.display='flex';$('overlay-tutorial').querySelector('h2').textContent='🌟 라니팡 게임 방법';$('overlay-tutorial').querySelector('button').textContent='알겠어요'}
 function closeTutorial(){$('overlay-tutorial').style.display='none';const from=nav.wasHelpFrom;nav.wasHelpFrom=null;if(from==='pause')openPause();else if(from==='exit')openExit();else if(from==='title')showHome();else if(from==='map')openMap();else if(from==='prep')openPrep(nav.selectedLevel)}
 function toggleFullscreen(){const el=document.documentElement;try{if(document.fullscreenElement)Promise.resolve(document.exitFullscreen()).catch(()=>{});else if(el.requestFullscreen)Promise.resolve(el.requestFullscreen({navigationUI:'hide'})).catch(()=>{})}catch(_){}}
 function handleBack(){if($('overlay-tutorial').style.display==='flex'){closeTutorial();return}if(nav.overlay==='exit'){resume();return}if(nav.overlay==='pause'){openExit();return}if(nav.screen==='prep'){openMap();return}if(nav.screen==='map'){openExit();return}if(nav.screen==='game'){openPause();return}openExit()}
 function pushGuard(){try{history.pushState({lanyShell:true},'',location.href)}catch(_){}}
 if(history&&'pushState'in history)pushGuard();
 window.addEventListener('popstate',()=>{pushGuard();handleBack()});
 document.addEventListener('keydown',e=>{if(e.key!=='Escape'&&!(e.key==='Backspace'&&!/^(INPUT|TEXTAREA)$/i.test(document.activeElement?.tagName||'')))return;if(e.key==='Backspace')e.preventDefault();handleBack()});
 document.addEventListener('contextmenu',e=>e.preventDefault(),true);
 document.addEventListener('dragstart',e=>e.preventDefault(),true);
 window.LanyShell={start:begin,openPause,openExit,resume,showHome,exitGame,openHelp,closeTutorial,toggleFullscreen,openMap,openPrep,playPrepared,continueStage,resumeGameFromMap,getCurrentScreen:()=>nav.overlay||nav.screen};
 $('lany-start-button')?.addEventListener('click',begin);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&nav.screen==='game'&&!nav.overlay)openPause()});
})();
