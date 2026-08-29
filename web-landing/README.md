# Drayvo Logistics - Website

Next.js 16 (App Router) · TypeScript · MUI v9 (CSS-variable theming) · Framer Motion ·
react-hook-form.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

## Positioning

Drayvo is **the open-book trucking company, built for the people who drive trucks and the people who
own them.** Brand line: **Every mile. Every dollar. Accounted for.**

Audience order decides layout weight everywhere: drivers first, truck owners second, shippers a
deliberate third.

`src/lib/brand.ts` is the copy platform - positioning, voice, banned phrases, and the evidence rule.
Read it before editing any marketing text.

## The evidence rule

This site sells transparency, so it cannot itself publish unverifiable claims. **No statistic,
testimonial, certification, fleet size, safety record, or operating history goes on this site unless
the company has verified it.** Where a number would normally sit, state an operating commitment
instead - a commitment is checkable by the reader; a fabricated metric is not.

Everything awaiting real company input is marked `TODO(verify)`, `TODO(legal)`, `TODO(content)`, or
`TODO(integrate)` in the code. Run `grep -rn "TODO(" src` for the current list.

## Structure

```
src/
  app/
    layout.tsx            metadata, fonts, InitColorSchemeScript (no theme flash)
    page.tsx              section composition + JSON-LD (Organization, WebSite, FAQPage)
    privacy/ terms/       placeholder legal pages (noindex until counsel reviews)
    api/apply/route.ts    form endpoint - validation + rate limit (see TODOs)
  components/
    brand/Logo.tsx        light/dark lockup, CSS-swapped
    motion/Reveal.tsx     scroll-reveal primitive
    sections/             Header, Hero, Commitments, Standard, Paths, Transparency,
                          Drivers, Owners, Shippers, Fleet, Faq, FinalCta, ApplyForm,
                          Footer, LegalPage
    ui/                   Section (page rhythm), SectionHeading
  lib/brand.ts            copy platform - read first
  lib/site.ts             company facts (mostly TODO(verify))
  lib/faqs.ts             FAQ grouped by audience; feeds FAQPage schema
  theme/tokens.ts         brand colors - the one file to edit for a re-skin
  theme/theme.ts          MUI theme: both color schemes, typography, components
```

## Design language

Routes, mileage, settlements, operating records. Tight radii (4–6px), a mono face (JetBrains Mono)
for record-style content, and charcoal bands via `<Section tone="dark">` to break the page rhythm.
Orange is reserved for actions and proof points - never decoration.

| Token                   | Value                 | Role                                        |
| ----------------------- | --------------------- | ------------------------------------------- |
| `orange`                | `#FF6600`             | fills, borders, accents on dark             |
| `orangeText`            | `#CC3A00`             | orange **text** on light surfaces (AA-safe) |
| `ink`                   | `#060D1A`             | dark sections, logo plate                   |
| `charcoal` / `graphite` | `#0E141F` / `#161E2B` | record surfaces inside dark bands           |
| `steel`                 | `#7C8DA8`             | quiet neutral                               |
| `mist` / `paper`        | `#F4F6F9` / `#FFFFFF` | light surfaces                              |

Contrast is checked, not assumed: brand orange fails AA as text on light backgrounds (3.5:1), which
is why `orangeText` exists, and contained buttons use ink-on-orange (6.6:1) rather than
white-on-orange (2.9:1).

## Logo assets

`public/brand/` holds the lockups, normalized from the supplied artwork (the baked background plate
was stripped from the horizontal versions).

| File                             | Use                                 |
| -------------------------------- | ----------------------------------- |
| `logo-horizontal-light/dark.svg` | header and footer                   |
| `logo-stacked-light/dark.svg`    | square-ish contexts, social         |
| `icon-light/dark.svg`            | rounded plate - social avatars      |
| `mark.svg`                       | D mark alone - favicon and app icon |

`Logo.tsx` renders both color-ways and hides one in CSS, so the right mark is correct in the first
paint with no JS swap.

## Light / dark mode

MUI CSS-variable theming: both schemes live in one theme, so markup is identical either way - no
hydration mismatch. `InitColorSchemeScript` applies the stored or system choice before first paint.
Mode-conditional styling must use `theme.applyStyles('light'|'dark', …)`; the attribute is
`data-light` / `data-dark`, not `data-mui-color-scheme`.

## Before launch

1. Fill in every `TODO(verify)` in `src/lib/site.ts` - phone, address, and especially the FMCSA
   MC/USDOT numbers, which must never be placeholders. The footer hides them until
   `authorityVerified` is true.
2. Have counsel review `/privacy`, `/terms`, the form consent line, and the owner-partnership
   wording in `Owners.tsx`.
3. Wire `POST /api/apply` to a real destination - it currently only logs, so submissions reach
   nobody.
