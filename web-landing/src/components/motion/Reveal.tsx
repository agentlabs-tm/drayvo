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

/** Scroll-triggered fade + rise. Respects prefers-reduced-motion. */
export default function Reveal({ delay = 0, y = 28, once = true, children, ...rest }: Props) {
  const reduce = useReducedMotion();

  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y, filter: reduce ? 'none' : 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] },
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
