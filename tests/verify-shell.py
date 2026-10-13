from pathlib import Path
import json,re,base64
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
w=root/'web'
html=(w/'index.html').read_text()
def inline_css(m):
 path=m.group(1).removeprefix('./');txt=(w/path).read_text()
 if 'lany-shell.css' in path:
  bg=base64.b64encode((w/'assets/lanypang-cover.webp').read_bytes()).decode()
  txt=txt.replace("url('./assets/lanypang-cover.webp')",f"url('data:image/webp;base64,{bg}')")
 return '<style>'+txt+'</style>'
def inline_js(m):
 path=m.group(1).removeprefix('./');txt=(w/path).read_text().replace('</script','<\\/script')
 return '<script>'+txt+'</script>'
html=re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>',inline_css,html)
html=re.sub(r'<script[^>]+src="([^"]+)"[^>]*></script>',inline_js,html)
html=html.replace("<script>if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');</script>",'')
records=[]
for device,width,height in [('mobile',390,844),('desktop',1366,768)]:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  ctx=browser.new_context(viewport={'width':width,'height':height},is_mobile=device=='mobile',has_touch=device=='mobile')
  page=ctx.new_page()
  page.evaluate("""() => {let store={};Object.defineProperty(window,'localStorage',{value:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k],clear:()=>store={}}, configurable:true})}""")
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='load');page.wait_for_timeout(180)
  assert page.locator('#lany-title').is_visible(), 'splash must be visible'
  assert page.locator('#lany-start-button').is_visible(), 'start button'
  assert page.locator('#board .cell').count()==0, 'game should not auto-start'
  assert not page.locator('#overlay-tutorial').is_visible(), 'tutorial should not auto show'
  assert '라니팡' in page.title()
  page.screenshot(path=str(root/f'cover-{device}.png'))
  page.locator('#lany-title button:has-text("게임 방법")').click()
  assert page.locator('#overlay-tutorial').is_visible()
  assert '라니팡' in page.locator('#overlay-tutorial h2').inner_text()
  assert not re.search('How to Play|Let.s Play',page.locator('#overlay-tutorial').inner_text())
  page.locator('#overlay-tutorial button').click()
  assert page.locator('#lany-title').is_visible()
  page.locator('#lany-start-button').click()
  page.wait_for_timeout(350)
  assert not page.locator('#lany-title').is_visible()
  assert page.locator('#board .cell').count()==64
  assert page.evaluate('state.level')==1
  page.locator('header .header button').count() if False else None
  page.locator('button:has-text("☰ 메뉴")').click()
  assert page.locator('#lany-pause').is_visible()
  page.locator('#lany-pause button:has-text("나가기")').click()
  assert page.locator('#lany-exit').is_visible()
  assert '게임을 종료할까요' in page.locator('#lany-exit').inner_text()
  page.locator('#lany-exit button:has-text("계속 플레이")').click()
  assert not page.locator('#lany-exit').is_visible()
  page.evaluate('history.back()')
  page.wait_for_timeout(190)
  assert page.locator('#lany-exit').is_visible(), 'browser back must open in-game exit modal'
  page.locator('#lany-exit button:has-text("첫 화면으로")').click()
  assert page.locator('#lany-title').is_visible(), 'return to splash'
  # app state is preserved locally, no data erasure
  assert page.evaluate("localStorage.getItem('cv_last_level')")=='1'
  assert not errors, errors
  records.append({'device':device,'title':'라니팡','splash':True,'tutorial_ko':True,'started':True,'pause':True,'exit_confirm':True,'history_back':True,'returned_home':True,'errors':len(errors)})
  page.screenshot(path=str(root/f'finished-{device}.png'))
  browser.close()
(root/'docs/BROWSER_V07.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(records,ensure_ascii=False,indent=2))
