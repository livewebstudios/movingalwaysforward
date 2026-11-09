// Career Steppingstones · every price and component is from Joe's own flyer (Oct 2026).
// A new flyer from Joe becomes one entry in `flyers`. New workshop topics go in the tracks.

export type StoneCard = {
  id: string;
  label: string;
  title: string;
  price: string;
  priceNote?: string;
  featured?: boolean;
  items: { text: string; strong?: string }[];
};

export const stoneCards: StoneCard[] = [
  {
    id: 'getting-started',
    label: 'Card A',
    title: 'Getting started',
    price: '$199',
    priceNote: 'one time',
    featured: true,
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

export type Track = { name: string; topics: { title: string; theme: string }[] };

export const tracks: Track[] = [
  {
    name: 'Career Growth track',
    topics: [
      { title: 'Be a Victor', theme: 'mindset' },
      { title: 'Get in the Game', theme: 'motivation' },
      { title: 'Find the Value in All You Do', theme: 'purpose' },
      { title: 'Differentiation', theme: 'strategy' },
      { title: 'Curiosity', theme: 'success trait' },
      { title: 'Know Your Value', theme: 'self-awareness' },
      { title: 'Do Your Homework', theme: 'preparation' },
      { title: 'Be Resourceful', theme: 'career elevation' },
      { title: 'Professional Mindset', theme: 'expectations' },
      { title: 'Intentional Networking', theme: 'job search' },
      { title: "Interview Do's and Don'ts", theme: 'winning' },
    ],
  },
  {
    name: 'Professional Growth track',
    topics: [
      { title: 'Why?', theme: 'purpose' },
      { title: "Don't Label Me", theme: 'awareness' },
      { title: 'Manipulation', theme: 'awareness' },
      { title: 'Workforce Challenges', theme: 'career insight' },
      { title: 'Attitude Is Everything', theme: 'positive mindset' },
      { title: 'Defining Your Success', theme: 'motivation' },
      { title: 'Bursting the Bubble', theme: 'personal growth' },
      { title: 'Career Truths', theme: 'competitive insight' },
      { title: 'Habits: The Architecture of Success', theme: 'performance' },
      { title: 'Do Not Walk Alone', theme: 'resourcefulness' },
      { title: 'The Pathway to Success', theme: 'success' },
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
} as const;
