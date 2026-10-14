from pathlib import Path
from urllib.parse import urlparse,unquote
from playwright.sync_api import sync_playwright
import json,mimetypes
root=Path(__file__).resolve().parents[1];web=root/'web';res=[]
def serve(route):
 url=urlparse(route.request.url);path=unquote(url.path)
 if path=='/':path='/index.html'
 p=(web/path.lstrip('/')).resolve()
 if not p.is_relative_to(web.resolve()) or not p.is_file():route.fulfill(status=404,body='Missing');return
 route.fulfill(status=200,body=p.read_bytes(),content_type=mimetypes.guess_type(str(p))[0] or 'application/octet-stream',headers={'cache-control':'no-store'})
for device,w,h,is_mobile in [('mini',320,568,True),('galaxy',360,780,True),('standard',390,844,True),('large',430,932,True),('desktop',1366,768,False)]:
 with sync_playwright() as pw:
  browser=pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=is_mobile,has_touch=is_mobile,service_workers='block')
  pg=ctx.new_page();pg.route('**/*',serve)
  errs=[];notfound=[]
  pg.on('pageerror',lambda e:errs.append(str(e)))
  pg.on('response',lambda r:notfound.append(r.url) if r.status>=400 else None)
  pg.evaluate("""() => {const s={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>s[k]??null,setItem:(k,v)=>s[k]=String(v),removeItem:k=>delete s[k],clear:()=>Object.keys(s).forEach(k=>delete s[k])}})}""")
  pg.set_content((web/'index.html').read_text().replace('<head>','<head><base href="http://lanypang.local/">',1),wait_until='load',timeout=20000)
  pg.wait_for_timeout(250)
  assert pg.locator('#lany-title').is_visible(),device
  assert pg.locator('#lany-cover-image').evaluate('(x)=>x.naturalWidth>0'),device
  pg.locator('button:has-text("동물 친구들")').first.click()
  assert pg.locator('#lany-friends-modal').is_visible(),device
  assert pg.locator('#lany-friends-grid .lany-friend-card').count()==30,(device,'roster')
  img=pg.locator('#lany-friends-grid img').first
  img.scroll_into_view_if_needed();assert img.evaluate('(x)=>x.complete && x.naturalWidth>0'),(device,'first img')
  dims=pg.evaluate('''()=>{let q=document.querySelector('.lany-friends-panel').getBoundingClientRect();return {height:q.height,top:q.top,bottom:q.bottom,viewport:innerHeight,scroll:document.querySelector('.lany-friends-grid').scrollHeight,client:document.querySelector('.lany-friends-grid').clientHeight}}''')
  assert dims['bottom']<=h+3 and dims['top']>=-3,(device,dims)
  pg.screenshot(path=str(root/'docs'/f'v10_{device}_friends.png'))
  pg.locator('.lany-friends-close').click()
  assert not pg.locator('#lany-friends-modal').is_visible()
  pg.locator('#lany-start-button').click()
  assert pg.locator('#lany-world-map').is_visible(),device
  pg.locator('#lany-map-levels button.lany-level:not([disabled])').first.click(timeout=10000)
  assert pg.locator('#lany-stage-prep').is_visible()
  pg.locator('#lany-prep-play').click()
  pg.wait_for_timeout(300)
  assert pg.locator('#board .cell').count()==64
  assert pg.locator('#board .lany-animal-face').count()==64
  assert pg.locator('#board .lany-animal-face').first.evaluate('(x)=>x.naturalWidth>0'),device
  board=pg.locator('#board-wrap').bounding_box()
  assert board['width'] <= w+2 and board['height']<=h-220,(device,board)
  pg.screenshot(path=str(root/'docs'/f'v10_{device}_game.png'))
  # stage/timer/state remain; open help and ensure it fits screen
  pg.evaluate('LanyShell.openHelp()')
  assert pg.locator('#overlay-tutorial').is_visible(),device
  popup=pg.locator('#overlay-tutorial .modal').bounding_box()
  assert popup['height']<=h+1,(device,popup)
  assert popup['x']>=-2 and popup['x']+popup['width']<=w+2,(device,popup)
  pg.locator('#overlay-tutorial button').click()
  # test exit modal dimensions and return to game
  pg.evaluate('LanyShell.openPause()')
  pp=pg.locator('#lany-pause .lany-dialog').bounding_box()
  assert pp['height']<=h+1 and pp['x']>=-2,(device,pp)
  pg.evaluate('LanyShell.resume()')
  # gallery from active game should pause tempo, resume after closing
  pg.evaluate('LanyFriends.open()')
  assert pg.locator('#lany-friends-modal').is_visible()
  assert not pg.evaluate('LanyTempo.isRunning()')
  pg.evaluate('LanyFriends.close()')
  assert pg.evaluate('LanyTempo.isRunning()')
  # pointer drag game still functional
  valid=pg.evaluate('''()=>{for(let r=0;r<8;r++)for(let c=0;c<8;c++)for(const [rr,cc] of [[r+1,c],[r,c+1]]){if(rr>=8||cc>=8||state.locked[r*8+c]||state.locked[rr*8+cc])continue;doSwap(r,c,rr,cc);let ok=findMatches().length;doSwap(r,c,rr,cc);if(ok)return [[r,c],[rr,cc]];}return null}''')
  assert valid,(device,'legal move')
  def center(rc):
   bb=pg.locator(f'.cell[data-r="{rc[0]}"][data-c="{rc[1]}"]').bounding_box()
   return (bb['x']+bb['width']/2,bb['y']+bb['height']/2)
  a,b=center(valid[0]),center(valid[1]);before=pg.evaluate('state.score')
  if not is_mobile:
   pg.mouse.move(*a);pg.mouse.down();pg.mouse.move(*b,steps=5);pg.mouse.up()
  else:
   pg.evaluate('''([a,b,c,d])=>{let el=document.elementFromPoint(a,b);el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:77,pointerType:'touch',button:0,clientX:a,clientY:b}));el.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:77,pointerType:'touch',button:0,clientX:c,clientY:d}));}''',[*a,*b])
  pg.wait_for_timeout(1400)
  assert pg.evaluate('state.score')>before,(device,'drag score')
  horizontal=pg.evaluate('document.documentElement.scrollWidth > innerWidth+2')
  assert not horizontal,(device,'horizontal overflow')
  assert not errs,(device,errs)
  assert not notfound,(device,notfound)
  res.append({'device':device,'viewport':f'{w}x{h}','animalFaces':64,'roster':30,'popupHeight':round(popup['height']),'boardWidth':round(board['width']),'dragScore':pg.evaluate('state.score'),'javascriptErrors':0,'missingAssets':0,'horizontalOverflow':False})
  browser.close()
(root/'docs'/'BROWSER_V10.json').write_text(json.dumps(res,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(res,ensure_ascii=False,indent=2))
