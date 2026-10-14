"""Build the v2.2 WebP inventory before verified sheet crops replace its art.

The build-visual-v18 entrypoint runs build-ui-v22-sheets.py immediately after
this file, verifying original PNG hashes and replacing visible placeholders.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import json
import math

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "web" / "assets"
OUT = ASSETS / "ui" / "v22"
RESAMPLE = Image.Resampling.LANCZOS
FONT_CANDIDATES = [
    "C:/Windows/Fonts/malgunbd.ttf",
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def font(size):
    for path in FONT_CANDIDATES:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def source(path):
    return Image.open(ASSETS / path).convert("RGBA")


def save(relative, image, quality=87):
    path = OUT / relative
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=quality, method=6)


def fit(image, size):
    result = Image.new("RGBA", size)
    copy = image.copy()
    copy.thumbnail(size, RESAMPLE)
    result.alpha_composite(copy, ((size[0] - copy.width) // 2, (size[1] - copy.height) // 2))
    return result


def panel(size, top, bottom, edge, radius=32, transparent_center=False):
    w, h = size
    image = Image.new("RGBA", size)
    shadow = Image.new("RGBA", size)
    ImageDraw.Draw(shadow).rounded_rectangle((10, 13, w - 10, h - 8), radius, fill=(76, 39, 68, 92))
    image.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(7)))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((5, 4, w - 10, h - 15), radius, fill=edge, outline="#fff9df", width=4)
    draw.rounded_rectangle((14, 12, w - 19, h - 24), max(8, radius - 8), fill=bottom)
    if transparent_center:
        draw.rounded_rectangle((26, 24, w - 31, h - 37), max(5, radius - 17), fill=(0, 0, 0, 0))
    else:
        overlay = Image.new("RGBA", size)
        od = ImageDraw.Draw(overlay)
        for y in range(17, h - 28):
            t = (y - 17) / max(1, h - 45)
            col = tuple(round(a * (1 - t) + b * t) for a, b in zip(top, bottom)) + (255,)
            od.line((19, y, w - 24, y), fill=col)
        mask = Image.new("L", size)
        ImageDraw.Draw(mask).rounded_rectangle((19, 17, w - 24, h - 29), max(7, radius - 12), fill=255)
        image.paste(overlay, (0, 0), mask)
    draw = ImageDraw.Draw(image)
    draw.arc((23, 16, w - 28, h - 38), 190, 340, fill=(255, 255, 255, 145), width=max(3, h // 28))
    for x, y in ((w // 9, h // 3), (w * 8 // 9, h * 2 // 3)):
        draw.ellipse((x - 4, y - 4, x + 4, y + 4), fill=(255, 251, 213, 205))
    return image


PALETTES = {
    "pink": ((255, 239, 247), (255, 172, 209), "#ae5c86"),
    "blue": ((231, 250, 255), (130, 212, 239), "#5a92b8"),
    "green": ((245, 255, 220), (160, 219, 137), "#789e61"),
    "gold": ((255, 251, 217), (255, 199, 116), "#ad784c"),
    "wood": ((255, 240, 204), (212, 160, 105), "#865c41"),
}


def make_panel(relative, size, palette, transparent_center=False, radius=None):
    a, b, edge = PALETTES[palette]
    save(relative, panel(size, a, b, edge, radius or min(size) // 5, transparent_center))


def make_title():
    logo = source("ui/v21/title/logo.webp")
    save("title/logo-main.webp", logo)
    save("title/logo-alt.webp", fit(logo, (720, 280)))
    save("title/logo-compact.webp", fit(logo, (450, 180)))
    for target, old in (
        ("btn-start", "title/play"), ("btn-install", "title/install"),
        ("btn-help", "title/help"), ("btn-friends", "title/friends"),
    ):
        save(f"buttons/{target}.webp", source(f"ui/v21/{old}.webp"))
    install = panel((390, 274), *PALETTES["blue"], radius=65)
    black_cat = source("friends/cat.webp")
    black_cat.thumbnail((170, 170), RESAMPLE)
    install.alpha_composite(black_cat, ((390 - black_cat.width) // 2, 0))
    save("buttons/btn-install.webp", install)
    for target in ("settings", "sound-on", "sound-off", "notice"):
        icon = Image.new("RGBA", (108, 108))
        d = ImageDraw.Draw(icon)
        color = "#72c8e4" if target.startswith("sound") else "#eab678"
        d.ellipse((8, 8, 100, 100), fill="#8d5374", outline="#fff9df", width=5)
        d.ellipse((14, 14, 94, 94), fill=color, outline="#fff5d6", width=4)
        d.arc((21, 20, 85, 65), 195, 336, fill=(255, 255, 255, 175), width=5)
        if target == "settings":
            for angle in range(0, 360, 45):
                theta = math.radians(angle)
                x1, y1 = 54 + 22 * math.cos(theta), 55 + 22 * math.sin(theta)
                x2, y2 = 54 + 32 * math.cos(theta), 55 + 32 * math.sin(theta)
                d.line((x1, y1, x2, y2), fill="#fff7df", width=9)
            d.ellipse((30, 31, 78, 79), fill="#fff8de", outline="#895974", width=4)
            d.ellipse((46, 47, 62, 63), fill="#a56683")
        elif target.startswith("sound"):
            d.polygon(((28, 47), (41, 47), (57, 35), (57, 74), (41, 61), (28, 61)), fill="#fff9df")
            if target.endswith("on"):
                d.arc((51, 38, 79, 72), -65, 65, fill="#fff9df", width=5)
                d.arc((50, 28, 90, 83), -62, 62, fill="#fff9df", width=4)
            else:
                d.line((65, 38, 83, 70), fill="#9a4265", width=8)
                d.line((83, 38, 65, 70), fill="#9a4265", width=8)
        else:
            d.ellipse((37, 67, 72, 77), fill="#fff9df")
            d.pieslice((30, 25, 79, 76), 180, 360, fill="#fff9df")
            d.ellipse((49, 75, 60, 86), fill="#fff9df")
        save(f"icons/btn-{target}.webp", icon)


def make_numbers():
    schemes = {
        "stage": ("#fff7c9", "#c97543", "#783f57"),
        "moves": ("#eafffa", "#4bbabb", "#2c687a"),
        "score": ("#fff4d0", "#f69e46", "#8c4a70"),
    }
    for kind, (face, rim, shadow) in schemes.items():
        f = font(105)
        for digit in "0123456789":
            image = Image.new("RGBA", (86, 130))
            draw = ImageDraw.Draw(image)
            box = draw.textbbox((0, 0), digit, font=f, stroke_width=5)
            x = (86 - (box[2] - box[0])) // 2 - box[0]
            y = (130 - (box[3] - box[1])) // 2 - box[1] - 3
            draw.text((x + 2, y + 5), digit, font=f, fill=shadow, stroke_width=7, stroke_fill=shadow)
            draw.text((x, y), digit, font=f, fill=face, stroke_width=5, stroke_fill=rim)
            draw.arc((x + 13, y + 15, x + 43, y + 37), 190, 335, fill=(255, 255, 255, 190), width=3)
            save(f"numbers/{kind}/{digit}.webp", image)
        label = {"stage": "단계", "moves": "남은 이동", "score": "점수"}[kind]
        image = Image.new("RGBA", (330, 90))
        draw = ImageDraw.Draw(image)
        draw.rounded_rectangle((5, 6, 324, 83), 34, fill=rim, outline="#fff7df", width=5)
        draw.text((165, 42), label, anchor="mm", font=font(43), fill="#fffbed", stroke_width=2, stroke_fill=shadow)
        save(f"numbers/{kind}/label-{kind}.webp", image)
    comma = Image.new("RGBA", (45, 130))
    ImageDraw.Draw(comma).ellipse((15, 91, 31, 110), fill="#f6a64e", outline="#894970", width=3)
    save("numbers/score/comma.webp", comma)


def star_art(lit):
    image = Image.new("RGBA", (100, 105))
    draw = ImageDraw.Draw(image)
    cx, cy = 50, 49
    vertices = []
    for i in range(10):
        angle = math.pi * i / 5 - math.pi / 2
        radius = 43 if i % 2 == 0 else 19
        vertices.append((cx + radius * math.cos(angle), cy + radius * math.sin(angle)))
    draw.polygon([(x + 2, y + 5) for x, y in vertices], fill=(87, 49, 68, 120))
    draw.polygon(vertices, fill="#ffdc65" if lit else "#b8a9bb", outline="#bd793c" if lit else "#8b7e95", width=4)
    if lit:
        draw.ellipse((29, 19, 46, 30), fill=(255, 255, 246, 220))
    return image


def make_result():
    save("result/star-empty.webp", star_art(False))
    for count in (1, 2, 3):
        image = Image.new("RGBA", (310, 110))
        for i in range(3):
            image.alpha_composite(star_art(i < count), (i * 103, 0))
        save(f"result/star-{count}.webp", image)
    for key, palette, text in (("clear", "gold", "단계 완료!"), ("fail", "blue", "아쉬워요!")):
        image = panel((660, 180), *PALETTES[palette], radius=70)
        d = ImageDraw.Draw(image)
        d.text((330, 82), text, anchor="mm", font=font(67), fill="#fff9e5",
               stroke_width=4, stroke_fill="#865b69")
        save(f"result/{key}-banner.webp", image)
    make_panel("result/result-score-frame.webp", (640, 170), "gold")
    make_panel("result/result-best-frame.webp", (640, 170), "green")


def make_frames():
    roles = {
        "stage": ((260, 170), "wood"), "goal": ((330, 165), "pink"),
        "moves": ((330, 165), "gold"), "score": ((330, 165), "blue"),
        "popup": ((800, 1000), "pink"), "map": ((950, 1150), "wood"),
        "result": ((800, 980), "gold"), "board": ((820, 820), "wood"),
        "small-button": ((340, 140), "blue"), "large-button": ((620, 170), "green"),
        "badge": ((220, 220), "gold"),
    }
    for key, (size, palette) in roles.items():
        make_panel(f"frames/frame-{key}.webp", size, palette, transparent_center=True)
    for key, palette in (("stage", "wood"), ("goal", "pink"), ("moves", "gold"),
                         ("score", "blue"), ("best", "green"), ("booster", "green"),
                         ("clock", "pink")):
        make_panel(f"hud/panel-{key}.webp", (340, 158), palette)
    make_panel("map/world-banner.webp", (780, 160), "wood")
    make_panel("map/stage-badge.webp", (180, 180), "gold")
    make_panel("popup/panel-prep.webp", (800, 1000), "pink")
    make_panel("popup/panel-dialog.webp", (800, 1000), "blue")


def make_backgrounds():
    originals = {
        "title-garden": "lanypang-cover.webp",
        "game-garden": "polish/game-meadow.webp",
        "map-village": "polish/world-map.webp",
        "result-clear": "polish/game-meadow.webp",
        "result-fail": "polish/world-map.webp",
    }
    for key, path in originals.items():
        original = source(path)
        image = ImageOps.fit(original, (900, 1600), method=RESAMPLE)
        if key.startswith("result-"):
            veil = Image.new("RGBA", image.size, (255, 232, 177, 52) if key.endswith("clear") else (103, 142, 205, 55))
            image.alpha_composite(veil)
        save(f"backgrounds/{key}.webp", image, quality=82)


def make_patterns():
    for key in ("leaf", "flower", "sparkle", "wood", "clover"):
        image = Image.new("RGBA", (192, 192), (255, 249, 226, 255))
        draw = ImageDraw.Draw(image)
        if key == "wood":
            for x in range(0, 192, 26):
                draw.arc((x - 42, -30, x + 55, 230), 70, 290, fill=(176, 119, 76, 75), width=5)
        else:
            for x, y in ((45, 48), (145, 125), (28, 154)):
                if key == "leaf":
                    draw.ellipse((x - 18, y - 8, x + 18, y + 8), fill=(118, 183, 104, 90))
                    draw.line((x - 14, y + 5, x + 16, y - 4), fill=(63, 121, 69, 105), width=2)
                elif key in ("flower", "clover"):
                    col = (249, 149, 176, 100) if key == "flower" else (106, 181, 104, 95)
                    for dx, dy in ((-10, 0), (10, 0), (0, -10), (0, 10)):
                        draw.ellipse((x + dx - 9, y + dy - 9, x + dx + 9, y + dy + 9), fill=col)
                    draw.ellipse((x - 5, y - 5, x + 5, y + 5), fill=(255, 212, 92, 130))
                else:
                    draw.line((x - 10, y, x + 10, y), fill=(255, 210, 110, 130), width=3)
                    draw.line((x, y - 10, x, y + 10), fill=(255, 210, 110, 130), width=3)
        save(f"patterns/pattern-{key}.webp", image)


def build():
    make_title()
    make_numbers()
    make_result()
    make_frames()
    make_backgrounds()
    make_patterns()
    roles = {}
    for directory in sorted(path for path in OUT.rglob("*") if path.is_dir()):
        images = sorted(path.relative_to(OUT).as_posix() for path in directory.glob("*.webp"))
        if images:
            roles[directory.relative_to(OUT).as_posix()] = images
    assets = sorted(path for images in roles.values() for path in images)
    (OUT / "manifest.json").write_text(json.dumps({
        "release": "2.2.0-beta",
        "source": ["web/assets/ui/v21/source-original-kit.zip",
                   "web/assets/polish", "web/assets/lanypang-cover.webp"],
        "generator": "tools/build-ui-v22.py",
        "count": len(assets), "roles": roles,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"OK v2.2 UI kit: {len(assets)} WebP assets")


if __name__ == "__main__":
    build()
