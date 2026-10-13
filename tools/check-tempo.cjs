/* Deterministic real logic tests: virtual 1-second game time, pause, resume and expiry. */
'use strict';
const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync('web/js/lany-tempo.js','utf8');
const elements=new Map();
function el(id){if(!elements.has(id))elements.set(id,{textContent:'',style:{},classList:{toggle(){}},offsetWidth:100});return elements.get(id)}
let now=0,tick,win=0,lose=0;
const store={};
const sandbox={
 document:{getElementById:el,addEventListener(){}},
 localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v)},
 performance:{now:()=>now},setInterval(fn,interval){assert.equal(interval,200);tick=fn},
 state:{animating:false,score:0,level:1},LEVELS:[{goal:500}],
 showLose(){lose++},checkEnd(){win++},
 console,snd_tick(){}
};sandbox.window=sandbox;vm.createContext(sandbox);vm.runInContext(source,sandbox);
const tempo=sandbox.LanyTempo;
assert(tempo&&typeof tick==='function');assert(tempo.enabled());
tempo.start(1);assert.equal(tempo.getRemaining(),185);
now=1000;tick();assert.equal(tempo.getRemaining(),184);
tempo.pause();now=55000;tick();assert.equal(tempo.getRemaining(),184);
tempo.resume();now=56001;tick();assert.equal(tempo.getRemaining(),183);
tempo.setEnabled(false);tempo.start(1);now=57001;tick();assert.equal(tempo.getElapsed(),1);assert.equal(tempo.getRemaining(),185);
tempo.stop();assert(!tempo.isRunning());
tempo.setEnabled(true);tempo.start(1);now=250000;tick();assert.equal(lose,1);assert(tempo.isExpired());assert(!tempo.isRunning());
assert.equal(win,0);assert.equal(store.lany_timed_challenge,'on');
console.log(JSON.stringify({ok:true,pausedNotDecremented:true,classicElapsed:true,expiryLose:true,secretFree:true}));
