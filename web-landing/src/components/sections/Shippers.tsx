'use client';

import { Box, Button, Stack, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Section from '@/components/ui/Section';
import Reveal from '@/components/motion/Reveal';

/**
 * Shippers - the secondary audience, given a compact section rather than the
 * multi-card service grid it had before.
 *
 * The previous version advertised six freight modes, all-48-state coverage, and
 * sub-48-hour transcontinental service. None of that is verified, and capacity
 * claims a carrier cannot cover are the fastest way to lose a shipper. This
 * states the working relationship instead.
 *
 * TODO(verify): list the equipment types and lanes Drayvo can actually cover
 * today, plus insurance limits and any authority scope. Add a coverage map only
 * when the lanes behind it are real.
 */
const POINTS = [
  {
    title: 'You are talking to the carrier',
    body: 'Not a brokerage passing your load down a chain until someone accepts it. The people you speak to are the people responsible for the truck.',
  },
  {
    title: 'A named contact on every load',
    body: 'One person who knows your freight, your receivers, and what happens if something slips. Reachable directly, not through a queue.',
  },
  {
    title: 'Status you do not have to chase',
    body: 'The same visibility discipline we apply to driver pay and owner reporting applies to your freight. If a load is late you hear it from us first.',
  },
];

export default function Shippers() {
  return (
    <Section id="shippers" tone="raised">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '0.85fr 1.15fr' },
          gap: { xs: 4, md: 8 },
          alignItems: 'center',
        }}
      >
        <Box>
          <Reveal>
            <Typography variant="overline" sx={{ color: 'primary.main', display: 'block', mb: 2 }}>
              For shippers
            </Typography>
          </Reveal>
          <Reveal delay={0.06}>
            <Typography variant="h2" sx={{ color: 'text.primary' }}>
              Capacity from people who answer
            </Typography>
          </Reveal>
          <Reveal delay={0.12}>
            <Typography sx={{ color: 'text.secondary', mt: 2.5 }}>
              We would rather tell you plainly what we can cover than quote capacity we cannot
              deliver on. Send us a lane and you will get a straight answer either way - and when we
              commit to it, it moves.
            </Typography>
          </Reveal>
          <Reveal delay={0.18}>
            <Button
              href="#apply"
              variant="outlined"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ mt: 3.5, color: 'text.primary' }}
            >
              Ship with Drayvo
            </Button>
          </Reveal>
        </Box>

        <Stack spacing={0}>
          {POINTS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <Box
                sx={{
                  py: { xs: 2.5, md: 3 },
                  borderTop: i === 0 ? 'none' : '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" component="h3" sx={{ color: 'text.primary' }}>
                  {p.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.75 }}>
                  {p.body}
                </Typography>
              </Box>
            </Reveal>
          ))}
        </Stack>
      </Box>
    </Section>
  );
}
