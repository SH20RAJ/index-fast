import { Metadata } from "next";
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
    <div className="relative min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-6 mt-8">
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}