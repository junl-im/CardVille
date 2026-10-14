"""LanyPang v2.2 visual acceptance: raster-only UI, working map, score gauge and game board."""
import os,json
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
OUT=Path(__file__).resolve().parents[1]/'docs'/'v22-visual'
OUT.mkdir(parents=True,exist_ok=True)
reports=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for name,w,h,mobile in [('compact',320,440,True),('phone-small',320,568,True),('phone',390,844,True),('desktop',1366,768,False)]:
  context=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile,service_workers='block')
  page=context.new_page();errors=[];missing=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
  page.goto(BASE+'?v=2.2.0',wait_until='load',timeout=30000)
  page.wait_for_function("typeof LanyShell==='object'")
  page.locator('#lany-start-button').click()
  assert page.locator('#lany-world-map').is_visible(),name
  map_nodes=page.locator('#lany-map-levels .lany-level').count()
  assert map_nodes>=3,(name,map_nodes)
  assert page.locator('.lany-route-strip').count()==map_nodes-1,(name,'CSS route segments')
  assert page.locator('svg').count()==0,(name,'vector element leaked')
  route_color=page.locator('.lany-route-strip').first.evaluate('e=>getComputedStyle(e).backgroundImage')
  assert 'repeating-linear-gradient' in route_color,(name,route_color)
  for selector,img in [('.lany-map-levels','world-map.webp'),('.lany-level.current','stage-current-v20.webp')]:
   if selector=='.lany-level.current' and page.locator(selector).count()==0:continue
   bg=page.locator(selector).first.evaluate('e=>getComputedStyle(e).backgroundImage')
   assert img in bg,(name,selector,bg)
  page.screenshot(path=str(OUT/(name+'-map.png')))
  page.locator('#lany-map-continue').click()
  page.locator('#lany-prep-play').click()
  page.wait_for_function("document.querySelectorAll('#board .cell').length===64")
  assert page.locator('#lany-hud-moves-value').is_visible(),name
  assert page.locator('.lany-v22-moves-panel').is_visible(),name
  assert page.locator('.lany-v22-goal-track').is_visible(),name
  assert page.locator('.lany-v22-star-marker').count()==3,name
  assert page.locator('.lany-v22-goal-track .progress-bar').get_attribute('role')=='progressbar',name
  # Visual star achievements must match the actual 1x/1.4x/2x game reward boundaries.
  for multiplier,lit in [(0.75,0),(1.0,1),(1.4,2),(2.0,3)]:
   page.evaluate("(m)=>{state.score=Math.round(LEVELS[state.level-1].goal*m);updateHUD()}",multiplier)
   assert page.locator('.lany-v22-star-marker.earned').count()==lit,(name,multiplier,'star consistency')
  assert abs(page.locator('#progress-fill').evaluate('e=>parseFloat(e.style.width)')-100)<.01,name
  page.evaluate("()=>{state.score=0;updateHUD()}")

  for selector,needle in [('.lany-v22-moves-panel','panel-moves.webp'),('.lany-v22-score-panel','panel-score.webp'),('.lany-v22-goal-track .progress-bar','progress-track.webp'),('.lany-v22-goal-track .progress-fill','progress-fill.webp'),('#b-hammer','badge-hammer.webp'),('#b-shuffle','badge-shuffle.webp')]:
   bg=page.locator(selector).first.evaluate('e=>getComputedStyle(e).backgroundImage')
   assert needle in bg,(name,selector,bg)
  assert page.locator('svg').count()==0,(name,'unexpected vector UI')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+3'),(name,'horizontal scroll')
  assert page.locator('#board').is_visible()
  page.screenshot(path=str(OUT/(name+'-game.png')))
  assert not missing,(name,'missing web files',missing[:10])
  assert not errors,(name,'JS errors',errors[:10])
  reports.append({'screen':name,'size':f'{w}x{h}','rasterMap':True,'cssRouteSegments':map_nodes-1,'gameBoard':64,'statusHud':True,'starMarkers':3,'missingAssets':0,'errors':0})
  context.close()
 browser.close()
print(json.dumps(reports,ensure_ascii=False,indent=2))
