"use client";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  alpha,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    q: "How long does it take for my pages to get indexed?",
    a: "With IndexFast, we've seen URLs get crawled and indexed in as little as 4-24 hours. Without automation, this process can take weeks."
  },
  {
    q: "Is it safe for my website's SEO?",
    a: "Yes, we use official Google and Bing Indexing APIs. This is the recommended method for notifying search engines about new content."
  },
  {
    q: "Do I need to be a developer to use IndexFast?",
    a: "Not at all. Our interface is designed for non-technical users. If you can copy and paste a URL, you can use IndexFast."
  },
  {
    q: "Can I cancel my subscription any time?",
    a: "Yes, we offer monthly billing with no long-term contracts. You can manage your subscription directly from your dashboard."
  },
  {
    q: "What sites are supported?",
    a: "Any site that is verified in Google Search Console can be indexed through our platform, including WordPress, Shopify, and custom builds."
  }
];

export default function FAQ() {
  return (
    <Box id="faq" sx={{ py: { xs: 10, md: 14 }, bgcolor: "background.paper" }}>
      <Container maxWidth="md">
        <Stack spacing={2} mb={7} textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 900, color: "text.primary", mb: 1 }}>
            Questions teams ask before switching to IndexFast
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.75 }}>
            Straight answers on safety, setup time, and expected indexing outcomes.
          </Typography>
        </Stack>

        <Stack spacing={2}>
          {faqs.map((faq, idx) => (
            <Accordion
              key={idx}
              sx={{
                borderRadius: "24px !important",
                "&:before": { display: "none" },
                bgcolor: "background.default",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 10px 26px rgba(0,0,0,0.28)"
                    : "0 10px 26px rgba(17,24,39,0.06)",
                border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
                mb: 2,
                overflow: "hidden"
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "primary.main" }} />}
                sx={{ px: 4, py: 1 }}
              >
                <Typography sx={{ fontWeight: 700, color: "text.primary" }}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 4, pb: 4 }}>
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
