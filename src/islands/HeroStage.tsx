import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  LazyMotion,
  domAnimation,
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import type { ObjSrc, PhotoSrc } from '../lib/images';
import { depth as depthMap, floatStyles, parallaxCap, settle, settled } from '../motion/variants';

export type HeroObjects = {
  flag: ObjSrc;
  notebook: ObjSrc;
  stones: ObjSrc;
  plane: ObjSrc;
};

type Props = {
  objects: HeroObjects;
  photo: PhotoSrc;
  children?: ReactNode;
  backdrop?: ReactNode;
};

type Layer = 'far' | 'mid' | 'near' | 'nearest';

// Placement from 03_layout_and_components.md: percentages of the container, resting rotation,
// depth layer, pixel size. Settle order: flag, notebook, stones, plane.
// The compass and speech bubbles were removed from the hero (Jon 26_11_11).
const PLACE: { key: keyof HeroObjects; cls: string; r: number; layer: Layer; size: number; tilt: number }[] = [
  { key: 'flag', cls: 'flag', r: 8, layer: 'near', size: 140, tilt: 6 },
  { key: 'notebook', cls: 'notebook', r: -12, layer: 'mid', size: 200, tilt: 3 },
  { key: 'stones', cls: 'stones', r: 6, layer: 'mid', size: 220, tilt: 3 },
  { key: 'plane', cls: 'plane', r: -14, layer: 'nearest', size: 120, tilt: 8 },
];

const SESSION_KEY = 'af-hero-settled';

export default function HeroStage({ objects, photo, children, backdrop }: Props) {
  const reduced = useReducedMotion() ?? false;
  const boxRef = useRef<HTMLDivElement>(null);
  const [skipSettle, setSkipSettle] = useState(false);
  const [floating, setFloating] = useState(false);
  const [inView, setInView] = useState(true);
  const [pointerOk, setPointerOk] = useState(false);
  const [mobile, setMobile] = useState(false);

  // Objects do not re-settle when returning to Home within a session (#10).
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY)) setSkipSettle(true);
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* storage unavailable: settle anyway */
    }
    setPointerOk(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    const mq = window.matchMedia('(max-width: 767px)');
    const onMq = () => setMobile(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  // will-change only while the hero is in view.
  useEffect(() => {
    const el = boxRef.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Parallax (#4): three depth layers driven by the hero's own scroll progress, capped.
  const { scrollYProgress } = useScroll({ target: boxRef, offset: ['start start', 'end start'] });
  const cap = mobile ? parallaxCap.mobile : parallaxCap.desktop;
  const travel = (k: number) => (reduced ? 0 : Math.max(-cap, Math.min(cap, k * cap * 2.2)));
  const yFar = useTransform(scrollYProgress, [0, 1], [0, travel(depthMap.far)]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, travel(depthMap.mid)]);
  const yNear = useTransform(scrollYProgress, [0, 1], [0, travel(depthMap.near)]);
  const yNearest = useTransform(scrollYProgress, [0, 1], [0, travel(depthMap.nearest)]);
  const layerY: Record<Layer, MotionValue<number>> = { far: yFar, mid: yMid, near: yNear, nearest: yNearest };

  // Tilt (#5): pointer only. Max 6° on the group; each object nudges opposite the pointer by depth.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 90, damping: 18, mass: 0.6 };
  const rotX = useSpring(useTransform(py, [-1, 1], [6, -6]), spring);
  const rotY = useSpring(useTransform(px, [-1, 1], [-6, 6]), spring);
  const tiltOn = pointerOk && !reduced && !mobile;

  const onMove = (e: React.PointerEvent) => {
    if (!tiltOn || !boxRef.current || e.pointerType !== 'mouse') return;
    const r = boxRef.current.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width) * 2 - 1);
    py.set(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const settledCount = useRef(0);
  const onSettled = () => {
    settledCount.current += 1;
    if (settledCount.current >= PLACE.length) setFloating(true);
  };
  const instant = reduced || skipSettle;

  return (
    <LazyMotion features={domAnimation} strict>
      <section className="hero" aria-labelledby="hero-title">
        <div
          ref={boxRef}
          className={`hero__box dots${inView ? ' is-inview' : ''}`}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <m.div className="hero__bg" style={{ y: yFar }}>
            {backdrop}
          </m.div>

          <m.div
            className="hero__objects"
            style={tiltOn ? { rotateX: rotX, rotateY: rotY, transformPerspective: 1200 } : undefined}
            aria-hidden="true"
          >
            {PLACE.map((p, i) => (
              <HeroObject
                key={p.key}
                src={objects[p.key]}
                place={p}
                index={i}
                y={layerY[p.layer]}
                px={px}
                py={py}
                tiltOn={tiltOn}
                instant={instant}
                floating={floating || instant}
                onSettled={onSettled}
              />
            ))}
          </m.div>

          <div className="hero__stack">{children}</div>

          <div className="hero__cards">
            <m.a
              className="hcard hcard--photo"
              href="/corporate-training/"
              style={{ y: yMid }}
              whileHover={reduced ? undefined : { y: -4 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src={photo.src}
                srcSet={photo.srcset}
                sizes="(max-width: 767px) 260px, 320px"
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <span className="hcard__caption">Early-talent workshop · Bergen County</span>
            </m.a>

            <m.a
              className="hcard hcard--plan"
              href="/early-career-coaching/"
              style={{ y: yMid }}
              whileHover={reduced ? undefined : { y: -4 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="hcard__title">Your first session</span>
              <ul className="checklist hcard__list">
                <li>Where you actually are</li>
                <li>A written plan</li>
                <li>The reps</li>
              </ul>
              <span className="hcard__foot">$75 · 60 minutes</span>
            </m.a>
          </div>
        </div>
        <style>{css}</style>
      </section>
    </LazyMotion>
  );
}

function HeroObject({
  src,
  place,
  index,
  y,
  px,
  py,
  tiltOn,
  instant,
  floating,
  onSettled,
}: {
  src: ObjSrc;
  place: (typeof PLACE)[number];
  index: number;
  y: MotionValue<number>;
  px: MotionValue<number>;
  py: MotionValue<number>;
  tiltOn: boolean;
  instant: boolean;
  floating: boolean;
  onSettled: () => void;
}) {
  const nudge = place.tilt;
  const tx = useTransform(px, [-1, 1], [nudge, -nudge]);
  const ty = useTransform(py, [-1, 1], [nudge, -nudge]);
  return (
    <m.div className={`hobj hobj--${place.cls}`} style={{ y }}>
      <m.div style={tiltOn ? { x: tx, y: ty } : undefined}>
        <m.div
          variants={instant ? undefined : settle(place.r, index)}
          initial={instant ? settled(place.r) : 'hidden'}
          animate={instant ? settled(place.r) : 'show'}
          onAnimationComplete={instant ? undefined : onSettled}
        >
          <div className={floating ? 'hobj__float float' : 'hobj__float'} style={floatStyles(index)}>
            <picture>
              <source type="image/webp" srcSet={src.webp} />
              <img src={src.png} width={place.size} height={place.size} alt="" loading="eager" decoding="async" />
            </picture>
          </div>
        </m.div>
      </m.div>
    </m.div>
  );
}

const css = `
.hero { padding: 0 var(--s-2) var(--s-8); }
.hero__box { position: relative; isolation: isolate; border-radius: var(--r-xl); background-color: var(--mist); overflow: visible; padding: var(--s-6) var(--gutter) var(--s-6); min-height: 70vh; display: grid; align-content: center; }
.hero__box::before { content: ''; position: absolute; inset: 0; border-radius: inherit; background: inherit; z-index: -2; }
.hero__bg { position: absolute; inset: 0; border-radius: inherit; overflow: hidden; z-index: -1; opacity: .8; }
.hero__objects { position: absolute; inset: 0; pointer-events: none; z-index: 1; transform-style: preserve-3d; }
.hobj { position: absolute; }
.hero__box.is-inview .hobj__float { will-change: transform; }
.hobj img { width: 100%; height: auto; }
.hobj--flag { top: 10px; left: auto; right: 12px; width: 84px; }
.hobj--stones { top: auto; bottom: -28px; left: 6px; width: 90px; z-index: 4; }
.hobj--notebook, .hobj--plane { display: none; }
.hero__stack { position: relative; z-index: 2; display: grid; justify-items: center; text-align: center; gap: var(--s-3); max-width: 760px; margin: 0 auto; }
.hero__stack h1 { margin: 0; }
.hero__stack .lede { font-size: 1.125rem; text-align: center; max-width: 56ch; }
.hero__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: var(--s-2); }
.hero__cards { position: absolute; z-index: 3; left: 0; right: 0; bottom: -40px; display: flex; justify-content: center; gap: var(--s-2); padding: 0 var(--gutter); }
.hcard { display: block; background: var(--paper); border-radius: var(--r-lg); box-shadow: var(--shadow-2); color: var(--ink); text-decoration: none; overflow: hidden; }
.hcard--photo { width: 260px; transform: rotate(-6deg); }
.hcard--photo img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; display: block; }
.hcard__caption { display: block; padding: 10px 14px; font-size: var(--fs-small); font-weight: 600; color: var(--navy); border-top: 1px solid var(--line); }
.hcard--plan { width: 240px; padding: var(--s-2) var(--s-3); transform: rotate(4deg); display: grid; gap: 10px; }
.hcard__title { font-family: var(--font-display); font-weight: 600; font-size: 1.125rem; color: var(--navy); }
.hcard__list li { margin-bottom: 6px; font-size: var(--fs-small); }
.hcard__foot { display: block; padding-top: 10px; border-top: 1px solid var(--line); font-family: var(--font-display); font-weight: 800; color: var(--navy); }
@media (max-width: 767px) {
  .hero__cards { flex-direction: column; align-items: center; position: static; margin-top: var(--s-6); gap: var(--s-4); }
  .hero__box { padding-top: 104px; padding-bottom: 72px; }
  .hero__stack .eyebrow { font-size: 0.6875rem; letter-spacing: 0.1em; padding-right: calc(14px - 0.1em); text-align: center; justify-content: center; }
  .hcard--photo { transform: rotate(-3deg); }
  .hcard--plan { transform: rotate(2deg); }
}
@media (min-width: 768px) {
  .hero { padding: 0 var(--s-3) calc(var(--s-8) + 40px); }
  .hero__box { min-height: 88vh; padding: var(--s-8) var(--s-6) 260px; }
  .hobj--flag { top: 8%; left: 12%; right: auto; width: 140px; }
  .hobj--notebook { display: block; top: 72%; left: 6%; bottom: auto; width: 200px; }
  .hobj--stones { display: block; top: 70%; left: 84%; bottom: auto; width: 220px; margin-left: -110px; }
  .hero__cards { bottom: -56px; gap: var(--s-4); }
  .hcard--photo { width: 320px; }
  .hcard--plan { width: 300px; padding: var(--s-3) var(--s-4); }
}
@media (min-width: 1100px) {
  .hobj--plane { display: block; top: 30%; left: 78%; width: 120px; }
}
@media (prefers-reduced-motion: reduce) { .hcard { transform: none !important; } }

/* Page-load entrance (after Aceternity's AI-visibility hero): things start transparent,
   blurred 10px and 12px low, then resolve in place. Headline words also grow from 0.9 and
   open from the center outward (--rank 0 = middle words). Uses the standalone translate and
   scale properties so it never fights the Motion transforms on the cards and objects.
   Pure CSS, so it plays even before React hydrates. */
@keyframes hero-in {
  from { opacity: 0; filter: blur(10px); translate: 0 12px; }
  to { opacity: 1; filter: blur(0); translate: 0 0; }
}
@keyframes hero-word-in {
  from { opacity: 0; filter: blur(10px); translate: 0 12px; scale: 0.9; }
  to { opacity: 1; filter: blur(0); translate: 0 0; scale: 1; }
}
@keyframes hero-rise {
  from { opacity: 0; translate: 0 24px; }
  to { opacity: 1; translate: 0 0; }
}
/* Astro wraps the slotted hero copy in <astro-slot>, so target by class, not by child. */
.hero__stack .eyebrow, .hero__stack .lede, .hero__stack .hero__actions { animation: hero-in 800ms cubic-bezier(0.22, 1, 0.36, 1) both; }
/* --d is set per word by the script in index.astro (distance from the headline's lower
   center); --rank (sentence-order fallback) only applies if that script never runs. */
.hero__stack .hw { display: inline-block; transform-origin: 50% 60%; animation: hero-word-in 900ms cubic-bezier(0.22, 1, 0.36, 1) both; animation-delay: var(--d, calc(140ms + var(--rank, 0) * 110ms)); }
.hero__stack h1.is-measuring .hw { animation-play-state: paused; }
.hero__stack .lede { animation-delay: 600ms; }
.hero__stack .hero__actions { animation-delay: 720ms; }
.hero__cards { animation: hero-rise 900ms cubic-bezier(0.22, 1, 0.36, 1) 860ms both; }
@media (prefers-reduced-motion: reduce) {
  .hero__stack .eyebrow, .hero__stack .lede, .hero__stack .hero__actions, .hero__stack .hw, .hero__cards { animation: none; }
}
`;
