"""The mode selected on the map controls prep, HUD, timer, and obstacles."""
import os
from playwright.sync_api import sync_playwright

BASE=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for width,height in [(390,844),(1366,768)]:
  page=browser.new_page(viewport={'width':width,'height':height},service_workers='block')
  errors=[]
  page.on('pageerror',lambda error:errors.append(str(error)))
  page.goto(BASE+'?v=2.3.36',wait_until='load')
  page.locator('#lany-start-button').click()
  result=page.evaluate('''() => {
    LanyTempo.setEnabled(true);
    const result=[];
    for(const mode of ['normal','hard','crazy']){
      setCampaignMode(mode);
      LanyShell.openPrep(1);
      const level=activeLevels()[0];
      const prep={goal:document.getElementById('lany-prep-goal').textContent,
        moves:document.getElementById('lany-prep-moves').textContent,
        time:document.getElementById('lany-time-hint').textContent};
      LanyShell.playPrepared();
      document.getElementById('lany-go-intro').hidden=true;
      const board={goal:document.getElementById('score-label').textContent,
        moves:document.getElementById('lany-hud-moves').textContent,
        time:LanyTempo.getRemaining(),
        walls:state.walls.filter(Boolean).length,
        locks:state.locked.filter(Boolean).length,
        match:document.getElementById('lany-hard-objective').textContent};
      result.push({mode,level:{goal:level.goal,moves:level.moves,time:LanyTempo.durationFor(1),walls:level.wallCount||0,locks:level.lockedCount,clearGoal:level.clearGoal||0},prep,board});
      LanyShell.openMap();
    }
    return result;
  }''')
  assert [item['level']['time'] for item in result]==[93,84,75],(width,result)
  assert result[0]['level']['goal']<result[1]['level']['goal']<result[2]['level']['goal'],(width,result)
  assert result[1]['level']['moves']>result[2]['level']['moves'],(width,result)
  assert result[1]['level']['clearGoal']<=result[2]['level']['clearGoal'],(width,result)
  for item in result:
   level,prep,board=item['level'],item['prep'],item['board']
   assert prep['goal']==f"{level['goal']:,}점" and prep['moves']==f"{level['moves']}회",(width,item)
   assert f"제한 {level['time']}초" in prep['time'],(width,item)
   assert board['goal']==f"0 / {level['goal']:,}" and board['moves']==str(level['moves']),(width,item)
   assert board['time']==level['time'] and board['walls']==level['walls'] and board['locks']==level['locks'],(width,item)
   if item['mode']!='normal':assert f"/ {level['clearGoal']}" in board['match'],(width,item)
  assert not errors,(width,errors)
  page.close()
 browser.close()
print('mode preparation and gameplay balance checks passed')
