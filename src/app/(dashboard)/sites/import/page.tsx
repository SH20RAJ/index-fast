import GscImportView from "./GscImportView";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { resolvePlanId, PLAN_DEFINITIONS } from "@/lib/billing/plans";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Import Properties - Google Search Console",
  description: "Select the properties you want to import from your Google Search Console account.",
};

export default async function GscImportPage() {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect("/handler/sign-in");
  }

  const [userRow] = await db.select().from(users).where(eq(users.id, user.id));
  if (!userRow) {
     redirect("/sites");
  }

  const planId = resolvePlanId(userRow.subscriptionStatus, userRow.isPro);
  const planName = PLAN_DEFINITIONS[planId].name;

  return <GscImportView planName={planName} />;
}
