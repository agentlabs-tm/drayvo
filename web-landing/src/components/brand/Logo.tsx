'use client';

import Box from '@mui/material/Box';
import Image from 'next/image';
import { site } from '@/lib/site';
import { useAppTheme } from '@/theme/useAppTheme';

type Variant = 'horizontal' | 'stacked';

const ASSETS = {
  horizontal: {
    light: '/brand/logo-horizontal-light.svg',
    dark: '/brand/logo-horizontal-dark.svg',
    ratio: 854 / 186,
  },
  stacked: {
    light: '/brand/logo-stacked-light.svg',
    dark: '/brand/logo-stacked-dark.svg',
    ratio: 626 / 366,
  },
} as const;

/**
 * The lockup ships in two color-ways — dark artwork for light surfaces and
 * reversed artwork for dark ones. Both are rendered and one is hidden in CSS,
 * so the correct mark is right in the first paint with no JS swap flicker.
 *
 * The show/hide rules come from `theme.applyStyles`, which emits whatever
 * selector the theme's colorSchemeSelector strategy actually uses — including
 * the "system preference, no attribute set yet" case that a hand-written
 * `[data-mui-color-scheme]` selector silently misses.
 */
export default function Logo({
  height = 38,
  variant = 'horizontal',
}: {
  height?: number;
  variant?: Variant;
}) {
  const theme = useAppTheme();
  const asset = ASSETS[variant];
  const width = Math.round(height * asset.ratio);

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        height,
        width,
        flexShrink: 0,

        // 1. Baseline follows the OS preference, so the mark is already correct
        //    before any attribute is on the document (first paint, JS disabled).
        '& .logo-light': { display: 'block' },
        '& .logo-dark': { display: 'none' },
        '@media (prefers-color-scheme: dark)': {
          '& .logo-light': { display: 'none' },
          '& .logo-dark': { display: 'block' },
        },

        // 2. An explicit choice in the header overrides the OS preference.
        //    applyStyles emits whatever selector the theme is configured for.
        ...theme.applyStyles('light', {
          '& .logo-light': { display: 'block' },
          '& .logo-dark': { display: 'none' },
        }),
        ...theme.applyStyles('dark', {
          '& .logo-light': { display: 'none' },
          '& .logo-dark': { display: 'block' },
        }),
      }}
    >
      <Image
        className="logo-light"
        src={asset.light}
        alt={site.name}
        width={width}
        height={height}
        priority
        style={{ height, width: 'auto' }}
      />
      <Image
        className="logo-dark"
        src={asset.dark}
        alt={site.name}
        width={width}
        height={height}
        priority
        style={{ height, width: 'auto' }}
      />
    </Box>
  );
}
