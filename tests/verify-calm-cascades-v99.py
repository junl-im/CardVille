"""Match feedback stays visible without stacking bright cascade and special layers."""
import os
from playwright.sync_api import sync_playwright

base = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path'] = os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser = pw.chromium.launch(**launch)
    page = browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True,
                            has_touch=True, service_workers='block')
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(base + '?v=2.3.55', wait_until='load')
    page.evaluate('LanyShell.start();LanyShell.openPrep(1);LanyShell.playPrepared()')
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    result = page.evaluate("""() => {
      const count=selector=>document.querySelectorAll(selector).length;
      LanyPolish.onMatch([0,1,2],1);
      const first={rings:count('.lany-match-ring'),sprays:count('.lany-match-spray'),badges:count('.lany-vfx-pop')};
      LanyPolish.onMatch([8,9,10],2);
      const second={rings:count('.lany-match-ring'),sprays:count('.lany-match-spray'),badges:count('.lany-vfx-pop')};
      const boardKinds=Array.from(document.querySelectorAll('#board .cell'),el=>Number([...el.classList].find(x=>x.startsWith('gem-'))?.slice(4)||0));
      LanyPolish.onSpecial([{index:9,special:2}],Array.from({length:8},(_,i)=>8+i),[],boardKinds,360);
      const row=count('.lany-special-cell-wave');
      LanyPolish.onSpecial([{index:17,special:3}],Array.from({length:8},(_,i)=>i*8+1),[],boardKinds,360);
      const column=count('.lany-special-cell-wave');
      return {first,second,row,column,indices:[...document.querySelectorAll('.lany-special-cell-wave')].map(el=>Number(el.dataset.index))};
    }""")
    assert result['first'] == {'rings': 1, 'sprays': 1, 'badges': 1}, result
    assert result['second'] == result['first'], result
    assert result['row'] == 8 and result['column'] == 8, result
    assert result['indices'] == [i * 8 + 1 for i in range(8)], result
    assert not errors, errors
    browser.close()
print('calm cascades v99: pass')
