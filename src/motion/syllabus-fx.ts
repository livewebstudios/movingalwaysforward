// Typed text for the dash lists (.syllabus) on the three service pages. Each item types in word by
// word, one rendered line at a time: the bold lead line first, then the body under it. Items run
// strictly top to bottom: an item waits for the one above it to finish. Same line sweep as
// livewebstudios.com/faq, at roughly twice its speed.
//
// - Each item is queued once, when it scrolls into view.
// - No layout shift: words are opacity-only spans, so the text keeps its box the whole time.
// - The real text never leaves the DOM; when an item finishes, its markup is unwrapped back to
//   the original plain text.
// - Reduced motion: nothing runs. No JS: nothing runs (every hiding class is added from here).
// - ClientRouter: binds on astro:page-load, finds elements fresh each time, and data-fx guards
//   against binding an item twice.

const LINE_MS = 200; // Jon 2026-11-10: faster (was 420, the LWS FAQ pace)
const WORD_FADE_MS = 90;
const ITEMS = '.syllabus > li';
const BLOCKS = ':scope > h3, :scope > p';

let io: IntersectionObserver | null = null;
let queue: Promise<void> = Promise.resolve();

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/** Split one block's text into word spans. */
function splitWords(block: HTMLElement) {
  Array.from(block.childNodes).forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      (child.textContent ?? '').split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          return;
        }
        const w = document.createElement('span');
        w.className = 'fx-w';
        w.dataset.fxWord = '';
        w.textContent = part;
        frag.appendChild(w);
      });
      child.replaceWith(frag);
    } else if (child instanceof HTMLElement) {
      child.classList.add('fx-w'); // links etc. type in as one word
    }
  });
}

function prep(li: HTMLElement): boolean {
  const blocks = Array.from(li.querySelectorAll<HTMLElement>(BLOCKS));
  if (!blocks.some((b) => b.textContent?.trim())) return false;
  blocks.forEach(splitWords);
  li.dataset.fx = 'pending';
  return true;
}

/** Put the item back to its original markup. */
function unwrap(li: HTMLElement) {
  li.querySelectorAll<HTMLElement>(BLOCKS).forEach((block) => {
    block.querySelectorAll<HTMLElement>('.fx-w').forEach((w) => {
      if (w.hasAttribute('data-fx-word')) w.replaceWith(w.textContent ?? '');
      else {
        w.classList.remove('fx-w');
        w.style.transitionDelay = '';
        if (!w.className) w.removeAttribute('class');
      }
    });
    block.normalize();
  });
  li.classList.remove('is-typing');
  li.dataset.fx = 'done';
}

/** Sweep every rendered line of the item, top to bottom and left to right, LINE_MS per line. */
async function typeItem(li: HTMLElement) {
  if (!li.isConnected) return;
  const words = Array.from(li.querySelectorAll<HTMLElement>('.fx-w'));
  const rows: { top: number; words: HTMLElement[] }[] = [];
  words.forEach((w) => {
    const top = w.offsetTop;
    let row = rows.find((r) => Math.abs(r.top - top) < 4);
    if (!row) rows.push((row = { top, words: [] }));
    row.words.push(w);
  });
  rows.sort((a, b) => a.top - b.top);
  const first = li.querySelector<HTMLElement>(BLOCKS);
  const left = first?.offsetLeft ?? 0;
  const width = first?.clientWidth || li.clientWidth || 1;
  rows.forEach((r, i) => {
    r.words.forEach((w) => {
      const x = Math.min(1, Math.max(0, w.offsetLeft - left) / width);
      w.style.transitionDelay = `${Math.round(i * LINE_MS + x * LINE_MS)}ms`;
    });
  });
  void li.offsetWidth;
  li.dataset.fx = 'typing';
  li.classList.add('is-typing');
  await wait(rows.length * LINE_MS);
  // The next item can start now; this one's last words finish their fade before unwrapping.
  window.setTimeout(() => unwrap(li), WORD_FADE_MS + 60);
}

/** Queue an item behind every item already queued, so the list types top to bottom. */
function run(li: HTMLElement) {
  if (li.dataset.fx !== 'pending') return;
  li.dataset.fx = 'queued';
  io?.unobserve(li);
  queue = queue.then(() => typeItem(li));
}

/** Queue every pending item above `li` first, so one scrolled past is never skipped out of order. */
function runThrough(li: HTMLElement) {
  const all = Array.from(document.querySelectorAll<HTMLElement>(`${ITEMS}[data-fx="pending"]`));
  for (const item of all) {
    if (item !== li && !(item.compareDocumentPosition(li) & Node.DOCUMENT_POSITION_FOLLOWING)) break;
    run(item);
    if (item === li) break;
  }
}

/** Fallback for a slow or silent IntersectionObserver: measure what is already on screen. */
function runVisible() {
  const vh = window.innerHeight;
  document.querySelectorAll<HTMLElement>(`${ITEMS}[data-fx="pending"]`).forEach((li) => {
    const r = li.getBoundingClientRect();
    if (r.top < vh * 0.9 && r.bottom > 0) runThrough(li);
  });
}

function init() {
  io?.disconnect();
  io = null;
  if (reduced()) return;
  const items = Array.from(document.querySelectorAll<HTMLElement>(ITEMS)).filter((li) => !li.dataset.fx && prep(li));
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(run);
    return;
  }
  io = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .map((e) => e.target as HTMLElement)
        .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
        .forEach(runThrough);
    },
    { threshold: 0.5, rootMargin: '0px 0px -8% 0px' }
  );
  items.forEach((li) => io!.observe(li));
  window.setTimeout(runVisible, 900);
}

let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    runVisible();
  });
};

document.addEventListener('astro:page-load', init);
document.addEventListener('astro:before-swap', () => {
  io?.disconnect();
  io = null;
  queue = Promise.resolve(); // a half-typed list on the old page never holds up the new one
});
window.addEventListener('scroll', onScroll, { passive: true });
