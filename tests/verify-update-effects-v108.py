"""Update saves reliably and board-wide effects stay bounded on mobile."""
import os
from playwright.sync_api import sync_playwright

base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block')
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(base+'?v=2.3.55',wait_until='load')
    page.evaluate("LanyShell.start();LanyShell.openPrep(1);LanyShell.playPrepared()")
    page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
    result=page.evaluate('''() => {
      const saved=LanySession.save();
      const original=Storage.prototype.setItem;
      Storage.prototype.setItem=function(){throw Error('quota')};
      let blocked;
      try{blocked=LanySession.save()}finally{Storage.prototype.setItem=original}
      LanyPolish.onSpecial([{index:27,special:5}],Array.from({length:64},(_,i)=>i),[],Array(64).fill('rabbit'),700);
      LanyPolish.onMatch(new Set([9,10,11]),2);
      return {saved,blocked,previews:document.querySelectorAll('.lany-special-cell-preview').length,
        waves:document.querySelectorAll('.lany-special-cell-wave').length,
        origins:document.querySelectorAll('.lany-special-origin').length,
        chain:document.querySelectorAll('.lany-chain-ring').length};
    }''')
    assert result['saved'] is True and result['blocked'] is False,result
    assert result['previews']==64 and 1<=result['waves']<=32,result
    assert result['origins']==1 and result['chain']==1,result
    page.wait_for_timeout(1100)
    assert page.locator('.lany-special-cell-preview,.lany-special-cell-wave,.lany-special-origin,.lany-chain-ring').count()==0
    assert not errors,errors
    browser.close()
print('v108 update save and bounded effects: pass')
