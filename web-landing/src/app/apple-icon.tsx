import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';
import { brand } from '@/theme/tokens';

export const dynamic = 'force-static';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export const alt = site.name;

/** Apple touch icons must be raster, so the SVG mark is rendered to PNG here. */
const mark = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), 'public/brand/mark.svg')
).toString('base64')}`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: brand.ink,
        }}
      >
        <img src={mark} alt={site.name} width={180} height={180} />
      </div>
    ),
    size
  );
}
