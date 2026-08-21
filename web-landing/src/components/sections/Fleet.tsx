'use client';

import { Box, Stack, Typography } from '@mui/material';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import { alpha } from '@mui/material/styles';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import { brand } from '@/theme/tokens';

/**
 * Real people and real operations.
 *
 * Intentionally shipped as an honest empty state rather than stock photography
 * or invented employee profiles. Stock trucks on a carrier site read as exactly
 * what they are, and a fabricated dispatcher headshot would contradict the
 * entire positioning.
 *
 * TODO(content): replace each slot with a real photograph and a real caption —
 * drivers (with written consent to publish name and likeness), dispatchers,
 * equipment, maintenance, and the yard or office. Delete any slot that cannot
 * be filled with a genuine photo; an honest gap beats a stock image.
 */
const SLOTS = [
  { label: 'Our drivers', caption: 'The people running the freight.', span: { xs: 'span 1', md: 'span 2' } },
  { label: 'Dispatch', caption: 'Who answers when you call.', span: { xs: 'span 1', md: 'span 1' } },
  { label: 'Equipment', caption: 'The trucks we actually run.', span: { xs: 'span 1', md: 'span 1' } },
  { label: 'Maintenance', caption: 'Service, documented.', span: { xs: 'span 1', md: 'span 2' } },
];

export default function Fleet() {
  return (
    <Section id="fleet" tone="base">
      <SectionHeading
        eyebrow="Real people, real operations"
        title="No stock photos here"
        subtitle="We would rather show you an empty frame than a stock image of somebody else's truck. Photographs of our drivers, our dispatchers, and our equipment go here — real people, named, and published with their permission."
      />

      <Box
        sx={{
          mt: { xs: 5, md: 8 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          gap: 2,
        }}
      >
        {SLOTS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} sx={{ gridColumn: s.span }}>
            <Stack
              spacing={1.5}
              sx={{
                height: { xs: 200, md: 260 },
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                p: 3,
                borderRadius: 1.5,
                border: '1px dashed',
                borderColor: 'divider',
                bgcolor: alpha(brand.steel, 0.06),
              }}
            >
              <PhotoCameraOutlinedIcon sx={{ color: 'text.secondary', fontSize: 26, opacity: 0.7 }} />
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>{s.label}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 260 }}>
                {s.caption}
              </Typography>
            </Stack>
          </Reveal>
        ))}
      </Box>
    </Section>
  );
}
