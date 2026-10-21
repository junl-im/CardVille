"""Special effects follow cleared cells and travel in the right direction."""
import os
from playwright.sync_api import sync_playwright

BASE=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')

with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for width,height in [(390,844),(1366,768)]:
  page=browser.new_page(viewport={'width':width,'height':height},service_workers='block')
  page.goto(BASE+'?v=2.3.51',wait_until='load')
  page.locator('#lany-start-button').click()
  page.locator('#lany-map-continue').click()
  page.locator('#lany-prep-play').click()
  page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
  for special,expected,axis in [
   (2,[24,25,26,27,28,30,31],'row'),
   (3,[3,11,19,27,35,43,51,59],'col'),
   (1,[18,19,20,26,27,28,34,35,36],'burst'),
  ]:
   result=page.evaluate('''(special)=>{
    document.querySelectorAll('.lany-special-cell-wave').forEach(el=>el.remove());
    state.specials.fill(0);state.walls.fill(false);
    if(special===2)state.walls[29]=true;
    state.specials[27]=special;renderBoard();
    const cells=new Set([27]);expandSpecialMatches(cells);
    LanyPolish.onSpecial(expandSpecialMatches.lastActivated,cells);
    return {cleared:[...cells].sort((a,b)=>a-b),
      visual:[...document.querySelectorAll('.lany-special-cell-wave')]
        .map(el=>({index:Number(el.dataset.index),axis:el.dataset.axis,delay:getComputedStyle(el).animationDelay}))
        .sort((a,b)=>a.index-b.index)};
   }''',special)
   assert result['cleared']==expected,(width,special,'clear',result)
   assert [el['index'] for el in result['visual']]==expected,(width,special,'visual',result)
   assert all(el['axis']==axis for el in result['visual']),(width,special,'shape',result)
   if special==2:
    delays={el['index']:el['delay'] for el in result['visual']}
    assert delays[27]=='0s' and delays[28]!='0s',(width,'row wave timing',delays)
  extra=page.evaluate('''()=>{
   const kinds=new Array(64).fill('other');kinds[27]=kinds[28]='rabbit';
   const color=LanyPolish.specialFootprint([{index:27,special:5}],new Set([27,28,29]),null,kinds);
   state.specials.fill(0);state.walls.fill(false);state.specials[27]=state.specials[28]=1;
   const combo=buildSpecialSwapCells(27,28);
   const visual=LanyPolish.specialFootprint([{index:27,special:1},{index:28,special:1}],combo,combo);
   return {color:[...color.keys()].sort((a,b)=>a-b),combo:[...combo].sort((a,b)=>a-b),visual:[...visual.keys()].sort((a,b)=>a-b)};
  }''')
  assert extra['color']==[27,28],(width,'color targets',extra)
  assert extra['visual']==extra['combo'],(width,'paired bomb area',extra)
  page.close()
 browser.close()
print('special footprint visual checks passed')
