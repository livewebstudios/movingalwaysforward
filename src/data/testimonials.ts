// Testimonials shown by ProofBlock (src/components/ProofBlock.astro).
// SAMPLE CONTENT (Jon 26_11_11): these quotes, names and faces are stand-ins so Joe can see the
// cards filled in. The people are not real and the photos are generated. Replace each entry with
// a real client quote and photo (or drop the photo) before launch, and remove `sample` on the
// ProofBlock that uses it.
import type { ImageMetadata } from 'astro';
import maya from '../assets/avatars/avatar-maya.jpg';
import karen from '../assets/avatars/avatar-karen.jpg';
import mark from '../assets/avatars/avatar-mark.jpg';
import lisa from '../assets/avatars/avatar-lisa.jpg';
import dan from '../assets/avatars/avatar-dan.jpg';
import rachel from '../assets/avatars/avatar-rachel.jpg';
import denise from '../assets/avatars/reader-denise.jpg';
import tyler from '../assets/avatars/reader-tyler.jpg';
import angela from '../assets/avatars/reader-angela.jpg';
import chris from '../assets/avatars/reader-chris.jpg';
import paul from '../assets/avatars/reader-paul.jpg';
import jasmine from '../assets/avatars/reader-jasmine.jpg';
import rob from '../assets/avatars/reader-rob.jpg';
import nina from '../assets/avatars/reader-nina.jpg';

export interface Testimonial {
  title: string;
  text: string;
  name: string;
  role?: string;
  photo: ImageMetadata;
}

export const earlyCareer: Testimonial[] = [
  {
    title: 'Two offers in three weeks',
    text: 'I had sent ninety applications and heard nothing back. Joe took my resume apart in the first session, and three weeks later I had two offers on the table.',
    name: 'Maya R.',
    role: 'Analyst, first job out of college',
    photo: maya,
  },
  {
    title: 'He finally listened',
    text: 'Our son listened to Joe in a way he never listened to us. He walked into his first job knowing how to carry himself, and it shows.',
    name: 'Karen D.',
    role: 'Parent',
    photo: karen,
  },
];

export const executive: Testimonial[] = [
  {
    title: 'The question I was avoiding',
    text: 'Joe asked the question I had been avoiding for two years. Six months later I was running the region instead of complaining about it.',
    name: 'Mark T.',
    role: 'Regional Sales Director',
    photo: mark,
  },
  {
    title: 'A plan, not a pep talk',
    text: 'No pep talks. A written plan with dates on it, and someone who actually asked about it every other week.',
    name: 'Lisa M.',
    role: 'Owner, professional services firm',
    photo: lisa,
  },
];

export const group: Testimonial[] = [
  {
    title: 'Worth it for the room alone',
    text: 'Hearing four other managers wrestle with the same problems was worth it on its own. The homework is what made it stick.',
    name: 'Dan P.',
    role: 'Operations Manager, peer cohort',
    photo: dan,
  },
];

export const corporate: Testimonial[] = [
  {
    title: 'Our managers noticed',
    text: 'Our new hires came out of the workshop asking better questions in week two than most ask in month six. Our managers noticed before we told them.',
    name: 'Rachel S.',
    role: 'Director of Talent Development',
    photo: rachel,
  },
];

// Reader reviews for The Book page (ReviewMarquee). Same SAMPLE note as above: made-up readers and
// generated faces, so Joe can see the section filled in. Swap for real Amazon reviews before launch.
export type Review = Testimonial;

export const bookReaders: Review[] = [
  {
    title: 'Bought it for a graduate',
    text: "Gave it to my daughter for graduation. She read it in two sittings and walked into her first week with a list of questions for her manager.",
    name: 'Denise K.',
    role: 'Parent of a new grad',
    photo: denise,
  },
  {
    title: 'No fluff at all',
    text: 'Plain language, short chapters, real examples. The chapter on how to be managed should be required reading.',
    name: 'Tyler B.',
    role: 'Software engineer, first year',
    photo: tyler,
  },
  {
    title: 'I hand it out on day one',
    text: 'I onboard a new class of hires every year. Now they get this book on day one and I stop giving the same speech.',
    name: 'Angela R.',
    role: 'Engineering manager',
    photo: angela,
  },
  {
    title: 'Wish I had it at 22',
    text: 'Would have saved me two jobs and a lot of guessing. I bought a copy for my nephew the day I finished it.',
    name: 'Chris O.',
    role: 'Regional sales manager',
    photo: chris,
  },
  {
    title: 'My son finished it',
    text: 'That alone says something. He quoted it back to me after his first performance review, and he was right.',
    name: 'Paul M.',
    role: 'Parent',
    photo: paul,
  },
  {
    title: 'Got me through a rough week',
    text: 'The section on recovering from a mistake got me through my first bad review. Practical and honest.',
    name: 'Jasmine T.',
    role: 'Marketing associate',
    photo: jasmine,
  },
  {
    title: 'Every intern gets one',
    text: 'Gave it to all four of our summer interns. Two of them came back asking what else Joe has written.',
    name: 'Rob S.',
    role: 'Small business owner',
    photo: rob,
  },
  {
    title: 'Like advice from someone who made it',
    text: 'Reads like the mentor I did not have. Straight talk about showing up, asking for things and getting noticed.',
    name: 'Nina V.',
    role: 'Recent graduate',
    photo: nina,
  },
];
