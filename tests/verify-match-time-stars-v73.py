"""Timed matches visibly grant seconds on a compact mobile game HUD."""
import os
from playwright.sync_api import sync_playwright

BASE=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for width,height in [(320,568),(390,844),(1366,768)]:
  page=browser.new_page(viewport={'width':width,'height':height},service_workers='block')
  page.goto(BASE+'?v=2.3.38',wait_until='load')
  page.locator('#lany-start-button').click()
  page.locator('#lany-map-continue').click()
  page.locator('#lany-prep-play').click()
  page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
  result=page.evaluate('''()=>{
   const before=LanyTempo.getRemaining();
   const added=LanyTempo.awardMatchTime([{run:3},{run:4},{run:5}]);
   const badge=document.querySelector('.lany-time-bonus');
   const rect=badge?.getBoundingClientRect();
   return {before,after:LanyTempo.getRemaining(),added,text:badge?.textContent,
    rect:rect&&{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom}};
  }''')
  assert result['added']==6 and result['after']==result['before']+6,(width,result)
  assert result['text']=='⏱ +6초',(width,result)
  assert result['rect']['left']>=0 and result['rect']['right']<=width,(width,result)
  played=page.evaluate('''async()=>{
   let move=null;
   for(let r=0;r<8&&!move;r++)for(let c=0;c<8&&!move;c++)for(const [rr,cc] of [[r+1,c],[r,c+1]]){
    if(rr>=8||cc>=8||state.walls[r*8+c]||state.walls[rr*8+cc]||state.locked[r*8+c]||state.locked[rr*8+cc])continue;
    doSwap(r,c,rr,cc);const valid=findMatches().length>0;doSwap(r,c,rr,cc);
    if(valid){move=[r,c,rr,cc];break;}
   }
   if(!move)return {move:null};
   const before=LanyTempo.getBonusEarned();await trySwap(...move);
   return {move,before,after:LanyTempo.getBonusEarned()};
  }''')
  assert played['move'] and played['after']>played['before'],(width,'real match bonus',played)
  stars=page.evaluate('''()=>{
   initGame(1);
   const level=activeLevels()[state.level-1];state.score=Math.ceil(level.goal*1.35);state.movesLeft=level.moves-2;
   checkEnd();return {score:state.score,stars:state.levelStars[state.level],detail:document.getElementById('win-detail').textContent};
  }''')
  assert stars['stars']==3 and '보너스 +' in stars['detail'],(width,'three-star clear',stars)
  page.close()
 browser.close()
print('timed match HUD checks passed')
