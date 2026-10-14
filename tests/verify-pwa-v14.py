"""Chromium PWA checks: native prompt event, iOS manual instructions, offline re-launch."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json,os
root=Path(__file__).resolve().parents[1]
base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
result=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for name,ua,w,h in [
  ('android','Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 Chrome/126.0 Mobile Safari/537.36',390,844),
  ('ios','Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1',375,812),
  ('desktop','Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36',1366,768)]:
  context=browser.new_context(viewport={'width':w,'height':h},is_mobile=name!='desktop',has_touch=name!='desktop',user_agent=ua,service_workers='allow')
  page=context.new_page()
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.goto(base,wait_until='load',timeout=30000)
  page.wait_for_function("typeof window.LanyInstall==='object'")
  assert page.locator('link[rel="icon"][type="image/svg+xml"]').count()==1,name
  assert page.locator('link[rel="apple-touch-icon"]').count()==1,name
  assert page.locator('#lany-install-button').is_visible(),name
  page.locator('#lany-install-button').click()
  assert page.locator('#lany-install-modal').is_visible(),name
  if name=='ios':
   assert 'Safari' in page.locator('#lany-install-guide-hint').inner_text(),name
   assert '공유 버튼' in page.locator('#lany-install-guide-steps').inner_text(),name
  if name=='desktop':assert 'Chrome' in page.locator('#lany-install-guide-steps').inner_text(),name
  if name=='android':assert '앱 설치' in page.locator('#lany-install-guide-steps').inner_text(),name
  page.locator('.lany-install-done').click()
  assert not page.locator('#lany-install-modal').is_visible(),name
  page.evaluate("""() => {
   window.__nativePromptCount=0;
   const event=new Event('beforeinstallprompt',{cancelable:true});
   event.prompt=()=>{window.__nativePromptCount++;return Promise.resolve();};
   event.userChoice=Promise.resolve({outcome:'accepted'});
   window.dispatchEvent(event);
   window.__prevented=event.defaultPrevented;
  }""")
  assert page.evaluate('window.__prevented'),name
  page.locator('#lany-install-button').click()
  page.wait_for_function('window.__nativePromptCount===1')
  page.evaluate("window.dispatchEvent(new Event('appinstalled'))")
  assert not page.locator('#lany-install-button').is_visible(),name
  assert page.evaluate('LanyInstall.isInstalled()'),name
  assert not errors,(name,errors)
  result.append({'device':name,'nativePrompt':True,'manualGuide':True,'installedState':True})
  context.close()
 # Real offline test for a newly installed browser with query-string versioning:
 context=browser.new_context(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,service_workers='allow')
 page=context.new_page()
 page.goto(base+'?v=1.4.0&source=pwa',wait_until='load',timeout=30000)
 page.wait_for_function("navigator.serviceWorker && navigator.serviceWorker.controller!==null",timeout=30000)
 page.wait_for_function("typeof LanyShell==='object'")
 # Cold app reload with network blocked must still load versioned JS from Cache Storage.
 context.set_offline(True)
 page.goto(base+'?v=1.4.0&source=pwa',wait_until='domcontentloaded',timeout=30000)
 page.wait_for_function("typeof LanyShell==='object' && typeof LanyInstall==='object'",timeout=15000)
 page.locator('#lany-start-button').click()
 assert page.locator('#lany-world-map').is_visible(),'Offline installed app must open the stage map'
 result.append({'device':'offline','versionedAssetsFromCache':True,'appOpens':True})
 context.close();browser.close()
print(json.dumps(result,ensure_ascii=False,indent=2))
