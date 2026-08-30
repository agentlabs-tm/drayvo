'use client';

import { createTheme, alpha } from '@mui/material/styles';
import { brand } from './tokens';

const display = 'var(--font-display)';
const body = 'var(--font-body)';
const mono = 'var(--font-mono)';

/**
 * One CSS-variable theme carrying both color schemes. The mode switch only flips
 * a `data-light` / `data-dark` attribute on <html>, so the server and client
 * render identical markup - no hydration mismatch and no theme flash.
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
        primary: {
          main: brand.orangeText,
          light: brand.orange,
          dark: '#A82F00',
          contrastText: '#FFFFFF',
        },
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
        primary: {
          main: brand.orange,
          light: brand.orangeLight,
          dark: brand.orangeDeep,
          contrastText: brand.ink,
        },
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
    /**
     * Every display size is a single clamp rather than a per-breakpoint object,
     * so the type scales continuously instead of stepping. The `vw` middle term
     * is tuned against the *narrowest* line each level actually has to carry —
     * at 320px the hero headline is 19 characters of Sora ExtraBold, which is
     * why the h1 floor is 1.75rem and not the 2.5rem a desktop-first scale
     * would leave behind.
     */
    h1: {
      fontFamily: display,
      fontWeight: 800,
      letterSpacing: '-0.035em',
      lineHeight: 1.04,
      fontSize: 'clamp(1.75rem, 7.4vw, 5rem)',
    },
    h2: {
      fontFamily: display,
      fontWeight: 800,
      letterSpacing: '-0.028em',
      lineHeight: 1.12,
      fontSize: 'clamp(1.65rem, 4.6vw, 3rem)',
    },
    h3: {
      fontFamily: display,
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      fontSize: 'clamp(1.25rem, 2.6vw, 1.85rem)',
    },
    h4: {
      fontFamily: display,
      fontWeight: 700,
      letterSpacing: '-0.015em',
      lineHeight: 1.24,
      fontSize: 'clamp(1.3rem, 3vw, 1.75rem)',
    },
    h5: {
      fontFamily: display,
      fontWeight: 700,
      letterSpacing: '-0.01em',
      lineHeight: 1.32,
      fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)',
    },
    h6: {
      fontFamily: display,
      fontWeight: 700,
      letterSpacing: '-0.005em',
      lineHeight: 1.35,
      fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
    },
    subtitle1: { fontSize: 'clamp(1rem, 1.2vw, 1.0625rem)', lineHeight: 1.65 },
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
        /**
         * `clip` rather than `hidden`: `hidden` turns <body> into a scroll
         * container, which silently disables `position: sticky` on descendants
         * (the owner-operations column). `clip` suppresses the same overflow
         * without that side effect. `hidden` stays as the pre-Safari-16 fallback.
         */
        body: {
          overflowX: 'hidden',
          '@supports (overflow: clip)': { overflowX: 'clip' },
        },
        '::selection': { background: alpha(brand.orange, 0.3) },
        '@media (prefers-reduced-motion: no-preference)': {
          html: { scrollBehavior: 'smooth' },
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*': {
            animationDuration: '0.001ms !important',
            transitionDuration: '0.001ms !important',
          },
        },
      },
    },
    /**
     * Horizontal gutters step with the viewport and add the landscape notch
     * inset, so nothing sits under the sensor housing on a rotated iPhone.
     * Every full-width surface on the site routes through Container, so this is
     * the one place safe areas need handling.
     */
    MuiContainer: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          paddingInlineStart: `max(${t.spacing(2)}, env(safe-area-inset-left))`,
          paddingInlineEnd: `max(${t.spacing(2)}, env(safe-area-inset-right))`,
          [t.breakpoints.up('sm')]: {
            paddingInlineStart: `max(${t.spacing(3)}, env(safe-area-inset-left))`,
            paddingInlineEnd: `max(${t.spacing(3)}, env(safe-area-inset-right))`,
          },
        }),
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 6,
          paddingInline: 22,
          paddingBlock: 11,
          // Floor rather than a fixed height: keeps every button - including the
          // borderless text ones - a comfortable tap target without stretching
          // the ones that already exceed it.
          minHeight: 44,
          transition: 'background-color .2s ease, border-color .2s ease, color .2s ease',
        },
        sizeLarge: { paddingInline: 28, paddingBlock: 14, fontSize: '1rem', minHeight: 52 },
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
    /** 44px minimum on every icon-only control - they are the smallest targets on the page. */
    MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44 } } },
    /**
     * The default 20px vertical padding gives the rail a ~40px grab area. On a
     * touch screen the settlement sliders are the only draggable controls on
     * the site, so they get a full 48.
     */
    MuiSlider: { styleOverrides: { root: { paddingBlock: 15 } } },
    MuiTextField: { defaultProps: { variant: 'outlined' } },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          borderRadius: 6,
          // 16px floor: anything smaller makes iOS Safari zoom the viewport on
          // focus, and it never zooms back out.
          fontSize: '1rem',
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
