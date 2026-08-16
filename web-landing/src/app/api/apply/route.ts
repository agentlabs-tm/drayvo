import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type Payload = Record<string, unknown>;

const REQUIRED = ['firstName', 'lastName', 'email', 'phone', 'audience'] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Naive in-memory rate limit — swap for Redis/Upstash before production traffic.
const hits = new Map<string, { count: number; reset: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function limited(ip: string) {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (limited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const missing = REQUIRED.filter((k) => !String(body[k] ?? '').trim());
  if (missing.length) {
    return NextResponse.json({ error: `Missing: ${missing.join(', ')}` }, { status: 400 });
  }
  if (!EMAIL_RE.test(String(body.email))) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ error: 'Consent required' }, { status: 400 });
  }

  // TODO(integrate): deliver to the CRM / ATS / email provider — this route
  // currently only logs, so submissions are NOT reaching anyone. Wire this up
  // before the form goes live.
  // TODO(scale): the rate limiter above is in-memory and does not survive
  // serverless instances; move it to Redis/Upstash before production traffic.
  console.info('[drayvo:apply]', {
    audience: body.audience,
    name: `${body.firstName} ${body.lastName}`,
    email: body.email,
    phone: body.phone,
    state: body.state,
    company: body.company,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
