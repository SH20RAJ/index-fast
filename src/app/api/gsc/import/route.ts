import { count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stackServerApp } from "@/stack";
import { ensureUserRecord } from "@/lib/db/user-sync";
import { getSubscriptionSnapshot } from "@/lib/services/subscription-service";
import { importGscSites } from "@/lib/services/gsc-service";
import { db } from "@/lib/db";
import { websites } from "@/lib/db/schema";

export async function POST(request: Request) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("gsc_access_token")?.value;
  if (!accessToken) {
    return NextResponse.json({ error: "Google session expired. Connect again." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const selectedSiteUrls = Array.isArray(body?.selectedSiteUrls)
    ? body.selectedSiteUrls.filter((value: unknown): value is string => typeof value === "string" && value.trim().length > 0)
    : [];

  if (selectedSiteUrls.length === 0) {
    return NextResponse.json({ error: "Select at least one GSC property." }, { status: 400 });
  }

  const { plan } = await getSubscriptionSnapshot(user.id);
  const [{ total: currentCount }] = await db
    .select({ total: count() })
    .from(websites)
    .where(eq(websites.userId, user.id));

  if ((currentCount ?? 0) >= plan.websiteLimit) {
    return NextResponse.json(
      { error: `Your ${plan.name} plan allows up to ${plan.websiteLimit} websites. Upgrade to add more.` },
      { status: 400 }
    );
  }

  const result = await importGscSites(user.id, accessToken, plan.websiteLimit, selectedSiteUrls);

  revalidatePath("/sites");
  revalidatePath("/dashboard");

  return NextResponse.json(result);
}
