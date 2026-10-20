"""Hints must point to a swap the engine will accept in every campaign."""
import os
from playwright.sync_api import sync_playwright

base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
    page=browser.new_page(service_workers='block')
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(base+'?v=2.3.46',wait_until='load')
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-continue').click()
    page.locator('#lany-prep-play').click()
    page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
    result=page.evaluate("""() => {
      const failures=[];
      const check=(mode,stage)=>{
        clearHint();showHint();
        const from=state.hintCell,to=state.hintTarget;
        if(!from||!to){failures.push({mode,stage,reason:'missing hint'});return;}
        const [r,c]=from,[nr,nc]=to;
        doSwap(r,c,nr,nc);
        const valid=swapMakesMatch(findMatches(),r,c,nr,nc)||
          Boolean(state.specials[r*COLS+c]&&state.specials[nr*COLS+nc]);
        doSwap(r,c,nr,nc);
        if(!valid)failures.push({mode,stage,from,to,reason:'rejected swap'});
      };
      for(const mode of ['normal','hard','crazy']){
        setCampaignMode(mode);
        for(let stage=1;stage<=250;stage++){
          initLevel(stage);
          clearInterval(state.morphTimer);state.morphTimer=null;
          check(mode,stage);
        }
      }
      setCampaignMode('normal');initLevel(1);
      state.board[0]=state.board[1]=state.board[2]=GEMS[0];
      check('existing-match',1);
      clearInterval(state.morphTimer);clearHint();
      return {cases:751,failures:failures.slice(0,10),failureCount:failures.length};
    }""")
    assert result['failureCount']==0,result
    assert not errors,errors
    print('PASS 751 valid hints across campaigns and existing-match case')
    browser.close()
