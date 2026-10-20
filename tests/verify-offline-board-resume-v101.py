"""An installed offline session resumes its saved board and paused clock."""
import os
from playwright.sync_api import sync_playwright

base = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path'] = os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser = pw.chromium.launch(**launch)
    context = browser.new_context(viewport={'width': 390, 'height': 844}, is_mobile=True,
                                  has_touch=True, service_workers='allow')
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(base + '?v=2.3.48', wait_until='load')
    page.wait_for_function('navigator.serviceWorker?.controller !== null', timeout=30000)
    page.evaluate('LanyShell.start();LanyShell.openPrep(1);LanyShell.playPrepared()')
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    saved = page.evaluate("""() => {
      LanyTempo.pause();
      state.score=321;
      state.movesLeft=12;
      LanySession.save();
      const snapshot=LanySession.read();
      LanyShell.showHome();
      return snapshot;
    }""")
    assert saved and saved['score'] == 321 and saved['movesLeft'] == 12
    context.set_offline(True)
    page.goto(base + '?v=2.3.48&source=pwa', wait_until='load')
    page.evaluate('LanyShell.start()')
    assert page.locator('#lany-map-resume').is_visible()
    page.evaluate('LanyShell.resumeGameFromMap()')
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    result = page.evaluate("""() => ({
      screen:LanyShell.getCurrentScreen(),score:state.score,moves:state.movesLeft,
      board:state.board,clock:LanyTempo.getRemaining(),saved:LanySession.read()
    })""")
    assert result['screen'] == 'game' and result['score'] == 321 and result['moves'] == 12, result
    assert result['board'] == saved['board'] and result['saved'], 'saved board was lost offline'
    assert result['clock'] > 0 and not errors, (result, errors)
    stars = page.evaluate("""async () => Promise.all([
      './css/lany-candy-stars-v78.css',
      './assets/v78/stars/earned.webp',
      './assets/v78/stars/unearned.webp'
    ].map(async path => ({path,ok:(await fetch(path)).ok})))""")
    assert all(item['ok'] for item in stars), stars
    context.close()
    browser.close()
print('offline board resume v101: pass')
