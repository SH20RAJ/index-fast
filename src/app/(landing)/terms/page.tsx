import { Metadata } from "next";
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
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <TermsView />
      </main>
      <Footer />
    </div>
  );
}
