"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PublicIcon from "@mui/icons-material/Public";
import Link from "next/link";

export default function SitesEmptyState() {
  return (
    <Box
      sx={{
        py: 12,
        textAlign: "center",
        bgcolor: "white",
        borderRadius: "32px",
        border: "2px dashed",
        borderColor: "rgba(0,0,0,0.05)",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <PublicIcon sx={{ fontSize: 48, color: "text.secondary", opacity: 0.2 }} />
        <Typography variant="h6" color="text.secondary">
          No websites added yet.
        </Typography>
        <Button
          component={Link}
          href="/sites"
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ borderRadius: "12px", px: 4, py: 1.5 }}
        >
          Add Your First Site
        </Button>
      </Stack>
    </Box>
  );
}