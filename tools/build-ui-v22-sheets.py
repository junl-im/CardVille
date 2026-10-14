"""Replace v2.2 placeholders with cuts from the verified ASSET MASTER PNGs."""
from collections import deque
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "art-source" / "v22"
OUT = ROOT / "web" / "assets" / "ui" / "v22"
MASTER = SRC / "master-manifest.json"
SHEETS = {
    "title-screen.png": "라니팡_귀여운_퍼즐_게임_타이틀_화면.png",
    "spring-ui.png": "귀여운_봄정원_퍼즐_게임_ui.png",
    "logo-variants.png": "라니팡_로고_변형_컬렉션.png",
    "number-guide.png": "화려한_퍼즐게임_숫자_ui_가이드.png",
    "frame-sheet.png": "알록달록_숲속_퍼즐_ui_프레임_시트.png",
    "star-result-sheet.png": "반짝이는_별_테마_결과_ui_에셋_시트.png",
    "background-atlas.png": "귀여운_게임_배경과_패턴_이미지_아틀라스.png",
}


def verify_sources():
    expected = {entry["filename"]: entry for entry in json.loads(MASTER.read_text(encoding="utf-8"))["files"]}
    for local, original in SHEETS.items():
        path = SRC / local
        entry = expected[original]
        data = path.read_bytes()
        digest = hashlib.sha256(data).hexdigest()
        if len(data) != entry["bytes"] or digest != entry["sha256"]:
            raise ValueError(f"Original PNG integrity mismatch: {local}")
    return {name: Image.open(SRC / name).convert("RGBA") for name in SHEETS}


def clear_cream(image):
    """Flood only the cream sheet backdrop from the cut's outside edge."""
    im = image.copy()
    px = im.load()
    w, h = im.size
    seen = bytearray(w * h)
    queue = deque()

    def backdrop(x, y):
        r, g, b, _ = px[x, y]
        return r >= 220 and g >= 208 and b >= 185 and 1 <= r - g <= 18 and 6 <= g - b <= 28

    for x in range(w):
        for y in (0, h - 1):
            if backdrop(x, y):
                k = y * w + x
                if not seen[k]:
                    seen[k] = 1
                    queue.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if backdrop(x, y):
                k = y * w + x
                if not seen[k]:
                    seen[k] = 1
                    queue.append((x, y))
    while queue:
        x, y = queue.popleft()
        px[x, y] = (0, 0, 0, 0)
        for a, b in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= a < w and 0 <= b < h:
                k = b * w + a
                if not seen[k] and backdrop(a, b):
                    seen[k] = 1
                    queue.append((a, b))
    bounds = im.getbbox()
    return im.crop(bounds) if bounds else im


def save(path, sheet, box, *, transparent=True, width=None, quality=90):
    image = sheet.crop(box)
    if transparent:
        image = clear_cream(image)
    if width and image.width != width:
        image = image.resize((width, round(image.height * width / image.width)), Image.Resampling.LANCZOS)
    target = OUT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    image.save(target, "WEBP", quality=quality, method=6)


def build():
    sheets = verify_sources()
    logo = sheets["logo-variants.png"]
    numbers = sheets["number-guide.png"]
    frames = sheets["frame-sheet.png"]
    stars = sheets["star-result-sheet.png"]
    atlas = sheets["background-atlas.png"]

    for path, box in {
        "title/logo-main.webp": (14, 30, 617, 508),
        "title/logo-alt.webp": (620, 105, 1114, 466),
        "title/logo-compact.webp": (562, 1040, 1114, 1337),
    }.items():
        save(path, logo, box)

    title = sheets["title-screen.png"]
    for name, box in {
        "settings": (588, 26, 691, 132),
        "sound-on": (701, 26, 808, 132),
        "notice": (816, 26, 922, 132),
    }.items():
        icon = title.crop(box)
        mask = Image.new("L", icon.size)
        ImageDraw.Draw(mask).rounded_rectangle((2, 2, icon.width - 3, icon.height - 3), 31, fill=255)
        icon.putalpha(mask)
        icon.save(OUT / "icons" / f"btn-{name}.webp", "WEBP", quality=91, method=6)
    muted = title.crop((701, 26, 808, 132))
    mask = Image.new("L", muted.size)
    ImageDraw.Draw(mask).rounded_rectangle((2, 2, muted.width - 3, muted.height - 3), 31, fill=255)
    muted.putalpha(mask)
    ImageDraw.Draw(muted).line((37, 34, 78, 78), fill=(199, 44, 82, 255), width=10)
    muted.save(OUT / "icons" / "btn-sound-off.webp", "WEBP", quality=91, method=6)

    # Keep the approved blue button and replace its tiny cat with the verified
    # black-cat face from the new spring UI source sheet.
    approved_install = ROOT / "web/assets/ui/v21/title/install.webp"
    old_install = Image.open(approved_install).convert("RGBA")
    install = Image.new("RGBA", old_install.size)
    install.alpha_composite(old_install.crop((0, 109, old_install.width, old_install.height)), (0, 109))
    cat = sheets["spring-ui.png"].crop((470, 435, 578, 555))
    mask = Image.new("L", cat.size)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((3, 21, 105, 116), fill=255)
    draw.polygon(((7, 45), (15, 11), (46, 27)), fill=255)
    draw.polygon(((65, 27), (94, 11), (103, 45)), fill=255)
    pixels = cat.load()
    for y in range(cat.height):
        for x in range(cat.width):
            r, g, b, _ = pixels[x, y]
            if r > 190 and g > 135 and b < 235 and r - g < 90:
                mask.putpixel((x, y), 0)
    cat.putalpha(mask.filter(ImageFilter.GaussianBlur(1.1)))
    cat = cat.resize((151, 168), Image.Resampling.LANCZOS)
    install.alpha_composite(cat, (120, 0))
    install.save(OUT / "buttons/btn-install.webp", "WEBP", quality=92, method=6)

    for kind, top, bottom in (("stage", 91, 228), ("moves", 503, 637), ("score", 892, 1026)):
        for digit in range(10):
            left = 20 + digit * 109
            save(f"numbers/{kind}/{digit}.webp", numbers, (left, top, left + 100, bottom), width=90)
    save("numbers/score/comma.webp", numbers, (104, 1044, 185, 1138), width=54)
    # The score label is cut from the spring UI, where it appears on the bar.
    save("numbers/score/label-score.webp", sheets["spring-ui.png"], (78, 304, 170, 386), transparent=False)

    for path, box in {
        "result/star-empty.webp": (27, 38, 188, 193),
        "result/star-1.webp": (21, 257, 381, 587),
        "result/star-2.webp": (384, 258, 743, 587),
        "result/star-3.webp": (742, 257, 1112, 588),
    }.items():
        save(path, stars, box)

    frame_boxes = {
        "stage": (15, 60, 381, 426),
        "goal": (392, 80, 817, 285),
        "moves": (394, 80, 817, 285),
        "score": (390, 338, 1116, 454),
        "popup": (15, 60, 381, 426),
        "map": (20, 825, 562, 1052),
        "result": (15, 60, 381, 426),
        "board": (15, 60, 381, 426),
        "small-button": (900, 1144, 1100, 1358),
        "large-button": (20, 825, 562, 1052),
        "badge": (301, 515, 575, 777),
    }
    for name, box in frame_boxes.items():
        save(f"frames/frame-{name}.webp", frames, box)
    for name, role in {"stage": "stage", "goal": "goal", "moves": "goal", "score": "map", "best": "map", "booster": "small-button", "clock": "badge"}.items():
        save(f"hud/panel-{name}.webp", frames, frame_boxes[role])
    for path, box in {
        "map/world-banner.webp": (20, 825, 562, 1052),
        "map/stage-badge.webp": (301, 515, 575, 777),
        "popup/panel-prep.webp": (15, 60, 381, 426),
        "popup/panel-dialog.webp": (15, 60, 381, 426),
        "result/clear-banner.webp": (562, 949, 1115, 1096),
        "result/fail-banner.webp": (562, 949, 1115, 1096),
        "result/result-score-frame.webp": (20, 825, 562, 1052),
        "result/result-best-frame.webp": (20, 825, 562, 1052),
    }.items():
        save(path, frames, box)

    backgrounds = {
        "title-garden": (14, 107, 374, 448),
        "game-garden": (382, 106, 741, 449),
        "map-village": (14, 107, 374, 448),
        "result-clear": (380, 500, 743, 849),
        "result-fail": (380, 500, 743, 849),
    }
    for name, box in backgrounds.items():
        save(f"backgrounds/{name}.webp", atlas, box, transparent=False, width=720, quality=88)
    patterns = {
        "clover": (15, 1020, 189, 1315),
        "flower": (199, 1020, 375, 1315),
        "sparkle": (382, 1020, 558, 1315),
        "wood": (744, 1020, 919, 1315),
        "leaf": (931, 1020, 1108, 1315),
    }
    for name, box in patterns.items():
        save(f"patterns/pattern-{name}.webp", atlas, box, transparent=False, width=192, quality=86)

    manifest_path = OUT / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["source"] = [f"art-source/v22/{name}" for name in SHEETS]
    manifest["verified_sha256"] = {name: hashlib.sha256((SRC / name).read_bytes()).hexdigest() for name in SHEETS}
    manifest["generator"] = "tools/build-ui-v22.py + tools/build-ui-v22-sheets.py"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print("OK verified source sheet cuts applied")


if __name__ == "__main__":
    build()
