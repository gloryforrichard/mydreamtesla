#!/bin/bash
# 从 Wikimedia Commons 下载 Tesla 车辆图片
# 所有图片均为 CC 协议，免费使用

BASE="/Users/mystery/Desktop/mydreamtesla/public/images/vehicles"
mkdir -p "$BASE"

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

dl() {
  local url="$1"; local dest="$2"; local name=$(basename "$dest")
  curl -s -L -A "$UA" -o "$dest" "$url"
  local size=$(wc -c < "$dest" 2>/dev/null || echo 0)
  if [ "$size" -gt 20000 ]; then
    echo "  ✅ $name ($(( size / 1024 ))KB)"
  else
    echo "  ❌ $name 失败 ($size B)"
    rm -f "$dest"
  fi
  sleep 0.4
}

cp_base() {
  local src="$BASE/_base_$1.jpg"; local dst="$BASE/$2.jpg"
  [ ! -f "$src" ] && src="$BASE/_base_$1.png" && dst="$BASE/$2.png"
  if [ -f "$src" ]; then
    cp "$src" "$dst"; echo "  📋 $2 ← $1"
  else
    echo "  ⚠️  缺失: $1"
  fi
}

echo ""
echo "=== 下载 Model 3 基础图片 ==="

# Performance - Ultra Red 正面
dl "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Tesla_Model_3_Performance_Facelift_Ultra_Red_-_front.jpg/1920px-Tesla_Model_3_Performance_Facelift_Ultra_Red_-_front.jpg" \
   "$BASE/_base_m3-perf-red.jpg"

# Long Range 2018 蓝色
dl "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/2018_tesla_mode_3_long_range_2.jpg/1920px-2018_tesla_mode_3_long_range_2.jpg" \
   "$BASE/_base_m3-lr-awd-blue.jpg"

# 2019 LR AWD Red (用于 Long Range 类目的备用)
dl "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/2019_Tesla_Model_3_Long_Range_Dual_Motor_in_Red_Multi-Coat%2C_front_left%2C_2021-05-30.jpg/1920px-2019_Tesla_Model_3_Long_Range_Dual_Motor_in_Red_Multi-Coat%2C_front_left%2C_2021-05-30.jpg" \
   "$BASE/_base_m3-lr-rwd-grey.jpg"

# 2023 白色
dl "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Tesla_Model_3_%282023%29_IMG_9488_%28cropped%29.jpg/1920px-Tesla_Model_3_%282023%29_IMG_9488_%28cropped%29.jpg" \
   "$BASE/_base_m3-sr-white.jpg"

# 2024 黑色 EMS
dl "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Tesla_Model_3%2C_EMS_2024%2C_Essen_%28P1032260%29.jpg/1920px-Tesla_Model_3%2C_EMS_2024%2C_Essen_%28P1032260%29.jpg" \
   "$BASE/_base_m3-sr-black.jpg"

echo ""
echo "=== 下载 Model Y 基础图片 ==="

# Performance 2025 红色
dl "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Tesla_Model_Y_Performance_%282025%29_autoMOBIL_T%C3%BCbingen_2025_DSC_2801.jpg/1920px-Tesla_Model_Y_Performance_%282025%29_autoMOBIL_T%C3%BCbingen_2025_DSC_2801.jpg" \
   "$BASE/_base_my-perf-red.jpg"

# Long Range AWD 蓝色
dl "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Tesla_Model_Y_2021032002.jpg/1920px-Tesla_Model_Y_2021032002.jpg" \
   "$BASE/_base_my-lr-awd-blue.jpg"

# Juniper Stealth Grey (2024+)
dl "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Tesla_Model_Y_Juniper_Stealth_Grey_%288%29.jpg/1920px-Tesla_Model_Y_Juniper_Stealth_Grey_%288%29.jpg" \
   "$BASE/_base_my-lr-awd-grey.jpg"

# 2025 白色
dl "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Tesla_Model_Y_%282025%29_MYLE_Festival_2025_DSC_9565.jpg/1920px-Tesla_Model_Y_%282025%29_MYLE_Festival_2025_DSC_9565.jpg" \
   "$BASE/_base_my-sr-white.jpg"

# Juniper AWD 白+黑 配色 (2025 AWD base)
dl "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tesla_Model_Y_Juniper_Long_Range_AWD_White_%2B_Black_-_front.jpg/1920px-Tesla_Model_Y_Juniper_Long_Range_AWD_White_%2B_Black_-_front.jpg" \
   "$BASE/_base_my-awd-black.jpg"

echo ""
echo "=== 模型级别图片 ==="
# model-3-detail: 用 Performance 红色（显眼）
[ -f "$BASE/_base_m3-perf-red.jpg" ] && cp "$BASE/_base_m3-perf-red.jpg" "$BASE/model-3-detail.jpg" && echo "  ✅ model-3-detail.jpg"
# model-y-detail: 用 Performance 红色
[ -f "$BASE/_base_my-perf-red.jpg" ] && cp "$BASE/_base_my-perf-red.jpg" "$BASE/model-y-detail.jpg" && echo "  ✅ model-y-detail.jpg"
# model-3-tile: 用白色
[ -f "$BASE/_base_m3-sr-white.jpg" ] && cp "$BASE/_base_m3-sr-white.jpg" "$BASE/model-3-tile.jpg" && echo "  ✅ model-3-tile.jpg"
# model-y-tile: 用白色
[ -f "$BASE/_base_my-sr-white.jpg" ] && cp "$BASE/_base_my-sr-white.jpg" "$BASE/model-y-tile.jpg" && echo "  ✅ model-y-tile.jpg"
# hero-lineup: 用蓝色 LR（视觉效果好）
[ -f "$BASE/_base_m3-lr-awd-blue.jpg" ] && cp "$BASE/_base_m3-lr-awd-blue.jpg" "$BASE/hero-lineup.jpg" && echo "  ✅ hero-lineup.jpg"

echo ""
echo "=== Model 3 各 slug 图片 ==="

# Performance AWD → 红色
for slug in model-3-2018-performance-awd model-3-2019-performance-awd \
            model-3-2020-performance-awd model-3-2021-performance-awd \
            model-3-2022-performance-awd model-3-2023-performance-awd \
            model-3-2024-performance-awd model-3-2025-performance-awd; do
  cp_base "m3-perf-red" "$slug"
done

# Long Range AWD → 蓝色/红色
for slug in model-3-2019-long-range-awd model-3-2020-long-range-awd \
            model-3-2021-long-range-awd model-3-2022-long-range-awd \
            model-3-2023-long-range-awd model-3-2024-long-range-awd \
            model-3-2025-long-range-awd; do
  cp_base "m3-lr-awd-blue" "$slug"
done

# Long Range RWD 早期 → 暗红/棕
for slug in model-3-2017-long-range-rwd model-3-2018-long-range-rwd; do
  cp_base "m3-lr-rwd-grey" "$slug"
done

# Standard Range / RWD → 白色
for slug in model-3-2019-standard-range-plus-rwd model-3-2020-standard-range-plus-rwd \
            model-3-2021-standard-range-plus-rwd model-3-2022-standard-range-plus-rwd \
            model-3-2023-standard-range-plus-rwd model-3-2024-standard-range-plus-rwd \
            model-3-2025-standard-range-plus-rwd; do
  cp_base "m3-sr-white" "$slug"
done

# Mid Range / Premium RWD → 黑色
for slug in model-3-2018-mid-range-rwd model-3-2025-premium-rwd; do
  cp_base "m3-sr-black" "$slug"
done

echo ""
echo "=== Model Y 各 slug 图片 ==="

# Performance AWD → 红色
for slug in model-y-2020-performance-awd model-y-2021-performance-awd \
            model-y-2022-performance-awd model-y-2023-performance-awd \
            model-y-2024-performance-awd model-y-2025-performance-awd; do
  cp_base "my-perf-red" "$slug"
done

# Long Range AWD → 蓝色
for slug in model-y-2021-long-range-awd model-y-2022-long-range-awd \
            model-y-2023-long-range-awd model-y-2024-long-range-awd \
            model-y-2025-long-range-awd model-y-2025-premium-rwd; do
  cp_base "my-lr-awd-blue" "$slug"
done

# 2020 LR → 灰色
cp_base "my-lr-awd-grey" "model-y-2020-long-range-awd"

# Standard Range RWD → 白色
for slug in model-y-2021-standard-range-rwd model-y-2023-standard-range-rwd \
            model-y-2024-standard-range-rwd model-y-2025-standard-range-rwd; do
  cp_base "my-sr-white" "$slug"
done

# 2025 AWD base → Juniper 配色
cp_base "my-awd-black" "model-y-2025-awd"

echo ""
echo "=== 清理基础文件 ==="
rm -f "$BASE"/_base_*.jpg "$BASE"/_base_*.png
echo "已清理"

echo ""
echo "=== 最终统计 ==="
total=$(ls "$BASE"/*.jpg "$BASE"/*.png 2>/dev/null | wc -l)
echo "总图片数: $total"
ls -lh "$BASE"/*.jpg 2>/dev/null | awk '{print "  "$5"\t"$9}' | sed 's|.*/||'
