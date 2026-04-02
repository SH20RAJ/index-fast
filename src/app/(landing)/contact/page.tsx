import { Metadata } from "next";
import ContactForm from "@/components/landing/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the IndexFast team. We'd love to hear from you and answer any questions about our SEO indexing service.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="py-12 px-6 mt-8">
      <ContactForm />
    </div>
  );
}