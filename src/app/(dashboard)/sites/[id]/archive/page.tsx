import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { stackServerApp } from "@/stack";
import { ensureUserRecord } from "@/lib/db/user-sync";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";
import SiteArchiveView from "./SiteArchiveView";

export const metadata = {
  title: "Archive Submission",
  description: "Submit your website to the Wayback Machine archive.",
};

export default async function SiteArchivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in?after_auth_return_to=" + encodeURIComponent(`/sites/${id}/archive`));
  }

  await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });

  const [site] = await db
    .select({ id: websites.id, url: websites.url })
    .from(websites)
    .where(and(eq(websites.id, id), eq(websites.userId, user.id)))
    .limit(1);

  if (!site) {
    redirect("/sites");
  }

  return <SiteArchiveView id={id} url={site.url} />;
}
