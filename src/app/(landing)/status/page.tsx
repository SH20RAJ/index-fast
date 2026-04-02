
import { Metadata } from "next";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import StatusView from "./StatusView";

export const metadata: Metadata = {
  title: "System Status",
  description: "Check the real-time status of IndexFast services and APIs.",
  alternates: {
    canonical: "/status",
  },
};

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <StatusView />
      </main>
      <Footer />
    </div>
  );
}
