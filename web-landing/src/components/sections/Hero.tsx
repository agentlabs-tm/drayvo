'use client';

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { alpha } from '@mui/material/styles';
import Reveal from '@/components/motion/Reveal';
import RouteGraphic from '@/components/motion/RouteGraphic';
import BulletList from '@/components/ui/BulletList';
import { brand } from '@/theme/tokens';
import { brandVoice } from '@/lib/brand';

/**
 * First viewport. Its one job is to make clear, immediately, that Drayvo is
 * built for two audiences — people who drive trucks and people who own them —
 * and that the differentiator is visibility, not a headline rate.
 */
export default function Hero() {
  return (
    <Box
      component="section"
      id="top"
      sx={{
        position: 'relative',
        bgcolor: 'var(--surface-contrast)',
        color: 'text.primary',
        pt: { xs: 14, md: 20 },
        pb: { xs: 8, md: 12 },
        overflow: 'hidden',
      }}
    >
      <RouteLines />

      <Container maxWidth="xl" sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.15fr 0.85fr' },
            gap: { xs: 6, lg: 10 },
            alignItems: 'center',
          }}
        >
          <Box>
            <Reveal>
              <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 2.5 }}>
                For drivers and truck owners
              </Typography>
            </Reveal>

            <Reveal delay={0.06}>
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  color: 'text.primary',
                  maxWidth: 900,
                  fontSize: 'clamp(2rem, 5.2vw, 4.15rem)',
                  lineHeight: 1.05,
                }}
              >
                <Box component="span" sx={{ display: 'block' }}>Every Mile Matters.</Box>
                <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
                  Every Driver Matters.
                </Box>
              </Typography>
            </Reveal>

            <Reveal delay={0.12}>
              <Typography
                sx={{
                  mt: { xs: 2.5, md: 3 },
                  maxWidth: 640,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: { xs: '1.1rem', md: '1.35rem' },
                  letterSpacing: '-0.015em',
                  lineHeight: 1.4,
                  color: 'text.primary',
                }}
              >
                {brandVoice.support}
              </Typography>
            </Reveal>

            <Reveal delay={0.18}>
              <Typography
                sx={{
                  color: 'text.secondary',
                  mt: 2.5,
                  maxWidth: 600,
                  fontSize: { xs: '1rem', md: '1.08rem' },
                  lineHeight: 1.7,
                }}
              >
                Drivers see what every load pays before they roll. Truck owners see revenue,
                expenses, maintenance, and downtime without chasing anyone for answers.
              </Typography>
            </Reveal>

            <Reveal delay={0.24}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 5 }}>
                <Button href="#apply" variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />}>
                  Drive with Drayvo
                </Button>
                <Button
                  href="#owners"
                  variant="outlined"
                  size="large"
                  startIcon={<LocalShippingOutlinedIcon />}
                  sx={{ color: 'text.primary', borderColor: 'divider' }}
                >
                  Put your truck to work
                </Button>
              </Stack>
            </Reveal>
          </Box>

          <Reveal delay={0.2}>
            <AudienceSplit />
          </Reveal>
        </Box>

        <Box sx={{ mt: { xs: 6, md: 8 }, color: 'text.secondary' }}>
          <RouteGraphic />
        </Box>
      </Container>
    </Box>
  );
}

/** The two audiences, stated plainly, side by side. */
function AudienceSplit() {
  const CARDS = [
    {
      label: 'You drive',
      lines: [
        'See the rate before you accept the load',
        'Itemized settlement every week',
        'One dispatcher you can reach directly',
      ],
      href: '#drivers',
      cta: 'For drivers',
      accent: true,
    },
    {
      label: 'You own trucks',
      lines: [
        'Load-level revenue and cost reporting',
        'Maintenance and downtime documented',
        'You own the asset — we run the operation',
      ],
      href: '#owners',
      cta: 'For truck owners',
      accent: false,
    },
  ];

  return (
    <Stack spacing={2}>
      {CARDS.map((c) => (
        <Box
          key={c.label}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: c.accent ? alpha(brand.orange, 0.45) : 'var(--hairline)',
            bgcolor: c.accent ? alpha(brand.orange, 0.07) : 'var(--surface-panel)',
          }}
        >
          <Typography
            variant="overline"
            sx={{ color: c.accent ? 'primary.main' : 'text.secondary', display: 'block', mb: 1.5 }}
          >
            {c.label}
          </Typography>
          <BulletList items={c.lines} />
          <Button
            href={c.href}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{ mt: 1.5, px: 0, color: 'primary.main', '&:hover': { bgcolor: 'transparent' } }}
          >
            {c.cta}
          </Button>
        </Box>
      ))}
    </Stack>
  );
}

/**
 * Background: route lines on a grid, drawn once and static. Deliberately not
 * animated — the page has enough motion in its reveals, and a moving
 * background undercuts the "operational record" tone.
 */
function RouteLines() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `linear-gradient(var(--grid-line) 1px, transparent 1px),
                          linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)`,
        backgroundSize: '72px 72px',
        maskImage: 'radial-gradient(ellipse 80% 60% at 30% 30%, #000 10%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 30% 30%, #000 10%, transparent 70%)',
      }}
    />
  );
}
