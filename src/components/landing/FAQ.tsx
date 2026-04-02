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
    q: "How fast is indexing?",
    a: "URLs typically get crawled and indexed in 4-24 hours. Without automation, this process can take weeks."
  },
  {
    q: "Is it safe for SEO?",
    a: "Yes. We use official Google and Bing Indexing APIs. This is the recommended method for notifying search engines."
  },
  {
    q: "Do I need to be a developer?",
    a: "No. Our interface is designed for non-technical users. If you can use a browser, you can use IndexFast."
  },
  {
    q: "Can I cancel any time?",
    a: "Yes. We offer monthly billing with no long-term contracts. You can cancel directly from your dashboard."
  },
  {
    q: "What sites are supported?",
    a: "Any site verified in Google Search Console, including WordPress, Shopify, and custom builds."
  }
];

export default function FAQ() {
  return (
    <Box id="faq" sx={{ py: { xs: 8, md: 12 }, bgcolor: "white" }}>
      <Container maxWidth="md">
        <Stack spacing={2} mb={8} textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
            Frequently asked questions
          </Typography>
          <Typography variant="body1" sx={{ color: "#6B7280", maxWidth: "600px", mx: "auto", fontSize: "1.1rem" }}>
            Everything you need to know about safety, setup, and indexing outcomes.
          </Typography>
        </Stack>

        <Stack spacing={1}>
          {faqs.map((faq, idx) => (
            <Accordion
              key={idx}
              elevation={0}
              sx={{
                "&:before": { display: "none" },
                bgcolor: "transparent",
                borderBottom: "1px solid #E5E7EB",
                borderRadius: "0 !important",
                mx: 0,
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: 20, color: "#9CA3AF" }} />}
                sx={{ px: 0, py: 1 }}
              >
                <Typography sx={{ fontWeight: 600, color: "#374151", fontSize: "1.1rem" }}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pb: 4 }}>
                <Typography sx={{ color: "#6B7280", lineHeight: 1.6, maxWidth: "600px" }}>{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
