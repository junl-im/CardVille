"""Whole-window LanyPang v2.2 visual regression: original raster kit, all public + legacy dialogs.
Screenshots are for manual visual QA; assertions protect layout, interaction and version notices.
This script never rewrites saved progress, engine rules or the approved art library.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os,json

BASE=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
OUT=Path(__file__).resolve().parents[1]/'docs'/'all-windows-v22'
OUT.mkdir(parents=True,exist_ok=True)
reports=[]

with sync_playwright() as playwright:
  browser=playwright.chromium.launch(headless=True,args=['--no-sandbox'])
  for tag,w,h,mobile in [('short',320,440,True),('mini',320,568,True),('phone',390,844,True),('desktop',1366,768,False)]:
    context=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile,service_workers='block')
    page=context.new_page();errors=[];missing=[];shots=[]
    page.on('pageerror',lambda error:errors.append(str(error)))
    page.on('response',lambda response:missing.append(response.url) if response.status>=400 else None)
    def shot(name,selector=None):
      if selector:
        assert page.locator(selector).is_visible(),(tag,name,'not visible')
      assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 4'),(tag,name,'horizontal document overflow')
      page.screenshot(path=str(OUT/(tag+'-'+name+'.png')),animations='disabled')
      shots.append(name)
    def viewport_fit(selector):
      return page.locator(selector).evaluate("""e=>{
        const r=e.getBoundingClientRect();return r.width>0 && r.height>0 &&
          r.left>=-5 && r.right<=innerWidth+5 && r.top>=-6 &&
          r.bottom<=innerHeight+6;
      }""")
    page.goto(BASE+'?v=2.2.0',wait_until='load',timeout=30000)
    page.wait_for_function("typeof LanyShell==='object' && typeof LanyFriends==='object' && typeof LanyUpdate==='object'")
    assert page.locator('#lany-update-banner').is_hidden(),(tag,'false positive update notice')
    assert page.locator('#lany-start-button img').evaluate('e=>e.complete&&e.naturalWidth>0')
    assert page.locator('#lany-install-button img').evaluate('e=>e.complete&&e.naturalWidth>0')
    shot('title','#lany-title')
    page.locator('#lany-install-button').click()
    assert viewport_fit('.lany-install-card'),(tag,'install panel clipped')
    shot('install','.lany-install-card')
    page.locator('.lany-install-close').click()
    page.locator('.lany-art-help').click()
    assert viewport_fit('#overlay-tutorial .modal'),(tag,'tutorial card clipped')
    shot('tutorial-1','#overlay-tutorial')
    page.evaluate('LanyShell.helpPage(1)')
    shot('tutorial-2','#overlay-tutorial')
    page.evaluate('LanyShell.closeTutorial()')
    page.locator('.lany-art-friends').click()
    assert viewport_fit('.lany-friends-panel'),(tag,'friends card clipped')
    shot('friends-1','.lany-friends-panel')
    page.evaluate('LanyFriends.page(1)')
    shot('friends-2','.lany-friends-panel')
    page.locator('.lany-friends-close').click()
    if tag=='phone':
      page.route('**/version.json?*',lambda route:route.fulfill(status=200,content_type='application/json',body='{"version":"2.3.0-beta"}'))
      page.evaluate('LanyUpdate.check()')
      page.locator('#lany-update-banner').wait_for(state='visible',timeout=3000)
      assert page.evaluate("""() => {
       const start=document.getElementById('lany-start-button').getBoundingClientRect();
       const notice=document.getElementById('lany-update-banner').getBoundingClientRect();
       const actions=document.querySelector('.lany-title-shortcuts').getBoundingClientRect();
       return notice.top>=start.top && notice.bottom<=actions.top+8;
      }"""),'update card should be between Start and shortcut actions'
      shot('update-notice','#lany-update-banner')
      page.unroute('**/version.json?*')
      page.evaluate('LanyUpdate.check()')
      page.locator('#lany-update-banner').wait_for(state='hidden',timeout=3000)
    page.locator('#lany-start-button').click()
    assert page.locator('#lany-world-map').is_visible()
    shot('map','#lany-world-map')
    assert page.locator('.lany-map-levels canvas.lany-route').count()==1
    assert 'world-map.webp' in page.locator('.lany-map-levels').evaluate('e=>getComputedStyle(e).backgroundImage')
    page.evaluate('LanyShell.mapPage(1)')
    shot('map-next-page','#lany-world-map')
    page.evaluate('LanyShell.mapPage(-1)')
    page.locator('.lany-map-levels .lany-level:not([disabled])').first.click()
    assert page.locator('#lany-stage-prep').is_visible()
    shot('stage-ready','#lany-stage-prep')
    if page.locator('#lany-prep-pager').is_visible():
      page.evaluate('LanyShell.prepPage(1)')
      shot('stage-ready-options','#lany-stage-prep')
      page.evaluate('LanyShell.prepPage(-1)')
    page.locator('#lany-prep-play').click()
    assert page.locator('#lany-go-intro').is_visible(),(tag,'GO intro missing')
    assert page.locator('#lany-go-number').inner_text()=='3',tag
    shot('countdown','#lany-go-intro')
    page.wait_for_function("document.getElementById('lany-go-intro').hidden",timeout=5000)
    assert page.locator('#board .cell').count()==64
    shot('game','#board')
    page.locator('#lany-quick-pause').click()
    shot('pause','#lany-pause')
    assert viewport_fit('#lany-pause .lany-dialog'),(tag,'pause card clipped')
    page.evaluate('LanyShell.openExit()')
    shot('exit','#lany-exit')
    assert viewport_fit('#lany-exit .lany-dialog'),(tag,'exit card clipped')
    assert page.locator('#lany-exit button[data-lany-art="resume"]').evaluate("e=>getComputedStyle(e,'::before').display=='none'"),'decorative pseudo icon leaked'
    page.evaluate('LanyShell.resume()')
    for kind in ('win','lose'):
      page.evaluate("""kind=>{document.getElementById('overlay-win').style.display=kind==='win'?'flex':'none';
        document.getElementById('overlay-lose').style.display=kind==='lose'?'flex':'none'}""",kind)
      page.wait_for_timeout(380)  # animated entry transforms should settle before geometry audit
      assert viewport_fit('#overlay-'+kind+' .modal'),(tag,kind,'result panel clipped')
      # Visual-regression guard: the official game button cutouts must be visible.
      button_art={'win':{'next':'skin-green.webp','map':'skin-blue.webp','retry':'skin-gold.webp'},
                  'lose':{'retry':'skin-gold.webp','map':'skin-blue.webp'}}[kind]
      for action,filename in button_art.items():
        value=page.locator('#overlay-'+kind+' button[data-lany-art="'+action+'"]').evaluate('e=>getComputedStyle(e).backgroundImage')
        assert filename in value,(tag,kind,action,'missing approved raster skin',value)
      shot('result-'+kind,'#overlay-'+kind)
    page.evaluate("document.getElementById('overlay-lose').style.display='none'")
    page.evaluate('Difficulty.showModal()')
    shot('difficulty','#difficulty-modal')
    assert viewport_fit('.lany-difficulty-card'),(tag,'difficulty clipped')
    page.evaluate('Difficulty.page(1)')
    shot('difficulty-more','#difficulty-modal')
    page.evaluate('Difficulty.close()')
    page.evaluate('LevelEditor.openEditor()')
    shot('level-editor','#ng-level-editor')
    page.evaluate('LevelEditor.showPage(1)')
    shot('editor-settings','#ng-level-editor')
    page.evaluate("document.getElementById('ng-level-editor').style.display='none'")
    page.get_by_role('button',name='📅 오늘의 도전').click()
    shot('daily-challenge','#daily-modal')
    page.evaluate("document.getElementById('daily-modal').style.display='none'")
    page.evaluate('Multiplayer.showSetupModal()')
    shot('multiplayer','#mp-setup')
    page.evaluate("document.getElementById('mp-setup').style.display='none'")
    page.evaluate("Multiplayer.showShareModal('ABC123')")
    shot('friend-invite','#mp-share')
    page.evaluate("document.getElementById('mp-share').style.display='none'")
    assert not missing,(tag,'HTTP error assets',missing[:10])
    assert not errors,(tag,'JS runtime',errors[:10])
    reports.append({'viewport':tag,'screenShots':len(shots),'screens':shots,'errors':0,'missingAssets':0,'falseUpdate':False,'goCountdown':True})
    context.close()
  browser.close()
print(json.dumps(reports,ensure_ascii=False,indent=2))
