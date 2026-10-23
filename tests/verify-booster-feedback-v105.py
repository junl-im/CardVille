"""Each booster shows its result and color removal marks every affected tile."""
import os
from playwright.sync_api import sync_playwright

base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch={'headless':True,'args':['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path']=os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser=pw.chromium.launch(**launch)
    page=browser.new_page(viewport={'width':390,'height':844},service_workers='block')
    page.goto(base+'?v=2.3.55',wait_until='load')
    page.evaluate('LanyShell.start();LanyShell.openPrep(1);LanyShell.playPrepared()')
    page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
    assert page.evaluate("activateBooster('time');document.querySelector('.lany-booster-feedback')?.textContent")=='이동 +5회'
    assert page.evaluate('state.movesLeft')==page.evaluate('activeLevels()[0].moves+5')
    page.evaluate("activateBooster('shuffle')")
    assert page.locator('.lany-booster-feedback').inner_text()=='동물 친구 섞기'
    page.evaluate("activateBooster('hammer');applyBooster(0,0)")
    assert page.locator('.lany-booster-feedback').inner_text()=='망치 팡!'
    page.wait_for_function('!state.animating')
    result=page.evaluate("""() => {
      activateBooster('color');
      const gem=gemAt(0,0);
      const expected=state.board.filter((value,index)=>value===gem&&!state.walls[index]).length;
      applyBooster(0,0);
      return {expected,shown:document.querySelectorAll('.lany-booster-pop-color').length,
        label:document.querySelector('.lany-booster-feedback')?.textContent};
    }""")
    assert result['shown']==result['expected'] and result['label']==f"색상 {result['expected']}개 제거",result
    page.wait_for_function('!state.animating')
    browser.close()
print('booster result feedback v105: pass')
