import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get('title') ?? 'MyDreamTesla';
  const subtitle =
    searchParams.get('subtitle') ?? 'Every Tesla. Every Year. Compared.';
  const type = searchParams.get('type') ?? 'default';

  const isVehicle = type === 'vehicle';
  const isCompare = type === 'compare';

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1D1D1F',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Top badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: '#86868B',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          {isCompare
            ? 'Comparison'
            : isVehicle
              ? 'Vehicle Specs'
              : 'MyDreamTesla'}
        </div>
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: isCompare ? 52 : 60,
          fontWeight: 700,
          color: '#FBFBFD',
          textAlign: 'center',
          lineHeight: 1.1,
          letterSpacing: '-2px',
          maxWidth: '80%',
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 300,
          color: '#86868B',
          marginTop: 16,
          textAlign: 'center',
          maxWidth: '70%',
        }}
      >
        {subtitle}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#FBFBFD',
          }}
        >
          MyDreamTesla
        </div>
        <div
          style={{
            fontSize: 14,
            color: '#86868B',
            marginLeft: 8,
          }}
        >
          mydreamtesla.com
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
