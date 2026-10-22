"""Special range highlights finish before the next board state appears."""
import os
from playwright.sync_api import sync_playwright

base = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path'] = os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser = pw.chromium.launch(**launch)
    for width, height in ((390, 844), (1366, 768)):
        page = browser.new_page(viewport={'width': width, 'height': height}, service_workers='block')
        page.goto(base + '?v=2.3.53', wait_until='load')
        page.locator('#lany-start-button').click()
        page.locator('#lany-map-continue').click()
        page.locator('#lany-prep-play').click()
        page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
        for dwell in (210, 360):
            timing = page.evaluate('''dwell => {
              const cells=new Set([24,25,26,27,28,29,30,31]);
              LanyPolish.onSpecial([{index:27,special:2}],cells,null,state.board,dwell);
              return [...document.querySelectorAll('.lany-special-cell-wave')].map(el=>({
                index:Number(el.dataset.index),
                delay:parseFloat(getComputedStyle(el).animationDelay)*1000,
                duration:parseFloat(getComputedStyle(el).animationDuration)*1000
              }));
            }''', dwell)
            assert sorted(tile['index'] for tile in timing) == list(range(24, 32)), (width, dwell, timing)
            assert max(tile['delay'] + tile['duration'] for tile in timing) <= dwell - 5, (width, dwell, timing)
            page.wait_for_timeout(dwell + 40)
            assert page.locator('.lany-special-cell-wave').count() == 0, (width, dwell, 'stale highlight')
        page.close()
    browser.close()
print('special highlight timing: pass')
