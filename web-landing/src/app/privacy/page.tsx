import type { Metadata } from 'next';
import LegalPage from '@/components/sections/LegalPage';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Notice',
  description: `How ${site.name} handles information submitted through this site.`,
  robots: { index: false, follow: true },
};

/**
 * TODO(legal): replace this placeholder with a privacy notice drafted or
 * reviewed by counsel. It must cover, at minimum: what is collected, the
 * purpose and legal basis, retention period, third-party processors (ATS/CRM),
 * TCPA consent for SMS and autodialled calls, and how to request deletion.
 * Applicable regimes may include state privacy laws such as the CCPA/CPRA.
 * This page is set to noindex until that review is complete.
 */
export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Notice"
      status="This notice is being prepared and is not yet in force."
      body={[
        `Information you submit through this site is used to respond to your enquiry and, where relevant, to process an application to drive with or partner with ${site.name}.`,
        'We do not sell personal information, and we do not pass driver contact details to lead brokers.',
        `To ask what information we hold about you, or to request its deletion, contact ${site.email}.`,
      ]}
    />
  );
}
