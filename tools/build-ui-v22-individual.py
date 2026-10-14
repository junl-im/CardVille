"""Prepare individually generated transparent gameplay controls as raster assets."""
from pathlib import Path
from PIL import Image
import json

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "art-source" / "v22" / "individual"
OUTPUT = ROOT / "web" / "assets" / "ui" / "v22" / "individual"
SIZES = {
    "hud-frame": 1200,
    "button-blue": 600,
    "button-green": 600,
    "button-pink": 600,
}

def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for name, width in SIZES.items():
        image = Image.open(SOURCE / f"{name}.png").convert("RGBA")
        alpha = image.getchannel("A").point(lambda a: 0 if a < 24 else a)
        image.putalpha(alpha)
        bounds = image.getbbox()
        if bounds:
            image = image.crop(bounds)
        image.thumbnail((width, 1000), Image.Resampling.LANCZOS)
        image.save(OUTPUT / f"{name}.webp", "WEBP", quality=91, method=6)
    manifest_path = OUTPUT.parent / "manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    manifest["roles"]["individual"] = [f"individual/{name}.webp" for name in SIZES]
    manifest["count"] = sum(len(paths) for paths in manifest["roles"].values())
    manifest["generator"] += " + tools/build-ui-v22-individual.py"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print("OK individual game controls prepared")

if __name__ == "__main__":
    main()
