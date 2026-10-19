"""Result stars show the earned count at mobile and desktop widths."""
import os
from playwright.sync_api import sync_playwright

BASE=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for width,height in [(320,568),(390,844),(1366,768)]:
  page=browser.new_page(viewport={'width':width,'height':height},service_workers='block')
  page.goto(BASE+'?v=2.3.36',wait_until='load')
  result=page.evaluate('''() => {
    state.level=1;state.score=1000;
    showWin(2,100);
    const stars=[...document.querySelectorAll('#win-stars .star-item')];
    return {assets:stars.map(s=>s.getAttribute('src')),classes:stars.map(s=>s.className),
      count:document.getElementById('win-stars').getAttribute('aria-label'),
      message:document.getElementById('win-msg').textContent,
      detail:document.getElementById('win-detail').textContent};
  }''')
  assert result['assets']==['./assets/v78/stars/earned.webp','./assets/v78/stars/earned.webp','./assets/v78/stars/unearned.webp'],(width,result)
  assert result['classes'][2]=='star-item unearned',(width,result)
  assert '2개 획득' in result['count'] and '2개 획득' in result['message'],(width,result)
  assert '최종 점수로 별 판정' in result['detail'],(width,result)
  page.evaluate('showWin(3,0)')
  assert page.locator('#win-stars .star-item.unearned').count()==0,width
  page.close()
 browser.close()
print('result star visual counts passed')
