import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import ColorModeProvider from '@/theme/ColorModeProvider';
import InAppWebviewFlag from '@/components/util/InAppWebviewFlag';
import { site } from '@/lib/site';

import './globals.css';

/**
 * Search-facing title and description. Kept keyword-bearing rather than
 * slogan-only: the brand line lives in the hero and the OG card, but a search
 * result has to say what the company does.
 */
const TITLE = `${site.name} | Driver-First Trucking & Fleet Management`;

const DESCRIPTION =
  'Drayvo Logistics is a driver-first trucking company focused on transparent pay, reliable freight, modern fleet operations, and long-term partnerships with professional drivers and owner-operators.';

/**
 * TYPE SYSTEM
 *
 * Chosen against the brand's own subject matter: this is a company whose
 * product is the operating record - settlements, load-level reporting, service
 * history. The type should read as signage and documents, not as a software
 * marketing site.
 *
 * Archivo is a grotesque drawn for signage and print, with enough width and
 * character to carry a headline without ornament. It replaced Sora, whose
 * geometric, evenly-weighted forms are the default of every template landing
 * page and were a large part of why the site read as generic.
 *
 * IBM Plex Sans and Plex Mono are a matched engineered pair. The mono is doing
 * real work here - every figure, unit number, and settlement line is set in it —
 * so it needs to be a sibling of the text face rather than a borrowed
 * code font.
 */
const display = Archivo({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

/** Used for record-style content: settlement lines, reporting tables, indices. */
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: TITLE,
    template: `%s | ${site.name}`,
  },
  description: DESCRIPTION,
  keywords: [
    'CDL A trucking jobs', 'owner operator jobs', 'truck driver jobs',
    'truck fleet management', 'transparent driver pay', 'itemized settlements',
    'fleet owner truck management', 'Drayvo Logistics',
  ],
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  alternates: { canonical: '/' },
  /**
   * Declared explicitly rather than relying on file-convention detection alone.
   * `/favicon.ico` first and unversioned: Google's favicon crawler looks for it
   * at the site root and does not follow Next's hashed asset URLs.
   */
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/brand/icon-96.png', type: 'image/png', sizes: '96x96' },
      { url: '/brand/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: '/apple-icon.png', type: 'image/png', sizes: '180x180' }],
    shortcut: ['/favicon.ico'],
  },
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.name,
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
    images: [{ url: '/brand/og.png', width: 1200, height: 630, alt: TITLE, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/brand/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  category: 'Transportation & Logistics',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F7FA' },
    { media: '(prefers-color-scheme: dark)', color: '#060D1A' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <InitColorSchemeScript attribute="data" defaultMode="system" />
        <InAppWebviewFlag />
        <ColorModeProvider>{children}</ColorModeProvider>
      </body>
    </html>
  );
}
