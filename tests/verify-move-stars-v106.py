"""A resolved player swap costs one move; normal three stars are attainable."""
import os
from playwright.sync_api import sync_playwright

base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
    for width,height in ((320,568),(390,844)):
        context=browser.new_context(viewport={'width':width,'height':height},is_mobile=True,has_touch=True,service_workers='block')
        page=context.new_page()
        errors=[]
        page.on('pageerror',lambda error:errors.append(str(error)))
        page.goto(base+'?v=2.3.53',wait_until='load')
        page.evaluate("LanyShell.start();LanyShell.setMode('normal');LanyShell.openPrep(1);LanyShell.playPrepared()")
        page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
        result=page.evaluate('''async () => {
          LanyTempo.setEnabled(false);
          const targets=starTargets(activeLevels()[0]);
          const initial=state.movesLeft;
          let played=0;
          for(let turn=0;turn<3&&!state.ended;turn++){
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
            if(state.movesLeft!==initial-played)throw Error('Cascade spent an extra turn');
          }
          const displayed=Number(document.getElementById('lany-hud-moves').textContent);
          const beats=[];
          for(const n of [1,2,3]){showCombo(n);beats.push(document.querySelector('.combo-display').textContent)}
          const level=activeLevels()[0];
          state.score=Math.ceil(level.goal*1.4);state.movesLeft=Math.ceil(level.moves/2);
          checkEnd();
          return {played,moves:state.movesLeft,displayed,initial,targets,beats,
            stars:[...document.querySelectorAll('#win-stars .star-item')].filter(x=>x.classList.contains('earned')).length,
            result:document.getElementById('win-msg').textContent};
        }''')
        assert result['played']>=1 and result['displayed']==result['initial']-result['played'],(width,result)
        assert result['targets']==[650,813,975],(width,result)
        assert all(word in beat for word,beat in zip(('하나','둘','셋'),result['beats'])),(width,result)
        assert result['stars']==3 and '이번 별 3개' in result['result'],(width,result)
        assert not errors,(width,errors)
        context.close()
    browser.close()
print('one move per swap, cascade beats, and normal stars v106: pass')
