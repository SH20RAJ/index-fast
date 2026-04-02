
import { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import PrivacyView from "./PrivacyView";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how IndexFast protects your data and privacy.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <PrivacyView />
      </main>
      <Footer />
    </div>
  );
}
