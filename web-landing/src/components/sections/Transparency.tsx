'use client';

import * as React from 'react';
import { Box, Chip, Slider, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Section from '@/components/ui/Section';
import Reveal from '@/components/motion/Reveal';
import AnimatedNumber from '@/components/ui/AnimatedNumber';
import { brandVoice } from '@/lib/brand';
import { brand } from '@/theme/tokens';

/**
 * Transparency in action.
 *
 * These are conceptual interface previews illustrating the *format* of the
 * information Drayvo shares - not screenshots, and not company performance.
 * Every figure below is an illustrative example and is labelled as such in the
 * UI itself, not merely in a comment, so it cannot be mistaken for a claim.
 *
 * TODO(verify): replace with real (anonymized) settlement and reporting views
 * once the owner portal is live and a driver has consented to sharing one.
 * When that happens, keep the "example" labelling unless the figures are the
 * company's own verified numbers.
 */
/**
 * Rates driving the interactive settlement below.
 *
 * TODO(verify): these are placeholder figures used to demonstrate the *format*
 * of a Drayvo settlement, not an offer. Replace with the confirmed rate card
 * before launch, and keep the "Example" labelling until the numbers are real.
 * Pay figures in driver recruiting are regulated advertising.
 */
const RATE_CARD = {
  perMile: 0.62,
  detentionPerHour: 25,
  weeklyInsurance: 42,
  weeklyEscrow: 150,
};

const OWNER_ROWS = [
  { truck: 'Unit 104', revenue: '8,420', cost: '3,180', status: 'In service', tone: 'ok' as const },
  { truck: 'Unit 107', revenue: '7,905', cost: '2,940', status: 'In service', tone: 'ok' as const },
  {
    truck: 'Unit 112',
    revenue: '2,310',
    cost: '4,110',
    status: 'In shop - 3 days',
    tone: 'warn' as const,
  },
];

export default function Transparency() {
  return (
    <Section tone="contrast">
      <Box sx={{ maxWidth: 720 }}>
        <Reveal>
          <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 2 }}>
            Transparency in action
          </Typography>
        </Reveal>
        <Reveal delay={0.06}>
          <Typography variant="h2" sx={{ color: 'text.primary' }}>
            What &ldquo;open book&rdquo; actually looks like
          </Typography>
        </Reveal>
        <Reveal delay={0.09}>
          <Typography
            sx={{
              mt: 2,
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: { xs: '1.05rem', md: '1.2rem' },
              letterSpacing: '-0.012em',
              color: 'primary.main',
            }}
          >
            {brandVoice.transparency}
          </Typography>
        </Reveal>
        <Reveal delay={0.12}>
          <Typography sx={{ color: 'text.secondary', mt: 2.5, fontSize: '1.05rem' }}>
            Transparency is a claim until you can see the format it arrives in. This is what drivers
            and truck owners get from us, and how plainly it is stated.
          </Typography>
        </Reveal>
      </Box>

      <Box
        sx={{
          mt: { xs: 5, md: 8 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: { xs: 3, lg: 4 },
          alignItems: 'start',
        }}
      >
        <Reveal>
          <Panel
            kicker="Driver settlement"
            title="A week, itemized"
            caption="Move the sliders. Every line named, every deduction explained, and the arithmetic shown rather than summarised."
          >
            <SettlementEstimator />
          </Panel>
        </Reveal>

        <Reveal delay={0.08}>
          <Panel
            kicker="Owner reporting"
            title="Fleet view - month to date"
            caption="Revenue and cost per truck, with downtime shown rather than absorbed."
          >
            <Box
              component="table"
              sx={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}
            >
              <Box component="thead">
                <Box component="tr">
                  {['Truck', 'Revenue', 'Cost', 'Status'].map((h, i) => (
                    <Box
                      key={h}
                      component="th"
                      scope="col"
                      sx={{
                        textAlign: i === 0 || i === 3 ? 'left' : 'right',
                        pb: 1.25,
                        borderBottom: '1px solid',
                        borderColor: 'var(--hairline)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'text.secondary',
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {OWNER_ROWS.map((r) => (
                  <Box component="tr" key={r.truck}>
                    <Box component="td" sx={cell}>
                      <Typography
                        sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}
                      >
                        {r.truck}
                      </Typography>
                    </Box>
                    <Box component="td" sx={{ ...cell, textAlign: 'right' }}>
                      <Mono>{r.revenue}</Mono>
                    </Box>
                    <Box component="td" sx={{ ...cell, textAlign: 'right' }}>
                      <Mono muted>{r.cost}</Mono>
                    </Box>
                    <Box component="td" sx={cell}>
                      <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                        <Box
                          aria-hidden
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            flexShrink: 0,
                            bgcolor: r.tone === 'ok' ? 'success.main' : 'primary.main',
                          }}
                        />
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>
                          {r.status}
                        </Typography>
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box
              sx={{
                mt: 2.5,
                p: 2,
                borderRadius: 1,
                bgcolor: alpha(brand.orange, 0.08),
                border: '1px solid',
                borderColor: alpha(brand.orange, 0.3),
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                Unit 112 - brake service, day 3
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
              >
                Parts delayed. Estimated return to service Thursday. You would have had this update
                the day the truck came out of service, not at month end.
              </Typography>
            </Box>
          </Panel>
        </Reveal>
      </Box>
    </Section>
  );
}

const cell = {
  py: 1.4,
  borderBottom: '1px solid',
  borderColor: 'var(--hairline)',
} as const;

function Mono({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <Typography
      component="span"
      sx={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.86rem',
        fontWeight: 600,
        color: muted ? 'text.secondary' : 'text.primary',
      }}
    >
      {children}
    </Typography>
  );
}

/**
 * Wrapper that guarantees the illustrative label travels with the preview —
 * the badge is part of the component, so a panel cannot be reused without it.
 */
function Panel({
  kicker,
  title,
  caption,
  children,
}: {
  kicker: string;
  title: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: 'var(--hairline)',
        bgcolor: 'var(--surface-panel)',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1.5,
          px: { xs: 2.5, md: 3 },
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'var(--hairline)',
          bgcolor: 'var(--surface-panel-raised)',
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>
            {kicker}
          </Typography>
          <Typography
            component="h3"
            sx={{ color: 'text.primary', fontWeight: 700, fontSize: '1.05rem' }}
          >
            {title}
          </Typography>
        </Box>
        <Chip
          label="Example"
          size="small"
          sx={{
            bgcolor: 'action.hover',
            color: 'text.secondary',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            border: '1px solid',
            borderColor: 'var(--hairline)',
          }}
        />
      </Stack>

      <Box sx={{ px: { xs: 2.5, md: 3 }, py: { xs: 2.5, md: 3 } }}>{children}</Box>

      <Box sx={{ px: { xs: 2.5, md: 3 }, pb: 3 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {caption}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', display: 'block', mt: 1, fontStyle: 'italic' }}
        >
          Illustrative example of report format. Figures are not Drayvo operating results.
        </Typography>
      </Box>
    </Box>
  );
}

/**
 * Interactive settlement. The driver sets the week; the lines recalculate and
 * the total counts to its new value.
 *
 * This is the section doing the most work on the whole site: "we show our work"
 * is a claim until someone can move a slider and watch the arithmetic hold.
 */
function SettlementEstimator() {
  const [miles, setMiles] = React.useState(2600);
  const [detention, setDetention] = React.useState(2);
  const [advance, setAdvance] = React.useState(400);

  const linehaul = miles * RATE_CARD.perMile;
  const detentionPay = detention * RATE_CARD.detentionPerHour;
  const gross = linehaul + detentionPay;
  const deductions = advance + RATE_CARD.weeklyInsurance + RATE_CARD.weeklyEscrow;
  const net = gross - deductions;

  const lines = [
    {
      label: 'Linehaul',
      detail: `${miles.toLocaleString('en-US')} mi @ $${RATE_CARD.perMile.toFixed(2)}`,
      value: linehaul,
      positive: true,
    },
    {
      label: 'Detention',
      detail: `${detention} hr @ $${RATE_CARD.detentionPerHour}`,
      value: detentionPay,
      positive: true,
    },
    { label: 'Fuel advance', detail: 'Repaid this week', value: -advance, positive: false },
    {
      label: 'Occupational insurance',
      detail: 'Weekly',
      value: -RATE_CARD.weeklyInsurance,
      positive: false,
    },
    {
      label: 'Maintenance escrow',
      detail: 'Weekly',
      value: -RATE_CARD.weeklyEscrow,
      positive: false,
    },
  ];

  const CONTROLS = [
    {
      label: 'Miles this week',
      value: miles,
      set: setMiles,
      min: 1200,
      max: 3400,
      step: 50,
      format: (v: number) => v.toLocaleString('en-US'),
    },
    {
      label: 'Detention hours',
      value: detention,
      set: setDetention,
      min: 0,
      max: 10,
      step: 1,
      format: (v: number) => `${v} hr`,
    },
    {
      label: 'Fuel advance taken',
      value: advance,
      set: setAdvance,
      min: 0,
      max: 900,
      step: 50,
      format: (v: number) => `$${v}`,
    },
  ];

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 3 }}>
        {CONTROLS.map((c) => (
          <Box key={c.label}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {c.label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                {c.format(c.value)}
              </Typography>
            </Stack>
            <Slider
              value={c.value}
              min={c.min}
              max={c.max}
              step={c.step}
              onChange={(_, v) => c.set(v as number)}
              aria-label={c.label}
              valueLabelDisplay="off"
              sx={{
                mt: 0.5,
                py: 1.25,
                color: 'primary.main',
                '& .MuiSlider-rail': { bgcolor: 'var(--hairline)', opacity: 1 },
                '& .MuiSlider-thumb': {
                  width: 16,
                  height: 16,
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0 0 0 6px ${alpha(brand.orange, 0.18)}`,
                  },
                },
              }}
            />
          </Box>
        ))}
      </Stack>

      <Stack divider={<Box sx={{ height: '1px', bgcolor: 'var(--hairline)' }} />}>
        {lines.map((l) => (
          <Stack
            key={l.label}
            direction="row"
            sx={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 2, py: 1.2 }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                {l.label}
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                }}
              >
                {l.detail}
              </Typography>
            </Box>
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.86rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                color: l.positive ? 'text.primary' : 'text.secondary',
              }}
            >
              {l.positive ? '+ ' : '− '}
              <AnimatedNumber value={Math.abs(l.value)} />
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'baseline',
          mt: 2,
          pt: 2,
          borderTop: '2px solid',
          borderColor: alpha(brand.orange, 0.5),
        }}
      >
        <Box>
          <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>Net to driver</Typography>
          <Typography
            sx={{ color: 'text.secondary', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}
          >
            gross{' '}
            {gross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
            − deductions{' '}
            {deductions.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '1.3rem',
            color: 'primary.main',
          }}
        >
          <AnimatedNumber value={net} prefix="$" />
        </Typography>
      </Stack>
    </Box>
  );
}
