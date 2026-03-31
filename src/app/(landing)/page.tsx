import * as React from "react";
import { Box } from "@mui/material";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {/* Background Decor */}
      <Box className="grid-overlay" />
      
      {/* Page Content */}
      <Navbar />
      <Box component="main">
        <Hero />
        <Features />
        <Pricing />
      </Box>
      <Footer />
    </Box>
  );
}
