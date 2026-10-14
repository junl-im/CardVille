"""Playwright 1.8 long-session stability: 40 consecutive games, WebP media and cat contrast."""
from pathlib import Path
import json,os
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
out=root/'docs'/'v18-perf'
out.mkdir(parents=True,exist_ok=True)
base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
results=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for name,w,h,mobile in [('phone',390,844,True),('small',320,568,True),('desktop',1366,768,False)]:
  ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile,service_workers='block')
  p=ctx.new_page();errors=[];missing=[]
  p.on('pageerror',lambda e:errors.append(str(e)))
  p.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
  p.goto(base+'?v=2.1.0',wait_until='load',timeout=30000)
  p.wait_for_function('typeof LanyShell==="object"&&typeof LanyPerf==="object"')
  assert p.locator('.lany-cover').evaluate('(e)=>e.complete&&e.naturalWidth>0'),name
  assert p.locator('.lany-cover').evaluate('(e)=>getComputedStyle(e).visibility')=='visible',name
  for selector in ['.lany-illustrated-logo img','.lany-art-play img','.lany-art-install img','.lany-art-help img','.lany-art-friends img']:
   assert p.locator(selector).evaluate('(e)=>e.complete&&e.naturalWidth>0'),(name,selector)
   assert '.webp' in p.locator(selector).get_attribute('src'),name
  p.screenshot(path=str(out/(name+'-title.png')))
  p.locator('#lany-start-button').click()
  p.locator('#lany-map-continue').click()
  p.locator('#lany-prep-play').click()
  assert p.locator('#board .cell').count()==64,name
  before=p.evaluate('LanyPerf.cellCreates')
  assert before==64,(name,before)
  result=p.evaluate("""() => {
    const original=Element.prototype.addEventListener;
    let added=0;
    Element.prototype.addEventListener=function(type,...args){
      if(this.classList?.contains('cell'))added++;
      return original.call(this,type,...args);
    };
    const elapsed=[],begin=performance.now();
    for(let n=0;n<40;n++){
      const t=performance.now();
      initGame(1);
      elapsed.push(performance.now()-t);
    }
    Element.prototype.addEventListener=original;
    return {elapsed,wall:performance.now()-begin,added,
      stages:LanyPerf.stageStarts,cells:LanyPerf.cellCreates,boardRenders:LanyPerf.boardRenders,
      rendered:document.querySelectorAll('#board .cell').length,
      images:document.querySelectorAll('#board .lany-animal-face').length};
  }""")
  assert result['cells']==64,(name,result)
  assert result['added']==0,(name,result)
  assert result['rendered']==64,(name,result)
  assert result['images']==64,(name,result)
  assert result['stages']>=41,(name,result)
  # 40 boards should finish promptly, but avoid fragile comparisons to runner CPU.
  assert result['wall']<12000,(name,'per-run responsiveness',result['wall'])
  p.evaluate("""() => {const x=state.playEpoch;void trySwap(0,0,0,1);initGame(1);window.__expectedEpoch=state.playEpoch;}""")
  p.wait_for_timeout(650)
  assert p.evaluate('state.score')==0,(name,'old async chain mutated next run')
  assert p.evaluate('state.playEpoch===window.__expectedEpoch'),name
  assert p.locator('#board .cell').count()==64,name
  p.screenshot(path=str(out/(name+'-game.png')))
  assert not errors,(name,errors)
  assert not missing,(name,missing)
  results.append({'device':name,'resets':40,'DOMCells':result['cells'],'newClickListeners':result['added'],
     'msFor40':round(result['wall'],1),'staleLevelMutation':False,'artWebp':True,'jsErrors':0})
  ctx.close()
 browser.close()
print(json.dumps(results,ensure_ascii=False,indent=2))
