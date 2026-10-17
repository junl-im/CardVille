/* 라니팡 v0.8: 타이틀 → 월드맵 → 단계 준비 → 드래그 퍼즐 → 결과 */
(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const worlds=[['🍭','사탕 골짜기'],['🌳','막대사탕 숲'],['🌊','젤리 바다'],['🏔️','초콜릿 산맥'],['🌈','무지개 하늘'],['🏰','설탕 성'],['🌌','말랑별 은하'],['🏜️','캐러멜 협곡'],['❄️','토피 설원'],['💎','수정 동굴']];
 const nav={started:false,screen:'title',overlay:null,wasHelpFrom:null,world:0,selectedLevel:1,previousScreen:null,returnToGame:false,mapPage:0,mapPageSize:9,worldTabPage:0,prepIndex:0,helpIndex:0};
 const mobileFullscreen=()=>Boolean(window.matchMedia?.('(max-width: 900px) and (pointer: coarse)').matches);
 const overlayIds=['overlay-win','overlay-lose','overlay-levels','overlay-tutorial'];
 const stageColumn=i=>Math.floor(i/3)%2===0?i%3:2-(i%3);
 const mapPageSize=()=>{const h=Math.min(window.innerHeight||800,window.visualViewport?.height||Infinity);return h<470?3:h<650?6:h<900?9:12;};
 const pageWindow=(page,size)=>{const pages=Math.ceil(25/size),base=Math.floor(25/pages),extra=25%pages,start=page*base+Math.min(page,extra);return {pages,start,end:start+base+(page<extra?1:0)};};
 const pageForOffset=(offset,size)=>{const pages=Math.ceil(25/size);for(let page=0;page<pages;page++)if(offset<pageWindow(page,size).end)return page;return pages-1;};
 const worldTabSize=()=>window.innerWidth<500?3:window.innerWidth<850?4:5;
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 let mapRenderId=0;
 let goEpoch=0,goTimers=[];
 function cancelGo(){
   goEpoch++;
   for(const timer of goTimers)clearTimeout(timer);
   goTimers=[];
   const overlay=$('lany-go-intro');
   if(overlay)overlay.hidden=true;
 }
 function launchGo(){
   cancelGo();
   const overlay=$('lany-go-intro'),number=$('lany-go-number');
   if(!overlay||!number||nav.screen!=='game')return;
   const seq=goEpoch,reduce=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
   const frames=reduce?[['출발!',0]]:[['3',0],['2',650],['1',1300],['출발!',1950]];
   overlay.hidden=false;
   overlay.querySelector('.lany-go-caption').textContent=state.mode==='crazy'?'크레이지 도전 시작!':state.mode==='hard'?'불꽃 하드 도전 시작!':'달콤한 도전이 시작돼요!';
   window.LanyTempo?.pause();
   for(const [value,delay] of frames){
     const update=()=>{
       if(goEpoch!==seq||nav.screen!=='game')return;
       number.textContent=value;
       number.classList.toggle('go',value==='출발!');
       number.style.animation='none';
       void number.offsetWidth;
       number.style.animation='';
     };
     if(delay===0)update();else goTimers.push(setTimeout(update,delay));
   }
   goTimers.push(setTimeout(()=>{
     if(goEpoch!==seq)return;
     overlay.hidden=true;goTimers=[];
     if(nav.screen==='game'&&!nav.overlay&&!document.hidden)window.LanyTempo?.resume();
   },reduce?470:2650));
 }
 const savedStage=()=>{let n=Number(localStorage.getItem(state.mode==='crazy'?'cv_crazy_last_level':state.mode==='hard'?'cv_hard_last_level':'cv_last_level'));return Number.isInteger(n)&&n>0&&n<=250&&state.unlockedLevels.includes(n)?n:1};
 const reached=(n)=>state.unlockedLevels.includes(n);
 const hide=()=>{for(const id of ['lany-pause','lany-exit'])$(id).hidden=true;nav.overlay=null};
 const hideLegacy=()=>{for(const id of overlayIds){const el=$(id);if(el)el.style.display='none'}};
 const hideViews=()=>{for(const id of ['lany-world-map','lany-stage-prep'])$(id).hidden=true};
 function openMap(worldIndex){
   cancelGo();
   const from=nav.screen;
   const finished=['overlay-win','overlay-lose'].some(id=>$(id)?.style.display==='flex');
   if(nav.screen==='game' && !finished)nav.returnToGame=true;
   if(nav.screen==='game')window.LanyTempo?.pause();
   hide();hideLegacy();hideViews();nav.started=true;nav.screen='map';$('lany-title').hidden=true;
   document.body.classList.remove('lany-at-title');
   const desired=Number.isInteger(worldIndex)?worldIndex:nav.world;
   nav.world=clamp(desired,0,9);
   if(from==='title'||from==='prep'){
     const relevant=from==='prep'?nav.selectedLevel:savedStage();
     nav.mapPage=pageForOffset((relevant-1)%25,mapPageSize());
   }
   nav.worldTabPage=Math.floor(nav.world/worldTabSize());
   $('lany-world-map').hidden=false;
   document.querySelector('.lany-map-section')?.setAttribute('data-paged','true');
   try {renderMap();$('lany-map-continue').focus();} catch(error) {
     console.error('[라니팡] 맵 화면 열기 실패',error);
     $('lany-map-tip').textContent='맵 화면에 문제가 발생했어요. 잠시 후 다시 시도해 주세요.';
     $('lany-map-continue').onclick=()=>continueStage();
   }
 }
 function setMode(mode){
   if(mode===state.mode)return;
   nav.returnToGame=false;window.LanyTempo?.stop();setCampaignMode(mode);
   const stage=savedStage();nav.world=Math.floor((stage-1)/25);nav.mapPage=pageForOffset((stage-1)%25,mapPageSize());nav.worldTabPage=Math.floor(nav.world/worldTabSize());renderMap();
 }
 function renderMap(){
   for(const mode of ['normal','hard','crazy']){const button=$('lany-mode-'+mode);button.setAttribute('aria-pressed',String(state.mode===mode));}
   $('lany-map-heading').textContent=state.mode==='crazy'?'💥 라니팡 크레이지 맵':state.mode==='hard'?'🔥 라니팡 하드 맵':'🗺️ 라니팡 모험 맵';
   document.querySelector('.lany-map-eyebrow').textContent=state.mode==='crazy'?'번개 치는 사탕마을 · 극한 도전':state.mode==='hard'?'붉은 사탕마을 · 하드 도전':'푸른 숲속 · 노멀 모험';
   $('lany-map-tip').textContent=state.mode!=='normal'?'⚡ 목표 점수와 동물 매치 횟수를 모두 채우세요. 5개 이상 연결하면 광폭 친구가 등장해요.':'🔓 빛나는 숫자를 눌러 도전을 시작하세요. 잠긴 단계는 이전 단계를 완료하면 열려요.';
   const unlocked=new Set(state.unlockedLevels),n=nav.world;
   const last=Math.max(1,...state.unlockedLevels.filter(i=>i>=1&&i<=250));
   const levels=activeLevels();
   const stars=Object.values(state.levelStars).reduce((a,b)=>a+(Number(b)||0),0);
   $('lany-map-progress').textContent=`${state.mode==='crazy'?'💥 크레이지':state.mode==='hard'?'🔥 하드':'🌼 노멀'} · 도전 가능 ${unlocked.size} / 250`;
   $('lany-map-star-count').textContent=`⭐ 모은 별 ${stars}개`;
   $('lany-map-continue').textContent=`▶ ${savedStage()}단계 이어서 도전`;
   $('lany-map-resume').hidden=!nav.returnToGame;
   const size=mapPageSize(),pages=Math.ceil(25/size);
   nav.mapPage=clamp(nav.mapPage,0,pages-1);
   nav.mapPageSize=size;
   const {start,end}=pageWindow(nav.mapPage,size);
   $('lany-map-page-status').textContent=`${nav.mapPage+1} / ${pages} · ${n*25+start+1}~${n*25+end}단계`;
   $('lany-map-prev').disabled=nav.mapPage===0;
   $('lany-map-next').disabled=nav.mapPage>=pages-1;
   const groupSize=worldTabSize(),groups=Math.ceil(worlds.length/groupSize);
   nav.worldTabPage=clamp(nav.worldTabPage,0,groups-1);
   $('lany-world-prev').disabled=nav.worldTabPage===0;
   $('lany-world-next').disabled=nav.worldTabPage===groups-1;
   const tabs=$('lany-world-tabs');tabs.replaceChildren();
   for(let i=nav.worldTabPage*groupSize;i<Math.min(worlds.length,(nav.worldTabPage+1)*groupSize);i++){
     const btn=document.createElement('button');btn.type='button';
     btn.className='lany-world-tab'+(i===n?' active':'')+(last<i*25+1?' locked-tab':'');
     btn.dataset.world=String(i);
     btn.setAttribute('aria-label',`제${i+1}지역 ${worlds[i][1]}`);
     btn.setAttribute('aria-pressed',String(i===n));
     btn.textContent="";
     btn.addEventListener('click',()=>{nav.world=i;nav.mapPage=0;nav.worldTabPage=Math.floor(i/worldTabSize());renderMap();tabs.querySelector(`[data-world="${i}"]`)?.focus();});
     tabs.appendChild(btn);
   }
   $('lany-world-no').textContent=`${(n*25)+1}~${(n+1)*25}단계`;
   $('lany-world-title').textContent=worlds[n][1];$('lany-world-icon').textContent=worlds[n][0];
   const grid=$('lany-map-levels');grid.replaceChildren();
   grid.dataset.world=String(n);grid.dataset.page=String(nav.mapPage);
   grid.style.setProperty('--lany-map-rows',String(Math.ceil((end-start)/3)));
   // One light-weight Canvas layer for the route: no vector DOM and no separate image downloads.
   const route=document.createElement('canvas');
   route.className='lany-route';
   route.setAttribute('aria-hidden','true');
   grid.appendChild(route);
   const nodes=[],renderId=++mapRenderId;
   for(let offset=start;offset<end;offset++){
     const i=n*25+offset+1,enabled=unlocked.has(i),boss=levels[i-1].isBoss,index=offset-start;
     const btn=document.createElement('button');btn.type='button';
     btn.className='lany-level'+(boss?' boss':'')+(i===savedStage()?' current':'');
     btn.style.gridColumn=String(stageColumn(index)+1);
     btn.style.gridRow=String(Math.floor(index/3)+1);
     btn.disabled=!enabled;
     btn.setAttribute('aria-label',`${i}단계 ${levels[i-1].name}${enabled?'':' 잠김'}`);
     const starCount=state.levelStars[i]||0;
     btn.innerHTML=`<span>${enabled?i:'🔒'}</span><small>${enabled?('⭐'.repeat(starCount)||(boss?'👑':'시작')):i+'단계'}</small>`;
     if(enabled)btn.addEventListener('click',()=>openPrep(i));
     nodes.push(btn);grid.appendChild(btn);
   }
   requestAnimationFrame(()=>{
     if(nav.screen!=='map'||nav.world!==n||renderId!==mapRenderId)return;
     const width=grid.clientWidth,height=grid.clientHeight;
     if(!width||!height)return;
     const scale=Math.min(window.devicePixelRatio||1,2);
     route.width=Math.max(1,Math.round(width*scale));
     route.height=Math.max(1,Math.round(height*scale));
     const ctx=route.getContext('2d');if(!ctx)return;
     ctx.scale(scale,scale);
     const pts=nodes.map(el=>[el.offsetLeft+el.offsetWidth/2,el.offsetTop+el.offsetHeight/2]);
     if(pts.length<2)return;
     const draw=()=>{
       ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);
       for(let i=1;i<pts.length;i++){
         const p=pts[i-1],q=pts[i];
         ctx.quadraticCurveTo(p[0],(p[1]+q[1])/2,q[0],q[1]);
       }
     };
     ctx.lineCap='round';ctx.lineJoin='round';
     draw();ctx.setLineDash([]);ctx.strokeStyle='rgba(100,59,75,.40)';ctx.lineWidth=13;ctx.stroke();
     draw();ctx.strokeStyle='#fff8d2';ctx.lineWidth=9;ctx.stroke();
     draw();ctx.setLineDash([2,13]);ctx.lineDashOffset=-4;ctx.strokeStyle='#f7b54e';ctx.lineWidth=4;ctx.stroke();
   });
   $('lany-map-tip').textContent=last<n*25+1?'🔒 이 지역은 아직 잠겨 있어요. 앞 지역의 단계를 완료해 주세요.':state.mode!=='normal'?'⚡ 목표 점수와 동물 매치 횟수를 모두 채우세요. 5개 연결로 광폭 친구 등장!':'✨ 숫자를 선택해 도전하세요. ◀ ▶ 버튼으로 같은 지역의 다음 구간을 넘길 수 있어요.';
 }
 function mapPage(delta){
   if(nav.screen!=='map'||!Number.isInteger(delta))return;
   const max=Math.ceil(25/mapPageSize())-1;
   const next=clamp(nav.mapPage+delta,0,max);
   if(next===nav.mapPage)return;
   nav.mapPage=next;renderMap();
 }
 function worldPage(delta){
   if(nav.screen!=='map'||!Number.isInteger(delta))return;
   const max=Math.ceil(worlds.length/worldTabSize())-1;
   const next=clamp(nav.worldTabPage+delta,0,max);
   if(next===nav.worldTabPage)return;
   nav.worldTabPage=next;renderMap();
 }
 function continueStage(){let n=savedStage();nav.world=Math.floor((n-1)/25);openPrep(n)}
 function openPrep(number){
   const n=Number(number);if(!Number.isInteger(n)||n<1||n>activeLevels().length||!reached(n))return false;
   hide();hideLegacy();hideViews();nav.started=true;nav.screen='prep';nav.selectedLevel=n;nav.world=Math.floor((n-1)/25);nav.mapPage=pageForOffset((n-1)%25,mapPageSize());nav.prepIndex=0;
   $('lany-title').hidden=true;document.body.classList.remove('lany-at-title');$('lany-stage-prep').hidden=false;
   const lv=activeLevels()[n-1];$('lany-prep-region').textContent=`제${nav.world+1}지역 · ${lv.theme}`;
   $('lany-prep-heading').textContent=`${state.mode==='crazy'?'💥 크레이지':state.mode==='hard'?'🔥 하드':'🌼 노멀'} ${n}단계 준비`;$('lany-prep-subtitle').textContent=lv.name;
   $('lany-prep-goal').textContent=lv.goal.toLocaleString()+'점';$('lany-prep-moves').textContent=lv.moves+'회';
   $('lany-prep-clear-goal').hidden=state.mode==='normal';if(state.mode!=='normal')$('lany-prep-clear-goal').textContent=`동물 매치 ${lv.clearGoal}회 · 5개 연결하면 광폭 친구 등장!`;
   $('lany-prep-locks').textContent=state.mode!=='normal'?`🧱 벽 ${lv.wallCount} · 🔒 잠금 ${lv.lockedCount} · 💣 폭탄 ${lv.bombCount} · 🔄 ${lv.morphSeconds}초마다 변화`:(lv.lockedCount?'🔒 잠금 블록 '+lv.lockedCount+'개':'🔓 잠금 블록 없음');
   const best=state.bestScores[n]||0;
   $('lany-prep-record').textContent=best?`⭐ 최고 점수 ${best.toLocaleString()}점`:'⭐ 최고 기록 없음';
   const b=state.boosters;$('lany-prep-booster-counts').textContent=`🔨 망치 ${b.hammer} · 🔀 섞기 ${b.shuffle} · 🌈 색상 ${b.color}`;
   const clock=$('lany-time-mode');clock.checked=window.LanyTempo?.enabled()??true;
   $('lany-time-hint').textContent=`제한 ${window.LanyTempo?.durationFor(n)??150}초 · 시간 종료 시 도전 실패. 끄면 이동 횟수만 적용돼요.`;
   renderPrepPage();$('lany-prep-play').focus();return true;
 }
 function renderPrepPage(){
   const compact=window.matchMedia("(max-width: 600px)").matches||Math.min(window.innerHeight||800,window.visualViewport?.height||Infinity)<900;
   const root=$('lany-stage-prep'),pager=$('lany-prep-pager');
   root.classList.toggle('lany-prep-compact',compact);
   pager.hidden=!compact;
   for(const el of root.querySelectorAll('[data-prep-page]'))el.hidden=compact&&Number(el.dataset.prepPage)!==nav.prepIndex;
   $('lany-prep-page-status').textContent=`${nav.prepIndex+1} / 2`;
   $('lany-prep-prev').disabled=nav.prepIndex===0;
   $('lany-prep-next').disabled=nav.prepIndex===1;
 }
 function prepPage(delta){
   if(nav.screen!=='prep')return;
   nav.prepIndex=clamp(nav.prepIndex+delta,0,1);renderPrepPage();
 }
 function renderHelpPage(){
   const root=$('overlay-tutorial');
   for(const el of root.querySelectorAll('[data-tutorial-page]'))el.hidden=Number(el.dataset.tutorialPage)!==nav.helpIndex;
   $('lany-help-status').textContent=`${nav.helpIndex+1} / 2`;
   $('lany-help-prev').disabled=nav.helpIndex===0;
   $('lany-help-next').disabled=nav.helpIndex===1;
 }
 function helpPage(delta){
   if($('overlay-tutorial').style.display!=='flex')return;
   nav.helpIndex=clamp(nav.helpIndex+delta,0,1);renderHelpPage();
 }
 function playPrepared(){
   if(nav.screen!=='prep'||!reached(nav.selectedLevel))return;
   nav.returnToGame=false;
   const n=nav.selectedLevel;window.LanyTempo?.setEnabled($('lany-time-mode').checked);hideViews();nav.screen='game';hideLegacy();window.initGame(n);
   launchGo();
   $('board')?.focus?.();
 }
 function resumeGameFromMap(){if(!nav.returnToGame||!state.board.length)return;hideViews();hide();nav.screen='game';nav.returnToGame=false;window.LanyTempo?.resume();$('board')?.focus?.()}
 function begin(){
   if(nav.started){if(nav.screen==='game')return;openMap();return}
   nav.started=true;nav.world=Math.floor((savedStage()-1)/25);openMap(nav.world);
   try{if(mobileFullscreen()&&document.documentElement.requestFullscreen&&!document.fullscreenElement)Promise.resolve(document.documentElement.requestFullscreen({navigationUI:'hide'})).catch(()=>{})}catch(_){/* browser permission */}
 }
 function openPause(){cancelGo();if(nav.screen!=='game'){openExit();return}window.LanyTempo?.pause();hide();nav.overlay='pause';$('lany-pause').hidden=false;$('lany-pause').querySelector('button').focus()}
 function openExit(){cancelGo();window.LanyTempo?.pause();hide();nav.previousScreen=nav.screen;nav.overlay='exit';$('lany-exit').hidden=false;$('lany-exit').querySelector('button').focus()}
 function resume(){hide();if(nav.screen==='game')window.LanyTempo?.resume();if(nav.screen==='map')$('lany-map-continue').focus();else if(nav.screen==='prep')$('lany-prep-play').focus();else $('board')?.focus?.()}
 function showHome(){cancelGo();window.LanyTempo?.pause();hide();hideLegacy();hideViews();nav.started=false;nav.returnToGame=false;nav.screen='title';document.body.classList.add('lany-at-title');$('lany-title').hidden=false;if(document.fullscreenElement)Promise.resolve(document.exitFullscreen?.()).catch(()=>{});$('lany-start-button').focus()}
 function exitGame(){showHome()}
 function openHelp(){window.LanyTempo?.pause();nav.helpIndex=0;nav.wasHelpFrom=nav.overlay||nav.screen;hide();$('overlay-tutorial').style.display='flex';$('overlay-tutorial').querySelector('h2').textContent='🌟 라니팡 게임 방법';$('overlay-tutorial').querySelector('.btn.btn-primary').textContent='알겠어요';renderHelpPage()}
 function closeTutorial(){$('overlay-tutorial').style.display='none';const from=nav.wasHelpFrom;nav.wasHelpFrom=null;if(from==='pause')openPause();else if(from==='exit')openExit();else if(from==='title')showHome();else if(from==='map')openMap();else if(from==='prep')openPrep(nav.selectedLevel);else if(from==='game')window.LanyTempo?.resume()}
 function toggleFullscreen(){if(!mobileFullscreen())return;const el=document.documentElement;try{if(document.fullscreenElement)Promise.resolve(document.exitFullscreen()).catch(()=>{});else if(el.requestFullscreen)Promise.resolve(el.requestFullscreen({navigationUI:'hide'})).catch(()=>{})}catch(_){}}
 function handleBack(){if(window.LanyFriends?.isOpen?.()){window.LanyFriends.close();return}if($('overlay-tutorial').style.display==='flex'){closeTutorial();return}if(nav.overlay==='exit'){resume();return}if(nav.overlay==='pause'){openExit();return}if(nav.screen==='prep'){openMap();return}if(nav.screen==='map'){openExit();return}if(nav.screen==='game'){openPause();return}openExit()}
 function pushGuard(){try{history.pushState({lanyShell:true},'',location.href)}catch(_){}}
 if(history&&'pushState'in history)pushGuard();
 window.addEventListener('popstate',()=>{pushGuard();handleBack()});
 document.addEventListener('keydown',e=>{if(e.key!=='Escape'&&!(e.key==='Backspace'&&!/^(INPUT|TEXTAREA)$/i.test(document.activeElement?.tagName||'')))return;if(e.key==='Backspace')e.preventDefault();handleBack()});
 document.addEventListener('keydown',e=>{
   if(!['ArrowLeft','ArrowRight'].includes(e.key))return;
   if(e.target?.closest?.('input,textarea,select,[contenteditable="true"]'))return;
   const delta=e.key==='ArrowRight'?1:-1;
   if(window.LanyFriends?.isOpen?.()){e.preventDefault();window.LanyFriends.page(delta);return;}
   if($('overlay-tutorial').style.display==='flex'){e.preventDefault();helpPage(delta);return;}
   if(nav.screen==='map'){e.preventDefault();mapPage(delta);return;}
   if(nav.screen==='prep'&&$('lany-stage-prep').classList.contains('lany-prep-compact')){e.preventDefault();prepPage(delta);}
 });
 let resizeFrame=0;
 window.addEventListener('resize',()=>{
   if(resizeFrame)return;
   resizeFrame=requestAnimationFrame(()=>{
     resizeFrame=0;
     if(nav.screen==='map'){
       const anchor=pageWindow(nav.mapPage,nav.mapPageSize).start;
       nav.mapPage=pageForOffset(anchor,mapPageSize());
       nav.worldTabPage=Math.floor(nav.world/worldTabSize());
       renderMap();
     }
     if(nav.screen==='prep')renderPrepPage();
   });
 },{passive:true});
 document.addEventListener('contextmenu',e=>e.preventDefault(),true);
 document.addEventListener('dragstart',e=>e.preventDefault(),true);
 window.LanyShell={start:begin,openPause,openExit,resume,showHome,exitGame,openHelp,closeTutorial,toggleFullscreen,openMap,openPrep,playPrepared,launchGo,continueStage,resumeGameFromMap,mapPage,worldPage,prepPage,helpPage,setMode,getCurrentScreen:()=>nav.overlay||nav.screen};
 $('lany-start-button')?.addEventListener('click',begin);
 const cover=$('lany-cover-image');
 if(cover){cover.addEventListener('load',()=>document.body.classList.add('lany-cover-loaded'));cover.addEventListener('error',()=>{document.body.classList.add('lany-cover-fallback');console.warn('[라니팡] 타이틀 이미지 불러오기 실패: 기본 배경으로 전환');});if(cover.complete&&cover.naturalWidth)document.body.classList.add('lany-cover-loaded');}
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&nav.screen==='game'&&!nav.overlay)openPause()});
})();
