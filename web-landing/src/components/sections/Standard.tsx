'use client';

import { Box, Stack, Typography } from '@mui/material';
import Section from '@/components/ui/Section';
import Reveal from '@/components/motion/Reveal';

/**
 * The Drayvo Standard - the brand's load-bearing system. Every claim elsewhere
 * on the site has to be consistent with these seven commitments.
 *
 * These are written as operating practices rather than outcomes on purpose: a
 * practice is something the company controls and a reader can check, where an
 * outcome ("98% on time") requires evidence we do not have.
 *
 * TODO(verify): confirm each commitment is operationally true today before
 * launch. Anything the company cannot consistently meet must be cut, not
 * softened - a broken promise here damages the entire positioning.
 */
const STANDARD = [
  {
    n: '01',
    title: 'The rate is visible before dispatch',
    body: 'You know what a load pays before you accept it. No accepting first and finding out later.',
  },
  {
    n: '02',
    title: 'Every deduction is disclosed',
    body: 'Escrow, insurance, advances, and fees are explained up front and itemized on the statement.',
  },
  {
    n: '03',
    title: 'Drivers have direct dispatcher access',
    body: 'You get a name and a direct line. The person planning your week is the person who answers.',
  },
  {
    n: '04',
    title: 'Owners receive load-level reporting',
    body: 'Revenue and cost for each load your truck runs, not a monthly total you have to take on faith.',
  },
  {
    n: '05',
    title: 'Maintenance events are documented',
    body: 'What was done, when, why, and what it cost - recorded against the truck and visible to its owner.',
  },
  {
    n: '06',
    title: 'Payments follow a defined schedule',
    body: 'You are told the pay calendar before you start, and we hold to it. Changes are communicated in advance.',
  },
  {
    n: '07',
    title: 'Questions get answered',
    body: 'Settlement questions and disputes get a real response from a person, not a ticket that goes quiet.',
  },
];

export default function Standard() {
  return (
    <Section id="why" tone="contrast">
      <Box sx={{ maxWidth: 760 }}>
        <Reveal>
          <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 2 }}>
            The Drayvo Standard
          </Typography>
        </Reveal>
        <Reveal delay={0.06}>
          <Typography variant="h2" sx={{ color: 'text.primary' }}>
            Seven commitments.{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              In writing.
            </Box>
          </Typography>
        </Reveal>
        <Reveal delay={0.12}>
          <Typography sx={{ color: 'text.secondary', mt: 2.5, fontSize: '1.05rem' }}>
            Any carrier can advertise a rate. These are the operating practices behind ours. They
            are specific on purpose - each one is something you can check against your own
            experience within a few weeks of running with us.
          </Typography>
        </Reveal>
      </Box>

      <Box
        sx={{
          mt: { xs: 5, md: 8 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(3, minmax(0, 1fr))' },
          gap: '1px',
          bgcolor: 'var(--hairline)',
          border: '1px solid',
          borderColor: 'var(--hairline)',
          borderRadius: 1.5,
          overflow: 'hidden',
        }}
      >
        {STANDARD.map((s, i) => (
          <Reveal key={s.n} delay={Math.min(i * 0.04, 0.2)} sx={{ height: '100%' }}>
            <Stack
              spacing={1.5}
              sx={{
                height: '100%',
                p: { xs: 3, md: 3.5 },
                bgcolor: 'var(--surface-contrast)',
                transition: 'background-color .25s ease',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: 'primary.main',
                }}
              >
                {s.n}
              </Typography>
              <Typography variant="h6" component="h3" sx={{ color: 'text.primary' }}>
                {s.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {s.body}
              </Typography>
            </Stack>
          </Reveal>
        ))}

        {/*
          Fills the trailing grid cells so the record block stays rectangular.
          Seven items need one filler to reach eight at `md` (2 columns) and two
          to reach nine at `xl` (3 columns). The second filler previously
          rendered alone at `xl`, leaving the ninth cell empty and showing the
          container's hairline background as a bare grey block.
        */}
        <Box sx={{ bgcolor: 'var(--surface-contrast)', display: { xs: 'none', md: 'block' } }} />
        <Box sx={{ bgcolor: 'var(--surface-contrast)', display: { xs: 'none', xl: 'block' } }} />
      </Box>
    </Section>
  );
}
