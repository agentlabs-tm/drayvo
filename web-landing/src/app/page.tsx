import Box from '@mui/material/Box';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import Standard from '@/components/sections/Standard';
import Paths from '@/components/sections/Paths';
import Transparency from '@/components/sections/Transparency';
import Qualify from '@/components/sections/Qualify';
import Drivers from '@/components/sections/Drivers';
import Owners from '@/components/sections/Owners';
import Shippers from '@/components/sections/Shippers';
import Faq from '@/components/sections/Faq';
import FinalCta from '@/components/sections/FinalCta';
import ApplyForm from '@/components/sections/ApplyForm';
import Footer from '@/components/sections/Footer';
import MobileActionBar from '@/components/ui/MobileActionBar';
import Scene from '@/components/ui/Scene';
import { site } from '@/lib/site';
import { brandVoice } from '@/lib/brand';
import { FAQS } from '@/lib/faqs';

/**
 * Structured data. Deliberately narrow: no aggregateRating, no numeric
 * employee/fleet counts, and no JobPosting salary - publishing an unverified
 * figure in schema is worse than in body copy, because search engines present
 * it as a fact attributed to the company.
 *
 * TODO(verify): add the FMCSA identifiers once confirmed, and reinstate a
 * JobPosting entry with a real `baseSalary` and `validThrough` when the pay
 * structure is signed off. (`telephone` is now published - see lib/site.ts.)
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${site.url}#org`,
      name: site.name,
      legalName: site.legalName,
      url: site.url,
      description: brandVoice.positioning,
      slogan: brandVoice.line,
      email: site.email,
      // E.164, as schema.org expects - the display form would be parsed as a
      // string rather than recognised as a dialable number.
      telephone: site.phoneHref,
      // Raster, square and absolute: Google requires a crawlable image it can
      // rasterize, and an SVG is a weaker signal for the knowledge panel.
      logo: {
        '@type': 'ImageObject',
        url: `${site.url}/brand/icon-512.png`,
        width: 512,
        height: 512,
      },
      image: `${site.url}/brand/icon-512.png`,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: site.phoneHref,
        email: site.email,
        contactType: 'customer service',
        areaServed: 'US',
        availableLanguage: 'English',
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${site.address.street}, ${site.address.suite}`,
        addressLocality: site.address.city,
        addressRegion: site.address.state,
        postalCode: site.address.postalCode,
        addressCountry: site.address.country,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${site.url}#website`,
      url: site.url,
      name: site.name,
      publisher: { '@id': `${site.url}#org` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'FAQPage',
      '@id': `${site.url}#faq`,
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <Box component="main">
        {/*
          PAGE RHYTHM
          The order below is unchanged in argument but re-punctuated. Every
          section used to be the same shape - full-width band, ruled heading,
          grid of text - stacked thirteen deep, which gave a reader no sense of
          structure or progress and was the main reason the page read as
          machine-assembled.

          Full-bleed photographic `Scene`s now sit at the chapter breaks. They
          carry one idea each and no lists, so they function as breaths rather
          than as more sections, and they split the page into four readable
          movements:

            THE CLAIM     Hero, Transparency
            THE STANDARD  Scene, Standard, Paths
            THE AUDIENCE  Scene, Drivers, Qualify, Owners, Shippers
            THE CLOSE     Faq, FinalCta, ApplyForm

          Scenes are load-bearing for pacing, not decoration: adding a section
          without considering which movement it belongs to will put the page
          back where it started.

          `Commitments` used to sit between the hero and Transparency. It was
          removed rather than restyled: all four of its claims are the first
          four entries of `Standard`, in shorter words, and stating them twice
          before the reader reaches the section that owns them made the page
          feel padded. Its one original passage - the note on why this site
          publishes commitments instead of statistics - moved to the foot of
          `Standard`, which is where that argument belongs.
        */}
        <Hero />
        {/*
          Transparency sits third, directly behind the commitments it evidences.
          It carries the interactive settlement - the one place a reader can move
          a slider and watch the arithmetic hold - which is the site's strongest
          argument and was previously buried at position five, behind two long
          text sections. Claim, then proof, then the detail behind the proof.
        */}
        <Transparency />

        {/* Chapter break into the operating commitments. Monochrome by
            design - it introduces the most formal section on the page. */}
        <Scene
          asset="trucksRow"
          treatment="mono"
          align="left"
          height="band"
          eyebrow="The Drayvo Standard"
          title="Seven commitments, in writing."
        />
        <Standard />
        <Paths />

        {/* Chapter break into the audience sections. No copy at all: this one
            exists purely to let the page breathe before four dense sections. */}
        <Scene asset="nightRun" align="left" height="band" title="The work runs at every hour." />
        <Drivers />
        <Qualify />
        <Owners />
        <Shippers />
        {/*
          <Fleet /> is deliberately not rendered. It ships as an honest empty
          state - four dashed camera frames - which on a trucking site reads as
          "this carrier has no trucks" rather than as the candour it was meant to
          convey. The component is kept intact: reinstate it here, and restore
          the "Our Fleet" entry in `nav`, once there are real photographs to put
          in it. See components/sections/Fleet.tsx.
        */}
        <Faq />
        <FinalCta />
        <ApplyForm />
      </Box>
      <Footer />
      <MobileActionBar />
    </>
  );
}
