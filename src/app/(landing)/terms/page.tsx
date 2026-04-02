import { Metadata } from "next";
import TermsView from "./TermsView";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the IndexFast Terms of Service and user agreement.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return <TermsView />;
}
