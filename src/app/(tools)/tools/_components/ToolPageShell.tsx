import Link from "next/link";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ToolCta from "./ToolCta";

interface ToolPageShellProps {
  badge: string;
  title: string;
  description: string;
  intentKeywords: string[];
  steps: string[];
  faqs: Array<{ question: string; answer: string }>;
}

export default function ToolPageShell({
  badge,
  title,
  description,
  intentKeywords,
  steps,
  faqs,
}: ToolPageShellProps) {
  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Chip
            label={badge}
            sx={{
              alignSelf: "flex-start",
              border: "1px solid rgba(124, 58, 237, 0.2)",
              bgcolor: "rgba(124, 58, 237, 0.07)",
              color: "primary.main",
              fontWeight: 700,
            }}
          />

          <Typography variant="h2" sx={{ maxWidth: 820 }}>
            {title}
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 860, fontWeight: 500 }}>
            {description}
          </Typography>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {intentKeywords.map((keyword) => (
              <Chip key={keyword} label={keyword} size="small" />
            ))}
          </Stack>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {steps.map((step, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={step}>
                <Paper sx={{ p: 2.5, height: "100%", border: "1px solid rgba(124,58,237,0.1)" }}>
                  <Typography variant="overline" color="primary.main" fontWeight={700}>
                    Step {index + 1}
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 0.5, color: "text.primary" }}>
                    {step}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <ToolCta
            primaryText="Run this free tool, then unlock automation"
            secondaryText="Use free checks to find issues in minutes. Create an account to save results, track changes, and automate daily submissions with IndexFast Pro."
          />

          <Paper sx={{ p: { xs: 3, md: 4 }, border: "1px solid rgba(124,58,237,0.1)" }}>
            <Typography variant="h4" fontWeight={800}>
              Frequently Asked Questions
            </Typography>
            <Stack spacing={2.5} sx={{ mt: 3 }}>
              {faqs.map((faq) => (
                <Box key={faq.question}>
                  <Typography variant="h6" fontWeight={700}>
                    {faq.question}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    {faq.answer}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Button variant="contained" component={Link} href="/tools">
              Explore More Free SEO Tools
            </Button>
            <Button variant="outlined" component={Link} href="/contact">
              Request A New Tool
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}