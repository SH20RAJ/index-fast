import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import type { PlanId } from "@/lib/billing/plans";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { ensureUserRecord } from "@/lib/db/user-sync";
import { getDodoClient, getDodoProductId, getDodoReturnUrl, toAbsoluteUrl } from "@/lib/payments/dodo";
import { eq } from "drizzle-orm";

interface CheckoutRequestBody {
  plan?: PlanId;
}

export async function POST(request: Request) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });

  const body = (await request.json()) as CheckoutRequestBody;
  const plan = body.plan;

  if (!plan || (plan !== "pro" && plan !== "agency")) {
    return NextResponse.json({ error: "Invalid paid plan" }, { status: 400 });
  }

  const productId = getDodoProductId(plan);
  if (!productId) {
    return NextResponse.json(
      { error: `Missing Dodo product id for ${plan}. Set DODO_PRODUCT_ID_${plan.toUpperCase()}.` },
      { status: 500 }
    );
  }

  const [dbUser] = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  const email = dbUser?.email ?? user.primaryEmail ?? `${user.id}@indexfast.local`;

  const client = getDodoClient();
  const response = await client.checkoutSessions.create({
    product_cart: [{ product_id: productId, quantity: 1 }],
    return_url: toAbsoluteUrl(getDodoReturnUrl()),
    customer: {
      email,
      name: email.split("@")[0] || "IndexFast User",
    },
    metadata: {
      stackUserId: user.id,
      planId: plan,
    },
  });

  if (!response.checkout_url) {
    return NextResponse.json({ error: "Could not create checkout URL." }, { status: 502 });
  }

  return NextResponse.json({ checkoutUrl: response.checkout_url });
}
