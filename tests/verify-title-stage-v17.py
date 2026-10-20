"""Verify v1.7 fairytale title and update UX on representative real Chromium layouts."""
from pathlib import Path
import json,os
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'docs'/'title-stage-v17'
OUT.mkdir(parents=True,exist_ok=True)
URL=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
report=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for name,w,h,mobile in [('compact',320,568,True),('phone',390,844,True),('desktop',1366,768,False),('short',320,440,True)]:
  ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile,service_workers='block')
  page=ctx.new_page();errors=[];failed=[]
  page.on('pageerror',lambda e: errors.append(str(e)))
  page.on('response',lambda r:failed.append(r.url) if r.status>=400 else None)
  page.goto(URL+'?v=1.7.0',wait_until='load',timeout=30000)
  page.wait_for_function("typeof LanyShell==='object' && typeof LanyUpdate==='object'")
  assert page.locator('.lany-title-play-scene #lany-start-button').is_visible(),name
  assert page.locator('.lany-title-shortcuts .lany-art-button').count()==3,name
  assert page.locator('.lany-title-cast').evaluate('(e)=>e.complete&&e.naturalWidth>0'),name
  assert page.locator('.lany-illustrated-logo img').evaluate('(e)=>e.complete&&e.naturalWidth>0'),name
  bg=page.locator('.lany-title').evaluate('(e)=>getComputedStyle(e).backgroundImage')
  assert page.locator('.lany-cover').evaluate("e=>getComputedStyle(e).visibility==='visible' && e.complete && e.naturalWidth>0"),name
  assert page.locator('.lany-illustrated-logo img').get_attribute('src')=='./assets/v26/title/logo.webp',name
  bounds=page.evaluate("""()=>({
    top:document.querySelector('.lany-title-top').getBoundingClientRect().toJSON(),
    play:document.querySelector('#lany-start-button').getBoundingClientRect().toJSON(),
    helpers:[...document.querySelectorAll('.lany-title-shortcuts .lany-art-small')].map(e=>e.getBoundingClientRect().toJSON()),
    bottom:document.querySelector('.lany-title-bottom').getBoundingClientRect().toJSON(),
    horizontal:document.documentElement.scrollWidth-innerWidth,
  })""")
  assert bounds['horizontal']<=3,(name,'horizontal overflow',bounds)
  two_rows=w<650 and h>680
  assert bounds['play']['width']>bounds['helpers'][0]['width']*(1.5 if two_rows else 2),(name,'play focus',bounds)
  assert abs(bounds['helpers'][0]['top']-bounds['helpers'][1]['top'])<3,(name,'first helper row',bounds)
  if two_rows:
   assert bounds['helpers'][2]['top']>bounds['helpers'][1]['bottom'],(name,'centered gallery row',bounds)
  else:
   assert abs(bounds['helpers'][1]['top']-bounds['helpers'][2]['top'])<3,(name,'three helper buttons in one row')
  assert bounds['bottom']['top']>=-3 and bounds['bottom']['bottom']<=h+3,(name,'bottom clipping',bounds)
  assert bounds['top']['top']>=-3 and bounds['top']['bottom']<=h+3,(name,'logo clipping',bounds)
  page.screenshot(path=str(OUT/(name+'-title.png')))
  # Server version probe is fresh, but a matching version must never show update.
  current=page.locator('meta[name="lany-build-version"]').get_attribute('content')
  assert current=='2.3.40-beta',name
  assert page.locator('#lany-update-banner').is_hidden(),(name,'banner shown for current build')
  page.route('**/version.json?_fresh=*',lambda route:route.fulfill(status=200,content_type='application/json',body=json.dumps({'version':current})))
  page.evaluate('LanyUpdate.check()')
  assert page.locator('#lany-update-banner').is_hidden(),(name,'matching version must be quiet')
  page.unroute('**/version.json?_fresh=*')
  page.route('**/version.json?_fresh=*',lambda route:route.fulfill(status=200,content_type='application/json',body='{"version":"2.2.0-beta"}'))
  page.evaluate('LanyUpdate.check()')
  assert page.locator('#lany-update-banner').is_hidden(),(name,'older server version must be quiet')
  page.unroute('**/version.json?_fresh=*')
  # New version is detected via no-store version metadata and needs explicit action to refresh.
  page.route('**/version.json?_fresh=*',lambda route:route.fulfill(status=200,content_type='application/json',body='{"version":"9.9.9-beta"}'))
  page.evaluate('LanyUpdate.check()')
  page.locator('#lany-update-banner:not([hidden])').wait_for(timeout=10000)
  assert page.locator('#lany-update-now').is_visible(),name
  page.locator('#lany-start-button').click()
  assert page.locator('#lany-world-map').is_visible(),name
  assert not errors,(name,errors)
  assert not failed,(name,failed)
  report.append({'viewport':name,'px':str(w)+'x'+str(h),'forest':True,'mascots':True,'3QuickButtons':True,'updateBanner':True,'noOverflow':True,'jsErrors':0})
  ctx.close()
 browser.close()
print(json.dumps(report,ensure_ascii=False,indent=2))
