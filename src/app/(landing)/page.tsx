import { Metadata } from "next";
import { Box } from "@mui/material";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import FreeTools from "@/components/landing/FreeTools";
import BlogSection from "@/components/landing/BlogSection";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "IndexFast - Automated SEO Indexing & URL Submission",
  description: "Stop waiting for Google to crawl your site. IndexFast submits your URLs to Google, Bing, and IndexNow instantly for faster ranking and better SEO.",
  alternates: {
    canonical: "/",
  },
};

export default function LandingPage() {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Box component="main">
        <Hero />
        <HowItWorks />
        <Features />
        <FreeTools />
        <BlogSection />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </Box>
      <Footer />
    </Box>
  );
}
