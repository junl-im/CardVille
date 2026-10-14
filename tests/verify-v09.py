"""Real asset URL emulation with Playwright route fulfillment, so relative cover path and JS load are tested."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, mimetypes, os
root=Path(__file__).resolve().parents[1]
www=root/'web'
results=[]
def handler(route):
  from urllib.parse import urlparse, unquote
  url=urlparse(route.request.url)
  path=unquote(url.path)
  if path=='/':path='/index.html'
  p=(www/path.lstrip('/')).resolve()
  if not p.is_relative_to(www.resolve()) or not p.is_file():
    route.fulfill(status=404,body='없는 파일');return
  mime=mimetypes.guess_type(str(p))[0] or 'application/octet-stream'
  route.fulfill(status=200,content_type=mime,body=p.read_bytes(),headers={'cache-control':'no-store','access-control-allow-origin':'*'})
for label,w,h,mobile in [('mobile',390,844,True),('desktop',1366,768,False)]:
 with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  context=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile,service_workers='block')
  page=context.new_page();page.route('**/*',handler)
  errors=[];missing=[]
  page.on('pageerror',lambda exc: errors.append(str(exc)))
  page.on('response',lambda r: missing.append((r.status,r.url)) if r.status>=400 else None)
  page.evaluate("""() => {let s={}; Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>s[k]??null,setItem:(k,v)=>s[k]=String(v),removeItem:k=>delete s[k],clear:()=>s={}}})}""")
  page.set_content((www/'index.html').read_text().replace('<head>','<head><base href="http://lanypang.local/">',1),wait_until='load',timeout=15000)
  page.wait_for_timeout(450)
  assert page.title().startswith('라니팡'),page.title()
  assert page.locator('#lany-title').is_visible()
  assert page.locator('#lany-cover-image').is_visible()
  cover=page.evaluate("() => ({loaded:document.getElementById('lany-cover-image').naturalWidth>0,src:document.getElementById('lany-cover-image').currentSrc})")
  assert cover['loaded'],cover
  page.screenshot(path=str(root/'docs'/f'v09_{label}_title.png'))
  page.locator('#lany-start-button').click()
  assert page.locator('#lany-world-map').is_visible()
  assert page.locator('#lany-map-levels .lany-level').count()==25
  assert page.locator('#lany-map-levels .lany-level:disabled').count()==24
  routecount=page.locator('canvas.lany-route').count();assert routecount==1
  route=page.locator('canvas.lany-route');assert route.evaluate('(canvas) => canvas.width > 0 && canvas.height > 0')
  page.screenshot(path=str(root/'docs'/f'v09_{label}_map.png'))
  # Make sure map works even through click, and second world is clickable (but locked)
  page.locator('.lany-world-tab').nth(1).click()
  assert '막대사탕 숲' in page.locator('#lany-world-title').inner_text()
  assert page.locator('.lany-map-levels .lany-level:disabled').count()==25
  page.locator('.lany-world-tab').nth(0).click()
  page.locator('#lany-map-levels button:not([disabled])').first.click()
  assert page.locator('#lany-stage-prep').is_visible()
  assert page.locator('#lany-time-mode').is_checked()
  assert page.locator('#board .cell').count()==0
  page.screenshot(path=str(root/'docs'/f'v09_{label}_prepare.png'))
  page.locator('#lany-prep-play').click()
  assert page.locator('#board .cell').count()==64
  assert page.locator('#lany-clock').is_visible()
  assert page.evaluate('LanyTempo.isRunning()')
  t0=page.evaluate('LanyTempo.getRemaining()');page.wait_for_timeout(1200);t1=page.evaluate('LanyTempo.getRemaining()')
  assert t1<t0,(label,'clock not ticking',t0,t1)
  page.locator('#app button:has-text("지도")').first.click()
  assert page.locator('#lany-world-map').is_visible()
  assert not page.evaluate('LanyTempo.isRunning()')
  paused=page.evaluate('LanyTempo.getRemaining()');page.wait_for_timeout(1200)
  assert page.evaluate('LanyTempo.getRemaining()')==paused,'clock ran while map shown'
  page.locator('#lany-map-resume').click()
  assert page.evaluate('LanyTempo.isRunning()')
  # Classic no countdown, but still elapsed timer
  page.evaluate('LanyShell.openMap()');page.locator('#lany-map-continue').click()
  page.locator('#lany-time-mode').uncheck();page.locator('#lany-prep-play').click()
  assert not page.evaluate('LanyTempo.enabled()')
  assert page.locator('#lany-clock-caption').inner_text()=='⌛ 진행 시간'
  page.wait_for_timeout(1800)
  assert page.evaluate('LanyTempo.getElapsed()')>=1
  # Test an actual match via drag
  coords=page.evaluate('''() => {for(let r=0;r<8;r++)for(let c=0;c<8;c++)for(const [rr,cc] of [[r+1,c],[r,c+1]]){
  if(rr>=8||cc>=8||state.locked[r*8+c]||state.locked[rr*8+cc])continue;
  doSwap(r,c,rr,cc);let ok=findMatches().length;doSwap(r,c,rr,cc);if(ok)return [[r,c],[rr,cc]];
 }return null}''')
  assert coords,'no playable move'
  def cen(pair):
    cell=page.locator(f'.cell[data-r="{pair[0]}"][data-c="{pair[1]}"]');box=cell.bounding_box();return box['x']+box['width']/2,box['y']+box['height']/2
  ax,ay=cen(coords[0]);bx,by=cen(coords[1]);prev=page.evaluate('state.score')
  if not mobile:
   page.mouse.move(ax,ay);page.mouse.down();page.mouse.move(bx,by,steps=6);page.mouse.up()
  else:
   page.evaluate('''([a,b,c,d])=>{const el=document.elementFromPoint(a,b);el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:19,pointerType:'touch',button:0,clientX:a,clientY:b}));el.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:19,pointerType:'touch',button:0,clientX:c,clientY:d}));}''',[ax,ay,bx,by])
  page.wait_for_timeout(1100)
  assert page.evaluate('state.score')>prev,'match score did not increase'
  assert not errors,(label,errors)
  assert not missing,(label,missing)
  page.screenshot(path=str(root/'docs'/f'v09_{label}_game.png'))
  results.append({'device':label,'realAssetRoute':True,'backgroundLoaded':True,'mapNodes':25,'mapPathSegments':24,'worldTabsFunctional':True,'stagePrep':True,'timerTick':True,'timerPausedOnMap':True,'classicElapsed':True,'dragPoints':page.evaluate('state.score'),'javascriptErrors':0,'missingAssets':0})
  browser.close()
(root/'docs'/'BROWSER_V09.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(results,ensure_ascii=False,indent=2))
