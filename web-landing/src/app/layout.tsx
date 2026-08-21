import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Manrope, Sora } from 'next/font/google';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import ColorModeProvider from '@/theme/ColorModeProvider';
import { site } from '@/lib/site';

import './globals.css';

const DESCRIPTION =
  'Reliable freight. Transparent pay. A company built around drivers. Drayvo Logistics is an open-book carrier where drivers see what every load pays before they roll, and truck owners see revenue, expenses, maintenance, and downtime without chasing anyone for answers.';

const display = Sora({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

/** Used for record-style content: settlement lines, reporting tables, indices. */
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const body = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Every Mile Matters. Every Driver Matters.`,
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
  openGraph: {
    type: 'website',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Every Mile Matters. Every Driver Matters.`,
    description: DESCRIPTION,
    locale: 'en_US',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Every Mile Matters. Every Driver Matters.`,
    description: DESCRIPTION,
    images: ['/opengraph-image'],
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
        <ColorModeProvider>{children}</ColorModeProvider>
      </body>
    </html>
  );
}
