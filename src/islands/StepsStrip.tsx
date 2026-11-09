import { LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import type { ObjSrc } from '../lib/images';
import { reveal, revealGroup, viewportOnce } from '../motion/variants';

type Step = { title: string; body: string };

// The 3-step "How it works" strip. The sky-blue line draws left to right over 700ms as the
// steps reveal (motion kit #9). The coffee cups sit on step 1 at 72px. Reduced motion: drawn.
export default function StepsStrip({ steps, coffee }: { steps: Step[]; coffee: ObjSrc }) {
  const reduced = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
      <m.ol
        className="steps"
        variants={reduced ? undefined : revealGroup}
        initial={reduced ? false : 'hidden'}
        whileInView={reduced ? undefined : 'show'}
        viewport={viewportOnce}
      >
        <svg className="steps__line" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
          <m.path
            d="M0 1 H100"
            fill="none"
            stroke="#54A4E2"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            initial={reduced ? false : { pathLength: 0 }}
            whileInView={reduced ? undefined : { pathLength: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        {steps.map((s, i) => (
          <m.li key={s.title} className="steps__item" variants={reduced ? undefined : reveal}>
            <div className="steps__marker">
              <span className="steps__num" aria-hidden="true">
                {i + 1}
              </span>
              {i === 0 && (
                <picture className="steps__cup">
                  <source type="image/webp" srcSet={coffee.webp} />
                  <img src={coffee.png} width={72} height={72} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                </picture>
              )}
            </div>
            <h3 className="steps__title">
              <span className="sr-only">Step {i + 1}: </span>
              {s.title}
            </h3>
            <p className="steps__body">{s.body}</p>
          </m.li>
        ))}
        <style>{css}</style>
      </m.ol>
    </LazyMotion>
  );
}

const css = `
.steps { position: relative; list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s-4); counter-reset: step; }
.steps__line { display: none; }
.steps__item { position: relative; }
.steps__marker { position: relative; display: flex; align-items: center; gap: 12px; height: 56px; margin-bottom: var(--s-2); }
.steps__num { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: var(--navy); color: var(--paper); font-family: var(--font-display); font-weight: 800; font-size: 1.125rem; }
.steps__cup { display: block; width: 72px; height: 72px; margin-left: -6px; }
.steps__cup img { width: 72px; height: 72px; object-fit: contain; }
.steps__title { margin-bottom: var(--s-1); }
.steps__body { color: var(--ink); max-width: 36ch; }
@media (min-width: 768px) {
  .steps { grid-template-columns: repeat(3, 1fr); gap: var(--s-4); }
  .steps__line { display: block; position: absolute; left: 22px; right: 22px; top: 27px; height: 2px; width: calc(100% - 44px); z-index: 0; }
  .steps__marker { z-index: 1; }
  .steps__num { box-shadow: 0 0 0 8px var(--paper); }
  .section--mist .steps__num { box-shadow: 0 0 0 8px var(--mist); }
}
`;
