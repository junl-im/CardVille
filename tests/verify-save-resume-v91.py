"""Completed campaign progress resumes at the next unplayed stage after reload."""
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
    page.evaluate('LanyTempo.setEnabled(false);state.score=activeLevels()[0].goal;checkEnd()')
    assert page.locator('#overlay-win').is_visible()
    assert page.evaluate('state.unlockedLevels.includes(2) && state.levelStars[1]>0 && state.bestScores[1]>0')
    page.reload(wait_until='load')
    page.locator('#lany-start-button').click()
    assert '2단계' in page.locator('#lany-map-continue').inner_text(), 'normal should resume at next stage'
    page.locator('#lany-map-continue').click()
    assert '2단계' in page.locator('#lany-prep-heading').inner_text()
    page.evaluate('LanyShell.openMap()')
    page.locator('#lany-mode-hard').click()
    assert '1단계' in page.locator('#lany-map-continue').inner_text(), 'hard progress must be separate'
    page.locator('#lany-map-continue').click()
    page.locator('#lany-prep-play').click()
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    page.evaluate('LanyTempo.setEnabled(false);state.score=activeLevels()[0].goal;state.hardClears=activeLevels()[0].clearGoal;checkEnd()')
    assert page.locator('#overlay-win').is_visible()
    page.reload(wait_until='load')
    page.locator('#lany-start-button').click()
    assert page.locator('#lany-mode-hard').get_attribute('aria-pressed') == 'true'
    assert '2단계' in page.locator('#lany-map-continue').inner_text(), 'hard should resume at next stage'
    page.locator('#lany-mode-normal').click()
    assert '2단계' in page.locator('#lany-map-continue').inner_text(), 'normal progress lost after mode switch'
    context.close()
    browser.close()
print('campaign save and next-stage resume: pass')
