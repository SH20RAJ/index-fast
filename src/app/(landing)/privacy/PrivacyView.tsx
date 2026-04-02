"use client";

import { Box, Container, Typography, Stack } from "@/components/ui/mui";
import { alpha } from "@/lib/color";

export default function PrivacyView() {
  const sections = [
    {
      title: "Data We Collect",
      content: "We collect search console data and URL information explicitly provided by you to enable our indexing services. We do not sell or share this data with third parties."
    },
    {
      title: "How We Use Data",
      content: "The data is used solely to facilitate the submission of your content to search engine indexing APIs and to provide status updates in your dashboard."
    },
    {
      title: "Your Rights",
      content: "You have the right to export or delete your account data at any time. We believe in complete transparency regarding your Information."
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: { xs: 10, md: 15 }, flex: 1 }}>
      <Stack spacing={8}>
        <Box>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2 }}>
            Privacy
            <Box component="span" sx={{ color: "primary.main", fontFamily: '"Patrick Hand", cursive', rotate: "3deg", display: "inline-block", ml: 1 }}>Policy</Box>
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
            If you have any questions about our privacy practices, please contact us at support@indexfast.com.
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
