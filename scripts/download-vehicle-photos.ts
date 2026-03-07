/**
 * Tesla Vehicle Photo Downloader
 *
 * Downloads high-res multi-angle photos for Tesla vehicles using Playwright.
 * Runs in headed mode so you can see the browser and interact if needed.
 *
 * Usage:
 *   npx tsx scripts/download-vehicle-photos.ts
 *   npx tsx scripts/download-vehicle-photos.ts --model model-s
 *   npx tsx scripts/download-vehicle-photos.ts --headless  (for automated mode)
 */

import { chromium, type Page } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

// ── Config ──────────────────────────────────────────────────────────────────

interface VehicleTarget {
  model: string;
  generation: string;
  year: string;
  evDbSlug?: string;
  edmundsSlug?: string;
}

const TARGETS: VehicleTarget[] = [
  {
    model: 'model-y',
    generation: 'Juniper',
    year: '2025',
    evDbSlug: 'tesla-model-y',
    edmundsSlug: 'tesla/model-y/2025',
  },
  {
    model: 'model-s',
    generation: 'Original',
    year: '2016',
    evDbSlug: 'tesla-model-s-2016',
    edmundsSlug: 'tesla/model-s/2016',
  },
  {
    model: 'model-s',
    generation: 'Refresh',
    year: '2022',
    evDbSlug: 'tesla-model-s-2022',
    edmundsSlug: 'tesla/model-s/2022',
  },
  {
    model: 'model-x',
    generation: 'Original',
    year: '2016',
    evDbSlug: 'tesla-model-x-2016',
    edmundsSlug: 'tesla/model-x/2016',
  },
  {
    model: 'model-x',
    generation: 'Refresh',
    year: '2022',
    evDbSlug: 'tesla-model-x-2022',
    edmundsSlug: 'tesla/model-x/2022',
  },
  {
    model: 'cybertruck',
    generation: 'Production',
    year: '2024',
    evDbSlug: 'tesla-cybertruck',
    edmundsSlug: 'tesla/cybertruck/2024',
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
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          Accept: 'image/*,*/*',
          Referer: 'https://www.google.com/',
        },
        timeout: 15000,
      },
      (response) => {
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

// ── Edmunds Scraper ─────────────────────────────────────────────────────────

async function scrapeEdmundsPhotos(
  page: Page,
  target: VehicleTarget,
  outDir: string,
): Promise<number> {
  if (!target.edmundsSlug) return 0;

  const photosUrl = `https://www.edmunds.com/${target.edmundsSlug}/photos/`;
  console.log(`  Trying Edmunds photos: ${photosUrl}`);

  try {
    await page.goto(photosUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);

    // Accept cookies if prompted
    const cookieBtn = page.locator('button:has-text("Accept")');
    if (await cookieBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await cookieBtn.click();
      await page.waitForTimeout(1000);
    }

    // Collect all image src attributes
    const images = await page.evaluate(() => {
      const srcs: string[] = [];
      document.querySelectorAll('img').forEach((img) => {
        const src = img.src || img.getAttribute('data-src') || '';
        if (
          src &&
          (src.includes('edmunds-media') || src.includes('ed.edmunds'))
        ) {
          // Upgrade to high-res
          const highRes = src.replace(/\/\d+x\d+\//g, '/1600x1067/');
          srcs.push(highRes);
        }
      });
      return [...new Set(srcs)];
    });

    console.log(`  Found ${images.length} Edmunds images`);

    let downloaded = 0;
    for (let i = 0; i < Math.min(images.length, 15); i++) {
      const ext = images[i].endsWith('.png') ? '.png' : '.jpg';
      const filename = `edmunds-${String(i + 1).padStart(2, '0')}${ext}`;
      const dest = path.join(outDir, filename);
      const ok = await downloadFile(images[i], dest);
      if (ok) {
        const kb = (fs.statSync(dest).size / 1024).toFixed(0);
        console.log(`    ✓ ${filename} (${kb} KB)`);
        downloaded++;
      }
    }
    return downloaded;
  } catch (e) {
    console.log(`  Edmunds failed: ${(e as Error).message}`);
    return 0;
  }
}

// ── EV Database Scraper ─────────────────────────────────────────────────────

async function scrapeEvDatabase(
  page: Page,
  target: VehicleTarget,
  outDir: string,
): Promise<number> {
  if (!target.evDbSlug) return 0;

  const url = `https://ev-database.org/car/${target.evDbSlug}`;
  console.log(`  Trying ev-database.org: ${url}`);

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const images = await page.evaluate(() => {
      const srcs: string[] = [];
      document.querySelectorAll('img').forEach((img) => {
        const src = img.src || '';
        if (src && (src.includes('ev-database') || src.includes('/img/'))) {
          srcs.push(src);
        }
      });
      return [...new Set(srcs)].filter(
        (s) => !s.includes('logo') && !s.includes('icon'),
      );
    });

    console.log(`  Found ${images.length} ev-database images`);

    let downloaded = 0;
    for (let i = 0; i < Math.min(images.length, 10); i++) {
      const ext = images[i].endsWith('.png') ? '.png' : '.jpg';
      const filename = `evdb-${String(i + 1).padStart(2, '0')}${ext}`;
      const dest = path.join(outDir, filename);
      const ok = await downloadFile(images[i], dest);
      if (ok) {
        const kb = (fs.statSync(dest).size / 1024).toFixed(0);
        console.log(`    ✓ ${filename} (${kb} KB)`);
        downloaded++;
      }
    }
    return downloaded;
  } catch (e) {
    console.log(`  ev-database failed: ${(e as Error).message}`);
    return 0;
  }
}

// ── Screenshot-based approach ───────────────────────────────────────────────

async function takeScreenshotsFromSearch(
  page: Page,
  target: VehicleTarget,
  outDir: string,
): Promise<number> {
  const angles = ['front', 'front three quarter', 'side', 'rear'];
  const angleNames = ['front', 'front-angle', 'side', 'rear'];
  let screenshots = 0;

  for (let i = 0; i < angles.length; i++) {
    const modelName = target.model.replace('-', ' ');
    const query = `${target.year} Tesla ${modelName} ${angles[i]} view press photo white background`;

    console.log(`  Searching: "${query.slice(0, 60)}..."`);

    try {
      await page.goto(
        `https://www.google.com/search?q=${encodeURIComponent(query)}&tbm=isch&tbs=isz:l,ic:specific,isc:white`,
        { waitUntil: 'domcontentloaded', timeout: 20000 },
      );
      await page.waitForTimeout(2000);

      // Click on first image result to get full-size preview
      const firstImage = page.locator('div[data-ri="0"] img, #islrg img').first();
      if (await firstImage.isVisible({ timeout: 3000 }).catch(() => false)) {
        await firstImage.click();
        await page.waitForTimeout(2000);

        // Take screenshot of the preview panel
        const filename = `search-${angleNames[i]}.png`;
        const dest = path.join(outDir, filename);
        await page.screenshot({ path: dest, fullPage: false });
        console.log(`    ✓ Screenshot: ${filename}`);
        screenshots++;
      }
    } catch (e) {
      console.log(`    ✗ Search failed: ${(e as Error).message}`);
    }
  }

  return screenshots;
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const modelFilter = args.includes('--model')
    ? args[args.indexOf('--model') + 1]
    : null;
  const headless = args.includes('--headless');

  let targets = TARGETS;
  if (modelFilter) {
    targets = targets.filter((t) => t.model === modelFilter);
  }

  if (targets.length === 0) {
    console.log('No matching targets. Available:');
    for (const t of TARGETS) {
      console.log(`  --model ${t.model}`);
    }
    process.exit(1);
  }

  console.log(
    `\nDownloading photos for ${targets.length} vehicle(s) [${headless ? 'headless' : 'headed'} mode]:`,
  );
  for (const t of targets) {
    console.log(`  - ${t.model} ${t.generation} (${t.year})`);
  }

  const browser = await chromium.launch({
    headless,
    args: ['--disable-blink-features=AutomationControlled'],
  });
  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
  });
  const page = await context.newPage();

  for (const target of targets) {
    const outDir = path.join(OUTPUT_BASE, target.model, target.year);
    ensureDir(outDir);

    console.log(`\n${'═'.repeat(60)}`);
    console.log(
      `  ${target.model.toUpperCase()} ${target.generation} (${target.year})`,
    );
    console.log(`${'═'.repeat(60)}`);

    let total = 0;

    // Strategy 1: Edmunds
    total += await scrapeEdmundsPhotos(page, target, outDir);

    // Strategy 2: ev-database.org
    total += await scrapeEvDatabase(page, target, outDir);

    // Strategy 3: Google Image search + screenshots
    if (total < 4) {
      total += await takeScreenshotsFromSearch(page, target, outDir);
    }

    // Summary
    const files = fs.readdirSync(outDir).filter((f) => !f.startsWith('.'));
    console.log(`\n  Total files: ${files.length}`);
    console.log(`  Output: ${outDir}`);
  }

  await browser.close();

  // Final instructions
  console.log('\n' + '═'.repeat(60));
  console.log('  DOWNLOAD COMPLETE');
  console.log('═'.repeat(60));
  console.log('');
  console.log('Next steps:');
  console.log('');
  console.log('1. Review images in TeslaData/Tesla_Photos/{model}/{year}/');
  console.log('2. Select best 4 angles per model/generation');
  console.log(
    '3. Rename selected images to: {year}-front.png, {year}-front-angle.png, {year}-side.png, {year}-rear.png',
  );
  console.log('4. Copy to public/images/vehicles/angles/{model}/');
  console.log('');
  console.log('Angle photo config (vehicle-angles.ts) already updated!');
  console.log('');
}

main().catch(console.error);
