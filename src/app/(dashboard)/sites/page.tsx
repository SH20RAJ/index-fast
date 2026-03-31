import SitesView from "./SitesView";
import { db } from "@/lib/db";
import { users, websites } from "@/lib/db/schema";
import { ensureUserRecord } from "@/lib/db/user-sync";
import { PLAN_DEFINITIONS, resolvePlanId } from "@/lib/billing/plans";
import { stackServerApp } from "@/stack";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Websites",
  description: "Manage your tracked sites and trigger manual indexing.",
};

export default function SitesPage() {
  return <SitesDataLoader />;
}

async function SitesDataLoader() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  const synced = await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });
  const [userRow] = await db.select().from(users).where(eq(users.id, user.id));

  const planId = resolvePlanId((userRow ?? synced).subscriptionStatus, (userRow ?? synced).isPro);
  const sites = await db
    .select()
    .from(websites)
    .where(eq(websites.userId, user.id))
    .orderBy(desc(websites.createdAt));

  return (
    <SitesView
      initialSites={sites}
      planName={PLAN_DEFINITIONS[planId].name}
      websiteLimit={PLAN_DEFINITIONS[planId].websiteLimit}
    />
  );
}
