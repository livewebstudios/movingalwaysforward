// Career Steppingstones "What you get" pricing, after the 21st.dev pricing-section layout
// (centered head, Monthly/Yearly switch, three plan cards), rebuilt in plain CSS in Joe's colors.
// The entrance is the Home hero's: words, then the line under them, then the switch and the
// cards resolve from blur(10px) and 12px low. It plays when the section scrolls into view.
// Reduced motion: no entrance, and prices swap without counting.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate } from 'motion';
import type { StoneCard } from '../data/steppingstones';

type Mark = { src: string; width: number; height: number };
type Props = {
  cards: StoneCard[];
  mark: Mark;
  /** Heading words; the last one sits in the dashed sky box. */
  words: string[];
  sub: string;
  titleId: string;
};

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** "$79" -> 79. Prices in the data file stay human-readable strings. */
const num = (p: string) => Number(p.replace(/[^0-9.]/g, ''));

function Count({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    if (from.current === value) return;
    if (prefersReduced()) {
      from.current = value;
      setShown(value);
      return;
    }
    const c = animate(from.current, value, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    from.current = value;
    return () => c.stop();
  }, [value]);
  return <>{shown}</>;
}

function Switch({ yearly, onChange }: { yearly: boolean; onChange: (y: boolean) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const btns = [useRef<HTMLButtonElement>(null), useRef<HTMLButtonElement>(null)];

  // Size and place the sliding thumb on the active button (CSS variables, transition in CSS).
  useIsoLayoutEffect(() => {
    const place = () => {
      const b = btns[yearly ? 1 : 0].current;
      const w = wrap.current;
      if (!b || !w) return;
      w.style.setProperty('--thumb-x', `${b.offsetLeft}px`);
      w.style.setProperty('--thumb-w', `${b.offsetWidth}px`);
    };
    place();
    window.addEventListener('resize', place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener('resize', place);
  }, [yearly]);

  return (
    <div className="pr-switch" ref={wrap} role="group" aria-label="Billing period">
      <span className="pr-switch__thumb" aria-hidden="true" />
      <button type="button" ref={btns[0]} aria-pressed={!yearly} onClick={() => onChange(false)}>
        Monthly
      </button>
      <button type="button" ref={btns[1]} aria-pressed={yearly} onClick={() => onChange(true)}>
        Yearly <span className="pr-switch__save">Save 20%</span>
      </button>
    </div>
  );
}

export default function PricingStones({ cards, mark, words, sub, titleId }: Props) {
  const [yearly, setYearly] = useState(false);
  const [phase, setPhase] = useState<'static' | 'armed' | 'in'>('static');
  const root = useRef<HTMLDivElement>(null);

  // Arm the entrance on hydrate (content is visible until then), play it on scroll-in.
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReduced() || !('IntersectionObserver' in window)) return;
    setPhase('armed');
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setPhase('in');
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`pr${phase === 'armed' ? ' is-armed' : ''}${phase === 'in' ? ' is-armed is-in' : ''}`} ref={root}>
      <style>{css}</style>
      <span className="pr__glow" aria-hidden="true" />
      <div className="pr__head">
        <h2 id={titleId}>
          {words.map((w, i) => (
            <span key={i}>
              <span className={`pw${i === words.length - 1 ? ' pw--box' : ''}`} style={{ ['--i' as string]: i }}>
                {w}
              </span>
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h2>
        <p className="pr__sub">{sub}</p>
        <div className="pr__switch-row">
          <Switch yearly={yearly} onChange={setYearly} />
        </div>
      </div>

      <div className="pr__cards">
        {cards.map((card, i) => {
          const y = yearly && card.yearly;
          const price = y ? card.yearly!.price : card.price;
          const note = y ? card.yearly!.priceNote : card.priceNote;
          const billed = y ? card.yearly!.billed : card.billed;
          return (
            <article
              key={card.id}
              id={card.id}
              className={`pc${card.featured ? ' pc--featured' : ''}`}
              style={{ ['--c' as string]: i }}
            >
              <div className="pc__head">
                <h3 className="pc__title">{card.title}</h3>
                {card.featured && <span className="pc__badge">Core program</span>}
              </div>
              {price && (
                <div className="pc__price-block">
                  <p className={`pc__price${card.gold ? ' pc__price--gold' : ''}`}>
                    <span className="pc__amount">
                      <span aria-hidden="true">
                        $<Count value={num(price)} />
                      </span>
                      <span className="sr-only">{price}</span>
                    </span>
                    {note && <span className="pc__note">{note}</span>}
                  </p>
                  {billed && <p className="pc__billed" aria-live="polite">{billed}</p>}
                </div>
              )}
              <ul className="pc__list">
                {card.items.map((it, j) => (
                  <li key={j}>
                    <img src={mark.src} alt="" width={20} height={18} loading="lazy" decoding="async" className="pc__bullet" />
                    <span>
                      {it.strong && <strong>{it.strong}</strong>}
                      {it.text}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}

const css = `
.pr { position: relative; }
.pr__glow {
  position: absolute; z-index: 0; pointer-events: none;
  top: -8%; left: 10%; right: 10%; height: 560px;
  background: radial-gradient(closest-side, rgba(84, 164, 226, 0.26), rgba(84, 164, 226, 0) 100%);
}
.pr__head { position: relative; z-index: 1; max-width: 760px; margin: 0 auto var(--s-5); text-align: center; }
.pr__head h2 { margin-bottom: var(--s-2); }
.pw { display: inline-block; transform-origin: 50% 60%; }
.pw--box {
  padding: 0 0.2em; border: 1.5px dashed var(--sky); border-radius: 12px;
  background: var(--sky-050);
}
.pr__sub { margin: 0 auto var(--s-4); max-width: 46ch; font-size: 1.125rem; line-height: 1.5; color: var(--ink-600); }
.pr__switch-row { display: flex; justify-content: center; }

/* Monthly / Yearly switch: one sky thumb slides between the two buttons. Navy text on sky
   keeps AA contrast (white on #54a4e2 would not). */
.pr-switch {
  position: relative; display: inline-flex; padding: 4px; gap: 2px;
  background: var(--paper); border: 1px solid var(--line); border-radius: var(--r-pill);
  box-shadow: var(--shadow-1);
}
.pr-switch__thumb {
  position: absolute; top: 4px; bottom: 4px; left: 0;
  width: var(--thumb-w, 0); translate: var(--thumb-x, 4px) 0;
  border-radius: var(--r-pill);
  background: linear-gradient(to top, var(--sky), var(--sky-200));
  box-shadow: 0 6px 16px -6px rgba(84, 164, 226, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.6);
  transition: translate 500ms cubic-bezier(0.16, 1, 0.3, 1), width 500ms cubic-bezier(0.16, 1, 0.3, 1);
}
.pr-switch button {
  position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 8px;
  min-height: 44px; padding: 0 20px; border: 0; background: none; border-radius: var(--r-pill);
  font: 600 1rem/1 var(--font-body); color: var(--ink-600); cursor: pointer;
  transition: color var(--t-hover) var(--ease-out);
}
.pr-switch button:hover, .pr-switch button[aria-pressed='true'] { color: var(--navy); }
.pr-switch button:focus-visible { outline: 2px solid var(--navy); outline-offset: 2px; }
.pr-switch__save {
  padding: 4px 8px; border-radius: var(--r-pill); background: var(--sky-050);
  font-size: 0.75rem; font-weight: 700; color: var(--navy);
}
.pr-switch button[aria-pressed='true'] .pr-switch__save { background: rgba(255, 255, 255, 0.75); }

/* Plan cards */
.pr__cards { position: relative; z-index: 1; display: grid; gap: var(--s-3); align-items: stretch; }
.pc {
  position: relative; display: flex; flex-direction: column; gap: var(--s-3);
  padding: var(--s-4); background: var(--paper);
  border: 1px solid var(--line); border-radius: var(--r-lg); box-shadow: var(--shadow-1);
}
.pc--featured {
  border-color: transparent;
  background: linear-gradient(180deg, var(--sky-050), var(--paper) 70%);
  box-shadow: 0 0 0 2px var(--sky), var(--shadow-2);
}
.pc__head { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: var(--s-1) var(--s-2); }
.pc__title { margin: 0; }
.pc__badge {
  padding: 5px 12px; border-radius: var(--r-pill); background: var(--sky);
  font-size: 0.8125rem; font-weight: 700; color: var(--navy); white-space: nowrap;
}
.pc__price-block { display: grid; gap: 4px; }
.pc__price { display: flex; align-items: baseline; flex-wrap: wrap; gap: 8px; margin: 0; color: var(--navy); }
.pc__amount {
  font-family: var(--font-display); font-weight: 800; letter-spacing: -0.02em;
  font-size: clamp(2.5rem, 2.1rem + 1.2vw, 3rem); line-height: 1;
  font-variant-numeric: tabular-nums;
}
/* The one gold element in this section: the $199 badge. */
.pc__price--gold .pc__amount { padding: 6px 16px 8px; border-radius: var(--r-pill); background: var(--gold); }
.pc__note { font-weight: 600; color: var(--ink-600); }
.pc__billed { margin: 0; font-size: var(--fs-small); color: var(--ink-600); }
.pc__list {
  list-style: none; margin: 0; padding: var(--s-3) 0 0; display: grid; gap: 12px;
  border-top: 1px solid var(--line);
}
.pc__list li { display: flex; gap: 12px; align-items: flex-start; }
.pc__bullet { flex: none; width: 20px; height: 18px; object-fit: contain; margin-top: 4px; }

/* Hover: the card grows toward the reader and lifts. Uses the scale property, not transform,
   so it never fights the entrance animation's translate. Pointer devices only. */
@media (hover: hover) and (pointer: fine) {
  .pc {
    transition: scale 320ms var(--ease-out), box-shadow 320ms var(--ease-out);
  }
  .pc:hover { z-index: 2; scale: 1.04; box-shadow: var(--shadow-2); }
  .pc--featured:hover { box-shadow: 0 0 0 2px var(--sky), 0 4px 8px rgba(6, 26, 58, 0.1), 0 32px 64px rgba(6, 26, 58, 0.18); }
}

@media (min-width: 768px) {
  .pr__cards { grid-template-columns: 1fr 1fr; }
  .pr__cards > :last-child { grid-column: 1 / -1; }
}
@media (min-width: 1024px) {
  .pr__cards { grid-template-columns: repeat(3, 1fr); }
  .pr__cards > :last-child { grid-column: auto; }
}

/* Entrance: the Home hero's keyframes, held (paused at the start) until the section is in view. */
@keyframes pr-in {
  from { opacity: 0; filter: blur(10px); translate: 0 12px; }
  to { opacity: 1; filter: blur(0); translate: 0 0; }
}
@keyframes pr-word-in {
  from { opacity: 0; filter: blur(10px); translate: 0 12px; scale: 0.9; }
  to { opacity: 1; filter: blur(0); translate: 0 0; scale: 1; }
}
.pr.is-armed .pw { animation: pr-word-in 900ms cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: calc(140ms + var(--i, 0) * 110ms); }
.pr.is-armed .pr__sub { animation: pr-in 800ms cubic-bezier(0.22, 1, 0.36, 1) 600ms both; }
.pr.is-armed .pr__switch-row { animation: pr-in 800ms cubic-bezier(0.22, 1, 0.36, 1) 720ms both; }
.pr.is-armed .pc { animation: pr-in 800ms cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: calc(860ms + var(--c, 0) * 120ms); }
.pr.is-armed:not(.is-in) .pw, .pr.is-armed:not(.is-in) .pr__sub,
.pr.is-armed:not(.is-in) .pr__switch-row, .pr.is-armed:not(.is-in) .pc { animation-play-state: paused; }

@media (prefers-reduced-motion: reduce) {
  .pr .pw, .pr .pr__sub, .pr .pr__switch-row, .pr .pc { animation: none !important; }
  .pr-switch__thumb { transition: none; }
  .pc { transition: box-shadow var(--t-hover) var(--ease-out); }
  .pc:hover { scale: none; }
}
`;
