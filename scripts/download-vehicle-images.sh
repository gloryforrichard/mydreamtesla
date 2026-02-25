#!/bin/bash
# 用 Tesla Compositor API 下载车辆图片
# curl 可以成功访问（Python urllib 被 403）

BASE="/Users/mystery/Desktop/mydreamtesla/public/images/vehicles"
mkdir -p "$BASE"

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120"
COMPOSITOR="https://static-assets.tesla.com/configurator/compositor"

download() {
  local url="$1"
  local dest="$2"
  local name=$(basename "$dest")
  curl -s -L -A "$UA" -o "$dest" "$url"
  local size=$(wc -c < "$dest" 2>/dev/null || echo 0)
  if [ "$size" -gt 10000 ]; then
    echo "  ✅ $name ($(( size / 1024 ))KB)"
  else
    echo "  ❌ $name 过小($size B) - $(head -c 100 "$dest" 2>/dev/null)"
    rm -f "$dest"
  fi
  sleep 0.3
}

copy_base() {
  local src="$BASE/_base_$1.png"
  local dst="$BASE/$2.png"
  if [ -f "$src" ]; then
    cp "$src" "$dst"
    echo "  📋 $2.png ← $1"
  else
    echo "  ⚠️  缺失: $1 → $2"
  fi
}

echo ""
echo "=== Model 3 基础图片 ==="
# Red Performance
download "${COMPOSITOR}?bkba_opt=2&model=m3&options=%24PPSR%2C%24W39B&size=1920&view=STUD_3QTR" "$BASE/_base_m3-perf-red.png"
# Deep Blue Long Range AWD
download "${COMPOSITOR}?bkba_opt=2&model=m3&options=%24PMAB%2C%24W38B%2C%24DV4W&size=1920&view=STUD_3QTR" "$BASE/_base_m3-lr-awd-blue.png"
# Midnight Silver Long Range RWD
download "${COMPOSITOR}?bkba_opt=2&model=m3&options=%24PPMM%2C%24W38B&size=1920&view=STUD_3QTR" "$BASE/_base_m3-lr-rwd-grey.png"
# Pearl White Standard Range
download "${COMPOSITOR}?bkba_opt=2&model=m3&options=%24PPSW%2C%24W38B&size=1920&view=STUD_3QTR" "$BASE/_base_m3-sr-white.png"
# Solid Black Mid Range
download "${COMPOSITOR}?bkba_opt=2&model=m3&options=%24PPSB%2C%24W38B&size=1920&view=STUD_3QTR" "$BASE/_base_m3-sr-black.png"

echo ""
echo "=== Model Y 基础图片 ==="
# Red Performance
download "${COMPOSITOR}?bkba_opt=2&model=my&options=%24PPSR%2C%24WY20P%2C%24DV4W&size=1920&view=STUD_3QTR" "$BASE/_base_my-perf-red.png"
# Deep Blue Long Range AWD
download "${COMPOSITOR}?bkba_opt=2&model=my&options=%24PMAB%2C%24WY19B%2C%24DV4W&size=1920&view=STUD_3QTR" "$BASE/_base_my-lr-awd-blue.png"
# Midnight Silver Long Range AWD (early 2020)
download "${COMPOSITOR}?bkba_opt=2&model=my&options=%24PPMM%2C%24WY19B%2C%24DV4W&size=1920&view=STUD_3QTR" "$BASE/_base_my-lr-awd-grey.png"
# Pearl White Standard Range RWD
download "${COMPOSITOR}?bkba_opt=2&model=my&options=%24PPSW%2C%24WY19B&size=1920&view=STUD_3QTR" "$BASE/_base_my-sr-white.png"
# Solid Black 2025 AWD
download "${COMPOSITOR}?bkba_opt=2&model=my&options=%24PPSB%2C%24WY19B%2C%24DV4W&size=1920&view=STUD_3QTR" "$BASE/_base_my-awd-black.png"

echo ""
echo "=== 模型级图片 ==="
# model-3-detail.png: 蓝色 3/4 正面
download "${COMPOSITOR}?bkba_opt=2&model=m3&options=%24PMAB%2C%24W38B%2C%24DV4W&size=2400&view=STUD_3QTR" "$BASE/model-3-detail.png"
# model-y-detail.png: 蓝色 3/4 正面
download "${COMPOSITOR}?bkba_opt=2&model=my&options=%24PMAB%2C%24WY19B%2C%24DV4W&size=2400&view=STUD_3QTR" "$BASE/model-y-detail.png"
# model-3-tile.png: 白色侧面小图
download "${COMPOSITOR}?bkba_opt=2&model=m3&options=%24PPSW%2C%24W38B&size=800&view=STUD_SIDE" "$BASE/model-3-tile.png"
# model-y-tile.png: 白色侧面小图
download "${COMPOSITOR}?bkba_opt=2&model=my&options=%24PPSW%2C%24WY19B&size=800&view=STUD_SIDE" "$BASE/model-y-tile.png"
# hero-lineup.png: 黑色正面大图
download "${COMPOSITOR}?bkba_opt=2&model=m3&options=%24PPSB%2C%24W38B%2C%24DV4W&size=2400&view=STUD_3QTR" "$BASE/hero-lineup.png"

echo ""
echo "=== 为每个车辆 slug 复制对应图片 ==="

# Model 3 Performance AWD → 红色
for slug in model-3-2018-performance-awd model-3-2019-performance-awd model-3-2020-performance-awd \
            model-3-2021-performance-awd model-3-2022-performance-awd model-3-2023-performance-awd \
            model-3-2024-performance-awd model-3-2025-performance-awd; do
  copy_base "m3-perf-red" "$slug"
done

# Model 3 Long Range AWD → 深蓝
for slug in model-3-2019-long-range-awd model-3-2020-long-range-awd model-3-2021-long-range-awd \
            model-3-2022-long-range-awd model-3-2023-long-range-awd model-3-2024-long-range-awd \
            model-3-2025-long-range-awd; do
  copy_base "m3-lr-awd-blue" "$slug"
done

# Model 3 Long Range RWD → 银灰
for slug in model-3-2017-long-range-rwd model-3-2018-long-range-rwd; do
  copy_base "m3-lr-rwd-grey" "$slug"
done

# Model 3 Standard Range / RWD → 白色
for slug in model-3-2019-standard-range-plus-rwd model-3-2020-standard-range-plus-rwd \
            model-3-2021-standard-range-plus-rwd model-3-2022-standard-range-plus-rwd \
            model-3-2023-standard-range-plus-rwd model-3-2024-standard-range-plus-rwd \
            model-3-2025-standard-range-plus-rwd; do
  copy_base "m3-sr-white" "$slug"
done

# Model 3 Mid Range / Premium RWD → 黑色
for slug in model-3-2018-mid-range-rwd model-3-2025-premium-rwd; do
  copy_base "m3-sr-black" "$slug"
done

# Model Y Performance AWD → 红色
for slug in model-y-2020-performance-awd model-y-2021-performance-awd model-y-2022-performance-awd \
            model-y-2023-performance-awd model-y-2024-performance-awd model-y-2025-performance-awd; do
  copy_base "my-perf-red" "$slug"
done

# Model Y Long Range AWD → 深蓝
for slug in model-y-2021-long-range-awd model-y-2022-long-range-awd model-y-2023-long-range-awd \
            model-y-2024-long-range-awd model-y-2025-long-range-awd model-y-2025-premium-rwd; do
  copy_base "my-lr-awd-blue" "$slug"
done

# Model Y 2020 LR → 银灰
copy_base "my-lr-awd-grey" "model-y-2020-long-range-awd"

# Model Y Standard Range RWD → 白色
for slug in model-y-2021-standard-range-rwd model-y-2023-standard-range-rwd \
            model-y-2024-standard-range-rwd model-y-2025-standard-range-rwd; do
  copy_base "my-sr-white" "$slug"
done

# Model Y 2025 AWD → 黑色
copy_base "my-awd-black" "model-y-2025-awd"

echo ""
echo "=== 清理基础文件 ==="
rm -f "$BASE"/_base_*.png
echo "已清理"

echo ""
echo "=== 最终统计 ==="
count=$(ls "$BASE"/*.png 2>/dev/null | wc -l)
echo "总图片数: $count"
ls -lh "$BASE"/*.png 2>/dev/null | awk '{print "  "$5, $9}'
