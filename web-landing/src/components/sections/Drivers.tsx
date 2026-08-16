'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import { alpha } from '@mui/material/styles';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import { brand } from '@/theme/tokens';

/**
 * Driver experience.
 *
 * Compensation is described structurally — how pay is calculated, disclosed,
 * and settled — rather than as advertised figures. Specific rates, percentage
 * splits, mileage ranges, fuel discounts, and benefits were removed because
 * none are verified, and pay claims in driver recruiting are regulated
 * advertising.
 *
 * TODO(verify): supply confirmed pay structure, benefit eligibility, and
 * equipment details. Where a figure is added it must be accompanied by its
 * conditions (lane, experience, tenure) in the same sentence.
 */
const PATHS = [
  {
    tag: 'Company driver',
    lead: 'You drive our truck',
    points: [
      'Pay structure explained in full before you accept an offer',
      'Rate for each load visible before dispatch',
      'Itemized settlement on a defined weekly schedule',
      'Company-maintained equipment with documented service history',
      'Home-time expectations agreed up front, not improvised',
    ],
    // TODO(verify): confirm benefits offering and eligibility before listing any.
    footnote: 'Pay rates, benefits, and eligibility are confirmed in writing during hiring.',
    lead_accent: true,
  },
  {
    tag: 'Owner-operator',
    lead: 'You drive your own truck',
    points: [
      'Load rate and your share shown before you accept',
      'Deductions disclosed and itemized every settlement',
      'You choose loads — we do not force dispatch',
      'Compliance, permits, and filings handled for you',
      'Maintenance events documented against your unit',
    ],
    footnote: 'Settlement terms and any pass-through costs are set out in your agreement.',
    lead_accent: false,
  },
];

const REQUIREMENTS = [
  'Valid Class A CDL',
  'Verifiable OTR experience',
  'Motor vehicle record we can review with you',
  'Able to pass a DOT physical and drug screen',
  'At least 21 years old for interstate work',
];

export default function Drivers() {
  return (
    <Section id="drivers" tone="base">
      <SectionHeading
        eyebrow="For drivers"
        title={<>Your truck. Your miles. <Box component="span" sx={{ color: 'primary.main' }}>Your money.</Box></>}
        subtitle="Two ways to run with Drayvo. Both work the same way underneath: you see the number before you commit, and the settlement shows how it was reached."
      />

      <Box
        sx={{
          mt: { xs: 5, md: 8 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2.5,
        }}
      >
        {PATHS.map((p, i) => (
          <Reveal key={p.tag} delay={i * 0.06} sx={{ height: '100%' }}>
            <Stack
              spacing={2}
              sx={{
                height: '100%',
                p: { xs: 3, md: 4 },
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: p.lead_accent ? alpha(brand.orange, 0.4) : 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="overline" sx={{ color: 'primary.main' }}>{p.tag}</Typography>
              <Typography variant="h4" component="h3" sx={{ color: 'text.primary', fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
                {p.lead}
              </Typography>

              <Stack component="ul" spacing={1.5} sx={{ listStyle: 'none', p: 0, m: 0, pt: 1 }}>
                {p.points.map((pt) => (
                  <Stack key={pt} component="li" direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                    <CheckRoundedIcon sx={{ fontSize: 19, color: 'primary.main', mt: '3px', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{pt}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Box sx={{ flex: 1 }} />
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}
              >
                {p.footnote}
              </Typography>
              <Button
                href="#apply"
                variant={p.lead_accent ? 'contained' : 'outlined'}
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{ alignSelf: 'flex-start', ...(p.lead_accent ? {} : { color: 'text.primary' }) }}
              >
                Start an application
              </Button>
            </Stack>
          </Reveal>
        ))}
      </Box>

      <Reveal delay={0.1}>
        <Box
          sx={{
            mt: { xs: 3, md: 4 },
            p: { xs: 3, md: 4 },
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '300px 1fr' },
            gap: { xs: 2.5, md: 5 },
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h5" component="h3" sx={{ color: 'text.primary' }}>What we ask of you</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Close but not exact? Call anyway. A person reads every application.
            </Typography>
          </Box>
          <Box
            component="ul"
            sx={{
              display: 'grid',
              gap: 1.25,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              listStyle: 'none',
              p: 0,
              m: 0,
            }}
          >
            {REQUIREMENTS.map((r) => (
              <Stack key={r} component="li" direction="row" spacing={1.25} sx={{ alignItems: 'flex-start' }}>
                <Box
                  aria-hidden
                  sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'primary.main', mt: '9px', flexShrink: 0 }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{r}</Typography>
              </Stack>
            ))}
          </Box>
        </Box>
      </Reveal>
    </Section>
  );
}
