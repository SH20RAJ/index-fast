import React from "react";
import { Metadata } from "next";
import { Box } from "@mui/material";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PrivacyView from "./PrivacyView";

export const metadata: Metadata = {
  title: "Privacy Policy | IndexFast",
  description: "Learn how IndexFast protects your data and privacy.",
};

export default function PrivacyPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <PrivacyView />
      </Box>
      <Footer />
    </Box>
  );
}
