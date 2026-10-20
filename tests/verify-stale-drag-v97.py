"""A lost pointer-up cannot leave the puzzle permanently unresponsive."""
import os
from playwright.sync_api import sync_playwright

base = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path'] = os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser = pw.chromium.launch(**launch)
    page = browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True, service_workers='block')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(base + '?v=2.3.46', wait_until='load')
    page.evaluate("LanyShell.start();LanyShell.openPrep(1);LanyShell.playPrepared()")
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    page.evaluate("""() => {
      const board=document.getElementById('board'),first=board.children[0];
      window.__dragRelease=[];
      board.hasPointerCapture=id=>id===701;
      board.releasePointerCapture=id=>{window.__dragRelease.push(id);board.dispatchEvent(new PointerEvent('lostpointercapture',{pointerId:id}))};
      const event=new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:701,pointerType:'touch',button:0,buttons:1,clientX:80,clientY:250});
      first.dispatchEvent(event);
      if(!first.classList.contains('cv-dragging'))throw Error('first drag did not begin');
    }""")
    page.wait_for_timeout(3150)
    result = page.evaluate("""() => {
      const board=document.getElementById('board'),first=board.children[0],second=board.children[1];
      second.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,pointerId:702,pointerType:'touch',button:0,buttons:1,clientX:120,clientY:250}));
      const recovered=!first.classList.contains('cv-dragging')&&second.classList.contains('cv-dragging');
      board.dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:702,pointerType:'touch'}));
      return {recovered,released:window.__dragRelease.includes(701),clean:!second.classList.contains('cv-dragging')};
    }""")
    assert all(result.values()), result
    assert not errors, errors
    browser.close()
print('stale drag recovery v97: pass')
