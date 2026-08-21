'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { brand } from '@/theme/tokens';

/**
 * The road: an asphalt ribbon with edge lines and a dashed centre line, running
 * off both sides of the frame, carrying a continuous convoy of tractor units.
 *
 * Built as stacked strokes on one path rather than as separate shapes — the
 * widest stroke is the shoulder, a narrower one on top is the asphalt, and a
 * dashed stroke above that is the centre line. Stacking means the whole road
 * follows the curve automatically, and the same path drives the convoy.
 *
 * The path deliberately starts and ends outside the viewBox so the road has no
 * visible ends: units drive in from off-frame and leave the same way, which is
 * what stops it reading as a line floating in empty space.
 *
 * Under prefers-reduced-motion the road renders complete with units parked on
 * it: same information, no movement.
 */

/** Runs from off-canvas left to off-canvas right. */
const PATH =
  'M -80 196 C 60 196, 120 96, 300 104 S 470 190, 610 132 S 800 52, 1040 74';

const STOPS = [
  { x: 300, y: 104, label: 'Pickup' },
  { x: 610, y: 132, label: 'Stop' },
  { x: 900, y: 70, label: 'Delivery' },
];

/** Seconds of *driving* for one unit to run the full road, stops excluded. */
const TRAVEL = 18;
/**
 * Share of each leg spent accelerating and braking. A trapezoidal profile —
 * pull away, cruise, slow into the stop — peaks at only 1/(1 - 2 * RAMP) of
 * its average speed, where a cubic ease peaks at 3x and made the runs between
 * stops read as far too fast.
 */
const RAMP = 0.28;
/** Seconds a unit waits at each stop before pulling away. */
const DWELL = 1.1;
/** Seconds for the road to draw in. */
const DRAW = 1.6;
const CONVOY = [0, 1];
const FADE = 0.04;

const SHOULDER = 34;
const ASPHALT = 28;

/**
 * Rig dimensions in path units, proportioned off a Cascadia sleeper pulling a
 * 53ft dry van (roughly 70ft nose to tail, 13'6" tall).
 * `TRACTOR_LEN` is bumper to fifth wheel; `TRAILER_LEN` is kingpin to rear.
 */
const TRACTOR_LEN = 32;
const TRAILER_LEN = 68;

/**
 * Roadside trees. Positions were checked against the carriageway rather than
 * placed by eye — every one clears the road plus its shoulder by at least 27
 * units, so nothing sits on the asphalt however the curve is read.
 *
 * `s` scales the tree; smaller ones sit further from the road to suggest depth
 * without needing a perspective system.
 */
const TREES = [
  { x: 60, y: 70, s: 1.0 }, { x: 120, y: 45, s: 0.72 }, { x: 28, y: 118, s: 0.85 },
  { x: 300, y: 34, s: 0.66 }, { x: 420, y: 58, s: 0.92 }, { x: 505, y: 52, s: 0.7 },
  { x: 560, y: 38, s: 0.6 }, { x: 690, y: 42, s: 0.88 }, { x: 880, y: 28, s: 0.64 },
  { x: 95, y: 205, s: 0.95 }, { x: 215, y: 197, s: 0.75 }, { x: 330, y: 192, s: 1.05 },
  { x: 655, y: 196, s: 0.8 }, { x: 760, y: 178, s: 1.0 }, { x: 845, y: 192, s: 0.7 },
  { x: 905, y: 170, s: 0.88 },
];

/**
 * Distance covered by fraction `x` of a leg under a trapezoidal velocity
 * profile: a linear ramp up over the first RAMP of the leg, a constant cruise
 * through the middle, and a matching ramp down into the stop. Returns 0..1.
 */
function legProgress(x: number) {
  const r = RAMP;
  const area = 1 - r; // total area under the velocity profile, for normalising
  let travelled: number;
  if (x < r) {
    travelled = (x * x) / (2 * r);
  } else if (x <= 1 - r) {
    travelled = r / 2 + (x - r);
  } else {
    const left = 1 - x;
    travelled = r / 2 + (1 - 2 * r) + (r / 2 - (left * left) / (2 * r));
  }
  return travelled / area;
}

type Leg = { kind: 'drive'; from: number; to: number; seconds: number } | { kind: 'wait'; at: number; seconds: number };

/**
 * Turns the stop coordinates into a drive/wait timeline along the path.
 *
 * The stops are authored as x/y points, so their position along the path is
 * recovered by sampling — that keeps the markers and the pauses in sync no
 * matter how the curve is edited later.
 */
function buildTimeline(path: SVGPathElement): { legs: Leg[]; cycle: number } {
  const total = path.getTotalLength();
  const SAMPLES = 600;

  const stopProgress = STOPS.map((s) => {
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i <= SAMPLES; i += 1) {
      const at = i / SAMPLES;
      const p = path.getPointAtLength(total * at);
      const d = (p.x - s.x) ** 2 + (p.y - s.y) ** 2;
      if (d < bestDist) {
        bestDist = d;
        best = at;
      }
    }
    return best;
  }).sort((a, b) => a - b);

  const legs: Leg[] = [];
  let cursor = 0;
  stopProgress.forEach((at) => {
    legs.push({ kind: 'drive', from: cursor, to: at, seconds: (at - cursor) * TRAVEL });
    legs.push({ kind: 'wait', at, seconds: DWELL });
    cursor = at;
  });
  legs.push({ kind: 'drive', from: cursor, to: 1, seconds: (1 - cursor) * TRAVEL });

  return { legs, cycle: legs.reduce((sum, l) => sum + l.seconds, 0) };
}

/** Position along the path at a given time within one cycle. */
function progressAt(legs: Leg[], time: number) {
  let remaining = time;
  for (const leg of legs) {
    if (remaining < leg.seconds) {
      if (leg.kind === 'wait') return leg.at;
      return leg.from + (leg.to - leg.from) * legProgress(remaining / leg.seconds);
    }
    remaining -= leg.seconds;
  }
  return 1;
}

export default function RouteGraphic() {
  const ref = React.useRef<HTMLDivElement>(null);
  const revealed = useInView(ref, { once: true, amount: 0.25 });
  const inView = useInView(ref, { amount: 0.1 });
  const reduce = useReducedMotion();

  const pathRef = React.useRef<SVGPathElement>(null);
  const tractorRefs = React.useRef<(SVGGElement | null)[]>([]);
  const trailerRefs = React.useRef<(SVGGElement | null)[]>([]);
  const originRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();

    const at = (distance: number) => path.getPointAtLength(Math.max(0, Math.min(total, distance)));
    const heading = (from: DOMPoint, to: DOMPoint) =>
      (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI;

    /**
     * True articulation: the tractor is placed nose-first and the trailer
     * pivots about the fifth wheel, each aligned to its own heading. A rig
     * this long drawn as one rigid body visibly cuts the corners on the
     * S-bends; hinging it at the kingpin is what a real trailer does.
     */
    const place = (index: number, progress: number, opacity: number) => {
      const tractor = tractorRefs.current[index];
      const trailer = trailerRefs.current[index];
      if (!tractor || !trailer) return;

      const nose = total * progress;
      const kingpinDist = nose - TRACTOR_LEN;
      const rearDist = kingpinDist - TRAILER_LEN;

      const nosePt = at(nose);
      const kingpinPt = at(kingpinDist);
      const rearPt = at(rearDist);

      tractor.setAttribute(
        'transform',
        `translate(${kingpinPt.x} ${kingpinPt.y}) rotate(${heading(kingpinPt, nosePt)})`,
      );
      trailer.setAttribute(
        'transform',
        `translate(${rearPt.x} ${rearPt.y}) rotate(${heading(rearPt, kingpinPt)})`,
      );
      tractor.setAttribute('opacity', String(opacity));
      trailer.setAttribute('opacity', String(opacity));
    };

    const { legs, cycle } = buildTimeline(path);

    // Parked at stops rather than mid-carriageway, so the still frame reads.
    if (reduce) {
      tractorRefs.current.forEach((_, i) => {
        const leg = legs.filter((l) => l.kind === 'wait')[i];
        if (leg && leg.kind === 'wait') place(i, leg.at, 1);
      });
      return;
    }
    if (!inView) return;

    if (originRef.current === null) originRef.current = performance.now();
    const origin = originRef.current;
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = (now - origin) / 1000;

      CONVOY.forEach((index, i) => {
        const since = elapsed - DRAW - (index * cycle) / CONVOY.length;
        if (since < 0) {
          place(i, 0, 0);
          return;
        }
        const progress = progressAt(legs, since % cycle);
        const opacity = Math.min(1, progress / FADE, (1 - progress) / FADE);
        place(i, progress, Math.max(0, opacity));
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduce]);

  const draw = {
    initial: { pathLength: reduce ? 1 : 0 },
    animate: { pathLength: reduce || revealed ? 1 : 0 },
    transition: { duration: reduce ? 0 : DRAW, ease: [0.4, 0, 0.2, 1] as const },
  };

  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        aspectRatio: { xs: '2 / 1', sm: '5 / 2', md: '940 / 218' },
        overflow: 'hidden',
      }}
    >
      <Box
        component="svg"
        viewBox="0 0 940 218"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="A road running from pickup through a stop to delivery, with trucks travelling it"
        sx={{ width: '100%', height: '100%', display: 'block' }}
      >
        {/* Scenery first, so the road always paints over it */}
        <motion.g
          initial={{ opacity: reduce ? 1 : 0 }}
          animate={{ opacity: reduce || revealed ? 1 : 0 }}
          transition={{ duration: 0.9, delay: reduce ? 0 : 0.15 }}
        >
          {TREES.map((tree) => (
            <Tree key={`${tree.x}-${tree.y}`} {...tree} />
          ))}
        </motion.g>

        {/* Shoulder — the outermost stroke reads as the road's edge lines */}
        <motion.path
          {...draw}
          d={PATH}
          fill="none"
          stroke="var(--road-edge)"
          strokeWidth={SHOULDER}
          strokeLinecap="butt"
        />

        {/* Asphalt */}
        <motion.path
          ref={pathRef}
          {...draw}
          d={PATH}
          fill="none"
          stroke="var(--road-surface)"
          strokeWidth={ASPHALT}
          strokeLinecap="butt"
        />

        {/* Progress overlay: the brand colour tracing the driven route */}
        <motion.path
          {...draw}
          d={PATH}
          fill="none"
          stroke={brand.orange}
          strokeWidth={ASPHALT}
          strokeLinecap="butt"
          opacity={0.09}
        />

        {/* Centre line */}
        <motion.path
          {...draw}
          d={PATH}
          fill="none"
          stroke="var(--road-line)"
          strokeWidth={2}
          strokeDasharray="16 22"
          strokeLinecap="butt"
        />

        {STOPS.map((s, i) => (
          <motion.g
            key={s.label}
            initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : -6 }}
            animate={{ opacity: reduce || revealed ? 1 : 0, y: 0 }}
            transition={{ delay: reduce ? 0 : 0.5 + i * 0.28, duration: 0.45 }}
          >
            {/* Stem from the marker down to the road */}
            <line x1={s.x} y1={s.y - 30} x2={s.x} y2={s.y} stroke={brand.orange} strokeWidth={1.5} opacity={0.55} />
            <circle cx={s.x} cy={s.y} r={4.5} fill={brand.orange} />
            <circle cx={s.x} cy={s.y} r={10} fill={brand.orange} opacity={0.16} />
            <text
              x={s.x}
              y={s.y - 40}
              textAnchor="middle"
              fill="currentColor"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}
            >
              {s.label}
            </text>
          </motion.g>
        ))}

        {CONVOY.map((index, i) => (
          <g key={index}>
            {/* Trailer first so the tractor's cab overlaps it at the hinge */}
            <g
              opacity={0}
              ref={(el) => {
                trailerRefs.current[i] = el;
              }}
            >
              <Trailer />
            </g>
            <g
              opacity={0}
              ref={(el) => {
                tractorRefs.current[i] = el;
              }}
            >
              <Tractor />
            </g>
          </g>
        ))}
      </Box>
    </Box>
  );
}

/**
 * Roadside tree. Two stacked canopy tiers over a short trunk — enough to read
 * as a conifer at this scale without tipping into clip-art, and desaturated so
 * it stays scenery rather than competing with the road or the brand orange.
 */
function Tree({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={0.55}>
      <rect x="-1.6" y="2" width="3.2" height="9" rx="1" fill="var(--scenery-trunk)" />
      <path d="M0 -22 L9 -2 H-9 Z" fill="var(--scenery-canopy)" />
      <path d="M0 -13 L11 5 H-11 Z" fill="var(--scenery-canopy)" />
    </g>
  );
}

/**
 * Freightliner-style sleeper tractor, side view, nose pointing +x.
 * Local origin sits at the fifth wheel, so the trailer pivots about (0,0).
 */
function Tractor() {
  return (
    <g transform="translate(0 1)">
      {/* frame rail */}
      <rect x="-2" y="1" width={TRACTOR_LEN + 2} height="3.4" fill="var(--truck-chassis)" />
      {/* fuel tank */}
      <rect x="13" y="0.5" width="7.5" height="4.6" rx="2.3" fill="var(--truck-rim)" />
      {/* sleeper box */}
      <path d="M3 2 V-9.4 Q3 -11 4.6 -11 H16.5 V2 Z" fill={brand.orange} />
      {/* roof fairing over the sleeper, sloping down to the cab */}
      <path d="M6 -11 Q13 -12.6 17.6 -9.6 L17.6 -7.4 L6 -8.6 Z" fill={brand.orange} opacity="0.92" />
      {/* cab */}
      <path d="M16.5 2 V-9.2 Q16.5 -10.4 17.8 -10.4 H21.4 L24.6 -4.6 V2 Z" fill={brand.orange} />
      {/* windshield */}
      <path d="M18.4 -9 H21 L23.5 -4.9 H18.4 Z" fill="var(--truck-glass)" />
      {/* door window */}
      <rect x="13.8" y="-8.6" width="3.4" height="3.6" rx="0.6" fill="var(--truck-glass)" />
      {/* hood, sloping toward the bumper */}
      <path d="M24.6 -4.6 L28 -3.4 Q31.6 -3 32 -0.6 V2 H24.6 Z" fill={brand.orange} />
      {/* grille + bumper */}
      <rect x="31" y="-1.6" width="1.7" height="4.4" rx="0.5" fill="var(--truck-chassis)" />
      {/* mirror */}
      <rect x="17.6" y="-9.6" width="0.8" height="3.2" rx="0.4" fill="var(--truck-chassis)" />
      {/* drive tandems and steer axle */}
      <Wheel cx={4.6} />
      <Wheel cx={10.4} />
      <Wheel cx={27.4} />
    </g>
  );
}

/** 53ft dry van. Local origin at the rear doors, kingpin at +TRAILER_LEN. */
function Trailer() {
  return (
    <g transform="translate(0 1)">
      {/* box */}
      <rect x="0" y="-12" width={TRAILER_LEN} height="14.4" rx="1.2" fill="var(--truck-body)" />
      {/* rear door seam and roof line */}
      <rect x="1.6" y="-11" width="0.9" height="12.4" fill="var(--truck-panel)" />
      <rect x="0" y="-12" width={TRAILER_LEN} height="1.4" fill="var(--truck-panel)" />
      {/* side skirt */}
      <rect x="15" y="2.4" width={TRAILER_LEN - 28} height="3" fill="var(--truck-panel)" />
      {/* landing gear */}
      <rect x={TRAILER_LEN - 15} y="2.4" width="1.6" height="4.6" fill="var(--truck-chassis)" />
      {/* rear bogie */}
      <Wheel cx={6} />
      <Wheel cx={11.8} />
    </g>
  );
}

function Wheel({ cx }: { cx: number }) {
  return (
    <g>
      <circle cx={cx} cy={6.2} r={4.4} fill="var(--truck-tire)" />
      <circle cx={cx} cy={6.2} r={1.9} fill="var(--truck-rim)" />
    </g>
  );
}
