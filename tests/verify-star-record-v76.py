"""Best stars remain distinct from current-round stars; malformed saves are ignored."""
import os
from playwright.sync_api import sync_playwright

BASE=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
 browser=pw.chromium.launch(headless=True,args=['--no-sandbox'])
 for width,height in [(320,568),(390,844),(1366,768)]:
  page=browser.new_page(viewport={'width':width,'height':height},service_workers='block')
  page.goto(BASE+'?v=2.3.51',wait_until='load')
  result=page.evaluate('''() => {
    localStorage.setItem('sc_stars',JSON.stringify({'1':3,'2':5,'3':-1,'4':'oops','251':2}));
    setCampaignMode('normal');
    state.level=1;state.score=950;showWin(2,50);
    return {stars:state.levelStars,message:document.getElementById('win-msg').textContent,
      count:document.getElementById('win-stars').getAttribute('aria-label')};
  }''')
  assert result['stars']=={'1':3},(width,result)
  assert '이번 별 2개 획득 · 단계 최고 3개' in result['message'],(width,result)
  assert '2개 획득' in result['count'],(width,result)
  page.close()
 browser.close()
print('star record and save recovery checks passed')
