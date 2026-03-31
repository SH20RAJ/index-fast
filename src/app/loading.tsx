"use client";
import React from "react";
import { Box, CircularProgress, Typography, Stack, alpha } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";

export default function Loading() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        gap: 4
      }}
    >
      <Stack spacing={2} alignItems="center">
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "16px",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(124, 58, 237, 0.2)",
            position: "relative"
          }}
        >
          <BoltIcon sx={{ color: "white", fontSize: 32 }} />
          {/* Pulsing ring around the logo */}
          <Box
            sx={{
              position: "absolute",
              top: -8,
              left: -8,
              right: -8,
              bottom: -8,
              borderRadius: "20px",
              border: "2px solid",
              borderColor: "primary.light",
              opacity: 0.3,
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              "@keyframes pulse": {
                "0%": { transform: "scale(1)", opacity: 0.3 },
                "50%": { transform: "scale(1.1)", opacity: 0.1 },
                "100%": { transform: "scale(1)", opacity: 0.3 }
              }
            }}
          />
        </Box>
        
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 800, 
            color: "text.primary",
            fontFamily: '"Outfit", sans-serif'
          }}
        >
          IndexFast
        </Typography>
      </Stack>

      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="indeterminate"
          disableShrink
          size={40}
          thickness={4}
          sx={{
            color: "primary.main",
            animationDuration: "550ms",
            [`& .MuiCircularProgress-circle`]: {
              strokeLinecap: "round",
            },
          }}
        />
      </Box>
      
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          fontFamily: '"Patrick Hand", cursive', 
          fontSize: "1.2rem",
          rotate: "-1deg"
        }}
      >
        Getting things ready...
      </Typography>
    </Box>
  );
}
