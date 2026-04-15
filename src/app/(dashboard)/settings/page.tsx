import SettingsView from "./SettingsView";
import { db } from "@/lib/db";
import { users, type User } from "@/lib/db/schema";
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

  let synced: User | null = null;
  try {
    synced = await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });
  } catch (error) {
    console.error("[settings] Non-fatal user sync failure", error);
  }

  let row: User | null = null;
  try {
    const [selectedRow] = await db.select().from(users).where(eq(users.id, user.id));
    row = selectedRow ?? null;
  } catch (error) {
    console.error("[settings] Non-fatal user fetch failure", error);
  }

  const fallbackUser: User = {
    id: user.id,
    email: user.primaryEmail ?? `${user.id}@indexfast.local`,
    isPro: false,
    dodoSubscriptionId: null,
    dodoCustomerId: null,
    subscriptionStatus: "inactive",
    apiKey: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const userRow = row ?? synced ?? fallbackUser;
  const planId = resolvePlanId(userRow.subscriptionStatus, userRow.isPro);

  return <SettingsView initialSettings={userRow} planId={planId} />;
}
