import { Alert, Box, Button, Container, Stack, Typography } from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

/** Shared shell for the placeholder legal pages. */
export default function LegalPage({
  title, status, body,
}: {
  title: string;
  status: string;
  body: string[];
}) {
  return (
    <Box
      component="main"
      sx={{
        bgcolor: 'background.default',
        /**
         * `dvh` tracks the visible viewport as mobile browser chrome collapses;
         * `vh` is fixed to the *expanded* chrome height, so a short legal page
         * ends up taller than the screen and scrolls for no reason. `vh` first
         * as the fallback for engines without `dvh`. (An array here would be
         * read as MUI breakpoint values, not CSS fallbacks, hence @supports.)
         */
        minHeight: '100vh',
        '@supports (min-height: 100dvh)': { minHeight: '100dvh' },
        py: { xs: 7, sm: 9, md: 14 },
        pb: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 56px)', md: 14 },
      }}
    >
      <Container maxWidth="md">
        <Button href="/" startIcon={<ArrowBackRoundedIcon />} sx={{ mb: 4, px: 0, color: 'text.secondary' }}>
          Back to Drayvo
        </Button>
        <Typography variant="h1" sx={{ color: 'text.primary', fontSize: 'clamp(1.9rem, 6vw, 3rem)' }}>
          {title}
        </Typography>
        <Alert severity="info" sx={{ mt: 3, borderRadius: 1 }}>
          {status}
        </Alert>
        <Stack spacing={2.5} sx={{ mt: 4 }}>
          {body.map((p) => (
            <Typography key={p} sx={{ color: 'text.secondary' }}>{p}</Typography>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
