import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight, CheckCircle2, Clock3, Gauge, Link2, Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export const metadata: Metadata = {
//   title: "How It Works - IndexFast",
//   description:
//     "Learn how IndexFast connects your sitemap, submits fresh URLs to IndexNow and Bing, and tracks indexing outcomes in one workflow.",
//   alternates: {
//     canonical: "/how-it-works",
//   },
// };

import HowItWorksContent from "./HowItWorksContent";

export const metadata: Metadata = {
  title: "How It Works - IndexFast",
  description:
    "Learn how IndexFast connects your sitemap, submits fresh URLs to IndexNow and Bing, and tracks indexing outcomes in one workflow.",
  alternates: {
    canonical: "/how-it-works",
  },
};

export default function HowItWorksPage() {
  return <HowItWorksContent />;
}