'use client';

import * as React from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Link as MLink,
  Stack,
  Toolbar,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import { useColorScheme } from '@mui/material/styles';
import Logo from '@/components/brand/Logo';
import { nav, site } from '@/lib/site';
import { useAppTheme } from '@/theme/useAppTheme';

export default function Header() {
  const theme = useAppTheme();
  const { mode, systemMode, setMode } = useColorScheme();
  const resolved = mode === 'system' ? systemMode : mode;
  const [open, setOpen] = React.useState(false);
  const [solid, setSolid] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        component="header"
        sx={{
          bgcolor: solid
            ? `rgb(${theme.vars.palette.background.defaultChannel} / 0.88)`
            : 'transparent',
          backdropFilter: solid ? 'saturate(160%) blur(14px)' : 'none',
          borderBottom: '1px solid',
          borderColor: solid ? 'divider' : 'transparent',
          transition: 'background-color .25s ease, border-color .25s ease',
          color: 'text.primary',
          // Notch clearance when the page is opened in a browser that draws
          // under the status bar (installed PWA, some in-app browsers).
          pt: 'env(safe-area-inset-top)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 56, md: 80 }, gap: { xs: 1, sm: 2 } }}>
            <MLink
              href="#top"
              underline="none"
              aria-label={`${site.name} - home`}
              sx={{ display: 'flex', minWidth: 0 }}
            >
              {/* 30px on phones: the lockup is 4.6:1, so every pixel of height
                  costs 4.6 of the width the header has to share. */}
              <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
                <Logo height={30} />
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                <Logo height={36} />
              </Box>
            </MLink>

            <Box sx={{ flex: 1 }} />

            <Stack
              component="nav"
              aria-label="Primary"
              direction="row"
              spacing={0.25}
              sx={{ display: { xs: 'none', lg: 'flex' } }}
            >
              {nav.map((n) => (
                <Button
                  key={n.href}
                  href={n.href}
                  sx={{
                    color: 'text.secondary',
                    px: 1.5,
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    '&:hover': { color: 'text.primary', bgcolor: 'transparent' },
                  }}
                >
                  {n.label}
                </Button>
              ))}
            </Stack>

            <Stack
              direction="row"
              spacing={{ xs: 0.5, sm: 1 }}
              sx={{ alignItems: 'center', ml: { lg: 1.5 }, flexShrink: 0 }}
            >
              {/* Below `sm` the header cannot carry logo + toggle + CTA + menu
                  within 320px, and the recruiting CTA outranks the theme
                  switch. The toggle moves into the drawer instead of shrinking
                  everything to the point of being hard to hit. */}
              <IconButton
                onClick={() => setMode(resolved === 'dark' ? 'light' : 'dark')}
                aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`}
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  color: 'text.primary',
                }}
              >
                {resolved === 'dark' ? (
                  <LightModeRoundedIcon fontSize="small" />
                ) : (
                  <DarkModeRoundedIcon fontSize="small" />
                )}
              </IconButton>

              <Button
                href="#apply"
                variant="contained"
                sx={{
                  whiteSpace: 'nowrap',
                  px: { xs: 1.75, sm: 2.75 },
                  fontSize: { xs: '0.85rem', sm: '0.875rem' },
                }}
              >
                {/* Same destination, shortened to fit rather than dropped. */}
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  Drive with Drayvo
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  Apply
                </Box>
              </Button>

              <IconButton
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-menu"
                sx={{ display: { lg: 'none' }, color: 'text.primary' }}
              >
                <MenuRoundedIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        id="mobile-menu"
        slotProps={{
          paper: {
            sx: {
              // `88vw` capped so the panel never exceeds the screen, and never
              // grows past a comfortable reading width on a large tablet.
              width: { xs: 'min(88vw, 340px)', sm: 360 },
              p: 2.5,
              pt: 'calc(env(safe-area-inset-top) + 20px)',
              pb: 'calc(env(safe-area-inset-bottom) + 20px)',
              pr: 'calc(env(safe-area-inset-right) + 20px)',
              bgcolor: 'background.default',
              // A landscape phone is ~360px tall; the menu has to scroll rather
              // than clip its CTAs off the bottom.
              overflowY: 'auto',
              overscrollBehavior: 'contain',
            },
          },
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}
        >
          <Logo height={32} />
          <IconButton onClick={() => setOpen(false)} aria-label="Close menu" edge="end">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack component="nav" aria-label="Mobile" spacing={0.5} sx={{ flexShrink: 0 }}>
          {nav.map((n) => (
            <Button
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                fontSize: '1.1rem',
                fontFamily: 'var(--font-display)',
                color: 'text.primary',
                py: 1.1,
              }}
            >
              {n.label}
            </Button>
          ))}
        </Stack>
        <Box sx={{ flex: 1, minHeight: 24 }} />
        <Stack spacing={1.25} sx={{ mt: 3, flexShrink: 0 }}>
          <Button
            href="#apply"
            onClick={() => setOpen(false)}
            variant="contained"
            size="large"
            fullWidth
          >
            Drive with Drayvo
          </Button>
          <Button
            href="#owners"
            onClick={() => setOpen(false)}
            variant="outlined"
            size="large"
            fullWidth
            sx={{ color: 'text.primary' }}
          >
            Put your truck to work
          </Button>
          {/* Displaced from the toolbar below `sm`; rendered here at every size
              so the drawer's contents do not change between breakpoints. */}
          <Button
            onClick={() => setMode(resolved === 'dark' ? 'light' : 'dark')}
            startIcon={
              resolved === 'dark' ? (
                <LightModeRoundedIcon fontSize="small" />
              ) : (
                <DarkModeRoundedIcon fontSize="small" />
              )
            }
            fullWidth
            sx={{ color: 'text.secondary', justifyContent: 'flex-start', px: 1 }}
          >
            {resolved === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
        </Stack>
      </Drawer>
    </>
  );
}
