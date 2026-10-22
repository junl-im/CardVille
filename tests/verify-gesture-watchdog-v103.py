"""A dropped pointer stream releases the board without another touch."""
import os
from playwright.sync_api import sync_playwright

base = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path'] = os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser = pw.chromium.launch(**launch)
    page = browser.new_page(viewport={'width': 320, 'height': 480}, is_mobile=True, has_touch=True, service_workers='block')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(base + '?v=2.3.52', wait_until='load')
    page.evaluate("LanyShell.start();LanyShell.openPrep(1);LanyShell.playPrepared()")
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    page.clock.install()
    page.evaluate("""() => {
      const cell=document.querySelector('#board .cell');
      cell.dispatchEvent(new PointerEvent('pointerdown',{
        bubbles:true,cancelable:true,pointerId:901,pointerType:'touch',button:0,buttons:1,
        clientX:60,clientY:210
      }));
      if(!cell.classList.contains('cv-dragging'))throw Error('gesture did not begin');
    }""")
    page.clock.fast_forward(4100)
    assert page.evaluate("!document.querySelector('#board .cv-dragging')"), 'stale gesture remained locked'
    page.evaluate("""() => {
      const cell=document.querySelector('#board .cell');
      cell.dispatchEvent(new PointerEvent('pointerdown',{
        bubbles:true,cancelable:true,pointerId:902,pointerType:'touch',button:0,buttons:1,
        clientX:60,clientY:210
      }));
      if(!cell.classList.contains('cv-dragging'))throw Error('next gesture was blocked');
      cell.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:902,pointerType:'touch'}));
    }""")
    assert not errors, errors
    browser.close()
print('gesture watchdog v103: pass')
