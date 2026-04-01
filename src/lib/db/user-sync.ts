import { db } from "@/lib/db";
import { ensureDbSchema } from "@/lib/db/bootstrap";
import { users } from "@/lib/db/schema";

const PRO_OVERRIDE_EMAILS = new Set(["shaswatraj3@gmail.com"]);

interface SyncUserInput {
  id: string;
  primaryEmail?: string | null;
}

export async function ensureUserRecord(input: SyncUserInput) {
  await ensureDbSchema();

  const safeEmail = input.primaryEmail ?? `${input.id}@indexfast.local`;
  const forcePro = PRO_OVERRIDE_EMAILS.has(safeEmail.toLowerCase());

  const [user] = await db
    .insert(users)
    .values({
      id: input.id,
      email: safeEmail,
      isPro: forcePro || undefined,
      subscriptionStatus: forcePro ? "active" : undefined,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: safeEmail,
        ...(forcePro ? { isPro: true, subscriptionStatus: "active" } : {}),
        updatedAt: new Date(),
      },
    })
    .returning();

  return user;
}
