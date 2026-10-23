"""Keyboard navigation changes two tab stops without rebuilding 64 cell labels."""
import os
from playwright.sync_api import sync_playwright

base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':390,'height':844},service_workers='block')
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(base+'?v=2.3.54',wait_until='load')
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-continue').click()
    page.locator('#lany-prep-play').click()
    page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
    page.context.new_cdp_session(page).send('Emulation.setCPUThrottlingRate',{'rate':4})
    measured=page.evaluate("""() => {
      const board=document.getElementById('board');board.children[0].focus();
      const oldQuery=board.querySelector.bind(board),oldAll=board.querySelectorAll.bind(board);
      const oldSet=Element.prototype.setAttribute;
      let queries=0,queryAll=0,writes=0;
      board.querySelector=(...args)=>{queries++;return oldQuery(...args)};
      board.querySelectorAll=(...args)=>{queryAll++;return oldAll(...args)};
      Element.prototype.setAttribute=function(...args){if(this.classList?.contains('cell'))writes++;return oldSet.apply(this,args)};
      const start=performance.now();
      for(let i=0;i<300;i++)document.activeElement.dispatchEvent(new KeyboardEvent('keydown',
        {key:i%2?'ArrowLeft':'ArrowRight',bubbles:true,cancelable:true}));
      const elapsed=Math.round(performance.now()-start);
      A11y.decorate();
      board.querySelector=oldQuery;board.querySelectorAll=oldAll;Element.prototype.setAttribute=oldSet;
      return {elapsed,queries,queryAll,writes,focused:document.activeElement===board.children[0],
        tabStops:[...board.children].filter(cell=>cell.tabIndex===0).length};
    }""")
    assert measured['queries']==0 and measured['writes']==0,measured
    assert measured['focused'] and measured['tabStops']==1,measured
    assert measured['elapsed']<1500,measured
    label=page.evaluate("""() => {
      state.locked[0]=true;renderBoard();
      const locked=document.querySelector('#board .cell').getAttribute('aria-label');
      state.locked[0]=false;renderBoard();
      const unlocked=document.querySelector('#board .cell').getAttribute('aria-label');
      return {locked,unlocked};
    }""")
    assert '잠김' in label['locked'] and '잠김' not in label['unlocked'],label
    assert not errors,errors
    print('PASS keyboard navigation and cell labels:',measured)
    browser.close()
