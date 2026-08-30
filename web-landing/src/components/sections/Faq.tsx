'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import { FAQ_GROUPS } from '@/lib/faqs';

export default function Faq() {
  const [tab, setTab] = React.useState(0);
  const group = FAQ_GROUPS[tab];

  return (
    <Section id="faq" tone="raised" maxWidth="lg">
      <SectionHeading
        eyebrow="Straight answers"
        title="The questions worth asking"
        subtitle="Ask any carrier these. Then compare what you hear on the phone with what ends up in the agreement - we say the same thing in both."
      />

      <Box sx={{ mt: { xs: 4, md: 6 }, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tab}
          onChange={(_, v: number) => setTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Questions by audience"
        >
          {FAQ_GROUPS.map((g) => (
            <Tab
              key={g.audience}
              label={g.audience}
              id={`faq-tab-${g.audience}`}
              aria-controls={`faq-panel-${g.audience}`}
            />
          ))}
        </Tabs>
      </Box>

      <Box
        role="tabpanel"
        id={`faq-panel-${group.audience}`}
        aria-labelledby={`faq-tab-${group.audience}`}
        sx={{ mt: 3, display: 'grid', gap: 1.25 }}
      >
        {group.items.map((f) => (
            <Accordion key={f.q} disableGutters elevation={0}>
              <AccordionSummary
                expandIcon={<ExpandMoreRoundedIcon sx={{ color: 'primary.main' }} />}
                sx={{ px: { xs: 2, md: 3 }, py: 1.25 }}
              >
                <Typography
                  component="h3"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 700,
                    fontSize: { xs: '0.98rem', md: '1.05rem' },
                  }}
                >
                  {f.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: { xs: 2, md: 3 }, pb: 2.5, pt: 0 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {f.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
        ))}
      </Box>
    </Section>
  );
}
