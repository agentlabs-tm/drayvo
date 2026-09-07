'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { brand } from '@/theme/tokens';
import { MEDIA, type MediaKey } from '@/lib/media';

/**
 * How a photograph is graded. The choice is driven by what the image sits
 * under, not by what is in it.
 *
 *   figure  Sits on a page surface with nothing over it. Follows the colour
 *           scheme - see the grade variables in globals.css. This is the one
 *           that matters: an image graded for the dark page and then shown on
 *           the light one reads as a black slab dropped into it.
 *   scene   Full-bleed with white text over it. Deliberately does NOT follow
 *           the scheme - the scrim and the text on top are fixed light-on-dark
 *           in both, so lightening the photograph in light mode would drop the
 *           headline's contrast rather than improve anything.
 *   mono    As `scene`, monochrome. Used once, for the Drayvo Standard break.
 *   raw     No grade. For a photograph that has already been graded on the way
 *           in, which real Drayvo photography may well be.
 */
export type Treatment = 'figure' | 'scene' | 'mono' | 'raw';

/**
 * Every photograph on the site goes through here.
 *
 * The reason is the grade. The images come from different photographers,
 * cameras, and times of day, and dropping them onto a page as-is is what makes
 * a site look assembled rather than designed - six images, six colour grades,
 * no relationship between any of them. Each treatment below applies one grade
 * to all of them: a controlled saturation and contrast, a veil that sets them
 * on their surface, and a trace of brand orange in the midtones.
 *
 * It is the same idea as a film LUT, done in a filter and two blend layers.
 *
 * This survives the swap to real photography. When Drayvo's own photos land -
 * likely shot by more than one person, over more than one day - they will need
 * the same unifying pass, and it is already here.
 */
export default function Media({
  asset,
  treatment = 'figure',
  focus,
  priority = false,
  sizes = '100vw',
  ratio,
  radius = 0,
  sx,
}: {
  asset: MediaKey;
  treatment?: Treatment;
  /**
   * Overrides `MEDIA[asset].focus`, and takes a responsive object so the
   * framing can change with the viewport - a full-bleed image is cropped far
   * harder on a phone than on a desktop, so the point that must stay in frame
   * is not the same point at both sizes.
   *
   * This is a prop rather than something a caller passes through `sx` because
   * `sx` is spread shallowly below: a caller writing its own `'& img'` block
   * would replace this component's entire `'& img'` block, silently dropping
   * the colour grade with it.
   */
  focus?: string | Record<string, string>;
  /** Only the hero should set this. Everything else lazy-loads. */
  priority?: boolean;
  sizes?: string;
  /** Override the intrinsic ratio to crop the frame (e.g. a wide letterbox). */
  ratio?: number;
  radius?: number;
  sx?: object;
}) {
  const m = MEDIA[asset];
  const adaptive = treatment === 'figure';

  /**
   * Fixed grades for the scene treatments. Written out rather than pulled from
   * the CSS variables precisely because these must not track the scheme.
   */
  const FIXED = {
    /**
     * Close to neutral, on purpose. An earlier version pushed saturation and
     * contrast and laid a 10% orange wash over the whole frame - the warm/cool
     * split that film trailers use. On a photograph of a truck the result did
     * not read as graded, it read as generated: the tint is one of the things
     * people now recognise as an AI image. What is left is a small amount of
     * shadow depth so white text has something to sit on, and a trace of warmth
     * well under the level where it becomes a colour cast.
     */
    scene: {
      filter: 'saturate(0.97) contrast(1.02) brightness(0.97)',
      veil: 'rgba(6,13,26,0.18)',
      blend: 'soft-light',
      warm: 'rgba(255,102,0,0.03)',
    },
    mono: {
      filter: 'grayscale(1) contrast(1.1) brightness(0.94)',
      veil: 'rgba(6,13,26,0.26)',
      blend: 'soft-light',
      warm: 'transparent',
    },
  } as const;

  const fixed = treatment === 'scene' ? FIXED.scene : treatment === 'mono' ? FIXED.mono : null;

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio: String(ratio ?? m.ratio),
        overflow: 'hidden',
        borderRadius: radius,
        // Placeholder ground so a slow-loading photo does not flash white on
        // the dark bands.
        bgcolor: brand.charcoal,
        /**
         * The filter lives here, on the wrapper, rather than in the `style`
         * prop of the image. An inline style cannot respond to a media query
         * or an attribute selector, so a scheme-aware grade is impossible from
         * there - which is what left every figure carrying the dark grade on
         * the light page.
         */
        '& img': {
          filter: adaptive ? 'var(--img-filter)' : fixed?.filter,
          /**
           * Framing lives here too, for the same reason as the filter: an
           * inline style cannot take a breakpoint. A full-bleed photograph is
           * cropped far harder on a phone than on a desktop - the hero goes
           * from a 1.7:1 letterbox to something near 1:2 - so the point of the
           * image that must stay in frame is not the same point at both sizes.
           * Callers override it through `sx` as `'& img': { objectPosition }`.
           */
          objectPosition: focus ?? m.focus ?? '50% 50%',
          // Repaint on the compositor rather than in layout when the scheme
          // flips, so the switch does not stutter on a page of six photographs.
          transition: 'filter .25s ease',
        },
        ...sx,
      }}
    >
      <Image
        src={m.src}
        alt={m.alt}
        fill
        priority={priority}
        sizes={sizes}
        // `objectPosition` is deliberately NOT set here - see the `& img`
        // rule above. An inline style would outrank it and kill the override.
        style={{ objectFit: 'cover' }}
      />

      {treatment !== 'raw' && (
        <>
          {/*
            The veil. On the dark page this is brand navy in soft-light, cooling
            and deepening the shadows. On the light page it inverts: a low-alpha
            white screen that lifts the blacks so the photograph shares the
            page's airiness instead of punching a hole in it.
          */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              bgcolor: adaptive ? 'var(--img-veil)' : fixed?.veil,
              /**
               * Cast because `mixBlendMode` is typed as the CSS keyword union
               * and a custom property is not one of them. The variable is
               * defined for both schemes in globals.css, so the value that
               * actually lands is always a valid keyword.
               */
              mixBlendMode: (adaptive
                ? 'var(--img-veil-blend)'
                : fixed?.blend) as React.CSSProperties['mixBlendMode'],
            }}
          />
          {/* A trace of brand orange in the midtones. The thread that makes
              photographs from unrelated sources read as one set. */}
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              bgcolor: adaptive ? 'var(--img-warm)' : fixed?.warm,
              mixBlendMode: 'overlay',
            }}
          />
        </>
      )}
    </Box>
  );
}

/**
 * Scrim presets for text sitting over a photograph.
 *
 * Contrast here is not decoration - white text on an unscrimmed photo fails
 * WCAG the moment the image changes, and the images WILL change. These pair
 * with the `scene` treatment, which keeps the photograph dark in both colour
 * schemes; a scrim alone is not enough, and neither is the grade alone.
 */
export const SCRIM = {
  /** Text at the bottom edge. */
  bottom:
    'linear-gradient(to top, rgba(6,13,26,0.94) 0%, rgba(6,13,26,0.78) 26%, rgba(6,13,26,0.34) 55%, rgba(6,13,26,0.12) 100%)',
  /** Text on the left, image breathing on the right. */
  left: 'linear-gradient(to right, rgba(6,13,26,0.93) 0%, rgba(6,13,26,0.74) 38%, rgba(6,13,26,0.28) 68%, rgba(6,13,26,0.10) 100%)',
  /**
   * Centered text over the whole frame.
   *
   * Weighted to the top, where the headline is, and released across the middle
   * so the subject of the photograph stays in daylight. Deliberately shaped
   * like something optical - a graduated filter over a bright sky - because
   * anything that reads as an effect makes the photograph read as synthetic.
   *
   * The `textShadow` on the headline and lead carries the remainder; both are
   * required, and dropping the shadow puts the hero back under 4.5:1 over the
   * brightest part of the sky.
   */
  full: [
    // 1. A graduated darkening from the top, which is what a photographer gets
    //    from an ND grad over a bright sky. This is the layer carrying the
    //    headline, and it is a linear top-down wash rather than the soft pool
    //    it used to be: a glow centred behind the type is not something a
    //    camera produces, and it was part of why the hero looked rendered.
    'linear-gradient(to bottom, rgba(6,13,26,0.72) 0%, rgba(6,13,26,0.52) 34%, rgba(6,13,26,0.24) 62%, rgba(6,13,26,0.10) 100%)',
    // 2. A short lift off the bottom edge, so the foot of the image meets the
    //    page rather than stopping dead against it.
    'linear-gradient(to top, rgba(6,13,26,0.42) 0%, rgba(6,13,26,0) 26%)',
  ].join(', '),
} as const;
