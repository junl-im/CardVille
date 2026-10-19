"""Slow-phone gameplay should finish cascades and release input without DOM growth."""
import os
from playwright.sync_api import sync_playwright

base = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    browser = pw.chromium.launch(headless=True, args=['--no-sandbox'])
    page = browser.new_page(viewport={'width':390,'height':844}, is_mobile=True,
                            has_touch=True, service_workers='block')
    errors=[]
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(base+'?v=2.3.33', wait_until='load', timeout=30000)
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-continue').click()
    page.locator('#lany-prep-play').click()
    page.locator('#lany-go-intro').wait_for(state='hidden', timeout=5000)
    page.context.new_cdp_session(page).send('Emulation.setCPUThrottlingRate', {'rate':4})
    result=page.evaluate("""async () => {
      LanyTempo.setEnabled(false);
      const moveMs=[],firstCell=document.querySelector('#board .cell');
      for(let seed=1;seed<=6;seed++){
        let n=seed*747796405;
        const original=Math.random;
        Math.random=()=>{n=(Math.imul(n,1664525)+1013904223)|0;return (n>>>0)/4294967296};
        initGame(1);
        let move=null;
        for(let r=0;r<ROWS&&!move;r++)for(let c=0;c<COLS&&!move;c++)for(const [dr,dc] of [[0,1],[1,0]]){
          if(r+dr>=ROWS||c+dc>=COLS)continue;
          doSwap(r,c,r+dr,c+dc);
          const valid=swapMakesMatch(findMatches(),r,c,r+dr,c+dc);
          doSwap(r,c,r+dr,c+dc);
          if(valid){move=[r,c,r+dr,c+dc];break}
        }
        if(!move)throw new Error('No legal move for seed '+seed);
        const t=performance.now();
        try{await trySwap(...move)}finally{Math.random=original}
        moveMs.push(Math.round(performance.now()-t));
        if(state.animating)throw new Error('Input stayed locked after seed '+seed);
      }
      await new Promise(resolve=>setTimeout(resolve,1100));
      return {moveMs,total:moveMs.reduce((a,b)=>a+b,0),
        cells:document.querySelectorAll('#board .cell').length,
        images:document.querySelectorAll('#board .lany-animal-face').length,
        cellReused:firstCell===document.querySelector('#board .cell'),
        effects:document.querySelector('.lany-vfx-layer')?.children.length||0,
        lingering:document.querySelectorAll('.score-float,.combo-display,.lany-fall-in,.lany-match-pop').length};
    }""")
    assert len(result['moveMs'])==6 and max(result['moveMs'])<12000, result
    assert result['total']<20000, result
    assert result['cells']==64 and result['images']==64 and result['cellReused'], result
    assert result['effects']==0 and result['lingering']==0, result
    assert not errors, errors
    print('PASS slow-phone cascades:', result)
    browser.close()
