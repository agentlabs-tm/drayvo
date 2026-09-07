'use client';

import { Box, Container, Typography } from '@mui/material';
import Media, { SCRIM, type Treatment } from '@/components/ui/Media';
import Reveal from '@/components/motion/Reveal';
import type { MediaKey } from '@/lib/media';

/**
 * A full-bleed photographic scene.
 *
 * This is the piece that fixes the page's rhythm problem. The old page was
 * thirteen `Section`s in a row - same wrapper, same padding, same left-aligned
 * heading-then-grid - so a reader scrolling it received no signal about where
 * they were or how much was left. Uniform rhythm at that length is the single
 * strongest "generated page" tell, more than any individual component.
 *
 * A Scene breaks the column. It is edge to edge, it is photographic, it holds
 * one short idea, and it is the only element on the page that gets to be
 * silent. Placed between the dense sections it does the job whitespace does in
 * a printed report: it tells you a chapter ended.
 *
 * Deliberately limited to a heading and one line. The moment a Scene grows a
 * bullet list it stops being a breath and becomes another section.
 */
export default function Scene({
  id,
  asset,
  eyebrow,
  title,
  lead,
  align = 'center',
  height = 'tall',
  priority = false,
  treatment = 'scene',
  children,
}: {
  id?: string;
  asset: MediaKey;
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
  /** `center` for statements, `left` for scenes that carry on into a section. */
  align?: 'center' | 'left';
  /**
   * `full`  - near-viewport height. Reserved for the hero.
   * `tall`  - a major statement between chapters.
   * `band`  - a letterbox divider; a breath, not a stop.
   */
  height?: 'full' | 'tall' | 'band';
  priority?: boolean;
  /** `mono` for the formal breaks; `scene` elsewhere. Never `figure` - a
   * Scene carries white text, so its photograph must stay dark in both
   * colour schemes. See Media. */
  treatment?: Treatment;
  /** Buttons, usually. Kept optional - most Scenes should not have any. */
  children?: React.ReactNode;
}) {
  const MIN_H = {
    full: { xs: '86svh', md: '92svh' },
    tall: { xs: '68svh', md: '78svh' },
    band: { xs: '42svh', md: '52svh' },
  }[height];

  const centered = align === 'center';

  return (
    <Box
      component="section"
      id={id}
      sx={{
        position: 'relative',
        display: 'flex',
        alignItems: centered ? 'center' : 'flex-end',
        minHeight: MIN_H,
        // Scenes are always dark-on-photo regardless of colour scheme: the
        // scrim is a fixed dark gradient, so the text over it cannot follow
        // the light palette or it disappears.
        color: '#FFFFFF',
        overflow: 'hidden',
        isolation: 'isolate',
        scrollMarginTop: { xs: 76, md: 96 },
      }}
    >
      {/* The photograph, absolutely filling the scene rather than sitting in
          flow - `Media` is ratio-driven, and a scene is height-driven. */}
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Media
          asset={asset}
          treatment={treatment}
          priority={priority}
          sizes="100vw"
          sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', aspectRatio: 'auto' }}
        />
      </Box>

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: centered ? SCRIM.full : SCRIM.bottom,
        }}
      />

      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 2,
          py: { xs: 8, md: 12 },
          textAlign: centered ? 'center' : 'left',
        }}
      >
        {/*
          Measure is set on each child rather than here, because `ch` resolves
          against the font-size of the element it is written on. Put `26ch` on
          this wrapper and it is 26 characters of *body* text - about 210px -
          which then forces a 72px headline to break inside words.
        */}
        <Box sx={{ maxWidth: centered ? 1080 : 860, mx: centered ? 'auto' : 0 }}>
          {eyebrow && (
            <Reveal>
              <Typography
                component="p"
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 500,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.72)',
                  mb: 2,
                }}
              >
                {eyebrow}
              </Typography>
            </Reveal>
          )}

          <Reveal delay={0.06}>
            <Typography
              variant="h2"
              component="h2"
              sx={{
                color: '#FFFFFF',
                // Larger than the in-page h2: a Scene headline is competing
                // with a photograph, not with body copy.
                fontSize: {
                  xs: 'clamp(2rem, 8.4vw, 3rem)',
                  md: 'clamp(2.8rem, 5.2vw, 4.5rem)',
                },
                lineHeight: 1.02,
                maxWidth: '17ch',
                mx: centered ? 'auto' : 0,
                /**
                 * `globals.css` sets `overflow-wrap: break-word` on every
                 * heading so long unbroken strings cannot overflow a 320px
                 * viewport. At display sizes that rule will happily break a
                 * normal word in half rather than wrap it. Headlines here are
                 * short, authored, and contain no unbreakable strings, so the
                 * protection is not needed and is switched back off.
                 */
                overflowWrap: 'normal',
                hyphens: 'none',
                // Photographs are busy. A soft shadow keeps the headline
                // readable over whatever the replacement image turns out to be.
                textShadow: '0 2px 28px rgba(6,13,26,0.55)',
              }}
            >
              {title}
            </Typography>
          </Reveal>

          {lead && (
            <Reveal delay={0.12}>
              <Typography
                sx={{
                  mt: { xs: 2, md: 2.5 },
                  maxWidth: '46ch',
                  mx: centered ? 'auto' : 0,
                  fontSize: { xs: '1.02rem', md: '1.15rem' },
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.88)',
                  textShadow: '0 1px 16px rgba(6,13,26,0.5)',
                }}
              >
                {lead}
              </Typography>
            </Reveal>
          )}

          {children && (
            <Reveal delay={0.18}>
              <Box
                sx={{
                  mt: { xs: 4, md: 5 },
                  display: 'flex',
                  gap: 1.5,
                  flexWrap: 'wrap',
                  justifyContent: centered ? 'center' : 'flex-start',
                }}
              >
                {children}
              </Box>
            </Reveal>
          )}
        </Box>
      </Container>
    </Box>
  );
}
