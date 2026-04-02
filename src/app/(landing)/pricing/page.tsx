import { Metadata } from "next";
import { Box } from "@mui/material";
import Navbar from "@/components/landing/Navbar";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Pricing - IndexFast",
  description: "Flexible pricing plans for automated SEO indexing and URL submission.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <Pricing />
      </Box>
      <Footer />
    </Box>
  );
}
