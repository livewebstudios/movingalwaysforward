import { LazyMotion, domAnimation, m, useReducedMotion } from 'motion/react';
import type { ObjSrc } from '../lib/images';
import { reveal, revealGroup, viewportOnce } from '../motion/variants';

export type CatalogItem = { title: string; what: string; format: string; outcome: string; object?: ObjSrc };

// Corporate Training catalog: three labeled rows (What / Format / Outcome) per program.
// Reads like a course catalog on purpose; that was Joe's ask.
export default function CatalogCards({ items }: { items: CatalogItem[] }) {
  const reduced = useReducedMotion();
  return (
    <LazyMotion features={domAnimation} strict>
      <m.ul
        className="catalog"
        variants={reduced ? undefined : revealGroup}
        initial={reduced ? false : 'hidden'}
        whileInView={reduced ? undefined : 'show'}
        viewport={viewportOnce}
      >
        {items.map((it) => (
          <m.li key={it.title} className="catalog__card" variants={reduced ? undefined : reveal}>
            {it.object && (
              <picture className="catalog__obj" aria-hidden="true">
                <source type="image/webp" srcSet={it.object.webp} />
                <img src={it.object.png} width={88} height={88} alt="" loading="lazy" decoding="async" />
              </picture>
            )}
            <h3 className="catalog__title">{it.title}</h3>
            <dl className="catalog__rows">
              <div className="catalog__row">
                <dt>What</dt>
                <dd dangerouslySetInnerHTML={{ __html: it.what }} />
              </div>
              <div className="catalog__row">
                <dt>Format</dt>
                <dd>{it.format}</dd>
              </div>
              <div className="catalog__row">
                <dt>Outcome</dt>
                <dd>{it.outcome}</dd>
              </div>
            </dl>
          </m.li>
        ))}
        <style>{css}</style>
      </m.ul>
    </LazyMotion>
  );
}

const css = `
.catalog { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--s-3); }
.catalog__card { position: relative; padding: var(--s-4); background: var(--paper); border: 1px solid var(--line); border-radius: var(--r-lg); box-shadow: var(--shadow-1); }
.catalog__obj { position: absolute; top: var(--s-2); right: var(--s-2); width: 88px; height: 88px; transform: rotate(8deg); }
.catalog__obj img { width: 88px; height: 88px; object-fit: contain; }
.catalog__title { margin-bottom: var(--s-3); padding-right: 96px; }
.catalog__rows { margin: 0; display: grid; gap: 0; }
.catalog__row { display: grid; grid-template-columns: 88px 1fr; gap: var(--s-2); padding: 12px 0; border-top: 1px solid var(--line); }
.catalog__row:last-child { padding-bottom: 0; }
.catalog__row dt { font-size: var(--fs-eyebrow); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--navy); padding-top: 3px; }
.catalog__row dd { margin: 0; color: var(--ink); }
@media (min-width: 900px) { .catalog { grid-template-columns: 1fr 1fr; } }
`;
