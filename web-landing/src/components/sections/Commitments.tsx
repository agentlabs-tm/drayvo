'use client';

import { Box, Stack, Typography } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { visuallyHidden } from '@mui/utils';
import Section from '@/components/ui/Section';
import Reveal from '@/components/motion/Reveal';

/**
 * Sits where a stats bar normally would. Deliberately carries no numbers:
 * the company has no independently verified operating metrics yet, and an
 * invented one would undercut the exact thing this brand is selling.
 * Each item is an operating commitment a reader can hold us to instead.
 *
 * TODO(verify): once audited figures exist (on-time percentage, fleet size,
 * safety record, average tenure), they may be added *alongside* these
 * commitments - never as a replacement, and never without a source.
 */
const COMMITMENTS = [
  {
    icon: VisibilityOutlinedIcon,
    title: 'Rates shown before dispatch',
    body: 'You see what a load pays before you accept it.',
  },
  {
    icon: ReceiptLongOutlinedIcon,
    title: 'Itemized weekly settlements',
    body: 'Every line, every deduction, on a set schedule.',
  },
  {
    icon: HeadsetMicOutlinedIcon,
    title: 'Direct dispatcher access',
    body: 'A name and a number, not a rotating queue.',
  },
  {
    icon: AssessmentOutlinedIcon,
    title: 'Load-level owner reporting',
    body: 'Revenue, cost, and downtime per truck, per load.',
  },
];

export default function Commitments() {
  return (
    <Section tone="raised" sx={{ py: { xs: 5, md: 7 } }}>
      <Typography variant="h2" sx={visuallyHidden}>
        How Drayvo operates
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
          gap: { xs: 3, lg: 0 },
        }}
      >
        {COMMITMENTS.map(({ icon: Icon, title, body }, i) => (
          <Reveal key={title} delay={i * 0.05}>
            <Stack
              spacing={1.25}
              sx={{
                height: '100%',
                px: { lg: 3.5 },
                borderLeft: { lg: '1px solid' },
                borderColor: { lg: 'divider' },
                ...(i === 0 && { pl: { lg: 0 }, borderLeft: { lg: 'none' } }),
              }}
            >
              <Icon sx={{ color: 'primary.main', fontSize: 26 }} />
              <Typography
                variant="h6"
                component="h3"
                sx={{ color: 'text.primary', fontSize: '1.02rem' }}
              >
                {title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {body}
              </Typography>
            </Stack>
          </Reveal>
        ))}
      </Box>

      <Typography
        variant="caption"
        sx={{
          display: 'block',
          mt: { xs: 4, md: 5 },
          pt: 2.5,
          borderTop: '1px solid',
          borderColor: 'divider',
          color: 'text.secondary',
        }}
      >
        Drayvo publishes commitments it can keep rather than statistics it cannot substantiate.
        Every claim on this page is something you can hold us to —{' '}
        <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>
          ask about any of them and you will get a direct answer.
        </Box>
      </Typography>
    </Section>
  );
}
