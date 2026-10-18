"""v1.9 browser soak: real match cascades rather than only repeated initGame calls."""
import json,os
from pathlib import Path
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
out=root/'docs'/'longplay-v19';out.mkdir(parents=True,exist_ok=True)
base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
report=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for name,w,h,mobile in [('phone',390,844,True),('small',320,568,True),('desktop',1366,768,False)]:
  ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile,service_workers='block')
  page=ctx.new_page();errors=[];missing=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
  page.set_default_timeout(120000)
  page.goto(base+'?v=2.3.6',wait_until='load',timeout=30000)
  page.wait_for_function("typeof LanyShell==='object' && typeof LanyTitleParticles==='object'")
  assert page.evaluate('LanyTitleParticles.isRunning()'),(name,'title particles should run')
  page.locator('#lany-start-button').click()
  page.locator('#lany-map-continue').click()
  page.locator('#lany-prep-play').click()
  assert not page.evaluate('LanyTitleParticles.isRunning()'),(name,'gameplay particles should be stopped')
  frame0=page.evaluate('LanyTitleParticles.frames()')
  page.wait_for_timeout(130)
  assert page.evaluate('LanyTitleParticles.frames()')==frame0,(name,'rAF kept running in gameplay')
  # This executes actual gameplay swap, match, gravity and score, not just initGame.
  result=page.evaluate("""async () => {
    LanyTempo.setEnabled(false);
    window.__originCell=document.querySelector('#board .cell');
    let totalMoves=0,finished=0,scoreGained=0;
    const rounds=9, movesPerRound=2;
    for(let round=0;round<rounds;round++){
      initGame(1);
      for(let turn=0;turn<movesPerRound;turn++){
        let move=null;
        for(let r=0;r<ROWS&&!move;r++)for(let c=0;c<COLS&&!move;c++){
          for(const [dr,dc] of [[0,1],[1,0]]){
            const rr=r+dr,cc=c+dc;
            if(rr>=ROWS||cc>=COLS||state.locked[r*COLS+c]||state.locked[rr*COLS+cc])continue;
            doSwap(r,c,rr,cc);
            const valid=findMatches().length>0;
            doSwap(r,c,rr,cc);
            if(valid){move=[r,c,rr,cc];break}
          }
        }
        if(!move)break;
        const before=state.score;
        await trySwap(...move);
        totalMoves++;
        scoreGained+=Math.max(0,state.score-before);
        if(document.getElementById('overlay-win').style.display==='flex'
           ||document.getElementById('overlay-lose').style.display==='flex'){finished++;break}
      }
    }
    await new Promise(resolve=>setTimeout(resolve,1150)); // transient effect cleanup
    return {
      rounds,totalMoves,finished,scoreGained,cellCreates:LanyPerf.cellCreates,
      boardRenders:LanyPerf.boardRenders,
      domCells:document.querySelectorAll('#board .cell').length,
      domImages:document.querySelectorAll('#board .lany-animal-face').length,
      cellUnchanged:window.__originCell===document.querySelector('#board .cell'),
      vfx:document.querySelector('.lany-vfx-layer')?.children.length||0,
      floats:document.querySelectorAll('.score-float,.combo-display').length,
      stageStarts:LanyPerf.stageStarts
    };
  }""")
  assert result['totalMoves']>=9,(name,'too few real successful swaps',result)
  assert result['scoreGained']>0,(name,'match score did not increase',result)
  assert result['cellCreates']==64 and result['domCells']==64,(name,'DOM grew',result)
  assert result['cellUnchanged'],(name,'cell node identity changed',result)
  assert result['domImages']==64,(name,'image count',result)
  assert result['vfx']==0 and result['floats']==0,(name,'effects leaked',result)
  # Catch leftover expressive sprite after renderBoard refreshed the board.
  page.evaluate("""() => {const t=document.querySelector('#board .cell');
    LanyPolish.face(t,'wink');renderBoard();
  }""")
  assert page.evaluate("""() => {
    const img=document.querySelector('#board .cell .lany-animal-face');
    return img && img.src.endsWith('/v25/animals/'+img.dataset.gem+'.webp') && !img.dataset.lanyOriginal;
  }"""),(name,'stale face sprite persists after render')
  # Open result overlays to verify both approved studio images.
  for overlay,animal in [('overlay-win','cat-cheer.webp'),('overlay-lose','chick-wink.webp')]:
   page.evaluate("""id=>{for(const x of ['overlay-win','overlay-lose'])document.getElementById(x).style.display=x===id?'flex':'none'}""",overlay)
   assert page.locator('#'+overlay).is_visible(),(name,overlay)
   bg=page.locator('#'+overlay+' .modal').evaluate("e=>getComputedStyle(e,'::after').backgroundImage")
   assert animal in bg,(name,overlay,bg)
  page.screenshot(path=str(out/(name+'-results.png')))
  page.evaluate("""() => {document.getElementById('overlay-win').style.display='none';
    document.getElementById('overlay-lose').style.display='none'}""")
  assert not errors,(name,errors);assert not missing,(name,missing)
  report.append(dict(device=name,viewport=f'{w}x{h}',realMatchMoves=result['totalMoves'],
    scoreGained=result['scoreGained'],domCells=result['domCells'],cellCreates=result['cellCreates'],
    effectNodes=result['vfx']+result['floats'],titleFramesStopped=True))
  ctx.close()
 # Separate opt-in query tests protect normal users from diagnostics overhead.
 ctx=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='block')
 page=ctx.new_page();page.goto(base+'?v=2.3.6',wait_until='load')
 assert page.evaluate('typeof LanyPerfDiagnostics')=='undefined','diagnostics should stay absent without perf=1'
 page.goto(base+'?v=2.3.6&perf=1',wait_until='load')
 page.wait_for_function('typeof LanyPerfDiagnostics==="object"')
 assert page.locator('#lany-perf-hud').is_visible()
 page.wait_for_timeout(2250)
 result=page.evaluate('LanyPerfDiagnostics.last')
 assert result['fps']>=1 and result['boardCells']==0,result
 page.locator('#lany-perf-hud button').click()
 assert page.locator('#lany-perf-hud').count()==0
 assert not page.evaluate('LanyPerfDiagnostics.active()')
 ctx.close();browser.close()
print(json.dumps(report,ensure_ascii=False,indent=2))
