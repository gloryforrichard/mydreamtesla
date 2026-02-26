#!/usr/bin/env python3
"""
AI img2img 车辆图片专业化处理脚本 v3
- 使用官方高清源图（非本地残缺版本）
- 输出白色车身 + 透明背景 PNG
- 折中质量策略：5张高频图 high，其余 medium

世代映射：
  Model 3 Gen1     (2017-2022) → model3_gen1.jpg       (Pearl White 4417x2998)
  Model 3 Highland (2023-2025) → model3_highland.jpg   (4080x3072)
  Model Y Gen1     (2020-2023) → modely_gen1.jpg        (7128x4906)
  Model Y Juniper  (2024-2025) → modely_juniper.jpg    (3829x2871)
  hero-lineup                  → hero_lineup.png        (Tesla S+3+X)
  model-3-detail               → model3_detail.jpg      (5952x4600)
  model-y-detail               → modely_detail.jpg      (5416x3610)
  model-3-tile                 → model3_gen1.jpg
  model-y-tile                 → modely_gen1.jpg

用法：
    OPENAI_API_KEY="sk-..." python3 scripts/enhance-vehicle-images.py
    OPENAI_API_KEY="sk-..." python3 scripts/enhance-vehicle-images.py --test
    OPENAI_API_KEY="sk-..." python3 scripts/enhance-vehicle-images.py --file model-3-2024-performance-awd
    OPENAI_API_KEY="sk-..." python3 scripts/enhance-vehicle-images.py --force
"""

import base64
import io
import os
import sys
import time
import argparse
from pathlib import Path

# ── 路径配置 ────────────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
PROJECT_DIR = SCRIPT_DIR.parent
VEHICLES_DIR = PROJECT_DIR / "public" / "images" / "vehicles"
SOURCE_DIR = SCRIPT_DIR / "vehicle-source-images"

# ── Prompt ──────────────────────────────────────────────────────
PROMPT = (
    "Professional Tesla vehicle product photography. "
    "Paint the car in Pearl White color (solid white, #FFFFFF). "
    "Transparent background, no ground, no shadow, no scenery. "
    "Soft natural studio lighting from above. "
    "Keep the exact same car model, body shape, camera angle, and all exterior details. "
    "Tesla logo and all badges must be clearly visible and sharp. "
    "Remove license plates. Ultra high detail, photorealistic."
)

# ── 世代 → 源文件映射 ────────────────────────────────────────────
SOURCE_MAP: dict[str, str] = {
    # 特殊图
    "hero-lineup":    "hero_lineup.png",
    "model-3-detail": "model3_detail.jpg",
    "model-y-detail": "modely_detail.jpg",
    "model-3-tile":   "model3_gen1.jpg",
    "model-y-tile":   "modely_gen1.jpg",
}

def get_source_image(stem: str) -> Path:
    """根据车辆 slug stem 找到对应的高清源图"""
    # 特殊图直接映射
    if stem in SOURCE_MAP:
        return SOURCE_DIR / SOURCE_MAP[stem]

    # 按世代映射
    if stem.startswith("model-3-"):
        year_part = stem.replace("model-3-", "").split("-")[0]
        try:
            year = int(year_part)
        except ValueError:
            return SOURCE_DIR / "model3_gen1.jpg"
        if year >= 2023:
            return SOURCE_DIR / "model3_highland.jpg"
        else:
            return SOURCE_DIR / "model3_gen1.jpg"

    if stem.startswith("model-y-"):
        year_part = stem.replace("model-y-", "").split("-")[0]
        try:
            year = int(year_part)
        except ValueError:
            return SOURCE_DIR / "modely_gen1.jpg"
        if year >= 2024:
            return SOURCE_DIR / "modely_juniper.jpg"
        else:
            return SOURCE_DIR / "modely_gen1.jpg"

    # 兜底
    return SOURCE_DIR / "model3_gen1.jpg"


# ── 质量策略 ────────────────────────────────────────────────────
HIGH_QUALITY_STEMS = {
    "hero-lineup",
    "model-3-detail",
    "model-y-detail",
    "model-3-tile",
    "model-y-tile",
}

PRICE = {"medium": 0.042, "high": 0.167}

def get_quality(stem: str) -> str:
    return "high" if stem in HIGH_QUALITY_STEMS else "medium"


# ── 所有目标文件（输出为 .png）────────────────────────────────────
ALL_STEMS = [
    # 高频图优先
    "hero-lineup",
    "model-3-detail",
    "model-y-detail",
    "model-3-tile",
    "model-y-tile",
    # Model 3 Gen1
    "model-3-2017-long-range-rwd",
    "model-3-2018-long-range-rwd",
    "model-3-2018-mid-range-rwd",
    "model-3-2018-performance-awd",
    "model-3-2019-standard-range-plus-rwd",
    "model-3-2019-long-range-awd",
    "model-3-2019-performance-awd",
    "model-3-2020-standard-range-plus-rwd",
    "model-3-2020-long-range-awd",
    "model-3-2020-performance-awd",
    "model-3-2021-standard-range-plus-rwd",
    "model-3-2021-long-range-awd",
    "model-3-2021-performance-awd",
    "model-3-2022-standard-range-plus-rwd",
    "model-3-2022-long-range-awd",
    "model-3-2022-performance-awd",
    # Model 3 Highland
    "model-3-2023-standard-range-plus-rwd",
    "model-3-2023-long-range-awd",
    "model-3-2023-performance-awd",
    "model-3-2024-standard-range-plus-rwd",
    "model-3-2024-long-range-awd",
    "model-3-2024-performance-awd",
    "model-3-2025-standard-range-plus-rwd",
    "model-3-2025-premium-rwd",
    "model-3-2025-long-range-awd",
    "model-3-2025-performance-awd",
    # Model Y Gen1
    "model-y-2020-long-range-awd",
    "model-y-2020-performance-awd",
    "model-y-2021-standard-range-rwd",
    "model-y-2021-long-range-awd",
    "model-y-2021-performance-awd",
    "model-y-2022-long-range-awd",
    "model-y-2022-performance-awd",
    "model-y-2023-standard-range-rwd",
    "model-y-2023-long-range-awd",
    "model-y-2023-performance-awd",
    # Model Y Juniper
    "model-y-2024-standard-range-rwd",
    "model-y-2024-long-range-awd",
    "model-y-2024-performance-awd",
    "model-y-2025-standard-range-rwd",
    "model-y-2025-awd",
    "model-y-2025-premium-rwd",
    "model-y-2025-long-range-awd",
    "model-y-2025-performance-awd",
]


def is_done(stem: str) -> bool:
    return (VEHICLES_DIR / f"{stem}.png").exists()


def process_image(stem: str, client) -> bool:
    from PIL import Image

    quality = get_quality(stem)
    source_path = get_source_image(stem)
    out_path = VEHICLES_DIR / f"{stem}.png"

    print(f"  [{quality}] {stem}")
    print(f"    源图: {source_path.name}")

    if not source_path.exists():
        print(f"    ✗ 源图不存在: {source_path}")
        return False

    # 读取并缩放源图（最大 1024px，降低传输大小）
    try:
        with Image.open(source_path) as img:
            img_rgb = img.convert("RGB")
            img_rgb.thumbnail((1024, 1024), Image.LANCZOS)
            png_buf = io.BytesIO()
            img_rgb.save(png_buf, format="PNG")
            png_buf.seek(0)
    except Exception as e:
        print(f"    ✗ 读取源图失败: {e}")
        return False

    # 调用 OpenAI API
    try:
        response = client.images.edit(
            model="gpt-image-1",
            image=("vehicle.png", png_buf, "image/png"),
            prompt=PROMPT,
            size="1024x1024",
            quality=quality,
            background="transparent",
        )
    except Exception as e:
        print(f"    ✗ API 失败: {e}")
        return False

    # 解析并保存
    try:
        img_data = base64.b64decode(response.data[0].b64_json)
        result_img = Image.open(io.BytesIO(img_data))
        if result_img.mode != "RGBA":
            result_img = result_img.convert("RGBA")
        result_img.save(out_path, format="PNG", optimize=True)
        size_kb = out_path.stat().st_size // 1024
        print(f"    ✓ → {out_path.name} ({size_kb}KB)")
        # 删除同名旧 .jpg（如果存在）
        old_jpg = VEHICLES_DIR / f"{stem}.jpg"
        if old_jpg.exists():
            old_jpg.unlink()
        return True
    except Exception as e:
        print(f"    ✗ 保存失败: {e}")
        return False


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--test", action="store_true", help="只处理前3张")
    parser.add_argument("--file", type=str, help="只处理指定 stem（不含扩展名）")
    parser.add_argument("--force", action="store_true", help="强制重处理已完成项")
    args = parser.parse_args()

    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key.startswith("sk-"):
        print("ERROR: 请设置 OPENAI_API_KEY 环境变量")
        sys.exit(1)

    from openai import OpenAI
    client = OpenAI(api_key=api_key)

    if args.file:
        stems = [args.file.replace(".png", "").replace(".jpg", "")]
    else:
        stems = ALL_STEMS
        if args.test:
            stems = stems[:3]
            print("[测试模式] 前3张\n")

    # 费用估算
    total = len(stems)
    estimated = sum(PRICE[get_quality(s)] for s in stems)
    high_n = sum(1 for s in stems if s in HIGH_QUALITY_STEMS)
    print(f"共 {total} 张 | high×{high_n} + medium×{total - high_n} | 预计 ${estimated:.2f}")
    print(f"输出: 白色车身 + 透明背景 PNG\n")

    success, fail_list = 0, []

    for i, stem in enumerate(stems, 1):
        print(f"[{i}/{total}]", end=" ")
        if not args.force and is_done(stem):
            print(f"  已完成，跳过: {stem}.png")
            success += 1
            continue

        ok = process_image(stem, client)
        if ok:
            success += 1
        else:
            fail_list.append(stem)

        if i < total:
            time.sleep(1)

    print(f"\n{'='*50}")
    print(f"完成: {success}/{total}")
    if fail_list:
        print(f"失败: {fail_list}")
        sys.exit(1)
    else:
        print("全部成功！下一步：更新代码中 .jpg → .png 引用")
    print(f"{'='*50}")


if __name__ == "__main__":
    main()
