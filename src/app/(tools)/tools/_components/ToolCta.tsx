"use client";

import Link from "next/link";
import { Box, Button, Stack, Typography } from "@/components/ui/mui";
import { useStackApp, useUser } from "@stackframe/stack";

interface ToolCtaProps {
  primaryText: string;
  secondaryText: string;
}

export default function ToolCta({ primaryText, secondaryText }: ToolCtaProps) {
  const stack = useStackApp();
  const user = useUser();

  return (
    <Box
      sx={{
        border: "1px solid rgba(124, 58, 237, 0.18)",
        borderRadius: 4,
        p: { xs: 3, md: 4 },
        background: "linear-gradient(140deg, rgba(124,58,237,0.08), rgba(250,204,21,0.08))",
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h5" fontWeight={800} color="text.primary">
          {primaryText}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {secondaryText}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          {user ? (
            <Button variant="contained" component={Link} href="/dashboard">
              Open Dashboard
            </Button>
          ) : (
            <Button variant="contained" onClick={() => stack.redirectToSignUp()}>
              Create Free Account
            </Button>
          )}
          <Button variant="outlined" component={Link} href="/#pricing">
            View Pro Plans
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}