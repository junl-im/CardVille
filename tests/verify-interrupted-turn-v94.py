"""Interrupted effects restore the last settled board; deferred wins resolve on resume."""
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
    page.goto(base + '?v=2.3.47', wait_until='load')
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-continue').click()
    page.locator('#lany-prep-play').click()
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    settled = page.evaluate('LanySession.read()')
    interrupted = page.evaluate('''() => {
      window.sleep=()=>new Promise(()=>{}); // Hold the turn before its first resolution.
      for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
        const a=r*COLS+c;if(state.walls[a]||state.locked[a])continue;
        for(const [nr,nc] of [[r,c+1],[r+1,c]]){
          if(nr>=ROWS||nc>=COLS)continue;
          const b=nr*COLS+nc;if(state.walls[b]||state.locked[b])continue;
          doSwap(r,c,nr,nc);
          const valid=swapMakesMatch(findMatches(),r,c,nr,nc)||Boolean(state.specials[a]&&state.specials[b]);
          doSwap(r,c,nr,nc);
          if(valid){void trySwap(r,c,nr,nc);return state.animating;}
        }
      }
      return false;
    }''')
    assert interrupted, 'could not start an in-flight swap'
    assert page.evaluate('LanySession.read().board') == settled['board'], 'half-resolved board was saved'
    page.reload(wait_until='load')
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-resume').click()
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    assert page.evaluate('state.board') == settled['board'], 'last settled board was not restored'
    assert page.evaluate('!state.animating && gameInputReady()'), 'restored board cannot be played'

    settled = page.evaluate('LanySession.read()')
    booster_busy = page.evaluate('''() => {
      window.sleep=()=>new Promise(()=>{});
      activateBooster('hammer');applyBooster(0,0);
      return state.animating;
    }''')
    assert booster_busy, 'could not start an in-flight booster effect'
    assert page.evaluate('LanySession.read().board') == settled['board'], 'half-resolved booster board was saved'
    page.reload(wait_until='load')
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-resume').click()
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    assert page.evaluate('state.board') == settled['board'], 'last settled board was lost after booster interruption'
    assert page.evaluate('state.boosters.hammer') == settled['boosters']['hammer'], 'unfinished booster was consumed'

    # A turn that finished while the map was open can have a deferred win check.
    page.evaluate('''() => {
      state.score=activeLevels()[state.level-1].goal;
      LanyShell.openMap(); // A result check was deferred until returning to the game.
    }''')
    page.reload(wait_until='load')
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-resume').click()
    detail = page.evaluate('''() => ({screen:LanyShell.getCurrentScreen(),score:state.score,
      goal:activeLevels()[state.level-1].goal,ended:state.ended,
      overlay:document.getElementById('overlay-win').style.display})''')
    assert page.locator('#overlay-win').is_visible(), f'deferred win was not shown on resume: {detail}'
    assert page.locator('#lany-go-intro').is_hidden(), 'GO countdown covered the result'
    assert page.evaluate('LanySession.read()') is None, 'completed board remained resumable'
    context.close()
    browser.close()
print('interrupted turn and deferred result recovery: pass')
