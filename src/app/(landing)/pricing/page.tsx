import { Metadata } from "next";
import Pricing from "@/components/landing/Pricing";

export const metadata: Metadata = {
  title: "Pricing - IndexFast",
  description: "Flexible pricing plans for automated SEO indexing and URL submission.",
  alternates: {
    canonical: "/pricing",
  },
};

export default function PricingPage() {
  return <div className="pt-20"><Pricing /></div>;
}
