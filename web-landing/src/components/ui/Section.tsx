'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

export type SectionTone = 'base' | 'raised' | 'contrast';

/**
 * Page section wrapper. Centralizing tone here is what gives the page its
 * rhythm.
 *
 * All three tones follow the active color scheme — including `contrast`, which
 * is the band that carries operating-record content. It resolves through the
 * `--surface-contrast` variable in globals.css rather than being pinned to the
 * brand dark, so light mode is genuinely light.
 */
export default function Section({
  id,
  tone = 'base',
  maxWidth = 'xl',
  children,
  sx,
}: {
  id?: string;
  tone?: SectionTone;
  maxWidth?: 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  sx?: object;
}) {
  const TONES = {
    base: { bgcolor: 'background.default' },
    raised: { bgcolor: 'background.paper', borderBlock: '1px solid', borderColor: 'divider' },
    contrast: {
      bgcolor: 'var(--surface-contrast)',
      borderBlock: '1px solid',
      borderColor: 'var(--hairline)',
    },
  } as const;

  return (
    <Box
      component="section"
      id={id}
      sx={{
        position: 'relative',
        py: { xs: 8, md: 14 },
        scrollMarginTop: { xs: 72, md: 88 },
        ...TONES[tone],
        ...sx,
      }}
    >
      <Container maxWidth={maxWidth}>{children}</Container>
    </Box>
  );
}
