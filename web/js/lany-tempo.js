/* 라니팡 v0.9 시간 도전: 플레이 중에만 흐르는 1초 단위 게임 시계. */
(() => {
 'use strict';
 const $=id=>document.getElementById(id);
 const KEY='lany_timed_challenge';
 let enabled=true;
 try{enabled=localStorage.getItem(KEY)!=='off';}catch(_){}
 let active=false,paused=true,expired=false,remaining=0,deadline=0,seconds=0;
 let currentStage=1, lastSecond=-1,lastTickAlert=-1;
 let ticker=null;
 const runClock=()=>{if(ticker===null)ticker=setInterval(update,250)};
 const stopClock=()=>{if(ticker!==null){clearInterval(ticker);ticker=null;}};
 const durationFor=level=>Math.max(115,185-(Math.floor((level-1)/25)*7));
 const getRemaining=()=>Math.max(0,remaining);
 const format=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
 function render(){
   const root=$('lany-clock');if(!root)return;
   root.classList.toggle('classic',!enabled);
   root.classList.toggle('warning',enabled&&remaining<=30);
   root.classList.toggle('critical',enabled&&remaining<=10&&active&&!paused);
   $('lany-clock-caption').textContent=enabled?'⏰ 남은 시간':'⌛ 진행 시간';
   $('lany-clock-value').textContent=format(enabled?remaining:seconds);
   $('lany-clock-fill').style.width=(enabled?Math.min(100,remaining/durationFor(currentStage)*100):100)+'%';
 }
 function start(stage){
   currentStage=stage||1;active=true;paused=false;expired=false;remaining=durationFor(currentStage);seconds=0;
   deadline=performance.now()+1000;lastSecond=-1;lastTickAlert=-1;render();runClock();
 }
 function setEnabled(value){enabled=Boolean(value);try{localStorage.setItem(KEY,enabled?'on':'off');}catch(_){}render()}
 function pause(){if(!active||paused)return;update();paused=true;stopClock();render()}
 function resume(){if(!active||!paused||expired)return;paused=false;deadline=performance.now()+1000;runClock();render()}
 function stop(){active=false;paused=true;stopClock();render()}
 function isExpired(){return active&&expired}
 function update(){
   if(!active||paused||expired)return;
   if(typeof state==='undefined')return;
   const now=performance.now();
   if(now<deadline)return;
   const ticks=Math.floor((now-deadline)/1000)+1;deadline+=ticks*1000;
   seconds+=ticks;if(enabled)remaining=Math.max(0,remaining-ticks);
   if(enabled && remaining>0 && remaining<=10 && remaining!==lastTickAlert){
     lastTickAlert=remaining;try{if(typeof snd_tick==='function')snd_tick()}catch(_){}
   }
   render();
   if(enabled&&remaining===0 && !state.animating){
     expired=true;paused=true;stopClock();
     if(state.score>=LEVELS[state.level-1].goal){window.checkEnd?.();return;}
     if(typeof window.showLose==='function'){
       $('lose-msg').textContent=`⏰ 시간이 끝났어요! ${seconds}초 동안 ${state.score.toLocaleString()}점을 획득했어요. 다시 도전해 보세요!`;
       window.showLose();
       $('lose-msg').textContent=`⏰ 시간이 끝났어요! ${seconds}초 동안 ${state.score.toLocaleString()}점을 획득했어요. 다시 도전해 보세요!`;
     }
   }
 }
 function onCombo(count){
   // Combo animation remains, but chains no longer replenish the timer.
   if(count<2 || document.hidden || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
   const board=$('board-wrap');if(!board)return;
   board.classList.remove('lany-impact');
   if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>{if(board.isConnected)board.classList.add('lany-impact')});
   else board.classList.add('lany-impact');
 }
 // No timer while at the title, map, pause, or with the app hidden.
 // Exactly one ticker is allocated while active, and cancelled on pause/stop.
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause()});
 window.LanyTempo={start,pause,resume,stop,enabled:()=>enabled,setEnabled,durationFor,isExpired,onCombo,getRemaining,isRunning:()=>active&&!paused,getElapsed:()=>seconds};
 render();
})();
