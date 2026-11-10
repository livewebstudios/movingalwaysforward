import { LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import type { ObjSrc } from '../lib/images';
import { reveal, revealGroup, viewportOnce } from '../motion/variants';

export type Door = { title: string; href: string; body: string; object: ObjSrc; rotate: number };

// The four doors (Home) as a bento grid (Aceternity "bento-grid", rebuilt in plain CSS).
// Desktop is a 3-column checkerboard: wide + narrow, then narrow + wide. Each card is a
// gradient tile holding the 3D object, then title, body and "Explore". On hover the card
// lifts its shadow, the text block slides 8px right and the object tips and grows a touch.
export default function DoorGrid({ doors }: { doors: Door[] }) {
  const reduced = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
      <m.ul
        className="bento"
        variants={reduced ? undefined : revealGroup}
        initial={reduced ? false : 'hidden'}
        whileInView={reduced ? undefined : 'show'}
        viewport={viewportOnce}
      >
        {doors.map((d) => (
          <m.li key={d.href} className="bento__cell" variants={reduced ? undefined : reveal}>
            <a className="bento__item" href={d.href} style={{ '--r': `${d.rotate}deg` } as React.CSSProperties}>
              <div className="bento__header" aria-hidden="true">
                <picture className="bento__obj">
                  <source type="image/webp" srcSet={d.object.webp} />
                  <img src={d.object.png} width={96} height={96} alt="" loading="lazy" decoding="async" />
                </picture>
              </div>
              <div className="bento__text">
                <h3 className="bento__title">{d.title}</h3>
                <p className="bento__body">{d.body}</p>
                <span className="bento__go">
                  Explore
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 10h11M10 5l5 5-5 5" />
                  </svg>
                  <span className="sr-only"> {d.title}</span>
                </span>
              </div>
            </a>
          </m.li>
        ))}
        <style>{css}</style>
      </m.ul>
    </LazyMotion>
  );
}

const css = `
.bento {
  --bento-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --bento-time: 400ms;
  list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: 1fr; gap: 16px;
}
.bento__cell { display: flex; }
.bento__item {
  flex: 1;
  display: flex; flex-direction: column; justify-content: space-between; gap: 16px;
  padding: 16px;
  background: var(--paper);
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 2px 3px -1px rgba(0, 0, 0, 0.1), 0 1px 0 0 rgba(25, 28, 33, 0.02), 0 0 0 1px rgba(25, 28, 33, 0.08);
  color: var(--ink);
  text-decoration: none;
  transition: box-shadow var(--bento-time) var(--bento-ease), transform var(--bento-time) var(--bento-ease), border-color var(--bento-time) var(--bento-ease);
}
.bento__header {
  position: relative;
  display: grid; place-items: center;
  flex: 1; min-height: 10rem;
  border-radius: 12px;
  background: linear-gradient(to bottom right, var(--sky-050), #f8fafc);
  overflow: hidden;
}
.bento__obj { display: block; width: 96px; height: 96px; transform: rotate(var(--r)); transition: transform var(--bento-time) var(--bento-ease); }
.bento__obj img { width: 96px; height: 96px; object-fit: contain; }
.bento__text {
  display: flex; flex-direction: column; gap: 8px;
  transition: transform var(--bento-time) var(--bento-ease);
}
.bento__title { margin: 0; font-size: 1.25rem; line-height: 1.2; color: var(--navy); }
.bento__body { margin: 0; font-size: var(--fs-small); line-height: 1.55; color: var(--ink-600); max-width: 64ch; }
.bento__go {
  display: inline-flex; align-items: center; gap: 6px; margin-top: 4px;
  font-size: var(--fs-small); font-weight: 600; color: var(--navy);
}
.bento__go svg { transition: transform var(--bento-time) var(--bento-ease); }

.bento__item:hover, .bento__item:focus-visible {
  transform: translateY(-2px);
  border-color: #dcdcdc;
  box-shadow: 0 20px 25px -5px rgba(6, 26, 58, 0.1), 0 8px 10px -6px rgba(6, 26, 58, 0.1);
}
.bento__item:hover .bento__text, .bento__item:focus-visible .bento__text { transform: translateX(8px); }
.bento__item:hover .bento__obj, .bento__item:focus-visible .bento__obj { transform: rotate(calc(var(--r) + 4deg)) scale(1.08); }
.bento__item:hover .bento__go svg, .bento__item:focus-visible .bento__go svg { transform: translateX(3px); }

@media (min-width: 768px) {
  .bento { grid-template-columns: 1fr 1fr; }
}
@media (min-width: 1024px) {
  /* ~55/45 checkerboard on a 9-column grid: wide (5) + narrow (4), then narrow + wide. */
  .bento { grid-template-columns: repeat(9, 1fr); grid-auto-rows: minmax(22rem, auto); }
  .bento__cell:nth-child(1), .bento__cell:nth-child(4) { grid-column: span 5; }
  .bento__cell:nth-child(2), .bento__cell:nth-child(3) { grid-column: span 4; }
}
@media (prefers-reduced-motion: reduce) {
  .bento__item, .bento__text, .bento__obj, .bento__go svg { transition: none; }
  .bento__item:hover, .bento__item:focus-visible { transform: none; }
  .bento__item:hover .bento__text, .bento__item:focus-visible .bento__text { transform: none; }
  .bento__item:hover .bento__obj, .bento__item:focus-visible .bento__obj { transform: rotate(var(--r)); }
}
`;
