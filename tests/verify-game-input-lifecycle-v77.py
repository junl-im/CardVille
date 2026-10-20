"""Pause/map/exit block input; a completed turn resolves on resume."""
import os
from playwright.sync_api import sync_playwright

BASE=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for width,height in [(320,568),(390,844),(1366,768)]:
  page=browser.new_page(viewport={'width':width,'height':height},service_workers='block')
  page.goto(BASE+'?v=2.3.45',wait_until='load')
  page.locator('#lany-start-button').click()
  page.locator('#lany-map-continue').click()
  page.locator('#lany-prep-play').click()
  page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
  result=page.evaluate('''async() => {
    LanyTempo.setEnabled(false);initGame(1);
    const before=state.board.slice(),count=state.boosters.time;
    LanyShell.openPause();
    await trySwap(0,0,0,1);activateBooster('time');cvKeyboardSelect(0,0);
    const paused=!gameInputReady()&&state.board.every((gem,i)=>gem===before[i])&&state.boosters.time===count&&state.selected===null;
    LanyShell.resume();LanyShell.openMap();
    await trySwap(0,0,0,1);activateBooster('time');
    const mapped=!gameInputReady()&&state.board.every((gem,i)=>gem===before[i])&&state.boosters.time===count;
    LanyShell.resumeGameFromMap();LanyShell.openExit();
    await trySwap(0,0,0,1);activateBooster('time');
    const exited=!gameInputReady()&&state.board.every((gem,i)=>gem===before[i])&&state.boosters.time===count;
    state.score=activeLevels()[0].goal;checkEnd();
    const deferred=document.getElementById('overlay-win').style.display!=='flex'&&!state.ended;
    LanyShell.resume();
    return {paused,mapped,exited,deferred,resumed:state.ended&&document.getElementById('overlay-win').style.display==='flex'};
  }''')
  assert all(result.values()),(width,result)
  page.close()
 browser.close()
print('game input lifecycle checks passed')
