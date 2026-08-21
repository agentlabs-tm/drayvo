'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { alpha } from '@mui/material/styles';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import BulletList from '@/components/ui/BulletList';
import { brand } from '@/theme/tokens';

/**
 * Three audience paths. Drivers and owners are visually dominant (they get the
 * wide columns and the accent border); shippers is present but deliberately
 * secondary, matching the audience order in the brand platform.
 */
const PATHS = [
  {
    key: 'drive',
    title: 'I drive trucks',
    body: 'Company driver or owner-operator. You want to know what a load pays before you take it, and you want a settlement you can actually reconcile.',
    points: ['Rate visible before dispatch', 'Itemized weekly settlement', 'One dispatcher, direct line'],
    href: '#drivers',
    cta: 'See the driver path',
    weight: 'primary' as const,
  },
  {
    key: 'own',
    title: 'I own trucks',
    body: 'One truck or several. You own the asset and want it working, without running dispatch, compliance, and maintenance coordination yourself.',
    points: ['Load-level revenue and cost', 'Maintenance documented', 'Downtime visible, not explained away'],
    href: '#owners',
    cta: 'See the owner path',
    weight: 'primary' as const,
  },
  {
    key: 'ship',
    title: 'I ship freight',
    body: 'You need capacity from a carrier that answers the phone and tells you where your freight actually is.',
    points: ['Direct carrier, not a broker desk', 'Named contact on every load'],
    href: '#shippers',
    cta: 'See the shipper path',
    weight: 'secondary' as const,
  },
];

export default function Paths() {
  return (
    <Section tone="base">
      <SectionHeading
        eyebrow="Choose your path"
        title="Where do you fit?"
        subtitle="Drayvo is built first for the people who drive trucks and the people who own them. Pick the path that matches you."
      />

      <Box
        sx={{
          mt: { xs: 5, md: 8 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: '1fr 1fr 0.8fr' },
          gap: 2.5,
          alignItems: 'stretch',
        }}
      >
        {PATHS.map((p, i) => {
          const lead = p.weight === 'primary';
          return (
            <Reveal key={p.key} delay={i * 0.06} sx={{ height: '100%' }}>
              <Stack
                spacing={2}
                sx={{
                  height: '100%',
                  p: { xs: 3, md: 4 },
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: lead ? alpha(brand.orange, 0.4) : 'divider',
                  bgcolor: 'background.paper',
                  borderTop: '3px solid',
                  borderTopColor: lead ? brand.orange : 'divider',
                }}
              >
                <Typography variant="h4" component="h3" sx={{ color: 'text.primary', fontSize: { xs: '1.4rem', md: '1.6rem' } }}>
                  {p.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{p.body}</Typography>

                <Box sx={{ pt: 0.5 }}>
                  <BulletList items={p.points} color="text.primary" />
                </Box>

                <Box sx={{ flex: 1 }} />
                <Button
                  href={p.href}
                  variant={lead ? 'contained' : 'outlined'}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{ alignSelf: 'flex-start', ...(lead ? {} : { color: 'text.primary' }) }}
                >
                  {p.cta}
                </Button>
              </Stack>
            </Reveal>
          );
        })}
      </Box>
    </Section>
  );
}
