"""The GO countdown blocks game actions until the clock resumes."""
import os
from playwright.sync_api import sync_playwright

BASE=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for name,width,height in [('small',320,568),('phone',390,844)]:
  page=browser.new_page(viewport={'width':width,'height':height},service_workers='block')
  errors=[]
  page.on('pageerror',lambda error:errors.append(str(error)))
  page.goto(BASE+'?v=2.3.20',wait_until='load')
  page.locator('#lany-start-button').click()
  page.locator('#lany-map-continue').click()
  page.locator('#lany-prep-play').click()
  during=page.evaluate("""async()=>{
    const overlay=document.getElementById('lany-go-intro'),board=document.getElementById('board');
    const before={moves:state.movesLeft,board:state.board.slice(),boosters:{...state.boosters}};
    const cell=board.children[0];
    cell.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:71,pointerType:'touch',button:0,clientX:60,clientY:250}));
    cvKeyboardSelect(0,0);await trySwap(0,0,0,1);activateBooster('time');
    return {visible:!overlay.hidden,blocksPointer:getComputedStyle(overlay).pointerEvents==='auto',
      noDrag:!cell.classList.contains('cv-dragging'),unchanged:state.movesLeft===before.moves&&
      JSON.stringify(state.board)===JSON.stringify(before.board)&&state.boosters.time===before.boosters.time,
      clockPaused:!LanyTempo.isRunning()};
  }""")
  assert all(during.values()),(name,during)
  page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
  after=page.evaluate("""()=>{
    const before=state.movesLeft,count=state.boosters.time;
    activateBooster('time');
    return {clockRunning:LanyTempo.isRunning(),boosterWorks:state.movesLeft===before+5&&state.boosters.time===count-1};
  }""")
  assert all(after.values()),(name,after)
  assert not errors,(name,errors)
  print(name,during,after)
  page.close()
 browser.close()
