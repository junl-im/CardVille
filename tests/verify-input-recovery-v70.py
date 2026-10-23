"""Browser regression for a lost drag capture and a failed match animation."""
import os
from playwright.sync_api import sync_playwright

BASE=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for name,width,height in [('small',320,568),('phone',390,844)]:
  page=browser.new_page(viewport={'width':width,'height':height},service_workers='block')
  errors=[]
  page.on('pageerror',lambda error:errors.append(str(error)))
  page.goto(BASE+'?v=2.3.55',wait_until='load')
  page.locator('#lany-start-button').click()
  for mode in ['normal','hard','crazy']:
   page.locator('#lany-mode-'+mode).click()
   pins=page.evaluate("""()=>[...document.querySelectorAll('.lany-campaign-switch button')].map(button=>({active:button.getAttribute('aria-pressed')==='true',visible:getComputedStyle(button,'::after').display==='block',image:getComputedStyle(button,'::after').backgroundImage.includes('selected-mode-pin.webp')}))""")
   assert sum(pin['active'] for pin in pins)==1 and all(pin['active']==pin['visible']==pin['image'] for pin in pins),(name,mode,pins)
  page.locator('#lany-mode-normal').click()
  page.locator('#lany-map-continue').click()
  page.locator('#lany-prep-play').click()
  page.wait_for_timeout(3300)
  result=page.evaluate("""async()=>{
    LanyTempo.setEnabled(false);initGame(1);
    const board=document.getElementById('board'),cell=board.children[0];
    const pointer=(type,id)=>new PointerEvent(type,{bubbles:true,pointerId:id,pointerType:'touch',button:0,clientX:80,clientY:250});
    cell.dispatchEvent(pointer('pointerdown',41));const started=cell.classList.contains('cv-dragging');
    board.dispatchEvent(pointer('lostpointercapture',41));const released=!cell.classList.contains('cv-dragging');
    cell.dispatchEvent(pointer('pointerdown',42));const restarted=cell.classList.contains('cv-dragging');
    board.dispatchEvent(pointer('pointercancel',42));
    const original=LanyPolish.onSwap;LanyPolish.onSwap=()=>{throw Error('deliberate regression fault')};
    await trySwap(0,0,0,1);LanyPolish.onSwap=original;
    const unlocked=!state.animating;
    const oldRandom=Math.random;Math.random=()=>0;const rescued=shuffleBoard();Math.random=oldRandom;
    const playable=hasLegalSwap();
    const originalGravity=applyGravity;applyGravity=async()=>{throw Error('deliberate booster fault')};
    state.boosters.hammer=1;state.activeBooster='hammer';applyBooster(0,0);
    await new Promise(resolve=>setTimeout(resolve,40));applyGravity=originalGravity;
    const boosterUnlocked=!state.animating;
    state.walls.fill(true);
    const extremeRescue=shuffleBoard()&&hasLegalSwap();
    showWin(2);const win=document.querySelector('#overlay-win .modal');
    const winFits=win.scrollHeight<=win.clientHeight+2;
    hideOverlay('overlay-win');showLose();const lose=document.querySelector('#overlay-lose .modal');
    const loseFits=lose.scrollHeight<=lose.clientHeight+2;
    return {started,released,restarted,unlocked,rescued,playable,extremeRescue,boosterUnlocked,winFits,loseFits};
  }""")
  assert all(result.values()),(name,result)
  assert not errors,(name,errors)
  print(name,result)
  page.close()
 browser.close()
