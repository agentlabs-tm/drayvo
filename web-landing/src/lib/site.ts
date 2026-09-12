/**
 * Company facts. Anything marked TODO(verify) is unconfirmed and must be
 * replaced with real, checkable company information before launch - several
 * of these values are surfaced publicly and two of them (MC/DOT) are
 * regulated identifiers that must never be guessed.
 */
export const site = {
  name: 'Drayvo Logistics',
  legalName: 'Drayvo Logistics LLC',
  url: 'https://drayvologistics.com',

  /**
   * Two forms, and both are load-bearing.
   *
   * `phone` is for display and is punctuated the way a US reader expects to
   * read it. `phoneHref` is what goes after `tel:` and must stay E.164 - bare
   * `+`, country code, no spaces, brackets or dashes - because that is the only
   * format every dialler, Android intent handler and iOS Safari agree on.
   *
   * Every consumer still guards on `site.phone` being truthy (see
   * MobileActionBar, ApplyForm and Qualify). That is deliberate: emptying these
   * two strings pulls the number off the whole site in one edit, which is what
   * you want if the line ever changes or goes out of service.
   */
  phone: '(832) 770-0330',
  phoneHref: '+18327700330',
  email: 'contact@drayvologistics.com',

  address: {
    street: '2950 Fondren Rd',
    /** Empty when the address has no unit. Never rendered on its own - see `streetLine`. */
    suite: '',
    city: 'Houston',
    state: 'TX',
    postalCode: '77063',
    country: 'US',
  },

  /**
   * TODO(verify): supply the real FMCSA-issued MC and USDOT numbers, then set
   * `authorityVerified` to true. Until then the site must not display an
   * operating authority number - a placeholder here is a regulatory problem,
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

/**
 * Street line, with the unit appended only when there is one.
 *
 * Both consumers - the footer and the Organization schema - used to join
 * `street` and `suite` with a comma directly. The current address has no unit,
 * which rendered as "2950 Fondren Rd, , Houston". Derive it here so an address
 * with or without a suite is correct in both places.
 */
export const streetLine = [site.address.street, site.address.suite]
  .filter(Boolean)
  .join(', ');

export const nav = [
  { label: 'Why Drayvo', href: '#why' },
  { label: 'For Drivers', href: '#drivers' },
  { label: 'For Truck Owners', href: '#owners' },
  { label: 'For Shippers', href: '#shippers' },
  // "Our Fleet" is withheld while the Fleet section is unrendered - a nav item
  // pointing at an anchor that does not exist is a dead link. Restore both
  // together once there are real photographs. See app/page.tsx.
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#apply' },
] as const;
