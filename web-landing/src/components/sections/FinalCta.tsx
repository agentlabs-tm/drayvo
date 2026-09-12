'use client';

import Button from '@mui/material/Button';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import Scene from '@/components/ui/Scene';

/**
 * Closing call to action, rebuilt as a full-bleed photographic scene.
 *
 * It was previously a flat contrast band - a heading, a 45-word paragraph and
 * two buttons - which is the same shape as the six text sections above it. The
 * page's last statement cannot look like its middle. It closes on the same
 * register it opened in: a photograph, a short line, and a way forward.
 *
 * The paragraph was the casualty. Its argument - bring us the offer you are
 * considering and compare it against ours - is the strongest sentence on the
 * page, so it survives as the lead rather than being cut, but at 22 words
 * instead of 45. The pay structure and deduction detail it enumerated is
 * already laid out in `Transparency` and `Standard`, immediately above.
 */
export default function FinalCta() {
  return (
    <Scene
      asset="openRoad"
      align="center"
      height="tall"
      eyebrow="Before you sign anywhere else"
      title="Trucking should work for the people who keep it moving."
      lead="Bring the offer you are considering. We will put ours next to it and you can decide with both in front of you."
    >
      <Button href="#apply" variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />}>
        Drive with Drayvo
      </Button>
      <Button
        href="#apply"
        variant="outlined"
        size="large"
        sx={{
          // Same solid treatment as the hero's secondary: this sits over a
          // photograph in both colour schemes, so it needs its own ground
          // rather than a hairline border that the image can swallow.
          color: '#FFFFFF',
          backgroundColor: 'rgba(6,13,26,0.82)',
          borderColor: 'rgba(255,255,255,0.28)',
          backdropFilter: 'blur(8px)',
          '&:hover': {
            backgroundColor: 'rgba(6,13,26,0.95)',
            borderColor: 'rgba(255,255,255,0.5)',
          },
        }}
      >
        Partner your truck with Drayvo
      </Button>
    </Scene>
  );
}
