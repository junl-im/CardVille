"""v0.9.1 Android-sized touch navigation regression. No animation-disabling shortcuts."""
from pathlib import Path
from urllib.parse import urlparse,unquote
from playwright.sync_api import sync_playwright
import json,mimetypes
root=Path(__file__).resolve().parents[1];web=root/'web';out=[]
def serve(route):
 url=urlparse(route.request.url)
 path=unquote(url.path) or '/index.html'
 if path=='/':path='/index.html'
 p=(web/path.lstrip('/')).resolve()
 if not p.is_relative_to(web.resolve()) or not p.is_file():route.fulfill(status=404,body='Missing resource');return
 route.fulfill(status=200,body=p.read_bytes(),content_type=mimetypes.guess_type(str(p))[0] or 'application/octet-stream')
for device,w,h,mobile in [('android',360,780,True),('desktop',1366,768,False)]:
 with sync_playwright() as t:
  browser=t.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile,service_workers='block')
  page=ctx.new_page();page.route('**/*',serve)
  errs=[];page.on('pageerror',lambda e:errs.append(str(e)))
  page.evaluate("""() => { const s={}; Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>s[k]??null,setItem:(k,v)=>s[k]=String(v),removeItem:k=>delete s[k],clear:()=>Object.keys(s).forEach(k=>delete s[k])}}) }""")
  page.set_content((web/'index.html').read_text().replace('<head>','<head><base href="http://lanypang.local/">',1),wait_until='load')
  def tap(selector):
   loc=page.locator(selector)
   loc.scroll_into_view_if_needed(timeout=4000)
   bb=loc.bounding_box();assert bb,(device,selector)
   if mobile:page.touchscreen.tap(bb['x']+bb['width']/2,bb['y']+bb['height']/2)
   else:page.mouse.click(bb['x']+bb['width']/2,bb['y']+bb['height']/2)
  tap('#lany-start-button')
  assert page.locator('#lany-world-map').is_visible()
  tap('#lany-map-levels button.lany-level:not([disabled])')
  assert page.locator('#lany-stage-prep').is_visible()
  tap('#lany-prep-play')
  assert page.locator('#board .cell').count()==64
  original=page.evaluate('state.board.join(",")')
  # Reproduce the user's screenshot: scrolled to boosters and secondary buttons.
  page.evaluate('window.scrollTo(0,document.body.scrollHeight)')
  tap('#lany-quick-map')
  assert page.locator('#lany-world-map').is_visible(),(device,'bottom map button failed')
  assert page.evaluate('LanyShell.getCurrentScreen()')=='map'
  assert page.locator('#lany-map-levels .lany-level:not([disabled])').count()==1
  assert page.locator('#lany-map-levels .lany-level[disabled]').count()==page.locator('#lany-map-levels .lany-level').count()-1
  assert page.evaluate('state.board.join(",")')==original
  page.screenshot(path=str(root/'docs'/f'v091_{device}_map_after_bottom_tap.png'))
  tap('#lany-map-resume')
  assert page.evaluate('LanyShell.getCurrentScreen()')=='game'
  assert page.evaluate('state.board.join(",")')==original
  tap('#lany-header-map-button')
  assert page.locator('#lany-world-map').is_visible(),(device,'header map button failed')
  tap('#lany-map-levels button.lany-level:not([disabled])')
  assert page.locator('#lany-stage-prep').is_visible(),(device,'stage node click failed')
  assert not errs,(device,errs)
  out.append({'device':device,'realTouch':mobile,'bottomMapWorks':True,'headerMapWorks':True,'stageTapWorks':True,'resumePreservesBoard':True,'javascriptErrors':0})
  browser.close()
(root/'docs'/'MAP_TOUCH_V091.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out,ensure_ascii=False,indent=2))
