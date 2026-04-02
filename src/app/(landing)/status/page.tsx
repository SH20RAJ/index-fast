
import { Metadata } from "next";
import StatusView from "./StatusView";

export const metadata: Metadata = {
  title: "System Status",
  description: "Check the real-time status of IndexFast services and APIs.",
  alternates: {
    canonical: "/status",
  },
};

export default function StatusPage() {
  return <StatusView />;
}
