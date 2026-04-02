import type { Metadata } from "next";
import Link from "next/link";
import { Box, Button, Container, Stack, Typography } from "@/components/ui/mui";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are offline right now. Reconnect to continue using IndexFast.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", bgcolor: "background.default" }}>
      <Container maxWidth="sm">
        <Stack spacing={2.5}>
          <Typography variant="h3" fontWeight={900}>
            You are offline
          </Typography>
          <Typography color="text.secondary">
            Your connection dropped. Reconnect to continue sitemap syncs, submissions, and dashboard actions.
          </Typography>
          <Box>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button variant="contained">Try again</Button>
            </Link>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}