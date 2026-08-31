'use client';

import { Box, Typography } from '@mui/material';
import Reveal from '@/components/motion/Reveal';

/**
 * Section header, set as a document header rather than a marketing eyebrow.
 *
 * WHAT THIS REPLACED, AND WHY
 * Every section used to open with the same three-part stack: a small orange
 * uppercase mono badge, an outsized headline with its final phrase coloured in
 * the accent, and a grey subtitle. Nine sections, one pattern - it is the
 * signature layout of a generated landing page, and it was the main reason the
 * site read as machine-made.
 *
 * The replacement borrows from the thing the company actually sells: operating
 * documents. A rule spans the measure, the section's index and name sit beneath
 * it like a specification heading, and the headline follows at a size that does
 * not need an accent colour to carry weight. The index numbers also do real
 * work - they tell a reader how far through the argument they are.
 *
 * The accent colour is deliberately NOT used on part of the headline. That
 * device now appears exactly once on the page, in the hero, which is what makes
 * it read as emphasis rather than as decoration applied by rote.
 */
export default function SectionHeading({
  index,
  label,
  title,
  lead,
  maxWidth = 780,
}: {
  /** Two-digit section index, e.g. `02`. Sequential down the page. */
  index: string;
  /** Short section name, set in mono beside the index. */
  label: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  maxWidth?: number;
}) {
  return (
    <Reveal>
      <Box
        sx={{
          borderTop: '2px solid',
          borderColor: 'text.primary',
          pt: 1.25,
          display: 'flex',
          alignItems: 'baseline',
          gap: 2,
          mb: { xs: 2.5, md: 3.5 },
        }}
      >
        <Typography
          component="span"
          sx={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'primary.main',
            letterSpacing: '0.02em',
          }}
        >
          {index}
        </Typography>
        <Typography
          component="span"
          sx={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'text.secondary',
          }}
        >
          {label}
        </Typography>
      </Box>

      <Typography variant="h2" sx={{ color: 'text.primary', maxWidth }}>
        {title}
      </Typography>

      {lead && (
        <Typography
          component="p"
          sx={{
            color: 'text.secondary',
            mt: 2,
            maxWidth: '58ch',
            fontSize: { xs: '1rem', md: '1.0625rem' },
            lineHeight: 1.6,
          }}
        >
          {lead}
        </Typography>
      )}
    </Reveal>
  );
}
