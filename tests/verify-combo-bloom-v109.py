"""Rare cascades get one brief flourish; accessibility and cleanup stay bounded."""
from playwright.sync_api import sync_playwright

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width': 390, 'height': 844}, service_workers='block')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto('http://127.0.0.1:8765/?v=2.3.55', wait_until='load')
    page.evaluate('LanyShell.start();LanyShell.openPrep(1);LanyShell.playPrepared()')
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    counts = page.evaluate('''() => {
      LanyPolish.onMatch(new Set([9,10,11]),1);
      const basic=document.querySelectorAll('.lany-combo-bloom').length;
      return basic;
    }''')
    page.wait_for_timeout(220)
    counts = page.evaluate('''() => {
      const basic=0;
      LanyPolish.onMatch(new Set([9,10,11]),3);
      const combo=document.querySelectorAll('.lany-combo-bloom').length;
      return {basic,combo};
    }''')
    page.wait_for_timeout(220)
    high_counts = page.evaluate('''() => {
      LanyPolish.onMatch(new Set([9,10,11]),5);
      const capped=document.querySelectorAll('.lany-combo-bloom').length;
      const high=document.querySelector('.lany-combo-bloom')?.dataset.power;
      return {capped,high};
    }''')
    assert counts == {'basic': 0, 'combo': 1}, counts
    assert high_counts == {'capped': 1, 'high': 'high'}, high_counts
    page.wait_for_timeout(800)
    assert page.locator('.lany-combo-bloom').count() == 0
    page.emulate_media(reduced_motion='reduce')
    page.evaluate('LanyPolish.onMatch(new Set([9,10,11]),5)')
    assert page.locator('.lany-combo-bloom').count() == 0
    assert not errors, errors
    browser.close()
print('v109 combo bloom cap, cleanup and reduced motion: pass')
