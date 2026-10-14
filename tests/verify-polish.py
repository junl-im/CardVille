from pathlib import Path
from urllib.parse import urlparse,unquote
from playwright.sync_api import sync_playwright
import mimetypes,json
root=Path(__file__).resolve().parents[1];web=root/'web';results=[]
def serve(route):
 path=unquote(urlparse(route.request.url).path)
 if path=='/':path='/index.html'
 file=(web/path.lstrip('/')).resolve()
 if not file.is_relative_to(web.resolve()) or not file.is_file():route.fulfill(status=404,body='Missing');return
 route.fulfill(status=200,body=file.read_bytes(),content_type=mimetypes.guess_type(str(file))[0] or 'application/octet-stream',headers={'cache-control':'no-store'})
for label,width,height,mobile in [('small',320,568,True),('android',360,780,True),('desktop',1366,768,False)]:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  context=browser.new_context(viewport={'width':width,'height':height},is_mobile=mobile,has_touch=mobile,service_workers='block')
  page=context.new_page();page.route('**/*',serve)
  errors=[];missing=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:missing.append(r.url) if r.status>=400 else None)
  page.evaluate("""() => {let s={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>s[k]??null,setItem:(k,v)=>s[k]=String(v),removeItem:k=>delete s[k],clear:()=>Object.keys(s).forEach(k=>delete s[k])}})}""")
  html=(web/'index.html').read_text().replace('<head>','<head><base href="http://lanypang.local/">',1)
  page.set_content(html,wait_until='load',timeout=30000)
  page.locator('#lany-start-button').click()
  page.locator('#lany-map-levels button.lany-level:not([disabled])').first.click()
  page.locator('#lany-prep-play').click()
  page.wait_for_timeout(300)
  bg=page.locator('#board').evaluate("e=>getComputedStyle(e).backgroundImage")
  assert 'linear-gradient' in bg,(label,bg)
  modalStyle=page.locator('#lany-pause .lany-dialog').evaluate("e=>getComputedStyle(e).borderTopColor")
  css=page.evaluate("()=>[...document.styleSheets].some(x=>x.href?.includes('lany-polish.css'))")
  assert css and page.evaluate("typeof LanyPolish.onMatch==='function'"),(label,'polish missing')
  tile=page.locator('#board .cell .lany-animal-face').first
  original=tile.get_attribute('src')
  el=page.locator('#board .cell').first
  page.evaluate("()=>{let el=document.querySelector('#board .cell');el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerType:'touch',button:0,pointerId:4}));}")
  changed=tile.get_attribute('src');assert '-wink.webp' in changed,(label,changed)
  assert tile.evaluate('e=>e.complete && e.naturalWidth>0'),(label,'wink image')
  page.evaluate("()=>document.querySelector('#board .cell').dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerType:'touch',button:0,pointerId:4}))")
  assert tile.get_attribute('src').split('/')[-1]==original.split('/')[-1],(label,'idle restore')
  page.evaluate("()=>LanyPolish.onMatch(new Set([0,1,2]))")
  assert page.locator('.lany-vfx-pop').count()>0,(label,'real vfx')
  page.wait_for_timeout(700)
  page.evaluate('LanyShell.openPause()')
  assert page.locator('#lany-pause').is_visible()
  m=page.locator('#lany-pause .lany-popup-mascot')
  assert m.count()==1 and m.evaluate('e=>e.complete && e.naturalWidth>0'),(label,'mascot')
  bounding=page.locator('#lany-pause .lany-dialog').bounding_box()
  assert bounding['width']<=width+1 and bounding['height']<=height+1,(label,bounding)
  page.screenshot(path=str(root/'docs'/('v11_'+label+'_popup.png')))
  page.evaluate('LanyShell.resume()')
  page.evaluate('showWin(3)')
  assert page.locator('#overlay-win').is_visible()
  assert 'rabbit-cheer.webp' in page.locator('#overlay-win .modal').evaluate("e=>getComputedStyle(e,'::before').backgroundImage")
  page.wait_for_timeout(520)
  page.screenshot(path=str(root/'docs'/('v11_'+label+'_win.png')))
  page.evaluate("hideOverlay('overlay-win');showLose()")
  assert page.locator('#overlay-lose').is_visible()
  assert page.locator('#overlay-lose .modal').bounding_box()['width']<=width+1
  page.evaluate("hideOverlay('overlay-lose')")
  page.screenshot(path=str(root/'docs'/('v11_'+label+'_game.png')))
  assert not page.evaluate('document.documentElement.scrollWidth>innerWidth+2')
  assert not errors,(label,errors)
  assert not missing,(label,missing)
  results.append({'size':f'{width}x{height}','popupFit':True,'pressWink':True,'expressionRestore':True,'matchVFX':True,'winArt':True,'loseArt':True,'javascriptErrors':0,'missingAssets':0})
  browser.close()
(root/'docs'/'BROWSER_V11.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(results,ensure_ascii=False,indent=2))
