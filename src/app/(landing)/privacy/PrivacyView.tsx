"use client";

import { Box, Chip, Container, Typography, Stack } from "@/components/ui/mui";

export default function PrivacyView() {
  const sections = [
    {
      id: "01",
      title: "Data We Collect",
      summary:
        "We only collect information needed to run indexing workflows and account operations.",
      bullets: [
        "Account details such as email, plan metadata, and billing status.",
        "Website and URL submission data that you explicitly provide.",
        "Integration metadata from connected services like Search Console.",
      ],
    },
    {
      id: "02",
      title: "How We Use Data",
      summary:
        "Your data is used to process submissions, show results, and maintain platform reliability.",
      bullets: [
        "Submit URLs to supported indexing endpoints and APIs.",
        "Display processing logs, indexing status, and dashboard analytics.",
        "Prevent abuse, enforce rate limits, and troubleshoot failed requests.",
      ],
    },
    {
      id: "03",
      title: "Your Rights and Control",
      summary:
        "You remain in control of your data and can request changes at any time.",
      bullets: [
        "Request account data export when you need a full copy.",
        "Request data deletion and account closure through support.",
        "Manage integration permissions and revoke third-party access.",
      ],
    },
  ];

  const lastUpdated = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <Container className="mx-auto w-full max-w-4xl px-4 pb-20 pt-36 sm:px-6 sm:pt-40 lg:px-8 lg:pt-44" sx={{ flex: 1 }}>
      <Stack spacing={6}>
        <Box className="rounded-[28px] border border-primary/20 bg-gradient-to-br from-primary/12 via-background to-background p-6 shadow-[0_20px_60px_-40px_rgba(236,72,153,0.85)] sm:p-8">
          <Stack spacing={2}>
            <Chip className="w-fit border-primary/30 bg-background/70 text-xs font-semibold uppercase tracking-[0.18em] text-foreground" label="Privacy" />
            <Typography variant="h2" className="text-3xl font-black tracking-tight sm:text-4xl">
              Privacy Policy
            </Typography>
            <Typography className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              This policy explains what data IndexFast processes, why it is needed, and how you can control your information.
            </Typography>
            <Typography className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Last updated: {lastUpdated}
            </Typography>
          </Stack>
        </Box>

        <Stack spacing={3}>
          {sections.map((section) => (
            <Box
              key={section.id}
              className="rounded-3xl border border-border/70 bg-card/70 p-5 shadow-[0_16px_42px_-34px_rgba(244,114,182,0.9)] backdrop-blur-sm sm:p-6"
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} className="items-center">
                  <Box className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/12 text-xs font-black text-primary">
                    {section.id}
                  </Box>
                  <Typography variant="h5" className="text-lg font-extrabold tracking-tight sm:text-xl">
                    {section.title}
                  </Typography>
                </Stack>
                <Typography className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {section.summary}
                </Typography>
                <Box component="ul" className="space-y-2 pl-5">
                  {section.bullets.map((item) => (
                    <Box component="li" key={item} className="text-sm leading-relaxed text-foreground/90 sm:text-[0.95rem]">
                      {item}
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>

        <Box className="rounded-3xl border border-dashed border-primary/35 bg-primary/5 p-5 sm:p-6">
          <Typography variant="h6" className="mb-2 text-lg font-extrabold">
            Need Clarification?
          </Typography>
          <Typography className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            For privacy requests or data access inquiries, contact <a href="mailto:support@indexfast.co" className="font-semibold text-primary underline-offset-4 hover:underline">support@indexfast.co</a>.
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
