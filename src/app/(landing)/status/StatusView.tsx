"use client";
import React from "react";
import { Box, Container, Typography, Card, Stack, alpha } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function StatusView() {
  const systems = [
    { name: "Indexing API", status: "Operational" },
    { name: "Website Dashboard", status: "Operational" },
    { name: "API Services", status: "Operational" },
    { name: "Search Console Integration", status: "Operational" },
  ];

  return (
    <Container maxWidth="md" sx={{ py: { xs: 10, md: 15 }, flex: 1 }}>
      <Stack spacing={6} alignItems="center">
        <Box textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2 }}>
            System
            <Box component="span" sx={{ color: "primary.main", fontFamily: '"Patrick Hand", cursive', rotate: "-2deg", display: "inline-block", ml: 1 }}>Status</Box>
          </Typography>
          <Typography color="text.secondary">
            Real-time monitoring of all IndexFast services.
          </Typography>
        </Box>

        <Card
          sx={{
            width: "100%",
            p: 4,
            borderRadius: "32px",
            bgcolor: alpha("#10B981", 0.05),
            border: "1px solid",
            borderColor: alpha("#10B981", 0.1),
            display: "flex",
            alignItems: "center",
            gap: 2
          }}
        >
          <CheckCircleOutlineIcon sx={{ color: "#10B981", fontSize: 32 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: "#10B981" }}>
            All Systems Operational
          </Typography>
        </Card>

        <Stack spacing={2} sx={{ width: "100%" }}>
          {systems.map((s) => (
            <Box
              key={s.name}
              sx={{
                p: 3,
                borderRadius: "20px",
                bgcolor: "white",
                border: "1px solid rgba(124, 58, 237, 0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Typography sx={{ fontWeight: 700 }}>{s.name}</Typography>
              <Box
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: "999px",
                  bgcolor: alpha("#10B981", 0.1),
                  color: "#10B981",
                  fontSize: "0.875rem",
                  fontWeight: 700
                }}
              >
                {s.status}
              </Box>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Container>
  );
}
