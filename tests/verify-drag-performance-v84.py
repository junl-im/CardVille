"""Mobile drags reuse known cells, clean up on cancel, and still swap."""
import os
from playwright.sync_api import sync_playwright

base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
    page=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block')
    errors=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.goto(base+'?v=2.3.31',wait_until='load')
    page.locator('#lany-start-button').click()
    page.locator('#lany-map-continue').click()
    page.locator('#lany-prep-play').click()
    page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
    page.evaluate('LanyTempo.setEnabled(false)')
    page.context.new_cdp_session(page).send('Emulation.setCPUThrottlingRate',{'rate':4})
    measured=page.evaluate("""() => {
      const board=document.getElementById('board'),cell=board.children[0],rect=cell.getBoundingClientRect();
      const x=rect.left+rect.width/2,y=rect.top+rect.height/2;
      const oldQuery=board.querySelector.bind(board),oldAll=board.querySelectorAll.bind(board);
      let queries=0,queryAll=0;
      board.querySelector=(...args)=>{queries++;return oldQuery(...args)};
      board.querySelectorAll=(...args)=>{queryAll++;return oldAll(...args)};
      const event=(type,px,py)=>new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:84,pointerType:'touch',button:0,buttons:1,clientX:px,clientY:py});
      cell.dispatchEvent(event('pointerdown',x,y));
      const start=performance.now();
      for(let i=0;i<800;i++)board.dispatchEvent(event('pointermove',x+(i%2?30:35),y));
      const elapsed=Math.round(performance.now()-start);
      board.dispatchEvent(event('pointercancel',x+30,y));
      board.querySelector=oldQuery;board.querySelectorAll=oldAll;
      return {elapsed,queries,queryAll,remaining:board.querySelectorAll('.cv-dragging,.cv-drag-target').length};
    }""")
    assert measured['queries']==0 and measured['queryAll']==0,measured
    assert measured['remaining']==0 and measured['elapsed']<500,measured
    move=page.evaluate("""() => {
      for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)for(const [dr,dc] of [[0,1],[1,0]]){
        if(r+dr>=ROWS||c+dc>=COLS)continue;
        doSwap(r,c,r+dr,c+dc);
        const valid=swapMakesMatch(findMatches(),r,c,r+dr,c+dc);
        doSwap(r,c,r+dr,c+dc);
        if(valid)return [r,c,r+dr,c+dc];
      }
    }""")
    assert move, 'board has no legal move'
    origin=page.locator(f'#board .cell[data-r="{move[0]}"][data-c="{move[1]}"]').bounding_box()
    target=page.locator(f'#board .cell[data-r="{move[2]}"][data-c="{move[3]}"]').bounding_box()
    page.mouse.move(origin['x']+origin['width']/2,origin['y']+origin['height']/2)
    page.mouse.down()
    page.mouse.move(target['x']+target['width']/2,target['y']+target['height']/2,steps=5)
    page.mouse.up()
    page.wait_for_function('!state.animating && state.score>0',timeout=15000)
    assert page.evaluate("document.querySelectorAll('.cv-dragging,.cv-drag-target').length")==0
    assert not errors,errors
    print('PASS drag input and 800 moves:',measured)
    browser.close()
