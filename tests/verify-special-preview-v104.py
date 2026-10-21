"""Special range is readable before the wave, including reduced motion."""
import os
from playwright.sync_api import sync_playwright

base = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path'] = os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser = pw.chromium.launch(**launch)
    for motion in ('no-preference', 'reduce'):
        context = browser.new_context(viewport={'width': 390, 'height': 844}, reduced_motion=motion, service_workers='block')
        page = context.new_page()
        page.goto(base + '?v=2.3.50', wait_until='load')
        page.evaluate("LanyShell.start();LanyShell.openPrep(1);LanyShell.playPrepared()")
        page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
        result = page.evaluate("""() => {
          const cells=new Set([24,25,26,27,28,29,30,31]);
          LanyPolish.onSpecial([{index:27,special:2}],cells,null,state.board,360);
          const list=selector=>[...document.querySelectorAll(selector)].map(el=>({
            index:Number(el.dataset.index),
            opacity:getComputedStyle(el).opacity,
            rect:el.getBoundingClientRect().toJSON()
          }));
          return {preview:list('.lany-special-cell-preview'),wave:list('.lany-special-cell-wave')};
        }""")
        assert sorted(item['index'] for item in result['preview']) == list(range(24, 32)), (motion, result)
        assert all(float(item['opacity']) > 0 and item['rect']['width'] > 0 for item in result['preview']), (motion, 'preview hidden', result)
        assert len(result['wave']) == (0 if motion == 'reduce' else 8), (motion, 'wave count', result)
        page.wait_for_timeout(410)
        assert page.locator('.lany-special-cell-preview,.lany-special-cell-wave').count() == 0, (motion, 'stale effect')
        context.close()
    browser.close()
print('special preview v104: pass')
