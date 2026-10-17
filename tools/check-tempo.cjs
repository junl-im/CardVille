/* Deterministic real logic tests: virtual 1-second game time, pause, resume and expiry. */
'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync('web/js/lany-tempo.js','utf8');
const elements=new Map();
function el(id){if(!elements.has(id))elements.set(id,{textContent:'',style:{},classList:{toggle(){}},offsetWidth:100});return elements.get(id)}
let now=0,tick,win=0,lose=0,starts=0,stops=0,liveTickers=0;
const store={};
const sandbox={
 document:{getElementById:el,addEventListener(){}},
 localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v)},
 performance:{now:()=>now},setInterval(fn,interval){assert.equal(interval,250);starts++;liveTickers++;assert.equal(liveTickers,1);tick=fn;return starts},clearInterval(id){assert(id>=1);stops++;liveTickers--;assert.equal(liveTickers,0)},
 state:{animating:false,score:0,level:1,mode:'normal',hardClears:0},LEVELS:[{goal:500}],activeLevels(){return [{goal:500,clearGoal:12}]},
 showLose(){lose++},checkEnd(){win++},
 console,snd_tick(){}
};sandbox.window=sandbox;vm.createContext(sandbox);vm.runInContext(source,sandbox);
const tempo=sandbox.LanyTempo;
assert(tempo&&typeof tempo.start==='function');assert(tempo.enabled());
assert.equal(liveTickers,0,'title does not require a ticker');
tempo.start(1);
assert.equal(liveTickers,1);assert.equal(tempo.getRemaining(),185);
now=1000;tick();assert.equal(tempo.getRemaining(),184);
tempo.pause();assert.equal(liveTickers,0,'paused clock must not run');now=55000;tick();assert.equal(tempo.getRemaining(),184);
tempo.resume();assert.equal(liveTickers,1);now=56001;tick();assert.equal(tempo.getRemaining(),183);
tempo.setEnabled(false);tempo.start(1);now=57001;tick();assert.equal(tempo.getElapsed(),1);assert.equal(tempo.getRemaining(),185);
tempo.stop();assert(!tempo.isRunning());assert.equal(liveTickers,0);
tempo.setEnabled(true);tempo.start(1);now=250000;tick();assert.equal(lose,1);assert(tempo.isExpired());assert(!tempo.isRunning());
assert.equal(win,0);assert.equal(store.lany_timed_challenge,'on');
assert.equal(liveTickers,0);assert.equal(starts,stops,'no clock intervals leaked');
// Time expiry must resolve every mode, including Crazy with a score-only objective met.
for(const mode of ['normal','hard','crazy']){
  sandbox.state.mode=mode;sandbox.state.score=500;sandbox.state.hardClears=0;
  const previousWin=win,previousLose=lose;
  tempo.start(1);now+=186000;tick();
  assert.equal(win,previousWin+(mode==='normal'?1:0),`${mode}: match objective gates the win`);
  assert.equal(lose,previousLose+(mode==='normal'?0:1),`${mode}: unmet match objective expires to a loss`);
  assert.equal(liveTickers,0,`${mode}: no expired timer is left running`);
  if(mode!=='normal'){
    sandbox.state.hardClears=12;
    const completedWins=win,completedLosses=lose;
    tempo.start(1);now+=186000;tick();
    assert.equal(win,completedWins+1,`${mode}: both objectives complete wins`);
    assert.equal(lose,completedLosses);
  }
}
assert.equal(starts,stops,'all mode expiry timers are released');
console.log(JSON.stringify({ok:true,pausedNotDecremented:true,classicElapsed:true,expiryLose:true,campaignExpiry:true,secretFree:true}));
