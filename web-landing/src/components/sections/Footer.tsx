'use client';

import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material';
import Logo from '@/components/brand/Logo';
import { nav, site } from '@/lib/site';
import { brandVoice } from '@/lib/brand';

const COLUMNS = [
  {
    title: 'Company',
    links: nav.filter((n) => ['#why', '#fleet', '#faq', '#apply'].includes(n.href)),
  },
  {
    title: 'Work with us',
    links: [
      { label: 'For drivers', href: '#drivers' },
      { label: 'For truck owners', href: '#owners' },
      { label: 'For shippers', href: '#shippers' },
    ],
  },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', pt: { xs: 6, md: 9 }, pb: 4 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 4, md: 6 },
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: '2fr 1fr 1fr' },
          }}
        >
          <Stack spacing={2} sx={{ maxWidth: 400 }}>
            <Logo height={40} />
            <Typography
              sx={{ color: 'text.primary', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem' }}
            >
              {brandVoice.line}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {brandVoice.positioning}
            </Typography>
          </Stack>

          {COLUMNS.map((col) => (
            <Stack key={col.title} spacing={1.25}>
              <Typography variant="overline" sx={{ color: 'text.primary' }}>{col.title}</Typography>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  underline="none"
                  variant="body2"
                  sx={{ color: 'text.secondary', width: 'fit-content', '&:hover': { color: 'primary.main' } }}
                >
                  {l.label}
                </Link>
              ))}
            </Stack>
          ))}
        </Box>

        <Divider sx={{ my: { xs: 4, md: 5 } }} />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}
        >
          <Stack spacing={0.5}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              © {new Date().getFullYear()} {site.legalName}. All rights reserved.
              {/* TODO(verify): display FMCSA-issued MC and USDOT numbers here once issued and
                  confirmed. Never publish a placeholder operating authority number. */}
              {site.authorityVerified && site.mcNumber ? ` · ${site.mcNumber} · ${site.dotNumber}` : ''}
            </Typography>
            {site.address.city && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {site.address.city}, {site.address.state}
              </Typography>
            )}
          </Stack>
          <Stack direction="row" spacing={3}>
            <Link href="/privacy" underline="none" variant="caption" sx={{ color: 'text.secondary' }}>
              Privacy
            </Link>
            <Link href="/terms" underline="none" variant="caption" sx={{ color: 'text.secondary' }}>
              Terms
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
