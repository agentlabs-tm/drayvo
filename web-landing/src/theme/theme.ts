'use client';

import { createTheme, alpha } from '@mui/material/styles';
import { brand } from './tokens';

const display = 'var(--font-display)';
const body = 'var(--font-body)';
const mono = 'var(--font-mono)';

/**
 * One CSS-variable theme carrying both color schemes. The mode switch only flips
 * a `data-light` / `data-dark` attribute on <html>, so the server and client
 * render identical markup — no hydration mismatch and no theme flash.
 *
 * Mode-dependent styling must go through `theme.applyStyles('dark' | 'light', …)`
 * rather than `theme.palette.mode`, which is fixed to the default scheme here.
 *
 * Geometry note: radii are deliberately tight (4–6px). Drayvo's visual language
 * is operating records and route lines, not soft consumer cards.
 */
const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data' },
  defaultColorScheme: 'dark',
  colorSchemes: {
    light: {
      palette: {
        primary: { main: brand.orangeText, light: brand.orange, dark: '#A82F00', contrastText: '#FFFFFF' },
        secondary: { main: '#3A4A63', contrastText: '#FFFFFF' },
        background: { default: brand.mist, paper: brand.paper },
        text: { primary: brand.ink, secondary: '#4A5769' },
        divider: alpha(brand.ink, 0.12),
        success: { main: '#15803D' },
        error: { main: '#B42318' },
      },
    },
    dark: {
      palette: {
        primary: { main: brand.orange, light: brand.orangeLight, dark: brand.orangeDeep, contrastText: brand.ink },
        secondary: { main: brand.steel, contrastText: brand.ink },
        background: { default: brand.ink, paper: brand.charcoal },
        text: { primary: '#EDF1F7', secondary: '#9DAABD' },
        divider: alpha('#FFFFFF', 0.12),
        success: { main: '#4ADE80' },
        error: { main: '#FF6B6B' },
      },
    },
  },
  shape: { borderRadius: 4 },
  typography: {
    fontFamily: body,
    h1: {
      fontFamily: display,
      fontWeight: 800,
      letterSpacing: '-0.035em',
      lineHeight: 1.02,
      fontSize: 'clamp(2.5rem, 6vw, 5rem)',
    },
    h2: {
      fontFamily: display,
      fontWeight: 800,
      letterSpacing: '-0.028em',
      lineHeight: 1.08,
      fontSize: 'clamp(1.85rem, 3.6vw, 3rem)',
    },
    h3: {
      fontFamily: display,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.15,
      fontSize: 'clamp(1.35rem, 2.2vw, 1.85rem)',
    },
    h4: { fontFamily: display, fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.2 },
    h5: { fontFamily: display, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.3 },
    h6: { fontFamily: display, fontWeight: 700, letterSpacing: '-0.005em', lineHeight: 1.35 },
    subtitle1: { fontSize: '1.0625rem', lineHeight: 1.65 },
    body1: { fontSize: '1rem', lineHeight: 1.7 },
    body2: { fontSize: '0.9375rem', lineHeight: 1.65 },
    button: { fontWeight: 700, letterSpacing: '0.005em', textTransform: 'none' },
    overline: {
      fontFamily: mono,
      fontWeight: 600,
      letterSpacing: '0.16em',
      fontSize: '0.72rem',
      textTransform: 'uppercase',
      lineHeight: 1.6,
    },
    caption: { fontSize: '0.8125rem', lineHeight: 1.55 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: { WebkitFontSmoothing: 'antialiased' },
        body: { overflowX: 'hidden' },
        '::selection': { background: alpha(brand.orange, 0.3) },
        '@media (prefers-reduced-motion: no-preference)': {
          html: { scrollBehavior: 'smooth' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*': { animationDuration: '0.001ms !important', transitionDuration: '0.001ms !important' },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 6,
          paddingInline: 22,
          paddingBlock: 11,
          transition: 'background-color .2s ease, border-color .2s ease, color .2s ease',
        },
        sizeLarge: { paddingInline: 28, paddingBlock: 14, fontSize: '1rem' },
        outlined: ({ theme: t }) => ({
          borderWidth: 1,
          borderColor: alpha(brand.steel, 0.55),
          '&:hover': {
            borderWidth: 1,
            borderColor: t.vars.palette.primary.main,
            background: alpha(brand.orange, 0.08),
          },
        }),
      },
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            backgroundColor: brand.orangeText,
            color: '#FFFFFF',
            '&:hover': { backgroundColor: brand.orangeDeepText },
          },
        },
      ],
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: 6,
          ...t.applyStyles('light', { background: brand.paper }),
          ...t.applyStyles('dark', { background: alpha('#FFFFFF', 0.04) }),
          '&.Mui-focused': { boxShadow: `0 0 0 3px ${alpha(brand.orange, 0.22)}` },
        }),
      },
    },
    MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 4 } } },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: 6,
          overflow: 'hidden',
          border: `1px solid ${t.vars.palette.divider}`,
          '&:before': { display: 'none' },
          background: 'transparent',
        }),
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 700, fontSize: '0.95rem', minHeight: 48 },
      },
    },
  },
});

export default theme;
