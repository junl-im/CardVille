"""Verify real injected extra feature dialog IDs at compact mobile viewport heights."""
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
import mimetypes,json
root=Path(__file__).resolve().parents[1];web=root/'web';out=[]
for w,h in [(320,480),(320,568),(360,780),(390,844)]:
 with sync_playwright() as p:
  b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  pg=b.new_page(viewport={'width':w,'height':h},is_mobile=True,has_touch=True,service_workers='block')
  def route(r):
   path=urlparse(r.request.url).path or '/';f=web/(path.lstrip('/') if path!='/' else 'index.html')
   if f.is_file():r.fulfill(status=200,body=f.read_bytes(),content_type=mimetypes.guess_type(f.name)[0] or 'application/octet-stream')
   else:r.fulfill(status=404,body='not found')
  pg.route('**/*',route)
  pg.evaluate("""() => {const s={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>s[k]??null,setItem:(k,v)=>s[k]=String(v)}})}""")
  pg.set_content((web/'index.html').read_text().replace('<head>','<head><base href="http://lanypang.local/">',1),wait_until='load')
  statuses=[]
  for name,cmd,sel in [('난이도','Difficulty.showModal()','#difficulty-modal'),('2인 대전','Multiplayer.showSetupModal()','#mp-setup'),('단계 편집기','LevelEditor.openEditor()','#ng-level-editor')]:
   pg.evaluate(cmd);pg.wait_for_timeout(90);box=pg.locator(sel+' > div').bounding_box()
   assert box,(w,h,name)
   assert box['width']<=w+2 and box['height']<=h+1 and box['x']>=-2,(w,h,name,box)
   assert box['x']+box['width']<=w+2,(w,h,name,box)
   statuses.append(name)
   pg.evaluate('(sel)=>document.querySelector(sel).style.display="none"',sel)
  out.append({'viewport':f'{w}x{h}','popups':statuses,'overflow':False})
  b.close()
(root/'docs/BROWSER_DYNAMIC_POPUPS_v101.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(out,ensure_ascii=False))
