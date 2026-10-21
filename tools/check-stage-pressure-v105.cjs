'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('web/index.html','utf8');
const definitions=html.slice(html.indexOf('const LEVELS = ['),html.indexOf('function activeLevels()'));
const {normal,hard,crazy}=vm.runInNewContext(definitions+';({normal:LEVELS,hard:HARD_LEVELS,crazy:CRAZY_LEVELS})');
require('../web/js/cardville-balance.js').apply(normal);
const modes={normal,hard,crazy};
for(const [mode,levels] of Object.entries(modes)){
  assert.equal(levels.length,250,`${mode} stage count`);
  const worlds=[];
  for(let world=0;world<10;world++){
    const stages=levels.slice(world*25,(world+1)*25);
    assert.equal(stages.length,25);
    for(const [offset,stage] of stages.entries()){
      const id=world*25+offset+1;
      assert.equal(stage.l,id,`${mode} stage ID`);
      assert(stage.moves>=9&&stage.moves<=45,`${mode} ${id}: moves`);
      assert(stage.goal>0&&stage.goal/stage.moves<=(mode==='normal'?250:mode==='hard'?400:510),`${mode} ${id}: score pressure`);
      if(mode!=='normal'){
        assert(stage.clearGoal>0&&stage.clearGoal/stage.moves<=2.05,`${mode} ${id}: clear pressure`);
        assert(stage.wallCount>=0&&stage.wallCount<12,`${mode} ${id}: walls`);
      }
    }
    worlds.push({world:world+1,maxScorePerMove:Math.ceil(Math.max(...stages.map(s=>s.goal/s.moves))),
      maxClearPerMove:mode==='normal'?null:+Math.max(...stages.map(s=>s.clearGoal/s.moves)).toFixed(2)});
  }
  console.log(JSON.stringify({mode,stages:levels.length,worlds}));
}
console.log('v105 stage pressure audit: 750 stages passed');
