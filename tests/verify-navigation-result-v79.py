"""A result that appears during a navigation pause must remain reachable."""
import os
from playwright.sync_api import sync_playwright

BASE = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 390, 'height': 844}, service_workers='block')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE + '?v=2.3.48', wait_until='load')
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-continue').click()
    page.locator('#lany-prep-play').click()
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)

    def reset():
        page.evaluate('''() => {
          initGame(1);
          LanyTempo.pause = () => showLose();
        }''')

    reset()
    page.evaluate('LanyShell.openPause()')
    assert page.locator('#overlay-lose').is_visible()
    assert page.locator('#lany-pause').is_hidden()

    reset()
    page.evaluate('LanyShell.openExit()')
    assert page.locator('#lany-exit').is_visible()
    page.evaluate('LanyShell.resume()')
    assert page.locator('#overlay-lose').is_visible()

    reset()
    page.evaluate('LanyShell.openMap()')
    assert page.locator('#lany-world-map').is_visible()
    assert page.locator('#lany-map-resume').is_hidden()
    assert not page.evaluate('LanyShell.getCurrentScreen()==="game"')
    assert not errors, errors
    browser.close()
print('navigation/result race checks passed')
