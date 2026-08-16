import type { Metadata } from 'next';
import LegalPage from '@/components/sections/LegalPage';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: `Terms governing use of the ${site.name} website.`,
  robots: { index: false, follow: true },
};

/**
 * TODO(legal): replace with terms drafted or reviewed by counsel. Nothing on
 * the marketing site constitutes an offer of employment, a rate guarantee, or
 * a management agreement — that needs to be stated here explicitly once the
 * real driver and owner agreements exist. Set to noindex until reviewed.
 */
export default function Terms() {
  return (
    <LegalPage
      title="Terms of Use"
      status="These terms are being prepared and are not yet in force."
      body={[
        'This website describes services and working arrangements in general terms. Nothing on it is an offer of employment, a guarantee of pay or available miles, or a binding management agreement.',
        'Pay structure, deductions, settlement schedules, and truck management terms are set out in a written agreement provided before any working relationship begins. Where this site and that agreement differ, the agreement governs.',
        `Questions about these terms can be sent to ${site.email}.`,
      ]}
    />
  );
}
