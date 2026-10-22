"""Short mobile install guide keeps its confirmation control visible."""
import os
from playwright.sync_api import sync_playwright

base = os.environ.get('LANYPANG_TEST_URL', 'http://127.0.0.1:8765/')
with sync_playwright() as pw:
    launch = {'headless': True, 'args': ['--no-sandbox']}
    if os.environ.get('LANYPANG_CHROMIUM_EXECUTABLE'):
        launch['executable_path'] = os.environ['LANYPANG_CHROMIUM_EXECUTABLE']
    browser = pw.chromium.launch(**launch)
    for width, height in ((320, 440), (320, 568), (390, 844)):
        context = browser.new_context(viewport={'width': width, 'height': height}, is_mobile=True, has_touch=True, service_workers='block')
        page = context.new_page()
        page.goto(base + '?v=2.3.52', wait_until='load')
        page.locator('.lany-art-install').click()
        card = page.locator('#lany-install-modal .lany-install-card')
        button = page.locator('#lany-install-modal .lany-install-done')
        assert card.is_visible() and button.is_visible(), (width, height)
        card_rect, button_rect = card.bounding_box(), button.bounding_box()
        assert button_rect['y'] >= card_rect['y'], (width, height, 'button above card')
        assert button_rect['y'] + button_rect['height'] <= min(height, card_rect['y'] + card_rect['height']) - 2, (width, height, 'button clipped')
        button.click()
        assert page.locator('#lany-install-modal').is_hidden(), (width, height, 'button cannot close guide')
        context.close()
    browser.close()
print('mobile install guide: pass')
