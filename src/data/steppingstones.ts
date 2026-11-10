// Career Steppingstones · every price and component is from Joe's own flyer (Oct 2026).
// A new flyer from Joe becomes one entry in `flyers`. New workshop topics go in the tracks.

export type StoneCard = {
  id: string;
  label: string;
  title: string;
  price: string;
  priceNote?: string;
  /** Gold price badge: the one gold element in the "What you get" section. */
  gold?: boolean;
  /** Ringed "Core program" card; the Monthly/Yearly toggle lands here. */
  featured?: boolean;
  /** Paid-yearly price, shown when the toggle is on Yearly. Pending Joe's sign-off. */
  yearly?: { price: string; priceNote: string; billed: string };
  /** Small line under the price on Monthly (keeps the card height steady when toggling). */
  billed?: string;
  items: { text: string; strong?: string }[];
};

export const stoneCards: StoneCard[] = [
  {
    id: 'getting-started',
    label: 'Card A',
    title: 'Getting started',
    price: '$199',
    priceNote: 'one time',
    gold: true,
    items: [
      { text: 'A thirty-minute individual introductory call with Coach Joe' },
      { text: 'A signed copy of Bursting the Bubble, mailed to you' },
      { text: 'A copy of Eat That Frog: 21 Ways to Stop Procrastinating' },
      { text: 'Plus everything in the monthly program below from day one' },
    ],
  },
  {
    id: 'monthly',
    label: 'Card B',
    title: 'The monthly program',
    price: '$99',
    priceNote: 'a month',
    billed: 'billed monthly',
    featured: true,
    yearly: { price: '$79', priceNote: 'a month', billed: 'billed $948 yearly' },
    items: [
      {
        strong: 'Two virtual small-group workshops a month',
        text: ' (one hour each): one on the Career Growth track, one on the Professional Growth track',
      },
      {
        strong: 'Peer-to-Peer Coffee Club:',
        text: ' practice networking skills and trade what is working with people in the same spot',
      },
      { strong: 'Weekly accountability', text: ' emails and short videos from Joe' },
      { text: 'Cancel any time, for any reason' },
    ],
  },
  {
    id: 'add-ons',
    label: 'Card C',
    title: 'Add-ons when you want them',
    price: '',
    items: [
      { text: 'Individual thirty-minute coaching session: $60 (regularly $75)' },
      { text: 'DISC behavioral assessment only: $125 to $175, several versions to choose from' },
      { text: 'DISC assessment with a one-hour debrief: $250' },
    ],
  },
];

// Two tracks, three topic clusters each. Move a topic by moving one line; add one by adding a line.
// Cluster names are pending Joe's sign-off (Nov 2026).
export type Cluster = { name: string; topics: string[] };
export type Track = { name: string; tagline: string; clusters: Cluster[] };

export const tracks: Track[] = [
  {
    name: 'Career Growth',
    tagline: 'Getting hired.',
    clusters: [
      { name: 'Mindset', topics: ['Be a Victor', 'Get in the Game', 'Curiosity', 'Professional Mindset'] },
      { name: 'Know your worth', topics: ['Find the Value in All You Do', 'Know Your Value'] },
      {
        name: 'Win the search',
        topics: ['Differentiation', 'Do Your Homework', 'Be Resourceful', 'Intentional Networking', "Interview Do's and Don'ts"],
      },
    ],
  },
  {
    name: 'Professional Growth',
    tagline: 'Getting better.',
    clusters: [
      { name: 'Know yourself', topics: ['Why?', "Don't Label Me", 'Defining Your Success', 'Bursting the Bubble'] },
      { name: 'Read the room', topics: ['Manipulation', 'Workforce Challenges', 'Career Truths'] },
      {
        name: 'Build the habits',
        topics: ['Attitude Is Everything', 'Habits: The Architecture of Success', 'Do Not Walk Alone', 'The Pathway to Success'],
      },
    ],
  },
];

export type Flyer = {
  title: string;
  description: string;
  /** Path under public/, or a labeled placeholder string in square brackets */
  file: string;
  placeholder?: string;
};

export const flyers: Flyer[] = [
  {
    title: 'Career Steppingstones overview (PDF)',
    description: 'The program, the two tracks and the pricing on one page.',
    file: '',
    placeholder: 'PLACEHOLDER: assets/source/steppingstones/career-steppingstones.pdf, Jon supplies',
  },
];

export const pricing = {
  initiation: { price: '199', label: 'Getting started, one time' },
  monthly: { price: '99', label: 'Monthly program' },
  yearly: { price: '948', label: 'Monthly program, paid yearly (save 20%)' },
} as const;
