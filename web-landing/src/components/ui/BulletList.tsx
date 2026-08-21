'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

/**
 * Bulleted list with the dot optically centred on the first line of its text.
 *
 * The dot's alignment is derived rather than hand-tuned: its container is one
 * line box tall (`LINE_HEIGHT` em, matching the `body2` line-height in the
 * theme) and centres the dot inside it. That keeps the dot correct when the
 * text wraps to two lines and when the font size changes across breakpoints —
 * a fixed pixel offset drifts in both cases.
 */
const LINE_HEIGHT = 1.65;
const DOT = 5;

export default function BulletList({
  items,
  columns,
  color = 'text.secondary',
  marker = 'dot',
  gap = 1.25,
}: {
  items: readonly string[];
  /** Responsive column counts, e.g. `{ xs: 1, sm: 2 }`. Defaults to one column. */
  columns?: Record<string, number>;
  color?: string;
  /** `dot` for requirement lists, `check` for benefit lists. */
  marker?: 'dot' | 'check';
  gap?: number;
}) {
  const gridTemplateColumns = columns
    ? Object.fromEntries(
        Object.entries(columns).map(([bp, n]) => [bp, `repeat(${n}, minmax(0, 1fr))`]),
      )
    : undefined;

  return (
    <Box
      component="ul"
      sx={{
        listStyle: 'none',
        p: 0,
        m: 0,
        display: 'grid',
        gap,
        ...(gridTemplateColumns ? { gridTemplateColumns } : {}),
      }}
    >
      {items.map((item) => (
        <Box
          component="li"
          key={item}
          sx={{ display: 'flex', alignItems: 'flex-start', gap: marker === 'check' ? 1.5 : 1.25, minWidth: 0 }}
        >
          <Box
            aria-hidden
            sx={{
              flexShrink: 0,
              height: `${LINE_HEIGHT}em`,
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {marker === 'check' ? (
              <CheckRoundedIcon sx={{ fontSize: 19, color: 'primary.main', display: 'block' }} />
            ) : (
              <Box sx={{ width: DOT, height: DOT, borderRadius: '50%', bgcolor: 'primary.main' }} />
            )}
          </Box>
          <Typography variant="body2" sx={{ color, minWidth: 0 }}>
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
