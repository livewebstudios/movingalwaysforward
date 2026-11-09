import { useEffect, useMemo, useState } from 'react';

export type PostItem = {
  title: string;
  href: string;
  date: string;
  dateLabel: string;
  category: string;
  description: string;
};

const PAGE = 12;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Category chips + post list. Client-side filter, URL hash updates, works without JS by
// rendering every post. Twelve per page with "Older posts".
export default function InsightsFilter({ posts, categories }: { posts: PostItem[]; categories: readonly string[] }) {
  const [active, setActive] = useState<string>('All');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fromHash = () => {
      const h = decodeURIComponent(location.hash.replace('#', ''));
      const match = categories.find((c) => slug(c) === h);
      setActive(match ?? 'All');
      setPage(1);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [categories]);

  const choose = (c: string) => {
    setActive(c);
    setPage(1);
    const url = c === 'All' ? location.pathname : `#${slug(c)}`;
    history.replaceState(null, '', url);
  };

  const filtered = useMemo(() => (active === 'All' ? posts : posts.filter((p) => p.category === active)), [active, posts]);
  const shown = filtered.slice(0, page * PAGE);
  const more = filtered.length > shown.length;

  return (
    <div className="ins">
      <div className="ins__chips" role="group" aria-label="Filter by category">
        {['All', ...categories].map((c) => (
          <button
            key={c}
            type="button"
            className={`chip${active === c ? ' is-active' : ''}`}
            aria-pressed={active === c}
            onClick={() => choose(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? 'post' : 'posts'}
        {active !== 'All' ? ` in ${active}` : ''}
      </p>
      <div className="ins__list">
        {shown.map((p) => (
          <article className="post-card" key={p.href}>
            <span className="pill pill--tint">{p.category}</span>
            <h2 className="post-card__title">
              <a href={p.href}>{p.title}</a>
            </h2>
            <time className="post-card__date small" dateTime={p.date}>
              {p.dateLabel}
            </time>
            <p className="post-card__excerpt">{p.description}</p>
          </article>
        ))}
        {shown.length === 0 && <p className="ins__empty">Nothing in this category yet. The next post lands in two weeks.</p>}
      </div>
      {more && (
        <div className="ins__more">
          <button type="button" className="btn btn--secondary" onClick={() => setPage((p) => p + 1)}>
            <span className="btn__label">Older posts</span>
          </button>
        </div>
      )}
      <style>{css}</style>
    </div>
  );
}

const css = `
.ins__chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: var(--s-4); }
.chip { min-height: 44px; padding: 0 16px; border-radius: var(--r-pill); border: 1.5px solid var(--line); background: var(--paper); color: var(--navy); font: inherit; font-size: var(--fs-small); font-weight: 600; cursor: pointer; transition: background-color var(--t-hover) var(--ease-out), border-color var(--t-hover) var(--ease-out); }
.chip:hover { background: var(--sky-050); }
.chip.is-active { background: var(--navy); border-color: var(--navy); color: var(--paper); }
.ins__list { display: grid; gap: var(--s-3); }
.ins__empty { color: var(--ink-600); }
.ins__more { margin-top: var(--s-4); }
`;
