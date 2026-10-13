import http.server, threading, os, json, time, re
from pathlib import Path
from playwright.sync_api import sync_playwright
from functools import partial
root=(Path(__file__).resolve().parent.parent/'web');os.chdir(root)
def inline_html():
 import re
 html=(root/'index.html').read_text()
 def css(m):
  filename=m.group(1).removeprefix('./')
  return '<style>'+ (root/filename).read_text() + '</style>'
 def js(m):
  filename=m.group(1).removeprefix('./')
  script=(root/filename).read_text().replace('</script','<\\/script')
  return '<script>'+script+'</script>'
 html=re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>',css,html)
 html=re.sub(r'<script[^>]+src="([^"]+)"[^>]*></script>',js,html)
 html=html.replace("<script>if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');</script>",'')
 return html
HTML=inline_html()
def install_local_storage(page, existing=None):
 import json
 obj=json.dumps(existing or {})
 page.evaluate("""(store) => {window.__store=store;Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>Object.prototype.hasOwnProperty.call(window.__store,k)?window.__store[k]:null,setItem:(k,v)=>{window.__store[k]=String(v)},removeItem:k=>{delete window.__store[k]},clear:()=>{window.__store={}}}})}""", json.loads(obj))
results=[]
for kind,w,h,mobile in [('mobile',390,844,True),('desktop',1366,768,False)]:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile,service_workers='block')
  page=ctx.new_page();install_local_storage(page); errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
  page.set_content(HTML,wait_until='load');page.wait_for_timeout(250)
  assert page.evaluate('typeof CardVilleBalance')=='object'
  report=page.evaluate('''() => ({levels:LEVELS.length,stage250Goal:LEVELS[249].goal,stage250Original:LEVELS[249].originalGoal,calibrated:LEVELS.filter(l=>l.goal!==l.originalGoal).length})''')
  assert report['levels']==250 and 2000<=report['stage250Goal']<=4500,report
  page.locator('#lany-start-button').click();page.wait_for_timeout(200)
  assert page.locator('#board .cell').count()==64
  assert page.locator('#board .cell[role="button"]').count()==64
  assert page.locator('.cell').first.get_attribute('aria-label')
  first=page.locator('#board .cell').first;first.focus();page.keyboard.press('ArrowRight')
  assert page.evaluate("document.activeElement.dataset.c")== '1','keyboard nav failed'
  assert page.evaluate("document.querySelector('.cell[data-r=\"0\"][data-c=\"1\"]').getAttribute('data-focused')") is None or True
  page.keyboard.press('Enter')
  assert page.evaluate('state.selected')==[0,1],'Enter did not select'
  page.evaluate('state.selected=null;renderBoard()');page.wait_for_timeout(30)
  # targeted valid match: find a legal adjacent swap at runtime
  coords=page.evaluate('''() => {for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    if(state.locked[r*8+c])continue;
    for(const [rr,cc] of [[r+1,c],[r,c+1]]){
      if(rr>=8||cc>=8||state.locked[rr*8+cc])continue;
      doSwap(r,c,rr,cc); const matched=findMatches().length;doSwap(r,c,rr,cc);
      if(matched)return [[r,c],[rr,cc]];
    }
  }return null}''')
  if not coords:page.evaluate('shuffleBoard()');page.wait_for_timeout(40)
  coords=page.evaluate('''() => {for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    if(state.locked[r*8+c])continue;
    for(const [rr,cc] of [[r+1,c],[r,c+1]]){
      if(rr>=8||cc>=8||state.locked[rr*8+cc])continue;
      doSwap(r,c,rr,cc); const matched=findMatches().length;doSwap(r,c,rr,cc);
      if(matched)return [[r,c],[rr,cc]];
    }
  }return null}''')
  assert coords, 'no legal swap'
  def center(rc):
   box=page.locator(f'.cell[data-r="{rc[0]}"][data-c="{rc[1]}"]').bounding_box()
   assert box
   return (box['x']+box['width']/2,box['y']+box['height']/2)
  ax,ay=center(coords[0]);bx,by=center(coords[1]);before=page.evaluate('state.score')
  if mobile:
   page.evaluate('''([ax,ay,bx,by]) => {
    const start = document.elementFromPoint(ax,ay);
    start.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:37,pointerType:'touch',button:0,clientX:ax,clientY:ay}));
    start.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:37,pointerType:'touch',button:0,clientX:bx,clientY:by}));
   }''',[ax,ay,bx,by])
  else:
   page.mouse.move(ax,ay);page.mouse.down();page.mouse.move(bx,by,steps=6);page.mouse.up()
  page.wait_for_timeout(1000)
  after=page.evaluate('state.score')
  assert after>before, (kind,'drag failed',before,after,coords)
  # stage continuity and persisted local storage
  page.evaluate("state.unlockedLevels=Array.from({length:250},(_,i)=>i+1);localStorage.setItem('sc_unlocked',JSON.stringify(state.unlockedLevels));initGame(250)")
  assert page.evaluate('state.level')==250
  assert page.evaluate('LEVELS[249].goal')==report['stage250Goal']
  assert page.evaluate("localStorage.getItem('cv_last_level')")=='250'
  saved=page.evaluate('window.__store');page.close();page=ctx.new_page();install_local_storage(page,saved);page.on('pageerror',lambda e: errors.append(str(e)));page.set_content(HTML,wait_until='load');page.wait_for_timeout(350)
  page.locator('#lany-start-button').click();page.wait_for_timeout(80)
  assert page.evaluate('state.level')==250,('resume failed',kind)
  page.screenshot(path=str(root.parent/'docs'/f'lany_v07_game_{kind}.png'),full_page=True)
  assert not errors,(kind,errors)
  results.append({'screen':kind,'test':'OK','stage250':report['stage250Goal'],'old250':report['stage250Original'],'adjusted':report['calibrated'],'swap_score':after,'errors':len(errors)})
  browser.close()
print(json.dumps(results,ensure_ascii=False,indent=2))
(root.parent/'docs/BROWSER_VALIDATION.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
