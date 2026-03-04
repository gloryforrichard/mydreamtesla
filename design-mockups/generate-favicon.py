"""
Electric Reduction — Favicon for MyDreamTesla
Bold geometric 'D' with internal electric arc on deep dark canvas.
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os
import struct
import io

FONT_DIR = '/Users/mystery/.claude/skills/canvas-design/canvas-fonts'
OUT_DIR = '/Users/mystery/Desktop/mydreamtesla/public'
MOCKUP_DIR = '/Users/mystery/Desktop/mydreamtesla/design-mockups'

# Colors
BG = (10, 15, 30)
WHITE = (238, 242, 250)
BLUE = (59, 130, 246)
BLUE_L = (96, 165, 250)
BLUE_G = (35, 80, 190)

MASTER = 1024


def create_favicon():
    S = MASTER

    # Step 1: Solid dark background (RGB, not RGBA)
    base = Image.new('RGB', (S, S), BG)
    draw = ImageDraw.Draw(base)

    # Subtle top-to-bottom gradient for depth
    for y in range(S):
        t = y / S
        # Slightly lighter at top, darker at bottom
        r = int(BG[0] + (1 - t) * 6)
        g = int(BG[1] + (1 - t) * 8)
        b = int(BG[2] + (1 - t) * 12)
        draw.line([(0, y), (S, y)], fill=(r, g, b))

    # Step 2: Load font and measure the D
    font_size = int(S * 0.62)
    font = ImageFont.truetype(
        os.path.join(FONT_DIR, 'Outfit-Bold.ttf'), font_size)

    # Measure using textbbox
    bbox = draw.textbbox((0, 0), 'D', font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]

    # Center the letter: compute origin so the rendered bbox is centered
    tx = (S - text_w) // 2 - bbox[0]
    ty = (S - text_h) // 2 - bbox[1]

    # Step 3: Blue glow behind letter
    glow_layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    glow_d = ImageDraw.Draw(glow_layer)
    glow_d.text((tx, ty), 'D', font=font, fill=(*BLUE_G, 120))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=int(S * 0.04)))

    base_rgba = base.convert('RGBA')
    base_rgba = Image.alpha_composite(base_rgba, glow_layer)

    # Tighter glow
    glow2 = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    glow2_d = ImageDraw.Draw(glow2)
    glow2_d.text((tx, ty), 'D', font=font, fill=(*BLUE, 60))
    glow2 = glow2.filter(ImageFilter.GaussianBlur(radius=int(S * 0.018)))
    base_rgba = Image.alpha_composite(base_rgba, glow2)

    # Step 4: White letter
    letter_layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    letter_d = ImageDraw.Draw(letter_layer)
    letter_d.text((tx, ty), 'D', font=font, fill=(*WHITE, 255))
    base_rgba = Image.alpha_composite(base_rgba, letter_layer)

    # Step 5: Electric arc inside D's counter
    # Counter center: ~56% across letter width, 50% down
    counter_cx = tx + bbox[0] + text_w * 0.56
    counter_cy = ty + bbox[1] + text_h * 0.50
    arc_r = text_h * 0.19  # Slightly larger for more presence

    arc_layer = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ad = ImageDraw.Draw(arc_layer)

    # Subtle arc glow
    glow_arc = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ga = ImageDraw.Draw(glow_arc)
    ga.arc([counter_cx - arc_r, counter_cy - arc_r,
            counter_cx + arc_r, counter_cy + arc_r],
           start=195, end=345,
           fill=(*BLUE_G, 80), width=max(5, int(S * 0.01)))
    glow_arc = glow_arc.filter(ImageFilter.GaussianBlur(radius=int(S * 0.008)))
    base_rgba = Image.alpha_composite(base_rgba, glow_arc)

    # Main outer arc
    arc_box = [counter_cx - arc_r, counter_cy - arc_r,
               counter_cx + arc_r, counter_cy + arc_r]
    ad.arc(arc_box, start=195, end=345,
           fill=(*BLUE, 235), width=max(3, int(S * 0.005)))

    # Middle arc
    arc_r2 = arc_r * 0.62
    arc_box2 = [counter_cx - arc_r2, counter_cy - arc_r2,
                counter_cx + arc_r2, counter_cy + arc_r2]
    ad.arc(arc_box2, start=210, end=330,
           fill=(*BLUE_L, 200), width=max(2, int(S * 0.004)))

    # Inner arc
    arc_r3 = arc_r * 0.32
    arc_box3 = [counter_cx - arc_r3, counter_cy - arc_r3,
                counter_cx + arc_r3, counter_cy + arc_r3]
    ad.arc(arc_box3, start=225, end=315,
           fill=(*BLUE_L, 160), width=max(2, int(S * 0.003)))

    # Center dot
    dot_r = max(3, int(S * 0.006))
    ad.ellipse([counter_cx - dot_r, counter_cy - dot_r,
                counter_cx + dot_r, counter_cy + dot_r],
               fill=(*BLUE_L, 240))

    base_rgba = Image.alpha_composite(base_rgba, arc_layer)

    # Step 6: Subtle inner edge highlight (premium depth)
    edge = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    ed = ImageDraw.Draw(edge)
    radius = int(S * 0.22)
    # Very subtle inner border
    ed.rounded_rectangle([1, 1, S - 2, S - 2], radius=radius,
                         outline=(255, 255, 255, 10), width=2)
    base_rgba = Image.alpha_composite(base_rgba, edge)

    # Step 7: Apply rounded rectangle mask
    mask = Image.new('L', (S, S), 0)
    mask_d = ImageDraw.Draw(mask)
    mask_d.rounded_rectangle([0, 0, S - 1, S - 1], radius=radius, fill=255)

    flat = Image.new('RGB', (S, S), (0, 0, 0))
    flat.paste(base_rgba.convert('RGB'), (0, 0))

    result = flat.convert('RGBA')
    result.putalpha(mask)

    return result


def create_ico(images_dict, output_path):
    """Create ICO file from dict of {size: PIL Image}."""
    entries = []
    data_blocks = []
    offset = 6 + 16 * len(images_dict)

    for size in sorted(images_dict.keys()):
        img = images_dict[size]
        buf = io.BytesIO()
        img.save(buf, format='PNG')
        png_data = buf.getvalue()

        w = size if size < 256 else 0
        h = size if size < 256 else 0
        entries.append(struct.pack('<BBBBHHII',
                                   w, h, 0, 0, 1, 32,
                                   len(png_data), offset))
        data_blocks.append(png_data)
        offset += len(png_data)

    with open(output_path, 'wb') as f:
        f.write(struct.pack('<HHH', 0, 1, len(images_dict)))
        for entry in entries:
            f.write(entry)
        for block in data_blocks:
            f.write(block)


def main():
    print('Generating favicon...')
    master = create_favicon()

    sizes = {
        'android-chrome-512x512.png': 512,
        'android-chrome-192x192.png': 192,
        'apple-touch-icon.png': 180,
        'favicon-32x32.png': 32,
        'favicon-16x16.png': 16,
    }

    for filename, size in sizes.items():
        resized = master.resize((size, size), Image.LANCZOS)
        path = os.path.join(OUT_DIR, filename)
        resized.save(path, 'PNG')
        print(f'  {filename} ({size}x{size})')

    # ICO
    ico = {
        16: master.resize((16, 16), Image.LANCZOS),
        32: master.resize((32, 32), Image.LANCZOS),
    }
    ico_path = os.path.join(OUT_DIR, 'favicon.ico')
    create_ico(ico, ico_path)
    print(f'  favicon.ico (16+32)')

    # Preview
    preview = master.resize((512, 512), Image.LANCZOS)
    preview.save(os.path.join(MOCKUP_DIR, 'favicon-preview.png'), 'PNG')
    print(f'  favicon-preview.png (512)')

    print('Done!')


if __name__ == '__main__':
    main()
