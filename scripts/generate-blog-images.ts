// @ts-nocheck
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import type { ReactNode } from 'react';

const OUTPUT_DIR = join(process.cwd(), 'public/images/blog');

const CATEGORY_COLORS: Record<string, { accent: string; bg: string }> = {
  COMPARISON: { accent: '#2563EB', bg: '#EFF6FF' },
  'BUYING GUIDE': { accent: '#059669', bg: '#ECFDF5' },
  'DEEP DIVE': { accent: '#9333EA', bg: '#FAF5FF' },
  GUIDE: { accent: '#D97706', bg: '#FFFBEB' },
  GENERIC: { accent: '#6B7280', bg: '#F3F4F6' },
};

interface BlogImage {
  filename: string;
  title: string;
  category: string;
}

const BLOG_IMAGES: BlogImage[] = [
  {
    filename: 'best-tesla-families.png',
    title: 'Best Tesla for Families 2025',
    category: 'BUYING GUIDE',
  },
  {
    filename: 'cheapest-tesla.png',
    title: 'Cheapest Tesla 2025',
    category: 'BUYING GUIDE',
  },
  {
    filename: 'model-3-lr-vs-performance.png',
    title: 'Model 3 Long Range vs Performance',
    category: 'COMPARISON',
  },
  {
    filename: 'model-y-trim-comparison.png',
    title: 'Model Y Trim Comparison 2025',
    category: 'COMPARISON',
  },
  {
    filename: 'autopilot-vs-fsd.png',
    title: 'Tesla Autopilot vs FSD',
    category: 'DEEP DIVE',
  },
  {
    filename: 'tax-credit-guide.png',
    title: 'Federal Tax Credit Guide 2025',
    category: 'BUYING GUIDE',
  },
  {
    filename: 'home-charging.png',
    title: 'Tesla Home Charging Guide',
    category: 'GUIDE',
  },
  {
    filename: 'model-3-highland.png',
    title: 'Model 3 Highland Changes',
    category: 'DEEP DIVE',
  },
  {
    filename: 'model-3-vs-model-y.png',
    title: 'Model 3 vs Model Y 2025',
    category: 'COMPARISON',
  },
  {
    filename: 'model-y-compact.png',
    title: 'Model Y Compact Prototype',
    category: 'DEEP DIVE',
  },
  {
    filename: 'model-y-juniper.png',
    title: 'Model Y Juniper Changes',
    category: 'DEEP DIVE',
  },
  {
    filename: 'model-y-seating.png',
    title: 'Model Y Seating Guide',
    category: 'BUYING GUIDE',
  },
  {
    filename: 'model-s-vs-model-3.png',
    title: 'Model S vs Model 3',
    category: 'COMPARISON',
  },
  {
    filename: 'model-x-vs-cybertruck.png',
    title: 'Model X vs Cybertruck 2025',
    category: 'BUYING GUIDE',
  },
  {
    filename: 'ev-tax-credits-by-state.png',
    title: 'EV Tax Credits by State 2025',
    category: 'BUYING GUIDE',
  },
  {
    filename: 'placeholder.jpg',
    title: 'MyDreamTesla Blog',
    category: 'GENERIC',
  },
];

function buildImageMarkup(entry: BlogImage): ReactNode {
  const colors = CATEGORY_COLORS[entry.category] ?? CATEGORY_COLORS.GENERIC;

  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: 1200,
        height: 630,
        backgroundColor: '#FDFCF9',
        padding: '60px 80px',
        fontFamily: 'Inter, sans-serif',
      },
      children: [
        // Category tag
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
            },
            children: {
              type: 'div',
              props: {
                style: {
                  backgroundColor: colors.bg,
                  color: colors.accent,
                  padding: '8px 20px',
                  borderRadius: 100,
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: '1.5px',
                },
                children: entry.category,
              },
            },
          },
        },
        // Title
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: entry.title.length > 35 ? 52 : 60,
                    fontWeight: 800,
                    color: '#1A1A1A',
                    lineHeight: 1.15,
                    letterSpacing: '-2px',
                    maxWidth: 900,
                  },
                  children: entry.title,
                },
              },
              // Bottom bar: brand + domain
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #E5E2DC',
                    paddingTop: 20,
                    marginTop: 8,
                  },
                  children: [
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 18,
                          fontWeight: 700,
                          color: '#1A1A1A',
                          letterSpacing: '-0.5px',
                        },
                        children: 'MyDreamTesla',
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 16,
                          color: '#999999',
                        },
                        children: 'mydreamtesla.com',
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log(`Generating ${BLOG_IMAGES.length} blog images...`);

  for (const entry of BLOG_IMAGES) {
    const markup = buildImageMarkup(entry);

    const svg = await satori(markup as React.ReactElement, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: await fetchFont('Inter', 400),
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: await fetchFont('Inter', 700),
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: await fetchFont('Inter', 800),
          weight: 800,
          style: 'normal',
        },
      ],
    });

    const resvg = new Resvg(svg, {
      fitTo: { mode: 'width', value: 1200 },
    });
    const pngBuffer = resvg.render().asPng();

    const outputPath = join(OUTPUT_DIR, entry.filename);
    writeFileSync(outputPath, pngBuffer);
    console.log(`  Created: ${entry.filename}`);
  }

  console.log('Done!');
}

async function fetchFont(family: string, weight: number): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&display=swap`;
  // Use a non-woff2 user agent to get ttf format (satori doesn't support woff2)
  const cssRes = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (BB10; Touch) AppleWebKit/537.10+ (KHTML, like Gecko) Version/10.0.9.2372 Mobile Safari/537.10+',
    },
  });
  const css = await cssRes.text();
  const fontUrl = css.match(/src: url\((.+?)\)/)?.[1];
  if (!fontUrl) {
    throw new Error(`Could not find font URL for ${family} ${weight}`);
  }
  const fontRes = await fetch(fontUrl);
  return fontRes.arrayBuffer();
}

main().catch(console.error);
