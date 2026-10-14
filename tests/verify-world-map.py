"""Isolated Chromium tests for v0.8 map + stage prep; no network or Firebase data changed."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import base64,json,re
root=Path(__file__).resolve().parents[1]
w=root/'web'
html=(w/'index.html').read_text()
def inject_css(m):
 p=m.group(1).removeprefix('./');s=(w/p).read_text()
 if 'lany-shell.css' in p:
  a=base64.b64encode((w/'assets/lanypang-cover.webp').read_bytes()).decode()
  s=s.replace("url('../assets/lanypang-cover.webp')",f"url('data:image/webp;base64,{a}')")
 return '<style>'+s+'</style>'
def inject_js(m):
 p=m.group(1).removeprefix('./');return '<script>'+((w/p).read_text().replace('</script','<\\/script'))+'</script>'
html=re.sub(r'<link\s+rel="stylesheet"\s+href="([^"]+)"\s*/?>',inject_css,html)
html=re.sub(r'<script[^>]+src="([^"]+)"[^>]*></script>',inject_js,html)
html=html.replace("<script>if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');</script>",'')
records=[]
for device,width,height in [('mobile',390,844),('desktop',1366,768)]:
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  context=browser.new_context(viewport={'width':width,'height':height},is_mobile=device=='mobile',has_touch=device=='mobile',service_workers='block')
  page=context.new_page()
  page.evaluate("""() => {let store={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>store[k]??null,setItem:(k,v)=>store[k]=String(v),removeItem:k=>delete store[k],clear:()=>store={}}})}""")
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(html,wait_until='load');page.wait_for_timeout(150)
  assert page.locator('#lany-title').is_visible()
  assert page.locator('#board .cell').count()==0
  page.locator('#lany-start-button').click()
  assert page.locator('#lany-world-map').is_visible(),'Start should show map'
  assert page.locator('#board .cell').count()==0,'No board before prep'
  assert page.locator('#lany-world-tabs button').count()==(3 if width<500 else 4 if width<850 else 5)
  assert page.locator('#lany-map-levels button').count()==(3 if height<470 else 6 if height<650 else 9 if height<900 else 12)
  assert page.locator('#lany-map-levels button:disabled').count()==page.locator('#lany-map-levels button').count()-1
  assert page.locator('#lany-map-levels button:not([disabled])').count()==1
  page.screenshot(path=str(root/'docs'/f'v08_{device}_map.png'))
  page.locator('#lany-map-levels button:not([disabled])').first.click()
  assert page.locator('#lany-stage-prep').is_visible()
  assert '1단계' in page.locator('#lany-prep-heading').inner_text()
  assert '650점' in page.locator('#lany-prep-goal').inner_text()
  assert page.locator('#board .cell').count()==0
  page.screenshot(path=str(root/'docs'/f'v08_{device}_prepare.png'))
  # prep back and phone back open map, not app exit
  page.evaluate('history.back()');page.wait_for_timeout(150)
  assert page.locator('#lany-world-map').is_visible(),'Back from prep must open map'
  page.locator('#lany-map-continue').click()
  page.locator('#lany-prep-play').click()
  page.wait_for_timeout(180)
  assert page.locator('#board .cell').count()==64
  assert not page.locator('#lany-stage-prep').is_visible()
  assert page.evaluate('state.level')==1
  page.screenshot(path=str(root/'docs'/f'v08_{device}_game.png'))
  # Drag and score - find actual valid legal swap
  coords=page.evaluate('''() => {for(let r=0;r<8;r++)for(let c=0;c<8;c++)for(const [rr,cc] of [[r+1,c],[r,c+1]]){
   if(rr>=8||cc>=8||state.locked[r*8+c]||state.locked[rr*8+cc])continue;
   doSwap(r,c,rr,cc); const matched=findMatches().length;doSwap(r,c,rr,cc);
   if(matched)return [[r,c],[rr,cc]];
  }return null}''')
  assert coords,'No valid swap'
  def center(rc):
   box=page.locator(f'.cell[data-r="{rc[0]}"][data-c="{rc[1]}"]').bounding_box()
   return (box['x']+box['width']/2,box['y']+box['height']/2)
  ax,ay=center(coords[0]);bx,by=center(coords[1]);before=page.evaluate('state.score')
  if device=='desktop':
   page.mouse.move(ax,ay);page.mouse.down();page.mouse.move(bx,by,steps=7);page.mouse.up()
  else:
   page.evaluate('''([ax,ay,bx,by])=>{const el=document.elementFromPoint(ax,ay);el.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,pointerId:55,pointerType:'touch',button:0,clientX:ax,clientY:ay}));el.dispatchEvent(new PointerEvent('pointerup',{bubbles:true,pointerId:55,pointerType:'touch',button:0,clientX:bx,clientY:by}));}''',[ax,ay,bx,by])
  page.wait_for_timeout(1200)
  assert page.evaluate('state.score')>before,'Drag did not score'
  # game map opens without resetting score; leaving stage prep returns map
  points=page.evaluate('state.score')
  page.evaluate('LanyShell.openMap()')
  assert page.locator('#lany-world-map').is_visible()
  assert page.evaluate('state.score')==points,'Opening map resets board/score'
  assert page.locator('#lany-map-resume').is_visible()
  page.locator('#lany-map-resume').click()
  assert page.evaluate('state.score')==points,'Returning from map reset board'
  assert page.locator('#board').is_visible()
  page.evaluate('LanyShell.openMap()')
  page.evaluate("state.unlockedLevels=[...Array(250)].map((_,i)=>i+1);state.levelStars[1]=3;state.bestScores[1]=800;localStorage.setItem('sc_unlocked',JSON.stringify(state.unlockedLevels))")
  page.evaluate('LanyShell.openMap(9)')
  assert '수정 동굴' in page.locator('#lany-world-title').inner_text()
  page.evaluate('LanyShell.mapPage(999)')
  assert page.locator('#lany-map-next').is_disabled()
  page.locator('#lany-map-levels button').last.click()
  assert page.locator('#lany-stage-prep').is_visible()
  assert '250단계' in page.locator('#lany-prep-heading').inner_text()
  assert '3,150점' in page.locator('#lany-prep-goal').inner_text()
  page.locator('#lany-prep-play').click()
  assert page.evaluate('state.level')==250
  # winning a level should show next stage PREP, not immediately reset its board
  page.evaluate("initGame(1);state.score=LEVELS[0].goal;checkEnd()")
  assert page.locator('#overlay-win').is_visible()
  page.locator('#overlay-win button:has-text("다음 단계 준비")').click()
  assert page.locator('#lany-stage-prep').is_visible()
  assert '2단계' in page.locator('#lany-prep-heading').inner_text()
  assert page.evaluate('state.level')==1,'Next level initialized prematurely'
  # Exit returns home and doesn't clear progression
  page.evaluate('LanyShell.openExit()')
  assert page.locator('#lany-exit').is_visible()
  page.locator('#lany-exit button:has-text("첫 화면으로")').click()
  assert page.locator('#lany-title').is_visible()
  assert page.evaluate("localStorage.getItem('sc_unlocked')") is not None
  assert not errors,(device,errors)
  records.append({'viewport':device,'regions':10,'stages':250,'lockedSelection':True,'prepareBeforePlay':True,'backToMap':True,'dragPoints':points,'winNextPrepare':True,'exitToTitle':True,'jsErrors':len(errors)})
  page.screenshot(path=str(root/'docs'/f'v08_{device}_title.png'))
  browser.close()
(root/'docs'/'BROWSER_V08.json').write_text(json.dumps(records,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(records,ensure_ascii=False,indent=2))
