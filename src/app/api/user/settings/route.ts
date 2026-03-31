import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { stackServerApp } from "@/stack";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { ensureUserRecord } from "@/lib/db/user-sync";

export async function GET() {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const syncedUser = await ensureUserRecord({ id: user.id, primaryEmail: user.primaryEmail });
  return NextResponse.json(syncedUser);
}

export async function PUT(request: Request) {
  const user = await stackServerApp.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { email?: string };
  const nextEmail = body.email?.trim();
  if (!nextEmail) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const [updatedUser] = await db
    .update(users)
    .set({ email: nextEmail, updatedAt: new Date() })
    .where(eq(users.id, user.id))
    .returning();

  if (!updatedUser) {
    const synced = await ensureUserRecord({ id: user.id, primaryEmail: nextEmail });
    return NextResponse.json(synced);
  }

  return NextResponse.json(updatedUser);
}
