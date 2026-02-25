#!/usr/bin/env python3
"""
下载 Tesla 官方 Compositor 图片，为每个车辆 slug 生成对应图片。
Model 3 和 Model Y 均使用 Tesla 的 compositor API。
"""
import urllib.request
import shutil
import time
import os
import sys

BASE = "/Users/mystery/Desktop/mydreamtesla/public/images/vehicles"
os.makedirs(BASE, exist_ok=True)

TESLA_COMPOSITOR = "https://static-assets.tesla.com/configurator/compositor"

def build_url(model, color, wheel, drivetrain="", size=1920, view="STUD_3QTR", bkba=2):
    """构建 Tesla compositor URL"""
    opts = [color, wheel]
    if drivetrain:
        opts.append(drivetrain)
    opt_str = ",".join(opts)
    # URL-encode the $ signs
    opt_encoded = opt_str.replace("$", "%24").replace(",", "%2C")
    return f"{TESLA_COMPOSITOR}?bkba_opt={bkba}&model={model}&options={opt_encoded}&size={size}&view={view}"

def download(url, dest):
    """下载图片到目标路径"""
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120"
    }
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp, open(dest, "wb") as f:
            data = resp.read()
            if len(data) < 5000:
                print(f"  ⚠️  文件过小({len(data)}B)，可能是错误页面: {dest}")
                return False
            f.write(data)
            print(f"  ✅ {os.path.basename(dest)} ({len(data)//1024}KB)")
            return True
    except Exception as e:
        print(f"  ❌ 下载失败: {e} | {url}")
        return False

# ── 第一步：下载基础图片 ──────────────────────────────────────────

print("\n=== 下载 Model 3 基础图片 ===\n")

# Model 3 color codes:
# $PPSB = Solid Black | $PPSW = Pearl White | $PPSR = Ultra Red
# $PPMM = Midnight Silver | $PMAB = Deep Blue | $PMNG = Stealth Grey

m3_bases = {
    # trim-key: (color, wheel, drivetrain)
    "m3-perf-red":    ("$PPSR", "$W39B", "$DV4W"),    # Performance AWD - 红色
    "m3-lr-awd-blue": ("$PMAB", "$W38B", "$DV4W"),    # Long Range AWD - 深蓝色
    "m3-lr-rwd-grey": ("$PPMM", "$W38B", ""),          # Long Range RWD - 银灰色
    "m3-sr-white":    ("$PPSW", "$W38B", ""),          # Standard Range / RWD - 白色
    "m3-sr-black":    ("$PPSB", "$W38B", ""),          # Mid Range / 备用黑色
}

for key, (color, wheel, drive) in m3_bases.items():
    url = build_url("m3", color, wheel, drive, size=1920, bkba=2)
    dest = f"{BASE}/_base_{key}.png"
    download(url, dest)
    time.sleep(0.5)

print("\n=== 下载 Model Y 基础图片 ===\n")

# Model Y color + wheel codes:
# $WY19B = 19" Gemini | $WY20P = 21" Überturbine (Performance) | $WY18B = 18"

my_bases = {
    "my-perf-red":    ("$PPSR", "$WY20P", "$DV4W"),   # Performance AWD - 红色
    "my-lr-awd-blue": ("$PMAB", "$WY19B", "$DV4W"),   # Long Range AWD - 深蓝色
    "my-lr-awd-grey": ("$PPMM", "$WY19B", "$DV4W"),   # Long Range AWD - 银灰 (2020-2021)
    "my-sr-white":    ("$PPSW", "$WY19B", ""),         # Standard Range RWD - 白色
    "my-awd-black":   ("$PPSB", "$WY19B", "$DV4W"),   # 2025 AWD 基础款 - 黑色
}

for key, (color, wheel, drive) in my_bases.items():
    url = build_url("my", color, wheel, drive, size=1920, bkba=2)
    dest = f"{BASE}/_base_{key}.png"
    download(url, dest)
    time.sleep(0.5)

print("\n=== 下载模型级图片 (detail / tile) ===\n")

# Model 3 detail page (3/4 view, large)
download(build_url("m3", "$PMAB", "$W38B", "$DV4W", 2400, "STUD_3QTR", 2),
         f"{BASE}/model-3-detail.png")
time.sleep(0.5)

# Model Y detail page (3/4 view, large)
download(build_url("my", "$PMAB", "$WY19B", "$DV4W", 2400, "STUD_3QTR", 2),
         f"{BASE}/model-y-detail.png")
time.sleep(0.5)

# Model 3 tile (homepage 卡片, side view)
download(build_url("m3", "$PPSW", "$W38B", "", 800, "STUD_SIDE", 2),
         f"{BASE}/model-3-tile.png")
time.sleep(0.5)

# Model Y tile (homepage 卡片, side view)
download(build_url("my", "$PPSW", "$WY19B", "", 800, "STUD_SIDE", 2),
         f"{BASE}/model-y-tile.png")
time.sleep(0.5)

# Hero lineup - M3 front 3/4 (会在首页 hero 用)
download(build_url("m3", "$PPSB", "$W38B", "$DV4W", 2400, "STUD_3QTR", 2),
         f"{BASE}/hero-lineup.png")
time.sleep(0.5)

print("\n=== 为每个车辆 slug 复制对应图片 ===\n")

# ── 第二步：slug → base 映射 ──────────────────────────────────────

def copy_base(base_key, dest_slug):
    src = f"{BASE}/_base_{base_key}.png"
    dst = f"{BASE}/{dest_slug}.png"
    if os.path.exists(src) and os.path.getsize(src) > 5000:
        shutil.copy2(src, dst)
        print(f"  📋 {dest_slug}.png ← {base_key}")
    else:
        print(f"  ⚠️  源文件缺失: {base_key}")

# Model 3 slugs mapping
model3_slugs = {
    # Performance AWD → 红色
    "m3-perf-red": [
        "model-3-2018-performance-awd",
        "model-3-2019-performance-awd",
        "model-3-2020-performance-awd",
        "model-3-2021-performance-awd",
        "model-3-2022-performance-awd",
        "model-3-2023-performance-awd",
        "model-3-2024-performance-awd",
        "model-3-2025-performance-awd",
    ],
    # Long Range AWD → 深蓝色
    "m3-lr-awd-blue": [
        "model-3-2019-long-range-awd",
        "model-3-2020-long-range-awd",
        "model-3-2021-long-range-awd",
        "model-3-2022-long-range-awd",
        "model-3-2023-long-range-awd",
        "model-3-2024-long-range-awd",
        "model-3-2025-long-range-awd",
        "model-3-2025-premium-rwd",      # 近似用蓝色
    ],
    # Long Range RWD / 早期 → 银灰色
    "m3-lr-rwd-grey": [
        "model-3-2017-long-range-rwd",
        "model-3-2018-long-range-rwd",
    ],
    # Standard Range / RWD → 白色
    "m3-sr-white": [
        "model-3-2019-standard-range-plus-rwd",
        "model-3-2020-standard-range-plus-rwd",
        "model-3-2021-standard-range-plus-rwd",
        "model-3-2022-standard-range-plus-rwd",
        "model-3-2023-standard-range-plus-rwd",
        "model-3-2024-standard-range-plus-rwd",
        "model-3-2025-standard-range-plus-rwd",
    ],
    # Mid Range → 黑色
    "m3-sr-black": [
        "model-3-2018-mid-range-rwd",
        "model-3-2025-premium-rwd",      # 2025 Premium RWD 用黑色
    ],
}

for base_key, slugs in model3_slugs.items():
    for slug in slugs:
        copy_base(base_key, slug)

# Model Y slugs mapping
model_y_slugs = {
    # Performance AWD → 红色
    "my-perf-red": [
        "model-y-2020-performance-awd",
        "model-y-2021-performance-awd",
        "model-y-2022-performance-awd",
        "model-y-2023-performance-awd",
        "model-y-2024-performance-awd",
        "model-y-2025-performance-awd",
    ],
    # Long Range AWD → 深蓝色
    "my-lr-awd-blue": [
        "model-y-2021-long-range-awd",
        "model-y-2022-long-range-awd",
        "model-y-2023-long-range-awd",
        "model-y-2024-long-range-awd",
        "model-y-2025-long-range-awd",
        "model-y-2025-premium-rwd",
    ],
    # 2020 Long Range 用 grey (更接近早期版本)
    "my-lr-awd-grey": [
        "model-y-2020-long-range-awd",
    ],
    # Standard Range RWD → 白色
    "my-sr-white": [
        "model-y-2021-standard-range-rwd",
        "model-y-2023-standard-range-rwd",
        "model-y-2024-standard-range-rwd",
        "model-y-2025-standard-range-rwd",
    ],
    # 2025 AWD (Juniper 基础款) → 黑色
    "my-awd-black": [
        "model-y-2025-awd",
    ],
}

for base_key, slugs in model_y_slugs.items():
    for slug in slugs:
        copy_base(base_key, slug)

# 清理临时基础文件
print("\n=== 清理临时文件 ===")
for f in os.listdir(BASE):
    if f.startswith("_base_") or f.startswith("test-"):
        os.remove(f"{BASE}/{f}")
        print(f"  🗑  删除 {f}")

print("\n=== 完成！统计 ===")
images = [f for f in os.listdir(BASE) if f.endswith(".png") or f.endswith(".jpg")]
print(f"总图片数: {len(images)}")
for img in sorted(images):
    size = os.path.getsize(f"{BASE}/{img}")
    print(f"  {img} ({size//1024}KB)")
