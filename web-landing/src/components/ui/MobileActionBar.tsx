'use client';

import * as React from 'react';
import { Box, Button, Stack } from '@mui/material';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { site } from '@/lib/site';

/**
 * Sticky call/apply bar for small screens.
 *
 * Driver recruiting traffic is overwhelmingly mobile, and the two actions that
 * convert - phoning a recruiter and starting an application - otherwise live at
 * the top and bottom of a long page. This keeps both a thumb away.
 *
 * It stays hidden until the hero has scrolled past, so it never competes with
 * the hero's own CTAs, and hides again once the application form is on screen.
 */
export default function MobileActionBar() {
  const [visible, setVisible] = React.useState(false);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const apply = document.getElementById('apply');
    let formOnScreen = false;

    const observer = apply
      ? new IntersectionObserver(
          ([entry]) => {
            formOnScreen = entry.isIntersecting;
            setVisible(window.scrollY > window.innerHeight * 0.9 && !formOnScreen);
          },
          { threshold: 0.12 }
        )
      : null;
    observer?.observe(apply!);

    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.9 && !formOnScreen);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer?.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <Box
          component={motion.div}
          initial={reduce ? { opacity: 0 } : { y: '110%' }}
          animate={reduce ? { opacity: 1 } : { y: 0 }}
          exit={reduce ? { opacity: 0 } : { y: '110%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          sx={{
            position: 'fixed',
            insetInline: 0,
            bottom: 0,
            zIndex: (t) => t.zIndex.appBar,
            display: { xs: 'block', md: 'none' },
            pt: 1.25,
            // Bounded rather than added to a base: an in-app browser reporting a
            // spurious inset can then only ever match the home-indicator gap,
            // never stack on top of the padding and inflate the bar.
            pb: 'max(12px, env(safe-area-inset-bottom, 0px))',
            // Clears the notch in landscape, where the bar spans the full width
            // and its outer button would otherwise sit under the sensor housing.
            pl: 'max(12px, env(safe-area-inset-left))',
            pr: 'max(12px, env(safe-area-inset-right))',
            bgcolor: 'var(--surface-panel)',
            borderTop: '1px solid',
            borderColor: 'var(--hairline)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Stack direction="row" spacing={1.25}>
            {site.phoneHref && (
              <Button
                href={`tel:${site.phoneHref}`}
                variant="outlined"
                startIcon={<PhoneInTalkRoundedIcon />}
                sx={{ flex: 1, color: 'text.primary' }}
              >
                Call
              </Button>
            )}
            <Button
              href="#apply"
              variant="contained"
              sx={{ flex: site.phoneHref ? 2 : 1, minWidth: 0, whiteSpace: 'nowrap' }}
            >
              Drive with Drayvo
            </Button>
          </Stack>
        </Box>
      )}
    </AnimatePresence>
  );
}
