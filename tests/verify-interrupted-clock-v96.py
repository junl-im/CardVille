"""A paused move must finish before its challenge clock resumes."""
import os
from playwright.sync_api import sync_playwright

base = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path'] = os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser = pw.chromium.launch(**launch)
    page = browser.new_page(service_workers='block')
    page.goto(base + '?v=2.3.54', wait_until='load')
    page.evaluate("LanyShell.start();LanyShell.openPrep(1);LanyShell.playPrepared()")
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    page.evaluate("""() => {
      LanyTempo.setEnabled(true);
      state.animating=true;
      LanyShell.openPause();
      if(LanyTempo.isRunning())throw Error('clock kept running under pause');
      LanyShell.resume();
      if(LanyTempo.isRunning())throw Error('clock restarted before move settled');
    }""")
    paused = page.evaluate('LanyTempo.getRemaining()')
    page.wait_for_timeout(1250)
    assert page.evaluate('LanyTempo.getRemaining()') == paused, 'clock advanced during unresolved move'
    page.evaluate("state.animating=false;LanyTempo.flush()")
    assert page.evaluate('LanyTempo.isRunning()'), 'clock did not resume after move settled'
    page.wait_for_function('(previous) => LanyTempo.getRemaining() < previous', arg=paused, timeout=2500)
    page.evaluate("state.animating=true;LanyShell.openPause();LanyShell.resume();LanyShell.openPause();state.animating=false;LanyTempo.flush()")
    assert not page.evaluate('LanyTempo.isRunning()'), 'clock resumed while pause dialog was open'
    page.evaluate('LanyShell.resume()')
    assert page.evaluate('LanyTempo.isRunning()'), 'clock did not resume after explicit continue'
    browser.close()
print('interrupted move clock v96: pass')
