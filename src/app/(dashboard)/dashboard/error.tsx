"use client";

import { useEffect } from "react";
import { Box, Button, Container, Stack, Typography } from "@/components/ui/mui";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard page error:", error);
  }, [error]);

  return (
    <Container maxWidth="sm" sx={{ py: 20 }}>
      <Stack spacing={4} alignItems="center" textAlign="center">
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "16px",
            bgcolor: "rgba(239, 68, 68, 0.1)",
            color: "#EF4444",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
          }}
        >
          !
        </Box>
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={800} color="#111827">
            Dashboard failed to load
          </Typography>
          <Typography color="#6B7280" variant="body1">
            {error.message || "An unexpected error occurred while loading your dashboard data."}
          </Typography>
          {error.digest && (
            <Typography variant="caption" sx={{ color: "#9CA3AF", mt: 1 }}>
              Error ID: {error.digest}
            </Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={() => reset()}
            sx={{
              bgcolor: "#111827",
              color: "white",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: "8px",
              "&:hover": { bgcolor: "#1F2937" },
            }}
          >
            Try again
          </Button>
          <Button
            component={Link}
            href="/"
            variant="outlined"
            sx={{
              borderColor: "#E5E7EB",
              color: "#111827",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: "8px",
              "&:hover": { borderColor: "#111827", bgcolor: "transparent" },
            }}
          >
            Back to home
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
