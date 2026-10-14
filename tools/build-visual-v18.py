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

# v2.0: real raster map medallions built from the same approved WebP mascot studio.
# The web game displays these 256px WebP sprites, not CSS-drawn SVG stage discs.
def build_stage_medallions():
    from PIL import ImageDraw,ImageFilter
    target=A/'map'
    target.mkdir(parents=True,exist_ok=True)
    styles={
      'ordinary':('#b5f7ff','#398ee4','#1f629b',None),
      'current':('#fffad1','#ffa739','#c17c22','rabbit'),
      'boss':('#ffdeea','#f474b8','#9e4b84','bear'),
      'locked':('#f0f0f9','#abb0c0','#7c849c',None)
    }
    for name,(hi,lo,border,character) in styles.items():
        size=256
        art=Image.new('RGBA',(size,size),(0,0,0,0))
        shadow=Image.new('RGBA',(size,size),(0,0,0,0))
        d=ImageDraw.Draw(shadow)
        d.ellipse((26,30,232,237),fill=(54,30,60,130))
        art.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(12)))
        d=ImageDraw.Draw(art)
        d.ellipse((12,12,244,244),fill=border,width=1)
        d.ellipse((20,17,237,233),fill='#fff8e1')
        for y in range(23,228):
            t=(y-23)/205
            # Draw 1px color bands inside the circular jewel via mask.
            from PIL import ImageColor
            rgb1=ImageColor.getrgb(hi);rgb2=ImageColor.getrgb(lo)
            color=tuple(int(x*(1-t)+z*t) for x,z in zip(rgb1,rgb2))
            half=int((101**2-(y-125)**2)**.5) if abs(y-125)<=100 else 0
            if half:
                d.line((128-half,y,128+half,y),fill=(*color,255),width=1)
        d.ellipse((27,25,229,227),outline='#fffbea',width=9)
        d.arc((45,39,210,183),195,308,fill=(255,255,255,165),width=12)
        if character:
            mascot=image('polish/'+character+'-cheer.webp')
            mascot.thumbnail((118,118),RES)
            art.alpha_composite(mascot,(int((256-mascot.width)/2),20))
        if name=='locked':
            # Simple locked state drawn as raster hardware, not an emoji font.
            d.rounded_rectangle((93,92,164,158),radius=12,fill='#8291a7',outline='#f8f5e7',width=7)
            d.arc((100,70,157,131),180,359,fill='#66738c',width=11)
            d.ellipse((123,113,136,126),fill='#fff6d6')
        d.ellipse((73,176,87,190),fill=(255,255,247,155))
        filename=target/f'stage-{name}-v20.webp'
        art.save(filename,'WEBP',quality=91,method=6)
        with Image.open(filename) as output:
            assert output.format=='WEBP' and output.size==(256,256)
        print('OK stage medallion',name,filename.stat().st_size)

if __name__=='__main__':
    build_stage_medallions()

# v2.1 — unified independent raster game UI kit, rebuilt reproducibly
# from the approved animal WebP library. No temporary SVG heroes.
def build_ui_v21():
    from PIL import ImageDraw, ImageColor, ImageFilter
    base=A/'ui'/'v21'
    groups=['title','buttons','hud','popup','map','booster','icons']
    for group in groups:(base/group).mkdir(parents=True,exist_ok=True)
    schemes={
        'pink':('#ffe8f3','#ff76b4','#de377f','#833757'),
        'blue':('#d9faff','#70cdf9','#3289df','#2c568c'),
        'gold':('#fff6ba','#ffce65','#f4a02f','#996032'),
        'green':('#eaffb5','#8be76a','#40ba61','#437343'),
        'wood':('#ffe5b9','#d4935c','#ad693f','#774837'),
        'red':('#ffe4ea','#fa8393','#d94f75','#843e57'),
    }
    def panel(name,palette,size=(520,144),rounded=52,detail=True):
        top,mid,low,edge=schemes[palette]
        w,h=size
        out=Image.new('RGBA',size)
        sh=Image.new('RGBA',size)
        ds=ImageDraw.Draw(sh)
        ds.rounded_rectangle((17,18,w-12,h-9),radius=rounded,fill=(61,36,58,95))
        out.alpha_composite(sh.filter(ImageFilter.GaussianBlur(8)))
        d=ImageDraw.Draw(out,'RGBA')
        d.rounded_rectangle((7,5,w-8,h-16),radius=rounded,fill=edge,outline='#fff9de',width=5)
        d.rounded_rectangle((14,11,w-15,h-22),radius=max(10,rounded-6),fill=low)
        bbox=(19,15,w-20,h-28)
        grad=Image.new('RGBA',size)
        gd=ImageDraw.Draw(grad,'RGBA')
        c1=ImageColor.getrgb(top);c2=ImageColor.getrgb(mid)
        for y in range(bbox[1],bbox[3]+1):
            t=(y-bbox[1])/max(1,bbox[3]-bbox[1])
            r=tuple(int(a*(1-t)+b*t) for a,b in zip(c1,c2))
            gd.line((bbox[0],y,bbox[2],y),fill=(*r,255))
        mask=Image.new('L',size)
        ImageDraw.Draw(mask).rounded_rectangle(bbox,radius=max(8,rounded-11),fill=255)
        out.paste(grad,(0,0),mask)
        d=ImageDraw.Draw(out,'RGBA')
        d.arc((30,23,w-32,h-31),190,339,fill=(255,255,255,183),width=8)
        if detail:
            d.ellipse((int(w*.11),int(h*.35),int(w*.12+12),int(h*.36+12)),fill=(255,255,240,170))
            d.ellipse((int(w*.82),int(h*.55),int(w*.82+9),int(h*.55+9)),fill=(255,255,235,140))
            if palette=='wood':
                d.arc((19,19,w-25,h-43),5,178,fill=(127,67,39,65),width=3)
        return out
    def save(target,pic):
        pic.save(target,'WEBP',quality=90,method=6)
        with Image.open(target) as im:
            assert im.format=='WEBP'
        print('OK UI',target.relative_to(A),target.stat().st_size)
    # Title visuals preserve real approved character silhouettes, not substitute vector mascots.
    for key,source in [('logo','title-logo-v18.webp'),('play','btn-play-v18.webp'),
                       ('install','btn-install-v18.webp'),('help','btn-help-v18.webp'),
                       ('friends','btn-friends-v18.webp')]:
        original=Image.open(T/source).convert('RGBA')
        # Re-export each role in a clearly versioned standalone asset.
        save(base/'title'/f'{key}.webp',original)
    # 6 independent full-width image skins; labels remain native accessible HTML.
    for color in schemes:
        save(base/'buttons'/f'skin-{color}.webp',panel('skin',color,(560,146),64))
    # Popup backing at 2x raster (decor stays in the image instead of expensive CSS filters).
    for key,color in [('clear','gold'),('fail','blue'),('help','green'),('pause','pink'),('install','blue'),('friends','green'),('settings','wood'),('confirm','pink')]:
        pic=panel(key,color,(800,1000),72)
        d=ImageDraw.Draw(pic,'RGBA')
        # Frame with glossy inset inset cream for readable content; not a flat rectangle.
        d.rounded_rectangle((34,54,765,920),radius=62,fill='#fff9ec',outline='#fff4d5',width=13)
        d.rounded_rectangle((51,74,749,899),radius=50,outline=(250,197,135,160),width=8)
        for x,y in [(59,111),(726,164),(100,842),(708,848)]:
            d.ellipse((x-11,y-11,x+11,y+11),fill='#ffdb7c',outline='#fffdf2',width=4)
        save(base/'popup'/f'panel-{key}.webp',pic)
    # Game HUD widgets: actually separate image files for level, goal, moves, score & bonuses.
    for key,color in [('stage','wood'),('goal','pink'),('moves','gold'),('score','blue'),('best','green'),('booster','green'),('clock','red')]:
        save(base/'hud'/f'panel-{key}.webp',panel(key,color,(340,158),38))
    # Dedicated candy-gauge textures: opaque raster track and richly embossed golden fill.
    track=Image.new('RGBA',(840,72),(0,0,0,0))
    td=ImageDraw.Draw(track)
    td.rounded_rectangle((0,0,839,71),radius=35,fill='#664f72',outline='#ffe5a9',width=8)
    td.rounded_rectangle((12,12,827,59),radius=23,fill='#785b81')
    for px in range(18,826,34):
        td.rounded_rectangle((px,24,px+12,48),radius=6,fill='#8b6b98')
    save(base/'hud'/'progress-track.webp',track)
    fill=Image.new('RGBA',(160,72),(0,0,0,0))
    fd=ImageDraw.Draw(fill)
    fd.rectangle((0,0,159,71),fill='#ffaa34')
    fd.rectangle((0,7,159,55),fill='#ffc637')
    fd.rectangle((0,13,159,32),fill='#fff18c')
    fd.rectangle((0,51,159,62),fill='#ef982b')
    for x in range(12,160,42):
        fd.ellipse((x,18,x+10,29),fill='#fffbd0')
    save(base/'hud'/'progress-fill.webp',fill)
    # Map chapter labels + navigation buttons
    for key,color in [('world','wood'),('chapter','gold'),('prev','blue'),('next','green')]:
        save(base/'map'/f'{key}.webp',panel(key,color,(500,150),50))
    # Booster-specific badge art uses the original animal expressions and candy jewel art.
    effects=[('hammer','rabbit'),('shuffle','chick'),('color','cat'),('time','bear')]
    for key,mascot in effects:
        badge=panel(key,'blue' if key in ('shuffle','color') else 'gold',(230,232),56)
        fg=image('polish/'+mascot+'-cheer.webp')
        fg.thumbnail((132,132),RES)
        badge.alpha_composite(fg,((230-fg.width)//2,19))
        save(base/'booster'/f'badge-{key}.webp',badge)
    # All role buttons are unique files, with color meaning. Icons remain small helpers.
    actions={
      'play':'green','resume':'green','next':'gold','retry':'red','map':'blue','home':'blue',
      'help':'gold','pause':'wood','exit':'red','back':'blue','friends':'green','close':'red',
      'settings':'wood','sound':'wood','notice':'blue','confirm':'green','cancel':'red'
    }
    for key,color in actions.items():
        badge=panel(key,color,(360,110),46)
        if key in ('friends','play','retry','help'):
            person={'friends':'bear','play':'rabbit','retry':'cat','help':'chick'}[key]
            fg=image('polish/'+person+'-cheer.webp')
            fg.thumbnail((66,66),RES)
            badge.alpha_composite(fg,(30,19))
        save(base/'buttons'/f'action-{key}.webp',badge)
    # Use the user's actual glossy illustrated sprite-sheet cutouts for the
    # title's primary game / book / collection actions. Keep the previously
    # approved black-cat INSTALL illustration (not the older white bunny).
    import zipfile,io,hashlib
    archive=base/'source-original-kit.zip'
    assert archive.is_file(), 'Original user-approved v2.1 sprite kit missing'
    with zipfile.ZipFile(archive,'r') as source:
        for role,source_name in [('play','start_main.webp'),('help','help.webp'),
                                 ('friends','friends.webp')]:
            src=Image.open(io.BytesIO(source.read(source_name))).convert('RGBA')
            save(base/'title'/f'{role}.webp',src)
        original_data=source.read('MANIFEST.json')
        original_manifest=json.loads(original_data.decode('utf-8')) if 'json' in globals() else __import__('json').loads(original_data)
        assert all(n in original_manifest['files'] for n in ['start_main.webp','help.webp','friends.webp'])
    source_sha256=hashlib.sha256(archive.read_bytes()).hexdigest()
    # A lightweight consolidated inventory for CI and future replacement of each independent image.
    import json
    stock={}
    for kind in groups:
        stock[kind]=sorted(x.name for x in (base/kind).glob('*.webp'))
    (base/'manifest.json').write_text(json.dumps({
       'release':'2.2.0-beta','style':'LanyPang approved WebP studio',
       'roles':stock,'generation':'tools/build-visual-v18.py',
       'source':['web/assets/friends','web/assets/polish'],'userArtSource':'web/assets/ui/v21/source-original-kit.zip','userArtSHA256':source_sha256
    },ensure_ascii=False,indent=2),encoding='utf-8')
    assert len(list(base.rglob('*.webp')))>=44
    print('OK v2.1 UI kit',sum(len(x) for x in stock.values()),'individual WebP assets')

if __name__=='__main__':
    build_ui_v21()
