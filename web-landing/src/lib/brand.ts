/**
 * Drayvo brand platform - the reference every line of copy on this site is
 * written against. Read this before editing marketing text anywhere else.
 *
 * NAME
 *   Drayvo - from *dray* (to haul) and *drive*. The mark is a D built from a
 *   road and a forward arrow: the route, and the person running it.
 *
 * POSITIONING
 *   The open-book trucking company, built for the people who drive trucks and
 *   the people who own them. Most carriers compete on a headline rate; the
 *   number is easy to print and easy to walk back, and drivers know it. Drayvo
 *   competes on visibility - what a load pays before you accept it, what came
 *   out of the settlement and why, what the truck earned and what it cost.
 *
 * BRAND LINE - primary
 *   "Every Mile Matters. Every Driver Matters."
 *   Two halves that have to stay together: the miles are the work, the driver
 *   is the person doing it. Always paired with the supporting line below; the
 *   slogan states the value, the support line says what it buys you.
 *
 *   Supporting: "Reliable freight. Transparent pay. A company built around
 *   drivers."
 *
 * BRAND LINE - secondary
 *   "Transparent miles. Transparent pay. Every dollar accounted for."
 *   The financial-transparency message, kept for contexts where the subject is
 *   pay, settlements, or owner reporting. Use it there and nowhere else - it is
 *   the proof behind the primary line, not a second slogan competing with it.
 *
 *   Neither line takes adjectives. Do not run both in the same viewport.
 *
 * AUDIENCE ORDER - this ranking decides layout weight everywhere.
 *   1. Professional drivers
 *   2. Owner-operators and fleet owners
 *   3. Shippers (secondary; present, never dominant)
 *
 * VOICE
 *   Confident, transparent, respectful, operationally knowledgeable, human,
 *   specific, never exaggerated.
 *   - Specific over superlative. A named process beats an adjective.
 *   - Short declaratives. Say the thing, then stop.
 *   - Talk to drivers as professionals and peers, never as inventory.
 *   - Concede real limits. A brand that admits what it does not do is believed
 *     about what it does.
 *
 * EVIDENCE RULE - the one that matters most on this site.
 *   Never publish a statistic, testimonial, certification, fleet size, safety
 *   record, or operating history that has not been verified by the company.
 *   Where a number would normally go, state an operating commitment instead:
 *   a commitment is checkable by the reader, a fabricated metric is not.
 *   Anything awaiting verified input carries a TODO(verify) comment in code.
 *
 * BANNED PHRASES
 *   delivering excellence, best-in-class, your trusted transportation partner,
 *   industry-leading, moving America forward, driven by excellence, seamless,
 *   cutting-edge, world-class, one-stop shop, revolutionary, unlock, elevate.
 *
 * NAMED ASSETS - capitalize these; they are brand property, not descriptions.
 *   The Drayvo Standard - the operating commitments (see Standard.tsx).
 *   Say "fleet-owner trucks" or "partner-owned trucks". Never "investor-owned"
 *   or anything implying a securities offering, absent legal review.
 */

export const brandVoice = {
  /** Primary slogan. Hero, footer, structured data, social cards. */
  line: 'Every Mile Matters. Every Driver Matters.',
  /** Always accompanies the primary line. */
  support: 'Reliable freight. Transparent pay. A company built around drivers.',
  /** Secondary line, reserved for pay/settlement/reporting contexts. */
  transparency: 'Transparent miles. Transparent pay. Every dollar accounted for.',
  positioning:
    'The open-book trucking company, built for the people who drive trucks and the people who own them.',
  standard: 'The Drayvo Standard',
} as const;
