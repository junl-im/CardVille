"""An unrelated finger cannot cancel a drag; screen changes clear it safely."""
import os
from playwright.sync_api import sync_playwright

base = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path'] = os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser = pw.chromium.launch(**launch)
    page = browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True,
                            has_touch=True, service_workers='block')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(base + '?v=2.3.52', wait_until='load')
    page.evaluate('LanyShell.start();LanyShell.openPrep(1);LanyShell.playPrepared()')
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    result = page.evaluate("""() => {
      const board=document.getElementById('board'),first=board.children[0],second=board.children[1];
      board.setPointerCapture=()=>{};
      board.hasPointerCapture=id=>id===701;
      board.releasePointerCapture=()=>{};
      const fire=(target,type,id)=>target.dispatchEvent(new PointerEvent(type,{
        bubbles:true,cancelable:true,pointerId:id,pointerType:'touch',button:0,buttons:type==='pointerup'?0:1,
        clientX:80,clientY:250
      }));
      fire(first,'pointerdown',701);
      const started=first.classList.contains('cv-dragging');
      fire(second,'pointerdown',702);
      const secondIgnored=!second.classList.contains('cv-dragging');
      fire(board,'pointercancel',702);
      fire(board,'lostpointercapture',702);
      window.dispatchEvent(new PointerEvent('pointercancel',{pointerId:702,pointerType:'touch'}));
      const unrelatedIgnored=first.classList.contains('cv-dragging');
      fire(board,'pointercancel',701);
      const activeCancelled=!first.classList.contains('cv-dragging');
      fire(first,'pointerdown',703);
      window.dispatchEvent(new Event('resize'));
      const resizedClean=!first.classList.contains('cv-dragging');
      fire(first,'pointerdown',704);
      window.dispatchEvent(new Event('blur'));
      const blurredClean=!first.classList.contains('cv-dragging');
      fire(first,'pointerdown',705);
      fire(board,'pointerup',705);
      const usableAgain=!first.classList.contains('cv-dragging');
      return {started,secondIgnored,unrelatedIgnored,activeCancelled,resizedClean,blurredClean,usableAgain};
    }""")
    assert all(result.values()), result
    assert not errors, errors
    browser.close()
print('multitouch recovery v98: pass')
