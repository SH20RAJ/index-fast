import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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

  const userWebsites = await db
    .select({
      id: websites.id,
      url: websites.url,
      gscConnected: websites.gscConnected,
      sitemapUrl: websites.sitemapUrl,
    })
    .from(websites)
    .where(eq(websites.userId, user.id));

  return <DashboardShell initialWebsites={userWebsites}>{children}</DashboardShell>;
}
