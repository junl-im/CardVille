"""Animal tile backgrounds remain distinct while selection and hint differ."""
import os
from playwright.sync_api import sync_playwright

base=os.environ.get('LANYPANG_TEST_URL','http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch={'headless':True,'args':['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path']=os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser=pw.chromium.launch(**launch)
    page=browser.new_page(viewport={'width':390,'height':844},service_workers='block')
    page.goto(base+'?v=2.3.52',wait_until='load')
    page.evaluate('LanyShell.start();LanyShell.openPrep(1);LanyShell.playPrepared()')
    page.locator('#lany-go-intro').wait_for(state='hidden',timeout=5000)
    result=page.evaluate("""() => {
      const board=document.getElementById('board'),cell=board.querySelector('.cell:not(.locked)');
      const colors=[];
      for(let kind=0;kind<7;kind++){
        cell.className='cell gem-'+kind;
        colors.push(getComputedStyle(cell).backgroundColor);
      }
      cell.className='cell selected';const selection=getComputedStyle(cell).outlineColor;
      cell.className='cell hint';const hint=getComputedStyle(cell).outlineColor;
      renderBoard();
      return {colors,selection,hint};
    }""")
    assert len(set(result['colors']))==7,result
    assert result['selection']!=result['hint'],result
    browser.close()
print('puzzle readability v105: pass')
