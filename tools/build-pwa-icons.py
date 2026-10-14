"""Build the installed-app icon set from the approved 512px PNG master."""
from pathlib import Path
from PIL import Image
import struct

root = Path(__file__).resolve().parents[1]
assets = root / "web" / "assets"
source = Image.open(assets / "lanypang-icon-512.png").convert("RGBA")
if source.size != (512, 512):
    raise SystemExit(f"Unexpected PWA PNG source size: {source.size}")

targets = [
    (16, "lanypang-favicon-16.png"),
    (32, "lanypang-favicon-32.png"),
    (48, "lanypang-favicon-48.png"),
    (180, "lanypang-apple-touch-180.png"),
    (192, "lanypang-icon-192.png"),
]
for size, name in targets:
    source.resize((size, size), Image.Resampling.LANCZOS).save(assets / name, "PNG", optimize=True)

for size in (192, 512):
    pad = Image.new("RGBA", (size, size), (127, 202, 234, 255))
    art_size = round(size * .8)
    art = source.resize((art_size, art_size), Image.Resampling.LANCZOS)
    pad.alpha_composite(art, ((size - art_size) // 2, (size - art_size) // 2))
    pad.save(assets / f"lanypang-maskable-{size}.png", "PNG", optimize=True)

for size, name in targets + [(192, "lanypang-maskable-192.png"), (512, "lanypang-maskable-512.png")]:
    data = (assets / name).read_bytes()
    assert data[:8] == b"\x89PNG\r\n\x1a\n"
    assert struct.unpack(">II", data[16:24]) == (size, size)
    assert len(data) > 150
    print(f"{name}: {size}x{size}, {len(data)} bytes")
