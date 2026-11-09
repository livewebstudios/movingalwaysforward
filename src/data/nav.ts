export type Service = {
  title: string;
  href: string;
  line: string;
  object: 'notebook-pen' | 'compass' | 'ladder' | 'speech-bubbles';
};

// The dropdown exists because Joe sells four distinct things to two distinct buyers.
export const services: Service[] = [
  {
    title: 'Early Career Coaching',
    href: '/early-career-coaching/',
    line: 'One-on-one for new grads and young professionals. $75 a session.',
    object: 'notebook-pen',
  },
  {
    title: 'Executive & Business Coaching',
    href: '/executive-business-coaching/',
    line: 'For professionals one level below where they belong, and owners who are the bottleneck.',
    object: 'compass',
  },
  {
    title: 'Corporate Training & Workshops',
    href: '/corporate-training/',
    line: 'Sales, leadership and communication programs built like courses.',
    object: 'ladder',
  },
  {
    title: 'Group Programs',
    href: '/group-programs/',
    line: 'Cohorts and teams that grow faster together.',
    object: 'speech-bubbles',
  },
];

export const primaryNav = [
  { label: 'STEPPINGSTONES', href: '/career-steppingstones/' },
  { label: 'THE BOOK', href: '/the-book/' },
  { label: 'INSIGHTS', href: '/insights/' },
  { label: 'ABOUT', href: '/about/' },
];

export const moreLinks = [
  { label: 'Career Steppingstones', href: '/career-steppingstones/' },
  { label: 'The Book', href: '/the-book/' },
  { label: 'Insights', href: '/insights/' },
  { label: 'About Joe', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];
