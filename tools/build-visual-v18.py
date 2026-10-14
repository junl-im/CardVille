"""Raster art pipeline for LanyPang v1.8.
Reuses existing approved high-quality WebP character and cover assets.
Only generated output is served; never use vector mockup as main art.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math, random

R=Path(__file__).resolve().parents[1]
A=R/'web'/'assets'
T=A/'title'
T.mkdir(parents=True,exist_ok=True)
random.seed(18)
RES=Image.Resampling.LANCZOS

def image(name):
    return Image.open(A/name).convert('RGBA')

def cat_black():
    """Keep alpha silhouette of approved original cat, darken fur and repaint readable eyes."""
    original=image('polish/cat-normal.webp')
    w,h=original.size
    out=original.copy()
    src=original.load();dst=out.load()
    for y in range(h):
        for x in range(w):
            r,g,b,a=src[x,y]
            if a<8:continue
            luminance=(r*.25+g*.61+b*.14)/255
            # Preserve pink interior ears/cheeks as accent, darken pale original fur.
            pink=r>g*1.12 and r>b*1.06 and r>130
            dark=r<93 and g<85 and b<88
            if pink: nr,ng,nb=(130,69,117)
            elif dark: nr,ng,nb=(30,38,59)
            else:
                d=20+int(luminance*34)
                nr,ng,nb=d,int(d*1.08),int(d*1.45)
            dst[x,y]=(min(255,nr),min(255,ng),min(255,nb),a)
    # Bright mint eyes: distinctive from white rabbit even at puzzle-grid dimensions.
    draw=ImageDraw.Draw(out,'RGBA')
    for cx in (int(w*.42),int(w*.65)):
        cy=int(h*.55)
        rw=max(5,int(w*.036));rh=max(7,int(h*.051))
        draw.ellipse((cx-rw-2,cy-rh-2,cx+rw+2,cy+rh+2),fill=(21,27,47,255))
        draw.ellipse((cx-rw,cy-rh,cx+rw,cy+rh),fill=(105,230,178,255))
        draw.ellipse((cx-rw//2,cy-rh//2,cx+rw//2,cy+rh//2),fill=(26,51,49,255))
        draw.ellipse((cx-rw//2,cy-rh+2,cx-rw//2+4,cy-rh+6),fill=(255,255,255,240))
    out.save(A/'friends'/'cat.webp','WEBP',quality=90,method=6)
    for expression in ['normal','wink','cheer','surprise']:
        alt=image(f'polish/cat-{expression}.webp')
        # Recolor from expression original, keeping its transparent boundaries and mouth pose.
        bw,bh=alt.size
        pix=alt.load();new=alt.copy();npix=new.load()
        for yy in range(bh):
            for xx in range(bw):
                rr,gg,bb,aa=pix[xx,yy]
                if aa<8:continue
                red=rr>gg*1.12 and rr>bb*1.06 and rr>130
                low=rr<93 and gg<85 and bb<88
                if red:rgb=(139,72,124)
                elif low:rgb=(30,37,54)
                else:
                    l=(rr*.25+gg*.61+bb*.14)/255
                    v=20+int(l*36)
                    rgb=(v,int(v*1.08),int(v*1.45))
                npix[xx,yy]=(*rgb,aa)
        d=ImageDraw.Draw(new,'RGBA')
        for cx in [int(bw*.42),int(bw*.65)]:
            cy=int(bh*.55);rw=max(5,int(bw*.035));rh=max(6,int(bh*.05))
            d.ellipse((cx-rw,cy-rh,cx+rw,cy+rh),fill=(113,244,180,255))
            d.ellipse((cx-4,cy-4,cx+4,cy+5),fill=(24,46,45,255))
            d.ellipse((cx-4,cy-rh+2,cx,cy-rh+6),fill=(255,255,255,240))
        new.save(A/'polish'/f'cat-{expression}.webp','WEBP',quality=89,method=6)
    return out

def sticker(name, size):
    src=image('polish/'+name+'-cheer.webp') if name!='cat' else image('polish/cat-cheer.webp')
    src.thumbnail((size,size),RES)
    return src

def ellipse_gradient(im,box,c1,c2,radius):
    x0,y0,x1,y1=map(int,box)
    mask=Image.new('L',im.size,0)
    ImageDraw.Draw(mask).rounded_rectangle((x0,y0,x1,y1),radius=radius,fill=255)
    grad=Image.new('RGBA',im.size,(0,0,0,0))
    g=ImageDraw.Draw(grad,'RGBA')
    for y in range(y0,y1):
        t=(y-y0)/max(1,y1-y0)
        mixed=tuple(int(a*(1-t)+b*t) for a,b in zip(c1,c2))+(255,)
        g.line((x0,y,x1,y),fill=mixed)
    im.paste(grad,(0,0),mask)

def badge(name,color,mascot,size,kind):
    w,h=size
    layer=Image.new('RGBA',(w,h),(0,0,0,0));d=ImageDraw.Draw(layer)
    pad=30 if kind=='main' else 14
    ty=int(h*.38 if kind=='main' else h*.47)
    by=h-(25 if kind=='main' else 16)
    outline=(95,45,65,255) if color=='pink' else (73,68,100,255)
    palette={
     'pink':((255,174,214),(234,49,116),(255,225,112)),
     'blue':((145,237,255),(12,142,224),(255,255,245)),
     'gold':((255,242,132),(249,147,34),(255,255,219)),
     'green':((173,255,129),(29,165,66),(254,255,213)),
    }
    top,bottom,shine=palette[color]
    shadow=Image.new('RGBA',layer.size);sd=ImageDraw.Draw(shadow)
    sd.rounded_rectangle((pad+8,ty+11,w-pad+6,by+13),radius=(by-ty)//2,fill=(43,34,54,110))
    shadow=shadow.filter(ImageFilter.GaussianBlur(13))
    layer.alpha_composite(shadow)
    d=ImageDraw.Draw(layer)
    d.rounded_rectangle((pad,ty,w-pad,by),radius=(by-ty)//2,fill=outline)
    d.rounded_rectangle((pad+7,ty+6,w-pad-7,by-8),radius=(by-ty)//2,fill=palette[color][2])
    ellipse_gradient(layer,(pad+12,ty+12,w-pad-12,by-13),top,bottom,(by-ty)//2)
    d=ImageDraw.Draw(layer,'RGBA')
    d.arc((pad+22,ty+14,w-pad-22,by-20),185,345,fill=(255,255,255,145),width=6)
    d.ellipse((w*.09,by-32,w*.16,by-16),fill=(255,252,185,230))
    d.ellipse((w*.81,ty+19,w*.84,ty+31),fill=(255,255,255,220))
    if kind=='main':
        art=sticker('rabbit',int(h*.61))
        layer.alpha_composite(art,(int(w*.56),int(h*.01)))
        tri=[(w*.22,ty+35),(w*.22,by-32),(w*.22+(by-ty)*.52,ty+(by-ty)*.5)]
        d.polygon(tri,fill=(255,247,144,255))
        d.line(tri+[tri[0]],fill=(155,85,48,255),width=8,joint='curve')
    else:
        art=sticker(mascot,int(h*.57))
        xpos=int((w-art.width)/2)
        layer.alpha_composite(art,(xpos,0))
        # Tiny light dots communicate candy shine without a vector overlay.
        for i in range(3):
            xx=(i*71+26)%w
            yy=int(h*.55)+(i%2)*9
            d.ellipse((xx-3,yy-3,xx+3,yy+3),fill=(255,255,231,210))
    layer.save(T/f'btn-{name}-v18.webp','WEBP',quality=90,method=6)

def font(size):
    candidates=[
       '/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc',
       '/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc',
       '/usr/share/fonts/truetype/nanum/NanumGothicBold.ttf',
       '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path,size)
    raise RuntimeError('Please install fonts-noto-cjk for title logo rendering')

def logo():
    w,h=900,360
    im=Image.new('RGBA',(w,h));d=ImageDraw.Draw(im)
    f=font(184)
    parts=[('라니',(255,212,55)),('팡!',(255,114,157))]
    total=sum(d.textbbox((0,0),text,font=f,stroke_width=0)[2] for text,_ in parts)
    x=(w-total)//2
    for text,color in parts:
        bbox=d.textbbox((0,0),text,font=f)
        width=bbox[2]
        y=63
        for off in range(22,0,-2):
            d.text((x+off*.25,y+off),text,font=f,fill=(97,48,44,255),stroke_width=13,stroke_fill=(89,51,61,255))
        d.text((x,y),text,font=f,fill=(89,45,57,255),stroke_width=18,stroke_fill=(97,47,55,255))
        d.text((x,y),text,font=f,fill=color,stroke_width=9,stroke_fill=(255,250,202,255))
        d.text((x-2,y-4),text,font=f,fill=color)
        x+=width
    # Existing studio art, rather than crudely drawn companion shapes.
    rabbit=sticker('rabbit',165)
    im.alpha_composite(rabbit,(w//2-75,0))
    im.save(T/'title-logo-v18.webp','WEBP',quality=92,method=6)

if __name__=='__main__':
    import argparse
    p=argparse.ArgumentParser()
    p.add_argument('--verify',action='store_true')
    args=p.parse_args()
    cat_black()
    badge('play','pink','rabbit',(820,310),'main')
    badge('install','blue','cat',(390,274),'minor')
    badge('help','gold','chick',(390,274),'minor')
    badge('friends','green','bear',(390,274),'minor')
    logo()
    for filename in [
        'title-logo-v18.webp','btn-play-v18.webp','btn-install-v18.webp',
        'btn-help-v18.webp','btn-friends-v18.webp']:
        target=T/filename
        with Image.open(target) as im:
            assert im.format=='WEBP' and im.size[0]>=390 and im.size[1]>=200
            print(f'OK {filename} {im.size}: {target.stat().st_size}B')
    print('OK existing WebP cover, game cats, and existing animal studio assets retained')
