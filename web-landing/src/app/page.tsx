import Box from '@mui/material/Box';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import Commitments from '@/components/sections/Commitments';
import Standard from '@/components/sections/Standard';
import Paths from '@/components/sections/Paths';
import Transparency from '@/components/sections/Transparency';
import Qualify from '@/components/sections/Qualify';
import Drivers from '@/components/sections/Drivers';
import Owners from '@/components/sections/Owners';
import Shippers from '@/components/sections/Shippers';
import Fleet from '@/components/sections/Fleet';
import Faq from '@/components/sections/Faq';
import FinalCta from '@/components/sections/FinalCta';
import ApplyForm from '@/components/sections/ApplyForm';
import Footer from '@/components/sections/Footer';
import MobileActionBar from '@/components/ui/MobileActionBar';
import { site } from '@/lib/site';
import { brandVoice } from '@/lib/brand';
import { FAQS } from '@/lib/faqs';

/**
 * Structured data. Deliberately narrow: no aggregateRating, no numeric
 * employee/fleet counts, and no JobPosting salary — publishing an unverified
 * figure in schema is worse than in body copy, because search engines present
 * it as a fact attributed to the company.
 *
 * TODO(verify): add `address`, `telephone`, and FMCSA identifiers once
 * confirmed, and reinstate a JobPosting entry with a real `baseSalary` and
 * `validThrough` when the pay structure is signed off.
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <Box component="main">
        <Hero />
        <Commitments />
        <Standard />
        <Paths />
        <Transparency />
        <Drivers />
        <Qualify />
        <Owners />
        <Shippers />
        <Fleet />
        <Faq />
        <FinalCta />
        <ApplyForm />
      </Box>
      <Footer />
      <MobileActionBar />
    </>
  );
}
