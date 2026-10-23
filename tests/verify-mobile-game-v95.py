"""Core game controls remain visible on short portrait and landscape phones."""
import os
from playwright.sync_api import sync_playwright

base = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path'] = os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser = pw.chromium.launch(**launch)
    for width, height in ((320, 480), (360, 640), (375, 667), (568, 320), (640, 360), (390, 844)):
        for mode in ('normal', 'hard', 'crazy'):
            context = browser.new_context(viewport={'width': width, 'height': height}, is_mobile=True, has_touch=True, service_workers='block')
            page = context.new_page()
            page.goto(base + '?v=2.3.54', wait_until='load')
            page.evaluate(f"LanyShell.start();LanyShell.setMode('{mode}');LanyShell.openPrep(1);LanyShell.playPrepared()")
            board = page.locator('#board-wrap').bounding_box()
            boosters = page.locator('.boosters').bounding_box()
            nav = page.locator('.lany-game-nav').bounding_box()
            assert board and boosters and nav, (width, height, mode, 'missing game element')
            assert board['width'] >= (165 if width == 320 else 250), (width, height, mode, 'board too small', board)
            assert nav['y'] + nav['height'] <= height, (width, height, mode, 'controls below screen', nav)
            assert boosters['y'] + boosters['height'] <= nav['y'], (width, height, mode, 'boosters overlap navigation')
            for button in page.locator('.lany-game-nav button:visible').all():
                rect = button.bounding_box()
                assert rect and rect['x'] >= 0 and rect['x'] + rect['width'] <= width, (width, height, mode, 'navigation button clipped', rect)
            if width > height:
                assert board['x'] + board['width'] <= nav['x'], (width, height, mode, 'board overlaps controls')
            assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width, height, mode, 'horizontal overflow')
            context.close()
    browser.close()
print('mobile game layout v95: pass')
