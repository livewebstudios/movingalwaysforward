import { LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import type { ObjSrc } from '../lib/images';
import { reveal, revealGroup, viewportOnce } from '../motion/variants';

export type Door = { title: string; href: string; body: string; object: ObjSrc; rotate: number };

// The four doors (Home): 2x2 bento, each card an object, a title, two sentences and a
// destination. The card lifts on hover; its object rotates 3° further and scales 1.04.
export default function DoorGrid({ doors }: { doors: Door[] }) {
  const reduced = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
      <m.ul
        className="doors"
        variants={reduced ? undefined : revealGroup}
        initial={reduced ? false : 'hidden'}
        whileInView={reduced ? undefined : 'show'}
        viewport={viewportOnce}
      >
        {doors.map((d) => (
          <m.li key={d.href} variants={reduced ? undefined : reveal}>
            <a className="door" href={d.href} style={{ '--r': `${d.rotate}deg` } as React.CSSProperties}>
              <picture className="door__obj" aria-hidden="true">
                <source type="image/webp" srcSet={d.object.webp} />
                <img src={d.object.png} width={96} height={96} alt="" loading="lazy" decoding="async" />
              </picture>
              <h3 className="door__title">{d.title}</h3>
              <p className="door__body">{d.body}</p>
              <span className="door__go">
                Explore
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 10h11M10 5l5 5-5 5" />
                </svg>
                <span className="sr-only"> {d.title}</span>
              </span>
            </a>
          </m.li>
        ))}
        <style>{css}</style>
      </m.ul>
    </LazyMotion>
  );
}

const css = `
.doors { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s-3); }
.door { position: relative; display: flex; flex-direction: column; gap: var(--s-2); min-height: 100%; padding: var(--s-4); padding-right: 120px; background: var(--paper); border: 1px solid var(--line); border-radius: var(--r-lg); box-shadow: var(--shadow-1); color: var(--ink); text-decoration: none; transition: transform var(--t-hover) var(--ease-out), box-shadow var(--t-hover) var(--ease-out); }
.door:hover, .door:focus-visible { transform: translateY(-4px); box-shadow: var(--shadow-2); }
.door__obj { position: absolute; top: var(--s-2); right: var(--s-2); width: 96px; height: 96px; transform: rotate(var(--r)); transition: transform var(--t-hover) var(--ease-out); }
.door__obj img { width: 96px; height: 96px; object-fit: contain; }
.door:hover .door__obj { transform: rotate(calc(var(--r) + 3deg)) scale(1.04); }
.door__title { margin: 0; max-width: 14ch; }
.door__body { margin: 0; max-width: 52ch; }
.door__go { display: inline-flex; align-items: center; gap: 6px; margin-top: auto; padding-top: var(--s-1); font-weight: 600; color: var(--navy); text-decoration: underline; text-decoration-color: transparent; text-decoration-thickness: 2px; text-underline-offset: 0.25em; transition: text-decoration-color var(--t-hover) var(--ease-out); }
.door:hover .door__go { text-decoration-color: var(--sky); }
.door__go svg { transition: transform var(--t-hover) var(--ease-out); }
.door:hover .door__go svg { transform: translateX(3px); }
@media (min-width: 768px) { .doors { grid-template-columns: 1fr 1fr; gap: var(--s-3); } .door { padding-right: var(--s-4); padding-top: 120px; } .door__obj { top: var(--s-3); right: var(--s-3); } }
@media (prefers-reduced-motion: reduce) { .door, .door__obj, .door__go svg { transition: none; } .door:hover { transform: none; } .door:hover .door__obj { transform: rotate(var(--r)); } }
`;
