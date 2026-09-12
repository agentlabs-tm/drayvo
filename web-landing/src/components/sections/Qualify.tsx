'use client';

import * as React from 'react';
import { Box, Button, LinearProgress, Stack, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import PhoneInTalkRoundedIcon from '@mui/icons-material/PhoneInTalkRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { alpha } from '@mui/material/styles';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { brand } from '@/theme/tokens';
import { site } from '@/lib/site';
import { publishQualifySummary } from '@/lib/qualifyHandoff';

/**
 * Instant eligibility check.
 *
 * Recruiting funnels lose drivers to uncertainty: people who would qualify do
 * not apply, and people who would not spend a week waiting to be told no. Four
 * questions and an immediate, honest answer fixes both ends.
 *
 * The outcome is deliberately three-way rather than pass/fail - "worth a
 * conversation" is the truthful answer for most edge cases, and routing those
 * to a phone call rather than a form is what actually converts them.
 *
 * TODO(verify): confirm these thresholds against Drayvo's real insurance and
 * safety requirements. The gating here must match what recruiting actually
 * applies, or the check becomes another broken promise.
 */
type Outcome = 'strong' | 'talk' | 'not-yet';

type Question = {
  id: string;
  prompt: string;
  /** Short form of the prompt, used when the answers travel to the form. */
  short: string;
  options: { label: string; outcome: Outcome }[];
};

const QUESTIONS: Question[] = [
  {
    id: 'cdl',
    prompt: 'Do you hold a valid Class A CDL?',
    short: 'Class A CDL',
    options: [
      { label: 'Yes', outcome: 'strong' },
      { label: 'In school now', outcome: 'talk' },
      { label: 'No', outcome: 'not-yet' },
    ],
  },
  {
    id: 'experience',
    prompt: 'How much verifiable OTR experience do you have?',
    short: 'Verifiable OTR experience',
    options: [
      { label: '1 year or more', outcome: 'strong' },
      { label: '6–12 months', outcome: 'strong' },
      { label: 'Under 6 months', outcome: 'talk' },
      { label: 'None yet', outcome: 'not-yet' },
    ],
  },
  {
    id: 'violations',
    prompt: 'Moving violations in the last three years?',
    short: 'Moving violations (last 3 years)',
    options: [
      { label: 'None', outcome: 'strong' },
      { label: 'One or two', outcome: 'talk' },
      { label: 'Three or more', outcome: 'not-yet' },
    ],
  },
  {
    id: 'dui',
    prompt: 'Any DUI or DWI in the last five years?',
    short: 'DUI or DWI (last 5 years)',
    options: [
      { label: 'No', outcome: 'strong' },
      { label: 'Yes', outcome: 'not-yet' },
    ],
  },
];

const RESULTS: Record<
  Outcome,
  {
    title: string;
    body: string;
    tone: 'good' | 'neutral';
    cta: { label: string; href: string; icon: React.ReactNode };
  }
> = {
  strong: {
    title: 'You meet what we ask',
    body: 'On these four points you are exactly who we are looking for. Start an application and a person will pick it up from there - nothing about your answers here is stored or sent until you do.',
    tone: 'good',
    cta: { label: 'Start your application', href: '#apply', icon: <ArrowForwardRoundedIcon /> },
  },
  talk: {
    title: 'Worth a conversation',
    body: 'One of your answers sits outside our standard requirements, which is not the same as a no. These are the cases we look at individually rather than filter out, so get in touch and we will tell you straight where you stand.',
    tone: 'neutral',
    // This is the one outcome where a call beats a form: the reader has been
    // told their situation is a judgement call, and a form reply cannot make a
    // judgement. Falls back to the form if the number is ever cleared.
    cta: site.phone
      ? {
          label: `Call ${site.phone}`,
          href: `tel:${site.phoneHref}`,
          icon: <PhoneInTalkRoundedIcon />,
        }
      : { label: 'Talk to us', href: '#apply', icon: <PhoneInTalkRoundedIcon /> },
  },
  'not-yet': {
    title: 'Not right now - here is why',
    body: 'Based on your answers we would not be able to place you today, and we would rather say so than run you through a process that ends in no. Requirements change as you gain experience or time passes on your record. Keep us in mind.',
    tone: 'neutral',
    cta: { label: 'See what we ask for', href: '#drivers', icon: <ArrowForwardRoundedIcon /> },
  },
};

const RANK: Record<Outcome, number> = { strong: 0, talk: 1, 'not-yet': 2 };

export default function Qualify() {
  const reduce = useReducedMotion();
  const [step, setStep] = React.useState(0);
  // The chosen label is kept alongside the outcome so the answers can travel to
  // the application form; the outcome alone would only say "strong", not "1 year
  // or more", which is the part a recruiter can act on.
  const [answers, setAnswers] = React.useState<{ label: string; outcome: Outcome }[]>([]);
  const liveRef = React.useRef<HTMLDivElement>(null);

  const done = step >= QUESTIONS.length;
  const progress = (Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100;

  // The worst individual answer decides the outcome - one disqualifier is not
  // averaged away by three good answers.
  const outcome: Outcome = answers.reduce<Outcome>(
    (worst, a) => (RANK[a.outcome] > RANK[worst] ? a.outcome : worst),
    'strong'
  );

  const choose = (label: string, o: Outcome) => {
    setAnswers((prev) => [...prev, { label, outcome: o }]);
    setStep((s) => s + 1);
  };

  /**
   * Hands the answers to the application form. Fired only from the result's
   * call to action - an affirmative click - and only when that action leads to
   * the form. Nothing leaves this component otherwise.
   */
  const handOff = () => {
    const lines = answers.map((a, i) => `- ${QUESTIONS[i].short}: ${a.label}`);
    publishQualifySummary(`From the two-minute check:\n${lines.join('\n')}`);
  };

  const restart = () => {
    setAnswers([]);
    setStep(0);
  };

  const result = RESULTS[outcome];
  const question = QUESTIONS[step];

  return (
    <Section id="qualify" tone="contrast">
      {/*
        Two columns, not one.
        The heading and the card were both left-aligned inside a 1440px
        container - the heading capped at 780 and the card at 720 - so the
        entire right half of the section was empty. It read as a layout that
        had lost something rather than one with room to breathe.

        The left column now carries the heading and a rail listing what the
        check actually covers, which is real content rather than filler: the
        four items are the four questions, and they mark off as they are
        answered. A reader can see the whole scope before starting, and see
        their own answers without scrolling back.
      */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '0.85fr 1.15fr' },
          gap: { xs: 5, lg: 10 },
          alignItems: 'start',
        }}
      >
        <Box sx={{ position: { lg: 'sticky' }, top: { lg: 108 } }}>
          <SectionHeading
            index="05"
            label="Two-minute check"
            title="Find out where you stand before you apply."
            lead="Four questions, an honest answer, and nothing recorded. We would rather you know now than wait a week to hear it."
          />
          <QualifyRail step={step} answers={answers} done={done} />
        </Box>

        <Box
          sx={{
            border: '1px solid',
            borderColor: 'var(--hairline)',
            borderRadius: 1.5,
            bgcolor: 'var(--surface-panel)',
            overflow: 'hidden',
          }}
        >
        <Box sx={{ px: { xs: 2.5, md: 4 }, pt: { xs: 2.5, md: 3 } }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="overline" sx={{ color: 'text.secondary' }}>
              {done ? 'Result' : `Question ${step + 1} of ${QUESTIONS.length}`}
            </Typography>
            {!done && (
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                {Math.round(progress)}%
              </Typography>
            )}
          </Stack>
          <LinearProgress
            variant="determinate"
            value={done ? 100 : progress}
            aria-label="Eligibility check progress"
            sx={{
              height: 3,
              borderRadius: 2,
              bgcolor: 'var(--hairline)',
              '& .MuiLinearProgress-bar': {
                bgcolor: 'primary.main',
                transition: 'transform .5s ease',
              },
            }}
          />
        </Box>

        <Box
          ref={liveRef}
          aria-live="polite"
          sx={{ px: { xs: 2.5, md: 4 }, py: { xs: 3, md: 4 }, minHeight: { xs: 260, md: 240 } }}
        >
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={question.id}
                initial={reduce ? false : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -24 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              >
                <Typography
                  variant="h4"
                  component="h3"
                  sx={{ color: 'text.primary', fontSize: { xs: '1.3rem', md: '1.55rem' } }}
                >
                  {question.prompt}
                </Typography>

                <Stack
                  component="ul"
                  aria-label={question.prompt}
                  spacing={1.25}
                  sx={{ mt: 3, listStyle: 'none', p: 0, m: 0 }}
                >
                  {question.options.map((opt) => (
                    <Box component="li" key={opt.label} sx={{ display: 'flex' }}>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => choose(opt.label, opt.outcome)}
                        sx={{
                          width: '100%',
                          textAlign: 'left',
                          font: 'inherit',
                          cursor: 'pointer',
                          px: 2.25,
                          py: 1.6,
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          bgcolor: 'transparent',
                          color: 'text.primary',
                          fontWeight: 600,
                          transition:
                            'border-color .18s ease, background-color .18s ease, transform .18s ease',
                          '&:hover': {
                            borderColor: 'primary.main',
                            bgcolor: alpha(brand.orange, 0.07),
                            transform: reduce ? 'none' : 'translateX(3px)',
                          },
                        }}
                      >
                        {opt.label}
                      </Box>
                    </Box>
                  ))}
                </Stack>

                {step > 0 && (
                  <Button
                    onClick={() => {
                      setAnswers((p) => p.slice(0, -1));
                      setStep((s) => s - 1);
                    }}
                    sx={{ mt: 2, px: 0, color: 'text.secondary' }}
                  >
                    Back
                  </Button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                  {result.tone === 'good' ? (
                    <CheckCircleRoundedIcon
                      sx={{ color: 'success.main', fontSize: 30, mt: '2px' }}
                    />
                  ) : (
                    <InfoOutlinedIcon sx={{ color: 'primary.main', fontSize: 30, mt: '2px' }} />
                  )}
                  <Box>
                    <Typography
                      variant="h4"
                      component="h3"
                      sx={{ color: 'text.primary', fontSize: { xs: '1.35rem', md: '1.6rem' } }}
                    >
                      {result.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', mt: 1.5, maxWidth: 520 }}
                    >
                      {result.body}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3.5 }}>
                  <Button
                    href={result.cta.href}
                    variant="contained"
                    endIcon={result.cta.icon}
                    // Only the routes that end at the form carry the answers.
                    onClick={result.cta.href === '#apply' ? handOff : undefined}
                  >
                    {result.cta.label}
                  </Button>
                  <Button
                    onClick={restart}
                    startIcon={<RestartAltRoundedIcon />}
                    sx={{ color: 'text.secondary' }}
                  >
                    Start over
                  </Button>
                </Stack>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            px: { xs: 2.5, md: 4 },
            py: 2,
            borderTop: '1px solid',
            borderColor: 'var(--hairline)',
            color: 'text.secondary',
          }}
        >
          This runs entirely in your browser. Nothing is submitted, stored, or sent to us.
        </Typography>
        </Box>
      </Box>
    </Section>
  );
}

/**
 * The scope of the check, listed beside it.
 *
 * Desktop only. On a phone the card is the full width of the column and
 * carries its own "Question 2 of 4" and progress bar, so a second progress
 * indicator underneath the heading would be saying the same thing twice. The
 * rail exists because the wide layout has a column to fill and this is the
 * most useful thing that can go in it - not as decoration.
 */
function QualifyRail({
  step,
  answers,
  done,
}: {
  step: number;
  answers: { label: string; outcome: Outcome }[];
  done: boolean;
}) {
  return (
    <Box
      aria-hidden
      sx={{ display: { xs: 'none', lg: 'block' }, mt: 5, borderTop: '1px solid', borderColor: 'var(--hairline)' }}
    >
      {QUESTIONS.map((q, i) => {
        const answer = answers[i];
        const current = !done && i === step;
        return (
          <Stack
            key={q.id}
            direction="row"
            spacing={2}
            sx={{
              py: 1.75,
              alignItems: 'baseline',
              borderBottom: '1px solid',
              borderColor: 'var(--hairline)',
              // Answered items recede; the current one is the only thing at
              // full strength, so the eye lands on where the reader is.
              opacity: answer ? 0.85 : current ? 1 : 0.45,
              transition: 'opacity .25s ease',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: answer || current ? 'primary.main' : 'text.secondary',
                minWidth: 22,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </Typography>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2"
                sx={{ color: 'text.primary', fontWeight: current ? 700 : 500 }}
              >
                {q.short}
              </Typography>
              {answer && (
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  {answer.label}
                </Typography>
              )}
            </Box>
          </Stack>
        );
      })}
    </Box>
  );
}
