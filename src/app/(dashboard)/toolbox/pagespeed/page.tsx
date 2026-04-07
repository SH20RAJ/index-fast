import { Metadata } from "next";
import PageSpeedView from "./PageSpeedView";

export const metadata: Metadata = {
  title: "PageSpeed Insights - IndexFast",
  description: "Analyze your website performance, accessibility, and SEO metrics using Google Lighthouse diagnostics.",
};

export default function PageSpeedPage() {
  return <PageSpeedView />;
}
