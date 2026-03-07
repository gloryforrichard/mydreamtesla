/**
 * Tesla Vehicle Photo Downloader v2
 *
 * Multi-source strategy:
 * 1. Tesla Compositor API (transparent PNG, works for older Model S/X)
 * 2. Tesla CDN marketing images (works for all current models)
 * 3. Car listing/review sites via Playwright + stealth (KBB, Cars.com, MotorTrend)
 *
 * Usage:
 *   npx tsx scripts/download-vehicle-photos.ts
 *   npx tsx scripts/download-vehicle-photos.ts --model model-s
 *   npx tsx scripts/download-vehicle-photos.ts --skip-browser  (skip Playwright, CDN only)
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

// ── Config ──────────────────────────────────────────────────────────────────

interface VehicleTarget {
  model: string;
  generation: string;
  year: string;
  /** Direct image URLs to download (Tesla CDN, Compositor, etc.) */
  directUrls?: { name: string; url: string }[];
  /** Search queries for Playwright-based scraping */
  searchSites?: { site: string; url: string }[];
}

const TARGETS: VehicleTarget[] = [
  {
    model: 'model-y',
    generation: 'Juniper',
    year: '2025',
    directUrls: [
      { name: 'cdn-exterior', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-Exterior-Desktop' },
      { name: 'cdn-hero', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-Main-Hero-Desktop-Global' },
      { name: 'cdn-compare', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/compare-Model-Y' },
      { name: 'cdn-range', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-Range-Desktop' },
      { name: 'cdn-safety', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-Safety-Desktop' },
    ],
    searchSites: [
      { site: 'kbb', url: 'https://www.kbb.com/tesla/model-y/2025/photos/' },
      { site: 'cars', url: 'https://www.cars.com/research/tesla-model_y-2025/photos/' },
      { site: 'motortrend', url: 'https://www.motortrend.com/cars/tesla/model-y/photos/' },
      { site: 'caranddriver', url: 'https://www.caranddriver.com/tesla/model-y/photos/' },
    ],
  },
  {
    model: 'model-s',
    generation: 'Original',
    year: '2016',
    directUrls: [
      // Tesla Compositor - confirmed working for old Model S
      { name: 'compositor-front-angle', url: 'https://static-assets.tesla.com/v1/compositor/?model=ms&view=STUD_3QTR&size=1920&options=PBSB&bkba_opt=1' },
      { name: 'compositor-side', url: 'https://static-assets.tesla.com/v1/compositor/?model=ms&view=STUD_SIDE&size=1920&options=PBSB&bkba_opt=1' },
      { name: 'compositor-rear', url: 'https://static-assets.tesla.com/v1/compositor/?model=ms&view=STUD_REAR&size=1920&options=PBSB&bkba_opt=1' },
    ],
    searchSites: [
      { site: 'kbb', url: 'https://www.kbb.com/tesla/model-s/2016/photos/' },
      { site: 'cars', url: 'https://www.cars.com/research/tesla-model_s-2016/photos/' },
      { site: 'cargurus', url: 'https://www.cargurus.com/Cars/l-Used-2016-Tesla-Model-S-t45029' },
    ],
  },
  {
    model: 'model-s',
    generation: 'Refresh',
    year: '2022',
    directUrls: [
      { name: 'cdn-compare', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/compare-Model-S' },
      { name: 'cdn-performance', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Performance-Desktop' },
      { name: 'cdn-social', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Social' },
      { name: 'cdn-hero', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-S-Main-Hero-Desktop-LHD' },
    ],
    searchSites: [
      { site: 'kbb', url: 'https://www.kbb.com/tesla/model-s/2022/photos/' },
      { site: 'cars', url: 'https://www.cars.com/research/tesla-model_s-2022/photos/' },
      { site: 'motortrend', url: 'https://www.motortrend.com/cars/tesla/model-s/photos/' },
      { site: 'caranddriver', url: 'https://www.caranddriver.com/tesla/model-s/photos/' },
    ],
  },
  {
    model: 'model-x',
    generation: 'Original',
    year: '2016',
    directUrls: [
      // Tesla Compositor - confirmed working for old Model X
      { name: 'compositor-front-angle', url: 'https://static-assets.tesla.com/v1/compositor/?model=mx&view=STUD_3QTR&size=1920&options=PBSB&bkba_opt=1' },
      { name: 'compositor-side', url: 'https://static-assets.tesla.com/v1/compositor/?model=mx&view=STUD_SIDE&size=1920&options=PBSB&bkba_opt=1' },
      { name: 'compositor-rear', url: 'https://static-assets.tesla.com/v1/compositor/?model=mx&view=STUD_REAR&size=1920&options=PBSB&bkba_opt=1' },
    ],
    searchSites: [
      { site: 'kbb', url: 'https://www.kbb.com/tesla/model-x/2016/photos/' },
      { site: 'cars', url: 'https://www.cars.com/research/tesla-model_x-2016/photos/' },
      { site: 'cargurus', url: 'https://www.cargurus.com/Cars/l-Used-2016-Tesla-Model-X-t52755' },
    ],
  },
  {
    model: 'model-x',
    generation: 'Refresh',
    year: '2022',
    directUrls: [
      { name: 'cdn-compare', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/compare-Model-X' },
      { name: 'cdn-performance', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-X-Performance-Desktop' },
      { name: 'cdn-hero', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Model-X-Desktop' },
      { name: 'cdn-utility', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-X-Utility-Desktop' },
    ],
    searchSites: [
      { site: 'kbb', url: 'https://www.kbb.com/tesla/model-x/2022/photos/' },
      { site: 'cars', url: 'https://www.cars.com/research/tesla-model_x-2022/photos/' },
      { site: 'motortrend', url: 'https://www.motortrend.com/cars/tesla/model-x/photos/' },
      { site: 'caranddriver', url: 'https://www.caranddriver.com/tesla/model-x/photos/' },
    ],
  },
  {
    model: 'cybertruck',
    generation: 'Production',
    year: '2024',
    directUrls: [
      { name: 'cdn-compare', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/compare-Cybertruck' },
      { name: 'cdn-hero', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Cybertruck-Desktop' },
      { name: 'cdn-social', url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Cybertruck-Social' },
    ],
    searchSites: [
      { site: 'kbb', url: 'https://www.kbb.com/tesla/cybertruck/2024/photos/' },
      { site: 'cars', url: 'https://www.cars.com/research/tesla-cybertruck-2024/photos/' },
      { site: 'motortrend', url: 'https://www.motortrend.com/cars/tesla/cybertruck/photos/' },
      { site: 'caranddriver', url: 'https://www.caranddriver.com/tesla/cybertruck/photos/' },
    ],
  },
];

const OUTPUT_BASE = path.join(process.cwd(), 'TeslaData', 'Tesla_Photos');

// ── Helpers ─────────────────────────────────────────────────────────────────

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function downloadFile(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    const request = client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept: 'image/*,*/*',
        },
        timeout: 20000,
      },
      (response) => {
        // Follow redirects
        if (
          response.statusCode &&
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          file.close();
          try { fs.unlinkSync(dest); } catch {}
          downloadFile(response.headers.location, dest).then(resolve);
          return;
        }
        if (response.statusCode !== 200) {
          file.close();
          try { fs.unlinkSync(dest); } catch {}
          resolve(false);
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(dest);
          if (stats.size < 5000) {
            try { fs.unlinkSync(dest); } catch {}
            resolve(false);
          } else {
            resolve(true);
          }
        });
      },
    );
    request.on('error', () => {
      file.close();
      try { fs.unlinkSync(dest); } catch {}
      resolve(false);
    });
    request.on('timeout', () => {
      request.destroy();
      file.close();
      try { fs.unlinkSync(dest); } catch {}
      resolve(false);
    });
  });
}

// ── Strategy 1: Direct URL downloads ────────────────────────────────────────

async function downloadDirectUrls(
  target: VehicleTarget,
  outDir: string,
): Promise<number> {
  if (!target.directUrls?.length) return 0;

  console.log(`\n  [Direct Download] ${target.directUrls.length} URLs`);
  let downloaded = 0;

  for (const { name, url } of target.directUrls) {
    // Detect file extension from content or URL
    const isCompositor = url.includes('compositor');
    const ext = isCompositor ? '.png' : '.jpg';
    const filename = `${name}${ext}`;
    const dest = path.join(outDir, filename);

    if (fs.existsSync(dest)) {
      const kb = (fs.statSync(dest).size / 1024).toFixed(0);
      console.log(`    ⏭ ${filename} already exists (${kb} KB)`);
      downloaded++;
      continue;
    }

    const ok = await downloadFile(url, dest);
    if (ok) {
      const kb = (fs.statSync(dest).size / 1024).toFixed(0);
      console.log(`    ✓ ${filename} (${kb} KB)`);
      downloaded++;
    } else {
      console.log(`    ✗ ${filename} - failed`);
    }

    // Small delay between downloads
    await new Promise(r => setTimeout(r, 500));
  }

  return downloaded;
}

// ── Strategy 2: Playwright scraping from car sites ──────────────────────────

async function scrapeCarSites(
  target: VehicleTarget,
  outDir: string,
): Promise<number> {
  if (!target.searchSites?.length) return 0;

  console.log(`\n  [Browser Scraping] ${target.searchSites.length} sites`);

  // Dynamic import for playwright-extra + stealth
  let chromium: any;
  try {
    const playwrightExtra = await import('playwright-extra');
    const stealthPlugin = await import('puppeteer-extra-plugin-stealth');
    chromium = playwrightExtra.chromium;
    chromium.use(stealthPlugin.default());
  } catch {
    console.log('    playwright-extra not available, using regular playwright');
    const pw = await import('playwright');
    chromium = pw.chromium;
  }

  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome', // Use system Chrome for better stealth
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    locale: 'en-US',
    timezoneId: 'America/Los_Angeles',
  });

  const page = await context.newPage();
  let totalDownloaded = 0;

  for (const { site, url } of target.searchSites) {
    console.log(`\n    [${site}] ${url}`);

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000);

      // Close cookie/popup banners
      for (const selector of [
        'button:has-text("Accept")',
        'button:has-text("Got it")',
        'button:has-text("Close")',
        '[aria-label="Close"]',
        '.modal-close',
      ]) {
        const btn = page.locator(selector).first();
        if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
          await btn.click().catch(() => {});
          await page.waitForTimeout(500);
        }
      }

      // Scroll down to load lazy images
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, 600));
        await page.waitForTimeout(800);
      }

      // Extract high-res image URLs based on site
      const images = await page.evaluate((siteName: string) => {
        const srcs: string[] = [];
        const seen = new Set<string>();

        document.querySelectorAll('img, source, [data-src], [data-original]').forEach((el) => {
          const candidates = [
            el.getAttribute('src'),
            el.getAttribute('data-src'),
            el.getAttribute('data-original'),
            el.getAttribute('data-srcset'),
            el.getAttribute('srcset'),
          ].filter(Boolean) as string[];

          for (let src of candidates) {
            // Extract highest-res from srcset
            if (src.includes(',')) {
              const parts = src.split(',').map(s => s.trim().split(/\s+/)[0]);
              src = parts[parts.length - 1]; // Last is usually highest res
            }

            if (!src || src.startsWith('data:') || seen.has(src)) continue;

            // Ensure absolute URL
            try {
              src = new URL(src, window.location.href).href;
            } catch {
              continue;
            }

            // Filter by site-specific patterns
            const isVehicleImage =
              (siteName === 'kbb' && (src.includes('iximage') || src.includes('kbb.com'))) ||
              (siteName === 'cars' && (src.includes('carsimg') || src.includes('imgix'))) ||
              (siteName === 'motortrend' && (src.includes('motortrend') || src.includes('hearstapps'))) ||
              (siteName === 'caranddriver' && (src.includes('caranddriver') || src.includes('hearstapps'))) ||
              (siteName === 'cargurus' && src.includes('cargurus'));

            const isSmallIcon = src.includes('logo') || src.includes('icon') ||
              src.includes('sprite') || src.includes('placeholder') ||
              src.includes('1x1') || src.includes('pixel');

            if (isVehicleImage && !isSmallIcon) {
              // Try to upgrade to high res
              let highRes = src;
              if (siteName === 'kbb') {
                highRes = src.replace(/\/\d+x\d+\//, '/1920x1080/');
              } else if (siteName === 'cars') {
                highRes = src.replace(/w=\d+/, 'w=1920').replace(/h=\d+/, 'h=1080');
              }
              seen.add(src);
              srcs.push(highRes);
            }
          }
        });

        return srcs;
      }, site);

      console.log(`    Found ${images.length} images`);

      let siteDownloaded = 0;
      for (let i = 0; i < Math.min(images.length, 12); i++) {
        const ext = images[i].match(/\.(png|webp)(\?|$)/i) ? '.png' : '.jpg';
        const filename = `${site}-${String(i + 1).padStart(2, '0')}${ext}`;
        const dest = path.join(outDir, filename);

        if (fs.existsSync(dest)) {
          siteDownloaded++;
          continue;
        }

        const ok = await downloadFile(images[i], dest);
        if (ok) {
          const kb = (fs.statSync(dest).size / 1024).toFixed(0);
          console.log(`      ✓ ${filename} (${kb} KB)`);
          siteDownloaded++;
        }
        await new Promise(r => setTimeout(r, 300));
      }

      totalDownloaded += siteDownloaded;
    } catch (e) {
      console.log(`    ✗ ${site} failed: ${(e as Error).message}`);
    }

    // Delay between sites
    await page.waitForTimeout(2000);
  }

  await browser.close();
  return totalDownloaded;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const modelFilter = args.includes('--model')
    ? args[args.indexOf('--model') + 1]
    : null;
  const skipBrowser = args.includes('--skip-browser');

  let targets = TARGETS;
  if (modelFilter) {
    targets = targets.filter((t) => t.model === modelFilter);
  }

  if (targets.length === 0) {
    console.log('No matching targets. Available:');
    const models = [...new Set(TARGETS.map(t => t.model))];
    for (const m of models) {
      console.log(`  --model ${m}`);
    }
    process.exit(1);
  }

  console.log(
    `\n📸 Downloading photos for ${targets.length} vehicle(s):`,
  );
  for (const t of targets) {
    console.log(`  - ${t.model} ${t.generation} (${t.year})`);
  }
  if (skipBrowser) {
    console.log('  (--skip-browser: only direct CDN downloads)');
  }

  for (const target of targets) {
    const outDir = path.join(OUTPUT_BASE, target.model, target.year);
    ensureDir(outDir);

    console.log(`\n${'═'.repeat(60)}`);
    console.log(
      `  ${target.model.toUpperCase()} ${target.generation} (${target.year})`,
    );
    console.log(`${'═'.repeat(60)}`);

    // Strategy 1: Direct downloads (always runs)
    const directCount = await downloadDirectUrls(target, outDir);

    // Strategy 2: Browser scraping (optional)
    let browserCount = 0;
    if (!skipBrowser && target.searchSites?.length) {
      browserCount = await scrapeCarSites(target, outDir);
    }

    // Summary
    const files = fs.readdirSync(outDir).filter((f) => !f.startsWith('.'));
    console.log(`\n  📊 Results: ${directCount} direct + ${browserCount} scraped = ${files.length} total files`);
    console.log(`  📁 Output: ${outDir}`);
  }

  // Final instructions
  console.log('\n' + '═'.repeat(60));
  console.log('  DOWNLOAD COMPLETE');
  console.log('═'.repeat(60));
  console.log('');
  console.log('Next steps:');
  console.log('1. Review images in TeslaData/Tesla_Photos/{model}/{year}/');
  console.log('2. Select best 4 angles per model/generation');
  console.log('3. Rename to: {year}-front.png, {year}-front-angle.png, {year}-side.png, {year}-rear.png');
  console.log('4. Copy to public/images/vehicles/angles/{model}/');
  console.log('');
}

main().catch(console.error);
