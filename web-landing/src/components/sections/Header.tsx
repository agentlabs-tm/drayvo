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
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 80 }, gap: 2 }}>
            <MLink
              href="#top"
              underline="none"
              aria-label={`${site.name} - home`}
              sx={{ display: 'flex' }}
            >
              <Logo height={36} />
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

            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', ml: { lg: 1.5 } }}>
              <IconButton
                onClick={() => setMode(resolved === 'dark' ? 'light' : 'dark')}
                aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`}
                size="small"
                sx={{
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
                sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Drive with Drayvo
              </Button>

              <IconButton
                onClick={() => setOpen(true)}
                aria-label="Open menu"
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
        slotProps={{
          paper: { sx: { width: { xs: '88vw', sm: 360 }, p: 2.5, bgcolor: 'background.default' } },
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo height={32} />
          <IconButton onClick={() => setOpen(false)} aria-label="Close menu">
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack component="nav" aria-label="Mobile" spacing={0.5}>
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
        <Box sx={{ flex: 1 }} />
        <Stack spacing={1.25} sx={{ mt: 3 }}>
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
        </Stack>
      </Drawer>
    </>
  );
}
