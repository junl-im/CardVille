"""An untouched puzzle still saves elapsed challenge time before reload."""
import os
from playwright.sync_api import sync_playwright

base = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path'] = os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser = pw.chromium.launch(**launch)
    context = browser.new_context(viewport={'width': 390, 'height': 844}, service_workers='block')
    page = context.new_page()
    page.goto(base + '?v=2.3.45', wait_until='load')
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-continue').click()
    page.locator('#lany-prep-play').click()
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    initial = page.evaluate('LanySession.read().clock.remaining')
    page.wait_for_function('(start) => LanySession.read()?.clock.remaining <= start-2', arg=initial, timeout=6000)
    saved = page.evaluate('LanySession.read().clock.remaining')
    assert saved < initial, 'idle clock was not persisted by the ticker'
    page.reload(wait_until='load')
    page.wait_for_timeout(1200)
    assert page.evaluate('LanySession.read().clock.remaining') == saved, 'clock ran while game was closed'
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-resume').click()
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    remaining = page.evaluate('LanyTempo.getRemaining()')
    assert saved-1 <= remaining <= saved, f'wrong restored time: {remaining} vs {saved}'
    context.close()
    browser.close()
print('idle challenge clock persistence: pass')
