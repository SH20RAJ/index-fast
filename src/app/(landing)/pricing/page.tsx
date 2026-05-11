import { Metadata } from "next";
import Pricing from "@/components/landing/Pricing";

export const metadata: Metadata = {
  title: "Pricing - IndexFast",
  description: "Flexible pricing plans to index your website from your AI IDE instantly. Start for free.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return <div className="pt-20"><Pricing /></div>;
}
