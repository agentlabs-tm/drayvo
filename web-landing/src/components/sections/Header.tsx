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
import { WEBVIEW_ATTR } from '@/lib/inAppWebview';

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

          /**
           * In an iOS in-app browser the host's top content inset pushes any
           * pinned element down, leaving a strip above it that page content
           * scrolls through (see lib/inAppWebview.ts). `sticky` is displaced
           * identically, so the only way to avoid the strip is not to pin the
           * header at all: here it sits in normal flow and scrolls away, and
           * the sticky bottom action bar - which that inset does not affect —
           * carries the primary CTA.
           *
           * Phones only. A tablet or desktop webview has room to spare and
           * losing the nav there would cost more than the artifact.
           *
           * The selector outranks MUI's `.MuiAppBar-positionFixed`, so no
           * `!important` is needed.
           */
          [theme.breakpoints.down('md')]: {
            [`html[${WEBVIEW_ATTR}] &`]: {
              position: 'static',
              // Opaque regardless of scroll: in flow it sits above the hero
              // rather than over it, so the transparent-until-scrolled
              // treatment would render as a bare gap.
              bgcolor: 'background.default',
              borderColor: 'divider',
              backdropFilter: 'none',
            },
          },
          transition: 'background-color .25s ease, border-color .25s ease',
          color: 'text.primary',
          /**
           * Deliberately NO `env(safe-area-inset-top)` padding here.
           *
           * A safe-area inset is only meaningful when the page opts into
           * drawing under the system UI with `viewport-fit=cover`, which this
           * site does not (see the viewport export in app/layout.tsx) - the
           * browser already insets the page below the status bar, so there is
           * nothing to clear.
           *
           * iOS in-app browsers (Telegram, and others embedding WKWebView)
           * report a non-zero top inset regardless. Padding the bar by it added
           * a ~59px strip above the logo that belongs to the header but sits
           * above the toolbar - and because the bar is 88% opaque with a
           * backdrop blur, page content was visibly scrolling through it.
           *
           * If edge-to-edge is ever wanted, add `viewportFit: 'cover'` to the
           * viewport export and reintroduce the inset everywhere at once.
           */
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
              // Same reasoning as the AppBar: no top inset without
              // `viewport-fit=cover`, or an in-app browser's spurious value
              // pushes the drawer's own header down for no reason. The bottom
              // and right insets are kept but bounded, so a wrong value can
              // only ever add padding - it cannot expose content.
              pb: 'max(20px, env(safe-area-inset-bottom))',
              pr: 'max(20px, env(safe-area-inset-right))',
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
