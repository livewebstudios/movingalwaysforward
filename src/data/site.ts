// Locked facts (docs/00_decisions.md). Placeholders are labeled so Jon can find them.
export const site = {
  name: 'Always Forward, LLC',
  shortName: 'Always Forward',
  tagline: 'Working to Facilitate Change and Accelerate Success.',
  url: 'https://movingalwaysforward.com',
  owner: 'Joe Hliboki',
  jobTitle: 'Certified FocalPoint Business, Executive & Career Coach',
  locality: 'Montvale',
  region: 'NJ',
  country: 'US',
  phoneOffice: '201-879-0001',
  phoneMobile: '201-454-0698',
  phoneOfficeE164: '+1-201-879-0001',
  phoneMobileE164: '+1-201-454-0698',
  // [CONFIRM_EMAIL] FocalPoint address until an @movingalwaysforward.com mailbox exists
  email: 'jhliboki@focalpointcoaching.com',
  emailPlaceholder: 'CONFIRM_EMAIL',
  calendly: 'https://calendly.com/joe-hliboki-focalpoint-coaching/',
  linkedin: '[LINKEDIN_URL_PLACEHOLDER]',
  amazon: '[AMAZON_URL_PLACEHOLDER]',
  formspree: 'https://formspree.io/f/FORM_ID_PLACEHOLDER',
  ga4: 'G-XXXXXXXXXX',
  gscToken: 'GSC_VERIFICATION_PLACEHOLDER',
  ogDefault: '/og/default.png',
  areaServed: ['New Jersey', 'New York metro', 'Connecticut'],
} as const;

export const bookInfo = {
  title: 'Bursting the Bubble',
  subtitle: 'A Commonsense Guide to Early Career Success',
} as const;
