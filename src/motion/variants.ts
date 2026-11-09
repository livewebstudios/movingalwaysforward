// The motion kit (docs/02_motion_system.md) as named exports for the React islands.
// Durations in seconds for `motion`. CSS keeps the same values as custom properties.
import type { Variants, Transition } from 'motion/react';

export const easeOut = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.65, 0, 0.35, 1] as const;

export const durations = {
  hover: 0.16,
  small: 0.36,
  section: 0.64,
  settle: 0.9,
} as const;

/** #1 Reveal: once, when 20% of the element is in view. Children stagger 80ms, max six. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: durations.section, ease: easeOut } },
};

export const revealGroup: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const viewportOnce = { once: true, amount: 0.2 } as const;

/** #2 Settle: hero objects on load. `r` is the resting rotation, `i` the stagger index. */
export const settle = (r: number, i: number): Variants => ({
  hidden: { opacity: 0, y: 40, rotate: r + 6, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    rotate: r,
    scale: 1,
    transition: { duration: durations.settle, ease: easeOut, delay: i * 0.12 },
  },
});

/** Instant resting state for reduced motion or a return visit. */
export const settled = (r: number) => ({ opacity: 1, y: 0, rotate: r, scale: 1 });

/** #3 Float: CSS variables for the wrapper's keyframe loop. Each object gets its own period and phase. */
export const floatStyles = (i: number) => {
  const periods = [9, 11, 7.5, 10, 8, 9.5, 7, 10.5];
  const ys = [-8, -10, -6, -9, -7, -8, -6, -10];
  const rs = [1.5, -1.2, 1, -1.5, 1.2, -1, 1.4, -1.3];
  return {
    '--float-d': `${periods[i % periods.length]}s`,
    '--float-y': `${ys[i % ys.length]}px`,
    '--float-r': `${rs[i % rs.length]}deg`,
    '--float-delay': `${-(i * 1.7)}s`,
  } as React.CSSProperties;
};

/** #4 Parallax depth: multiplier of scroll travel. Positive moves slower than scroll, negative moves faster (lifts away). */
export const depth = {
  far: 0.15,
  mid: 0.08,
  near: -0.2,
  nearest: -0.35,
} as const;

export const parallaxCap = { desktop: 120, mobile: 48 } as const;

/** #6 Hover lift for clickable cards. */
export const lift: Transition = { duration: durations.hover, ease: easeOut };

export const cardHover = { y: -4, transition: lift };
