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
    <Box component="main" sx={{ bgcolor: 'background.default', minHeight: '100vh', py: { xs: 8, md: 14 } }}>
      <Container maxWidth="md">
        <Button href="/" startIcon={<ArrowBackRoundedIcon />} sx={{ mb: 4, px: 0, color: 'text.secondary' }}>
          Back to Drayvo
        </Button>
        <Typography variant="h1" sx={{ color: 'text.primary', fontSize: { xs: '2.25rem', md: '3rem' } }}>
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
