/**
 * Drayvo Logistics — brand tokens, taken directly from the logo artwork
 * in `public/brand/`. Every color on the site resolves back to this file.
 */
export const brand = {
  // Signature orange — the logo's D-arrow gradient runs #FF6600 → #F24200.
  // Reserved for actions and proof points, never for decoration.
  orange: '#FF6600',
  orangeDeep: '#F24200',
  orangeLight: '#FF7E23',
  /**
   * Accessible orange for text and icons on light surfaces. The brand orange
   * only reaches 3.5:1 on the light background, which fails WCAG AA for normal
   * text; this clears 4.5:1 on white, the mist background, and the contrast band while still
   * reading as the brand color. Fills and borders use `orange`; text uses this.
   */
  orangeText: '#C23700',
  /** Hover/pressed step below `orangeText`. */
  orangeDeepText: '#A82F00',

  // Brand dark — the plate color behind the reversed lockup.
  ink: '#060D1A',
  // Charcoal band used to break the page into sections and carry the
  // "operating record" surfaces (settlements, reporting previews).
  charcoal: '#0E141F',
  graphite: '#161E2B',

  // Neutrals
  steel: '#7C8DA8',
  mist: '#F4F6F9',
  paper: '#FFFFFF',
} as const;

