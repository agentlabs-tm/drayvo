/**
 * Company facts. Anything marked TODO(verify) is unconfirmed and must be
 * replaced with real, checkable company information before launch — several
 * of these values are surfaced publicly and two of them (MC/DOT) are
 * regulated identifiers that must never be guessed.
 */
export const site = {
  name: 'Drayvo Logistics',
  legalName: 'Drayvo Logistics LLC',
  url: 'https://www.drayvologistics.com',

  // TODO(verify): confirm the recruiting and dispatch numbers that actually ring a person.
  phone: '(713) 555-0142',
  phoneHref: '+17135550142',
  email: 'dispatch@drayvologistics.com',
  recruitingEmail: 'drive@drayvologistics.com',

  address: {
    street: '17350 State Hwy 249',
    suite: 'Ste 220',
    city: 'Houston',
    state: 'TX',
    postalCode: '77064',
    country: 'US',
  },

  /**
   * TODO(verify): supply the real FMCSA-issued MC and USDOT numbers, then set
   * `authorityVerified` to true. Until then the site must not display an
   * operating authority number — a placeholder here is a regulatory problem,
   * not a copy problem.
   */
  authorityVerified: false,
  mcNumber: '',
  dotNumber: '',

  // TODO(verify): remove any channel the company does not actively maintain.
  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
  },
} as const;

export const nav = [
  { label: 'Why Drayvo', href: '#why' },
  { label: 'For Drivers', href: '#drivers' },
  { label: 'For Truck Owners', href: '#owners' },
  { label: 'For Shippers', href: '#shippers' },
  { label: 'Our Fleet', href: '#fleet' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#apply' },
] as const;
