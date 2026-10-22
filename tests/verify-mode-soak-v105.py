"""Each campaign can play real turns and resume its saved board after reload."""
import os
from playwright.sync_api import sync_playwright

base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch={'headless':True,'args':['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path']=os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser=pw.chromium.launch(**launch)
    for mode in ('normal','hard','crazy'):
        context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block')
        page=context.new_page()
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto(base+'?v=2.3.53',wait_until='load')
        page.evaluate(f"LanyShell.start();LanyShell.setMode('{mode}');state.unlockedLevels.push(25);localStorage.setItem(campaignKey('unlocked'),JSON.stringify(state.unlockedLevels));LanyShell.openPrep(25);LanyShell.playPrepared()")
        page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
        result=page.evaluate("""async () => {
          LanyTempo.setEnabled(false);
          let played=0;
          for(let turn=0;turn<2;turn++){
            let move=null;
            for(let r=0;r<ROWS&&!move;r++)for(let c=0;c<COLS&&!move;c++){
              for(const [dr,dc] of [[0,1],[1,0]]){
                const rr=r+dr,cc=c+dc;
                if(rr>=ROWS||cc>=COLS||state.walls[r*COLS+c]||state.walls[rr*COLS+cc]
                  ||state.locked[r*COLS+c]||state.locked[rr*COLS+cc])continue;
                doSwap(r,c,rr,cc);
                const valid=swapMakesMatch(findMatches(),r,c,rr,cc)||Boolean(buildSpecialSwapCells(r*COLS+c,rr*COLS+cc));
                doSwap(r,c,rr,cc);
                if(valid){move=[r,c,rr,cc];break}
              }
            }
            if(!move)throw Error('No legal turn');
            await trySwap(...move);played++;
            if(state.ended)break;
          }
          LanySession.save();
          return {played,animating:state.animating,score:state.score,moves:state.movesLeft,board:state.board.slice()};
        }""")
        assert result['played']>=1 and not result['animating'] and result['score']>0,(mode,result)
        page.reload(wait_until='load')
        page.evaluate('LanyShell.start()')
        assert page.locator('#lany-map-resume').is_visible(),(mode,'resume unavailable')
        page.locator('#lany-map-resume').click()
        page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
        restored=page.evaluate('''() => ({mode:state.mode,score:state.score,moves:state.movesLeft,
          board:state.board.slice(),animating:state.animating,input:gameInputReady()})''')
        assert restored['mode']==mode and restored['board']==result['board'],(mode,'board changed on resume')
        assert restored['score']==result['score'] and restored['moves']==result['moves'],(mode,'score or moves changed')
        assert restored['input'] and not restored['animating'],(mode,'input locked after resume')
        assert not errors,(mode,errors)
        context.close()
    browser.close()
print('three-mode real-turn resume soak v105: pass')
