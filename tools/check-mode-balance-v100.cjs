const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const html=fs.readFileSync('web/index.html','utf8');
const levels=html.slice(html.indexOf('const LEVELS = ['),html.indexOf('function activeLevels()'));
const {normal,hard,crazy}=vm.runInNewContext(levels+';({normal:LEVELS,hard:HARD_LEVELS,crazy:CRAZY_LEVELS})');
const balance=require('../web/js/cardville-balance.js');
balance.apply(normal);
assert.equal(normal.length,250);assert.equal(hard.length,250);assert.equal(crazy.length,250);
assert.deepEqual([hard[0].goal,hard[0].moves,hard[0].clearGoal],[3600,22,29]);
assert.deepEqual([crazy[0].goal,crazy[0].moves,crazy[0].clearGoal],[4000,19,31]);
for(let i=0;i<250;i++){
  const world=Math.floor(i/25),h=hard[i],c=crazy[i];
  assert(h.goal>normal[i].goal,`hard score ${i+1}`);
  assert(c.goal>=h.goal&&c.clearGoal>=h.clearGoal,`mode order ${i+1}`);
  const bossFactor=normal[i].isBoss?1.35:1;
  assert(h.goal<=Math.round(h.moves*(220+world*8)*bossFactor/50)*50,`hard score cap ${i+1}`);
  assert(c.goal<=Math.round(c.moves*(280+world*10)*bossFactor/50)*50,`crazy score cap ${i+1}`);
  assert(h.clearGoal<=Math.ceil(h.moves*(1.35+world*.03)),`hard match cap ${i+1}`);
  assert(c.clearGoal<=Math.ceil(c.moves*(1.7+world*.025)),`crazy match cap ${i+1}`);
}
assert(hard[248].goal<hard[24].goal*1.2,'late hard score must not outrun moves');
assert(crazy[249].clearGoal<=33,'late crazy match cap');
console.log('v100 mode balance: 250 stages checked');
