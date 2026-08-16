'use client';

import { Box, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Section from '@/components/ui/Section';
import Reveal from '@/components/motion/Reveal';
import { brand } from '@/theme/tokens';

/**
 * Transparency in action.
 *
 * These are conceptual interface previews illustrating the *format* of the
 * information Drayvo shares — not screenshots, and not company performance.
 * Every figure below is an illustrative example and is labelled as such in the
 * UI itself, not merely in a comment, so it cannot be mistaken for a claim.
 *
 * TODO(verify): replace with real (anonymized) settlement and reporting views
 * once the owner portal is live and a driver has consented to sharing one.
 * When that happens, keep the "example" labelling unless the figures are the
 * company's own verified numbers.
 */
const SETTLEMENT_LINES = [
  { label: 'Linehaul — HOU → DAL', detail: '239 mi', amount: '+ 545.00', positive: true },
  { label: 'Linehaul — DAL → MEM', detail: '452 mi', amount: '+ 1,015.00', positive: true },
  { label: 'Detention — Receiver 2', detail: '2.0 hrs', amount: '+ 100.00', positive: true },
  { label: 'Fuel advance', detail: 'Issued Tue', amount: '− 400.00', positive: false },
  { label: 'Occupational insurance', detail: 'Weekly', amount: '− 42.00', positive: false },
  { label: 'Maintenance escrow', detail: 'Weekly', amount: '− 150.00', positive: false },
];

const OWNER_ROWS = [
  { truck: 'Unit 104', revenue: '8,420', cost: '3,180', status: 'In service', tone: 'ok' as const },
  { truck: 'Unit 107', revenue: '7,905', cost: '2,940', status: 'In service', tone: 'ok' as const },
  { truck: 'Unit 112', revenue: '2,310', cost: '4,110', status: 'In shop — 3 days', tone: 'warn' as const },
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
        <Reveal delay={0.12}>
          <Typography sx={{ color: 'text.secondary', mt: 2.5, fontSize: '1.05rem' }}>
            Transparency is a claim until you can see the format it arrives in. Here is the shape
            of the information we share with drivers and truck owners — what is on it, and how
            plainly it is stated.
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
            title="Week 11 — itemized"
            caption="Every line named, every deduction explained. Nothing appears here that was not disclosed before you started."
          >
            <Stack divider={<Box sx={{ height: '1px', bgcolor: 'var(--hairline)' }} />}>
              {SETTLEMENT_LINES.map((l) => (
                <Stack
                  key={l.label}
                  direction="row"
                  sx={{ justifyContent: 'space-between', alignItems: 'baseline', gap: 2, py: 1.35 }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                      {l.label}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
                      {l.detail}
                    </Typography>
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      fontVariantNumeric: 'tabular-nums',
                      color: l.positive ? 'text.primary' : 'text.secondary',
                    }}
                  >
                    {l.amount}
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
              <Typography sx={{ color: 'text.primary', fontWeight: 700 }}>Net to driver</Typography>
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  color: 'primary.main',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                2,663.00
              </Typography>
            </Stack>
          </Panel>
        </Reveal>

        <Reveal delay={0.08}>
          <Panel
            kicker="Owner reporting"
            title="Fleet view — month to date"
            caption="Revenue and cost per truck, with downtime shown rather than absorbed. A truck in the shop is visible the day it goes in."
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
                      <Typography sx={{ color: 'text.primary', fontWeight: 600, fontSize: '0.9rem' }}>
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
                            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                            bgcolor: r.tone === 'ok' ? '#4ADE80' : brand.orange,
                          }}
                        />
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>{r.status}</Typography>
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            <Box sx={{ mt: 2.5, p: 2, borderRadius: 1, bgcolor: alpha(brand.orange, 0.08), border: '1px solid', borderColor: alpha(brand.orange, 0.3) }}>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                Unit 112 — brake service, day 3
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                Parts delayed. Estimated return to service Thursday. You would have had this
                update the day the truck came out of service, not at month end.
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
  kicker, title, caption, children,
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
          <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>{kicker}</Typography>
          <Typography component="h3" sx={{ color: 'text.primary', fontWeight: 700, fontSize: '1.05rem' }}>{title}</Typography>
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
