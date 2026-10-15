"""Run real browser smoke and screen-layout tests for raster title art and tactile controls."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json

root=Path(__file__).resolve().parents[1]
out=root/'docs'/'art-buttons-v15'
out.mkdir(parents=True,exist_ok=True)
base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
rows=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for name,w,h,mobile in [
  ('mini',320,568,True),('standard',390,844,True),
  ('desktop',1366,768,False),('short',320,440,True)]:
  ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile,service_workers='block')
  page=ctx.new_page()
  errors=[];missing=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
  page.goto(base+'?v=1.5.0',wait_until='load',timeout=30000)
  page.wait_for_function("typeof LanyShell==='object' && typeof LanyButtonFX==='object'")
  art=page.locator('.lany-art-button')
  assert art.count()==4,(name,'art button count')
  assert page.locator('.lany-title-shortcuts .lany-art-small').count()==3,name
  assert page.locator('#lany-title').is_visible()
  for img in page.locator('.lany-title-top .lany-illustrated-logo img,.lany-art-button img').all():
   assert img.evaluate('(x)=>x.complete && x.naturalWidth>0'),(name,img.get_attribute('src'))
  dims=page.evaluate("""() => {
   const g=x=>document.querySelector(x).getBoundingClientRect().toJSON();
   const pr=g('#lany-start-button');
   const subs=[...document.querySelectorAll('.lany-title-shortcuts .lany-art-button')].map(e=>e.getBoundingClientRect().toJSON());
   const rows=getComputedStyle(document.querySelector('.lany-title-shortcuts')).gridTemplateColumns.split(' ').length;
   const bounds= [...document.querySelectorAll('#lany-title .lany-title-top,#lany-start-button,.lany-title-shortcuts,.lany-version')].map(e=>e.getBoundingClientRect().toJSON());
   return {start:pr,subs,rows,bounds,outerScroll:document.documentElement.scrollWidth>innerWidth+2};
  }""")
  expected_rows=2 if w<650 and h>680 else 3
  assert dims['rows']==expected_rows,(name,'unexpected helper grid',dims)
  assert not dims['outerScroll'],(name,'horizontal overflow',dims)
  assert dims['start']['width'] > dims['subs'][0]['width']*(1.5 if expected_rows==2 else 2),(name,'play button should be dominant')
  assert abs(dims['subs'][0]['y']-dims['subs'][1]['y'])<3,(name,'first helper row misaligned')
  if expected_rows==2:
   assert dims['subs'][2]['y']>dims['subs'][1]['bottom'],(name,'gallery shortcut not below first row')
  else:
   assert abs(dims['subs'][1]['y']-dims['subs'][2]['y'])<3,(name,'not one row')
  assert dims['subs'][0]['y']>=dims['start']['y']+dims['start']['height']+2,(name,'start and helpers too close',dims)
  for bound in dims['bounds']:
   assert bound['top']>=-3 and bound['bottom']<=h+3,(name,'clipped title',bound,h)
   assert bound['left']>=-3 and bound['right']<=w+3,(name,'horizontal clipping',bound,w)
  page.screenshot(path=str(out/(name+'-title.png')))
  if not mobile:
   button=page.locator('#lany-start-button')
   button.hover();page.wait_for_timeout(180)
   assert button.evaluate('(x)=>getComputedStyle(x).transform')!='none',(name,'hover animation')
   # Test delegated pointer feedback without generating an actual click that opens the map.
   button.evaluate("""x=>x.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,isPrimary:true,pointerId:12,pointerType:'mouse',button:0}))""")
   assert button.evaluate("(x)=>x.classList.contains('lany-pressed')"),(name,'pointer press')
   page.evaluate("""()=>document.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,isPrimary:true,pointerId:12,pointerType:'mouse',button:0}))""")
   page.wait_for_timeout(150)
   assert not button.evaluate("(x)=>x.classList.contains('lany-pressed')"),(name,'release press')
  page.locator('.lany-art-help').click()
  assert page.locator('#overlay-tutorial').is_visible(),name
  page.evaluate('LanyShell.closeTutorial()')
  page.locator('.lany-art-friends').click()
  assert page.locator('#lany-friends-modal').is_visible(),name
  page.locator('.lany-friends-close').click()
  page.evaluate('LanyInstall.showGuide()')
  assert page.locator('#lany-install-modal').is_visible(),name
  page.locator('.lany-install-done').click()
  page.locator('#lany-start-button').click()
  assert page.locator('#lany-world-map').is_visible(),name
  if mobile:assert page.locator('.lany-map-head .lany-mobile-fullscreen').is_visible(),name
  else:assert not page.locator('.lany-map-head .lany-mobile-fullscreen').is_visible(),name
  assert not errors,(name,errors)
  assert not missing,(name,missing)
  rows.append({'screen':name,'size':f'{w}x{h}','illustratedButtons':4,'helperColumns':expected_rows,'mainButtonDominant':True,'titleUnclipped':True,'missingAssets':0,'jsErrors':0})
  ctx.close()
 browser.close()
print(json.dumps(rows,ensure_ascii=False,indent=2))
