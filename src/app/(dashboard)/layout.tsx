import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect(stackServerApp.urls.signIn);
  }

  return <DashboardShell>{children}</DashboardShell>;
}
