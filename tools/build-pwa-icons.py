"""Generate all shortcut and installable app PNG icons from the canonical 512px PNG.
No vector source, vector rendering library or vector file is used.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import struct

root=Path(__file__).resolve().parents[1]
assets=root/'web'/'assets'
source=assets/'lanypang-icon-512.png'
if not source.is_file():raise SystemExit(f'Missing master PNG: {source}')
master=Image.open(source).convert('RGBA')
if master.size!=(512,512):raise SystemExit('Expected 512x512 master PNG')
resample=Image.Resampling.LANCZOS

def save(name,size,image):
    target=assets/name
    image.resize((size,size),resample).save(target,'PNG',optimize=True)
    data=target.read_bytes()
    assert data[:8]==b'\x89PNG\r\n\x1a\n'
    assert struct.unpack('>II',data[16:24])==(size,size)
    assert len(data)>150
    print(f'{name}: {size}x{size}, {len(data)} bytes')

for size,label in [(16,'lanypang-favicon-16.png'),(32,'lanypang-favicon-32.png'),(48,'lanypang-favicon-48.png'),(180,'lanypang-apple-touch-180.png'),(192,'lanypang-icon-192.png')]:
    save(label,size,master)

# Keep a 12% margin for circular Android adaptive launchers.
mask=Image.new('RGBA',(512,512),(120,202,238,255))
small=master.resize((390,390),resample)
mask.alpha_composite(small,((512-390)//2,(512-390)//2))
save('lanypang-maskable-192.png',192,mask)
save('lanypang-maskable-512.png',512,mask)
# The canonical 512px input is retained byte-for-byte.
