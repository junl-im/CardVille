"""A stable puzzle board and paused clock survive reload, across campaign modes."""
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
    page.goto(base + '?v=2.3.40', wait_until='load')
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-continue').click()
    page.locator('#lany-prep-play').click()
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    assert page.evaluate('LanySession.read()?.level') == 1, 'new board was not saved automatically'
    page.evaluate("activateBooster('time')")
    assert page.evaluate('LanySession.read()?.movesLeft') == page.evaluate('state.movesLeft'), 'booster turn was not saved'
    page.evaluate('''() => {
      state.score=314;state.movesLeft=7;state.boosters.hammer=1;
      state.specials[0]=SPECIAL_BOMB;
      LanyTempo.pause();LanySession.save();
    }''')
    original = page.evaluate('LanySession.read()')
    assert original['score'] == 314 and original['specials'][0] == 1
    page.reload(wait_until='load')
    page.locator('#lany-start-button').click()
    assert page.locator('#lany-map-resume').is_visible()
    page.locator('#lany-map-resume').click()
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    restored = page.evaluate('''() => ({board:state.board,specials:state.specials,
      score:state.score,moves:state.movesLeft,hammer:state.boosters.hammer,
      remaining:LanyTempo.getRemaining()})''')
    assert restored['board'] == original['board']
    assert restored['specials'] == original['specials']
    assert (restored['score'], restored['moves'], restored['hammer']) == (314, 7, 1)
    assert 0 < restored['remaining'] <= original['clock']['remaining']
    page.evaluate('LanyShell.openMap()')
    page.locator('#lany-mode-hard').click()
    assert page.locator('#lany-map-resume').is_hidden(), 'normal board leaked to hard mode'
    page.locator('#lany-mode-normal').click()
    assert page.locator('#lany-map-resume').is_visible(), 'normal board lost on mode switch'
    page.evaluate('''() => {const saved=LanySession.read();saved.board=[1];
      localStorage.setItem('sc_live_v1',JSON.stringify(saved));}''')
    page.reload(wait_until='load')
    page.locator('#lany-start-button').click()
    assert page.locator('#lany-map-resume').is_hidden(), 'corrupt board should be discarded'
    context.close()
    browser.close()
print('live puzzle session restore: pass')
