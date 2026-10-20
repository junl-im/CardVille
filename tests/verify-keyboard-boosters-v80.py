"""Keyboard players can target boosters and hear the actual tile identity."""
import os
from playwright.sync_api import sync_playwright

BASE = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 390, 'height': 844}, service_workers='block')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE + '?v=2.3.43', wait_until='load')
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-continue').click()
    page.locator('#lany-prep-play').click()
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    page.evaluate('LanyTempo.setEnabled(false)')

    first = page.locator('#board .cell').first
    first.focus()
    label = first.get_attribute('aria-label')
    assert '1행 1열' in label and '블록' in label and '빈 칸' not in label, label

    page.evaluate("activateBooster('hammer')")
    first.focus()
    page.keyboard.press('Enter')
    page.wait_for_function('!state.animating')
    assert page.evaluate('state.boosters.hammer') == 2
    assert page.evaluate('state.activeBooster') is None

    page.evaluate("activateBooster('color')")
    first.focus()
    page.keyboard.press('Space')
    page.wait_for_function('!state.animating')
    assert page.evaluate('state.boosters.color') == 1
    assert page.evaluate('state.activeBooster') is None
    assert '빈 칸' not in first.get_attribute('aria-label')

    page.evaluate('state.score=activeLevels()[state.level-1].goal;checkEnd()')
    assert page.locator('#overlay-win').is_visible()
    assert page.evaluate("document.activeElement===document.querySelector('#overlay-win .modal-btns button')")
    page.evaluate('LanyShell.openExit();LanyShell.resume()')
    assert page.evaluate("document.activeElement===document.querySelector('#overlay-win .modal-btns button')")
    page.evaluate('replayLevel();state.movesLeft=0;checkEnd()')
    assert page.locator('#overlay-lose').is_visible()
    assert page.evaluate("document.activeElement===document.querySelector('#overlay-lose .modal-btns button')")
    assert not errors, errors
    browser.close()
print('keyboard booster and spoken tile checks passed')
