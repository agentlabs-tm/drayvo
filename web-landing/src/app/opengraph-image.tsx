import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';
import { brand } from '@/theme/tokens';

export const alt = `${site.name} — Trucking that shows its work`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const logo = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), 'public/brand/logo-horizontal-dark.svg'),
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
          <div style={{ color: '#fff', fontSize: 76, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04 }}>
            Trucking that
          </div>
          <div style={{ color: brand.orange, fontSize: 76, fontWeight: 800, letterSpacing: -3, lineHeight: 1.04 }}>
            shows its work.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 28, color: '#93A1B8', fontSize: 22 }}>
          <div>Rates shown before dispatch</div>
          <div>·</div>
          <div>Itemized settlements</div>
          <div>·</div>
          <div>Owner reporting</div>
        </div>
      </div>
    ),
    size,
  );
}
