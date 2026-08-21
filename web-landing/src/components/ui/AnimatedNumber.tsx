'use client';

import * as React from 'react';
import { animate, useReducedMotion } from 'framer-motion';
import Box from '@mui/material/Box';

/**
 * Odometer-style number that eases to its target whenever the value changes.
 * Tabular numerals keep the digits from shifting width mid-animation.
 */
export default function AnimatedNumber({
  value,
  decimals = 2,
  prefix = '',
  duration = 0.5,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const previous = React.useRef(value);
  const reduce = useReducedMotion();

  const format = React.useCallback(
    (v: number) =>
      prefix +
      v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
    [prefix, decimals],
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduce) {
      el.textContent = format(value);
      previous.current = value;
      return;
    }

    const controls = animate(previous.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    previous.current = value;
    return () => controls.stop();
  }, [value, duration, reduce, format]);

  return (
    <Box component="span" ref={ref} sx={{ fontVariantNumeric: 'tabular-nums' }}>
      {format(value)}
    </Box>
  );
}
