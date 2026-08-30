'use client';

import * as React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import Box, { type BoxProps } from '@mui/material/Box';

/**
 * MUI Box driven by framer-motion. The cast keeps motion's animation props
 * (initial/animate/variants/…) usable alongside Box's sx without fighting
 * MUI's overloaded polymorphic types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion.create(Box) as React.ComponentType<any>;

type Props = BoxProps & {
  delay?: number;
  y?: number;
  once?: boolean;
  children: React.ReactNode;
};

/**
 * True on phones and tablets. Animating `filter: blur()` forces a full repaint
 * of the element every frame, and the page runs roughly forty Reveals; on a
 * mid-range Android that is the difference between a smooth scroll and a
 * stuttering one. The blur is a refinement, so it is dropped there and the
 * fade + rise - which composite on the GPU - carry the effect alone.
 *
 * `useSyncExternalStore` rather than state-in-an-effect: the media query is an
 * external store, and this form gives a defined server snapshot (`false`, the
 * full-fidelity variant) instead of a render-then-correct flash.
 */
const FULL_FIDELITY = '(min-width: 900px) and (pointer: fine)';

const subscribe = (onChange: () => void) => {
  const mq = window.matchMedia(FULL_FIDELITY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
};

function useLightweightReveal() {
  return React.useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(FULL_FIDELITY).matches,
    () => false,
  );
}

/** Scroll-triggered fade + rise. Respects prefers-reduced-motion. */
export default function Reveal({ delay = 0, y = 28, once = true, children, ...rest }: Props) {
  const reduce = useReducedMotion();
  const light = useLightweightReveal();
  const blur = !reduce && !light;

  const variants: Variants = {
    hidden: {
      opacity: 0,
      // Shorter travel on small screens: 28px of rise is a large proportion of
      // a phone card's height and reads as a lurch rather than a settle.
      y: reduce ? 0 : light ? Math.min(y, 16) : y,
      /**
       * `filter` must appear in BOTH variants, always. Omitting the key from
       * one of them leaves the property under no one's control: the media
       * query resolves after hydration, so an element can be given
       * `blur(6px)` by `hidden` on the first render and then transition to a
       * `show` that never mentions `filter` - leaving it permanently blurred.
       */
      filter: blur ? 'blur(6px)' : 'blur(0px)',
    },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: light ? 0.55 : 0.75, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <MotionBox
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.25 }}
      variants={variants}
      {...(rest as BoxProps)}
    >
      {children}
    </MotionBox>
  );
}

/** Parent that staggers Reveal-like children using the same variant names. */
export function RevealGroup({
  stagger = 0.09,
  children,
  ...rest
}: BoxProps & { stagger?: number; children: React.ReactNode }) {
  return (
    <MotionBox
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      {...(rest as BoxProps)}
    >
      {children}
    </MotionBox>
  );
}

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export const MotionDiv = MotionBox;
