'use client';

import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material';
import Logo from '@/components/brand/Logo';
import { nav, site } from '@/lib/site';
import { brandVoice } from '@/lib/brand';

const COLUMNS = [
  {
    title: 'Company',
    // Filtered from `nav` rather than duplicated, so an entry removed there
    // (currently "Our Fleet") cannot linger here as a dead anchor.
    links: nav.filter((n) => ['#why', '#faq', '#apply'].includes(n.href)),
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
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: { xs: 6, md: 9 },
        /**
         * The sticky call/apply bar is ~76px tall and reappears once the
         * application form scrolls out of view - i.e. exactly when the reader
         * is in the footer. Without this reserve it covers the privacy and
         * terms links, which are the two the footer most needs to keep tappable.
         */
        pb: { xs: 'calc(env(safe-area-inset-bottom, 0px) + 108px)', md: 4 },
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gap: { xs: 4, md: 6 },
            /**
             * Two columns even at 320px. The labels are short ("FAQ",
             * "Contact"), so a single stacked column left half the footer empty
             * and turned seven links into most of a screen of scrolling - the
             * "don't just stack everything" case.
             */
            gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: '2fr 1fr 1fr' },
            columnGap: { xs: 2, sm: 4, md: 6 },
          }}
        >
          {/* Spans the full row until `lg`, where it becomes the wide first
              column, so the two link columns always sit side by side. */}
          <Stack spacing={2} sx={{ maxWidth: 400, gridColumn: { xs: 'span 2', lg: 'span 1' } }}>
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
            <Stack key={col.title} spacing={0.25} sx={{ minWidth: 0 }}>
              <Typography variant="overline" sx={{ color: 'text.primary' }}>{col.title}</Typography>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  underline="none"
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    width: 'fit-content',
                    // Comfortable tap target without visibly loosening the
                    // column: the extra height is padding on an inline-flex box.
                    display: 'inline-flex',
                    alignItems: 'center',
                    minHeight: 40,
                    '&:hover': { color: 'primary.main' },
                  }}
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
          <Stack spacing={0.5} sx={{ minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              © {new Date().getFullYear()} {site.legalName}. All rights reserved.
              {/* TODO(verify): display FMCSA-issued MC and USDOT numbers here once issued and
                  confirmed. Never publish a placeholder operating authority number. */}
              {site.authorityVerified && site.mcNumber ? ` · ${site.mcNumber} · ${site.dotNumber}` : ''}
            </Typography>
            {site.address.street && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {site.address.street}, {site.address.suite}, {site.address.city}{' '}
                {site.address.state} {site.address.postalCode}
              </Typography>
            )}
          </Stack>
          {/* `-ml` pulls the padded links back into alignment with the copyright
              line above them, so the tap targets grow without the column
              appearing to indent. */}
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0, ml: { xs: -1.5, md: 0 } }}>
            {[
              { href: '/privacy', label: 'Privacy' },
              { href: '/terms', label: 'Terms' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                underline="none"
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  display: 'inline-flex',
                  alignItems: 'center',
                  minHeight: 44,
                  px: 1.5,
                  '&:hover': { color: 'primary.main' },
                }}
              >
                {l.label}
              </Link>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
