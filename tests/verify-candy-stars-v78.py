"""The same transparent candy stars load in the result, HUD, and map."""
import os
from playwright.sync_api import sync_playwright

BASE=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for width,height in [(320,568),(390,844),(1366,768)]:
  page=browser.new_page(viewport={'width':width,'height':height},service_workers='block')
  page.goto(BASE+'?v=2.3.34',wait_until='load')
  result=page.evaluate('''async() => {
    state.level=1;state.score=0;updateHUD();
    const checkpoints=[...document.querySelectorAll('.lany-star-checkpoint')];
    const empty=checkpoints.every(s=>s.getAttribute('src').endsWith('/unearned.webp'));
    state.score=LEVELS[0].goal*1.4;updateHUD();
    const earned=checkpoints.map(s=>s.getAttribute('src').split('/').at(-1));
    state.levelStars[1]=2;LanyShell.openMap();
    const map=[...document.querySelectorAll('.lany-level-star-count img')];
    showWin(2,0);
    const stars=[...document.querySelectorAll('#win-stars .star-item')];
    await Promise.all([...stars,...checkpoints,...map].map(img=>img.decode()));
    return {empty,earned,map:map.length,result:stars.map(s=>s.getAttribute('src').split('/').at(-1)),
      loaded:[...stars,...checkpoints,...map].every(img=>img.naturalWidth>0)};
  }''')
  assert result['empty'] and result['earned']==['earned.webp','earned.webp','unearned.webp'],(width,result)
  assert result['map']==2 and result['result']==['earned.webp','earned.webp','unearned.webp'],(width,result)
  assert result['loaded'],(width,result)
  page.close()
 browser.close()
print('candy stars load in all contexts')
