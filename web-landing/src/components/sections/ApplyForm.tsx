'use client';

import * as React from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { alpha } from '@mui/material/styles';
import { useForm, Controller } from 'react-hook-form';
import Reveal from '@/components/motion/Reveal';
import { site } from '@/lib/site';
import { brand } from '@/theme/tokens';

export type Audience = 'company-driver' | 'owner-operator' | 'fleet-owner' | 'shipper';

export type ApplyValues = {
  audience: Audience;
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
};

const AUDIENCES: { value: Audience; label: string }[] = [
  { value: 'company-driver', label: 'Company driver' },
  { value: 'owner-operator', label: 'Owner-operator' },
  { value: 'fleet-owner', label: 'Fleet owner' },
  { value: 'shipper', label: 'Shipper / broker' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\d\s()+.-]{10,20}$/;

export default function ApplyForm() {
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ApplyValues>({
    mode: 'onTouched',
    defaultValues: {
      audience: 'company-driver',
      name: '',
      phone: '',
      email: '',
      message: '',
      consent: false,
    },
  });

  const audience = watch('audience');
  const isShipper = audience === 'shipper';

  const onSubmit = async (values: ApplyValues) => {
    setStatus('sending');
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('sent');
      reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <Box
      component="section"
      id="apply"
      sx={{
        bgcolor: 'background.default',
        py: { xs: 8, md: 14 },
        scrollMarginTop: { xs: 72, md: 88 },
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '0.8fr 1.2fr' },
            gap: { xs: 5, lg: 8 },
          }}
        >
          <Box>
            <Reveal>
              <Typography
                variant="overline"
                sx={{ color: 'primary.main', display: 'block', mb: 2 }}
              >
                Start here
              </Typography>
            </Reveal>
            <Reveal delay={0.06}>
              <Typography variant="h2" sx={{ color: 'text.primary' }}>
                Let&apos;s talk.
              </Typography>
            </Reveal>
            <Reveal delay={0.12}>
              <Typography sx={{ color: 'text.secondary', mt: 2.5 }}>
                Tell us who you are and how to reach you - that is all we need to start. A person
                reads every message and follows up directly.
              </Typography>
            </Reveal>

            <Reveal delay={0.18}>
              <Stack spacing={2} sx={{ mt: 4 }}>
                {site.phone && (
                  <ContactLine
                    icon={<PhoneInTalkOutlinedIcon fontSize="small" />}
                    label="Phone"
                    value={site.phone}
                    href={`tel:${site.phoneHref}`}
                  />
                )}
                <ContactLine
                  icon={<EmailOutlinedIcon fontSize="small" />}
                  label="Email"
                  value={site.email}
                  href={`mailto:${site.email}`}
                />
              </Stack>
            </Reveal>

            <Reveal delay={0.24}>
              <Stack
                direction="row"
                spacing={1.25}
                sx={{ mt: 4, alignItems: 'flex-start', color: 'text.secondary' }}
              >
                <LockOutlinedIcon sx={{ fontSize: 17, mt: '2px' }} />
                <Typography variant="caption">
                  Used only to respond to your enquiry. We don&apos;t sell your information or pass
                  it to lead brokers. See our{' '}
                  <Link href="/privacy" sx={{ color: 'primary.main' }}>
                    privacy notice
                  </Link>
                  .
                </Typography>
              </Stack>
            </Reveal>
          </Box>

          <Reveal delay={0.1}>
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label="Contact and application form"
              sx={{
                p: { xs: 2.5, sm: 4 },
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              {status === 'sent' ? (
                <Stack
                  spacing={2}
                  sx={{ alignItems: 'flex-start', py: { xs: 4, md: 8 } }}
                  role="status"
                >
                  <CheckCircleOutlineRoundedIcon sx={{ fontSize: 48, color: 'success.main' }} />
                  <Typography variant="h4" sx={{ color: 'text.primary' }}>
                    Message received
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', maxWidth: 480 }}>
                    Thanks - this has reached us and a person will follow up.{' '}
                    {site.phone
                      ? `If it is urgent, calling ${site.phone} is faster than waiting on a reply.`
                      : `If it is urgent, email ${site.email} and mark it urgent.`}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setStatus('idle')}
                    sx={{ mt: 1, color: 'text.primary' }}
                  >
                    Send another
                  </Button>
                </Stack>
              ) : (
                <Stack spacing={3}>
                  <Box>
                    <Typography
                      component="label"
                      variant="overline"
                      sx={{ color: 'text.secondary', display: 'block', mb: 1 }}
                    >
                      I am a
                    </Typography>
                    <Controller
                      name="audience"
                      control={control}
                      render={({ field }) => (
                        <ToggleButtonGroup
                          {...field}
                          exclusive
                          onChange={(_, v: Audience | null) => v && field.onChange(v)}
                          aria-label="Who you are"
                          sx={{
                            display: 'grid',
                            gap: 1,
                            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                            '& .MuiToggleButton-root': {
                              borderRadius: '6px !important',
                              border: '1px solid !important',
                              borderColor: 'divider !important',
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              py: 1.1,
                              color: 'text.secondary',
                            },
                            '& .Mui-selected': {
                              bgcolor: `${alpha(brand.orange, 0.14)} !important`,
                              borderColor: `${brand.orange} !important`,
                              color: 'text.primary !important',
                            },
                          }}
                        >
                          {AUDIENCES.map((o) => (
                            <ToggleButton key={o.value} value={o.value}>
                              {o.label}
                            </ToggleButton>
                          ))}
                        </ToggleButtonGroup>
                      )}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gap: 2,
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    }}
                  >
                    <TextField
                      label="Your name"
                      required
                      autoComplete="name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      sx={{ gridColumn: { sm: 'span 2' } }}
                      {...register('name', { required: 'Enter your name' })}
                    />
                    <TextField
                      label="Phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      error={!!errors.phone}
                      helperText={errors.phone?.message ?? 'The fastest way to reach you'}
                      {...register('phone', {
                        required: 'Enter a phone number',
                        pattern: { value: PHONE_RE, message: 'Enter a valid phone number' },
                      })}
                    />
                    <TextField
                      label="Email (optional)"
                      type="email"
                      autoComplete="email"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      {...register('email', {
                        pattern: { value: EMAIL_RE, message: 'Enter a valid email address' },
                      })}
                    />
                  </Box>

                  <TextField
                    label={
                      isShipper
                        ? 'What do you need moved? (optional)'
                        : 'Anything we should know? (optional)'
                    }
                    multiline
                    minRows={3}
                    {...register('message')}
                  />

                  <Controller
                    name="consent"
                    control={control}
                    rules={{ required: 'Please confirm you agree to be contacted' }}
                    render={({ field, fieldState }) => (
                      <Box>
                        <FormControlLabel
                          control={<Checkbox {...field} checked={field.value} size="small" />}
                          label={
                            /* TODO(legal): replace with consent language reviewed by counsel,
                               covering TCPA requirements for SMS and autodialled calls. */
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              I agree that {site.name} may contact me by phone, text, or email about
                              this enquiry. Message and data rates may apply, and I can opt out at
                              any time.
                            </Typography>
                          }
                          sx={{ alignItems: 'flex-start', m: 0, '& .MuiCheckbox-root': { pt: 0 } }}
                        />
                        {fieldState.error && (
                          <Typography
                            variant="caption"
                            role="alert"
                            sx={{ color: 'error.main', display: 'block', ml: 3.75 }}
                          >
                            {fieldState.error.message}
                          </Typography>
                        )}
                      </Box>
                    )}
                  />

                  {status === 'error' && (
                    <Alert severity="error" sx={{ borderRadius: 1 }}>
                      That didn&apos;t send.{' '}
                      {site.phone
                        ? `Call ${site.phone} and we'll take your details over the phone instead.`
                        : `Email ${site.email} and we'll pick it up from there.`}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={status === 'sending'}
                    endIcon={
                      status === 'sending' ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <SendRoundedIcon />
                      )
                    }
                    sx={{ alignSelf: { sm: 'flex-start' } }}
                  >
                    {status === 'sending' ? 'Sending…' : 'Send'}
                  </Button>
                </Stack>
              )}
            </Box>
          </Reveal>
        </Box>
      </Container>
    </Box>
  );
}

function ContactLine({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Stack
      component="a"
      href={href}
      direction="row"
      spacing={2}
      sx={{
        alignItems: 'center',
        textDecoration: 'none',
        '&:hover .contact-value': { color: 'primary.main' },
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 1,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
          border: '1px solid',
          borderColor: 'divider',
          color: 'primary.main',
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {label}
        </Typography>
        <Typography className="contact-value" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}
