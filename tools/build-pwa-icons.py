"""Render canonical LanyPang mascot SVG into PNG icons for web + installed apps.
Run before static hosting deployment: python tools/build-pwa-icons.py
Dependencies: CairoSVG 2.7.1 (build-time only, never shipped to players).
"""
from pathlib import Path
import struct
import cairosvg

root=Path(__file__).resolve().parents[1]
assets=root/'web'/'assets'
sources={
    'lanypang-brand.svg':[(16,'lanypang-favicon-16.png'),(32,'lanypang-favicon-32.png'),(48,'lanypang-favicon-48.png'),(180,'lanypang-apple-touch-180.png'),(192,'lanypang-icon-192.png'),(512,'lanypang-icon-512.png')],
    'lanypang-maskable.svg':[(192,'lanypang-maskable-192.png'),(512,'lanypang-maskable-512.png')],
}
for src,targets in sources.items():
    original=assets/src
    if not original.is_file():raise SystemExit(f'Missing icon source: {original}')
    for size,dst in targets:
        target=assets/dst
        cairosvg.svg2png(url=str(original),write_to=str(target),output_width=size,output_height=size)
        data=target.read_bytes()
        assert data[:8]==b'\x89PNG\r\n\x1a\n',f'Invalid PNG: {target}'
        assert struct.unpack('>II',data[16:24])==(size,size),f'Bad PNG dimensions: {dst}'
        assert len(data)>150,f'PNG empty: {dst}'
        print(f'{dst}: {size}x{size}, {len(data)} bytes')
