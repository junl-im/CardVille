"""Browser regression for the v2.2 image kit at target phone and desktop sizes."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json
import os

BASE = os.environ.get("LANYPANG_TEST_URL", "http://127.0.0.1:8765/")
OUT = Path(__file__).resolve().parents[1] / "docs" / "ui-v22"
OUT.mkdir(parents=True, exist_ok=True)
report = []

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True, args=["--no-sandbox"])
    for name, width, height, mobile in [
        ("small", 320, 568, True), ("phone", 390, 844, True),
        ("desktop", 1366, 768, False),
    ]:
        context = browser.new_context(
            viewport={"width": width, "height": height},
            is_mobile=mobile, has_touch=mobile, service_workers="block",
        )
        page = context.new_page()
        errors, missing = [], []
        page.on("pageerror", lambda error: errors.append(str(error)))
        page.on("response", lambda response: missing.append(response.url) if response.status >= 400 else None)
        page.goto(BASE + "?v=2.2.0", wait_until="load", timeout=30000)
        page.wait_for_function("typeof LanyShell==='object' && typeof LanyNumbers22==='object'")

        for selector in [
            ".lany-illustrated-logo img", "#lany-start-button img",
            "#lany-install-button img", ".lany-art-help img", ".lany-art-friends img",
        ]:
            image = page.locator(selector)
            assert image.evaluate("e=>e.complete&&e.naturalWidth>0"), (name, selector)
            assert "/ui/v22/" in image.get_attribute("src"), (name, selector)
        assert "title-garden.webp" in page.locator("#lany-title").evaluate(
            "e=>getComputedStyle(e).backgroundImage")
        buttons = page.locator(".lany-title-shortcuts .lany-art-small")
        assert buttons.count() == 3
        assert max(buttons.nth(i).bounding_box()["y"] for i in range(3)) - min(
            buttons.nth(i).bounding_box()["y"] for i in range(3)) < 4
        page.screenshot(path=str(OUT / f"{name}-title.png"))
        page.locator(".lany-title-tools button[aria-label='설정']").click()
        assert page.locator("#lany-settings-v22").is_visible()
        page.locator("#lany-settings-v22 .lany-v22-close").click()
        page.locator(".lany-title-tools button[aria-label='공지']").click()
        assert page.locator("#lany-notice-v22").is_visible()
        page.locator("#lany-notice-v22 .lany-v22-close").click()
        page.locator("#lany-title-sound").click()
        assert page.locator("#lany-title-sound").get_attribute("aria-pressed") == "true"
        page.locator("#lany-title-sound").click()
        assert page.locator("#lany-title-sound").get_attribute("aria-pressed") == "false"
        page.evaluate("document.querySelector('#lany-install-button').hidden=true")
        assert not page.locator("#lany-install-button").is_visible()
        page.evaluate("document.querySelector('#lany-install-button').hidden=false")

        page.locator("#lany-start-button").click()
        assert page.locator("#lany-world-map").is_visible()
        assert "map-village.webp" in page.locator("#lany-world-map").evaluate(
            "e=>getComputedStyle(e).backgroundImage")
        page.screenshot(path=str(OUT / f"{name}-map.png"))
        page.locator("#lany-map-continue").click()
        assert page.locator("#lany-stage-prep").is_visible()
        assert page.locator("#lany-prep-goal img").count() > 0
        assert page.locator("#lany-prep-moves img").count() > 0
        page.screenshot(path=str(OUT / f"{name}-prep.png"))
        page.locator("#lany-prep-play").click()
        assert page.locator("#board .cell").count() == 64
        assert page.locator("#score-val img").count() > 0
        assert page.locator("#level-val img").count() > 0
        assert page.locator("#moves-label img").count() > 0
        assert "individual/hud-frame.webp" in page.locator("#app>.header .hud").evaluate(
            "e=>getComputedStyle(e).backgroundImage")
        assert "individual/button-pink.webp" in page.locator(
            ".lany-game-nav .lany-game-pause-button").evaluate(
            "e=>getComputedStyle(e).backgroundImage")
        page.screenshot(path=str(OUT / f"{name}-game.png"))
        for stars in (1, 2, 3):
            page.evaluate("(stars)=>showWin(stars)", stars)
            image = page.locator("#win-stars img")
            assert image.get_attribute("src").endswith(f"star-{stars}.webp")
            page.wait_for_function(
                "document.querySelector('#win-stars img')?.complete && document.querySelector('#win-stars img').naturalWidth>0")
            assert page.locator("#win-score img").count() > 0
            page.screenshot(path=str(OUT / f"{name}-star-{stars}.png"))
        page.evaluate("showLose()")
        assert "fail-banner.webp" in page.locator("#overlay-lose h2").evaluate(
            "e=>getComputedStyle(e).backgroundImage")
        assert page.locator("#overlay-lose .lany-v22-empty-star").evaluate(
            "e=>e.complete&&e.naturalWidth>0")
        page.screenshot(path=str(OUT / f"{name}-fail.png"))
        assert page.evaluate("document.documentElement.scrollWidth-innerWidth") <= 3
        assert not errors, (name, errors)
        assert not missing, (name, missing)
        report.append({"viewport": f"{width}x{height}", "images": "loaded",
                       "screens": 5, "starStates": 3, "errors": 0})
        context.close()
    browser.close()

print(json.dumps(report, ensure_ascii=False, indent=2))
