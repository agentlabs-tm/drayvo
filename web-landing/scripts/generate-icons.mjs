/**
 * Rasterizes public/brand/mark.svg into the PNG/ICO favicons.
 *
 * Uses the resvg renderer already bundled inside Next's `next/og`, so this adds
 * no dependency. Run manually after the logo changes:
 *
 *   node scripts/generate-icons.mjs
 *
 * Outputs are committed, not built — favicon.ico in particular must be a real
 * file in src/app for Next to serve it at the site root.
 */
import { ImageResponse } from 'next/dist/server/og/image-response.js';
import { readFileSync, writeFileSync } from 'node:fs';

const svg = readFileSync('public/brand/mark.svg', 'utf8');
const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;

async function png(size) {
  const res = new ImageResponse(
    {
      type: 'div',
      props: {
        style: { width: '100%', height: '100%', display: 'flex' },
        children: { type: 'img', props: { src, width: size, height: size } },
      },
    },
    { width: size, height: size },
  );
  return Buffer.from(await res.arrayBuffer());
}

/** Packs PNGs into a multi-resolution .ico (PNG-in-ICO, supported since Vista). */
function ico(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const dir = [];
  for (const { size, data } of entries) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    dir.push(e);
  }
  return Buffer.concat([header, ...dir, ...entries.map((e) => e.data)]);
}

const sizes = [16, 32, 48];
const icoEntries = [];
for (const size of sizes) icoEntries.push({ size, data: await png(size) });
writeFileSync('src/app/favicon.ico', ico(icoEntries));

for (const [size, out] of [
  [96, 'public/brand/icon-96.png'],
  [192, 'public/brand/icon-192.png'],
  [512, 'public/brand/icon-512.png'],
  [180, 'src/app/apple-icon.png'],
]) {
  writeFileSync(out, await png(size));
}

/**
 * Social card, rendered to a real .png rather than left as the extensionless
 * `/opengraph-image` route: Cloudflare Pages serves files without an extension
 * as application/octet-stream, which some scrapers reject.
 */
const INK = '#060D1A';
const CHARCOAL = '#0E141F';
const GRAPHITE = '#161E2B';
const ORANGE = '#FF6600';

const lockup = readFileSync('public/brand/logo-horizontal-dark.svg', 'utf8');
const lockupSrc = `data:image/svg+xml;base64,${Buffer.from(lockup).toString('base64')}`;

const row = (children) => ({ type: 'div', props: { style: { display: 'flex' }, children } });
const text = (value, style) => ({ type: 'div', props: { style: { display: 'flex', ...style }, children: value } });

const og = new ImageResponse(
  {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 72,
        background: `linear-gradient(135deg, ${INK} 0%, ${CHARCOAL} 60%, ${GRAPHITE} 100%)`,
        fontFamily: 'sans-serif',
      },
      children: [
        row({ type: 'img', props: { src: lockupSrc, width: 420, height: 91 } }),
        {
          type: 'div',
          props: {
            style: { display: 'flex', flexDirection: 'column', gap: 14 },
            children: [
              text('Every Mile Matters.', { color: '#fff', fontSize: 68, fontWeight: 800, letterSpacing: -2.5 }),
              text('Every Driver Matters.', { color: ORANGE, fontSize: 68, fontWeight: 800, letterSpacing: -2.5 }),
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: { display: 'flex', gap: 28, color: '#93A1B8', fontSize: 22 },
            children: [
              text('Reliable freight'), text('·'), text('Transparent pay'), text('·'), text('Built around drivers'),
            ],
          },
        },
      ],
    },
  },
  { width: 1200, height: 630 },
);
writeFileSync('public/brand/og.png', Buffer.from(await og.arrayBuffer()));

console.log('icons + og card written');
