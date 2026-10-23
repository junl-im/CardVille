"""Every campaign starts playable; an unrelated match cannot validate a swap."""
import os
from playwright.sync_api import sync_playwright

base = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, args=['--no-sandbox'])
    page = browser.new_page(service_workers='block')
    page.goto(base + '?v=2.3.55', wait_until='load')
    page.wait_for_function("typeof initLevel==='function'")
    result = page.evaluate("""() => {
      const failures=[];
      for(const mode of ['normal','hard','crazy']){
        setCampaignMode(mode);
        for(let stage=1;stage<=250;stage++)for(let sample=0;sample<2;sample++){
          initLevel(stage);
          const lv=activeLevels()[stage-1];
          const matches=findMatches().length, legal=hasLegalSwap();
          const walls=state.walls.filter(Boolean).length, locks=state.locked.filter(Boolean).length;
          if(matches||!legal||walls!==(lv.wallCount||0)||locks!==lv.lockedCount)
            failures.push({mode,stage,sample,matches,legal,walls,locks});
        }
      }
      clearInterval(state.morphTimer);
      setCampaignMode('normal');initLevel(1);
      // Create a pre-existing match at the top and find a swap elsewhere
      // whose only result is that same unrelated match.
      state.board[0]=state.board[1]=state.board[2]=GEMS[0];
      let unrelated=null;
      for(let r=4;r<ROWS&&!unrelated;r++)for(let c=0;c<COLS-1&&!unrelated;c++){
        doSwap(r,c,r,c+1);
        const matches=findMatches();
        if(matches.length&&!swapMakesMatch(matches,r,c,r,c+1))unrelated=[r,c,r,c+1];
        doSwap(r,c,r,c+1);
      }
      const isRejected=unrelated&&(() => {
        doSwap(...unrelated);
        const accepted=swapMakesMatch(findMatches(),...unrelated);
        doSwap(...unrelated);
        return !accepted;
      })();
      return {cases:1500,failures:failures.slice(0,5),failureCount:failures.length,unrelated,isRejected};
    }""")
    assert result['failureCount'] == 0, result
    assert result['unrelated'] and result['isRejected'], result
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-continue').click()
    page.locator('#lany-prep-play').click()
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    move_result = page.evaluate("""async () => {
      LanyTempo.setEnabled(false);
      initGame(1);
      state.board[0]=state.board[1]=state.board[2]=GEMS[0];
      let move=null;
      for(let r=4;r<ROWS&&!move;r++)for(let c=0;c<COLS-1&&!move;c++){
        doSwap(r,c,r,c+1);
        if(findMatches().length&&!swapMakesMatch(findMatches(),r,c,r,c+1))move=[r,c,r,c+1];
        doSwap(r,c,r,c+1);
      }
      if(!move)return {error:'no unrelated swap found'};
      const before=state.movesLeft;
      await trySwap(...move);
      return {before,after:state.movesLeft,animating:state.animating};
    }""")
    assert move_result['before'] == move_result['after'] and not move_result['animating'], move_result
    print('PASS 1,500 start boards and unrelated-match swap rejection')
    browser.close()
