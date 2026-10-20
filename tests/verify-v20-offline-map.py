"""Real Chromium/PWA v2.0: 60 unique version probes must not pollute CacheStorage.
Also verifies offline boot, WebP stage medallions and world themes on mobile/PC.
"""
import json,os
from pathlib import Path
from playwright.sync_api import sync_playwright

root=Path(__file__).resolve().parents[1]
out=root/'docs'/'v20-offline-map';out.mkdir(parents=True,exist_ok=True)
base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
report=[]
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for name,w,h,mobile in [('mini',320,568,True),('phone',390,844,True),('desktop',1366,768,False)]:
  ctx=browser.new_context(viewport={'width':w,'height':h},is_mobile=mobile,has_touch=mobile,service_workers='allow')
  page=ctx.new_page();errors=[];failures=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('response',lambda r:failures.append((r.status,r.url)) if r.status>=400 else None)
  page.goto(base+'?v=2.3.45',wait_until='load',timeout=30000)
  page.wait_for_function("navigator.serviceWorker?.controller !== null",timeout=30000)
  page.wait_for_function("typeof LanyShell==='object'",timeout=30000)
  counts=page.evaluate("""async ()=>{
    const reg=await navigator.serviceWorker.ready;
    const all=await caches.keys(),key=all.find(x=>x.includes('lanypang-match-v2.3.45-ko'));
    if(!key)throw Error('missing v2 offline cache');
    const cache=await caches.open(key),before=await cache.keys();
    for(let i=0;i<60;i++)await fetch('./version.json?_fresh='+Date.now()+'-'+i,{cache:'no-store'});
    // Static url query variants must share one canonical cached entry, too.
    for(let i=0;i<20;i++)await fetch('./assets/friends/cat.webp?v='+i);
    const after=await cache.keys(),urls=after.map(x=>x.url);
    return {key,before:before.length,after:after.length,
      versionEntries:urls.filter(x=>x.includes('/version.json')).length,
      catEntries:urls.filter(x=>x.includes('/assets/friends/cat.webp')).length,
      offlineGallery:urls.filter(x=>/\\/assets\\/friends\\/[^/]+\\.webp$/.test(x)).length,
      offlineStages:urls.filter(x=>x.includes('/assets/map/stage-')&&x.includes('-v20.webp')).length
    };
  }""")
  assert counts['after']==counts['before'],(name,'cache grew',counts)
  assert counts['versionEntries']==0,(name,'version probes were saved',counts)
  assert counts['catEntries']==1,(name,'query variants multiply images',counts)
  assert counts['offlineGallery']==30,(name,'gallery is not offline',counts)
  assert counts['offlineStages']==4,(name,'map pictures missing from cache',counts)
  page.locator('#lany-start-button').click()
  assert page.locator('#lany-world-map').is_visible()
  current=page.locator('#lany-map-levels .lany-level.current')
  assert current.count()>=1,name
  assert 'v53/control.webp' in current.first.evaluate("e=>getComputedStyle(e).backgroundImage"),name
  locked=page.locator('#lany-map-levels .lany-level:disabled')
  assert locked.count()>=1,name
  assert 'v53/control.webp' in locked.first.evaluate("e=>getComputedStyle(e).backgroundImage"),name
  mapBg=page.locator('#lany-map-levels').evaluate("e=>getComputedStyle(e).backgroundImage")
  assert 'normal-forest.webp' in mapBg,name
  assert 'normal-forest.webp' in page.locator('#lany-world-map .lany-screen-scrim').evaluate('e=>getComputedStyle(e).backgroundImage'),name
  assert page.evaluate('document.documentElement.scrollWidth-innerWidth')<=3,(name,'horizontal overflow')
  page.screenshot(path=str(out/(name+'-map.png')))
  # Offline re-entry requires no network and must still boot from canonical index.
  ctx.set_offline(True)
  page.goto(base+'?v=2.3.45&source=pwa&offline=1',wait_until='load',timeout=30000)
  page.wait_for_function("typeof LanyShell==='object' && typeof LanyFriends==='object'")
  assert page.locator('#lany-start-button').is_visible(),name
  assert page.locator('.lany-illustrated-logo img').evaluate('e=>e.complete&&e.naturalWidth>0'),name
  page.locator('#lany-start-button').click()
  page.locator('#lany-map-continue').click()
  page.locator('#lany-prep-play').click()
  assert page.locator('#board .cell').count()==64,name
  assert not errors,(name,errors)
  assert not failures,(name,failures)
  report.append(dict(viewport=name,wh=f'{w}x{h}',cachedFiles=counts['after'],
    extraKeysAfter80Requests=counts['after']-counts['before'],
    offlineGallery=30,offlineMap=4,offlineBoot=True,jsErrors=0))
  ctx.close()
 browser.close()
print(json.dumps(report,ensure_ascii=False,indent=2))
