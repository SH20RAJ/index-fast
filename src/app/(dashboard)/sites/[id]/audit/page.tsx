import SiteAuditView from "./SiteAuditView";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack";
import { ensureUserRecord } from "@/lib/db/user-sync";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import type { AuditIssue } from "@/components/dashboard/AuditPanel";

interface SiteAuditInitialData {
  id: string;
  url: string;
  siteHealth?: {
    score: number;
    issues: AuditIssue[];
  };
}

export default async function SiteAuditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in?after_auth_return_to=" + encodeURIComponent(`/sites/${id}/audit`));
  }

  await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });

  const [site] = await db
    .select({ id: websites.id, url: websites.url, siteHealth: websites.siteHealth })
    .from(websites)
    .where(and(eq(websites.id, id), eq(websites.userId, user.id)))
    .limit(1);

  const initialSite: SiteAuditInitialData | null = site
    ? {
        id: site.id,
        url: site.url,
        siteHealth: site.siteHealth as SiteAuditInitialData["siteHealth"],
      }
    : null;

  return <SiteAuditView id={id} initialSite={initialSite} />;
}
