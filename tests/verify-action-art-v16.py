"""Real Chromium QA for 12 illustrated gameplay actions, popups and 320px layouts."""
from pathlib import Path
import os,json
from playwright.sync_api import sync_playwright

out=Path(__file__).resolve().parents[1]/'docs'/'action-art-v16'
out.mkdir(parents=True,exist_ok=True)
url=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
results=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for name,w,h,mobile in [('mini',320,568,True),('mobile',390,844,True),('desktop',1366,768,False),('short',320,440,True)]:
  ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile,service_workers='block')
  page=ctx.new_page()
  errors=[];missing=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
  page.goto(url+'?v=1.6.0',wait_until='load',timeout=30000)
  page.wait_for_function("typeof LanyShell==='object' && typeof LanyButtonFX==='object'")
  assert page.locator('[data-lany-art]').count()==28,name
  page.locator('#lany-start-button').click()
  assert page.locator('#lany-world-map').is_visible(),name
  def inspect_buttons(selector):
   return page.locator(selector).evaluate_all("""els=>els.filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden').map(el=>{
    const r=el.getBoundingClientRect(),pseudo=getComputedStyle(el,'::before'),image=pseudo.backgroundImage;
    return {text:(el.textContent||'').trim(),action:el.dataset.lanyArt,width:r.width,
      left:r.left,right:r.right,icon:image, iconSize:pseudo.width,
      picture:el.dataset.cvPicture,background:getComputedStyle(el).backgroundImage,
      scroll:el.scrollWidth,inner:el.clientWidth,
      bottom:r.bottom,top:r.top};
   })""")
  def has_action_art(item):
   if item['picture']=='art':
    return '/v61/buttons/' in item['background']
   if item['picture']=='icon':
    return '/v23/buttons/' in item['background'] or '/v53/control.webp' in item['background']
   icon=item['icon']
   return icon!='none' and ('action-'+item['action']+'.webp' in icon or '/animals/' in icon)
  for item in inspect_buttons('.lany-map-bottom [data-lany-art]'):
   assert has_action_art(item),(name,item)
   assert item['left']>=-2 and item['right']<=w+2,(name,'map button cropped',item)
   assert item['scroll']<=item['inner']+3,(name,'map button contents clipped',item)
  # Every currently visible stage is rendered from state-specific candy-medallion art.
  current=page.locator('#lany-map-levels .lany-level.current').first
  assert current.count()==1,(name,'current stage')
  assert 'v53/control.webp' in current.evaluate("e=>getComputedStyle(e).backgroundImage"),name
  locked=page.locator('#lany-map-levels .lany-level:disabled').first
  assert 'v53/control.webp' in locked.evaluate("e=>getComputedStyle(e).backgroundImage"),name
  page.screenshot(path=str(out/(name+'-map.png')))
  page.locator('#lany-map-continue').click()
  assert page.locator('#lany-stage-prep').is_visible(),name
  prep=inspect_buttons('#lany-stage-prep [data-lany-art]')
  assert any(x['action']=='play' for x in prep),name
  page.locator('#lany-prep-play').click()
  assert page.locator('#board .cell').count()==64,name
  page.evaluate('LanyShell.openPause()')
  assert page.locator('#lany-pause').is_visible(),name
  pause=inspect_buttons('#lany-pause [data-lany-art]')
  assert len(pause)==5,(name,'pause action count',pause)
  for item in pause:
   assert has_action_art(item),(name,item)
   assert item['scroll']<=item['inner']+3,(name,'pause text overflow',item)
  page.screenshot(path=str(out/(name+'-pause.png')))
  page.locator('#lany-pause button[data-lany-art="resume"]').click()
  assert not page.locator('#lany-pause').is_visible(),name
  # Result overlays are displayed without mutating any match-3 score or user progress.
  page.evaluate("""() => { document.getElementById('overlay-win').style.display='flex'; }""")
  assert page.locator('#overlay-win').is_visible(),name
  victory=inspect_buttons('#overlay-win [data-lany-art]')
  assert [x['action'] for x in victory]==['next','map','retry','exit'],(name,victory)
  for item in victory:
   assert item['scroll']<=item['inner']+3,(name,'win action overflow',item)
   assert has_action_art(item),(name,item)
  page.screenshot(path=str(out/(name+'-victory.png')))
  page.evaluate("""() => {document.getElementById('overlay-win').style.display='none';document.getElementById('overlay-lose').style.display='flex';}""")
  defeat=inspect_buttons('#overlay-lose [data-lany-art]')
  assert [x['action'] for x in defeat]==['retry','map','exit'],(name,defeat)
  page.evaluate("""() => document.getElementById('overlay-lose').style.display='none'""")
  assert not missing,(name,missing)
  assert not errors,(name,errors)
  results.append(dict(device=name,screen=f'{w}x{h}',gameplayIllustrations=28,pauseActions=5,winActions=4,
     iconsLoaded=True,overflow=False,jsErrors=0))
  ctx.close()
 browser.close()
print(json.dumps(results,ensure_ascii=False,indent=2))


