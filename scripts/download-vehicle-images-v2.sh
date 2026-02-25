#!/bin/bash
# scripts/download-vehicle-images-v2.sh
# 按代次精准下载车辆图片：
#   M3 Pre-Highland (2017-2023) - compositor model=m3
#   M3 Highland     (2024-2025) - compositor model=m3r
#   MY Gen1 原版    (2020-2023) - Wikimedia Commons 真实照片
#   MY Juniper      (2024-2025) - compositor model=my

BASE="/Users/mystery/Desktop/mydreamtesla/public/images/vehicles"
mkdir -p "$BASE"

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120"
COMPOSITOR="https://static-assets.tesla.com/configurator/compositor"
FAILED=0

# ============================================================
# Helper: 从 Tesla Compositor 下载基础图片
# ============================================================
comp_dl() {
  local key="$1" model="$2" opts="$3"
  local url="${COMPOSITOR}?bkba_opt=2&model=${model}&options=${opts}&size=1920&view=STUD_3QTR"
  local dest="$BASE/_base_${key}.jpg"
  echo -n "  ⬇ ${key}... "
  curl -s -L -A "$UA" --max-time 30 -o "$dest" "$url"
  local sz
  sz=$(wc -c < "$dest" 2>/dev/null | tr -d ' ' || echo 0)
  if [ "$sz" -gt 10000 ]; then
    echo "✅ $((sz/1024))KB"
  else
    echo "❌ 失败(${sz}B) - $(head -c 60 "$dest" 2>/dev/null | tr -d '\n')"
    rm -f "$dest"
    FAILED=$((FAILED+1))
  fi
  sleep 0.8
}

# ============================================================
# Helper: 从 URL 下载图片
# ============================================================
url_dl() {
  local key="$1" url="$2"
  local dest="$BASE/_base_${key}.jpg"
  echo -n "  ⬇ ${key}... "
  curl -s -L -A "$UA" --max-time 30 -o "$dest" "$url"
  local sz
  sz=$(wc -c < "$dest" 2>/dev/null | tr -d ' ' || echo 0)
  if [ "$sz" -gt 20000 ]; then
    echo "✅ $((sz/1024))KB"
  else
    echo "❌ 失败(${sz}B)"
    rm -f "$dest"
    FAILED=$((FAILED+1))
  fi
  sleep 0.5
}

# ============================================================
# Helper: 复制基础图到 slug 文件
# ============================================================
cp_slug() {
  local key="$1" slug="$2"
  local src="$BASE/_base_${key}.jpg"
  local dst="$BASE/${slug}.jpg"
  if [ -f "$src" ]; then
    cp "$src" "$dst"
    echo "  📋 ${slug}.jpg ← ${key}"
  else
    echo "  ⚠️  跳过 ${slug}.jpg (缺基础图: ${key})"
  fi
}

# ============================================================
# Part 1: M3 Pre-Highland（compositor model=m3，5 张）
# 2017-2023 Model 3：原版圆润前脸
# ============================================================
echo ""
echo "=== Part 1: M3 Pre-Highland (compositor m3, 2017-2023) ==="
comp_dl "m3-pre-perf-red"  "m3" "%24PPSR%2C%24W39B"
comp_dl "m3-pre-lr-blue"   "m3" "%24PMAB%2C%24W38B"
comp_dl "m3-pre-lr-grey"   "m3" "%24PPMM%2C%24W38B"
comp_dl "m3-pre-sr-white"  "m3" "%24PPSW%2C%24W38B"
comp_dl "m3-pre-mid-black" "m3" "%24PPSB%2C%24W38B"

# ============================================================
# Part 2: M3 Highland（compositor model=m3r，4 张）
# 2024-2025 Model 3：全新锐利前脸，隐藏门把手
# ============================================================
echo ""
echo "=== Part 2: M3 Highland (compositor m3r, 2024-2025) ==="
comp_dl "m3-hl-perf-red"      "m3r" "%24PPSR%2C%24W39B"
comp_dl "m3-hl-lr-blue"       "m3r" "%24PMAB%2C%24W38B"
comp_dl "m3-hl-sr-white"      "m3r" "%24PPSW%2C%24W38B"
comp_dl "m3-hl-premium-black" "m3r" "%24PPSB%2C%24W38B"

# ============================================================
# Part 3: MY Juniper（compositor model=my，4 张）
# 2024-2025 Model Y：新前脸/尾灯，Juniper 改款
# ============================================================
echo ""
echo "=== Part 3: MY Juniper (compositor my, 2024-2025) ==="
comp_dl "my-jun-perf-red"  "my" "%24PPSR%2C%24WY20P"
comp_dl "my-jun-lr-blue"   "my" "%24PMAB%2C%24WY19B"
comp_dl "my-jun-sr-white"  "my" "%24PPSW%2C%24WY19B"
comp_dl "my-jun-awd-black" "my" "%24PPSB%2C%24WY19B"

# ============================================================
# Part 4: MY Gen1 原版（Wikimedia Commons，3 张）
# 2020-2023 Model Y：原版高车身，老式大灯（pre-Juniper）
# 先用 Python API 搜索，再回退到硬编码 URL
# ============================================================
echo ""
echo "=== Part 4: MY Gen1 原版 (Wikimedia Commons, 2020-2023) ==="

python3 - <<'PYEOF'
import urllib.request, urllib.parse, json, os, time, sys

BASE = "/Users/mystery/Desktop/mydreamtesla/public/images/vehicles"

# 搜索时排除这些关键词（Juniper 改款或不相关内容）
EXCLUDE = [
    'juniper', 'Juniper', '2024', '2025', 'facelift', 'highland', 'Highland',
    'rear', 'interior', 'charging', 'trunk', 'back', 'Rear', 'Interior'
]

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

def get_thumb_url(title):
    """获取 Wikimedia 文件 1920px 缩略图 URL"""
    api = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query", "titles": title,
        "prop": "imageinfo", "iiprop": "url",
        "iiurlwidth": "1920", "format": "json"
    }
    url = api + "?" + urllib.parse.urlencode(params)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            ii = page.get("imageinfo", [{}])
            if ii and ii[0].get("thumburl"):
                return ii[0]["thumburl"]
    except Exception as e:
        print(f"    [get_thumb_url] {e}")
    return ""

def search_wiki(query):
    """搜索 Wikimedia Commons，返回合适图片的下载 URL"""
    api = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query", "list": "search",
        "srsearch": f"filetype:bitmap {query}",
        "srnamespace": "6", "format": "json", "srlimit": "20"
    }
    url = api + "?" + urllib.parse.urlencode(params)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
        results = data.get("query", {}).get("search", [])
        for result in results:
            title = result["title"]
            tl = title.lower()
            if any(ex.lower() in tl for ex in EXCLUDE):
                continue
            # 只要 jpg/jpeg
            if not any(ext in tl for ext in ['.jpg', '.jpeg']):
                continue
            img_url = get_thumb_url(title)
            if img_url and img_url.lower().endswith(".jpg"):
                return img_url
            time.sleep(0.2)
    except Exception as e:
        print(f"    [search_wiki] {e}")
    return ""

def download(url, dest):
    """下载图片，返回文件大小（字节）"""
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
        if len(data) > 20000:
            with open(dest, 'wb') as f:
                f.write(data)
            return len(data)
    except Exception as e:
        print(f"    [download] {e}")
    return 0

searches = [
    ("my-gen1-perf-red",  "Tesla Model Y Performance AWD red 2021 front"),
    ("my-gen1-lr-blue",   "Tesla Model Y Long Range AWD 2021 blue front"),
    ("my-gen1-sr-white",  "Tesla Model Y Standard Range RWD 2021 white front"),
]

for key, query in searches:
    dest = os.path.join(BASE, f"_base_{key}.jpg")
    if os.path.exists(dest) and os.path.getsize(dest) > 20000:
        print(f"  ⏭ {key} 已存在，跳过")
        continue
    print(f"  🔍 搜索: {query}")
    img_url = search_wiki(query)
    if not img_url:
        print(f"  ❌ {key}: Wikimedia 搜索未找到合适图片")
        continue
    fname = img_url.split('/')[-1][:50]
    sz = download(img_url, dest)
    if sz > 20000:
        print(f"  ✅ {key} ({sz//1024}KB) → {fname}")
    else:
        print(f"  ❌ {key}: 下载失败")
    time.sleep(0.5)

PYEOF

# 回退：Gen1 蓝色 LR（硬编码 URL，来自前次已验证的脚本）
if [ ! -f "$BASE/_base_my-gen1-lr-blue.jpg" ]; then
  echo "  🔄 Gen1 蓝色 LR 回退到硬编码 URL..."
  url_dl "my-gen1-lr-blue" "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Tesla_Model_Y_2021032002.jpg/1920px-Tesla_Model_Y_2021032002.jpg"
fi

# 回退：Gen1 红色 Performance（硬编码备用）
if [ ! -f "$BASE/_base_my-gen1-perf-red.jpg" ]; then
  echo "  🔄 Gen1 红色 Performance 回退到硬编码 URL..."
  url_dl "my-gen1-perf-red" "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/2021_Tesla_Model_Y_Performance_AWD%2C_front_8.3.21.jpg/1920px-2021_Tesla_Model_Y_Performance_AWD%2C_front_8.3.21.jpg"
fi

# 回退：Gen1 白色（硬编码备用）
if [ ! -f "$BASE/_base_my-gen1-sr-white.jpg" ]; then
  echo "  🔄 Gen1 白色 SR 回退到硬编码 URL..."
  url_dl "my-gen1-sr-white" "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Tesla_Model_Y%2C_2021%2C_IMG_5627.jpg/1920px-Tesla_Model_Y%2C_2021%2C_IMG_5627.jpg"
fi

# 最终回退：如果 Gen1 某色仍然缺失，从已有 Gen1 图复制
if [ ! -f "$BASE/_base_my-gen1-perf-red.jpg" ] && [ -f "$BASE/_base_my-gen1-lr-blue.jpg" ]; then
  echo "  🔄 Gen1 红色回退复制自蓝色（外观一致）..."
  cp "$BASE/_base_my-gen1-lr-blue.jpg" "$BASE/_base_my-gen1-perf-red.jpg"
fi
if [ ! -f "$BASE/_base_my-gen1-sr-white.jpg" ] && [ -f "$BASE/_base_my-gen1-lr-blue.jpg" ]; then
  echo "  🔄 Gen1 白色回退复制自蓝色..."
  cp "$BASE/_base_my-gen1-lr-blue.jpg" "$BASE/_base_my-gen1-sr-white.jpg"
fi

# ============================================================
# Part 5: 模型级别图片（5 张）
# ============================================================
echo ""
echo "=== Part 5: 模型级别图片 ==="

copy_model() {
  local src_key="$1" dest_name="$2" desc="$3"
  local src="$BASE/_base_${src_key}.jpg"
  if [ -f "$src" ]; then
    cp "$src" "$BASE/${dest_name}.jpg"
    echo "  ✅ ${dest_name}.jpg (${desc})"
  else
    echo "  ⚠️  缺失 ${dest_name}.jpg (缺基础图 ${src_key})"
  fi
}

copy_model "m3-hl-perf-red"  "model-3-detail" "Highland Performance 红，详情页 Hero"
copy_model "my-jun-perf-red" "model-y-detail"  "Juniper Performance 红，详情页 Hero"
copy_model "m3-hl-sr-white"  "model-3-tile"    "Highland Premium 白，首页卡片"
copy_model "my-jun-sr-white" "model-y-tile"    "Juniper SR 白，首页卡片"
copy_model "m3-hl-lr-blue"   "hero-lineup"     "Highland Long Range 深蓝，首页 Hero"

# ============================================================
# Part 6: Model 3 slug 映射（26 个）
# ============================================================
echo ""
echo "=== Part 6: Model 3 slug 映射 ==="

echo "  --- Pre-Highland (2017-2023) ---"
# Long Range RWD → Pre 银灰
cp_slug "m3-pre-lr-grey" "model-3-2017-long-range-rwd"
cp_slug "m3-pre-lr-grey" "model-3-2018-long-range-rwd"
# Mid Range RWD → Pre 黑
cp_slug "m3-pre-mid-black" "model-3-2018-mid-range-rwd"
# Performance AWD → Pre 红
for slug in model-3-2018-performance-awd model-3-2019-performance-awd \
            model-3-2020-performance-awd model-3-2021-performance-awd \
            model-3-2022-performance-awd model-3-2023-performance-awd; do
  cp_slug "m3-pre-perf-red" "$slug"
done
# Long Range AWD → Pre 蓝
for slug in model-3-2019-long-range-awd model-3-2020-long-range-awd \
            model-3-2021-long-range-awd model-3-2022-long-range-awd \
            model-3-2023-long-range-awd; do
  cp_slug "m3-pre-lr-blue" "$slug"
done
# Standard Range + RWD → Pre 白
for slug in model-3-2019-standard-range-plus-rwd model-3-2020-standard-range-plus-rwd \
            model-3-2021-standard-range-plus-rwd model-3-2022-standard-range-plus-rwd \
            model-3-2023-standard-range-plus-rwd; do
  cp_slug "m3-pre-sr-white" "$slug"
done

echo "  --- Highland (2024-2025) ---"
# Performance AWD → Highland 红
for slug in model-3-2024-performance-awd model-3-2025-performance-awd; do
  cp_slug "m3-hl-perf-red" "$slug"
done
# Long Range AWD → Highland 蓝
for slug in model-3-2024-long-range-awd model-3-2025-long-range-awd; do
  cp_slug "m3-hl-lr-blue" "$slug"
done
# Standard Range + RWD → Highland 白
for slug in model-3-2024-standard-range-plus-rwd model-3-2025-standard-range-plus-rwd; do
  cp_slug "m3-hl-sr-white" "$slug"
done
# Premium RWD → Highland 黑
cp_slug "m3-hl-premium-black" "model-3-2025-premium-rwd"

# ============================================================
# Part 7: Model Y slug 映射（18 个）
# ============================================================
echo ""
echo "=== Part 7: Model Y slug 映射 ==="

echo "  --- Gen1 原版 (2020-2023) ---"
# Performance AWD → Gen1 红
for slug in model-y-2020-performance-awd model-y-2021-performance-awd \
            model-y-2022-performance-awd model-y-2023-performance-awd; do
  cp_slug "my-gen1-perf-red" "$slug"
done
# Long Range AWD → Gen1 蓝
for slug in model-y-2020-long-range-awd model-y-2021-long-range-awd \
            model-y-2022-long-range-awd model-y-2023-long-range-awd; do
  cp_slug "my-gen1-lr-blue" "$slug"
done
# Standard Range RWD → Gen1 白
for slug in model-y-2021-standard-range-rwd model-y-2023-standard-range-rwd; do
  cp_slug "my-gen1-sr-white" "$slug"
done

echo "  --- Juniper (2024-2025) ---"
# Performance AWD → Juniper 红
for slug in model-y-2024-performance-awd model-y-2025-performance-awd; do
  cp_slug "my-jun-perf-red" "$slug"
done
# Long Range AWD → Juniper 蓝
for slug in model-y-2024-long-range-awd model-y-2025-long-range-awd; do
  cp_slug "my-jun-lr-blue" "$slug"
done
# Standard Range RWD / Premium RWD → Juniper 白
for slug in model-y-2024-standard-range-rwd model-y-2025-standard-range-rwd \
            model-y-2025-premium-rwd; do
  cp_slug "my-jun-sr-white" "$slug"
done
# AWD base → Juniper 黑
cp_slug "my-jun-awd-black" "model-y-2025-awd"

# ============================================================
# 清理基础文件
# ============================================================
echo ""
echo "=== 清理临时基础文件 ==="
rm -f "$BASE"/_base_*.jpg
echo "  ✅ 已清理 _base_*.jpg"

# ============================================================
# 最终统计
# ============================================================
echo ""
echo "=== 最终统计 ==="
total=$(ls "$BASE"/*.jpg 2>/dev/null | wc -l | tr -d ' ')
echo "  总图片数: $total"
echo "  失败计数: $FAILED"
echo ""
echo "验证关键文件："
for f in \
  "model-3-2017-long-range-rwd.jpg" \
  "model-3-2023-performance-awd.jpg" \
  "model-3-2024-performance-awd.jpg" \
  "model-3-2025-premium-rwd.jpg" \
  "model-y-2021-performance-awd.jpg" \
  "model-y-2024-performance-awd.jpg" \
  "model-y-2025-awd.jpg" \
  "model-3-detail.jpg" \
  "model-y-detail.jpg" \
  "hero-lineup.jpg"; do
  if [ -f "$BASE/$f" ]; then
    sz=$(wc -c < "$BASE/$f" | tr -d ' ')
    echo "  ✅ $f (${sz}B)"
  else
    echo "  ❌ 缺失: $f"
  fi
done
