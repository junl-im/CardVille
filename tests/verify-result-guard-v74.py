"""Classic result wording, one-time score, and input reset after replay."""
import os
from playwright.sync_api import sync_playwright

BASE=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for width,height in [(320,568),(390,844),(1366,768)]:
  page=browser.new_page(viewport={'width':width,'height':height},service_workers='block')
  errors=[]
  page.on('pageerror',lambda error:errors.append(str(error)))
  page.goto(BASE+'?v=2.3.23',wait_until='load')
  page.locator('#lany-start-button').click()
  page.locator('#lany-map-continue').click()
  if page.locator('#lany-prep-next').is_visible():
   page.locator('#lany-prep-next').click()
  page.locator('#lany-time-mode').uncheck()
  page.locator('#lany-prep-play').click()
  page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
  result=page.evaluate('''async()=>{
   const lv=activeLevels()[state.level-1];
   state.score=Math.ceil(lv.goal*1.4);state.movesLeft=lv.moves-2;
   checkEnd();const first=state.score,detail=document.getElementById('win-detail').textContent;
   const board=state.board.slice(),boosters={...state.boosters};
   checkEnd();await trySwap(0,0,0,1);activateBooster('shuffle');
   const stable=state.score===first&&state.board.every((gem,i)=>gem===board[i])&&
      Object.keys(boosters).every(key=>state.boosters[key]===boosters[key]);
   initGame(state.level);
   return {detail,stable,reset:!state.ended&&state.score===0,enabled:LanyTempo.enabled()};
  }''')
  assert result['stable'] and result['reset'] and not result['enabled'],(width,result)
  assert '남은 이동 보너스' in result['detail'] and '남은 시간' not in result['detail'],(width,result)
  assert not errors,(width,errors)
  page.close()
 browser.close()
print('result and classic-mode checks passed')
