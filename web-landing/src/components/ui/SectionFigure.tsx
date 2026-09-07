'use client';

import { Box, Typography } from '@mui/material';
import Media from '@/components/ui/Media';
import Reveal from '@/components/motion/Reveal';
import type { MediaKey } from '@/lib/media';

/**
 * A contained photograph that opens a section.
 *
 * Deliberately NOT a `Scene`. The page uses two photographic devices and they
 * have to stay distinguishable, or the reader loses the structural signal that
 * makes the rhythm work:
 *
 *   Scene         full-bleed, edge to edge, type over the image, no container.
 *                 Marks a chapter break. Nothing follows it in the same breath.
 *   SectionFigure sits inside the container with the rest of the section, has
 *                 a radius and a caption, and carries no headline. It belongs
 *                 to the section beneath it rather than separating anything.
 *
 * The caption is optional and currently unused. It is kept for real
 * photography, where naming what is in the frame is worth the line - a unit
 * number, a yard, a lane. It is NOT the place for disclaimers: labelling
 * marketing photography as stock reads as an unfinished site and draws a
 * reader's attention to something they were never going to question. What the
 * evidence rule in lib/brand.ts actually forbids is presenting an image as a
 * claim - see `Transparency`, where the settlement figures carry "Illustrative
 * example... not Drayvo operating results" because those are numbers, and a
 * number is a claim in a way that a photograph of a truck is not.
 */
export default function SectionFigure({
  asset,
  caption,
  ratio = 21 / 9,
}: {
  asset: MediaKey;
  /**
   * Optional. Names what is in the frame when that is worth saying. Keep it
   * factual - it runs underneath a photograph on a page whose entire argument
   * is that the company does not overstate things.
   */
  caption?: string;
  /**
   * Letterbox on desktop. Sources here are portrait and square, so the crop is
   * severe - `MEDIA[asset].focus` is what keeps the subject in frame, and it
   * needs checking against the real photograph after every swap.
   *
   * This value applies from `md` up only. See the responsive override below.
   */
  ratio?: number;
}) {
  return (
    <Reveal>
      <Box component="figure" sx={{ m: 0, mb: { xs: 4, md: 6 } }}>
        <Media
          asset={asset}
          treatment="figure"
          ratio={ratio}
          radius={1.5}
          sizes="(max-width: 1536px) 100vw, 1536px"
          sx={{
            /**
             * The crop has to open up as the viewport narrows. A 21:9 band is
             * 620px tall on a 1440px page and a 167px sliver on a 390px phone —
             * the same ratio, but at phone width it stops being a photograph
             * and becomes a decorative stripe with the subject cropped out of
             * it. Squarer ratios on small screens give the image back its
             * height without letting it take over the section.
             *
             * `sx` is spread after `aspectRatio` in Media, so this wins.
             */
            aspectRatio: { xs: '4 / 3', sm: '16 / 9', md: String(ratio) },
            /**
             * A hairline inset rather than a border, so it cannot affect the
             * box's size. On the light page a photograph with no edge reads as
             * a hole cut in the surface; on the dark page it stops the darker
             * corners of an image bleeding into the background.
             */
            boxShadow: 'inset 0 0 0 1px var(--img-edge)',
          }}
        />
        {caption && (
          <Typography
            component="figcaption"
            variant="caption"
            sx={{
              display: 'block',
              mt: 1.25,
              color: 'text.secondary',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {caption}
          </Typography>
        )}
      </Box>
    </Reveal>
  );
}
