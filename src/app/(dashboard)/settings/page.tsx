import SettingsView from "./SettingsView";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { ensureUserRecord } from "@/lib/db/user-sync";
import { resolvePlanId } from "@/lib/billing/plans";
import { stackServerApp } from "@/stack";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Settings",
  description: "Update your account email and subscription details.",
};

export default function SettingsPage() {
  return <SettingsDataLoader />;
}

async function SettingsDataLoader() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  const synced = await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });
  const [row] = await db.select().from(users).where(eq(users.id, user.id));
  const userRow = row ?? synced;
  const planId = resolvePlanId(userRow.subscriptionStatus, userRow.isPro);

  return <SettingsView initialSettings={userRow} planId={planId} />;
}
