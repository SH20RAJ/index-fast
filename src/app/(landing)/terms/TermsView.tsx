"use client";

import { Box, Container, Typography, Stack, alpha } from "@mui/material";

export default function TermsView() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using IndexFast, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services."
    },
    {
      title: "2. Description of Service",
      content: "IndexFast provides automated URL submission and SEO indexing tools. We facilitate communication with search engine APIs but do not guarantee specific ranking results or indexing speed, as these are controlled by third-party search engines."
    },
    {
      title: "3. User Responsibilities",
      content: "You are responsible for the URLs you submit. You must not use our service for spam, illegal content, or to violate the terms of service of search engines (e.g., Google or Bing)."
    },
    {
      title: "4. Account & Data",
      content: "You are responsible for maintaining the security of your account. We reserve the right to suspend accounts that engage in abusive behavior or exceed their plan limits."
    },
    {
      title: "5. Payments & Refunds",
      content: "Subscriptions are billed in advance. Refunds are handled on a case-by-case basis in accordance with our billing provider's policies. You can cancel your subscription at any time via the dashboard."
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: { xs: 10, md: 15 }, flex: 1 }}>
      <Stack spacing={8}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2 }}>
            Terms of
            <Box component="span" sx={{ color: "primary.main", fontFamily: '"Patrick Hand", cursive', rotate: "3deg", display: "inline-block", ml: 1 }}>Service</Box>
          </Typography>
          <Typography color="text.secondary">
            Last updated: {new Date().toLocaleDateString()}
          </Typography>
        </Box>

        <Stack spacing={4}>
          {sections.map((section) => (
            <Box key={section.title}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: "text.primary" }}>
                {section.title}
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                {section.content}
              </Typography>
            </Box>
          ))}
        </Stack>

        <Box sx={{ p: 4, borderRadius: "24px", bgcolor: alpha("#7C3AED", 0.05), border: "1px dashed", borderColor: "primary.main" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Questions?</Typography>
          <Typography color="text.secondary">
            If you have any questions about these Terms, please contact us at support@indexfast.com.
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
