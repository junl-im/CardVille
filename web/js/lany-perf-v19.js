/* 라니팡 v1.9: opt-in, local-only mobile performance diagnostic.
 * Enable by adding ?perf=1 to the address. No network requests, analytics,
 * storage or monitoring overhead when the switch is absent.
 */
(()=>{'use strict';
 if(new URLSearchParams(location.search).get('perf')!=='1')return;
 let raf=0,interval=0,frameCount=0,longFrames=0,lastFrame=0,lastReport=performance.now();
 let worst=0,longTasks=0,longTaskObserver=null,active=true;
 const samples=[],maxSamples=120;
 const hud=document.createElement('aside');
 hud.id='lany-perf-hud';hud.setAttribute('aria-label','라니팡 성능 진단');
 hud.innerHTML='<div class="lany-perf-head">성능 진단 <button type="button" aria-label="성능 진단 닫기">×</button></div><pre class="lany-perf-stats" aria-live="off"></pre><small>기록 전송 없음 · 이 기기에서만 측정</small>';
 function addStyle(){
  const sheet=document.createElement('style');sheet.id='lany-perf-style';
  sheet.textContent='#lany-perf-hud{position:fixed;z-index:40000;top:max(6px,env(safe-area-inset-top));right:6px;width:min(184px,54vw);padding:9px;border:2px solid #fff0bf;border-radius:13px;background:#241b38e8;color:#fff;font:600 12px/1.35 system-ui,sans-serif;box-shadow:0 4px 18px #20162b88;pointer-events:auto}#lany-perf-hud .lany-perf-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;font-size:12px}#lany-perf-hud button{width:34px;height:34px;min-width:34px;border:1px solid #fff7c6;border-radius:11px;color:#fff;background:#6f527e;font-weight:900;touch-action:manipulation}#lany-perf-hud pre{font:600 11px/1.47 ui-monospace,monospace;white-space:pre-wrap;margin:0;font-variant-numeric:tabular-nums}#lany-perf-hud small{display:block;font-size:9px;color:#e4d6dc;margin-top:5px}';
  document.head.appendChild(sheet);
 }
 function sample(t){
  if(!active||document.hidden){raf=0;return;}
  if(lastFrame){
   const gap=t-lastFrame;
   if(gap>50)longFrames++;
   worst=Math.max(worst,gap);
   if(samples.length>=maxSamples)samples.shift();
   samples.push(gap);
  }
  lastFrame=t;frameCount++;
  raf=requestAnimationFrame(sample);
 }
 function refresh(){
  if(!active)return;
  const now=performance.now(),period=Math.max(1,now-lastReport);
  const fps=Math.round(frameCount*1000/period);
  const perf=window.LanyPerf||{};
  const board=document.getElementById('board');
  const tileCount=board?.children?.length||0;
  const vfx=document.querySelector('.lany-vfx-layer')?.children.length||0;
  const overlays=document.querySelectorAll('.score-float,.combo-display,.lany-art-spark').length;
  const heap=performance.memory?.usedJSHeapSize;
  const memory=Number.isFinite(heap)?(heap/1048576).toFixed(1)+' MB':'미지원';
  const sorted=samples.slice().sort((a,b)=>a-b);
  const p95=sorted.length?sorted[Math.min(sorted.length-1,Math.floor(sorted.length*.95))].toFixed(0):'--';
  hud.querySelector('.lany-perf-stats').textContent=[
   'FPS       '+fps,'지연 p95  '+p95+' ms','최대 지연 '+worst.toFixed(0)+' ms',
   '긴 프레임 '+longFrames,'Long Tasks '+longTasks,
   'JS 메모리 '+memory,'보드 셀   '+tileCount,
   '렌더 횟수 '+(perf.boardRenders||0),'시작 횟수 '+(perf.stageStarts||0),
   '효과 노드 '+(vfx+overlays)
  ].join('\n');
  window.LanyPerfDiagnostics.last={fps,p95:Number(p95)||0,longFrames,longTasks,heap:heap??null,boardCells:tileCount,renders:perf.boardRenders||0,stageStarts:perf.stageStarts||0,effects:vfx+overlays};
  frameCount=0;lastReport=now;
 }
 function stop(){
  if(!active)return;
  active=false;cancelAnimationFrame(raf);clearInterval(interval);
  longTaskObserver?.disconnect();hud.remove();
  document.getElementById('lany-perf-style')?.remove();
  document.removeEventListener('visibilitychange',visibility);
 }
 function visibility(){
  if(document.hidden){cancelAnimationFrame(raf);raf=0;lastFrame=0;frameCount=0;}
  else if(active&&!raf){lastReport=performance.now();raf=requestAnimationFrame(sample);}
 }
 function init(){
  addStyle();document.body.appendChild(hud);
  hud.querySelector('button').addEventListener('click',stop,{once:true});
  if(typeof PerformanceObserver==='function'){
   try{longTaskObserver=new PerformanceObserver(list=>{longTasks+=list.getEntries().length});longTaskObserver.observe({entryTypes:['longtask']});}
   catch(_){longTaskObserver=null;}
  }
  document.addEventListener('visibilitychange',visibility);
  raf=requestAnimationFrame(sample);
  interval=setInterval(refresh,2000);
  refresh();
 }
 window.LanyPerfDiagnostics={active:()=>active,stop,last:null};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
