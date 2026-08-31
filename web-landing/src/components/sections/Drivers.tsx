'use client';

import { Box, Button, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/motion/Reveal';
import BulletList from '@/components/ui/BulletList';

/**
 * Driver experience.
 *
 * Compensation is described structurally - how pay is calculated, disclosed,
 * and settled - rather than as advertised figures. Specific rates, percentage
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
      'You choose loads - we do not force dispatch',
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
        index="04"
        label="For drivers"
        title="Your truck. Your miles. Your money."
        lead="Two ways to run with Drayvo. Both work the same way: you see the number before you commit, and the settlement shows how it was reached."
      />

      {/*
        Two columns divided by a rule rather than two bordered cards. The card
        treatment implied these were alternatives to choose between, like plans;
        they are two ways of working, and a shared rule states that better than
        two boxes sitting apart on a background.
      */}
      <Box
        sx={{
          mt: { xs: 4, md: 6 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          columnGap: { md: 6 },
          rowGap: { xs: 5, md: 0 },
        }}
      >
        {PATHS.map((p, i) => (
          <Reveal
            key={p.tag}
            delay={i * 0.06}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              borderTop: '2px solid',
              borderColor: p.lead_accent ? 'primary.main' : 'divider',
              pt: 2.5,
              // Divider between the columns, drawn only on the second.
              pl: { md: i === 1 ? 6 : 0 },
              ml: { md: i === 1 ? -6 : 0 },
              borderLeft: { md: i === 1 ? '1px solid' : 'none' },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: p.lead_accent ? 'primary.main' : 'text.secondary',
                mb: 1,
              }}
            >
              {p.tag}
            </Typography>
            <Typography variant="h3" component="h3" sx={{ color: 'text.primary', mb: 2.5 }}>
              {p.lead}
            </Typography>

            <BulletList items={p.points} marker="check" gap={1.25} />

            <Box sx={{ flex: 1, minHeight: 20 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2.5 }}>
              {p.footnote}
            </Typography>
            <Button
              href="#apply"
              variant={p.lead_accent ? 'contained' : 'outlined'}
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                alignSelf: 'flex-start',
                mt: 2,
                ...(p.lead_accent ? {} : { color: 'text.primary' }),
              }}
            >
              Start an application
            </Button>
          </Reveal>
        ))}
      </Box>

      <Reveal delay={0.1}>
        <Box
          sx={{
            mt: { xs: 5, md: 7 },
            pt: { xs: 3, md: 4 },
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'grid',
            // `minmax` rather than a fixed 300px: the intro column may shrink
            // when the requirement list needs the room, and never has to.
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(240px, 300px) 1fr' },
            gap: { xs: 2.5, lg: 5 },
            alignItems: { lg: 'center' },
          }}
        >
          <Box>
            <Typography variant="h5" component="h3" sx={{ color: 'text.primary' }}>
              What we ask of you
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
              Close but not exact? Call anyway. A person reads every application.
            </Typography>
            <Button href="#qualify" endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 1, px: 0 }}>
              Check where you stand
            </Button>
          </Box>
          <BulletList items={REQUIREMENTS} columns={{ xs: 1, sm: 2 }} />
        </Box>
      </Reveal>
    </Section>
  );
}
