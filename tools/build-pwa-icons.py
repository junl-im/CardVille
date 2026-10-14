"""Build PWA icons from the approved 512px PNG master only.
No vector source or conversion is needed.
"""
from pathlib import Path
from io import BytesIO
from PIL import Image, ImageOps

root=Path(__file__).resolve().parents[1]
assets=root/'web'/'assets'
master=assets/'lanypang-icon-512.png'
assert master.is_file(),'Approved PNG source not found'
original=Image.open(BytesIO(master.read_bytes())).convert('RGBA')
assert original.size==(512,512),'PNG master must be exactly 512px'
plain=[(16,'lanypang-favicon-16.png'),(32,'lanypang-favicon-32.png'),(48,'lanypang-favicon-48.png'),
       (180,'lanypang-apple-touch-180.png'),(192,'lanypang-icon-192.png'),(512,'lanypang-icon-512.png')]
for size,name in plain:
    image=original.resize((size,size),Image.Resampling.LANCZOS)
    image.save(assets/name,optimize=True)
    print(f'{name} {size}x{size}')
for size in (192,512):
    background=Image.new('RGBA',(size,size),'#7bcbf0')
    inset=int(size*0.14)
    face=original.resize((size-inset*2,size-inset*2),Image.Resampling.LANCZOS)
    background.alpha_composite(face,(inset,inset))
    name=f'lanypang-maskable-{size}.png'
    background.save(assets/name,optimize=True)
    print(f'{name} {size}x{size}')
