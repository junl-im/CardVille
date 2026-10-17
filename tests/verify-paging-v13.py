"""Real Chromium regression for page navigation, mobile clipping and safe return to play."""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/"docs"/"paging-v13"
OUT.mkdir(parents=True,exist_ok=True)
BASE=os.environ.get("LANYPANG_TEST_URL","http://127.0.0.1:8765/")
RESULTS=[]

def audit_page(page, device, viewport):
    page.goto(BASE,wait_until="domcontentloaded",timeout=30000)
    page.wait_for_function("typeof LanyShell==='object' && typeof LanyFriends==='object'")
    assert page.locator("#lany-title").is_visible(),device
    page.locator("#lany-start-button").click()
    assert page.locator("#lany-world-map").is_visible(),device
    stage_size=3 if viewport[1]<470 else 6 if viewport[1]<650 else 9 if viewport[1]<900 else 12
    pages=(25+stage_size-1)//stage_size
    first_page_count=25//pages+(1 if 25%pages else 0)
    tabs_size=3 if viewport[0]<500 else 4 if viewport[0]<850 else 5
    assert page.locator("#lany-map-levels .lany-level").count()==first_page_count,(device,"map count")
    assert page.locator("#lany-world-tabs .lany-world-tab").count()==tabs_size,(device,"world tabs")
    assert page.locator("#lany-map-prev").is_disabled()
    assert page.locator("#lany-map-next").is_enabled()
    bounds=page.evaluate("""() => {
      const area=document.querySelector('.lany-map-section'),grid=document.getElementById('lany-map-levels');
      return {scroll:area.scrollHeight,client:area.clientHeight,gridHeight:grid.getBoundingClientRect().height,
        worldScroll:document.querySelector('.lany-world-tabs').scrollWidth,
        worldClient:document.querySelector('.lany-world-tabs').clientWidth}
    }""")
    assert bounds["scroll"]<=bounds["client"]+3,(device,"map overflow",bounds)
    assert bounds["worldScroll"]<=bounds["worldClient"]+3,(device,"world horizontal overflow",bounds)
    page.screenshot(path=str(OUT/f"{device}-map.png"))
    page.locator("#lany-map-next").click()
    assert page.locator("#lany-map-levels").get_attribute("data-page")=="1"
    page.locator("#lany-map-prev").click()
    assert page.locator("#lany-map-levels").get_attribute("data-page")=="0"
    page.locator("#lany-world-next").click()
    assert page.locator("#lany-world-tabs .lany-world-tab").count()<=tabs_size
    page.locator("#lany-world-prev").click()
    page.locator("#lany-map-levels .lany-level:not([disabled])").first.click()
    assert page.locator("#lany-stage-prep").is_visible()
    if viewport[1]<740:
        assert page.locator("#lany-prep-pager").is_visible()
        page.locator("#lany-prep-next").click()
        assert page.locator(".lany-time-option").is_visible()
        page.locator("#lany-prep-prev").click()
        assert page.locator(".lany-stage-stats").is_visible()
    page.locator("#lany-prep-play").click()
    assert page.locator("#board .cell").count()==64
    initial_board=page.evaluate("state.board.join(',')")
    page.evaluate("LanyShell.openMap()")
    assert page.locator("#lany-map-resume").is_visible()
    page.locator("#lany-map-resume").click()
    assert page.evaluate("state.board.join(',')")==initial_board
    page.evaluate("LanyFriends.open()")
    friend_size=6 if viewport[1]<650 else 9 if viewport[1]<950 else 12
    assert page.locator(".lany-friend-card").count()==friend_size,(device,"friends count")
    names=[]
    while True:
        names.extend(page.locator(".lany-friend-card span").all_text_contents())
        if page.locator("#lany-friends-next").is_disabled():break
        page.locator("#lany-friends-next").click()
    assert len(names)==30 and len(set(names))==30,(device,"roster",len(names))
    assert page.locator("#lany-friends-next").is_disabled()
    friends_bounds=page.evaluate("""() => {
      const x=document.querySelector('.lany-friends-panel'),g=document.querySelector('.lany-friends-grid');
      return {scroll:g.scrollHeight,client:g.clientHeight,panel:x.getBoundingClientRect().toJSON()}
    }""")
    assert friends_bounds["scroll"]<=friends_bounds["client"]+3,(device,"gallery overflow",friends_bounds)
    page.screenshot(path=str(OUT/f"{device}-friends.png"))
    page.locator(".lany-friends-close").click()
    page.evaluate("LanyShell.openHelp()")
    assert page.locator("#lany-help-prev").is_disabled()
    page.locator("#lany-help-next").click()
    assert page.locator('[data-tutorial-page="1"]').is_visible()
    assert page.locator("#lany-help-next").is_disabled()
    page.evaluate("LanyShell.closeTutorial()")
    page.evaluate("Difficulty.showModal()")
    assert page.locator(".lany-difficulty-option").count()==2
    page.locator(".lany-difficulty-card .lany-game-pager button").last.click()
    assert page.locator(".lany-difficulty-option").count()==2
    page.locator(".lany-difficulty-close").click()
    page.evaluate("LevelEditor.openEditor()")
    assert page.locator("#editor-grid button").count()==64
    page.locator("#lany-editor-next").click()
    assert page.locator("#ed-target").is_visible()
    assert page.locator("#lany-editor-next").is_disabled()
    page.locator("#lany-editor-prev").click()
    assert page.locator("#editor-grid").is_visible()
    page.locator('#ng-level-editor button:has-text("✕")').click()
    assert not page.locator("#ng-level-editor").is_visible()
    assert page.evaluate("state.board.join(',')")==initial_board
    assert page.evaluate("document.documentElement.scrollWidth<=innerWidth+3"),(device,"horizontal overflow")
    return {"viewport":device,"stagesPerPage":stage_size,"worldsPerTab":tabs_size,"friendsPerPage":friend_size,"totalFriends":len(names),
            "mapOverflow":False,"galleryOverflow":False,"boardPreserved":True}

with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,args=["--no-sandbox"])
    for device,w,h,mobile in [('mini',320,568,True),('standard',390,844,True),('desktop',1366,768,False)]:
        ctx=browser.new_context(viewport={"width":w,"height":h},is_mobile=mobile,has_touch=mobile,service_workers="block")
        page=ctx.new_page();errors=[];page.on("pageerror",lambda e:errors.append(str(e)))
        item=audit_page(page,device,(w,h))
        assert not errors,(device,errors)
        item["jsErrors"]=0
        RESULTS.append(item)
        ctx.close()
    browser.close()
print(json.dumps(RESULTS,ensure_ascii=False,indent=2))
