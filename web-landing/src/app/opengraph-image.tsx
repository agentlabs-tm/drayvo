import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';
import { brand } from '@/theme/tokens';

export const alt = `${site.name} — Every Mile Matters. Every Driver Matters.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export const dynamic = 'force-static';

const logo = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), 'public/brand/logo-horizontal-dark.svg')
).toString('base64')}`;

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: `linear-gradient(135deg, ${brand.ink} 0%, ${brand.charcoal} 60%, ${brand.graphite} 100%)`,
          fontFamily: 'sans-serif',
        }}
      >
        <img src={logo} alt={site.name} width={420} height={189} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              color: '#fff',
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: -2.5,
              lineHeight: 1.06,
            }}
          >
            Every Mile Matters.
          </div>
          <div
            style={{
              color: brand.orange,
              fontSize: 68,
              fontWeight: 800,
              letterSpacing: -2.5,
              lineHeight: 1.06,
            }}
          >
            Every Driver Matters.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 28, color: '#93A1B8', fontSize: 22 }}>
          <div>Reliable freight</div>
          <div>·</div>
          <div>Transparent pay</div>
          <div>·</div>
          <div>Built around drivers</div>
        </div>
      </div>
    ),
    size
  );
}
