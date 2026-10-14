"""v2.1 original-studio WebP art integration smoke across all game screens.
No scrollbars added; interaction/accessibility handled by existing controls.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json
base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
out=Path(__file__).resolve().parents[1]/'docs'/'ui-v21';out.mkdir(parents=True,exist_ok=True)
all_reports=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for name,w,h,mobile in [('small',320,568,True),('phone',390,844,True),('short',320,440,True),('desktop',1366,768,False)]:
  ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile,service_workers='block')
  page=ctx.new_page();errors=[];missing=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
  page.goto(base+'?v=2.1.0',wait_until='load',timeout=30000)
  page.wait_for_function("typeof LanyShell==='object' && typeof LanyFriends==='object'")
  def bg(selector,piece):
   val=page.locator(selector).first.evaluate("e=>getComputedStyle(e).backgroundImage")
   assert piece in val,(name,selector,piece,val)
  for selector in ['.lany-title .lany-illustrated-logo img','.lany-title #lany-start-button img','.lany-title .lany-art-install img','.lany-title .lany-art-help img','.lany-title .lany-art-friends img']:
   img=page.locator(selector).first
   assert img.evaluate('e=>e.complete && e.naturalWidth>0'),(name,selector)
   assert '/ui/v21/' in img.get_attribute('src'),(name,selector)
  assert page.locator('.lany-title-shortcuts .lany-art-small').count()==3,name
  page.screenshot(path=str(out/(name+'-title.png')))
  page.locator('.lany-art-help').click()
  assert page.locator('#overlay-tutorial').is_visible(),name
  bg('#overlay-tutorial .modal','panel-confirm.webp')
  page.evaluate("LanyShell.closeTutorial()")
  page.locator('.lany-art-friends').click()
  assert page.locator('#lany-friends-modal').is_visible(),name
  bg('#lany-friends-modal .lany-friends-panel','panel-friends.webp')
  page.locator('.lany-friends-close').click()
  page.locator('#lany-start-button').click()
  assert page.locator('#lany-world-map').is_visible(),name
  bg('#lany-world-map .lany-world-banner','chapter.webp')
  bg('#lany-map-continue','skin-green.webp')
  page.screenshot(path=str(out/(name+'-map.png')))
  page.locator('#lany-map-continue').click()
  assert page.locator('#lany-stage-prep').is_visible(),name
  bg('.lany-prep-card','panel-help.webp')
  page.locator('#lany-prep-play').click()
  assert page.locator('#board .cell').count()==64,name
  bg('#app>.header .hud-box','panel-score.webp')
  bg('.booster','panel-booster.webp')
  page.screenshot(path=str(out/(name+'-game.png')))
  page.locator('#lany-quick-pause').click()
  assert page.locator('#lany-pause').is_visible(),name
  page.screenshot(path=str(out/(name+'-pause.png')))
  for key,art in [('overlay-win','panel-clear.webp'),('overlay-lose','panel-fail.webp')]:
   page.evaluate("""key=>{for(const el of ['overlay-win','overlay-lose'])document.getElementById(el).style.display=el===key?'flex':'none'}""",key)
   bg('#'+key+' .modal',art)
  page.screenshot(path=str(out/(name+'-result.png')))
  assert page.evaluate('document.documentElement.scrollWidth-innerWidth')<=3,(name,'page horizontal clipping')
  assert not errors,(name,errors)
  assert not missing,(name,missing)
  all_reports.append(dict(viewport=name,wh=f'{w}x{h}',titleRaster=5,panelTheme='v21',
   mapTheme='v21',hudTheme='v21',playable64=True,missingMedia=0,errors=0))
  ctx.close()
 browser.close()
print(json.dumps(all_reports,ensure_ascii=False,indent=2))
