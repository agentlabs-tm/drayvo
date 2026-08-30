'use client';

import { Stack, Typography } from '@mui/material';
import Reveal from '@/components/motion/Reveal';

/**
 * Standard section heading: mono eyebrow, h2 title, plain-paragraph subtitle.
 *
 * The subtitle is forced to `<p>`: MUI maps the `subtitle1` variant to `<h6>`
 * by default, which injected a heading between each h2 and its h3s.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  maxWidth = 760,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  maxWidth?: number;
}) {
  /**
   * One Reveal for the whole heading, not one per line.
   *
   * The eyebrow, title, and subtitle are a single unit of meaning and read as
   * one; animating them separately made three staggered events out of a thing
   * the eye takes in at once, and cost three scroll observers per section. It
   * also thins the page's total reveal count, which is what lets the reveals
   * that remain actually signify something.
   */
  return (
    <Reveal>
      <Stack spacing={2} sx={{ maxWidth, alignItems: 'flex-start' }}>
        <Typography variant="overline" sx={{ color: 'primary.main' }}>
          {eyebrow}
        </Typography>
        <Typography variant="h2" sx={{ color: 'text.primary' }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography
            component="p"
            variant="subtitle1"
            sx={{ color: 'text.secondary', maxWidth: 640 }}
          >
            {subtitle}
          </Typography>
        )}
      </Stack>
    </Reveal>
  );
}
