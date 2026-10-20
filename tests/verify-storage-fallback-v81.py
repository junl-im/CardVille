"""Gameplay stays usable when a browser blocks local storage calls."""
import os
from playwright.sync_api import sync_playwright

BASE = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 390, 'height': 844}, service_workers='block')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.add_init_script('''(() => {
      Storage.prototype.getItem = () => { throw new DOMException('blocked', 'SecurityError'); };
      Storage.prototype.setItem = () => { throw new DOMException('blocked', 'SecurityError'); };
    })()''')
    page.goto(BASE + '?v=2.3.40', wait_until='load')
    page.locator('#lany-start-button').click()
    assert page.locator('#lany-world-map').is_visible()
    page.locator('#lany-map-continue').click()
    assert page.locator('#lany-stage-prep').is_visible()
    page.locator('#lany-prep-play').click()
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    assert page.evaluate('state.board.length===64 && !state.ended')
    page.evaluate('initGame()')
    assert page.evaluate('state.board.length===64 && !state.ended')
    page.evaluate('LanyShell.openMap()')
    assert page.locator('#lany-world-map').is_visible()
    page.evaluate('LanyShell.resumeGameFromMap()')
    page.evaluate('LanyTempo.setEnabled(false);state.score=activeLevels()[state.level-1].goal;checkEnd()')
    assert page.locator('#overlay-win').is_visible()
    assert page.evaluate('state.unlockedLevels.includes(2)')
    page.locator('#overlay-win .modal-btns button').first.click()
    assert page.locator('#lany-stage-prep').is_visible()
    assert page.evaluate('LanyShell.getCurrentScreen()==="prep"')
    for mode in ('hard', 'crazy'):
        page.evaluate('LanyShell.openMap()')
        page.locator('#lany-mode-' + mode).click()
        assert page.evaluate('state.mode') == mode
        page.locator('#lany-map-continue').click()
        page.locator('#lany-prep-play').click()
        page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
        assert page.evaluate('state.board.length===64 && !state.ended')
    assert not errors, errors
    browser.close()
print('blocked-storage play flow checks passed')
