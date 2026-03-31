import { Metadata } from "next";
import { Box } from "@mui/material";
import Navbar from "@/components/landing/Navbar";
import ContactForm from "@/components/landing/ContactForm";
import Footer from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the IndexFast team. We'd love to hear from you and answer any questions about our SEO indexing service.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Box component="main" sx={{ py: 8, px: 2, mt: 4 }}>
        <ContactForm />
      </Box>
      <Footer />
    </Box>
  );
}