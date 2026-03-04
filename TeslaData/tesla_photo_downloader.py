#!/usr/bin/env python3
"""
Tesla Model 3 & Model Y 照片自动下载器
=====================================
运行前请安装依赖：
  pip install selenium requests beautifulsoup4 webdriver-manager Pillow

Chrome/Edge 浏览器需已安装（会自动下载对应的驱动）

用法：
  python tesla_photo_downloader.py

文件夹结构：
  Tesla_Photos/
  ├── Model_3/
  │   ├── 2017-2020_Gen1_原版/
  │   │   ├── 外观_exterior/
  │   │   └── 内饰_interior/
  │   ├── 2021_中期改款/
  │   ├── 2022-2023_PreHighland/
  │   └── 2024_Highland/
  └── Model_Y/
      ├── 2020-2022_Gen1_原版/
      ├── 2023-2024_PreJuniper/
      └── 2025_Juniper/
"""

import os
import re
import sys
import time
import json
import hashlib
import logging
import subprocess
from pathlib import Path
from urllib.parse import urlparse, urljoin

# ---- 自动安装缺失的依赖包 ----
REQUIRED = {
    "requests": "requests",
    "bs4": "beautifulsoup4",
    "selenium": "selenium",
    "webdriver_manager": "webdriver-manager",
}
for module, package in REQUIRED.items():
    try:
        __import__(module)
    except ImportError:
        print(f"📦 正在安装 {package} ...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package, "-q",
                               "--break-system-packages"])

import requests
from bs4 import BeautifulSoup

# ---- 可选：如果已安装selenium则启用动态抓取 ----
try:
    from selenium import webdriver
    from selenium.webdriver.common.by import By
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    from webdriver_manager.chrome import ChromeDriverManager
    from selenium.webdriver.chrome.service import Service
    SELENIUM_AVAILABLE = True
except ImportError:
    SELENIUM_AVAILABLE = False
    print("⚠️  未安装 selenium，将使用静态模式（部分JS页面可能图片不完整）")
    print("   请运行: pip install selenium webdriver-manager")

# ============================================================
# 配置区域
# ============================================================

# 下载目录（可修改为您希望的路径）
DOWNLOAD_DIR = Path("Tesla_Photos")

# 每张图片下载间隔（秒）—— 避免请求过快
DOWNLOAD_DELAY = 0.5

# 图片最小尺寸要求（字节），过滤掉缩略图和图标
MIN_IMAGE_SIZE = 20_000  # 20KB

# 浏览器等待页面加载时间（秒）
PAGE_LOAD_TIMEOUT = 15

# 请求头（模拟浏览器）
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/121.0.0.0 Safari/537.36",
    "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    # Referer 由每次下载动态设置（=图库页面URL），不在此全局写死
}

# ============================================================
# 图库定义 —— 按型号 / 世代 / 内外分类
# ============================================================

GALLERIES = {

    # ==========================
    # Model 3
    # ==========================

    "Model_3/2017-2020_Gen1_原版/外观_exterior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-3/2018/photos-exterior",
            "label": "USNews_2018_外观"
        },
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-3/2019/photos-exterior",
            "label": "USNews_2019_外观"
        },
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-3/2020/photos-exterior",
            "label": "USNews_2020_外观"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-3/2018/pictures/exterior/",
            "label": "Edmunds_2018_外观"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-3/2019/pictures/exterior/",
            "label": "Edmunds_2019_外观"
        },
    ],

    "Model_3/2017-2020_Gen1_原版/内饰_interior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-3/2018/photos-interior",
            "label": "USNews_2018_内饰"
        },
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-3/2019/photos-interior",
            "label": "USNews_2019_内饰"
        },
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-3/2020/photos-interior",
            "label": "USNews_2020_内饰"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-3/2018/pictures/interior/",
            "label": "Edmunds_2018_内饰"
        },
    ],

    "Model_3/2021_中期改款/外观_exterior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-3/2021/photos-exterior/rear-view",
            "label": "USNews_2021_外观"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-3/2021/pictures/exterior/",
            "label": "Edmunds_2021_外观"
        },
        {
            "source": "carbuzz",
            "url": "https://carbuzz.com/cars/tesla/model-3/2021/photos-exterior/",
            "label": "CarBuzz_2021_外观"
        },
    ],

    "Model_3/2021_中期改款/内饰_interior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-3/2021/photos-interior",
            "label": "USNews_2021_内饰"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-3/2021/pictures/interior/",
            "label": "Edmunds_2021_内饰"
        },
        {
            "source": "carbuzz",
            "url": "https://carbuzz.com/cars/tesla/model-3/2021/photos-interior/",
            "label": "CarBuzz_2021_内饰"
        },
    ],

    "Model_3/2022-2023_PreHighland/外观_exterior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-3/2023/photos-exterior/2023-tesla-model-3-4-custom",
            "label": "USNews_2023_外观"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-3/2023/pictures/exterior/",
            "label": "Edmunds_2023_外观"
        },
    ],

    "Model_3/2022-2023_PreHighland/内饰_interior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-3/2022/photos-interior",
            "label": "USNews_2022_内饰"
        },
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-3/2023/photos-interior",
            "label": "USNews_2023_内饰"
        },
        {
            "source": "carbuzz",
            "url": "https://carbuzz.com/cars/tesla/model-3/2023/photos-interior/",
            "label": "CarBuzz_2023_内饰"
        },
    ],

    "Model_3/2024_Highland/外观_exterior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-3/2024/photos-exterior",
            "label": "USNews_2024_Highland_外观"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-3/2024/pictures/exterior/",
            "label": "Edmunds_2024_Highland_外观"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-3/2025/pictures/exterior/",
            "label": "Edmunds_2025_外观"
        },
    ],

    "Model_3/2024_Highland/内饰_interior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-3/photos-interior",
            "label": "USNews_2024_Highland_内饰"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-3/2024/pictures/interior/",
            "label": "Edmunds_2024_Highland_内饰"
        },
        {
            "source": "carbuzz",
            "url": "https://carbuzz.com/cars/tesla/model-3/photos-interior/",
            "label": "CarBuzz_2024_内饰"
        },
    ],

    # ==========================
    # Model Y
    # ==========================

    "Model_Y/2020-2022_Gen1_原版/外观_exterior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-y/2020/photos-exterior",
            "label": "USNews_2020_ModelY_外观"
        },
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-y/2021/photos-exterior",
            "label": "USNews_2021_ModelY_外观"
        },
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-y/2022/photos-exterior",
            "label": "USNews_2022_ModelY_外观"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-y/2020/pictures/exterior/",
            "label": "Edmunds_2020_ModelY_外观"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-y/2021/pictures/exterior/",
            "label": "Edmunds_2021_ModelY_外观"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-y/2022/pictures/exterior/",
            "label": "Edmunds_2022_ModelY_外观"
        },
    ],

    "Model_Y/2020-2022_Gen1_原版/内饰_interior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-y/2020/photos-interior",
            "label": "USNews_2020_ModelY_内饰"
        },
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-y/2021/photos-interior",
            "label": "USNews_2021_ModelY_内饰"
        },
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-y/2022/photos-interior",
            "label": "USNews_2022_ModelY_内饰"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-y/2022/pictures/interior/",
            "label": "Edmunds_2022_ModelY_内饰"
        },
    ],

    "Model_Y/2023-2024_PreJuniper/外观_exterior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-y/2023/photos-exterior",
            "label": "USNews_2023_ModelY_外观"
        },
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-y/2024/photos-exterior",
            "label": "USNews_2024_ModelY_外观"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-y/2024/pictures/exterior/",
            "label": "Edmunds_2024_ModelY_外观"
        },
    ],

    "Model_Y/2023-2024_PreJuniper/内饰_interior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-y/2023/photos-interior",
            "label": "USNews_2023_ModelY_内饰"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-y/2024/pictures/interior/",
            "label": "Edmunds_2024_ModelY_内饰"
        },
    ],

    "Model_Y/2025_Juniper/外观_exterior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-y/2025/photos-exterior",
            "label": "USNews_2025_Juniper_外观"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-y/2025/pictures/exterior/",
            "label": "Edmunds_2025_Juniper_外观"
        },
        {
            "source": "insideevs",
            "url": "https://insideevs.com/features/749272/tesla-model-y-juniper-look/",
            "label": "InsideEVs_Juniper_外观"
        },
    ],

    "Model_Y/2025_Juniper/内饰_interior": [
        {
            "source": "usnews",
            "url": "https://cars.usnews.com/cars-trucks/tesla/model-y/2025/photos-interior",
            "label": "USNews_2025_Juniper_内饰"
        },
        {
            "source": "edmunds",
            "url": "https://www.edmunds.com/tesla/model-y/2025/pictures/interior/",
            "label": "Edmunds_2025_Juniper_内饰"
        },
        {
            "source": "insideevs",
            "url": "https://insideevs.com/reviews/724281/tesla-model-y-juniper-update/",
            "label": "InsideEVs_Juniper_内饰"
        },
    ],
}

# ============================================================
# 各网站图片提取策略
# ============================================================

def extract_images_edmunds(driver, url):
    """Edmunds — 高清图片在 <img> 的 srcset 中"""
    driver.get(url)
    time.sleep(PAGE_LOAD_TIMEOUT)
    # 滚动到底部触发懒加载
    for _ in range(5):
        driver.execute_script("window.scrollBy(0, 1500)")
        time.sleep(1)
    # 点击所有图片展开高清
    imgs = driver.execute_script("""
        var results = [];
        var imgs = document.querySelectorAll('img[srcset], img[data-src], img[src]');
        for (var img of imgs) {
            var src = img.getAttribute('srcset') || img.getAttribute('data-src') || img.getAttribute('src') || '';
            // srcset 取最后一个（最大）
            if (src.includes(',')) {
                var parts = src.split(',');
                src = parts[parts.length - 1].trim().split(' ')[0];
            }
            if (src && src.startsWith('http') && src.includes('media') && !src.includes('logo')) {
                results.push(src);
            }
        }
        return results;
    """)
    return list(set(imgs))


def extract_images_usnews(driver, url):
    """U.S. News — 图片在 <picture> 的 source srcset 中"""
    driver.get(url)
    time.sleep(PAGE_LOAD_TIMEOUT)
    for _ in range(5):
        driver.execute_script("window.scrollBy(0, 1500)")
        time.sleep(1)
    imgs = driver.execute_script("""
        var results = [];
        var sources = document.querySelectorAll('picture source, img[data-src], img[src]');
        for (var el of sources) {
            var src = el.getAttribute('srcset') || el.getAttribute('data-src') || el.getAttribute('src') || '';
            if (src.includes(',')) {
                var parts = src.split(',');
                src = parts[parts.length - 1].trim().split(' ')[0];
            }
            if (src && src.startsWith('http') && (src.includes('.jpg') || src.includes('.webp') || src.includes('.jpeg'))) {
                // 获取最高清版本（替换尺寸参数）
                src = src.replace(/\\/\\d+x\\d+\\//, '/1200x800/');
                results.push(src);
            }
        }
        return results;
    """)
    return list(set(imgs))


def extract_images_carbuzz(driver, url):
    """CarBuzz — 图片在 data-src 中"""
    driver.get(url)
    time.sleep(PAGE_LOAD_TIMEOUT)
    for _ in range(5):
        driver.execute_script("window.scrollBy(0, 1500)")
        time.sleep(1)
    imgs = driver.execute_script("""
        var results = [];
        var els = document.querySelectorAll('img[data-src], img[src], picture source');
        for (var el of els) {
            var src = el.getAttribute('data-src') || el.getAttribute('srcset') || el.getAttribute('src') || '';
            if (src.includes(',')) {
                var parts = src.split(',');
                src = parts[parts.length - 1].trim().split(' ')[0];
            }
            if (src && src.startsWith('http') && (src.includes('.jpg') || src.includes('.webp') || src.includes('.jpeg'))
                && !src.includes('logo') && !src.includes('icon')) {
                results.push(src);
            }
        }
        return results;
    """)
    return list(set(imgs))


def extract_images_generic(driver, url):
    """通用提取（InsideEVs等）"""
    driver.get(url)
    time.sleep(PAGE_LOAD_TIMEOUT)
    for _ in range(5):
        driver.execute_script("window.scrollBy(0, 1500)")
        time.sleep(1)
    imgs = driver.execute_script("""
        var results = [];
        var els = document.querySelectorAll('img');
        for (var el of els) {
            var src = el.getAttribute('data-src') || el.getAttribute('data-lazy-src')
                      || el.getAttribute('srcset') || el.getAttribute('src') || '';
            if (src.includes(',')) {
                var parts = src.split(',');
                src = parts[parts.length - 1].trim().split(' ')[0];
            }
            if (src && src.startsWith('http') && (src.includes('.jpg') || src.includes('.webp') || src.includes('.jpeg'))
                && el.naturalWidth > 300) {
                results.push(src);
            }
        }
        return results;
    """)
    return list(set(imgs))


EXTRACTORS = {
    "edmunds": extract_images_edmunds,
    "usnews": extract_images_usnews,
    "carbuzz": extract_images_carbuzz,
    "insideevs": extract_images_generic,
}


# ============================================================
# 下载函数
# ============================================================

def download_image(url, save_path, session, referer=None):
    """下载单张图片，返回 True/False。带 Referer + 重试"""
    headers = dict(session.headers)
    if referer:
        headers["Referer"] = referer
    for attempt in range(3):
        try:
            resp = session.get(url, timeout=30, stream=True, headers=headers)
            if resp.status_code == 403:
                return False   # 明确拒绝，不重试
            if resp.status_code != 200:
                time.sleep(2)
                continue
            data = resp.content
            if len(data) < MIN_IMAGE_SIZE:
                return False
            with open(save_path, "wb") as f:
                f.write(data)
            return True
        except Exception as e:
            if attempt == 2:
                print(f"    ⚠️  下载失败（已重试3次）: {e}")
            else:
                time.sleep(3)
    return False


def url_to_filename(url, idx, label):
    """将URL转换为安全的文件名"""
    parsed = urlparse(url)
    ext = os.path.splitext(parsed.path)[1]
    if not ext or ext not in [".jpg", ".jpeg", ".webp", ".png", ".avif"]:
        ext = ".jpg"
    # 用md5避免重复
    h = hashlib.md5(url.encode()).hexdigest()[:8]
    return f"{label}_{idx:03d}_{h}{ext}"


# ============================================================
# 主程序
# ============================================================

def setup_driver():
    """初始化Selenium浏览器"""
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)
    options.add_argument(f"user-agent={HEADERS['User-Agent']}")
    try:
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=options)
        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        return driver
    except Exception as e:
        print(f"❌ 无法启动Chrome，请确认已安装Chrome浏览器: {e}")
        return None


def generate_html_index(download_dir):
    """生成本地HTML浏览索引"""
    html_parts = ["""<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tesla Model 3 & Model Y 照片库</title>
<style>
  body { font-family: Arial, sans-serif; background: #111; color: #eee; margin: 0; }
  h1 { text-align:center; color: #CC0000; padding: 20px; margin: 0; background: #1a1a1a; }
  h2 { color: #CC0000; padding: 10px 20px; border-left: 5px solid #CC0000; margin: 30px 20px 10px; }
  h3 { color: #aaa; padding: 5px 30px; margin: 20px 20px 5px; }
  .gallery { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px 20px; }
  .gallery img { width: 280px; height: 185px; object-fit: cover; border-radius: 4px;
                  cursor: pointer; transition: transform 0.2s; border: 2px solid #333; }
  .gallery img:hover { transform: scale(1.05); border-color: #CC0000; }
  .lightbox { display:none; position:fixed; top:0; left:0; width:100%; height:100%;
               background:rgba(0,0,0,0.9); z-index:1000; justify-content:center; align-items:center; }
  .lightbox.active { display: flex; }
  .lightbox img { max-width:90%; max-height:90%; border-radius: 8px; }
  .lightbox-close { position:fixed; top:20px; right:30px; color:white; font-size:40px;
                     cursor:pointer; z-index:1001; }
  .count { color: #888; font-size: 13px; padding: 0 30px; }
  nav { position: sticky; top: 0; background: #1a1a1a; padding: 10px 20px; z-index: 100;
        border-bottom: 2px solid #CC0000; }
  nav a { color: #CC0000; text-decoration: none; margin-right: 15px; font-size: 14px; }
  nav a:hover { text-decoration: underline; }
</style>
</head>
<body>
<h1>🚗 Tesla Model 3 & Model Y 照片库</h1>
<nav>"""]

    nav_links = []
    sections = []

    for folder_key in sorted(GALLERIES.keys()):
        folder_path = download_dir / folder_key
        if not folder_path.exists():
            continue
        imgs = sorted(list(folder_path.glob("*.jpg")) + list(folder_path.glob("*.jpeg")) +
                      list(folder_path.glob("*.webp")) + list(folder_path.glob("*.png")))
        if not imgs:
            continue
        parts = folder_key.split("/")
        model = parts[0].replace("_", " ")
        gen = parts[1].replace("_", " ") if len(parts) > 1 else ""
        cat = parts[2].replace("_", " ") if len(parts) > 2 else ""
        anchor = folder_key.replace("/", "_").replace(" ", "_")
        nav_links.append(f'<a href="#{anchor}">{model} · {gen} · {cat}</a>')
        img_tags = "\n".join(
            f'<img src="{img.relative_to(download_dir)}" '
            f'alt="{img.stem}" onclick="openLightbox(this.src)" loading="lazy">'
            for img in imgs
        )
        sections.append(f"""
<h2 id="{anchor}">{model}</h2>
<h3>{gen} — {cat}</h3>
<p class="count">共 {len(imgs)} 张照片</p>
<div class="gallery">{img_tags}</div>
""")

    html_parts.append("\n".join(nav_links))
    html_parts.append("</nav>")
    html_parts.extend(sections)
    html_parts.append("""
<div class="lightbox" id="lightbox" onclick="closeLightbox()">
  <span class="lightbox-close" onclick="closeLightbox()">✕</span>
  <img id="lightbox-img" src="" alt="">
</div>
<script>
function openLightbox(src) {
  document.getElementById('lightbox-img').src = src;
  document.getElementById('lightbox').classList.add('active');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('active');
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightbox();
});
</script>
</body>
</html>""")

    index_path = download_dir / "📸 Tesla照片库_双击打开.html"
    with open(index_path, "w", encoding="utf-8") as f:
        f.write("\n".join(html_parts))
    print(f"\n✅ HTML索引已生成：{index_path}")
    return index_path


def main():
    logging.basicConfig(level=logging.WARNING)
    print("=" * 60)
    print("  Tesla Model 3 & Model Y 照片下载器")
    print("=" * 60)

    if not SELENIUM_AVAILABLE:
        print("\n❌ 需要安装 selenium 和 webdriver-manager：")
        print("   pip install selenium webdriver-manager")
        return

    driver = setup_driver()
    if not driver:
        return

    session = requests.Session()
    session.headers.update(HEADERS)

    total_downloaded = 0
    total_skipped = 0
    results_log = {}

    for folder_key, gallery_list in GALLERIES.items():
        folder_path = DOWNLOAD_DIR / folder_key
        folder_path.mkdir(parents=True, exist_ok=True)

        print(f"\n📁 {folder_key}")
        print(f"   ({len(gallery_list)} 个图库来源)")

        folder_count = 0

        for gallery in gallery_list:
            label = gallery["label"]
            url = gallery["url"]
            source = gallery["source"]

            print(f"\n  🌐 {label}")
            print(f"     {url}")

            try:
                extractor = EXTRACTORS.get(source, extract_images_generic)
                img_urls = extractor(driver, url)
                print(f"     找到 {len(img_urls)} 个图片URL")

                for idx, img_url in enumerate(img_urls):
                    filename = url_to_filename(img_url, idx, label)
                    save_path = folder_path / filename

                    if save_path.exists():
                        total_skipped += 1
                        continue

                    time.sleep(DOWNLOAD_DELAY)
                    ok = download_image(img_url, save_path, session, referer=url)
                    if ok:
                        total_downloaded += 1
                        folder_count += 1
                        print(f"     ✓ {filename}")
                    else:
                        total_skipped += 1

            except Exception as e:
                print(f"     ❌ 处理出错: {e}")

        results_log[folder_key] = folder_count
        print(f"\n  ✅ 本文件夹共下载: {folder_count} 张")

    driver.quit()

    # 生成HTML浏览索引
    generate_html_index(DOWNLOAD_DIR)

    print("\n" + "=" * 60)
    print(f"  🎉 下载完成！")
    print(f"  ✅ 成功下载: {total_downloaded} 张")
    print(f"  ⏭️  已跳过:   {total_skipped} 张（已存在或过小）")
    print(f"  📁 保存路径: {DOWNLOAD_DIR.resolve()}")
    print("=" * 60)
    print("\n双击打开 'Tesla_Photos/📸 Tesla照片库_双击打开.html' 浏览所有照片")


if __name__ == "__main__":
    main()
