import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getDodoClient, getDodoReturnUrl, toAbsoluteUrl } from "@/lib/payments/dodo";
import { ensureUserRecord } from "@/lib/db/user-sync";
import { stackServerApp } from "@/stack";

export async function GET() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });

  const [userRow] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  const customerId = userRow?.dodoCustomerId;

  if (!customerId) {
    return NextResponse.json(
      { error: "Customer portal unavailable. Complete a paid checkout first." },
      { status: 400 }
    );
  }

  const client = getDodoClient();
  const portalSession = await client.customers.customerPortal.create(customerId, {
    return_url: toAbsoluteUrl(getDodoReturnUrl()),
  });

  return NextResponse.redirect(portalSession.link, { status: 302 });
}
