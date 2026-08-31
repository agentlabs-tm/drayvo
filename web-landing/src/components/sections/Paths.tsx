'use client';

import { Box, Button, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { alpha } from '@mui/material/styles';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/motion/Reveal';
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
        index="03"
        label="Choose your path"
        title="Where do you fit?"
        lead="Drayvo is built first for the people who drive trucks and the people who own them. Pick the path that matches you."
      />

      {/*
        Was three equal bordered cards with a bullet list and a button in each —
        the pricing-table layout, and instantly recognisable as such. Rebuilt as
        a ruled directory: one row per audience, the name large on the left, the
        detail and points in the middle, the route on the right.

        This also fixes a hierarchy problem the card grid created. The brand
        platform ranks drivers first, owners second, shippers a deliberate
        third, but three side-by-side cards of equal width state the opposite —
        that all three are peers. Stacked rows carry the ranking honestly, and
        the secondary row is simply set quieter.
      */}
      <Box sx={{ mt: { xs: 4, md: 6 }, borderTop: '1px solid', borderColor: 'divider' }}>
        {PATHS.map((p, i) => {
          const lead = p.weight === 'primary';
          return (
            <Reveal key={p.key} delay={i * 0.05}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 15rem) 1fr auto' },
                  columnGap: { md: 5 },
                  rowGap: { xs: 2, md: 0 },
                  alignItems: { md: 'center' },
                  py: { xs: 3.5, md: 4.5 },
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  transition: 'background-color .2s ease',
                  '&:hover': { bgcolor: alpha(brand.orange, 0.04) },
                }}
              >
                <Box>
                  <Typography
                    variant="h3"
                    component="h3"
                    sx={{
                      color: lead ? 'text.primary' : 'text.secondary',
                      fontSize: { xs: '1.4rem', md: lead ? '1.85rem' : '1.5rem' },
                    }}
                  >
                    {p.title}
                  </Typography>
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1.5 }}>
                    {p.body}
                  </Typography>
                  {/* Inline and comma-free: a bulleted list inside a row would
                      rebuild the card. These are attributes, not features. */}
                  <Box
                    component="ul"
                    sx={{
                      listStyle: 'none',
                      p: 0,
                      m: 0,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: { xs: 1, md: 1.5 },
                    }}
                  >
                    {p.points.map((pt) => (
                      <Typography
                        key={pt}
                        component="li"
                        sx={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.72rem',
                          letterSpacing: '0.01em',
                          color: 'text.secondary',
                          border: '1px solid',
                          borderColor: 'divider',
                          px: 1,
                          py: 0.4,
                        }}
                      >
                        {pt}
                      </Typography>
                    ))}
                  </Box>
                </Box>

                <Button
                  href={p.href}
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    justifySelf: { xs: 'start', md: 'end' },
                    px: 0,
                    color: lead ? 'primary.main' : 'text.secondary',
                    whiteSpace: 'nowrap',
                    '&:hover': { bgcolor: 'transparent', color: 'primary.main' },
                  }}
                >
                  {p.cta}
                </Button>
              </Box>
            </Reveal>
          );
        })}
      </Box>
    </Section>
  );
}
