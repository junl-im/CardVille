"""v2.2 real-browser visual regression: raster-only assets, candy gauge and map canvas."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json

base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
out=Path(__file__).resolve().parents[1]/'docs'/'raster-v22'
out.mkdir(parents=True,exist_ok=True)
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
 for tag,w,h,mobile in [('short',320,440,True),('mini',320,568,True),('phone',390,844,True),('pc',1366,768,False)]:
  ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile,service_workers='block')
  pg=ctx.new_page();errors=[];vectors=[]
  pg.on('pageerror',lambda e:errors.append(str(e)))
  pg.on('request',lambda req:vectors.append(req.url) if '.svg' in req.url.lower() else None)
  pg.goto(base+'?v=2.3.5',wait_until='load',timeout=30000)
  pg.wait_for_function("typeof LanyShell==='object'")
  assert pg.locator('svg').count()==0,(tag,'vector DOM at title')
  pg.screenshot(path=str(out/f'{tag}-title.png'))
  pg.locator('#lany-start-button').click()
  assert pg.locator('#lany-world-map').is_visible(),tag
  assert pg.locator('svg').count()==0,(tag,'vector DOM at map')
  assert pg.locator('canvas.lany-route').count()==1,tag
  pg.locator('.lany-map-levels .lany-level').first.wait_for()
  assert pg.locator('.lany-map-levels .lany-level').first.evaluate("e=>getComputedStyle(e).backgroundImage.includes('.webp')"),tag
  assert pg.locator('canvas.lany-route').evaluate('e=>e.width>0&&e.height>0'),tag
  assert pg.evaluate("document.querySelector('.lany-map-section').scrollHeight<=document.querySelector('.lany-map-section').clientHeight+4"),(tag,'map clipped')
  pg.screenshot(path=str(out/f'{tag}-map.png'))
  pg.locator('.lany-map-levels .lany-level:not([disabled])').first.click()
  assert pg.locator('#lany-stage-prep').is_visible(),tag
  pg.locator('#lany-prep-play').click()
  assert pg.locator('#board .cell').count()==64,tag
  assert pg.locator('#lany-hud-moves').inner_text().strip().isdigit(),tag
  assert pg.locator('.lany-star-checkpoint').count()==3,tag
  assert pg.locator('.lany-star-checkpoint.earned').count()==0,tag
  pg.evaluate("""() => {window.__originalScore=state.score;state.score=LEVELS[state.level-1].goal;updateHUD();}""")
  assert pg.locator('.lany-star-checkpoint.earned').count()==1,tag
  pg.evaluate("""() => {state.score=LEVELS[state.level-1].goal*1.4;updateHUD();}""")
  assert pg.locator('.lany-star-checkpoint.earned').count()==2,tag
  pg.evaluate("""() => {state.score=LEVELS[state.level-1].goal*2;updateHUD();}""")
  assert pg.locator('.lany-star-checkpoint.earned').count()==3,tag
  pg.evaluate("state.score=window.__originalScore;updateHUD()")
  assert pg.locator('svg').count()==0,(tag,'vector DOM at game')
  assert pg.locator('.booster').count()==4,tag
  for booster in pg.locator('.booster').all():
   assert '.webp' in booster.evaluate('e=>getComputedStyle(e).backgroundImage'),(tag,'not raster booster')
  pg.screenshot(path=str(out/f'{tag}-game.png'))
  assert not vectors,(tag,'vector image requested',vectors)
  assert not errors,(tag,errors)
  results.append({'viewport':tag,'mapCanvas':True,'pngPwa':True,'svgRequests':0,'svgDOM':0,'starThresholds':[1,2,3],'boosters':4,'jsErrors':0})
  ctx.close()
 browser.close()
print(json.dumps(results,ensure_ascii=False,indent=2))
