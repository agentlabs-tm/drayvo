'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { alpha } from '@mui/material/styles';
import Section from '@/components/ui/Section';
import Reveal from '@/components/motion/Reveal';
import { brand } from '@/theme/tokens';

/**
 * Owner operating system.
 *
 * Language is deliberately "fleet owner" / "partner-owned truck" throughout —
 * never "investor" or anything implying a return-generating offering, which
 * would carry securities implications the business has not had reviewed.
 *
 * TODO(legal): have the owner agreement and this page's wording reviewed before
 * launch, specifically any phrasing that could read as an investment solicitation.
 * TODO(verify): confirm which of these functions Drayvo performs in-house today
 * versus through partners, and say which is which.
 */
const OPERATIONS = [
  { title: 'Driver placement', body: 'We recruit, vet, and place the driver, and we tell you who is in your truck.' },
  { title: 'Dispatch and load planning', body: 'Lane selection and week planning, with the rate on each load visible to you.' },
  { title: 'Maintenance coordination', body: 'Scheduled service and repairs arranged and documented against the unit.' },
  { title: 'Fuel strategy', body: 'Routing and fuel purchasing managed to reduce cost per mile, with spend reported.' },
  { title: 'Compliance support', body: 'Permits, filings, and DOT recordkeeping handled under our operating authority.' },
  { title: 'Revenue and expense reporting', body: 'Per-load revenue and per-truck cost, available as it happens rather than at month end.' },
  { title: 'Downtime management', body: 'When a truck is out of service you are told that day, with the reason and the expected return.' },
];

export default function Owners() {
  return (
    <Section id="owners" tone="contrast">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '0.9fr 1.1fr' },
          gap: { xs: 5, lg: 10 },
          alignItems: 'start',
        }}
      >
        <Box sx={{ position: { lg: 'sticky' }, top: { lg: 120 } }}>
          <Reveal>
            <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 2 }}>
              For truck owners
            </Typography>
          </Reveal>
          <Reveal delay={0.06}>
            <Typography variant="h2" sx={{ color: 'text.primary' }}>
              You own the asset.{' '}
              <Box component="span" sx={{ color: 'primary.main' }}>We run the operation.</Box>
            </Typography>
          </Reveal>
          <Reveal delay={0.12}>
            <Typography sx={{ color: 'text.secondary', mt: 2.5, fontSize: '1.05rem' }}>
              Buying a truck is the straightforward part. Authority, insurance, freight, a driver
              you can rely on, and the recordkeeping behind all of it — that is the work we take
              on. The title stays in your name and the reporting comes to you unprompted.
            </Typography>
          </Reveal>
          <Reveal delay={0.18}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
              <Button href="#apply" variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />}>
                Partner your truck
              </Button>
            </Stack>
          </Reveal>
          <Reveal delay={0.24}>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 3, maxWidth: 420 }}>
              Drayvo manages trucks owned by their operators and by fleet owners. This is a
              management arrangement, not an investment product, and terms are set out in a
              written agreement before any truck goes into service.
            </Typography>
          </Reveal>
        </Box>

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'var(--hairline)',
            borderRadius: 1.5,
            overflow: 'hidden',
          }}
        >
          {OPERATIONS.map((o, i) => (
            <Reveal key={o.title} delay={Math.min(i * 0.04, 0.2)}>
              <Stack
                direction="row"
                spacing={{ xs: 2, md: 3 }}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  alignItems: 'flex-start',
                  borderTop: i === 0 ? 'none' : '1px solid',
                  borderColor: 'var(--hairline)',
                  bgcolor: i % 2 === 0 ? 'var(--surface-panel)' : 'transparent',
                  transition: 'background-color .2s ease',
                  '&:hover': { bgcolor: alpha(brand.orange, 0.06) },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    color: 'primary.main',
                    fontWeight: 600,
                    pt: '4px',
                    minWidth: 24,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </Typography>
                <Box>
                  <Typography variant="h6" component="h3" sx={{ color: 'text.primary', fontSize: '1.05rem' }}>
                    {o.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{o.body}</Typography>
                </Box>
              </Stack>
            </Reveal>
          ))}
        </Box>
      </Box>
    </Section>
  );
}
