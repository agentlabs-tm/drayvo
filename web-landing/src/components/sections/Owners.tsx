'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { alpha } from '@mui/material/styles';
import Section from '@/components/ui/Section';
import Reveal from '@/components/motion/Reveal';
import SectionFigure from '@/components/ui/SectionFigure';
import SectionHeading from '@/components/ui/SectionHeading';
import { brand } from '@/theme/tokens';

/**
 * Owner operating system.
 *
 * Scope only. These name the functions Drayvo takes on and what the owner gets
 * back from each - deliberately not how any of it is run. The site's promise is
 * transparency to owners about *their truck*, not a public account of the
 * company's operating method.
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
  {
    title: 'Driver placement',
    body: 'We find and vet the driver, and you know who is in your truck.',
  },
  {
    title: 'Dispatch and load planning',
    body: 'Your truck stays loaded, and you can see what each load pays.',
  },
  {
    title: 'Maintenance coordination',
    body: 'Service is arranged and documented against your unit.',
  },
  {
    title: 'Fuel and routing',
    body: 'Managed against cost per mile, with the spend reported to you.',
  },
  { title: 'Compliance', body: 'Handled under our operating authority.' },
  { title: 'Reporting', body: 'Revenue and cost per truck, without having to ask for it.' },
  { title: 'Downtime', body: 'If your truck is off the road you hear it the same day.' },
];

export default function Owners() {
  return (
    <Section id="owners" tone="contrast">
      <SectionFigure asset="fleetAerial" />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '0.9fr 1.1fr' },
          gap: { xs: 5, lg: 10 },
          alignItems: 'start',
        }}
      >
        <Box sx={{ position: { lg: 'sticky' }, top: { lg: 108 } }}>
          <SectionHeading
            index="06"
            label="For truck owners"
            title="You own the asset. We run the operation."
            lead="Buying a truck is the straightforward part. Everything after it is the work we take on. The title stays in your name, and the reporting comes to you without being asked for."
          />
          <Reveal>
            <Button
              href="#apply"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ mt: 3.5 }}
            >
              Partner your truck
            </Button>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mt: 3, maxWidth: 420 }}
            >
              Drayvo manages trucks owned by their operators and by fleet owners. This is a
              management arrangement, not an investment product, and terms are set out in a written
              agreement before any truck goes into service.
            </Typography>
          </Reveal>
        </Box>

        {/* One reveal for the panel: the rows are a single ruled list, and
            seven staggered entrances made it read as seven separate objects. */}
        <Reveal
          sx={{
            border: '1px solid',
            borderColor: 'var(--hairline)',
            borderRadius: 1.5,
            overflow: 'hidden',
          }}
        >
          {OPERATIONS.map((o, i) => (
            <Stack
                key={o.title}
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
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ color: 'text.primary', fontSize: '1.05rem' }}
                  >
                    {o.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {o.body}
                  </Typography>
                </Box>
            </Stack>
          ))}
        </Reveal>
      </Box>
    </Section>
  );
}
