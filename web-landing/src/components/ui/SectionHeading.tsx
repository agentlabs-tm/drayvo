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
  return (
    <Stack spacing={2} sx={{ maxWidth, alignItems: 'flex-start' }}>
      <Reveal>
        <Typography variant="overline" sx={{ color: 'primary.main' }}>
          {eyebrow}
        </Typography>
      </Reveal>
      <Reveal delay={0.06}>
        <Typography variant="h2" sx={{ color: 'text.primary' }}>
          {title}
        </Typography>
      </Reveal>
      {subtitle && (
        <Reveal delay={0.12}>
          <Typography component="p" variant="subtitle1" sx={{ color: 'text.secondary', maxWidth: 640 }}>
            {subtitle}
          </Typography>
        </Reveal>
      )}
    </Stack>
  );
}
