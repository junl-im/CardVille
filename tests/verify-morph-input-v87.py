"""A timed hard-mode morph cannot change a tile while it is being dragged."""
import os
from playwright.sync_api import sync_playwright

BASE = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')

with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, args=['--no-sandbox'])
    for width, height in [(390, 844), (1366, 768)]:
        page = browser.new_page(viewport={'width': width, 'height': height}, service_workers='block')
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(BASE + '?v=2.3.49', wait_until='load')
        page.locator('#lany-start-button').click()
        page.locator('#lany-map-continue').click()
        page.locator('#lany-prep-play').click()
        page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
        result = page.evaluate('''async () => {
          LanyTempo.setEnabled(false);
          const rounds=[];
          for(const mode of ['hard','crazy']){
            setCampaignMode(mode);initGame(1);
            const level=activeLevels()[0],originalGoal=level.goal;
            level.goal=1e9;state.movesLeft=100;
            const cell=[...document.querySelectorAll('#board .cell')].find(el=>{
              const i=Number(el.dataset.r)*COLS+Number(el.dataset.c);
              return !state.walls[i]&&!state.locked[i];
            });
            const down=new PointerEvent('pointerdown',{bubbles:true,pointerId:441,pointerType:'touch',button:0,clientX:80,clientY:250});
            cell.dispatchEvent(down);
            const dragged=cell.classList.contains('cv-dragging');
            const before=state.board.join(',');
            for(let i=0;i<20;i++)morphHardAnimals();
            const stable=state.board.join(',')===before;
            document.getElementById('board').dispatchEvent(new PointerEvent('pointercancel',{bubbles:true,pointerId:441,pointerType:'touch'}));
            const released=!cell.classList.contains('cv-dragging');
            state.selected=[Number(cell.dataset.r),Number(cell.dataset.c)];
            for(let i=0;i<20;i++)morphHardAnimals();
            const keyboardStable=state.board.join(',')===before;
            state.selected=null;
            const moves=[];
            for(let turn=0;turn<12;turn++){
              let move=null;
              for(let r=0;r<ROWS&&!move;r++)for(let c=0;c<COLS&&!move;c++)for(const [dr,dc] of [[0,1],[1,0]]){
                const nr=r+dr,nc=c+dc;
                if(nr>=ROWS||nc>=COLS||state.walls[r*COLS+c]||state.walls[nr*COLS+nc]||state.locked[r*COLS+c]||state.locked[nr*COLS+nc])continue;
                doSwap(r,c,nr,nc);const valid=swapMakesMatch(findMatches(),r,c,nr,nc);doSwap(r,c,nr,nc);
                if(valid){move=[r,c,nr,nc];break}
              }
              if(!move){shuffleBoard();continue}
              await trySwap(...move);
              moves.push({animating:state.animating,ready:gameInputReady()});
              if(state.ended){initGame(1);state.movesLeft=100}
            }
            rounds.push({mode,dragged,stable,released,keyboardStable,moves});
            level.goal=originalGoal;
          }
          return {rounds,cells:document.querySelectorAll('#board .cell').length};
        }''')
        assert result['cells'] == 64, (width, result)
        for round_ in result['rounds']:
            assert all(round_[k] for k in ['dragged', 'stable', 'released', 'keyboardStable']), (width, round_)
            assert len(round_['moves']) >= 8 and all(not m['animating'] and m['ready'] for m in round_['moves']), (width, round_)
        assert not errors, (width, errors)
        page.close()
    browser.close()
print('morph input and long-play stability checks passed')
