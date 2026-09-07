/**
 * Photography manifest.
 *
 * ============================ READ THIS FIRST ============================
 * EVERY image referenced here is a PLACEHOLDER. None of it shows Drayvo
 * equipment, Drayvo drivers, or Drayvo facilities. It is licensed stock
 * (Unsplash License - free for commercial use, no attribution required)
 * standing in until real photography exists.
 *
 * This matters beyond aesthetics. The brand platform in `lib/brand.ts` has an
 * evidence rule: the site does not publish anything it cannot substantiate.
 * A stock photo of someone else's Kenworth, presented without qualification on
 * a carrier's site, is the visual form of exactly that violation. So each
 * entry below carries a `shot` note describing the real photograph that must
 * replace it, and `swapped: false` until it has been.
 *
 * TO REPLACE ONE:
 *   1. Drop the real file at the same path in `public/media/`.
 *   2. Update `alt` to describe what is actually in the frame.
 *   3. Set `swapped: true` and delete the `shot` note.
 *
 * Run `npm run audit:media` to list everything still unswapped.
 *
 * OPTIMIZATION: `next.config.ts` sets `images.unoptimized` for the static
 * export, so Next does no work at build time - whatever is committed is what
 * every visitor downloads, at one size, for every viewport. These placeholders
 * are therefore hand-sized: 2000-2400px on the long edge (enough for a 2x
 * display at the widths they actually render) and re-encoded down to ~2.8MB
 * for the set. Real photography must get the same treatment, and should be
 * served as WebP or AVIF - both are roughly a third the size of these JPEGs at
 * the same quality.
 *
 * GRADING: do not colour-correct for the dark page. Every image is graded at
 * runtime, per colour scheme, by `components/ui/Media.tsx` - supply a neutral,
 * properly exposed original and let the grade do the rest.
 * ========================================================================
 */

export type MediaAsset = {
  /** Path under `public/`. */
  src: string;
  /**
   * Describes the image for a reader who cannot see it. Must describe the
   * CURRENT file - update it when the file is swapped, or the site starts
   * lying to screen readers.
   */
  alt: string;
  /** Intrinsic aspect ratio, `width / height`. Reserves layout space. */
  ratio: number;
  /**
   * Focal point as CSS `object-position`. Full-bleed scenes crop hard at
   * narrow widths; this keeps the subject in frame instead of centering
   * blindly on a subject that is off to one side.
   */
  focus?: string;
  /** True once real Drayvo photography is in place. */
  swapped: boolean;
  /** The real photograph this placeholder is standing in for. */
  shot?: string;
};

export const MEDIA = {
  /** Hero. The one image most people will ever see. */
  heroHighway: {
    src: '/media/hero-highway.jpg',
    alt: 'A white tractor pulling two trailers on a mountain highway under a blue sky.',
    ratio: 3 / 2,
    /**
     * The rig sits low and right of centre with open sky above it - the sky is
     * what the headline sits on. Holding the frame right keeps the tractor in
     * shot as the viewport crops in.
     */
    focus: '62% 64%',
    swapped: false,
    shot:
      'A Drayvo tractor and trailer on open highway, three-quarter front, shot from the ' +
      'shoulder at roughly cab height. THE COMPOSITION IS LOAD-BEARING: the truck must sit ' +
      'in the lower third with clear, uncluttered sky filling the top half - that sky is ' +
      'where the headline goes, and a frame without it will not work in this layout. ' +
      'Ordinary bright daylight, not golden hour: haze, heavy backlight and lens flare are ' +
      'what made an earlier placeholder here look AI-generated rather than photographed. ' +
      'Keep the real detail - roadside, plates, road wear. Landscape, minimum 3000px wide. ' +
      'A white tractor, to match the current placeholder and the brand: the orange reads ' +
      'against white, and a coloured cab fights it. The placeholder is deliberately an ' +
      'UNBRANDED truck - no livery is composited onto it. Earlier revisions tried lettering ' +
      'the Drayvo mark onto a stock truck; every free stock truck at a usable angle already ' +
      'wears another carrier\'s name, so that meant covering a third party\'s trademark, and ' +
      'at hero scale the door is only ~110px wide, too small to read. A plain white truck ' +
      'says nothing untrue and needs no retouching. Put real livery in this slot by ' +
      'photographing a real Drayvo unit, not by compositing.',
  },

  /** Drivers. The section that has to feel like it is about people. */
  driverCab: {
    src: '/media/driver-cab.jpg',
    alt: 'A driver leaning from the window of a tractor cab, talking to a colleague on the ground.',
    ratio: 2 / 3,
    /**
     * High, because this is a portrait source shown in a 21:9 figure - the
     * visible band is a thin slice and the default centre lands on the ground
     * worker's hard hat, with the driver cropped away entirely. 20% puts the
     * cab window and the driver in it in frame.
     *
     * Re-check this after the swap: a landscape replacement will not need it.
     */
    focus: '50% 25%',
    swapped: false,
    shot:
      'A real Drayvo driver at their truck - handing over paperwork, doing a walkaround, or ' +
      'talking to their dispatcher on the phone. Working posture, not a posed portrait. ' +
      'Get a signed model release. Portrait orientation, minimum 1600px wide.',
  },

  /** Owners. Reads as an operation with scale and order. */
  fleetAerial: {
    src: '/media/fleet-aerial.jpg',
    alt: 'Overhead view of tractor-trailers parked in ordered rows across a yard.',
    ratio: 1,
    focus: '50% 50%',
    swapped: false,
    shot:
      'Drone shot directly over the Drayvo yard, trucks parked in rows. If the fleet is too ' +
      'small for this to look substantial, do NOT fake scale - shoot three trucks tight ' +
      'instead and crop square. An honest small yard beats a borrowed large one.',
  },

  /** The Drayvo Standard. Formal, graphic, deliberately monochrome. */
  trucksRow: {
    src: '/media/trucks-row-bw.jpg',
    alt: 'Black and white view down a line of parked tractor units.',
    ratio: 2 / 3,
    focus: '50% 50%',
    swapped: false,
    shot:
      'Low angle down a row of Drayvo tractors, converging perspective. Shoot in colour and ' +
      'desaturate in post - this slot is monochrome by design. Portrait, minimum 1600px wide.',
  },

  /** Night operations. Used as a full-bleed breather between text sections. */
  nightRun: {
    src: '/media/night-tunnel.jpg',
    alt: 'A freight truck on a lit highway at night, viewed through a windshield.',
    ratio: 3 / 2,
    focus: '50% 50%',
    swapped: false,
    shot:
      'A Drayvo truck running after dark - fuel island, scale house, or open road under ' +
      'sodium light. Long exposure is fine. Landscape, minimum 2400px wide.',
  },

  /** Closing call to action. Open road, forward motion. */
  openRoad: {
    src: '/media/mountain-road.jpg',
    alt: 'The rear of a loaded trailer on a highway running through arid mountains.',
    ratio: 3 / 2,
    focus: '55% 60%',
    swapped: false,
    shot:
      'A Drayvo trailer pulling away down open road, shot from behind at low angle. ' +
      'Landscape, minimum 2400px wide.',
  },

} as const satisfies Record<string, MediaAsset>;

export type MediaKey = keyof typeof MEDIA;

/** Everything still showing stock. Used by the media audit script. */
export function pendingMedia(): { key: string; shot: string }[] {
  return Object.entries(MEDIA)
    .filter(([, m]) => !m.swapped)
    .map(([key, m]) => ({ key, shot: (m as MediaAsset).shot ?? '' }));
}
