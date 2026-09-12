'use client';

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Media, { SCRIM } from '@/components/ui/Media';
import Reveal from '@/components/motion/Reveal';
import { brandVoice } from '@/lib/brand';
import { WEBVIEW_ATTR } from '@/lib/inAppWebview';
import { useAppTheme } from '@/theme/useAppTheme';

/**
 * First viewport.
 *
 * WHAT THIS REPLACED, AND WHY
 * The previous hero was a two-column grid carrying an eyebrow, a headline, a
 * bold support line, a 30-word paragraph, two buttons, two bordered audience
 * cards with three bullets each, and an animated road graphic - around seventy
 * words and eleven distinct elements before the fold. Every one of them was
 * defensible on its own. Together they were the problem: a first screen that
 * argues its whole case at once reads as a template with the slots filled in,
 * because that is structurally what it is.
 *
 * This one carries a photograph, the brand line, the support line, and two
 * routes onward. Roughly twenty words. Everything else that was here still
 * exists further down the page where it has room:
 *   - the audience cards duplicated `Paths`, which does the same job better
 *     (ruled rows, honest ranking) - they were removed rather than moved
 *   - the paragraph's two claims are the subject of `Drivers` and `Owners`
 *   - `RouteGraphic` moved out of the hero; the photograph is the hero image now
 *
 * The one accent-coloured phrase on the page lives here, in the second line of
 * the headline. That is what makes it read as emphasis rather than as a habit.
 */
export default function Hero() {
  const theme = useAppTheme();

  return (
    <Box
      component="section"
      id="top"
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        // `svh` rather than `vh`: on iOS the URL bar makes `100vh` taller than
        // the visible viewport, which pushes the CTAs under the fold on exactly
        // the devices most of this traffic arrives on.
        minHeight: { xs: '92svh', md: '94svh' },
        color: '#FFFFFF',
        overflow: 'hidden',
        isolation: 'isolate',
        // The header floats over this section, so the content needs clearance
        // from the top even though the section is vertically centred.
        pt: { xs: 12, md: 14 },
        /**
         * Deliberately heavier at the foot than the head. The block is centred
         * in the section, so the extra bottom padding lifts it into the open
         * sky and leaves the tractor the lower third of the frame to itself.
         * Balanced padding put the buttons across the cab, where an outlined
         * control on a red truck has little to hold on to.
         */
        pb: { xs: 22, md: 26 },
        '@media (max-height: 560px)': { minHeight: 'auto', pt: 11, pb: 7 },
        /**
         * iOS in-app browsers unpin the header (see Header), so it consumes
         * 56px of flow above this section instead of floating over it, and the
         * clearance reserved for a pinned header has to come back off.
         */
        [theme.breakpoints.down('md')]: {
          [`html[${WEBVIEW_ATTR}] &`]: { pt: theme.spacing(5) },
        },
      }}
    >
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Media
          asset="heroHighway"
          treatment="scene"
          priority
          sizes="100vw"
          /**
           * A phone crops this 3:2 frame to roughly 1:2. The rig sits low and
           * right, so a centred crop fills the screen with empty sky and loses
           * the truck entirely. Holding further right and lower keeps it in
           * frame at phone widths.
           */
          focus={{ xs: '66% 70%', md: '62% 64%' }}
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', aspectRatio: 'auto' }}
        />
      </Box>

      <Box
        aria-hidden
        sx={{ position: 'absolute', inset: 0, zIndex: 1, background: SCRIM.full }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
        <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
          <Reveal>
            <Typography
              component="p"
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 500,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.7)',
                mb: { xs: 2.5, md: 3 },
              }}
            >
              For drivers and truck owners
            </Typography>
          </Reveal>

          <Reveal delay={0.06}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                color: '#FFFFFF',
                /**
                 * Two authored lines of 19 and 21 characters. Centred over a
                 * photograph the type can run larger than it could beside the
                 * old audience cards - there is no column to fit inside - so
                 * this is a single ramp from the 320px floor to a 1440px
                 * ceiling rather than the previous two-stage curve.
                 */
                fontSize: 'clamp(2rem, 7.6vw, 5.25rem)',
                '@media (max-height: 560px)': { fontSize: 'clamp(1.75rem, 4vw, 2.6rem)' },
                lineHeight: 1.02,
                // See the note in Scene: globals.css forces `break-word` on
                // headings, which at this size breaks inside words instead of
                // wrapping. The two lines here are authored blocks anyway.
                overflowWrap: 'normal',
                hyphens: 'none',
                textShadow: '0 2px 36px rgba(6,13,26,0.6)',
              }}
            >
              {/* Blocks rather than a <br>, so the break is authored and
                  `text-wrap` never gets a chance to reflow it. */}
              <Box component="span" sx={{ display: 'block' }}>
                Every Mile Matters.
              </Box>
              <Box component="span" sx={{ display: 'block', color: 'primary.light' }}>
                Every Driver Matters.
              </Box>
            </Typography>
          </Reveal>

          <Reveal delay={0.12}>
            <Typography
              sx={{
                mt: { xs: 2.5, md: 3.5 },
                mx: 'auto',
                maxWidth: '34ch',
                fontSize: { xs: '1.05rem', md: '1.3rem' },
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.9)',
                textShadow: '0 1px 20px rgba(6,13,26,0.55)',
              }}
            >
              {brandVoice.support}
            </Typography>
          </Reveal>

          <Reveal delay={0.18}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              useFlexGap
              sx={{
                mt: { xs: 4, md: 5.5 },
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: { sm: 'center' },
              }}
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
                sx={{
                  // Fixed light values, not palette tokens: this button sits on
                  // a dark scrim in both colour schemes, so `text.primary`
                  // would turn it invisible in light mode.
                  /**
                   * A solid button, not an outline. This control lands on
                   * whatever the photograph puts behind it - sky in one crop,
                   * the white truck in another - and an outlined button has to
                   * survive both. It could not: against the tractor it lost its
                   * border and read as loose text.
                   *
                   * Brand ink rather than white, because white is the truck.
                   * Paired with the orange primary it also states the hierarchy
                   * plainly instead of relying on a hairline to do it.
                   */
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(6,13,26,0.82)',
                  borderColor: 'rgba(255,255,255,0.28)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    backgroundColor: 'rgba(6,13,26,0.95)',
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                }}
              >
                Put your truck to work
              </Button>
            </Stack>
          </Reveal>
        </Box>
      </Container>
    </Box>
  );
}
