'use client';

import { useTheme } from '@mui/material/styles';

/**
 * `useTheme()` types `vars` as optional because a theme may be built without
 * CSS variables. Ours always has them (see theme.ts), so this narrows the type
 * and keeps `theme.vars.palette.…` usable without non-null assertions.
 */
export function useAppTheme() {
  const theme = useTheme();
  return theme as typeof theme & { vars: NonNullable<typeof theme.vars> };
}
