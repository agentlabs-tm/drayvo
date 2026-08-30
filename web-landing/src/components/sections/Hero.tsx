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
import { WEBVIEW_ATTR } from '@/lib/inAppWebview';
import { useAppTheme } from '@/theme/useAppTheme';

/**
 * First viewport. Its one job is to make clear, immediately, that Drayvo is
 * built for two audiences - people who drive trucks and people who own them —
 * and that the differentiator is visibility, not a headline rate.
 */
export default function Hero() {
  const theme = useAppTheme();

  return (
    <Box
      component="section"
      id="top"
      sx={{
        position: 'relative',
        bgcolor: 'var(--surface-contrast)',
        color: 'text.primary',
        /**
         * Header is 56px on phones, so 12 (96px) puts the eyebrow ~40px below
         * it. The old 14 pushed the headline far enough down that a 320x568
         * screen showed the CTA only after a scroll - the one thing this
         * viewport cannot afford, given most of this traffic arrives from a
         * messaging app.
         */
        pt: { xs: 12, sm: 15, md: 20 },
        pb: { xs: 7, sm: 9, md: 12 },
        /**
         * Landscape phones are wide but only ~360px tall, so they take the
         * *width* breakpoints' generous padding while having almost no height
         * to spend on it. Keyed on height rather than orientation so it also
         * covers split-screen and short in-app browser viewports.
         */
        '@media (max-height: 520px)': {
          pt: 11,
          pb: 5,
        },
        /**
         * When the header is unpinned (iOS in-app browser - see Header), it
         * takes up 56px of flow above this section instead of floating over it.
         * The clearance reserved for a pinned header has to come back off, or
         * the hero opens with a large empty band.
         *
         * Gated to the same breakpoint as the Header rule. Without that gate a
         * desktop webview - where the header stays pinned - had its hero
         * padding cut from 160px to 56px and the headline slid under the bar.
         */
        [theme.breakpoints.down('md')]: {
          [`html[${WEBVIEW_ATTR}] &`]: {
            pt: theme.spacing(5),
          },
        },
        overflow: 'hidden',
      }}
    >
      <RouteLines />

      <Container maxWidth="xl" sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.15fr 0.85fr' },
            gap: { xs: 5, sm: 6, lg: 10 },
            alignItems: 'center',
          }}
        >
          <Box>
            <Reveal>
              <Typography
                variant="overline"
                sx={{ color: 'primary.main', display: 'block', mb: { xs: 1.75, md: 2.5 } }}
              >
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
                  /**
                   * The two lines are 19 and 21 characters of Sora ExtraBold —
                   * roughly 10.2em wide at this tracking. At 320px the usable
                   * measure is 288px, so anything above ~28px wraps a line to
                   * three words and one orphan. The `vw` term is set so the
                   * headline holds exactly two lines from 320px upward, and the
                   * ceiling keeps it inside its grid column at 1920.
                   *
                   * Two ramps because the hero changes shape at `lg`: below it
                   * the headline owns the full measure and can grow fast; at
                   * `lg` it drops into a 1.15fr column beside the audience
                   * cards and has to be sized against *that* column, not the
                   * viewport. The column is `0.575 * (vw - 128px)`, so
                   * `5.6vw - 7px` is the largest size that still fits two
                   * lines - measured at 1280 the old curve wrapped to three.
                   * The 4.15rem ceiling is reached by 1440, leaving the
                   * existing large-desktop headline exactly as it was.
                   */
                  fontSize: {
                    xs: 'clamp(1.75rem, 7.4vw, 3.4rem)',
                    lg: 'clamp(2.6rem, calc(5.6vw - 7px), 4.15rem)',
                  },
                  /**
                   * A 54px headline consumes a third of a landscape phone's
                   * 360px viewport before the supporting line is reached. The
                   * cap keeps the headline, the support line, and the primary
                   * CTA reachable without the reader hunting for them.
                   */
                  '@media (max-height: 520px)': { fontSize: 'clamp(1.75rem, 3.4vw, 2.5rem)' },
                  lineHeight: 1.06,
                }}
              >
                {/* Each line is its own block, so the break is authored rather
                    than left to the line-breaker. `text-wrap: balance` would
                    fight that; `nowrap` would overflow. Blocks do neither. */}
                <Box component="span" sx={{ display: 'block' }}>
                  Every Mile Matters.
                </Box>
                <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
                  Every Driver Matters.
                </Box>
              </Typography>
            </Reveal>

            <Reveal delay={0.12}>
              <Typography
                sx={{
                  mt: { xs: 2.5, md: 3 },
                  // ~62 characters at any size - the comfortable measure for a
                  // supporting line, and narrow enough that it never stretches
                  // across a 1920 column.
                  maxWidth: '38ch',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(1.05rem, 2.6vw, 1.35rem)',
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
                  maxWidth: '62ch',
                  fontSize: { xs: '1rem', md: '1.08rem' },
                  lineHeight: 1.7,
                }}
              >
                Drivers see what every load pays before they roll. Truck owners see revenue,
                expenses, maintenance, and downtime without chasing anyone for answers.
              </Typography>
            </Reveal>

            <Reveal delay={0.24}>
              {/* Stacked and full-bleed on phones (Stack's default `stretch`),
                  side by side and content-width from `sm` up. `flexWrap` covers
                  the landscape-phone case where both fit the row but not at
                  their natural widths. */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                useFlexGap
                sx={{ mt: { xs: 4, md: 5 }, flexWrap: 'wrap', alignItems: { sm: 'flex-start' } }}
              >
                <Button
                  href="#apply"
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                >
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
        'You own the asset - we run the operation',
      ],
      href: '#owners',
      cta: 'For truck owners',
      accent: false,
    },
  ];

  return (
    /**
     * One column on phones, two across from `sm` to `lg`, back to one at `lg`
     * where the block becomes the hero's narrow right-hand column. Without the
     * middle step a tablet stacks two full-width cards under the headline and
     * the hero runs to nearly two screens before the road graphic appears.
     */
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: '1fr' },
        alignItems: 'stretch',
      }}
    >
      {CARDS.map((c) => (
        <Box
          key={c.label}
          sx={{
            display: 'flex',
            flexDirection: 'column',
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
          {/* Pushes the link to the card's foot so both cards' CTAs sit on one
              line when they are side by side and their copy differs in height. */}
          <Box sx={{ flex: 1 }} />
          <Button
            href={c.href}
            endIcon={<ArrowForwardRoundedIcon />}
            sx={{
              mt: 1.5,
              px: 0,
              alignSelf: 'flex-start',
              color: 'primary.main',
              '&:hover': { bgcolor: 'transparent' },
            }}
          >
            {c.cta}
          </Button>
        </Box>
      ))}
    </Box>
  );
}

/**
 * Background: route lines on a grid, drawn once and static. Deliberately not
 * animated - the page has enough motion in its reveals, and a moving
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
