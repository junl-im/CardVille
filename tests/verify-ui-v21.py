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
  page.goto(base+'?v=2.3.5',wait_until='load',timeout=30000)
  page.wait_for_function("typeof LanyShell==='object' && typeof LanyFriends==='object'")
  def bg(selector,piece):
   val=page.locator(selector).first.evaluate("e=>getComputedStyle(e).backgroundImage")
   assert piece in val,(name,selector,piece,val)
  for selector in ['.lany-title .lany-illustrated-logo img','.lany-title #lany-start-button img','.lany-title .lany-art-install img','.lany-title .lany-art-help img','.lany-title .lany-art-friends img']:
   img=page.locator(selector).first
   assert img.evaluate('e=>e.complete && e.naturalWidth>0'),(name,selector)
   assert '/v26/title/' in img.get_attribute('src'),(name,selector)
  assert page.locator('.lany-title-shortcuts .lany-art-small').count()==3,name
  page.screenshot(path=str(out/(name+'-title.png')))
  page.locator('.lany-art-help').click()
  assert page.locator('#overlay-tutorial').is_visible(),name
  bg('#overlay-tutorial .modal','linear-gradient')
  page.evaluate("LanyShell.closeTutorial()")
  page.locator('.lany-art-friends').click()
  assert page.locator('#lany-friends-modal').is_visible(),name
  bg('#lany-friends-modal .lany-friends-panel','panel-friends.webp')
  page.locator('.lany-friends-close').click()
  page.locator('#lany-start-button').click()
  assert page.locator('#lany-world-map').is_visible(),name
  bg('#lany-world-map .lany-world-banner','linear-gradient')  # v52 keeps the region title readable on a quiet frame
  assert page.locator('#lany-world-tabs .lany-world-tab').evaluate_all("els=>els.every(e=>e.childElementCount===0&&e.textContent.trim()===''&&getComputedStyle(e,'::before').display==='none')"),(name,'region art must have one painted label')
  assert page.locator('#lany-world-no').inner_text()=='1~25단계',(name,'banner must not repeat region name')
  bg('#lany-map-continue','v26/actions/continue.webp')
  if mobile:
   assert page.locator('#lany-map-continue').evaluate("e=>Math.abs(e.getBoundingClientRect().top-document.querySelector('.lany-map-bottom button[data-lany-art=\"exit\"]').getBoundingClientRect().top)<=3"),(name,'map actions should share one row')
  page.screenshot(path=str(out/(name+'-map.png')))
  page.locator('#lany-map-continue').click()
  assert page.locator('#lany-stage-prep').is_visible(),name
  if mobile:
   assert page.locator('#lany-prep-pager').is_visible(),(name,'mobile prep must page its content')
   assert page.locator('[data-prep-page="1"]').is_hidden(),(name,'unused prep details should stay hidden')
  bg('.lany-prep-card','panel-help.webp')
  # Standalone action art must keep its source aspect ratio instead of stretching text.
  for selector in ('#lany-prep-play',):
   box=page.locator(selector).bounding_box()
   assert box and 2.2 < box['width']/box['height'] < 4.5,(name,selector,box)
   assert 'prep-start.webp' in page.locator(selector).evaluate("e=>getComputedStyle(e).backgroundImage"),(name,selector)
  assert page.locator('#lany-stage-prep .lany-prep-cancel').inner_text().strip()=='맵 돌아가기'
  bg('#lany-stage-prep .lany-prep-cancel','v33/frames/blue.png')
  page.locator('#lany-prep-play').click()
  assert page.locator('#board .cell').count()==64,name
  bg('#app>.header .hud-box','panel-score.webp')
  assert page.locator('#game-mode-bar').evaluate("e=>getComputedStyle(e).position")=='static',name
  assert page.locator('#leaderboard').evaluate("e=>getComputedStyle(e).backgroundColor")!='rgb(22, 27, 34)',name
  for kind in ('hammer','shuffle','color','time'):
   bg('#b-'+kind,'/v30/boosters/'+kind+'.webp')
  assert page.locator('#board-wrap').evaluate("e=>e.compareDocumentPosition(document.querySelector('.boosters')) & Node.DOCUMENT_POSITION_FOLLOWING"),(name,'boosters must follow board')
  if mobile and h>=568:
   assert page.locator('.boosters').evaluate("e=>e.getBoundingClientRect().top < innerHeight - 20"),(name,'boosters must enter first viewport')
  if name=='desktop' or h>=568:
   assert page.locator('.lany-game-nav').evaluate('e=>e.getBoundingClientRect().bottom<=innerHeight-4'),(name,'game controls must fit first viewport')
  page.screenshot(path=str(out/(name+'-game.png')))
  for key,label,art in [('map','맵','rabbit.webp'),('friends','도감','cat.webp'),('exit','나가기','bear.webp')]:
   control=page.locator('.lany-game-nav button[data-lany-art="'+key+'"]')
   assert control.count()==1 and control.inner_text().strip()==label,(name,key,'navigation label')
   assert control.evaluate('e=>getComputedStyle(e,"::before").backgroundImage',).find(art)>=0,(name,key,'navigation icon')
  page.locator('#lany-quick-exit').click()
  assert page.locator('#lany-exit').is_visible(),(name,'exit confirmation')
  page.locator('#lany-exit button[data-lany-art="resume"]').click()
  page.evaluate('LanyShell.openPause()')
  assert page.locator('#lany-pause').is_visible(),name
  page.screenshot(path=str(out/(name+'-pause.png')))
  for key,art in [('overlay-win','panel-win.webp'),('overlay-lose','panel-lose.webp')]:
   page.evaluate("""key=>{for(const el of ['overlay-win','overlay-lose'])document.getElementById(el).style.display=el===key?'flex':'none'}""",key)
   bg('#'+key+' .modal',art)
   page.screenshot(path=str(out/(name+'-'+key+'.png')))
   assert page.locator('#'+key+' .modal-btns button').evaluate_all("els=>els.every(e=>{const r=e.getBoundingClientRect();return r.height>=40&&r.top>=0&&r.bottom<=innerHeight})"),(name,key,'result buttons clipped')
  assert page.evaluate('document.documentElement.scrollWidth-innerWidth')<=3,(name,'page horizontal clipping')
  assert not errors,(name,errors)
  assert not missing,(name,missing)
  all_reports.append(dict(viewport=name,wh=f'{w}x{h}',titleRaster=5,panelTheme='v21',
   mapTheme='v21',hudTheme='v21',playable64=True,missingMedia=0,errors=0))
  ctx.close()
 browser.close()
print(json.dumps(all_reports,ensure_ascii=False,indent=2))


