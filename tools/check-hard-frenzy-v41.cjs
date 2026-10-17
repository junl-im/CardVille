'use strict';
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const html=fs.readFileSync('web/index.html','utf8');
const css=fs.readFileSync('web/css/lany-hard-v40.css','utf8');
const sw=fs.readFileSync('web/sw.js','utf8');
const start=html.indexOf('function expandSpecialMatches(cells){');
const end=html.indexOf('// ── Resolve matches',start);
const placeStart=html.indexOf('function placePendingFrenzy(){');
const placeEnd=html.indexOf('async function applyGravity',placeStart);
assert(start>0&&end>start&&placeStart>0&&placeEnd>placeStart);
const state={board:Array.from({length:64},(_,i)=>String(i)),specials:Array(64).fill(0),walls:Array(64).fill(false),locked:Array(64).fill(false),pendingFrenzy:[]};
const ctx={ROWS:8,COLS:8,SPECIAL_BOMB:1,SPECIAL_STRIPE_H:2,SPECIAL_STRIPE_V:3,SPECIAL_WRAP:4,SPECIAL_COLOR:5,SPECIAL_FRENZY_ROW:6,SPECIAL_FRENZY_COL:7,SPECIAL_FRENZY_BURST:8,state,findMatches:()=>[]};
vm.createContext(ctx);vm.runInContext(html.slice(start,end)+html.slice(placeStart,placeEnd),ctx);
for(const [kind,expected] of [[6,8],[7,8],[8,9]]){
 state.specials.fill(0);state.specials[27]=kind;
 const cells=new Set([27]);assert.equal(ctx.expandSpecialMatches(cells),1);assert.equal(cells.size,expected);
}
state.specials.fill(0);state.specials[26]=2;state.specials[27]=6;
const indirect=new Set([26]);ctx.expandSpecialMatches(indirect);
assert.equal(indirect.size,8,'A line touching a frenzy must not detonate it indirectly');
state.specials.fill(0);state.pendingFrenzy=[{index:27,gem:'rabbit',kind:6}];
ctx.placePendingFrenzy();
assert.equal(state.specials[27],6);assert.equal(state.board[27],'rabbit');assert.equal(state.pendingFrenzy.length,0);
assert(html.includes("state.mode==='hard'&&state.hardClears>=lv.clearGoal")||html.includes("state.mode==='normal'||state.hardClears>=lv.clearGoal"));
assert(html.includes('state.hardClears+=matchGroups.length'));
assert(html.includes('state.specials[idx]||changed.includes(idx)'));
for(const name of ['row','column','burst','wall','bomb','morph','clears','hard']){
 const asset=`./assets/v41/hard/${name}.webp`;
 assert(fs.existsSync(`web/assets/v41/hard/${name}.webp`),asset);
 assert(sw.includes(asset),`Offline cache missing ${asset}`);
}
assert(css.includes('.lany-frenzy-gem')&&css.includes('.lany-hard-objective'));
console.log(JSON.stringify({pass:true,frenzy:['row','column','burst'],icons:8,hardGoals:250}));
