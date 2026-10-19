"""Check the final Exit flow in browser tabs and script-opened windows."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright, Error

BASE=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
ENGINES=['chromium','firefox','webkit']
if os.name=='nt':
 for label,path in [('chrome',r'C:\Program Files\Google\Chrome\Application\chrome.exe'),('edge',r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe')]:
  if Path(path).is_file(): ENGINES.append((label,path))
results=[]
with sync_playwright() as pw:
 for engine in ENGINES:
  name=engine if isinstance(engine,str) else engine[0]
  if isinstance(engine,tuple): browser=pw.chromium.launch(executable_path=engine[1],headless=True)
  else: browser=getattr(pw,engine).launch(headless=True)
  page=browser.new_page(viewport={'width':390,'height':844},service_workers='block')
  page.goto(BASE+'?exit-check=1',wait_until='load')
  assert page.locator('.lany-version').inner_text().strip()=='v2.3.24',name
  page.evaluate('LanyShell.openExit()')
  page.locator('#lany-exit button[data-lany-art="exit"]').click()
  page.wait_for_timeout(300)
  # A browser-owned tab may reject window.close(); the user must see a clear exit state.
  tab_closed=page.is_closed()
  if not tab_closed:
   assert page.locator('#lany-exit-finished').is_visible(),name
   assert '직접 닫아주세요' in page.locator('.lany-exit-browser-note').inner_text(),name
   page.locator('#lany-exit-finished button').click()
   assert page.locator('#lany-title').is_visible(),name
   assert page.locator('#lany-exit-finished').is_hidden(),name
  launcher=browser.new_page()
  launcher.goto(BASE,wait_until='load')
  launcher.set_content("<a href='./?exit-check=popup' target='_blank' id='exit-test-launcher'>Open</a>")
  with launcher.expect_popup() as pop: launcher.locator('#exit-test-launcher').click()
  child=pop.value
  child.wait_for_load_state('load')
  child.evaluate('LanyShell.openExit()')
  try: child.locator('#lany-exit button[data-lany-art="exit"]').click()
  except Error:
   if not child.is_closed(): raise
  try: child.wait_for_event('close',timeout=1500)
  except Exception: pass
  popup_closed=child.is_closed()
  assert popup_closed or child.locator('#lany-exit-finished').is_visible(),name
  results.append({'browser':name,'version':'v2.3.24','regularTab':'closed' if tab_closed else 'clear exit fallback','scriptOpenedWindow':'closed' if popup_closed else 'clear exit fallback'})
  browser.close()
print(json.dumps(results,ensure_ascii=False,indent=2))
