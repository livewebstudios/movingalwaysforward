import { useEffect, useId, useRef, useState } from 'react';

type Item = { label: string; href: string; children?: { label: string; href: string }[] };

// Mobile menu (motion kit #8): slides down 240ms, items stagger 40ms. Closes on ESC, on
// navigation, and when the viewport grows past the desktop breakpoint.
export default function MobileNav({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        close();
        buttonRef.current?.focus();
      }
    };
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => mq.matches && close();
    document.addEventListener('astro:after-swap', close);
    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    document.documentElement.classList.toggle('nav-open', open);
    return () => {
      document.removeEventListener('astro:after-swap', close);
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
      document.documentElement.classList.remove('nav-open');
    };
  }, [open]);

  return (
    <div className="mnav">
      <button
        ref={buttonRef}
        type="button"
        className="mnav__toggle"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mnav__bars" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </button>
      <div id={id} ref={panelRef} className="mnav__panel" hidden={!open}>
        <nav aria-label="Mobile">
          <ul className="mnav__list">
            {items.map((item, i) => (
              <li key={item.href} className="mnav__item" style={{ '--i': i } as React.CSSProperties}>
                {item.children ? (
                  <>
                    <span className="mnav__group">{item.label}</span>
                    <ul className="mnav__sub">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <a href={c.href}>{c.label.toUpperCase()}</a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <a className="mnav__link" href={item.href}>
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <style>{css}</style>
    </div>
  );
}

const css = `
.mnav { display: block; }
.mnav__toggle { display: inline-grid; place-items: center; width: 44px; height: 44px; border: 0; background: none; cursor: pointer; border-radius: var(--r-md); color: var(--navy); }
.mnav__bars { display: grid; gap: 5px; width: 22px; }
.mnav__bars span { display: block; height: 2px; background: currentColor; border-radius: 2px; transition: transform 240ms var(--ease-out), opacity 240ms var(--ease-out); transform-origin: center; }
.mnav__toggle[aria-expanded="true"] .mnav__bars span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.mnav__toggle[aria-expanded="true"] .mnav__bars span:nth-child(2) { opacity: 0; }
.mnav__toggle[aria-expanded="true"] .mnav__bars span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
.mnav__panel { position: absolute; left: 0; right: 0; top: 100%; background: var(--paper); border-bottom: 1px solid var(--line); box-shadow: var(--shadow-2); padding: var(--s-2) var(--gutter) var(--s-4); max-height: calc(100vh - 64px); overflow-y: auto; animation: mnav-in 240ms var(--ease-out); }
@keyframes mnav-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
.mnav__list, .mnav__sub { list-style: none; margin: 0; padding: 0; }
.mnav__item { opacity: 0; transform: translateY(6px); animation: mnav-item 240ms var(--ease-out) forwards; animation-delay: calc(60ms + var(--i) * 40ms); }
@keyframes mnav-item { to { opacity: 1; transform: none; } }
.mnav__link, .mnav__sub a { display: flex; align-items: center; min-height: 48px; padding: 0 var(--s-1); font-size: 0.875rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--navy); text-decoration: none; border-bottom: 1px solid var(--line); }
.mnav__link:hover, .mnav__sub a:hover { background: var(--sky-050); }
.mnav__group { display: block; padding: var(--s-2) var(--s-1) 4px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-600); }
.mnav__sub a { padding-left: var(--s-3); font-weight: 600; }
.mnav__sub a::before { content: ''; width: 10px; height: 2px; background: var(--sky); margin-right: 10px; }
@media (min-width: 1024px) { .mnav { display: none; } }
@media (prefers-reduced-motion: reduce) { .mnav__panel, .mnav__item { animation: none; opacity: 1; transform: none; } .mnav__bars span { transition: none; } }
`;
