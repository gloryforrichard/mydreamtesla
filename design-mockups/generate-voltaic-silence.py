"""
Voltaic Silence — Museum-Quality Final Expression
Cartography of invisible force: electromagnetic topology,
concentric geometry, clinical precision.
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

# ===== CONFIG =====
SCALE = 2
FW, FH = 2400, 3200
W, H = FW * SCALE, FH * SCALE
CX, CY = W // 2, int(H * 0.37)

FONT_DIR = '/Users/mystery/.claude/skills/canvas-design/canvas-fonts'
OUTPUT = '/Users/mystery/Desktop/mydreamtesla/design-mockups/voltaic-silence.png'

# ===== PALETTE =====
BG = (6, 9, 20)
BLUE = (59, 130, 246)
BLUE_D = (37, 99, 235)
BLUE_L = (96, 165, 250)
BLUE_P = (165, 210, 255)
BLUE_GLOW = (22, 50, 140)
COP = (215, 155, 85)
COP_L = (235, 195, 145)
COP_DIM = (180, 130, 70)
SL = (40, 55, 80)
SL_L = (65, 82, 110)
TX_D = (130, 148, 175)
TX_M = (170, 186, 210)
TX_B = (225, 235, 248)

# ===== FONTS =====
def lf(n, s):
    return ImageFont.truetype(os.path.join(FONT_DIR, n), int(s * SCALE))

f_title = lf('Jura-Light.ttf', 40)
f_sub = lf('Italiana-Regular.ttf', 17)
f_label = lf('Jura-Medium.ttf', 14)
f_mono = lf('DMMono-Regular.ttf', 12)
f_mono_s = lf('DMMono-Regular.ttf', 10.5)
f_tiny = lf('DMMono-Regular.ttf', 9)
f_accent = lf('Italiana-Regular.ttf', 14)
f_data = lf('GeistMono-Regular.ttf', 9.5)

# ===== BASE =====
img = Image.new('RGBA', (W, H), (*BG, 255))

# ===== GRID =====
g = Image.new('RGBA', (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(g)
sp = 60 * SCALE
for x in range(0, W, sp):
    gd.line([(x, 0), (x, H)], fill=(*SL, 18), width=1)
for y in range(0, H, sp):
    gd.line([(0, y), (W, y)], fill=(*SL, 18), width=1)
img = Image.alpha_composite(img, g)

# ===== GLOW =====
glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
gd2 = ImageDraw.Draw(glow)
for i in range(90):
    r = (90 - i) * 9 * SCALE
    op = int(2 + i * 0.4)
    gd2.ellipse([CX - r, CY - r, CX + r, CY + r], fill=(*BLUE_GLOW, op))
glow = glow.filter(ImageFilter.GaussianBlur(radius=22 * SCALE))
img = Image.alpha_composite(img, glow)

# ===== CONCENTRIC CIRCLES =====
NUM = 44

def cr(i):
    return (14 * (i + 1) + 0.58 * (i + 1) ** 2) * SCALE

circ = Image.new('RGBA', (W, H), (0, 0, 0, 0))
cd = ImageDraw.Draw(circ)

for i in range(NUM):
    r = cr(i)
    t = i / (NUM - 1)

    br = int(BLUE[0] + (BLUE_D[0] - BLUE[0]) * t * 0.5)
    bg_ = int(BLUE[1] + (BLUE_D[1] - BLUE[1]) * t * 0.35)
    bb = int(BLUE[2] + (BLUE_D[2] - BLUE[2]) * t * 0.15)

    op = int(200 * (1 - t * 0.55))
    op = max(op, 45)
    w = SCALE

    # Every 5th ring: accent
    if i % 5 == 4:
        op = min(op + 50, 235)
        w = int(1.5 * SCALE)
    # Every 10th ring: major accent
    if i % 10 == 9:
        op = min(op + 30, 250)
        w = 2 * SCALE

    cd.ellipse([CX - r, CY - r, CX + r, CY + r],
               outline=(br, bg_, bb, op), width=w)

img = Image.alpha_composite(img, circ)

# ===== AXES =====
ax = Image.new('RGBA', (W, H), (0, 0, 0, 0))
axd = ImageDraw.Draw(ax)
ext = cr(NUM - 1) + 150 * SCALE

# Main axes — warm copper, clearly visible
axd.line([(CX, CY - ext), (CX, CY + ext)], fill=(*COP, 130), width=SCALE)
axd.line([(CX - ext, CY), (CX + ext, CY)], fill=(*COP, 130), width=SCALE)

# Tick marks
for i in range(NUM):
    r = cr(i)
    t = i / (NUM - 1)
    top = int(150 * (1 - t * 0.3))

    if i % 3 == 0:
        tl = 10 * SCALE
        for s in [-1, 1]:
            axd.line([(CX - tl, CY + s * r), (CX + tl, CY + s * r)],
                     fill=(*COP, top), width=1)
            axd.line([(CX + s * r, CY - tl), (CX + s * r, CY + tl)],
                     fill=(*COP, top), width=1)

    if i % 10 == 0 and i > 0:
        btl = 18 * SCALE
        for s in [-1, 1]:
            axd.line([(CX - btl, CY + s * r), (CX + btl, CY + s * r)],
                     fill=(*COP_L, min(top + 40, 210)), width=SCALE)
            axd.line([(CX + s * r, CY - btl), (CX + s * r, CY + btl)],
                     fill=(*COP_L, min(top + 40, 210)), width=SCALE)

img = Image.alpha_composite(img, ax)

# ===== RADIALS =====
rad = Image.new('RGBA', (W, H), (0, 0, 0, 0))
rdd = ImageDraw.Draw(rad)

for a_deg in [30, 60, 120, 150, 210, 240, 300, 330]:
    a = math.radians(a_deg)
    inn, out = cr(4), cr(NUM - 8)
    x1, y1 = CX + inn * math.cos(a), CY - inn * math.sin(a)
    x2, y2 = CX + out * math.cos(a), CY - out * math.sin(a)
    dist = math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
    if dist == 0: continue
    dx, dy = (x2 - x1) / dist, (y2 - y1) / dist
    dash, gap = 14 * SCALE, 20 * SCALE
    pos = 0
    while pos < dist:
        se = min(pos + dash, dist)
        rdd.line([(x1 + dx * pos, y1 + dy * pos),
                  (x1 + dx * se, y1 + dy * se)],
                 fill=(*COP_DIM, 70), width=1)
        pos += dash + gap

img = Image.alpha_composite(img, rad)

# ===== DOTS & MARKERS =====
dots = Image.new('RGBA', (W, H), (0, 0, 0, 0))
dd = ImageDraw.Draw(dots)

# Axis dots
for i in range(0, NUM, 4):
    r = cr(i)
    t = i / (NUM - 1)
    op = int(230 * (1 - t * 0.4))
    dr = 4 * SCALE
    for s1, s2 in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
        px, py = CX + s1 * r, CY + s2 * r
        dd.ellipse([px - dr, py - dr, px + dr, py + dr], fill=(*BLUE_L, op))

# Plus markers at major rings
pl = 10 * SCALE
for i in range(10, NUM, 10):
    r = cr(i)
    t = i / (NUM - 1)
    op = int(210 * (1 - t * 0.3))
    for s1, s2 in [(0, -1), (0, 1), (-1, 0), (1, 0)]:
        px, py = CX + s1 * r, CY + s2 * r
        dd.line([(px - pl, py), (px + pl, py)], fill=(*BLUE_P, op), width=1)
        dd.line([(px, py - pl), (px, py + pl)], fill=(*BLUE_P, op), width=1)

# Diagonal dots
for a_deg in [30, 150, 210, 330]:
    a = math.radians(a_deg)
    for i in range(0, NUM, 5):
        r = cr(i)
        px = CX + r * math.cos(a)
        py = CY - r * math.sin(a)
        t = i / (NUM - 1)
        op = int(160 * (1 - t * 0.45))
        dd.ellipse([px - 3*SCALE, py - 3*SCALE, px + 3*SCALE, py + 3*SCALE],
                   fill=(*BLUE_P, op))

img = Image.alpha_composite(img, dots)

# ===== ARCS =====
arcs = Image.new('RGBA', (W, H), (0, 0, 0, 0))
ard = ImageDraw.Draw(arcs)
for ci, st, sp in [(9, -42, 84), (15, 138, 84), (22, 245, 58), (28, 62, 48)]:
    ar = cr(ci)
    ard.arc([CX - ar, CY - ar, CX + ar, CY + ar],
            start=st, end=st + sp, fill=(*COP_L, 110), width=int(1.5 * SCALE))
    for angle_d in [st, st + sp]:
        a = math.radians(angle_d)
        px, py = CX + ar * math.cos(a), CY + ar * math.sin(a)
        ard.ellipse([px - 3*SCALE, py - 3*SCALE, px + 3*SCALE, py + 3*SCALE],
                    fill=(*COP_L, 100))
img = Image.alpha_composite(img, arcs)

# ===== ORBITAL DOTS =====
orb = Image.new('RGBA', (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(orb)

for deg in range(0, 360, 5):
    if 50 < deg < 130 or 230 < deg < 310: continue
    a = math.radians(deg)
    r = cr(21)
    px, py = CX + r * math.cos(a), CY - r * math.sin(a)
    od.ellipse([px - 2*SCALE, py - 2*SCALE, px + 2*SCALE, py + 2*SCALE],
               fill=(*BLUE_L, 120))

for deg in range(0, 360, 7):
    if 75 < deg < 285: continue
    a = math.radians(deg)
    r = cr(33)
    px, py = CX + r * math.cos(a), CY - r * math.sin(a)
    od.ellipse([px - 2*SCALE, py - 2*SCALE, px + 2*SCALE, py + 2*SCALE],
               fill=(*BLUE, 90))

img = Image.alpha_composite(img, orb)

# ===== GOLDEN SPIRAL =====
spr = Image.new('RGBA', (W, H), (0, 0, 0, 0))
spd = ImageDraw.Draw(spr)
phi = (1 + math.sqrt(5)) / 2
pts = []
for i in range(1500):
    theta = i * 0.012
    r = 5 * SCALE * (phi ** (theta / (2 * math.pi)))
    if r > cr(14): break
    pts.append((CX + r * math.cos(theta), CY - r * math.sin(theta)))
if len(pts) > 1:
    spd.line(pts, fill=(*COP, 80), width=SCALE)
img = Image.alpha_composite(img, spr)

# ===== CENTER FOCAL POINT =====
cen = Image.new('RGBA', (W, H), (0, 0, 0, 0))
cnd = ImageDraw.Draw(cen)

# Soft glow rings
for j in range(5):
    vr = (16 + j * 3) * SCALE
    cnd.ellipse([CX - vr, CY - vr, CX + vr, CY + vr],
                outline=(*BLUE_L, 50 - j * 10), width=1)

# Main ring
vr = 14 * SCALE
cnd.ellipse([CX - vr, CY - vr, CX + vr, CY + vr],
            outline=(*BLUE_P, 245), width=SCALE)
# Core dot
ir = 4 * SCALE
cnd.ellipse([CX - ir, CY - ir, CX + ir, CY + ir], fill=(*BLUE_P, 255))

# Cross arms
for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
    cnd.line([(CX + dx * 18 * SCALE, CY + dy * 18 * SCALE),
              (CX + dx * 28 * SCALE, CY + dy * 28 * SCALE)],
             fill=(*BLUE_L, 190), width=SCALE)
img = Image.alpha_composite(img, cen)

# ===== TEXT =====
txt = Image.new('RGBA', (W, H), (0, 0, 0, 0))
td = ImageDraw.Draw(txt)
mx, my = 105 * SCALE, 88 * SCALE

# ── Title ──
td.text((mx, my), 'VOLTAIC SILENCE', font=f_title, fill=(*TX_B, 240))

# ── Rule ──
ry = my + 62 * SCALE
td.line([(mx, ry), (mx + 360 * SCALE, ry)], fill=(*COP, 120), width=1)

# ── Subtitle ──
td.text((mx, ry + 18 * SCALE), 'Cartography of Silent Force',
        font=f_sub, fill=(*TX_M, 165))

# ── Figure ref ──
fig = 'FIG. 01'
fb = td.textbbox((0, 0), fig, font=f_mono)
td.text((W - mx - (fb[2] - fb[0]), my + 6 * SCALE), fig,
        font=f_mono, fill=(*TX_M, 160))
ref = 'FIELD TOPOLOGY'
rb = td.textbbox((0, 0), ref, font=f_mono_s)
td.text((W - mx - (rb[2] - rb[0]), my + 34 * SCALE), ref,
        font=f_mono_s, fill=(*TX_D, 120))

# ── Radius labels ──
for ci, label in [(9, 'r10'), (19, 'r20'), (29, 'r30')]:
    r = cr(ci)
    t = ci / (NUM - 1)
    op = int(130 * (1 - t * 0.25))
    td.text((CX + r + 20 * SCALE, CY - 7 * SCALE), label,
            font=f_tiny, fill=(*COP_L, op))
for ci, label in [(9, 'r10'), (19, 'r20')]:
    r = cr(ci)
    t = ci / (NUM - 1)
    op = int(110 * (1 - t * 0.25))
    bb = td.textbbox((0, 0), label, font=f_tiny)
    td.text((CX - r - 20 * SCALE - (bb[2] - bb[0]), CY - 7 * SCALE),
            label, font=f_tiny, fill=(*COP_L, op))

# ── Below field: annotation ──
fb_y = CY + cr(NUM - 8) + 70 * SCALE
ann = 'ACCELERATION TOPOLOGY'
ab = td.textbbox((0, 0), ann, font=f_mono_s)
td.text((CX - (ab[2] - ab[0]) // 2, fb_y), ann,
        font=f_mono_s, fill=(*TX_B, 155))

# ── Thin accent lines flanking the annotation ──
ann_half = (ab[2] - ab[0]) // 2
line_gap = 18 * SCALE
line_len = 120 * SCALE
ann_cy = fb_y + 10 * SCALE
td.line([(CX - ann_half - line_gap - line_len, ann_cy),
         (CX - ann_half - line_gap, ann_cy)], fill=(*COP, 55), width=1)
td.line([(CX + ann_half + line_gap, ann_cy),
         (CX + ann_half + line_gap + line_len, ann_cy)], fill=(*COP, 55), width=1)

# ── Data row 1 ──
dy1 = fb_y + 52 * SCALE
td.text((CX - 400 * SCALE, dy1), '\u0394t = 1.99s',
        font=f_mono_s, fill=(*COP_L, 150))
eff = '\u03b7 = 97.6%'
eb = td.textbbox((0, 0), eff, font=f_mono_s)
td.text((CX - (eb[2] - eb[0]) // 2, dy1), eff,
        font=f_mono_s, fill=(*COP_L, 150))
td.text((CX + 240 * SCALE, dy1), '0 \u2192 100 // SILENT',
        font=f_mono_s, fill=(*COP_L, 130))

# ── Data row 2 ──
dy2 = dy1 + 38 * SCALE
td.text((CX - 400 * SCALE, dy2), 'F = q(E + v \u00d7 B)',
        font=f_mono_s, fill=(*TX_M, 120))
db = '0 dB'
dbb = td.textbbox((0, 0), db, font=f_accent)
td.text((CX - (dbb[2] - dbb[0]) // 2, dy2), db,
        font=f_accent, fill=(*TX_B, 130))
td.text((CX + 240 * SCALE, dy2), 'PERMANENT MAGNET',
        font=f_mono_s, fill=(*TX_D, 110))

# ── Separator ──
sep_y = dy2 + 55 * SCALE
sep_w = 200 * SCALE
td.line([(CX - sep_w, sep_y), (CX + sep_w, sep_y)], fill=(*SL_L, 65), width=1)
# Small dots at separator endpoints
for sx in [CX - sep_w, CX + sep_w]:
    td.ellipse([sx - 2*SCALE, sep_y - 2*SCALE, sx + 2*SCALE, sep_y + 2*SCALE],
               fill=(*SL_L, 80))

# ── Lower data blocks ──
lo = int(H * 0.70)

# Left block
td.text((mx, lo), 'SPECIMEN', font=f_label, fill=(*TX_B, 150))
td.line([(mx, lo + 28 * SCALE), (mx + 140 * SCALE, lo + 28 * SCALE)],
        fill=(*COP, 100), width=1)
for j, line in enumerate([
    'Electromagnetic flux density',
    'Peak torque: instantaneous',
    'Acoustic emission: null',
    'Regenerative capture: 98.2%',
]):
    td.text((mx, lo + 42 * SCALE + j * 22 * SCALE), line,
            font=f_data, fill=(*TX_D, 120))

# Right block
rx = W - mx - 340 * SCALE
td.text((rx, lo), 'PARAMETERS', font=f_label, fill=(*TX_B, 150))
td.line([(rx, lo + 28 * SCALE), (rx + 160 * SCALE, lo + 28 * SCALE)],
        fill=(*COP, 100), width=1)
for j, line in enumerate([
    'Voltage: 400V nominal',
    'Phase: 3-phase AC induction',
    'Efficiency class: IE5 Ultra',
    'Cooling: liquid glycol loop',
]):
    td.text((rx, lo + 42 * SCALE + j * 22 * SCALE), line,
            font=f_data, fill=(*TX_D, 120))

# ── Bracket frames ──
bpad = 18 * SCALE
bh = 145 * SCALE
corner = 14 * SCALE
bop = 60

# Left bracket
bx1, by1 = mx - bpad, lo - bpad // 2
bw1 = 370 * SCALE
for (x1, y1), (x2, y2), (x3, y3) in [
    ((bx1, by1 + corner), (bx1, by1), (bx1 + corner, by1)),
    ((bx1 + bw1 - corner, by1), (bx1 + bw1, by1), (bx1 + bw1, by1 + corner)),
    ((bx1, by1 + bh - corner), (bx1, by1 + bh), (bx1 + corner, by1 + bh)),
    ((bx1 + bw1 - corner, by1 + bh), (bx1 + bw1, by1 + bh), (bx1 + bw1, by1 + bh - corner)),
]:
    td.line([(x1, y1), (x2, y2), (x3, y3)], fill=(*SL_L, bop), width=1)

# Right bracket
bx2 = rx - bpad
bw2 = 380 * SCALE
for (x1, y1), (x2, y2), (x3, y3) in [
    ((bx2, by1 + corner), (bx2, by1), (bx2 + corner, by1)),
    ((bx2 + bw2 - corner, by1), (bx2 + bw2, by1), (bx2 + bw2, by1 + corner)),
    ((bx2, by1 + bh - corner), (bx2, by1 + bh), (bx2 + corner, by1 + bh)),
    ((bx2 + bw2 - corner, by1 + bh), (bx2 + bw2, by1 + bh), (bx2 + bw2, by1 + bh - corner)),
]:
    td.line([(x1, y1), (x2, y2), (x3, y3)], fill=(*SL_L, bop), width=1)

# ── Data bars (subtle visualization) ──
bars_y = lo + 170 * SCALE
bar_data = [0.92, 0.78, 0.65, 0.88, 0.71, 0.95, 0.83]
max_bw = 220 * SCALE
bar_h = 3 * SCALE
bar_gap = 11 * SCALE
for j, val in enumerate(bar_data):
    bw_c = int(val * max_bw)
    by_c = bars_y + j * (bar_h + bar_gap)
    td.rectangle([mx, by_c, mx + bw_c, by_c + bar_h],
                 fill=(*BLUE, int(70 + val * 50)))

for j, val in enumerate(bar_data):
    bw_c = int(val * max_bw)
    by_c = bars_y + j * (bar_h + bar_gap)
    td.rectangle([W - mx - bw_c, by_c, W - mx, by_c + bar_h],
                 fill=(*BLUE, int(60 + val * 40)))

# ── Bottom ──
bot = H - my
attr = 'SILENT FORCE CARTOGRAPHY'
atb = td.textbbox((0, 0), attr, font=f_label)
td.text((CX - (atb[2] - atb[0]) // 2, bot - 100 * SCALE), attr,
        font=f_label, fill=(*TX_M, 130))

br_y = bot - 65 * SCALE
td.line([(CX - 270 * SCALE, br_y), (CX + 270 * SCALE, br_y)],
        fill=(*SL_L, 65), width=1)

td.text((mx, bot - 32 * SCALE), 'VS.2026.03',
        font=f_tiny, fill=(*TX_D, 90))
ed = 'EDITION NO. 1'
edb = td.textbbox((0, 0), ed, font=f_tiny)
td.text((W - mx - (edb[2] - edb[0]), bot - 32 * SCALE), ed,
        font=f_tiny, fill=(*TX_D, 90))

# ── Edge labels ──
for idx, ch in enumerate('FIELD'):
    td.text((mx - 55 * SCALE, CY - 55 * SCALE + idx * 25 * SCALE), ch,
            font=f_tiny, fill=(*TX_D, 65))
for idx, ch in enumerate('FORCE'):
    td.text((W - mx + 28 * SCALE, CY - 55 * SCALE + idx * 25 * SCALE), ch,
            font=f_tiny, fill=(*TX_D, 65))

img = Image.alpha_composite(img, txt)

# ===== VIGNETTE =====
vig = Image.new('RGBA', (W, H), (0, 0, 0, 0))
vd = ImageDraw.Draw(vig)
for i in range(25):
    op = int(4 * (25 - i))
    ins = i * 7 * SCALE
    vd.rectangle([0, 0, W, ins], fill=(*BG, op))
    vd.rectangle([0, H - ins, W, H], fill=(*BG, op))
    vd.rectangle([0, 0, ins, H], fill=(*BG, int(op * 0.4)))
    vd.rectangle([W - ins, 0, W, H], fill=(*BG, int(op * 0.4)))
img = Image.alpha_composite(img, vig)

# ===== RENDER =====
final = img.convert('RGB').resize((FW, FH), Image.LANCZOS)
final.save(OUTPUT, 'PNG', quality=95)
print(f'Saved: {OUTPUT} ({FW}x{FH})')
