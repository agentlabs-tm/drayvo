/**
 * FAQ copy, grouped by audience. Shared between the FAQ section and the
 * server-rendered FAQPage structured data.
 *
 * Answers describe process and policy, not performance. Where a number would
 * normally appear (pay rate, response time, fleet size, on-time percentage) the
 * answer explains the mechanism instead — those figures are unverified, and the
 * FAQ is exactly where an unverifiable claim does the most damage, because
 * search engines surface it as an answer.
 *
 * TODO(verify): add confirmed specifics (pay structure, benefit eligibility,
 * equipment, insurance limits, service area) once the company can stand behind
 * them, each with its conditions stated in the same answer.
 */
export type FaqGroup = {
  audience: string;
  items: { q: string; a: string }[];
};

export const FAQ_GROUPS: FaqGroup[] = [
  {
    audience: 'Drivers',
    items: [
      {
        q: 'How do I know what a load pays before I take it?',
        a: 'You see the rate on the load before you accept it — that is the first commitment in The Drayvo Standard and it applies to company drivers and owner-operators alike. If a load is offered without a rate attached, that is a mistake on our side and you should say so.',
      },
      {
        q: 'How is my pay calculated, and when do I get it?',
        a: 'Your pay structure is set out in writing before you accept an offer, and the pay calendar is explained at the same time. Settlements are itemized: linehaul, accessorials, and every deduction on its own line. We do not publish a headline rate on this page because pay varies by lane and experience, and a number without its conditions is not useful to you.',
      },
      {
        q: 'What gets deducted from my settlement?',
        a: 'Whatever applies to your agreement — items such as escrow, insurance, or fuel advances — and all of it is disclosed before you start rather than discovered later. Each deduction appears as its own line with a description. If a line does not make sense, call your dispatcher and we will walk through it.',
      },
      {
        q: 'Who do I actually talk to day to day?',
        a: 'One dispatcher, with a name and a direct number. They plan your week and they are the person who answers when you call. You are not routed through a general queue to explain your situation from scratch each time.',
      },
      {
        q: 'What about home time?',
        a: 'We agree your home-time expectation during hiring and plan against it rather than improvising week to week. Tell your recruiter what you need up front. If we cannot schedule it on the lanes we run, we will tell you that instead of promising flexibility we cannot deliver.',
      },
      {
        q: 'Do you hire recent CDL school graduates?',
        a: 'We look for verifiable OTR experience for solo work. If you are newly licensed, tell us anyway and we will be straight with you about whether there is a path right now rather than running you through a process that ends in no.',
      },
    ],
  },
  {
    audience: 'Owner-operators',
    items: [
      {
        q: 'Do you force dispatch?',
        a: 'No. You see the load and the rate and you decide. The point of showing the rate before dispatch is that the decision is genuinely yours.',
      },
      {
        q: 'What do you handle, and what stays with me?',
        a: 'We handle dispatch and load planning, compliance and filings under our operating authority, and the administrative side of running freight. You own and are responsible for your truck. The specific split — including any pass-through costs — is written into your agreement before you start.',
      },
      {
        q: 'How quickly do I get paid?',
        a: 'On a defined settlement schedule that you are told before you start. We hold to the calendar, and if anything about it changes you hear it in advance rather than discovering it on a short week.',
      },
    ],
  },
  {
    audience: 'Fleet owners',
    items: [
      {
        q: 'I own trucks but do not want to run a company. How does that work?',
        a: 'You keep the title. We run the unit under our operating authority and manage the operation around it: driver placement, dispatch, maintenance coordination, fuel strategy, compliance, and reporting. You receive load-level revenue and cost for your truck rather than a monthly summary you have to take on faith.',
      },
      {
        q: 'Is this an investment product?',
        a: 'No. It is a truck management arrangement. You own a physical asset and we operate it for you under a written agreement — there is no pooled fund, no promised return, and no security being offered. Any figures we discuss with you are specific to your truck and your lanes.',
      },
      {
        q: 'What happens when my truck is in the shop?',
        a: 'You are told the day it goes out of service, with the reason and the expected return date, and the maintenance event is documented against the unit. Downtime shows up in your reporting rather than being absorbed quietly into a monthly figure.',
      },
      {
        q: 'How do I know the numbers you report are complete?',
        a: 'Reporting is load-level, so revenue and cost tie back to specific movements you can check rather than to a total you cannot. Ask us for the underlying detail on any line at any time — a management relationship where you cannot audit the reporting is not one worth having.',
      },
    ],
  },
  {
    audience: 'Shippers',
    items: [
      {
        q: 'Are you a carrier or a broker?',
        a: 'A carrier. You are dealing with the company responsible for the truck, not a desk re-posting your load until someone accepts it.',
      },
      {
        q: 'What lanes and equipment can you cover?',
        a: 'Send us the lane and you will get a direct answer on whether we can cover it well, rather than a coverage map that promises more than any carrier delivers on every route. If a lane is not one we run, we will tell you instead of accepting it and sorting it out later.',
      },
      {
        q: 'Who do I contact about a load in progress?',
        a: 'A named person who knows your freight, reachable directly. If a load is running late you should hear it from us before you have to ask.',
      },
    ],
  },
];

/** Flattened for structured data. */
export const FAQS = FAQ_GROUPS.flatMap((g) => g.items);
