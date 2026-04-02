"use client";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  alpha,
  useTheme,
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
  const theme = useTheme();
  
  return (
    <Box id="faq" sx={{ py: { xs: 10, md: 16 }, bgcolor: "background.default" }}>
      <Container maxWidth="md">
        <Stack spacing={2} mb={10} alignItems="center" textAlign="center">
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: "99px",
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.text.primary, 0.02),
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", letterSpacing: "0.02em" }}>
              Common Questions
            </Typography>
          </Box>
          <Typography variant="h2" sx={{ fontWeight: 900, color: "text.primary", letterSpacing: "-0.03em" }}>
            Frequently asked questions
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary", maxWidth: "600px", mx: "auto", fontSize: "1.1rem", lineHeight: 1.6 }}>
            Everything you need to know about safety, setup, and indexing outcomes.
          </Typography>
        </Stack>

        <Stack spacing={0}>
          {faqs.map((faq, idx) => (
            <Accordion
              key={idx}
              elevation={0}
              sx={{
                "&:before": { display: "none" },
                bgcolor: "transparent",
                borderBottom: `1px solid ${theme.palette.divider}`,
                borderRadius: "0 !important",
                m: "0 !important",
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: alpha(theme.palette.text.primary, 0.01),
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ fontSize: 20, color: "text.secondary" }} />}
                sx={{ 
                  px: 2, 
                  py: 1,
                  "& .MuiAccordionSummary-content": {
                    my: 2
                  }
                }}
              >
                <Typography sx={{ fontWeight: 800, color: "text.primary", fontSize: "1.1rem", letterSpacing: "-0.01em" }}>{faq.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2, pb: 4 }}>
                <Typography sx={{ color: "text.secondary", lineHeight: 1.6, maxWidth: "700px", fontSize: "1rem" }}>{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
