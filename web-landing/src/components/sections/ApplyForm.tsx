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
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useColorScheme } from '@mui/material/styles';
import Reveal from '@/components/motion/Reveal';
import { site } from '@/lib/site';
import { onQualifySummary } from '@/lib/qualifyHandoff';
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

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

/**
 * Web3Forms access key.
 *
 * WHY THIS IS A PUBLIC ENV VAR
 * This site is a static export - `output: 'export'` in next.config.ts - so
 * there is no server at runtime to keep a secret on. The form posts straight
 * from the browser to Web3Forms, which is the whole point of the service, and
 * the access key is designed for that: it names a destination inbox and grants
 * no access to the account. Anything genuinely secret must never be given the
 * NEXT_PUBLIC_ prefix, because that inlines it into the client bundle.
 *
 * Read at module scope rather than inside the handler: Next replaces
 * `process.env.NEXT_PUBLIC_*` at build time by literal text substitution, so
 * the full expression has to appear in the source exactly like this.
 */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;

/**
 * hCaptcha site key.
 *
 * Web3Forms publishes a shared key for accounts on the free plan; a paid plan
 * can register its own. It is public by definition - it is read out of the
 * markup by hCaptcha's own script - so the env var is only here so a paid key
 * can replace it without a code change.
 *
 * The captcha must ALSO be switched on for this form in the Web3Forms
 * dashboard. Without that, Web3Forms ignores the token rather than rejecting
 * submissions that lack one, and the widget becomes decoration.
 */
const HCAPTCHA_SITEKEY =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY ?? '50b2fe65-b00b-4b9e-ad62-3ba471098be2';

/** The field name Web3Forms reads the captcha token from. Not arbitrary. */
const HCAPTCHA_FIELD = 'h-captcha-response';

/** The reader's own words for who they are, for the notification email. */
const audienceLabel = (v: Audience) => AUDIENCES.find((a) => a.value === v)?.label ?? v;

export default function ApplyForm() {
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const [fromCheck, setFromCheck] = React.useState(false);

  /**
   * hCaptcha token, plus a handle on the widget so it can be reset.
   *
   * The token is single-use and expires after a couple of minutes, so it is
   * held in state rather than read out of the DOM at submit time, and the
   * widget is reset after every attempt - including failures. Reusing a spent
   * token makes the second attempt fail with a confusing "that didn't send"
   * when the form itself was fine.
   */
  const captchaRef = React.useRef<HCaptcha>(null);
  const [captchaToken, setCaptchaToken] = React.useState('');
  const [captchaError, setCaptchaError] = React.useState(false);
  const scheme = useColorScheme();
  const captchaTheme = (scheme.mode === 'system' ? scheme.systemMode : scheme.mode) ?? 'light';

  const resetCaptcha = React.useCallback(() => {
    setCaptchaToken('');
    captchaRef.current?.resetCaptcha();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    getValues,
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
  /**
   * Watched purely to drive the message label's shrink state. `register` leaves
   * the field uncontrolled, so MUI decides whether to float the label from its
   * own "filled" flag - which only updates on real input events. Text put there
   * by `setValue` (the hand-off from the eligibility check) would otherwise sit
   * underneath an unshrunk label.
   */
  const message = watch('message');

  /**
   * Receives the eligibility check's answers when the reader clicks through
   * from it, so four questions they just answered are not asked again.
   *
   * Written into the visible message field rather than a hidden one: the reader
   * can see exactly what is about to be sent and edit or clear it first, which
   * is what the check's "nothing is submitted, stored, or sent" promise
   * requires. Existing text is preserved rather than overwritten.
   */
  React.useEffect(
    () =>
      onQualifySummary((summary) => {
        const current = getValues('message');
        setValue('message', current ? `${current}\n\n${summary}` : summary, {
          shouldDirty: true,
        });
        setFromCheck(true);
      }),
    [setValue, getValues],
  );

  const onSubmit = async (values: ApplyValues) => {
    if (!WEB3FORMS_KEY) {
      // Nothing to post to. Fail loudly rather than showing a success screen
      // for a submission that went nowhere - a recruiting form that silently
      // drops applications is worse than one that is visibly broken.
      console.error(
        'NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set - the application form cannot submit. ' +
          'See web-landing/.env.example.',
      );
      setStatus('error');
      return;
    }

    if (!captchaToken) {
      // Stop here rather than letting Web3Forms reject it: a server-side
      // rejection surfaces as the generic "that didn't send", which sends the
      // reader to the phone instead of to the one control they had not touched.
      setCaptchaError(true);
      return;
    }

    setStatus('sending');
    try {
      /**
       * FormData, not JSON, and deliberately so.
       *
       * A JSON body needs a `Content-Type: application/json` header, which
       * makes the request non-simple and triggers a CORS preflight. Web3Forms
       * does not answer the preflight, so the POST is blocked in the browser
       * before it is ever sent and the form fails for every visitor.
       *
       * FormData sends multipart/form-data with no custom headers - a simple
       * request, no preflight. Do not "tidy" this into fetch + JSON.
       */
      const body = new FormData();
      body.append('access_key', WEB3FORMS_KEY);
      /**
       * The subject is what the recruiter sees in their inbox list, so it
       * carries the two things that decide whether to open it now: who is
       * writing and what they are. Without this every application arrives
       * titled "New Submission".
       */
      body.append('subject', `${audienceLabel(values.audience)} enquiry - ${values.name}`);
      body.append('from_name', site.name);
      /** Lets the recruiter hit reply and reach the applicant directly. */
      if (values.email) body.append('replyto', values.email);
      // Flat, human-readable field names: these become the email's labels.
      body.append('name', values.name);
      body.append('phone', values.phone);
      if (values.email) body.append('email', values.email);
      body.append('I am a', audienceLabel(values.audience));
      if (values.message) body.append('message', values.message);
      body.append('consent', values.consent ? 'Yes - agreed to be contacted' : 'No');
      // Web3Forms' honeypot: a bot that fills every field trips it.
      body.append('botcheck', '');
      body.append(HCAPTCHA_FIELD, captchaToken);

      const res = await fetch(WEB3FORMS_ENDPOINT, { method: 'POST', body });

      // Web3Forms answers 200 with `{ success: false }` for a rejected
      // submission - a bad key, a disabled form - so the status code alone is
      // not enough to call this sent.
      const data: { success?: boolean; message?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.message ?? `Web3Forms rejected the submission (${res.status})`);
      }

      setStatus('sent');
      reset();
      // The carried-over answers are gone with the reset, so the notice about
      // them must go too - otherwise "Send another" starts on an empty field
      // that still claims to hold the check's results.
      setFromCheck(false);
    } catch (err) {
      console.error('Application submission failed:', err);
      setStatus('error');
    } finally {
      // Always, on both paths. The token is spent the moment Web3Forms
      // verifies it, so leaving it in state would make a retry after a failure
      // fail again for a different reason than the first attempt did.
      resetCaptcha();
    }
  };

  return (
    <Box
      component="section"
      id="apply"
      sx={{
        bgcolor: 'background.default',
        py: { xs: 7, sm: 9, md: 14 },
        scrollMarginTop: { xs: 76, md: 96 },
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
                            // `minmax(0, 1fr)`, not `1fr`: a grid track's
                            // default `auto` minimum is the widest label, which
                            // pushed the group past the card at 320px.
                            gridTemplateColumns: {
                              xs: 'repeat(2, minmax(0, 1fr))',
                              md: 'repeat(4, minmax(0, 1fr))',
                            },
                            '& .MuiToggleButton-root': {
                              borderRadius: '6px !important',
                              border: '1px solid !important',
                              borderColor: 'divider !important',
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: { xs: '0.8rem', sm: '0.85rem' },
                              lineHeight: 1.3,
                              // Even at 0.8rem "Shipper / broker" needs to wrap
                              // in a 120px track; the floor keeps all four the
                              // same height and comfortably tappable.
                              minHeight: 48,
                              px: 1,
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
                      // `type` alone leaves Android on an alphanumeric keypad;
                      // `inputMode="tel"` is what actually selects the dial pad.
                      slotProps={{ htmlInput: { inputMode: 'tel', autoCapitalize: 'off' } }}
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
                      // Stops iOS capitalising the first letter of an address
                      // and offering autocorrect on a domain name.
                      slotProps={{
                        htmlInput: {
                          inputMode: 'email',
                          autoCapitalize: 'off',
                          autoCorrect: 'off',
                          spellCheck: false,
                        },
                      }}
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
                    // Grows once the check's answers land, so the reader can see
                    // the whole of what they are about to send without scrolling
                    // inside a three-row box.
                    maxRows={12}
                    // `undefined`, not `false`, when empty: that hands the
                    // decision back to MUI's default focus behaviour.
                    slotProps={{ inputLabel: { shrink: message ? true : undefined } }}
                    helperText={
                      fromCheck
                        ? 'Your answers from the two-minute check were added here. Edit or delete them before sending.'
                        : undefined
                    }
                    {...register('message')}
                  />

                  <Controller
                    name="consent"
                    control={control}
                    rules={{ required: 'Please confirm you agree to be contacted' }}
                    render={({ field, fieldState }) => (
                      <Box>
                        <FormControlLabel
                          control={<Checkbox {...field} checked={field.value} />}
                          label={
                            /* TODO(legal): replace with consent language reviewed by counsel,
                               covering TCPA requirements for SMS and autodialled calls. */
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              I agree that {site.name} may contact me by phone, text, or email about
                              this enquiry. Message and data rates may apply, and I can opt out at
                              any time.
                            </Typography>
                          }
                          /**
                           * `pt: 0` aligns the box with the first line of the
                           * consent text, but zeroing only the top padding left
                           * the control 42x33 - under any touch-target floor.
                           * The height is put back as a minimum on the control
                           * itself, which keeps the alignment and the target.
                           */
                          sx={{
                            alignItems: 'flex-start',
                            m: 0,
                            '& .MuiCheckbox-root': { pt: 0, minHeight: 44, alignItems: 'flex-start' },
                          }}
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

                  {/*
                    Sits immediately above the send button, which is where a
                    reader looks last. `key` on the theme forces a remount when
                    the colour scheme flips - hCaptcha reads its theme once at
                    render and will not restyle an existing widget, so without
                    this a light widget stays behind on the dark page.
                  */}
                  <Box sx={{ '& iframe': { colorScheme: 'normal' } }}>
                    <HCaptcha
                      key={captchaTheme}
                      ref={captchaRef}
                      sitekey={HCAPTCHA_SITEKEY}
                      theme={captchaTheme}
                      onVerify={(token) => {
                        setCaptchaToken(token);
                        setCaptchaError(false);
                      }}
                      onExpire={resetCaptcha}
                      onError={resetCaptcha}
                    />
                    {captchaError && (
                      <Typography
                        variant="caption"
                        role="alert"
                        sx={{ color: 'error.main', display: 'block', mt: 1 }}
                      >
                        Please complete the captcha so we know you are a person.
                      </Typography>
                    )}
                  </Box>

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
                    // Full width on phones - it is the section's only action and
                    // the thumb should not have to find it. Content-width from
                    // `sm`, where a button spanning the card reads as a banner.
                    sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
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
        minHeight: 44,
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
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {label}
        </Typography>
        <Typography
          className="contact-value"
          sx={{
            color: 'text.primary',
            fontWeight: 600,
            // `contact@drayvologistics.com` has no break opportunity of its
            // own and is ~215px at this weight - it has to be allowed to
            // break anywhere rather than widen the column past a 320px screen.
            overflowWrap: 'anywhere',
            fontSize: { xs: '0.95rem', sm: '1rem' },
          }}
        >
          {value}
        </Typography>
      </Box>
    </Stack>
  );
}
