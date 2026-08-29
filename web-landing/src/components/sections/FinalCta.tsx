'use client';

import { Box, Button, Container, Stack, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Reveal from '@/components/motion/Reveal';

export default function FinalCta() {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: 'var(--surface-contrast)',
        color: 'text.primary',
        py: { xs: 9, md: 15 },
        borderTop: '1px solid',
        borderColor: 'var(--hairline)',
      }}
    >
      <Container maxWidth="lg">
        <Reveal>
          <Typography variant="h2" sx={{ color: 'text.primary', maxWidth: 860 }}>
            Trucking should work for the people who{' '}
            <Box component="span" sx={{ color: 'primary.main' }}>
              keep it moving.
            </Box>
          </Typography>
        </Reveal>
        <Reveal delay={0.08}>
          <Typography sx={{ color: 'text.secondary', mt: 3, maxWidth: 620, fontSize: '1.05rem' }}>
            Bring the offer you are considering. We will go through ours next to it - the pay
            structure, the deductions, the reporting - and you can decide with both in front of you.
            Talk to us before you sign anywhere else.
          </Typography>
        </Reveal>
        <Reveal delay={0.16}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 5 }}>
            <Button
              href="#apply"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
            >
              Drive with Drayvo
            </Button>
            <Button
              href="#apply"
              variant="outlined"
              size="large"
              sx={{ color: 'text.primary', borderColor: 'divider' }}
            >
              Partner your truck with Drayvo
            </Button>
          </Stack>
        </Reveal>
      </Container>
    </Box>
  );
}
