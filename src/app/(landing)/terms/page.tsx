import { Metadata } from "next";
import { Box } from "@mui/material";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import TermsView from "./TermsView";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the IndexFast Terms of Service and user agreement.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        <TermsView />
      </Box>
      <Footer />
    </Box>
  );
}
