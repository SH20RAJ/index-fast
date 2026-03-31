import React from "react";
import { Metadata } from "next";
import { Box } from "@mui/material";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StatusView from "./StatusView";

export const metadata: Metadata = {
  title: "System Status | IndexFast",
  description: "Check the real-time status of IndexFast services and APIs.",
};

export default function StatusPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <StatusView />
      </Box>
      <Footer />
    </Box>
  );
}
