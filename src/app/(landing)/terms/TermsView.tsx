"use client";

import { Box, Chip, Container, Typography, Stack } from "@/components/ui/mui";

export default function TermsView() {
  const sections = [
    {
      id: "01",
      title: "Acceptance of Terms",
      summary:
        "Using IndexFast means you agree to these terms and any referenced policy updates.",
      bullets: [
        "You must be at least 18 years old or have permission from a legal guardian.",
        "If you disagree with these terms, you should stop using the service.",
        "Continued use after updates means you accept the revised terms.",
      ],
    },
    {
      id: "02",
      title: "Service Scope",
      summary:
        "IndexFast automates URL submission workflows and helps coordinate indexing tasks across supported platforms.",
      bullets: [
        "We provide tooling and automation, not guaranteed ranking positions.",
        "Search engine processing times and results are controlled by third parties.",
        "Feature availability can vary by plan and external API limits.",
      ],
    },
    {
      id: "03",
      title: "User Responsibilities",
      summary:
        "You are responsible for all content and destinations submitted through your account.",
      bullets: [
        "Do not submit spam, malicious, deceptive, or illegal content.",
        "Respect platform policies for Google, Bing, IndexNow, and other integrated services.",
        "Keep credentials secure and promptly report any unauthorized account activity.",
      ],
    },
    {
      id: "04",
      title: "Accounts and Fair Use",
      summary:
        "We may enforce plan limits and service protections to keep the platform reliable for all users.",
      bullets: [
        "Plan quotas and rate limits apply to submitted URLs and API operations.",
        "Accounts using abusive automation patterns may be limited or suspended.",
        "You can request account deletion and data export via support or dashboard settings.",
      ],
    },
    {
      id: "05",
      title: "Billing and Cancellation",
      summary:
        "Paid subscriptions are billed upfront and can be canceled anytime from your account.",
      bullets: [
        "Charges renew automatically unless canceled before the next cycle.",
        "Refund requests are reviewed in line with provider and anti-abuse policies.",
        "Downgrades may reduce feature access at the end of the billing period.",
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
            <Chip className="w-fit border-primary/30 bg-background/70 text-xs font-semibold uppercase tracking-[0.18em] text-foreground" label="Legal" />
            <Typography variant="h2" className="text-3xl font-black tracking-tight sm:text-4xl">
              Terms of Service
            </Typography>
            <Typography className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              These terms explain how to use IndexFast responsibly, what we provide, and how account and billing rules work.
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
            Questions About These Terms?
          </Typography>
          <Typography className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            Contact us at <a href="mailto:support@indexfast.co" className="font-semibold text-primary underline-offset-4 hover:underline">support@indexfast.co</a> and we will help clarify anything related to billing, usage, or account policy.
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
