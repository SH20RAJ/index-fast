import { db } from "@/lib/db";
import { ensureDbSchema } from "@/lib/db/bootstrap";
import { users } from "@/lib/db/schema";

interface SyncUserInput {
  id: string;
  primaryEmail?: string | null;
}

export async function ensureUserRecord(input: SyncUserInput) {
  await ensureDbSchema();

  const safeEmail = input.primaryEmail ?? `${input.id}@indexfast.local`;

  const [user] = await db
    .insert(users)
    .values({
      id: input.id,
      email: safeEmail,
      isPro: false,
      subscriptionStatus: undefined,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: safeEmail,
        isPro: false,
        subscriptionStatus: undefined,
        updatedAt: new Date(),
      },
    })
    .returning();

  return user;
}
